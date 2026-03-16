import { createHash } from "node:crypto";
import { and, eq, isNull } from "drizzle-orm";
import type { Db } from "@paperclipai/db";
import { agentApiKeys, companyMemberships, instanceUserRoles } from "@paperclipai/db";
import type { DeploymentMode } from "@paperclipai/shared";
import type { BetterAuthSessionResult } from "../auth/better-auth.js";
import { logger } from "../middleware/logger.js";
import { subscribeCompanyLiveEvents } from "../services/live-events.js";

// The ultimate-express app exposes app.uwsApp (a uWebSockets.js TemplatedApp).
// We use that directly for WebSocket support since ultimate-express has no app.ws() method.
interface UExpressApp {
  uwsApp: {
    ws<UserData>(pattern: string, behavior: UwsBehavior<UserData>): void;
  };
}

interface UwsBehavior<UserData> {
  sendPingsAutomatically?: boolean;
  idleTimeout?: number;
  upgrade?: (res: UwsResponse, req: UwsRequest, context: unknown) => void | Promise<void>;
  open?: (ws: UwsWebSocket<UserData>) => void;
  close?: (ws: UwsWebSocket<UserData>, code: number, message: ArrayBuffer) => void;
  pong?: (ws: UwsWebSocket<UserData>, message: ArrayBuffer) => void;
}

interface UwsRequest {
  getParameter(index: number): string;
  getHeader(key: string): string;
  getQuery(key: string): string;
  getQuery(): string;
}

interface UwsResponse {
  writeStatus(status: string): UwsResponse;
  writeHeader(key: string, value: string): UwsResponse;
  end(body?: string): UwsResponse;
  upgrade<UserData>(
    userData: UserData,
    secWebSocketKey: string,
    secWebSocketProtocol: string,
    secWebSocketExtensions: string,
    context: unknown,
  ): void;
  onAborted(handler: () => void): UwsResponse;
}

interface UwsWebSocket<UserData> {
  send(message: string, isBinary?: boolean): number;
  ping(message?: string): number;
  end(code?: number, shortMessage?: string): void;
  close(): void;
  getUserData(): UserData;
}

interface UpgradeContext {
  companyId: string;
  actorType: "board" | "agent";
  actorId: string;
  unsubscribe?: () => void;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function parseBearerToken(rawAuth: string) {
  if (!rawAuth) return null;
  if (!rawAuth.toLowerCase().startsWith("bearer ")) return null;
  const token = rawAuth.slice("bearer ".length).trim();
  return token.length > 0 ? token : null;
}

async function authorize(
  db: Db,
  companyId: string,
  authHeader: string,
  queryToken: string,
  opts: {
    deploymentMode: DeploymentMode;
    resolveSessionFromHeaders?: (headers: Headers) => Promise<BetterAuthSessionResult | null>;
  },
): Promise<Omit<UpgradeContext, "unsubscribe"> | null> {
  const token = parseBearerToken(authHeader) ?? (queryToken.length > 0 ? queryToken : null);

  if (!token) {
    if (opts.deploymentMode === "local_trusted") {
      return { companyId, actorType: "board", actorId: "board" };
    }

    if (opts.deploymentMode !== "authenticated" || !opts.resolveSessionFromHeaders) {
      return null;
    }

    const headers = new Headers();
    if (authHeader) headers.set("authorization", authHeader);
    const session = await opts.resolveSessionFromHeaders(headers);
    const userId = session?.user?.id;
    if (!userId) return null;

    const [roleRow, memberships] = await Promise.all([
      db
        .select({ id: instanceUserRoles.id })
        .from(instanceUserRoles)
        .where(and(eq(instanceUserRoles.userId, userId), eq(instanceUserRoles.role, "instance_admin")))
        .then((rows) => rows[0] ?? null),
      db
        .select({ companyId: companyMemberships.companyId })
        .from(companyMemberships)
        .where(
          and(
            eq(companyMemberships.principalType, "user"),
            eq(companyMemberships.principalId, userId),
            eq(companyMemberships.status, "active"),
          ),
        ),
    ]);

    const hasCompanyMembership = memberships.some((row) => row.companyId === companyId);
    if (!roleRow && !hasCompanyMembership) return null;

    return { companyId, actorType: "board", actorId: userId };
  }

  const tokenHash = hashToken(token);
  const key = await db
    .select()
    .from(agentApiKeys)
    .where(and(eq(agentApiKeys.keyHash, tokenHash), isNull(agentApiKeys.revokedAt)))
    .then((rows) => rows[0] ?? null);

  if (!key || key.companyId !== companyId) return null;

  await db
    .update(agentApiKeys)
    .set({ lastUsedAt: new Date() })
    .where(eq(agentApiKeys.id, key.id));

  return { companyId, actorType: "agent", actorId: key.agentId };
}

export function setupLiveEventsWebSocketServer(
  app: UExpressApp,
  db: Db,
  opts: {
    deploymentMode: DeploymentMode;
    resolveSessionFromHeaders?: (headers: Headers) => Promise<BetterAuthSessionResult | null>;
  },
): () => void {
  // uWebSockets.js pattern — :companyId is a named parameter (getParameter(0))
  app.uwsApp.ws<UpgradeContext>("/api/companies/:companyId/events/ws", {
    // uWS handles pings/pongs automatically; no need for a manual interval
    sendPingsAutomatically: true,
    idleTimeout: 120,

    upgrade: async (res, req, context) => {
      // Cache values from req immediately — it is stack-allocated and invalid after first await
      const companyIdRaw = req.getParameter(0) ?? "";
      const authHeader = req.getHeader("authorization");
      const queryToken = req.getQuery("token") ?? "";
      const secWebSocketKey = req.getHeader("sec-websocket-key");
      const secWebSocketProtocol = req.getHeader("sec-websocket-protocol");
      const secWebSocketExtensions = req.getHeader("sec-websocket-extensions");

      let aborted = false;
      res.onAborted(() => { aborted = true; });

      let companyId: string;
      try {
        companyId = decodeURIComponent(companyIdRaw);
      } catch {
        res.writeStatus("400 Bad Request").end("invalid company id");
        return;
      }

      try {
        const ctx = await authorize(db, companyId, authHeader, queryToken, opts);
        if (aborted) return;

        if (!ctx) {
          res.writeStatus("403 Forbidden").end("forbidden");
          return;
        }

        res.upgrade<UpgradeContext>(
          { ...ctx },
          secWebSocketKey,
          secWebSocketProtocol,
          secWebSocketExtensions,
          context,
        );
      } catch (err) {
        logger.error({ err, companyId }, "failed websocket upgrade authorization");
        if (!aborted) {
          res.writeStatus("500 Internal Server Error").end("upgrade failed");
        }
      }
    },

    open: (ws) => {
      const userData = ws.getUserData();
      const unsubscribe = subscribeCompanyLiveEvents(userData.companyId, (event) => {
        ws.send(JSON.stringify(event));
      });
      userData.unsubscribe = unsubscribe;
    },

    close: (ws, code, _message) => {
      const userData = ws.getUserData();
      if (userData.unsubscribe) {
        userData.unsubscribe();
        userData.unsubscribe = undefined;
      }
      if (code !== 1000 && code !== 1001) {
        logger.warn({ code, companyId: userData.companyId }, "live websocket closed with non-normal code");
      }
    },
  });

  // Nothing to clean up — uWS manages its own ping/pong via sendPingsAutomatically
  return () => {};
}

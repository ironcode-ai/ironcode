# BA, Frontend Engineer, Backend Engineer Role Templates Design

**Goal:** Add three new agent roles — Business Analyst (`ba`), Frontend Engineer (`frontend_engineer`), Backend Engineer (`backend_engineer`) — each with a default adapter config template and recommended skills list, using the role template architecture established in the Security Engineer spec.

**Date:** 2026-03-17

**Prerequisite:** The role template architecture (`RoleTemplate`, `ROLE_TEMPLATES`, `RoleAdapterDefaults`) is defined in the Security Engineer spec (`2026-03-17-security-engineer-role-template-design.md`). This spec only adds entries to `ROLE_TEMPLATES` and new role constants — it does not change the architecture.

---

## Role Constants

### Add to `AGENT_ROLES` in `packages/shared/src/constants.ts`

```typescript
"ba",                 // Business Analyst — short like "pm", "qa"
"frontend_engineer",
"backend_engineer",
```

### Add to `AGENT_ROLE_LABELS`

```typescript
ba: "Business Analyst",
frontend_engineer: "Frontend Engineer",
backend_engineer: "Backend Engineer",
```

> **Constraint:** `AGENT_ROLE_LABELS` is typed as `Record<AgentRole, string>`. Adding new values to `AGENT_ROLES` without adding matching entries to `AGENT_ROLE_LABELS` in the same commit will cause a TypeScript compile error. All three changes (roles array + labels + `role-templates.ts`) must land together.

> **Server note:** No new routes or DB migrations are needed, but the server must be rebuilt and restarted after this change. The `createAgentSchema` uses `z.enum(AGENT_ROLES)` — until the server picks up the updated shared package, API calls creating agents with the new role values will be rejected with a Zod validation error.

---

## Role Templates

Add these three entries to `ROLE_TEMPLATES` in `packages/shared/src/role-templates.ts`. Apply in the same commit as the constants changes.

---

### 1. Business Analyst (`ba`)

```typescript
ba: {
  label: "Business Analyst",
  icon: "lightbulb",
  description: "Gathers requirements, writes user stories and specs, performs gap analysis, and bridges stakeholders and engineering.",
  adapters: {
    claude_local: {
      model: "claude-sonnet-4-6",     // analysis and writing, not heavy code execution
      thinkingEffort: "medium",
      maxTurnsPerRun: 60,
      dangerouslySkipPermissions: false,  // BA reads/writes docs, does not execute code
      promptTemplate: `You are a Business Analyst at {{ agent.name }}.

Your responsibilities:
- Gather and clarify requirements from issue descriptions, comments, and linked materials
- Write structured user stories: "As a <role>, I want <goal>, so that <reason>"
- Produce acceptance criteria in Given/When/Then format
- Identify gaps between what has been requested and what has been specified
- Create gap analysis tables: what is known, what is missing, what assumptions are being made
- Decompose large requirements into discrete, testable tasks and assign them to the right agents
- Flag ambiguous or conflicting requirements before work begins

When receiving a new issue:
1. Read the full issue + all comments
2. Identify: stakeholders, user goals, constraints, out-of-scope items
3. Write acceptance criteria if missing
4. List any open questions as a comment — do not assume
5. Create sub-issues for each discrete workstream if the issue is large
6. Assign sub-issues to the appropriate role (Frontend Engineer, Backend Engineer, QA, etc.)

Communicate in plain language. Avoid jargon. Be concise and specific.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "medium",
      maxTurnsPerRun: 50,
      dangerouslySkipPermissions: false,
      promptTemplate: `You are a Business Analyst. Gather requirements, write user stories with
acceptance criteria, identify gaps, and decompose large requests into
discrete tasks assigned to the appropriate engineering roles.`,
    },
  },
  recommendedSkills: [
    // ── Locally installed ──────────────────────────────────────
    {
      id: "superpowers:brainstorming",
      name: "Brainstorming",
      source: "local",
      description: "Requirements gathering via structured dialogue — explores intent, constraints, success criteria",
    },
    {
      id: "superpowers:writing-plans",
      name: "Writing Plans",
      source: "local",
      description: "Converts requirements into decomposed, bite-sized task plans with file boundaries",
    },
    {
      id: "superpowers:dispatching-parallel-agents",
      name: "Dispatching Parallel Agents",
      source: "local",
      description: "Coordinates multi-team workstreams — BA assigns tasks to FE, BE, QA in parallel",
    },
    {
      id: "paperclip:paperclip",
      name: "Paperclip API",
      source: "local",
      description: "Creates issues, requests approvals, and delegates to other agents via the Paperclip API",
    },
    // ── Custom skills to create ────────────────────────────────
    {
      id: "paperclip:requirements-analysis",
      name: "Requirements Analysis",
      source: "custom",
      description: "Gap analysis template: known vs missing vs assumed, with stakeholder impact matrix",
    },
    {
      id: "paperclip:user-story-generator",
      name: "User Story Generator",
      source: "custom",
      description: "Converts issue descriptions into structured user stories with Given/When/Then acceptance criteria",
    },
  ],
},
```

---

### 2. Frontend Engineer (`frontend_engineer`)

```typescript
frontend_engineer: {
  label: "Frontend Engineer",
  icon: "code",
  description: "Builds React/TypeScript components, implements design systems, ensures accessibility and performance.",
  adapters: {
    claude_local: {
      model: "claude-sonnet-4-6",
      thinkingEffort: "medium",
      maxTurnsPerRun: 80,
      dangerouslySkipPermissions: true,   // runs build tools, tests, linters
      promptTemplate: `You are a Frontend Engineer at {{ agent.name }}.

Your responsibilities:
- Build React and TypeScript components following the existing design system
- Use Tailwind CSS utility classes — do not write custom CSS unless absolutely necessary
- Ensure all interactive components meet WCAG 2.1 AA accessibility standards
- Write component tests (Vitest + React Testing Library) for every new component
- Optimise rendering: use React.memo, useMemo, useCallback only when profiled
- Keep bundle size in mind — avoid heavy dependencies for simple utilities
- Follow the file structure and naming conventions already in the codebase

When implementing a component:
1. Read the existing design system / component library first
2. Check if a similar component already exists — extend rather than duplicate
3. Write the failing test first (TDD)
4. Implement the minimal component to pass the test
5. Check accessibility: keyboard navigation, ARIA roles, colour contrast
6. Run the build — fix any TypeScript errors before marking done

Never inline styles. Never use !important. Never suppress TypeScript errors with @ts-ignore without a comment explaining why.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "medium",
      maxTurnsPerRun: 80,
      dangerouslySkipPermissions: true,
      promptTemplate: `You are a Frontend Engineer. Build React/TypeScript components with Tailwind CSS.
Write tests first, ensure accessibility (WCAG 2.1 AA), and follow the
existing design system. Never duplicate existing components.`,
    },
  },
  recommendedSkills: [
    // ── Locally installed ──────────────────────────────────────
    {
      id: "superpowers:test-driven-development",
      name: "TDD",
      source: "local",
      description: "Write failing tests before implementing components — React Testing Library + Vitest",
    },
    {
      id: "superpowers:systematic-debugging",
      name: "Systematic Debugging",
      source: "local",
      description: "Root-cause investigation for CSS/layout/hydration bugs",
    },
    {
      id: "superpowers:verification-before-completion",
      name: "Verification Before Completion",
      source: "local",
      description: "Confirms accessibility, responsive design, and build passing before marking done",
    },
    {
      id: "superpowers:requesting-code-review",
      name: "Code Review",
      source: "local",
      description: "Quality gate before merging component work",
    },
    // ── Marketplace ────────────────────────────────────────────
    {
      id: "claude-code-plugins:frontend-design",
      name: "Frontend Design",
      source: "marketplace",
      url: "https://github.com/anthropics/claude-code-plugins/tree/main/frontend-design",
      description: "Production-grade React/TypeScript component design with high visual quality and design system awareness",
    },
    {
      id: "ui-ux-pro-max:ui-ux-pro-max",
      name: "UI/UX Pro Max",
      source: "marketplace",
      url: "https://github.com/joyichukwu/ui-ux-pro-max",
      description: "50 design styles, 21 palettes, component design intelligence for React/Next.js",
    },
    // ── Custom skills to create ────────────────────────────────
    {
      id: "paperclip:accessibility-audit",
      name: "Accessibility Audit",
      source: "custom",
      description: "WCAG 2.1 AA checklist: keyboard nav, ARIA roles, colour contrast, screen reader testing",
    },
    {
      id: "paperclip:performance-profiling",
      name: "Performance Profiling",
      source: "custom",
      description: "React rendering analysis: memoisation opportunities, bundle size, code-splitting recommendations",
    },
  ],
},
```

---

### 3. Backend Engineer (`backend_engineer`)

```typescript
backend_engineer: {
  label: "Backend Engineer",
  icon: "terminal",
  description: "Builds REST APIs, designs database schemas, implements authentication, and ensures system reliability.",
  adapters: {
    claude_local: {
      model: "claude-sonnet-4-6",
      thinkingEffort: "high",          // schema design and auth require careful reasoning
      maxTurnsPerRun: 100,
      dangerouslySkipPermissions: true, // runs migrations, tests, database tools
      promptTemplate: `You are a Backend Engineer at {{ agent.name }}.

Your responsibilities:
- Design and implement REST API endpoints following existing conventions
- Write and run database migrations safely (always test rollback before applying)
- Implement authentication and authorisation correctly — follow existing auth patterns
- Write integration tests for every new endpoint (hit the real database, not mocks)
- Validate all inputs at the system boundary — never trust client-provided data
- Handle errors explicitly — no silent failures, no swallowed exceptions
- Keep endpoints focused: one concern per route handler

When implementing a new feature:
1. Read the existing route/service/db structure before writing anything
2. Design the database schema change first — write the migration
3. Write the failing integration test
4. Implement the route handler and service layer
5. Run the full test suite — fix any regressions before marking done
6. Document any new environment variables or config changes in comments

Never hardcode credentials. Never log sensitive data. Never write raw SQL outside of the ORM unless absolutely necessary — and if you must, use parameterised queries.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "high",
      maxTurnsPerRun: 100,
      dangerouslySkipPermissions: true,
      promptTemplate: `You are a Backend Engineer. Build REST APIs with proper input validation,
write integration tests (real database, no mocks), design schema migrations
with rollback plans, and follow the existing authentication patterns.
Never log sensitive data or hardcode credentials.`,
    },
  },
  recommendedSkills: [
    // ── Locally installed ──────────────────────────────────────
    {
      id: "superpowers:test-driven-development",
      name: "TDD",
      source: "local",
      description: "Integration-first testing: write failing route/service tests before implementing",
    },
    {
      id: "superpowers:systematic-debugging",
      name: "Systematic Debugging",
      source: "local",
      description: "Root-cause investigation for API failures, query performance, auth bugs",
    },
    {
      id: "superpowers:requesting-code-review",
      name: "Code Review",
      source: "local",
      description: "Quality gate before merging API, migration, or auth work",
    },
    {
      id: "superpowers:verification-before-completion",
      name: "Verification Before Completion",
      source: "local",
      description: "Confirms all tests pass, migrations run, and no regressions before marking done",
    },
    {
      id: "superpowers:subagent-driven-development",
      name: "Subagent-Driven Development",
      source: "local",
      description: "Parallel endpoint implementation with quality gates per feature slice",
    },
    {
      id: "paperclip:paperclip",
      name: "Paperclip API",
      source: "local",
      description: "Cross-team coordination — request FE review, flag blockers, update issue status",
    },
    // ── Custom skills to create ────────────────────────────────
    {
      id: "paperclip:api-contract-design",
      name: "API Contract Design",
      source: "custom",
      description: "REST API spec template: endpoint signatures, request/response shapes, versioning, deprecation strategy",
    },
    {
      id: "paperclip:database-migration-safety",
      name: "Database Migration Safety",
      source: "custom",
      description: "Migration planning checklist: zero-downtime strategies, rollback plan, compatibility matrix",
    },
    {
      id: "paperclip:authentication-patterns",
      name: "Authentication Patterns",
      source: "custom",
      description: "JWT/session/OAuth patterns with security checklist and common vulnerability prevention",
    },
  ],
},
```

---

## Custom Skills to Create (7 total)

All custom skills live under `skills/paperclip/` in the repo root — matching the existing convention where `skills/paperclip/SKILL.md` is the main Paperclip API skill. Each new skill is a subdirectory under `skills/paperclip/`. The `paperclip:` prefix in skill IDs reflects this namespace.

| Skill ID | Role | Path |
|---|---|---|
| `paperclip:requirements-analysis` | BA | `skills/paperclip/requirements-analysis/SKILL.md` |
| `paperclip:user-story-generator` | BA | `skills/paperclip/user-story-generator/SKILL.md` |
| `paperclip:accessibility-audit` | Frontend | `skills/paperclip/accessibility-audit/SKILL.md` |
| `paperclip:performance-profiling` | Frontend | `skills/paperclip/performance-profiling/SKILL.md` |
| `paperclip:api-contract-design` | Backend | `skills/paperclip/api-contract-design/SKILL.md` |
| `paperclip:database-migration-safety` | Backend | `skills/paperclip/database-migration-safety/SKILL.md` |
| `paperclip:authentication-patterns` | Backend | `skills/paperclip/authentication-patterns/SKILL.md` |

---

### `skills/paperclip/requirements-analysis/SKILL.md`

```markdown
---
name: requirements-analysis
description: >
  Use this skill when asked to analyse, clarify, or validate requirements for
  a feature, project, or issue. Produces a gap analysis table identifying what
  is known, what is missing, and what assumptions are being made, along with
  a stakeholder impact summary.
---

## Requirements Analysis Template

### 1. Requirement Summary
State in one sentence what is being requested.

### 2. Stakeholders
| Stakeholder | Role | Impact |
|---|---|---|
| | | |

### 3. Gap Analysis
| Category | Known | Missing | Assumed |
|---|---|---|---|
| User goal | | | |
| Constraints | | | |
| Success criteria | | | |
| Out of scope | | | |
| Dependencies | | | |

### 4. Open Questions
List every unanswered question. Post as a comment on the issue — do not proceed until answered.

### 5. Recommended Next Steps
- Sub-issues to create
- Roles to assign
- Approvals needed before work begins
```

---

### `skills/paperclip/user-story-generator/SKILL.md`

```markdown
---
name: user-story-generator
description: >
  Use this skill when converting a requirement, feature request, or issue
  description into structured user stories with acceptance criteria. Produces
  one user story per distinct user goal, each with Given/When/Then criteria.
---

## User Story Format

For each distinct user goal identified in the issue, write:

**Story:** As a `<role>`, I want `<goal>`, so that `<reason>`.

**Acceptance Criteria:**
- Given `<precondition>`, when `<action>`, then `<expected outcome>`
- Given `<precondition>`, when `<action>`, then `<expected outcome>`

**Out of scope:** List what this story explicitly does NOT cover.

**Dependencies:** Other stories or issues that must complete first.

---

Rules:
- One story per user goal — do not bundle multiple goals into one story
- Acceptance criteria must be testable — avoid "should feel fast" or "should be intuitive"
- If a story is too large to implement in a single PR, split it
- Post all generated stories as a comment on the parent issue
```

---

### `skills/paperclip/accessibility-audit/SKILL.md`

```markdown
---
name: accessibility-audit
description: >
  Use this skill when reviewing a UI component or page for accessibility
  compliance. Checks against WCAG 2.1 AA criteria and produces a findings
  table with severity and remediation steps.
---

## Accessibility Audit Checklist (WCAG 2.1 AA)

| Category | Check | Pass/Fail | Remediation |
|---|---|---|---|
| Keyboard navigation | All interactive elements reachable via Tab | | |
| Keyboard navigation | Focus order is logical | | |
| Keyboard navigation | Focus indicator is visible | | |
| ARIA | Interactive elements have accessible names | | |
| ARIA | Roles are used correctly (no role="button" on non-buttons) | | |
| ARIA | aria-live regions used for dynamic content | | |
| Colour contrast | Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large) | | |
| Images | All img elements have alt text | | |
| Forms | All inputs have associated labels | | |
| Forms | Error messages are associated with their fields | | |
| Motion | Animations respect prefers-reduced-motion | | |
| Screen reader | Content order makes sense without CSS | | |

Output: table above filled in + list of failures with code line references and fixes.
```

---

### `skills/paperclip/performance-profiling/SKILL.md`

```markdown
---
name: performance-profiling
description: >
  Use this skill when a component or page has performance concerns, or as a
  final check before marking a frontend task done. Identifies unnecessary
  re-renders, heavy dependencies, and bundle size issues.
---

## Frontend Performance Checklist

### Re-render Analysis
- Identify components re-rendering on every parent render
- Check if React.memo is warranted (only after profiling confirms unnecessary renders)
- Check useMemo / useCallback usage — ensure dependencies arrays are correct

### Bundle Size
- Identify any new dependencies added — check their size on bundlephobia.com
- Check for large imports that could be code-split (`dynamic()` in Next.js, `React.lazy()`)
- Ensure no full lodash/moment imports — use specific submodule imports

### Network / Data Fetching
- Confirm data is not re-fetched unnecessarily (React Query stale time configured)
- Check for waterfall requests — can parallel fetches be used?

### Output
- List of findings with severity (High / Medium / Low)
- Specific code references for each finding
- Recommended fix for each item
```

---

### `skills/paperclip/api-contract-design/SKILL.md`

```markdown
---
name: api-contract-design
description: >
  Use this skill when designing a new API endpoint or a set of related
  endpoints. Produces an API contract spec with request/response shapes,
  error codes, versioning notes, and a checklist before implementation begins.
---

## API Contract Template

### Endpoint Summary
| Method | Path | Description |
|---|---|---|
| | | |

### Request
```
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "field": "type — description"
}
```

### Response (Success)
```
Status: 2xx
{
  "field": "type — description"
}
```

### Error Responses
| Status | Code | When |
|---|---|---|
| 400 | validation_error | Invalid input |
| 401 | unauthorized | Missing/invalid token |
| 403 | forbidden | Insufficient permissions |
| 404 | not_found | Resource does not exist |

### Pre-implementation Checklist
- [ ] Input validation schema defined (Zod or equivalent)
- [ ] Auth requirements specified (which roles can call this)
- [ ] Database impact assessed (new table? new index? migration needed?)
- [ ] Frontend contract agreed (FE engineer has reviewed shapes)
- [ ] Backwards-compatible (or versioning strategy documented)
```

---

### `skills/paperclip/database-migration-safety/SKILL.md`

```markdown
---
name: database-migration-safety
description: >
  Use this skill when planning or reviewing a database schema migration.
  Produces a safety checklist and zero-downtime migration plan before
  any migration is written or applied.
---

## Database Migration Safety Checklist

### Change Classification
| Change Type | Zero-Downtime Safe? | Notes |
|---|---|---|
| Add nullable column | ✅ Yes | |
| Add non-nullable column without default | ❌ No | Add with default or as nullable first |
| Rename column | ❌ No | Add new, backfill, drop old in separate deploys |
| Drop column | ❌ No | Ensure no code references it first |
| Add index | ✅ Yes (CONCURRENTLY) | Use CREATE INDEX CONCURRENTLY in Postgres |
| Change column type | ❌ Usually no | Evaluate case by case |

### Migration Plan
1. **Pre-migration state:** describe current schema
2. **Change:** describe what is changing and why
3. **Migration steps:** numbered, each step safe to apply independently
4. **Rollback plan:** exact steps to undo if migration fails
5. **Compatibility window:** how long old code must work with new schema

### Before Applying
- [ ] Migration tested on a copy of production data
- [ ] Rollback script written and tested
- [ ] No application code deployed that depends on the new schema until migration is confirmed
- [ ] Backup taken immediately before applying
```

---

### `skills/paperclip/authentication-patterns/SKILL.md`

```markdown
---
name: authentication-patterns
description: >
  Use this skill when implementing or reviewing authentication or
  authorisation logic. Provides pattern guidance for JWT, session, and
  API key auth, plus a security checklist for common vulnerabilities.
---

## Authentication Pattern Guide

### Pattern Selection
| Use Case | Recommended Pattern |
|---|---|
| Web app with logged-in users | Session cookie (httpOnly, sameSite=strict) |
| API consumed by third parties | API key (hashed in DB, never stored in plain text) |
| Machine-to-machine | Short-lived JWT (signed with asymmetric key, 15min expiry) |
| OAuth/SSO | OIDC — delegate to provider, never store passwords |

### JWT Checklist
- [ ] Signed with RS256 or ES256 (not HS256 for distributed systems)
- [ ] Expiry set (exp claim) — max 15 minutes for access tokens
- [ ] Refresh token stored httpOnly, rotated on each use
- [ ] Token not stored in localStorage (XSS risk)
- [ ] Revocation strategy defined (blocklist or short expiry)

### Session Checklist
- [ ] Cookie flags: httpOnly=true, secure=true, sameSite=strict
- [ ] Session ID regenerated on privilege escalation (login, sudo)
- [ ] Sessions invalidated on logout (server-side)
- [ ] Session fixation prevented

### Common Vulnerabilities to Check
| Vulnerability | Check |
|---|---|
| Broken object-level auth (BOLA/IDOR) | Every resource lookup scoped to authenticated user's company/context |
| Mass assignment | Explicit allowlist of settable fields — never spread req.body |
| Privilege escalation | Role checks on every sensitive endpoint |
| Token leakage | Tokens never in URLs, logs, or error messages |
```

---

## Complete File Change Summary

| # | File | Change |
|---|---|---|
| 1 | `packages/shared/src/constants.ts` | Add `"ba"`, `"frontend_engineer"`, `"backend_engineer"` to `AGENT_ROLES` and labels |
| 2 | `packages/shared/src/role-templates.ts` | Add `ba`, `frontend_engineer`, `backend_engineer` entries to `ROLE_TEMPLATES` (same commit as #1) |
| 3 | `skills/paperclip/requirements-analysis/SKILL.md` | New custom skill |
| 4 | `skills/paperclip/user-story-generator/SKILL.md` | New custom skill |
| 5 | `skills/paperclip/accessibility-audit/SKILL.md` | New custom skill |
| 6 | `skills/paperclip/performance-profiling/SKILL.md` | New custom skill |
| 7 | `skills/paperclip/api-contract-design/SKILL.md` | New custom skill |
| 8 | `skills/paperclip/database-migration-safety/SKILL.md` | New custom skill |
| 9 | `skills/paperclip/authentication-patterns/SKILL.md` | New custom skill |

No server changes. No DB changes. UI changes identical to those specified in the Security Engineer spec (same `NewAgent.tsx` merge logic applies to all roles).

---

## Key Design Decisions

**BA uses `dangerouslySkipPermissions: false`** — BA reads and writes text/issues, never executes code or runs tools. This is the only role in the template system with this set to false.

**Backend Engineer uses `thinkingEffort: "high"`** — Schema design and auth implementation require careful multi-step reasoning. Frontend and BA use `"medium"`.

**Marketplace skills for Frontend (frontend-design, ui-ux-pro-max)** — Both are already installed in the local plugin cache and directly applicable. No new installs required for these.

**BA has no marketplace skills** — The superpowers suite covers all BA workflow needs. Adding marketplace skills would be redundant.

---

## Out of Scope

- Role templates for the remaining 8 missing roles (separate specs)
- Sub-role specialisations (e.g. "React Native Engineer" as distinct from "Frontend Engineer")
- Role-based issue routing (auto-assigning issues to agents by role)
- Enforcing skills at execution time

import { z } from "zod";
import { ISSUE_PRIORITIES, ISSUE_STATUSES } from "../constants.js";

export const issueAssigneeAdapterOverridesSchema = z
  .object({
    adapterConfig: z.record(z.unknown()).optional(),
    useProjectWorkspace: z.boolean().optional(),
  })
  .strict();

export const issueContextSchema = z.object({
  pmBrief: z.object({
    clarifiedTitle: z.string(),
    acceptanceCriteria: z.array(z.string()),
    complexity: z.enum(["trivial", "small", "medium", "large"]),
  }).optional(),
  architectPlan: z.object({
    approach: z.string(),
    filesToModify: z.array(z.string()),
    filesToCreate: z.array(z.string()),
    testPlan: z.string(),
    dependencies: z.array(z.string()).optional(),
    plan: z.string().optional(),
  }).optional(),
  sweResult: z.object({
    branch: z.string(),
    prUrl: z.string(),
    prNumber: z.number().int(),
    filesChanged: z.number().int(),
    testsPassed: z.boolean(),
    costCents: z.number().int(),
  }).optional(),
  reviewVerdict: z.object({
    decision: z.enum(["approved", "changes_requested"]),
    summary: z.string(),
    issues: z.array(z.string()).optional(),
    iteration: z.number().int().min(1),
  }).optional(),
}).nullable().optional();

export const createIssueSchema = z.object({
  projectId: z.string().uuid().optional().nullable(),
  goalId: z.string().uuid().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  status: z.enum(ISSUE_STATUSES).optional().default("backlog"),
  priority: z.enum(ISSUE_PRIORITIES).optional().default("medium"),
  assigneeAgentId: z.string().uuid().optional().nullable(),
  assigneeUserId: z.string().optional().nullable(),
  requestDepth: z.number().int().nonnegative().optional().default(0),
  billingCode: z.string().optional().nullable(),
  assigneeAdapterOverrides: issueAssigneeAdapterOverridesSchema.optional().nullable(),
  labelIds: z.array(z.string().uuid()).optional(),
  context: issueContextSchema,
  prUrl: z.string().url().nullable().optional(),
});

export type CreateIssue = z.infer<typeof createIssueSchema>;

export const createIssueLabelSchema = z.object({
  name: z.string().trim().min(1).max(48),
  color: z.string().regex(/^#(?:[0-9a-fA-F]{6})$/, "Color must be a 6-digit hex value"),
});

export type CreateIssueLabel = z.infer<typeof createIssueLabelSchema>;

export const updateIssueSchema = createIssueSchema.partial().extend({
  comment: z.string().min(1).optional(),
  hiddenAt: z.string().datetime().nullable().optional(),
});

export type UpdateIssue = z.infer<typeof updateIssueSchema>;

export const checkoutIssueSchema = z.object({
  agentId: z.string().uuid(),
  expectedStatuses: z.array(z.enum(ISSUE_STATUSES)).nonempty(),
});

export type CheckoutIssue = z.infer<typeof checkoutIssueSchema>;

export const addIssueCommentSchema = z.object({
  body: z.string().min(1),
  reopen: z.boolean().optional(),
  interrupt: z.boolean().optional(),
});

export type AddIssueComment = z.infer<typeof addIssueCommentSchema>;

export const linkIssueApprovalSchema = z.object({
  approvalId: z.string().uuid(),
});

export type LinkIssueApproval = z.infer<typeof linkIssueApprovalSchema>;

export const createIssueAttachmentMetadataSchema = z.object({
  issueCommentId: z.string().uuid().optional().nullable(),
});

export type CreateIssueAttachmentMetadata = z.infer<typeof createIssueAttachmentMetadataSchema>;

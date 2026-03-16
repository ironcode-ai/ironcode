export interface IssueContextPmBrief {
  clarifiedTitle: string;
  acceptanceCriteria: string[];
  complexity: "trivial" | "small" | "medium" | "large";
}

export interface IssueContextArchitectPlan {
  approach: string;
  filesToModify: string[];
  filesToCreate: string[];
  testPlan: string;
  dependencies?: string[];
  plan?: string;
}

export interface IssueContextSweResult {
  branch: string;
  prUrl: string;
  prNumber: number;
  filesChanged: number;
  testsPassed: boolean;
  /** Per-run snapshot only. Use cost_events rollup for authoritative totals. */
  costCents: number;
}

export interface IssueContextReviewVerdict {
  decision: "approved" | "changes_requested";
  summary: string;
  issues?: string[];
  iteration: number;
}

export interface IssueContext {
  pmBrief?: IssueContextPmBrief;
  architectPlan?: IssueContextArchitectPlan;
  sweResult?: IssueContextSweResult;
  reviewVerdict?: IssueContextReviewVerdict;
}

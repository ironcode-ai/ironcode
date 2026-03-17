# Data Engineer, ML Engineer, SRE, DBA Role Templates Design

**Goal:** Add four new agent roles — Data Engineer (`data_engineer`), ML Engineer (`ml_engineer`), Site Reliability Engineer (`sre`), Database Administrator (`dba`) — each with a default adapter config template and recommended skills, using the role template architecture established in the Security Engineer spec.

**Date:** 2026-03-17

**Prerequisite:** The role template architecture (`RoleTemplate`, `ROLE_TEMPLATES`, `RoleAdapterDefaults`) is defined in the Security Engineer spec (`2026-03-17-security-engineer-role-template-design.md`). This spec only adds entries to `ROLE_TEMPLATES` and new role constants — it does not change the architecture.

---

## Role Constants

### Add to `AGENT_ROLES` in `packages/shared/src/constants.ts`

```typescript
"data_engineer",
"ml_engineer",
"sre",
"dba",
```

### Add to `AGENT_ROLE_LABELS`

```typescript
data_engineer: "Data Engineer",
ml_engineer: "ML Engineer",
sre: "SRE",
dba: "DBA",
```

> **Constraint:** `AGENT_ROLE_LABELS` is typed as `Record<AgentRole, string>`. Adding new values to `AGENT_ROLES` without adding matching entries to `AGENT_ROLE_LABELS` in the same commit will cause a TypeScript compile error. All four changes (roles array + labels + `role-templates.ts`) must land together.

> **Server note:** No new routes or DB migrations are needed, but the server must be rebuilt and restarted after this change. The `createAgentSchema` uses `z.enum(AGENT_ROLES)` — until the server picks up the updated shared package, API calls creating agents with the new role values will be rejected with a Zod validation error.

---

## Role Templates

Add these four entries to `ROLE_TEMPLATES` in `packages/shared/src/role-templates.ts`. Apply in the same commit as the constants changes.

---

### 1. Data Engineer (`data_engineer`)

```typescript
data_engineer: {
  label: "Data Engineer",
  icon: "database",
  description: "Builds and maintains data pipelines, ETL workflows, and warehousing schemas. Ensures data quality, reliability, and availability for analytics and product teams.",
  adapters: {
    claude_local: {
      model: "claude-sonnet-4-6",
      thinkingEffort: "medium",
      maxTurnsPerRun: 80,
      dangerouslySkipPermissions: true,  // runs pipeline scripts, dbt, and data quality checks
      promptTemplate: `You are a Data Engineer at {{ agent.name }}.

Your responsibilities:
- Build and maintain ETL/ELT pipelines (ingest → transform → load)
- Write dbt models: staging, intermediate, and mart layers
- Define and enforce data quality checks (row counts, null rates, freshness)
- Design warehouse schemas (star/snowflake) optimised for analytical queries
- Monitor pipeline health and investigate failures
- Document datasets: descriptions, owners, SLAs, lineage

When building a new pipeline:
1. Clarify source schema and target use case before writing any code
2. Write staging models first — clean and rename raw fields, no business logic
3. Add data quality tests (dbt test or Great Expectations) before publishing to marts
4. Document the model: description, columns, freshness SLA
5. Verify row counts and a sample of values match expectations after each run

Data quality hierarchy: completeness > freshness > accuracy > consistency.
Never suppress a failing data quality check — fix the root cause.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "medium",
      maxTurnsPerRun: 60,
      dangerouslySkipPermissions: true,
      promptTemplate: `You are a Data Engineer. Build ETL pipelines, write dbt models,
and enforce data quality. Staging before marts. Always add data quality tests.
Never suppress a failing check — fix the root cause.`,
    },
  },
  recommendedSkills: [
    {
      id: "superpowers:systematic-debugging",
      name: "Systematic Debugging",
      source: "local",
      description: "Root cause analysis for pipeline failures, data quality regressions, and schema drift",
    },
    {
      id: "superpowers:test-driven-development",
      name: "TDD",
      source: "local",
      description: "Write data quality tests before publishing models to marts",
    },
    {
      id: "paperclip:pipeline-incident",
      name: "Pipeline Incident",
      source: "custom",
      description: "Triage checklist for data pipeline failures: identify broken stage, assess downstream impact, create fix issue",
    },
    {
      id: "paperclip:data-quality-report",
      name: "Data Quality Report",
      source: "custom",
      description: "Runs dbt test / Great Expectations suite, formats results by severity, creates Paperclip issues for failures",
    },
    {
      id: "paperclip:schema-change-review",
      name: "Schema Change Review",
      source: "custom",
      description: "Reviews proposed schema migrations for breaking changes, downstream query impact, and missing backfill steps",
    },
  ],
},
```

---

### 2. ML Engineer (`ml_engineer`)

```typescript
ml_engineer: {
  label: "ML Engineer",
  icon: "cpu",
  description: "Designs and trains machine learning models, manages experiment tracking, builds model serving infrastructure, and monitors model performance in production.",
  adapters: {
    claude_local: {
      model: "claude-opus-4-6",          // ML architecture and trade-off analysis requires high reasoning
      thinkingEffort: "high",
      maxTurnsPerRun: 100,
      dangerouslySkipPermissions: true,  // runs training scripts, evaluation pipelines, and MLflow/W&B
      promptTemplate: `You are an ML Engineer at {{ agent.name }}.

Your responsibilities:
- Design and implement ML models (training, evaluation, deployment)
- Set up and track experiments with MLflow or Weights & Biases
- Build feature engineering pipelines
- Evaluate models rigorously: offline metrics, slice analysis, fairness checks
- Deploy models to production: REST APIs, batch inference, or edge
- Monitor model performance: data drift, prediction drift, latency, error rate
- Write model cards documenting intended use, limitations, and performance

When implementing an ML feature:
1. Define the problem clearly: what is the target variable, success metric, and baseline?
2. Explore the data before writing model code — distribution, class balance, missing values
3. Start with the simplest baseline (linear model / rule-based) before complex architectures
4. Log all experiments: hyperparameters, metrics, dataset versions
5. Evaluate on held-out test set only once — not during hyperparameter tuning
6. Write a model card before deploying to production

Prefer interpretable models when performance is comparable. Document every assumption.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "high",
      maxTurnsPerRun: 80,
      dangerouslySkipPermissions: true,
      promptTemplate: `You are an ML Engineer. Design models, track experiments, and deploy
to production. Start with a simple baseline. Log everything. Evaluate on
held-out test set only once. Write a model card before deploying.`,
    },
  },
  recommendedSkills: [
    {
      id: "superpowers:systematic-debugging",
      name: "Systematic Debugging",
      source: "local",
      description: "Root cause analysis for training instability, data leakage, and production prediction failures",
    },
    {
      id: "superpowers:test-driven-development",
      name: "TDD",
      source: "local",
      description: "Write unit tests for feature transforms and model wrappers before training",
    },
    {
      id: "paperclip:model-card",
      name: "Model Card",
      source: "custom",
      description: "Fills out the model card template (intended use, data, metrics, limitations, fairness) as an issue comment",
    },
    {
      id: "paperclip:experiment-summary",
      name: "Experiment Summary",
      source: "custom",
      description: "Summarises MLflow/W&B experiment runs — best trial, metric comparison, hyperparameter sensitivity — as an issue comment",
    },
    {
      id: "paperclip:model-drift-alert",
      name: "Model Drift Alert",
      source: "custom",
      description: "Analyses prediction distribution vs. training baseline, flags data drift and performance degradation, creates issue if threshold exceeded",
    },
  ],
},
```

---

### 3. Site Reliability Engineer (`sre`)

```typescript
sre: {
  label: "SRE",
  icon: "activity",
  description: "Owns production reliability: monitors SLOs, leads incident response, writes runbooks, and reduces toil through automation.",
  adapters: {
    claude_local: {
      model: "claude-sonnet-4-6",
      thinkingEffort: "high",            // incident diagnosis requires careful causal reasoning
      maxTurnsPerRun: 80,
      dangerouslySkipPermissions: true,  // restarts services, applies config changes, runs diagnostic scripts
      promptTemplate: `You are a Site Reliability Engineer at {{ agent.name }}.

Your responsibilities:
- Monitor SLOs and alert on SLI breaches (error rate, latency, availability)
- Lead incident response: triage, diagnosis, mitigation, post-mortem
- Write and maintain runbooks for recurring failure modes
- Automate toil: repeated manual tasks that can be scripted safely
- Review new services for operability: health checks, structured logs, metrics, graceful shutdown
- Capacity plan: flag services approaching resource limits

During an incident:
1. Establish severity (P1/P2/P3) based on customer impact
2. Post initial update within 5 minutes: what is affected, what is the current state
3. Mitigate first — roll back, scale up, disable feature flag — then investigate root cause
4. Update every 15 minutes until resolved
5. Write a post-mortem within 48 hours: timeline, root cause, contributing factors, action items

Post-mortem principle: blameless. The goal is systemic improvement, not individual fault.
Every P1 and P2 incident requires a post-mortem.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "high",
      maxTurnsPerRun: 60,
      dangerouslySkipPermissions: true,
      promptTemplate: `You are an SRE. Monitor SLOs, lead incident response, and write runbooks.
Mitigate first, then investigate. Post-mortem every P1/P2 within 48 hours.
Blameless. Goal: systemic improvement.`,
    },
  },
  recommendedSkills: [
    {
      id: "superpowers:systematic-debugging",
      name: "Systematic Debugging",
      source: "local",
      description: "Structured incident diagnosis — identify causal chain from symptom to root cause",
    },
    {
      id: "paperclip:incident-response",
      name: "Incident Response",
      source: "custom",
      description: "Runs the incident workflow: severity classification, mitigation steps, 15-min update cadence, resolution comment",
    },
    {
      id: "paperclip:post-mortem",
      name: "Post-Mortem",
      source: "custom",
      description: "Blameless post-mortem template: timeline, root cause, contributing factors, action items — posted as issue comment",
    },
    {
      id: "paperclip:runbook",
      name: "Runbook",
      source: "custom",
      description: "Generates a structured runbook for a recurring failure: symptoms, diagnosis steps, mitigation options, escalation path",
    },
    {
      id: "paperclip:slo-review",
      name: "SLO Review",
      source: "custom",
      description: "Reviews current SLI/SLO definitions for a service, flags breaches, and recommends error budget policy",
    },
  ],
},
```

---

### 4. Database Administrator (`dba`)

```typescript
dba: {
  label: "DBA",
  icon: "server",
  description: "Owns database health: designs schemas, reviews migrations, optimises slow queries, manages indexes, and plans backup and recovery.",
  adapters: {
    claude_local: {
      model: "claude-sonnet-4-6",
      thinkingEffort: "high",            // schema changes are high-risk and require careful analysis
      maxTurnsPerRun: 60,
      dangerouslySkipPermissions: false, // reviews and proposes migrations — does not apply them to production
      promptTemplate: `You are a Database Administrator at {{ agent.name }}.

Your responsibilities:
- Review schema migrations for safety: locking risk, downtime, missing rollback steps
- Optimise slow queries: analyse EXPLAIN plans, recommend indexes, rewrite queries
- Design schemas: normalisation, foreign keys, constraints, appropriate data types
- Manage indexes: identify missing indexes, flag unused or duplicate indexes
- Monitor database health: connection pool usage, replication lag, table bloat
- Write and maintain backup and recovery procedures

When reviewing a migration:
1. Check for locking operations (ALTER TABLE, DROP COLUMN) on large tables — prefer online DDL
2. Verify rollback SQL is included for every destructive change
3. Confirm the migration is idempotent (safe to re-run)
4. Estimate row count and projected migration duration
5. Flag any migration that will take > 30 seconds to warn of potential downtime

When optimising a slow query:
1. Get the full EXPLAIN ANALYZE output
2. Identify the costliest node (sequential scans on large tables, hash joins on unindexed columns)
3. Propose the minimal index that fixes the bottleneck
4. Verify the proposed index does not duplicate an existing one
5. Estimate index build time and write lock duration

Never apply schema changes to production directly. Propose as a reviewed migration.`,
    },
    codex_local: {
      model: "gpt-5.4",
      thinkingEffort: "high",
      maxTurnsPerRun: 50,
      dangerouslySkipPermissions: false,
      promptTemplate: `You are a DBA. Review migrations for locking risk and rollback steps.
Optimise slow queries via EXPLAIN ANALYZE. Propose the minimal index change.
Never apply schema changes to production directly.`,
    },
  },
  recommendedSkills: [
    {
      id: "superpowers:systematic-debugging",
      name: "Systematic Debugging",
      source: "local",
      description: "Root cause analysis for slow queries, deadlocks, and replication failures",
    },
    {
      id: "paperclip:migration-review",
      name: "Migration Review",
      source: "custom",
      description: "Reviews a migration file for locking risk, missing rollback, idempotency, and estimated duration — posts findings table as issue comment",
    },
    {
      id: "paperclip:query-optimisation",
      name: "Query Optimisation",
      source: "custom",
      description: "Analyses EXPLAIN ANALYZE output, identifies bottleneck node, proposes minimal index, estimates build time",
    },
    {
      id: "paperclip:db-health-report",
      name: "DB Health Report",
      source: "custom",
      description: "Reports on connection pool usage, table bloat, index usage, replication lag, and slow query log — posts summary as issue comment",
    },
  ],
},
```

---

## Custom Skills

Thirteen custom skills across the four roles, all at `skills/paperclip/` per convention.

| File | Role |
|---|---|
| `skills/paperclip/pipeline-incident/SKILL.md` | Data Engineer |
| `skills/paperclip/data-quality-report/SKILL.md` | Data Engineer |
| `skills/paperclip/schema-change-review/SKILL.md` | Data Engineer |
| `skills/paperclip/model-card/SKILL.md` | ML Engineer |
| `skills/paperclip/experiment-summary/SKILL.md` | ML Engineer |
| `skills/paperclip/model-drift-alert/SKILL.md` | ML Engineer |
| `skills/paperclip/incident-response/SKILL.md` | SRE |
| `skills/paperclip/post-mortem/SKILL.md` | SRE |
| `skills/paperclip/runbook/SKILL.md` | SRE |
| `skills/paperclip/slo-review/SKILL.md` | SRE |
| `skills/paperclip/migration-review/SKILL.md` | DBA |
| `skills/paperclip/query-optimisation/SKILL.md` | DBA |
| `skills/paperclip/db-health-report/SKILL.md` | DBA |

---

### `skills/paperclip/pipeline-incident/SKILL.md`

```markdown
---
name: pipeline-incident
description: >
  Use this skill when a data pipeline has failed or produced incorrect output.
  Triages the failure, assesses downstream impact, and creates a fix issue.
---

## Pipeline Incident Triage

1. Identify the broken stage:
   - Which DAG / dbt model / job failed?
   - What was the error message and timestamp?
   - Is this a new failure or a recurring one?

2. Assess downstream impact:
   - Which datasets depend on the failed stage?
   - Are any dashboards, reports, or product features consuming stale data?
   - What is the data freshness SLA for affected datasets?

3. Classify severity:
   - P1: Production dashboard / customer-facing data stale > SLA
   - P2: Internal analytics delayed, no customer impact
   - P3: Non-critical dataset, impact < 1 hour

4. Create a fix issue:
   - Title: "Pipeline failure: <dag/model name> — <error summary>"
   - Include: error log snippet, affected downstream datasets, severity, last successful run

5. Post a summary comment on the triggering issue with the above findings.
```

---

### `skills/paperclip/data-quality-report/SKILL.md`

```markdown
---
name: data-quality-report
description: >
  Use this skill when asked to run a data quality audit. Executes dbt test
  or Great Expectations, formats results by severity, and creates Paperclip
  issues for each failing check.
---

## Data Quality Report Workflow

1. Detect test framework:
   - `dbt_project.yml` → run `dbt test --store-failures`
   - `great_expectations/` → run `great_expectations checkpoint run <checkpoint>`

2. Parse results and classify by severity:
   - **Critical:** Null rate > 5% on primary key, row count deviation > 20%, freshness breach
   - **High:** Referential integrity failures, duplicate primary keys
   - **Medium:** Null rate > 1% on required fields, unexpected enum values
   - **Low:** Minor distribution shifts, soft warnings

3. For each Critical or High failure:
   - Create a Paperclip issue: "DQ failure: <check name> on <model>"
   - Include: check description, failure count, sample failing rows, affected downstream models

4. Post summary comment:
   - Total checks run: N
   - Passed: N | Failed: N (Critical: N, High: N, Medium: N, Low: N)
   - Links to created issues
```

---

### `skills/paperclip/schema-change-review/SKILL.md`

```markdown
---
name: schema-change-review
description: >
  Use this skill when reviewing a proposed schema migration or structural
  database change. Checks for breaking downstream impact, locking risk,
  and missing backfill steps.
---

## Schema Change Review Checklist

For the proposed schema change:

| Check | Result | Notes |
|-------|--------|-------|
| Is the change additive only? (no DROP, no NOT NULL without DEFAULT) | | |
| Does it lock tables during migration? | | |
| Is a rollback migration included? | | |
| Does any downstream query break due to renamed/removed columns? | | |
| Is a backfill required for existing rows? | | |
| Is the migration idempotent? | | |
| Estimated row count and migration duration | | |

Steps:
1. Read the migration file
2. Check all downstream dbt models and application queries for the changed table
3. Fill out the checklist above
4. Post the checklist as a comment on the migration issue
5. If any Critical item fails (locking, no rollback, breaking downstream): block the migration and request revision
```

---

### `skills/paperclip/model-card/SKILL.md`

```markdown
---
name: model-card
description: >
  Use this skill when preparing an ML model for deployment. Fills out the
  model card template and posts it as a comment on the deployment issue.
---

## Model Card Template

### Model Details
- **Name:**
- **Version:**
- **Type:** (classification / regression / ranking / generative)
- **Trained on:** (dataset name, version, date range)
- **Training framework:**

### Intended Use
- **Primary use case:**
- **Out-of-scope uses:**

### Performance
| Metric | Value | Dataset |
|--------|-------|---------|
| | | |

### Slice Analysis
Document performance across key subgroups (age, geography, language, etc.):
| Subgroup | Metric | Value | Delta vs. Overall |
|----------|--------|-------|------------------|

### Limitations
- Known failure modes:
- Data gaps:
- Fairness considerations:

### Deployment
- **Serving method:** (REST API / batch / edge)
- **Latency SLA:**
- **Fallback behaviour if model unavailable:**

Steps:
1. Read the training experiment summary and evaluation results
2. Fill out each section above
3. Post the completed model card as a comment on the deployment issue
```

---

### `skills/paperclip/experiment-summary/SKILL.md`

```markdown
---
name: experiment-summary
description: >
  Use this skill when a training experiment has completed. Summarises MLflow
  or W&B runs, identifies the best trial, and posts a comparison as a comment.
---

## Experiment Summary Workflow

1. Connect to the experiment tracker (MLflow or W&B) and pull all runs for the experiment

2. Identify the best run by the primary metric (e.g. validation F1, RMSE)

3. Build the comparison table:

| Run ID | Model | LR | Batch | Val Metric | Train Metric | Duration |
|--------|-------|----|-------|------------|--------------|----------|

4. Highlight:
   - Best run (bold)
   - Runs with significant overfitting (train metric >> val metric)
   - Runs that failed or were killed early

5. Hyperparameter sensitivity:
   - Which hyperparameter had the most impact on the primary metric?
   - What is the recommended range for the next search iteration?

6. Post the summary as a comment on the experiment issue:
   - Best run: Run ID, metrics, hyperparameters
   - Comparison table
   - Recommended next experiment (if best metric did not meet target)
```

---

### `skills/paperclip/model-drift-alert/SKILL.md`

```markdown
---
name: model-drift-alert
description: >
  Use this skill to monitor a deployed model for data drift or performance
  degradation. Creates a Paperclip issue if drift exceeds the defined threshold.
---

## Model Drift Detection Workflow

1. Collect the last N days of production predictions and input features

2. Compare input feature distributions to the training baseline:
   - Numerical features: KS test (threshold: p < 0.05)
   - Categorical features: chi-squared test (threshold: p < 0.05)
   - Flag any feature with significant drift

3. Compare prediction distribution:
   - Is the prediction class balance (classification) or mean (regression) shifting?
   - Compare to a rolling 30-day baseline

4. Compare performance metrics if labels are available (delayed feedback):
   - Is accuracy / RMSE degrading relative to baseline?

5. Severity classification:
   - **Critical:** Primary metric degraded > 10% or > 5 features drifting
   - **High:** Primary metric degraded 5-10% or 3-4 features drifting
   - **Medium:** < 5% degradation or 1-2 features drifting

6. If Critical or High:
   - Create a Paperclip issue: "Model drift alert: <model name>"
   - Include: affected features, metric delta, recommended action (retrain / investigate data source)
```

---

### `skills/paperclip/incident-response/SKILL.md`

```markdown
---
name: incident-response
description: >
  Use this skill when a production incident is declared. Runs the incident
  workflow: severity classification, mitigation, 15-minute update cadence,
  and resolution comment.
---

## Incident Response Workflow

### Step 1 — Declare and Classify (within 5 minutes)
- What is affected? (service, endpoint, feature)
- What is the customer impact? (error rate, latency, data loss)
- Severity: P1 (major outage, data loss) | P2 (degraded, no data loss) | P3 (minor, low impact)
- Post initial update on the incident issue

### Step 2 — Mitigate First
Before investigating root cause, attempt mitigation:
- Roll back the last deployment if incident started after a deploy
- Scale up if the signal is resource exhaustion
- Disable the feature flag if a new feature is implicated
- Restart the affected service if the issue is a crash loop

### Step 3 — 15-Minute Update Cadence
Post an update every 15 minutes until resolved:
- Current status
- What has been tried
- Next action

### Step 4 — Resolve
- Post a resolution comment: what was the fix, when was service restored
- Confirm monitoring is back to normal

### Step 5 — Trigger Post-Mortem
- For P1 and P2: invoke the post-mortem skill
- For P3: add a brief root cause note to the incident issue
```

---

### `skills/paperclip/post-mortem/SKILL.md`

```markdown
---
name: post-mortem
description: >
  Use this skill after a P1 or P2 incident is resolved. Produces a blameless
  post-mortem posted as a comment on the incident issue within 48 hours.
---

## Blameless Post-Mortem Template

### Summary
One paragraph: what happened, what was the customer impact, how long did it last.

### Timeline

| Time (UTC) | Event |
|------------|-------|
| HH:MM | Incident started |
| HH:MM | First alert fired |
| HH:MM | On-call notified |
| HH:MM | Mitigation applied |
| HH:MM | Service restored |

### Root Cause
What was the technical root cause? (not "human error" — what systemic condition allowed this to happen?)

### Contributing Factors
What conditions made this worse or harder to detect?

### What Went Well
- Detection was fast
- Rollback was straightforward
- etc.

### Action Items

| Item | Owner | Issue | Due |
|------|-------|-------|-----|
| Add alerting for X | SRE | #NNN | |
| Add test for Y | Engineering | #NNN | |

Steps:
1. Read the incident timeline from the incident issue comments
2. Fill out each section above
3. Create action item issues and link them in the table
4. Post the completed post-mortem as a comment on the incident issue
```

---

### `skills/paperclip/runbook/SKILL.md`

```markdown
---
name: runbook
description: >
  Use this skill when asked to create a runbook for a recurring failure or
  operational procedure. Produces a structured runbook as an issue comment.
---

## Runbook Template

### Service / Component
Name of the service or component this runbook covers.

### Trigger
What condition or alert triggers this runbook?

### Symptoms
- What does the failure look like in logs?
- What metrics are abnormal?
- What do users experience?

### Diagnosis Steps
1. Check [specific dashboard / log query]
2. Run [specific command]
3. If [condition A]: proceed to Mitigation A
4. If [condition B]: proceed to Mitigation B

### Mitigation Options

**Mitigation A — [name]**
```bash
# exact command
```
Expected outcome: ...

**Mitigation B — [name]**
```bash
# exact command
```
Expected outcome: ...

### Escalation
If neither mitigation resolves the issue within 15 minutes: escalate to [role] via [channel].

### Prevention
What long-term fix prevents this from recurring? (Link to tracking issue if it exists.)

Steps:
1. Review incident history for the failure type
2. Fill out each section above with specific commands and log queries
3. Post the runbook as a comment on the tracking issue
```

---

### `skills/paperclip/slo-review/SKILL.md`

```markdown
---
name: slo-review
description: >
  Use this skill to review the SLI/SLO definitions for a service and assess
  the current error budget status. Posts findings and recommendations as an
  issue comment.
---

## SLO Review Workflow

1. For each SLO defined for the service:
   - What is the SLI? (e.g. request success rate, p99 latency)
   - What is the target? (e.g. 99.9% over 30 days)
   - What is the current value over the last 30 days?
   - What is the remaining error budget?

2. Classify SLO health:
   - **On track:** Error budget > 50% remaining
   - **At risk:** Error budget 10-50% remaining
   - **Burning fast:** Error budget < 10% remaining or already exhausted

3. If any SLO is "Burning fast":
   - Identify the top contributing error sources
   - Recommend policy: freeze non-critical releases, focus on reliability work

4. Review SLI definition quality:
   - Is the SLI measuring what users actually experience?
   - Is the measurement point correct (server-side vs. client-side)?
   - Are synthetic probes complementing real-user measurements?

5. Post summary:
   - Table: SLO | Target | Current | Error Budget Remaining | Status
   - Recommendations for at-risk or exhausted SLOs
```

---

### `skills/paperclip/migration-review/SKILL.md`

```markdown
---
name: migration-review
description: >
  Use this skill when reviewing a database migration file before it is applied.
  Checks for locking risk, missing rollback, idempotency, and estimates
  migration duration.
---

## Migration Review Checklist

Read the migration file and fill out the following:

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| No unguarded DROP TABLE or DROP COLUMN | | |
| No ALTER TABLE ADD COLUMN NOT NULL without DEFAULT on large table | | |
| Rollback migration (down migration) is present | | |
| Migration is idempotent (IF EXISTS / IF NOT EXISTS guards) | | |
| No full-table rewrite on table > 1M rows without online DDL | | |
| Foreign key constraints use DEFERRABLE or are added with NOT VALID + VALIDATE | | |
| Indexes are created CONCURRENTLY | | |
| Estimated row count of affected tables | | |
| Estimated migration duration | | |

### Severity
- **Block (do not apply):** Any locking operation on a large table without online DDL, missing rollback, or data-destructive change without backup verification
- **Warn:** Missing idempotency guards, non-concurrent index creation on medium tables
- **Pass:** All checks pass

Steps:
1. Read the migration file
2. Check the affected table row counts in the database
3. Fill the checklist
4. Post findings as a comment on the migration PR / issue
5. If any Block item fails: comment "Migration blocked — see review" and link findings
```

---

### `skills/paperclip/query-optimisation/SKILL.md`

```markdown
---
name: query-optimisation
description: >
  Use this skill when asked to optimise a slow query. Analyses the EXPLAIN
  ANALYZE output, identifies the bottleneck, and proposes the minimal index
  or query rewrite.
---

## Query Optimisation Workflow

1. Obtain the slow query and its `EXPLAIN ANALYZE` output (PostgreSQL) or equivalent

2. Identify the costliest node:
   - Look for: Seq Scan on large tables, Hash Join with large row estimates, Sort with high cost
   - Note: actual time >> estimated time = stale statistics (run ANALYZE first)

3. Determine the fix category:
   - **Missing index:** Seq Scan on a filtered column → add index
   - **Stale statistics:** Large estimate vs. actual discrepancy → ANALYZE table
   - **Inefficient join:** Large hash join → check join column types match, consider join order
   - **N+1 query:** Pattern of many small queries → rewrite as single JOIN or use batch fetch
   - **Missing covering index:** Index used but heap fetch remaining → add covering index

4. Propose the fix:
   ```sql
   -- Proposed index (estimate build time before applying on large tables)
   CREATE INDEX CONCURRENTLY idx_<table>_<column> ON <table>(<column>);
   ```

5. Check for duplicate indexes:
   - Does an index on these columns already exist?
   - Is the proposed index a prefix of an existing composite index?

6. Post findings as a comment on the issue:
   - Identified bottleneck
   - Proposed fix (SQL)
   - Estimated build time
   - Whether an existing index already covers this case
```

---

### `skills/paperclip/db-health-report/SKILL.md`

```markdown
---
name: db-health-report
description: >
  Use this skill to generate a database health report. Checks connection
  pool usage, table bloat, index usage, replication lag, and slow query log.
  Posts a summary as an issue comment.
---

## Database Health Report Workflow

Run the following checks and compile results:

### Connection Pool
```sql
SELECT count(*), state FROM pg_stat_activity GROUP BY state;
```
- Flag if active connections > 80% of max_connections

### Table Bloat (top 10 bloated tables)
```sql
SELECT schemaname, tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
  pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size
FROM pg_tables ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC LIMIT 10;
```
- Flag tables where dead tuple ratio > 20% (check pg_stat_user_tables.n_dead_tup)

### Index Usage (unused indexes)
```sql
SELECT schemaname, tablename, indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0 AND indexname NOT LIKE '%pkey%'
ORDER BY pg_relation_size(indexrelid) DESC;
```
- Flag indexes with 0 scans that are > 10MB

### Replication Lag (if replica present)
```sql
SELECT client_addr, state, sent_lsn, write_lsn,
  (sent_lsn - write_lsn) AS lag_bytes
FROM pg_stat_replication;
```
- Flag lag > 10MB

### Slow Queries (last 24 hours, from pg_stat_statements)
```sql
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;
```

Post summary with findings table and recommended actions for any flagged item.
```

---

## UI Flow

Same pattern as all previous role template specs.

| Role | Model | Effort | Turns | Skip Perms |
|---|---|---|---|---|
| Data Engineer | claude-sonnet-4-6 | medium | 80 | true |
| ML Engineer | claude-opus-4-6 | high | 100 | true |
| SRE | claude-sonnet-4-6 | high | 80 | true |
| DBA | claude-sonnet-4-6 | high | 60 | false |

---

## What This Enables (Day 1)

**Data Engineer agent:**
- "Build a pipeline for user events from Kafka to the warehouse" → staging model + data quality tests
- "Why is the daily_active_users model showing nulls?" → pipeline incident triage
- "Run a data quality audit on the orders dataset" → data quality report with issue creation

**ML Engineer agent:**
- "Train a churn prediction model" → baseline → experiments → model card → deployment
- "Summarise the hyperparameter search results" → experiment summary comment
- "Is the recommendation model drifting?" → drift analysis with alert creation if needed

**SRE agent:**
- "The API is returning 500s" → incident declared, mitigation attempted, 15-min updates
- "Write a runbook for the payment service timeout" → structured runbook with exact commands
- "Review our checkout service SLOs" → error budget status with recommendations

**DBA agent:**
- "Review this migration before we apply it" → migration review checklist with block/warn/pass
- "This query is slow, optimise it" → EXPLAIN analysis, proposed index, duplicate check
- "How is the database doing this week?" → health report with connection pool, bloat, unused indexes

---

## Out of Scope

- Templates for Tier 3 roles (technical_writer, account_manager) — separate spec
- Automated drift monitoring on a schedule — requires cron integration
- Self-healing SRE automation (auto-rollback) — requires platform integration
- DBA applying migrations to production — agent proposes, human applies

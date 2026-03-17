# Security Engineer Role Template Design

**Goal:** Add a Security Engineer agent role with a default configuration template and recommended skills, so users get a fully pre-filled agent form when they select the role — including model, system prompt, and a curated skill set covering OWASP auditing, dependency scanning, and threat modeling.

**Date:** 2026-03-17

---

## Background

The current system has 11 agent roles (`ceo`, `cto`, `cmo`, `cfo`, `engineer`, `designer`, `pm`, `qa`, `devops`, `researcher`, `general`). All roles share the same universal `adapterConfig` defaults — there is no per-role pre-filling of the new agent form.

Security Engineer is the highest-priority missing role for a software outsourcing company. It requires a distinct model choice (high reasoning), a specialized system prompt (OWASP, SAST, CVE), and a curated set of tools not needed by other roles.

This spec introduces the **role template** concept, using Security Engineer as the first implementation. The feature is additive and non-breaking — roles without a template fall back to the existing universal defaults.

---

## Architecture

### New concept: Role Template

A role template maps a role to:
1. **Default adapter config** — pre-fills the new agent form per adapter type
2. **Recommended skills** — curated list of local, marketplace, and custom skills shown during agent creation

Templates are UI-only defaults. The server accepts any `adapterConfig` — no backend changes needed.

### Template structure

```typescript
// packages/shared/src/role-templates.ts

import type { AgentAdapterType, AgentRole } from "./constants.js";

export interface RoleSkillRecommendation {
  id: string;                                   // skill identifier
  name: string;                                 // display name
  source: "local" | "marketplace" | "custom";  // where it comes from
  url?: string;                                 // marketplace install URL (marketplace only)
  description: string;
}

// Deliberately omits user-specific fields (cwd, instructionsFilePath) and
// adapter-specific flags rarely relevant at role level (chrome, search,
// dangerouslyBypassSandbox). Those remain at universal defaults.
// thinkingEffort is typed as string to match CreateConfigValues exactly.
export interface RoleAdapterDefaults {
  model: string;
  thinkingEffort: string;         // "low" | "medium" | "high" — widened to string to match CreateConfigValues
  promptTemplate: string;
  maxTurnsPerRun: number;
  dangerouslySkipPermissions: boolean;
}

export interface RoleTemplate {
  label: string;
  icon: string;
  description: string;            // shown in the new agent form role picker
  // AgentAdapterType includes: claude_local | codex_local | cursor |
  // opencode_local | pi_local | openclaw_gateway | process | http
  adapters: Partial<Record<AgentAdapterType, RoleAdapterDefaults>>;
  recommendedSkills: RoleSkillRecommendation[];
}

export const ROLE_TEMPLATES: Partial<Record<AgentRole, RoleTemplate>> = {
  security_engineer: {
    label: "Security Engineer",
    icon: "shield",
    description: "Audits code for vulnerabilities, runs SAST/dependency scans, writes security tests, and enforces compliance standards.",
    adapters: {
      claude_local: {
        model: "claude-opus-4-6",
        thinkingEffort: "high",
        maxTurnsPerRun: 120,
        dangerouslySkipPermissions: true,
        promptTemplate: `You are a Security Engineer at {{ agent.name }}.

Your responsibilities:
- Audit code for OWASP Top 10 vulnerabilities (injection, XSS, IDOR, etc.)
- Run and interpret SAST tools (semgrep, bandit, npm audit, cargo audit)
- Review dependencies for known CVEs
- Write security-focused tests (auth, input validation, rate limiting)
- Produce threat models for new features
- Flag secrets, hardcoded credentials, insecure configs
- Enforce compliance requirements (SOC2, GDPR, HIPAA where applicable)

When reviewing code:
1. Start with dependency audit (npm audit / cargo audit / pip-audit)
2. Run SAST scan if tool available
3. Manual review: auth flows, input validation, data exposure, crypto usage
4. Document findings with severity (Critical/High/Medium/Low) and remediation steps

Never expose secrets in logs or comments. Always err on the side of caution.`,
      },
      codex_local: {
        model: "gpt-5.4",
        thinkingEffort: "high",
        maxTurnsPerRun: 100,
        dangerouslySkipPermissions: true,
        promptTemplate: `You are a Security Engineer. Focus on vulnerability detection,
dependency audits, and secure coding practices. Use the same severity
scale (Critical/High/Medium/Low) and document remediation steps for
every finding.`,
      },
    },
    recommendedSkills: [
      {
        id: "superpowers:systematic-debugging",
        name: "Systematic Debugging",
        source: "local",
        description: "Traces root causes — reused here to trace vulnerability chains",
      },
      {
        id: "superpowers:code-review",
        name: "Code Review",
        source: "local",
        description: "Multi-aspect code review including security & dependency checks",
      },
      {
        id: "superpowers:test-driven-development",
        name: "TDD",
        source: "local",
        description: "Writing security regression tests after each finding",
      },
      {
        id: "trail-of-bits:semgrep-rules",
        name: "Trail of Bits Semgrep Rules",
        source: "marketplace",
        url: "https://github.com/trailofbits/semgrep-rules",
        description: "200+ security-focused semgrep rules for common vulnerability patterns",
      },
      {
        id: "anthropic:security-review",
        name: "Claude Code Security Review",
        source: "marketplace",
        url: "https://github.com/anthropics/claude-code-security-review",
        description: "Official Anthropic skill for automated PR security reviews",
      },
      {
        id: "paperclip:owasp-checklist",
        name: "OWASP Checklist",
        source: "custom",
        description: "OWASP Top 10 checklist with severity table and remediation templates",
      },
      {
        id: "paperclip:dependency-audit",
        name: "Dependency Audit",
        source: "custom",
        description: "Runs npm/cargo/pip audit, formats CVE report, creates Paperclip issues for Critical/High findings",
      },
      {
        id: "paperclip:threat-model",
        name: "Threat Model",
        source: "custom",
        description: "STRIDE threat modeling template filled out by agent for new feature issues",
      },
    ],
  },
};
```

### Template variable interpolation

`promptTemplate` supports `{{ agent.name }}` — this is an existing interpolation feature already used throughout the heartbeat adapter prompt system. It is NOT a placeholder for the user to edit manually.

### Fallback rules

| Situation | Behavior |
|---|---|
| Role has no entry in `ROLE_TEMPLATES` | Universal defaults, no skill section shown |
| Role has template, selected adapter has no entry in `adapters` | Universal adapter defaults, still show `recommendedSkills` section |
| Role has template, adapter has entry | Pre-fill with `RoleAdapterDefaults`, show `recommendedSkills` |

---

## File Changes

### 1. `packages/shared/src/constants.ts`

Add to `AGENT_ROLES` array:
```typescript
"security_engineer"
```

Add to `AGENT_ROLE_LABELS`:
```typescript
security_engineer: "Security Engineer",
```

### 2. `packages/shared/src/role-templates.ts` *(new file)*

Full content is the TypeScript block in the Architecture section above — copy verbatim.

> **Dependency:** This file will not typecheck until `"security_engineer"` is present in `AGENT_ROLES` (File Change 1). Apply both changes in the same commit.

### 3. `packages/shared/src/index.ts`

Add export:
```typescript
export * from "./role-templates.js";
```

### 4. `ui/src/pages/NewAgent.tsx`

**Merge semantics:**
- Trigger: `useEffect` on `[role, adapterType]` — fires whenever either changes
- Behaviour: if `ROLE_TEMPLATES[role]?.adapters[adapterType]` exists, call `setConfigValues(prev => ({ ...prev, ...templateDefaults }))` — merges only `RoleAdapterDefaults` fields, leaves all other fields (cwd, heartbeatEnabled, etc.) untouched
- If role changes to a non-templated one, unconditionally reset all five `RoleAdapterDefaults` fields (`model`, `thinkingEffort`, `promptTemplate`, `maxTurnsPerRun`, `dangerouslySkipPermissions`) to their `defaultCreateValues` equivalents — regardless of any user edits made after the template pre-filled them
- Adapter type fields that are NOT in `RoleAdapterDefaults` (chrome, search, cwd, etc.) are never touched by the merge

**Recommended Skills section:**
- Renders below the adapter config section, only when `ROLE_TEMPLATES[role]?.recommendedSkills.length > 0`
- This section lives inline in `NewAgent.tsx` (create-only flow) — NOT in `AgentConfigForm` which is shared with edit mode
- Local skills (`source === "local"`): green badge "Available" — static, no API check needed; assume always available since they ship with the app
- Marketplace skills (`source === "marketplace"`): link button "Install →" opening `url` in new tab
- Custom skills (`source === "custom"`): amber badge "Needs creation" — informational only

### 5. `skills/security-engineer/` *(new directory at repo root)*

Custom skills live at `skills/` in the repo root (matches existing convention, injected via `--add-dir`). Three SKILL.md files:

**`skills/security-engineer/owasp-checklist/SKILL.md`**
```markdown
---
name: owasp-checklist
description: >
  Use this skill when asked to perform a security audit or OWASP review on
  a codebase, module, or pull request. Produces a severity-graded finding
  table (Critical / High / Medium / Low) with remediation steps for each
  OWASP Top 10 category.
---

## OWASP Top 10 Security Audit Checklist

For each category below, inspect the codebase and record: affected file/line,
severity, description, and recommended fix.

| # | Category | Check |
|---|---|---|
| A01 | Broken Access Control | IDOR, missing auth on endpoints, privilege escalation paths |
| A02 | Cryptographic Failures | Hardcoded secrets, weak algos, unencrypted sensitive data |
| A03 | Injection | SQL, NoSQL, command, LDAP, XSS injection points |
| A04 | Insecure Design | Missing rate limits, no abuse case handling |
| A05 | Security Misconfiguration | Open CORS, debug endpoints, default credentials |
| A06 | Vulnerable Components | Outdated/CVE-affected dependencies |
| A07 | Auth Failures | Weak passwords, broken session management, missing MFA |
| A08 | Integrity Failures | Unsigned packages, insecure deserialization |
| A09 | Logging Failures | Sensitive data in logs, no audit trail |
| A10 | SSRF | Unvalidated URL inputs, internal service exposure |

Output format:
1. Executive summary (1 paragraph)
2. Findings table: Severity | Category | File:Line | Description | Remediation
3. Recommended next steps
```

**`skills/security-engineer/dependency-audit/SKILL.md`**
```markdown
---
name: dependency-audit
description: >
  Use this skill when asked to audit dependencies for known CVEs or security
  vulnerabilities. Detects the package manager, runs the appropriate audit
  command, and creates Paperclip issues for every Critical or High finding.
---

## Dependency Audit Workflow

1. Detect package manager:
   - `package.json` → `npm audit --json`
   - `Cargo.toml` → `cargo audit --json`
   - `requirements.txt` / `pyproject.toml` → `pip-audit --format json`

2. Parse output and group findings by severity (Critical → High → Medium → Low)

3. For each Critical or High CVE:
   - Create a Paperclip issue via API: title = "CVE-XXXX-XXXX in <package>@<version>",
     description includes CVE ID, affected version, fixed version, CVSS score
   - Assign issue to self

4. Post a summary comment on the triggering issue:
   - Total counts by severity
   - Links to created issues for Critical/High
   - Recommended upgrade commands

5. If no package manager detected, note it and stop.
```

**`skills/security-engineer/threat-model/SKILL.md`**
```markdown
---
name: threat-model
description: >
  Use this skill when asked to threat model a new feature, system, or
  architectural change. Produces a STRIDE threat model as a comment on
  the feature issue.
---

## STRIDE Threat Modeling Template

For the feature described in the issue, fill out each STRIDE category:

| Threat | Description | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation |
|---|---|---|---|---|
| Spoofing | Can an attacker impersonate a user or system? | | | |
| Tampering | Can data be modified in transit or at rest? | | | |
| Repudiation | Can actions be denied without an audit trail? | | | |
| Info Disclosure | Can sensitive data be exposed unintentionally? | | | |
| Denial of Service | Can the feature be abused to exhaust resources? | | | |
| Elevation of Privilege | Can a user gain higher permissions than intended? | | | |

Steps:
1. Read the full issue description and any linked designs
2. Identify the trust boundaries (who calls what, what data flows where)
3. Fill the STRIDE table for each identified boundary
4. For each High likelihood + High impact cell: recommend a concrete mitigation
5. Post the completed table as a comment on the feature issue
```

---

## UI Flow

1. User clicks "New Agent"
2. Selects role → **"Security Engineer"**
3. Adapter config fields pre-fill (claude_local selected by default):
   - Model: `claude-opus-4-6`
   - Thinking effort: `high`
   - Max turns: `120`
   - Dangerous skip permissions: `true`
   - Prompt template: security engineer prompt
4. "Recommended Skills" section appears below adapter config:
   - ✅ systematic-debugging — Available
   - ✅ code-review — Available
   - ✅ test-driven-development — Available
   - 🔗 trail-of-bits semgrep-rules — Install →
   - 🔗 anthropic security-review — Install →
   - ⚠️ owasp-checklist — Needs creation
   - ⚠️ dependency-audit — Needs creation
   - ⚠️ threat-model — Needs creation
5. User can switch adapter type (e.g. codex_local) → config re-fills with codex defaults, skills section stays the same
6. User saves → agent created with pre-filled config

---

## What This Enables (Day 1)

User creates a Security Engineer agent in 60 seconds. Typical issues:

- "Audit the auth module" → agent runs OWASP checklist, posts findings table
- "Check dependencies for CVEs" → agent runs dependency audit, creates issues for Critical/High
- "Threat model the new payment feature" → agent fills STRIDE table as comment

---

## Out of Scope

- Adding templates for other roles (separate specs per role)
- Dynamic/DB-driven templates (static file is sufficient)
- Skill auto-installation (user installs marketplace skills manually)
- Enforcing role-based skill requirements at execution time
- A/B testing different prompts per role

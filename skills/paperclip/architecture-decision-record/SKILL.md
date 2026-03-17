---
name: architecture-decision-record
description: >
  Use this skill when asked to document an architectural decision, evaluate
  technology options, or create an ADR for a feature or system change.
  Produces a structured ADR posted as a comment on the relevant issue.
---

## Architecture Decision Record (ADR) Template

### Title
ADR-NNN: [short title of the decision]

### Status
Proposed | Accepted | Deprecated | Superseded by ADR-NNN

### Context
What is the problem or need driving this decision? What constraints exist?

### Decision
What was decided? State it in one or two sentences.

### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A | | |
| Option B | | |
| Option C | | |

### Consequences
- **Positive:** What improves?
- **Negative:** What gets harder?
- **Risks:** What could go wrong?

### Open Questions
List any unresolved questions that need follow-up.

Steps:
1. Read the issue + all linked specs and prior ADRs
2. Fill out each section above
3. Post the completed ADR as a comment on the feature issue
4. If accepted: create a follow-up issue to update architecture docs

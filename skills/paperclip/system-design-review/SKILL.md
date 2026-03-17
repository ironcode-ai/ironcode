---
name: system-design-review
description: >
  Use this skill when asked to review or produce a system design for a new
  feature or service. Produces a C4-style summary with a Mermaid context
  diagram and an integration risk table posted as an issue comment.
---

## System Design Review Workflow

1. Read the feature issue + any linked specs or prior ADRs

2. Produce a Mermaid context diagram:

```mermaid
graph TD
  User([User]) --> App[Application]
  App --> API[API Server]
  API --> DB[(Database)]
```

3. Fill out the integration risk table:

| Boundary | Direction | Protocol | Risk | Mitigation |
|----------|-----------|----------|------|------------|

4. List open questions (anything requiring a decision before build starts)

5. Post the diagram + risk table + open questions as a comment on the issue

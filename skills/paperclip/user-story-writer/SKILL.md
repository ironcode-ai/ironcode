---
name: user-story-writer
description: >
  Use this skill when asked to write user stories from a raw requirement or
  feature description. Produces structured user stories with Given/When/Then
  acceptance criteria.
---

## User Story Writing Workflow

For each distinct user goal in the requirement:

1. Write the user story in standard format:
   > As a **[role]**, I want **[goal]**, so that **[reason/value]**.

2. Write acceptance criteria in Given/When/Then format:
   - **Given** [precondition]
   - **When** [action]
   - **Then** [expected outcome]

3. Add edge cases as additional scenarios:
   - **Given** [edge condition]
   - **When** [action]
   - **Then** [expected handling]

4. Add out-of-scope note if applicable:
   > Out of scope: [what this story explicitly does NOT cover]

5. Post the user stories as a comment on the issue, or as the issue body if creating sub-issues.

Guidelines:
- One user story per distinct goal — do not combine multiple goals
- Acceptance criteria should be testable: a QA agent should be able to verify each one
- Avoid implementation details in the story ("using React" — not relevant to the story)

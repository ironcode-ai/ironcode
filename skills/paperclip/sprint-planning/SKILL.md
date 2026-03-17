---
name: sprint-planning
description: >
  Use this skill when starting a new sprint. Assigns unassigned issues,
  checks acceptance criteria, and posts a sprint kick-off summary on the
  milestone tracking issue.
---

## Sprint Planning Workflow

1. Pull all open issues in the current sprint milestone

2. For each unassigned issue:
   - Determine the correct role (BA, Frontend Engineer, Backend Engineer, QA, etc.)
   - Assign to the right agent
   - If no acceptance criteria: post a comment tagging BA to clarify

3. Check for oversized issues (> 3 days estimated):
   - Split into sub-issues and link to parent

4. Identify dependencies:
   - Comment on blocked issues: "Blocked by #NNN"

5. Post sprint kick-off summary on the milestone tracking issue:
   - Total issues: N | Assigned: N | Needs AC: N | Blocked: N

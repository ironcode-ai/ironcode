---
name: requirements-gap-analysis
description: >
  Use this skill when asked to analyse requirements for completeness. Produces
  a three-column table (Known / Missing / Assumptions) and a list of open
  questions to post as a comment on the issue.
---

## Requirements Gap Analysis Workflow

1. Read the full issue description and all existing comments

2. Extract what is known:
   - What the user/stakeholder wants
   - Any constraints mentioned (timeline, tech stack, compliance)
   - Any acceptance criteria already written

3. Identify what is missing:
   - Unstated edge cases
   - Missing acceptance criteria
   - Unclear ownership or scope boundaries
   - Integration points not described

4. Document assumptions:
   - Things that were assumed to be true but not explicitly stated
   - Decisions that were made implicitly

5. Produce the gap analysis table:

| Known | Missing | Assumptions |
|-------|---------|-------------|
| | | |

6. List open questions (numbered, each answerable with a short response):
   1. ...
   2. ...

7. Post the table + open questions as a comment on the issue.
   Do not begin work until the open questions are resolved.

---
name: standup-facilitator
description: >
  Use this skill to run a daily standup. Checks agent activity across all
  open sprint issues and posts a Done / In Progress / Blocked summary on
  the sprint tracking issue.
---

## Daily Standup Workflow

1. Pull all open issues in the current sprint milestone

2. For each issue, check last activity timestamp:
   - Active (last activity < 24h): In Progress
   - No activity 24-48h: Potentially Blocked
   - Closed since last standup: Done

3. Post standup summary on the sprint tracking issue:

**Standup — [date]**

**Done:**
- #NNN Title — @agent

**In Progress:**
- #NNN Title — @agent (last activity: Xh ago)

**Blocked / No Activity:**
- #NNN Title — @agent (no activity Xh) — needs check-in

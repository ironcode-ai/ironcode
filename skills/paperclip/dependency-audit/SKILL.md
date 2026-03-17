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

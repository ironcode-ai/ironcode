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

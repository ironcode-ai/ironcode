---
name: capacity-planning
description: >
  Use this skill when asked to estimate the infrastructure impact of a new
  feature. Produces an RPS estimate, storage growth projection, and monthly
  infra cost delta posted as a comment on the feature issue.
---

## Capacity Planning Worksheet

### Traffic Estimate
- Expected DAU for this feature: ___
- Average requests per user per day: ___
- Peak multiplier (e.g. 3× average): ___
- **Estimated peak RPS:** DAU × req/user / 86400 × peak multiplier

### Storage Estimate
- Data written per user per day: ___ KB
- Retention period: ___ days
- **Estimated storage growth per month:** DAU × data/user × 30

### Cost Delta
- Additional compute (vCPUs / memory): ___
- Additional DB storage: ___
- **Estimated monthly cost increase:** $___

### Scaling Limits
- Will this exceed current DB connection pool? (threshold: 80% of max_connections)
- Does this require a new cache layer?
- Any third-party API rate limits?

Steps:
1. Read the feature issue for usage patterns
2. Fill the worksheet using conservative estimates
3. Flag any estimate that exceeds 50% of a current resource limit
4. Post the completed worksheet as a comment on the issue

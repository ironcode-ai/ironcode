---
name: migration-safety
description: >
  Use this skill when reviewing a database migration before it is applied.
  Checks for rollback SQL, idempotency, locking risk on large tables,
  and missing backfill steps.
---

## Migration Safety Review

Read the migration file and fill out:

| Check | Pass/Fail | Notes |
|-------|-----------|-------|
| Rollback (down) migration is present | | |
| Migration is idempotent (IF EXISTS / IF NOT EXISTS guards) | | |
| No DROP TABLE or DROP COLUMN without backup verification | | |
| No ALTER TABLE ADD COLUMN NOT NULL without DEFAULT on large table | | |
| No full-table rewrite on table > 1M rows without online DDL | | |
| Indexes created CONCURRENTLY | | |
| Backfill script included if existing rows need updating | | |
| Estimated affected row count and migration duration | | |

Severity:
- **Block:** Missing rollback, data-destructive change, locking operation on large table
- **Warn:** Missing idempotency, non-concurrent index on medium table
- **Pass:** All checks pass

Post findings as a comment. If any Block item fails, comment "Migration blocked — needs revision" before the review table.

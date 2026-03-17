---
name: owasp-checklist
description: >
  Use this skill when asked to perform a security audit or OWASP review on
  a codebase, module, or pull request. Produces a severity-graded finding
  table (Critical / High / Medium / Low) with remediation steps for each
  OWASP Top 10 category.
---

## OWASP Top 10 Security Audit Checklist

For each category below, inspect the codebase and record: affected file/line,
severity, description, and recommended fix.

| # | Category | Check |
|---|---|---|
| A01 | Broken Access Control | IDOR, missing auth on endpoints, privilege escalation paths |
| A02 | Cryptographic Failures | Hardcoded secrets, weak algos, unencrypted sensitive data |
| A03 | Injection | SQL, NoSQL, command, LDAP, XSS injection points |
| A04 | Insecure Design | Missing rate limits, no abuse case handling |
| A05 | Security Misconfiguration | Open CORS, debug endpoints, default credentials |
| A06 | Vulnerable Components | Outdated/CVE-affected dependencies |
| A07 | Auth Failures | Weak passwords, broken session management, missing MFA |
| A08 | Integrity Failures | Unsigned packages, insecure deserialization |
| A09 | Logging Failures | Sensitive data in logs, no audit trail |
| A10 | SSRF | Unvalidated URL inputs, internal service exposure |

Output format:
1. Executive summary (1 paragraph)
2. Findings table: Severity | Category | File:Line | Description | Remediation
3. Recommended next steps

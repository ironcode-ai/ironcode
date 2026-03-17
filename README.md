<h1 align="center">Ironcode</h1>

<p align="center">
  <strong>An AI software outsourcing firm you can run yourself.</strong><br/>
  Eight pre-built engineers. Real skills. Ships code while you sleep.
</p>

<p align="center">
  <a href="#quickstart"><img src="https://img.shields.io/badge/quickstart-→-black?style=flat-square" alt="Quickstart" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License" /></a>
  <a href="https://github.com/ironcode-ai/ironcode/stargazers"><img src="https://img.shields.io/github/stars/ironcode-ai/ironcode?style=flat-square&color=yellow" alt="Stars" /></a>
  <a href="https://discord.gg/m4HZY7xNG3"><img src="https://img.shields.io/badge/discord-join-5865F2?style=flat-square" alt="Discord" /></a>
</p>

<br/>

> You open a ticket. Your architect reviews the design. Your backend and frontend engineers build it. Your security engineer audits it. Your scrum master ships it. No Slack. No standups. No hiring.

<br/>

## The problem

Running AI agents for software development is messy.

You end up with 20 Claude Code tabs, no coordination, context lost on every restart, and no idea what anything costs. You're doing the project management yourself — which defeats the point.

**Ironcode is a complete engineering team you deploy once and hand work to.**

It's an open-source, self-hosted platform with eight pre-configured agent roles, each with the right model, tuned prompts, curated skills, and sensible defaults. Clone it, run it, and start assigning work.

<br/>

## The Team

Eight roles ship out of the box. Each has its own model selection, thinking depth, prompt template, and a set of battle-tested skills:

| Role | Model | Thinking | What they do |
|------|-------|----------|-------------|
| **Solution Architect** | Opus 4.6 | High | System design, ADRs, capacity planning, technical direction |
| **Backend Engineer** | Sonnet 4.6 | High | API routes, database migrations, integrations, performance |
| **Frontend Engineer** | Sonnet 4.6 | Medium | React components, UI state, API integration, accessibility |
| **Mobile Engineer** | Sonnet 4.6 | Medium | iOS/Android builds, device testing, release management |
| **Security Engineer** | Opus 4.6 | High | SAST, CVE scanning, threat modeling, compliance |
| **Business Analyst** | Sonnet 4.6 | Medium | Requirements, user stories, gap analysis, stakeholder docs |
| **Designer** | Sonnet 4.6 | Medium | UI/UX, design systems, visual consistency, prototyping |
| **Scrum Master** | Sonnet 4.6 | Low | Sprint planning, standups, retrospectives, velocity tracking |

When you create an agent, Ironcode auto-fills the best model, prompt, and settings for that role — and shows you which skills to install.

<br/>

## Skills Library

Ironcode ships with 15 custom skills purpose-built for software outsourcing workflows. Agents use these autonomously during their work.

**Security Engineering**
| Skill | What it does |
|-------|-------------|
| `owasp-checklist` | OWASP Top 10 checklist with severity classification and remediation templates |
| `dependency-audit` | Runs npm/cargo/pip audit, formats CVE report, creates issues for Critical/High findings |
| `threat-model` | STRIDE threat modeling for new features — fills in context, attack surfaces, and mitigations |

**Business Analysis**
| Skill | What it does |
|-------|-------------|
| `requirements-gap-analysis` | Produces Known / Missing / Assumptions table from any issue |
| `user-story-writer` | Converts raw requirements into structured Given/When/Then acceptance criteria |

**Engineering**
| Skill | What it does |
|-------|-------------|
| `frontend-pr-checklist` | Pre-merge: tests green, a11y audit, responsive check, no unused imports |
| `migration-safety` | Schema change review: rollback plan, zero-downtime analysis, blast radius |

**Architecture**
| Skill | What it does |
|-------|-------------|
| `architecture-decision-record` | ADR template with context, options considered, and consequences |
| `system-design-review` | Structured review of proposed system designs against requirements |
| `capacity-planning` | Load estimates, bottleneck identification, horizontal scaling thresholds |

**Mobile**
| Skill | What it does |
|-------|-------------|
| `mobile-release-checklist` | End-to-end pre-release checklist for iOS and Android |
| `device-testing-matrix` | Coverage grid across device and OS combinations |

**Delivery**
| Skill | What it does |
|-------|-------------|
| `sprint-planning` | Sprint goal, capacity, and commitment facilitation template |
| `standup-facilitator` | Structured async standup: done, doing, blocked |
| `retrospective` | Retro format: what went well, improvements, action items with owners |

<br/>

## How it works

```
You create a task  →  assign it to a role  →  the agent picks it up on its next heartbeat
                                               ↓
                                        runs its skills
                                               ↓
                                        posts results back
                                               ↓
                                        waits for your review
```

- **Heartbeats** — agents wake on a schedule, check their queue, and act
- **Role templates** — one click to get the right model, prompt, and skill recommendations for any role
- **Cost control** — monthly budget per agent; when they hit the cap, they stop
- **Governance** — you approve hires, override strategy, and audit every tool call
- **Persistent sessions** — agents resume context across heartbeats; no re-briefing required

<br/>

## Quickstart

**Requirements:** Node.js 20+, pnpm 9.15+

```bash
git clone https://github.com/ironcode-ai/ironcode.git
cd ironcode
pnpm install
pnpm dev
```

Open `http://localhost:3100`. An embedded PostgreSQL database starts automatically — no setup needed.

1. Create a company
2. Add an agent — pick a role, get recommended settings pre-filled
3. Create a task and assign it
4. The agent picks it up on its next heartbeat

<br/>

## Why open source?

Because the best way to trust an automated engineering team is to see exactly how it works.

Every prompt template, every skill, every default is in this repo. Fork it. Tune the roles for your stack. Add skills for your workflow. Run it on your own infrastructure with your own API keys.

No vendor lock-in. No usage fees. No black box.

<br/>

## Development

```bash
pnpm dev              # API + UI in watch mode
pnpm dev:once         # Single run, no file watching
pnpm dev:server       # Server only
pnpm build            # Build all packages
pnpm typecheck        # Full monorepo type checking
pnpm test:run         # Run test suite
pnpm db:generate      # Generate DB migration
pnpm db:migrate       # Apply migrations
```

See [doc/DEVELOPING.md](doc/DEVELOPING.md) for architecture, package structure, and contribution guide.

<br/>

## Inspired by

[Paperclip](https://github.com/paperclipai/paperclip) — open-source platform for running businesses with AI agents. Ironcode is a domain-specific configuration of that platform, tuned for software outsourcing teams.

Works with: Claude Code · OpenClaw · Codex · Cursor · any HTTP-based agent

<br/>

## Contributing

Issues, PRs, and new skill ideas are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

If you build a skill that's useful for software teams, please share it — the library grows stronger with every real workflow it covers.

<br/>

## Community

- [Discord](https://discord.gg/m4HZY7xNG3) — questions, ideas, show-and-tell
- [GitHub Issues](https://github.com/ironcode-ai/ironcode/issues) — bugs and feature requests
- [GitHub Discussions](https://github.com/ironcode-ai/ironcode/discussions) — RFCs and longer conversations

<br/>

## License

MIT &copy; 2026 Ironcode

---

<p align="center">
  <sub>Open source under MIT. Built for founders who want to ship software without hiring a team.</sub>
</p>

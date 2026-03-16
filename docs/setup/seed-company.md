# Setting Up an Ironcode Company

This guide walks through creating a company with 4 agents in the Ironcode UI.

## Prerequisites

- Ironcode running locally (`pnpm dev`)
- Superpowers plugin installed globally: `~/.claude/plugins/` (already installed)
- Claude Code CLI available: `claude --version`

## Step 1: Create a Company

1. Open http://localhost:3100
2. Click **New Company**
3. Fill in:
   - Name: `Ironcode` (or your company name)
   - Goal: `Deliver production-quality pull requests for client feature requests`
   - Issue prefix: `IC`

## Step 2: Create a Project

1. Go to **Projects** → **New Project**
2. Fill in:
   - Name: your client's repo name
   - URL key: short slug (e.g. `client-app`)
3. Add a workspace:
   - **Repo URL**: `https://github.com/org/repo.git`
   - **CWD**: `<absolute path to local clone>` (for Architect's read-only access)
   - Leave git credentials blank for now (added in Scope 2)

## Step 3: Create the PM Agent

1. Go to **Agents** → **Hire Agent**
2. Fill in:
   - Name: `PM`
   - Title: `Product Manager`
   - Role: `pm`
   - Adapter type: `claude_local`
3. Adapter config:
   ```json
   {
     "model": "claude-haiku-4-5",
     "instructionsFilePath": "<absolute path to ironcode>/agents/pm/AGENTS.md",
     "dangerouslySkipPermissions": true
   }
   ```
4. Runtime config:
   ```json
   {
     "heartbeat": {
       "enabled": true,
       "intervalSec": 300,
       "wakeOnDemand": true
     }
   }
   ```

## Step 4: Create the Architect Agent

1. **Hire Agent**
2. Fill in:
   - Name: `Architect`
   - Title: `Software Architect`
   - Role: `architect`
   - Adapter type: `claude_local`
   - Reports to: PM
3. Adapter config:
   ```json
   {
     "model": "claude-opus-4-6",
     "instructionsFilePath": "<absolute path to ironcode>/agents/architect/AGENTS.md",
     "cwd": "<absolute path to project base clone>",
     "dangerouslySkipPermissions": true
   }
   ```
4. Same runtime config as PM.

## Step 5: Create the SWE Agent

1. **Hire Agent**
2. Fill in:
   - Name: `SWE`
   - Title: `Software Engineer`
   - Role: `engineer`
   - Adapter type: `claude_local`
   - Reports to: Architect
3. Adapter config:
   ```json
   {
     "model": "claude-sonnet-4-5",
     "instructionsFilePath": "<absolute path to ironcode>/agents/swe/AGENTS.md",
     "dangerouslySkipPermissions": true,
     "maxTurnsPerRun": 50
   }
   ```
   Note: `cwd` is NOT set here — it is injected per-issue by the WorkspaceManager (Scope 2).
   For Scope 1 (manual), set `cwd` to a local checkout of the target repo.
4. Same runtime config as PM.

## Step 6: Create the Reviewer Agent

1. **Hire Agent**
2. Fill in:
   - Name: `Reviewer`
   - Title: `Code Reviewer`
   - Role: `reviewer`
   - Adapter type: `claude_local`
   - Reports to: Architect
3. Adapter config:
   ```json
   {
     "model": "claude-sonnet-4-5",
     "instructionsFilePath": "<absolute path to ironcode>/agents/reviewer/AGENTS.md",
     "dangerouslySkipPermissions": true,
     "maxTurnsPerRun": 30
   }
   ```
   Note: `cwd` also injected per-issue in Scope 2. For Scope 1, set to the same repo checkout as SWE.
4. Same runtime config as PM.

## Step 7: Test E2E

1. Create an issue and assign it to the PM agent
2. Set the issue status to `todo`
3. Click **Invoke** on the PM agent (or wait for heartbeat)
4. Watch the agent chain:
   - PM clarifies → assigns to Architect
   - Architect designs → assigns to SWE
   - SWE implements → creates PR → assigns to Reviewer
   - Reviewer reviews → approves or sends back to SWE
5. When Reviewer approves, the issue should be `done` and `prUrl` should be set on the issue

## Verifying the context field

After PM runs, check that context was set:
```bash
# Use the API
curl -s http://localhost:3100/api/issues/<issue-id> \
  -H "Authorization: Bearer <your-board-token>" | jq .context
```

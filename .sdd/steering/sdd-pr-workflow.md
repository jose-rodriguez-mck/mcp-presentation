# SDD Pull Request Workflow

When a user asks to create, open, or submit a Pull Request, **automatically use `/sdd/spec-pr-create`** if SDD context is detected. Do NOT ask for confirmation — just use it. The user can always opt out explicitly.

This command handles both **new PRs** and **existing PRs**: if a PR already exists for the current branch, it updates the body with SDD markers and adds missing labels — no content is lost.

## Default Behavior: Use `/sdd/spec-pr-create`

When the user expresses PR creation intent (any of the phrases below) **and** SDD context is detected, **run `/sdd/spec-pr-create` directly** instead of `gh pr create`:

### PR Intent Phrases

- "create PR" / "make PR" / "open PR" / "submit PR"
- "create pull request" / "open a pull request"
- "push and create PR" / "ready to merge"
- "open a PR for this branch" / "PR for current changes"
- "update the PR" / "add SDD to the PR" / "update PR description"
- Any similar phrasing requesting a Pull Request or PR update

### SDD Context Detection

At least one of these indicators must be present:

- **Spec directory**: `.sdd/specs/` contains at least one feature spec
- **Branch pattern**: Current branch matches `feat/<spec-name>*`, `feature/<spec-name>*`, or `sdd/<spec-name>*`
- **Recent SDD activity**: User recently used `/sdd/spec-impl` or other `/sdd/spec-*` commands in this conversation

### What to Do

1. Detect the feature name (from branch or `.sdd/specs/`)
2. Run `/sdd/spec-pr-create <feature>` — this handles everything: spec links, labels, task progress, and PR template merging
3. No need to manually build PR body or labels — the command does it all

## When NOT to Use `/sdd/spec-pr-create`

Fall back to standard PR creation (`gh pr create`) only when:

- **No SDD context**: No `.sdd/specs/` directory or no specs inside it
- **Explicit opt-out**: User says "regular PR", "normal PR", "simple PR", or "without SDD"
- **Unrelated branch**: Branch is clearly non-spec (e.g., `hotfix/*`, `docs/*`, `chore/*`)
- **User declined**: User was offered the SDD command and explicitly chose not to use it

## Post-Implementation Trigger

After `/sdd/spec-impl` completes successfully (especially when all tasks are done), proactively create the PR using `/sdd/spec-pr-create` if the user asks, or mention it's ready:

```
All tasks for `<feature>` are complete. When you're ready, just say
"open a PR" and I'll create it with full spec links and labels.
```

## Integration with Other Workflows

### After `/sdd/spec-status` Shows Completion

If spec status shows 100% task completion and user asks for a PR, use `/sdd/spec-pr-create` immediately.

### During Manual Git Workflow

If the user is staging/committing spec-related changes and then asks to open a PR, use `/sdd/spec-pr-create` — don't fall back to a generic flow.

## Context Detection Examples

### Use `/sdd/spec-pr-create` (SDD Context Present)

| Scenario | Action |
|----------|--------|
| User says "open a PR" and `.sdd/specs/auth-system/` exists | Run `/sdd/spec-pr-create auth-system` |
| User on branch `feat/ci-testing-task-3` says "create PR" | Run `/sdd/spec-pr-create ci-testing` |
| User just ran `/sdd/spec-impl` and says "now make a PR" | Run `/sdd/spec-pr-create` (auto-detect) |
| User says "push and open PR for current changes" with specs present | Run `/sdd/spec-pr-create` |
| PR already exists, user says "update the PR" or "add spec info" | Run `/sdd/spec-pr-create` (detects and updates existing PR) |
| User created a generic PR earlier, now asks to add SDD markers | Run `/sdd/spec-pr-create` (appends SDD section, adds labels) |

### Use Standard PR (No SDD Context)

| Scenario | Action |
|----------|--------|
| No `.sdd/specs/` directory | Standard `gh pr create` |
| User on `hotfix/urgent-fix` branch, no matching spec | Standard `gh pr create` |
| User says "create a regular PR, no spec stuff" | Standard `gh pr create` |
| User is editing only README.md, no spec context | Standard `gh pr create` |

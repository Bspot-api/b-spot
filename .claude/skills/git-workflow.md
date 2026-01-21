---
description: Git workflow rules for commits, branches, PR, push, merge requests. Use when user mentions PR, pull request, push, commit, merge, branch, or git operations.
globs: "**/*"
alwaysApply: false
---

# Git Workflow

## Commit Convention (Gitmoji)

| Emoji | Usage |
|-------|-------|
| ✨ | Feature | 🐛 | Bug fix | 📝 | Docs | 🎨 | Style |
| ♻️ | Refactor | ⚡️ | Perf | 🔧 | Config | ✅ | Tests |
| 🔒 | Security | 💄 | UI | 🔥 | Remove | 🚧 | WIP |

```bash
git commit -m "$(cat <<'EOF'
emoji Short description (imperative, no period)

Refs: CU-<task-id> (<task-name>)
Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

> Note: Include `Refs:` line only when working on a ClickUp task. See `clickup.md` for details.

## Branch Naming

```
<type>/<short-description>
<type>/CU-<task-id>-<short-description>  # When linked to ClickUp task
```

Types: `feat/`, `fix/`, `docs/`, `refactor/`, `test/`, `chore/`

## Before PR (Mandatory)

1. **Code review** of the current branch:
   ```bash
   git diff origin/main...HEAD
   ```
   Key focus:
   - ⛔ No code duplication (without explicit user justification)
   - ⛔ No hardcoded strings (without explicit user justification)
   
   Fix issues before proceeding.

2. **Quality checks**:
   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```

3. **Ticket verification**:
   - Check if commits contain `Refs: CU-xxx` references
   - **If no ticket referenced**: Ask the user "Are there any ClickUp tickets related to this PR?"
   - **If tickets provided**:
     1. Use `clickup_get_task` to fetch each ticket's description
     2. Compare the ticket description/acceptance criteria with the PR changes
     3. ⚠️ **Warn the user** if the PR content doesn't seem to address the ticket's requirements
     4. Include all tickets in the PR description

⛔ Fix failures before creating PR.

## PR Format

**Title**: `emoji Concise title`

**Body**:
```markdown
## Summary
- Main changes

## Related Tasks
- [CU-xxx](https://app.clickup.com/t/xxx) - Task name

## Test Plan
- [ ] Test case

🤖 Generated with [Claude Code](https://claude.ai/code)
```

> Note: Include `## Related Tasks` section only when PR is linked to ClickUp tasks.

## After PR Creation or Update

After successfully creating or updating the PR:

1. **Collect all referenced tickets**:
   - Check commits for `Refs: CU-xxx` references
   - Check PR body for `## Related Tasks` section (use `gh pr view <branch> --json body`)
   - Extract all `CU-xxx` ticket IDs from both sources

2. **Update each ClickUp ticket**:
   - For each ticket found:
     1. Use `clickup_get_task` to check current status
     2. If status is NOT already `CODE REVIEW`, `QA`, or `DONE`:
        - Use `clickup_update_task` to set status to `CODE REVIEW`
     3. Use `clickup_get_task_comments` to check if PR URL is already present
     4. If PR URL not present, use `clickup_create_task_comment` to add it:
        ```
        🔗 PR: <PR_URL>
        ```

| Current Status | Action | New Status |
|----------------|--------|------------|
| `A FAIRE` | PR created/updated | `CODE REVIEW` |
| `EN COURS` | PR created/updated | `CODE REVIEW` |
| `A CORRIGER` | PR created/updated | `CODE REVIEW` |
| `CODE REVIEW` | PR updated | _(unchanged)_ |
| `QA` | PR updated | _(unchanged)_ |
| `DONE` | PR updated | _(unchanged)_ |

> Note: Tickets already in CODE REVIEW, QA, or DONE are not moved backwards. The PR URL is only added once per ticket.

## Safety Rules

**NEVER**: force push main, skip hooks, commit secrets, amend pushed commits

**ALWAYS**: review `git diff` before commit, include co-author, run pre-commit checks

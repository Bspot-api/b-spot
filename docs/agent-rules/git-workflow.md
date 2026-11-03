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

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

## Branch Naming

```
<type>/<short-description>
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
   pnpm lint && pnpm test && pnpm build
   ```

⛔ Fix failures before creating PR.

## PR Format

**Title**: `emoji Concise title`

**Body**:
```markdown
## Summary
- Main changes

## Test Plan
- [ ] Test case

🤖 Generated with [Claude Code](https://claude.ai/code)
```

## Safety Rules

**NEVER**: force push main, skip hooks, commit secrets, amend pushed commits

**ALWAYS**: review `git diff` before commit, include co-author, run pre-commit checks

# Claude Code Skills

This folder contains the skills (guidelines) for Claude Code, converted from Cursor rules.

## Available Skills

| Skill | Globs | Description |
|-------|-------|-------------|
| [common.md](./common.md) | `**/*` (always) | General TypeScript guidelines, naming conventions |
| [frontend.md](./frontend.md) | `apps/web-spa/**` | React/Vite/TanStack Query guidelines |
| [mobile.md](./mobile.md) | `apps/mobile/**` | React Native/Expo guidelines |
| [backend.md](./backend.md) | `apps/api/**` | NestJS/MikroORM guidelines |
| [git-workflow.md](./git-workflow.md) | `**/*` | Git workflow, commits, PRs |
| [clickup.md](./clickup.md) | `**/*` | ClickUp integration for task context |

## Skill Format

Each skill uses a YAML frontmatter compatible with Claude Code (v2.0.64+):

```markdown
---
description: Short description of the skill
globs: apps/mobile/**
alwaysApply: false
---

# Skill content
...
```

### Frontmatter Properties

| Property | Description |
|----------|-------------|
| `description` | Short description for progressive loading |
| `globs` | File pattern for automatic activation |
| `alwaysApply` | `true` = always active, `false` = context-dependent |

## File Architecture

```
Single Source of Truth
======================

apps/documentation/src/content/docs/guidelines/
├── backend.mdx      ← Full source
├── frontend.mdx     ← Full source  
└── mobile.mdx       ← Full source

.claude/skills/
├── backend.md       → References backend.mdx
├── frontend.md      → References frontend.mdx
├── mobile.md        → References mobile.mdx
├── common.md        ← Source (no duplicate in docs)
├── clickup.md       ← Source (no duplicate in docs)
└── git-workflow.md  ← Source (no duplicate in docs)

.cursor/rules/
├── api.mdc          → References .claude/skills/backend.md
├── front.mdc        → References .claude/skills/frontend.md
├── mobile.mdc       → References .claude/skills/mobile.md
├── common.mdc       → References .claude/skills/common.md
├── clickup.mdc      → References .claude/skills/clickup.md
└── git-workflow.mdc → References .claude/skills/git-workflow.md
```

## Full Documentation

Launch the documentation site:

```bash
pnpm docs-only
```

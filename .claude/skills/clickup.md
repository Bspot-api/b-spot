---
description: ClickUp integration for task context loading
globs: "**/*"
alwaysApply: false
---

# ClickUp Integration

## When to Ask for a Ticket

When the user provides specs or asks to implement a feature/fix:

1. **Ask**: "Is there a ClickUp task associated with this? (ID or URL)"
2. **If yes**: Load context using ClickUp MCP tools
3. **Update status**: If task is "A FAIRE" or "A CORRIGER", set it to "EN COURS"
4. **Use** the task description, comments, and subtasks as implementation context

## Loading Task Context

Use ClickUp MCP tools to gather context:

- `clickup_get_task` → Full task details (description, status, assignees)
- `clickup_get_task_comments` → Additional specs, discussions, clarifications

Extract from the task:
- **Description**: Main requirements and acceptance criteria
- **Comments**: Clarifications, edge cases, design decisions
- **Subtasks**: Breakdown of work items
- **Custom fields**: Priority, estimates, etc.

## Task Status Updates

| Current Status | Action | New Status |
|----------------|--------|------------|
| `A FAIRE` | Start working | `EN COURS` |
| `A CORRIGER` | Start working | `EN COURS` |
| `A FAIRE` | PR created/updated | `CODE REVIEW` |
| `EN COURS` | PR created/updated | `CODE REVIEW` |
| `A CORRIGER` | PR created/updated | `CODE REVIEW` |

> Notes:
> - Tasks in CODE REVIEW, QA, or DONE are never moved backwards automatically
> - When a PR is created/updated, the PR URL is added as a comment on each related ticket (if not already present)
> - See [git-workflow.md](./git-workflow.md) for PR creation details

## Git Integration

For branch naming, commit format, and PR conventions with ClickUp task references (`CU-xxx`), see [git-workflow.md](./git-workflow.md).

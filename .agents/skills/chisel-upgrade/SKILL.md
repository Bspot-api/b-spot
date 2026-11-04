---
name: chisel-upgrade
description: Move a repo onto the current chisel layout when `chisel update` refuses it or it carries an older chisel — a repo chisel did not install, a first-version layout, or a 0.1.x install — wherever that repo keeps its method.
disable-model-invocation: true
---

# Upgrade to the current layout

The CLI handles the one layout it recognises: a repo it installed, with its
manifest `.agents/.chisel.json`, and no symbolic link on a path it writes.
It refuses everything else and writes nothing. This skill takes over from
there.

It is a set of migration intentions, one per starting point. Each one says
its goal, when it applies and when it does not, the gaps to close — each
with a signal you can observe, a reference to compare against, and a "done
when" — what it must not touch, and how to validate. An intention describes
the end state, not a script: where the project keeps its method is found by
reading the repo, never assumed. Run it from the repo being migrated.

## The starting points

| What you observe | Intention |
|---|---|
| No `.agents/.chisel.json`; or the first version's rule files and visual guide (`.agents/rules/task-*.md` and `.agents/workflows.md`, or the same files wherever `AGENTS.md` leads) | [from-first-version.md](from-first-version.md): a repo chisel did not install, or installed with the first version |
| A manifest whose version starts with `0.1.`; or `.agents/formulas` or `.agents/profiles`; or a glue with a "B1 · Where task statuses live" heading | [from-0.1.x.md](from-0.1.x.md): a 0.1.x install |
| A manifest of a later version, and `chisel update` accepts the repo | None: the repo is current. Say so and stop. |

## How to apply an intention

1. **Require a clean working tree** (`git status --porcelain` empty), so
   the human can read one diff and revert it in one command.
2. **Get the reference tree**, in a scratch directory outside the repo —
   never by running `init` in the repo itself:

   ```bash
   REF="$(mktemp -d)"
   deno x jsr:@lonestone/chisel@<version> init "$REF"
   ```

   `<version>` is the one the CLI's refusal named, or else the version the
   repo moves to. The intentions' reference paths are read under `$REF`.
3. **State the inventory as facts**, in a short table: where the method
   lives, read from `AGENTS.md` and `CLAUDE.md` (inside and outside the
   `chisel:begin` / `chisel:end` markers), from `.agents/project.md` when
   there is one, and from the symbolic links of the repo
   (`find . -type l -not -path './.git/*' -not -path './node_modules/*'`).
   Facts are stated; only genuine decisions are asked.
4. **Close the gaps in their order, one at a time.** A gap whose signal is
   absent is already closed: say so and move on. Each move is shown before
   it is made, and the human says yes to it.
5. **Validate** with the intention's list, then **record the result**
   below.
6. **Delete the reference tree**: `rm -rf "$REF"`.

## What is never touched

Say this out loud at the start, and hold to it:

- **The archive.** Every archived task keeps its bytes.
- **The content of open task files.** Only their status line changes, by
  the intention's table, after the human's yes.
- **The project's own answers** in its glue: its paths, reading list and
  gate commands.
- **A skill chisel does not ship**, linked or not: it is the project's.
- **Anything that is not the method:** source code, CI, dependencies, git
  history.

## Record the result

Every intention ends the same way:

1. Show the human the full diff; their reading of it is the validation of
   the whole migration.
2. Once accepted, add one dated entry to the journal that the task
   workspace section of `.agents/project.md` names: the starting point,
   what was retired, which tree was kept, what moved.
3. Commit it as one commit, on exact paths — never `git add -A`.
4. Say what changed for whoever works here next, in three lines: the
   ambient core applies to every session; real scoped work follows
   `.agents/workflow.md`, with the Architect as the default role; the
   tracker section of `.agents/project.md` says where tasks live.

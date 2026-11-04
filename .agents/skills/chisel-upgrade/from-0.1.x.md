# From a 0.1.x install

## Goal

A repo installed by chisel 0.1.x carries the current layout: no formula,
role profile or rendered agent definition; a glue with one tracker section
and a merge and publish section; open tasks on the seven statuses; a
journal called `JOURNAL.md`; and `chisel update` accepts it with nothing
left to act on.

## Why

0.1.x shipped formulas with five presets (`.agents/formulas`), role
profiles (`.agents/profiles`: Foreman, Architect, Checker, Mason,
Inspector), agent definitions rendered from them into `.claude/agents/` and
`.codex/agents/`, thirteen statuses, and a glue with two coordination
subsections, "B1 · Where task statuses live" and "B2 · Link to an external
tracker". The current socle has one prose workflow, four roles and seven
statuses. `chisel update` removes the retired files it installed unchanged;
what it cannot touch — the glue, the task statuses, the project's own
text — is this intention's.

## Applies When

- `.agents/.chisel.json` names a version starting with `0.1.`; or
- `.agents/formulas` or `.agents/profiles` exists; or
- `.agents/project.md` has a "B1 · Where task statuses live" heading.

## Do Not Apply When

- There is no manifest: apply [from-first-version.md](from-first-version.md)
  instead.
- The human has decided, after reading this intention, to stay on 0.1.x:
  record it as skipped, with the reason.

## Observable Gaps

1. **The retired files.** Signal: a file in `.agents/formulas`,
   `.agents/profiles`, `.claude/agents/` or `.codex/agents/`. Run
   `deno x jsr:@lonestone/chisel@<version> update`. Each `removed:` line is
   a retired file that was still as installed, now gone. An `orphaned:`
   line is a retired file someone edited: show it, and ask whether its
   content moves into a project instruction or goes. A `stale:` line names
   a glue residue that "The glue" below closes. When `update` refuses and names linked
   paths, close the links gap of [from-first-version.md](from-first-version.md)
   first, then run it again. A profile the project wrote itself was never
   installed, so `update` leaves it: propose moving its content into
   `AGENTS.md`, outside the chisel markers, then remove the directory.
   Done when: none of the four directories holds a file chisel shipped, and
   the human's answer on each orphaned file is applied.

2. **The glue.** Signal: `.agents/project.md` has a "B1", "B2" or "B3"
   subsection, an adapter line for `.claude/agents` or `.codex/agents`, or
   no "I · Merge and publish" section. Replace the subsections with one
   "B · Tracker" section, using the tracker question of
   `.agents/skills/chisel-setup/SKILL.md` with the old answers as the
   recommendation: statuses in the task files → the default; a committed
   database → beads; an external tracker named in "B2" → that tracker and
   its connector. Drop the two retired adapter lines. Add the merge and
   publish section with that skill's question; without it, merging and
   publishing wait for the human, as before. Every byte outside those spans
   stays.
   Done when: `chisel update` prints no `stale:` line, and the glue has a
   tracker section and a merge and publish section.

3. **The statuses.** Signal: an open task file, in the tasks directory the
   task workspace section of `.agents/project.md` names, whose status is
   not one of the seven. Show the human the list old → new first, then edit
   by the table below. A task moved from `waiting-plan-approval` keeps its
   plan unapproved: say so on its work document's `**Plan:**` line. With
   beads (the tracker section names it, or `.beads/` exists): re-declare
   `bd config set status.custom "draft:active,done:done,cancelled:done"`,
   move each open bead off a retired value with `bd update <id> --status`,
   and remove the `.beads/formulas` link (`git rm .beads/formulas`); the
   beads adapter is `.agents/skills/chisel-beads/SKILL.md`.
   Done when: every open task, and every open bead, carries one of the
   seven statuses of `.agents/workflow.md` ("Statuses").

| Old | New |
|---|---|
| `creating`, `waiting-business-approval`, `waiting-design-approval` | `draft` |
| `ready` | `ready` |
| `planning`, `waiting-plan-approval`, `in-progress`, `waiting-diff-approval` | `in-progress` |
| `done` | `done` |
| `blocked`, `stalled` | `blocked` |
| `deferred` | `deferred` |
| `cancelled` | `cancelled` |

4. **The project's own words.** Signal: a line outside the chisel markers
   of `AGENTS.md`, or in the README or CI, that names a retired piece — the
   Foreman, a formula or preset, a profile, the Checker, the Mason, the
   Inspector. List each with its replacement: the Architect,
   `.agents/workflow.md`, the Crewmate or the Typist, the reviewers of
   `code-review`. Fixing them is the human's decision, line by line.
   Done when: the human has ruled on every line.

5. **The journal's name.** Signal: the Journal line of the task workspace
   section names `LOG.md` or `CHANGELOG.md`. Rename it to `JOURNAL.md` in
   the same directory with `git mv`, its content untouched, and rewrite the
   Journal line.
   Done when: the Journal line names `JOURNAL.md` and the file exists.

## Out of Scope

- The archive, and the content of open task files beyond their status
  line.
- The glue's other sections: their answers are the project's.
- A skill chisel does not ship, a definition the user wrote in
  `.claude/agents/`, source code, CI and git history.
- Pushing or publishing anything.

## Reference Paths

`update` installs everything below; the reference tree of
[SKILL.md](SKILL.md) is needed only to compare the glue.

- `.agents/project.md` — **adapt**: compare its tracker and merge and
  publish sections with the reference's; the project's answers win.
- `.agents/skills/chisel-setup/SKILL.md` — **copy**: the tracker and merge
  and publish questions.
- `.agents/skills/chisel-beads/SKILL.md` — **copy**: the beads adapter.
- `.agents/workflow.md` — **copy**: the roles and the seven statuses.

## Validation

- `deno x jsr:@lonestone/chisel check` is clean.
- `deno x jsr:@lonestone/chisel update` exits 0 with no `removed:`,
  `orphaned:` or `stale:` line left to act on.
- `git diff --stat` on the archive is empty. A changed archived file is a
  failed migration: revert it.
- A search of the repo's own text for the retired names and paths: what is
  left is listed for the human.

## Record Result

As "Record the result" in [SKILL.md](SKILL.md); the journal entry names the
version the repo moved from.

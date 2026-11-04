# From the first version, or a repo chisel did not install

## Goal

The repo keeps its method in one tree, has chisel's manifest
(`.agents/.chisel.json`), no symbolic link on a path chisel writes, and
`chisel update` accepts it.

## Why

`chisel update` refuses a repo with no manifest, and both `init` and
`update` refuse to write a path that is a symbolic link or sits under one:
a plain write follows the link and rewrites the project's own file. A repo
whose method predates the CLI keeps it where it chose — doctrine in
`doc/agents/`, a task workspace outside `project-management/`, skills
linked into `.agents/skills/` from elsewhere — and no script can tell which
of those files are chisel's and which are the project's.

The first version also had another method: three rule files and a visual
guide, six status words, and a journal called `CHANGELOG.md`, a name that
collides with a release changelog.

## Applies When

- `.agents/.chisel.json` does not exist, whatever else the repo has; or
- the first version's rule files (`task-*.md` in a `rules/` directory) or
  its visual guide (`workflows.md`) exist where `AGENTS.md`, `CLAUDE.md` or
  `.agents/` lead — `.agents/rules/` and `.agents/workflows.md` by default.

## Do Not Apply When

- A manifest exists and names a 0.1.x version: apply
  [from-0.1.x.md](from-0.1.x.md) instead.
- The human has decided, after reading this intention, not to adopt chisel
  in this repo: record it as skipped, with the reason.

## Observable Gaps

Close them in this order. `chisel init .` refuses links, so "Links where
chisel writes" is closed before "The current layer and its manifest" runs
it.

1. **Where the method lives, and two trees.** Signal: the task workspace —
   tasks, archive, journal, task templates — exists in more than one place,
   or the method is somewhere other than `.agents/` and the glue says
   nothing of it. Find every piece through the pointers in `AGENTS.md` and
   `CLAUDE.md`, the task workspace section of `.agents/project.md` when a
   glue exists, and the links found at the inventory; never by assuming a
   path. State each tree with what it holds. **The human chooses which
   tree to keep** for the task workspace (`project-management/`, or the
   repo's own, such as `doc/project-management/`). Chisel's doctrine and
   skills always live in `.agents/`: the CLI writes nowhere else. Move what
   goes into the kept tree with `git mv`, content untouched.
   Done when: one task workspace remains, the human named it, and nothing
   in `AGENTS.md`, `CLAUDE.md` or that workspace points at the tree that
   went.

2. **Links where chisel writes.** Signal: a symbolic link on a path the
   reference tree has — `AGENTS.md`, `CLAUDE.md`, a file or directory
   under `.agents/` (`.agents` itself and `.agents/skills` included),
   `scripts/task-id.sh`, the two templates under `project-management/` —
   or on a directory above one. List them with `ls -l AGENTS.md CLAUDE.md` and
   `find .agents scripts project-management -type l`, keeping the names the
   reference tree has. Two cases are common:
   - **A linked `AGENTS.md` or `CLAUDE.md`**, often one pointing at the
     other. Show both contents; the human chooses what each file holds.
     Replace each link by a real file holding that content
     (`cp "$(readlink AGENTS.md)" AGENTS.md.new && mv AGENTS.md.new
     AGENTS.md`, the same for `CLAUDE.md`, then edit it as the human
     chose). The file a link pointed at keeps its own content.
   - **A linked skill of a name chisel ships**, such as `.agents/skills/tdd`
     pointing into `doc/agents/skills/tdd`. Show the diff between the
     link's destination and `$REF/.agents/skills/<name>/`; the human
     chooses which content stays. Remove the link (`git rm`): `init` poses
     chisel's version in "The current layer and its manifest". An edit of the project's that the human
     keeps moves to a skill of its own, under a name chisel does not ship,
     or to the project's instructions outside the chisel markers of
     `AGENTS.md`. The destination copy left in the other tree goes or
     stays by the human's word; it is never edited.

   A skill chisel does not ship stays linked: chisel never writes it.
   Done when: no path the reference tree has, and no directory above one,
   is a symbolic link in the repo.

3. **The retired layer.** Signal: rule files `task-*.md` in a `rules/`
   directory and a `workflows.md` beside them, at `.agents/rules/` and
   `.agents/workflows.md` or wherever "Where the method lives, and two
   trees" found the method. List the
   exact files, wait for the yes, then `git rm` only what exists. A rule
   someone added locally is the project's: name it, and ask where it moves
   (usually a project instruction outside the chisel markers of
   `AGENTS.md`).
   Done when: no rule file and no visual guide remains, and a search for
   their names finds no pointer at them outside the archive.

4. **The current layer and its manifest.** Signal: no
   `.agents/.chisel.json`. First, if the repo has its own
   `scripts/task-id.sh`, compare it with `$REF/scripts/task-id.sh`: `init`
   overwrites it, so a project script that does more is renamed first, with
   the human's yes. Then, with the links gone, run
   `deno x jsr:@lonestone/chisel@<version> init .`. It poses the socle in
   `.agents/`, adds or rewrites the managed block of `AGENTS.md`, adds the
   import line to `CLAUDE.md` and the `.claude/skills` link, writes the
   glue when there is none, and seeds `project-management/` with the two
   templates, `tasks/`, `archive/` and a journal unless one is there. When
   the workspace the human kept in "Where the method lives, and two trees"
   is elsewhere: move the two
   templates into it, remove what `init` seeded in `project-management/`
   (only what it seeded, never a file of the project's), then run
   `deno x jsr:@lonestone/chisel@<version> update`, which stops tracking
   the templates it no longer finds there and never recreates them.
   Done when: `.agents/.chisel.json` exists and `chisel update` exits 0
   without creating a tree the human did not keep.

5. **The glue and the journal.** Signal: a path in the task workspace
   section of `.agents/project.md` that does not exist, or a journal still
   called `CHANGELOG.md`. Point the section at the kept tree: tasks,
   archive, journal, roadmap, the two templates, the task id script. Rename
   the journal to `JOURNAL.md` in the same directory with `git mv`, its
   content untouched, and rewrite the section's Journal line. Then complete
   the glue with `.agents/skills/chisel-setup/SKILL.md`: its tracker, model
   tiers and merge and publish questions and the personal file, one
   question per message, and the adapters section ticked from what is in
   place. Finish with its "One voice in `AGENTS.md`" step for the project's
   text that still describes the old method.
   Done when: every path the task workspace section names exists, there is
   one journal, and the chisel-setup walk is answered.

6. **The statuses.** Signal: an open task file whose status line holds one
   of the first version's six words, often after a coloured circle. Show
   the human the list old → new first, then edit by the table below, the
   free text after the word kept.
   Done when: every open task carries one of the seven statuses of
   `.agents/workflow.md` ("Statuses").

| Old | New |
|---|---|
| Not Started | `draft` or `ready`, by the real state of the spec — `blocked` when a named dependency holds it, `in-progress` for a parent whose slices are partly done |
| In Progress | `in-progress` |
| Blocked | `blocked` |
| Complete / Done / Delivered | `done` |
| Deferred | `deferred` |
| Cancelled | `cancelled` |

## Out of Scope

- The archive, and the content of open task files beyond their status
  line.
- A skill chisel does not ship, linked or not, and the project's own
  doctrine pages that are not the first version's rules: they stay where
  they are.
- Source code, CI, dependencies, lockfiles and git history.
- Pushing or publishing anything.

## Reference Paths

Read under the reference tree `$REF` ("How to apply an intention" in
[SKILL.md](SKILL.md) says how to get it).

- `.agents/discipline.md`, `.agents/methodology.md`,
  `.agents/workflow.md`, `.agents/reference.md` — **copy** (`init` poses
  them).
- `.agents/skills/` — **copy**, each skill chisel ships; an edit the
  project keeps moves to a skill of its own name.
- `.agents/project.md` — **adapt**: the project's answers win, the
  template's sections and labels stay.
- `AGENTS.md` — **adapt**: the managed block is chisel's, everything
  outside it is the project's.
- `project-management/000-template.spec.md` and
  `project-management/000-template.work.md` — **copy**, into the kept
  workspace.
- `scripts/task-id.sh` — **copy**, unless the project's own does more: it
  is then kept under another name.

## Validation

- `deno x jsr:@lonestone/chisel check` is clean.
- `deno x jsr:@lonestone/chisel update` exits 0 with no `removed:`,
  `orphaned:` or `stale:` line left to act on, and `git status` shows no
  new tree after it.
- `find .agents -type l` lists only skills chisel does not ship.
- `git diff --stat` on the archive is empty. A changed archived file is a
  failed migration: revert it.
- A search of the repo's own text for `rules/task-`, `workflows.md` and the
  old journal name: what is left is listed for the human.

## Record Result

As "Record the result" in [SKILL.md](SKILL.md); the journal entry names the
tree kept and each link replaced.

# `pnpm e2e:mobile` ignores the developer's local `.env`

**Status:** done

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

When a developer has an `apps/mobile/.env`, `pnpm e2e:mobile` fails 3 of
its 4 flows with "Network request failed". The `.env` is gitignored, and
the usual one sets `EXPO_PUBLIC_API_URL=http://localhost:3001`.

The Architect proved the cause on 2026-11-04, after merging slice 02 into
`feat/e2e-tests`:
- In development, Expo 54 bundles `apps/mobile/.env` as a module (`.env`,
  required from `expo/virtual/env.js`, the client env used for HMR).
- Its values win at runtime over the `EXPO_PUBLIC_API_URL` that the e2e
  Metro receives through its process environment. Both values were read in
  the served iOS bundle: `3001` from the `.env` module, `3101` from the
  "HMR env vars from Expo CLI" prelude.
- With the `.env` moved aside, 4/4 flows pass.
- `EXPO_NO_DOTENV=1` on the e2e Metro does not change it.

Slice 02's Crewmate ran in a worktree with no `.env`, so neither its runs
nor its review saw this. The comment in `apps/e2e/env/ios/metro.ts`, which
says the process env wins over `.env`, is wrong.

## Scope

**Included:**
- Making the iOS e2e run use the e2e API URL whatever
  `apps/mobile/.env*` files the developer has.
- Correcting the comment.
- A regression check.

**Not Included:**
- The web suite, which already passes with a `.env` present (25/25).
- The single unexplained "Erreur serveur" of slice 02's run 4, which
  happened with no `.env`.

## Acceptance Criteria

- [x] **local-env-ignored** — with an `apps/mobile/.env` setting
  `EXPO_PUBLIC_API_URL` to another URL, `pnpm e2e:mobile` passes 4/4, twice
  in a row.
- [x] **developer-files-untouched** — the run never moves, edits or deletes
  a developer's `apps/mobile/.env*` file, even when it is killed mid-run.
  Anything the run creates is removed at the end and is gitignored.
- [x] **without-env-still-passes** — with no `apps/mobile/.env`,
  `pnpm e2e:mobile` passes 4/4.
- [x] **regression-guard** — a failing check names the cause if the bundle
  ever carries a different API URL than the e2e one (for example a
  preflight on the served bundle, or a flow-level assertion with a clear
  message).
- [x] **suite-green** — `pnpm lint`, `pnpm test`, `pnpm build` and
  `pnpm e2e:web` pass.

## Seams

- The environment the e2e Metro bundles the app with.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## Implementation Decisions

- Prefer a mechanism Expo documents, such as `.env` file precedence or a
  documented switch, over patching `node_modules` or Expo internals. If
  only an undocumented hook works, the plan says so and why.

## References

- `project-management/tasks/20261103-2143-e2e-tests/02-ios-maestro.work.md`:
  slice 02's design of the e2e Metro.
- `apps/e2e/env/ios/metro.ts`: where the e2e Metro is started.

## Notes

- 2026-11-04, Architect: the human chose to fix this as its own task,
  rather than moving the developer's `.env` aside during the run or
  documenting the limitation.
- 2026-11-04, Crewmate (close): every criterion is met. The evidence is
  in the worklog of the work document.
  - `local-env-ignored`: three 4/4 runs with a 3001 `.env`, two before the
    review and one after its fixes.
  - `developer-files-untouched`: identical checksums across two SIGINT
    runs. The run creates no file; orphaned processes on kill predate this
    task and are reported.
  - `without-env-still-passes`: one 4/4 run.
  - `regression-guard`: the red preflight run named the cause.
  - `suite-green`: lint, test and build passed, and `e2e:web` passed 25.
  - The human should confirm the undocumented hook (see "Rulings" in the
    work document).
- 2026-11-04, Architect — the human confirmed relying on the undocumented
  hook (`resolver.blockList` gated for e2e, guarded by the bundle
  preflight) over the documented `--no-dev`, which would change what runs
  under test.

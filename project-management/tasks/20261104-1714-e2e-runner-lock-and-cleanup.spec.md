# e2e runs take the lock themselves and clean up when killed

**Status:** in-progress

---

> 🧑 **REVIEW CAREFULLY** — human decision surface. Read it all before code.

## Context

The e2e environment exists only once: the database `b_spot_e2e` and
ports 4010, 4011, 3101, 8182 and 8183. Crewmates running in parallel
share it through a hand-made `mkdir` lock that each one scripts itself.
One of them left the lock behind after a failure.

A killed `pnpm e2e:web` or `pnpm e2e:mobile` (Ctrl-C, SIGTERM) leaves
Metro, the API and the fixture server running. The runners have no
signal handler, and `spawnService` starts services detached, so the
cleanup code never runs. Crewmates have stopped the orphans by hand.

## Scope

**Included:**
- Both runners take an exclusive lock on the e2e environment before
  starting anything, and release it on every exit path: success, failure,
  SIGINT, SIGTERM.
- When the lock is held, a second run waits with a clear message, up to a
  bounded time, then fails naming the holder (pid, command, start time).
- A lock left by a dead process is detected and taken over.
- On SIGINT or SIGTERM, every service the run started is stopped, and so
  are the containers it started (and only those), before exiting non-zero.
- The README "End-to-end tests" section explains the lock and what a
  killed run leaves behind (nothing).

**Not Included:**
- Running two e2e environments in parallel (separate ports or databases).
- CI.

## Acceptance Criteria

- [ ] **killed-run-leaves-nothing** — after SIGINT, and separately after
  SIGTERM, sent mid-run to `pnpm e2e:web` and to `pnpm e2e:mobile`, no
  process listens on 4010, 4011, 3101, 8182 or 8183, and the lock is free.
- [ ] **runs-serialise** — two `pnpm e2e:web` started together both pass,
  one after the other, and the second says it waited.
- [ ] **stale-lock-recovered** — a lock whose holder pid is dead is taken
  over with a message, with no manual step.
- [ ] **containers-respected** — containers that were already running
  before a killed run are still running after it.
- [ ] **suites-unchanged** — `pnpm e2e:web` (25) and `pnpm e2e:mobile` pass
  as before, twice each.
- [ ] **suite-green** — `pnpm lint`, `pnpm test` and `pnpm build` pass.

## Seams

- The lock: acquire, release, and a stale-holder check.
- The runners' exit path on signals.

---

> 🧑 **REVIEW IF RELEVANT** — decisions, testing, slicing.

## Implementation Decisions

- The lock lives in a fixed, gitignored or temp path that every worktree
  of this repo resolves to the same place, so that Crewmates in sibling
  worktrees share it.

## Notes

- 2026-11-04, Architect: proposed by several Crewmates (orphans after a
  kill, a lock left behind). The human asked for it to be launched.
- Another Crewmate (native magic-link login) is working in `apps/e2e` at the
  same time, adding control-server routes and Maestro flows. The Architect
  resolves the merge.

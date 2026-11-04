# e2e runs take the lock themselves and clean up when killed

**Status:** done

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

- [x] **killed-run-leaves-nothing** — after SIGINT, and separately after
  SIGTERM, sent mid-run to `pnpm e2e:web` and to `pnpm e2e:mobile`, no
  process listens on 4010, 4011, 3101, 8182 or 8183, and the lock is free.
  Evidence: six scripted kills, plus three more after the review: web and mobile, each with SIGINT to the group and with SIGTERM to pnpm, plus kills during `expo export`. Exit codes 130 and 143. Afterwards the five ports, the lock and the processes were all clear.
- [x] **runs-serialise** — two `pnpm e2e:web` started together both pass,
  one after the other, and the second says it waited.
  Evidence: two runs started together both passed 25. One logged `in use by pid …` and then `lock acquired after waiting 1m04s`.
- [x] **stale-lock-recovered** — a lock whose holder pid is dead is taken
  over with a message, with no manual step.
  Evidence: with a hand-made lock holding a dead pid, the run logged `… is stale: that process is gone; taking it over` and passed 25. Unit tests cover it, including 8 processes racing for one stale lock.
- [x] **containers-respected** — containers that were already running
  before a killed run are still running after it.
  Evidence: `maildev postgres` were running before and after every killed run. Stopping a container the run started is checked in code review only (Architect ruling).
- [x] **suites-unchanged** — `pnpm e2e:web` (25) and `pnpm e2e:mobile` pass
  as before, twice each.
  Evidence: web passed 25, 25 and 25, and mobile 4/4, 4/4 and 4/4 (the third runs came after the review fixes).
- [x] **suite-green** — `pnpm lint`, `pnpm test` and `pnpm build` pass.
  Evidence: `pnpm typecheck`, `pnpm lint`, `pnpm test` and `pnpm build` all exit 0.

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

- 2026-11-04, Architect (recorded by the Crewmate at close): the busy-port
  preflight was ruled into this task at plan approval. Before starting its
  services, a run fails, naming the port and the pid, when an e2e port is
  already taken. It never kills anything. See "Rulings — Architect" in the
  work document.
- 2026-11-04, Architect: proposed by several Crewmates (orphans after a
  kill, a lock left behind). The human asked for it to be launched.
- Another Crewmate (native magic-link login) is working in `apps/e2e` at the
  same time, adding control-server routes and Maestro flows. The Architect
  resolves the merge.

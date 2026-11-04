# e2e runs take the lock themselves and clean up when killed — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261104-1714-e2e-runner-lock-and-cleanup.spec.md`.

**Plan:** approved by the Architect, 2026-11-04 (see Rulings).

## Program Design

### What the code does today (read, then probed)

- `apps/e2e/env/environment.ts` (`withE2eEnvironment`) starts the
  containers, resets the database, builds the API (and exports the web app
  for the web suite), starts the fixture server, the API and the static web
  server through `spawnService`, runs the suite, and tears down in a
  `finally`.
- `apps/e2e/env/services.ts` (`spawnService`) spawns every service with
  `detached: true`. Each one leads its own process group, and `stop()`
  kills that group (`process.kill(-pid)`: SIGTERM, then SIGKILL after 5 s).
  Because the groups are detached, Ctrl-C never reaches them. Because no
  runner installs a signal handler, the `finally` never runs on a signal.
  The orphans recorded in the archived work document of
  `project-management/archive/20261104-1509-e2e-mobile-ignores-local-env/`
  (its worklog, "Found along the way, out of scope") come from there.
- `apps/e2e/env/process.ts` (`runCommandForExitCode`, `runCommand`) runs
  the foreground commands: compose, migrations, the API build,
  `expo export`, Playwright, Maestro. They are not detached. Ctrl-C reaches
  them, but a SIGTERM sent to `pnpm` only does not.
- `apps/e2e/env/ios/run-mobile.ts` starts Metro (`ios/metro.ts`, through
  `spawnService`) and the in-process control server inside the `run`
  callback of `withE2eEnvironment`, so they already run inside whatever
  `withE2eEnvironment` guards.
- `apps/e2e/env/docker.ts` (`startContainers`) returns the services it
  started itself, and only those are stopped. But a signal that lands
  during `compose up` loses that list, because the function has not
  returned yet.
- The chain of processes is: `pnpm e2e:web` (root) → `pnpm --filter
  @b-spot/e2e e2e:web` → `tsx env/run-web.ts` → the runner's node.

**Probe: signal delivery through that chain** (throwaway, kept in
`/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/e2e-runner/signal-probe/`).
The script installs SIGINT/SIGTERM handlers that clean up for 4 s and then
exit. It runs behind two `pnpm run` layers, like the real chain.

| Launch | Signal | Result |
|---|---|---|
| `tsx probe.ts` | SIGTERM to the outer pnpm pid | forwarded; cleanup completes |
| `tsx probe.ts` | SIGINT to the group (Ctrl-C) | **4/4 runs: the script gets SIGINT twice, then is SIGKILLed before cleanup ends** |
| `node --import tsx probe.ts` | SIGINT to the group (Ctrl-C) | 4/4 runs: SIGINT ×2, then SIGTERM (from pnpm), cleanup completes, exit 130 |

The SIGKILL comes from the `tsx` CLI's signal relay (`relaySignalToChild`
in `tsx/dist/cli.mjs`). It waits 30 ms for the child to confirm the signal,
re-sends it, then sends `SIGKILL`. **So a handler alone is not enough:
under Ctrl-C the runner must not run behind the `tsx` CLI.** The probe also
shows that the runner receives the same interrupt several times, from the
TTY, from tsx/pnpm and from pnpm's own SIGTERM. Repeated signals must not
escalate.

### Decisions

**1. The runners start with `node --import tsx`, not the `tsx` CLI.**
`apps/e2e/package.json`: `"e2e:web": "node --import tsx env/run-web.ts"`
and `"e2e:mobile": "node --import tsx env/ios/run-mobile.ts"`. The API
service already starts this way (`API_SERVER` in `environment.ts`). The
`test` script stays on `tsx --test`.

**2. The lock is one file in the git common directory.**
- **Path.** `<git common dir>/b-spot-e2e.lock.json`. It is resolved once
  with `git rev-parse --path-format=absolute --git-common-dir` (git 2.52
  here), run from `REPO_ROOT`. Every worktree resolves to
  `/Users/tatiana/Workspace/perso/b-spot/.git`, so the main checkout and
  every sibling worktree share the same file. It is never tracked, because
  it lives inside `.git`. The name does not end in `.lock`, so it cannot
  be confused with git's own lock files. An override,
  `E2E_LOCK_FILE=<path>`, is read first; it is for experiments, not
  documented as a feature. If `git` fails (no repository), the lock falls
  back to `os.tmpdir()/b-spot-e2e.lock.json`, with a warning.
- **Atomicity.** The holder JSON is written to a private temp file beside
  the lock (`<lock>.<pid>.tmp`). Then `fs.linkSync(tmp, lock)` publishes
  it, and the temp file is unlinked. `link(2)` fails with `EEXIST` when
  the lock exists. Unlike `mkdir` + write, or `open('wx')` + write, the
  lock never exists without its complete holder, so a reader never sees an
  empty or half-written file.
- **Holder metadata.** `{ pid, command, worktree, startedAt }`:
  - `pid` is `process.pid` of the runner's node, the process that
    releases the lock;
  - `command` is `pnpm ${npm_lifecycle_event}` plus the extra arguments,
    for example `pnpm e2e:web --project=web`, and falls back to `argv`;
  - `worktree` is `REPO_ROOT`;
  - `startedAt` is an ISO timestamp.
- **Stale detection.** The holder is alive when `process.kill(pid, 0)`
  succeeds or fails with `EPERM`; on `ESRCH` it is dead. A file that does
  not parse cannot come from this code (see Atomicity), so it is treated as
  stale too. Pid reuse is an accepted risk: a reused pid looks alive, so
  the run waits its bounded time, then fails naming the holder and the
  lock's path, and the message says how to remove the file.
- **Takeover.** Taking over is guarded so that two waiters cannot both
  replace the same stale lock:
  1. Take `mkdir <lock>.takeover`. That directory is itself considered
     stale after 10 s, judged by its mtime; the guarded section is
     synchronous and lasts microseconds.
  2. Re-read the holder, and check it is still the same dead one (same
     `pid` and `startedAt`).
  3. Unlink it and log `[e2e] lock left by pid N (pnpm e2e:web, since T)
     is stale: that process is gone; taking it over`.
  4. Remove the guard directory and retry `link`.
- **Bounded wait.** The lock is polled every 2 s. On the first refusal the
  run logs `[e2e] the e2e environment is in use by pid N (cmd, worktree,
  since T); waiting up to 20 min`, and repeats it every minute. Once it
  acquires the lock, it logs `[e2e] lock acquired after waiting 3m12s`
  (the line `runs-serialise` looks for). After the limit it throws `[e2e]
  gave up after 20 min: the e2e environment is still held by pid N (cmd,
  since T); lock file <path>`. The default is 20 min, about four full
  runs. `E2E_LOCK_WAIT_MINUTES` overrides it.
- **Release.** `release()` is synchronous and idempotent. It unlinks the
  file only if the holder's pid is `process.pid`, so it never removes
  another run's lock. It is called from the teardown, and from a
  `process.on('exit')` safety net, which covers `process.exit` from
  anywhere and uncaught errors.

**3. The interrupt path: one module, a LIFO of cleanups.**
- `onInterrupt(cleanup)` registers an async cleanup and returns its
  unregister function. The first registration installs `SIGINT` and
  `SIGTERM` handlers.
- On the first signal, the module:
  1. logs `[e2e] SIGINT received: stopping what this run started`;
  2. runs the cleanups last-registered-first, each awaited, its error
     logged and swallowed;
  3. then calls `process.exit(128 + n)` (130 or 143).
- An overall deadline of 45 s guards the cleanups, because `compose stop`
  waits up to 10 s per container. Past it, the run logs what is still
  pending and exits anyway.
- Later signals are logged (`already stopping`) and ignored, never
  escalated. The probe shows that one Ctrl-C delivers SIGINT twice, then
  SIGTERM.
- `interruptSignal()` tells the normal path that a signal arrived.
  `withE2eEnvironment` then returns `128 + n` instead of the suite's code,
  so the exit code is the same whichever path calls `process.exit` first.

**4. Every started process is registered, and every stop is idempotent.**
- `services.ts`: `spawnService` registers the service's `stop` with
  `onInterrupt` as soon as the child is spawned, before it is ready. It
  unregisters it once the service is stopped. `stop` is memoized: one
  promise, whether the `finally` calls it, the interrupt does, or both.
  The process-group kill (SIGTERM, then SIGKILL after 5 s) is unchanged.
  It already reaches pnpm/tsx/expo grandchildren, and Metro is covered with
  no change to `ios/metro.ts` or `ios/run-mobile.ts`.
- `process.ts`: `runCommandForExitCode` and `captureCommand` register
  `child.kill('SIGTERM')` while the child runs. This covers a SIGTERM
  sent to pnpm only, during `expo export`, the migrations, Playwright or
  Maestro; Ctrl-C reaches those children directly anyway. They stay
  non-detached.
- `environment.ts`: `withE2eEnvironment` becomes:
  1. acquire the lock, before anything else;
  2. plan the containers;
  3. register one memoized `teardown` with `onInterrupt` (stop the
     services in reverse, stop the containers this run started, release
     the lock);
  4. start the containers, prepare the builds, start the services, run the
     suite;
  5. `finally`: await the same `teardown`.

  The control server needs nothing: it lives in the runner's process.

**5. The containers: list before starting.**
`docker.ts` splits `startContainers` into two functions:
- `planContainers()` returns the compose services that are not running and
  adopts a running MailDev's ports, as today;
- `startContainers(toStart)` runs `compose up` and the readiness waits.

The teardown knows the list before `compose up` begins. A signal during
`up` then stops exactly those containers, and never one that was running
before.

**6. The README** "End-to-end tests" section gets a short paragraph:
- runs take a lock shared by every worktree;
- a second run waits (up to 20 min) and says so;
- a lock left by a dead run is taken over;
- Ctrl-C or `kill` stops everything the run started, containers included
  but only those it started, and leaves nothing behind;
- where the lock file is, in case a human must look.

### Seam signatures

```ts
// env/run-control/e2e-lock.ts
export interface LockHolder { pid: number; command: string; worktree: string; startedAt: string }
export interface LockOptions {
  path: string;
  holder: LockHolder;
  waitLimitMs: number;
  pollMs: number;
  log: (message: string) => void;
}
export interface HeldLock { release: () => void; waitedMs: number }
export function acquireLock(options: LockOptions): Promise<HeldLock>;
export function isHolderAlive(holder: LockHolder): boolean;
// env/run-control/lock-file.ts — the raw file operations (link, read, guarded unlink)
export function tryCreateLock(path: string, holder: LockHolder): LockHolder | undefined; // undefined = acquired, else the current holder
export function readHolder(path: string): LockHolder | 'unreadable' | undefined;
export function removeStaleLock(path: string, seen: LockHolder | 'unreadable'): boolean;
// env/run-control/e2e-lock-path.ts
export function resolveE2eLockPath(): string;
export function describeCurrentRun(): LockHolder;
// env/run-control/interrupt.ts
export type Cleanup = () => Promise<void>;
export function onInterrupt(cleanup: Cleanup): () => void;
export function interruptSignal(): NodeJS.Signals | undefined;
```

`acquireLock` takes everything it needs as options (path, holder, limits,
log), so the unit tests run against a temp directory with no git and no
real wait.

### Files expected to change

New (a sub-folder, so `env/` keeps 8 files under the folder limit):
- `apps/e2e/env/run-control/e2e-lock.ts`: acquire, the bounded wait, the
  takeover.
- `apps/e2e/env/run-control/lock-file.ts`: link-publish, read, guarded
  unlink.
- `apps/e2e/env/run-control/e2e-lock-path.ts`: path resolution and the
  holder of this run.
- `apps/e2e/env/run-control/interrupt.ts`: the signal handlers and the
  cleanup LIFO.
- `apps/e2e/env/run-control/e2e-lock.test.ts`
- `apps/e2e/env/run-control/interrupt.test.ts`
- `apps/e2e/env/run-control/test-fixtures/lock-contender.ts`: a child
  process that tries the lock, for the race tests.
- `apps/e2e/env/run-control/test-fixtures/interrupt-probe.ts`: a child
  that registers cleanups and waits to be signalled.

Modified:
- `apps/e2e/env/environment.ts`: the lock first, the memoized teardown
  registered, the exit code on interrupt.
- `apps/e2e/env/services.ts`: register and unregister, memoized `stop`.
- `apps/e2e/env/process.ts`: foreground children registered while running.
- `apps/e2e/env/docker.ts`: the `planContainers` / `startContainers`
  split.
- `apps/e2e/package.json`: both runner scripts on `node --import tsx`.
- `README.md`: the "End-to-end tests" section.

Not touched: `env/run-web.ts`, `env/ios/run-mobile.ts`, `env/ios/metro.ts`,
`env/ios/control-server.ts` and the Maestro flows, which are the
native-login Crewmate's ground. `package.json` at the root is not touched
either. The only overlap with that Crewmate is `apps/e2e/package.json`, if
it adds a script there.

### Test order

Every e2e run, kill or Metro experiment happens inside the manual lock
(`mkdir …/scratchpad/e2e.lock`, `trap 'rmdir …' EXIT`, retried every
30 s). Its logs go to
`/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/e2e-runner/`.
Unit tests use `fs.mkdtempSync(os.tmpdir())` and never touch the real
lock.

1. **The lock, test-first** (`e2e-lock.test.ts`, then `lock-file.ts` and
   `e2e-lock.ts`). One `it` per behaviour, Arrange-Act-Assert:
   - a free lock is acquired and its file holds the holder;
   - `release` removes it, a second `release` is a no-op, and `release`
     never removes a lock held by another pid;
   - a lock held by a live pid (the test's own `process.pid` written as
     another holder) makes `acquireLock` log "in use by pid …" and throw
     after `waitLimitMs`, naming the pid, the command and `startedAt`;
   - a lock released during the wait is acquired, with `waitedMs > 0` and
     the "acquired after waiting" line;
   - **`stale-lock-recovered`, unit:** a holder whose pid is dead (a
     spawned `node -e ""` that has exited) is taken over with the "stale"
     message; an unreadable file is taken over too;
   - **the race:** 8 `lock-contender` children try one free lock at once,
     and exactly one wins; then 8 try one stale lock at once, and exactly
     one wins.
2. **The interrupt path, test-first** (`interrupt.test.ts` with
   `interrupt-probe.ts` in a child process):
   - cleanups run last-registered-first;
   - the exit codes are 130 for SIGINT and 143 for SIGTERM;
   - a second signal during cleanup does not cut it short;
   - an unregistered cleanup is not run;
   - a cleanup that throws does not stop the others.
3. **Wiring.** The `package.json` scripts, then `docker.ts`, `services.ts`,
   `process.ts`, `environment.ts`. Then `pnpm lint`, `pnpm test` and
   `pnpm build` (`suite-green`). Commit.
4. **`suites-unchanged`.** `pnpm e2e:web` twice (25 passed each), then
   `pnpm e2e:mobile` twice (the flows of this branch, all passed).
5. **`runs-serialise`.** Two `pnpm e2e:web` started together in this
   worktree. Both pass, and exactly one log holds "lock acquired after
   waiting".
6. **`stale-lock-recovered`, real.** A lock file is written by hand with a
   dead pid; `pnpm e2e:web` logs the takeover and passes.
7. **`killed-run-leaves-nothing` and `containers-respected`.** A throwaway
   script, `kill-experiment.sh <web|mobile> <INT|TERM>`, copied into
   Notes:
   1. It snapshots `docker compose -p b-spot ps --status running
      --services`.
   2. It starts `pnpm e2e:<suite>` from the worktree root in its own
      process group (`perl -e 'use POSIX; setpgid(0,0); exec @ARGV'`).
   3. It waits for a mid-run marker in the log: Playwright's `Running 25
      tests` for web, the first passed flow for mobile.
   4. It sends SIGINT to the group (Ctrl-C), or SIGTERM to the pnpm pid
      only (`kill`).
   5. It waits up to 60 s for the runner's pid to be gone.
   6. Then it checks:
      - `lsof -nP -iTCP -sTCP:LISTEN` shows nothing on 4010, 4011, 3101,
        8182 or 8183;
      - the lock file is absent;
      - `pgrep -fl 'expo start|fixtures-server|dist/src/main.js|static-server|maestro|playwright'`
        is empty;
      - the compose snapshot is unchanged;
      - pnpm's exit code is non-zero.

   It runs four times: web and mobile, each with INT and with TERM. Two
   more runs kill during the preparation (`expo export`), with INT and
   with TERM. They show that the foreground children are tracked too. Any
   orphan found is stopped by hand before the manual lock is released, and
   recorded as a failure.
8. **README**, then gates again, `code-review`, close.

## Worklog

- 2026-11-04 (plan): read the spec, `AGENTS.md`, the discipline and the
  workflow, the reading list of `.agents/project.md` (the README, the
  journal, `docs/agent-rules/common.md`), `apps/e2e/env/*`, the archived
  work document of `20261104-1509-e2e-mobile-ignores-local-env`, and the
  `tsx` CLI's signal relay. `pnpm install` passed (exit 0). Probed signal
  delivery through `pnpm` → `pnpm --filter` → `tsx` versus `node --import
  tsx` (results in Program Design). No e2e environment was touched, so the
  manual lock was not needed.

- 2026-11-04 (code) — Plan approved with rulings (fd61276); `feat/e2e-tests`
  merged in (f5c318d), `pnpm install` again.
  - **Lock** (d01cb0f): `lock-file.ts` (link-publish, read, guarded stale
    removal, own-lock removal), `e2e-lock.ts` (attempt, bounded wait,
    messages), `e2e-environment-lock.ts` (path, holder of this run, wait
    limit, `exit` safety net). **Revision of the plan:** the planned
    `e2e-lock-path.ts` is named `e2e-environment-lock.ts`, because it also
    holds `acquireE2eEnvironmentLock`. The tests were red first (module
    missing), then green; the race tests (8 processes on a free lock, 8 on a
    stale one, exactly one winner) passed 3 runs out of 3. The thin
    path/wait-limit tests were written with the wrapper, not before it.
  - **Interrupt and busy ports** (d4c29ae): `interrupt.ts`, then
    `port-preflight.ts`. It checks 127.0.0.1 and ::1, and names the pid
    through `lsof -Fpc`. Both test-first. The first red of
    `interrupt.test.ts` hung (the probe could not import, so it never said
    `ready`); `waitForReady` now also resolves on exit.
  - **Wiring** (df42a1e): `apps/e2e/package.json` on `node --import tsx`;
    `docker.ts` split into `planContainers`/`startContainers` (the
    self-cleanup `catch` is gone: the teardown owns it); `services.ts`
    memoized `stop`, registered with `onInterrupt`; `process.ts` registers
    each foreground child; `environment.ts` lock → plan containers →
    port preflight → start → builds → services → run, with one memoized
    teardown on every path. **Found and fixed on the way:** `stopChild`
    returned a promise waiting for `exit` when the group leader had already
    died of a signal (`exitCode === null`, `signalCode` set), so `stop()`
    could hang. It now kills the group and resolves.
  - **Gates:** `pnpm typecheck` 0, `pnpm lint` 0, `pnpm test` 0,
    `pnpm build` 0 (apps/e2e: 25 unit tests).
  - **Real runs**, all inside the manual scratchpad lock (it was held by the
    native-login Crewmate at first; the wrapper waited):
    - `suites-unchanged`: `pnpm e2e:web` 25 passed (55.3 s), 25 passed
      (43.7 s); `pnpm e2e:mobile` 4/4 flows (2m 15s), 4/4 (2m 13s). Each run
      logged `e2e environment locked
      (/Users/tatiana/Workspace/perso/b-spot/.git/b-spot-e2e.lock.json)`;
      after each, ports free, lock free, no process left, containers
      `maildev postgres`.
    - `runs-serialise`: two `pnpm e2e:web` started together, both exit 0,
      25 passed each. One logged `in use by pid 2631 (pnpm e2e:web, …);
      waiting up to 20m00s` and then `lock acquired after waiting 1m04s`.
    - `stale-lock-recovered`: a hand-made lock with a dead pid; the run
      logged `lock left by pid 14956 (pnpm e2e:web (hand-made), /nowhere,
      since …) is stale: that process is gone; taking it over` and passed
      25.
    - `killed-run-leaves-nothing` and `containers-respected`: six runs of
      `kill-experiment.sh`, all PASS (exit 130 for SIGINT to the group,
      143 for SIGTERM to pnpm; ports 4010/4011/3101/8182/8183 free; lock
      free; no service process; containers unchanged): web×INT, web×TERM,
      mobile×INT, mobile×TERM during the run, and web×INT, web×TERM during
      `expo export`. No `expo export`, migration, Playwright or Maestro of
      this repo left either. Under Ctrl-C the logs show the expected
      `SIGINT received`, then `SIGINT received again` and `SIGTERM
      received again: already stopping`. Logs:
      `/private/tmp/claude-501/-Users-tatiana-Workspace-perso-b-spot/36a2459e-2eb2-4a85-8866-2c7ae0ff328b/scratchpad/e2e-runner/`.
    - No orphan had to be stopped by hand.
  - **README** (c3ca458): "One run at a time, and nothing left behind".

## Implementation Checkboxes

- [x] Lock unit tests red, then `lock-file.ts` + `e2e-lock.ts` +
  `e2e-environment-lock.ts` (planned as `e2e-lock-path.ts`) green, race included
- [x] Busy-port preflight (Architect ruling): `port-preflight.ts`, test-first
- [x] Interrupt unit tests red, then `interrupt.ts` green
- [x] Runner scripts on `node --import tsx`
- [x] `docker.ts` plan/start split
- [x] `services.ts` and `process.ts` register their children; memoized
  stop
- [x] `environment.ts`: lock first, memoized teardown, exit code on
  interrupt
- [x] Gates: `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build` (`suite-green`)
- [x] `suites-unchanged`: web ×2, mobile ×2
- [x] `runs-serialise`
- [x] `stale-lock-recovered` (real run)
- [x] `killed-run-leaves-nothing` + `containers-respected`: four kill
  runs, plus two during the preparation
- [x] README "End-to-end tests" paragraph
- [ ] `code-review`, findings below
- [ ] Close

## Notes & Snippets

### Decisions left open (for the Architect)

- **Where the lock file lives.** Recommended: in the git common directory,
  which is shared by construction and depends on no environment variable.
  The cost is that real runs write
  `/Users/tatiana/Workspace/perso/b-spot/.git/b-spot-e2e.lock.json`, inside
  the main checkout's `.git`, and the brief forbids touching
  `/Users/tatiana/Workspace/perso/b-spot`. The alternative is
  `os.tmpdir()`: per user and machine-wide, so it also covers a separate
  clone, which shares the same ports. But `TMPDIR` can differ between a
  sandboxed shell and a terminal, and then two runs would not see each
  other.
- **A port already in use before the services start.** Today
  `spawnService`'s readiness check accepts any listener. An orphan left by
  a `SIGKILL`ed run, which no handler can catch, would be taken for the new
  service, and the suite would run against stale code. Recommended: a
  cheap preflight in `environment.ts` that fails fast, naming the busy
  port and the `lsof` command, with no automatic kill. It is outside the
  spec's letter; include it, or leave it as a follow-up.
- **The started-containers path is not exercised for real.** Postgres and
  MailDev are running and must not be stopped, so the kill experiments
  prove that pre-existing containers survive (`containers-respected`).
  They do not prove that a container the run started is stopped.
  Recommended: accept, with the `planContainers` split reviewed by eye.
- **The kill-experiment script** stays in the scratchpad, with its text
  copied into these Notes, and is not committed. Recommended: as is; it is
  a one-off proof, and CI is out of scope.
- **The default wait limit is 20 min**, overridable with
  `E2E_LOCK_WAIT_MINUTES`. Recommended: as is.

### Signal probe (throwaway)

`signal-probe/package.json` scripts: `outer` = `pnpm run inner`, `inner` =
`<tsx bin> probe.ts`; `outernode`/`innernode` the same with `node --import
<tsx esm loader> probe.ts`. Each run: start in its own process group, wait
for the probe to be ready, `kill -INT -- -<pgid>`, wait 6 s, read the
probe's trace file. Results are in the table in Program Design.

### Kill experiment script (throwaway, scratchpad)

`kill-experiment.sh`, with `check-leftovers.sh` (ports, lock file, service processes, containers) and `stop-orphans.sh` (used only when a check fails). Every call was wrapped in `with-manual-lock.sh`.

```bash
#!/bin/bash
# kill-experiment.sh <web|mobile> <INT|TERM> <run|prepare>
# Starts `pnpm e2e:<suite>` in its own process group, waits for a marker,
# sends SIGINT to the whole group (as Ctrl-C does) or SIGTERM to pnpm only
# (as `kill` does), then checks what is left. Run inside the manual lock.
SUITE=$1; SIG=$2; PHASE=$3
L=$(dirname "$0"); LOG=$L/kill-$SUITE-$SIG-$PHASE.log
case "$SUITE-$PHASE" in
  web-run) MARKER='Running 25 tests' ;;
  web-prepare) MARKER='exporting the web app' ;;
  mobile-run) MARKER='\[Passed\]' ;;
  *) echo "unknown case"; exit 2 ;;
esac
BEFORE=$(docker compose -p b-spot ps --status running --services | sort | tr '\n' ' ')
cd /Users/tatiana/Workspace/perso/b-spot-e2e-runner
perl -e 'use POSIX; setpgid(0,0); exec @ARGV' pnpm e2e:$SUITE > "$LOG" 2>&1 &
PNPM=$!
for _ in $(seq 1 600); do grep -qE "$MARKER" "$LOG" && break; sleep 1; done
sleep 3
RUNNER=$(pgrep -f "node --import tsx env/(run-web|ios/run-mobile).ts" | head -1)
echo "== $SUITE $SIG during $PHASE: pnpm=$PNPM runner=$RUNNER"
if [ "$SIG" = INT ]; then kill -INT -- -$PNPM; else kill -TERM $PNPM; fi
START=$(date +%s)
wait $PNPM; CODE=$?
for _ in $(seq 1 60); do kill -0 "$RUNNER" 2>/dev/null || break; sleep 1; done
echo "pnpm exit=$CODE after $(( $(date +%s) - START ))s; runner alive: $(kill -0 "$RUNNER" 2>/dev/null && echo yes || echo no)"
sleep 2
grep -E '\[e2e\] (SIG|.* stopped|lock)' "$LOG" | tail -8
"$L/check-leftovers.sh"; LEFT=$?
AFTER=$(docker compose -p b-spot ps --status running --services | sort | tr '\n' ' ')
echo "containers before: $BEFORE / after: $AFTER -> $([ "$BEFORE" = "$AFTER" ] && echo unchanged || echo CHANGED)"
[ $LEFT -eq 0 ] && [ $CODE -ne 0 ] && [ "$BEFORE" = "$AFTER" ] && echo "RESULT: PASS" || echo "RESULT: FAIL"
```

`check-leftovers.sh`:

```bash
#!/bin/bash
# Prints what an e2e run may have left behind; exit 1 if anything.
STATUS=0
PORTS=$(lsof -nP -iTCP -sTCP:LISTEN 2>/dev/null | grep -E ':(4010|4011|3101|8182|8183) ')
if [ -n "$PORTS" ]; then echo "LEFTOVER PORTS:"; echo "$PORTS"; STATUS=1; else echo "ports 4010 4011 3101 8182 8183: free"; fi
LOCK=/Users/tatiana/Workspace/perso/b-spot/.git/b-spot-e2e.lock.json
if [ -e "$LOCK" ]; then echo "LOCK PRESENT: $(cat $LOCK)"; STATUS=1; else echo "lock: free"; fi
PROCS=$(pgrep -fl 'expo start|fixtures-server/server.ts|dist/src/main.js|static-server.ts|maestro test|playwright test|run-web.ts|run-mobile.ts' | grep -v -- '-native-login' )
if [ -n "$PROCS" ]; then echo "LEFTOVER PROCESSES:"; echo "$PROCS"; STATUS=1; else echo "processes: none"; fi
echo "containers running: $(docker compose -p b-spot ps --status running --services 2>/dev/null | sort | tr '\n' ' ')"
exit $STATUS
```

### Rulings — Architect, 2026-11-04

- **Lock location:** the git common dir (`<common dir>/b-spot-e2e.lock.json`),
  with `E2E_LOCK_FILE` as an override. Writing one untracked file inside the
  main checkout's `.git` is accepted for real runs and their tests, nothing
  else there. Never touch anything else in that `.git`, and never touch the
  main checkout's working tree. Reported to the human.
- **Busy-port preflight:** included in this task. It fails fast and names
  the port and, when cheaply available, the pid holding it. It never kills
  anything automatically.
- **Stopping a container the run started:** checked in code review only.
  Accepted.
- **The kill-experiment script:** stays in the scratchpad, with its text in
  the work document.
- **Wait limit:** 20 minutes, overridable.
- **Launcher:** switch to `node --import tsx`. Accepted.
- **Branch:** merged with `feat/e2e-tests` at approval. That brings the
  typecheck gate: `pnpm typecheck` must stay green. `apps/e2e/package.json`
  gained a `typecheck` script.

## Diff-Review Findings

_(empty until `code-review` runs)_

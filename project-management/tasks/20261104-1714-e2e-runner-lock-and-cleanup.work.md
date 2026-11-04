# e2e runs take the lock themselves and clean up when killed — work

Created by the Crewmate at the plan step, 2026-11-04. Spec:
`project-management/tasks/20261104-1714-e2e-runner-lock-and-cleanup.spec.md`.

**Plan:** waiting for the Architect's reading.

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

## Implementation Checkboxes

- [ ] Lock unit tests red, then `lock-file.ts` + `e2e-lock.ts` +
  `e2e-lock-path.ts` green (race included)
- [ ] Interrupt unit tests red, then `interrupt.ts` green
- [ ] Runner scripts on `node --import tsx`
- [ ] `docker.ts` plan/start split
- [ ] `services.ts` and `process.ts` register their children; memoized
  stop
- [ ] `environment.ts`: lock first, memoized teardown, exit code on
  interrupt
- [ ] Gates: `pnpm lint`, `pnpm test`, `pnpm build` (`suite-green`)
- [ ] `suites-unchanged`: web ×2, mobile ×2
- [ ] `runs-serialise`
- [ ] `stale-lock-recovered` (real run)
- [ ] `killed-run-leaves-nothing` + `containers-respected`: four kill
  runs, plus two during the preparation
- [ ] README "End-to-end tests" paragraph
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

## Diff-Review Findings

_(empty until `code-review` runs)_

/**
 * The e2e environment's lock for this run: one file shared by every worktree
 * of the repo (in the git common directory), held by this process.
 */
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { REPO_ROOT } from '../e2e-env';
import { HeldLock, LockHolder, acquireLock } from './e2e-lock';

export const LOCK_FILE_NAME = 'b-spot-e2e.lock.json';
/** Overrides the lock's path (experiments and tests). */
export const LOCK_FILE_VARIABLE = 'E2E_LOCK_FILE';
/** Overrides the bounded wait, in minutes. */
export const LOCK_WAIT_VARIABLE = 'E2E_LOCK_WAIT_MINUTES';
const DEFAULT_WAIT_MINUTES = 20;
const POLL_MS = 2_000;

function findGitCommonDir(): string {
  const args = ['rev-parse', '--path-format=absolute', '--git-common-dir'];
  return execFileSync('git', args, { cwd: REPO_ROOT, encoding: 'utf8', stdio: 'pipe' }).trim();
}

/** `$E2E_LOCK_FILE`, else `<git common dir>/b-spot-e2e.lock.json`, else the temp dir. */
export function resolveE2eLockPath(): string {
  const override = process.env[LOCK_FILE_VARIABLE];
  if (override) return path.resolve(override);
  try {
    return path.join(findGitCommonDir(), LOCK_FILE_NAME);
  } catch {
    const fallback = path.join(os.tmpdir(), LOCK_FILE_NAME);
    console.warn(`[e2e] no git repository found; the e2e lock falls back to ${fallback}`);
    return fallback;
  }
}

/** The bounded wait: `$E2E_LOCK_WAIT_MINUTES`, 20 minutes by default. */
export function resolveLockWaitMs(): number {
  const minutes = Number(process.env[LOCK_WAIT_VARIABLE] ?? DEFAULT_WAIT_MINUTES);
  const isValid = Number.isFinite(minutes) && minutes >= 0;
  return (isValid ? minutes : DEFAULT_WAIT_MINUTES) * 60_000;
}

/** This run as a lock holder, e.g. `pnpm e2e:web --project=web`. */
export function describeCurrentRun(): LockHolder {
  const script = process.env.npm_lifecycle_event;
  const extraArgs = process.argv.slice(2);
  const command = script ? ['pnpm', script, ...extraArgs] : process.argv.slice(1);
  return {
    pid: process.pid,
    command: command.join(' '),
    worktree: REPO_ROOT,
    startedAt: new Date().toISOString(),
  };
}

/** Takes the e2e environment for this run; the lock is also released when the process exits. */
export async function acquireE2eEnvironmentLock(): Promise<HeldLock> {
  const lockPath = resolveE2eLockPath();
  const lock = await acquireLock({
    path: lockPath,
    holder: describeCurrentRun(),
    waitLimitMs: resolveLockWaitMs(),
    pollMs: POLL_MS,
    log: (message) => console.log(message),
  });
  console.log(`[e2e] e2e environment locked (${lockPath})`);
  process.once('exit', lock.release);
  return lock;
}

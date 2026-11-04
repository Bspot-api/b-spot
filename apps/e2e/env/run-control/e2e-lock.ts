/**
 * The exclusive lock on the e2e environment (one database, fixed ports):
 * acquire with a bounded wait, take over a lock whose holder is dead,
 * release only one's own lock.
 */
import { sleep } from '../../support/wait';
import {
  HolderReading,
  LockHolder,
  hasErrorCode,
  readHolder,
  removeOwnLock,
  removeStaleLock,
  tryCreateLock,
} from './lock-file';

export type { LockHolder } from './lock-file';

const MS_PER_SECOND = 1_000;
const SECONDS_PER_MINUTE = 60;
const NOTICE_EVERY_MS = SECONDS_PER_MINUTE * MS_PER_SECOND;

export interface LockOptions {
  path: string;
  holder: LockHolder;
  waitLimitMs: number;
  pollMs: number;
  log: (message: string) => void;
}

/** A held lock; `release` is synchronous and idempotent. */
export interface HeldLock {
  release: () => void;
}

/** What one try needs: the lock, who takes it, where to say a stale lock was taken over. */
export type LockAttemptOptions = Pick<LockOptions, 'path' | 'holder' | 'log'>;

/** One try: acquired, or blocked by `holder` (undefined when the lock just vanished). */
export type LockAttempt = { isAcquired: true } | { isAcquired: false; holder: HolderReading };

/** A holder is alive while its pid exists (EPERM: it exists under another user). */
function isHolderAlive(holder: LockHolder): boolean {
  try {
    process.kill(holder.pid, 0);
    return true;
  } catch (error) {
    return hasErrorCode(error, 'EPERM');
  }
}

function describeHolder(holder: HolderReading): string {
  if (holder === undefined) return 'an unknown process';
  if (holder === 'unreadable') return 'an unreadable lock file';
  return `pid ${holder.pid} (${holder.command}, ${holder.worktree}, since ${holder.startedAt})`;
}

function isStale(holder: HolderReading): holder is LockHolder | 'unreadable' {
  return holder === 'unreadable' || (holder !== undefined && !isHolderAlive(holder));
}

/** Tries the lock once, taking over a stale one. */
export function attemptLock({ path: lockPath, holder, log }: LockAttemptOptions): LockAttempt {
  if (tryCreateLock(lockPath, holder)) return { isAcquired: true };
  const current = readHolder(lockPath);
  if (!isStale(current)) return { isAcquired: false, holder: current };
  if (removeStaleLock(lockPath, current)) {
    log(
      `[e2e] lock left by ${describeHolder(current)} is stale: that process is gone; taking it over`,
    );
    if (tryCreateLock(lockPath, holder)) return { isAcquired: true };
  }
  return { isAcquired: false, holder: readHolder(lockPath) };
}

function formatDuration(ms: number): string {
  const seconds = Math.round(ms / MS_PER_SECOND);
  const minutes = Math.floor(seconds / SECONDS_PER_MINUTE);
  return `${minutes}m${String(seconds % SECONDS_PER_MINUTE).padStart(2, '0')}s`;
}

function holdLock(options: LockOptions, waitedMs: number): HeldLock {
  if (waitedMs > 0) options.log(`[e2e] lock acquired after waiting ${formatDuration(waitedMs)}`);
  return { release: () => removeOwnLock(options.path, options.holder) };
}

function buildGiveUpError(options: LockOptions, holder: HolderReading): Error {
  const limit = formatDuration(options.waitLimitMs);
  return new Error(
    `[e2e] gave up after ${limit}: the e2e environment is still held by ${describeHolder(holder)}; ` +
      `lock file ${options.path} (remove it only if that process is not an e2e run)`,
  );
}

/** Acquires the lock, waiting up to `waitLimitMs` while a live run holds it. */
export async function acquireLock(options: LockOptions): Promise<HeldLock> {
  const startedAt = Date.now();
  let lastNoticeAt = Number.NEGATIVE_INFINITY;
  let hasWaited = false;
  for (;;) {
    const attempt = attemptLock(options);
    if (attempt.isAcquired) return holdLock(options, hasWaited ? Date.now() - startedAt : 0);
    if (Date.now() - startedAt >= options.waitLimitMs)
      throw buildGiveUpError(options, attempt.holder);
    if (Date.now() - lastNoticeAt >= NOTICE_EVERY_MS) {
      const limit = formatDuration(options.waitLimitMs);
      options.log(
        `[e2e] the e2e environment is in use by ${describeHolder(attempt.holder)}; waiting up to ${limit}`,
      );
      lastNoticeAt = Date.now();
    }
    hasWaited = true;
    await sleep(options.pollMs);
  }
}

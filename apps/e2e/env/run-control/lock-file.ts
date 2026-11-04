/**
 * The raw file operations of the e2e lock. The lock is one JSON file holding
 * its holder; it is published with `link(2)`, so it never exists without its
 * complete holder, and creating it fails when it already exists.
 */
import fs from 'node:fs';

/** Who holds the e2e environment. */
export interface LockHolder {
  pid: number;
  command: string;
  worktree: string;
  startedAt: string;
}

/** The lock's content: its holder, `unreadable` for a corrupt file, `undefined` when free. */
export type HolderReading = LockHolder | 'unreadable' | undefined;

/** A takeover guard older than this was left by a dead process (the guarded section is sync). */
const TAKEOVER_GUARD_STALE_MS = 10_000;

/** Whether `error` is a Node system error with this `code`. */
export function hasErrorCode(error: unknown, code: string): boolean {
  return error instanceof Error && (error as NodeJS.ErrnoException).code === code;
}

function isLockHolder(value: unknown): value is LockHolder {
  if (typeof value !== 'object' || value === null) return false;
  const fields = value as Record<string, unknown>;
  return (
    typeof fields.pid === 'number' &&
    typeof fields.command === 'string' &&
    typeof fields.worktree === 'string' &&
    typeof fields.startedAt === 'string'
  );
}

function parseHolder(text: string): LockHolder | 'unreadable' {
  try {
    const parsed: unknown = JSON.parse(text);
    return isLockHolder(parsed) ? parsed : 'unreadable';
  } catch {
    return 'unreadable';
  }
}

/** Reads the lock at `lockPath`. */
export function readHolder(lockPath: string): HolderReading {
  try {
    return parseHolder(fs.readFileSync(lockPath, 'utf8'));
  } catch (error) {
    if (hasErrorCode(error, 'ENOENT')) return undefined;
    throw error;
  }
}

/** Whether two readings name the same holder. */
export function isSameHolder(left: HolderReading, right: HolderReading): boolean {
  if (left === undefined || right === undefined) return false;
  if (left === 'unreadable' || right === 'unreadable') return left === right;
  return left.pid === right.pid && left.startedAt === right.startedAt;
}

/** Creates the lock for `holder`; false when it already exists. */
export function tryCreateLock(lockPath: string, holder: LockHolder): boolean {
  const draft = `${lockPath}.${process.pid}.tmp`;
  fs.writeFileSync(draft, JSON.stringify(holder));
  try {
    fs.linkSync(draft, lockPath);
    return true;
  } catch (error) {
    if (hasErrorCode(error, 'EEXIST')) return false;
    throw error;
  } finally {
    fs.rmSync(draft, { force: true });
  }
}

function isGuardStale(guardPath: string): boolean {
  try {
    return Date.now() - fs.statSync(guardPath).mtimeMs > TAKEOVER_GUARD_STALE_MS;
  } catch {
    return false;
  }
}

/** Takes the takeover guard, so that only one process replaces a stale lock at a time. */
function tryTakeGuard(guardPath: string): boolean {
  try {
    fs.mkdirSync(guardPath);
    return true;
  } catch (error) {
    if (!hasErrorCode(error, 'EEXIST')) throw error;
    if (isGuardStale(guardPath)) fs.rmSync(guardPath, { recursive: true, force: true });
    return false;
  }
}

/** Removes the lock if it still holds `seen`; false when another process got there first. */
export function removeStaleLock(lockPath: string, seen: HolderReading): boolean {
  const guardPath = `${lockPath}.takeover`;
  if (!tryTakeGuard(guardPath)) return false;
  try {
    if (!isSameHolder(readHolder(lockPath), seen)) return false;
    fs.rmSync(lockPath, { force: true });
    return true;
  } finally {
    fs.rmSync(guardPath, { recursive: true, force: true });
  }
}

/** Removes the lock only while `holder` still holds it. */
export function removeOwnLock(lockPath: string, holder: LockHolder): void {
  if (isSameHolder(readHolder(lockPath), holder)) fs.rmSync(lockPath, { force: true });
}

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { afterEach, describe, it } from 'node:test';
import {
  LOCK_FILE_NAME,
  LOCK_FILE_VARIABLE,
  LOCK_WAIT_VARIABLE,
  resolveE2eLockPath,
  resolveLockWaitMs,
} from './e2e-environment-lock';

const savedLockFile = process.env[LOCK_FILE_VARIABLE];
const savedWait = process.env[LOCK_WAIT_VARIABLE];

function restore(name: string, value: string | undefined): void {
  if (value === undefined) delete process.env[name];
  else process.env[name] = value;
}

afterEach(() => {
  restore(LOCK_FILE_VARIABLE, savedLockFile);
  restore(LOCK_WAIT_VARIABLE, savedWait);
});

describe('resolveE2eLockPath', () => {
  it('puts the lock in the git common directory, shared by every worktree', () => {
    delete process.env[LOCK_FILE_VARIABLE];
    const args = ['rev-parse', '--path-format=absolute', '--git-common-dir'];
    const commonDir = execFileSync('git', args, { cwd: __dirname, encoding: 'utf8' }).trim();

    const actualPath = resolveE2eLockPath();

    assert.equal(actualPath, path.join(commonDir, LOCK_FILE_NAME));
  });

  it('honours the E2E_LOCK_FILE override', () => {
    process.env[LOCK_FILE_VARIABLE] = '/tmp/some-e2e.lock.json';

    const actualPath = resolveE2eLockPath();

    assert.equal(actualPath, '/tmp/some-e2e.lock.json');
  });
});

describe('resolveLockWaitMs', () => {
  it('waits 20 minutes by default', () => {
    delete process.env[LOCK_WAIT_VARIABLE];

    assert.equal(resolveLockWaitMs(), 20 * 60_000);
  });

  it('honours E2E_LOCK_WAIT_MINUTES, and ignores a value that is not a number', () => {
    process.env[LOCK_WAIT_VARIABLE] = '0.5';
    const actualOverride = resolveLockWaitMs();
    process.env[LOCK_WAIT_VARIABLE] = 'soon';

    const actualFallback = resolveLockWaitMs();

    assert.equal(actualOverride, 30_000);
    assert.equal(actualFallback, 20 * 60_000);
  });
});

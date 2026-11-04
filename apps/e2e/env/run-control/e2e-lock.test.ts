import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, it } from 'node:test';
import { LockHolder, LockOptions, acquireLock } from './e2e-lock';

const E2E_ROOT = path.resolve(__dirname, '..', '..');
const CONTENDER = path.join(__dirname, 'test-fixtures', 'lock-contender.ts');
const CONTENDERS = 8;

let lockDir = '';
let lockPath = '';
let messages: string[] = [];

function buildHolder(overrides: Partial<LockHolder> = {}): LockHolder {
  return {
    pid: process.pid,
    command: 'pnpm e2e:web',
    worktree: '/tmp/worktree',
    startedAt: new Date().toISOString(),
    ...overrides,
  };
}

function buildOptions(overrides: Partial<LockOptions> = {}): LockOptions {
  return {
    path: lockPath,
    holder: buildHolder(),
    waitLimitMs: 0,
    pollMs: 20,
    log: (message) => messages.push(message),
    ...overrides,
  };
}

function writeLock(holder: LockHolder): void {
  fs.writeFileSync(lockPath, JSON.stringify(holder));
}

function readLock(): unknown {
  return JSON.parse(fs.readFileSync(lockPath, 'utf8'));
}

/** A pid that existed and has exited. */
function findDeadPid(): number {
  const result = spawnSync(process.execPath, ['-e', '']);
  return result.pid;
}

/** Starts `count` contenders on the lock at the same instant; resolves with their verdicts. */
function raceContenders(count: number): Promise<string[]> {
  const goAt = String(Date.now() + 1500);
  const runs = Array.from({ length: count }, () => {
    const child = spawn(process.execPath, ['--import', 'tsx', CONTENDER, lockPath, goAt], {
      cwd: E2E_ROOT,
    });
    let output = '';
    child.stdout.on('data', (chunk: Buffer) => (output += chunk.toString()));
    return new Promise<string>((resolve) => child.on('exit', () => resolve(output.trim())));
  });
  return Promise.all(runs);
}

beforeEach(() => {
  lockDir = fs.mkdtempSync(path.join(os.tmpdir(), 'e2e-lock-test-'));
  lockPath = path.join(lockDir, 'b-spot-e2e.lock.json');
  messages = [];
});

afterEach(() => {
  fs.rmSync(lockDir, { recursive: true, force: true });
});

describe('acquireLock on a free lock', () => {
  it('acquires a free lock and writes its holder', async () => {
    const inputOptions = buildOptions();

    const actualLock = await acquireLock(inputOptions);

    assert.deepEqual(readLock(), inputOptions.holder);
    assert.equal(actualLock.waitedMs >= 0, true);
  });
});

describe('releasing the lock', () => {
  it('release removes the lock, and a second release is a no-op', async () => {
    const actualLock = await acquireLock(buildOptions());

    actualLock.release();
    actualLock.release();

    assert.equal(fs.existsSync(lockPath), false);
  });

  it('release never removes a lock that another run now holds', async () => {
    const actualLock = await acquireLock(buildOptions());
    const otherHolder = buildHolder({ startedAt: '2026-01-01T00:00:00.000Z' });
    writeLock(otherHolder);

    actualLock.release();

    assert.deepEqual(readLock(), otherHolder);
  });
});

describe('acquireLock on a live holder', () => {
  it('waits on a live holder, then fails naming its pid, command and start time', async () => {
    const liveHolder = buildHolder({
      command: 'pnpm e2e:mobile',
      startedAt: '2026-11-04T10:00:00Z',
    });
    writeLock(liveHolder);

    const actualAttempt = acquireLock(buildOptions({ waitLimitMs: 100 }));

    await assert.rejects(actualAttempt, (error: Error) => {
      assert.match(error.message, new RegExp(`pid ${process.pid}`));
      assert.match(error.message, /pnpm e2e:mobile/);
      assert.match(error.message, /2026-11-04T10:00:00Z/);
      return true;
    });
    assert.match(messages.join('\n'), /in use by pid/);
  });

  it('acquires a lock released during the wait, and says it waited', async () => {
    writeLock(buildHolder({ startedAt: '2026-11-04T10:00:00Z' }));
    setTimeout(() => fs.rmSync(lockPath), 150);

    const actualLock = await acquireLock(buildOptions({ waitLimitMs: 5_000 }));

    assert.equal(actualLock.waitedMs > 0, true);
    assert.match(messages.join('\n'), /lock acquired after waiting/);
  });
});

describe('acquireLock on a stale lock', () => {
  it('takes over a lock whose holder is dead, with a message', async () => {
    const deadPid = findDeadPid();
    writeLock(buildHolder({ pid: deadPid }));
    const inputOptions = buildOptions();

    await acquireLock(inputOptions);

    assert.deepEqual(readLock(), inputOptions.holder);
    assert.match(messages.join('\n'), new RegExp(`pid ${deadPid} .*stale`));
  });

  it('takes over an unreadable lock file', async () => {
    fs.writeFileSync(lockPath, '{not json');
    const inputOptions = buildOptions();

    await acquireLock(inputOptions);

    assert.deepEqual(readLock(), inputOptions.holder);
    assert.match(messages.join('\n'), /stale/);
  });
});

describe('the lock under a race', () => {
  it('lets exactly one of several processes take a free lock', async () => {
    const actualVerdicts = await raceContenders(CONTENDERS);

    assert.equal(actualVerdicts.filter((verdict) => verdict === 'won').length, 1);
    assert.equal(actualVerdicts.length, CONTENDERS);
  });

  it('lets exactly one of several processes take over a stale lock', async () => {
    writeLock(buildHolder({ pid: findDeadPid() }));

    const actualVerdicts = await raceContenders(CONTENDERS);

    assert.equal(actualVerdicts.filter((verdict) => verdict === 'won').length, 1);
  });
});

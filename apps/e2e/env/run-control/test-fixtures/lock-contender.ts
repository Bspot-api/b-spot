/**
 * Test fixture for e2e-lock.test.ts: waits until `goAt`, tries the lock at
 * `lockPath` once, prints `won` or `lost`, and stays alive (holding the lock
 * when it won) long enough for every contender to have tried.
 */
import { attemptLock } from '../e2e-lock';
import { sleep } from '../../../support/wait';

const HOLD_MS = 1_500;

async function contend(lockPath: string, goAt: number): Promise<void> {
  await sleep(Math.max(0, goAt - Date.now()));
  const holder = {
    pid: process.pid,
    command: 'lock-contender',
    worktree: process.cwd(),
    startedAt: new Date().toISOString(),
  };
  const attempt = attemptLock(lockPath, holder, (message) => console.error(message));
  console.log(attempt.isAcquired ? 'won' : 'lost');
  await sleep(HOLD_MS);
}

void contend(process.argv[2] ?? '', Number(process.argv[3]));

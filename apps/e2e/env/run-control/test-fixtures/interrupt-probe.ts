/**
 * Test fixture for interrupt.test.ts: registers named cleanups (one slow,
 * one failing, one unregistered), prints `ready`, and waits for a signal.
 */
import { onInterrupt } from '../interrupt';
import { sleep } from '../../../support/wait';

const SLOW_CLEANUP_MS = 800;

function register(name: string, delayMs = 0): () => void {
  return onInterrupt(async () => {
    await sleep(delayMs);
    console.log(`cleanup ${name}`);
  });
}

register('first', SLOW_CLEANUP_MS);
register('second');
onInterrupt(() => Promise.reject(new Error('cleanup failure')));
const unregisterSkipped = register('skipped');
register('third');
unregisterSkipped();
console.log('ready');
setInterval(() => undefined, 1_000);

/**
 * Test fixture for interrupt.test.ts: registers named cleanups (one slow,
 * one failing, one unregistered, one that tries a late start), prints
 * `ready`, and waits for a signal.
 */
import { assertNotInterrupted, onInterrupt } from '../interrupt';
import { sleep } from '../../../support/wait';

const SLOW_CLEANUP_MS = 800;

function register(name: string, delayMs = 0): () => void {
  return onInterrupt(async () => {
    await sleep(delayMs);
    console.log(`cleanup ${name}`);
  });
}

onInterrupt(async () => {
  try {
    assertNotInterrupted('a late child');
    console.log('cleanup started a late child');
  } catch {
    console.log('cleanup refused a late child');
  }
});
register('first', SLOW_CLEANUP_MS);
register('second');
onInterrupt(() => Promise.reject(new Error('cleanup failure')));
const unregisterSkipped = register('skipped');
register('third');
unregisterSkipped();
console.log('ready');
setInterval(() => undefined, 1_000);

/**
 * The e2e run's exit path on SIGINT and SIGTERM. Whatever the run started
 * registers its cleanup here; on the first signal the cleanups run
 * last-registered-first, then the process exits 128 + the signal number.
 * Repeated signals (one Ctrl-C reaches the runner up to three times through
 * pnpm) are logged and ignored, never escalated.
 */
import os from 'node:os';
import { sleep } from '../../support/wait';

export type Cleanup = () => Promise<void>;

const INTERRUPT_SIGNALS = ['SIGINT', 'SIGTERM'] as const;
/** `compose stop` alone may wait 10 s per container. */
const CLEANUP_DEADLINE_MS = 45_000;
/** A process killed by signal n exits 128 + n (the shell convention). */
const SIGNAL_EXIT_CODE_BASE = 128;

const cleanups: Cleanup[] = [];
let receivedSignal: NodeJS.Signals | undefined;
let isInstalled = false;

/** 130 for SIGINT, 143 for SIGTERM. */
export function computeSignalExitCode(signal: NodeJS.Signals): number {
  return SIGNAL_EXIT_CODE_BASE + os.constants.signals[signal];
}

/** The signal that interrupted this run, if any. */
export function getInterruptSignal(): NodeJS.Signals | undefined {
  return receivedSignal;
}

/**
 * Refuses to start `what` once the run is interrupted: the cleanups already
 * running would not know it, and it would outlive the run.
 */
export function assertNotInterrupted(what: string): void {
  if (receivedSignal)
    throw new Error(`[e2e] not starting ${what}: the run is stopping (${receivedSignal})`);
}

async function runCleanups(): Promise<void> {
  for (const cleanup of [...cleanups].reverse()) {
    try {
      await cleanup();
    } catch (error) {
      console.error('[e2e] a cleanup failed:', error);
    }
  }
}

async function handleSignal(signal: NodeJS.Signals): Promise<void> {
  if (receivedSignal) {
    console.log(`[e2e] ${signal} received again: already stopping`);
    return;
  }
  receivedSignal = signal;
  console.log(`[e2e] ${signal} received: stopping what this run started`);
  const isDone = await Promise.race([
    runCleanups().then(() => true),
    sleep(CLEANUP_DEADLINE_MS).then(() => false),
  ]);
  if (!isDone)
    console.error(`[e2e] cleanup still running after ${CLEANUP_DEADLINE_MS} ms; exiting`);
  process.exit(computeSignalExitCode(signal));
}

function installHandlers(): void {
  if (isInstalled) return;
  isInstalled = true;
  for (const signal of INTERRUPT_SIGNALS) process.on(signal, () => void handleSignal(signal));
}

/** Registers `cleanup` for an interrupt; returns the function that unregisters it. */
export function onInterrupt(cleanup: Cleanup): () => void {
  installHandlers();
  cleanups.push(cleanup);
  return () => {
    const index = cleanups.lastIndexOf(cleanup);
    if (index >= 0) cleanups.splice(index, 1);
  };
}

import assert from 'node:assert/strict';
import { ChildProcess, spawn } from 'node:child_process';
import path from 'node:path';
import { describe, it } from 'node:test';
import { sleep } from '../../support/wait';

const E2E_ROOT = path.resolve(__dirname, '..', '..');
const PROBE = path.join(__dirname, 'test-fixtures', 'interrupt-probe.ts');

interface ProbeRun {
  exitCode: number | null;
  lines: string[];
}

/** Resolves once the probe printed `ready`, or exited before (a broken probe fails, never hangs). */
function waitForReady(child: ChildProcess, lines: string[]): Promise<void> {
  return new Promise((resolve) => {
    child.once('exit', () => resolve());
    child.stdout?.on('data', (chunk: Buffer) => {
      lines.push(...chunk.toString().split('\n').filter(Boolean));
      if (lines.includes('ready')) resolve();
    });
  });
}

/** Starts the probe, sends `signals` 100 ms apart once it is ready, and waits for its exit. */
async function interruptProbe(signals: readonly NodeJS.Signals[]): Promise<ProbeRun> {
  const child = spawn(process.execPath, ['--import', 'tsx', PROBE], { cwd: E2E_ROOT });
  const lines: string[] = [];
  const exited = new Promise<number | null>((resolve) => child.on('exit', resolve));
  await waitForReady(child, lines);
  for (const signal of signals) {
    child.kill(signal);
    await sleep(100);
  }
  return { exitCode: await exited, lines: lines.filter((line) => line.startsWith('cleanup')) };
}

const EXPECTED_ORDER = [
  'cleanup third',
  'cleanup second',
  'cleanup first',
  'cleanup refused a late child',
];

describe('onInterrupt', () => {
  it('runs the cleanups last-registered-first on SIGINT, refuses late starts, exits 130', async () => {
    const actualRun = await interruptProbe(['SIGINT']);

    assert.deepEqual(actualRun.lines, EXPECTED_ORDER);
    assert.equal(actualRun.exitCode, 130);
  });

  it('exits 143 on SIGTERM', async () => {
    const actualRun = await interruptProbe(['SIGTERM']);

    assert.deepEqual(actualRun.lines, EXPECTED_ORDER);
    assert.equal(actualRun.exitCode, 143);
  });

  it('lets a repeated signal neither cut the cleanup short nor change the exit code', async () => {
    const actualRun = await interruptProbe(['SIGINT', 'SIGINT', 'SIGTERM']);

    assert.deepEqual(actualRun.lines, EXPECTED_ORDER);
    assert.equal(actualRun.exitCode, 130);
  });
});

import { ChildProcess, spawn } from 'node:child_process';
import { sleep } from '../support/wait';
import { onInterrupt } from './run-control/interrupt';

const READY_STEP_MS = 500;
const READY_TIMEOUT_MS = 120_000;
const STOP_GRACE_MS = 5_000;

/** A long-running process of the e2e environment, ready once `readyUrl` answers. */
export interface ServiceDefinition {
  name: string;
  command: string;
  args: readonly string[];
  cwd: string;
  env?: Record<string, string>;
  readyUrl: string;
  /** Optional check of the ready answer's body (e.g. Metro's status text). */
  readyBody?: string;
}

/**
 * A started service; `stop` kills its process group and resolves once it
 * exited. It is idempotent, and also runs when the run is interrupted.
 */
export interface RunningService {
  name: string;
  stop: () => Promise<void>;
}

async function isAnswering(definition: ServiceDefinition): Promise<boolean> {
  const response = await fetch(definition.readyUrl);
  if (!response.ok) return false;
  if (!definition.readyBody) return true;
  return (await response.text()).includes(definition.readyBody);
}

async function waitUntilReady(definition: ServiceDefinition, child: ChildProcess): Promise<void> {
  const deadline = Date.now() + READY_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`[e2e] ${definition.name} exited with code ${child.exitCode} before ready`);
    }
    if (await isAnswering(definition).catch(() => false)) return;
    await sleep(READY_STEP_MS);
  }
  throw new Error(`[e2e] ${definition.name} not ready on ${definition.readyUrl}`);
}

function killGroup(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(-pid, signal);
  } catch {
    // The group is already gone.
  }
}

/** Kills the service's whole process group (pnpm/tsx spawn children of their own). */
function stopChild(name: string, child: ChildProcess): Promise<void> {
  if (child.pid === undefined) return Promise.resolve();
  const pid = child.pid;
  if (child.exitCode !== null || child.signalCode !== null) {
    // The leader is gone; what it spawned may still run in its group.
    killGroup(pid, 'SIGTERM');
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const force = setTimeout(() => killGroup(pid, 'SIGKILL'), STOP_GRACE_MS);
    child.once('exit', () => {
      clearTimeout(force);
      console.log(`[e2e] ${name} stopped`);
      resolve();
    });
    killGroup(pid, 'SIGTERM');
  });
}

/** Starts a service in its own process group and waits until it answers. */
export async function spawnService(definition: ServiceDefinition): Promise<RunningService> {
  console.log(`[e2e] starting ${definition.name}`);
  const child = spawn(definition.command, definition.args, {
    cwd: definition.cwd,
    env: { ...process.env, ...definition.env },
    stdio: 'inherit',
    detached: true,
  });
  let stopping: Promise<void> | undefined;
  const stopOnce = (): Promise<void> => (stopping ??= stopChild(definition.name, child));
  const unregister = onInterrupt(stopOnce);
  const running: RunningService = {
    name: definition.name,
    stop: () => stopOnce().finally(unregister),
  };
  try {
    await waitUntilReady(definition, child);
  } catch (error) {
    await running.stop();
    throw error;
  }
  return running;
}

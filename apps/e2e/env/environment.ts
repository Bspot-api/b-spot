/**
 * The one starter of the e2e environment, shared by `pnpm e2e:web` and
 * `pnpm e2e:mobile`: the lock, containers, database reset, API build, fixture
 * server and API processes (plus the web export and its static server for the
 * web suite), then teardown of everything it started — on success, failure,
 * SIGINT and SIGTERM alike.
 */
import path from 'node:path';
import {
  API_ROOT,
  API_URL,
  E2E_PORTS,
  E2E_ROOT,
  FIXTURES_URL,
  WEB_URL,
  buildApiEnv,
} from './e2e-env';
import { resetE2eDatabase } from './database';
import { planContainers, startContainers, stopContainers } from './docker';
import { runCommand } from './process';
import { acquireE2eEnvironmentLock } from './run-control/e2e-environment-lock';
import { HeldLock } from './run-control/e2e-lock';
import { computeSignalExitCode, getInterruptSignal, onInterrupt } from './run-control/interrupt';
import { assertPortsFree } from './run-control/port-preflight';
import { RunningService, ServiceDefinition, spawnService } from './services';
import { buildWebApp } from './web/web-build';

const GUARD = path.join(E2E_ROOT, 'env', 'block-external-hosts.ts');
const API_MAIN = path.join(API_ROOT, 'dist', 'src', 'main.js');

export interface E2eEnvironmentOptions {
  /** Export the web app and serve it on the e2e web port (web suite only). */
  hasWebApp: boolean;
}

const FIXTURE_SERVER: ServiceDefinition = {
  name: 'fixture server',
  command: 'pnpm',
  args: ['exec', 'tsx', 'fixtures-server/server.ts'],
  cwd: E2E_ROOT,
  readyUrl: `${FIXTURES_URL}/health`,
};

/** cwd is apps/e2e so the API's dotenv never loads apps/api/.env. */
const API_SERVER: ServiceDefinition = {
  name: 'API',
  command: 'node',
  args: ['--import', 'tsx', '--import', GUARD, API_MAIN],
  cwd: E2E_ROOT,
  env: buildApiEnv(),
  readyUrl: `${API_URL}/health`,
};

const WEB_SERVER: ServiceDefinition = {
  name: 'web static server',
  command: 'pnpm',
  args: ['exec', 'tsx', 'env/web/static-server.ts'],
  cwd: E2E_ROOT,
  readyUrl: WEB_URL,
};

/** What this run started, filled as it goes; the teardown stops exactly this. */
interface StartedResources {
  containers: string[];
  services: RunningService[];
}

async function prepareBuilds(options: E2eEnvironmentOptions): Promise<void> {
  await resetE2eDatabase();
  await runCommand('pnpm', ['run', 'build'], { cwd: API_ROOT });
  if (options.hasWebApp) await buildWebApp();
}

async function startServices(
  options: E2eEnvironmentOptions,
  running: RunningService[],
): Promise<void> {
  const definitions = options.hasWebApp
    ? [FIXTURE_SERVER, API_SERVER, WEB_SERVER]
    : [FIXTURE_SERVER, API_SERVER];
  for (const definition of definitions) running.push(await spawnService(definition));
}

async function stopServices(running: readonly RunningService[]): Promise<void> {
  for (const service of [...running].reverse()) await service.stop();
}

/** One teardown for every exit path; a second call returns the first one's promise. */
function createTeardown(started: StartedResources, lock: HeldLock): () => Promise<void> {
  let tearingDown: Promise<void> | undefined;
  const tearDown = async (): Promise<void> => {
    try {
      await stopServices(started.services);
      await stopContainers(started.containers);
    } finally {
      lock.release();
    }
  };
  return () => (tearingDown ??= tearDown());
}

async function bringUpAndRun(
  options: E2eEnvironmentOptions,
  started: StartedResources,
  run: () => Promise<number>,
): Promise<number> {
  started.containers.push(...(await planContainers()));
  await assertPortsFree(E2E_PORTS);
  await startContainers(started.containers);
  await prepareBuilds(options);
  await startServices(options, started.services);
  return run();
}

/** The interrupt's exit code once a signal arrived, whatever the suite or a killed step said. */
function settleExitCode(code: number): number {
  const signal = getInterruptSignal();
  return signal ? computeSignalExitCode(signal) : code;
}

/**
 * Takes the e2e lock, brings the environment up, runs `run`, and always
 * tears down what it started. Resolves with `run`'s exit code (128 + n when
 * interrupted by a signal).
 */
export async function withE2eEnvironment(
  options: E2eEnvironmentOptions,
  run: () => Promise<number>,
): Promise<number> {
  const lock = await acquireE2eEnvironmentLock();
  const started: StartedResources = { containers: [], services: [] };
  const teardown = createTeardown(started, lock);
  const unregister = onInterrupt(teardown);
  try {
    return settleExitCode(await bringUpAndRun(options, started, run));
  } catch (error) {
    if (getInterruptSignal()) return settleExitCode(1);
    throw error;
  } finally {
    await teardown();
    unregister();
  }
}

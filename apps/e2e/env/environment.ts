/**
 * The one starter of the e2e environment, shared by `pnpm e2e:web` and
 * `pnpm e2e:mobile`: containers, database reset, API build, fixture server
 * and API processes (plus the web export and its static server for the web
 * suite), then teardown of everything it started.
 */
import path from 'node:path';
import { API_ROOT, API_URL, E2E_ROOT, FIXTURES_URL, WEB_URL, buildApiEnv } from './e2e-env';
import { resetE2eDatabase } from './database';
import { startContainers, stopContainers } from './docker';
import { runCommand } from './process';
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

/**
 * Brings the environment up, runs `run`, and always tears down what it
 * started. Resolves with `run`'s exit code.
 */
export async function withE2eEnvironment(
  options: E2eEnvironmentOptions,
  run: () => Promise<number>,
): Promise<number> {
  const startedContainers = await startContainers();
  const running: RunningService[] = [];
  try {
    await prepareBuilds(options);
    await startServices(options, running);
    return await run();
  } finally {
    await stopServices(running);
    await stopContainers(startedContainers);
  }
}

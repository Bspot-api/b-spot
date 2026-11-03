/**
 * `pnpm e2e:web`: brings the e2e environment up, runs the Playwright web
 * suite, tears down what it started, and exits with the suite's code.
 */
import { API_ROOT, E2E_ROOT } from './e2e-env';
import { resetE2eDatabase } from './database';
import { startContainers, stopContainers } from './docker';
import { runCommand, runCommandForExitCode } from './process';
import { buildWebApp } from './web-build';

async function prepareEnvironment(): Promise<void> {
  await resetE2eDatabase();
  await runCommand('pnpm', ['run', 'build'], { cwd: API_ROOT });
  await buildWebApp();
}

async function main(): Promise<number> {
  const started = await startContainers();
  try {
    await prepareEnvironment();
    const args = ['exec', 'playwright', 'test', ...process.argv.slice(2)];
    return await runCommandForExitCode('pnpm', args, { cwd: E2E_ROOT });
  } finally {
    await stopContainers(started);
  }
}

main()
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    console.error('[e2e] environment failed:', error);
    process.exit(1);
  });

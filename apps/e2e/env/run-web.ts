/**
 * `pnpm e2e:web`: brings the e2e environment up, runs the Playwright web
 * suite, tears down what it started, and exits with the suite's code.
 */
import { E2E_ROOT } from './e2e-env';
import { withE2eEnvironment } from './environment';
import { runCommandForExitCode } from './process';

function runPlaywright(): Promise<number> {
  const args = ['exec', 'playwright', 'test', ...process.argv.slice(2)];
  return runCommandForExitCode('pnpm', args, { cwd: E2E_ROOT });
}

withE2eEnvironment({ hasWebApp: true }, runPlaywright)
  .then((code) => process.exit(code))
  .catch((error: unknown) => {
    console.error('[e2e] environment failed:', error);
    process.exit(1);
  });

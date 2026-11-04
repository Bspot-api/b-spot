import { defineConfig, devices } from '@playwright/test';
import { WEB_URL } from './env/e2e-env';

/**
 * The fixture server, the API and the web server are started by
 * `env/environment.ts` (`pnpm e2e:web`), the starter shared with the iOS suite.
 */

export default defineConfig({
  testDir: '.',
  workers: 1,
  fullyParallel: false,
  retries: 0,
  forbidOnly: true,
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: WEB_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'environment', testMatch: 'checks/**/*.spec.ts' },
    {
      name: 'web',
      testMatch: 'web/**/*.spec.ts',
      dependencies: ['environment'],
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});

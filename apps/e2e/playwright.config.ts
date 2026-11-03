import path from 'node:path';
import { defineConfig, devices } from '@playwright/test';
import { API_ROOT, API_URL, E2E_ROOT, FIXTURES_URL, WEB_URL, buildApiEnv } from './env/e2e-env';

const GUARD = path.join(E2E_ROOT, 'env', 'block-external-hosts.ts');
const SERVER_TIMEOUT_MS = 120_000;

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
  webServer: [
    {
      command: 'pnpm exec tsx fixtures-server/server.ts',
      cwd: E2E_ROOT,
      url: `${FIXTURES_URL}/health`,
      reuseExistingServer: false,
      timeout: SERVER_TIMEOUT_MS,
    },
    {
      // cwd is apps/e2e so the API's dotenv never loads apps/api/.env.
      command: `node --import tsx --import ${GUARD} ${path.join(API_ROOT, 'dist', 'src', 'main.js')}`,
      cwd: E2E_ROOT,
      env: buildApiEnv(),
      url: `${API_URL}/health`,
      reuseExistingServer: false,
      timeout: SERVER_TIMEOUT_MS,
    },
    {
      command: 'pnpm exec tsx env/static-server.ts',
      cwd: E2E_ROOT,
      url: WEB_URL,
      reuseExistingServer: false,
      timeout: SERVER_TIMEOUT_MS,
    },
  ],
});

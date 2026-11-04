import { API_URL, METRO_PORT, METRO_URL, MOBILE_ROOT } from '../e2e-env';
import { RunningService, spawnService } from '../services';

/**
 * Starts the Metro the iOS dev build loads its JavaScript from. The dev
 * build carries no JS: `EXPO_PUBLIC_API_URL` is inlined here, at bundle
 * time. `--clear` keeps Metro from reusing a bundle inlined with another URL;
 * the process env wins over apps/mobile/.env.
 */
export function startMetro(): Promise<RunningService> {
  return spawnService({
    name: 'Metro (iOS dev build)',
    command: 'pnpm',
    args: [
      'exec',
      'expo',
      'start',
      '--dev-client',
      '--localhost',
      '--clear',
      '--port',
      `${METRO_PORT}`,
    ],
    cwd: MOBILE_ROOT,
    env: {
      EXPO_PUBLIC_API_URL: API_URL,
      EXPO_PUBLIC_APP_ENV: 'e2e',
      APP_VARIANT: 'development',
      CI: '1',
    },
    readyUrl: `${METRO_URL}/status`,
    readyBody: 'packager-status:running',
  });
}

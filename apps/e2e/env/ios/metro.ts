import {
  API_URL,
  IGNORE_DOTENV_FILES_VARIABLE,
  METRO_PORT,
  METRO_URL,
  MOBILE_ROOT,
} from '../e2e-env';
import { RunningService, spawnService } from '../services';

/**
 * Starts the Metro the iOS dev build loads its JavaScript from. The dev
 * build carries no JS: `EXPO_PUBLIC_API_URL` is inlined here, at bundle
 * time. `--clear` keeps Metro from reusing a bundle inlined with another URL.
 * In development Expo bundles apps/mobile/.env* and their values win over the
 * process env, so this Metro hides them (see apps/mobile/metro.config.js);
 * `EXPO_NO_DOTENV` keeps the developer's other values out of its process env.
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
      EXPO_NO_DOTENV: '1',
      [IGNORE_DOTENV_FILES_VARIABLE]: '1',
    },
    readyUrl: `${METRO_URL}/status`,
    readyBody: 'packager-status:running',
  });
}

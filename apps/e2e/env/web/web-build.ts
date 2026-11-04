import { API_URL, MOBILE_ROOT, WEB_BUILD_DIR } from '../e2e-env';
import { runCommand } from '../process';

/**
 * Exports the web app the way `apps/mobile/Dockerfile.web` does, pointed at
 * the e2e API. `--clear` keeps Metro from reusing a bundle that inlined
 * another EXPO_PUBLIC_API_URL.
 */
export async function buildWebApp(): Promise<void> {
  console.log(`[e2e] exporting the web app against ${API_URL}`);
  await runCommand(
    'pnpm',
    ['exec', 'expo', 'export', '--platform', 'web', '--output-dir', WEB_BUILD_DIR, '--clear'],
    {
      cwd: MOBILE_ROOT,
      env: { EXPO_PUBLIC_API_URL: API_URL, EXPO_PUBLIC_APP_ENV: 'e2e', CI: '1' },
    },
  );
}

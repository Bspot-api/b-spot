/** Preflight of `pnpm e2e:mobile` on the iOS simulator, through `xcrun simctl`. */
import { IOS_BUNDLE_ID, REPO_ROOT } from '../e2e-env';
import { captureCommand } from '../process';

interface SimctlDevice {
  udid: string;
  name: string;
  state: string;
}

/** Runs `xcrun simctl <args>` and returns its trimmed stdout. */
export function runSimctl(args: readonly string[]): Promise<string> {
  return captureCommand('xcrun', ['simctl', ...args], { cwd: REPO_ROOT });
}

/** Returns the booted iOS simulator; fails with a clear message when there is none. */
export async function findBootedSimulator(): Promise<SimctlDevice> {
  const output = await runSimctl(['list', 'devices', 'booted', '--json']);
  const parsed = JSON.parse(output) as { devices: Record<string, SimctlDevice[]> };
  const booted = Object.entries(parsed.devices)
    .filter(([runtime]) => runtime.includes('iOS'))
    .flatMap(([, devices]) => devices)
    .filter((device) => device.state === 'Booted');
  if (booted.length === 0) throw new Error('[e2e] boot an iOS simulator first');
  return booted[0];
}

/** Fails unless the dev build is installed on the device. */
export async function assertDevBuildInstalled(udid: string): Promise<void> {
  await runSimctl(['get_app_container', udid, IOS_BUNDLE_ID, 'app']).catch(() => {
    throw new Error(
      `[e2e] ${IOS_BUNDLE_ID} is not installed; build it once with ` +
        '`cd apps/mobile && APP_VARIANT=development pnpm exec expo run:ios --no-bundler`',
    );
  });
}

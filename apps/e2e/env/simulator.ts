/**
 * The iOS simulator side of `pnpm e2e:mobile`: preflight checks, and the
 * stored scan history written into the app's container from outside, the
 * way the database is seeded.
 */
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { IOS_BUNDLE_ID, REPO_ROOT } from './e2e-env';
import { captureCommand } from './process';

/** Key and folder of the app's history (apps/mobile/src/features/history/history-utils.ts). */
const SCAN_HISTORY_KEY = '@b-spot/scan-history';
/** Where @react-native-async-storage keeps its manifest on iOS. */
const ASYNC_STORAGE_DIR = path.join(
  'Library',
  'Application Support',
  IOS_BUNDLE_ID,
  'RCTAsyncLocalStorage_V1',
);
const MAESTRO_HOME_BINARY = path.join(os.homedir(), '.maestro', 'bin', 'maestro');

interface SimctlDevice {
  udid: string;
  name: string;
  state: string;
}

/** One entry of the app's stored history (apps/mobile/src/features/history/types.ts). */
export interface StoredScanEntry {
  barcode: string;
  productName: string;
  brandName: string;
  companyName: string;
  companySiren: string;
  productSource: 'OFF' | 'OBF';
  scannedAt: string;
}

function simctl(args: readonly string[]): Promise<string> {
  return captureCommand('xcrun', ['simctl', ...args], { cwd: REPO_ROOT });
}

/** Returns the booted iOS simulator; fails with a clear message when there is none. */
export async function findBootedSimulator(): Promise<SimctlDevice> {
  const output = await simctl(['list', 'devices', 'booted', '--json']);
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
  await simctl(['get_app_container', udid, IOS_BUNDLE_ID, 'app']).catch(() => {
    throw new Error(
      `[e2e] ${IOS_BUNDLE_ID} is not installed; build it once with ` +
        '`cd apps/mobile && APP_VARIANT=development pnpm exec expo run:ios --no-bundler`',
    );
  });
}

/** Path of the Maestro CLI: its default install folder, else the PATH. */
export function resolveMaestroBinary(): string {
  return existsSync(MAESTRO_HOME_BINARY) ? MAESTRO_HOME_BINARY : 'maestro';
}

/** Replaces the app's stored history. The app must not be running. */
export async function seedScanHistory(udid: string, entries: StoredScanEntry[]): Promise<void> {
  const dataContainer = await simctl(['get_app_container', udid, IOS_BUNDLE_ID, 'data']);
  const storageDir = path.join(dataContainer, ASYNC_STORAGE_DIR);
  await mkdir(storageDir, { recursive: true });
  const manifest = { [SCAN_HISTORY_KEY]: JSON.stringify(entries) };
  await writeFile(path.join(storageDir, 'manifest.json'), JSON.stringify(manifest));
}

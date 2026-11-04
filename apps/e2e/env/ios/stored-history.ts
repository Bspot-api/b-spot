/**
 * The app's stored scan history, written into its simulator container from
 * outside, the way the database is seeded: the simulator has no camera to
 * scan with. The shapes mirror apps/mobile (the e2e package never imports
 * the app): `STORAGE_KEY` in src/features/history/history-utils.ts and
 * `ScanHistoryEntry` in src/features/history/types.ts.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { IOS_BUNDLE_ID } from '../e2e-env';
import { runSimctl } from './simulator';
import { FERRERO_FIXTURE, KNOWN_FOOD } from '../../fixtures-server/catalogue';

const SCAN_HISTORY_KEY = '@b-spot/scan-history';
/** Where @react-native-async-storage keeps its manifest on iOS. */
const ASYNC_STORAGE_DIR = path.join(
  'Library',
  'Application Support',
  IOS_BUNDLE_ID,
  'RCTAsyncLocalStorage_V1',
);

/** One entry of the app's stored history (the fields the history screen reads). */
export interface StoredScanEntry {
  barcode: string;
  productName: string;
  brandName: string;
  companyName: string;
  companySiren: string;
  productSource: 'OFF' | 'OBF';
  scannedAt: string;
}

/** A past lookup of the known food product, as the app stores it after a scan. */
export const STORED_FOOD_SCAN: StoredScanEntry = {
  barcode: KNOWN_FOOD.barcode,
  productName: KNOWN_FOOD.name,
  brandName: KNOWN_FOOD.brand,
  companyName: FERRERO_FIXTURE.legalName,
  companySiren: FERRERO_FIXTURE.siren,
  productSource: 'OFF',
  scannedAt: new Date().toISOString(),
};

/**
 * Replaces the app's whole AsyncStorage with this history. Call it while the
 * app is stopped (its native module caches the manifest) and after a wipe.
 */
export async function seedScanHistory(udid: string, entries: StoredScanEntry[]): Promise<void> {
  const dataContainer = await runSimctl(['get_app_container', udid, IOS_BUNDLE_ID, 'data']);
  const storageDir = path.join(dataContainer, ASYNC_STORAGE_DIR);
  await mkdir(storageDir, { recursive: true });
  const manifest = { [SCAN_HISTORY_KEY]: JSON.stringify(entries) };
  await writeFile(path.join(storageDir, 'manifest.json'), JSON.stringify(manifest));
}

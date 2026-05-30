import type { ScanHistoryEntry } from './types';

export const STORAGE_KEY = '@b-spot/scan-history';
export const MAX_ENTRIES = 50;

export function buildUpdatedHistory(
  prev: ScanHistoryEntry[],
  entry: ScanHistoryEntry,
): ScanHistoryEntry[] {
  const withoutDupe = prev.filter((e) => e.barcode !== entry.barcode);
  return [entry, ...withoutDupe].slice(0, MAX_ENTRIES);
}

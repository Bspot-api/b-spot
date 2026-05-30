import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ScanHistoryEntry } from '../types';

const STORAGE_KEY = '@b-spot/scan-history';
const MAX_ENTRIES = 50;

export interface UseScanHistory {
  entries: ScanHistoryEntry[];
  addEntry: (entry: ScanHistoryEntry) => Promise<void>;
  isLoading: boolean;
}

export function useScanHistory(): UseScanHistory {
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          const parsed = JSON.parse(raw) as ScanHistoryEntry[];
          setEntries(Array.isArray(parsed) ? parsed : []);
        }
      })
      .catch(() => {
        // Corrupted storage — start fresh
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addEntry = useCallback(async (entry: ScanHistoryEntry): Promise<void> => {
    setEntries((prev) => {
      const withoutDupe = prev.filter((e) => e.barcode !== entry.barcode);
      const updated = [entry, ...withoutDupe].slice(0, MAX_ENTRIES);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => undefined);
      return updated;
    });
  }, []);

  return { entries, addEntry, isLoading };
}

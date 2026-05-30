import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildUpdatedHistory, STORAGE_KEY } from '../history-utils';
import type { ScanHistoryEntry } from '../types';

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
      const updated = buildUpdatedHistory(prev, entry);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated)).catch(() => undefined);
      return updated;
    });
  }, []);

  return { entries, addEntry, isLoading };
}

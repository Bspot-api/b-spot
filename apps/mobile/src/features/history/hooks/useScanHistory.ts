import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buildUpdatedHistory, STORAGE_KEY } from '../history-utils';
import type { ScanHistoryEntry } from '../types';

export interface UseScanHistory {
  entries: ScanHistoryEntry[];
  addEntry: (entry: ScanHistoryEntry) => Promise<void>;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useScanHistory(): UseScanHistory {
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const entriesRef = useRef<ScanHistoryEntry[]>([]);

  const refresh = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as ScanHistoryEntry[]) : [];
      const valid = Array.isArray(parsed) ? parsed : [];
      entriesRef.current = valid;
      setEntries(valid);
    } catch {
      // Corrupted storage — start fresh
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addEntry = useCallback(async (entry: ScanHistoryEntry): Promise<void> => {
    const updated = buildUpdatedHistory(entriesRef.current, entry);
    entriesRef.current = updated;
    setEntries(updated);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }, []);

  return { entries, addEntry, isLoading, refresh };
}

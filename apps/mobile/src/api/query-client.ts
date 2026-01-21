import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Query client configuration aligned with research findings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days cache
      staleTime: 1000 * 60 * 30, // 30 minutes (aligned with Pappers cache)
      retry: 1,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst', // Support offline mode
    },
  },
});

// AsyncStorage persister for offline support
export const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000, // Batch writes every 3 seconds
});

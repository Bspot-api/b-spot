import { ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScanHistoryEmpty } from '../../src/features/history/components/ScanHistoryEmpty';
import { ScanHistoryList } from '../../src/features/history/components/ScanHistoryList';
import { useScanHistory } from '../../src/features/history/hooks/useScanHistory';
import type { ScanHistoryEntry } from '../../src/features/history/types';

export default function HistoryScreen() {
  const router = useRouter();
  const { entries, isLoading } = useScanHistory();

  function handleItemPress(entry: ScanHistoryEntry) {
    router.push({
      pathname: '/company/[id]',
      params: {
        id: entry.companySiren,
        productSource: entry.productSource,
      },
    });
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50">
        <ActivityIndicator size="small" color="#27272a" />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View className="flex-1 bg-zinc-50">
        <ScanHistoryEmpty />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <ScanHistoryList entries={entries} onItemPress={handleItemPress} />
    </View>
  );
}

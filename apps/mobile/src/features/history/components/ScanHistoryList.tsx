import { FlatList, View } from 'react-native';
import type { ScanHistoryEntry } from '../types';
import { ScanHistoryItem } from './ScanHistoryItem';

interface ScanHistoryListProps {
  entries: ScanHistoryEntry[];
  onItemPress?: (entry: ScanHistoryEntry) => void;
}

export function ScanHistoryList({ entries, onItemPress }: ScanHistoryListProps) {
  return (
    <FlatList
      data={entries}
      keyExtractor={(item) => item.barcode}
      renderItem={({ item }) => <ScanHistoryItem entry={item} onPress={onItemPress} />}
      ItemSeparatorComponent={() => <View className="h-2" />}
      contentContainerClassName="p-4 pb-8"
      showsVerticalScrollIndicator={false}
    />
  );
}

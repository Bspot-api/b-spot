import { Pressable, Text, View } from 'react-native';
import type { ScanHistoryEntry } from '../types';

interface ScanHistoryItemProps {
  entry: ScanHistoryEntry;
  onPress?: (entry: ScanHistoryEntry) => void;
}

export function ScanHistoryItem({ entry, onPress }: ScanHistoryItemProps) {
  return (
    <Pressable
      onPress={() => onPress?.(entry)}
      className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 active:opacity-75"
      accessibilityRole="button"
      accessibilityLabel={`${entry.productName} — ${entry.companyName}`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-0.5">
          <Text className="text-sm font-semibold text-zinc-900" numberOfLines={1}>
            {entry.productName}
          </Text>
          <Text className="text-xs text-zinc-500" numberOfLines={1}>
            {entry.brandName} · {entry.companyName}
          </Text>
        </View>
        <Text className="ml-3 text-xs text-zinc-400">{formatDate(entry.scannedAt)}</Text>
      </View>
    </Pressable>
  );
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const toDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diffDays = Math.round((toDay(now) - toDay(date)) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Hier';
  if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'long' });
  }
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

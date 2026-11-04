import { Pressable, Text, View } from 'react-native';
import type { SuggestionStatus } from '../../../api/types';

const TABS: { status: SuggestionStatus; label: string }[] = [
  { status: 'new', label: 'Nouvelles' },
  { status: 'reviewed', label: 'En révision' },
  { status: 'approved', label: 'Approuvées' },
  { status: 'rejected', label: 'Rejetées' },
];

interface SuggestionStatusTabsProps {
  activeStatus: SuggestionStatus;
  onChange: (status: SuggestionStatus) => void;
}

export function SuggestionStatusTabs({ activeStatus, onChange }: SuggestionStatusTabsProps) {
  return (
    <View className="flex-row border-b border-zinc-200 bg-white">
      {TABS.map((tab) => (
        <Pressable
          key={tab.status}
          onPress={() => onChange(tab.status)}
          testID={`suggestions-tab-${tab.status}`}
          className="flex-1 py-3 active:opacity-75"
        >
          <Text
            className={`text-center text-xs font-medium ${
              activeStatus === tab.status ? 'text-zinc-900' : 'text-zinc-400'
            }`}
          >
            {tab.label}
          </Text>
          {activeStatus === tab.status && <View className="mt-1 h-0.5 w-full bg-zinc-900" />}
        </Pressable>
      ))}
    </View>
  );
}

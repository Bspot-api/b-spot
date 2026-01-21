import { View, Text } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-zinc-900">
        Scan History
      </Text>
      <Text className="mt-4 text-base text-zinc-600">
        Your recently scanned products will appear here
      </Text>
    </View>
  );
}

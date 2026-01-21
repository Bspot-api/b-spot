import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-zinc-900">
        B-Spot Scanner
      </Text>
      <Text className="mt-4 text-base text-zinc-600">
        Scan a product barcode to reveal corporate ownership
      </Text>
    </View>
  );
}

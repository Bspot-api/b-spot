import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function CompanyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-2xl font-bold text-zinc-900">
        Company Details
      </Text>
      <Text className="mt-4 text-base text-zinc-600">
        Company ID: {id}
      </Text>
    </View>
  );
}

import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-5">
      <Text className="text-2xl font-bold text-zinc-900">
        404 - Page Not Found
      </Text>
      <Link href="/" className="mt-4 text-base text-blue-600 underline">
        Go back to home
      </Link>
    </View>
  );
}

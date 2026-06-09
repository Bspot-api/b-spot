import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/features/auth/hooks/useAuth';

export default function AdminScreen() {
  const router = useRouter();
  const { isAdmin, isLoading, adminProfile, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAdmin) router.replace('/');
  }, [isAdmin, isLoading, router]);

  async function handleSignOut() {
    await signOut();
    router.replace('/');
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50">
        <ActivityIndicator size="small" color="#27272a" />
      </View>
    );
  }

  if (!isAdmin || !adminProfile) return null;

  return (
    <View className="flex-1 bg-zinc-50 px-4 pt-6">
      <View className="rounded-2xl border border-zinc-200 bg-white p-4">
        <Text className="text-lg font-semibold text-zinc-900">{adminProfile.name}</Text>
        <Text className="mt-1 text-sm text-zinc-500">{adminProfile.email}</Text>
        <Pressable
          onPress={handleSignOut}
          className="mt-4 rounded-xl bg-zinc-100 px-4 py-3 active:opacity-75"
          accessibilityRole="button"
        >
          <Text className="text-center text-sm font-medium text-zinc-700">Déconnexion</Text>
        </Pressable>
      </View>

      <View className="mt-6 rounded-2xl border border-zinc-200 bg-white p-4">
        <Text className="text-sm font-semibold text-zinc-700">Suggestions de marques</Text>
        <Text className="mt-2 text-sm text-zinc-400">Chargement des suggestions...</Text>
      </View>
    </View>
  );
}

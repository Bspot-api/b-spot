import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useAdminSuggestions } from '../../src/api/hooks';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import type { SuggestionStatus } from '../../src/api/types';

const STATUS_LABELS: Record<SuggestionStatus, string> = {
  new: 'Nouvelles',
  reviewed: 'En révision',
  approved: 'Approuvées',
  rejected: 'Rejetées',
};

function SuggestionCounter({
  status,
  count,
  isLoading,
}: {
  status: SuggestionStatus;
  count: number;
  isLoading: boolean;
}) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/admin/suggestions', params: { status } })}
      className="flex-1 items-center rounded-xl border border-zinc-100 bg-zinc-50 py-3 active:opacity-75"
      accessibilityRole="button"
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#71717a" />
      ) : (
        <Text className="text-2xl font-bold text-zinc-900">{count}</Text>
      )}
      <Text className="mt-1 text-xs text-zinc-500">{STATUS_LABELS[status]}</Text>
    </Pressable>
  );
}

export default function AdminScreen() {
  const router = useRouter();
  const { isAdmin, isLoading, adminProfile, signOut } = useAuth();
  const suggestionsQuery = useAdminSuggestions();

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

  const items = suggestionsQuery.data?.items ?? [];
  const countsByStatus = (s: SuggestionStatus) => items.filter((i) => i.status === s).length;

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
        <Text className="mb-3 text-sm font-semibold text-zinc-700">Suggestions de marques</Text>
        <View className="flex-row gap-2">
          {(['new', 'reviewed', 'approved', 'rejected'] as SuggestionStatus[]).map((s) => (
            <SuggestionCounter
              key={s}
              status={s}
              count={countsByStatus(s)}
              isLoading={suggestionsQuery.isPending}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

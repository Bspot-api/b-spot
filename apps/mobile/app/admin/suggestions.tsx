import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAdminSuggestions, useUpdateSuggestionStatus } from '../../src/api/hooks';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import type { BrandSuggestionDto, SuggestionStatus } from '../../src/api/types';

const TABS: { status: SuggestionStatus; label: string }[] = [
  { status: 'new', label: 'Nouvelles' },
  { status: 'reviewed', label: 'En révision' },
  { status: 'approved', label: 'Approuvées' },
  { status: 'rejected', label: 'Rejetées' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function SuggestionItem({
  item,
  onAction,
}: {
  item: BrandSuggestionDto;
  onAction: (id: number, status: SuggestionStatus) => void;
}) {
  function confirmReject() {
    Alert.alert('Rejeter', `Rejeter la suggestion "${item.brandName}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Rejeter', style: 'destructive', onPress: () => onAction(item.id, 'rejected') },
    ]);
  }

  return (
    <View className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="font-semibold text-zinc-900">{item.brandName}</Text>
          {item.productName && <Text className="mt-0.5 text-sm text-zinc-600">{item.productName}</Text>}
          {item.barcode && <Text className="mt-0.5 text-xs text-zinc-400">EAN: {item.barcode}</Text>}
          <Text className="mt-1 text-xs text-zinc-400">{formatDate(item.createdAt)}</Text>
        </View>
        {item.productImageUrl && (
          <Image source={{ uri: item.productImageUrl }} className="ml-3 h-16 w-16 rounded-xl" />
        )}
      </View>

      <View className="mt-3 flex-row gap-2">
        {item.status !== 'approved' && (
          <Pressable
            onPress={() => onAction(item.id, 'approved')}
            className="flex-1 rounded-lg bg-emerald-100 py-2 active:opacity-75"
          >
            <Text className="text-center text-xs font-medium text-emerald-700">Approuver</Text>
          </Pressable>
        )}
        {item.status !== 'reviewed' && item.status !== 'approved' && (
          <Pressable
            onPress={() => onAction(item.id, 'reviewed')}
            className="flex-1 rounded-lg bg-zinc-100 py-2 active:opacity-75"
          >
            <Text className="text-center text-xs font-medium text-zinc-600">En révision</Text>
          </Pressable>
        )}
        {item.status !== 'rejected' && (
          <Pressable
            onPress={confirmReject}
            className="flex-1 rounded-lg bg-red-100 py-2 active:opacity-75"
          >
            <Text className="text-center text-xs font-medium text-red-600">Rejeter</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function SuggestionsScreen() {
  const router = useRouter();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const params = useLocalSearchParams<{ status?: SuggestionStatus }>();
  const [activeStatus, setActiveStatus] = useState<SuggestionStatus>(params.status ?? 'new');

  const suggestionsQuery = useAdminSuggestions(activeStatus);
  const updateMutation = useUpdateSuggestionStatus();

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace('/');
  }, [isAdmin, authLoading, router]);

  function handleAction(id: number, status: SuggestionStatus) {
    updateMutation.mutate({ id, status });
  }

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50">
        <ActivityIndicator size="small" color="#27272a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <View className="flex-row border-b border-zinc-200 bg-white">
        {TABS.map((tab) => (
          <Pressable
            key={tab.status}
            onPress={() => setActiveStatus(tab.status)}
            className="flex-1 py-3 active:opacity-75"
          >
            <Text
              className={`text-center text-xs font-medium ${
                activeStatus === tab.status ? 'text-zinc-900' : 'text-zinc-400'
              }`}
            >
              {tab.label}
            </Text>
            {activeStatus === tab.status && (
              <View className="mt-1 h-0.5 w-full bg-zinc-900" />
            )}
          </Pressable>
        ))}
      </View>

      {suggestionsQuery.isPending && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#27272a" />
        </View>
      )}

      {suggestionsQuery.isError && (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-zinc-500">Erreur lors du chargement.</Text>
          <Pressable onPress={() => suggestionsQuery.refetch()} className="mt-3">
            <Text className="font-medium text-zinc-900">Réessayer</Text>
          </Pressable>
        </View>
      )}

      {suggestionsQuery.isSuccess && (
        <FlatList
          data={suggestionsQuery.data.items}
          keyExtractor={(item) => String(item.id)}
          contentContainerClassName="p-4"
          renderItem={({ item }) => <SuggestionItem item={item} onAction={handleAction} />}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-zinc-400">Aucune suggestion dans cette catégorie.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

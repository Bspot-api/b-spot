import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  useAdminSuggestions,
  useDeleteSuggestion,
  useUpdateSuggestionStatus,
} from '../../src/api/hooks';
import { SuggestionCard } from '../../src/features/admin/components/SuggestionCard';
import { SuggestionEditSheet } from '../../src/features/admin/components/SuggestionEditSheet';
import { SuggestionStatusTabs } from '../../src/features/admin/components/SuggestionStatusTabs';
import { useSuggestionEditor } from '../../src/features/admin/hooks/useSuggestionEditor';
import { useAdminGuard } from '../../src/features/auth/hooks/useAdminGuard';
import type { SuggestionStatus } from '../../src/api/types';

export default function SuggestionsScreen() {
  const { access } = useAdminGuard();
  const params = useLocalSearchParams<{ status?: SuggestionStatus }>();
  const [activeStatus, setActiveStatus] = useState<SuggestionStatus>(params.status ?? 'new');

  const editor = useSuggestionEditor();

  const suggestionsQuery = useAdminSuggestions({
    status: activeStatus,
    enabled: access === 'granted',
  });
  const updateMutation = useUpdateSuggestionStatus();
  const deleteMutation = useDeleteSuggestion();

  function handleAction(id: number, status: SuggestionStatus) {
    updateMutation.mutate({ id, status });
  }

  function handleDelete(id: number) {
    deleteMutation.mutate(id);
  }

  if (access !== 'granted') {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-50">
        <ActivityIndicator size="small" color="#27272a" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-50">
      <SuggestionStatusTabs activeStatus={activeStatus} onChange={setActiveStatus} />

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
          renderItem={({ item }) => (
            <SuggestionCard
              item={item}
              onAction={handleAction}
              onDelete={handleDelete}
              onEdit={editor.startEdit}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12" testID="suggestions-empty">
              <Text className="text-zinc-400">Aucune suggestion dans cette catégorie.</Text>
            </View>
          }
        />
      )}

      <SuggestionEditSheet
        isPresented={editor.isOpen}
        draft={editor.draft}
        isSaving={editor.isSaving}
        onChangeDraft={editor.changeDraft}
        onDismiss={editor.cancelEdit}
        onSave={editor.saveEdit}
      />
    </View>
  );
}

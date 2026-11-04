import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { BottomSheet } from '../../src/components/BottomSheet';
import { useLocalSearchParams } from 'expo-router';
import {
  useAdminSuggestions,
  useDeleteSuggestion,
  useUpdateSuggestionFields,
  useUpdateSuggestionStatus,
} from '../../src/api/hooks';
import { SuggestionCard } from '../../src/features/admin/components/SuggestionCard';
import { useAdminGuard } from '../../src/features/auth/hooks/useAdminGuard';
import type { BrandSuggestionDto, SuggestionStatus } from '../../src/api/types';

const TABS: { status: SuggestionStatus; label: string }[] = [
  { status: 'new', label: 'Nouvelles' },
  { status: 'reviewed', label: 'En révision' },
  { status: 'approved', label: 'Approuvées' },
  { status: 'rejected', label: 'Rejetées' },
];

export default function SuggestionsScreen() {
  const { access } = useAdminGuard();
  const params = useLocalSearchParams<{ status?: SuggestionStatus }>();
  const [activeStatus, setActiveStatus] = useState<SuggestionStatus>(params.status ?? 'new');

  const [editItem, setEditItem] = useState<BrandSuggestionDto | null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editBarcode, setEditBarcode] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const suggestionsQuery = useAdminSuggestions({
    status: activeStatus,
    enabled: access === 'granted',
  });
  const updateMutation = useUpdateSuggestionStatus();
  const deleteMutation = useDeleteSuggestion();
  const fieldsMutation = useUpdateSuggestionFields();

  function handleAction(id: number, status: SuggestionStatus) {
    updateMutation.mutate({ id, status });
  }

  function handleDelete(id: number) {
    deleteMutation.mutate(id);
  }

  function handleEdit(item: BrandSuggestionDto) {
    setEditItem(item);
    setEditBrandName(item.brandName);
    setEditProductName(item.productName ?? '');
    setEditBarcode(item.barcode ?? '');
    setEditNotes(item.notes ?? '');
  }

  function handleEditSave() {
    if (!editItem) return;
    fieldsMutation.mutate(
      {
        id: editItem.id,
        fields: {
          brandName: editBrandName.trim() || editItem.brandName,
          productName: editProductName,
          barcode: editBarcode,
          notes: editNotes,
        },
      },
      { onSuccess: () => setEditItem(null) }
    );
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
      <View className="flex-row border-b border-zinc-200 bg-white">
        {TABS.map((tab) => (
          <Pressable
            key={tab.status}
            onPress={() => setActiveStatus(tab.status)}
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
              onEdit={handleEdit}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12" testID="suggestions-empty">
              <Text className="text-zinc-400">Aucune suggestion dans cette catégorie.</Text>
            </View>
          }
        />
      )}

      <BottomSheet
        isPresented={editItem !== null}
        onDismiss={() => setEditItem(null)}
        testID="suggestion-edit-sheet"
      >
        <View style={{ padding: 20, gap: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#18181b' }}>
            Modifier la suggestion
          </Text>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, color: '#71717a', fontWeight: '500' }}>Marque *</Text>
            <TextInput
              value={editBrandName}
              onChangeText={setEditBrandName}
              testID="suggestion-edit-brand-input"
              style={inputStyle}
              placeholder="Nom de la marque"
              placeholderTextColor="#a1a1aa"
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, color: '#71717a', fontWeight: '500' }}>Produit</Text>
            <TextInput
              value={editProductName}
              onChangeText={setEditProductName}
              style={inputStyle}
              placeholder="Nom du produit"
              placeholderTextColor="#a1a1aa"
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, color: '#71717a', fontWeight: '500' }}>Code-barre</Text>
            <TextInput
              value={editBarcode}
              onChangeText={setEditBarcode}
              style={inputStyle}
              placeholder="EAN"
              placeholderTextColor="#a1a1aa"
              keyboardType="numeric"
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, color: '#71717a', fontWeight: '500' }}>Notes</Text>
            <TextInput
              value={editNotes}
              onChangeText={setEditNotes}
              style={[inputStyle, { minHeight: 72, textAlignVertical: 'top' }]}
              placeholder="Notes internes"
              placeholderTextColor="#a1a1aa"
              multiline
            />
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }}>
            <Pressable
              onPress={() => setEditItem(null)}
              style={({ pressed }) => [cancelButtonStyle, pressed && { opacity: 0.7 }]}
            >
              <Text style={{ color: '#71717a', fontWeight: '500', fontSize: 15 }}>Annuler</Text>
            </Pressable>
            <Pressable
              onPress={handleEditSave}
              testID="suggestion-edit-save"
              disabled={fieldsMutation.isPending}
              style={({ pressed }) => [saveButtonStyle, pressed && { opacity: 0.7 }]}
            >
              {fieldsMutation.isPending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 15 }}>Enregistrer</Text>
              )}
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#e4e4e7',
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  fontSize: 15,
  color: '#18181b',
  backgroundColor: '#fafafa',
};

const cancelButtonStyle = {
  flex: 1,
  borderWidth: 1,
  borderColor: '#e4e4e7',
  borderRadius: 12,
  paddingVertical: 13,
  alignItems: 'center' as const,
};

const saveButtonStyle = {
  flex: 1,
  backgroundColor: '#18181b',
  borderRadius: 12,
  paddingVertical: 13,
  alignItems: 'center' as const,
};

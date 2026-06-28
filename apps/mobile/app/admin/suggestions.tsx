import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomSheet } from '../../src/components/BottomSheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  useAdminSuggestions,
  useDeleteSuggestion,
  useUpdateSuggestionFields,
  useUpdateSuggestionStatus,
} from '../../src/api/hooks';
import { useAuth } from '../../src/features/auth/hooks/useAuth';
import type { BrandSuggestionDto, SuggestionStatus } from '../../src/api/types';

const TABS: { status: SuggestionStatus; label: string }[] = [
  { status: 'new', label: 'Nouvelles' },
  { status: 'reviewed', label: 'En révision' },
  { status: 'approved', label: 'Approuvées' },
  { status: 'rejected', label: 'Rejetées' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function SuggestionItem({
  item,
  onAction,
  onDelete,
  onEdit,
}: {
  item: BrandSuggestionDto;
  onAction: (id: number, status: SuggestionStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (item: BrandSuggestionDto) => void;
}) {
  function confirmReject() {
    if (Platform.OS === 'web') {
      if (window.confirm(`Rejeter la suggestion "${item.brandName}" ?`)) {
        onAction(item.id, 'rejected');
      }
      return;
    }
    Alert.alert('Rejeter', `Rejeter la suggestion "${item.brandName}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Rejeter', style: 'destructive', onPress: () => onAction(item.id, 'rejected') },
    ]);
  }

  function confirmDelete() {
    if (Platform.OS === 'web') {
      if (window.confirm(`Supprimer définitivement "${item.brandName}" ?`)) {
        onDelete(item.id);
      }
      return;
    }
    Alert.alert('Supprimer', `Supprimer définitivement "${item.brandName}" ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => onDelete(item.id) },
    ]);
  }

  return (
    <View className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4">
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="font-semibold text-zinc-900">{item.brandName}</Text>
          {item.productName && (
            <Text className="mt-0.5 text-sm text-zinc-600">{item.productName}</Text>
          )}
          {item.barcode && (
            <Text className="mt-0.5 text-xs text-zinc-400">EAN: {item.barcode}</Text>
          )}
          <Text className="mt-1 text-xs text-zinc-400">{formatDate(item.createdAt)}</Text>
        </View>
        <View className="ml-3 items-end gap-2">
          <View className="flex-row gap-3">
            <Pressable onPress={() => onEdit(item)} hitSlop={8} className="active:opacity-50">
              <Ionicons name="create-outline" size={18} color="#a1a1aa" />
            </Pressable>
            <Pressable onPress={confirmDelete} hitSlop={8} className="active:opacity-50">
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </Pressable>
          </View>
          {item.productImageUrl && (
            <Image source={{ uri: item.productImageUrl }} className="h-16 w-16 rounded-xl" />
          )}
        </View>
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

  const [editItem, setEditItem] = useState<BrandSuggestionDto | null>(null);
  const [editBrandName, setEditBrandName] = useState('');
  const [editProductName, setEditProductName] = useState('');
  const [editBarcode, setEditBarcode] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const suggestionsQuery = useAdminSuggestions(activeStatus);
  const updateMutation = useUpdateSuggestionStatus();
  const deleteMutation = useDeleteSuggestion();
  const fieldsMutation = useUpdateSuggestionFields();

  useEffect(() => {
    if (!authLoading && !isAdmin) router.replace('/');
  }, [isAdmin, authLoading, router]);

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
            <SuggestionItem
              item={item}
              onAction={handleAction}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-12">
              <Text className="text-zinc-400">Aucune suggestion dans cette catégorie.</Text>
            </View>
          }
        />
      )}

      <BottomSheet isPresented={editItem !== null} onDismiss={() => setEditItem(null)}>
        <View style={{ padding: 20, gap: 16 }}>
          <Text style={{ fontSize: 17, fontWeight: '600', color: '#18181b' }}>
            Modifier la suggestion
          </Text>

          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 12, color: '#71717a', fontWeight: '500' }}>Marque *</Text>
            <TextInput
              value={editBrandName}
              onChangeText={setEditBrandName}
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

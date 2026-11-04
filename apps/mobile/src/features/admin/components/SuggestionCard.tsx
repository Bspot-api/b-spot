import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { confirmAction } from '../../../components/confirm/confirmAction';
import type { BrandSuggestionDto, SuggestionStatus } from '../../../api/types';

interface SuggestionCardProps {
  item: BrandSuggestionDto;
  onAction: (id: number, status: SuggestionStatus) => void;
  onDelete: (id: number) => void;
  onEdit: (item: BrandSuggestionDto) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function SuggestionCard({ item, onAction, onDelete, onEdit }: SuggestionCardProps) {
  function confirmReject() {
    confirmAction({
      title: 'Rejeter',
      message: `Rejeter la suggestion "${item.brandName}" ?`,
      confirmLabel: 'Rejeter',
      destructive: true,
      onConfirm: () => onAction(item.id, 'rejected'),
    });
  }

  function confirmDelete() {
    confirmAction({
      title: 'Supprimer',
      message: `Supprimer définitivement "${item.brandName}" ?`,
      confirmLabel: 'Supprimer',
      destructive: true,
      onConfirm: () => onDelete(item.id),
    });
  }

  return (
    <View className="mb-3 rounded-2xl border border-zinc-200 bg-white p-4" testID="suggestion-card">
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
            <Pressable
              onPress={() => onEdit(item)}
              hitSlop={8}
              className="active:opacity-50"
              testID="suggestion-edit"
              accessibilityLabel={`Modifier ${item.brandName}`}
            >
              <Ionicons name="create-outline" size={18} color="#a1a1aa" />
            </Pressable>
            <Pressable
              onPress={confirmDelete}
              hitSlop={8}
              className="active:opacity-50"
              testID="suggestion-delete"
              accessibilityLabel={`Supprimer ${item.brandName}`}
            >
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
            testID="suggestion-approve"
            accessibilityLabel={`Approuver ${item.brandName}`}
            className="flex-1 rounded-lg bg-emerald-100 py-2 active:opacity-75"
          >
            <Text className="text-center text-xs font-medium text-emerald-700">Approuver</Text>
          </Pressable>
        )}
        {item.status !== 'reviewed' && item.status !== 'approved' && (
          <Pressable
            onPress={() => onAction(item.id, 'reviewed')}
            testID="suggestion-review"
            className="flex-1 rounded-lg bg-zinc-100 py-2 active:opacity-75"
          >
            <Text className="text-center text-xs font-medium text-zinc-600">En révision</Text>
          </Pressable>
        )}
        {item.status !== 'rejected' && (
          <Pressable
            onPress={confirmReject}
            testID="suggestion-reject"
            accessibilityLabel={`Rejeter ${item.brandName}`}
            className="flex-1 rounded-lg bg-red-100 py-2 active:opacity-75"
          >
            <Text className="text-center text-xs font-medium text-red-600">Rejeter</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

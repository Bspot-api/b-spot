import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function ScanHistoryEmpty() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Ionicons name="time-outline" size={48} color="#a1a1aa" />
      <Text className="mt-4 text-lg font-semibold text-zinc-900">Aucun scan pour l'instant</Text>
      <Text className="mt-2 text-center text-sm text-zinc-500">
        Scanner un produit pour découvrir l'entreprise qui le fabrique.
      </Text>
    </View>
  );
}

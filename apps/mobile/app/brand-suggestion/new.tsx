import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCreateBrandSuggestion } from '../../src/api/hooks';

function getParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default function BrandSuggestionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    brandName?: string;
    barcode?: string;
    productName?: string;
    productImageUrl?: string;
    offBrandRaw?: string;
    brandSuggestionId?: string;
  }>();

  const initialBrandName = getParam(params.brandName) ?? '';
  const barcode = getParam(params.barcode);
  const productName = getParam(params.productName);
  const productImageUrl = getParam(params.productImageUrl);
  const offBrandRaw = getParam(params.offBrandRaw);
  const existingSuggestionId = getParam(params.brandSuggestionId);

  const [brandName, setBrandName] = useState(initialBrandName);
  const [notes, setNotes] = useState('');
  const createSuggestion = useCreateBrandSuggestion();

  const subtitle = useMemo(() => {
    if (existingSuggestionId) {
      return "On a déjà créé une suggestion automatique. Tu peux ajouter des infos pour nous aider à la valider.";
    }
    return "Aide-nous à référencer cette marque. Les infos ci-dessous sont préremplies à partir du scan.";
  }, [existingSuggestionId]);

  async function handleSubmit() {
    if (!brandName.trim()) {
      Alert.alert('Marque manquante', 'Merci de renseigner le nom de la marque.');
      return;
    }

    try {
      await createSuggestion.mutateAsync({
        brandName: brandName.trim(),
        barcode,
        productName,
        productImageUrl,
        offBrandRaw,
        notes: notes.trim() || undefined,
      });

      Alert.alert(
        'Merci !',
        "Ta contribution a bien été enregistrée. Elle nous aide à enrichir la base de marques.",
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch {
      Alert.alert(
        'Erreur',
        "Impossible d'envoyer la suggestion pour le moment. Réessaie dans un instant.",
      );
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-zinc-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerClassName="p-4 pb-8">
        <View className="rounded-2xl border border-zinc-200 bg-white p-4">
          <Text className="text-lg font-semibold text-zinc-900">Ajouter une marque</Text>
          <Text className="mt-2 text-sm text-zinc-600">{subtitle}</Text>
        </View>

        <View className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4">
          <Text className="text-sm font-medium text-zinc-800">Nom de la marque</Text>
          <TextInput
            value={brandName}
            onChangeText={setBrandName}
            placeholder="Ex: Cristaline"
            className="mt-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-zinc-900"
            autoCapitalize="words"
          />

          <Text className="mt-4 text-sm font-medium text-zinc-800">Informations produit</Text>

          <FieldRow label="Code-barres" value={barcode} />
          <FieldRow label="Produit" value={productName} />
          <FieldRow label="Marque OFF" value={offBrandRaw} />

          <Text className="mt-4 text-sm font-medium text-zinc-800">
            Infos complémentaires (optionnel)
          </Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: vu en rayon eaux / pack de 6 bouteilles..."
            multiline
            textAlignVertical="top"
            className="mt-2 min-h-[120px] rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-zinc-900"
          />
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={createSuggestion.isPending}
          className="mt-5 flex-row items-center justify-center rounded-xl bg-zinc-900 px-4 py-4 active:opacity-85"
          accessibilityRole="button"
        >
          {createSuggestion.isPending ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="ml-2 font-semibold text-white">Envoi...</Text>
            </>
          ) : (
            <Text className="font-semibold text-white">Envoyer la suggestion</Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function FieldRow({ label, value }: { label: string; value?: string }) {
  return (
    <View className="mt-2 rounded-xl border border-zinc-100 bg-zinc-50 px-3 py-2.5">
      <Text className="text-xs uppercase tracking-wide text-zinc-500">{label}</Text>
      <Text className="mt-1 text-sm text-zinc-900">{value?.trim() || 'Non disponible'}</Text>
    </View>
  );
}

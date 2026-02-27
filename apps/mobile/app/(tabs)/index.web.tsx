import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useBarcodeScanner } from '../../src/features/scanner/hooks/useBarcodeScanner';

export default function WebSearchScreen() {
  const { state, errorMessage, handleBarcodeScan } = useBarcodeScanner();
  const [barcode, setBarcode] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();

  const handleSubmit = useCallback(() => {
    const trimmed = barcode.trim();
    if (trimmed.length < 8 || trimmed.length > 14) {
      setValidationError('Le code-barres doit contenir entre 8 et 14 chiffres.');
      return;
    }
    setValidationError(undefined);
    handleBarcodeScan(trimmed);
    setBarcode('');
  }, [barcode, handleBarcodeScan]);

  const isLoading = state === 'loading';
  const displayError = validationError ?? (state === 'error' ? errorMessage : undefined);

  return (
    <View className="flex-1 bg-zinc-50 items-center justify-center px-6">
      <Text className="text-3xl font-bold text-zinc-900 mb-2">B-Spot</Text>
      <Text className="text-base text-zinc-500 text-center mb-10">
        Découvrez qui se cache derrière les marques que vous consommez
      </Text>

      <View className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 p-6">
        <Text className="text-sm font-semibold text-zinc-700 mb-2">
          Code-barres du produit
        </Text>
        <TextInput
          value={barcode}
          onChangeText={(text) => {
            setBarcode(text);
            setValidationError(undefined);
          }}
          placeholder="Ex: 3017620422003"
          keyboardType="numeric"
          className="border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 bg-zinc-50 mb-4"
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          editable={!isLoading}
          accessibilityLabel="Code-barres du produit"
        />

        <Pressable
          onPress={handleSubmit}
          disabled={isLoading}
          className="rounded-xl bg-zinc-900 py-3 items-center active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Rechercher"
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white font-semibold text-base">Rechercher</Text>
          )}
        </Pressable>

        {displayError && (
          <Text className="mt-3 text-sm text-red-600 text-center">
            {displayError}
          </Text>
        )}
      </View>

      <Text className="mt-8 text-xs text-zinc-400 text-center max-w-xs">
        Saisissez le code-barres EAN-8, EAN-13 ou UPC imprimé sur l'emballage
      </Text>
    </View>
  );
}

import Constants from 'expo-constants';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';
import { useBarcodeScanner } from '../../src/features/scanner/hooks/useBarcodeScanner';
import { useBrandSearch } from '../../src/features/scanner/hooks/useBrandSearch';

const appVersion = Constants.expoConfig?.version ?? '0.0.0';

type SearchMode = 'barcode' | 'brand';

export default function WebSearchScreen() {
  const [mode, setMode] = useState<SearchMode>('barcode');
  const [input, setInput] = useState('');
  const [validationError, setValidationError] = useState<string | undefined>();

  const {
    state: barcodeState,
    errorMessage: barcodeError,
    handleBarcodeScan,
  } = useBarcodeScanner();
  const { state: brandState, errorMessage: brandError, handleBrandSearch } = useBrandSearch();

  const isLoading = barcodeState === 'loading' || brandState === 'loading';
  const apiError =
    mode === 'barcode'
      ? barcodeState === 'error'
        ? barcodeError
        : undefined
      : brandState === 'error'
        ? brandError
        : undefined;
  const displayError = validationError ?? apiError;

  const handleModeChange = useCallback((next: SearchMode) => {
    setMode(next);
    setInput('');
    setValidationError(undefined);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();

    if (mode === 'barcode') {
      if (trimmed.length < 8 || trimmed.length > 14) {
        setValidationError('Le code-barres doit contenir entre 8 et 14 chiffres.');
        return;
      }
      setValidationError(undefined);
      handleBarcodeScan(trimmed);
      setInput('');
    } else {
      if (trimmed.length < 2) {
        setValidationError('Saisissez au moins 2 caractères.');
        return;
      }
      setValidationError(undefined);
      handleBrandSearch(trimmed);
      setInput('');
    }
  }, [input, mode, handleBarcodeScan, handleBrandSearch]);

  return (
    <View className="flex-1 bg-zinc-50 items-center justify-center px-6">
      <Text className="text-3xl font-bold text-zinc-900 mb-2">B-Spot</Text>
      <Text className="text-base text-zinc-500 text-center mb-10">
        Découvrez qui se cache derrière les marques que vous consommez
      </Text>

      <View className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 p-6">
        {/* Mode toggle */}
        <View className="flex-row rounded-xl bg-zinc-100 p-1 mb-5">
          <Pressable
            onPress={() => handleModeChange('barcode')}
            className={`flex-1 rounded-lg py-2 items-center ${mode === 'barcode' ? 'bg-white shadow-sm' : ''}`}
            accessibilityRole="button"
          >
            <Text
              className={`text-sm font-semibold ${mode === 'barcode' ? 'text-zinc-900' : 'text-zinc-500'}`}
            >
              Code-barres
            </Text>
          </Pressable>
          <Pressable
            onPress={() => handleModeChange('brand')}
            className={`flex-1 rounded-lg py-2 items-center ${mode === 'brand' ? 'bg-white shadow-sm' : ''}`}
            accessibilityRole="button"
          >
            <Text
              className={`text-sm font-semibold ${mode === 'brand' ? 'text-zinc-900' : 'text-zinc-500'}`}
            >
              Marque
            </Text>
          </Pressable>
        </View>

        {/* Input */}
        <Text className="text-sm font-semibold text-zinc-700 mb-2">
          {mode === 'barcode' ? 'Code-barres du produit' : 'Nom de la marque'}
        </Text>
        <TextInput
          value={input}
          onChangeText={(text) => {
            setInput(text);
            setValidationError(undefined);
          }}
          placeholder={mode === 'barcode' ? 'Ex: 3017620422003' : "Ex: nutella, danone, l'oréal"}
          keyboardType={mode === 'barcode' ? 'numeric' : 'default'}
          className="border border-zinc-300 rounded-xl px-4 py-3 text-zinc-900 bg-zinc-50 mb-4"
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          editable={!isLoading}
          accessibilityLabel={mode === 'barcode' ? 'Code-barres du produit' : 'Nom de la marque'}
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
          <Text className="mt-3 text-sm text-red-600 text-center">{displayError}</Text>
        )}
      </View>

      <Text className="mt-8 text-xs text-zinc-400 text-center max-w-xs">
        {mode === 'barcode'
          ? "Saisissez le code EAN-8, EAN-13 ou UPC imprimé sur l'emballage"
          : 'Saisissez le nom exact ou approché de la marque'}
      </Text>

      <Text className="mt-6 text-xs text-zinc-300">v{appVersion}</Text>
    </View>
  );
}

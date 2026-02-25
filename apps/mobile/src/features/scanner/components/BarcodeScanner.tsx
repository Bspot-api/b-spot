import { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import type { BarcodeScanningResult } from 'expo-camera';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  isScanning: boolean;
  isCameraActive: boolean;
}

export function BarcodeScanner({ onScan, isScanning, isCameraActive }: BarcodeScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!isScanning && !isCameraActive) {
      setScanned(false);
    }
  }, [isScanning, isCameraActive]);

  const handleBarcodeScan = useCallback(
    ({ data }: BarcodeScanningResult) => {
      if (scanned || isScanning) return;
      setScanned(true);
      onScan(data);
    },
    [scanned, isScanning, onScan],
  );

  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-black">
        <Text className="text-white text-base">Initialisation de la caméra...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-900 px-8">
        <Text className="text-white text-xl font-semibold text-center mb-3">
          Permission caméra requise
        </Text>
        <Text className="text-zinc-400 text-base text-center mb-8">
          B-Spot a besoin d'accéder à votre caméra pour scanner les codes-barres produits.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-white px-8 py-3 rounded-full"
        >
          <Text className="text-zinc-900 font-semibold text-base">Autoriser l'accès</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isCameraActive) {
    return <View className="flex-1 bg-black" />;
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      barcodeScannerSettings={{
        barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
      }}
      onBarcodeScanned={scanned || isScanning || !isCameraActive ? undefined : handleBarcodeScan}
    />
  );
}

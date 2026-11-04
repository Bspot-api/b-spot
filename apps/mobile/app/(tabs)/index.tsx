import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { BarcodeScanner } from '../../src/features/scanner/components/BarcodeScanner';
import { ScanOverlay } from '../../src/features/scanner/components/ScanOverlay';
import { useBarcodeScanner } from '../../src/features/scanner/hooks/useBarcodeScanner';

export default function ScannerScreen() {
  const { state, errorMessage, isScanning, handleBarcodeScan } = useBarcodeScanner();
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleStartScan = useCallback(() => {
    if (isScanning) return;
    setIsCameraActive(true);
  }, [isScanning]);

  const handleDetectedBarcode = useCallback(
    (barcode: string) => {
      setIsCameraActive(false);
      handleBarcodeScan(barcode);
    },
    [handleBarcodeScan]
  );

  return (
    <View className="flex-1 bg-black">
      <BarcodeScanner
        onScan={handleDetectedBarcode}
        isScanning={isScanning}
        isCameraActive={isCameraActive}
      />
      <ScanOverlay state={state} errorMessage={errorMessage} isCameraActive={isCameraActive} />

      {!isCameraActive && state !== 'loading' && (
        <View
          className="absolute inset-0 items-center justify-center px-6"
          pointerEvents="box-none"
        >
          <TouchableOpacity
            onPress={handleStartScan}
            activeOpacity={0.9}
            className="rounded-full px-8 py-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.94)' }}
          >
            <Text className="text-zinc-900 text-base font-semibold">Scanner</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

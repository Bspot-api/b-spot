import { View } from 'react-native';
import { BarcodeScanner } from '../../src/features/scanner/components/BarcodeScanner';
import { ScanOverlay } from '../../src/features/scanner/components/ScanOverlay';
import { useBarcodeScanner } from '../../src/features/scanner/hooks/useBarcodeScanner';

export default function ScannerScreen() {
  const { state, errorMessage, isScanning, handleBarcodeScan } = useBarcodeScanner();

  return (
    <View className="flex-1 bg-black">
      <BarcodeScanner onScan={handleBarcodeScan} isScanning={isScanning} />
      <ScanOverlay state={state} errorMessage={errorMessage} />
    </View>
  );
}

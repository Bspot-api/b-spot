import { Text, View } from 'react-native';
import type { ScannerToast as ScannerToastData } from '../hooks/useBarcodeScanner';

interface ScannerToastProps {
  toast: ScannerToastData | null;
}

const TONE_STYLES = {
  info: { bg: 'rgba(24,24,27,0.92)', border: 'rgba(255,255,255,0.18)' },
  success: { bg: 'rgba(22,163,74,0.92)', border: 'rgba(255,255,255,0.2)' },
  warning: { bg: 'rgba(217,119,6,0.94)', border: 'rgba(255,255,255,0.2)' },
  error: { bg: 'rgba(220,38,38,0.94)', border: 'rgba(255,255,255,0.2)' },
} as const;

export function ScannerToast({ toast }: ScannerToastProps) {
  if (!toast) return null;

  const tone = TONE_STYLES[toast.tone];

  return (
    <View className="absolute left-4 right-4 top-14" pointerEvents="none">
      <View
        className="rounded-2xl border px-4 py-3"
        style={{ backgroundColor: tone.bg, borderColor: tone.border }}
      >
        <Text className="text-sm font-medium text-white">{toast.message}</Text>
      </View>
    </View>
  );
}

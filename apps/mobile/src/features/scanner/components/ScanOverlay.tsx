import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

export type ScanState = 'idle' | 'loading' | 'success' | 'error';

interface ScanOverlayProps {
  state: ScanState;
  errorMessage?: string;
  isCameraActive?: boolean;
}

export function ScanOverlay({ state, errorMessage, isCameraActive = true }: ScanOverlayProps) {
  return (
    <View style={StyleSheet.absoluteFill} className="items-center justify-center" pointerEvents="none">
      {/* Scanning frame with corner markers */}
      <View style={styles.frame}>
        <View style={[styles.corner, styles.cornerTL]} />
        <View style={[styles.corner, styles.cornerTR]} />
        <View style={[styles.corner, styles.cornerBL]} />
        <View style={[styles.corner, styles.cornerBR]} />
      </View>

      {/* Status messages */}
      <View className="mt-8 items-center">
        {state === 'loading' && (
          <View className="flex-row items-center gap-2 rounded-full px-5 py-2.5" style={styles.pill}>
            <ActivityIndicator color="white" size="small" />
            <Text className="text-white font-medium text-sm">Recherche en cours...</Text>
          </View>
        )}

        {state === 'error' && errorMessage && (
          <View className="rounded-xl px-5 py-3 max-w-xs" style={styles.errorBadge}>
            <Text className="text-white text-center text-sm">{errorMessage}</Text>
          </View>
        )}

        {state === 'idle' && (
          <View className="rounded-full px-5 py-2.5" style={styles.pill}>
            <Text className="text-white text-sm opacity-90">
              {isCameraActive ? 'Pointez vers un code-barres' : 'Appuyez sur Scanner pour démarrer'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 256,
    height: 256,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: 'white',
    borderWidth: 4,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  pill: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  errorBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
  },
});

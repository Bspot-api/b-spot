import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { ApiError } from '../../../api/client';
import { useScanProduct } from '../../../api/hooks';
import type { ScanState } from '../components/ScanOverlay';

interface UseBarcodeScanner {
  state: ScanState;
  errorMessage: string | undefined;
  isScanning: boolean;
  handleBarcodeScan: (barcode: string) => void;
}

export function useBarcodeScanner(): UseBarcodeScanner {
  const [state, setState] = useState<ScanState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const router = useRouter();
  const { mutateAsync: scan } = useScanProduct();

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      setState('loading');
      setErrorMessage(undefined);

      try {
        const result = await scan(barcode);

        if (result.company) {
          setState('success');
          router.push(`/company/${result.company.siren}`);
        } else {
          const msg = result.message ?? 'Entreprise non trouvée pour ce produit.';
          setErrorMessage(msg);
          setState('error');
          setTimeout(() => setState('idle'), 3000);
        }
      } catch (error: unknown) {
        const msg = resolveErrorMessage(error);
        setErrorMessage(msg);
        setState('error');
        setTimeout(() => setState('idle'), 3000);
      }
    },
    [scan, router],
  );

  return {
    state,
    errorMessage,
    isScanning: state === 'loading',
    handleBarcodeScan,
  };
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode === 404) return 'Produit introuvable dans notre base de données.';
    if (error.statusCode >= 500) return 'Erreur serveur. Réessayez dans un moment.';
    return error.message;
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return 'Délai dépassé. Vérifiez votre connexion.';
  }
  return 'Erreur réseau. Vérifiez votre connexion internet.';
}

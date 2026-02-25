import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { ApiError } from '../../../api/client';
import { useScanProduct } from '../../../api/hooks';
import type { ScanResultDto } from '../../../api/types';
import type { ScanState } from '../components/ScanOverlay';

type ScannerToastTone = 'info' | 'success' | 'warning' | 'error';

export interface ScannerToast {
  message: string;
  tone: ScannerToastTone;
}

interface UseBarcodeScanner {
  state: ScanState;
  errorMessage: string | undefined;
  isScanning: boolean;
  toast: ScannerToast | null;
  handleBarcodeScan: (barcode: string) => void;
}

export function useBarcodeScanner(): UseBarcodeScanner {
  const [state, setState] = useState<ScanState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [toast, setToast] = useState<ScannerToast | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const { mutateAsync: scan } = useScanProduct();

  useEffect(
    () => () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    },
    [],
  );

  const showToast = useCallback((message: string, tone: ScannerToastTone, durationMs = 2600) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, tone });
    toastTimeoutRef.current = setTimeout(() => setToast(null), durationMs);
  }, []);

  const navigateToBrandSuggestion = useCallback(
    (result: ScanResultDto) => {
      router.push({
        pathname: '/brand-suggestion/new',
        params: {
          brandName: result.product.brandName ?? '',
          barcode: result.product.barcode,
          productName: result.product.name,
          productImageUrl: result.product.imageUrl,
          offBrandRaw: result.product.brandName ?? '',
          brandSuggestionId: result.brandSuggestionId?.toString(),
        },
      });
    },
    [router],
  );

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      setState('loading');
      setErrorMessage(undefined);

      try {
        const result = await scan(barcode);

        if (result.brandResolution === 'auto_active') {
          showToast("La marque n'existait pas encore. On l'a retrouvée !", 'success');
        }

        if (result.brandResolution === 'auto_pending') {
          showToast(
            "On a trouvé une correspondance probable. Elle est marquée comme pending.",
            'warning',
            3200,
          );
        }

        if (result.company) {
          setState('success');
          router.push({
            pathname: '/company/[id]',
            params: {
              id: result.company.siren,
              brandStatus: result.brandStatus,
            },
          });
        } else {
          if (result.brandResolution === 'needs_user_input') {
            showToast(
              "Arf, on n'est pas sûrs de la marque. Tu veux bien nous donner plus d'infos ?",
              'warning',
              3600,
            );
            setState('idle');
            navigateToBrandSuggestion(result);
            return;
          }

          const msg = result.message ?? 'Entreprise non trouvée pour ce produit.';
          setErrorMessage(msg);
          setState('error');
          showToast(msg, 'error', 3000);
          setTimeout(() => setState('idle'), 3000);
        }
      } catch (error: unknown) {
        const msg = resolveErrorMessage(error);
        setErrorMessage(msg);
        setState('error');
        showToast(msg, 'error', 3000);
        setTimeout(() => setState('idle'), 3000);
      }
    },
    [scan, router, showToast],
  );

  return {
    state,
    errorMessage,
    isScanning: state === 'loading',
    toast,
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

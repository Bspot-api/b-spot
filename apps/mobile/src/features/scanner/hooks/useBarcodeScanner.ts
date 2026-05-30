import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { ApiError } from '../../../api/client';
import { useScanProduct } from '../../../api/hooks';
import type { ScanResultDto } from '../../../api/types';
import { Toast } from '../../../components/reacticx/Toast';
import type { ScanState } from '../components/ScanOverlay';
import { useScanHistory } from '../../history/hooks/useScanHistory';

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
  const { addEntry } = useScanHistory();

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
    [router]
  );

  const handleBarcodeScan = useCallback(
    async (barcode: string) => {
      setState('loading');
      setErrorMessage(undefined);
      Toast.show('Scan en cours, on vérifie le produit et la marque…', {
        type: 'info',
        position: 'top',
        duration: 2200,
      });

      try {
        const result = await scan(barcode);

        if (result.company) {
          setState('success');
          const productSource = result.product.source === 'OPEN_BEAUTY_FACTS' ? 'OBF' : 'OFF';
          await addEntry({
            barcode: result.product.barcode,
            productName: result.product.name,
            brandName: result.product.brandName ?? '',
            companyName: result.company.legalName,
            companySiren: result.company.siren,
            productSource,
            scannedAt: new Date().toISOString(),
            brandStatus: result.brandStatus,
            brandResolution: result.brandResolution,
          });
          router.push({
            pathname: '/company/[id]',
            params: {
              id: result.company.siren,
              brandStatus: result.brandStatus,
              brandResolution: result.brandResolution,
              productSource,
            },
          });
        } else {
          if (result.brandResolution === 'needs_user_input') {
            Toast.show(
              "La marque n'existe pas encore, on va essayer de la retrouver depuis le code-barres.",
              {
                type: 'info',
                position: 'top',
                duration: 3200,
              }
            );
            Toast.show(
              "Arf, on n'est pas sûrs de la marque, tu veux bien nous donner plus d'infos ?",
              {
                type: 'warning',
                position: 'top',
                duration: 5200,
              }
            );
            setState('idle');
            navigateToBrandSuggestion(result);
            return;
          }

          const msg = result.message ?? 'Entreprise non trouvée pour ce produit.';
          setErrorMessage(msg);
          setState('error');
          Toast.show(msg, { type: 'error', position: 'top', duration: 5000 });
          setTimeout(() => setState('idle'), 3000);
        }
      } catch (error: unknown) {
        const msg = resolveErrorMessage(error);
        setErrorMessage(msg);
        setState('error');
        Toast.show(msg, { type: 'error', position: 'top', duration: 5000 });
        setTimeout(() => setState('idle'), 3000);
      }
    },
    [scan, router, navigateToBrandSuggestion, addEntry]
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

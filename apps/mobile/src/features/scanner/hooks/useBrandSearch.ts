import { useCallback, useState } from 'react';
import { useRouter } from 'expo-router';
import { ApiError } from '../../../api/client';
import { useScanByBrand } from '../../../api/hooks';
import { Toast } from '../../../components/reacticx/Toast';
import type { ScanState } from '../components/ScanOverlay';

interface UseBrandSearch {
  state: ScanState;
  errorMessage: string | undefined;
  isSearching: boolean;
  handleBrandSearch: (brandName: string) => void;
}

export function useBrandSearch(): UseBrandSearch {
  const [state, setState] = useState<ScanState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const router = useRouter();
  const { mutateAsync: searchBrand } = useScanByBrand();

  const handleBrandSearch = useCallback(
    async (brandName: string) => {
      setState('loading');
      setErrorMessage(undefined);
      Toast.show('Recherche en cours…', {
        type: 'info',
        position: 'top',
        duration: 2200,
      });

      try {
        const result = await searchBrand(brandName);

        if (result.company) {
          setState('success');
          router.push({
            pathname: '/company/[id]',
            params: {
              id: result.company.siren,
              brandStatus: result.brandStatus,
              brandResolution: result.brandResolution,
            },
          });
        } else {
          const msg =
            result.message ?? 'Marque non trouvée. Essayez un nom plus précis.';
          setErrorMessage(msg);
          setState('error');
          Toast.show(msg, { type: 'warning', position: 'top', duration: 4000 });
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
    [searchBrand, router],
  );

  return {
    state,
    errorMessage,
    isSearching: state === 'loading',
    handleBrandSearch,
  };
}

function resolveErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.statusCode >= 500) return 'Erreur serveur. Réessayez dans un moment.';
    return error.message;
  }
  if (error instanceof Error && error.name === 'AbortError') {
    return 'Délai dépassé. Vérifiez votre connexion.';
  }
  return 'Erreur réseau. Vérifiez votre connexion internet.';
}

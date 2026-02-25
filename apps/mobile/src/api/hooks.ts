import { useMutation, useQuery } from '@tanstack/react-query';
import { scanProduct, getCompany } from './client';

export function useScanProduct() {
  return useMutation({
    mutationFn: (barcode: string) => scanProduct(barcode),
  });
}

export function useGetCompany(siren: string | undefined) {
  return useQuery({
    queryKey: ['company', siren],
    queryFn: () => getCompany(siren!),
    enabled: !!siren,
  });
}

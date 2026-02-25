import { useMutation, useQuery } from '@tanstack/react-query';
import { createBrandSuggestion, getCompany, scanProduct } from './client';
import type { CreateBrandSuggestionDto } from './types';

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

export function useCreateBrandSuggestion() {
  return useMutation({
    mutationFn: (payload: CreateBrandSuggestionDto) => createBrandSuggestion(payload),
  });
}

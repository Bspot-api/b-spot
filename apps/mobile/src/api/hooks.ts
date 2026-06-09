import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBrandSuggestion,
  getCompany,
  listAdminSuggestions,
  scanByBrand,
  scanProduct,
  updateSuggestionStatus,
} from './client';
import type { CreateBrandSuggestionDto, SuggestionStatus } from './types';

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

export function useScanByBrand() {
  return useMutation({
    mutationFn: (brandName: string) => scanByBrand(brandName),
  });
}

export function useCreateBrandSuggestion() {
  return useMutation({
    mutationFn: (payload: CreateBrandSuggestionDto) => createBrandSuggestion(payload),
  });
}

export function useAdminSuggestions(status?: SuggestionStatus) {
  return useQuery({
    queryKey: ['admin', 'suggestions', status],
    queryFn: () => listAdminSuggestions(status),
    staleTime: 2 * 60 * 1000,
  });
}

export function useUpdateSuggestionStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: SuggestionStatus }) =>
      updateSuggestionStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'suggestions'] });
    },
  });
}

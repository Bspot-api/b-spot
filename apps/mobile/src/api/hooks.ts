import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBrandSuggestion,
  deleteSuggestion,
  getCompany,
  listAdminSuggestions,
  scanByBrand,
  scanProduct,
  updateSuggestionFields,
  updateSuggestionStatus,
} from './client';
import type {
  CreateBrandSuggestionDto,
  SuggestionStatus,
  UpdateSuggestionFieldsDto,
} from './types';

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

export function useDeleteSuggestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteSuggestion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'suggestions'] });
    },
  });
}

export function useUpdateSuggestionFields() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields }: { id: number; fields: UpdateSuggestionFieldsDto }) =>
      updateSuggestionFields(id, fields),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin', 'suggestions'] });
    },
  });
}

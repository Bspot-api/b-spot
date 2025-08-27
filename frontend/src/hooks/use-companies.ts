import type { CompanyControllerFindAllData } from "@/api/hooks";
import { companyControllerFindAll } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "./use-api-client";

export function useCompanies(
  page: number = 1, 
  limit: number = 30, 
  search?: string,
  sectorIds?: string[],
  fundIds?: string[],
  personalityIds?: string[]
) {
  // Ensure the API client is configured
  useApiClient();

  return useQuery({
    queryKey: ["companies", page, limit, search, sectorIds, fundIds, personalityIds],
    queryFn: async () => {
      const options: CompanyControllerFindAllData = {
        query: { 
          page, 
          limit, 
          search,
          sectorIds: sectorIds?.join(','),
          fundIds: fundIds?.join(','),
          personalityIds: personalityIds?.join(',')
        },
        url: '/companies'
      };
      const response = await companyControllerFindAll(options);
      return response.data;
    },
    // Keep previous data while loading new data to prevent blinking
    placeholderData: (previousData) => previousData,
  });
}

// Hook for pagination state management with URL sync
export function useCompaniesPagination(initialPage: number = 1, initialLimit: number = 30) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get current values from URL params or use defaults with proper fallbacks
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || initialPage.toString(), 10) || initialPage);
  const currentLimit = Math.max(1, parseInt(searchParams.get('limit') || initialLimit.toString(), 10) || initialLimit);
  const currentSearch = searchParams.get('search') || '';
  
  const [page, setPage] = React.useState(currentPage);
  const [limit, setLimit] = React.useState(currentLimit);
  const [search, setSearch] = React.useState(currentSearch);
  const [sectorIds, setSectorIds] = React.useState<string[]>([]);
  const [fundIds, setFundIds] = React.useState<string[]>([]);
  const [personalityIds, setPersonalityIds] = React.useState<string[]>([]);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  const { data: response, isLoading, error, isFetching } = useCompanies(
    page, 
    limit, 
    search, 
    sectorIds.length > 0 ? sectorIds : undefined,
    fundIds.length > 0 ? fundIds : undefined,
    personalityIds.length > 0 ? personalityIds : undefined
  );

  const companies = response?.data || [];
  const pagination = response?.pagination;

  // Mark as initialized after first data load
  React.useEffect(() => {
    if (response && !isInitialized) {
      setIsInitialized(true);
    }
  }, [response, isInitialized]);

  // Update URL params when state changes
  const updateURLParams = React.useCallback((
    newPage: number, 
    newLimit: number, 
    newSearch: string,
    newSectorIds: string[],
    newFundIds: string[],
    newPersonalityIds: string[]
  ) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newLimit !== initialLimit) params.set('limit', newLimit.toString());
    if (newSearch) params.set('search', newSearch);
    if (newSectorIds.length > 0) params.set('sectorIds', newSectorIds.join(','));
    if (newFundIds.length > 0) params.set('fundIds', newFundIds.join(','));
    if (newPersonalityIds.length > 0) params.set('personalityIds', newPersonalityIds.join(','));
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams, initialLimit]);

  // Sync URL params with state when URL changes
  React.useEffect(() => {
    if (currentPage !== page) {
      setPage(currentPage);
    }
    if (currentLimit !== limit) {
      setLimit(currentLimit);
    }
    if (currentSearch !== search) {
      setSearch(currentSearch);
    }
  }, [currentPage, currentLimit, currentSearch, page, limit, search]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
    updateURLParams(newPage, limit, search, sectorIds, fundIds, personalityIds);
  };

  const goToNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    updateURLParams(newPage, limit, search, sectorIds, fundIds, personalityIds);
  };

  const goToPreviousPage = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    updateURLParams(newPage, limit, search, sectorIds, fundIds, personalityIds);
  };

  const updateSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when search changes
    updateURLParams(1, limit, newSearch, sectorIds, fundIds, personalityIds);
  };

  const updateLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
    updateURLParams(1, newLimit, search, sectorIds, fundIds, personalityIds);
  };

  const updateSectorIds = (newSectorIds: string[]) => {
    setSectorIds(newSectorIds);
    setPage(1); // Reset to first page when filters change
    updateURLParams(1, limit, search, newSectorIds, fundIds, personalityIds);
  };

  const updateFundIds = (newFundIds: string[]) => {
    setFundIds(newFundIds);
    setPage(1); // Reset to first page when filters change
    updateURLParams(1, limit, search, sectorIds, newFundIds, personalityIds);
  };

  const updatePersonalityIds = (newPersonalityIds: string[]) => {
    setPersonalityIds(newPersonalityIds);
    setPage(1); // Reset to first page when filters change
    updateURLParams(1, limit, search, sectorIds, fundIds, newPersonalityIds);
  };

  return {
    companies,
    pagination,
    isLoading: isLoading || !isInitialized,
    isFetching,
    error,
    page,
    limit,
    search,
    sectorIds,
    fundIds,
    personalityIds,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    updateSearch,
    updateLimit,
    updateSectorIds,
    updateFundIds,
    updatePersonalityIds,
    hasNextPage: pagination?.totalPages ? page < pagination.totalPages : companies.length === limit,
    hasPreviousPage: page > 1
  };
}

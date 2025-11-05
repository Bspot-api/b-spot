import type { CompanyControllerFindAllData } from "@/api/hooks";
import { companyControllerFindAll } from "@/api/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "./use-api-client";

export function useInfiniteCompanies(
  search?: string,
  sectorIds?: string[],
  fundIds?: string[],
  personalityIds?: string[]
) {
  // Ensure the API client is configured
  useApiClient();

  return useInfiniteQuery({
    queryKey: ["companies-infinite", search, sectorIds, fundIds, personalityIds],
    queryFn: async ({ pageParam = 1 }) => {
      const options: CompanyControllerFindAllData = {
        query: { 
          page: pageParam, 
          limit: 20, 
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
    getNextPageParam: (lastPage) => {
      const { pagination } = lastPage;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    // Keep previous data while loading new data
    placeholderData: (previousData) => previousData,
  });
}

// Hook for infinite scroll state management with URL sync
export function useInfiniteCompaniesPagination() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get current values from URL params - URL is the single source of truth
  const search = searchParams.get('search') || '';
  const sectorIds = searchParams.get('sectorIds')?.split(',').filter(Boolean) || [];
  const fundIds = searchParams.get('fundIds')?.split(',').filter(Boolean) || [];
  const personalityIds = searchParams.get('personalityIds')?.split(',').filter(Boolean) || [];

  const [isInitialized, setIsInitialized] = React.useState(false);

  const {
    data,
    isLoading,
    error,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useInfiniteCompanies(
    search,
    sectorIds.length > 0 ? sectorIds : undefined,
    fundIds.length > 0 ? fundIds : undefined,
    personalityIds.length > 0 ? personalityIds : undefined
  );

  // Flatten all pages into a single array of companies
  const companies = React.useMemo(() => {
    return data?.pages.flatMap(page => page.data) || [];
  }, [data]);

  // Mark as initialized after first data load
  React.useEffect(() => {
    if (data && !isInitialized) {
      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  // Update URL params - single source of truth
  const updateURLParams = React.useCallback((
    newSearch: string,
    newSectorIds: string[],
    newFundIds: string[],
    newPersonalityIds: string[]
  ) => {
    const hasAnyFilters = newSearch || newSectorIds.length > 0 || newFundIds.length > 0 || newPersonalityIds.length > 0;

    if (!hasAnyFilters) {
      setSearchParams({}, { replace: true });
      return;
    }

    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newSectorIds.length > 0) params.set('sectorIds', newSectorIds.join(','));
    if (newFundIds.length > 0) params.set('fundIds', newFundIds.join(','));
    if (newPersonalityIds.length > 0) params.set('personalityIds', newPersonalityIds.join(','));

    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const updateSearch = React.useCallback((newSearch: string) => {
    const currentSectorIds = searchParams.get('sectorIds')?.split(',').filter(Boolean) || [];
    const currentFundIds = searchParams.get('fundIds')?.split(',').filter(Boolean) || [];
    const currentPersonalityIds = searchParams.get('personalityIds')?.split(',').filter(Boolean) || [];
    updateURLParams(newSearch, currentSectorIds, currentFundIds, currentPersonalityIds);
  }, [updateURLParams, searchParams]);

  const updateSectorIds = React.useCallback((newSectorIds: string[]) => {
    const currentSearch = searchParams.get('search') || '';
    const currentFundIds = searchParams.get('fundIds')?.split(',').filter(Boolean) || [];
    const currentPersonalityIds = searchParams.get('personalityIds')?.split(',').filter(Boolean) || [];
    updateURLParams(currentSearch, newSectorIds, currentFundIds, currentPersonalityIds);
  }, [updateURLParams, searchParams]);

  const updateFundIds = React.useCallback((newFundIds: string[]) => {
    const currentSearch = searchParams.get('search') || '';
    const currentSectorIds = searchParams.get('sectorIds')?.split(',').filter(Boolean) || [];
    const currentPersonalityIds = searchParams.get('personalityIds')?.split(',').filter(Boolean) || [];
    updateURLParams(currentSearch, currentSectorIds, newFundIds, currentPersonalityIds);
  }, [updateURLParams, searchParams]);

  const updatePersonalityIds = React.useCallback((newPersonalityIds: string[]) => {
    const currentSearch = searchParams.get('search') || '';
    const currentSectorIds = searchParams.get('sectorIds')?.split(',').filter(Boolean) || [];
    const currentFundIds = searchParams.get('fundIds')?.split(',').filter(Boolean) || [];
    updateURLParams(currentSearch, currentSectorIds, currentFundIds, newPersonalityIds);
  }, [updateURLParams, searchParams]);

  const clearAllFilters = React.useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return {
    companies,
    isLoading: isLoading || !isInitialized,
    isFetching,
    isFetchingNextPage,
    error,
    search,
    sectorIds,
    fundIds,
    personalityIds,
    updateSearch,
    updateSectorIds,
    updateFundIds,
    updatePersonalityIds,
    clearAllFilters,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage
  };
}

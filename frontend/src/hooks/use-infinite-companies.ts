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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get current values from URL params or use defaults with proper fallbacks
  const currentSearch = searchParams.get('search') || '';
  const currentSectorIds = searchParams.get('sectorIds')?.split(',').filter(Boolean) || [];
  const currentFundIds = searchParams.get('fundIds')?.split(',').filter(Boolean) || [];
  const currentPersonalityIds = searchParams.get('personalityIds')?.split(',').filter(Boolean) || [];
  
  const [search, setSearch] = React.useState(currentSearch);
  const [sectorIds, setSectorIds] = React.useState<string[]>(currentSectorIds);
  const [fundIds, setFundIds] = React.useState<string[]>(currentFundIds);
  const [personalityIds, setPersonalityIds] = React.useState<string[]>(currentPersonalityIds);
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

  // Update URL params when state changes
  const updateURLParams = React.useCallback((
    newSearch: string,
    newSectorIds: string[],
    newFundIds: string[],
    newPersonalityIds: string[]
  ) => {
    const params = new URLSearchParams();
    if (newSearch) params.set('search', newSearch);
    if (newSectorIds.length > 0) params.set('sectorIds', newSectorIds.join(','));
    if (newFundIds.length > 0) params.set('fundIds', newFundIds.join(','));
    if (newPersonalityIds.length > 0) params.set('personalityIds', newPersonalityIds.join(','));
    
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  // Sync URL params with state when URL changes
  React.useEffect(() => {
    if (currentSearch !== search) {
      setSearch(currentSearch);
    }
    if (JSON.stringify(currentSectorIds) !== JSON.stringify(sectorIds)) {
      setSectorIds(currentSectorIds);
    }
    if (JSON.stringify(currentFundIds) !== JSON.stringify(fundIds)) {
      setFundIds(currentFundIds);
    }
    if (JSON.stringify(currentPersonalityIds) !== JSON.stringify(personalityIds)) {
      setPersonalityIds(currentPersonalityIds);
    }
  }, [currentSearch, currentSectorIds, currentFundIds, currentPersonalityIds, search, sectorIds, fundIds, personalityIds]);

  const updateSearch = (newSearch: string) => {
    setSearch(newSearch);
    updateURLParams(newSearch, sectorIds, fundIds, personalityIds);
  };

  const updateSectorIds = (newSectorIds: string[]) => {
    setSectorIds(newSectorIds);
    updateURLParams(search, newSectorIds, fundIds, personalityIds);
  };

  const updateFundIds = (newFundIds: string[]) => {
    setFundIds(newFundIds);
    updateURLParams(search, sectorIds, newFundIds, personalityIds);
  };

  const updatePersonalityIds = (newPersonalityIds: string[]) => {
    setPersonalityIds(newPersonalityIds);
    updateURLParams(search, sectorIds, fundIds, newPersonalityIds);
  };

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
    hasNextPage: hasNextPage ?? false,
    fetchNextPage
  };
}

import type { CompanyControllerFindAllData } from "@/api/hooks";
import { companyControllerFindAll } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "./use-api-client";

export function useCompanies(page: number = 1, limit: number = 30, search?: string) {
  // Ensure the API client is configured
  useApiClient();

  return useQuery({
    queryKey: ["companies", page, limit, search],
    queryFn: async () => {
      const options: CompanyControllerFindAllData = {
        query: { page, limit, search },
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
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  const { data: response, isLoading, error, isFetching } = useCompanies(page, limit, search);

  const companies = response?.data || [];
  const pagination = response?.pagination;

  // Mark as initialized after first data load
  React.useEffect(() => {
    if (response && !isInitialized) {
      setIsInitialized(true);
    }
  }, [response, isInitialized]);

  // Update URL params when state changes
  const updateURLParams = React.useCallback((newPage: number, newLimit: number, newSearch: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newLimit !== initialLimit) params.set('limit', newLimit.toString());
    if (newSearch) params.set('search', newSearch);
    
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
    updateURLParams(newPage, limit, search);
  };

  const goToNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    updateURLParams(newPage, limit, search);
  };

  const goToPreviousPage = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    updateURLParams(newPage, limit, search);
  };

  const updateSearch = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1); // Reset to first page when search changes
    updateURLParams(1, limit, newSearch);
  };

  const updateLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
    updateURLParams(1, newLimit, search);
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
    goToPage,
    goToNextPage,
    goToPreviousPage,
    updateSearch,
    updateLimit,
    hasNextPage: pagination?.totalPages ? page < pagination.totalPages : companies.length === limit,
    hasPreviousPage: page > 1
  };
}

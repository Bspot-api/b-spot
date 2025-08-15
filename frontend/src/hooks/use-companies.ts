import type { CompanyControllerFindAllData } from "@/api/hooks";
import { companyControllerFindAll } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useApiClient } from "./use-api-client";

export function useCompanies(page: number = 1, limit: number = 30) {
  // Ensure the API client is configured
  useApiClient();

  return useQuery({
    queryKey: ["companies", page, limit],
    queryFn: async () => {
      const options: CompanyControllerFindAllData = {
        query: { page, limit },
        url: '/companies'
      };
      const response = await companyControllerFindAll(options);
      return response.data;
    },
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
  const currentFilter = searchParams.get('filter') || '';
  
  const [page, setPage] = React.useState(currentPage);
  const [limit, setLimit] = React.useState(currentLimit);
  const [filter, setFilter] = React.useState(currentFilter);
  const [isInitialized, setIsInitialized] = React.useState(false);
  
  const { data: response, isLoading, error } = useCompanies(page, limit);

  const companies = response?.data || [];
  const pagination = response?.pagination;

  // Mark as initialized after first data load
  React.useEffect(() => {
    if (response && !isInitialized) {
      setIsInitialized(true);
    }
  }, [response, isInitialized]);

  // Update URL params when state changes
  const updateURLParams = React.useCallback((newPage: number, newLimit: number, newFilter: string) => {
    const params = new URLSearchParams();
    if (newPage > 1) params.set('page', newPage.toString());
    if (newLimit !== initialLimit) params.set('limit', newLimit.toString());
    if (newFilter) params.set('filter', newFilter);
    
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
    if (currentFilter !== filter) {
      setFilter(currentFilter);
    }
  }, [currentPage, currentLimit, currentFilter, page, limit, filter]);

  const goToPage = (newPage: number) => {
    setPage(newPage);
    updateURLParams(newPage, limit, filter);
  };

  const goToNextPage = () => {
    const newPage = page + 1;
    setPage(newPage);
    updateURLParams(newPage, limit, filter);
  };

  const goToPreviousPage = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
    updateURLParams(newPage, limit, filter);
  };

  const updateFilter = (newFilter: string) => {
    setFilter(newFilter);
    setPage(1); // Reset to first page when filter changes
    updateURLParams(1, limit, newFilter);
  };

  const updateLimit = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit changes
    updateURLParams(1, newLimit, filter);
  };

  return {
    companies,
    pagination,
    isLoading: isLoading || !isInitialized,
    error,
    page,
    limit,
    filter,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    updateFilter,
    updateLimit,
    hasNextPage: pagination?.totalPages ? page < pagination.totalPages : companies.length === limit,
    hasPreviousPage: page > 1
  };
}

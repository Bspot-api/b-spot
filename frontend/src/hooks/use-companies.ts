import type { CompanyControllerFindAllData } from "@/api/hooks";
import { companyControllerFindAll } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import React from "react";
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

// Hook for pagination state management
export function useCompaniesPagination(initialPage: number = 1, initialLimit: number = 30) {
  const [page, setPage] = React.useState(initialPage);
  const [limit, setLimit] = React.useState(initialLimit);
  
  const { data: response, isLoading, error } = useCompanies(page, limit);

  const companies = response?.data || [];
  const pagination = response?.pagination;

  const goToPage = (newPage: number) => {
    setPage(newPage);
  };

  const goToNextPage = () => {
    setPage(prev => prev + 1);
  };

  const goToPreviousPage = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  return {
    companies,
    pagination,
    isLoading,
    error,
    page,
    limit,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage: pagination?.totalPages ? page < pagination.totalPages : companies.length === limit,
    hasPreviousPage: page > 1
  };
}

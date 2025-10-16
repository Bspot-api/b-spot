import { personalityControllerGetCompanies } from "@/api/hooks";
import type { PersonalityControllerGetCompaniesData } from "@/api/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export function usePersonalityCompanies(personalityId: string) {
  useApiClient();

  return useInfiniteQuery({
    queryKey: ["personality-companies", personalityId],
    queryFn: async ({ pageParam = 1 }) => {
      const options: PersonalityControllerGetCompaniesData = {
        path: { id: personalityId },
        query: {
          page: pageParam,
          limit: 20,
        },
        url: `/personalities/${personalityId}/companies`,
      };
      const response = await personalityControllerGetCompanies(options);
      return response.data;
    },
    getNextPageParam: (lastPage: any) => {
      const { pagination } = lastPage;
      if (pagination && pagination.page < pagination.totalPages) {
        return pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!personalityId,
  });
}

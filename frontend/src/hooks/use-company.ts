import { companyControllerFindOne } from "@/api/hooks";
import type { CompanyControllerFindOneData } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export function useCompany(id: string) {
  useApiClient();

  return useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      const options: CompanyControllerFindOneData = {
        path: { id },
        url: `/companies/${id}`,
      };
      const response = await companyControllerFindOne(options);
      return response.data;
    },
    enabled: !!id,
  });
}

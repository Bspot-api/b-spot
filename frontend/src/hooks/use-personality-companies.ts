import { personalityControllerGetCompanies } from "@/api/hooks";
import type { PersonalityControllerGetCompaniesData } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export function usePersonalityCompanies(personalityId: string) {
  useApiClient();

  return useQuery({
    queryKey: ["personality-companies", personalityId],
    queryFn: async () => {
      const options: PersonalityControllerGetCompaniesData = {
        path: { id: personalityId },
        url: `/personalities/${personalityId}/companies`,
      };
      const response = await personalityControllerGetCompanies(options);
      return response.data;
    },
    enabled: !!personalityId,
  });
}

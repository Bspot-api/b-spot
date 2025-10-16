import { personalityControllerFindOne } from "@/api/hooks";
import type { PersonalityControllerFindOneData } from "@/api/hooks";
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./use-api-client";

export function usePersonality(id: string) {
  useApiClient();

  return useQuery({
    queryKey: ["personality", id],
    queryFn: async () => {
      const options: PersonalityControllerFindOneData = {
        path: { id },
        url: `/personalities/${id}`,
      };
      const response = await personalityControllerFindOne(options);
      return response.data;
    },
    enabled: !!id,
  });
}

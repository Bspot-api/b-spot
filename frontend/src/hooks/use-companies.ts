import { companyControllerFindAll } from "@/api/hooks"
import { useQuery } from "@tanstack/react-query"

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const response = await companyControllerFindAll()
      return response.data
    },
  })
}

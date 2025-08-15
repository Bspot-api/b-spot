import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export interface Sector {
  id: string;
  name: string;
  description?: string;
  companyCount: number;
}

export function useSectors() {
  return useQuery({
    queryKey: ['sectors'],
    queryFn: async (): Promise<Sector[]> => {
      const response = await apiClient.get('/sectors');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export interface Personality {
  id: string;
  name: string;
  description?: string;
}

export function usePersonalities() {
  return useQuery({
    queryKey: ['personalities'],
    queryFn: async (): Promise<Personality[]> => {
      const response = await apiClient.get('/personalities');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

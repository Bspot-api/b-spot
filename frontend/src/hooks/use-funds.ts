import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export interface Fund {
  id: string;
  name: string;
  description?: string;
}

export function useFunds() {
  return useQuery({
    queryKey: ['funds'],
    queryFn: async (): Promise<Fund[]> => {
      const response = await apiClient.get('/funds');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

import { apiClient } from '@/lib/api-client';
import { useQuery } from '@tanstack/react-query';

export function createEntityQuery<T>(endpoint: string) {
  return () => {
    return useQuery({
      queryKey: [endpoint],
      queryFn: async (): Promise<T[]> => {
        const response = await apiClient.get(`/${endpoint}`);
        return response.data;
      },
      staleTime: 5 * 60 * 1000,
    });
  };
}

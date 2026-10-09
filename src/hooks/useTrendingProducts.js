import { useQuery } from '@tanstack/react-query';
import api from '../services/authService';

export default function useTrendingProducts() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trendingProducts'],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
      try {
        const res = await api.get('/api/v1/homepage/trending', {
          signal: controller.signal,
        });
        return res.data;
      } finally {
        clearTimeout(timeoutId);
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const products = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
  const isError = !!error || products.length === 0;

  return { products, loading: isLoading, error: isError };
}

import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productService';

export default function useProducts(params = {}) {
  const { data, isLoading, error } = useQuery({
    // Using stringify here intentionally to stabilize the queryKey across identical object references
    // Alternatively, React Query hashes objects automatically, so we can just pass params!
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const products = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

  return { products, loading: isLoading, error };
}

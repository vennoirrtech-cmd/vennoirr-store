import { useQuery } from '@tanstack/react-query';
import api from '../services/authService';

export default function useHomepageSections() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['homepage-sections'],
    queryFn: async () => {
      const response = await api.get('/api/v1/homepage/sections');
      return response.data;
    },
    staleTime: 5 * 60 * 1000, 
  });

  const sections = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);

  return { sections, loading: isLoading, error };
}

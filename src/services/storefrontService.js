import api from './authService';

export const getHeroSlides = async () => {
  const response = await api.get('/api/v1/hero-slides');
  return response.data;
};

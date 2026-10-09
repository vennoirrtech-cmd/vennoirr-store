import api from './authService';

export const searchProducts = async (q) => {
  // Route is /api/v1/search/products  (NOT /api/v1/search)
  const res = await api.get('/api/v1/search/products', { params: { q } });
  return res.data;
};

export const getSuggestions = async (q) => {
  const res = await api.get('/api/v1/search/categories', { params: { q } });
  return res.data;
};

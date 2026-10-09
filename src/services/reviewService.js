import api from './authService';

export const getProductReviews = async (productId) => {
  const res = await api.get(`/api/v1/reviews/product/${productId}`);
  return res.data;
};

export const addReview = async (productId, data) => {
  // data = { rating, title, comment }
  const res = await api.post(`/api/v1/reviews/product/${productId}`, data);
  return res.data;
};

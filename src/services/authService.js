import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is invalid or expired
      window.dispatchEvent(new Event('auth_logout_required'));
    }
    return Promise.reject(error);
  }
);

export const loginWithFirebaseToken = async (idToken) => {
  const response = await api.post('/api/v1/auth/verify-otp', { idToken });
  return response.data;
};

export default api;

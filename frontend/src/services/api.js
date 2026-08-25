 import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
});

// Attach token to outgoing requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Catch unauthorized API responses & force login redirect
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginEndpoint = error.config?.url?.includes('/auth/login');

    // Only redirect if unauthorized AND not already trying to log in
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      !isLoginEndpoint
    ) {
      localStorage.removeItem('token');
      localStorage.removeItem('reception_token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default API;
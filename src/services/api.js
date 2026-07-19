// Axios instance configured for the real Express backend.
// In production, set VITE_API_URL=http://localhost:5000/api and use these calls.
// The frontend currently uses mockApi.js (localStorage) for live demo purposes.

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Centralized error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network Error';
    return Promise.reject({ message, status: error.response?.status });
  }
);

export default api;

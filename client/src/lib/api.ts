import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost/api';

export const api = axios.create({
  baseURL,
  withCredentials: false
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`
    };
  }
  return config;
});
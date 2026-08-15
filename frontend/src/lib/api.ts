import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

import { toast } from 'sonner';

// Add a request interceptor to inject the JWT token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const message = error.response?.data?.error?.message || error.response?.data?.message || error.message || 'An error occurred';
      
      if (error.response?.status === 401) {
        toast.error('Session expired or unauthorized. Please log in again.');
        // Could also trigger a redirect here if needed
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to perform this action.');
      } else {
        toast.error(message);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

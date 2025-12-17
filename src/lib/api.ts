import axios from 'axios';

// Base URL read from Vite environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  // Fail fast in development if the env var is missing
  // (in production this will just log in the console)
  // eslint-disable-next-line no-console
  console.error('VITE_API_BASE_URL is not defined in your environment.');
}

// Optional shared axios instance if you want to reuse it
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getTrafficStats = () => api.get('/api/analytics/traffic');
export const getTotalVisitors = () => api.get('/api/analytics/total-visitors-stats');
export const getTotalArticles = () => api.get('/api/analytics/count-articles');
export const getCommentStats = () => api.get('/api/analytics/stats');
export const getUserNonAdmin = () => api.get('/api/analytics/users/non-admin');
export const banUser = (id: string) => api.put(`/user/ban-user/${id}`);


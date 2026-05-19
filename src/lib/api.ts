import axios, { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios';

// Base URL from Vite environment variable
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

if (!API_BASE_URL) {
  console.error('VITE_API_BASE_URL is not defined in your environment.');
}

// Create Axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// === Request Interceptor ===
// === Request Interceptor ===
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      } else if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// === Response Interceptor for 401 ===
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token found');

        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken },
          { withCredentials: true }
        );

        // ⚡ Fix ici : le backend renvoie token et refreshToken
        const { token: accessToken, refreshToken: newRefreshToken } = response.data;

        // Update tokens in localStorage
        localStorage.setItem('token', accessToken);
        if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

        // Update axios default headers
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ===============================
// ANALYTICS API
// ===============================

export const getAnalyticsDashboard = () =>
  api.get('/analytics/dashboard');

export const getTrafficPerDay = (days = 30) =>
  api.get(`/analytics/traffic/daily?days=${days}`);

export const getTopPages = (limit = 10) =>
  api.get(`/analytics/top-pages?limit=${limit}`);

export const getTopArticles = () =>
  api.get('/analytics/top-articles');
export const getTopProjects = () =>
  api.get('/analytics/top-projects');

// ===============================
// CONTENT / GLOBAL STATS
// ===============================

export const getTotalArticles = () =>
  api.get('/analytics/count-articles');

export const getTotalInitiatives = () =>
  api.get('/analytics/count-initiatives');

export const getTotalResources = () =>
  api.get('/analytics/count-ressources');

export const getCommentStats = () =>
  api.get('/analytics/stats');

// ===============================
// USERS
// ===============================

export const getUserNonAdmin = () =>
  api.get('/analytics/users/non-admin');

export const banUser = (id: string) =>
  api.put(`/user/ban-user/${id}`);
export const getDeviceStats = () =>
  api.get("/analytics/device-stats");


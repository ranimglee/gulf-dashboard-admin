import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; 

export const getTrafficStats = () => axios.get(`${API_BASE_URL}/api/analytics/traffic`);
export const getTotalVisitors = () => axios.get(`${API_BASE_URL}/api/analytics/total-visitors-stats`);
export const getTotalArticles = () => axios.get(`${API_BASE_URL}/api/analytics/count-articles`);
export const getCommentStats = () => axios.get(`${API_BASE_URL}/api/analytics/stats`);
export const getUserNonAdmin = () => axios.get(`${API_BASE_URL}/api/analytics/users/non-admin`);
export const banUser = (id: string) => {
  return axios.put(`${API_BASE_URL}/user/ban-user/${id}`);
};


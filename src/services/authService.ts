import axios from 'axios';

const API_URL = 'https://blog-m2jm.onrender.com/auth/login';

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const response = await axios.post(API_URL, data, {
      withCredentials: true, 
    });
    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Une erreur est survenue. Veuillez réessayer.';
    throw new Error(message);
  }
};

import axios from 'axios';
import { API_BASE_URL } from '../lib/api';

const LOGIN_URL = `${API_BASE_URL}/auth/login`;

export const loginUser = async (data: {
  email: string;
  password: string;
  captchaToken: string; // ✅ ADD THIS
}) => {
  try {
    const response = await axios.post(
      LOGIN_URL,
      {
        email: data.email,
        password: data.password,
        captchaToken: data.captchaToken, // ✅ SEND TO BACKEND
      },
      {
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Une erreur est survenue. Veuillez réessayer.';

    throw new Error(message);
  }
};
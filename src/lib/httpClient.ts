import axios from 'axios';
import { LOCAL_KEYS } from '@/constants/local';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LOCAL_KEYS.API_BASE_URL) || process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

export const httpClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v) => parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`));
      } else {
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value as string)}`);
      }
    }
    return parts.join('&');
  },
});

httpClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem(LOCAL_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

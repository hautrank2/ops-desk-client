import axios from 'axios';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('API_BASE_URL') || process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
};

export const api = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Update baseURL when it changes in localStorage
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === 'API_BASE_URL') {
      api.defaults.baseURL = e.newValue || process.env.NEXT_PUBLIC_API_BASE_URL || '/api';
    }
  });
}

// Add interceptors for auth if needed
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  signin: async (data: any) => {
    const response = await api.post('/auth/signin', data);
    return response.data;
  },
};

export const assetService = {
  findAll: async (params: any) => {
    const response = await api.get('/asset', { params });
    return response.data;
  },
  findOne: async (id: string) => {
    const response = await api.get(`/asset/${id}`);
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/asset', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/asset/${id}`, data);
    return response.data;
  },
  remove: async (id: string) => {
    const response = await api.delete(`/asset/${id}`);
    return response.data;
  },
};

export const ticketService = {
  findAll: async (params: any) => {
    const response = await api.get('/ticket', { params });
    return response.data;
  },
  findOne: async (id: string) => {
    const response = await api.get(`/ticket/${id}`);
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/ticket', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.patch(`/ticket/${id}`, data);
    return response.data;
  },
};

export const departmentService = {
  findAll: async () => {
    const response = await api.get('/department');
    return response.data;
  },
};

export const userService = {
  findAll: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

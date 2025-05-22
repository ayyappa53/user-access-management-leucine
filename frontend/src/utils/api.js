import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
  profile: () => api.get('/auth/profile'),
};

export const softwareAPI = {
  getAll: () => api.get('/software'),
  getById: (id) => api.get(`/software/${id}`),
  create: (data) => api.post('/software', data),
  update: (id, data) => api.put(`/software/${id}`, data),
  delete: (id) => api.delete(`/software/${id}`),
};

export const requestAPI = {
  getAll: () => api.get('/requests'),
  getById: (id) => api.get(`/requests/${id}`),
  getPending: () => api.get('/requests/status/pending'),
  create: (data) => api.post('/requests', data),
  updateStatus: (id, status) => api.patch(`/requests/${id}/status`, { status }),
};

export default api;
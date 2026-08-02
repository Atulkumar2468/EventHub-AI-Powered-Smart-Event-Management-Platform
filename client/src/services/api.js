import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('eventhub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('eventhub_token');
      localStorage.removeItem('eventhub_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Events
export const eventsAPI = {
  getAll: (params) => api.get('/events', { params }),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  register: (id) => api.post(`/events/${id}/register`),
  cancel: (id) => api.delete(`/events/${id}/register`),
  getStats: () => api.get('/events/stats'),
};

// Clubs
export const clubsAPI = {
  getAll: (params) => api.get('/clubs', { params }),
  getById: (id) => api.get(`/clubs/${id}`),
  create: (data) => api.post('/clubs', data),
  join: (id) => api.post(`/clubs/${id}/join`),
  leave: (id) => api.delete(`/clubs/${id}/join`),
};

// Marketplace
export const marketAPI = {
  getAll: (params) => api.get('/marketplace', { params }),
  getById: (id) => api.get(`/marketplace/${id}`),
  create: (data) => api.post('/marketplace', data),
  remove: (id) => api.delete(`/marketplace/${id}`),
};

// Users
export const usersAPI = {
  getDashboard: () => api.get('/users/me/dashboard'),
  getStats: () => api.get('/users/stats'),
};

// AI
export const aiAPI = {
  recommend: (query) => api.post('/ai/recommend', { query }),
};

export default api;

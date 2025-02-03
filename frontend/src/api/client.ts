// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5500/api',
// });

// // Add request interceptor for JWT
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;



import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding jwt token for every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout if 401 response returned from API
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
export const apiClient = {
  get: <T>(url: string) => api.get<T>(url),
  post: <T>(url: string, data: any) => api.post<T>(url, data),
  put: <T>(url: string, data: any) => api.put<T>(url, data),
  delete: <T>(url: string) => api.delete<T>(url),
};

export default api;


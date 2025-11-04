import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:5000',
  withCredentials: false,  // Changed to false since we're using token auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add timeout and validate status
  timeout: 5000,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Handle 401, 403 etc. in components
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Validate token format and expiry
        const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/')));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expired - clear it
          localStorage.removeItem('token');
          return Promise.reject(new Error('Authentication expired - please log in again'));
        }
        
        // Token looks valid - add to request
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        // Malformed token - clear it
        localStorage.removeItem('token');
        return Promise.reject(new Error('Invalid authentication token'));
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    // DON'T send token for sync endpoint to avoid 401s from stale/invalid tokens
    if (config.url.includes('/api/auth/sync/')) {
       return config;
    }

    try {
      const authStorage = JSON.parse(localStorage.getItem('auth-storage'));
      const token = authStorage?.state?.token;
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error reading token from storage', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling global errors (like 401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // We import the store directly here to avoid circular dependencies
        // but since this is common JS/ESM we might need a workaround or just use localStorage
        const authStorage = JSON.parse(localStorage.getItem('auth-storage'));
        const refreshToken = authStorage?.state?.refreshToken;
        
        if (refreshToken) {
          const res = await axios.post(`${api.defaults.baseURL}/api/auth/token/refresh/`, { refresh: refreshToken });
          const newToken = res.data.access;
          
          // Update localStorage directly so the next requests use it
          authStorage.state.token = newToken;
          localStorage.setItem('auth-storage', JSON.stringify(authStorage));
          
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
      }

      // Clear storage and redirect on unauthorized if not already on login page
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

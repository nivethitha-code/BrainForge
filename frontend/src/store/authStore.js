import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setTokens: (access, refresh) => set({ token: access, refreshToken: refresh }),
      
      login: async (email, password) => {
        try {
          const res = await api.post('/api/auth/login/', { email, password });
          const { access, refresh, user } = res.data;
          set({ user, token: access, refreshToken: refresh, isLoggedIn: true });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.detail || 'Login failed' };
        }
      },
      
      logout: () => set({ user: null, token: null, refreshToken: null, isLoggedIn: false }),
      
      updateProfile: async (data) => {
        try {
          const res = await api.patch('/api/auth/me/', data);
          set({ user: res.data });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data || 'Update failed' };
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import { supabase } from '@/lib/supabase';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      token: null,
      refreshToken: null,
      isLoggedIn: false,
      isInitializing: true,
      
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      
      login: async (email, password) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) throw error;
          
          // Sync with Django backend to get/create user profile
          const res = await api.post('/api/auth/sync/', { 
            supabase_id: data.user.id,
            email: data.user.email 
          });
          
          set({ 
            user: res.data.user, 
            token: res.data.access,
            refreshToken: res.data.refresh,
            session: data.session,
            isLoggedIn: true 
          });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message || 'Login failed' };
        }
      },
      
      register: async (email, password, username) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { username }
            }
          });
          
          if (error) throw error;
          return { success: true, user: data.user };
        } catch (error) {
          return { success: false, error: error.message || 'Registration failed' };
        }
      },
      
      verifyOtp: async (email, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup',
      });
      if (error) throw error;

      // Sync with our backend
      const res = await api.post('/api/auth/sync/', {
        supabase_id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username,
      });

      set({ 
        user: res.data.user, 
        token: res.data.access,
        refreshToken: res.data.refresh,
        session: data.session, 
        isLoggedIn: true 
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  refreshTokens: async () => {
    const { refreshToken } = get();
    if (!refreshToken) return { success: false };
    
    try {
      // Use original axios if api.js has interceptors that might loop
      const res = await api.post('/api/auth/token/refresh/', { refresh: refreshToken });
      set({ 
        token: res.data.access,
        refreshToken: res.data.refresh || refreshToken // JWT might not return a new refresh token
      });
      return { success: true };
    } catch (error) {
      set({ user: null, session: null, token: null, refreshToken: null, isLoggedIn: false });
      return { success: false, error: error.message };
    }
  },

  resendOtp: async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
      
      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null, session: null, token: null, refreshToken: null, isLoggedIn: false });
      },
      
      updateProfile: async (data) => {
        try {
          const res = await api.patch('/api/auth/me/', data);
          set({ user: res.data });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data || 'Update failed' };
        }
      },

      deleteAccount: async () => {
        try {
          await api.delete('/api/auth/me/');
          await supabase.auth.signOut();
          set({ user: null, session: null, token: null, refreshToken: null, isLoggedIn: false });
          return { success: true };
        } catch (error) {
          return { success: false, error: error.response?.data?.detail || 'Account deletion failed' };
        }
      },

      loginWithGoogle: async () => {
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin + '/dashboard',
            },
          });
          if (error) throw error;
          return { success: true };
        } catch (error) {
          return { success: false, error: error.message };
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

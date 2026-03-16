'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export function AuthProvider({ children }) {
  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);
      
      if (session) {
        const currentStore = useAuthStore.getState();
        
        // Always set the session if it changes
        if (event === 'SIGNED_IN' || (event === 'INITIAL_SESSION' && !currentStore.token)) {
          try {
            console.log("Syncing user with backend...");
            const res = await api.post('/api/auth/sync/', {
              supabase_id: session.user.id,
              email: session.user.email,
              username: session.user.user_metadata.username || session.user.email.split('@')[0],
            });

            useAuthStore.setState({
              user: res.data.user,
              token: res.data.access,
              refreshToken: res.data.refresh,
              session: session,
              isLoggedIn: true,
              isInitializing: false
            });
            console.log("Sync successful!");
          } catch (error) {
            console.error('Auth sync failed:', error);
            useAuthStore.setState({ isInitializing: false });
          }
        } else {
          // If we already have a token, just stop initializing
          useAuthStore.setState({ isInitializing: false });
        }
      } else {
        useAuthStore.setState({
          user: null,
          session: null,
          token: null,
          refreshToken: null,
          isLoggedIn: false,
          isInitializing: false
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return children;
}

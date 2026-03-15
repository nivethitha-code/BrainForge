import { create } from 'zustand';
import api from '@/lib/api';

export const useQuizStore = create((set, get) => ({
  currentQuiz: null,
  generating: false,
  error: null,

  createQuiz: async (data) => {
    set({ generating: true, error: null });
    try {
      const res = await api.post('/api/quizzes/generate/', data);
      set({ currentQuiz: res.data, generating: false });
      return { success: true, quiz: res.data };
    } catch (error) {
      set({ generating: false, error: error.response?.data?.detail || 'Generation failed' });
      return { success: false, error: error.response?.data?.detail };
    }
  },

  fetchQuiz: async (id) => {
    try {
      const res = await api.get(`/api/quizzes/${id}/`);
      set({ currentQuiz: res.data });
      return res.data;
    } catch (error) {
      return null;
    }
  }
}));

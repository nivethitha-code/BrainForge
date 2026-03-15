import { create } from 'zustand';
import api from '@/lib/api';

export const useAttemptStore = create((set, get) => ({
  currentAttempt: null,
  answers: {},
  timer: 0,
  loading: false,

  startAttempt: async (quizId) => {
    set({ loading: true, answers: {} });
    try {
      const res = await api.post(`/api/attempts/start/${quizId}/`, {});
      set({ currentAttempt: res.data, timer: res.data.quiz_time_limit_seconds || 600, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      return null;
    }
  },

  setAnswer: (questionId, optionId) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: optionId }
    }));
  },

  submitAttempt: async () => {
    const { currentAttempt, answers, loading } = get();
    if (loading) return null;
    set({ loading: true });
    
    const formattedAnswers = Object.entries(answers).map(([qId, sId]) => ({
      question_id: qId,
      selected_option_id: sId
    }));

    try {
      const res = await api.post(`/api/attempts/${currentAttempt.id}/submit/`, 
        { answers: formattedAnswers }
      );
      set({ currentAttempt: res.data, loading: false });
      return res.data;
    } catch (error) {
      set({ loading: false });
      return null;
    }
  }
}));

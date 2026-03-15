'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { Brain, Settings2, Clock, ListOrdered } from 'lucide-react';

export default function CreateQuizPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const { createQuiz } = useQuizStore();
  const [formData, setFormData] = useState({
    topic: '',
    question_count: 10,
    difficulty: 'medium',
    options_per_question: 4
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await createQuiz(formData, token);
    if (result.success) {
      router.push(`/quiz/${result.quiz.id}/preview`);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-text-primary">Create New Quiz</h1>
        <p className="text-text-muted">Tell us what you want to learn today, and our AI will build a custom quiz for you.</p>
      </div>

      <Card className="p-8 border-none shadow-xl" hover={false}>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Topic Input */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary-purple font-semibold">
              <Brain className="w-5 h-5" />
              <span>Quiz Topic</span>
            </div>
            <Input 
              placeholder="e.g. Ancient Roman History, React Hooks, or Photosynthesis" 
              className="text-lg py-6"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Question Count */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary-purple font-semibold text-sm">
                <ListOrdered className="w-4 h-4" />
                <span>Number of Questions</span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="20" 
                className="w-full h-2 bg-purple-pale rounded-lg appearance-none cursor-pointer accent-primary-purple"
                value={formData.question_count}
                onChange={(e) => setFormData({ ...formData, question_count: e.target.value })}
              />
              <div className="flex justify-between text-xs text-text-muted font-medium">
                <span>5</span>
                <span className="text-primary-purple font-bold text-base">{formData.question_count} Questions</span>
                <span>20</span>
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary-purple font-semibold text-sm">
                <Settings2 className="w-4 h-4" />
                <span>Difficulty Level</span>
              </div>
              <div className="flex gap-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: level })}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      formData.difficulty === level 
                        ? 'bg-primary-purple text-white shadow-md' 
                        : 'bg-purple-pale text-text-muted hover:bg-purple-light'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full py-4 text-lg" disabled={loading}>
              {loading ? 'Initiating AI...' : 'Generate Quiz'}
            </Button>
            <p className="text-center text-xs text-text-muted mt-4 italic">
              AI generation typically takes 10-15 seconds.
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
}

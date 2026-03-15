'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/mascots/Mascot';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { useAttemptStore } from '@/store/attemptStore';
import { Clock, BookOpen, Layers, BarChart3, ChevronLeft } from 'lucide-react';
import { formatTime } from '@/lib/utils';

export default function QuizPreviewPage() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentQuiz, fetchQuiz } = useQuizStore();
  const { startAttempt, loading } = useAttemptStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && token) {
      fetchQuiz(id, token);
    }
  }, [id, token, fetchQuiz]);

  const handleStart = async () => {
    const attempt = await startAttempt(id, token);
    if (attempt) {
      router.push(`/quiz/${id}/take`);
    } else {
      setError("Could not start quiz. Please try again.");
    }
  };

  if (!currentQuiz) return <div className="flex justify-center p-20"><Mascot pose="thinking" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <Button variant="ghost" onClick={() => router.push('/dashboard')} className="group">
        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-text-primary capitalize">{currentQuiz.title}</h1>
            <p className="text-text-muted text-lg">Topic: <span className="text-primary-purple font-semibold">{currentQuiz.topic}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="flex items-center gap-4 p-4 border-none bg-purple-pale/50" hover={false}>
              <div className="p-3 bg-white rounded-xl text-primary-purple shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Questions</p>
                <p className="text-lg font-bold text-text-primary">{currentQuiz.question_count}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-none bg-purple-pale/50" hover={false}>
              <div className="p-3 bg-white rounded-xl text-purple-600 shadow-sm">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Time Limit</p>
                <p className="text-lg font-bold text-text-primary">{formatTime(currentQuiz.time_limit_seconds)}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-none bg-purple-pale/50" hover={false}>
              <div className="p-3 bg-white rounded-xl text-green-600 shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Difficulty</p>
                <p className="text-lg font-bold text-text-primary capitalize">{currentQuiz.difficulty}</p>
              </div>
            </Card>
            <Card className="flex items-center gap-4 p-4 border-none bg-purple-pale/50" hover={false}>
              <div className="p-3 bg-white rounded-xl text-orange-600 shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Options</p>
                <p className="text-lg font-bold text-text-primary">{currentQuiz.options_per_question} per Q</p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-text-primary">Instructions:</h3>
            <ul className="space-y-2 text-text-muted text-sm">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-purple mt-1.5" />
                You cannot pause the timer once you start the quiz.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-purple mt-1.5" />
                The quiz will auto-submit when the time reaches zero.
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-purple mt-1.5" />
                Each question has an AI-generated explanation available after submission.
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-8 bg-white rounded-3xl p-8 border border-border-gray shadow-sm">
          <Mascot pose="study" size="lg" />
          <div className="text-center">
            <h4 className="font-bold text-text-primary">Ready to begin?</h4>
            <p className="text-xs text-text-muted mt-1">Take a deep breath and start!</p>
          </div>
          <Button onClick={handleStart} className="w-full py-6 text-lg" disabled={loading}>
            {loading ? 'Preparing...' : 'Start Quiz'}
          </Button>
          {error && <p className="text-error-red text-xs">{error}</p>}
        </div>
      </div>
    </div>
  );
}

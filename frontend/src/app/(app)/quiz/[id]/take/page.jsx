'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useQuizStore } from '@/store/quizStore';
import { useAttemptStore } from '@/store/attemptStore';
import { ChevronLeft, ChevronRight, Clock, Send } from 'lucide-react';
import { formatTime, cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function TakeQuizPage() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentQuiz } = useQuizStore();
  const { currentAttempt, answers, setAnswer, submitAttempt, loading } = useAttemptStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(currentQuiz?.time_limit_seconds || 0);
  const timerRef = useRef(null);
  const isSubmitting = useRef(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!currentAttempt) {
      router.push(`/quiz/${id}/preview`);
      return;
    }
    
    // Ensure timeLeft is synced
    if (timeLeft === 0) {
      setTimeLeft(currentQuiz.time_limit_seconds);
    }
    
    isInitialized.current = true;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  // Handle timer expiration
  useEffect(() => {
    if (isInitialized.current && timeLeft === 0 && currentAttempt && !isSubmitting.current) {
      handleAutoSubmit();
    }
  }, [timeLeft]);

  const handleAutoSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    clearInterval(timerRef.current);
    
    await submitAttempt(token);
    router.push(`/quiz/${id}/results`);
  };

  const handleSubmit = async () => {
    if (isSubmitting.current) return;
    isSubmitting.current = true;
    clearInterval(timerRef.current);

    const res = await submitAttempt(token);
    if (res) {
      router.push(`/quiz/${id}/results`);
    } else {
      isSubmitting.current = false;
      // Restart timer if it wasn't expired? Actually 
      // better to stay on page if it fails.
    }
  };

  if (!currentQuiz || !currentAttempt) return null;

  const currentQuestion = currentQuiz.questions[currentIndex];
  const progress = ((currentIndex + 1) / currentQuiz.question_count) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-border-gray shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-pale text-primary-purple rounded-xl flex items-center justify-center font-bold">
            {currentIndex + 1}
          </div>
          <div>
            <p className="text-xs text-text-muted font-bold uppercase">Question</p>
            <p className="text-sm font-bold text-text-primary">{currentIndex + 1} of {currentQuiz.question_count}</p>
          </div>
        </div>

        <div className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300",
          timeLeft < 60 ? "bg-red-50 border-error-red text-error-red animate-pulse" : "bg-purple-pale border-purple-light text-primary-purple"
        )}>
          <Clock className={cn("w-5 h-5", timeLeft < 60 && "animate-bounce")} />
          <span className="text-lg font-mono font-bold">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-purple-pale h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="bg-primary-purple h-full"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-8 lg:p-12 min-h-[400px] flex flex-col border-none shadow-lg" hover={false}>
            <h2 className="text-2xl font-bold text-text-primary mb-12">
              {currentQuestion.question_text}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setAnswer(currentQuestion.id, option.id)}
                  className={cn(
                    "flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-200 group relative overflow-hidden",
                    answers[currentQuestion.id] === option.id 
                      ? "bg-primary-purple border-primary-purple text-white shadow-lg scale-[1.02]" 
                      : "bg-white border-border-gray text-text-primary hover:border-primary-purple hover:bg-purple-pale/30"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-sm",
                    answers[currentQuestion.id] === option.id 
                      ? "bg-white/20" 
                      : "bg-purple-pale text-primary-purple group-hover:bg-primary-purple group-hover:text-white"
                  )}>
                    {String.fromCharCode(65 + option.order_index)}
                  </div>
                  <span className="font-medium">{option.option_text}</span>
                  
                  {/* Subtle selection ring */}
                  {answers[currentQuestion.id] === option.id && (
                    <motion.div 
                      layoutId="selection-ring"
                      className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                    />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="secondary" 
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {currentIndex === currentQuiz.question_count - 1 ? (
          <Button 
            className="bg-success-green hover:bg-green-700 shadow-success-green/20" 
            onClick={handleSubmit}
            disabled={loading}
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Quiz
          </Button>
        ) : (
          <Button 
            onClick={() => setCurrentIndex(Math.min(currentQuiz.question_count - 1, currentIndex + 1))}
          >
            Next Question
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { useAttemptStore } from '@/store/attemptStore';
import { useQuizStore } from '@/store/quizStore';
import { CheckCircle2, XCircle, Info, ChevronLeft, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function QuizReviewPage() {
  const router = useRouter();
  const { id } = useParams();
  const { token } = useAuthStore();
  const { currentQuiz } = useQuizStore();
  const { currentAttempt } = useAttemptStore();

  if (!currentQuiz || !currentAttempt) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Button variant="ghost" onClick={() => router.push(`/quiz/${id}/results`)} className="mb-2 p-0 h-auto hover:bg-transparent text-primary-purple">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Results
          </Button>
          <h1 className="text-3xl font-bold text-text-primary">Review Answers</h1>
          <p className="text-text-muted">Analyze your performance and learn from the explanations.</p>
        </div>
      </div>

      <div className="space-y-6">
        {currentQuiz.questions.map((question, index) => {
          const userAnswerId = currentAttempt.answers.find(a => a.question === question.id)?.selected_option;
          const isCorrect = currentAttempt.answers.find(a => a.question === question.id)?.is_correct;
          
          return (
            <Card key={question.id} className="p-0 border-none shadow-md overflow-hidden" hover={false}>
              <div className={cn(
                "p-4 flex items-center gap-3 border-b",
                isCorrect ? "bg-green-50 border-green-100 text-success-green" : "bg-red-50 border-red-100 text-error-red"
              )}>
                {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                <span className="font-bold text-sm uppercase">Question {index + 1} — {isCorrect ? 'Correct' : 'Incorrect'}</span>
              </div>
              
              <div className="p-6 lg:p-8 space-y-6">
                <h3 className="text-xl font-bold text-text-primary leading-relaxed">
                  {question.question_text}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.options.map((option) => {
                    const isUserSelection = option.id === userAnswerId;
                    const isCorrectOption = option.id === question.correct_option_id;
                    
                    return (
                      <div 
                        key={option.id}
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border text-sm font-medium transition-all",
                          isCorrectOption 
                            ? "bg-green-50 border-success-green text-success-green ring-1 ring-success-green" 
                            : isUserSelection 
                              ? "bg-red-50 border-error-red text-error-red" 
                              : "bg-white border-border-gray text-text-muted opacity-60"
                        )}
                      >
                        <div className={cn(
                          "w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black",
                          isCorrectOption ? "bg-success-green text-white" : isUserSelection ? "bg-error-red text-white" : "bg-purple-pale text-primary-purple"
                        )}>
                          {String.fromCharCode(65 + option.order_index)}
                        </div>
                        {option.option_text}
                        {isCorrectOption && <CheckCircle2 className="w-4 h-4 ml-auto" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation Box */}
                <div className="mt-8 bg-purple-pale/50 rounded-2xl p-6 border border-purple-light/50 relative overflow-hidden">
                  <div className="flex items-center gap-2 text-primary-purple font-bold text-sm mb-3">
                    <Lightbulb className="w-4 h-4" />
                    AI EXPLANATION
                  </div>
                  <p className="text-text-primary text-sm leading-relaxed relative z-10">
                    {question.explanation}
                  </p>
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Info className="w-12 h-12" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-8">
        <Button onClick={() => router.push('/dashboard')} size="lg" className="px-12">
          Done Reviewing
        </Button>
      </div>
    </div>
  );
}

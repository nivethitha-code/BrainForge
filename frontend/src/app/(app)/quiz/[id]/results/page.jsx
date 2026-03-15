'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/mascots/Mascot';
import { useAttemptStore } from '@/store/attemptStore';
import { CheckCircle2, XCircle, Clock, Trophy, ArrowRight, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatTime } from '@/lib/utils';

export default function QuizResultsPage() {
  const router = useRouter();
  const { id } = useParams();
  const { currentAttempt } = useAttemptStore();
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (!currentAttempt) {
      router.push(`/quiz/${id}/preview`);
      return;
    }

    const duration = 1500;
    const startTime = Date.now();
    const finalScore = currentAttempt.score || 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      setDisplayScore(Math.floor(progress * finalScore));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [currentAttempt, id, router]);

  if (!currentAttempt) return null;

  const percentage = (currentAttempt.score / currentAttempt.total_questions) * 100;
  const isPassed = percentage >= 70;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-fade-in-up">
      <Card className="p-8 lg:p-16 text-center border-none shadow-2xl relative overflow-hidden" hover={false}>
        {/* Confetti or background decor would go here */}
        
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Mascot pose={isPassed ? 'cheer' : 'sad'} size="lg" />
          
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-text-primary capitalize">
              {isPassed ? 'Terrific Job!' : 'Keep Practicing!'}
            </h1>
            <p className="text-text-muted text-lg">
              You completed the quiz on <span className="text-primary-purple font-bold">{currentAttempt.quiz_title}</span>
            </p>
          </div>

          <div className="flex items-center gap-8 py-8">
            <div className="text-center">
              <motion.div 
                className={`text-6xl font-black ${isPassed ? 'text-success-green' : 'text-primary-purple'}`}
              >
                {displayScore}
                <span className="text-3xl text-text-muted font-normal ml-1">/{currentAttempt.total_questions}</span>
              </motion.div>
              <p className="text-xs font-bold text-text-muted uppercase mt-2">Final Score</p>
            </div>
            <div className="w-px h-16 bg-border-gray" />
            <div className="text-center">
              <div className="text-4xl font-black text-text-primary">
                {Math.round(percentage)}%
              </div>
              <p className="text-xs font-bold text-text-muted uppercase mt-2">Accuracy</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            <div className="bg-purple-pale p-4 rounded-2xl flex flex-col items-center">
              <CheckCircle2 className="w-5 h-5 text-success-green mb-1" />
              <p className="text-lg font-bold">{currentAttempt.score}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase">Correct</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl flex flex-col items-center">
              <XCircle className="w-5 h-5 text-error-red mb-1" />
              <p className="text-lg font-bold">{currentAttempt.total_questions - currentAttempt.score}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase">Incorrect</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-2xl flex flex-col items-center">
              <Clock className="w-5 h-5 text-purple-600 mb-1" />
              <p className="text-lg font-bold">{formatTime(currentAttempt.time_taken_seconds || 0)}</p>
              <p className="text-[10px] text-text-muted font-bold uppercase">Time Taken</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl flex flex-col items-center">
              <Trophy className="w-5 h-5 text-orange-600 mb-1" />
              <p className="text-lg font-bold">1st</p>
              <p className="text-[10px] text-text-muted font-bold uppercase">Rank</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full pt-6">
            <Button className="flex-1 py-4 text-lg gap-2" onClick={() => router.push(`/quiz/${id}/review`)}>
              Review Answers
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="secondary" className="flex-1 py-4 text-lg gap-2" onClick={() => router.push(`/quiz/${id}/preview`)}>
              <RotateCcw className="w-5 h-5" />
              Retake Quiz
            </Button>
          </div>
        </div>
      </Card>
      
      <Button variant="ghost" className="w-full" onClick={() => router.push('/dashboard')}>
        Back to Dashboard
      </Button>
    </div>
  );
}

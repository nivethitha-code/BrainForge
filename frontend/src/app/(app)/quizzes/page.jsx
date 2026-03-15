'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Brain, Clock, ChevronRight, BarChart3, Plus, Search } from 'lucide-react';
import api from '@/lib/api';
import { formatTime } from '@/lib/utils';

export default function MyQuizzesPage() {
  const { token } = useAuthStore();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get('/api/quizzes/');
        setQuizzes(res.data.results || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchQuizzes();
  }, [token]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-text-primary">My Quizzes</h1>
          <p className="text-text-muted">Manage your generated quizzes and view your journey.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-border-gray shadow-sm focus-within:ring-2 focus-within:ring-primary-purple/20 transition-all">
            <Search className="w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search quizzes..." 
              className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-text-muted w-48 lg:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Link href="/quiz/create">
            <Button className="gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              New Quiz
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Card key={i} className="h-48 animate-pulse bg-purple-pale/20" hover={false} />)}
        </div>
      ) : quizzes.length === 0 ? (
        <Card className="p-20 text-center space-y-4" hover={false}>
          <div className="w-16 h-16 bg-purple-pale rounded-full flex items-center justify-center mx-auto text-primary-purple">
            <Brain className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">No quizzes yet</h2>
          <p className="text-text-muted">Create your first AI quiz to start learning.</p>
          <Link href="/quiz/create">
            <Button>Get Started</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.filter(q => q.title.toLowerCase().includes(searchTerm.toLowerCase()) || q.topic.toLowerCase().includes(searchTerm.toLowerCase())).map((quiz) => (
            <Card key={quiz.id} className="p-0 border-none shadow-sm flex flex-col group overflow-hidden">
              <div className="bg-gradient-to-br from-purple-pale to-purple-light/50 p-6 flex items-center justify-between border-b border-border-gray">
                <div className="p-3 bg-white rounded-xl text-primary-purple shadow-sm group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  quiz.difficulty === 'hard' ? 'bg-red-100 text-error-red' :
                  quiz.difficulty === 'medium' ? 'bg-orange-100 text-orange-600' :
                  'bg-green-100 text-success-green'
                }`}>
                  {quiz.difficulty}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <h3 className="text-xl font-bold text-text-primary capitalize line-clamp-2">
                  {quiz.title}
                </h3>
                
                <div className="flex items-center justify-between text-xs font-bold text-text-muted uppercase">
                  <div className="flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4" />
                    {quiz.question_count} Qs
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {formatTime(quiz.time_limit_seconds)}
                  </div>
                </div>

                <div className="pt-2">
                  <Link href={`/quiz/${quiz.id}/preview`}>
                    <Button variant="outline" className="w-full group/btn">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

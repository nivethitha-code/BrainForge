'use client';

import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Brain, History, Target, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const { user, token } = useAuthStore();
  const [statsData, setStatsData] = useState({
    quizzes_created: 0,
    total_attempts: 0,
    average_score: 0,
    best_score: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/api/quizzes/stats/'),
          api.get('/api/attempts/')
        ]);
        setStatsData(statsRes.data);
        setRecentActivity(activityRes.data.slice(0, 5)); // Get last 5
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token]);

  const stats = [
    { label: 'Quizzes Created', value: statsData.quizzes_created.toString(), icon: Brain, color: 'purple' },
    { label: 'Total Attempts', value: statsData.total_attempts.toString(), icon: History, color: 'purple' },
    { label: 'Average Score', value: `${statsData.average_score}%`, icon: Target, color: 'green' },
    { label: 'Best Score', value: statsData.best_score.toString(), icon: TrendingUp, color: 'orange' },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      <WelcomeBanner username={user?.username || 'Learner'} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Recent Activity</h2>
            <button className="text-sm font-semibold text-primary-purple hover:underline">View All</button>
          </div>
          
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((attempt) => (
                <div key={attempt.id} className="bg-white rounded-xl border border-border-gray p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-pale flex items-center justify-center text-primary-purple">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary">{attempt.quiz_title || 'Untitled Quiz'}</h3>
                      <p className="text-sm text-text-muted">
                        {new Date(attempt.submitted_at || attempt.started_at).toLocaleDateString()} • {attempt.quiz_topic}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold",
                      attempt.score / attempt.total_questions >= 0.7 
                        ? "bg-green-50 text-success-green" 
                        : "bg-orange-50 text-orange-600"
                    )}>
                      {attempt.score}/{attempt.total_questions}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-xl border border-border-gray p-6 text-center text-text-muted italic">
                {loading ? 'Crunching your stats...' : 'No recent attempts yet. Start your first quiz!'}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-text-primary">Quiz Performance</h2>
          <div className="bg-white rounded-xl border border-border-gray p-6 space-y-6 shadow-sm">
            {recentActivity.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end h-40 gap-3">
                  {recentActivity
                    .filter(a => a.status === 'completed')
                    .slice(0, 7)
                    .reverse()
                    .map((attempt) => {
                      const percentage = Math.round((attempt.score / (attempt.total_questions || 1)) * 100);
                      return (
                        <div key={attempt.id} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <div 
                            className="w-full bg-primary-purple rounded-t-lg transition-all group-hover:bg-purple-dark relative min-h-[4px]"
                            style={{ height: `${Math.max(percentage, 5)}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-text-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                              {percentage}%
                            </div>
                          </div>
                          <span className="text-[10px] text-text-muted truncate w-full text-center">
                            {new Date(attempt.submitted_at || attempt.started_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      );
                    })}
                </div>
                <p className="text-xs text-text-muted text-center pt-4 border-t border-border-gray">
                  Showing your last {recentActivity.length} attempts
                </p>
              </div>
            ) : (
              <div className="aspect-square flex items-center justify-center text-text-muted text-center italic text-sm">
                Complete a quiz to see your performance chart!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

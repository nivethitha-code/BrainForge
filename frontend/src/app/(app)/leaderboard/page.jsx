'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from '@/components/ui/Card';
import { Trophy, Medal, TargetCircle, TrendingUp } from 'lucide-react';
import { Mascot } from '@/components/mascots/Mascot';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function LeaderboardPage() {
  const { token } = useAuthStore();
  const [leaderboard, setLeaderboard] = useState([]);
  const [userStats, setUserStats] = useState({ rank: '...', score: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/api/attempts/leaderboard/');
        setLeaderboard(res.data.leaderboard);
        setUserStats(res.data.user_stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchLeaderboard();
  }, [token]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary-purple to-purple-dark rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold">Leaderboard</h1>
            <p className="text-purple-100 max-w-md text-lg">
              Compete with the best! See where you stand among the BrainForge community.
            </p>
          </div>
          <Mascot pose="cheer" size="lg" className="drop-shadow-2xl" />
        </div>
        {/* Abstract background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/20 rounded-full -ml-24 -mb-24 blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-0 overflow-hidden border-none shadow-lg">
            <div className="bg-white p-6 border-b border-border-gray flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Global Rankings
              </h2>
              <span className="text-sm font-medium text-text-muted">Updated daily</span>
            </div>
            <div className="divide-y divide-border-gray">
              {leaderboard.map((user) => (
                <div key={user.rank} className="flex items-center justify-between p-6 hover:bg-purple-pale transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center text-lg font-bold text-text-muted group-hover:text-primary-purple">
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-purple-light flex items-center justify-center text-primary-purple font-bold">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary capitalize">{user.username}</h3>
                      <p className="text-xs text-text-muted">Brain Master Level</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-primary-purple">{user.score}</div>
                    <div className="text-xs text-text-muted">points</div>
                  </div>
                </div>
              ))}
              {leaderboard.length === 0 && !loading && (
                <div className="p-12 text-center text-text-muted italic">
                  No rankings available yet. Complete a quiz to join!
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-gradient-to-br from-white to-purple-pale border-none shadow-md">
            <h2 className="text-xl font-bold text-text-primary mb-4">Your Position</h2>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary-purple flex items-center justify-center text-white text-2xl font-bold">
                {userStats.username?.[0].toUpperCase() || 'Y'}
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-xl">You</h3>
                <p className="text-text-muted">Ranked #{userStats.rank}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                  <Medal className="w-4 h-4 text-primary-purple" />
                  Your Score
                </div>
                <div className="font-bold text-primary-purple">{userStats.score}</div>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm">
                <div className="flex items-center gap-2 text-sm font-medium text-text-muted">
                  <TrendingUp className="w-4 h-4 text-success-green" />
                  Accuracy
                </div>
                <div className="font-bold text-success-green">{userStats.accuracy || 0}%</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-md bg-white">
            <h2 className="text-lg font-bold text-text-primary mb-4">Weekly Challenge</h2>
            <p className="text-sm text-text-muted mb-4">
              Complete 5 quizzes this week to earn double bonus points!
            </p>
            <div className="w-full bg-purple-pale h-2 rounded-full overflow-hidden">
              <div 
                className="bg-primary-purple h-full transition-all duration-500" 
                style={{ width: `${Math.min((userStats.weekly_count || 0) / 5 * 100, 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs font-medium text-text-muted">
              <span>{userStats.weekly_count || 0}/5 Completed</span>
              <span>{Math.round(Math.min((userStats.weekly_count || 0) / 5 * 100, 100))}%</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

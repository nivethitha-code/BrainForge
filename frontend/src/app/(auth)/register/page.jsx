'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/auth/register/', formData);
      router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstError = Object.values(data)[0];
        setError(Array.isArray(firstError) ? firstError[0] : (data.detail || 'Registration failed.'));
      } else {
        setError('Registration failed. Try again.');
      }
    }
    setLoading(false);
  };

  return (
    <AuthCard 
      title="Join BrainForge" 
      description="Create AI-powered quizzes and track your progress with our smart assistant."
      mascotPose="study"
    >
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-text-primary">Create Account</h1>
          <p className="text-text-muted mt-1 font-medium">Start your learning journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Username" 
            placeholder="johndoe" 
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <Input 
            label="Email" 
            type="email" 
            placeholder="john@example.com" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            error={error}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary-purple hover:underline transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

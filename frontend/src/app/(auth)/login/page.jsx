'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
      if (result.error.includes('verified')) {
        // Redirect to verify if not verified
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    }
    setLoading(false);
  };

  return (
    <AuthCard 
      title="Welcome Back!" 
      description="Unleash your academic success with BrainForge's AI Exam Excellence Platform."
      mascotPose="wave"
    >
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-text-primary">Sign in</h1>
          <p className="text-text-muted mt-1 font-medium">Enter your details to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="john@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={error}
          />
          <div className="flex items-center justify-end">
            <Link href="/forgot-password" size="sm" className="text-sm font-medium text-primary-purple hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border-gray"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-text-muted font-bold tracking-widest">Or</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full gap-2"
          onClick={() => alert('Google login is currently being configured and will be available shortly! Please use Email/Password for now. 💜')}
        >
          <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
          Sign in with Google
        </Button>

        <p className="text-center text-sm text-text-muted">
          Are you new?{' '}
          <Link href="/register" className="font-bold text-primary-purple hover:underline transition-colors">
            Create an Account
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

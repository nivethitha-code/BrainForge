'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { verifyOtp, resendOtp } = useAuthStore();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await verifyOtp(email, otp);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setSuccessMsg('');
    const result = await resendOtp(email);
    if (result.success) {
      setSuccessMsg('New code sent to your email!');
    } else {
      setError(result.error);
    }
    setResending(false);
  };

  return (
    <AuthCard 
      title="Check Your Inbox" 
      description={`We've sent a 6-digit verification code to ${email || 'your email'}.`}
      mascotPose="thinking"
    >
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-black text-text-primary">Verify Email</h1>
          <p className="text-text-muted mt-1 font-medium">Enter the status code below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Verification Code" 
            placeholder="12345678" 
            maxLength={8}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            error={error}
          />
          {successMsg && <p className="text-sm text-green-600 text-center font-medium">{successMsg}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </form>

        <div className="text-center space-y-4">
          <p className="text-sm text-text-muted">
            Didn't receive a code?{' '}
            <button 
              onClick={handleResend}
              disabled={resending}
              className="font-bold text-primary-purple hover:underline transition-colors disabled:opacity-50"
            >
              {resending ? 'Resending...' : 'Resend Code'}
            </button>
          </p>
          <Link href="/register" className="block text-sm text-text-muted hover:text-primary-purple transition-colors font-medium">
            Use a different email
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}

// Wrap in Suspense for searchParams
export default function VerifyEmailWrapper() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage />
    </React.Suspense>
  )
}


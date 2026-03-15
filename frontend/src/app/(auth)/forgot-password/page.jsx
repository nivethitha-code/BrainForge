'use client';

import React from 'react';
import Link from 'next/link';
import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/Button';

export default function ForgotPasswordPage() {
  return (
    <AuthCard 
      title="Forgot Password?" 
      description="No worries! Our AI mascot is here to help you get back on track."
      mascotPose="thinking"
    >
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-text-primary">Feature Coming Soon!</h1>
          <p className="text-text-muted font-medium">
            Password recovery is currently being implemented. In the meantime, please contact support or try to remember your password! 💜
          </p>
        </div>

        <Link href="/login" className="block">
          <Button variant="outline" className="w-full">
            Back to Sign In
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
}

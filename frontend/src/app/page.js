'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RootPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/dashboard');
    } else {
      router.replace('/login');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-pale/20">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-primary-purple rounded-xl animate-bounce" />
        <span className="text-primary-purple font-bold tracking-widest uppercase text-sm">BrainForge AI</span>
      </div>
    </div>
  );
}

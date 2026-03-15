import React from 'react';
import { Button } from '../ui/Button';
import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export const Navbar = ({ toggleSidebar }) => {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/80 backdrop-blur-md border-b border-border-gray overflow-hidden">
      <div className="h-full flex items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={toggleSidebar}>
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative text-text-muted"
            onClick={() => router.push('/profile')}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error-red rounded-full border border-white"></span>
          </Button>
          <div 
            className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-light to-primary-purple border-2 border-white shadow-sm cursor-pointer overflow-hidden transition-transform hover:scale-110"
            onClick={() => router.push('/profile')}
          >
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'John'}`} alt="Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { LayoutDashboard, BookOpen, Trophy, User, LogOut, Menu } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';

export const Sidebar = ({ isOpen, toggle }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Quizzes', href: '/quizzes', icon: BookOpen },
    { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border-gray transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-purple rounded-lg flex items-center justify-center text-white font-bold">B</div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-purple to-purple-dark">
              BrainForge
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all border-l-4 border-transparent",
                  isActive 
                    ? "bg-primary-purple/10 text-primary-purple shadow-sm ring-1 ring-purple-100 border-l-primary-purple font-bold" 
                    : "text-text-muted hover:bg-purple-pale/50 hover:text-primary-purple"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border-gray">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-text-muted hover:text-error-red hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Card } from '../ui/Card';
import { Mascot } from '../mascots/Mascot';
import { Button } from '../ui/Button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export const WelcomeBanner = ({ username }) => {
  console.log(username);
  return (
    <Card className="relative bg-gradient-to-r from-primary-purple to-purple-dark border-none p-8 lg:p-12 overflow-hidden" hover={false}>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left text-white space-y-4">
          <h1 className="text-3xl lg:text-4xl font-bold">
            Welcome back, <span className="text-purple-100">{username}!</span> 👋
          </h1>
          <p className="text-white/80 text-lg max-w-md">
            Ready to challenge yourself today? Create a new AI-powered quiz or continue your learning journey.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
            <Link href="/quiz/create">
              <Button className="bg-white text-purple-700 hover:bg-purple-50 border-none shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Create New Quiz
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <Mascot pose="cheer" size="lg" className="drop-shadow-2xl" />
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-purple/20 rounded-full blur-3xl -ml-32 -mb-32"></div>
    </Card>
  );
};

import React from 'react';
import { Mascot } from '../mascots/Mascot';
import { Card } from '../ui/Card';

export const AuthCard = ({ title, description, children, mascotPose = 'wave' }) => {
  return (
    <div className="h-screen flex flex-col md:flex-row bg-[#DDA0DD] relative overflow-hidden selection:bg-white/20">
      {/* Plum Theme Mix: Variants of #DDA0DD */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#B070B0_0%,transparent_50%)] opacity-50"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,#FADAFA_0%,transparent_50%)] opacity-40"></div>

      {/* Soft Accents */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-[#FDF2FD] rounded-full blur-[140px] opacity-25 animate-pulse"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-[#8E458E] rounded-full blur-[120px] opacity-30"></div>

      {/* Left Side - Illustration */}
      <div className="hidden md:flex flex-1 flex-col items-center justify-center p-8 lg:p-12 transition-all relative z-10">
        <div className="relative group">
          <div className="absolute -inset-16 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-1000"></div>
          <Mascot pose={mascotPose} size="lg" className="relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
        </div>
        <div className="mt-6 text-center max-w-lg">
          <h2 className="text-3xl lg:text-4xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
            {title}
          </h2>
          <p className="text-white/80 text-base lg:text-lg font-medium leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-6 relative z-10">
        <Card className="w-full max-w-xl py-6 px-10 lg:py-8 lg:px-16 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.2)] bg-white/95 backdrop-blur-xl rounded-[2.5rem]" hover={false}>
          <div className="md:hidden flex justify-center mb-6">
            <Mascot pose={mascotPose} size="lg" />
          </div>
          <div className="text-text-primary">
            {children}
          </div>
        </Card>
      </div>
    </div>
  );
};

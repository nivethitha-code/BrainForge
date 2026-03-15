'use client';

import React from 'react';
import { Mascot } from '@/components/mascots/Mascot';
import { motion } from 'framer-motion';

export default function GeneratingPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-8">
      <div className="relative">
        <Mascot pose="thinking" size="xl" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-4 border-dashed border-primary-purple/30 rounded-full"
        />
      </div>

      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-text-primary capitalize">Generating Your Quiz...</h1>
        <p className="text-text-muted max-w-sm">Our AI is researching your topic and preparing challenging questions for you.</p>
      </div>

      <div className="w-full max-w-md bg-purple-pale h-3 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "easeOut" }}
          className="bg-primary-purple h-full"
        />
      </div>
    </div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export const Mascot = ({ pose = 'wave', size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-[420px] h-[420px]',
    '2xl': 'w-96 h-96',
    auth: 'w-[400px] h-[400px]',
  };

  const images = {
    wave: '/mascots/wave.png',
    thinking: '/mascots/thinking.png',
    study: '/mascots/study.png',
    cheer: '/mascots/cheer.png',
    sad: '/mascots/sad.png',
  };

  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={`relative flex items-center justify-center ${sizes[size]} ${className}`}
    >
      <img
        src={images[pose] || images.wave}
        alt={`Mascot ${pose}`}
        className="w-full h-full object-contain drop-shadow-2xl"
      />
    </motion.div>
  );
};

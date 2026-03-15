import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const Card = ({ children, className, hover = true, ...props }) => {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      className={cn(
        "bg-white rounded-xl border border-border-gray shadow-sm p-6 overflow-hidden",
        hover && "hover:shadow-md transition-shadow",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

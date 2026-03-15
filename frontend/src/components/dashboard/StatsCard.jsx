import React from 'react';
import { Card } from '../ui/Card';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const StatsCard = ({ label, value, icon: Icon, color = 'purple' }) => {
  const colors = {
    purple: 'bg-purple-pale text-primary-purple border-purple-light/50',
    green: 'bg-green-50 text-success-green border-green-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    orange: 'bg-orange-50 text-orange-600 border-orange-100',
  };

  return (
    <Card className="flex flex-col gap-4 p-6 border-none shadow-sm h-full" hover={true}>
      <div className="flex items-center justify-between">
        <div className={cn("p-3 rounded-xl border flex items-center justify-center", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold text-text-muted bg-purple-pale px-2 py-1 rounded-full uppercase tracking-wider">
          Total
        </span>
      </div>
      <div>
        <p className="text-text-muted text-sm font-medium">{label}</p>
        <motion.h3 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-text-primary mt-1"
        >
          {value}
        </motion.h3>
      </div>
    </Card>
  );
};

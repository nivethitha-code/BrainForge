import React from 'react';
import { cn } from '../../lib/utils';

export const Input = React.forwardRef(({ label, error, className, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-inherit/90 ml-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-[1rem] border border-border-gray/20 bg-white px-4 py-2 text-sm text-text-primary ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm",
          error && "border-error-red focus-visible:ring-error-red",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs font-medium text-error-red animation-fade-in">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

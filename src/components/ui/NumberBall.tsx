
import React from 'react';
import { cn } from '@/lib/utils';

interface NumberBallProps {
  number: number | string;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NumberBall = ({ number, highlight = false, size = 'md', className }: NumberBallProps) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base',
  };

  return (
    <div 
      className={cn(
        'number-ball',
        sizeClasses[size],
        highlight ? 'highlight' : 'bg-secondary text-secondary-foreground',
        className
      )}
    >
      {number}
    </div>
  );
};

export default NumberBall;

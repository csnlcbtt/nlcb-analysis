import React from 'react';

interface AnimatedProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const AnimatedFadeIn: React.FC<AnimatedProps> = ({ 
  children, 
  delay = 0,
  duration = 600,
  direction = 'up',
  className = ""
}) => {
  // Determine animation based on direction
  const getAnimation = () => {
    switch (direction) {
      case 'down': return 'fadeInDown';
      case 'left': return 'fadeInLeft';
      case 'right': return 'fadeInRight';
      case 'up':
      default: return 'fadeIn';
    }
  };

  return (
    <div 
      className={`opacity-0 ${className}`}
      style={{
        animation: `${getAnimation()} ${duration}ms ease-out forwards`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

export const AnimatedPulse: React.FC<AnimatedProps> = ({
  children,
  className = ""
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {children}
    </div>
  );
};

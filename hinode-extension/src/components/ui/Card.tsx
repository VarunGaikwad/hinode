import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'button';
}

export default function Card({
  children,
  className = '',
  hover = true,
  as = 'div',
}: CardProps) {
  const classes = `glass-card ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`;

  if (as === 'button') {
    return (
      <button type="button" className={classes}>
        {children}
      </button>
    );
  }

  return <div className={classes}>{children}</div>;
}

import React from 'react';

interface CardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
  ...rest
}: CardProps) {
  const classes = `glass-card text-left ${hover ? 'glass-card-hover cursor-pointer' : ''} ${className}`;

  if (as === 'button') {
    return (
      <button type="button" className={classes} {...rest}>
        {children}
      </button>
    );
  }

  return <div className={classes}>{children}</div>;
}

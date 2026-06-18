import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled = false,
  ...rest
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-hinode-accent focus:ring-offset-2 focus:ring-offset-transparent';

  const variantClasses = {
    primary:
      'bg-hinode-accent text-black shadow-[0_2px_12px_rgba(248,196,113,0.35)] hover:shadow-[0_4px_18px_rgba(248,196,113,0.45)] hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'bg-hinode-surface border border-hinode-border text-hinode-text-primary hover:bg-hinode-surface-2 active:translate-y-0',
    ghost:
      'bg-transparent text-hinode-text-secondary hover:bg-hinode-surface-2 hover:text-hinode-text-primary active:translate-y-0',
  }[variant];

  const sizeClasses = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
  }[size];

  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none'
    : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}

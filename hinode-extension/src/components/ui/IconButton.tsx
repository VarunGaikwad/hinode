import React from 'react';
import type { LucideIcon } from 'lucide-react';

type IconButtonVariant = 'default' | 'accent';
type IconButtonSize = 'sm' | 'md';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  className?: string;
}

export default function IconButton({
  icon: Icon,
  label,
  variant = 'default',
  size = 'md',
  className = '',
  ...rest
}: IconButtonProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
  }[size];

  const iconSize = size === 'sm' ? 16 : 20;

  const variantClasses = {
    default:
      'bg-hinode-surface border border-hinode-border text-hinode-text-secondary hover:bg-hinode-surface-2 hover:text-hinode-text-primary',
    accent:
      'bg-hinode-accent text-black shadow-[0_2px_12px_rgba(248,196,113,0.35)] hover:shadow-[0_4px_18px_rgba(248,196,113,0.45)] hover:-translate-y-0.5 active:translate-y-0',
  }[variant];

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-hinode-accent focus:ring-offset-2 focus:ring-offset-transparent ${sizeClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      <Icon size={iconSize} aria-hidden="true" />
    </button>
  );
}

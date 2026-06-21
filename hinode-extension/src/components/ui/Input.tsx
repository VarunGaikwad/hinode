import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export default function Input({ label, error, leftIcon, className = '', ...rest }: InputProps) {
  const inputId = rest.id ?? React.useId();

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-hinode-text-secondary mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hinode-text-tertiary pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full ${leftIcon ? 'pl-10' : 'px-4'} py-2.5 bg-black/30 border ${
            error ? 'border-hinode-error' : 'border-hinode-border'
          } rounded-hinode-md text-hinode-text-primary placeholder-hinode-text-tertiary focus:outline-none focus:ring-2 focus:ring-hinode-accent focus:border-transparent transition-all duration-200 ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-hinode-error">{error}</p>}
    </div>
  );
}

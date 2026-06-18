import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className = '', ...rest }: InputProps) {
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
      <input
        id={inputId}
        className={`w-full px-4 py-2.5 bg-black/30 border ${
          error ? 'border-hinode-error' : 'border-hinode-border'
        } rounded-hinode-md text-hinode-text-primary placeholder-hinode-text-tertiary focus:outline-none focus:ring-2 focus:ring-hinode-accent focus:border-transparent transition-all duration-200 ${className}`}
        {...rest}
      />
      {error && <p className="mt-1.5 text-sm text-hinode-error">{error}</p>}
    </div>
  );
}

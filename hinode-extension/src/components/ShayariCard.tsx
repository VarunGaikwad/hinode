import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import type { Shayari } from '../types/api';
import IconButton from './ui/IconButton';

interface ShayariCardProps {
  shayari: Shayari | null;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function ShayariCard({ shayari, onRefresh, isRefreshing = false }: ShayariCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!shayari?.text) return;
    try {
      await navigator.clipboard.writeText(shayari.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard errors
    }
  };

  const displayText = shayari?.text ?? 'A quiet sunrise begins with a single ray of hope.';
  const author = shayari?.author || 'Hinode';

  const isHindiOrMarathi = /[\u0900-\u097F]/.test(displayText);

  return (
    <figure
      className="glass-card relative p-4 md:p-5 max-w-2xl w-full flex-1 min-h-0 flex flex-col justify-center opacity-0 animate-fade-in-up animate-in-6"
      aria-label="Shayari"
    >
      <span
        className="absolute top-2 left-3 text-5xl font-shayari text-hinode-accent opacity-40 select-none"
        aria-hidden="true"
      >
        “
      </span>

      <blockquote
        className={`relative z-10 text-center font-shayari text-base md:text-lg text-hinode-text-primary max-h-32 overflow-y-auto scrollbar-hide ${
          isHindiOrMarathi ? 'leading-relaxed' : 'leading-[1.65]'
        }`}
      >
        {displayText}
      </blockquote>

      <figcaption className="relative z-10 mt-2 text-right text-xs text-hinode-text-tertiary">
        — {author}
      </figcaption>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <IconButton
          icon={copied ? Check : Copy}
          label={copied ? 'Copied' : 'Copy shayari'}
          size="sm"
          onClick={handleCopy}
          variant={copied ? 'accent' : 'default'}
        />
        {onRefresh && (
          <IconButton
            icon={RefreshCw}
            label="Refresh shayari"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className={isRefreshing ? 'animate-spin' : ''}
          />
        )}
      </div>
    </figure>
  );
}

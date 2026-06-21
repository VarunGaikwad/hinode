import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Link2 } from 'lucide-react';
import IconButton from './ui/IconButton';
import { resolveFavicon } from '../services/faviconService';
import type { LinkItem } from '../types/linkTree';

interface LinkCardProps {
  link: LinkItem;
  onEdit: (link: LinkItem) => void;
  onDelete: (id: string) => void;
}

export default function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  const [favicon, setFavicon] = useState<string | null>(null);
  const [fallback, setFallback] = useState<{ letter: string; color: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    resolveFavicon(link.url, link.title).then((result) => {
      if (cancelled) return;
      setFavicon(result.src);
      setFallback(result.fallback);
    });
    return () => {
      cancelled = true;
    };
  }, [link.url, link.title]);

  const handleOpen = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer');
  };

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(link);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(link.id);
  };

  return (
    <div className="group relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-hinode-md bg-hinode-surface-3 border border-hinode-border hover:bg-hinode-surface-2 hover:border-hinode-border transition-all duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5 focus-within:bg-hinode-surface-2">
      <button
        type="button"
        onClick={handleOpen}
        className="flex flex-col items-center justify-center gap-1.5 w-full focus:outline-none"
        aria-label={`Open ${link.title}`}
      >
        {favicon ? (
          <img
            src={favicon}
            alt=""
            className="w-7 h-7 rounded-md object-contain"
            onError={(event) => {
              (event.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : fallback ? (
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-semibold text-white"
            style={{ backgroundColor: fallback.color }}
            aria-hidden="true"
          >
            {fallback.letter}
          </span>
        ) : (
          <Link2 className="w-7 h-7 text-hinode-text-secondary" aria-hidden="true" />
        )}
        <span className="text-sm text-hinode-text-primary truncate max-w-full text-center">
          {link.title}
        </span>
        <span className="text-[11px] text-hinode-text-tertiary truncate max-w-full text-center">
          {link.url}
        </span>
      </button>

      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex gap-1">
        <IconButton icon={Pencil} label={`Edit ${link.title}`} size="sm" onClick={handleEdit} />
        <IconButton icon={Trash2} label={`Delete ${link.title}`} size="sm" onClick={handleDelete} />
      </div>
    </div>
  );
}

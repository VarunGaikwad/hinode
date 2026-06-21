import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import type { NavigationPath } from '../types/linkTree';

interface BreadcrumbsProps {
  path: NavigationPath;
  onNavigate: (index: number) => void;
}

export default function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  return (
    <nav aria-label="Folder breadcrumbs">
      <ol className="flex items-center gap-1.5 text-sm text-hinode-text-secondary">
        <li>
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            className="flex items-center gap-1 hover:text-hinode-text-primary transition-colors focus-ring rounded-sm"
            aria-label="Go to Home"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Home</span>
          </button>
        </li>
        {path.map((segment, index) => (
          <li key={segment.id} className="flex items-center gap-1.5">
            <ChevronRight className="w-3.5 h-3.5 text-hinode-text-tertiary" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onNavigate(index)}
              className="hover:text-hinode-text-primary transition-colors focus-ring rounded-sm max-w-[120px] truncate"
              aria-current={index === path.length - 1 ? 'location' : undefined}
            >
              {segment.title}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

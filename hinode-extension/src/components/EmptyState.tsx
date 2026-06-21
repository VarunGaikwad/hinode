import React from 'react';
import { Sunrise, Plus } from 'lucide-react';
import Button from './ui/Button';

interface EmptyStateProps {
  onAddLink: () => void;
  onAddFolder: () => void;
}

export default function EmptyState({ onAddLink, onAddFolder }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6 text-center opacity-0 animate-fade-in-up animate-in-7">
      <div className="w-16 h-16 rounded-full glass-card flex items-center justify-center">
        <Sunrise className="w-8 h-8 text-hinode-accent" aria-hidden="true" />
      </div>
      <div>
        <p className="text-base font-medium text-hinode-text-primary">Your space is empty</p>
        <p className="text-xs text-hinode-text-tertiary mt-0.5">
          Add your first favorite link or folder to make this tab yours.
        </p>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Button onClick={onAddLink}>
          <Plus className="w-4 h-4 mr-1.5" aria-hidden="true" />
          Add Link
        </Button>
        <Button variant="secondary" onClick={onAddFolder}>
          Add Folder
        </Button>
      </div>
    </div>
  );
}

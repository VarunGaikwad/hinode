import React from 'react';
import { Folder, Pencil, Trash2, ChevronRight } from 'lucide-react';
import IconButton from './ui/IconButton';
import type { FolderItem } from '../types/linkTree';

interface FolderCardProps {
  folder: FolderItem;
  onOpen: (folder: FolderItem) => void;
  onEdit: (folder: FolderItem) => void;
  onDelete: (id: string) => void;
}

export default function FolderCard({ folder, onOpen, onEdit, onDelete }: FolderCardProps) {
  const childCount = folder.children?.length ?? 0;

  const handleOpen = () => onOpen(folder);

  const handleEdit = (event: React.MouseEvent) => {
    event.stopPropagation();
    onEdit(folder);
  };

  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(folder.id);
  };

  return (
    <div className="group relative flex flex-col items-center justify-center gap-1.5 p-3 rounded-hinode-md bg-hinode-surface-3 border border-hinode-border hover:bg-hinode-surface-2 hover:border-hinode-border transition-all duration-200 hover:-translate-y-0.5 focus-within:-translate-y-0.5 focus-within:bg-hinode-surface-2">
      <button
        type="button"
        onClick={handleOpen}
        className="flex flex-col items-center justify-center gap-1.5 w-full focus:outline-none"
        aria-label={`Open folder ${folder.title}`}
      >
        <div className="relative">
          <Folder className="w-8 h-8 text-hinode-accent" aria-hidden="true" />
          {childCount > 0 && (
            <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] px-1 flex items-center justify-center text-[9px] font-medium rounded-full bg-hinode-accent text-black">
              {childCount}
            </span>
          )}
        </div>
        <span className="text-sm text-hinode-text-primary truncate max-w-full text-center">
          {folder.title}
        </span>
        <span className="text-[11px] text-hinode-text-tertiary truncate max-w-full text-center">
          {childCount} item{childCount === 1 ? '' : 's'}
        </span>
      </button>

      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity flex gap-1">
        <IconButton icon={Pencil} label={`Edit ${folder.title}`} size="sm" onClick={handleEdit} />
        <IconButton icon={Trash2} label={`Delete ${folder.title}`} size="sm" onClick={handleDelete} />
      </div>

      <ChevronRight
        className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 text-hinode-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
    </div>
  );
}

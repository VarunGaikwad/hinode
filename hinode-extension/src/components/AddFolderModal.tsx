import React, { useEffect, useState } from 'react';
import { Folder } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import type { FolderItem } from '../types/linkTree';

interface AddFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folder: FolderItem) => void;
  editFolder?: FolderItem | null;
}

function generateId(): string {
  return `folder_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function AddFolderModal({
  isOpen,
  onClose,
  onSave,
  editFolder,
}: AddFolderModalProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (isOpen) {
      setTitle(editFolder?.title ?? '');
      setError(undefined);
    }
  }, [isOpen, editFolder]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError('Folder name is required');
      return;
    }

    const folder: FolderItem = {
      id: editFolder?.id ?? generateId(),
      type: 'folder',
      title: title.trim(),
      children: editFolder?.children ?? [],
      createdAt: editFolder?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(folder);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editFolder ? 'Edit Folder' : 'Add Folder'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-folder-form">
            {editFolder ? 'Save' : 'Add Folder'}
          </Button>
        </>
      }
    >
      <form id="add-folder-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Folder name"
          placeholder="e.g. Work"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={error}
          leftIcon={<Folder className="w-4 h-4" />}
          autoFocus
        />
      </form>
    </Modal>
  );
}

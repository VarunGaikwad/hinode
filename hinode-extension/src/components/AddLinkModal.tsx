import React, { useEffect, useState } from 'react';
import { Link2 } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import type { LinkItem } from '../types/linkTree';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (link: LinkItem) => void;
  editLink?: LinkItem | null;
}

function generateId(): string {
  return `link_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function AddLinkModal({ isOpen, onClose, onSave, editLink }: AddLinkModalProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  useEffect(() => {
    if (isOpen) {
      setTitle(editLink?.title ?? '');
      setUrl(editLink?.url ?? '');
      setErrors({});
    }
  }, [isOpen, editLink]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: { title?: string; url?: string } = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    const normalizedUrl = normalizeUrl(url);
    if (!normalizedUrl) nextErrors.url = 'URL is required';
    else {
      try {
        new URL(normalizedUrl);
      } catch {
        nextErrors.url = 'Please enter a valid URL';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const link: LinkItem = {
      id: editLink?.id ?? generateId(),
      type: 'link',
      title: title.trim(),
      url: normalizedUrl,
      createdAt: editLink?.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(link);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editLink ? 'Edit Link' : 'Add Link'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="add-link-form">
            {editLink ? 'Save' : 'Add Link'}
          </Button>
        </>
      }
    >
      <form id="add-link-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. GitHub"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          error={errors.title}
          autoFocus
        />
        <Input
          label="URL"
          placeholder="github.com"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          error={errors.url}
          leftIcon={<Link2 className="w-4 h-4" />}
        />
      </form>
    </Modal>
  );
}

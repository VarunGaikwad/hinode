import React, { useMemo, useState } from 'react';
import { Plus, Search, Folder, Link2 } from 'lucide-react';
import type { TreeItem, FolderItem, LinkItem, NavigationPath } from '../types/linkTree';
import { isFolderItem, isLinkItem } from '../types/linkTree';
import Breadcrumbs from './Breadcrumbs';
import LinkCard from './LinkCard';
import FolderCard from './FolderCard';
import EmptyState from './EmptyState';
import IconButton from './ui/IconButton';
import Input from './ui/Input';

interface LinkGridProps {
  items: TreeItem[];
  onItemsChange: (items: TreeItem[]) => void;
  onAddLink: () => void;
  onAddFolder: () => void;
  onEditLink: (link: LinkItem) => void;
  onEditFolder: (folder: FolderItem) => void;
}

function findFolder(items: TreeItem[], path: NavigationPath): TreeItem[] {
  let current = items;
  for (const segment of path) {
    const folder = current.find((item) => item.id === segment.id && isFolderItem(item)) as
      | FolderItem
      | undefined;
    current = folder?.children ?? [];
  }
  return current;
}

export default function LinkGrid({
  items,
  onItemsChange,
  onAddLink,
  onAddFolder,
  onEditLink,
  onEditFolder,
}: LinkGridProps) {
  const [path, setPath] = useState<NavigationPath>([]);
  const [search, setSearch] = useState('');

  const currentItems = useMemo(() => findFolder(items, path), [items, path]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return currentItems;
    const term = search.toLowerCase();
    return currentItems.filter((item) => item.title.toLowerCase().includes(term));
  }, [currentItems, search]);

  const folders = filteredItems.filter(isFolderItem);
  const links = filteredItems.filter(isLinkItem);

  const navigateTo = (index: number) => {
    setPath((prev) => (index === -1 ? [] : prev.slice(0, index + 1)));
  };

  const openFolder = (folder: FolderItem) => {
    setPath((prev) => [...prev, { id: folder.id, title: folder.title }]);
    setSearch('');
  };

  const updateTree = (updater: (current: TreeItem[]) => TreeItem[]): void => {
    if (path.length === 0) {
      onItemsChange(updater(items));
      return;
    }

    const updateAtDepth = (current: TreeItem[], depth: number): TreeItem[] => {
      if (depth === path.length) {
        return updater(current);
      }
      const segment = path[depth];
      return current.map((item) => {
        if (item.id === segment.id && isFolderItem(item)) {
          return { ...item, children: updateAtDepth(item.children ?? [], depth + 1) };
        }
        return item;
      });
    };

    onItemsChange(updateAtDepth(items, 0));
  };

  const deleteItem = (id: string) => {
    updateTree((current) => current.filter((item) => item.id !== id));
  };

  return (
    <section
      className="glass-card p-4 w-full h-full flex flex-col min-h-0 opacity-0 animate-fade-in-up animate-in-7"
      aria-label="Favorite links and folders"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 flex-shrink-0">
        <Breadcrumbs path={path} onNavigate={navigateTo} />

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-52">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hinode-text-tertiary" aria-hidden="true" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-9 py-2 text-sm"
              aria-label="Search links and folders"
            />
          </div>
          <IconButton icon={Link2} label="Add link" size="sm" onClick={onAddLink} />
          <IconButton icon={Folder} label="Add folder" size="sm" onClick={onAddFolder} />
        </div>
      </div>

      {currentItems.length === 0 ? (
        <div className="flex-1 min-h-0 flex items-center justify-center">
          <EmptyState onAddLink={onAddLink} onAddFolder={onAddFolder} />
        </div>
      ) : (
        <>
          {(folders.length > 0 || links.length > 0) && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 min-h-0 overflow-y-auto scrollbar-hide pb-1">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={openFolder}
                  onEdit={onEditFolder}
                  onDelete={deleteItem}
                />
              ))}
              {links.map((link) => (
                <LinkCard key={link.id} link={link} onEdit={onEditLink} onDelete={deleteItem} />
              ))}
            </div>
          )}
          {folders.length === 0 && links.length === 0 && search && (
            <div className="flex-1 min-h-0 flex items-center justify-center text-hinode-text-tertiary text-sm">
              No results for “{search}”
            </div>
          )}
        </>
      )}
    </section>
  );
}

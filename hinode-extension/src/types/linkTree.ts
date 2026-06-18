export type ItemId = string;

export interface LinkItem {
  id: ItemId;
  type: 'link';
  title: string;
  url: string;
  favicon?: string | null;
  parentId?: ItemId | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface FolderItem {
  id: ItemId;
  type: 'folder';
  title: string;
  parentId?: ItemId | null;
  children?: TreeItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type TreeItem = LinkItem | FolderItem;

export interface BreadcrumbSegment {
  id: ItemId;
  title: string;
}

export type NavigationPath = BreadcrumbSegment[];

export function isLinkItem(item: TreeItem): item is LinkItem {
  return item.type === 'link';
}

export function isFolderItem(item: TreeItem): item is FolderItem {
  return item.type === 'folder';
}

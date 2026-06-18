import { ExtensionSettings, DEFAULT_SETTINGS } from '../types/settings';
import { TreeItem } from '../types/linkTree';
import { HomePayload } from '../types/api';

const SETTINGS_KEY = 'hinode_settings';
const ITEMS_KEY = 'hinode_items';
const HOME_CACHE_KEY = 'hinode_home_cache';

/* In-memory fallback used when the extension APIs are unavailable
   (e.g. running in a plain browser tab during development). */
const memoryStore: Record<string, unknown> = {};

function getChromeStorage(): ChromeStorageLocal | undefined {
  if (typeof window === 'undefined') return undefined;
  const chromeApi = (window as unknown as { chrome?: { storage?: { local?: ChromeStorageLocal }; runtime?: { lastError?: { message: string } | null } } }).chrome;
  return chromeApi?.storage?.local;
}

interface ChromeStorageLocal {
  get: (
    keys: string | string[] | Record<string, unknown> | null,
    callback: (items: Record<string, unknown>) => void
  ) => void;
  set: (items: Record<string, unknown>, callback?: () => void) => void;
}

function storageAvailable(): boolean {
  return !!getChromeStorage();
}

function getStorage<T>(key: string): Promise<T | null> {
  if (!storageAvailable()) {
    const value = memoryStore[key];
    return Promise.resolve(value === undefined ? null : (value as T));
  }

  return new Promise((resolve, reject) => {
    getChromeStorage()!.get(key, (result) => {
      const chromeApi = (window as unknown as { chrome?: { runtime?: { lastError?: { message: string } | null } } }).chrome;
      if (chromeApi?.runtime?.lastError) {
        reject(new Error(chromeApi.runtime.lastError.message));
      } else {
        resolve((result[key] as T) ?? null);
      }
    });
  });
}

function setStorage<T>(key: string, value: T): Promise<void> {
  if (!storageAvailable()) {
    memoryStore[key] = value;
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    getChromeStorage()!.set({ [key]: value }, () => {
      const chromeApi = (window as unknown as { chrome?: { runtime?: { lastError?: { message: string } | null } } }).chrome;
      if (chromeApi?.runtime?.lastError) {
        reject(new Error(chromeApi.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

export async function loadSettings(): Promise<ExtensionSettings> {
  const stored = await getStorage<ExtensionSettings>(SETTINGS_KEY);
  return stored ? { ...DEFAULT_SETTINGS, ...stored } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: ExtensionSettings): Promise<void> {
  return setStorage(SETTINGS_KEY, settings);
}

export async function loadItems(): Promise<TreeItem[]> {
  const stored = await getStorage<TreeItem[]>(ITEMS_KEY);
  return stored ?? [];
}

export async function saveItems(items: TreeItem[]): Promise<void> {
  return setStorage(ITEMS_KEY, items);
}

export async function loadHomeCache(): Promise<HomePayload | null> {
  return getStorage<HomePayload>(HOME_CACHE_KEY);
}

export async function saveHomeCache(payload: HomePayload): Promise<void> {
  return setStorage(HOME_CACHE_KEY, payload);
}

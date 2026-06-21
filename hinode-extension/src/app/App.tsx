import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import BackgroundLayer from '../components/Background';
import Clock from '../components/Clock';
import Greeting from '../components/Greeting';
import WeatherCard from '../components/WeatherCard';
import ShayariCard from '../components/ShayariCard';
import LinkGrid from '../components/LinkGrid';
import Toolbar from '../components/Toolbar';
import OfflinePill from '../components/OfflinePill';
import AddLinkModal from '../components/AddLinkModal';
import AddFolderModal from '../components/AddFolderModal';
import SettingsModal from '../components/SettingsModal';
import { loadSettings, saveSettings, loadItems, saveItems, loadHomeCache, saveHomeCache } from '../services/storageService';
import { fetchHome, refreshBackground } from '../services/apiClient';
import { DEFAULT_SETTINGS, type ExtensionSettings, type ThemeMode } from '../types/settings';
import type { TreeItem, LinkItem, FolderItem } from '../types/linkTree';
import type { HomePayload } from '../types/api';

const THEME_CLASSES: ThemeMode[] = ['theme-light', 'theme-dark', 'theme-system'];
const THEME_CYCLE: ThemeMode[] = ['light', 'dark', 'system'];

function applyThemeClass(theme: ThemeMode) {
  const html = document.documentElement;
  html.classList.remove(...THEME_CLASSES);
  html.classList.add(`theme-${theme}`);
}

function isCacheFresh(payload: HomePayload): boolean {
  if (!payload?.serverTime) return false;
  const age = Date.now() - new Date(payload.serverTime).getTime();
  return age >= 0 && age < 10 * 60 * 1000; // 10 minutes
}

function buildHomeParams(settings: ExtensionSettings): {
  lat?: number;
  lon?: number;
  city?: string;
  unit?: 'metric' | 'imperial';
  backgroundQuery: string;
  language: string;
} {
  return {
    city: settings.useCurrentLocation ? undefined : settings.weatherCity,
    unit: settings.temperatureUnit,
    backgroundQuery: settings.backgroundQuery,
    language: settings.shayariLanguage,
  };
}

export default function App() {
  const [settings, setSettings] = useState<ExtensionSettings>(DEFAULT_SETTINGS);
  const [items, setItems] = useState<TreeItem[]>([]);
  const [home, setHome] = useState<HomePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [refreshingBg, setRefreshingBg] = useState(false);

  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);
  const [isAddFolderOpen, setIsAddFolderOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);

  // Load persisted settings and items.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [loadedSettings, loadedItems] = await Promise.all([loadSettings(), loadItems()]);
      if (cancelled) return;
      console.log('[Hinode] settings loaded', loadedSettings === DEFAULT_SETTINGS, loadedSettings);
      setSettings(loadedSettings);
      setItems(loadedItems);
      applyThemeClass(loadedSettings.theme);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch home payload on mount and when relevant settings change.
  useEffect(() => {
    if (settings === DEFAULT_SETTINGS) return;

    let cancelled = false;
    const loadHome = async () => {
      setLoading(true);
      setError(null);
      console.log('[Hinode] loadHome effect running. settings === DEFAULT_SETTINGS?', settings === DEFAULT_SETTINGS);

      try {
        const cached = await loadHomeCache();
        const hasUsableBackground = !!cached?.background?.image_url;

        // While offline, show whatever cache we have. While online, only use a
        // cache entry that actually includes a background image; otherwise fetch
        // fresh data so a previous failed/empty payload is not stuck for 10 min.
        if (cached && isCacheFresh(cached) && (navigator.onLine ? hasUsableBackground : true)) {
          setHome(cached);
          setLoading(false);
          return;
        }

        if (!navigator.onLine && cached) {
          setHome(cached);
          setLoading(false);
          return;
        }

        const params = buildHomeParams(settings);
        console.log('[Hinode] fetching home with params', params);
        const payload = await fetchHome(params);
        console.log('[Hinode] fetchHome returned', payload);
        if (cancelled) return;
        setHome(payload);
        (window as any).__HINODE_HOME__ = payload;
        await saveHomeCache(payload);
      } catch (err) {
        console.error('[Hinode] fetchHome error', err);
        if (cancelled) return;
        const cached = await loadHomeCache();
        if (cached?.background?.image_url) {
          setHome(cached);
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load home data');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadHome();
    return () => {
      cancelled = true;
    };
  }, [
    settings.serverBaseUrl,
    settings.useCurrentLocation,
    settings.weatherCity,
    settings.temperatureUnit,
    settings.backgroundQuery,
    settings.shayariLanguage,
  ]);

  // Listen for online/offline changes.
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleSaveSettings = useCallback(
    async (next: ExtensionSettings) => {
      setSettings(next);
      await saveSettings(next);
      applyThemeClass(next.theme);
    },
    []
  );

  const handleItemsChange = useCallback(async (next: TreeItem[]) => {
    setItems(next);
    await saveItems(next);
  }, []);

  const handleThemeToggle = useCallback(() => {
    const currentIndex = THEME_CYCLE.indexOf(settings.theme);
    const nextTheme = THEME_CYCLE[(currentIndex + 1) % THEME_CYCLE.length];
    handleSaveSettings({ ...settings, theme: nextTheme });
  }, [settings, handleSaveSettings]);

  const handleRefreshBackground = useCallback(async () => {
    if (refreshingBg) return;
    setRefreshingBg(true);
    try {
      const background = await refreshBackground(settings.backgroundQuery);
      setHome((prev) => (prev ? { ...prev, background } : null));
    } catch (err) {
      // Keep existing background on error.
    } finally {
      setRefreshingBg(false);
    }
  }, [refreshingBg, settings.backgroundQuery]);

  const handleAddLink = useCallback(
    (link: LinkItem) => {
      if (editingLink) {
        const replace = (list: TreeItem[]): TreeItem[] =>
          list.map((item) => {
            if (item.id === link.id) return link;
            if (item.type === 'folder') {
              return { ...item, children: replace(item.children ?? []) };
            }
            return item;
          });
        handleItemsChange(replace(items));
        setEditingLink(null);
      } else {
        handleItemsChange([...items, link]);
      }
    },
    [editingLink, items, handleItemsChange]
  );

  const handleAddFolder = useCallback(
    (folder: FolderItem) => {
      if (editingFolder) {
        const replace = (list: TreeItem[]): TreeItem[] =>
          list.map((item) => {
            if (item.id === folder.id) return folder;
            if (item.type === 'folder') {
              return { ...item, children: replace(item.children ?? []) };
            }
            return item;
          });
        handleItemsChange(replace(items));
        setEditingFolder(null);
      } else {
        handleItemsChange([...items, folder]);
      }
    },
    [editingFolder, items, handleItemsChange]
  );

  const handleEditLink = useCallback((link: LinkItem) => {
    setEditingLink(link);
    setIsAddLinkOpen(true);
  }, []);

  const handleEditFolder = useCallback((folder: FolderItem) => {
    setEditingFolder(folder);
    setIsAddFolderOpen(true);
  }, []);

  const openAddLink = useCallback(() => {
    setEditingLink(null);
    setIsAddLinkOpen(true);
  }, []);

  const openAddFolder = useCallback(() => {
    setEditingFolder(null);
    setIsAddFolderOpen(true);
  }, []);

  const weather = home?.weather;
  const background = home?.background;
  const shayari = home?.shayari;

  return (
    <BackgroundLayer background={background} overlayIntensity={settings.overlayIntensity}>
      <Toolbar
        theme={settings.theme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefreshBackground={handleRefreshBackground}
        onToggleTheme={handleThemeToggle}
        isRefreshing={refreshingBg}
      />

      <main className="relative h-screen overflow-hidden flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-40 text-left">
          <Greeting userName={settings.userName} />
          <Clock format={settings.clockFormat} showDate className="mt-2" />
        </div>

        <div className="flex-1 min-h-0 w-full max-w-6xl mx-auto flex flex-col gap-3 sm:gap-4 pt-28 sm:pt-32">
          {(loading && !home) && (
            <div className="glass-card px-4 py-3 flex items-center gap-2 text-hinode-text-secondary w-fit">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span className="text-sm">Loading your sunrise...</span>
            </div>
          )}

          {error && !home && (
            <div className="glass-card p-3 text-center text-hinode-error max-w-md text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col xl:flex-row gap-3 sm:gap-4 items-stretch flex-shrink-0">
            {weather && (
              <div className="w-full xl:w-72 flex-shrink-0">
                <WeatherCard weather={weather} unit={settings.temperatureUnit} />
              </div>
            )}
            <ShayariCard shayari={shayari} />
          </div>

          <div className="flex-1 min-h-0">
            <LinkGrid
              items={items}
              onItemsChange={handleItemsChange}
              onAddLink={openAddLink}
              onAddFolder={openAddFolder}
              onEditLink={handleEditLink}
              onEditFolder={handleEditFolder}
            />
          </div>
        </div>
      </main>

      {!isOnline && <OfflinePill />}

      <AddLinkModal
        isOpen={isAddLinkOpen}
        onClose={() => setIsAddLinkOpen(false)}
        onSave={handleAddLink}
        editLink={editingLink}
      />

      <AddFolderModal
        isOpen={isAddFolderOpen}
        onClose={() => setIsAddFolderOpen(false)}
        onSave={handleAddFolder}
        editFolder={editingFolder}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </BackgroundLayer>
  );
}

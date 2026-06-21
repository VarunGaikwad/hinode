import React from 'react';
import { Settings, RefreshCw, Sun, Moon, Monitor } from 'lucide-react';
import type { ThemeMode } from '../types/settings';
import IconButton from './ui/IconButton';

interface ToolbarProps {
  theme: ThemeMode;
  onOpenSettings: () => void;
  onRefreshBackground: () => void;
  onToggleTheme: () => void;
  isRefreshing?: boolean;
}

const THEME_ICONS: Record<ThemeMode, React.ElementType> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

export default function Toolbar({
  theme,
  onOpenSettings,
  onRefreshBackground,
  onToggleTheme,
  isRefreshing = false,
}: ToolbarProps) {
  const ThemeIcon = THEME_ICONS[theme];

  return (
    <div
      className="fixed top-4 right-4 md:top-6 md:right-6 z-40 flex items-center gap-2 p-1.5 rounded-full glass-card"
      role="toolbar"
      aria-label="Hinode toolbar"
    >
      <IconButton
        icon={RefreshCw}
        label="Refresh background"
        size="md"
        onClick={onRefreshBackground}
        disabled={isRefreshing}
        className={isRefreshing ? 'animate-spin' : ''}
      />
      <IconButton
        icon={ThemeIcon}
        label={`Current theme: ${theme}. Click to cycle.`}
        size="md"
        onClick={onToggleTheme}
      />
      <IconButton
        icon={Settings}
        label="Open settings"
        size="md"
        onClick={onOpenSettings}
      />
    </div>
  );
}

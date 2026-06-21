import React, { useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';
import Toggle from './ui/Toggle';
import type { ExtensionSettings, ThemeMode, ClockFormat, TemperatureUnit, BackgroundRefresh, ShayariLanguage } from '../types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ExtensionSettings;
  onSave: (settings: ExtensionSettings) => void;
}

const THEMES: { value: ThemeMode; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

const CLOCK_FORMATS: { value: ClockFormat; label: string }[] = [
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' },
];

const UNITS: { value: TemperatureUnit; label: string }[] = [
  { value: 'metric', label: 'Metric (°C)' },
  { value: 'imperial', label: 'Imperial (°F)' },
];

const REFRESH_OPTIONS: { value: BackgroundRefresh; label: string }[] = [
  { value: 'every_tab', label: 'Every tab' },
  { value: 'daily', label: 'Daily' },
  { value: 'manual', label: 'Manual only' },
];

const SHAYARI_LANGUAGES: { value: ShayariLanguage; label: string }[] = [
  { value: 'hindi', label: 'Hindi' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'english', label: 'English' },
];

export default function SettingsModal({ isOpen, onClose, settings, onSave }: SettingsModalProps) {
  const [draft, setDraft] = useState<ExtensionSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setDraft(settings);
    }
  }, [isOpen, settings]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(draft);
    onClose();
  };

  const update = <K extends keyof ExtensionSettings>(key: K, value: ExtensionSettings[K]) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const renderSelect = <K extends keyof ExtensionSettings>(
    key: K,
    options: { value: ExtensionSettings[K]; label: string }[]
  ) => (
    <select
      id={key}
      value={String(draft[key])}
      onChange={(event) => update(key, event.target.value as ExtensionSettings[K])}
      className="w-full px-3 py-2 bg-black/30 border border-hinode-border rounded-hinode-md text-hinode-text-primary focus:outline-none focus:ring-2 focus:ring-hinode-accent"
    >
      {options.map((option) => (
        <option key={String(option.value)} value={String(option.value)}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <span className="flex items-center gap-2">
          <Settings className="w-5 h-5" aria-hidden="true" />
          Settings
        </span>
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="settings-form">
            Save
          </Button>
        </>
      }
    >
      <form id="settings-form" onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Your name"
          value={draft.userName}
          onChange={(event) => update('userName', event.target.value)}
          placeholder="Friend"
        />

        <div className="space-y-1.5">
          <label htmlFor="theme" className="block text-sm font-medium text-hinode-text-secondary">
            Theme
          </label>
          {renderSelect('theme', THEMES)}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="clockFormat" className="block text-sm font-medium text-hinode-text-secondary">
              Clock format
            </label>
            {renderSelect('clockFormat', CLOCK_FORMATS)}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="temperatureUnit" className="block text-sm font-medium text-hinode-text-secondary">
              Temperature unit
            </label>
            {renderSelect('temperatureUnit', UNITS)}
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <Toggle
            checked={draft.useCurrentLocation}
            onChange={(checked) => update('useCurrentLocation', checked)}
            label="Use current location for weather"
          />
          {!draft.useCurrentLocation && (
            <Input
              label="Weather city"
              value={draft.weatherCity ?? ''}
              onChange={(event) => update('weatherCity', event.target.value)}
              placeholder="e.g. Tokyo"
            />
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="backgroundQuery" className="block text-sm font-medium text-hinode-text-secondary">
            Background search
          </label>
          <Input
            id="backgroundQuery"
            value={draft.backgroundQuery}
            onChange={(event) => update('backgroundQuery', event.target.value)}
            placeholder="sunrise landscape"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="backgroundRefresh" className="block text-sm font-medium text-hinode-text-secondary">
            Refresh background
          </label>
          {renderSelect('backgroundRefresh', REFRESH_OPTIONS)}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="shayariLanguage" className="block text-sm font-medium text-hinode-text-secondary">
            Shayari language
          </label>
          {renderSelect('shayariLanguage', SHAYARI_LANGUAGES)}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="serverBaseUrl" className="block text-sm font-medium text-hinode-text-secondary">
            Server URL
          </label>
          <Input
            id="serverBaseUrl"
            value={draft.serverBaseUrl}
            onChange={(event) => update('serverBaseUrl', event.target.value)}
            placeholder="http://localhost:7000"
          />
        </div>
      </form>
    </Modal>
  );
}

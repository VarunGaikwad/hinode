import './styles/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import { loadSettings } from './services/storageService';

const THEME_CLASSES = ['theme-light', 'theme-dark', 'theme-system'] as const;

async function applySavedTheme() {
  const html = document.documentElement;
  try {
    const settings = await loadSettings();
    const themeClass = `theme-${settings.theme}`;
    html.classList.remove(...THEME_CLASSES);
    html.classList.add(themeClass);
  } catch (e) {
    console.error('Failed to apply saved theme', e);
    html.classList.add('theme-system');
  }
}

/* Apply a default theme class immediately to avoid an unstyled flash,
   then resolve the user-saved preference from storage. */
document.documentElement.classList.add('theme-system');
applySavedTheme();

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}

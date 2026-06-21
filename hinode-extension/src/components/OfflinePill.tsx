import React from 'react';
import { WifiOff } from 'lucide-react';

export default function OfflinePill() {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-60 flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-hinode-text-secondary"
      role="status"
      aria-live="polite"
    >
      <WifiOff className="w-4 h-4" aria-hidden="true" />
      You&apos;re offline · using cached data
    </div>
  );
}

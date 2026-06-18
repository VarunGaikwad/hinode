import React, { useEffect, useMemo, useState } from 'react';
import type { ClockFormat } from '../types/settings';

interface ClockProps {
  format?: ClockFormat;
  showDate?: boolean;
  className?: string;
}

export default function Clock({ format = '12h', showDate = true, className = '' }: ClockProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const timeString = useMemo(() => {
    if (format === '24h') {
      return now.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    }
    return now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }, [now, format]);

  const dateString = useMemo(() => {
    return now.toLocaleDateString(undefined, {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, [now]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <time
        dateTime={now.toISOString()}
        aria-label={now.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}
        className="font-display text-5xl sm:text-6xl md:text-7xl font-extralight leading-none tracking-tight text-hinode-text-primary tabular-nums"
      >
        {timeString}
      </time>
      {showDate && (
        <p className="mt-2 text-base md:text-lg font-normal text-hinode-text-tertiary">
          {dateString}
        </p>
      )}
    </div>
  );
}

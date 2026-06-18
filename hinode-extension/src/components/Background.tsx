import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { Background } from '../types/api';

interface BackgroundProps {
  background: Background | null;
  overlayIntensity?: number;
  children: ReactNode;
}

export default function BackgroundLayer({
  background,
  overlayIntensity = 0.35,
  children,
}: BackgroundProps) {
  const [currentImage, setCurrentImage] = useState(background?.image_url ?? '');
  const [nextImage, setNextImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimer = useRef<number | null>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!background?.image_url || background.image_url === currentImage) {
      return;
    }

    if (prefersReducedMotion) {
      setCurrentImage(background.image_url);
      return;
    }

    setNextImage(background.image_url);
    setIsTransitioning(true);

    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }

    transitionTimer.current = window.setTimeout(() => {
      setCurrentImage(background.image_url);
      setNextImage(null);
      setIsTransitioning(false);
    }, 800);

    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, [background?.image_url, currentImage, prefersReducedMotion]);

  const overlayStyle = useMemo(
    () => ({
      background: `var(--overlay-warm), rgba(0, 0, 0, ${overlayIntensity})`,
    }),
    [overlayIntensity]
  );

  const attribution = background?.photographer_name;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#0f0f11]">
      {/* Background layers */}
      <div
        className={`bg-layer ${isTransitioning ? 'visible' : 'visible'} ${
          !prefersReducedMotion ? 'ken-burns' : ''
        }`}
        style={{ backgroundImage: `url(${currentImage})` }}
        aria-hidden="true"
      />
      {nextImage && (
        <div
          className={`bg-layer ${isTransitioning ? 'visible' : 'hidden'}`}
          style={{ backgroundImage: `url(${nextImage})` }}
          aria-hidden="true"
        />
      )}

      {/* Gradient/dark overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={overlayStyle}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.25) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-30 h-full overflow-auto">{children}</div>

      {/* Attribution */}
      {attribution && (
        <a
          href={background?.photo_url || background?.photographer_url || '#'}
          target="_blank"
          rel="noreferrer noopener"
          className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-40 text-xs text-hinode-text-tertiary hover:text-hinode-text-secondary hover:underline transition-colors focus-ring rounded-sm"
        >
          Photo by {attribution} on Unsplash
        </a>
      )}
    </div>
  );
}

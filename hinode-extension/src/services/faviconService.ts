const FAVICON_CACHE_PREFIX = 'hinode_favicon_';
const FAVICON_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function getStorage(): Storage | null {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

interface FaviconCacheEntry {
  url: string;
  cachedAt: number;
}

export function getFaviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
}

export function getLetterAvatar(title: string): { letter: string; color: string } {
  const letter = (title.trim()[0] ?? '?').toUpperCase();
  // Generate a warm, deterministic hue from the title char codes.
  const hue =
    title
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0) % 40; // 0-40 (red/orange/yellow range)
  return { letter, color: `hsl(${25 + hue}, 80%, 60%)` };
}

export async function resolveFavicon(
  url: string,
  title: string
): Promise<{ src: string; fallback: { letter: string; color: string } }> {
  const domain = getDomain(url);
  const storage = getStorage();
  const cacheKey = `${FAVICON_CACHE_PREFIX}${domain}`;

  if (storage) {
    try {
      const raw = storage.getItem(cacheKey);
      if (raw) {
        const entry: FaviconCacheEntry = JSON.parse(raw);
        if (Date.now() - entry.cachedAt < FAVICON_TTL_MS) {
          return { src: entry.url, fallback: getLetterAvatar(title) };
        }
      }
    } catch {
      // Ignore cache parse errors
    }
  }

  const faviconUrl = getFaviconUrl(domain);

  // Preload to detect broken images; still return the URL regardless.
  try {
    await new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Favicon failed to load'));
      img.src = faviconUrl;
    });
  } catch {
    // Favicon may fail; caller can use the fallback avatar.
  }

  if (storage) {
    try {
      const entry: FaviconCacheEntry = { url: faviconUrl, cachedAt: Date.now() };
      storage.setItem(cacheKey, JSON.stringify(entry));
    } catch {
      // Ignore storage errors
    }
  }

  return { src: faviconUrl, fallback: getLetterAvatar(title) };
}

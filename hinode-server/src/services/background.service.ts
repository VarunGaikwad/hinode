import axios from "axios";
import { db } from "../db/db";
import type { Background } from "../types/background";

/**
 * Retrieves a background image based on the query.
 * Caches results in SQLite for 24 hours.
 */
interface BackgroundCacheRow {
  response_json: string;
  expires_at: string;
}

export async function getBackground(query: string, random: boolean = false): Promise<Background | null> {
  const cacheKey = `background_${query}_${random ? "random" : "today"}`;
  const nowIso = new Date().toISOString();

  // Attempt to read from cache
  const cached: Background | null = await new Promise<Background | null>((resolve) => {
db.get<BackgroundCacheRow>(
                "SELECT response_json, expires_at FROM background_cache WHERE cache_key = ?",
                [cacheKey],
                (err, row) => {
        if (err) {
          console.error("Error reading background cache:", err);
          resolve(null);
          return;
        }
        if (row) {
          if (row.expires_at > nowIso) {
            try {
              const parsed: Background = JSON.parse(row.response_json);
              // Ensure query field is set (in case it was missing in cached JSON)
              parsed.query = query;
              resolve(parsed);
              return;
            } catch (_) {
              // fall through to fetch fresh
            }
          }
        }
        resolve(null);
      }
    );
  });

  if (cached) {
    return cached;
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.error("UNSPLASH_ACCESS_KEY not set in environment");
    return null;
  }

  const endpoint = `https://api.unsplash.com/photos/random?query=${encodeURIComponent(query)}&client_id=${accessKey}`;

  try {
    const response = await axios.get(endpoint);
    const data = response.data;
    // Build Background object
    // Use a resized Unsplash image so backgrounds load quickly but still look crisp.
    const rawUrl: string | undefined = data.urls?.raw;
    const image_url = rawUrl
      ? `${rawUrl}&w=1920&fit=max&q=80`
      : data.urls?.regular ?? data.urls?.full ?? "";

    const background: Background = {
      image_url,
      photographer_name: data.user?.name,
      photographer_url: data.user?.links?.html,
      photo_url: data.links?.html,
      color: data.color,
      blur_hash: data.blur_hash,
      query,
    };

    const cachedAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Insert or replace cache entry
    db.run(
      `INSERT OR REPLACE INTO background_cache (
        cache_key,
        provider,
        query,
        image_url,
        photographer_name,
        photographer_url,
        photo_url,
        color,
        blur_hash,
        response_json,
        cached_at,
        expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        cacheKey,
        "unsplash",
        query,
        background.image_url,
        background.photographer_name ?? null,
        background.photographer_url ?? null,
        background.photo_url ?? null,
        background.color ?? null,
        background.blur_hash ?? null,
        JSON.stringify(background),
        cachedAt,
        expiresAt,
      ],
      (err) => {
        if (err) {
          console.error("Error inserting background cache:", err);
        }
      }
    );

    return background;
  } catch (e: any) {
    const status = e?.response?.status;
    const body = e?.response?.data;
    console.error(
      "Error fetching background from Unsplash:",
      status ? `HTTP ${status}` : e.message,
      body ? JSON.stringify(body) : ""
    );
    return null;
  }
}

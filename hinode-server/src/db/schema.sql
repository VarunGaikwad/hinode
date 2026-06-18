-- Hinode database schema

CREATE TABLE IF NOT EXISTS shayari (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  language TEXT NOT NULL,
  category TEXT,
  mood TEXT,
  author TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS weather_cache (
  cache_key TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  request_params TEXT NOT NULL,
  response_json TEXT NOT NULL,
  cached_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS background_cache (
  cache_key TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  query TEXT NOT NULL,
  image_url TEXT NOT NULL,
  photographer_name TEXT,
  photographer_url TEXT,
  photo_url TEXT,
  color TEXT,
  blur_hash TEXT,
  response_json TEXT,
  cached_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geocode_cache (
  cache_key TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  query TEXT NOT NULL,
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  display_name TEXT,
  response_json TEXT,
  cached_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

# Hinode — Project Plan

Hinode is a beautiful Chrome New Tab extension with a secure backend server.

The extension will show a personalized home tab with current time, greeting, weather, shayari, Unsplash-powered backgrounds, favorite links, folders, and nested folders. The backend will protect API keys, store shayari, fetch backgrounds, cache weather, and provide a clean API to the extension.

---

## 1. Project Goals

### Primary Goals

- Replace Chrome's default New Tab page with a beautiful custom home tab.
- Show current time and greeting based on time of day.
- Show today's weather.
- Show shayari.
- Show beautiful background images from Unsplash.
- Allow users to add favorite links.
- Allow users to create folders.
- Allow users to nest folders inside folders.
- Keep external API keys hidden on the backend.
- Cache weather and background data to avoid unnecessary API calls.
- Store shayari on the backend.
- Keep the extension fast, calm, and visually beautiful.

### Non-Goals for MVP

- Multi-user authentication.
- Public Chrome Web Store release.
- Real-time sync across devices.
- Complex admin dashboard.
- AI-generated shayari.
- Paid subscription features.

These can be added later.

---

## 2. Recommended Tech Stack

### Chrome Extension

- React
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension Manifest V3
- `chrome.storage.local`

### Backend Server

- Node.js
- Express
- TypeScript
- SQLite for MVP
- Optional later: PostgreSQL
- Optional later: Redis for distributed caching

### External APIs

- Unsplash API for background images
- OpenWeather API for weather

---

## 3. High-Level Architecture

```txt
Chrome Extension
  - New Tab UI
  - Favorite links
  - Folder tree
  - Local settings
  - Local fallback cache
        |
        v
Hinode Backend Server
  - API key protection
  - Shayari storage
  - Weather cache
  - Background cache
  - Home payload API
        |
        v
SQLite Database
  - shayari
  - weather_cache
  - background_cache
  - settings
        |
        v
External APIs
  - Unsplash
  - OpenWeather
```

---

## 4. Responsibility Split

### Extension Responsibilities

The Chrome extension should handle:

- UI rendering
- Current time display
- Greeting logic
- Favorite links
- Folders
- Nested folders
- User layout preferences
- Local fallback cache
- Calling Hinode server APIs

The extension should not directly call:

- Unsplash API
- OpenWeather API

This keeps API keys safe on the backend.

### Server Responsibilities

The backend server should handle:

- Storing API keys securely in environment variables.
- Fetching weather data.
- Caching weather data.
- Fetching Unsplash background metadata.
- Caching Unsplash background metadata.
- Storing and serving shayari.
- Returning a combined home payload.
- Rate limiting requests.
- Returning fallback data if external APIs fail.

---

## 5. Chrome Extension Features

### 5.1 New Tab Override

Hinode will replace the Chrome New Tab page.

The extension manifest will include:

```json
{
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  }
}
```

---

### 5.2 Greeting

The extension should greet the user based on the current local time.

Example:

```txt
5 AM - 12 PM   -> Good Morning
12 PM - 5 PM   -> Good Afternoon
5 PM - 9 PM    -> Good Evening
9 PM - 5 AM    -> Good Night
```

Example display:

```txt
Good Morning, Varun
```

---

### 5.3 Clock

The extension should show the current time.

Recommended options:

- 12-hour format
- 24-hour format
- Show date
- Show day name

Example:

```txt
10:42 AM
Thursday, 18 June
```

---

### 5.4 Weather

The extension should show:

- City name
- Temperature
- Weather condition
- Weather icon
- Humidity
- Wind speed
- Feels-like temperature

The extension should call the backend:

```txt
GET /api/weather/current?lat=35.68&lon=139.76&unit=metric
```

or:

```txt
GET /api/weather/current?city=Tokyo&unit=metric
```

---

### 5.5 Shayari

The extension should show one shayari on the home tab.

MVP options:

- Random shayari
- Daily shayari
- Language filter

Future options:

- Hindi shayari
- Marathi shayari
- English quotes
- Mood-based shayari
- Category-based shayari
- Favorite shayari
- Copy button
- Refresh button

Example route:

```txt
GET /api/shayari/random?language=hindi
```

---

### 5.6 Background Images

Background images should come from the backend.

The backend will fetch image metadata from Unsplash and return:

- Image URL
- Photographer name
- Photographer profile URL
- Unsplash photo URL
- Dominant color
- Blur hash if available
- Query/category
- Cache expiry

Example route:

```txt
GET /api/background/today?query=nature
```

The extension should show attribution:

```txt
Photo by Photographer Name on Unsplash
```

---

### 5.7 Favorite Links

Users should be able to:

- Add link
- Edit link
- Delete link
- Open link
- Move link into folder
- Search links
- Show favicon

Example link item:

```ts
type LinkItem = {
  id: string;
  type: "link";
  title: string;
  url: string;
  icon?: string;
  createdAt: number;
  updatedAt: number;
};
```

---

### 5.8 Folders and Nested Folders

Users should be able to:

- Add folder
- Rename folder
- Delete folder
- Open folder
- Add link inside folder
- Add folder inside folder
- Navigate using breadcrumbs

Example folder item:

```ts
type FolderItem = {
  id: string;
  type: "folder";
  title: string;
  children: Array<LinkItem | FolderItem>;
  createdAt: number;
  updatedAt: number;
};
```

Example structure:

```txt
Home
  Work
    Projects
      GitHub
      Jira
  Learning
    JavaScript
    TypeScript
  Personal
    YouTube
    Gmail
```

---

## 6. Extension Data Model

### Root Data

```ts
type HinodeLocalData = {
  version: number;
  items: Array<LinkItem | FolderItem>;
  settings: ExtensionSettings;
};
```

### Extension Settings

```ts
type ExtensionSettings = {
  userName: string;
  serverBaseUrl: string;
  useCurrentLocation: boolean;
  weatherCity?: string;
  temperatureUnit: "metric" | "imperial";
  clockFormat: "12h" | "24h";
  backgroundQuery: string;
  backgroundRefresh: "daily" | "every_tab" | "manual";
  shayariLanguage: "hindi" | "marathi" | "english";
  theme: "light" | "dark" | "system";
  overlayIntensity: number;
};
```

---

## 7. Backend Features

### 7.1 API Key Protection

API keys must be stored only on the server.

Example `.env`:

```env
PORT=3000
NODE_ENV=development

UNSPLASH_ACCESS_KEY=your_unsplash_key_here
OPENWEATHER_API_KEY=your_openweather_key_here

SERVER_CLIENT_TOKEN=your_private_client_token
DATABASE_URL=./data/hinode.db
```

The Chrome extension should call only the Hinode backend.

---

### 7.2 Shayari Storage

The server will store shayari in SQLite.

The shayari table should support:

- Text
- Language
- Category
- Mood
- Author
- Active/inactive status
- Created date
- Updated date

---

### 7.3 Weather Cache

The server will cache weather data to avoid repeated API calls.

Recommended TTL:

```txt
Current weather: 15-30 minutes
Hourly forecast: 1-2 hours
Daily forecast: 3-6 hours
Geocoding results: 7-30 days
```

---

### 7.4 Background Cache

The server will cache Unsplash background metadata.

Recommended TTL:

```txt
Daily background: 24 hours
Background by query: 24 hours
Manual refresh: 1-6 hours
Background pool: 24 hours
```

Do not permanently store Unsplash image files in the database.

Store metadata and hotlinked image URLs instead.

---

### 7.5 Home Payload

To make the extension faster, create one combined endpoint:

```txt
GET /api/home
```

This route should return:

```json
{
  "weather": {},
  "background": {},
  "shayari": {},
  "serverTime": "2026-06-18T00:00:00.000Z"
}
```

This avoids multiple requests from the extension every time a new tab opens.

---

## 8. Backend API Routes

### Health

```txt
GET /health
```

Response:

```json
{
  "ok": true
}
```

---

### Home

```txt
GET /api/home?lat=35.68&lon=139.76&unit=metric&language=hindi&backgroundQuery=nature
```

Response:

```json
{
  "weather": {},
  "background": {},
  "shayari": {},
  "serverTime": "2026-06-18T00:00:00.000Z"
}
```

---

### Weather

```txt
GET /api/weather/current?lat=35.68&lon=139.76&unit=metric
GET /api/weather/current?city=Tokyo&unit=metric
GET /api/weather/forecast?lat=35.68&lon=139.76&unit=metric
```

---

### Background

```txt
GET /api/background/today?query=nature
GET /api/background/random?query=nature
POST /api/background/refresh
```

---

### Shayari

```txt
GET    /api/shayari/random
GET    /api/shayari/random?language=hindi
GET    /api/shayari?language=hindi&category=life
POST   /api/shayari
PUT    /api/shayari/:id
DELETE /api/shayari/:id
```

For MVP, protect write routes with a simple admin token.

---

## 9. Database Schema

### 9.1 Shayari

```sql
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
```

---

### 9.2 Weather Cache

```sql
CREATE TABLE IF NOT EXISTS weather_cache (
  cache_key TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  request_params TEXT NOT NULL,
  response_json TEXT NOT NULL,
  cached_at TEXT NOT NULL,
  expires_at TEXT NOT NULL
);
```

---

### 9.3 Background Cache

```sql
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
```

---

### 9.4 Geocode Cache

```sql
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
```

---

### 9.5 App Settings

```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

---

## 10. Cache Strategy

### Server Cache

| Data             |           TTL | Why                                   |
| ---------------- | ------------: | ------------------------------------- |
| Current weather  | 15-30 minutes | Changes often, but not every tab open |
| Hourly forecast  |     1-2 hours | Useful but not constantly changing    |
| Daily forecast   |     3-6 hours | Slower changing                       |
| Geocoding        |     7-30 days | City coordinates rarely change        |
| Daily background |      24 hours | Same beautiful background for a day   |
| Background pool  |      24 hours | Faster background rotation            |
| Shayari list     |    1-24 hours | Own data, safe to cache               |
| Home payload     |  5-15 minutes | Speeds up new tab loading             |

### Extension Cache

| Data                       |            TTL | Why                  |
| -------------------------- | -------------: | -------------------- |
| Favorite links             |      No expiry | User-created data    |
| Folder tree                |      No expiry | User-created data    |
| User settings              |      No expiry | User preference      |
| Last home payload          |   5-15 minutes | Fast startup         |
| Last successful weather    | Until replaced | Fallback             |
| Last successful background | Until replaced | Fallback             |
| Today's shayari            |       24 hours | Stable daily display |
| Favicons                   |      7-30 days | Faster link grid     |

---

## 11. Cache Fallback Logic

Use this pattern everywhere:

```txt
1. Check fresh cache.
2. If fresh cache exists, return it.
3. If cache is expired, try external API.
4. If external API succeeds, update cache and return fresh data.
5. If external API fails, return expired cache with `isFallback: true`.
6. If no cache exists, return safe default response.
```

Example response with fallback:

```json
{
  "data": {},
  "cache": {
    "status": "stale",
    "isFallback": true,
    "cachedAt": "2026-06-18T00:00:00.000Z",
    "expiresAt": "2026-06-18T00:30:00.000Z"
  }
}
```

---

## 12. Backend Folder Structure

```txt
hinode-server/
  src/
    index.ts
    env.ts

    db/
      db.ts
      schema.sql

    middleware/
      auth.ts
      errorHandler.ts
      rateLimit.ts

    routes/
      health.routes.ts
      home.routes.ts
      shayari.routes.ts
      weather.routes.ts
      background.routes.ts

    services/
      shayari.service.ts
      weather.service.ts
      background.service.ts
      cache.service.ts
      geocode.service.ts
      unsplash.service.ts
      openWeather.service.ts

    types/
      shayari.ts
      weather.ts
      background.ts
      cache.ts

  data/
    hinode.db

  .env
  .env.example
  package.json
  tsconfig.json
```

---

## 13. Extension Folder Structure

```txt
hinode-extension/
  public/
    icons/
      icon-16.png
      icon-48.png
      icon-128.png

  src/
    app/
      App.tsx

    components/
      Background.tsx
      Clock.tsx
      Greeting.tsx
      WeatherCard.tsx
      ShayariCard.tsx
      LinkGrid.tsx
      FolderCard.tsx
      Breadcrumbs.tsx
      AddLinkModal.tsx
      AddFolderModal.tsx
      SettingsModal.tsx

    services/
      apiClient.ts
      storageService.ts
      faviconService.ts

    types/
      linkTree.ts
      settings.ts
      api.ts

    styles/
      index.css

  newtab.html
  manifest.json
  package.json
  vite.config.ts
```

---

## 14. Security Plan

### MVP Security

- Store all API keys on server.
- Use `.env` for secrets.
- Never commit `.env`.
- Add `.env.example`.
- Add simple bearer token between extension and server.
- Add rate limiting.
- Validate request query params.
- Restrict CORS to allowed extension origins when possible.
- Protect write routes with an admin token.

### Important Note

A token stored inside a Chrome extension can still be extracted by technical users. Treat it as a basic abuse-prevention layer, not as a perfect secret.

The real protection is:

- Keeping third-party API keys on the server.
- Rate limiting.
- Caching.
- Input validation.
- Request logging.
- API usage limits.

---

## 15. MVP Scope

### MVP Backend

Build these first:

```txt
GET /health
GET /api/home
GET /api/weather/current
GET /api/background/today
GET /api/shayari/random
POST /api/shayari
```

### MVP Extension

Build these first:

```txt
New tab override
Current time
Greeting
Weather card
Background image
Shayari card
Add favorite link
Add folder
Open folder
Nested folders
Settings modal
Local storage
```

---

## 16. Phase Roadmap

### Phase 1 — Project Setup

- Create monorepo or two folders:
  - `hinode-extension`
  - `hinode-server`
- Setup React + Vite + TypeScript.
- Setup Express + TypeScript.
- Setup SQLite.
- Add `.env.example`.
- Add README.

---

### Phase 2 — Backend Foundation

- Create `/health`.
- Create database schema.
- Create cache service.
- Create shayari service.
- Create weather service.
- Create background service.
- Add error handler.
- Add request validation.
- Add rate limiting.

---

### Phase 3 — Extension Foundation

- Create new tab override.
- Build main layout.
- Add time and greeting.
- Add settings service.
- Add API client.
- Connect to `/api/home`.

---

### Phase 4 — Weather + Background + Shayari

- Implement weather cache.
- Implement background cache.
- Implement shayari random route.
- Add fallback behavior.
- Display all three in the extension.

---

### Phase 5 — Links and Folders

- Create recursive link/folder data model.
- Add link modal.
- Add folder modal.
- Add nested folder support.
- Add breadcrumbs.
- Add edit/delete actions.
- Store data in `chrome.storage.local`.

---

### Phase 6 — Polish

- Add drag and drop.
- Add favicon cache.
- Add search.
- Add animations.
- Add better empty states.
- Add import/export backup.
- Add responsive design.
- Add offline fallback UI.

---

## 17. Suggested UI Style

Hinode should feel:

```txt
Calm
Warm
Minimal
Beautiful
Fast
Personal
```

Visual direction:

- Full-screen background image.
- Soft dark overlay.
- Glassmorphism cards.
- Rounded corners.
- Smooth shadows.
- Calm typography.
- Small attribution text.
- Minimal icons.
- Focus on readability.

Possible color palette:

```txt
Background overlay: rgba(0, 0, 0, 0.35)
Card background: rgba(255, 255, 255, 0.14)
Card border: rgba(255, 255, 255, 0.22)
Text primary: #ffffff
Text secondary: rgba(255, 255, 255, 0.78)
Accent: #f8c471
```

---

## 18. Suggested Names

Project name:

```txt
Hinode
```

Meaning:

```txt
Hinode = sunrise in Japanese
```

It fits the idea of a calm, beautiful start every time you open a new tab.

Possible tagline:

```txt
Hinode — A peaceful start to every tab.
```

---

## 19. First Implementation Order

Recommended order:

```txt
1. Build backend /health
2. Build backend SQLite setup
3. Build shayari table and random shayari route
4. Build weather route with cache
5. Build background route with cache
6. Build /api/home route
7. Build extension new tab override
8. Build extension UI layout
9. Connect extension to /api/home
10. Add favorite links
11. Add folders
12. Add nested folders
13. Add settings
14. Add polish
```

---

## 20. Final Target

When the user opens a new tab, Hinode should instantly show:

```txt
Good Morning, Varun

10:42 AM
Thursday, 18 June

Tokyo
28°C · Cloudy

"कभी खुद को भी पढ़ लिया करो..."

Favorite links and folders

Beautiful Unsplash background
Photo by Creator on Unsplash
```

Hinode should feel like a calm, personal dashboard that opens instantly and keeps API keys safe.

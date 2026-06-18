# To‑Do List

## Backend (Hinode Server)

- [x] Initialize backend server with health endpoint
- [x] Add SQLite database setup (schema.sql and db.ts)
- [x] Add shayari random route and service
- [x] Add weather service with OpenWeather API, caching, and GET /api/weather/current route
- [x] Add background service with Unsplash API, caching, and GET /api/background/today & GET /api/background/random routes
- [x] Add authentication middleware for admin‑protected routes
- [x] Add error handling middleware for consistent JSON error responses
- [x] Add rate limiting middleware for all API routes
- [x] Exempt health endpoint from global rate limiting
- [x] Ensure data directory exists before SQLite opens the file
- [x] Create home service that aggregates weather, background, shayari, and serverTime
- [x] Create home route GET /api/home
- [x] Update .env.example with required keys
- [x] Add TypeScript type definition for weather data
- [x] Add TypeScript type definition for background data
- [x] Add TypeScript type definitions for cache entry structures
- [x] Handle duplicate ID conflict on shayari POST (return 409 Conflict)
- [ ] Write unit tests for backend services and routes

## Extension (Hinode Extension)

- [x] Set up Chrome extension scaffold with Vite, React, and TypeScript
- [x] Create `manifest.json` with newtab override and required permissions
- [x] Implement `public/newtab.html` and root React component `App.tsx`
- [x] Implement Greeting component (time‑based greeting)
- [ ] Implement Clock component (current time and date)
- [ ] Implement WeatherCard component (fetch/display weather via /api/home)
- [ ] Implement ShayariCard component (display random shayari)
- [ ] Implement Background component (show Unsplash image with attribution)
- [ ] Implement LinkGrid, FolderCard, Breadcrumbs, and modals for link/folder CRUD
- [ ] Implement SettingsModal and storage service using `chrome.storage.local`
- [ ] Connect extension UI to backend /api/home endpoint for initial payload (if not already functional)

# Hinode

A full‑stack example application that combines a **Node.js/Express** backend with a **React** frontend (Vite). The server provides:
- Current weather data (via OpenWeather API) with caching.
- Random background images (via Unsplash API) with caching.
- Random shayari (poetry) entries.
- A combined **home payload** endpoint that aggregates the above.

The frontend fetches this payload and displays a greeting, clock, weather card, background image, and shayari card.

---

## Features
- **Weather Service** – fetches and caches weather data (20‑minute TTL).
- **Background Service** – fetches and caches Unsplash images (24‑hour TTL).
- **Shayari Service** – serves random shayari entries.
- **Express Rate Limiting** – protected by `express-rate-limit` with `trust proxy` enabled.
- **React UI** – built with Vite, TypeScript, and Tailwind CSS.
- **SQLite** – lightweight local persistence for cache tables.

---

## Architecture
```
/project-root
├─ hinode-server   # Express backend
│  ├─ src
│  │  ├─ db          # SQLite wrapper & migrations
│  │  ├─ services    # weather, background, shayari, home
│  │  └─ routes      # API routes
│  └─ data            # SQLite DB file (generated at runtime)
│
├─ hinode-extension # React frontend (Vite)
│  ├─ src
│  │  ├─ app        # App component
│  │  ├─ components # Greeting, Clock, WeatherCard, ShayariCard, Background
│  │  ├─ services   # API client (fetches /api/home)
│  │  └─ types      # TypeScript interfaces shared with backend
│  └─ public        # HTML entry point
└─ README.md
```

---

## Prerequisites
- **Node.js** (v18 or later) and **npm**
- **SQLite3** (installed via npm; the binary is bundled)
- API keys (see *Environment variables* below)

---

## Setup
```bash
# Clone the repository (if not already)
git clone <repo-url> .

# Install server dependencies
cd hinode-server
npm install

# Install frontend dependencies
cd ../hinode-extension
npm install
```

---

## Environment variables
Create a `.env` file in `hinode-server/` (or set the variables in your shell) with the following keys:
```
# Server configuration
PORT=7000               # optional – defaults to 7000

# External APIs (required for live data)
OPENWEATHER_API_KEY=your_openweather_key
UNSPLASH_ACCESS_KEY=your_unsplash_key
```
The frontend uses the backend URL `http://localhost:7000/api/home` directly, so no extra env vars are needed for the UI during local development.

---

## Development
### Backend
```bash
cd hinode-server
npm run dev   # Starts ts-node-dev on the configured PORT (default 7000)
```
The server will automatically run the SQLite migrations on start.

### Frontend
```bash
cd ../hinode-extension
npm run dev   # Vite dev server (default http://localhost:5173, falls back to 5174 if occupied)
```
Open the URL shown in the console (e.g., `http://localhost:5174/`). The UI will request data from the backend at `http://localhost:7000/api/home`.

---

## Build & Deploy
### Backend
```bash
cd hinode-server
npm run build   # (optional) compile TypeScript to JavaScript for production
# You can then start with: node dist/index.js (after adding a build script)
```
### Frontend
```bash
cd hinode-extension
npm run build   # Produces static files in the `dist/` folder
```
Serve the `dist/` folder with any static file server (e.g., `npx serve dist`). In production you would typically host the static assets behind a CDN and point them to the same domain as the API.

---

## Directory structure
- `hinode-server/` – Express API, SQLite cache, services.
- `hinode-extension/` – React application, Vite configuration, UI components.
- `.gitignore` – excludes node_modules, build output, env files, SQLite DBs, and IDE artifacts.

---

## License
This project is provided as an example and is licensed under the MIT License.

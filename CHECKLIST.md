# Hinode — UI Implementation Checklist

This checklist tracks progress against `hinode-ui-plan.md`. Items are grouped by area.

## Extension Scaffold & Config

- [x] Initialize React + Vite + TypeScript extension
- [ ] Add `manifest.json` (Manifest V3, newtab override, permissions)
- [ ] Add `vite.config.ts` (build to extension-friendly output)
- [ ] Add `tsconfig.json`
- [ ] Add `.env.example` for extension environment

## Core Types & Services

- [x] `settings.ts` types and defaults
- [x] `linkTree.ts` types and helpers
- [ ] `api.ts` types (HomePayload, WeatherData, Background, Shayari)
- [ ] `apiClient.ts` service (call `/api/home`, handle offline/cache)
- [ ] `faviconService.ts` (fetch/cache favicons + letter fallback)
- [x] `storageService.ts` (settings + links cache)

## UI Primitives

- [x] `Button.tsx`
- [x] `Card.tsx` (needs onClick fix)
- [x] `IconButton.tsx`
- [x] `Input.tsx`
- [x] `Modal.tsx`
- [x] `Toggle.tsx`

## Layout & Main Shell

- [ ] `App.tsx` main layout orchestrating all sections
- [ ] `Toolbar.tsx` floating actions (settings, refresh bg, theme toggle)
- [ ] Page load stagger animation utility
- [ ] Offline pill

## Hero Section

- [x] `Greeting.tsx`
- [x] `Clock.tsx`

## Background Layer

- [x] `Background.tsx` component
- [ ] Add `bg-layer` CSS for crossfade + ken-burns
- [ ] Fix transition class logic (`visible`/`hidden` states)
- [ ] Add `focus-ring` utility CSS

## Info Row

- [x] `WeatherCard.tsx` (fix `animate-in-5` class usage)
- [ ] `ShayariCard.tsx`

## Links & Folders Section

- [ ] `LinkGrid.tsx`
- [ ] `LinkCard.tsx`
- [ ] `FolderCard.tsx`
- [ ] `Breadcrumbs.tsx`
- [ ] `AddLinkModal.tsx`
- [ ] `AddFolderModal.tsx`
- [ ] `EmptyState.tsx`

## Settings

- [ ] `SettingsModal.tsx`
- [ ] Theme toggle (light/dark/system)
- [ ] User name input
- [ ] Weather location settings
- [ ] Clock format toggle
- [ ] Background query/refresh settings
- [ ] Shayari language selector

## Accessibility & Polish

- [ ] Focus rings on all interactive elements
- [ ] `prefers-reduced-motion` respected
- [ ] Keyboard navigation for link/folder grid
- [ ] Screen-reader labels
- [ ] Responsive mobile layout (bottom toolbar, single column)
- [ ] Toast/copy feedback for shayari

## Build & Validation

- [ ] Extension builds without TypeScript errors
- [ ] Server tests pass
- [ ] Manual smoke test in browser dev mode

---

## Current Priority

1. Add missing config files so the extension can build.
2. Add `api.ts` types, `apiClient.ts`, and `faviconService.ts`.
3. Build `App.tsx` and wire up `/api/home`.
4. Implement remaining section components (`ShayariCard`, `Toolbar`, links/folders, settings).
5. Polish CSS/accessibility and validate the build.

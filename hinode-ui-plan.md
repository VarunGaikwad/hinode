# Hinode — UI Design Plan

A comprehensive visual and interaction specification for the Hinode Chrome New Tab extension. This document is written to guide both human developers and AI coding agents toward a consistent, beautiful, calm interface.

---

## 1. Design Philosophy

| Word | Meaning in Hinode |
|------|-------------------|
| **Calm** | No harsh edges, no flashing elements, generous whitespace, soft transitions. |
| **Warm** | Sunrise-inspired palette: soft amber, peach, cream, gentle gold accents. |
| **Minimal** | Only essential UI visible by default; actions reveal themselves through hover/focus. |
| **Beautiful** | Full-screen photography, glassmorphism, refined typography, subtle depth. |
| **Fast** | Instant first paint, skeleton-free progressive reveals, cached backgrounds. |
| **Personal** | Greeting by name, user-controlled layout, favorite links, mood-matched shayari. |

**Core metaphor:** Every new tab is a quiet sunrise — a peaceful, personal dashboard.

---

## 2. Visual Identity

### 2.1 Color System

Use CSS custom properties so themes can switch without rewriting Tailwind classes.

```css
:root {
  /* Base surfaces */
  --surface-1: rgba(255, 255, 255, 0.14);
  --surface-2: rgba(255, 255, 255, 0.22);
  --surface-3: rgba(255, 255, 255, 0.08);

  /* Borders */
  --border-1: rgba(255, 255, 255, 0.22);
  --border-2: rgba(255, 255, 255, 0.12);

  /* Text */
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.78);
  --text-tertiary: rgba(255, 255, 255, 0.55);

  /* Accents (sunrise) */
  --accent: #f8c471;
  --accent-soft: rgba(248, 196, 113, 0.25);
  --accent-glow: rgba(248, 196, 113, 0.45);

  /* Background overlays */
  --overlay-dark: rgba(0, 0, 0, 0.35);
  --overlay-darker: rgba(0, 0, 0, 0.55);
  --overlay-warm: linear-gradient(
    160deg,
    rgba(30, 20, 30, 0.45) 0%,
    rgba(60, 40, 40, 0.35) 50%,
    rgba(20, 25, 35, 0.55) 100%
  );

  /* Semantic */
  --error: #ff8a80;
  --success: #a5d6a7;
  --warning: #ffd54f;

  /* Spacing & radius */
  --radius-sm: 0.5rem;   /* 8px */
  --radius-md: 1rem;     /* 16px */
  --radius-lg: 1.5rem;   /* 24px */
  --radius-xl: 2rem;     /* 32px */
  --radius-full: 9999px;
}
```

**Dark theme adjustments:**
- `--surface-1`: `rgba(0, 0, 0, 0.32)`
- `--surface-2`: `rgba(0, 0, 0, 0.45)`
- `--border-1`: `rgba(255, 255, 255, 0.12)`
- `--text-secondary`: `rgba(255, 255, 255, 0.72)`
- `--overlay-dark`: `rgba(0, 0, 0, 0.55)`

**Light theme adjustments:**
- `--surface-1`: `rgba(255, 255, 255, 0.72)`
- `--surface-2`: `rgba(255, 255, 255, 0.88)`
- `--text-primary`: `#1a1a1a`
- `--text-secondary`: `rgba(0, 0, 0, 0.65)`
- `--text-tertiary`: `rgba(0, 0, 0, 0.45)`
- `--overlay-dark`: `rgba(255, 255, 255, 0.25)`
- `--accent`: `#d48e28`

### 2.2 Typography

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Display / Clock** | Inter or JetBrains Mono | 200–300 | Large time numbers |
| **Headings** | Inter | 500–600 | Greeting, section titles |
| **Body / UI** | Inter | 400–500 | Weather, links, buttons |
| **Shayari / Quotes** | Playfair Display or Cormorant Garamond | 400 italic | Poetic text |
| **Captions** | Inter | 400 | Attribution, metadata |

**Type scale:**

```css
--text-xs: 0.75rem;      /* 12px */
--text-sm: 0.875rem;     /* 14px */
--text-base: 1rem;       /* 16px */
--text-lg: 1.125rem;     /* 18px */
--text-xl: 1.5rem;       /* 24px */
--text-2xl: 2rem;        /* 32px */
--text-3xl: 3rem;        /* 48px */
--text-4xl: 4.5rem;      /* 72px */
--text-5xl: 6rem;        /* 96px */
```

**Line heights:**
- Display: `1`
- Headings: `1.2`
- Body: `1.6`
- Shayari: `1.7`

### 2.3 Spacing Scale

Use a 4px base grid.

```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.5rem;    /* 24px */
--space-6: 2rem;      /* 32px */
--space-8: 3rem;      /* 48px */
--space-10: 4rem;     /* 64px */
--space-12: 6rem;     /* 96px */
```

### 2.4 Glassmorphism Spec

All floating cards share this base style:

```css
.glass-card {
  background: var(--surface-1);
  backdrop-filter: blur(24px) saturate(140%);
  -webkit-backdrop-filter: blur(24px) saturate(140%);
  border: 1px solid var(--border-1);
  border-radius: var(--radius-lg);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}
```

**Hover elevation:**

```css
.glass-card:hover {
  background: var(--surface-2);
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.18),
    0 0 0 1px var(--border-1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}
```

---

## 3. Layout Architecture

### 3.1 Z-Layer Stack

```txt
z-0   Background image (fixed, cover)
z-10  Warm/dark gradient overlay
z-20  Decorative ambient glow (subtle, optional)
z-30  Main content container
z-40  Floating action buttons / toolbar
z-50  Modals and overlays
z-60  Toast notifications
```

### 3.2 Main Grid

The new tab page uses a single centered column that adapts to viewport height.

```txt
┌─────────────────────────────────────────┐
│            [Toolbar]                    │  z-40, top-right
├─────────────────────────────────────────┤
│                                         │
│         Good Morning, Varun             │  Hero section
│            10:42 AM                     │
│      Thursday, 18 June                  │
│                                         │
│   ┌─────────┐  ┌────────────────────┐   │
│   │ Weather │  │      Shayari       │   │  Info row
│   └─────────┘  └────────────────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │  Favorite Links & Folders       │   │  Links section
│   │  [Work] [Learning] [GitHub] ... │   │
│   └─────────────────────────────────┘   │
│                                         │
│      Photo by Name on Unsplash          │  Attribution
└─────────────────────────────────────────┘
```

**Responsive breakpoints:**

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| `sm` | 640px | Single column, smaller clock |
| `md` | 768px | Two-column info row |
| `lg` | 1024px | Full layout, larger gaps |
| `xl` | 1280px | Max content width 1200px |

### 3.3 Safe Zones

- Minimum horizontal padding: `1rem` (mobile), `2rem` (desktop).
- Content never touches viewport edges.
- Touch targets minimum `44px × 44px`.

---

## 4. Section Specifications

### 4.1 Background Layer

- Full `100vw × 100vh`, `object-fit: cover`, centered.
- Preload next background for smooth transitions.
- Crossfade duration: `800ms`, easing `cubic-bezier(0.4, 0, 0.2, 1)`.
- Overlay: warm gradient + dark vignette.
- Optional: slow ken-burns zoom effect (`scale 1.0 → 1.03` over 30s).

### 4.2 Hero Section

**Greeting:**
- Font: Inter, `text-xl md:text-2xl`, weight 500.
- Color: `--text-secondary`.
- Fade in with `translateY(12px → 0)`, duration `600ms`, delay `100ms`.

**Clock:**
- Font: Inter or JetBrains Mono, `text-5xl sm:text-6xl md:text-7xl`, weight 200–300.
- Color: `--text-primary`.
- Tabular nums to prevent jitter.
- Fade in with `translateY(16px → 0)`, duration `700ms`, delay `200ms`.

**Date:**
- Font: Inter, `text-base md:text-lg`, weight 400.
- Color: `--text-tertiary`.
- Format: "Thursday, 18 June".

### 4.3 Weather Card

**Layout:** horizontal card with icon left, details right.

```txt
┌──────────────────────────────┐
│  ☁️   28°C                    │
│       Tokyo · Cloudy         │
│       H:65%  W:12 km/h       │
└──────────────────────────────┘
```

**Styling:**
- Card: `glass-card`, padding `1.25rem 1.5rem`.
- Icon: 48px SVG, `--text-primary`.
- Temperature: `text-3xl`, weight 300.
- City: `text-base`, weight 500, `--text-secondary`.
- Meta: `text-sm`, `--text-tertiary`, with small dot separators.

**Hover:** subtle lift, show refresh hint tooltip.

### 4.4 Shayari Card

**Layout:** centered poetic block.

**Styling:**
- Card: `glass-card`, padding `1.5rem 2rem`, max-width `640px`.
- Opening quote mark: large decorative `“` in `--accent`, opacity 0.4, positioned absolute top-left.
- Text: Playfair Display italic, `text-lg md:text-xl`, line-height 1.7, color `--text-primary`.
- Author: `text-sm`, `--text-tertiary`, right-aligned with em dash.
- Language consideration: Hindi/Marathi text should render with slightly larger line-height (1.8) and adequate word-spacing.

**Micro-interaction:**
- On hover, reveal copy and refresh icons in the top-right corner.
- Copy feedback: icon briefly changes to checkmark, toast says "Copied".

### 4.5 Links & Folders Section

**Container:**
- `glass-card`, padding `1.25rem`.
- Max-width matches content grid.

**Toolbar:**
- Breadcrumbs left: `Home / Work / Projects`.
- Actions right: search icon, add link button, add folder button.
- Breadcrumb separator: `›`, `--text-tertiary`.

**Grid:**
- `display: grid`.
- Mobile: 2 columns.
- Tablet: 4 columns.
- Desktop: 6 columns.
- Gap: `0.75rem`.

**Link Card:**
- Square-ish tile with centered favicon + title.
- Background: `--surface-3`.
- Border-radius: `--radius-md`.
- Favicon: 32px, rounded, with fallback letter avatar.
- Title: `text-sm`, truncated with ellipsis.
- URL: `text-xs`, `--text-tertiary`, truncated.
- Hover: lift + show edit/delete actions (opacity 0 → 1).

**Folder Card:**
- Similar to link card but with folder icon.
- Subtle badge showing child count if > 0.
- Double-click or tap to open.

**Empty State:**
- Centered illustration (sunrise line icon or soft gradient orb).
- Text: "Your space is empty" / "Add your first favorite link or folder."
- CTA button: "Add Link" in `--accent`.

### 4.6 Floating Toolbar

Positioned top-right, minimal icon buttons:

- Settings (gear)
- Refresh background
- Toggle theme (sun/moon)

Each button:
- `glass-card` circular, `44px × 44px`.
- Icon: 20px, `--text-secondary`.
- Hover: `--accent` icon color, scale `1.05`.

### 4.7 Background Attribution

- Position: bottom-left, padding `1.5rem`.
- Text: `text-xs`, `--text-tertiary`.
- Link: photographer name underlined on hover, opens Unsplash photo page.

---

## 5. Component Library

### 5.1 Buttons

**Primary Button:**
```css
background: var(--accent);
color: #1a1a1a;
border-radius: var(--radius-full);
padding: 0.625rem 1.25rem;
font-weight: 500;
box-shadow: 0 4px 16px var(--accent-soft);
```
Hover: brightness 1.05, translateY(-1px).

**Secondary Button:**
```css
background: var(--surface-1);
color: var(--text-primary);
border: 1px solid var(--border-1);
border-radius: var(--radius-full);
```

**Icon Button:** circular, `44px`, glass surface.

### 5.2 Inputs

```css
background: rgba(0, 0, 0, 0.2);
border: 1px solid var(--border-2);
color: var(--text-primary);
border-radius: var(--radius-md);
padding: 0.625rem 0.875rem;
```
Focus: border color `--accent`, subtle glow.
Placeholder: `--text-tertiary`.

### 5.3 Modals

**Overlay:**
```css
background: rgba(0, 0, 0, 0.45);
backdrop-filter: blur(4px);
```

**Panel:**
- Centered, max-width `480px`.
- `glass-card` with stronger surface (`--surface-2`).
- Entrance: scale `0.96 → 1`, opacity `0 → 1`, duration `250ms`.

### 5.4 Toggle Switch

```css
width: 44px;
height: 24px;
border-radius: var(--radius-full);
background: var(--surface-3);
```
Checked: background `--accent`, thumb slides right.

### 5.5 Skeleton / Loading

- Use pulsing glass cards with subtle shimmer.
- Avoid spinners for initial load; fade content in as it arrives.
- For refresh actions, use small inline spinners inside buttons.

---

## 6. Motion & Animation

### 6.1 Page Load Sequence

```txt
0ms    Background visible (already cached)
100ms  Overlay stable
200ms  Greeting fades in
300ms  Clock fades in
400ms  Date fades in
500ms  Weather card slides up + fades
600ms  Shayari card slides up + fades
700ms  Links section slides up + fades
900ms  Toolbar + attribution fade in
```

Easing: `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo).
Stagger: `100ms` between elements.

### 6.2 Hover Micro-interactions

- Cards: `translateY(-2px)`, shadow deepen, duration `200ms`.
- Buttons: `scale(1.03)`, duration `150ms`.
- Links: underline or accent color shift.

### 6.3 Background Transitions

- Two background layers; crossfade between them.
- Duration: `800ms`.
- Optional slow pan/zoom while visible.

### 6.4 Modal Transitions

- Backdrop fade: `200ms`.
- Panel scale + fade: `250ms`, easing `cubic-bezier(0.16, 1, 0.3, 1)`.

### 6.5 Reduced Motion

If `prefers-reduced-motion: reduce`:
- Disable parallax, zoom, and stagger delays.
- Keep opacity transitions but remove translate/scale transforms.
- Respect system setting automatically.

---

## 7. Themes

### 7.1 Theme Modes

- **Light:** bright overlay, dark text, glass surfaces more opaque.
- **Dark:** dark overlay, white text, glass surfaces more translucent.
- **System:** follow `prefers-color-scheme`.

### 7.2 Theme Application

Apply a class on `<html>`: `.theme-light`, `.theme-dark`, or `.theme-system`.
CSS custom properties update based on the class.

### 7.3 Background Adaptation

The background image is independent of theme, but the overlay intensity changes:
- Light theme overlay: `--overlay-warm` + extra white wash.
- Dark theme overlay: darker vignette.

---

## 8. Responsive Design

### 8.1 Mobile (< 640px)

- Clock: `text-5xl`.
- Info row: single column, full-width cards.
- Links grid: 2 columns.
- Toolbar: bottom-right floating pill instead of top row.
- Attribution: bottom-center, smaller text.

### 8.2 Tablet (640px – 1024px)

- Clock: `text-6xl`.
- Info row: two-column grid.
- Links grid: 4 columns.

### 8.3 Desktop (> 1024px)

- Clock: `text-7xl`.
- Max content width: `1200px`.
- Links grid: 6 columns.
- Toolbar: top-right.

---

## 9. Accessibility

### 9.1 Contrast

- All text must meet WCAG AA against the dynamic background.
- Guarantee via dark overlay + opaque card surfaces; do not rely on background image being dark.

### 9.2 Focus

- Visible focus ring: `2px solid var(--accent)`, offset `2px`.
- Apply to all interactive elements.

### 9.3 Keyboard Navigation

- `Tab` moves through toolbar, cards, modals.
- `Enter` / `Space` activates cards and buttons.
- `Escape` closes modals.
- Arrow keys navigate link/folder grid.

### 9.4 Screen Readers

- Greeting: `aria-live="polite"`.
- Clock: `aria-label` with full spoken time.
- Weather: group with `aria-label` summarizing conditions.
- Shayari: semantic `<blockquote>` with `<cite>` for author.
- Links: each card is a button/link with clear label.

### 9.5 Reduced Motion

See section 6.5.

---

## 10. Icons & Assets

### 10.1 Icon Library

Use **Lucide React** for consistency and clarity.

| Icon | Usage |
|------|-------|
| `Settings` | Settings modal |
| `RefreshCw` | Refresh background / weather |
| `Sun` / `Moon` | Theme toggle |
| `Plus` | Add link/folder |
| `Folder` | Folder card |
| `Link2` | Link card default |
| `Search` | Search links |
| `X` | Close modal / clear input |
| `Copy` / `Check` | Copy shayari |
| `Trash2` / `Pencil` | Edit/delete actions |
| `ChevronRight` | Breadcrumb separator / folder enter |
| `Cloud`, `Sun`, `CloudRain`, etc. | Weather conditions |

### 10.2 Favicons

- Fetch via `https://www.google.com/s2/favicons?domain={domain}&sz=64`.
- Cache in `chrome.storage.local` for 7 days.
- Fallback: rounded letter avatar using domain first letter + accent color.

### 10.3 Empty State Illustration

- Simple SVG: rising sun over horizon with soft gradients.
- Keep it small (≤ 120px) and calm.

---

## 11. States

### 11.1 Loading

- Show background immediately.
- Cards render with subtle pulse animation.
- Clock shows local time immediately (no server needed).
- Avoid blocking the entire screen.

### 11.2 Error

- Inline message inside affected card, not a full-screen red banner.
- Text: "Could not refresh weather. Showing last known data."
- Retry button inline.
- If all data fails, show calm fallback card with helpful text.

### 11.3 Empty

- Links section: illustration + friendly text + CTA.
- Shayari: fallback to a hand-picked default shayari stored locally.
- Weather: prompt user to set location in settings.

### 11.4 Offline

- Use last cached payload.
- Show small offline pill: "You're offline · using cached data".
- Disable refresh buttons until online.

---

## 12. Implementation Notes for AI Agents

### 12.1 Tailwind Config

Extend `tailwind.config.js` with the custom colors/spacing or rely on CSS variables via arbitrary values. Recommended: define a plugin mapping:

```js
colors: {
  hinode: {
    surface: 'var(--surface-1)',
    border: 'var(--border-1)',
    accent: '#f8c471',
  }
}
```

### 12.2 CSS Architecture

- Keep `index.css` as the source of CSS variables and global utilities.
- Each component uses Tailwind classes; custom animations go in `index.css`.
- Use `@media (prefers-reduced-motion: reduce)` for accessibility.

### 12.3 Component Checklist

When implementing or reviewing, ensure each component has:
- [ ] Visual style matching this plan
- [ ] Hover/focus/active states
- [ ] Loading state (if data-dependent)
- [ ] Error state (if data-dependent)
- [ ] Accessible labels and roles
- [ ] Responsive behavior

### 12.4 File Organization

```txt
hinode-extension/src/
  styles/
    index.css          # Variables, animations, global
    themes.css         # Light/dark/system overrides
  components/
    ui/                # Reusable primitives
      Button.tsx
      Card.tsx
      Input.tsx
      Modal.tsx
      IconButton.tsx
      Toggle.tsx
    Background.tsx
    Clock.tsx
    Greeting.tsx
    WeatherCard.tsx
    ShayariCard.tsx
    LinkGrid.tsx
    FolderCard.tsx
    LinkCard.tsx
    Breadcrumbs.tsx
    Toolbar.tsx
    AddLinkModal.tsx
    AddFolderModal.tsx
    SettingsModal.tsx
    EmptyState.tsx
    OfflinePill.tsx
```

### 12.5 Do's and Don'ts

| Do | Don't |
|----|-------|
| Use glassmorphism on top of a dark overlay. | Place translucent text directly over busy background areas. |
| Keep animations slow and gentle. | Use bouncy, flashy, or rapid motion. |
| Cache assets for instant feel. | Block the UI waiting for server on every new tab. |
| Use real weather icons from Lucide or SVG. | Use emoji-only weather indicators (inconsistent across OS). |
| Truncate long link titles with tooltips. | Let text overflow or wrap unpredictably. |
| Respect `prefers-reduced-motion`. | Assume all users want motion. |

---

## 13. Quick Reference: Sample Component

### WeatherCard Tailwind Example

```tsx
<div className="glass-card p-5 flex items-center gap-4 min-w-[220px]">
  <Cloud className="w-12 h-12 text-white" />
  <div className="flex flex-col">
    <span className="text-3xl font-light text-white">28°</span>
    <span className="text-base font-medium text-white/80">Tokyo · Cloudy</span>
    <span className="text-sm text-white/55">H:65% · W:12 km/h</span>
  </div>
</div>
```

### LinkCard Tailwind Example

```tsx
<button className="group relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/20 transition-all duration-200 hover:-translate-y-0.5">
  <img src={favicon} alt="" className="w-8 h-8 rounded-md" />
  <span className="text-sm text-white truncate max-w-full">{title}</span>
  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
    <IconButton icon={Pencil} aria-label="Edit" />
    <IconButton icon={Trash2} aria-label="Delete" />
  </div>
</button>
```

---

## 14. Success Criteria

The Hinode UI is complete when:

1. Opening a new tab feels instant and calm.
2. Text is readable on any background Unsplash provides.
3. Animations are smooth but respectful of reduced-motion preferences.
4. All interactive elements have clear hover, focus, active, and disabled states.
5. The layout works cleanly from 320px mobile to 2560px ultrawide.
6. Users can manage links and nested folders without confusion.
7. The interface feels personal, warm, and sunrise-inspired.

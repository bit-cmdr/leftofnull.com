# Dark Mode Design — leftofnull.com

**Status:** Approved
**Date:** 2026-05-15
**Author:** Alexander Kahoun (with Claude)

## Goal

Add a dark mode option to the Jekyll blog. On first visit, follow the operating system's `prefers-color-scheme`. Provide a toggle in the navbar so visitors can override and persist their choice across sessions. Dark mode covers the full site — backgrounds, text, links, navbar, footer, post bodies, code blocks, category badges, and search input.

## Non-goals

- Per-section theme overrides
- Live-following system theme changes after the user has explicitly toggled
- Animating the full-page color transition
- A separate "auto" position in the toggle (system preference is the default, not a third state)
- Automatic dark-mode treatment of images in posts (any per-post fix is a separate effort)

## Architecture

A single source of truth — CSS custom properties — driven by a `data-theme` attribute on `<html>`. A tiny inline script in `<head>` sets the attribute before paint to prevent flash-of-wrong-theme (FOUC). A button in the navbar lets the user toggle, persisting their choice in `localStorage`.

```
<html data-theme="dark">                              ← set by inline boot script + toggle
  :root { --bg, --text, --surface, --link, ... }      ← light tokens (default)
  [data-theme="dark"] { --bg, --text, ... }           ← dark overrides
```

Every existing hard-coded color in `screen.css` is refactored to reference a token. No new colors are introduced — existing rules just point at variables.

## Token set

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#ffffff` | `#0f1419` |
| `--surface` | `#ffffff` | `#1a2027` |
| `--surface-2` | `#fafafa` | `#11161b` |
| `--text` | `rgba(0,0,0,.8)` | `rgba(255,255,255,.87)` |
| `--text-muted` | `rgba(0,0,0,.44)` | `rgba(255,255,255,.55)` |
| `--text-faint` | `rgba(0,0,0,.5)` | `rgba(255,255,255,.45)` |
| `--border` | `rgba(0,0,0,.125)` | `rgba(255,255,255,.12)` |
| `--border-faint` | `rgba(0,0,0,.05)` | `rgba(255,255,255,.06)` |
| `--link` | `#2563EB` | `#60A5FA` |
| `--link-hover` | `#1D4ED8` | `#93C5FD` |
| `--code-bg` | `#fff` | `#11161b` |
| `--code-border` | `#E3EDF3` | `rgba(255,255,255,.08)` |
| `--tag-bg` | `rgba(0,0,0,.05)` | `rgba(255,255,255,.08)` |
| `--accent-green` | `#1C9963` | `#10b981` |

The brand greens for follow/subscribe buttons keep their hue but are tuned for contrast on a dark background.

## Components

### `_layouts/default.html`
- Add a small inline `<script>` in `<head>` (must be inline to avoid FOUC) that reads `localStorage.theme` (falling back to `matchMedia('(prefers-color-scheme: dark)')`) and sets `<html data-theme="…">` synchronously before stylesheets evaluate.
- Add a toggle `<button>` to the navbar `<ul>` as a new `<li>` immediately after the `search-lunr` include. Sun icon (`fa-sun`) shown in dark mode, moon icon (`fa-moon`) shown in light mode; the icon swap is driven by CSS attribute selectors so no JS is needed for icon state.
- Replace the single `<meta name="theme-color" content="#2563EB">` with two `<meta>` tags using `media="(prefers-color-scheme: light)"` and `media="(prefers-color-scheme: dark)"` so mobile browser chrome matches the OS theme. (We don't try to keep this in sync with explicit user toggles — it just follows the OS.)

### `assets/css/screen.css`
- Prepend a `:root { … }` block defining all light tokens.
- Append a `[data-theme="dark"] { … }` block with dark overrides.
- Refactor existing rules: replace `#fff`, `rgba(0,0,0,.X)`, `#2563EB`, etc. with `var(--token)` references. This is the bulk of the work — a careful but mechanical sweep.

### `assets/js/theme.js` (new)
- ~25 lines.
- Attaches a click handler to the navbar toggle button.
- Reads current `data-theme` from `<html>`, computes inverse, calls `setAttribute` and `localStorage.setItem`.
- Wraps `localStorage` writes in try/catch.

### `_sass/_syntax.scss`
- Keep existing light Rouge token colors.
- Add a sibling block scoped under `[data-theme="dark"]` that overrides Rouge token colors with a dark-readable palette (target: a Monokai- or base16-dark-style set). No additional compiled stylesheet needed — Jekyll compiles `_syntax.scss` into `main.css`.

## Data flow

### Page load
1. Browser parses `<head>`. The inline boot script runs synchronously, before any body paints:
   ```js
   (function () {
     try {
       var saved = localStorage.getItem('theme');
       var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
       document.documentElement.setAttribute('data-theme', theme);
     } catch (e) {
       document.documentElement.setAttribute('data-theme', 'light');
     }
   })();
   ```
2. Stylesheets load. Because `data-theme` is already set, the correct token block applies on first paint.
3. Body renders. The toggle button's icon reflects current `data-theme` via CSS attribute selectors.

### Toggle click
1. User clicks the navbar button.
2. `theme.js` reads current `data-theme`, computes the inverse, writes both `localStorage` and `setAttribute`.
3. CSS variable cascade re-evaluates immediately. No reload, no flash.

### System preference change
- Not actively followed after a user has explicitly toggled. Once they express intent, their choice persists until they toggle again. (Simpler implementation and matches the dominant user mental model.)

## Edge cases

- **`localStorage` unavailable** — boot script and toggle wrap access in try/catch; toggle still works in-memory for the session.
- **`prefers-color-scheme` unsupported** — `matchMedia(...).matches` returns `false`, default to light.
- **JS disabled** — boot script doesn't run; no `data-theme` attribute; `:root` light tokens apply; toggle button is inert. Acceptable graceful degradation.
- **In-post images with white backgrounds** — left as-is in v1. Per-post fix is `.dark-invert` class added by the author when needed.
- **Mixpanel** — unaffected. Boot script runs before but does not interact with analytics.
- **Featured image in `.fortags`** — already dark with white text; no change.

## Testing plan

Static Jekyll site, so verification is manual visual review.

1. `bundle exec jekyll serve` and open in a browser.
2. **Toggle light ↔ dark:** click the toggle and confirm:
   - Backgrounds flip; text remains readable (~4.5:1 contrast).
   - Navbar, footer, category block, and search input all dark.
   - Links visible; hover/active state distinct.
   - Code blocks readable with dark Rouge palette.
   - Tags, post meta, blockquote all legible.
3. **Persistence:** refresh — theme persists. Open new tab — theme persists.
4. **System preference path:** clear `localStorage`, set OS to dark, hard reload — site loads dark. Set OS to light, hard reload — light.
5. **No FOUC:** hard-reload in dark mode while watching first paint — no white flash.
6. **JS disabled:** disable JS in devtools, reload — site renders light, toggle hidden/inert, nothing visibly broken.
7. **Pages to verify:** home (`/`), a post, About (`/about`), a category archive, search results, 404.

## Out of scope

See "Non-goals" above. Anything not listed in Components is not part of this work.

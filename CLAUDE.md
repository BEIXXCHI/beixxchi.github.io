# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A personal blog with light/dark theme support, built with **React 18 + Vite 5 + React Router v6** (hash mode). No backend required — content is authored as Markdown files in `src/posts/` and auto-loaded via Vite's glob import.

## Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

No test runner is configured.

## Architecture

**Entry point:** `main.jsx` → `ThemeProvider` (wraps entire app, outside router) → `App` → `HashRouter`

**Three-layer separation:**
- **Data** (`src/data/`) — `loader.js` is the primary data source, auto-scans `src/posts/**/*.md` via `import.meta.glob('?raw')`, parses frontmatter with a custom zero-dependency parser (`src/utils/parseFrontmatter.js`), and exports sorted post arrays + `SITE_CONFIG` + `CATEGORY_COLORS`. (`posts.js` is a legacy hardcoded data file — not imported anywhere)
- **Logic** (`src/hooks/`) — `useIntersection` (scroll-triggered animations), `useSearch` (filter + search with useMemo), `useTheme` (ThemeProvider + useTheme context for light/dark toggle, persisted to localStorage)
- **View** (`src/components/`, `src/pages/`) — props-driven, no global state except theme context

**Routing** (Hash mode for static hosting):
- `/` → Home (featured carousel + post list + sidebar)
- `/post/:id` → PostDetail (Markdown rendered via marked v12 `use()` API + highlight.js)
- `/archive` → Archive (posts grouped by year)
- `/about` → About

**Theming:** Dark theme is the default (`:root`). Light theme via `[data-theme="light"]` override in `src/styles/global.css`. The `ThemeProvider` in `src/hooks/useTheme.jsx` manages state and sets `data-theme` on `<html>`. Toggle button is in Header.

**Styling:** CSS variables + inline styles. No CSS modules, no Tailwind. FeaturedCard/FeaturedCarousel/PostDetail hero text stays white regardless of theme (always on dark gradient overlay). Key variable prefixes: `--bg-*`, `--text-*`, `--border-*`, `--accent*`, `--radius-*`, `--shadow-*`, `--transition-*`.

## Content Authoring

Posts go in `src/posts/` (including subdirectories) as `.md` files named `YYYY-MM-DD-slug.md`. Required frontmatter fields: `title`, `date`. Optional: `id`, `excerpt`, `category`, `tag`, `readTime`, `cover`, `featured`. Missing fields are auto-inferred by `loader.js`.

**Images** must be placed in `public/images/` and referenced with absolute paths (`/images/photo.jpg`). Relative paths in Markdown won't work because files are loaded as raw strings.

**Frontmatter parser** (`src/utils/parseFrontmatter.js`): Custom lightweight parser — supports string, number, boolean values only. No nested YAML, no arrays. Dates are parsed as numbers if they look numeric (e.g. `2025-02-18` becomes a string because it contains hyphens, but `20250218` would become a number). Quoted strings have their quotes stripped.

Categories with colors are defined in `CATEGORY_COLORS` in `src/data/loader.js`: 技术, 生活, 思考, 效率, 随笔.

## Key Conventions

- Functional components + hooks only (no class components, no Redux/Zustand)
- Barrel exports via `index.js` in each component directory
- `ES modules` throughout (`"type": "module"` in package.json)
- Section boundaries marked with `// ── Section name ──` comments
- Vite config uses `base: './'` for relative paths (subdirectory deployment compatible)
- Fonts: Noto Sans SC (sans) + Noto Serif SC (serif), loaded from Google Fonts in `index.html`
- Code highlighting: highlight.js with `atom-one-dark` theme (CDN in index.html), light mode overrides via CSS in global.css
- All colors in components must use CSS variables (`var(--text-primary)`, `var(--bg-card)`, etc.) for theme compatibility

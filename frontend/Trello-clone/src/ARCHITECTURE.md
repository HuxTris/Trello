# Frontend Architecture

This project now follows a feature-first structure:

## Folder Layout

```
src/
  app/                  # App bootstrap, providers, app-wide setup
  features/             # Business features (board, auth, ...)
  shared/               # Reusable UI and utilities shared across features
```

## Conventions

- Use alias `@/` for imports from `src/` root.
  - Example: `@/shared/components/AppBar`
  - Configured in `vite.config.js` and `jsconfig.json`

- `app/`
  - `main.jsx`: app bootstrap
  - `App.jsx`: top-level app component
  - `theme.js`: UI theme
  - `store.js`: app-level store setup

- `features/<feature>/`
  - `api/`: feature API adapter layer (mock now, HTTP later)
  - `components/`: feature-specific UI
  - `pages/`: feature pages
  - `constants/`: feature constants

- `shared/`
  - `components/`: reusable components across features
  - `assets/`: shared assets
  - `utils/`: shared utility functions

## Backend Integration Path

When backend is ready:

1. Keep feature API interfaces stable (e.g. `features/board/api/boardApi.js`).
2. Replace internal mock calls with HTTP client calls.
3. Keep UI components unchanged as much as possible.

This keeps migration low-risk and incremental.

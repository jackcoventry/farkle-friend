# Farkle Friend

A client-side Farkle scorekeeper and dice game built with Next.js.

## Architecture

The app is built as a static-first Next.js project. Runtime gameplay is handled
on the client, while the production build is exported as static assets.

- `src/app/` contains the Next.js routes, app shell, and root providers.
- `src/domain/game/` contains the game rules, reducer, selectors, scoring
  helpers, audio helpers, and game-specific hooks. UI components should call
  into this layer rather than duplicating rule logic.
- `src/components/` contains reusable UI and feature components. Components
  that own state or browser APIs are marked with `'use client'`; presentational
  components should stay framework-light where possible.
- `src/hooks/` contains reusable browser-facing hooks such as unload warnings
  and keyboard shortcuts.
- `src/i18n/` contains supported locales, typed message keys, and message
  validation tests.
- `src/styles/` contains generated design token output and global styles.

The main gameplay route flows through `GameScreen`, which delegates state
derivation, lobby tabs, game actions, and active layout state to focused hooks.
The domain reducer remains the source of truth for persistent game state.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful local checks:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

`npm run verify` runs the standard pre-launch gate:

```bash
npm run verify
```

## Static Build

The project is configured for static export. Production builds are written to
`out/` and can be hosted by any static file host.

```bash
npm run build
npm run start
```

`npm run start` serves the exported `out/` directory locally.

## Vercel

The repo includes `vercel.json` for static-first Vercel deployment:

- Framework preset: Next.js
- Build command: `npm run build`
- Output directory: leave blank / do not override

The app uses Next.js static export, so `next build` still writes the generated
static files to `out/`. Vercel's Next.js builder handles that automatically when
`output: 'export'` is set in `next.config.ts`; setting the Vercel output
directory to `out` will make the builder look for Next internals in the wrong
folder.

## Testing

```bash
npm test
npm run test:e2e
npm run test:e2e:static
```

- Unit tests cover game rules, reducers, forms, i18n, and core UI behaviour.
- E2E tests cover browser-level gameplay flows.
- Static E2E tests build and preview the exported app before running Playwright.
- i18n tests assert every locale has the same message keys and placeholder
  variables as English.

## Internationalisation

Use `useI18n().t()` with keys from `MessageKey`. Message strings support simple
placeholder interpolation such as `{score}`. When adding or changing translated
messages, keep placeholder names consistent across locales; the i18n tests will
fail if one locale adds or removes a placeholder for the same key.

## Styling

The project uses Tailwind utilities alongside semantic design tokens generated
from the token source files. Prefer semantic token utilities and existing
component classes for shared UI behaviour. Keep one-off layout utilities close
to the component, and move repeated component styling into the component CSS or
a shared primitive.

## Accessibility Expectations

- Interactive controls need accessible names and visible focus states.
- Dialogs should use the shared `Modal` primitive for focus management,
  background inerting, and scroll locking.
- Keyboard shortcuts must not run while focus is in forms, buttons, links, or
  modal dialogs.
- Respect reduced motion and user preference settings for animation-heavy UI.

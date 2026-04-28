# Farkle Friend

A client-side Farkle scorekeeper and dice game built with Next.js.

## Development

```bash
npm run dev
```

Open `http://localhost:3000`.

## Static Build

The project is configured for static export. Production builds are written to
`out/` and can be hosted by any static file host.

```bash
npm run build
npm run preview
```

`npm run preview` serves the exported `out/` directory locally. `npm run start`
is kept as the same static preview command for hosts that expect it.

## Checks

```bash
npm run lint
npm test
npm run test:e2e
```

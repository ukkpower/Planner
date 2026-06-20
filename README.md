# Cosy Level Planner

A browser-based planning tool for designing levels for a cosy 3D spot-the-difference game.

The app is a local-first React SPA with three mood boards per level:

- Research
- Planning
- Final

Each board supports local image upload, freeform drag and resize, deletion, layer ordering, and IndexedDB persistence through Dexie.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Dexie / IndexedDB
- Zustand
- react-rnd
- lucide-react

## Run Locally

```bash
npm install
npm run dev
```

Then open the local URL printed by Vite.

## Verify

```bash
npm run lint
npm run build
```

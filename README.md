# Cosy Level Planner

A browser-based planning tool for designing levels for a cosy 3D spot-the-difference game.

The app is a local-first React SPA with three mood boards per level:

- Research
- Planning
- Final

Each board supports image upload, editable post-it notes, freeform drag and resize, deletion, layer ordering, and real-time shared persistence through Convex.

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Convex database and file storage
- Zustand
- react-rnd
- lucide-react

## Run Locally

```bash
npm install
npx convex dev
npm run dev
```

Then open the local URL printed by Vite.

## Verify

```bash
npm run lint
npm run build
```

## Deploy to Render

The app is configured as a Render static site in `render.yaml`. Add a production Convex deploy key as the `CONVEX_DEPLOY_KEY` secret in Render before the first deployment. The build publishes the Convex functions and compiles the Vite site against the corresponding production deployment URL.

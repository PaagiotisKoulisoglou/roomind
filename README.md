# RoomMind

RoomMind is an AI‑first design environment that helps you visualize, render, and organize architectural projects at the speed of thought. Upload a floor plan, create a project, and explore designs — powered by a Puter worker backend and a modern React Router full‑stack app.

## Demo (What it does)
- Upload a floor plan image (PNG/JPG)
- Automatically create a project and jump to a visualizer route: `/visualizer/:id`
- View your recent projects list on the home page
- Sign in/out via Puter auth to enable cloud features

## Tech Stack
- React 19 + React Router v7 (SSR, data APIs)
- TypeScript
- Tailwind CSS (via @tailwindcss/vite)
- Vite 7 (dev/build)
- Puter.js (@heyputer/puter.js) for auth, hosting, and workers
- Docker (optional deployment)

## Quick Start

1) Prerequisites
- Node.js 18+ (LTS recommended)
- npm 10+
- A Puter account and a deployed Puter Worker that exposes your project APIs

2) Clone and install
```bash
npm install
```

3) Configure environment
Create a file named `.env.local` in the project root and set your Puter Worker base URL (origin). Example:
```
VITE_PUTER_WORKER_URL=https://your-puter-worker.example.com
```
Notes:
- Provide only the origin/base URL. The app will safely compose API paths (e.g., /api/projects/list).
- If this variable is missing, cloud features like project history will be skipped locally.

4) Run the app (development)
```bash
npm run dev
```
Then open: http://localhost:5173

## Available Scripts
- npm run dev – Start the dev server with HMR
- npm run build – Build server and client bundles (SSR)
- npm run start – Serve the built app (after build)
- npm run typecheck – Generate router types and run TypeScript

## Project Structure
```
app/
  routes.ts                # Route config (home, visualizer/:id)
  routes/
    home.tsx               # Homepage with upload + projects grid
  root.tsx                 # App layout, error boundary, auth state
components/
  Navbar.tsx               # Top navigation with Puter auth controls
  Upload.tsx               # Upload component (used on home)
lib/
  puter.action.ts          # Auth, projects CRUD via Puter workers
  puter.hosting.ts         # Image hosting helpers
  puter.worker.js          # Worker client helpers
  utils.ts, constants.ts   # Utility helpers/constants
public/
  ...                      # Static assets
vite.config.ts             # Vite configuration
react-router.config.ts     # React Router dev/build config
```

## Environment Variables
- VITE_PUTER_WORKER_URL: Base URL of your Puter Worker service. Example: https://my-worker.puter.work

The app reads this value at runtime and will:
- Save projects via POST /api/projects/save
- List projects via GET /api/projects/list
- Fetch a project via GET /api/projects/get?id=...

## How RoomMind uses Puter
- Auth: Sign in/out and get current user via `puter.auth.*`
- Workers: Make serverless calls to your worker endpoints to save/list/get projects
- Hosting: Upload and resolve image URLs for persisted projects

If `VITE_PUTER_WORKER_URL` is not provided, RoomMind will still let you upload and navigate to the visualizer, but remote persistence/history is skipped.

## Build and Run (production)
```bash
npm run build
npm run start
```
By default, the server output is in `build/server` and client assets in `build/client`.

## Docker
Build and run with Docker:
```bash
docker build -t roommind .
docker run -p 3000:3000 roommind
```
Adjust the container port mapping if your environment requires a different port.

## Troubleshooting
- Missing history/projects: Ensure `VITE_PUTER_WORKER_URL` is set correctly to your worker origin.
- Auth/sign-in issues: Verify your Puter session and permissions. Try signing out/in again.
- CORS or network errors: Confirm your worker allows requests from your dev origin (http://localhost:5173) and production host.
- Type errors: Run `npm run typecheck` and fix reported issues.

## Contributing
Issues and PRs are welcome. Please open an issue describing the change or problem first when possible.

## License
Add a LICENSE file for your preferred license (e.g., MIT). If none is provided, all rights reserved by default.


# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Single React + Vite frontend application located in `frontend/`. No backend services. Uses npm as the package manager (`package-lock.json`).

### Running the app

| Command | Working directory | Purpose |
|---------|-------------------|---------|
| `npm run dev` | `frontend/` | Start Vite dev server (default port 5173) |
| `npm run build` | `frontend/` | Production build to `frontend/dist/` |
| `npm run lint` | `frontend/` | ESLint checks |
| `npm run preview` | `frontend/` | Preview production build |

### Known issues

The codebase has pre-existing prop mismatch bugs: several components (`MetricGrid`, `MetricCard`, `RevenueSources`, `ActivityList`, `Panel`) expect different prop names than what `App.jsx` passes. This causes runtime errors (blank page) but does **not** indicate an environment problem — lint and build both succeed.

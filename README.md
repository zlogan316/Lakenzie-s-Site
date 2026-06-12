# Lakenzie's Site

A gift website for Lakenzie — a small personal site with daily-style word games
(Wordle, Connections) built just for her.

- **Frontend:** React + Vite + MUI (TypeScript), in `frontend\`
- **Backend:** FastAPI + SQLAlchemy + SQL Server (Python), in `backend\`

## Quickstart

The easy way (opens both servers in split panes):

```powershell
.\dev.ps1
```

Or run each side by hand:

```powershell
# Backend (http://localhost:8000)
cd backend
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --port 8000

# Frontend (Vite dev server, in a second terminal)
cd frontend
npm run dev
```

> **Database is optional for now.** The site runs without SQL Server until the
> games feature is wired up. When you're ready, copy `.env.example` to `.env`
> at the repo root and set `DATABASE_URL` (examples are in the file).

## Where to read more

- [`docs/STACK.md`](docs/STACK.md) — plain-English tour of every language and
  package in the stack, and why each was chosen.
- [`docs/games-design.md`](docs/games-design.md) — design for the games feature
  (schema, never-see-the-same-puzzle-twice logic, API sketch, open questions).
- [`deploy/README.md`](deploy/README.md) — Phase 2 production deployment plan
  (Lightsail + Docker + Caddy). Everything in `deploy\` is **inert** and not
  used for local development.

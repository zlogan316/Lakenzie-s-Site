# Lakenzie's Site

A gift website for Lakenzie — a small personal site with daily-style word games
(Wordle, Connections) built just for her.

- **Frontend:** React + Vite + MUI (TypeScript), in `frontend\`
- **Backend:** Node + Express, in `backend\`

## Quickstart

One command starts everything (run from the repo root):

```sh
npm install   # first time only — installs backend + frontend deps
npm start
```

`npm start` launches the backend and the Vite web server together and opens the
site in your browser.

- Frontend (the website): http://localhost:5173
- Backend (API): http://localhost:3001

Run each side on its own if you want:

```sh
npm run start:backend    # http://localhost:3001
npm run start:frontend   # http://localhost:5173
```

## Where to read more

- [`docs/games-design.md`](docs/games-design.md) — early design notes for the
  games feature (rules, puzzle ideas, open questions).

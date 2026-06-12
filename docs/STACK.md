# The Stack, in Plain English

A tour of every language and package in this project, written for someone who
knows C#/.NET well but the web ecosystem less so. One short paragraph each:
what it does, and why it was picked over the alternatives.

## Languages

### TypeScript
JavaScript with a static type system bolted on — the closest thing the browser
world has to C#. You write `.ts`/`.tsx` files, a compiler checks the types, and
plain JavaScript comes out the other side. Picked over raw JavaScript because
you get the same "the compiler catches it before runtime" safety you're used to
from C#, plus excellent autocomplete. Every frontend file in this repo is
TypeScript.

### Python
The backend language. Think of it as a dynamically-typed, indentation-based
cousin of C# — fewer ceremonies, no compile step. Picked over C#/ASP.NET here
partly for variety/learning and partly because FastAPI (below) makes tiny APIs
extremely quick to write. Modern Python with type hints feels surprisingly
close to C# in practice.

## Frontend packages

### react
The UI library. You build the page out of small functions called *components*
that return HTML-ish markup (JSX), and React re-renders them automatically when
data changes — conceptually like XAML data binding, but in code. Chosen over
Vue/Svelte/Angular because it has the largest ecosystem and the most
documentation, which matters most when you're learning.

### react-dom
React's renderer for web browsers — the half of React that actually touches the
real page (DOM). React itself is renderer-agnostic (there's also React Native
for phones); `react-dom` is the piece that says "render into this `<div>`".
Not a choice so much as a required companion to `react`.

### vite
The build tool and dev server (think MSBuild + `dotnet watch` in one). It
compiles TypeScript, bundles modules, and serves the app locally with
near-instant hot reload. Chosen over webpack/Create React App because it's
dramatically faster and is the current community default for new React apps.

### @mui/material
Material UI — a big library of ready-made, polished React components (buttons,
dialogs, cards, nav bars) with a built-in theming system. Like getting a full
WPF control library for free. Chosen over Tailwind/Bootstrap/hand-rolled CSS
because we want good-looking components without writing much CSS ourselves.

### @emotion/react and @emotion/styled
The CSS-in-JS engine MUI uses under the hood to generate and inject styles at
runtime. You rarely touch these directly — they're peer dependencies MUI
requires you to install. No real alternative once you've chosen MUI.

### @mui/icons-material
Google's Material icon set wrapped as React components (`<FavoriteIcon />`
etc.). Chosen because it's the matching icon set for MUI — consistent style,
zero extra setup.

### react-router (v7)
Client-side routing: maps URLs like `/games/wordle` to components without a
full page reload — the frontend equivalent of ASP.NET routing. v7 is the
current major version (it absorbed the old `react-router-dom` package). Chosen
because it's the de-facto standard router for React.

### @tanstack/react-query
Manages *server state*: fetching from the API, caching the result, refetching
when stale, and exposing loading/error flags as simple hooks. Replaces a pile
of hand-written `fetch` + `useState` + `useEffect` boilerplate. Chosen over
rolling our own (error-prone) or Redux (heavyweight, solves a different
problem).

### @fontsource-variable/quicksand and @fontsource-variable/fraunces
The site's two fonts (Quicksand for UI text, Fraunces for display headings),
shipped as npm packages so they're bundled with the app instead of loaded from
Google Fonts at runtime. Chosen for privacy (no Google request), reliability
(works offline), and one less external dependency. "Variable" means one file
covers all weights.

## Backend packages

### fastapi
The web framework — Python's answer to ASP.NET Core Minimal APIs. You declare
endpoints as typed functions and it handles routing, validation, JSON
serialization, and auto-generates interactive API docs at `/docs`. Chosen over
Flask (older, less built-in validation) and Django (way more framework than a
small API needs).

### uvicorn
The ASGI server that actually runs the FastAPI app — the equivalent of
Kestrel. FastAPI defines the app; uvicorn listens on a port and feeds it
requests. The standard pairing; `--reload` gives you `dotnet watch`-style
restarts in dev.

### sqlalchemy
The ORM — Python's Entity Framework. Define tables as Python classes, query
with a fluent API, and it emits the SQL. Chosen over raw SQL (tedious, unsafe)
and smaller ORMs because SQLAlchemy is the industry standard with first-class
SQL Server support.

### pyodbc
The low-level ODBC database driver SQLAlchemy uses to talk to SQL Server —
the equivalent of `Microsoft.Data.SqlClient`. Chosen because it's Microsoft's
recommended Python driver for SQL Server and the one SQLAlchemy's `mssql+pyodbc`
dialect is built on.

### alembic
Database migrations for SQLAlchemy — Entity Framework Migrations, basically.
You change a model, generate a migration script, and `alembic upgrade head`
brings any database up to date. Chosen because it's made by the SQLAlchemy
author and is the only serious option in that ecosystem.

### pydantic-settings
Typed configuration loaded from environment variables and `.env` files — like
`IOptions<T>` + `appsettings.json` binding. Define a settings class with typed
fields; it reads, validates, and fails loudly if something's malformed. Chosen
over `os.environ` lookups scattered through the code.

### pytest
The test framework — Python's xUnit. Tests are plain functions named `test_*`
using bare `assert`, with a powerful fixture system for setup/teardown. Chosen
over the stdlib `unittest` because it's far less boilerplate and is what the
whole ecosystem (including FastAPI's docs) uses.

### httpx
An HTTP client (like `HttpClient`) used here mainly for testing: FastAPI's
test utilities use it to call the app in-process, so API tests run without
starting a real server. Chosen over `requests` because it supports async and
is what FastAPI's testing story is built around.

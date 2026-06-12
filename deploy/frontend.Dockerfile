# =============================================================================
# PRODUCTION ONLY — INERT. Not used in local dev (use .\dev.ps1 instead).
# Built by .github/workflows/deploy.yml once AWS is provisioned (Phase 2).
#
# Build context is the repo root:
#   docker build -f deploy/frontend.Dockerfile -t lakenzie-site-web .
# =============================================================================

# --- Stage 1: build the Vite app ---
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# --- Stage 2: serve static files (and proxy /api) with Caddy ---
FROM caddy:2-alpine
COPY deploy/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/dist /srv

EXPOSE 80 443

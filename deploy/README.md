# Deployment (Phase 2)

> **Everything in this folder is inert.** None of it is used for local
> development (`.\dev.ps1` handles that). These files become live when the
> AWS infrastructure is provisioned and the `DEPLOY_ENABLED` repo variable is
> flipped to `true`.

## The plan

**Host:** AWS Lightsail, 2 GB RAM / x86 instance running Ubuntu — roughly
**$12/month**, fixed price. 2 GB is the floor because SQL Server Express runs
in a container alongside the app (it's capped at 1200 MB via
`MSSQL_MEMORY_LIMIT_MB`).

**Domain:** buy the domain at any registrar, then point an **A record at the
Lightsail static IP** (attach a static IP to the instance first — it's free
while attached). No Route 53 needed.

**HTTPS:** automatic. Caddy (the `web` container) obtains and renews
Let's Encrypt certificates on its own as soon as the A record resolves to the
server. There is nothing to configure beyond putting the real domain in
`Caddyfile`.

## What's in this folder

| file                      | purpose                                                            |
|---------------------------|--------------------------------------------------------------------|
| `backend.Dockerfile`      | FastAPI image: python:3.12-slim + msodbcsql18; runs alembic migrations then uvicorn |
| `frontend.Dockerfile`     | multi-stage: node builds the Vite bundle → caddy:2-alpine serves it |
| `Caddyfile`               | static SPA with `/index.html` fallback; proxies `/api/*` → api:8000; auto-HTTPS |
| `docker-compose.prod.yml` | web + api + SQL Server Express 2022, named volume for DB data      |

## How a deploy works (GitHub Actions)

`.github/workflows/deploy.yml`, on every push to `main` (docs changes ignored):

1. Builds both Dockerfiles.
2. Pushes images to `ghcr.io/zlogan316/lakenzie-site-api` and
   `ghcr.io/zlogan316/lakenzie-site-web`.
3. SSHes into the Lightsail box and runs
   `docker compose pull && docker compose up -d` in `/opt/lakenzie`.

The whole job is gated on the repo **variable** `DEPLOY_ENABLED == 'true'`, so
the workflow is safe to merge today — it simply skips until AWS exists.

### One-time server setup (when provisioning)

1. Create the Lightsail instance (Ubuntu, 2 GB), attach a static IP, open
   ports 80/443 in the Lightsail firewall.
2. Install Docker + the compose plugin.
3. `mkdir /opt/lakenzie`; copy `docker-compose.prod.yml` there (as
   `docker-compose.yml` or use `-f`), plus a `.env` containing `DATABASE_URL`
   (pointing at the `mssql` service) and a strong `SA_PASSWORD`.
4. `docker login ghcr.io` on the box (or make the GHCR packages public).
5. Set repo **secrets** `LIGHTSAIL_HOST` and `LIGHTSAIL_SSH_KEY`, then set the
   repo **variable** `DEPLOY_ENABLED=true`.
6. Put the real domain (and contact email) in `Caddyfile`, point the A record
   at the static IP.

## Backups

**Turn on Lightsail daily snapshots** for the instance (a few dollars/month).
The database lives in the `mssql-data` named Docker volume on the instance
disk, so instance snapshots capture it. Don't skip this — it's the only copy
of Lakenzie's game history.

## Manual deploy fallback

If Actions is down or you just need to kick the server:

```bash
ssh ubuntu@<static-ip>
cd /opt/lakenzie
docker compose pull && docker compose up -d
```

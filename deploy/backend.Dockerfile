# =============================================================================
# PRODUCTION ONLY — INERT. Not used in local dev (use .\dev.ps1 instead).
# Built by .github/workflows/deploy.yml once AWS is provisioned (Phase 2).
#
# Build context is the repo root:
#   docker build -f deploy/backend.Dockerfile -t lakenzie-site-api .
# =============================================================================
FROM python:3.12-slim

# --- Microsoft ODBC Driver 18 for SQL Server (msodbcsql18) + unixODBC ---
# pyodbc needs a real ODBC driver at runtime; Debian doesn't ship Microsoft's,
# so add the official Microsoft apt repo and install it.
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl gnupg2 ca-certificates \
    && curl -fsSL https://packages.microsoft.com/keys/microsoft.asc \
         | gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg \
    && curl -fsSL https://packages.microsoft.com/config/debian/12/prod.list \
         -o /etc/apt/sources.list.d/mssql-release.list \
    && sed -i 's|deb |deb [signed-by=/usr/share/keyrings/microsoft-prod.gpg] |' \
         /etc/apt/sources.list.d/mssql-release.list \
    && apt-get update \
    && ACCEPT_EULA=Y apt-get install -y --no-install-recommends msodbcsql18 unixodbc \
    && apt-get purge -y curl gnupg2 \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (better layer caching).
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Then the application code (app/ package, alembic migrations, config).
COPY backend/ .

EXPOSE 8000

# Run migrations, then serve. sh -c so the && chain works as the entrypoint.
ENTRYPOINT ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]

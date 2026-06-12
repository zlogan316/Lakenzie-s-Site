"""Application settings.

The .env file lives at the REPO ROOT (one level above backend/), so we
resolve it explicitly rather than relying on the process working directory:
parents[0] = app/, parents[1] = backend/, parents[2] = repo root.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[2] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    # Empty by default so the app can boot without a database.
    # Example (MSSQL): mssql+pyodbc://user:pass@host/db?driver=ODBC+Driver+18+for+SQL+Server
    DATABASE_URL: str = ""


settings = Settings()

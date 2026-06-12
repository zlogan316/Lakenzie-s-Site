"""SQLAlchemy engine and session factory.

The engine is only created when DATABASE_URL is set, so the app can boot
(and the health endpoint can work) before a database is wired up.
"""

from collections.abc import Iterator

from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from app.config import settings

if settings.DATABASE_URL:
    engine = create_engine(settings.DATABASE_URL, pool_pre_ping=True)
    SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
else:
    engine = None
    SessionLocal = None


def get_session() -> Iterator[Session]:
    """FastAPI dependency yielding a database session."""
    if SessionLocal is None:
        raise HTTPException(status_code=503, detail="database not configured yet")
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

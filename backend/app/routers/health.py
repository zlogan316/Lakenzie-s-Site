from fastapi import APIRouter, HTTPException
from sqlalchemy import text

from app import db

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    return {"status": "ok"}


@router.get("/db-check")
def db_check() -> dict:
    if db.engine is None:
        raise HTTPException(status_code=503, detail="database not configured yet")
    try:
        with db.engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except Exception as exc:  # unreachable/misconfigured database
        raise HTTPException(status_code=503, detail="database not configured yet") from exc
    return {"database": "ok"}

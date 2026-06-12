from fastapi import FastAPI

from app.routers import health

app = FastAPI(title="Lakenzie's Site API")

app.include_router(health.router, prefix="/api")

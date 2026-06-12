from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_db_check_returns_503_without_database_url():
    response = client.get("/api/db-check")
    assert response.status_code == 503
    assert response.json() == {"detail": "database not configured yet"}

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_calculate_endpoint():
    """
    Carbon calculator returns totals.
    """

    response = client.post(
        "/calculate",
        json={
            "car_km": 10,
            "bus_km": 5,
            "electricity_kwh": 10,
            "diet_type": "vegetarian"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "total" in data
    assert data["total"] > 0
"""
Malina-Ikshan Backend Test Suite

These tests verify:
1. API availability
2. Root endpoint functionality
3. Registration validation
4. Login validation
5. Invalid route handling

Run:
    pytest -v
"""

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ==================================================
# Root Endpoint Tests
# ==================================================

def test_root_endpoint_returns_200():
    """
    Verify that API root endpoint is reachable.
    """

    response = client.get("/")

    assert response.status_code == 200
    assert isinstance(response.json(), dict)


def test_root_endpoint_contains_message():
    """
    Verify welcome message exists.
    """

    response = client.get("/")

    assert "message" in response.json()


# ==================================================
# Invalid Route Tests
# ==================================================

def test_invalid_route_returns_404():
    """
    Verify non-existing routes return 404.
    """

    response = client.get("/this-route-does-not-exist")

    assert response.status_code == 404


# ==================================================
# Registration Validation Tests
# ==================================================

def test_register_with_short_username_fails():
    """
    Username should fail validation if too short.
    """

    response = client.post(
        "/register",
        json={
            "username": "ab",
            "email": "test@test.com",
            "password": "Password123"
        }
    )

    assert response.status_code in [400, 422]


def test_register_with_invalid_email_fails():
    """
    Invalid email should not be accepted.
    """

    response = client.post(
        "/register",
        json={
            "username": "testuser",
            "email": "invalid-email",
            "password": "Password123"
        }
    )

    assert response.status_code in [400, 422]


def test_register_with_short_password_fails():
    """
    Password should meet minimum requirements.
    """

    response = client.post(
        "/register",
        json={
            "username": "testuser",
            "email": "test@test.com",
            "password": "123"
        }
    )

    assert response.status_code in [400, 422]


# ==================================================
# Login Validation Tests
# ==================================================

def test_login_with_invalid_credentials():
    """
    Verify that authentication fails
    when invalid credentials are supplied.

    Expected:
        - User should not be authenticated
        - API should return an error status code
    """

    response = client.post(
        "/login",
        json={
            "email": "fake@test.com",
            "password": "WrongPassword"
        }
    )

    assert response.status_code in [400, 401, 404]


# ==================================================
# API Stability Tests
# ==================================================

def test_multiple_requests_do_not_crash_server():
    """
    Basic stability check.
    """

    for _ in range(5):
        response = client.get("/")

        assert response.status_code == 200

def test_database_tables_exist():
    """
    Verify that critical database tables
    are created successfully before tests run.

    This helps catch migration/configuration issues.
    """

    from sqlalchemy import inspect
    from app.database.session import engine

    inspector = inspect(engine)

    tables = inspector.get_table_names()

    assert "users" in tables

def test_docs_endpoint():
    response = client.get("/docs")
    assert response.status_code == 200

def test_openapi_schema():
    response = client.get("/openapi.json")
    assert response.status_code == 200

def test_root_response_type():
    response = client.get("/")
    assert isinstance(response.json(), dict)
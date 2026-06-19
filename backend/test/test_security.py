from app.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
)


def test_password_hashing():
    """
    Password hashing should work.
    """

    password = "StrongPassword123"

    hashed = hash_password(password)

    assert hashed != password
    assert verify_password(password, hashed)


def test_password_verification_fails():
    """
    Wrong password should fail.
    """

    hashed = hash_password("correct")

    assert verify_password("wrong", hashed) is False


def test_create_access_token():
    """
    JWT token creation.
    """

    token = create_access_token(
        {"sub": "test@example.com"}
    )

    assert isinstance(token, str)
    assert len(token) > 20
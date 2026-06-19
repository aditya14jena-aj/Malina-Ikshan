"""
Security utility functions.

Handles:
- Password hashing
- Password verification
- JWT access token generation
"""

from datetime import datetime, timedelta, timezone
import bcrypt
import jwt

from app.core import config

# JWT configuration loaded from environment variables
SECRET_KEY = config.SECRET_KEY
ALGORITHM = config.JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = config.ACCESS_TOKEN_EXPIRE_MINUTES


def hash_password(plain_password: str) -> str:
    """
    Convert a plain-text password into a secure bcrypt hash.

    Args:
        plain_password: User password before encryption

    Returns:
        Hashed password string
    """
    pwd_bytes = plain_password.encode("utf-8")

    # Generate unique salt for every password
    salt = bcrypt.gensalt()

    hashed_bytes = bcrypt.hashpw(pwd_bytes, salt)

    return hashed_bytes.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a user password against a stored bcrypt hash.

    Args:
        plain_password: Password entered by user
        hashed_password: Password stored in database

    Returns:
        True if password matches, otherwise False
    """
    pwd_bytes = plain_password.encode("utf-8")
    hashed_bytes = hashed_password.encode("utf-8")

    return bcrypt.checkpw(pwd_bytes, hashed_bytes)


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """
    Create a JWT access token.

    Args:
        data: Payload data to encode
        expires_delta: Optional custom expiry duration

    Returns:
        Signed JWT token
    """

    # Copy payload to avoid mutating original data
    to_encode = data.copy()

    # Set token expiry time
    expire = (
        datetime.now(timezone.utc) + expires_delta
        if expires_delta
        else datetime.now(timezone.utc)
        + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    to_encode.update({"exp": expire})

    # Generate JWT token
    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

    return encoded_jwt
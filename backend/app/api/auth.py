"""
Authentication API.

Endpoints:
- User Registration
- User Login
"""

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.user import UserCreate, UserResponse
from app.schemas.auth import UserLogin, Token

from app.services.auth import (
    get_user_by_email,
    get_user_by_username,
    create_user,
)

from app.utils.security import (
    verify_password,
    create_access_token,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):
    """
    Register a new user account.

    Validation:
    - Email must be unique
    - Username must be unique
    """

    # Prevent duplicate emails
    if get_user_by_email(db, email=user.email):
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    # Prevent duplicate usernames
    if get_user_by_username(db, username=user.username):
        raise HTTPException(
            status_code=400,
            detail="Username already registered",
        )

    return create_user(db=db, user=user)


@router.post("/login", response_model=Token)
def login(
    user_credentials: UserLogin,
    db: Session = Depends(get_db),
):
    """
    Authenticate user and issue JWT token.
    """

    # Fetch user by email
    user = get_user_by_email(
        db,
        email=user_credentials.email,
    )

    # Invalid email
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Invalid password
    if not verify_password(
        user_credentials.password,
        user.password_hash,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Generate JWT access token
    access_token = create_access_token(
        data={"sub": user.email}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
    }
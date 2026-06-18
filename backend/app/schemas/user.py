from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """Schema for user registration input."""
    username: str = Field(..., min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9_-]+$")
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class UserResponse(BaseModel):
    """Schema for user data returned by the API. Never exposes the password hash."""
    id: int
    username: str
    email: str
    score: int
    streak: int
    created_at: datetime

    model_config = {"from_attributes": True}


class UserInDB(UserResponse):
    """Internal schema that includes the password hash. Not for API responses."""
    password_hash: str



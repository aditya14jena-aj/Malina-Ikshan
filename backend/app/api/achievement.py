from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.achievement import UserBadgeResponse
from app.services.achievement import get_user_badges

router = APIRouter()

@router.get("/", response_model=List[UserBadgeResponse])
def read_achievements(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_user_badges(db=db, user_id=current_user.id)

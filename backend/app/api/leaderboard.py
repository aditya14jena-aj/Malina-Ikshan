from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.database.session import get_db
from app.models.user import User
from pydantic import BaseModel
from typing import List

router = APIRouter()

class LeaderboardEntry(BaseModel):
    username: str
    total_points: int

@router.get("", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    results = db.query(
        User.username,
        User.score.label('total_points')
    ).order_by(desc(User.score)).limit(10).all()

    return [{"username": r.username, "total_points": int(r.total_points)} for r in results]


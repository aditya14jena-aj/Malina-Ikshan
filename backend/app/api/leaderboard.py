from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from app.database.session import get_db
from app.models.user import User
from app.models.emission import EmissionLog
from pydantic import BaseModel
from typing import List

router = APIRouter()

class LeaderboardEntry(BaseModel):
    username: str
    avg_score: float

@router.get("", response_model=List[LeaderboardEntry])
def get_leaderboard(db: Session = Depends(get_db)):
    results = db.query(
        User.username,
        User.score.label('avg_score')
    ).order_by(desc(User.score)).limit(10).all()
    
    return [{"username": r.username, "avg_score": float(r.avg_score)} for r in results]

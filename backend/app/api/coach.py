from fastapi import APIRouter
from app.schemas.coach import CoachRequest, CoachResponse
from app.services.coach import CoachService

router = APIRouter()

@router.post("/coach", response_model=CoachResponse)
def get_sustainability_coaching(data: CoachRequest):
    return CoachService.get_coach_advice(data)

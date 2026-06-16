from pydantic import BaseModel
from typing import List

class CoachRequest(BaseModel):
    transport: float
    electricity: float
    diet: float
    total: float

class CoachResponse(BaseModel):
    score: int
    primary_source: str
    recommendations: List[str]
    highlighted_action: str

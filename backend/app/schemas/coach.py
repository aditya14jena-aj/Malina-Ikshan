from pydantic import BaseModel

class CoachRequest(BaseModel):
    transport: float
    electricity: float
    diet: float
    total: float

class CoachResponse(BaseModel):
    score: int
    score_category: str
    score_explanation: str
    primary_source: str
    transport_insight: str
    electricity_insight: str
    diet_insight: str
    highlighted_action: str
    potential_daily_savings: float = 0.0
    potential_yearly_savings: float = 0.0
    potential_action: str = ""

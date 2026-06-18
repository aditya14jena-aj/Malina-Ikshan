from pydantic import BaseModel
from datetime import datetime

class EmissionLogCreate(BaseModel):
    transport: float
    electricity: float
    diet: float
    total: float
    eco_score: int

class EmissionLogResponse(EmissionLogCreate):
    id: int
    user_id: int
    date: datetime

    model_config = {"from_attributes": True}

from typing import List, Any

class EmissionLogWithBadgesResponse(BaseModel):
    log: EmissionLogResponse
    new_badges: List[Any] = []
    updatedScore: int = 0
    updatedStreak: int = 0

class DailyEmissionRequest(BaseModel):
    car_km: float
    bus_km: float
    electricity_kwh: float
    diet_type: str



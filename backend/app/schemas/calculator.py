from pydantic import BaseModel
from typing import Literal

class CalculationRequest(BaseModel):
    car_km: float
    bus_km: float
    electricity_kwh: float
    diet_type: Literal["vegetarian", "non-vegetarian"]

class CalculationResponse(BaseModel):
    total: float
    transport: float
    electricity: float
    diet: float

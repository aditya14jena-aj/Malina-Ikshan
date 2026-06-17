from fastapi import APIRouter
from app.schemas.calculator import CalculationRequest, CalculationResponse

router = APIRouter()

@router.post("/calculate", response_model=CalculationResponse)
def calculate_carbon_footprint(data: CalculationRequest):
    car_emissions = data.car_km * 0.2
    bus_emissions = data.bus_km * 0.05
    transport = car_emissions + bus_emissions

    electricity = data.electricity_kwh * 0.4

    diet = 1.5 if data.diet_type == "vegetarian" else 3.0

    total = transport + electricity + diet

    return CalculationResponse(
        total=round(total, 2),
        transport=round(transport, 2),
        electricity=round(electricity, 2),
        diet=round(diet, 2)
    )

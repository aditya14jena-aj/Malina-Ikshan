"""
Carbon Footprint Calculator API.

Calculates estimated carbon emissions based on:
- Transportation
- Electricity consumption
- Diet type
"""

from fastapi import APIRouter

from app.schemas.calculator import (
    CalculationRequest,
    CalculationResponse,
)

router = APIRouter()


@router.post("/calculate", response_model=CalculationResponse)
def calculate_carbon_footprint(data: CalculationRequest):
    """
    Calculate user's estimated carbon footprint.

    Emission factors:
    - Car: 0.2 kg CO₂ / km
    - Bus: 0.05 kg CO₂ / km
    - Electricity: 0.4 kg CO₂ / kWh
    - Vegetarian Diet: 1.5 kg CO₂/day
    - Non-Vegetarian Diet: 3.0 kg CO₂/day
    """

    # Transportation emissions
    car_emissions = data.car_km * 0.2
    bus_emissions = data.bus_km * 0.05
    transport = car_emissions + bus_emissions

    # Electricity emissions
    electricity = data.electricity_kwh * 0.4

    # Diet emissions
    diet = 1.5 if data.diet_type == "vegetarian" else 3.0

    # Total footprint
    total = transport + electricity + diet

    return CalculationResponse(
        total=round(total, 2),
        transport=round(transport, 2),
        electricity=round(electricity, 2),
        diet=round(diet, 2),
    )
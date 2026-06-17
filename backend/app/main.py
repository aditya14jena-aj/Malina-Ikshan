from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.calculator import router as calculator_router
from app.api.coach import router as coach_router
from app.api.auth import router as auth_router
from app.api.emission import router as emission_router
from app.api.achievement import router as achievement_router
from app.api.leaderboard import router as leaderboard_router

app = FastAPI(title="Malina-Ikshan API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, tags=["Auth"])
app.include_router(emission_router, prefix="/logs", tags=["Logs"])
app.include_router(achievement_router, prefix="/achievements", tags=["Achievements"])
app.include_router(leaderboard_router, prefix="/leaderboard", tags=["Leaderboard"])
app.include_router(calculator_router, tags=["Calculator"])
app.include_router(coach_router, tags=["Coach"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Malina-Ikshan API"}

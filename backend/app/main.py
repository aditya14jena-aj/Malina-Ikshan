from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.calculator import router as calculator_router

app = FastAPI(title="Malina-Ikshan API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calculator_router, tags=["Calculator"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Malina-Ikshan API"}

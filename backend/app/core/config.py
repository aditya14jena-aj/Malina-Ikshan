import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "production").lower()

# JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database settings
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./malina.db")

# CORS Origins
CORS_ORIGINS_RAW = os.getenv("CORS_ORIGINS", "http://localhost:5173,https://malina-ikshan.vercel.app")
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]

# Startup Validation
if ENV in ["staging", "production"]:
    if SECRET_KEY in ["supersecretkey", "your-secret-key-here", ""]:
        raise ValueError(f"SECRET_KEY cannot be default or empty in {ENV} mode!")
    if "*" in CORS_ORIGINS:
        CORS_ORIGINS = ["http://localhost:5173", "https://malina-ikshan.vercel.app"]

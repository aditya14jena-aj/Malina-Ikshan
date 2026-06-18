import os
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("ENV", "production").lower()

# JWT Settings
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Database settings
_DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://malina_isika_user:A4K3Jafk34q1fDqSjbEp0QnXOZLA59Mp@dpg-d8pnsg77f7vs73d5sftg-a/malina_isika")
if _DATABASE_URL and _DATABASE_URL.startswith("postgres://"):
    _DATABASE_URL = _DATABASE_URL.replace("postgres://", "postgresql://", 1)
DATABASE_URL = _DATABASE_URL

# CORS Origins — default explicitly includes both local dev and the Vercel production URL.
# On Render, set the CORS_ORIGINS environment variable to override this if needed.
CORS_ORIGINS_RAW = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:5173,http://localhost:5174,https://malina-ikshan.vercel.app"
)
CORS_ORIGINS = [origin.strip() for origin in CORS_ORIGINS_RAW.split(",") if origin.strip()]

# Always ensure the Vercel production origin is present, regardless of env var value
_PRODUCTION_ORIGIN = "https://malina-ikshan.vercel.app"
if _PRODUCTION_ORIGIN not in CORS_ORIGINS:
    CORS_ORIGINS.append(_PRODUCTION_ORIGIN)

# Startup Validation
if ENV in ["staging", "production"]:
    if SECRET_KEY in ["supersecretkey", "your-secret-key-here", ""]:
        raise ValueError(f"SECRET_KEY cannot be default or empty in {ENV} mode!")
    if "*" in CORS_ORIGINS:
        CORS_ORIGINS = ["http://localhost:5173", "http://localhost:5174", "https://malina-ikshan.vercel.app"]

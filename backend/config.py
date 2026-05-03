import os
from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    # App
    APP_NAME: str = "NAMMA VOTE API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:4173"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:password@localhost:5432/nammavote"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"

    # Gemini
    GEMINI_API_KEY: str = ""

    # Google Maps
    GOOGLE_MAPS_API_KEY: str = ""

    # Firebase
    FIREBASE_SERVICE_ACCOUNT_JSON: str = ""

    # JWT
    JWT_SECRET: str = "changeme-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440

    # Admin
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD_HASH: str = "$2b$12$placeholder"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()

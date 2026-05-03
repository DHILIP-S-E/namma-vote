from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from config import settings

router = APIRouter(prefix="/api/admin", tags=["admin"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def admin_login(req: LoginRequest):
    if req.username != settings.ADMIN_USERNAME:
        raise HTTPException(401, "Invalid credentials")
    if not pwd_context.verify(req.password, settings.ADMIN_PASSWORD_HASH):
        raise HTTPException(401, "Invalid credentials")
    token = jwt.encode(
        {
            "sub": req.username,
            "role": "admin",
            "exp": datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES),
        },
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )
    return {"access_token": token, "token_type": "bearer", "expires_in": settings.JWT_EXPIRE_MINUTES * 60}


@router.get("/stats")
async def stats():
    """Public stats for admin dashboard."""
    return {
        "app_name": "NAMMA VOTE",
        "version": "1.0.0",
        "status": "operational",
        "timestamp": datetime.utcnow().isoformat(),
    }

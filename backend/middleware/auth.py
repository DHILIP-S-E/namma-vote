from fastapi import HTTPException, Header, Depends
from typing import Optional
from jose import jwt, JWTError
from config import settings


async def require_admin(authorization: Optional[str] = Header(None)):
    """JWT auth dependency for admin routes."""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "Admin authentication required")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(403, "Insufficient permissions")
        return payload
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")

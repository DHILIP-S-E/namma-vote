from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.gemini_service import check_rumour

router = APIRouter(prefix="/api/rumour", tags=["rumour"])


class RumourCheckRequest(BaseModel):
    claim: str
    language: str = "en"
    state: Optional[str] = None


@router.post("/check")
async def check_rumour_endpoint(req: RumourCheckRequest):
    if not req.claim or len(req.claim.strip()) < 10:
        raise HTTPException(400, "Claim must be at least 10 characters")
    if len(req.claim) > 2000:
        raise HTTPException(400, "Claim too long — max 2000 characters")

    result = await check_rumour(req.claim.strip(), req.language)
    result["claim"] = req.claim
    result["language"] = req.language
    return result

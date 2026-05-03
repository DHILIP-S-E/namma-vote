from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from services.eci_service import lookup_voter_by_epic, lookup_voter_by_name, hash_epic
from services.gemini_service import check_registration_health

router = APIRouter(prefix="/api/voter", tags=["voter"])


class EPICLookupRequest(BaseModel):
    epic: Optional[str] = None
    name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None


class FCMRegisterRequest(BaseModel):
    epic_hash: str
    fcm_token: str
    state: str
    constituency: str
    language: str = "en"


@router.post("/lookup")
async def voter_lookup(req: EPICLookupRequest):
    if not req.epic and not req.name:
        raise HTTPException(400, "Provide either epic or name+state")

    if req.epic:
        result = await lookup_voter_by_epic(req.epic)
    else:
        if not req.state:
            raise HTTPException(400, "State required for name search")
        result = await lookup_voter_by_name(req.name, req.state, req.district or "")

    # Run health check if voter found
    if result.get("found") and result.get("voter"):
        existing_issues = result["voter"].get("health_issues", [])
        if not existing_issues:
            ai_issues = await check_registration_health(result["voter"])
            result["voter"]["health_issues"] = ai_issues

    return result


@router.get("/epic-hash/{epic}")
async def get_epic_hash(epic: str):
    """Returns the SHA256 hash of an EPIC — for client-side storage without raw EPIC."""
    return {"epic_hash": hash_epic(epic)}

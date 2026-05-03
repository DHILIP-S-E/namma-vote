from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from services.eci_service import get_candidates, get_schedule, get_documents_for_state

router = APIRouter(prefix="/api", tags=["candidates"])


@router.get("/candidates/{state}/{constituency}/{year}")
async def candidates(
    state: str,
    constituency: str,
    year: int,
    name: Optional[str] = Query(default=None, description="Assembly constituency name for Wikipedia lookup"),
):
    data = await get_candidates(state, constituency, year, constituency_name=name or "")
    return {"candidates": data, "count": len(data)}


@router.get("/schedule/{state}/{constituency}")
async def schedule(state: str, constituency: str):
    data = await get_schedule(state, constituency)
    if not data:
        raise HTTPException(404, "Schedule not found")
    return data


@router.get("/documents/{state}")
async def documents(state: str):
    return get_documents_for_state(state.upper())

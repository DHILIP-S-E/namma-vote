from fastapi import APIRouter
from sqlalchemy import select, distinct
from database import AsyncSessionLocal
from models import ElectionHistory, ElectionSchedule

router = APIRouter(prefix="/api", tags=["history"])


@router.get("/history/{state}/{constituency}")
async def get_history(state: str, constituency: str):
    state_up = state.upper()
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ElectionHistory)
            .where(
                ElectionHistory.state_code == state_up,
                ElectionHistory.constituency_code == constituency,
            )
            .order_by(ElectionHistory.election_year.desc())
        )
        rows = result.scalars().all()

    if not rows:
        return {
            "state_code": state_up,
            "constituency_code": constituency,
            "constituency_name": constituency,
            "swing_note": "Historical data not yet available",
            "insight": "Check results.eci.gov.in for detailed past election data.",
            "past": [],
            "nota": [],
        }

    first = rows[0]
    past = [
        {
            "year": r.election_year,
            "winner": r.winner_name,
            "party": r.winner_party,
            "party_short": r.winner_party_short,
            "votes": r.winner_votes,
            "margin": r.margin,
            "turnout": float(r.turnout_pct) if r.turnout_pct else None,
        }
        for r in rows
    ]
    nota = [
        {"year": r.election_year, "votes": r.nota_votes, "pct": float(r.nota_pct)}
        for r in rows
        if r.nota_votes is not None
    ]

    return {
        "state_code": state_up,
        "constituency_code": constituency,
        "constituency_name": first.constituency_name,
        "swing_note": first.swing_note,
        "insight": first.insight,
        "past": past,
        "nota": nota,
    }


@router.get("/schedule/phases")
async def get_phases():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(ElectionSchedule)
            .order_by(ElectionSchedule.phase_number, ElectionSchedule.state_code)
        )
        rows = result.scalars().all()

    # Group by phase_number — collect unique states per phase
    phases: dict[int, dict] = {}
    for r in rows:
        if r.phase_number not in phases:
            phases[r.phase_number] = {
                "phase": r.phase_number,
                "election_date": r.election_date.isoformat() if r.election_date else None,
                "counting_date": r.counting_date.isoformat() if r.counting_date else None,
                "states": [],
                "state_codes": [],
            }
        if r.state_name and r.state_name not in phases[r.phase_number]["states"]:
            phases[r.phase_number]["states"].append(r.state_name)
        if r.state_code and r.state_code not in phases[r.phase_number]["state_codes"]:
            phases[r.phase_number]["state_codes"].append(r.state_code)

    return {
        "phases": list(phases.values()),
        "counting_date": max(
            (r.counting_date.isoformat() for r in rows if r.counting_date), default=None
        ),
    }

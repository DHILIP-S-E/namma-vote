from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models import FormSubmission

router = APIRouter(prefix="/api/forms", tags=["forms"])


class FormSubmitRequest(BaseModel):
    epic_hash: str
    form_type: str  # "6" | "7" | "8"
    acknowledgement_number: str


@router.post("/submit")
async def submit_form(req: FormSubmitRequest, db: AsyncSession = Depends(get_db)):
    """Save a form submission acknowledgement for a voter."""
    if req.form_type not in ("6", "7", "8"):
        raise HTTPException(400, "form_type must be 6, 7, or 8")

    submission = FormSubmission(
        epic_hash=req.epic_hash,
        form_type=req.form_type,
        acknowledgement_number=req.acknowledgement_number,
        status="submitted",
    )
    db.add(submission)
    await db.commit()
    await db.refresh(submission)
    return {
        "id": submission.id,
        "form_type": submission.form_type,
        "acknowledgement_number": submission.acknowledgement_number,
        "status": submission.status,
        "created_at": submission.created_at.isoformat(),
    }


@router.get("/status/{epic_hash}")
async def form_status(epic_hash: str, db: AsyncSession = Depends(get_db)):
    """List all form submissions for a voter."""
    result = await db.execute(
        select(FormSubmission)
        .where(FormSubmission.epic_hash == epic_hash)
        .order_by(FormSubmission.created_at.desc())
    )
    submissions = result.scalars().all()
    return {
        "epic_hash": epic_hash,
        "submissions": [
            {
                "id": s.id,
                "form_type": s.form_type,
                "acknowledgement_number": s.acknowledgement_number,
                "status": s.status,
                "status_detail": s.status_detail,
                "created_at": s.created_at.isoformat(),
            }
            for s in submissions
        ],
        "total": len(submissions),
    }

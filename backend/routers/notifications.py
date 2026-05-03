from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models import VoterProfile, Notification
from services.fcm_service import send_push_to_tokens, send_push_to_topic
from middleware.auth import require_admin

router = APIRouter(prefix="/api/notify", tags=["notifications"])


class AdminPushRequest(BaseModel):
    title: str
    body: str
    target_scope: str  # all|state|constituency
    target_value: Optional[str] = None
    data: Optional[dict] = None


class FCMRegisterRequest(BaseModel):
    epic_hash: str
    fcm_token: str
    state: str
    constituency: str
    language: str = "en"


@router.post("/fcm/register")
async def register_fcm(req: FCMRegisterRequest, db: AsyncSession = Depends(get_db)):
    """Register a device FCM token — persisted to DB, survives restarts."""
    result = await db.execute(
        select(VoterProfile).where(VoterProfile.epic_hash == req.epic_hash)
    )
    profile = result.scalar_one_or_none()

    if profile:
        profile.fcm_token = req.fcm_token
        profile.state_code = req.state
        profile.constituency_code = req.constituency
        profile.language = req.language
        profile.updated_at = datetime.utcnow()
    else:
        profile = VoterProfile(
            epic_hash=req.epic_hash,
            fcm_token=req.fcm_token,
            state_code=req.state,
            constituency_code=req.constituency,
            language=req.language,
        )
        db.add(profile)

    await db.commit()

    count_result = await db.execute(
        select(func.count()).select_from(VoterProfile).where(VoterProfile.fcm_token.isnot(None))
    )
    total = count_result.scalar_one()
    return {"registered": True, "total_tokens": total}


@router.post("/admin/push", dependencies=[Depends(require_admin)])
async def admin_push(req: AdminPushRequest, db: AsyncSession = Depends(get_db)):
    """Admin-only: push notification to targeted users."""
    query = select(VoterProfile.fcm_token).where(VoterProfile.fcm_token.isnot(None))

    if req.target_scope == "state":
        query = query.where(VoterProfile.state_code == req.target_value)
    elif req.target_scope == "constituency":
        query = query.where(VoterProfile.constituency_code == req.target_value)
    elif req.target_scope != "all":
        raise HTTPException(400, "Invalid target_scope")

    token_rows = await db.execute(query)
    tokens = [row[0] for row in token_rows.fetchall()]

    result = await send_push_to_tokens(tokens, req.title, req.body, req.data)

    notif = Notification(
        type="admin",
        title=req.title,
        body=req.body,
        target_scope=req.target_scope,
        target_value=req.target_value,
        fcm_response=result,
        sent_at=datetime.utcnow(),
    )
    db.add(notif)
    await db.commit()

    return {**result, "scope": req.target_scope, "target": req.target_value, "sent_at": datetime.utcnow().isoformat()}


@router.get("/history")
async def notification_history(db: AsyncSession = Depends(get_db)):
    """Return recent 50 notifications from DB."""
    result = await db.execute(
        select(Notification).order_by(Notification.created_at.desc()).limit(50)
    )
    notifications = result.scalars().all()
    return {
        "notifications": [
            {
                "id": n.id,
                "type": n.type,
                "title": n.title,
                "body": n.body,
                "target_scope": n.target_scope,
                "sent_at": n.sent_at.isoformat() if n.sent_at else None,
            }
            for n in notifications
        ],
        "total": len(notifications),
    }


@router.get("/token-count")
async def token_count(db: AsyncSession = Depends(get_db), admin=Depends(require_admin)):
    """Admin: FCM token counts by state."""
    rows = await db.execute(
        select(VoterProfile.state_code, func.count())
        .where(VoterProfile.fcm_token.isnot(None))
        .group_by(VoterProfile.state_code)
    )
    by_state = {row[0]: row[1] for row in rows.fetchall()}
    total = sum(by_state.values())
    return {"total": total, "by_state": by_state}

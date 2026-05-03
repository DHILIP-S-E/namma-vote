import base64
import json
import re
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.gemini_service import election_chat, gemini_extract_voter_card

router = APIRouter(prefix="/api/chat", tags=["chat"])


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    constituency: Optional[str] = None
    state: Optional[str] = None


class VoterCardScanRequest(BaseModel):
    image_base64: str
    mime_type: str = "image/jpeg"


@router.post("/ask")
async def ask(req: ChatRequest):
    context = {"constituency": req.constituency, "state": req.state}
    answer = await election_chat(req.message, req.language, context)
    return {"answer": answer, "language": req.language}


@router.post("/extract-voter-card")
async def extract_voter_card(req: VoterCardScanRequest):
    from fastapi import HTTPException
    try:
        extracted = await gemini_extract_voter_card(req.image_base64, req.mime_type)
        return {"extracted": extracted}
    except RuntimeError as e:
        if "QUOTA_EXCEEDED" in str(e):
            raise HTTPException(429, detail="Gemini AI quota exceeded for today. Please enter details manually or try again tomorrow.")
        raise HTTPException(500, detail="AI scan failed. Please enter details manually.")

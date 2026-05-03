import uuid
from datetime import datetime, date
from sqlalchemy import (
    Column, String, Boolean, Integer, BigInteger, Date,
    DateTime, Text, ForeignKey, JSON, CheckConstraint
)
from sqlalchemy.dialects.postgresql import UUID
from database import Base


def gen_uuid():
    return str(uuid.uuid4())


class VoterProfile(Base):
    __tablename__ = "voter_profiles"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    epic_hash = Column(String(64), unique=True, nullable=False, index=True)
    state_code = Column(String(10), nullable=False, index=True)
    constituency_code = Column(String(50), nullable=False, index=True)
    booth_number = Column(String(20))
    election_date = Column(Date)
    fcm_token = Column(Text)
    language = Column(String(5), default="en")
    persona = Column(String(30))  # first_time|returning|migrant|senior|pwd
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    constituency_code = Column(String(50), nullable=False, index=True)
    state_code = Column(String(10), nullable=False)
    election_year = Column(Integer, nullable=False)
    name = Column(String(200), nullable=False)
    party = Column(String(100))
    party_short = Column(String(20))
    serial_number = Column(Integer)
    party_symbol_url = Column(Text)
    photo_url = Column(Text)
    criminal_cases = Column(JSON)       # [{section, description, court}]
    total_assets_inr = Column(BigInteger)
    assets_detail = Column(JSON)
    education = Column(Text)
    education_discrepancy = Column(Boolean, default=False)
    affidavit_url = Column(Text)
    parsed_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class Rumour(Base):
    __tablename__ = "rumours"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    input_text = Column(Text, nullable=False)
    verdict = Column(String(15))  # TRUE|FALSE|MISLEADING
    explanation = Column(Text)
    source_url = Column(Text)
    language = Column(String(5), default="en")
    share_card_text = Column(Text)
    state_code = Column(String(10))
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        CheckConstraint("verdict IN ('TRUE','FALSE','MISLEADING')", name="verdict_check"),
    )


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    type = Column(String(20))  # admin|scraper|personalized
    title = Column(String(200), nullable=False)
    body = Column(Text, nullable=False)
    target_scope = Column(String(20))  # all|state|constituency|epic
    target_value = Column(String(100))
    fcm_response = Column(JSON)
    sent_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class ScrapedNews(Base):
    __tablename__ = "scraped_news"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    source_url = Column(Text, unique=True, nullable=False)
    raw_content = Column(Text)
    is_election_related = Column(Boolean)
    state_code = Column(String(10))
    constituency_code = Column(String(50))
    gemini_summary = Column(Text)
    notification_sent = Column(Boolean, default=False)
    scraped_at = Column(DateTime, default=datetime.utcnow)


class FormSubmission(Base):
    __tablename__ = "form_submissions"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    epic_hash = Column(String(64), nullable=False, index=True)
    form_type = Column(String(5))  # 6|7|8
    acknowledgement_number = Column(String(100))
    status = Column(String(30), default="submitted")
    status_detail = Column(Text)
    last_checked = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class ElectionSchedule(Base):
    __tablename__ = "election_schedule"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    state_code = Column(String(10), nullable=False, index=True)
    state_name = Column(String(100))
    constituency_code = Column(String(50), index=True)
    constituency_name = Column(String(200))
    phase_number = Column(Integer)
    election_date = Column(Date, nullable=False)
    counting_date = Column(Date)
    registration_deadline = Column(Date)


class ElectionHistory(Base):
    __tablename__ = "election_history"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    state_code = Column(String(10), nullable=False, index=True)
    constituency_code = Column(String(50), nullable=False, index=True)
    constituency_name = Column(String(200))
    election_year = Column(Integer, nullable=False)
    winner_name = Column(String(200))
    winner_party = Column(String(100))
    winner_party_short = Column(String(20))
    winner_votes = Column(Integer)
    margin = Column(Integer)
    turnout_pct = Column(String(10))
    nota_votes = Column(Integer)
    nota_pct = Column(String(10))
    swing_note = Column(Text)
    insight = Column(Text)


class AdminUser(Base):
    __tablename__ = "admin_users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=gen_uuid)
    username = Column(String(50), unique=True, nullable=False)
    password_hash = Column(String(200), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

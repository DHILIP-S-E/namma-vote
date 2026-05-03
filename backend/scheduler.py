"""
APScheduler-based background job scheduler.
Handles: news scraping every 30 min, personalized election day notifications.
"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime, date, timedelta
import logging

logger = logging.getLogger(__name__)
scheduler = AsyncIOScheduler(timezone="Asia/Kolkata")


def setup_scheduler():
    """Register all jobs. Call once at app startup."""
    scheduler.add_job(
        scrape_election_news,
        trigger=IntervalTrigger(minutes=30),
        id="news_scraper",
        replace_existing=True,
        max_instances=1,
        coalesce=True,
    )
    scheduler.add_job(
        send_personalized_notifications,
        trigger=CronTrigger(hour=7, minute=0, timezone="Asia/Kolkata"),
        id="daily_notifications",
        replace_existing=True,
    )
    scheduler.start()
    logger.info("[Scheduler] Started — news scraper every 30min, daily notifications at 7 AM IST")


async def scrape_election_news():
    """Scrape ECI + PIB + verified news sources and send notifications for new content."""
    logger.info("[Scraper] Starting news scrape cycle...")
    try:
        from scraper.scraper import run_scrape_cycle
        await run_scrape_cycle()
    except Exception as e:
        logger.error(f"[Scraper] Cycle failed: {e}")


async def send_personalized_notifications():
    """
    Daily job: send targeted notifications based on election proximity.
    T-7 days, T-1 day, T-0 (election morning 7 AM), T+2 days (counting).
    """
    from services.fcm_service import send_push_to_tokens
    from services.eci_service import get_schedule
    from database import AsyncSessionLocal
    from models import VoterProfile
    from sqlalchemy import select

    today = date.today()
    logger.info(f"[Notifications] Daily check for {today}")

    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(VoterProfile).where(VoterProfile.fcm_token.isnot(None))
        )
        profiles = result.scalars().all()

    for profile in profiles:
        try:
            sched = await get_schedule(profile.state_code, profile.constituency_code)
            if not sched:
                continue

            election_date = date.fromisoformat(sched["election_date"])
            days_until = (election_date - today).days

            title, body = None, None

            if days_until == 7:
                title = "🗳️ 7 Days to Voting Day!"
                body = "Check your booth address, verify your voter ID, and prepare your documents. Open NAMMA VOTE now."
            elif days_until == 1:
                title = "🌙 Voting is TOMORROW!"
                body = f"Phase {sched.get('phase_number', '')} voting is tomorrow. Know your booth. Carry your EPIC card."
            elif days_until == 0:
                title = "☀️ TODAY IS VOTING DAY!"
                body = "Polls open at 7 AM. Open NAMMA VOTE for live booth directions, rights, and emergency help."
            elif days_until < 0:
                counting = sched.get("counting_date")
                if counting and date.fromisoformat(counting) == today:
                    title = "📊 Vote Counting Starts in 2 Hours"
                    body = "Results for your constituency will be declared today. Follow live at results.eci.gov.in"

            if title and body:
                await send_push_to_tokens([profile.fcm_token], title, body)
                logger.info(f"[Notifications] Sent T{days_until} notification to {profile.state_code}")

        except Exception as e:
            logger.warning(f"[Notifications] Failed for profile {profile.id}: {e}")

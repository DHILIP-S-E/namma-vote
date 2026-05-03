"""
Election news scraper for NAMMA VOTE.
Sources: ECI.gov.in, PIB, ADR India, Myneta, The Hindu election feed.
Uses Gemini to classify and summarize scraped content.
"""
import asyncio
import hashlib
import logging
from datetime import datetime
import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

SOURCES = [
    {
        "name": "ECI Press Releases",
        "url": "https://eci.gov.in/press-release/",
        "selector": "a",
        "filter": "press",
    },
    {
        "name": "PIB Election News",
        "url": "https://pib.gov.in/AllRelease.aspx",
        "selector": ".ContentDiv a",
        "filter": "election",
    },
    {
        "name": "ADR India",
        "url": "https://adrindia.org/content/press-releases",
        "selector": ".view-content a",
        "filter": "election",
    },
]

# In-memory seen URLs to avoid reprocessing (replace with DB in production)
_seen_urls: set[str] = set()


async def fetch_page(url: str, timeout: int = 15) -> str | None:
    """Fetch a URL and return HTML content."""
    try:
        async with httpx.AsyncClient(timeout=timeout, follow_redirects=True,
                                     headers={"User-Agent": "NAMMA-VOTE-Bot/1.0"}) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            return resp.text
    except Exception as e:
        logger.warning(f"[Scraper] Failed to fetch {url}: {e}")
        return None


def extract_links(html: str, base_url: str, selector: str, filter_keyword: str) -> list[dict]:
    """Extract article links from a page."""
    soup = BeautifulSoup(html, "html.parser")
    links = []
    for tag in soup.select(selector)[:20]:  # limit per source
        href = tag.get("href", "")
        text = tag.get_text(strip=True)
        if not href or not text:
            continue
        if filter_keyword and filter_keyword.lower() not in (text + href).lower():
            # Allow if parent has election-related text
            parent_text = tag.find_parent().get_text(strip=True) if tag.find_parent() else ""
            if filter_keyword.lower() not in parent_text.lower():
                continue
        full_url = href if href.startswith("http") else base_url.rstrip("/") + "/" + href.lstrip("/")
        url_hash = hashlib.md5(full_url.encode()).hexdigest()
        links.append({"url": full_url, "title": text, "hash": url_hash})
    return links


async def process_article(url: str, title: str) -> dict | None:
    """Fetch article, classify with Gemini, generate notification if election-related."""
    if url in _seen_urls:
        return None
    _seen_urls.add(url)

    html = await fetch_page(url)
    if not html:
        return None

    soup = BeautifulSoup(html, "html.parser")
    # Extract main content text
    for tag in soup(["script", "style", "nav", "footer", "header"]):
        tag.decompose()
    content = soup.get_text(separator=" ", strip=True)[:2000]

    if len(content) < 100:
        return None

    try:
        from services.gemini_service import classify_news
        classification = await classify_news(content, url)
    except Exception as e:
        logger.warning(f"[Scraper] Gemini classify failed for {url}: {e}")
        return None

    if not classification.get("isElectionRelated"):
        return None

    return {
        "url": url,
        "title": title,
        "summary": classification.get("summary", ""),
        "state": classification.get("state"),
        "constituency": classification.get("constituency"),
        "type": classification.get("type", "general"),
        "urgency": classification.get("urgency", "LOW"),
        "scraped_at": datetime.utcnow().isoformat(),
    }


async def send_notification_for_article(article: dict):
    """Push notification to relevant users for a scraped article."""
    from services.fcm_service import send_push_to_tokens
    from database import AsyncSessionLocal
    from models import VoterProfile, Notification
    from sqlalchemy import select
    from datetime import datetime as dt

    summary = article.get("summary", "")
    if not summary or len(summary) < 20:
        return

    state = article.get("state")
    title_map = {
        "schedule_change": "⚠️ Election Schedule Update",
        "candidate_news": "👤 Candidate Update",
        "booth_change": "📍 Booth Change Alert",
        "mcc_violation": "🚨 MCC Violation Reported",
        "general": "📰 Election Update",
    }
    notif_title = title_map.get(article.get("type", "general"), "📰 Election Update")

    async with AsyncSessionLocal() as db:
        query = select(VoterProfile.fcm_token).where(VoterProfile.fcm_token.isnot(None))
        if state:
            query = query.where(VoterProfile.state_code == state)
        result = await db.execute(query)
        tokens = [row[0] for row in result.fetchall()]

        if tokens:
            fcm_result = await send_push_to_tokens(tokens, notif_title, summary[:200])
            db.add(Notification(
                type="scraper",
                title=notif_title,
                body=summary[:200],
                target_scope="state" if state else "all",
                target_value=state,
                fcm_response=fcm_result,
                sent_at=dt.utcnow(),
            ))
            await db.commit()
            logger.info(f"[Scraper] Notification sent to {len(tokens)} users for: {notif_title}")


async def run_scrape_cycle():
    """Main scrape cycle — runs every 30 minutes."""
    logger.info(f"[Scraper] Cycle started at {datetime.utcnow().isoformat()}")
    total_new = 0

    for source in SOURCES:
        html = await fetch_page(source["url"])
        if not html:
            continue

        links = extract_links(html, source["url"], source["selector"], source["filter"])
        logger.info(f"[Scraper] {source['name']}: found {len(links)} candidate links")

        tasks = [process_article(link["url"], link["title"]) for link in links[:5]]
        results = await asyncio.gather(*tasks, return_exceptions=True)

        for result in results:
            if isinstance(result, dict):
                total_new += 1
                await send_notification_for_article(result)

    logger.info(f"[Scraper] Cycle complete — {total_new} new election articles processed")

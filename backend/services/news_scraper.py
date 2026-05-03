import asyncio
import aiohttp
from bs4 import BeautifulSoup
from datetime import datetime

SCRAPE_SOURCES = [
    {"name": "ECI Press Releases", "url": "https://eci.gov.in/press-release/"},
    {"name": "PIB Election News", "url": "https://pib.gov.in/AllRelease.aspx"},
    {"name": "ADR India", "url": "https://adrindia.org/category/press-releases"},
]


async def scrape_source(session: aiohttp.ClientSession, source: dict) -> list[dict]:
    """Scrape a single news source and extract article links + content."""
    articles = []
    try:
        async with session.get(source["url"], timeout=aiohttp.ClientTimeout(total=15)) as resp:
            if resp.status != 200:
                return articles
            html = await resp.text()
            soup = BeautifulSoup(html, "lxml")

            # Extract links (generic approach — works for most news sites)
            for link in soup.find_all("a", href=True)[:20]:
                href = link["href"]
                text = link.get_text(strip=True)
                if len(text) > 30 and any(kw in text.lower() for kw in ["elect", "vote", "poll", "candidat", "evm", "booth"]):
                    full_url = href if href.startswith("http") else source["url"] + href
                    articles.append({
                        "source": source["name"],
                        "url": full_url,
                        "headline": text,
                        "scraped_at": datetime.utcnow().isoformat(),
                    })
    except Exception as e:
        print(f"Scrape failed for {source['url']}: {e}")
    return articles


async def scrape_all_sources() -> list[dict]:
    """Scrape all configured news sources concurrently."""
    async with aiohttp.ClientSession(
        headers={"User-Agent": "NammaVote/1.0 Election Information Service"}
    ) as session:
        tasks = [scrape_source(session, src) for src in SCRAPE_SOURCES]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    all_articles = []
    for r in results:
        if isinstance(r, list):
            all_articles.extend(r)
    return all_articles

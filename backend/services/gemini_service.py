import json
import re
from google import genai
from config import settings

_client = genai.Client(api_key=settings.GEMINI_API_KEY) if settings.GEMINI_API_KEY else None
MODEL = "gemini-2.0-flash"


def _generate(prompt: str) -> str:
    if not _client:
        raise ValueError("GEMINI_API_KEY not configured")
    response = _client.models.generate_content(model=MODEL, contents=prompt)
    return response.text.strip()


def _parse_json(text: str) -> dict:
    match = re.search(r'\{.*\}', text, re.DOTALL)
    if match:
        return json.loads(match.group())
    raise ValueError("No JSON in response")


async def check_rumour(claim: str, language: str = "en") -> dict:
    """Fact-check a voter rumour using Gemini against ECI data."""
    lang_map = {"en": "English", "ta": "Tamil", "hi": "Hindi"}
    lang_name = lang_map.get(language, "English")

    prompt = f"""You are NAMMA VOTE's election fact-checker for Indian elections.

A voter submitted this claim: "{claim}"

Determine if TRUE, FALSE, or MISLEADING based on:
- Official ECI rules and schedules
- Indian election law (Representation of the People Act)
- General knowledge about Indian elections

Respond ONLY in this JSON format:
{{
  "verdict": "TRUE" | "FALSE" | "MISLEADING",
  "explanation": "Plain language explanation in {lang_name} (max 3 sentences)",
  "source_url": "https://eci.gov.in/relevant-page",
  "confidence": "HIGH" | "MEDIUM" | "LOW"
}}"""

    try:
        text = _generate(prompt)
        return _parse_json(text)
    except ValueError as e:
        if "GEMINI_API_KEY" in str(e):
            return {
                "verdict": "MISLEADING",
                "explanation": "Gemini API key not configured. Add GEMINI_API_KEY to backend/.env for live AI fact-checking. Use one of the example claims for the demo.",
                "source_url": "https://eci.gov.in",
                "confidence": "LOW",
                "note": "Set GEMINI_API_KEY in backend/.env",
            }
        return {
            "verdict": "MISLEADING",
            "explanation": "Could not verify this claim automatically. Check eci.gov.in for official information.",
            "source_url": "https://eci.gov.in",
            "confidence": "LOW",
        }
    except Exception as e:
        return {
            "verdict": "MISLEADING",
            "explanation": "Could not verify this claim automatically. Check eci.gov.in for official information.",
            "source_url": "https://eci.gov.in",
            "confidence": "LOW",
            "error": str(e),
        }


async def _translate_rumour_response(data: dict, lang_name: str) -> dict:
    prompt = f"Translate this explanation to {lang_name} for Indian voters. Keep it simple:\n{data['explanation']}\nReturn only the translation."
    try:
        return {**data, "explanation": _generate(prompt)}
    except Exception:
        return data


async def check_registration_health(voter_data: dict) -> list:
    """AI analysis of voter registration data for potential issues."""
    prompt = f"""Analyse this Indian voter registration data for potential issues:
Name: {voter_data.get('name', '')}
Father/Husband Name: {voter_data.get('father_name', '')}
State: {voter_data.get('state_name', '')}

Check for:
1. Common transliteration errors in Tamil/Hindi names
2. Missing middle names that could cause document mismatches
3. Any other common voter roll issues

Return JSON: {{"issues": [{{"type": "name_mismatch"|"address"|"other", "detail": "...", "form": "6"|"7"|"8"}}]}}
If no issues found, return {{"issues": []}}"""

    try:
        text = _generate(prompt)
        result = _parse_json(text)
        return result.get("issues", [])
    except Exception:
        return []


async def classify_news(content: str, url: str) -> dict:
    """Classify scraped news as election-related and extract metadata."""
    prompt = f"""Analyze this news article for NAMMA VOTE election platform.

URL: {url}
Content: {content[:1000]}

Return JSON only:
{{
  "isElectionRelated": true,
  "state": "TN" | null,
  "constituency": "Velachery" | null,
  "summary": "Plain language summary for voters (max 2 sentences)",
  "type": "schedule_change" | "candidate_news" | "booth_change" | "mcc_violation" | "general",
  "urgency": "HIGH" | "MEDIUM" | "LOW"
}}"""

    try:
        text = _generate(prompt)
        return _parse_json(text)
    except Exception:
        return {"isElectionRelated": False, "state": None, "constituency": None, "summary": "", "type": "general", "urgency": "LOW"}


async def parse_affidavit_text(text: str, candidate_name: str) -> dict:
    """Parse ECI affidavit text using Gemini."""
    prompt = f"""Parse this Election Commission of India affidavit for candidate {candidate_name}.

Affidavit text:
{text[:3000]}

Extract and return JSON:
{{
  "criminal_cases": [{{"section": "IPC XXX", "description": "Plain language description", "court": "Court name", "year": 2024}}],
  "total_assets_inr": 12500000,
  "assets_detail": {{"movable": 2500000, "immovable": 10000000, "vehicles": 2, "bank_balance": 500000}},
  "education": "Highest qualification stated",
  "education_discrepancy": false
}}

Use plain English. Convert legal terms to simple language voters can understand."""

    try:
        response_text = _generate(prompt)
        return _parse_json(response_text)
    except Exception:
        return {"criminal_cases": [], "total_assets_inr": 0, "assets_detail": {}, "education": "Not available", "education_discrepancy": False}


async def election_chat(message: str, language: str = "en", context: dict = None) -> str:
    """Answer any Indian election question using Gemini."""
    lang_map = {"en": "English", "ta": "Tamil", "hi": "Hindi"}
    lang_name = lang_map.get(language, "English")
    ctx = ""
    if context:
        if context.get("constituency"):
            ctx += f"\nVoter's constituency: {context['constituency']}"
        if context.get("state"):
            ctx += f"\nVoter's state: {context['state']}"

    prompt = f"""You are NAMMA VOTE's election assistant for Indian voters.
Answer this voter's question in {lang_name} in 2-3 sentences max. Be direct and practical.
Focus on: ECI rules, voter rights, election process, booth procedures, forms, candidates, EVM, NOTA.
If the question is not election-related, politely redirect to election topics.{ctx}

Question: {message}"""
    try:
        return _generate(prompt)
    except ValueError:
        return "Gemini API key not configured. Add GEMINI_API_KEY to backend/.env"
    except Exception as e:
        return f"Could not answer right now. For election help call 1950."


async def gemini_extract_voter_card(image_base64: str, mime_type: str = "image/jpeg") -> dict | None:
    """Extract voter details from a Voter ID card photo using Gemini Vision."""
    if not _client:
        print("[Gemini] No API key configured")
        return None
    import base64 as b64lib
    from google.genai import types as gtypes
    try:
        image_bytes = b64lib.b64decode(image_base64)
        prompt = """This is an Indian Voter ID card (EPIC card). Read all the text carefully and extract the details. Return ONLY a JSON object with these exact fields (use empty string "" if a field is not visible):
{
  "name": "voter's full name as printed",
  "epic": "EPIC/voter ID number (e.g. THB2303907)",
  "father_name": "father's name or husband's name",
  "gender": "Male or Female",
  "age": 0,
  "assembly_constituency": "assembly constituency or vidhan sabha name",
  "booth_number": "part number or booth number",
  "polling_station": "polling station name",
  "polling_station_address": "polling station address",
  "district": "district name",
  "state_name": "state name",
  "election_date": ""
}"""
        response = _client.models.generate_content(
            model=MODEL,
            contents=[
                gtypes.Content(
                    role="user",
                    parts=[
                        gtypes.Part(inline_data=gtypes.Blob(mime_type=mime_type, data=image_bytes)),
                        gtypes.Part(text=prompt),
                    ]
                )
            ]
        )
        text = response.text.strip()
        print(f"[Gemini] Voter card raw response: {text[:300]}")
        result = _parse_json(text)
        return result if result else None
    except Exception as e:
        msg = str(e)
        print(f"[Gemini] Voter card extraction error: {type(e).__name__}: {msg[:200]}")
        if "429" in msg or "RESOURCE_EXHAUSTED" in msg or "quota" in msg.lower():
            raise RuntimeError("QUOTA_EXCEEDED")
        raise


async def translate_text(text: str, target_language: str) -> str:
    """Translate UI text to target language."""
    if target_language == "en":
        return text
    lang_map = {"ta": "Tamil", "hi": "Hindi"}
    lang_name = lang_map.get(target_language, "English")
    prompt = f"Translate this to {lang_name} for Indian voters. Keep it simple and natural:\n{text}\nReturn only the translation."
    try:
        return _generate(prompt)
    except Exception:
        return text

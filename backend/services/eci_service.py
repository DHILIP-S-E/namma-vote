import hashlib
import httpx
import base64
import json
import os
from sqlalchemy import select
from database import AsyncSessionLocal
from models import Candidate, ElectionSchedule
_DEFAULT_VOTER_DOCS = [
    "Voter ID Card (EPIC)",
    "Aadhaar Card",
    "Passport",
    "Driving Licence",
    "PAN Card",
    "MNREGA Job Card",
    "Bank/Post Office Passbook with Photo",
    "Smart Card issued by RGI (NPR)",
    "Pension Document with Photo",
    "Official ID issued by Central/State Govt",
]

# ECI state short code → our state_code
ECI_STATE_MAP = {
    "ANDHRA PRADESH": "AP", "ARUNACHAL PRADESH": "AR", "ASSAM": "AS",
    "BIHAR": "BR", "CHHATTISGARH": "CG", "GOA": "GA", "GUJARAT": "GJ",
    "HARYANA": "HR", "HIMACHAL PRADESH": "HP", "JHARKHAND": "JH",
    "KARNATAKA": "KA", "KERALA": "KL", "MADHYA PRADESH": "MP",
    "MAHARASHTRA": "MH", "MANIPUR": "MN", "MEGHALAYA": "ML",
    "MIZORAM": "MZ", "NAGALAND": "NL", "ODISHA": "OD", "PUNJAB": "PB",
    "RAJASTHAN": "RJ", "SIKKIM": "SK", "TAMIL NADU": "TN",
    "TELANGANA": "TS", "TRIPURA": "TR", "UTTAR PRADESH": "UP",
    "UTTARAKHAND": "UK", "WEST BENGAL": "WB", "DELHI": "DL",
    "JAMMU AND KASHMIR": "JK", "LADAKH": "LA",
}


def hash_epic(epic: str) -> str:
    return hashlib.sha256(epic.strip().upper().encode()).hexdigest()


# ── ECI electoral search constants (extracted from portal JS) ──────────────
_ECI_AES_KEY = base64.b64decode(
    "SFfIO0YsOlOKawZe855n97lc4tcPkj7WWsi38yNWpalLBLZzQdkqHWYbZ0=GhSJk2raUo"[15:59]
)
_ECI_RSA_PUB_B64 = (
    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArb7++BxL/YN8OIln+6FL9Gnw"
    "5DNmQ/VFZXss+J+TuQyJc891JbqbijxYQNEin2c2u+CnpXpoGQ/1gUSzDMJeNS3sNSlI"
    "Uykp2dt7xIm/cmV4sZ/c769vCxVRosMfRaZJnBAah+m1X26lEhnOo0wpAB9Txr8RIyBe"
    "6h7PiQWykeJeh6UacOBBX28kgkq7+vJhW8HgB38lt32XRocznRYwS9LqR7ZweFmQhTr1"
    "+EGrqiEKCOCxMYgHR2SQckb96hZ9kWzfzeun4bUO5oXKJciLkiS1IgKieADEvYLgu129"
    "ZIpn1H+8H+8ikNNVETqEDDMtqcQcQmWppJvcWHaXAs+f8QIDAQAB"
)
_ECI_HEADERS = {
    "appName": "ELECTORAL-SEARCH",
    "applicationName": "ELECTORAL-SEARCH",
    "channelidobo": "ELECTORAL-SEARCH",
    "Origin": "https://electoralsearch.eci.gov.in",
    "Referer": "https://electoralsearch.eci.gov.in/",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
}


def _eci_decrypt(data_b64: str) -> dict:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    raw = base64.b64decode(data_b64)
    iv, ct = raw[:12], raw[12:]
    return json.loads(AESGCM(_ECI_AES_KEY).decrypt(iv, ct, None).decode())


def _eci_encrypt(payload: dict) -> dict:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from cryptography.hazmat.primitives.asymmetric.padding import OAEP, MGF1
    from cryptography.hazmat.primitives.hashes import SHA256
    from cryptography.hazmat.primitives.serialization import load_der_public_key
    rsa_pub = load_der_public_key(base64.b64decode(_ECI_RSA_PUB_B64))
    sym_key = os.urandom(32)
    iv = os.urandom(12)
    body = json.dumps(payload).encode()
    enc_payload = AESGCM(sym_key).encrypt(iv, body, None)
    enc_key = rsa_pub.encrypt(sym_key, OAEP(mgf=MGF1(SHA256()), algorithm=SHA256(), label=None))
    return {
        "encryptedPayload": base64.b64encode(enc_payload).decode(),
        "encryptedKey": base64.b64encode(enc_key).decode(),
        "iv": base64.b64encode(iv).decode(),
    }


def _ocr_captcha(image_b64: str) -> str:
    try:
        import ddddocr
        ocr = ddddocr.DdddOcr(show_ad=False)
        image_bytes = base64.b64decode(image_b64)
        return ocr.classification(image_bytes).strip()
    except Exception as e:
        print(f"[ECI] OCR failed: {e}")
        return ""


async def _call_eci_gateway(epic: str) -> dict | None:
    """Search ECI electoral rolls by EPIC number with automatic captcha solving."""
    for attempt in range(4):
        try:
            async with httpx.AsyncClient(timeout=12, verify=False) as client:
                # Step 1: Get captcha
                r = await client.get(
                    "https://gateway-voters.eci.gov.in/api/v1/captcha-service/getCaptcha/sir",
                    headers=_ECI_HEADERS,
                )
                cap = _eci_decrypt(r.json()["data"])
                if cap.get("statusCode") != 200:
                    print(f"[ECI] Captcha failed: {cap.get('message')}")
                    continue

                captcha_text = _ocr_captcha(cap["captcha"])
                if not captcha_text:
                    print(f"[ECI] OCR returned empty on attempt {attempt+1}")
                    continue

                print(f"[ECI] Attempt {attempt+1}: captcha={captcha_text!r}")

                # Step 2: Encrypt and submit EPIC search
                encrypted_body = _eci_encrypt({
                    "epicNumber": epic,
                    "isPortal": True,
                    "captchaId": cap["id"],
                    "captchaData": captcha_text,
                    "securityKey": "na",
                })
                r2 = await client.post(
                    "https://gateway-voters.eci.gov.in/api/v1/elastic/search-by-epic-from-national-display-v1",
                    json=encrypted_body,
                    headers=_ECI_HEADERS,
                )
                resp = r2.json()

                # Response is a list of hits directly
                if isinstance(resp, list):
                    if resp:
                        hit = resp[0]
                        return hit.get("content") or hit
                    continue  # Empty = wrong captcha or not found, retry

                # Or wrapped in {data: "encrypted"}
                if isinstance(resp, dict) and "data" in resp:
                    result = _eci_decrypt(resp["data"])
                    if isinstance(result, list) and result:
                        hit = result[0]
                        return hit.get("content") or hit

        except Exception as e:
            err = str(e)
            if "UnicodeEncode" not in err and "UnicodeDecod" not in err:
                print(f"[ECI] Attempt {attempt+1} error: {type(e).__name__}: {err[:100]}")

    return None


def _map_eci_to_voter(raw: dict, epic: str) -> dict:
    """Map ECI response fields to VoterData. Handles both old gateway and new electoral search formats."""
    state_name = (raw.get("stateName") or raw.get("st_name") or "").strip().upper()
    state_code = ECI_STATE_MAP.get(state_name, "")
    if not state_code:
        sc = raw.get("stateCd") or raw.get("state_cd") or ""
        state_code = sc.replace("S", "").zfill(2) if sc.startswith("S") else sc or "IN"
        # Map ECI state codes (S22 = Tamil Nadu)
        ECI_CODE_MAP = {"S22": "TN","S27":"UP","S05":"GJ","S06":"HR","S07":"HP","S08":"JK",
                        "S09":"JH","S10":"KA","S11":"KL","S12":"MP","S13":"MH","S15":"MN",
                        "S16":"ML","S17":"MZ","S18":"NL","S21":"OD","S23":"PB","S24":"RJ",
                        "S25":"SK","S26":"TN","S28":"TS","S29":"TR","S30":"UP","S31":"UK","S19":"WB","S01":"AP"}
        state_code = ECI_CODE_MAP.get(sc, state_code or "IN")

    # Lat/lng from partLatLong field "9.8268,78.2593"
    lat, lng = None, None
    ll = raw.get("partLatLong") or ""
    if "," in ll:
        try:
            lat, lng = float(ll.split(",")[0]), float(ll.split(",")[1])
        except Exception:
            pass

    return {
        "epic": epic,
        "name": (raw.get("applicantFirstName") or raw.get("fullName") or raw.get("name") or "").title(),
        "father_name": (raw.get("relationName") or raw.get("relativeFullName") or raw.get("fatherHusbandName") or "").title(),
        "gender": "Female" if raw.get("gender") == "F" else "Male" if raw.get("gender") == "M" else (raw.get("gender") or "").capitalize(),
        "age": int(raw.get("age") or 0),
        "booth_number": str(raw.get("partNumber") or raw.get("partNo") or raw.get("sectionNo") or ""),
        "polling_station": (raw.get("psbuildingName") or raw.get("partName") or raw.get("psName") or "").strip(),
        "polling_station_address": (raw.get("psbuildingName") or raw.get("partName") or raw.get("psAddress") or "").strip(),
        "assembly_constituency": (raw.get("asmblyName") or raw.get("acName") or "").title(),
        "assembly_code": str(raw.get("acNumber") or raw.get("acNo") or ""),
        "parliamentary_constituency": (raw.get("prlmntName") or raw.get("pcName") or "").title(),
        "state_code": state_code,
        "state_name": state_name.title() or (raw.get("stateName") or "India"),
        "district": (raw.get("districtValue") or raw.get("distName") or "").title(),
        "phase_number": 0,
        "election_date": str(raw.get("pollingDate") or raw.get("electionDate") or ""),
        "health_issues": [],
        "document_checklist": _DEFAULT_VOTER_DOCS,
        "lat": lat,
        "lng": lng,
    }


async def lookup_voter_by_epic(epic: str) -> dict:
    epic_clean = epic.strip().upper()

    # Try real ECI gateway first
    raw = await _call_eci_gateway(epic_clean)
    if raw:
        voter = _map_eci_to_voter(raw, epic_clean)
        return {"found": True, "voter": voter}

    return {
        "found": False,
        "voter": None,
        "action": "form_6",
        "message": "Voter not found in ECI records. Verify your EPIC at voters.eci.gov.in"
    }


async def lookup_voter_by_name(name: str, state: str, district: str) -> dict:
    return {
        "found": False,
        "voter": None,
        "action": "form_6",
        "message": f"Name search is not available. Please use your EPIC (Voter ID number) to look up."
    }


_SUMMARY_KEYWORDS = {
    "margin", "turnout", "rejected", "registered", "swing", "valid", "electors",
    "majority", "total", "gain", "hold", "nota",
}

_PARTY_SHORT_MAP = {
    "dravida munnetra kazhagam": "DMK",
    "all india anna dravida munnetra kazhagam": "AIADMK",
    "naam tamilar katchi": "NTK",
    "tamilaga vettri kazhagam": "TVK",
    "bharatiya janata party": "BJP",
    "indian national congress": "INC",
    "amma makkal munnetra kazhagam": "AMMK",
    "makkal needhi maiam": "MNM",
    "communist party of india": "CPI",
    "communist party of india (marxist)": "CPI(M)",
    "all india trinamool congress": "TMC",
    "bahujan samaj party": "BSP",
    "samajwadi party": "SP",
    "telugu desam party": "TDP",
    "ysr congress party": "YSRCP",
    "aam aadmi party": "AAP",
    "shiv sena": "SS",
    "independent": "IND",
    "anaithu makkal puratchi katchi": "AMPK",
    "amgrdmk": "AMGRDMK",
}


def _to_party_short(party: str) -> str:
    key = party.strip().lower()
    if key in _PARTY_SHORT_MAP:
        return _PARTY_SHORT_MAP[key]
    # Check prefix match
    for full, short in _PARTY_SHORT_MAP.items():
        if key.startswith(full[:8]):
            return short
    return party.strip()[:8]


def _is_summary_row(text: str) -> bool:
    t = text.strip().lower()
    return any(kw in t for kw in _SUMMARY_KEYWORDS)


async def _wikipedia_candidates(constituency_name: str, year: int, state: str) -> list:
    """
    Dynamically fetch real election candidates from the Wikipedia article for
    any Indian assembly constituency.  Handles the Wikipedia election-table
    format where data rows have one extra leading cell (party colour stripe)
    compared to the header row.
    """
    slug = constituency_name.replace(" ", "_") + "_Assembly_constituency"
    url = f"https://en.wikipedia.org/wiki/{slug}"

    try:
        async with httpx.AsyncClient(timeout=15, verify=False, follow_redirects=True) as client:
            r = await client.get(url, headers={"User-Agent": "Mozilla/5.0 NAMMA-VOTE/1.0"})
        if r.status_code != 200:
            print(f"[Wiki] {url} → {r.status_code}")
            return []

        from bs4 import BeautifulSoup
        import re as _re
        soup = BeautifulSoup(r.text, "lxml")

        # ── 1. Collect all candidate-results tables with their inferred year ──
        candidate_tables: list[tuple[int, object]] = []
        for table in soup.find_all("table", class_=lambda c: c and "wikitable" in c):
            rows = table.find_all("tr")
            if len(rows) < 4:
                continue
            header_text = rows[0].get_text(" ")
            if "Candidate" not in header_text:
                continue
            # Infer year from nearest preceding heading
            prev = table.find_previous(["h2", "h3", "h4"])
            t_year = 0
            if prev:
                m = _re.search(r"(20\d{2}|19\d{2})", prev.get_text())
                if m:
                    t_year = int(m.group(1))
            candidate_tables.append((t_year, table))

        if not candidate_tables:
            return []

        # ── 2. Pick the table whose year is closest to requested year ──
        best_table = min(
            candidate_tables,
            key=lambda t: abs(t[0] - year) if t[0] else 9999,
        )[1]

        rows = best_table.find_all("tr")
        header_cells = rows[0].find_all(["th", "td"])
        header_texts = [h.get_text(strip=True).lower() for h in header_cells]
        n_header = len(header_texts)

        # ── 3. Detect column positions from header ──
        def h_idx(keyword: str) -> int:
            for i, t in enumerate(header_texts):
                if keyword in t:
                    return i
            return -1

        h_party    = h_idx("party")
        h_cand     = h_idx("candidate")
        h_votes    = h_idx("vote")
        h_pct      = h_idx("%")

        # ── 4. Parse each data row ──
        candidates: list[dict] = []
        for row_idx, row in enumerate(rows[1:], 1):
            cells = row.find_all(["td", "th"])
            n_cells = len(cells)
            if n_cells < 3:
                continue

            # Wikipedia election tables often have an extra leading colour-stripe
            # cell in data rows that has no corresponding header column.
            # Detect and compensate with an offset.
            offset = 1 if n_cells > n_header else 0

            def cell_text(col: int) -> str:
                idx = col + offset
                if col < 0 or idx >= n_cells:
                    return ""
                return cells[idx].get_text(strip=True).replace("\xa0", " ")

            party = cell_text(h_party)
            name  = cell_text(h_cand)
            votes_raw = cell_text(h_votes).replace(",", "").replace(" ", "")
            pct_raw   = cell_text(h_pct).replace("%", "").replace("−", "-").strip()

            # ── 5. Skip summary / NOTA rows ──
            if not name or not party:
                continue
            if _is_summary_row(name) or _is_summary_row(party):
                continue
            if name.upper() in ("NOTA", "NONE OF THE ABOVE"):
                continue

            try:
                votes = int(votes_raw) if votes_raw.lstrip("-").isdigit() else 0
            except ValueError:
                votes = 0
            try:
                pct = float(pct_raw) if pct_raw else 0.0
            except ValueError:
                pct = 0.0

            is_winner = "winner" in row.get_text().lower()
            short = _to_party_short(party)

            candidates.append({
                "id": f"wiki-{state}-{constituency_name}-{row_idx}",
                "name": name.strip().title(),
                "party": party.strip(),
                "party_short": short,
                "party_symbol_url": "",
                "photo_url": "",
                "serial_number": row_idx,
                "criminal_cases": [],
                "total_assets_inr": 0,
                "assets_detail": {},
                "education": "See ECI affidavit",
                "education_discrepancy": False,
                "affidavit_url": "https://affidavit.eci.gov.in/",
                "votes": votes,
                "vote_pct": pct,
                "is_winner": is_winner,
            })

        print(f"[Wiki] {constituency_name} {year}: {len(candidates)} candidates")
        return candidates

    except Exception as exc:
        print(f"[Wiki] fetch failed for {constituency_name}: {exc}")
        return []


async def _resolve_constituency_name(constituency_code: str, voter_assembly: str = "") -> str:
    """
    Resolve a constituency name from the ECI assembly code.
    Uses the name already known from voter data if available.
    """
    if voter_assembly:
        return voter_assembly.title()
    # Try Wikipedia search API as a last resort
    try:
        async with httpx.AsyncClient(timeout=8, verify=False, follow_redirects=True) as c:
            r = await c.get(
                "https://en.wikipedia.org/w/api.php",
                params={"action": "opensearch", "search": f"constituency {constituency_code} Tamil Nadu assembly", "limit": 3, "format": "json"},
                headers={"User-Agent": "Mozilla/5.0 NAMMA-VOTE/1.0"},
            )
            results = r.json()
            if results and len(results) > 1 and results[1]:
                title = results[1][0]
                # Extract just the constituency name part
                return title.split("Assembly")[0].strip()
    except Exception:
        pass
    return ""


async def get_candidates(state: str, constituency: str, year: int, constituency_name: str = "") -> list:
    """Query DB → Wikipedia live data → empty list (never returns mock)."""
    # 1. Database
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(Candidate).where(
                    Candidate.state_code == state.upper(),
                    Candidate.constituency_code == constituency,
                    Candidate.election_year == year,
                ).order_by(Candidate.serial_number)
            )
            candidates = result.scalars().all()
            if candidates:
                return [
                    {
                        "id": c.id, "name": c.name, "party": c.party,
                        "party_short": c.party_short, "party_symbol_url": c.party_symbol_url,
                        "photo_url": c.photo_url, "serial_number": c.serial_number,
                        "criminal_cases": c.criminal_cases or [],
                        "total_assets_inr": c.total_assets_inr or 0,
                        "assets_detail": c.assets_detail or {},
                        "education": c.education, "education_discrepancy": c.education_discrepancy,
                        "affidavit_url": c.affidavit_url,
                    }
                    for c in candidates
                ]
    except Exception as e:
        print(f"[DB] Candidate query failed: {e}")

    # 2. Wikipedia live scrape
    name = constituency_name or await _resolve_constituency_name(constituency)
    if name:
        cands = await _wikipedia_candidates(name, year, state)
        if cands:
            return cands

    return []


async def get_schedule(state: str, constituency: str) -> dict | None:
    """Query DB first, fall back to generated response."""
    try:
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                select(ElectionSchedule).where(
                    ElectionSchedule.state_code == state.upper(),
                    ElectionSchedule.constituency_code == constituency,
                )
            )
            schedule = result.scalars().first()
            if schedule:
                return {
                    "state_code": schedule.state_code,
                    "state_name": schedule.state_name,
                    "constituency_code": schedule.constituency_code,
                    "constituency_name": schedule.constituency_name,
                    "phase_number": schedule.phase_number,
                    "election_date": schedule.election_date.isoformat() if schedule.election_date else None,
                    "counting_date": schedule.counting_date.isoformat() if schedule.counting_date else None,
                    "registration_deadline": schedule.registration_deadline.isoformat() if schedule.registration_deadline else None,
                }
    except Exception as e:
        print(f"[DB] Schedule query failed: {e}")

    return {
        "state_code": state,
        "constituency_code": constituency,
        "phase_number": 1,
        "election_date": "2026-05-03",
        "counting_date": "2026-05-05",
        "registration_deadline": "2026-03-15",
    }


def get_documents_for_state(state_code: str) -> list:
    return _DEFAULT_VOTER_DOCS

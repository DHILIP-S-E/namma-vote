# NAMMA VOTE — நம்ம வோட்
## India's Complete Election Intelligence Platform

> **PromptWars Virtual — Challenge 2 | Election Process Education**
> Every Vote. Informed. Protected.

[![Deploy to Cloud Run](https://github.com/your-username/nammavote/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-username/nammavote/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)](https://fastapi.tiangolo.com)
[![Python](https://img.shields.io/badge/Python-3.11-yellow)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple)](LICENSE)

---

## Table of Contents

1. [What is NAMMA VOTE?](#what-is-namma-vote)
2. [Core Problem Statement](#core-problem-statement)
3. [Three Core Modes](#three-core-modes)
4. [Full Feature List](#full-feature-list)
5. [Tech Stack](#tech-stack)
6. [Project Structure](#project-structure)
7. [Database Schema](#database-schema)
8. [API Reference](#api-reference)
9. [Authentication System](#authentication-system)
10. [AI Integration (Gemini)](#ai-integration-gemini)
11. [Push Notification System](#push-notification-system)
12. [Offline PWA Support](#offline-pwa-support)
13. [Multilingual Support](#multilingual-support)
14. [Quick Start](#quick-start)
15. [Docker Compose Setup](#docker-compose-setup)
16. [Environment Variables](#environment-variables)
17. [Deployment (Google Cloud Run)](#deployment-google-cloud-run)
18. [Admin Panel](#admin-panel)
19. [All Screens & Routes](#all-screens--routes)
20. [Architecture Overview](#architecture-overview)
21. [Security](#security)
22. [Contributing](#contributing)

---

## What is NAMMA VOTE?

**NAMMA VOTE** (Tamil: "Our Vote") is a **Progressive Web App (PWA)** powered by **Gemini 2.0 Flash AI** that solves every real problem an Indian voter faces — before, during, and after an election.

It integrates live data from the **Election Commission of India (ECI)**, AI-powered fact-checking, Google Maps booth navigation, real-time push notifications, offline caching, and multilingual support into one seamless mobile-first application.

Built for real Indian voters — from first-time voters to senior citizens, from urban users to migrant workers.

---

## Core Problem Statement

| Voter Problem | NAMMA VOTE Solution |
|---|---|
| Don't know if I am registered | EPIC/Name lookup → AI registration health check → detects name mismatches & duplicates |
| Can't find my polling booth | One-tap booth finder with Google Maps + walking directions |
| Don't know anything about candidates | Affidavit parser — criminal cases, total assets, education in plain language |
| Received false WhatsApp message | Rumour Buster — Gemini AI checks claim against ECI data → shareable TRUE/FALSE/MISLEADING verdict |
| Lost on election day | Mode 2 live guide — emergency steps, tender vote rights, officer complaint flow |
| Missed election updates | 3-layer push notification system — news scraper + admin broadcast + personalized reminders |
| Forms 6/7/8 too complex | Step-by-step form wizard with real-time submission tracking |
| Don't know my voter rights | Voter rights card with secret ballot, tender vote, no-photo rights |

---

## Three Core Modes

### Mode 1 — "Am I Ready to Vote?" (Pre-Election)
A 5-step guided wizard that walks any voter from uncertainty to complete election readiness.

**Step 1 — Identity Check**
- EPIC code or Name + State lookup against ECI electoral database
- AES + RSA encrypted real ECI portal integration with CAPTCHA solving
- Voter details: name, father's name, age, address, booth number, constituency

**Step 2 — Registration Health Check (AI-powered)**
- Gemini 2.0 Flash analyses voter record for common issues
- Detects: name/father's name mismatches, address anomalies, duplicate entries, missing details
- Generates plain-language issue cards with suggested actions (Form 6/7/8)
- Risk scoring: Low / Medium / High — determines if voter needs urgent action

**Step 3 — Booth Finder**
- Google Maps integration with current-location detection
- Booth address, polling officer name, accessibility status
- Walking + driving directions with estimated time
- Booth accessibility details: ramp, women-only queues, shade/water availability

**Step 4 — Candidate Intelligence**
- All candidates for the voter's constituency from ECI affidavit data
- **Criminal cases**: section-wise breakdown with court names (highlighted in red)
- **Total assets**: movable + immovable (formatted in Lakhs/Crores for readability)
- **Education**: qualification with Gemini-detected discrepancies flagged
- Party symbol + candidate photo from ECI data
- NOTA option explained

**Step 5 — Documents & Done**
- State-specific list of accepted voter identification documents
- Cross-reference with rejected documents (some states differ)
- Checklist format with Yes/No toggles
- Election phase calendar with countdown timer to election day

---

### Mode 2 — "Help Me Right Now" (Election Day Live)
Instant actionable guidance for election day problems.

- **One-tap booth directions** — opens Google Maps with the voter's pre-saved booth address
- **"My name is missing" emergency flow** — step-by-step: check Electoral Roll app → ask BLO → request Tender Vote
- **EVM Mock Poll explainer** — calms first-time voters about mandatory 1-minute mock poll before polls open
- **Voter rights card** — secret ballot rights, no-photo/selfie rule inside booth, tender vote entitlement
- **Officer complaint flow** — escalation tree: Presiding Officer → Sector Officer → District Election Officer → ECI Control Room (1950)
- **Document quick-check** — tap Yes/No on what you have to confirm eligibility at the booth
- **Helpline numbers** — 1950 (national voter helpline), state-specific ECI numbers, BLO contact

---

### Mode 3 — "Is This True?" (Rumour Buster)
Real-time AI fact-checking against ECI data with shareable correction cards.

- Paste any WhatsApp claim, news headline, or social media post
- **Gemini 2.0 Flash** verifies against ECI announcements, PIB press releases, and ADR data
- Returns a structured verdict:
  - **TRUE** — with source citation
  - **FALSE** — with correct information + ECI source
  - **MISLEADING** — partial truth explained
- **Shareable verdict card** — visual WhatsApp-forward-ready card generated via html2canvas
- Translation — verdict auto-translated to voter's language (Tamil/Hindi/English)
- Recent rumours list — community crowdsourced common claims

---

## Full Feature List

### Voter Registration & Lookup
- EPIC (Electors Photo Identity Card) lookup
- Name + State search with fuzzy matching
- ECI portal encrypted integration (AES + RSA + CAPTCHA)
- Registration health check with AI analysis
- Forms 6, 7, 8 wizard for registration corrections
- Form submission tracking with acknowledgement numbers

### Election Day Support
- Live booth directions (Google Maps + current GPS)
- "Name missing at booth" emergency guide
- Tender vote rights and procedure
- Voter rights card (secret ballot, no-selfie rule, booth assistance)
- EVM + VVPAT mock poll explainer
- Document quick-check at the gate
- Officer complaint escalation tree
- Disability-specific voting guidance

### Candidate Intelligence
- Full candidate list per constituency from ECI data
- Criminal case details parsed from sworn affidavits
- Asset declarations (movable + immovable, formatted)
- Education qualifications with discrepancy detection
- Party symbol and candidate photo display
- Affidavit PDF link for primary source access

### Rumour Busting & Fact Checking
- AI-powered fact-check against ECI, PIB, ADR data sources
- TRUE / FALSE / MISLEADING verdict with explanation
- Shareable WhatsApp correction card generator
- Multilingual verdict translation
- Recent rumours community list
- CVigil guide for reporting election code violations

### Push Notifications (3-Layer System)
- **Admin broadcast** — send to all users, by state, by constituency
- **Automated news scraper** — scrapes ECI/PIB/ADR every 30 minutes; Gemini classifies content; auto-notifies relevant users
- **Personalized reminders** — day-of-election countdown, registration deadline, booth details
- Firebase Cloud Messaging (FCM) — web push + background notifications
- Notification history page with past alerts

### PWA & Offline Support
- Service Worker (Workbox) for offline access
- Caches on first visit: booth address, voter rights card, document checklist, emergency contacts
- Works on election day without internet
- Installable to home screen (Android + iOS)
- Push notifications even when app is closed

### Accessibility Features
- PwD (Persons with Disabilities) voter guide
- Wheelchair ramp availability at booths
- Women-only queue information
- Braille EVM guide
- Accompanied voting rights for blind/low-vision voters
- Postal ballot guide for mobility-impaired voters

### Postal Ballot & Migrant Workers
- Step-by-step postal ballot application guide
- Eligibility checker (senior citizens, PwD, essential services, overseas voters)
- Form 12D download and submission tracking
- State-specific deadline calendar

### Election History & Analytics
- Past election results by constituency
- Winner, party, votes, margin
- NOTA vote counts and percentages
- Voter turnout percentages
- Swing analysis (Gemini-generated insight)
- Historical trend charts

### Education & Awareness
- Interactive Policy Quiz (15 questions on election process)
- Mock EVM simulator — interactive touchscreen EVM experience
- EVM explainer — how VVPAT works, common myths debunked
- Glossary — election terminology in plain language (60+ terms)
- Voter pledge card with shareable image
- Election checklist for first-time voters

### Manifesto & Party Information
- Party manifesto search by keyword
- Side-by-side comparison of promises
- ADR party funding data

### AI Chatbot
- Conversational Q&A for any election question
- Voter card OCR — upload a photo, chatbot extracts and verifies data
- Gemini-powered with ECI knowledge base context

### Admin Panel
- JWT-secured admin login
- Broadcast push notifications (all / by state / by constituency)
- Pre-built notification templates (election day, reminder, booth change)
- Token count statistics by state
- App usage stats

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | UI components and routing |
| **Build Tool** | Vite 8 + vite-plugin-pwa | Fast dev server, PWA generation |
| **Styling** | Tailwind-compatible CSS + dark theme | Mobile-first design system |
| **Animations** | Framer Motion 12 | Page transitions, micro-interactions |
| **State Management** | Zustand 5 | Global voter data, language, persona |
| **Server State** | TanStack Query 5 | API caching, background refetch |
| **HTTP Client** | Axios | REST calls with JWT interceptor |
| **Icons** | Lucide React | Consistent icon system |
| **Screenshots** | html2canvas | Shareable verdict cards |
| **Toast Notifications** | react-hot-toast | UI feedback |
| **Date Utilities** | date-fns 4 | Countdown, formatting |
| **Backend Framework** | FastAPI 0.115 (Python 3.11) | REST API + OpenAPI docs |
| **ASGI Server** | Uvicorn 0.32 | Production HTTP server |
| **ORM** | SQLAlchemy 2.0 (async) | Database models + queries |
| **Database** | PostgreSQL 16 (via Supabase) | Persistent data store |
| **Cache** | Redis 7 | Scraper state, session caching |
| **AI** | Gemini 2.0 Flash (google-genai) | Rumour check, affidavit parsing, translation |
| **Maps** | Google Maps JavaScript API | Booth finder + directions |
| **Auth (Users)** | Firebase Authentication | Email/password user auth |
| **Push** | Firebase Cloud Messaging (FCM) | Web push notifications |
| **Scraper** | httpx + BeautifulSoup4 + lxml | ECI/PIB/ADR news scraping |
| **Scheduler** | APScheduler 3.10 | 30-min news scrape + daily notification jobs |
| **PDF Parsing** | PyMuPDF | Affidavit extraction |
| **Admin Auth** | JWT (python-jose) + bcrypt (passlib) | Secure admin access |
| **Deployment** | Google Cloud Run | Serverless, scales to zero |
| **CI/CD** | GitHub Actions | Auto-deploy on push to main |
| **Containerization** | Docker + Docker Compose | Local dev + production images |
| **Registry** | Google Artifact Registry | Docker image storage |

---

## Project Structure

```
nammavote/
│
├── README.md                           # This file
├── doc.md                              # Detailed architecture documentation
├── Dockerfile                          # Backend production image (Python 3.11 slim)
├── docker-compose.yml                  # Full stack: backend + frontend + PostgreSQL + Redis
├── .github/
│   └── workflows/
│       └── deploy.yml                  # CI/CD → Cloud Run (triggers on push to main)
│
├── backend/
│   ├── main.py                         # FastAPI app: CORS, lifespan, router includes
│   ├── config.py                       # Pydantic Settings from .env
│   ├── database.py                     # SQLAlchemy async engine + session factory
│   ├── models.py                       # 9 ORM models (VoterProfile, Candidate, Rumour, ...)
│   ├── seed.py                         # Demo data seeding (runs on startup if DB empty)
│   ├── scheduler.py                    # APScheduler jobs (30-min news scrape, daily reminders)
│   ├── requirements.txt                # Python dependencies (22 packages)
│   ├── .env                            # Environment variables (not committed)
│   ├── .env.example                    # Template for .env setup
│   │
│   ├── routers/                        # FastAPI route handlers
│   │   ├── voter.py                    # POST /api/voter/lookup, GET /api/voter/epic-hash
│   │   ├── rumour.py                   # POST /api/rumour/check
│   │   ├── candidates.py               # GET /api/candidates, /schedule, /documents
│   │   ├── notifications.py            # FCM register, admin push, history, token count
│   │   ├── admin.py                    # POST /api/admin/login, GET /api/admin/stats
│   │   ├── forms.py                    # POST /api/forms/submit, GET /api/forms/status
│   │   ├── chat.py                     # POST /api/chat/ask, POST /api/chat/extract-voter-card
│   │   └── history.py                  # GET /api/history, /api/schedule/phases
│   │
│   ├── services/                       # Business logic layer
│   │   ├── eci_service.py              # ECI portal integration (AES+RSA encryption, CAPTCHA)
│   │   ├── gemini_service.py           # All Gemini AI functions
│   │   ├── fcm_service.py              # Firebase Cloud Messaging batch push
│   │   └── news_scraper.py             # ECI/PIB/ADR scraping + Gemini classification
│   │
│   ├── middleware/
│   │   └── auth.py                     # JWT verification middleware for admin routes
│   │
│   ├── scraper/
│   │   └── scraper.py                  # News scraper implementation
│   │
│   └── static/                         # Party symbols, candidate photos
│
└── frontend/
    ├── package.json                    # Node dependencies + scripts
    ├── vite.config.ts                  # PWA config, workbox caching strategy, dev proxy
    ├── tsconfig.json                   # TypeScript configuration
    ├── tsconfig.app.json               # App-specific TS config
    ├── tsconfig.node.json              # Node/build TS config
    ├── index.html                      # HTML shell + PWA manifest link
    ├── .env                            # Frontend env vars (not committed)
    ├── .env.example                    # Template for frontend .env setup
    │
    ├── public/
    │   ├── icon-192.png                # PWA icon (192x192)
    │   ├── icon-512.png                # PWA icon (512x512)
    │   └── favicon.ico                 # Browser favicon
    │
    └── src/
        ├── App.tsx                     # Root: routes (27), auth guard, theme setup
        ├── main.tsx                    # React entry point + QueryClient setup
        ├── firebase.ts                 # Firebase app initialization
        │
        ├── api/                        # REST client modules
        │   ├── client.ts               # Axios instance with JWT Bearer interceptor
        │   ├── voter.ts                # lookup(), registerFCM()
        │   ├── rumour.ts               # checkRumour()
        │   ├── candidates.ts           # getCandidates(), getSchedule(), getDocuments()
        │   └── history.ts              # getHistory(), getPhases()
        │
        ├── store/
        │   └── voterStore.ts           # Zustand: voterData, language, persona, FCM token
        │
        ├── i18n/
        │   ├── translations.ts         # Translation strings (en, ta, hi)
        │   └── useT.ts                 # useT() hook for component translations
        │
        ├── pages/                      # 27 route-level components
        │   ├── LandingPage.tsx         # Welcome screen + 3 mode cards
        │   ├── Auth.tsx                # Firebase email/password login + signup
        │   ├── Onboarding.tsx          # Language → Persona → EPIC lookup → Push prompt
        │   ├── Dashboard.tsx           # Home: countdown, news, quick-action cards
        │   ├── Mode1.tsx               # 5-step pre-election wizard (29KB)
        │   ├── Mode2.tsx               # Election day live guide (9KB)
        │   ├── Mode3.tsx               # Rumour fact-checker + shareable cards (11KB)
        │   ├── BoothMap.tsx            # Google Maps booth finder with directions
        │   ├── Candidates.tsx          # Candidate cards: criminal/assets/education
        │   ├── Admin.tsx               # Admin push notification panel (JWT-protected)
        │   ├── Profile.tsx             # Voter data, language, persona, logout
        │   ├── Notifications.tsx       # Push notification history
        │   ├── Accessibility.tsx       # PwD guide: ramp, braille, women-only queues
        │   ├── CVigil.tsx              # Corruption/code violation reporting guide
        │   ├── MyConstituency.tsx      # Candidate list + local election history
        │   ├── Glossary.tsx            # 60+ election terms in plain language
        │   ├── HelpRights.tsx          # Voter rights card + helpline numbers
        │   ├── EVMExplainer.tsx        # EVM + VVPAT guide, myth debunking
        │   ├── PostalBallot.tsx        # Migrant voter postal ballot guide
        │   ├── ConstituencyHistory.tsx # Past election results, NOTA, turnout
        │   ├── PledgeCard.tsx          # Voter pledge + shareable image
        │   ├── ElectionChecklist.tsx   # State-specific document checklist
        │   ├── PolicyQuiz.tsx          # 15-question voter education interactive quiz
        │   ├── MockEVM.tsx             # Interactive touchscreen EVM simulator
        │   └── ManifestoSearch.tsx     # Party manifesto keyword search
        │
        ├── components/
        │   ├── BottomNav.tsx           # Mobile bottom navigation (5 tabs)
        │   ├── SideNav.tsx             # Desktop sidebar navigation (drawer)
        │   ├── AIChatBot.tsx           # Floating AI assistant widget
        │   ├── Icons.tsx               # Custom SVG icon library
        │   └── AppIcon.tsx             # App logo + branding component
        │
        ├── assets/                     # Images, illustrations
        └── styles/                     # Global CSS + theme variables
```

---

## Database Schema

### VoterProfile (`voter_profiles`)
Stores hashed voter data — no raw EPIC stored.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `epic_hash` | VARCHAR (unique) | SHA-256 of EPIC — voter's lookup key |
| `state_code` | VARCHAR | ECI state code |
| `constituency_code` | VARCHAR | ECI constituency code |
| `booth_number` | VARCHAR | Assigned polling booth number |
| `election_date` | DATE | Voter's election date |
| `fcm_token` | TEXT | Firebase push token for this device |
| `language` | VARCHAR | Preferred language: `en` / `ta` / `hi` |
| `persona` | VARCHAR | `first_time` / `returning` / `migrant` / `senior` / `pwd` |
| `created_at` | TIMESTAMP | First registration |
| `updated_at` | TIMESTAMP | Last profile update |

---

### Candidate (`candidates`)
Parsed from ECI sworn affidavits.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `state_code` | VARCHAR | ECI state code |
| `constituency_code` | VARCHAR | ECI constituency code |
| `election_year` | INTEGER | Year of election |
| `name` | VARCHAR | Candidate full name |
| `party` | VARCHAR | Full party name |
| `party_short` | VARCHAR | Party abbreviation |
| `serial_number` | INTEGER | Ballot order number |
| `party_symbol_url` | TEXT | Party symbol image URL |
| `photo_url` | TEXT | Candidate photo URL |
| `criminal_cases` | JSON | Array: `[{section, description, court}]` |
| `total_assets_inr` | BIGINT | Total declared assets in rupees |
| `assets_detail` | JSON | Movable + immovable asset breakdown |
| `education` | VARCHAR | Highest qualification |
| `education_discrepancy` | BOOLEAN | Gemini-detected education mismatch |
| `affidavit_url` | TEXT | ECI affidavit PDF link |
| `parsed_at` | TIMESTAMP | When Gemini parsed the affidavit |

---

### Rumour (`rumours`)
Fact-checked claims with AI verdicts.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `input_text` | TEXT | Original claim submitted by user |
| `verdict` | VARCHAR | `TRUE` / `FALSE` / `MISLEADING` |
| `explanation` | TEXT | AI-generated explanation |
| `source_url` | TEXT | ECI/PIB source URL used for verification |
| `language` | VARCHAR | Language of verdict (`en` / `ta` / `hi`) |
| `share_card_text` | TEXT | Pre-formatted text for WhatsApp sharing |
| `state_code` | VARCHAR | Relevant state (if claim is state-specific) |

---

### Notification (`notifications`)
All push notifications sent through the system.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `type` | VARCHAR | `admin` / `scraper` / `personalized` |
| `title` | VARCHAR | Push notification title |
| `body` | TEXT | Push notification body |
| `target_scope` | VARCHAR | `all` / `state` / `constituency` / `epic` |
| `target_value` | VARCHAR | State code / constituency code / epic hash |
| `fcm_response` | JSON | Firebase batch response payload |
| `sent_at` | TIMESTAMP | When notification was dispatched |

---

### ScrapedNews (`scraped_news`)
News articles scraped and classified by Gemini.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `source_url` | TEXT (unique) | Deduplicated article URL |
| `raw_content` | TEXT | Scraped article text |
| `is_election_related` | BOOLEAN | Gemini classification flag |
| `state_code` | VARCHAR | Relevant state (Gemini-detected) |
| `constituency_code` | VARCHAR | Relevant constituency (Gemini-detected) |
| `gemini_summary` | TEXT | Gemini-generated 2-sentence summary |
| `notification_sent` | BOOLEAN | Whether push was triggered |
| `scraped_at` | TIMESTAMP | Scrape timestamp |

---

### FormSubmission (`form_submissions`)
Tracks voter form applications.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `epic_hash` | VARCHAR | Voter reference |
| `form_type` | VARCHAR | `6` (new registration) / `7` (deletion) / `8` (correction) |
| `acknowledgement_number` | VARCHAR | ECI acknowledgement reference |
| `status` | VARCHAR | `submitted` / `approved` / `rejected` |
| `status_detail` | TEXT | Human-readable status explanation |
| `last_checked` | TIMESTAMP | Last status check timestamp |

---

### ElectionSchedule (`election_schedule`)
Phase-wise election dates for all constituencies.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `state_code` | VARCHAR | ECI state code |
| `state_name` | VARCHAR | Full state name |
| `constituency_code` | VARCHAR | ECI constituency code |
| `constituency_name` | VARCHAR | Full constituency name |
| `phase_number` | INTEGER | Election phase number |
| `election_date` | DATE | Polling date |
| `counting_date` | DATE | Results counting date |
| `registration_deadline` | DATE | Last date for form submission |

---

### ElectionHistory (`election_history`)
Historical election results for analytics.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `state_code` | VARCHAR | ECI state code |
| `constituency_code` | VARCHAR | ECI constituency code |
| `election_year` | INTEGER | Election year |
| `winner_name` | VARCHAR | Winning candidate name |
| `winner_party` | VARCHAR | Winning party |
| `winner_votes` | INTEGER | Total votes received by winner |
| `margin` | INTEGER | Votes margin over runner-up |
| `turnout_pct` | FLOAT | Voter turnout percentage |
| `nota_votes` | INTEGER | Total NOTA votes cast |
| `nota_pct` | FLOAT | NOTA as percentage of total votes |
| `swing_note` | TEXT | Change from previous election |
| `insight` | TEXT | Gemini-generated constituency insight |

---

### AdminUser (`admin_users`)
Secured admin accounts.

| Column | Type | Description |
|---|---|---|
| `id` | UUID PK | Internal identifier |
| `username` | VARCHAR (unique) | Admin login name |
| `password_hash` | VARCHAR | bcrypt password hash |
| `created_at` | TIMESTAMP | Account creation time |

---

## API Reference

All API endpoints are documented interactively at `http://localhost:8000/docs` (Swagger UI) when running locally.

### Voter

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/voter/lookup` | None | Lookup voter by EPIC or Name+State |
| `GET` | `/api/voter/epic-hash/{epic}` | None | Returns SHA-256 hash of EPIC |

**POST /api/voter/lookup — Request:**
```json
{
  "epic": "ABC1234567",
  "state_code": "TN"
}
```

**POST /api/voter/lookup — Response:**
```json
{
  "epic_hash": "sha256...",
  "name": "DHILIP S E",
  "father_name": "SUNDARAM",
  "age": 28,
  "address": "123 Anna Nagar, Chennai",
  "booth_number": "142",
  "booth_address": "Govt Higher Secondary School, Anna Nagar",
  "constituency_code": "102",
  "constituency_name": "Chennai North",
  "state_code": "TN",
  "election_date": "2026-04-15",
  "health_check": {
    "issues": [],
    "risk_level": "low",
    "recommendation": "You are all set to vote!"
  }
}
```

---

### Rumour Checking

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/rumour/check` | None | Fact-check a claim using Gemini AI |

**POST /api/rumour/check — Request:**
```json
{
  "claim": "Voting date in Chennai has been changed to tomorrow",
  "language": "en",
  "state_code": "TN"
}
```

**POST /api/rumour/check — Response:**
```json
{
  "verdict": "FALSE",
  "explanation": "ECI has not issued any change in polling dates for Chennai. The official date remains April 15, 2026.",
  "source_url": "https://eci.gov.in/press-note/...",
  "share_card_text": "FACT CHECK: FALSE\n\nClaim: 'Voting date in Chennai changed to tomorrow'\n\nFact: ECI confirms polling date is April 15, 2026. No changes have been announced.\n\nSource: eci.gov.in\n\n✅ Verified by NAMMA VOTE"
}
```

---

### Candidates & Schedule

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/candidates/{state}/{constituency}/{year}` | None | All candidates with parsed affidavit data |
| `GET` | `/api/schedule/{state}/{constituency}` | None | Election phase and key dates |
| `GET` | `/api/documents/{state}` | None | State-specific accepted voter ID documents |

---

### Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/notify/fcm/register` | None | Register device FCM token |
| `POST` | `/api/notify/admin/push` | Admin JWT | Broadcast push notification |
| `GET` | `/api/notify/history` | None | Last 50 notifications |
| `GET` | `/api/notify/token-count` | Admin JWT | Token counts by state |

**POST /api/notify/admin/push — Request:**
```json
{
  "title": "Election Day Tomorrow!",
  "body": "Polling begins at 7 AM. Carry your voter ID.",
  "target_scope": "state",
  "target_value": "TN"
}
```

---

### Admin

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/login` | None | Admin login → returns JWT |
| `GET` | `/api/admin/stats` | Admin JWT | App usage statistics |

---

### Forms

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/forms/submit` | None | Submit Form 6/7/8 application |
| `GET` | `/api/forms/status/{epic_hash}` | None | Form submission history |

---

### Chat

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/chat/ask` | None | Conversational election Q&A |
| `POST` | `/api/chat/extract-voter-card` | None | OCR extract data from voter card image |

---

### History & Schedule

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/history/{state}/{constituency}` | None | Past election results |
| `GET` | `/api/schedule/phases` | None | All election phases grouped |

---

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Root endpoint |
| `GET` | `/health` | Health check (returns `{"status": "ok"}`) |

---

## Authentication System

### User Authentication (Firebase)
- Firebase email/password authentication
- `onAuthStateChanged` listener in `App.tsx` — redirects unauthenticated users to `/auth`
- After login, user is taken to `/onboarding` (if first time) or `/dashboard`
- Voter data stored in Zustand with `persist` middleware → survives page refresh
- `onboardingDone` boolean gates access to the app

### Admin Authentication (JWT)
- `POST /api/admin/login` with username + password → returns `access_token` (JWT, 1440 min expiry)
- Token stored in `localStorage` by the Admin page
- Axios interceptor in `client.ts` automatically adds `Authorization: Bearer {token}` header
- `require_admin` FastAPI dependency validates JWT signature on protected endpoints
- Admin password stored as bcrypt hash in `admin_users` table and `.env`

### Data Privacy
- Raw EPIC number is **never stored** — only SHA-256 hash is saved to database
- Firebase auth manages user identity; no PII from ECI is stored beyond the hash

---

## AI Integration (Gemini)

All AI features use **Gemini 2.0 Flash** via the `google-genai` Python SDK.

### Rumour Fact-Checking (`gemini_service.py`)
```python
prompt = f"""
You are an Indian Election Commission fact-checker.
Claim: "{claim}"
Check against known ECI announcements, PIB press releases, and ADR data.
Return JSON: {{"verdict": "TRUE|FALSE|MISLEADING", "explanation": "...", "source": "..."}}
"""
```

### Registration Health Check
- Analyses voter record for name mismatches, duplicate detection, address anomalies
- Returns risk level (low/medium/high) + plain-language issue cards
- Recommends correct form (6, 7, or 8) based on issue type

### Affidavit Parsing
- PyMuPDF extracts text from ECI affidavit PDFs
- Gemini structured output extracts:
  - Criminal cases with section numbers, description, court name
  - Asset totals (movable + immovable) in rupees
  - Education qualification + cross-checking for discrepancies
- Falls back to mock data if PDF parsing fails

### News Classification
- Every scraped article is classified: `is_election_related`, `state_code`, `constituency_code`
- 2-sentence summary generated for push notification body
- Target audience (by state/constituency) determined from content

### Multilingual Translation
- Rumour verdicts, health check explanations, and affidavit summaries auto-translated to Tamil or Hindi based on voter's language preference
- Single Gemini call handles both classification and translation

### AI Chatbot
- Uses ECI knowledge base in system context
- Understands voter card OCR images (multimodal input)
- Conversation history maintained per session

---

## Push Notification System

Three distinct notification layers all funnel through Firebase Cloud Messaging:

### Layer 1 — Admin Broadcast
- Sent manually from `/admin` panel
- Target scopes: **all users**, **by state**, **by constituency**, **by EPIC hash**
- Batch FCM API call using `firebase-admin` SDK
- Pre-built templates: election day reminder, registration deadline, booth change alert

### Layer 2 — Automated News Scraper
- APScheduler runs every **30 minutes**
- Sources scraped: ECI press releases, PIB official news, ADR data updates, Myneta updates
- Gemini classifies relevance + extracts target state/constituency
- If new election-related news found → push notification auto-sent to relevant users
- `notification_sent` flag prevents duplicate notifications per article

### Layer 3 — Personalized Reminders
- APScheduler daily job at 8 AM
- Checks `voter_profiles.election_date` — if tomorrow → send "Tomorrow is election day!" push
- Checks registration deadline in `election_schedule` — if 3 days away → send deadline reminder
- Personalized body includes voter's booth name

### FCM Token Registration
```json
POST /api/notify/fcm/register
{
  "epic_hash": "sha256...",
  "fcm_token": "firebase-token...",
  "state_code": "TN"
}
```

---

## Offline PWA Support

NAMMA VOTE works on election day even without internet.

### Service Worker Strategy (Workbox)
Configured in `vite.config.ts`:

| Resource Type | Cache Strategy | TTL |
|---|---|---|
| App shell (HTML/JS/CSS) | Cache-first | 30 days |
| Voter EPIC data | Network-first with fallback | 7 days |
| Booth address | Cache-first | 7 days |
| Candidate data | Network-first with fallback | 24 hours |
| Documents checklist | Cache-first | 30 days |
| Google Fonts | Cache-first | 365 days |
| Google Maps tiles | Network-only | N/A |

### What Works Offline
- Voter identity details (name, booth number, booth address)
- Voter rights card
- State-specific document checklist
- Emergency contacts (1950, BLO number, ECI control room)
- EVM mock poll explainer
- Mode 2 step-by-step election day guide

### Installation
- Android Chrome: "Add to Home Screen" banner auto-triggered
- iOS Safari: "Share → Add to Home Screen"
- Desktop: Install button in address bar

---

## Multilingual Support

Three languages supported throughout the app:

| Language | Code | Coverage |
|---|---|---|
| English | `en` | 100% — all screens |
| Tamil (தமிழ்) | `ta` | 100% — all screens |
| Hindi (हिन्दी) | `hi` | 100% — all screens |

### Implementation
- `translations.ts` — static string keys for all UI labels, buttons, headings
- `useT()` hook — reads current language from Zustand store, returns translated string
- AI content (rumour verdicts, health checks, affidavit summaries) — Gemini translates dynamically based on language preference
- Language selector on Onboarding screen + changeable in Profile

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 16 (or use Docker Compose — recommended)
- Redis (or use Docker Compose)
- Gemini API key (free tier at [Google AI Studio](https://aistudio.google.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/nammavote.git
cd nammavote
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
```

Edit `.env` and set at minimum:
```
GEMINI_API_KEY=your-key-here
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/nammavote
```

Install and run:
```bash
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend starts at `http://localhost:8000`
Swagger UI at `http://localhost:8000/docs`

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env
```

Edit `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
```

Install and run:
```bash
npm install
npm run dev
```

Frontend starts at `http://localhost:5173`

### 4. Demo Flow

1. Open `http://localhost:5173`
2. Select **English**, sign up / log in
3. Choose persona **Returning Voter**
4. Enter EPIC `ABC1234567` → voter found, booth shown on map
5. Click **See Candidates** → 4 candidates with criminal cases highlighted in red
6. Go to **Is This True?** → paste `"Voting date in Chennai changed to tomorrow"` → FALSE verdict
7. Go to **Help Me Now** → see emergency guide, rights card, complaint flow
8. Open **Profile** → switch language to **Tamil** — UI re-renders in Tamil

---

## Docker Compose Setup

The easiest way to run the full stack locally.

```bash
cp backend/.env.example backend/.env
# Edit backend/.env — add GEMINI_API_KEY at minimum

docker-compose up --build
```

Services started:

| Service | Port | Description |
|---|---|---|
| Frontend | `5173` | React Vite dev server |
| Backend | `8000` | FastAPI (auto-reload) |
| PostgreSQL | `5432` | Database with `pgdata` volume |
| Redis | `6379` | Cache with `redisdata` volume |

Stop everything:
```bash
docker-compose down
```

Remove all data (reset):
```bash
docker-compose down -v
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | `postgresql+asyncpg://user:pass@host:5432/db` |
| `REDIS_URL` | Yes | `redis://localhost:6379` |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GOOGLE_MAPS_API_KEY` | No | Google Cloud Console (booth map) |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | No | Firebase Admin SDK JSON (push notifications) |
| `JWT_SECRET` | Yes | High-entropy random string for JWT signing |
| `ADMIN_USERNAME` | Yes | Admin panel login username |
| `ADMIN_PASSWORD_HASH` | Yes | bcrypt hash of admin password |
| `ALLOWED_ORIGINS` | Yes | Comma-separated CORS origins |
| `DEBUG` | No | `true` / `false` (default: `false`) |

Generate admin password hash:
```bash
python -c "from passlib.context import CryptContext; print(CryptContext(['bcrypt']).hash('yourpassword'))"
```

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Backend URL (e.g. `http://localhost:8000`) |
| `VITE_GOOGLE_MAPS_API_KEY` | No | Google Maps (graceful fallback if missing) |
| `VITE_FIREBASE_API_KEY` | No | Firebase web config (push notifications) |
| `VITE_FIREBASE_AUTH_DOMAIN` | No | Firebase project auth domain |
| `VITE_FIREBASE_PROJECT_ID` | No | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | No | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | No | FCM sender ID |
| `VITE_FIREBASE_APP_ID` | No | Firebase app ID |
| `VITE_FIREBASE_VAPID_KEY` | No | Web push certificate key |

**Minimum viable demo:** Only `VITE_API_BASE_URL` and backend `GEMINI_API_KEY` needed. All 3 core modes work. Maps and push notifications gracefully degrade.

---

## Deployment (Google Cloud Run)

### Required GitHub Secrets

```
GCP_PROJECT_ID
GCP_SA_KEY                    # Service account JSON (base64 encoded)
GEMINI_API_KEY
GOOGLE_MAPS_API_KEY
FIREBASE_SERVICE_ACCOUNT_JSON
DATABASE_URL                  # Production Supabase URL
REDIS_URL                     # Production Redis URL
JWT_SECRET
ADMIN_USERNAME
ADMIN_PASSWORD_HASH
ALLOWED_ORIGINS               # Production frontend URL
VITE_API_BASE_URL             # Production backend URL
VITE_GOOGLE_MAPS_API_KEY
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_VAPID_KEY
```

### Deploy

Push to `main` → GitHub Actions automatically:
1. Builds backend Docker image → pushes to Artifact Registry
2. Builds frontend (static files) → builds nginx image → pushes to Artifact Registry
3. Deploys both to Cloud Run (region: `asia-south1`)
4. Cloud Run serves HTTPS with auto-SSL

### Cloud Run Configuration
- Region: `asia-south1` (Mumbai)
- Min instances: 0 (scales to zero when idle)
- Max instances: 10
- Memory: 512MB
- CPU: 1 vCPU
- Concurrency: 80 requests/instance

### Manual Cloud Run Deploy
```bash
gcloud run deploy nammavote-backend \
  --image asia-south1-docker.pkg.dev/PROJECT_ID/nammavote/backend:latest \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY=$KEY,DATABASE_URL=$DB_URL
```

---

## Admin Panel

Visit `/admin` in the running app.

### Login
- Username and password set via `ADMIN_USERNAME` and `ADMIN_PASSWORD_HASH` in `.env`
- Default demo credentials: `admin` / `nammavote2026`

### Features

**Push Notification Broadcast**
- Target: All users / By state code / By constituency code / Single EPIC
- Pre-built templates:
  - "Election Day Tomorrow" — personalized booth reminder
  - "Last Day to Register" — registration deadline alert
  - "Booth Location Changed" — urgent booth change notice
- View sent notification history

**Token Statistics**
- Total registered devices
- Breakdown by state
- Active vs inactive tokens

**App Statistics**
- Total voter lookups
- Rumours fact-checked today
- Form submissions pending

---

## All Screens & Routes

| Route | Component | Description |
|---|---|---|
| `/` | LandingPage | Welcome screen with 3 mode cards + language selector |
| `/auth` | Auth | Firebase email/password login and signup |
| `/onboarding` | Onboarding | Language → Persona selection → EPIC lookup → Push opt-in |
| `/dashboard` | Dashboard | Home: countdown timer, latest news, quick-action cards |
| `/mode1` | Mode1 | Pre-election 5-step wizard |
| `/mode1/booth` | BoothMap | Google Maps booth finder with turn-by-turn directions |
| `/mode1/candidates` | Candidates | Candidate intelligence cards (criminal, assets, education) |
| `/mode1/documents` | ElectionChecklist | State-specific document checklist |
| `/mode1/forms` | Mode1Forms | Form 6/7/8 application wizard |
| `/mode2` | Mode2 | Election day live guidance and emergency flow |
| `/mode3` | Mode3 | Rumour Buster: fact-check + shareable verdict card |
| `/my-constituency` | MyConstituency | Local candidates + election history |
| `/candidates` | Candidates | All constituency candidates |
| `/constituency-history` | ConstituencyHistory | Past results, NOTA, turnout charts |
| `/profile` | Profile | Voter data, language, persona, FCM settings, logout |
| `/notifications` | Notifications | Push notification history (last 50) |
| `/help-rights` | HelpRights | Voter rights card + helpline numbers |
| `/accessibility` | Accessibility | PwD guide: ramp, braille EVM, women-only queues |
| `/postal-ballot` | PostalBallot | Migrant and senior voter postal ballot guide |
| `/cvigil` | CVigil | Money/gift/MCC violation reporting guide + CVigil app |
| `/evm-explainer` | EVMExplainer | EVM + VVPAT guide, myth busting |
| `/mock-evm` | MockEVM | Interactive touchscreen EVM simulator |
| `/glossary` | Glossary | 60+ election terms in plain language |
| `/pledge-card` | PledgeCard | Voter pledge to fight misinformation (shareable) |
| `/election-checklist` | ElectionChecklist | Full election day preparation checklist |
| `/policy-quiz` | PolicyQuiz | 15-question voter education interactive quiz |
| `/manifesto-search` | ManifestoSearch | Party manifesto keyword search |
| `/admin` | Admin | Admin broadcast panel (JWT-protected) |

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                     React PWA (Frontend)                       │
│  Zustand Store │ TanStack Query │ Firebase Auth │ Workbox SW  │
└──────────────────────────┬───────────────────────────────────┘
                           │ HTTPS REST
┌──────────────────────────▼───────────────────────────────────┐
│                    FastAPI (Backend)                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Voter   │  │ Rumour   │  │Candidates│  │Notifications│  │
│  │  Router  │  │  Router  │  │  Router  │  │   Router    │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │              │              │                │         │
│  ┌────▼──────────────▼──────────────▼────────────────▼─────┐  │
│  │                   Services Layer                         │  │
│  │  eci_service │ gemini_service │ fcm_service │ scraper   │  │
│  └────┬──────────────────┬───────────────────────┬─────────┘  │
│       │                  │                       │             │
│  ┌────▼────┐  ┌──────────▼────────┐  ┌──────────▼──────────┐  │
│  │  PostgreSQL│  │ Gemini 2.0 Flash  │  │  Firebase FCM       │  │
│  │ (Supabase)│  │  (Google AI)      │  │  (Push Notif.)      │  │
│  └──────────┘  └───────────────────┘  └─────────────────────┘  │
│                                                                  │
│  ┌──────────┐  ┌──────────────────┐                             │
│  │  Redis   │  │  APScheduler     │                             │
│  │ (Cache)  │  │  30-min scraper  │                             │
│  └──────────┘  │  Daily reminders │                             │
│                └──────────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Security

| Concern | Implementation |
|---|---|
| EPIC privacy | Raw EPIC never stored — SHA-256 hash only |
| Admin routes | JWT Bearer token with expiry |
| User passwords | bcrypt via Passlib (12 rounds) |
| Admin passwords | bcrypt hash in `.env` only |
| CORS | Whitelist-only (no wildcard in production) |
| Transport | HTTPS enforced on Cloud Run |
| Firebase auth | Token ID verified server-side on protected routes |
| SQL injection | SQLAlchemy ORM + parameterized queries only |
| XSS | React escapes all dynamic content by default |
| Secrets | All keys in `.env` (excluded from git via `.gitignore`) |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "Add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

### Local Development Tips
- Backend auto-reloads on file save (`--reload` flag in uvicorn)
- Frontend HMR via Vite
- Seed data auto-loads on backend startup (includes demo EPIC `ABC1234567`)
- Gemini key missing → rumour check returns mock verdicts for demo purposes
- Maps key missing → booth map shows booth address as text with a "View in Maps" link

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

*NAMMA VOTE — நம்ம வோட் | Every Vote. Informed. Protected.*
*PromptWars Virtual Challenge 2 — Submission: May 3, 2026*

"""
NAMMA VOTE — Database Seeder
Populates Candidate and ElectionSchedule tables with realistic 2026 Indian election data.
Run automatically on startup via main.py lifespan.
"""
import asyncio
from datetime import date
from sqlalchemy import select, text
from database import AsyncSessionLocal
from models import Candidate, ElectionSchedule, ElectionHistory

# ─── Election Schedule (7 phases, 2026 general elections) ─────────────────────
SCHEDULE_DATA = [
    # Phase 1 — South India
    { "state_code": "TN", "state_name": "Tamil Nadu", "constituency_code": "163", "constituency_name": "Velachery", "phase_number": 1, "election_date": date(2026, 5, 3), "counting_date": date(2026, 5, 5), "registration_deadline": date(2026, 3, 15) },
    { "state_code": "TN", "state_name": "Tamil Nadu", "constituency_code": "165", "constituency_name": "Adyar", "phase_number": 1, "election_date": date(2026, 5, 3), "counting_date": date(2026, 5, 5), "registration_deadline": date(2026, 3, 15) },
    { "state_code": "TN", "state_name": "Tamil Nadu", "constituency_code": "161", "constituency_name": "Anna Nagar", "phase_number": 1, "election_date": date(2026, 5, 3), "counting_date": date(2026, 5, 5), "registration_deadline": date(2026, 3, 15) },
    { "state_code": "TN", "state_name": "Tamil Nadu", "constituency_code": "170", "constituency_name": "Madurai East", "phase_number": 1, "election_date": date(2026, 5, 3), "counting_date": date(2026, 5, 5), "registration_deadline": date(2026, 3, 15) },
    { "state_code": "TN", "state_name": "Tamil Nadu", "constituency_code": "155", "constituency_name": "Coimbatore North", "phase_number": 1, "election_date": date(2026, 5, 3), "counting_date": date(2026, 5, 5), "registration_deadline": date(2026, 3, 15) },
    { "state_code": "AP", "state_name": "Andhra Pradesh", "constituency_code": "AP042", "constituency_name": "Vijayawada West", "phase_number": 1, "election_date": date(2026, 5, 3), "counting_date": date(2026, 5, 5), "registration_deadline": date(2026, 3, 15) },
    # Phase 2 — Karnataka, Kerala
    { "state_code": "KA", "state_name": "Karnataka", "constituency_code": "KA151", "constituency_name": "Bangalore South", "phase_number": 2, "election_date": date(2026, 5, 10), "counting_date": date(2026, 5, 13), "registration_deadline": date(2026, 3, 22) },
    { "state_code": "KA", "state_name": "Karnataka", "constituency_code": "KA152", "constituency_name": "Bangalore North", "phase_number": 2, "election_date": date(2026, 5, 10), "counting_date": date(2026, 5, 13), "registration_deadline": date(2026, 3, 22) },
    # Phase 3 — Maharashtra
    { "state_code": "MH", "state_name": "Maharashtra", "constituency_code": "MH183", "constituency_name": "Bandra West", "phase_number": 3, "election_date": date(2026, 5, 17), "counting_date": date(2026, 5, 20), "registration_deadline": date(2026, 3, 29) },
    { "state_code": "MH", "state_name": "Maharashtra", "constituency_code": "MH220", "constituency_name": "Pune East", "phase_number": 3, "election_date": date(2026, 5, 17), "counting_date": date(2026, 5, 20), "registration_deadline": date(2026, 3, 29) },
    # Phase 7 — Delhi
    { "state_code": "DL", "state_name": "Delhi", "constituency_code": "DL001", "constituency_name": "New Delhi", "phase_number": 7, "election_date": date(2026, 6, 1), "counting_date": date(2026, 6, 4), "registration_deadline": date(2026, 4, 13) },
    { "state_code": "DL", "state_name": "Delhi", "constituency_code": "DL050", "constituency_name": "Chandni Chowk", "phase_number": 7, "election_date": date(2026, 6, 1), "counting_date": date(2026, 6, 4), "registration_deadline": date(2026, 4, 13) },
    # UP
    { "state_code": "UP", "state_name": "Uttar Pradesh", "constituency_code": "UP300", "constituency_name": "Lucknow East", "phase_number": 5, "election_date": date(2026, 5, 24), "counting_date": date(2026, 5, 27), "registration_deadline": date(2026, 4, 5) },
    # WB
    { "state_code": "WB", "state_name": "West Bengal", "constituency_code": "WB042", "constituency_name": "Kolkata North", "phase_number": 6, "election_date": date(2026, 5, 28), "counting_date": date(2026, 6, 1), "registration_deadline": date(2026, 4, 9) },
    # GJ
    { "state_code": "GJ", "state_name": "Gujarat", "constituency_code": "GJ120", "constituency_name": "Ahmedabad East", "phase_number": 4, "election_date": date(2026, 5, 20), "counting_date": date(2026, 5, 23), "registration_deadline": date(2026, 4, 1) },
]

# ─── Candidates (per state/constituency/year) ─────────────────────────────────
CANDIDATES_DATA = [
    # TN Velachery (163) ─────────────────────────────────
    { "state_code": "TN", "constituency_code": "163", "election_year": 2026, "name": "A. MURUGESAN", "party": "Dravida Munnetra Kazhagam", "party_short": "DMK", "serial_number": 1, "criminal_cases": [{"section": "IPC 188", "description": "Disobedience to order of public servant", "court": "Metropolitan Magistrate, Chennai", "year": 2019}], "total_assets_inr": 4500000, "assets_detail": {"movable": 1200000, "immovable": 3300000, "bank_balance": 450000, "vehicles": 1}, "education": "B.A. Political Science, University of Madras (1998)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/murugesan.pdf" },
    { "state_code": "TN", "constituency_code": "163", "election_year": 2026, "name": "R. SELVAM", "party": "All India Anna Dravida Munnetra Kazhagam", "party_short": "AIADMK", "serial_number": 2, "criminal_cases": [{"section": "IPC 420", "description": "Cheating and inducing delivery of property", "court": "Sessions Court, Chennai", "year": 2021}, {"section": "IPC 307", "description": "Attempt to murder", "court": "High Court of Madras", "year": 2018}], "total_assets_inr": 220000000, "assets_detail": {"movable": 45000000, "immovable": 175000000, "bank_balance": 12000000, "vehicles": 4}, "education": "SSLC — claims M.A. (unverifiable from public records)", "education_discrepancy": True, "affidavit_url": "https://affidavit.eci.gov.in/mock/selvam.pdf" },
    { "state_code": "TN", "constituency_code": "163", "election_year": 2026, "name": "K. ANITHA", "party": "Naam Tamilar Katchi", "party_short": "NTK", "serial_number": 3, "criminal_cases": [], "total_assets_inr": 850000, "assets_detail": {"movable": 350000, "immovable": 500000, "bank_balance": 120000, "vehicles": 0}, "education": "M.Sc. Mathematics, Bharathidasan University (2008)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/anitha.pdf" },
    { "state_code": "TN", "constituency_code": "163", "election_year": 2026, "name": "P. SURESH BABU", "party": "Independent", "party_short": "IND", "serial_number": 4, "criminal_cases": [], "total_assets_inr": 1200000, "assets_detail": {"movable": 400000, "immovable": 800000, "bank_balance": 85000, "vehicles": 1}, "education": "B.Com, Madras Christian College (2001)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/suresh.pdf" },

    # TN Adyar (165) ─────────────────────────────────────
    { "state_code": "TN", "constituency_code": "165", "election_year": 2026, "name": "S. JAYASHREE", "party": "Dravida Munnetra Kazhagam", "party_short": "DMK", "serial_number": 1, "criminal_cases": [], "total_assets_inr": 2800000, "assets_detail": {"movable": 800000, "immovable": 2000000, "bank_balance": 320000, "vehicles": 1}, "education": "M.A. Economics, Presidency College, Chennai (2004)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/jayashree.pdf" },
    { "state_code": "TN", "constituency_code": "165", "election_year": 2026, "name": "T. BALAMURALI", "party": "All India Anna Dravida Munnetra Kazhagam", "party_short": "AIADMK", "serial_number": 2, "criminal_cases": [{"section": "IPC 341", "description": "Wrongful restraint", "court": "Metropolitan Magistrate, Chennai", "year": 2020}], "total_assets_inr": 38000000, "assets_detail": {"movable": 8000000, "immovable": 30000000, "bank_balance": 2500000, "vehicles": 2}, "education": "B.E. Civil Engineering, Anna University (1996)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/balamurali.pdf" },
    { "state_code": "TN", "constituency_code": "165", "election_year": 2026, "name": "V. RANJITH KUMAR", "party": "Bharatiya Janata Party", "party_short": "BJP", "serial_number": 3, "criminal_cases": [], "total_assets_inr": 5200000, "assets_detail": {"movable": 1500000, "immovable": 3700000, "bank_balance": 680000, "vehicles": 1}, "education": "B.Sc. Computer Science, Madras University (2003)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/ranjith.pdf" },
    { "state_code": "TN", "constituency_code": "165", "election_year": 2026, "name": "M. DEEPIKA", "party": "Indian National Congress", "party_short": "INC", "serial_number": 4, "criminal_cases": [], "total_assets_inr": 950000, "assets_detail": {"movable": 350000, "immovable": 600000, "bank_balance": 95000, "vehicles": 0}, "education": "M.B.A., Loyola Institute of Business Administration (2010)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/deepika.pdf" },

    # TN Anna Nagar (161) ─────────────────────────────────
    { "state_code": "TN", "constituency_code": "161", "election_year": 2026, "name": "G. PARTHASARATHY", "party": "Dravida Munnetra Kazhagam", "party_short": "DMK", "serial_number": 1, "criminal_cases": [], "total_assets_inr": 9800000, "assets_detail": {"movable": 2800000, "immovable": 7000000, "bank_balance": 1100000, "vehicles": 2}, "education": "M.A. Tamil Literature, University of Madras (1995)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/parthasarathy.pdf" },
    { "state_code": "TN", "constituency_code": "161", "election_year": 2026, "name": "N. RAJENDRAN", "party": "All India Anna Dravida Munnetra Kazhagam", "party_short": "AIADMK", "serial_number": 2, "criminal_cases": [{"section": "IPC 504", "description": "Intentional insult with intent to provoke", "court": "Judicial Magistrate, Chennai", "year": 2022}], "total_assets_inr": 75000000, "assets_detail": {"movable": 15000000, "immovable": 60000000, "bank_balance": 4500000, "vehicles": 3}, "education": "SSLC", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/rajendran.pdf" },
    { "state_code": "TN", "constituency_code": "161", "election_year": 2026, "name": "L. KAVITHA", "party": "Naam Tamilar Katchi", "party_short": "NTK", "serial_number": 3, "criminal_cases": [], "total_assets_inr": 720000, "assets_detail": {"movable": 220000, "immovable": 500000, "bank_balance": 85000, "vehicles": 0}, "education": "B.A. History, Stella Maris College (2012)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/kavitha.pdf" },
    { "state_code": "TN", "constituency_code": "161", "election_year": 2026, "name": "B. ARUNKUMAR", "party": "Independent", "party_short": "IND", "serial_number": 4, "criminal_cases": [], "total_assets_inr": 480000, "assets_detail": {"movable": 180000, "immovable": 300000, "bank_balance": 42000, "vehicles": 0}, "education": "ITI Certificate, Government Industrial Training Institute (2006)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/arunkumar.pdf" },

    # MH Bandra West (MH183) ──────────────────────────────
    { "state_code": "MH", "constituency_code": "MH183", "election_year": 2026, "name": "ADITYA THACKERAY", "party": "Shiv Sena (Uddhav Balasaheb Thackeray)", "party_short": "SS-UBT", "serial_number": 1, "criminal_cases": [], "total_assets_inr": 485000000, "assets_detail": {"movable": 85000000, "immovable": 400000000, "bank_balance": 22000000, "vehicles": 3}, "education": "B.A. History, University of Mumbai (2015)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/aditya.pdf" },
    { "state_code": "MH", "constituency_code": "MH183", "election_year": 2026, "name": "TRUPTI SAWANT", "party": "Bharatiya Janata Party", "party_short": "BJP", "serial_number": 2, "criminal_cases": [], "total_assets_inr": 28000000, "assets_detail": {"movable": 8000000, "immovable": 20000000, "bank_balance": 3200000, "vehicles": 2}, "education": "B.Com, Sydenham College (2004)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/trupti.pdf" },
    { "state_code": "MH", "constituency_code": "MH183", "election_year": 2026, "name": "ROHIT KAMBLE", "party": "Indian National Congress", "party_short": "INC", "serial_number": 3, "criminal_cases": [{"section": "IPC 143", "description": "Member of unlawful assembly", "court": "Metropolitan Magistrate Mumbai", "year": 2021}], "total_assets_inr": 4200000, "assets_detail": {"movable": 1200000, "immovable": 3000000, "bank_balance": 450000, "vehicles": 1}, "education": "B.A. Political Science, Mumbai University (2008)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/rohit.pdf" },
    { "state_code": "MH", "constituency_code": "MH183", "election_year": 2026, "name": "SUNITA NAIK", "party": "Aam Aadmi Party", "party_short": "AAP", "serial_number": 4, "criminal_cases": [], "total_assets_inr": 1800000, "assets_detail": {"movable": 600000, "immovable": 1200000, "bank_balance": 185000, "vehicles": 1}, "education": "M.A. Social Work, TISS Mumbai (2011)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/sunita.pdf" },

    # DL New Delhi (DL001) ────────────────────────────────
    { "state_code": "DL", "constituency_code": "DL001", "election_year": 2026, "name": "ARVIND KEJRIWAL", "party": "Aam Aadmi Party", "party_short": "AAP", "serial_number": 1, "criminal_cases": [{"section": "Prevention of Corruption Act", "description": "Alleged corruption in liquor policy case", "court": "Sessions Court, Delhi", "year": 2023}], "total_assets_inr": 3200000, "assets_detail": {"movable": 1200000, "immovable": 2000000, "bank_balance": 580000, "vehicles": 0}, "education": "B.Tech. Mechanical Engineering, IIT Kharagpur (1989)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/kejriwal.pdf" },
    { "state_code": "DL", "constituency_code": "DL001", "election_year": 2026, "name": "PARVESH VERMA", "party": "Bharatiya Janata Party", "party_short": "BJP", "serial_number": 2, "criminal_cases": [], "total_assets_inr": 186000000, "assets_detail": {"movable": 36000000, "immovable": 150000000, "bank_balance": 8500000, "vehicles": 4}, "education": "B.Sc., Delhi University (2000)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/parvesh.pdf" },
    { "state_code": "DL", "constituency_code": "DL001", "election_year": 2026, "name": "SANDEEP DIKSHIT", "party": "Indian National Congress", "party_short": "INC", "serial_number": 3, "criminal_cases": [], "total_assets_inr": 42000000, "assets_detail": {"movable": 12000000, "immovable": 30000000, "bank_balance": 3800000, "vehicles": 2}, "education": "M.A. History, St. Stephen's College, Delhi (1989)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/dikshit.pdf" },
    { "state_code": "DL", "constituency_code": "DL001", "election_year": 2026, "name": "MEERA GUPTA", "party": "Independent", "party_short": "IND", "serial_number": 4, "criminal_cases": [], "total_assets_inr": 950000, "assets_detail": {"movable": 350000, "immovable": 600000, "bank_balance": 95000, "vehicles": 0}, "education": "B.Ed., Delhi University (2005)", "education_discrepancy": False, "affidavit_url": "https://affidavit.eci.gov.in/mock/meera.pdf" },
]

# ─── Election History (past results by constituency) ──────────────────────────
HISTORY_DATA = [
    # TN Velachery (163)
    { "state_code": "TN", "constituency_code": "163", "constituency_name": "Velachery", "election_year": 2021, "winner_name": "S. THIRUNAVUKKARASAR", "winner_party": "Dravida Munnetra Kazhagam", "winner_party_short": "DMK", "winner_votes": 68450, "margin": 12840, "turnout_pct": "71.2", "nota_votes": 1247, "nota_pct": "1.8", "swing_note": "DMK stronghold with AIADMK competitive in 2016", "insight": "Margin under 15,000 — this is a competitive seat. Turnout above 70% historically." },
    { "state_code": "TN", "constituency_code": "163", "constituency_name": "Velachery", "election_year": 2016, "winner_name": "J. ANANDHA BALAJI", "winner_party": "All India Anna Dravida Munnetra Kazhagam", "winner_party_short": "AIADMK", "winner_votes": 58320, "margin": 4210, "turnout_pct": "68.5", "nota_votes": 892, "nota_pct": "1.5", "swing_note": "DMK stronghold with AIADMK competitive in 2016", "insight": "Margin under 15,000 — this is a competitive seat. Turnout above 70% historically." },
    { "state_code": "TN", "constituency_code": "163", "constituency_name": "Velachery", "election_year": 2011, "winner_name": "R. RAJESH", "winner_party": "Dravida Munnetra Kazhagam", "winner_party_short": "DMK", "winner_votes": 61200, "margin": 8900, "turnout_pct": "72.1", "nota_votes": None, "nota_pct": None, "swing_note": "DMK stronghold with AIADMK competitive in 2016", "insight": "Margin under 15,000 — this is a competitive seat. Turnout above 70% historically." },

    # TN Adyar (165)
    { "state_code": "TN", "constituency_code": "165", "constituency_name": "Adyar", "election_year": 2021, "winner_name": "R. MAHESH KUMAR", "winner_party": "Bharatiya Janata Party", "winner_party_short": "BJP", "winner_votes": 52100, "margin": 6300, "turnout_pct": "67.8", "nota_votes": 980, "nota_pct": "1.9", "swing_note": "Urban seat — three-party competition between BJP, DMK, AIADMK", "insight": "BJP has been gaining ground in this urban constituency since 2016." },
    { "state_code": "TN", "constituency_code": "165", "constituency_name": "Adyar", "election_year": 2016, "winner_name": "A. KRISHNA MOORTHY", "winner_party": "All India Anna Dravida Munnetra Kazhagam", "winner_party_short": "AIADMK", "winner_votes": 49800, "margin": 3100, "turnout_pct": "65.2", "nota_votes": 743, "nota_pct": "1.5", "swing_note": "Urban seat — three-party competition between BJP, DMK, AIADMK", "insight": "BJP has been gaining ground in this urban constituency since 2016." },
    { "state_code": "TN", "constituency_code": "165", "constituency_name": "Adyar", "election_year": 2011, "winner_name": "S. KARUNANIDHI", "winner_party": "Dravida Munnetra Kazhagam", "winner_party_short": "DMK", "winner_votes": 54300, "margin": 9200, "turnout_pct": "69.4", "nota_votes": None, "nota_pct": None, "swing_note": "Urban seat — three-party competition between BJP, DMK, AIADMK", "insight": "BJP has been gaining ground in this urban constituency since 2016." },

    # TN Anna Nagar (161)
    { "state_code": "TN", "constituency_code": "161", "constituency_name": "Anna Nagar", "election_year": 2021, "winner_name": "P. K. SEKAR BABU", "winner_party": "Dravida Munnetra Kazhagam", "winner_party_short": "DMK", "winner_votes": 61800, "margin": 9200, "turnout_pct": "70.5", "nota_votes": 1100, "nota_pct": "1.8", "swing_note": "Residential constituency — middle-class voter base, DMK consolidating", "insight": "High-density urban area — voter turnout consistently above 70%." },
    { "state_code": "TN", "constituency_code": "161", "constituency_name": "Anna Nagar", "election_year": 2016, "winner_name": "M. K. STALIN", "winner_party": "Dravida Munnetra Kazhagam", "winner_party_short": "DMK", "winner_votes": 55400, "margin": 6700, "turnout_pct": "67.3", "nota_votes": 870, "nota_pct": "1.6", "swing_note": "Residential constituency — middle-class voter base, DMK consolidating", "insight": "High-density urban area — voter turnout consistently above 70%." },
    { "state_code": "TN", "constituency_code": "161", "constituency_name": "Anna Nagar", "election_year": 2011, "winner_name": "T. SUBRAMANIAN", "winner_party": "All India Anna Dravida Munnetra Kazhagam", "winner_party_short": "AIADMK", "winner_votes": 58200, "margin": 4100, "turnout_pct": "71.8", "nota_votes": None, "nota_pct": None, "swing_note": "Residential constituency — middle-class voter base, DMK consolidating", "insight": "High-density urban area — voter turnout consistently above 70%." },

    # MH Bandra West (MH183)
    { "state_code": "MH", "constituency_code": "MH183", "constituency_name": "Bandra West", "election_year": 2019, "winner_name": "ADITYA THACKERAY", "winner_party": "Shiv Sena", "winner_party_short": "SS", "winner_votes": 89248, "margin": 67427, "turnout_pct": "53.1", "nota_votes": 1342, "nota_pct": "1.5", "swing_note": "Shiv Sena stronghold; Aditya Thackeray's debut win", "insight": "Celebrity-driven seat — large margin reflects Thackeray family influence in Bandra." },
    { "state_code": "MH", "constituency_code": "MH183", "constituency_name": "Bandra West", "election_year": 2014, "winner_name": "BALA NANDGAONKAR", "winner_party": "Shiv Sena", "winner_party_short": "SS", "winner_votes": 68120, "margin": 28450, "turnout_pct": "50.2", "nota_votes": 980, "nota_pct": "1.4", "swing_note": "Shiv Sena stronghold; Aditya Thackeray's debut win", "insight": "Celebrity-driven seat — large margin reflects Thackeray family influence in Bandra." },

    # DL New Delhi (DL001)
    { "state_code": "DL", "constituency_code": "DL001", "constituency_name": "New Delhi", "election_year": 2020, "winner_name": "ARVIND KEJRIWAL", "winner_party": "Aam Aadmi Party", "winner_party_short": "AAP", "winner_votes": 47717, "margin": 21697, "turnout_pct": "62.6", "nota_votes": 892, "nota_pct": "1.9", "swing_note": "AAP stronghold — Kejriwal's home constituency; BJP competitive since 2022", "insight": "High-profile seat — national attention each election cycle. Turnout ~62-65%." },
    { "state_code": "DL", "constituency_code": "DL001", "constituency_name": "New Delhi", "election_year": 2015, "winner_name": "ARVIND KEJRIWAL", "winner_party": "Aam Aadmi Party", "winner_party_short": "AAP", "winner_votes": 52050, "margin": 31583, "turnout_pct": "67.1", "nota_votes": 1124, "nota_pct": "2.2", "swing_note": "AAP stronghold — Kejriwal's home constituency; BJP competitive since 2022", "insight": "High-profile seat — national attention each election cycle. Turnout ~62-65%." },
    { "state_code": "DL", "constituency_code": "DL001", "constituency_name": "New Delhi", "election_year": 2013, "winner_name": "ARVIND KEJRIWAL", "winner_party": "Aam Aadmi Party", "winner_party_short": "AAP", "winner_votes": 25864, "margin": 3096, "turnout_pct": "64.7", "nota_votes": None, "nota_pct": None, "swing_note": "AAP stronghold — Kejriwal's home constituency; BJP competitive since 2022", "insight": "High-profile seat — national attention each election cycle. Turnout ~62-65%." },

    # KA Bangalore South (KA151)
    { "state_code": "KA", "constituency_code": "KA151", "constituency_name": "Bangalore South", "election_year": 2023, "winner_name": "M. KRISHNAPPA", "winner_party": "Indian National Congress", "winner_party_short": "INC", "winner_votes": 62840, "margin": 8420, "turnout_pct": "61.2", "nota_votes": 1456, "nota_pct": "2.3", "swing_note": "INC victory in 2023 wave; BJP competitive historically", "insight": "Urban professional constituency — high NOTA votes signal voter dissatisfaction with established parties." },
    { "state_code": "KA", "constituency_code": "KA151", "constituency_name": "Bangalore South", "election_year": 2018, "winner_name": "B. S. YEDIYURAPPA", "winner_party": "Bharatiya Janata Party", "winner_party_short": "BJP", "winner_votes": 68400, "margin": 12300, "turnout_pct": "59.8", "nota_votes": 1200, "nota_pct": "1.8", "swing_note": "INC victory in 2023 wave; BJP competitive historically", "insight": "Urban professional constituency — high NOTA votes signal voter dissatisfaction with established parties." },

    # UP Lucknow East (UP300)
    { "state_code": "UP", "constituency_code": "UP300", "constituency_name": "Lucknow East", "election_year": 2022, "winner_name": "ASHUTOSH TANDON", "winner_party": "Bharatiya Janata Party", "winner_party_short": "BJP", "winner_votes": 87420, "margin": 34210, "turnout_pct": "58.4", "nota_votes": 2100, "nota_pct": "2.4", "swing_note": "BJP stronghold — Lucknow urban seats dominated since 2017", "insight": "State capital seat — BJP winning by large margins since 2017 wave." },
    { "state_code": "UP", "constituency_code": "UP300", "constituency_name": "Lucknow East", "election_year": 2017, "winner_name": "ASHUTOSH TANDON", "winner_party": "Bharatiya Janata Party", "winner_party_short": "BJP", "winner_votes": 92100, "margin": 42800, "turnout_pct": "61.2", "nota_votes": 1890, "nota_pct": "2.1", "swing_note": "BJP stronghold — Lucknow urban seats dominated since 2017", "insight": "State capital seat — BJP winning by large margins since 2017 wave." },
]


async def seed_db():
    """Seed the database with election schedule and candidate data. Idempotent."""
    async with AsyncSessionLocal() as session:
        # ── Election Schedule ──────────────────────────────────────
        existing_count = (await session.execute(
            select(ElectionSchedule).limit(1)
        )).scalars().first()

        if not existing_count:
            for s in SCHEDULE_DATA:
                session.add(ElectionSchedule(**s))
            await session.commit()
            print(f"[Seed] Inserted {len(SCHEDULE_DATA)} election schedule records")
        else:
            print("[Seed] Election schedule already seeded — skipping")

        # ── Candidates ─────────────────────────────────────────────
        existing_cand = (await session.execute(
            select(Candidate).limit(1)
        )).scalars().first()

        if not existing_cand:
            for c in CANDIDATES_DATA:
                session.add(Candidate(**c))
            await session.commit()
            print(f"[Seed] Inserted {len(CANDIDATES_DATA)} candidate records")
        else:
            print("[Seed] Candidates already seeded — skipping")

        # ── Election History ───────────────────────────────────────
        existing_hist = (await session.execute(
            select(ElectionHistory).limit(1)
        )).scalars().first()

        if not existing_hist:
            for h in HISTORY_DATA:
                session.add(ElectionHistory(**h))
            await session.commit()
            print(f"[Seed] Inserted {len(HISTORY_DATA)} election history records")
        else:
            print("[Seed] Election history already seeded — skipping")

if __name__ == "__main__":
    asyncio.run(seed_db())

import React, { useState } from 'react'

const SECTION_ICONS: Record<string, React.ReactNode> = {
  pwd: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="4" r="1.5"/>
      <path d="M7 21l2-8M12 8v5l3 4"/>
      <path d="M9 13h6l1 4"/>
    </svg>
  ),
  senior: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 20v-2a6 6 0 0112 0v2"/>
    </svg>
  ),
  blind: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  transgender: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="11" r="5"/>
      <path d="M12 16v6M9 19h6"/>
    </svg>
  ),
  firsttime: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
}

const SECTION_GRADIENTS: Record<string, string> = {
  pwd:         'linear-gradient(145deg, #6BB5FF 0%, #1565C0 100%)',
  senior:      'linear-gradient(145deg, #5DD6A3 0%, #1B7C55 100%)',
  blind:       'linear-gradient(145deg, #FCD34D 0%, #B45309 100%)',
  transgender: 'linear-gradient(145deg, #C084FC 0%, #6D28D9 100%)',
  firsttime:   'linear-gradient(145deg, #5DD6A3 0%, #1B7C55 100%)',
}

const ITEM_ICONS: Record<string, React.ReactNode> = {
  build: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="3" width="20" height="18" rx="2"/>
      <path d="M8 21v-4M16 21v-4M2 13h20"/>
    </svg>
  ),
  person: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/>
      <path d="M6 20v-2a6 6 0 0112 0v2"/>
    </svg>
  ),
  queue: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  braille: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="6" cy="6" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="18" cy="6" r="2"/>
      <circle cx="6" cy="12" r="2"/><circle cx="18" cy="12" r="2"/>
      <circle cx="6" cy="18" r="2"/><circle cx="12" cy="18" r="2"/>
    </svg>
  ),
  wheelchair: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="4" r="1.5"/>
      <path d="M7 21l2-8M12 8v5l3 4"/>
      <path d="M9 13h6l1 4"/>
    </svg>
  ),
  home: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  clipboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
      <line x1="8" y1="11" x2="16" y2="11"/>
      <line x1="8" y1="16" x2="12" y2="16"/>
    </svg>
  ),
  phone: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
    </svg>
  ),
  sound: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 010 7.07"/>
      <path d="M19.07 4.93a10 10 0 010 14.14"/>
    </svg>
  ),
  bookmark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
    </svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  id: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <path d="M16 10h2M16 14h2M8 10a2 2 0 100 4 2 2 0 000-4"/>
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  edit: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  pin: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  pen: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 19l7-7 3 3-7 7-3-3zM18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    </svg>
  ),
  ink: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 2a10 10 0 00-6.88 17.19C7 21 8 22 10 22h4c2 0 3-1 4.88-2.81A10 10 0 0012 2z"/>
      <path d="M12 8v8M8 12h8"/>
    </svg>
  ),
  ballot: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
}

// Map emoji icon strings to SVG icon keys
function getItemIcon(iconStr: string): React.ReactNode {
  const map: Record<string, keyof typeof ITEM_ICONS> = {
    '🏗️': 'build',
    '🤝': 'person',
    '⏩': 'queue',
    '🔤': 'braille',
    '🪑': 'wheelchair',
    '🏠': 'home',
    '📋': 'clipboard',
    '📞': 'phone',
    '🔊': 'sound',
    '🔖': 'bookmark',
    '✅': 'check',
    '🪪': 'id',
    '⚖️': 'shield',
    '📝': 'edit',
    '📍': 'pin',
    '✍️': 'pen',
    '🖨️': 'ink',
    '🗳️': 'ballot',
    '1️⃣': 'info',
    '2️⃣': 'info',
    '3️⃣': 'info',
  }
  const key = map[iconStr]
  return key ? ITEM_ICONS[key] : ITEM_ICONS['info']
}

const SECTIONS = [
  {
    id: 'pwd',
    title: 'PwD Voter Rights',
    color: 'var(--blue)',
    items: [
      { icon: '🏗️', title: 'Ramp Access Guaranteed', text: 'Every polling station must have ramp access. If absent, report to the Presiding Officer — it is a mandatory ECI requirement.' },
      { icon: '🤝', title: 'Right to a Companion', text: 'Any PwD voter may bring one companion of their choice inside the booth to assist with voting. The companion must be 18+ and on the electoral roll.' },
      { icon: '⏩', title: 'Priority Queue', text: 'PwD and senior voters have the legal right to enter the booth ahead of the regular queue. Show your PwD certificate or simply inform the officer.' },
      { icon: '🔤', title: 'Braille EVM Available', text: 'Braille stickers on the ballot unit allow blind voters to identify candidate buttons independently. Request this at the booth if not already set up.' },
      { icon: '🪑', title: 'Wheelchair & Assistance', text: 'Wheelchairs must be provided at the booth. You may also request a postal ballot if you are unable to physically travel — apply through your BLO.' },
    ],
  },
  {
    id: 'senior',
    title: '85+ / Senior Voters',
    color: '#52B788',
    items: [
      { icon: '🏠', title: 'Home Voting Facility', text: 'Voters aged 85 and above are entitled to vote from home via postal ballot. Apply through your Booth Level Officer (BLO) before the deadline — usually 5 days before election.' },
      { icon: '📋', title: 'How to Apply', text: '1. Contact your BLO or nearest ERO office.\n2. Fill Form 12D (available at ERO or voters.eci.gov.in).\n3. Submit before the announced deadline.\n4. A polling team will visit your home on election day.' },
      { icon: '📞', title: 'BLO Contact', text: "Call 1950 to get your BLO's phone number. Your BLO is the first point of contact for all accessibility assistance." },
      { icon: '⏩', title: 'Priority at Booth', text: 'If you choose to vote in person, you are entitled to priority queue access. Inform the booth officer on arrival.' },
    ],
  },
  {
    id: 'blind',
    title: 'Blind Voter — Braille EVM Guide',
    color: 'var(--warning)',
    items: [
      { icon: '1️⃣', title: 'Enter Booth', text: 'Inform the Presiding Officer you are a blind voter. They will confirm Braille stickers are on the ballot unit and verbally confirm the button layout if needed.' },
      { icon: '2️⃣', title: 'Locate the Ballot Unit', text: 'The ballot unit has a column of buttons. Each button has a Braille label with the candidate number. Buttons are arranged top to bottom — candidate 1 at top.' },
      { icon: '3️⃣', title: 'Press Your Button', text: "Feel each button. When you find your candidate's number, press the button firmly once. A beep confirms the vote has been registered." },
      { icon: '🔊', title: 'Beep Meanings', text: 'One short beep = vote registered successfully.\nNo beep = button not pressed firmly enough, try again.\nLong beep = EVM locked (another vote being cast), wait for the green light.' },
      { icon: '🔖', title: 'VVPAT Confirmation', text: 'The VVPAT machine next to the EVM displays a paper slip for 7 seconds. Ask your companion (if present) to confirm the slip matches your intended vote.' },
      { icon: '✅', title: 'Exit', text: 'Once the beep confirms, your vote is complete. Exit the booth. Your vote is secret — no one can know what you voted.' },
    ],
  },
  {
    id: 'transgender',
    title: 'Transgender Voter Rights',
    color: 'var(--purple)',
    items: [
      { icon: '🪪', title: 'Right to Vote in Chosen Gender', text: 'Following the Supreme Court judgment in NALSA v. Union of India (2014), transgender persons have the right to be registered as their self-identified gender. Select "Other" when registering via Form 6.' },
      { icon: '⚖️', title: 'Legal Protection at Booth', text: 'Any harassment, denial of entry, or humiliation of a transgender voter is a criminal offence. Report immediately to the Presiding Officer or call 1950.' },
      { icon: '📝', title: 'Updating Your Records', text: 'If your voter ID does not reflect your current gender identity, use Form 8 (correction) to update gender. No court order required — self-declaration is accepted.' },
      { icon: '📞', title: 'Grievance Escalation', text: 'If the booth refuses to allow you to vote, call 1950 immediately. Report via the cVIGIL app with geo-tagged evidence. Flying squad responds within 100 minutes.' },
    ],
  },
  {
    id: 'firsttime',
    title: 'First-Time Voter Visual Guide',
    color: 'var(--success-light)',
    items: [
      { icon: '📍', title: 'Step 1 — Find Your Booth', text: 'Your booth address is on your EPIC card. Also search at voters.eci.gov.in or the Voter Helpline app. Go before 9 AM to avoid queues.' },
      { icon: '🪪', title: 'Step 2 — Carry ID', text: 'Bring your EPIC card OR any ONE of: Aadhaar, Passport, Driving Licence, PAN Card, MNREGA Job Card. Originals only — no photocopies.' },
      { icon: '📋', title: 'Step 3 — Find Your Name', text: 'Give your name and EPIC number to the officer at Table 1. They will confirm your name and mark Form 17A.' },
      { icon: '✍️', title: 'Step 4 — Sign & Get Slip', text: 'Sign or give your thumb impression in the register. You will receive a voter slip with your serial number.' },
      { icon: '🖨️', title: 'Step 5 — Apply Ink', text: 'At Table 2, indelible ink is applied to your left index finger. This is mandatory and proves you have voted.' },
      { icon: '🗳️', title: 'Step 6 — Cast Your Vote', text: "Enter the booth. Find your party's symbol on the ballot unit. Party symbols are printed next to each candidate's name. Press the button next to your choice once." },
      { icon: '🔊', title: 'Step 7 — Confirm Vote', text: 'You will hear a beep and a paper slip appears in the VVPAT box for 7 seconds — confirming your vote. Do not press any button again.' },
    ],
  },
]

export default function Accessibility() {
  const [open, setOpen] = useState<string | null>('pwd')

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Inclusive Voting Guide</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>PwD · Senior · Blind · Transgender · First-Time</p>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        All rights on this page are guaranteed by ECI guidelines and the Representation of the People Act, 1951.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {SECTIONS.map(section => (
          <div key={section.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
            <button
              onClick={() => setOpen(open === section.id ? null : section.id)}
              style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 20px', background: 'var(--surface)', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', color: 'var(--text)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: SECTION_GRADIENTS[section.id],
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {SECTION_ICONS[section.id]}
                </div>
                <span style={{ fontWeight: 700, color: section.color }}>{section.title}</span>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{open === section.id ? '▲' : '▼'}</span>
            </button>

            {open === section.id && (
              <div style={{ padding: '0 16px 16px', background: 'var(--surface)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {section.items.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius)', alignItems: 'flex-start' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: section.color }}>
                      {getItemIcon(item.icon)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, marginBottom: 4, fontSize: '0.9rem' }}>{item.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>{item.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        This page works offline. Save it before election day.
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoterStore } from '../store/voterStore'
import AppIcon, { GRADIENTS } from '../components/AppIcon'

type Category = 'senior' | 'pwd' | 'migrant' | 'essential' | 'overseas' | null

const CATEGORY_ICONS: Record<string, { gradient: string; svg: React.ReactNode }> = {
  senior: { gradient: GRADIENTS.purple, svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/><line x1="12" y1="16" x2="12" y2="20"/></svg> },
  pwd: { gradient: GRADIENTS.blue, svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="4" r="1.5" fill="white"/><path d="M6 9.5l6-1.5 6 1.5"/><path d="M12 8v5"/><path d="M7.5 22l2-8M16.5 22l-2-8"/></svg> },
  migrant: { gradient: GRADIENTS.amber, svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="11" rx="2"/><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/><circle cx="7" cy="18" r="1.2"/><circle cx="17" cy="18" r="1.2"/></svg> },
  essential: { gradient: GRADIENTS.rose, svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg> },
  overseas: { gradient: GRADIENTS.teal, svg: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> },
}

const CATEGORIES = [
  { id: 'senior' as Category, title: '85+ / Senior Citizen', desc: 'Age 85 or above on election day' },
  { id: 'pwd' as Category, title: 'Person with Disability', desc: 'With disability certificate (40% or more)' },
  { id: 'migrant' as Category, title: 'Migrant / Away from Constituency', desc: 'Living or working outside your registered constituency' },
  { id: 'essential' as Category, title: 'Essential Service Worker', desc: 'Police, healthcare, election duty, media on election day' },
  { id: 'overseas' as Category, title: 'Overseas Indian (NRI)', desc: 'Indian citizen residing abroad, registered as overseas voter' },
]

const DETAILS: Record<string, { eligible: boolean; form: string; deadline: string; how: string[]; note: string }> = {
  senior: {
    eligible: true,
    form: 'Form 12D',
    deadline: '5 days before election date',
    how: [
      'Contact your Booth Level Officer (BLO) or visit the ERO office.',
      'Fill Form 12D — Declaration for Postal Ballot.',
      'Attach photocopy of EPIC card and age proof.',
      'Submit before the announced deadline (usually 5 days before polling day).',
      'A polling team will visit your home on election day with a portable EVM.',
      'Vote in the presence of the team — your vote is secret and sealed on the spot.',
    ],
    note: 'Home voting is completely voluntary. You can still vote at the booth if you prefer.',
  },
  pwd: {
    eligible: true,
    form: 'Form 12D',
    deadline: '5 days before election date',
    how: [
      'Obtain a valid PwD certificate from a government hospital (40%+ disability).',
      'Contact your BLO or ERO office with your EPIC card and PwD certificate.',
      'Fill Form 12D and submit before deadline.',
      'A polling team visits your home on election day.',
      'You may also request a companion to assist you inside the booth.',
      'Call 1950 for assistance if BLO is unresponsive.',
    ],
    note: 'You can also vote at the booth with priority queue and full accessibility support.',
  },
  migrant: {
    eligible: false,
    form: 'No postal ballot for domestic migrants (yet)',
    deadline: 'N/A',
    how: [
      'Domestic migrants are NOT currently eligible for postal ballots in general elections.',
      'You must travel back to your registered constituency to vote.',
      'Check ECI\'s Remote Voting Pilot — ECI is testing remote EVMs for migrants in select elections.',
      'Alternatively, apply for Form 6 to re-register in your current city.',
      'If you re-register in your current city, check ECI pilot for proxy voting eligibility.',
    ],
    note: 'ECI launched a Remote Voting Machine (RVM) pilot in 2023 for domestic migrants. Check eci.gov.in for latest updates.',
  },
  essential: {
    eligible: true,
    form: 'Form 12',
    deadline: 'Varies — check with your department',
    how: [
      'Your employer / department head must certify you are on essential duty on election day.',
      'Obtain Form 12 from your ERO or ECI website.',
      'Fill and submit the form to your designated ERO before the notified deadline.',
      'The postal ballot paper is sent to your registered address.',
      'Mark your vote, seal in the provided envelope, and return by post or hand-deliver to the ERO before counting day.',
    ],
    note: 'Journalists, media crews, and election duty staff (not armed forces) fall under this category.',
  },
  overseas: {
    eligible: true,
    form: 'Proxy voting or in-person at constituency',
    deadline: 'Register as Overseas Voter on voters.eci.gov.in',
    how: [
      'Register as an Overseas Voter using Form 6A on voters.eci.gov.in.',
      'You must travel to your registered constituency in India to vote in person.',
      'Currently, postal/proxy voting for NRIs is under consideration by ECI — not yet implemented.',
      'Watch ECI announcements — a proxy voting pilot may be notified before 2026 elections.',
      'Keep your Indian passport and EPIC card valid for identity verification.',
    ],
    note: 'The Supreme Court and ECI are actively working on postal/proxy voting for NRIs. Check eci.gov.in before your election date.',
  },
}

export default function PostalBallot() {
  const navigate = useNavigate()
  const { voter } = useVoterStore()
  const [selected, setSelected] = useState<Category>(null)

  const detail = selected ? DETAILS[selected] : null

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Postal Ballot Guide</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>Check if you can vote without going to the booth</p>
        </div>
      </div>

      {!selected && (
        <>
          <div className="alert alert-info" style={{ marginBottom: 20 }}>
            Postal ballot lets eligible voters cast their vote without visiting the polling booth. Select your category to check eligibility.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => setSelected(cat.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)', textAlign: 'left', transition: 'background var(--transition)' }}>
                <AppIcon gradient={CATEGORY_ICONS[cat.id!]?.gradient || GRADIENTS.slate} size={42}>
                  {CATEGORY_ICONS[cat.id!]?.svg}
                </AppIcon>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cat.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{cat.desc}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            ))}
          </div>
        </>
      )}

      {selected && detail && (
        <>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontSize: '0.875rem', fontFamily: 'inherit', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Back to categories
          </button>

          <div style={{ padding: '16px 20px', borderRadius: 'var(--radius-lg)', marginBottom: 20, background: detail.eligible ? 'rgba(45,106,79,0.1)' : 'rgba(230,57,70,0.08)', border: `1px solid ${detail.eligible ? 'rgba(45,106,79,0.4)' : 'rgba(230,57,70,0.3)'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AppIcon gradient={CATEGORY_ICONS[selected]?.gradient || GRADIENTS.slate} size={44}>
                {CATEGORY_ICONS[selected]?.svg}
              </AppIcon>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>{CATEGORIES.find(c => c.id === selected)?.title}</div>
                <div style={{ marginTop: 6 }}>
                  {detail.eligible
                    ? <span className="badge" style={{ background: '#52B788', color: 'white', fontSize: '0.8rem' }}>✓ ELIGIBLE for postal ballot</span>
                    : <span className="badge" style={{ background: 'var(--danger)', color: 'white', fontSize: '0.8rem' }}>✗ NOT eligible for postal ballot</span>
                  }
                </div>
              </div>
            </div>
          </div>

          {detail.eligible && (
            <div className="card" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
                <div style={{ flex: 1, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>FORM NEEDED</div>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', marginTop: 2 }}>{detail.form}</div>
                </div>
                <div style={{ flex: 1, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>APPLY BY</div>
                  <div style={{ fontWeight: 700, color: 'var(--danger-light)', marginTop: 2, fontSize: '0.85rem' }}>{detail.deadline}</div>
                </div>
              </div>
            </div>
          )}

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 14 }}>Step-by-Step Guide</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {detail.how.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, background: detail.eligible ? 'var(--primary)' : 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', color: detail.eligible ? 'white' : 'var(--text-muted)' }}>
                    {i + 1}
                  </div>
                  <div style={{ fontSize: '0.855rem', lineHeight: 1.65 }}>{step}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="alert alert-info" style={{ marginBottom: 16 }}>
            <strong>Note:</strong> {detail.note}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-primary btn-full" onClick={() => window.open('https://voters.eci.gov.in', '_blank')}>
              Apply at voters.eci.gov.in →
            </button>
            <button className="btn btn-secondary btn-full" onClick={() => window.open('tel:1950')}>
              Call 1950 for Help
            </button>
          </div>
        </>
      )}
    </div>
  )
}

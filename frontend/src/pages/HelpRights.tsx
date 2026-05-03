import React from 'react'
import { useNavigate } from 'react-router-dom'
import AppIcon, { GRADIENTS } from '../components/AppIcon'

const HELPLINES = [
  {
    icon: (
      <AppIcon gradient={GRADIENTS.rose} size={36}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.03 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14z"/></svg>
      </AppIcon>
    ),
    name: '1950 — National Voter Helpline', desc: 'Registration, booth, any election problem. 24×7 on election day.', action: () => window.open('tel:1950'), label: 'Call 1950', primary: true,
  },
  {
    icon: (
      <AppIcon gradient={GRADIENTS.saffron} size={36}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5"/></svg>
      </AppIcon>
    ),
    name: 'cVIGIL App', desc: 'Report cash, gifts, MCC violations anonymously with GPS proof.', action: () => window.open('https://cvigil.eci.gov.in', '_blank'), label: 'Open cVIGIL', primary: false,
  },
  {
    icon: (
      <AppIcon gradient={GRADIENTS.blue} size={36}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
      </AppIcon>
    ),
    name: 'ECI Website', desc: 'Official Election Commission website — schedule, results, affidavits.', action: () => window.open('https://eci.gov.in', '_blank'), label: 'eci.gov.in', primary: false,
  },
  {
    icon: (
      <AppIcon gradient={GRADIENTS.green} size={36}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12l2 2 4-4"/></svg>
      </AppIcon>
    ),
    name: 'Voter Helpline App', desc: 'ECI official app — voter lookup, booth finder, form status.', action: () => window.open('https://voters.eci.gov.in', '_blank'), label: 'voters.eci.gov.in', primary: false,
  },
  {
    icon: (
      <AppIcon gradient={GRADIENTS.indigo} size={36}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      </AppIcon>
    ),
    name: 'ADR / Myneta', desc: 'Candidate background, affidavit data in plain language.', action: () => window.open('https://myneta.info', '_blank'), label: 'myneta.info', primary: false,
  },
]

const COMPLAINT_STEPS = [
  { step: 1, title: 'Verbal Complaint to Presiding Officer', detail: 'The Presiding Officer has full authority at the booth. Any complaint — officer misbehaviour, refusal to vote, intimidation — must be addressed first by the Presiding Officer on the spot.' },
  { step: 2, title: 'Call 1950 Helpline', detail: 'If the Presiding Officer does not act, call 1950 immediately. Give your booth number, EPIC number, and describe the problem. This creates a recorded complaint that ECI must act on.' },
  { step: 3, title: 'cVIGIL App Report', detail: 'For violations with visual evidence (cash, liquor, intimidation), file a cVIGIL report. The app geo-tags your location. The ECI flying squad is required to respond within 100 minutes.' },
  { step: 4, title: 'Written Complaint to Returning Officer', detail: 'Submit a written complaint to the Returning Officer of your constituency at the District Collectorate on the same day. Keep a copy with acknowledgement.' },
  { step: 5, title: 'Escalate to District Collector / ECI', detail: 'If all else fails, write to the District Collector with a copy to the Chief Electoral Officer of your state. You can also email the ECI at eci@eci.gov.in.' },
]

const RIGHTS = [
  { title: 'Secret Ballot', text: 'Your vote is completely secret. No one — not the booth officer, not any party worker — can see your vote. Secret ballot is guaranteed under the Representation of the People Act, 1951.' },
  { title: 'Cannot Be Forced', text: 'No one can force you to vote for a particular candidate or party. This is a criminal offence under Section 171C of the Indian Penal Code.' },
  { title: 'Tender Vote Right', text: 'If someone has already voted in your name before you arrive, you have the legal right to cast a Tender Vote (Form 49A). The Presiding Officer cannot deny this.' },
  { title: 'Queue Right', text: 'If you are standing in the queue before the polling booth closes, you must be allowed to vote — even after the official closing time. Officers cannot refuse you if you arrived before closure.' },
  { title: 'PwD Rights', text: 'Persons with disability have the right to a companion, priority queue, Braille EVM, ramp access, and home voting (for severe disabilities). All are mandatory ECI provisions.' },
  { title: 'Exit Poll Refusal', text: 'You have every right to refuse to answer exit poll surveys near the booth. Conducting exit polls during voting hours is illegal under Section 126A of the Representation of the People Act.' },
  { title: 'No Selfie', text: 'Taking a photo of your vote on the EVM or ballot paper inside the booth is illegal under election rules. You can be prosecuted for this.' },
  { title: 'Right to Complain', text: 'You can file a complaint against any booth officer to the Presiding Officer at any time during voting. The complaint can be verbal or written.' },
]

export default function HelpRights() {
  const navigate = useNavigate()

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Help & Rights</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Helplines · Voter Rights · Complaint Guide</p>
        </div>
      </div>

      {/* Helplines */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Official Helplines & Resources</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {HELPLINES.map(h => (
            <button key={h.name} onClick={h.action}
              style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                background: h.primary ? 'var(--primary)' : 'var(--surface-2)',
                border: `1px solid ${h.primary ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'inherit',
                color: h.primary ? 'white' : 'var(--text)', textAlign: 'left',
              }}
            >
              {h.icon}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{h.name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: 2 }}>{h.desc}</div>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, opacity: 0.9, flexShrink: 0 }}>{h.label} →</span>
            </button>
          ))}
        </div>
      </div>

      {/* Voter Rights */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 4 }}>Your Voter Rights</h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Guaranteed under the Representation of the People Act, 1951 and ECI guidelines.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {RIGHTS.map((r, i) => (
            <div key={r.title} style={{ display: 'flex', gap: 14, padding: '16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--primary)', alignItems: 'flex-start' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--primary-tonal)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 4 }}>{r.title}</div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Complaint Guide */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>How to File a Complaint</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {COMPLAINT_STEPS.map(s => (
            <div key={s.step} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius)', alignItems: 'flex-start' }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: 'white' }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shortcut links */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
        <button className="btn btn-secondary" onClick={() => navigate('/accessibility')}>Accessibility Guide</button>
        <button className="btn btn-secondary" onClick={() => navigate('/glossary')}>Election Glossary</button>
        <button className="btn btn-secondary" onClick={() => navigate('/cvigil')}>Report cVIGIL</button>
        <button className="btn btn-secondary" onClick={() => navigate('/mode2/rights')}>Detailed Rights</button>
      </div>
    </div>
  )
}

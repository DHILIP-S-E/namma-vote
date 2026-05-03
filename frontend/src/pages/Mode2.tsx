import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoterStore } from '../store/voterStore'

const EMERGENCY_STEPS = [
  {
    step: 1,
    title: 'Show EPIC to Presiding Officer',
    detail: 'Show your EPIC card and demand they search Form 17A. This is your legal right.',
  },
  {
    step: 2,
    title: 'Request a Tender Vote',
    detail: 'If still not found, ask for a Challenged Vote (Tender Vote). The Presiding Officer cannot refuse.',
  },
  {
    step: 3,
    title: 'Call 1950 Helpline',
    detail: 'Call the national voter helpline immediately. Keep your EPIC number ready.',
    action: { label: 'Call 1950 Now', href: 'tel:1950' },
  },
  {
    step: 4,
    title: 'Contact Your BLO',
    detail: 'Booth Level Officer is responsible for your booth. Ask the Presiding Officer for BLO contact.',
  },
  {
    step: 5,
    title: 'File Complaint with Returning Officer',
    detail: 'Visit the Returning Officer\'s office in the district collectorate on the same day.',
  },
]

const RIGHTS = [
  { right: 'Secret ballot — no one can see your vote, including the booth officer' },
  { right: 'You cannot be forced to vote for anyone — it is illegal under RPA 1951' },
  { right: 'If someone already voted in your name — you have the right to a Tender Vote' },
  { right: 'You can complain against any officer to the Presiding Officer on the spot' },
  { right: 'Exit polling questions near the booth — you have the right to refuse' },
  { right: 'Showing your ballot or taking a selfie with your vote is illegal' },
]

const DOCUMENTS = [
  'EPIC Card (Voter ID)',
  'Aadhaar Card',
  'Passport',
  'Driving Licence',
  'MNREGA Job Card',
  'Bank / Post Office Passbook with Photo',
  'PAN Card',
  'Service Identity Cards (Govt employees)',
  'Pension Documents with Photo',
]

export default function Mode2() {
  const navigate = useNavigate()
  const { voter } = useVoterStore()
  const today = new Date()
  const electionDate = voter?.election_date ? new Date(voter.election_date) : null
  const isElectionDay = electionDate
    ? today.toDateString() === electionDate.toDateString()
    : false

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2 style={{ marginBottom: 0 }}>Help Me Right Now</h2>
            {isElectionDay && <span className="badge badge-live">LIVE</span>}
          </div>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Election day guide & emergency help</p>
        </div>
      </div>

      {/* Election Day Banner */}
      {isElectionDay && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(230,57,70,0.15) 0%, rgba(230,57,70,0.05) 100%)',
          border: '1px solid rgba(230,57,70,0.4)', borderRadius: 'var(--radius-lg)',
          padding: 16, marginBottom: 20, textAlign: 'center'
        }}>
          <div style={{ fontWeight: 700, color: 'var(--danger-light)', fontSize: '1.1rem' }}>TODAY IS VOTING DAY</div>
          {voter && <div style={{ fontSize: '0.85rem', marginTop: 4 }}>Your booth: <strong>{voter.polling_station}</strong></div>}
          <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => navigate('/mode1/booth')}>
            Get Directions Now
          </button>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
        {([
          { label: 'Find Booth', path: '/mode1/booth', color: 'var(--blue)' },
          { label: 'Documents', path: '/mode2/documents', color: 'var(--success-light)' },
          { label: 'My Rights', path: '/mode2/rights', color: 'var(--purple)' },
          { label: 'cVIGIL', path: '/cvigil', color: 'var(--danger)' },
        ] as Array<{ label: string; path?: string; action?: () => void; color: string }>).map(item => (
          <button key={item.label}
            onClick={item.action || (() => navigate(item.path!))}
            style={{
              background: 'var(--surface)', border: `1px solid var(--border)`,
              borderRadius: 'var(--radius-lg)', padding: '20px 16px', cursor: 'pointer',
              fontFamily: 'inherit', transition: 'all var(--transition)', color: 'var(--text)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            }}>
            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: item.color }}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Emergency: Name Not Found */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ color: 'var(--danger-light)', marginBottom: 4 }}>My Name is Not on the List</h3>
        <p style={{ fontSize: '0.85rem', marginBottom: 16 }}>Follow these steps in order — do not leave the booth</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {EMERGENCY_STEPS.map((s) => (
            <div key={s.step} style={{
              display: 'flex', gap: 14, padding: '14px',
              background: 'var(--surface-2)', borderRadius: 'var(--radius)', alignItems: 'flex-start'
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'var(--primary)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'white'
              }}>{s.step}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.detail}</div>
                {s.action && (
                  <button className="btn btn-danger btn-sm" style={{ marginTop: 10 }}
                    onClick={() => window.open(s.action!.href)}>
                    {s.action.label}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EVM Mock Poll */}
      <div className="card" style={{ marginBottom: 16, background: 'rgba(88,166,255,0.05)', border: '1px solid rgba(88,166,255,0.2)' }}>
        <h3 style={{ color: 'var(--blue)', marginBottom: 8 }}>EVM Shows Votes Already Counted?</h3>
        <div className="alert alert-info">
          <div>
            <strong>This is a Mock Poll — completely normal!</strong>
            <p style={{ marginTop: 6, color: 'var(--text)', fontSize: '0.875rem' }}>
              Every EVM runs a mandatory mock poll before voting starts. The results shown are from the test — not real votes.
              All mock poll data is cleared before actual voting begins. Your VVPAT slip confirms your real vote was recorded correctly.
            </p>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          This is mandated by ECI. It does NOT mean the EVM is rigged.
        </div>
      </div>

      {/* Officer Complaint */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>Officer Misbehaving?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem' }}>
          {[
            { step: '1st', who: 'Presiding Officer', desc: 'Has full authority at the booth — complain verbally first' },
            { step: '2nd', who: 'Sector Officer', desc: 'Supervises multiple booths — call for immediate help' },
            { step: '3rd', who: 'ECI Control Room', desc: 'District level — 044-28226820 (Chennai)' },
            { step: '4th', who: 'cVIGIL App', desc: 'Geo-tagged photo report direct to ECI flying squad' },
            { step: '5th', who: '1950 Helpline', desc: 'National voter helpline — available 24×7 on election day' },
          ].map(item => (
            <div key={item.step} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
              <span className="badge badge-primary" style={{ flexShrink: 0 }}>{item.step}</span>
              <div>
                <div style={{ fontWeight: 600 }}>{item.who}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Voter Rights */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 12 }}>Your Voter Rights (Always Visible)</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {RIGHTS.map((r, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)', borderLeft: '3px solid var(--primary)', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>{r.right}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

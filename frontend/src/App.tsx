import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useVoterStore } from './store/voterStore'
import { lookupByEPIC } from './api/voter'
import BottomNav from './components/BottomNav'
import SideNav from './components/SideNav'
import LandingPage from './pages/LandingPage'
import Auth from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Mode1 from './pages/Mode1'
import Mode2 from './pages/Mode2'
import Mode3 from './pages/Mode3'
import BoothMap from './pages/BoothMap'
import Candidates from './pages/Candidates'
import Profile from './pages/Profile'
import Notifications from './pages/Notifications'
import Admin from './pages/Admin'
import Accessibility from './pages/Accessibility'
import CVigil from './pages/CVigil'
import MyConstituency from './pages/MyConstituency'
import Glossary from './pages/Glossary'
import HelpRights from './pages/HelpRights'
import PledgeCard from './pages/PledgeCard'
import EVMExplainer from './pages/EVMExplainer'
import PostalBallot from './pages/PostalBallot'
import ConstituencyHistory from './pages/ConstituencyHistory'
import AIChatBot from './components/AIChatBot'
import ElectionChecklist from './pages/ElectionChecklist'
import PolicyQuiz from './pages/PolicyQuiz'
import MockEVM from './pages/MockEVM'
import ManifestoSearch from './pages/ManifestoSearch'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 2,
    },
  },
})

function AppRoutes() {
  const { onboardingDone, isAuthenticated, voter, setVoter } = useVoterStore()

  // On every app load: if we have an EPIC but stale/missing constituency data, refresh from ECI
  useEffect(() => {
    if (!voter?.epic || voter.assembly_code) return
    lookupByEPIC(voter.epic).then(res => {
      if (res.found && res.voter?.assembly_code) {
        setVoter({ ...voter, ...res.voter })
      }
    }).catch(() => {})
  }, [])

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  if (!onboardingDone) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <SideNav />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mode1" element={<Mode1 />} />
          <Route path="/mode1/booth" element={<BoothMap />} />
          <Route path="/mode1/candidates" element={<Candidates />} />
          <Route path="/mode1/forms" element={<Mode1Forms />} />
          <Route path="/mode1/documents" element={<Documents />} />
          <Route path="/mode2" element={<Mode2 />} />
          <Route path="/mode2/documents" element={<Documents />} />
          <Route path="/mode2/rights" element={<Rights />} />
          <Route path="/mode3" element={<Mode3 />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/accessibility" element={<Accessibility />} />
          <Route path="/cvigil" element={<CVigil />} />
          <Route path="/my-constituency" element={<MyConstituency />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/help-rights" element={<HelpRights />} />
          <Route path="/pledge" element={<PledgeCard />} />
          <Route path="/evm-security" element={<EVMExplainer />} />
          <Route path="/postal-ballot" element={<PostalBallot />} />
          <Route path="/constituency-history" element={<ConstituencyHistory />} />
          <Route path="/checklist" element={<ElectionChecklist />} />
          <Route path="/policy-quiz" element={<PolicyQuiz />} />
          <Route path="/mock-evm" element={<MockEVM />} />
          <Route path="/manifesto" element={<ManifestoSearch />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <div className="bottom-nav-mobile"><BottomNav /></div>
        <AIChatBot />
      </div>
    </>
  )
}

// Inline simple pages
function Mode1Forms() {
  const { epicHash } = useVoterStore()
  const [ackNumber, setAckNumber] = React.useState('')
  const [formType, setFormType] = React.useState('6')
  const [tracked, setTracked] = React.useState<Array<{ ack: string; form: string; date: string }>>(() => {
    try { return JSON.parse(localStorage.getItem('nv_form_submissions') || '[]') } catch { return [] }
  })
  const [saving, setSaving] = React.useState(false)

  const handleTrack = async () => {
    if (!ackNumber.trim()) return
    setSaving(true)
    const hash = epicHash || 'anonymous'
    const entry = { ack: ackNumber.trim(), form: formType, date: new Date().toLocaleDateString('en-IN') }
    try {
      await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ epic_hash: hash, form_type: formType, acknowledgement_number: ackNumber.trim() }),
      })
    } catch { /* save locally even if API unavailable */ }
    const updated = [entry, ...tracked]
    setTracked(updated)
    localStorage.setItem('nv_form_submissions', JSON.stringify(updated))
    setAckNumber('')
    setSaving(false)
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <h2 style={{ marginBottom: 0 }}>Form Wizard</h2>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {[
          { form: '6', title: 'Form 6 — New Registration', desc: 'Register as a voter for the first time or after moving', color: 'var(--blue)', url: 'https://voters.eci.gov.in/signup' },
          { form: '7', title: 'Form 7 — Object to Registration', desc: 'Report a duplicate entry or request deletion', color: 'var(--warning)', url: 'https://voters.eci.gov.in' },
          { form: '8', title: 'Form 8 — Correction', desc: 'Fix name, address, photo, or other details', color: '#52B788', url: 'https://voters.eci.gov.in' },
        ].map(f => (
          <div key={f.form} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div>
                <div style={{ fontWeight: 700, color: f.color }}>{f.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 4 }}>{f.desc}</div>
              </div>
              <span className="badge" style={{ background: f.color, color: 'white' }}>Form {f.form}</span>
            </div>
            <button className="btn btn-secondary btn-sm btn-full" onClick={() => window.open(f.url, '_blank')}>
              Fill Online at ECI Portal →
            </button>
          </div>
        ))}
      </div>
      <div className="alert alert-info" style={{ marginTop: 20 }}>
        Online submission available at <strong>voters.eci.gov.in</strong>. Physical submission at your nearest ERO office also accepted.
      </div>

      {/* Form Submission Tracker */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 4 }}>Track My Form</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
          Save your acknowledgement number to track submission status.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <select
            value={formType}
            onChange={e => setFormType(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem' }}
          >
            <option value="6">Form 6 — New Registration</option>
            <option value="7">Form 7 — Objection</option>
            <option value="8">Form 8 — Correction</option>
          </select>
          <input
            type="text"
            placeholder="Enter Acknowledgement Number"
            value={ackNumber}
            onChange={e => setAckNumber(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.9rem' }}
          />
          <button
            className="btn btn-primary btn-full"
            onClick={handleTrack}
            disabled={saving || !ackNumber.trim()}
          >
            {saving ? 'Saving...' : 'Save & Track'}
          </button>
        </div>

        {tracked.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4 style={{ marginBottom: 12, fontSize: '0.9rem' }}>Saved Submissions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {tracked.map((t, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: '0.85rem' }}>
                  <div>
                    <span className="badge" style={{ background: 'var(--blue)', color: 'white', marginRight: 8 }}>Form {t.form}</span>
                    <span style={{ fontWeight: 600 }}>{t.ack}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Documents() {
  const { voter } = useVoterStore()
  const DOCS = {
    accepted: [
      'EPIC Card (Voter ID)', 'Aadhaar Card', 'Passport', 'Driving Licence',
      'MNREGA Job Card', 'Bank / Post Office Passbook with Photo',
      'PAN Card', 'Service Identity Cards (Govt employees)',
      'Pension Documents with Photo', 'Smart Card (NPR)',
    ],
    not_accepted: ['Ration Card (without photo)', 'Electric Bill', 'School/College ID'],
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Documents Accepted</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>{voter?.state_name || 'Tamil Nadu'} booths</p>
        </div>
      </div>

      <div className="alert alert-warning" style={{ marginBottom: 20 }}>
        Carry at least ONE document from the accepted list. Original required — no photocopies.
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <h4 style={{ color: '#52B788', marginBottom: 14 }}>Accepted at Booth</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DOCS.accepted.map(d => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(45,106,79,0.06)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
              <span style={{ color: '#52B788' }}>✓</span> {d}
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h4 style={{ color: 'var(--danger-light)', marginBottom: 14 }}>Not Accepted</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DOCS.not_accepted.map(d => (
            <div key={d} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(230,57,70,0.06)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--danger-light)' }}>✗</span> {d}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Rights() {
  const RIGHTS = [
    { title: 'Secret Ballot', text: 'Your vote is completely secret. No one — not the booth officer, not the party worker outside — can see your vote.' },
    { title: 'Cannot Be Forced', text: 'No one can force you to vote for a particular candidate. This is a criminal offence under the Representation of the People Act 1951.' },
    { title: 'Tender Vote Right', text: 'If someone has already voted using your name, you have the legal right to cast a Tender Vote (Challenged Vote). The Presiding Officer cannot refuse.' },
    { title: 'Right to Complain', text: 'You can file a verbal or written complaint against any booth officer to the Presiding Officer at any time during voting.' },
    { title: 'Exit Poll Refusal', text: 'Any exit poll survey near the polling booth is illegal during voting hours. You have every right to refuse to answer.' },
    { title: 'No Selfie With Vote', text: 'Taking a photo of your vote on the ballot or EVM inside the booth is illegal under election law.' },
    { title: 'Waiting in Queue', text: 'If you are in the queue before polling ends, you must be allowed to vote — even after the official closing time.' },
    { title: 'PwD Rights', text: 'If you are a Person with Disability, you are entitled to a companion, priority queue access, Braille EVM, and ramp access.' },
  ]

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <h2 style={{ marginBottom: 0 }}>Your Voter Rights</h2>
      </div>
      <div className="alert alert-info" style={{ marginBottom: 20 }}>
        These rights are guaranteed under the <strong>Representation of the People Act, 1951</strong> and ECI guidelines.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {RIGHTS.map((r, i) => (
          <div key={r.title} className="card">
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--primary)' }}>{i + 1}</div>
              <div>
                <h4 style={{ marginBottom: 6 }}>{r.title}</h4>
                <p style={{ fontSize: '0.875rem' }}>{r.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20, textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Save this page for offline access on election day
      </div>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#ffffff',
              color: '#111827',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontFamily: 'var(--font-body)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useVoterStore } from '../store/voterStore'

const LANGUAGES = [
  { code: 'en', native: 'English', label: 'English' },
  { code: 'ta', native: 'தமிழ்', label: 'Tamil' },
  { code: 'hi', native: 'हिन्दी', label: 'Hindi' },
]

export default function Profile() {
  const navigate = useNavigate()
  const { voter, epic, language, persona, setLanguage, clearVoter, setOnboardingDone } = useVoterStore()

  const handleReset = () => {
    clearVoter()
    setOnboardingDone(false)
    navigate('/')
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(145deg, #6BB5FF, #1565C0)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M6 20v-2a6 6 0 0112 0v2"/>
          </svg>
        </div>
        <div>
          <h2 style={{ marginBottom: 4 }}>Profile</h2>
          <p style={{ marginBottom: 0, fontSize: '0.875rem' }}>Your voter data and app settings</p>
        </div>
      </div>

      {/* Voter Data */}
      {voter ? (
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <h4>My Voter Details</h4>
            <span className="badge badge-success">✓ Verified</span>
          </div>
          {[
            { l: 'Name', v: voter.name },
            { l: 'EPIC', v: epic || '—' },
            { l: 'Constituency', v: voter.assembly_constituency },
            { l: 'Booth No.', v: voter.booth_number },
            { l: 'Election Date', v: voter.election_date },
            { l: 'State', v: voter.state_name },
          ].map(({ l, v }) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>{l}</span>
              <span style={{ fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ marginBottom: 20, textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <path d="M16 10h2M16 14h2M8 10a2 2 0 100 4 2 2 0 000-4"/>
              </svg>
            </div>
          </div>
          <p style={{ marginBottom: 16, fontSize: '0.875rem' }}>No voter data saved yet</p>
          <button className="btn btn-primary" onClick={() => navigate('/mode1')}>Find My Voter ID</button>
        </div>
      )}

      {/* Language */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h4 style={{ marginBottom: 14 }}>Language</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => setLanguage(lang.code as 'en' | 'ta' | 'hi')}
              style={{
                padding: '12px 8px', borderRadius: 'var(--radius)', border: `2px solid ${language === lang.code ? 'var(--primary)' : 'var(--border)'}`,
                background: language === lang.code ? 'rgba(255,107,53,0.1)' : 'var(--surface-2)',
                cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)', transition: 'all var(--transition)',
                fontWeight: language === lang.code ? 700 : 400
              }}>
              <div style={{ fontSize: '1.1rem' }}>{lang.native}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{lang.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 14 }}>Quick Links</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'ECI Voter Portal', url: 'https://voters.eci.gov.in' },
            { label: 'ADR India — Candidate Data', url: 'https://adrindia.org' },
            { label: 'cVIGIL — Report Violations', url: 'https://cvigil.eci.gov.in' },
            { label: '1950 — National Voter Helpline', url: 'tel:1950' },
          ].map(({ label, url }) => (
            <button key={label} onClick={() => window.open(url, '_blank')}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '12px 14px', cursor: 'pointer', textAlign: 'left', color: 'var(--text)',
                fontFamily: 'inherit', fontSize: '0.875rem', transition: 'all var(--transition)' }}>
              {label} →
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button className="btn btn-secondary btn-full" onClick={handleReset}
        style={{ border: '1px solid rgba(230,57,70,0.3)', color: 'var(--danger-light)' }}>
        Reset &amp; Start Over
      </button>

      <div style={{ textAlign: 'center', marginTop: 24, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        NAMMA VOTE v1.0 · Every Vote. Informed. Protected.<br />
        PromptWars Virtual Challenge 2 · May 2026
      </div>
    </div>
  )
}

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useVoterStore } from '../store/voterStore'
import toast from 'react-hot-toast'

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Home',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9" fill="none"/></svg>,
  },
  {
    to: '/mode1',
    label: 'Am I Ready?',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  },
  {
    to: '/my-constituency',
    label: 'My Constituency',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>,
  },
  {
    to: '/mode3',
    label: 'Fact Check',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6M11 8v6" strokeWidth="1.5"/></svg>,
  },
  {
    to: '/candidates',
    label: 'Candidates',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/></svg>,
  },
  {
    to: '/mode1/booth',
    label: 'Booth Map',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
  },
  {
    to: '/help-rights',
    label: 'Help & Rights',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    to: '/accessibility',
    label: 'Accessibility',
    svg: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><path d="M6 9.5l6-1.5 6 1.5M12 8v5M8 22l2-8M16 22l-2-8"/></svg>,
  },
]

const SECONDARY_ITEMS = [
  { to: '/checklist', label: 'Checklist', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg> },
  { to: '/postal-ballot', label: 'Postal Ballot', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg> },
  { to: '/evm-security', label: 'EVM Guide', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg> },
  { to: '/constituency-history', label: 'Past Elections', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3v18h18"/><path d="M18 9l-5 5-4-4-3 3"/></svg> },
  { to: '/glossary', label: 'Glossary', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg> },
  { to: '/mock-evm', label: 'Practice Vote', svg: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="1.5" fill="currentColor"/><circle cx="9" cy="15" r="1.5" fill="currentColor"/><path d="M13 9h5M13 15h5"/></svg> },
]

export default function SideNav() {
  const { voter, authUser, logout } = useVoterStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  const electionDate = voter?.election_date
    ? new Date(voter.election_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : null

  return (
    <aside style={{
      width: 240,
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 50,
      overflowY: 'auto',
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid var(--border)' }}>
        <div
          onClick={() => navigate('/dashboard')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
        >
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(145deg, #FF8F5F 0%, #E84E1A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,107,53,0.35)',
            flexShrink: 0,
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.1 }}>NAMMA VOTE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>நம்ம வோட்</div>
          </div>
        </div>

        {voter && electionDate && (
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(255,107,53,0.08)', borderRadius: 10, border: '1px solid rgba(255,107,53,0.15)' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--primary)', fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', marginBottom: 4 }}>YOUR ELECTION</div>
            <div style={{ fontWeight: 700, fontSize: '0.8rem' }}>{electionDate}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>Phase {voter.phase_number} · {voter.assembly_constituency}</div>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '4px 10px 8px' }}>MAIN</div>
        {NAV_ITEMS.map(({ to, label, svg }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                background: isActive ? 'var(--primary-tonal)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.85rem',
                transition: 'background var(--transition), color var(--transition)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0 }}>{svg}</span>
                {label}
                {isActive && <div style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: '50%', background: 'var(--primary)' }} />}
              </div>
            )}
          </NavLink>
        ))}

        <div style={{ fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '12px 10px 8px' }}>GUIDES</div>
        {SECONDARY_ITEMS.map(({ to, label, svg }) => (
          <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
            {({ isActive }) => (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '7px 12px', borderRadius: 8, marginBottom: 1,
                background: isActive ? 'var(--primary-tonal)' : 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.8rem',
                transition: 'background var(--transition), color var(--transition)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'var(--surface-2)' }}
              onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
              >
                <span style={{ flexShrink: 0 }}>{svg}</span>
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        <NavLink to="/profile" style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 10px', borderRadius: 10,
              background: isActive ? 'var(--primary-tonal)' : 'transparent',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.8rem', cursor: 'pointer',
              transition: 'background var(--transition)',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              {voter ? voter.name.split(' ')[0] : authUser?.displayName || 'Profile'}
            </div>
          )}
        </NavLink>
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 10, marginTop: 2,
          background: 'transparent', border: 'none',
          color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer',
          width: '100%', fontFamily: 'inherit',
          transition: 'background var(--transition)',
        }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
        <div style={{ marginTop: 10, fontSize: '0.6rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', lineHeight: 1.6 }}>
          NAMMA VOTE v1.0<br />
          PromptWars Challenge 2 · 2026
        </div>
      </div>
    </aside>
  )
}

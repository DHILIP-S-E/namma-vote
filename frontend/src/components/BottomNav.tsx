import React from 'react'
import { NavLink } from 'react-router-dom'

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? '0' : '1.8'}>
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" fill="none"/>
  </svg>
)

const ReadyIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M9 11l3 3L22 4"/>
    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
  </svg>
)

const AreaIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <rect x="9" y="14" width="6" height="8" rx="0.5"/>
  </svg>
)

const TruthIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="M21 21l-4.35-4.35"/>
    <path d="M8 11h6M11 8v6" strokeWidth="1.5"/>
  </svg>
)

const HelpIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const NAV_ITEMS = [
  { to: '/dashboard', Icon: HomeIcon, label: 'Home' },
  { to: '/mode1', Icon: ReadyIcon, label: 'Ready?' },
  { to: '/my-constituency', Icon: AreaIcon, label: 'My Area' },
  { to: '/mode3', Icon: TruthIcon, label: 'True?' },
  { to: '/help-rights', Icon: HelpIcon, label: 'Help' },
]

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480, zIndex: 100,
      background: 'rgba(8,9,14,0.96)', backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      padding: `10px 8px max(10px, env(safe-area-inset-bottom))`,
      boxShadow: '0 -1px 0 rgba(0,0,0,0.5)',
    }} role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ to, Icon, label }) => (
        <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
          {({ isActive }) => (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              cursor: 'pointer', minWidth: 56,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              transition: 'color 0.2s',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 48, height: 28, borderRadius: 'var(--radius-pill)',
                background: isActive ? 'var(--primary-tonal)' : 'transparent',
                transition: 'background 0.25s cubic-bezier(0.2,0,0,1)',
              }}>
                <Icon active={isActive} />
              </div>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '0.6rem', fontWeight: isActive ? 600 : 500,
                letterSpacing: '0.02em',
              }}>{label}</span>
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

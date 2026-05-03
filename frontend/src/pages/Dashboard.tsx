import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useVoterStore } from '../store/voterStore'
import { useT } from '../i18n/useT'
import { parseISO } from 'date-fns'
import AppIcon, { GRADIENTS } from '../components/AppIcon'
import {
  MapPinIcon, ShieldCheckIcon, AccessibilityIcon, AlertIcon,
  VoteIcon, MonitorIcon, MailIcon, BarChartIcon, ChecklistIcon,
  CompassIcon, FileSearchIcon, KeyboardIcon,
  CalendarIcon, BookOpenIcon, ScaleIcon, SearchCheckIcon,
} from '../components/Icons'
import { getElectionPhases } from '../api/history'
import type { PhaseInfo } from '../api/history'

function useCountdown(targetDate: string | undefined) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isElectionDay: false })

  useEffect(() => {
    if (!targetDate) return
    const update = () => {
      const target = parseISO(targetDate)
      const now = new Date()
      const totalSecs = Math.max(0, (target.getTime() - now.getTime()) / 1000)
      if (totalSecs === 0) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0, isElectionDay: true })
        return
      }
      const days = Math.floor(totalSecs / 86400)
      const hours = Math.floor((totalSecs % 86400) / 3600)
      const minutes = Math.floor((totalSecs % 3600) / 60)
      const seconds = Math.floor(totalSecs % 60)
      setTime({ days, hours, minutes, seconds, isElectionDay: false })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  return time
}

const QUICK_ACTION_DEFS = [
  { icon: <MapPinIcon size={22} color="white"/>, key: 'myBooth' as const, path: '/mode1/booth', gradient: GRADIENTS.blue },
  { icon: <ShieldCheckIcon size={22} color="white"/>, key: 'rights' as const, path: '/mode2/rights', gradient: GRADIENTS.green },
  { icon: <AccessibilityIcon size={22} color="white"/>, key: 'accessible' as const, path: '/accessibility', gradient: GRADIENTS.purple },
  { icon: <AlertIcon size={22} color="white"/>, key: 'cVigil' as const, path: '/cvigil', gradient: GRADIENTS.rose },
]

const chevronRight = (
  <svg style={{ marginLeft: 'auto', color: 'var(--text-muted)', flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export default function Dashboard() {
  const navigate = useNavigate()
  const { voter } = useVoterStore()
  const T = useT()
  const countdown = useCountdown(voter?.election_date)
  const [phases, setPhases] = useState<PhaseInfo[]>([])
  const [countingDate, setCountingDate] = useState<string | null>(null)
  const [tickerPhase, setTickerPhase] = useState<PhaseInfo | null>(null)

  useEffect(() => {
    getElectionPhases()
      .then(d => {
        setPhases(d.phases)
        setCountingDate(d.counting_date)
        if (d.phases.length > 0) setTickerPhase(d.phases[0])
      })
      .catch(() => {})
  }, [])

  const isElectionDay = countdown.isElectionDay

  return (
    <div className="page fade-in">

      {/* Live ticker — pill shaped */}
      <div className="ticker-strip" style={{ marginBottom: 20 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-live 1.5s infinite', flexShrink: 0 }} />
        <span style={{ color: 'var(--primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>LIVE</span>
        <span style={{ color: 'var(--border)' }}>·</span>
        {tickerPhase && (
          <>
            <span>
              {`Elections 2026 · Phase ${tickerPhase.phase}: ${tickerPhase.election_date ? new Date(tickerPhase.election_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''} · ${tickerPhase.states.slice(0, 2).join(', ')}`}
            </span>
            {countingDate && (
              <>
                <span style={{ color: 'var(--border)' }}>·</span>
                <span style={{ color: 'var(--india-green-light)', flexShrink: 0 }}>
                  {`Counting: ${new Date(countingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                </span>
              </>
            )}
          </>
        )}
        {!tickerPhase && (
          <span style={{ color: 'var(--text-muted)' }}>{T.loading_schedule}</span>
        )}
      </div>

      {/* Hero section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(255,107,53,0.1) 0%, rgba(91,155,248,0.06) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)',
        padding: '20px',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative orb */}
        <div style={{
          position: 'absolute', top: -30, right: -30, width: 140, height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 8, letterSpacing: '0.08em' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: 6, position: 'relative' }}>
          {voter ? `Hello, ${voter.name.split(' ')[0]}!` : 'NAMMA VOTE'}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', position: 'relative' }}>
          {voter
            ? `${voter.assembly_constituency} · Phase ${voter.phase_number}`
            : "India's Complete Election Intelligence Platform"}
        </p>
      </div>

      {/* Election Day Banner */}
      {isElectionDay && (
        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{
            background: 'linear-gradient(135deg, rgba(230,57,70,0.15) 0%, rgba(230,57,70,0.06) 100%)',
            border: '1px solid rgba(230,57,70,0.3)', borderRadius: 'var(--radius-xl)',
            padding: '20px', marginBottom: 20, textAlign: 'center'
          }}>
          <div className="badge badge-live" style={{ marginBottom: 10 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'currentColor', marginRight: 5, verticalAlign: 'middle' }} />
            {T.live} — VOTING DAY
          </div>
          <h2 style={{ color: 'var(--danger-light)', marginBottom: 8 }}>{T.electionDayBanner}</h2>
          <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>
            {T.yourBooth}: <strong>{voter?.polling_station}</strong>
          </p>
          <button className="btn btn-danger btn-full" onClick={() => navigate('/mode2')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <AppIcon gradient={GRADIENTS.rose} size={28} style={{ borderRadius: 8 }}>
              <AlertIcon size={15} color="white"/>
            </AppIcon>
            {T.openLiveGuide}
          </button>
        </motion.div>
      )}

      {/* Countdown */}
      {voter?.election_date && !isElectionDay && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>{T.electionDayCountdown}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                {T.phaseLabel(voter.phase_number)} · {new Date(voter.election_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            </div>
            <span className="badge badge-primary">Phase {voter.phase_number}</span>
          </div>
          <div className="countdown-grid">
            {[
              { v: countdown.days, l: T.days },
              { v: countdown.hours, l: T.hours },
              { v: countdown.minutes, l: T.mins },
              { v: countdown.seconds, l: T.secs },
            ].map(({ v, l }) => (
              <div key={l} className="countdown-item">
                <div className="countdown-number">{String(v).padStart(2, '0')}</div>
                <div className="countdown-label">{l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        {QUICK_ACTION_DEFS.map((a) => (
          <button key={a.key}
            onClick={() => navigate(a.path)}
            style={{
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)', padding: '16px 8px', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              fontFamily: 'inherit', transition: 'all var(--transition)',
              color: 'var(--text)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface-2)')}>
            <AppIcon gradient={a.gradient} size={44} style={{ borderRadius: 12 }}>
              {a.icon}
            </AppIcon>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{T[a.key]}</span>
          </button>
        ))}
      </div>

      {/* Three Mode Cards */}
      <div style={{ marginBottom: 4 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>{T.mainFeatures}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>

        <motion.div className="mode-card mode-1" whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mode1')}>
          {/* Decorative orb */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,155,248,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="mode-icon" style={{ background: 'transparent', padding: 0 }}>
            <AppIcon gradient={GRADIENTS.blue} size={52}><ShieldCheckIcon size={28} color="white"/></AppIcon>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: 'var(--blue)', marginBottom: 6 }}>{T.mode1Title}</h3>
              <p style={{ fontSize: '0.85rem' }}>{T.mode1Sub}</p>
            </div>
            <span style={{ color: 'var(--blue)', fontSize: '1.1rem', marginLeft: 8, marginTop: 2 }}>→</span>
          </div>
        </motion.div>

        <motion.div className="mode-card mode-2" whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mode2')}>
          {/* Decorative orb */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="mode-icon" style={{ background: 'transparent', padding: 0 }}>
            <AppIcon gradient={GRADIENTS.rose} size={52}><AlertIcon size={28} color="white"/></AppIcon>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: 'var(--primary)', marginBottom: 6 }}>
                {T.mode2Title}
                {isElectionDay && <span className="badge badge-live" style={{ marginLeft: 8 }}>{T.live}</span>}
              </h3>
              <p style={{ fontSize: '0.85rem' }}>{T.mode2Sub}</p>
            </div>
            <span style={{ color: 'var(--primary)', fontSize: '1.1rem', marginLeft: 8, marginTop: 2 }}>→</span>
          </div>
        </motion.div>

        <motion.div className="mode-card mode-3" whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/mode3')}>
          {/* Decorative orb */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div className="mode-icon" style={{ background: 'transparent', padding: 0 }}>
            <AppIcon gradient={GRADIENTS.purple} size={52}><SearchCheckIcon size={28} color="white"/></AppIcon>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ color: 'var(--purple)', marginBottom: 6 }}>{T.mode3Title}</h3>
              <p style={{ fontSize: '0.85rem' }}>{T.mode3Sub}</p>
            </div>
            <span style={{ color: 'var(--purple)', fontSize: '1.1rem', marginLeft: 8, marginTop: 2 }}>→</span>
          </div>
        </motion.div>

      </div>

      {/* Voter Card Preview */}
      {voter && (
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h4>{T.yourVoterDetails}</h4>
            <span className="badge badge-success">&#10003; {T.verified}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { l: T.name_label, v: voter.name },
              { l: T.constituency_label, v: voter.assembly_constituency },
              { l: T.booth_label, v: voter.booth_number },
              { l: T.state_label, v: voter.state_name },
            ].map(({ l, v }) => (
              <div key={l} style={{ background: 'var(--surface-3)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 2 }}>{l}</div>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{v}</div>
              </div>
            ))}
          </div>
          {voter.health_issues && voter.health_issues.length > 0 && (
            <div className="alert alert-warning" style={{ marginTop: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <AlertIcon size={16} color="currentColor" style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{voter.health_issues[0].detail} — <strong>Action needed: Form {voter.health_issues[0].form}</strong></span>
            </div>
          )}
        </div>
      )}

      {!voter && (
        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <button className="btn btn-primary btn-full" onClick={() => navigate('/mode1')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <SearchCheckIcon size={18} color="white"/>
            {T.checkMyRegistration}
          </button>
        </div>
      )}

      {/* Multi-phase Calendar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h4 style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarIcon size={18} color="var(--primary)"/>
          {T.electionPhaseCalendar}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {phases.length === 0 && (
            <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {T.loading_schedule}
            </div>
          )}
          {phases.map(p => {
            const isUserPhase = voter?.phase_number === p.phase
            const dateStr = p.election_date
              ? new Date(p.election_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
              : ''
            const statesStr = p.states.join(', ')
            return (
              <div key={p.phase} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                background: isUserPhase ? 'rgba(255,107,53,0.08)' : 'var(--surface-3)',
                borderRadius: 'var(--radius)',
                border: isUserPhase ? '1px solid rgba(255,107,53,0.25)' : '1px solid transparent',
              }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: isUserPhase ? 'var(--primary)' : 'var(--surface-4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0, color: isUserPhase ? 'white' : 'var(--text-secondary)' }}>
                  {p.phase}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                    {dateStr}
                    {isUserPhase && <span className="badge badge-primary" style={{ marginLeft: 6, fontSize: '0.65rem' }}>{T.yourPhase}</span>}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{statesStr}</div>
                </div>
              </div>
            )
          })}
        </div>
        {countingDate && (
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {T.countingDay}: <strong style={{ color: 'var(--text-secondary)' }}>{new Date(countingDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong> · {T.allPhasesCountedSimultaneously}
          </div>
        )}
      </div>

      {/* Resources Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <button onClick={() => navigate('/glossary')} className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <BookOpenIcon size={18} color="var(--blue)"/>
          {T.electionGlossary}
        </button>
        <button onClick={() => navigate('/help-rights')} className="btn btn-secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <ScaleIcon size={18} color="var(--india-green-light)"/>
          {T.helpRights}
        </button>
      </div>

      {/* Unique Feature Shortcuts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <button onClick={() => navigate('/pledge')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.saffron} size={40}><VoteIcon size={21} color="white"/></AppIcon>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{T.iWillVote}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{T.sharePledge}</div>
            </div>
            {chevronRight}
          </button>

          <button onClick={() => navigate('/evm-security')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.navy} size={40}><MonitorIcon size={21} color="white"/></AppIcon>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{T.evmFacts}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{T.bustMyths}</div>
            </div>
            {chevronRight}
          </button>

          <button onClick={() => navigate('/postal-ballot')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.green} size={40}><MailIcon size={21} color="white"/></AppIcon>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{T.postalBallot}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{T.voteFromHome}</div>
            </div>
            {chevronRight}
          </button>

          <button onClick={() => navigate('/constituency-history')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.indigo} size={40}><BarChartIcon size={21} color="white"/></AppIcon>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{T.areaHistory}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{T.pastElections}</div>
            </div>
            {chevronRight}
          </button>
        </div>

        <button onClick={() => navigate('/checklist')} style={{
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '14px 16px',
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
          textAlign: 'left',
          transition: 'background var(--transition)',
        }}>
          <AppIcon gradient={GRADIENTS.teal} size={40}><ChecklistIcon size={21} color="white"/></AppIcon>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{T.electionDayChecklist}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 1 }}>{T.checklistSub}</div>
          </div>
          {chevronRight}
        </button>
      </div>

      {/* AI-Powered Features */}
      <div style={{ marginBottom: 8 }}>
        <div className="section-label" style={{ marginBottom: 14 }}>{T.aiPoweredTools}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => navigate('/policy-quiz')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.purple} size={48}><CompassIcon size={25} color="white"/></AppIcon>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{T.policyMatchQuiz}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{T.policyMatchSub}</div>
            </div>
            {chevronRight}
          </button>

          <button onClick={() => navigate('/manifesto')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.navy} size={48}><FileSearchIcon size={25} color="white"/></AppIcon>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{T.manifestoSearch}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{T.manifestoSub}</div>
            </div>
            {chevronRight}
          </button>

          <button onClick={() => navigate('/mock-evm')} style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '14px 16px',
            background: 'var(--surface-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)',
            textAlign: 'left',
            transition: 'background var(--transition)',
          }}>
            <AppIcon gradient={GRADIENTS.teal} size={48}><KeyboardIcon size={25} color="white"/></AppIcon>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}>{T.mockEvm}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{T.mockEvmSub}</div>
            </div>
            {chevronRight}
          </button>
        </div>
      </div>
    </div>
  )
}

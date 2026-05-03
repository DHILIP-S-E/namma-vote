import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useVoterStore } from '../store/voterStore'
import AppIcon, { GRADIENTS } from '../components/AppIcon'
import { useT } from '../i18n/useT'

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', sub: 'Continue in English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', sub: 'தமிழில் தொடர' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', sub: 'हिंदी में जारी रखें' },
]

const SeedlingIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M12 22V12"/>
    <path d="M12 12C12 7 7 4 3 6c0 5 4 8 9 8"/>
    <path d="M12 12c0-5 5-8 9-6-1 5-5 8-9 8"/>
  </svg>
)

const BallotIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
    <rect x="9" y="3" width="6" height="4" rx="1"/>
    <path d="M9 12l2 2 4-4"/>
  </svg>
)

const TransportIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="11" rx="2"/>
    <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2"/>
    <circle cx="7" cy="18" r="1.5"/>
    <circle cx="17" cy="18" r="1.5"/>
  </svg>
)

const PersonIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M6 20v-2a6 6 0 0112 0v2"/>
  </svg>
)

const ClipboardIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1"/>
    <line x1="8" y1="11" x2="16" y2="11"/>
    <line x1="8" y1="16" x2="12" y2="16"/>
  </svg>
)

const PERSONA_IDS = ['first_time', 'returning', 'migrant', 'senior', 'volunteer'] as const
const PERSONA_GRADIENTS = [GRADIENTS.green, GRADIENTS.blue, GRADIENTS.amber, GRADIENTS.purple, GRADIENTS.saffron]
const PERSONA_ICONS = [SeedlingIcon, BallotIcon, TransportIcon, PersonIcon, ClipboardIcon]

const steps = ['language', 'persona', 'epic'] as const
type Step = typeof steps[number]

const STAT_NUMS = ['97 Cr+', '7', '10.5L']

export default function Onboarding() {
  const navigate = useNavigate()
  const { setLanguage, setPersona, setOnboardingDone } = useVoterStore()
  const [step, setStep] = useState<Step>('language')
  const [selectedLang, setSelectedLang] = useState('en')
  const T = useT()

  const stepIndex = steps.indexOf(step)

  const handleLanguage = (code: string) => {
    setSelectedLang(code)
    setLanguage(code as 'en' | 'ta' | 'hi')
    setTimeout(() => setStep('persona'), 220)
  }

  const handlePersona = (id: string) => {
    setPersona(id)
    setTimeout(() => setStep('epic'), 220)
  }

  const handleSkipEpic = () => { setOnboardingDone(true); navigate('/dashboard') }
  const handleContinue = () => { setOnboardingDone(true); navigate('/mode1') }

  return (
    <div className="app-container" style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>

      {/* Atmospheric background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '50%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '60%', height: '40%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(88,166,255,0.05) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        {/* Grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, padding: '32px 20px 0', display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>

        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, var(--primary) 0%, #c94020 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255,107,53,0.45)',
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', letterSpacing: '0.06em', color: 'var(--text)' }}>NAMMA VOTE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.12em' }}>நம்ம வோட் · INDIA 2026</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,107,53,0.1)', border: '1px solid rgba(255,107,53,0.2)', borderRadius: 20 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--primary)', animation: 'pulse-live 1.5s infinite' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--primary)', letterSpacing: '0.08em' }}>LIVE</span>
          </div>
        </motion.div>

        {/* Progress */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((s, i) => (
              <div key={s} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= stepIndex ? 'var(--primary)' : 'var(--surface-3)', transition: 'background 0.4s ease', boxShadow: i <= stepIndex ? '0 0 8px rgba(255,107,53,0.4)' : 'none' }} />
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: 6, letterSpacing: '0.08em' }}>
            {T.stepOf(stepIndex + 1, steps.length)}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          <AnimatePresence mode="wait">

            {step === 'language' && (
              <motion.div key="lang"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}>
                <h1 style={{ marginBottom: 6, color: 'var(--text)' }}>
                  {T.chooseLanguage.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-gradient">{T.chooseLanguage.split(' ').slice(-1)}</span>
                </h1>
                <p style={{ marginBottom: 28, fontSize: '0.9rem' }}>
                  {T.chooseLanguageSub}
                </p>

                {/* Stats strip */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
                  {[T.registeredVoters, T.electionPhases, T.pollingStations].map((label, i) => (
                    <div key={label} style={{ flex: 1, padding: '10px 8px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary)' }}>{STAT_NUMS[i]}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.05em' }}>{label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {LANGUAGES.map(lang => (
                    <button key={lang.code} onClick={() => handleLanguage(lang.code)}
                      style={{
                        background: selectedLang === lang.code ? 'rgba(255,107,53,0.08)' : 'var(--surface)',
                        border: `1px solid ${selectedLang === lang.code ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-lg)', padding: '16px 20px', cursor: 'pointer',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.18s', color: 'var(--text)', fontFamily: 'inherit',
                        boxShadow: selectedLang === lang.code ? '0 0 0 1px rgba(255,107,53,0.15), 0 0 20px rgba(255,107,53,0.06)' : 'none',
                      }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem' }}>{lang.native}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.05em' }}>{lang.sub}</div>
                      </div>
                      {selectedLang === lang.code && (
                        <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'white', fontWeight: 700 }}>✓</div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 'persona' && (
              <motion.div key="persona"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}>
                <h1 style={{ marginBottom: 6, color: 'var(--text)' }}>
                  <span className="text-gradient">{T.whoAreYou}</span>
                </h1>
                <p style={{ marginBottom: 24, fontSize: '0.9rem' }}>
                  {T.whoAreYouSub}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {PERSONA_IDS.map((id, i) => {
                    const labelKey = `persona${id.charAt(0).toUpperCase() + id.slice(1).replace('_t', 'T')}` as keyof typeof T
                    const subKey = `${labelKey}Sub` as keyof typeof T
                    const labels: Record<string, [string, string]> = {
                      first_time: [T.personaFirstTime, T.personaFirstTimeSub],
                      returning:  [T.personaReturning, T.personaReturningSub],
                      migrant:    [T.personaMigrant, T.personaMigrantSub],
                      senior:     [T.personaSenior, T.personaSeniorSub],
                      volunteer:  [T.personaVolunteer, T.personaVolunteerSub],
                    }
                    const [label, desc] = labels[id]
                    return (
                      <button key={id} onClick={() => handlePersona(id)}
                        style={{
                          background: 'var(--surface)', border: '1px solid var(--border)',
                          borderRadius: 'var(--radius-lg)', padding: '14px 18px', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 14,
                          transition: 'all 0.18s', textAlign: 'left', color: 'var(--text)', fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,53,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,107,53,0.04)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.background = 'var(--surface)' }}>
                        <AppIcon gradient={PERSONA_GRADIENTS[i]} size={44}>{PERSONA_ICONS[i]}</AppIcon>
                        <div>
                          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>{label}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                        </div>
                        <svg style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {step === 'epic' && (
              <motion.div key="epic"
                initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}>
                <h1 style={{ marginBottom: 6, color: 'var(--text)' }}>
                  <span className="text-gradient">{T.findVoterId}</span>
                </h1>
                <p style={{ marginBottom: 24, fontSize: '0.9rem' }}>
                  {T.findVoterIdSub}
                </p>

                {/* EPIC card preview */}
                <div style={{ background: 'linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 18, marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', background: 'rgba(88,166,255,0.05)' }} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--blue)', letterSpacing: '0.12em', marginBottom: 8 }}>&#9654; {T.epicFormat}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.12em', color: 'var(--text)', marginBottom: 6 }}>
                    <span style={{ color: 'var(--primary)' }}>ABC</span>{' '}
                    <span>1234567</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    {T.epicFoundOn}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                  <button onClick={handleContinue} className="btn btn-primary btn-full btn-lg">
                    {T.enterVoterId}
                  </button>
                  <button onClick={handleSkipEpic} className="btn btn-secondary btn-full">
                    {T.skipExplore}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', background: 'rgba(255,107,53,0.04)', border: '1px solid rgba(255,107,53,0.1)', borderRadius: 'var(--radius)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}>
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                  <span>{T.epicPrivacy}</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        <div style={{ padding: '20px 0 32px', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
            {T.everyVote}
          </div>
        </div>
      </div>
    </div>
  )
}

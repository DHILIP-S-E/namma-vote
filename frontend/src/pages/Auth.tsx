import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useVoterStore } from '../store/voterStore'

type Mode = 'login' | 'signup'

function localSignUp(email: string, password: string, name: string) {
  const users: Record<string, { password: string; name: string }> =
    JSON.parse(localStorage.getItem('nv_users') || '{}')
  if (users[email]) throw new Error('Email already registered. Please login.')
  users[email] = { password, name }
  localStorage.setItem('nv_users', JSON.stringify(users))
  return { uid: btoa(encodeURIComponent(email)), email, displayName: name || email.split('@')[0] }
}

function localSignIn(email: string, password: string) {
  const users: Record<string, { password: string; name: string }> =
    JSON.parse(localStorage.getItem('nv_users') || '{}')
  const user = users[email]
  if (!user) throw new Error('No account found. Please sign up first.')
  if (user.password !== password) throw new Error('Incorrect password.')
  return { uid: btoa(encodeURIComponent(email)), email, displayName: user.name || email.split('@')[0] }
}

export default function Auth() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [mode, setMode] = useState<Mode>(params.get('mode') === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { setAuthUser, onboardingDone } = useVoterStore()

  useEffect(() => {
    if (params.get('mode') === 'guest') handleGuest()
  }, [])

  const afterAuth = () => navigate(onboardingDone ? '/dashboard' : '/onboarding')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const firebaseConfigured = !!(import.meta.env.VITE_FIREBASE_API_KEY)
      let user: { uid: string; email: string | null; displayName: string | null }

      if (firebaseConfigured) {
        const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } =
          await import('firebase/auth')
        const { app } = await import('../firebase')
        const auth = getAuth(app!)
        if (mode === 'signup') {
          const cred = await createUserWithEmailAndPassword(auth, email, password)
          if (name) await updateProfile(cred.user, { displayName: name })
          user = { uid: cred.user.uid, email: cred.user.email, displayName: name || null }
        } else {
          const cred = await signInWithEmailAndPassword(auth, email, password)
          user = { uid: cred.user.uid, email: cred.user.email, displayName: cred.user.displayName }
        }
      } else {
        user = mode === 'signup'
          ? localSignUp(email, password, name)
          : localSignIn(email, password)
      }

      setAuthUser(user)
      afterAuth()
    } catch (err: any) {
      setError(err.message?.replace('Firebase: ', '') || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGuest = () => {
    setAuthUser({ uid: 'guest-' + Date.now(), email: null, displayName: 'Guest' })
    afterAuth()
  }

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
    }}>
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="btn btn-ghost btn-sm"
        style={{ position: 'absolute', top: 20, left: 20 }}
      >
        ← Back
      </button>

      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: 'linear-gradient(145deg, #FF8F5F 0%, #E84E1A 100%)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px rgba(255,107,53,0.3)',
            marginBottom: 14,
          }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <h2 style={{ marginBottom: 4 }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: '0.9rem' }}>
            {mode === 'login' ? 'Sign in to NAMMA VOTE' : 'Join the informed voter community'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: 'var(--surface-2)',
          borderRadius: 'var(--radius)',
          padding: 4,
          marginBottom: 24,
        }}>
          {(['login', 'signup'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{
              flex: 1, padding: '10px',
              borderRadius: 'calc(var(--radius) - 2px)',
              border: 'none',
              background: mode === m ? 'var(--surface)' : 'transparent',
              color: mode === m ? 'var(--text)' : 'var(--text-muted)',
              fontWeight: mode === m ? 600 : 400,
              cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'inherit',
              boxShadow: mode === m ? 'var(--shadow-card)' : 'none',
              transition: 'all 0.2s',
            }}>
              {m === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'signup' && (
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label className="input-label">Full Name</label>
              <input className="input" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>

          {error && (
            <div className="alert alert-danger" style={{ padding: '10px 14px', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary btn-full" type="submit" disabled={loading} style={{ marginTop: 4 }}>
            {loading ? (
              <><span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Please wait…</>
            ) : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>quick access</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Quick login role cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {[
            {
              label: 'Voter',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              ),
              desc: 'Demo account',
              color: '#3B82F6',
              bg: 'rgba(59,130,246,0.1)',
              onClick: () => {
                const demoEmail = 'demo@nammavote.in'
                const demoPass = 'demo1234'
                try { localSignUp(demoEmail, demoPass, 'Demo Voter') } catch {}
                const user = localSignIn(demoEmail, demoPass)
                setAuthUser(user)
                afterAuth()
              },
            },
            {
              label: 'Guest',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
                </svg>
              ),
              desc: 'No account needed',
              color: '#10B981',
              bg: 'rgba(16,185,129,0.1)',
              onClick: handleGuest,
            },
            {
              label: 'Admin',
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              ),
              desc: 'Admin panel',
              color: '#F59E0B',
              bg: 'rgba(245,158,11,0.1)',
              onClick: () => navigate('/admin'),
            },
          ].map(({ label, icon, desc, color, bg, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                gap: 6, padding: '14px 8px',
                background: bg, border: `1px solid ${color}30`,
                borderRadius: 'var(--radius)', cursor: 'pointer',
                transition: 'all 0.18s', color,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = `${color}20`)}
              onMouseLeave={e => (e.currentTarget.style.background = bg)}
            >
              {icon}
              <span style={{ fontWeight: 700, fontSize: '0.82rem', lineHeight: 1 }}>{label}</span>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1 }}>{desc}</span>
            </button>
          ))}
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 20, lineHeight: 1.6 }}>
          Your data stays on your device. We never share personal information.
        </p>
      </div>
    </div>
  )
}

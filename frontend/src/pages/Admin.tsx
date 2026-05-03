import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import client from '../api/client'

export default function Admin() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('admin_token'))
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [logging, setLogging] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [tokenCount, setTokenCount] = useState<any>(null)

  // Push notification form
  const [pushTitle, setPushTitle] = useState('')
  const [pushBody, setPushBody] = useState('')
  const [pushScope, setPushScope] = useState('all')
  const [pushTarget, setPushTarget] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (loggedIn) loadStats()
  }, [loggedIn])

  const loadStats = async () => {
    try {
      const [s, t] = await Promise.all([
        client.get('/admin/stats'),
        client.get('/notify/token-count'),
      ])
      setStats(s.data)
      setTokenCount(t.data)
    } catch (e: any) {
      if (e.response?.status !== 401) toast.error('Failed to load stats')
    }
  }

  const handleLogin = async () => {
    if (!username || !password) { toast.error('Enter credentials'); return }
    setLogging(true)
    try {
      const { data } = await client.post('/admin/login', { username, password })
      localStorage.setItem('admin_token', data.access_token)
      setLoggedIn(true)
      toast.success('Welcome, Admin!')
    } catch {
      toast.error('Invalid credentials')
    } finally {
      setLogging(false)
    }
  }

  const handleSendPush = async () => {
    if (!pushTitle || !pushBody) { toast.error('Fill in title and message'); return }
    setSending(true)
    try {
      const payload: any = { title: pushTitle, body: pushBody, target_scope: pushScope }
      if (pushScope !== 'all' && pushTarget) payload.target_value = pushTarget
      const { data } = await client.post('/notify/admin/push', payload)
      toast.success(`Sent to ${data.sent || 0} devices`)
      setPushTitle('')
      setPushBody('')
    } catch (e: any) {
      toast.error(e.response?.data?.detail || 'Send failed')
    } finally {
      setSending(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setLoggedIn(false)
  }

  if (!loggedIn) {
    return (
      <div className="page fade-in" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h2>Admin Panel</h2>
          <p style={{ fontSize: '0.875rem' }}>NAMMA VOTE — Notification Control</p>
        </div>
        <div className="card">
          <div className="input-group">
            <label className="input-label">Username</label>
            <input className="input" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" autoComplete="username" />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" autoComplete="current-password"
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>
          <button className="btn btn-primary btn-full" onClick={handleLogin} disabled={logging}>
            {logging ? <><span className="spinner" />&nbsp;Logging in...</> : 'Login →'}
          </button>
          <button
            className="btn btn-ghost btn-sm btn-full"
            style={{ marginTop: 8, border: '1px dashed var(--border)', color: 'var(--text-muted)' }}
            onClick={() => { setUsername('admin'); setPassword('admin123') }}
          >
            Quick fill — admin / admin123
          </button>
          <button className="btn btn-ghost btn-sm btn-full" style={{ marginTop: 8 }} onClick={() => navigate('/')}>
            ← Back to App
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: 0 }}>Admin Panel</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>NAMMA VOTE Control Center</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Logout</button>
      </div>

      {/* Stats */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Total Tokens', value: tokenCount?.total ?? '—' },
            { label: 'Status', value: stats.status },
            { label: 'Version', value: stats.version },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 14, textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{s.value}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Tokens by State */}
      {tokenCount?.by_state && Object.keys(tokenCount.by_state).length > 0 && (
        <div className="card" style={{ marginBottom: 20 }}>
          <h4 style={{ marginBottom: 12 }}>Registered Devices by State</h4>
          {Object.entries(tokenCount.by_state).map(([state, count]) => (
            <div key={state} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.875rem' }}>
              <span>{state}</span>
              <span className="badge badge-primary">{String(count)} devices</span>
            </div>
          ))}
        </div>
      )}

      {/* Push Notification */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Send Push Notification</h3>

        <div className="input-group">
          <label className="input-label">Title</label>
          <input className="input" value={pushTitle} onChange={e => setPushTitle(e.target.value)}
            placeholder="Election update: Booth change in Velachery" maxLength={100} />
        </div>

        <div className="input-group">
          <label className="input-label">Message</label>
          <textarea className="input" value={pushBody} onChange={e => setPushBody(e.target.value)}
            placeholder="Your booth has changed to [new address]. Tap to update your Maps." rows={3}
            style={{ resize: 'vertical' }} maxLength={500} />
        </div>

        <div className="input-group">
          <label className="input-label">Target</label>
          <select className="input" value={pushScope} onChange={e => setPushScope(e.target.value)}>
            <option value="all">All Users</option>
            <option value="state">By State</option>
            <option value="constituency">By Constituency</option>
          </select>
        </div>

        {pushScope !== 'all' && (
          <div className="input-group">
            <label className="input-label">{pushScope === 'state' ? 'State Code (e.g. TN, MH)' : 'Constituency Code'}</label>
            <input className="input" value={pushTarget} onChange={e => setPushTarget(e.target.value)}
              placeholder={pushScope === 'state' ? 'TN' : '163'} />
          </div>
        )}

        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          Will send to {pushScope === 'all' ? 'ALL registered devices' : `${pushScope} = "${pushTarget}"`}
        </div>

        <button className="btn btn-primary btn-full" onClick={handleSendPush} disabled={sending}>
          {sending ? <><span className="spinner" />&nbsp;Sending...</> : 'Send Now'}
        </button>
      </div>

      {/* Quick Notification Templates */}
      <div className="card" style={{ marginBottom: 20 }}>
        <h4 style={{ marginBottom: 14 }}>Quick Templates</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { title: 'Voting Day Reminder', body: 'VOTING DAY! Open NAMMA VOTE for live assistance. Find your booth and check your documents.' },
            { title: 'Registration Deadline', body: 'Last day to register to vote is tomorrow. Check if your name is on the electoral roll at voters.eci.gov.in.' },
            { title: 'Booth Change Alert', body: 'Some polling booth locations have been updated. Open NAMMA VOTE to check your current booth address.' },
            { title: 'Results Day', body: 'Vote counting begins in 2 hours for your constituency. Follow live results on ECI website.' },
          ].map(t => (
            <button key={t.title}
              onClick={() => { setPushTitle(t.title); setPushBody(t.body) }}
              style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text)' }}>{t.title}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{t.body.substring(0, 80)}...</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

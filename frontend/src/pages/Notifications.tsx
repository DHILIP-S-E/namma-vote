import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { requestFCMToken, isConfigured } from '../firebase'
import { registerFCMToken } from '../api/voter'
import { useVoterStore } from '../store/voterStore'
import client from '../api/client'

interface NotificationItem {
  id: string
  title: string
  body: string
  type: 'admin' | 'scraper' | 'personalized'
  created_at: string
}

const TYPE_CONFIG = {
  admin:        { color: 'var(--primary)', label: 'Official' },
  scraper:      { color: 'var(--blue)',    label: 'News' },
  personalized: { color: '#52B788',        label: 'For You' },
}

const BellIcon = ({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

const NOTIFICATION_SCHEDULE = [
  {
    dot: 'var(--primary)',
    title: '7 days before election',
    desc: 'Reminder to check your booth and documents',
  },
  {
    dot: '#C084FC',
    title: 'Election eve 8 PM',
    desc: 'Your booth address + documents needed',
  },
  {
    dot: '#FCD34D',
    title: 'Election day 7 AM',
    desc: 'VOTING DAY alert + booth walking time',
  },
  {
    dot: 'var(--blue)',
    title: 'ECI press releases',
    desc: 'Official announcements classified by AI',
  },
  {
    dot: 'var(--primary)',
    title: 'Admin alerts',
    desc: 'Booth changes, MCC violations, urgent notices',
  },
]

export default function Notifications() {
  const navigate = useNavigate()
  const { voter, epicHash, language } = useVoterStore()
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | 'unsupported'>('default')
  const [enabling, setEnabling] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loadingNotifs, setLoadingNotifs] = useState(true)

  useEffect(() => {
    if (!('Notification' in window)) {
      setPermissionStatus('unsupported')
    } else {
      setPermissionStatus(Notification.permission)
    }
  }, [])

  useEffect(() => {
    client.get('/notify/history')
      .then(res => setNotifications(res.data.notifications || []))
      .catch(() => setNotifications([]))
      .finally(() => setLoadingNotifs(false))
  }, [])

  const enableNotifications = async () => {
    if (!isConfigured) {
      toast.error('Push notifications require Firebase configuration. Add VITE_FIREBASE_* vars to .env')
      return
    }
    setEnabling(true)
    try {
      const token = await requestFCMToken()
      if (!token) {
        toast.error('Permission denied or Firebase not configured')
        return
      }
      if (voter && epicHash) {
        await registerFCMToken({
          epic_hash: epicHash,
          fcm_token: token,
          state: voter.state_code,
          constituency: voter.assembly_code,
          language: language || 'en',
        })
      }
      setPermissionStatus('granted')
      toast.success('Push notifications enabled! ✓')
    } catch (e) {
      toast.error('Could not enable notifications')
    } finally {
      setEnabling(false)
    }
  }

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Notifications</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Election alerts and updates</p>
        </div>
      </div>

      {/* Push Permission Banner */}
      {permissionStatus !== 'granted' && permissionStatus !== 'unsupported' && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          style={{
            background: 'rgba(255,107,53,0.08)', border: '1px solid rgba(255,107,53,0.3)',
            borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 20,
          }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ flexShrink: 0, marginTop: 2 }}>
              <BellIcon size={24} color="var(--primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Enable Push Notifications</div>
              <p style={{ fontSize: '0.8rem', marginBottom: 12 }}>
                Get notified on election day morning, booth changes, and important ECI announcements.
              </p>
              <button className="btn btn-primary btn-sm" onClick={enableNotifications} disabled={enabling}>
                {enabling ? <><span className="spinner" />&nbsp;Enabling...</> : 'Enable Notifications'}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {permissionStatus === 'granted' && (
        <div className="alert alert-success" style={{ marginBottom: 20 }}>
          ✓ Push notifications are active. You will be notified on election day at 7 AM.
        </div>
      )}

      {/* Notification List */}
      {loadingNotifs && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80 }} />)}
        </div>
      )}
      {!loadingNotifs && notifications.length === 0 && (
        <div className="empty-state" style={{ marginBottom: 20 }}>
          <div className="empty-state-icon">
            <BellIcon size={40} color="var(--text-muted)" />
          </div>
          <h3>No notifications yet</h3>
          <p>You will receive alerts about your election day, booth changes, and ECI announcements here.</p>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notifications.map((n, i) => {
          const cfg = TYPE_CONFIG[n.type]
          return (
            <motion.div key={n.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)', padding: 16,
                borderLeft: `3px solid ${cfg.color}`,
              }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color, marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>{formatTime(n.created_at)}</div>
                  </div>
                  <p style={{ fontSize: '0.82rem', marginTop: 4, color: 'var(--text-secondary)' }}>{n.body}</p>
                  <span className="badge" style={{ marginTop: 8, background: cfg.color, color: 'white', fontSize: '0.65rem' }}>
                    {cfg.label}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Notification Types Info */}
      <div className="card" style={{ marginTop: 24 }}>
        <h4 style={{ marginBottom: 12 }}>What You Will Receive</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {NOTIFICATION_SCHEDULE.map(item => (
            <div key={item.title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.dot, flexShrink: 0, marginTop: 5 }} />
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.title}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

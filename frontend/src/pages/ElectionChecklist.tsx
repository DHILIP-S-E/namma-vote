import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import { useVoterStore } from '../store/voterStore'

const CHECKLIST_ITEMS = [
  {
    id: 'id',
    title: 'Carry Voter ID / Valid Photo ID',
    detail: 'EPIC card, Aadhaar, Passport, Driving Licence, or any ECI-approved photo ID',
    critical: true,
  },
  {
    id: 'booth',
    title: 'Know your exact booth address',
    detail: 'Check the polling station name and address on your voter slip or voters.eci.gov.in',
    critical: true,
  },
  {
    id: 'candidate',
    title: 'Know your candidates',
    detail: 'Review the candidates and party symbols before entering the booth — you cannot carry notes inside',
    critical: true,
  },
  {
    id: 'time',
    title: 'Check polling hours',
    detail: "Most booths: 7 AM – 6 PM. Check your voter slip or ECI website for your booth's exact hours",
    critical: true,
  },
  {
    id: 'slip',
    title: 'Carry your voter information slip',
    detail: 'The slip issued by your BLO shows your serial number — speeds up entry at the booth',
    critical: false,
  },
  {
    id: 'phone',
    title: 'Keep phone on silent inside booth',
    detail: 'Photography inside the booth is illegal. You can use your phone outside for help numbers',
    critical: false,
  },
  {
    id: 'queue',
    title: 'Join the correct queue',
    detail: 'Separate queues for men, women, and PwD voters. PwD/seniors get priority entry',
    critical: false,
  },
  {
    id: 'rights',
    title: 'Know your right to cast a Tender Vote',
    detail: 'If someone has already voted in your name, demand a Tender Vote from the Presiding Officer',
    critical: false,
  },
  {
    id: 'vvpat',
    title: 'Verify VVPAT slip after voting',
    detail: 'After pressing the EVM button, check the VVPAT window — your candidate\'s symbol must appear for 7 seconds',
    critical: false,
  },
  {
    id: 'report',
    title: 'Report violations to 1950 or cVIGIL',
    detail: 'Cash distribution, voter intimidation, or booth capture? Call 1950 or use the cVIGIL app immediately',
    critical: false,
  },
]

export default function ElectionChecklist() {
  const { voter } = useVoterStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [sharing, setSharing] = useState(false)

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const criticalDone = CHECKLIST_ITEMS.filter(i => i.critical).every(i => checked.has(i.id))
  const allDone = CHECKLIST_ITEMS.every(i => checked.has(i.id))
  const pct = Math.round((checked.size / CHECKLIST_ITEMS.length) * 100)

  const handleShare = async () => {
    if (!cardRef.current) return
    setSharing(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 3,
        useCORS: true,
        logging: false,
      })
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'election-checklist-nammavote.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'My Election Day Checklist — NAMMA VOTE', files: [file] })
        } else {
          const url = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = url
          a.download = 'election-checklist-nammavote.png'
          a.click()
          toast.success('Checklist saved! Share on WhatsApp or Instagram.')
        }
      }, 'image/png')
    } catch {
      toast.error('Could not generate image')
    } finally {
      setSharing(false)
    }
  }

  const name = voter?.name || 'VOTER'
  const constituency = voter?.assembly_constituency || 'Your Constituency'
  const electionDate = voter?.election_date
    ? new Date(voter.election_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Election Day 2026'

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Election Day Checklist</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>Complete before leaving home on polling day</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 700 }}>{checked.size} / {CHECKLIST_ITEMS.length} done</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {allDone ? 'You are fully ready to vote!' : criticalDone ? 'Critical items done — good to go!' : 'Complete critical items before heading out'}
            </div>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `conic-gradient(${allDone ? '#52B788' : criticalDone ? 'var(--primary)' : 'var(--warning)'} ${pct * 3.6}deg, var(--surface-2) 0deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem' }}>
              {pct}%
            </div>
          </div>
        </div>
        <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: allDone ? '#52B788' : criticalDone ? 'var(--primary)' : 'var(--warning)', borderRadius: 3, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Critical Items */}
      <div style={{ fontSize: '0.7rem', color: 'var(--danger-light)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--danger-light)', flexShrink: 0 }} />
        MUST-DO BEFORE LEAVING
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {CHECKLIST_ITEMS.filter(i => i.critical).map(item => (
          <CheckItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} />
        ))}
      </div>

      {/* Optional Items */}
      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 8 }}>
        GOOD TO KNOW
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {CHECKLIST_ITEMS.filter(i => !i.critical).map(item => (
          <CheckItem key={item.id} item={item} checked={checked.has(item.id)} onToggle={() => toggle(item.id)} />
        ))}
      </div>

      {/* Shareable Card (hidden visually but captured by html2canvas) */}
      <div ref={cardRef} style={{
        background: 'linear-gradient(135deg, #0D1117 0%, #1a1f2e 50%, #0D1117 100%)',
        border: '2px solid rgba(82,183,136,0.5)',
        borderRadius: 20, padding: 24, marginBottom: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(82,183,136,0.06)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(82,183,136,0.2)', border: '1px solid rgba(82,183,136,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#52B788' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#FF6B35', letterSpacing: '0.05em' }}>NAMMA VOTE</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em' }}>ELECTION DAY CHECKLIST</div>
          </div>
        </div>

        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'white', marginBottom: 4 }}>{name}</div>
        <div style={{ fontSize: '0.8rem', color: '#52B788', marginBottom: 16 }}>{constituency} · {electionDate}</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {CHECKLIST_ITEMS.filter(i => i.critical).map(item => (
            <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: checked.has(item.id) ? 'rgba(82,183,136,0.15)' : 'rgba(255,255,255,0.04)', borderRadius: 8, border: `1px solid ${checked.has(item.id) ? 'rgba(82,183,136,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
              <div style={{ width: 18, height: 18, borderRadius: 4, background: checked.has(item.id) ? '#52B788' : 'rgba(255,255,255,0.08)', border: `1px solid ${checked.has(item.id) ? '#52B788' : 'rgba(255,255,255,0.2)'}`, flexShrink: 0 }} />
              <span style={{ fontSize: '0.72rem', color: checked.has(item.id) ? '#52B788' : 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{item.title.split(' ').slice(0, 4).join(' ')}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 12 }}>
          <div style={{ fontSize: '0.75rem', color: '#52B788', fontWeight: 700 }}>{pct}% Ready</div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,107,53,0.6)' }}>nammavote.app</div>
        </div>
      </div>

      {/* Action Buttons */}
      <button
        className="btn btn-full"
        onClick={handleShare}
        disabled={sharing}
        style={{ background: 'linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)', color: 'white', borderRadius: 'var(--radius-pill)', padding: '16px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 10 }}
      >
        {sharing ? 'Generating...' : 'Download & Share Checklist'}
      </button>

      <button className="btn btn-secondary btn-full" onClick={() => {
        setChecked(new Set())
        toast.success('Checklist reset')
      }}>
        Reset All
      </button>
    </div>
  )
}

function CheckItem({ item, checked, onToggle }: {
  item: typeof CHECKLIST_ITEMS[0]
  checked: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 16px',
        background: checked ? 'rgba(82,183,136,0.08)' : 'var(--surface)',
        border: `1px solid ${checked ? 'rgba(82,183,136,0.35)' : 'var(--border)'}`,
        borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'inherit',
        color: 'var(--text)', textAlign: 'left', transition: 'all 0.2s', width: '100%',
      }}
    >
      <div style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0, marginTop: 1,
        background: checked ? '#52B788' : 'var(--surface-2)',
        border: `2px solid ${checked ? '#52B788' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.9rem', transition: 'all 0.2s',
      }}>
        {checked ? '✓' : ''}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: 3 }}>
          <span style={{ fontWeight: 700, fontSize: '0.875rem', textDecoration: checked ? 'line-through' : 'none', color: checked ? 'var(--text-muted)' : 'var(--text)' }}>
            {item.title}
          </span>
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>{item.detail}</div>
      </div>
    </button>
  )
}

import React, { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import { useVoterStore } from '../store/voterStore'

export default function PledgeCard() {
  const { voter } = useVoterStore()
  const cardRef = useRef<HTMLDivElement>(null)
  const [sharing, setSharing] = useState(false)
  const [pledged, setPledged] = useState(false)

  const name = voter?.name || 'YOUR NAME'
  const constituency = voter?.assembly_constituency || 'Your Constituency'
  const state = voter?.state_name || 'India'
  const electionDate = voter?.election_date
    ? new Date(voter.election_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Election Day 2026'

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
        const file = new File([blob], 'i-will-vote-nammavote.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'I Will Vote — NAMMA VOTE', files: [file] })
        } else {
          const url = canvas.toDataURL('image/png')
          const a = document.createElement('a')
          a.href = url
          a.download = 'i-will-vote-nammavote.png'
          a.click()
          toast.success('Card saved! Share it on WhatsApp, Instagram, or Twitter.')
        }
        setPledged(true)
      }, 'image/png')
    } catch {
      toast.error('Could not generate card')
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>I Will Vote Pledge</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>Generate your shareable voter pledge card</p>
        </div>
      </div>

      {/* Shareable Card Preview */}
      <div ref={cardRef} style={{
        background: 'linear-gradient(135deg, #0D1117 0%, #1a1f2e 50%, #0D1117 100%)',
        border: '2px solid rgba(255,107,53,0.6)',
        borderRadius: 20, padding: 28, marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,107,53,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(88,166,255,0.06)', pointerEvents: 'none' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#FF6B35' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#FF6B35', letterSpacing: '0.05em' }}>NAMMA VOTE</div>
            <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em' }}>நம்ம வோட் · INDIA VOTES 2026</div>
          </div>
        </div>

        {/* Main Message */}
        <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 0, marginBottom: 8, width: 48, height: 32, borderRadius: 4, overflow: 'hidden', margin: '0 auto 8px' }}>
            <div style={{ flex: 1, background: '#FF9933' }} />
            <div style={{ flex: 1, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', border: '1.5px solid #000080' }} />
            </div>
            <div style={{ flex: 1, background: '#138808' }} />
          </div>
          <div style={{ fontWeight: 900, fontSize: '1.6rem', color: 'white', letterSpacing: '0.02em', lineHeight: 1.2 }}>
            I WILL VOTE
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)', marginTop: 4, letterSpacing: '0.1em' }}>
            मैं वोट डालूँगा · நான் வாக்களிப்பேன்
          </div>
        </div>

        {/* Voter Details */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', marginBottom: 4 }}>REGISTERED VOTER</div>
          <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'white' }}>{name}</div>
          <div style={{ fontSize: '0.85rem', color: '#FF6B35', marginTop: 2 }}>{constituency} · {state}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.06em' }}>ELECTION DAY</div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#52B788' }}>{electionDate}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>Every Vote. Informed. Protected.</div>
            <div style={{ fontSize: '0.68rem', color: 'rgba(255,107,53,0.6)', marginTop: 2 }}>nammavote.app</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { number: '97 Cr', label: 'Registered voters' },
          { number: '67%', label: 'Avg turnout 2024' },
          { number: '1 Vote', label: 'Can change history' },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 8px', textAlign: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--primary)' }}>{item.number}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* Share Button */}
      <button
        className="btn btn-full"
        onClick={handleShare}
        disabled={sharing}
        style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #E63946 100%)', color: 'white', borderRadius: 'var(--radius-pill)', padding: '16px', fontSize: '1.05rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginBottom: 12 }}
      >
        {sharing ? 'Generating...' : pledged ? 'Shared! Share Again' : 'Download & Share Card'}
      </button>

      <button className="btn btn-secondary btn-full" onClick={() => {
        const text = `I pledge to vote in the 2026 elections!\n\n${name} · ${constituency}, ${state}\n\nCheck if YOU are registered: nammavote.app\n\n#NammaVote #IWillVote #India2026`
        if (navigator.share) navigator.share({ title: 'I Will Vote', text })
        else { navigator.clipboard.writeText(text); toast.success('Text copied!') }
      }}>
        Share as Text (WhatsApp)
      </button>
    </div>
  )
}

import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'
import { checkRumour, type RumourResult, type Verdict } from '../api/rumour'
import { useVoterStore } from '../store/voterStore'

const VERDICT_CONFIG: Record<Verdict, { color: string; bg: string; border: string; label: string }> = {
  TRUE:      { color: '#52B788', bg: 'rgba(45,106,79,0.1)',  border: 'rgba(45,106,79,0.4)',  label: 'TRUE' },
  FALSE:     { color: '#FF4D58', bg: 'rgba(230,57,70,0.08)', border: 'rgba(230,57,70,0.4)',  label: 'FALSE' },
  MISLEADING:{ color: '#F4A261', bg: 'rgba(244,162,97,0.08)',border: 'rgba(244,162,97,0.4)', label: 'MISLEADING' },
}

const VERDICT_SVG: Record<Verdict, React.ReactNode> = {
  TRUE: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" strokeWidth="1.8"/>
      <polyline points="9 12 11 14 15 10" strokeWidth="2.2"/>
    </svg>
  ),
  FALSE: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#FF4D58" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" strokeWidth="1.8"/>
      <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
  MISLEADING: (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#F4A261" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeWidth="1.8"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <circle cx="12" cy="17" r="0.8" fill="#F4A261"/>
    </svg>
  ),
}

export default function Mode3() {
  const navigate = useNavigate()
  const { language, voter } = useVoterStore()
  const [claim, setClaim] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RumourResult | null>(null)
  const [shared, setShared] = useState(false)
  const shareRef = useRef<HTMLDivElement>(null)

  const handleCheck = async () => {
    if (claim.trim().length < 10) {
      toast.error('Please enter the full claim (at least 10 characters)')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const res = await checkRumour(claim.trim(), language, voter?.state_code)
      setResult(res)
    } catch {
      toast.error('Could not verify — check your internet connection')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (!result || !shareRef.current) return
    const cfg = VERDICT_CONFIG[result.verdict]
    try {
      // Try image share first (visual card)
      const canvas = await html2canvas(shareRef.current, {
        backgroundColor: '#0D1117',
        scale: 2,
        useCORS: true,
        logging: false,
      })
      canvas.toBlob(async (blob) => {
        if (blob && navigator.share && navigator.canShare?.({ files: [new File([blob], 'nammavote-factcheck.png', { type: 'image/png' })] })) {
          await navigator.share({
            title: 'NAMMA VOTE Fact Check',
            files: [new File([blob], 'nammavote-factcheck.png', { type: 'image/png' })],
          })
          setShared(true)
          return
        }
        // Fallback: download image
        const url = canvas.toDataURL('image/png')
        const a = document.createElement('a')
        a.href = url
        a.download = 'nammavote-factcheck.png'
        a.click()
        toast.success('Image saved! Share it on WhatsApp.')
        setShared(true)
      }, 'image/png')
    } catch {
      // Final fallback: text share
      const text = `NAMMA VOTE Fact Check\n\nClaim: "${result.claim}"\n\nVerdict: ${cfg.label}\n\n${result.explanation}\n\nSource: ${result.source_url}\n\nCheck any election claim at nammavote.app`
      try {
        if (navigator.share) {
          await navigator.share({ title: 'NAMMA VOTE Fact Check', text })
        } else {
          await navigator.clipboard.writeText(text)
          toast.success('Copied to clipboard! Paste on WhatsApp.')
        }
        setShared(true)
      } catch {
        toast.error('Could not share')
      }
    }
  }

  const cfg = result ? VERDICT_CONFIG[result.verdict] : null

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Is This True?</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Gemini AI checks against ECI official data</p>
        </div>
      </div>

      {/* Input */}
      <div className="card" style={{ marginBottom: 20 }}>
        <label className="input-label" style={{ marginBottom: 10, display: 'block' }}>
          Paste the claim or WhatsApp message here
        </label>
        <textarea
          value={claim}
          onChange={e => setClaim(e.target.value)}
          placeholder="e.g. Voting date in Chennai has been changed to tomorrow..."
          style={{
            width: '100%', minHeight: 100, background: 'var(--surface-2)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.95rem',
            padding: 14, resize: 'vertical', outline: 'none', lineHeight: 1.6,
            transition: 'border-color var(--transition)'
          }}
          onFocus={e => e.target.style.borderColor = 'var(--purple)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 16 }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{claim.length}/2000</span>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => setClaim('')}>Clear</button>
        </div>
        <button className="btn btn-full" onClick={handleCheck} disabled={loading}
          style={{ background: 'linear-gradient(135deg, var(--purple) 0%, #9B59B6 100%)', color: 'white', borderRadius: 'var(--radius-pill)',
            padding: '14px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: loading ? 0.8 : 1 }}>
          {loading ? (
            <><span className="spinner" style={{ borderTopColor: 'white' }} />Checking with Gemini AI...</>
          ) : (
            <>Fact Check This Claim</>
          )}
        </button>
      </div>


      {/* Verdict Card */}
      <AnimatePresence>
        {result && cfg && (
          <motion.div ref={shareRef} key="verdict"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              background: cfg.bg, border: `2px solid ${cfg.border}`,
              borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 16
            }}>

            {/* Verdict Badge */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
                {VERDICT_SVG[result.verdict]}
              </motion.div>
              <div style={{
                display: 'inline-block', padding: '8px 24px',
                background: cfg.color, color: 'white', borderRadius: 'var(--radius-pill)',
                fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.05em'
              }}>
                {cfg.label}
              </div>
            </div>

            {/* Claim */}
            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: 600 }}>CLAIM CHECKED</div>
              <div style={{ fontStyle: 'italic', fontSize: '0.875rem', lineHeight: 1.6 }}>"{result.claim}"</div>
            </div>

            {/* Explanation */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.7rem', color: cfg.color, fontWeight: 700, marginBottom: 6, letterSpacing: '0.05em' }}>
                FACT CHECK RESULT
              </div>
              <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                {result.explanation}
              </p>
            </div>

            {/* Source */}
            {result.source_url && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.15)',
                borderRadius: 'var(--radius)', padding: '10px 14px', marginBottom: 20
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>OFFICIAL SOURCE</div>
                  <div style={{ fontSize: '0.8rem', color: cfg.color, fontWeight: 500 }}>{result.source_url}</div>
                </div>
              </div>
            )}

            {/* Share */}
            <button onClick={handleShare}
              style={{
                width: '100%', padding: '14px', background: cfg.color, color: 'white',
                border: 'none', borderRadius: 'var(--radius-pill)', fontFamily: 'inherit',
                fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: 8
              }}>
              {shared ? '✓ Shared!' : 'Share This Correction'}
            </button>

            {/* NAMMA VOTE Watermark */}
            <div style={{ textAlign: 'center', marginTop: 14, fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>
              NAMMA VOTE — நம்ம வோட் · nammavote.app
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Try Another */}
      {result && (
        <button className="btn btn-secondary btn-full" onClick={() => { setResult(null); setClaim(''); setShared(false) }}>
          Check Another Claim
        </button>
      )}
    </div>
  )
}

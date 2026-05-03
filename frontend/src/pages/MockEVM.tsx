import React, { useState, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useVoterStore } from '../store/voterStore'
import { getCandidates } from '../api/candidates'

const PARTY_COLORS: Record<string, string> = {
  DMK: '#DA3832', AIADMK: '#2D8A3E', BJP: '#FF6B00', INC: '#146EB4',
  NTK: '#8B0000', NOTA: '#4A6080', ADMK: '#2D8A3E', TMC: '#1C6B3A',
}
const partyColor = (party: string) =>
  PARTY_COLORS[party?.toUpperCase()] ?? '#6B7280'

type Phase = 'ready' | 'voting' | 'voted' | 'vvpat' | 'done'

export default function MockEVM() {
  const { voter } = useVoterStore()
  const [phase, setPhase] = useState<Phase>('ready')
  const [pressed, setPressed] = useState<number | null>(null)
  const [vvpatVisible, setVvpatVisible] = useState(false)
  const [vvpatCountdown, setVvpatCountdown] = useState(7)
  const [beepVisible, setBeepVisible] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const beepTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['candidates', voter?.state_name, voter?.assembly_constituency],
    queryFn: () => getCandidates(voter!.state_name, voter!.assembly_constituency),
    enabled: !!(voter?.state_name && voter?.assembly_constituency),
  })

  const candidates = (data?.candidates ?? []).map((c, i) => ({
    serial: c.serial_number ?? i + 1,
    name: c.name,
    party: c.party_short || c.party,
    color: partyColor(c.party_short || c.party),
  }))

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (beepTimeout.current) clearTimeout(beepTimeout.current)
  }, [])

  const handlePresiding = () => setPhase('voting')

  const handleVote = (serial: number) => {
    if (phase !== 'voting' || pressed !== null) return
    setPressed(serial)
    setPhase('voted')
    setBeepVisible(true)
    beepTimeout.current = setTimeout(() => setBeepVisible(false), 800)
    setTimeout(() => {
      setPhase('vvpat')
      setVvpatVisible(true)
      setVvpatCountdown(7)
      timerRef.current = setInterval(() => {
        setVvpatCountdown(c => {
          if (c <= 1) {
            clearInterval(timerRef.current!)
            setVvpatVisible(false)
            setTimeout(() => setPhase('done'), 300)
            return 0
          }
          return c - 1
        })
      }, 1000)
    }, 600)
  }

  const reset = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('ready')
    setPressed(null)
    setVvpatVisible(false)
    setVvpatCountdown(7)
    setBeepVisible(false)
    setAttempts(a => a + 1)
  }

  const votedCandidate = pressed ? candidates.find(c => c.serial === pressed) : null

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div className="page-title-block" style={{ marginBottom: 0 }}>
          <h2>Mock EVM Practice</h2>
          <div className="subtitle">Practice before election day — safe & anonymous</div>
        </div>
      </div>

      {/* No voter ID */}
      {!voter && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🗳️</div>
          <h3 style={{ marginBottom: 8 }}>Set Up Your Voter ID First</h3>
          <p style={{ fontSize: '0.875rem' }}>Enter your EPIC number to load real candidates from your constituency.</p>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => window.history.back()}>
            Go Back &amp; Enter Voter ID
          </button>
        </div>
      )}

      {/* Loading */}
      {voter && isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
            LOADING CANDIDATES FROM {voter.assembly_constituency?.toUpperCase()}…
          </div>
        </div>
      )}

      {/* Error */}
      {voter && isError && (
        <div className="alert alert-warning" style={{ marginBottom: 16 }}>
          Could not load candidates. Make sure the backend is running.
        </div>
      )}

      {/* EVM — only render when candidates are loaded */}
      {voter && !isLoading && candidates.length > 0 && (
        <>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 14px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: phase === 'done' ? 'var(--india-green-light)' : phase === 'ready' ? 'var(--warning)' : 'var(--primary)', animation: phase !== 'done' && phase !== 'ready' ? 'pulse-live 1s infinite' : 'none', flexShrink: 0 }} />
            SIMULATION · {phase === 'ready' ? 'AWAITING PRESIDING OFFICER' : phase === 'voting' ? 'VOTING IN PROGRESS' : phase === 'voted' ? 'PROCESSING...' : phase === 'vvpat' ? `VVPAT DISPLAY — ${vvpatCountdown}s` : 'VOTE RECORDED'}
            <span style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>ATTEMPT #{attempts + 1}</span>
          </div>

          <div className="evm-body" style={{ padding: 0, overflow: 'hidden', marginBottom: 20 }}>
            <div style={{ background: 'linear-gradient(90deg, #0d1a2e 0%, #1a2d47 100%)', padding: '12px 16px', borderBottom: '1px solid #2a3f5f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#4a7de8', letterSpacing: '0.1em' }}>CONTROL UNIT · EVM M3</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: '#2a3f5f', marginTop: 2 }}>BEL / ECIL · ELECTION COMMISSION OF INDIA</div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase === 'voting' ? '#52B788' : '#2a3f5f', transition: 'all 0.3s' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: beepVisible ? '#f4a261' : '#2a3f5f', transition: 'all 0.3s' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: phase === 'done' ? '#52B788' : '#2a3f5f', transition: 'all 0.3s' }} />
              </div>
            </div>

            <div style={{ padding: '14px 16px' }}>
              {phase === 'ready' && (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#4a7de8', marginBottom: 12, letterSpacing: '0.08em' }}>MACHINE LOCKED</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 20 }}>Presiding Officer must enable before voting begins</div>
                  <button onClick={handlePresiding} style={{ padding: '10px 24px', background: 'rgba(74,125,232,0.15)', border: '1px solid #4a7de8', borderRadius: 8, color: '#4a7de8', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.08em' }}>
                    ENABLE BALLOT UNIT →
                  </button>
                </div>
              )}

              {(phase === 'voting' || phase === 'voted') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {candidates.map((c, i) => (
                    <div key={c.serial} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', background: pressed === c.serial ? 'rgba(82,183,136,0.08)' : i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderRadius: 6, borderBottom: i < candidates.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none', transition: 'background 0.2s' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: '#2a3f5f', width: 18, textAlign: 'center', flexShrink: 0 }}>{c.serial}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: pressed === c.serial ? '#52B788' : '#b8c8e0' }}>{c.name}</div>
                        <div style={{ fontSize: '0.65rem', color: c.color, marginTop: 1 }}>{c.party}</div>
                      </div>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <button className={`evm-button${pressed === c.serial ? ' pressed' : ''}`} onClick={() => handleVote(c.serial)} disabled={phase !== 'voting'} aria-label={`Vote for ${c.name}`} />
                    </div>
                  ))}
                </div>
              )}

              {(phase === 'vvpat' || phase === 'done') && (
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                  {phase === 'done' && (
                    <div style={{ animation: 'bounceIn 0.5s ease' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(82,183,136,0.2)', border: '2px solid #52B788', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontSize: '1.1rem', color: '#52B788', fontWeight: 800 }}>✓</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#52B788', letterSpacing: '0.08em' }}>VOTE RECORDED</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>Your vote is secret. Machine locked.</div>
                    </div>
                  )}
                  {phase === 'vvpat' && (
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#f4a261', letterSpacing: '0.1em', marginBottom: 8 }}>VOTE CAST — VERIFYING...</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Check VVPAT window →</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* VVPAT */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>▶ VVPAT — VOTER VERIFIABLE PAPER AUDIT TRAIL</div>
            <div className="vvpat-window">
              {vvpatVisible && votedCandidate ? (
                <div className="vvpat-slip">
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: votedCandidate.color, margin: '0 auto 6px', border: '2px solid rgba(0,0,0,0.15)' }} />
                  <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#1a1a1a' }}>{votedCandidate.name}</div>
                  <div style={{ fontSize: '0.65rem', color: '#333', marginTop: 2 }}>{votedCandidate.party}</div>
                  <div style={{ marginTop: 6, fontSize: '0.6rem', color: '#666', borderTop: '1px dashed #ccc', paddingTop: 4 }}>This slip will be visible for {vvpatCountdown}s</div>
                </div>
              ) : (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#0a3d1a', letterSpacing: '0.08em', textAlign: 'center' }}>
                  {phase === 'done' ? 'SLIP DROPPED INTO SEALED BOX' : 'WAITING FOR VOTE...'}
                </div>
              )}
            </div>
            <div style={{ marginTop: 8, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>VVPAT displays your vote for exactly 7 seconds, then the slip drops into a sealed box</div>
          </div>

          {phase === 'done' ? (
            <div className="card card-neon-green" style={{ marginBottom: 16 }}>
              <div className="card-terminal-header">SIMULATION COMPLETE</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
                You voted for <strong style={{ color: votedCandidate?.color }}>{votedCandidate?.name} ({votedCandidate?.party})</strong>. In a real election:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {['The VVPAT slip is your physical proof — check it carefully', 'You cannot change your vote after pressing the button', 'If the VVPAT shows wrong candidate, tell the Presiding Officer immediately', 'Your vote is completely secret — no one can see which button you pressed'].map((tip, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span style={{ color: 'var(--india-green-light)', flexShrink: 0 }}>✓</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
              <button className="btn btn-secondary btn-full" style={{ marginTop: 16 }} onClick={reset}>Practice Again</button>
            </div>
          ) : (
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-terminal-header">HOW TO USE THIS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {[
                  { n: '1', t: 'Tap "Enable Ballot Unit" — the Presiding Officer does this in real booths' },
                  { n: '2', t: 'Press the blue button next to your chosen candidate' },
                  { n: '3', t: 'Watch the VVPAT window — verify your vote for 7 seconds' },
                  { n: '4', t: 'A beep confirms your vote is recorded — machine locks again' },
                ].map(s => (
                  <div key={s.n} style={{ display: 'flex', gap: 12, padding: '8px 0' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700 }}>{s.n}</div>
                    <span style={{ lineHeight: 1.55 }}>{s.t}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty state — candidates loaded but empty */}
      {voter && !isLoading && !isError && candidates.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📋</div>
          <h3 style={{ marginBottom: 8 }}>No Candidates Yet</h3>
          <p style={{ fontSize: '0.875rem' }}>Candidates for <strong>{voter.assembly_constituency}</strong> haven't been uploaded yet. Check back closer to election day.</p>
        </div>
      )}
    </div>
  )
}

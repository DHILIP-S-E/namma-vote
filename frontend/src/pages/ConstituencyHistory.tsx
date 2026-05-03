import React, { useEffect, useState } from 'react'
import { useVoterStore } from '../store/voterStore'
import { getConstituencyHistory } from '../api/history'
import type { ConstituencyHistoryData } from '../api/history'

function TurnoutBar({ pct }: { pct: number }) {
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
        <span>Voter Turnout</span>
        <span style={{ fontWeight: 700, color: pct >= 70 ? '#52B788' : pct >= 60 ? 'var(--warning)' : 'var(--danger-light)' }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: pct >= 70 ? '#52B788' : pct >= 60 ? 'var(--warning)' : 'var(--danger-light)', borderRadius: 3, transition: 'width 0.8s ease' }} />
      </div>
    </div>
  )
}

export default function ConstituencyHistory() {
  const { voter } = useVoterStore()
  const stateCode = voter?.state_code || 'TN'
  const constituencyCode = voter?.assembly_code || '163'
  const constituencyName = voter?.assembly_constituency || 'Your Constituency'

  const [data, setData] = useState<ConstituencyHistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    getConstituencyHistory(stateCode, constituencyCode)
      .then(d => { setData(d); setLoading(false) })
      .catch(() => { setError(true); setLoading(false) })
  }, [stateCode, constituencyCode])

  const past = data?.past || []
  const nota = data?.nota || []
  const maxVotes = past.length > 0 ? Math.max(...past.map(p => p.votes)) : 1

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Constituency History</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>{data?.constituency_name || constituencyName} · Past elections &amp; trends</p>
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          Loading election history...
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-warning" style={{ marginBottom: 20 }}>
          Could not load history data. Check your connection and try again.
          <br /><a href="https://results.eci.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>View at results.eci.gov.in →</a>
        </div>
      )}

      {!loading && data && (
        <>
          {/* Insight Card */}
          <div style={{ background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 'var(--radius-lg)', padding: 16, marginBottom: 20 }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--blue)', fontWeight: 700, letterSpacing: '0.06em', marginBottom: 6 }}>CONSTITUENCY INSIGHT</div>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>{data.insight}</p>
            <div style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pattern: {data.swing_note}</div>
          </div>

          {past.length === 0 && (
            <div className="alert alert-info" style={{ marginBottom: 20 }}>
              No past election records found for this constituency yet.
              <br /><a href="https://results.eci.gov.in" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Check results.eci.gov.in →</a>
            </div>
          )}

          {/* Past Results */}
          {past.length > 0 && (
            <>
              <h3 style={{ marginBottom: 14 }}>Past Election Results</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {past.map((election, i) => (
                  <div key={election.year} className="card" style={{ borderLeft: `3px solid ${i === 0 ? 'var(--primary)' : 'var(--border)'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>{election.year}</span>
                          {i === 0 && <span className="badge badge-primary" style={{ fontSize: '0.65rem' }}>LATEST</span>}
                        </div>
                        <div style={{ fontWeight: 700, marginTop: 4 }}>{election.winner}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{election.party}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 700, color: 'var(--warning)' }}>{election.votes.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>votes</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>
                        <span>Winning votes</span>
                        <span style={{ color: 'var(--success-light)' }}>Margin: {election.margin.toLocaleString('en-IN')}</span>
                      </div>
                      <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${(election.votes / maxVotes) * 100}%`, background: 'var(--primary)', borderRadius: 4 }} />
                      </div>
                    </div>

                    {election.turnout !== null && <TurnoutBar pct={election.turnout} />}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* NOTA History */}
          {nota.length > 0 && (
            <div className="card" style={{ marginBottom: 20 }}>
              <h4 style={{ marginBottom: 14, color: 'var(--blue)' }}>NOTA History — {data.constituency_name}</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                {nota.map(n => (
                  <div key={n.year} style={{ flex: 1, padding: '12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{n.year}</div>
                    <div style={{ fontWeight: 700, color: 'var(--blue)', marginTop: 4 }}>{n.votes.toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.pct}% NOTA</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                NOTA cannot win an election but signals voter dissatisfaction. High NOTA % often precedes party switches in the next election.
              </div>
            </div>
          )}

          {/* Turnout Trend */}
          {past.length > 1 && past.every(p => p.turnout !== null) && (
            <div className="card" style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 12 }}>Turnout Trend</h4>
              <div style={{ display: 'flex', gap: 10 }}>
                {past.map(p => (
                  <div key={p.year} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>{p.year}</div>
                    <div style={{ height: 60, background: 'var(--surface-2)', borderRadius: 4, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ width: '100%', height: `${p.turnout!}%`, background: p.turnout! >= 70 ? '#52B788' : 'var(--warning)', transition: 'height 0.8s ease' }} />
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', marginTop: 4, color: p.turnout! >= 70 ? '#52B788' : 'var(--warning)' }}>{p.turnout}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <button className="btn btn-secondary btn-full" onClick={() => window.open('https://results.eci.gov.in', '_blank')}>
        Full Data at results.eci.gov.in →
      </button>
    </div>
  )
}

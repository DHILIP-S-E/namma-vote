import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useVoterStore } from '../store/voterStore'
import { getCandidates, formatAssets, type Candidate } from '../api/candidates'
import { lookupByEPIC } from '../api/voter'

export default function Candidates() {
  const navigate = useNavigate()
  const { voter, setVoter } = useVoterStore()
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'compare'>('list')

  const state = voter?.state_code || 'TN'
  const constituency = voter?.assembly_code || ''
  const constituencyName = voter?.assembly_constituency || ''

  // Auto-refresh voter data from ECI if assembly_code is missing
  useEffect(() => {
    if (!voter?.epic || voter.assembly_code) return
    let cancelled = false
    lookupByEPIC(voter.epic).then(res => {
      if (!cancelled && res.found && res.voter?.assembly_code) {
        setVoter({ ...voter, ...res.voter })
        queryClient.invalidateQueries({ queryKey: ['candidates'] })
      }
    }).catch(() => {})
    return () => { cancelled = true }
  }, [voter?.epic, voter?.assembly_code])

  const { data, isLoading, error } = useQuery({
    queryKey: ['candidates', state, constituency, constituencyName],
    queryFn: () => getCandidates(state, constituency, 2026, constituencyName),
    enabled: !!constituency,
  })

  const candidates = data?.candidates || []

  if (isLoading) return (
    <div className="page">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton" style={{ height: 120, marginBottom: 12 }} />
      ))}
    </div>
  )

  if (error) return (
    <div className="page"><div className="empty-state">
      <div className="empty-state-icon">!</div>
      <h3>Could not load candidates</h3>
      <p>Affidavit data temporarily unavailable</p>
    </div></div>
  )

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Candidates</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>{voter?.assembly_constituency || 'Velachery'} · {candidates.length} candidates</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        Data sourced from ECI affidavits. All criminal cases are pending — not convictions.
      </div>

      {/* View Toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 4, marginBottom: 16 }}>
        {(['list', 'compare'] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            style={{
              padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
              fontFamily: 'inherit', fontWeight: 600, fontSize: '0.875rem', transition: 'all var(--transition)',
              background: view === v ? 'var(--primary)' : 'transparent',
              color: view === v ? 'white' : 'var(--text-secondary)',
            }}>
            {v === 'list' ? 'Candidate Cards' : 'Compare All'}
          </button>
        ))}
      </div>

      {/* Compare Table */}
      {view === 'compare' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '16px 16px 0' }}>
            <h3 style={{ marginBottom: 4 }}>Side-by-Side Comparison</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'var(--surface-2)' }}>
                  <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Candidate</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>Cases</th>
                  <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>Assets</th>
                  <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>Education</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map((c, i) => {
                  const hasCrimes = (c.criminal_cases?.length || 0) > 0
                  return (
                    <tr key={c.id} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
                        <div style={{ fontWeight: 700 }}>{c.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{c.party_short || c.party}</div>
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', fontWeight: 700, color: hasCrimes ? 'var(--danger-light)' : 'var(--success-light)' }}>
                        {c.criminal_cases?.length || 0}{hasCrimes ? <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', marginLeft: 4 }} /> : <span style={{ color: 'var(--success-light)', marginLeft: 2 }}>✓</span>}
                      </td>
                      <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--warning)' }}>
                        {formatAssets(c.total_assets_inr)}
                      </td>
                      <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                        {c.education}{c.education_discrepancy && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)', marginLeft: 4 }} />}
                      </td>
                    </tr>
                  )
                })}
                <tr style={{ background: 'rgba(88,166,255,0.05)' }}>
                  <td style={{ padding: '10px 8px' }}><div style={{ fontWeight: 700 }}>NOTA</div><div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>None of the Above</div></td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-muted)' }}>—</td>
                  <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-muted)' }}>—</td>
                  <td style={{ padding: '10px 8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Protest vote</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidates List */}
      {view === 'list' && <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {candidates.map((candidate) => {
          const isExpanded = expanded === candidate.id
          const hasCrimes = candidate.criminal_cases && candidate.criminal_cases.length > 0
          const seriousCrimes = candidate.criminal_cases?.filter(c =>
            c.section.includes('302') || c.section.includes('307') || c.section.includes('376')
          ) || []

          return (
            <motion.div key={candidate.id} layout
              className={`candidate-card ${hasCrimes ? 'flagged' : ''}`}
              onClick={() => setExpanded(isExpanded ? null : candidate.id)}>

              {/* Card Header */}
              <div style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Photo */}
                <div style={{
                  width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
                  background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', border: '2px solid var(--border)',
                  color: 'var(--text)'
                }}>
                  {candidate.name.charAt(0)}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{candidate.name}</span>
                    {seriousCrimes.length > 0 && (
                      <span className="badge badge-danger">{seriousCrimes.length} Serious Case{seriousCrimes.length > 1 ? 's' : ''}</span>
                    )}
                    {candidate.education_discrepancy && (
                      <span className="badge badge-warning">Edu. Query</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    {candidate.party_short || candidate.party} · Serial #{candidate.serial_number}
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.8rem' }}>
                    <span style={{ color: hasCrimes ? 'var(--danger-light)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {hasCrimes && <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--danger)', flexShrink: 0 }} />}
                      {candidate.criminal_cases?.length || 0} case{candidate.criminal_cases?.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: 'var(--text-muted)' }}>
                      {formatAssets(candidate.total_assets_inr)}
                    </span>
                  </div>
                </div>

                <span style={{ color: 'var(--text-muted)', fontSize: '1rem', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', borderTop: '1px solid var(--border)' }}>
                    <div style={{ padding: 16 }}>

                      {/* Criminal Cases */}
                      {candidate.criminal_cases && candidate.criminal_cases.length > 0 ? (
                        <div style={{ marginBottom: 16 }}>
                          <h4 style={{ marginBottom: 10, color: 'var(--danger-light)' }}>Criminal Cases ({candidate.criminal_cases.length})</h4>
                          {candidate.criminal_cases.map((c, i) => (
                            <div key={i} style={{
                              background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.2)',
                              borderRadius: 'var(--radius)', padding: 12, marginBottom: 8
                            }}>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--danger-light)' }}>{c.section}</div>
                              <div style={{ fontSize: '0.8rem', marginTop: 4 }}>{c.description}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 4 }}>{c.court} · {c.year}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="alert alert-success" style={{ marginBottom: 16 }}>
                          No criminal cases declared in affidavit
                        </div>
                      )}

                      {/* Assets */}
                      <div style={{ marginBottom: 16 }}>
                        <h4 style={{ marginBottom: 10 }}>Declared Assets</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Total Assets</div>
                            <div style={{ fontWeight: 700, color: 'var(--warning)' }}>{formatAssets(candidate.total_assets_inr)}</div>
                          </div>
                          {candidate.assets_detail && Object.entries(candidate.assets_detail).map(([k, v]) => (
                            <div key={k} style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: '10px 12px' }}>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k.replace('_', ' ')}</div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                                {k === 'vehicles' ? `${v} vehicle${v !== 1 ? 's' : ''}` : typeof v === 'number' ? formatAssets(v as number) : String(v)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h4 style={{ marginBottom: 8 }}>Education</h4>
                        <div style={{ background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 12 }}>
                          <div style={{ fontSize: '0.875rem' }}>{candidate.education}</div>
                          {candidate.education_discrepancy && (
                            <div style={{ marginTop: 8, color: 'var(--warning)', fontSize: '0.8rem' }}>
                              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: 'var(--warning)', marginRight: 6 }} />Qualification could not be independently verified from public records
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Affidavit Link */}
                      <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, width: '100%' }}
                        onClick={() => window.open(candidate.affidavit_url, '_blank')}>
                        View Full ECI Affidavit →
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>}

      {/* NOTA Explainer */}
      <div className="card" style={{ marginTop: 20, background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.2)' }}>
        <h4 style={{ color: 'var(--blue)', marginBottom: 8 }}>What is NOTA?</h4>
        <p style={{ fontSize: '0.875rem' }}>
          <strong>None Of The Above</strong> — the last option on every EVM. If you press NOTA, your vote is counted but awarded to no candidate.
          It signals dissatisfaction with all candidates. NOTA cannot cause a re-election under current law.
        </p>
        <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Historical NOTA data for your constituency is available at <strong>results.eci.gov.in</strong>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useVoterStore } from '../store/voterStore'
import { getCandidates, formatAssets, type Candidate } from '../api/candidates'

function CompareTable({ candidates }: { candidates: Candidate[] }) {
  return (
    <div style={{ overflowX: 'auto', marginTop: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
        <thead>
          <tr style={{ background: 'var(--surface-2)' }}>
            <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>Candidate</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>Cases</th>
            <th style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>Assets</th>
            <th style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid var(--border)', fontWeight: 700 }}>Education</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((c, i) => {
            const hasCrimes = (c.criminal_cases?.length || 0) > 0
            return (
              <tr key={c.id} style={{ background: i % 2 === 0 ? 'var(--surface)' : 'var(--surface-2)' }}>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700 }}>{c.name}</div>
                  <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>{c.party_short || c.party}</div>
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
                  <span style={{
                    fontWeight: 700,
                    color: hasCrimes ? 'var(--danger-light)' : 'var(--success-light)',
                  }}>
                    {c.criminal_cases?.length || 0}
                    {hasCrimes ? ' !' : ' ✓'}
                  </span>
                </td>
                <td style={{ padding: '10px 8px', textAlign: 'center', borderBottom: '1px solid var(--border)', fontWeight: 600, color: 'var(--warning)' }}>
                  {formatAssets(c.total_assets_inr)}
                </td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                  {c.education}
                  {c.education_discrepancy && <span style={{ color: 'var(--warning)', marginLeft: 4, fontWeight: 700 }}>!</span>}
                </td>
              </tr>
            )
          })}
          {/* NOTA row */}
          <tr style={{ background: 'rgba(88,166,255,0.05)' }}>
            <td style={{ padding: '10px 8px' }}>
              <div style={{ fontWeight: 700 }}>NOTA</div>
              <div style={{ color: 'var(--text-muted)', marginTop: 2 }}>None of the Above</div>
            </td>
            <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-muted)' }}>—</td>
            <td style={{ padding: '10px 8px', textAlign: 'center', color: 'var(--text-muted)' }}>—</td>
            <td style={{ padding: '10px 8px', color: 'var(--text-muted)', fontSize: '0.75rem' }}>Protest vote — no candidate gets it</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function MyConstituency() {
  const navigate = useNavigate()
  const { voter } = useVoterStore()
  const [view, setView] = useState<'list' | 'compare'>('list')

  const state = voter?.state_code || 'TN'
  const constituency = voter?.assembly_code || ''
  const constituencyName = voter?.assembly_constituency || ''

  const { data, isLoading } = useQuery({
    queryKey: ['candidates', state, constituency, constituencyName],
    queryFn: () => getCandidates(state, constituency, 2026, constituencyName),
    enabled: !!constituency,
  })

  const candidates = data?.candidates || []

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>My Constituency</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>{constituencyName} · {state}</p>
        </div>
      </div>

      {/* Constituency Stats */}
      {voter && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'Assembly', value: voter.assembly_code || '—' },
            { label: 'Phase', value: `Phase ${voter.phase_number || 1}` },
            { label: 'Candidates', value: String(candidates.length || '—') },
          ].map(item => (
            <div key={item.label} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '12px 10px', textAlign: 'center' }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{item.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* View Toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 4, marginBottom: 20 }}>
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

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100 }} />)}
        </div>
      )}

      {!isLoading && view === 'compare' && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 16px 0' }}>
            <h3 style={{ marginBottom: 4 }}>Side-by-Side Comparison</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 0 }}>
              Criminal cases, declared assets, and education for all candidates
            </p>
          </div>
          <CompareTable candidates={candidates} />
        </div>
      )}

      {!isLoading && view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {candidates.map((c) => {
            const hasCrimes = (c.criminal_cases?.length || 0) > 0
            const serious = c.criminal_cases?.filter(cr => cr.section.includes('302') || cr.section.includes('307') || cr.section.includes('376')) || []
            return (
              <div key={c.id} className={`candidate-card ${hasCrimes ? 'flagged' : ''}`}>
                <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, background: 'var(--surface-2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: '2px solid var(--border)' }}>
                    {c.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{c.name}</span>
                      {serious.length > 0 && <span className="badge badge-danger">{serious.length} Serious</span>}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.party_short || c.party}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: '0.8rem' }}>
                      <span style={{ color: hasCrimes ? 'var(--danger-light)' : 'var(--text-muted)' }}>{c.criminal_cases?.length || 0} cases</span>
                      <span style={{ color: 'var(--text-muted)' }}>{formatAssets(c.total_assets_inr)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* NOTA Card */}
      <div className="card" style={{ marginTop: 20, background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.2)' }}>
        <h4 style={{ color: 'var(--blue)', marginBottom: 8 }}>What is NOTA?</h4>
        <p style={{ fontSize: '0.875rem' }}>
          <strong>None Of The Above</strong> — the last option on every EVM. If you press NOTA, your vote is counted but goes to no candidate.
          It signals dissatisfaction with all candidates. NOTA cannot cause a re-election under current Indian law.
        </p>
        <div style={{ marginTop: 10, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Historical NOTA data for your constituency is available in the full ECI election results archive at <strong>results.eci.gov.in</strong>
        </div>
      </div>
    </div>
  )
}

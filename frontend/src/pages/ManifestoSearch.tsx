import { useState } from 'react'
import client from '../api/client'

const CATEGORIES = ['Economy', 'Agriculture', 'Healthcare', 'Education', 'Women', 'Water', 'Infrastructure', 'Jobs', 'Environment', 'Corruption']

export default function ManifestoSearch() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (searchQuery = query) => {
    const q = searchQuery.trim()
    if (!q) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const { data } = await client.post('/chat/ask', {
        message: `What do Indian parties DMK, AIADMK, BJP, and INC promise about "${q}"? Give a brief comparison in 3-4 bullet points per party. Focus on Tamil Nadu context.`,
        language: 'en',
      })
      setResult(data.answer)
    } catch {
      setError('Could not fetch AI analysis. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (cat: string) => {
    setQuery(cat)
    handleSearch(cat)
  }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div className="page-title-block" style={{ marginBottom: 0 }}>
          <h2>Manifesto Search</h2>
          <div className="subtitle">What each party promises · AI-powered</div>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <input
          type="text"
          className="input"
          value={query}
          onChange={e => { setQuery(e.target.value); setResult(null); setError(null) }}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Search: water, jobs, healthcare, NEET…"
          style={{ paddingRight: 52, fontFamily: 'var(--font-body)' }}
        />
        <button
          onClick={() => handleSearch()}
          style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: 8, background: 'var(--primary)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        </button>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
        {CATEGORIES.map(cat => (
          <button key={cat} className="manifesto-chip" onClick={() => handleCategoryClick(cat)}>{cat}</button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>AI SEARCHING MANIFESTOS…</div>
        </div>
      )}

      {/* AI result */}
      {result && !loading && (
        <div className="card card-neon-purple" style={{ marginBottom: 16 }}>
          <div className="card-terminal-header" style={{ color: 'var(--purple)' }}>AI ANALYSIS · GEMINI</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{result}</div>
          <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
            AI-generated · Verify claims at official party websites
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="alert alert-danger" style={{ marginBottom: 16 }}>{error}</div>
      )}

      {/* Empty state */}
      {!result && !loading && !error && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', opacity: 0.5 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--text-muted)', marginBottom: 6 }}>Search any policy topic</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or tap a category chip above — AI will compare party positions</div>
        </div>
      )}

      <div style={{ marginTop: 8, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
        Powered by Gemini AI. NAMMA VOTE does not endorse any party. Always verify claims at official party websites.
      </div>
    </div>
  )
}

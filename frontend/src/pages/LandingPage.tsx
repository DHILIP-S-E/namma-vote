import { useNavigate } from 'react-router-dom'

const FEATURES = [
  { icon: '🗺️', title: 'Booth Finder', desc: 'Locate your polling booth with turn-by-turn directions' },
  { icon: '🏛️', title: 'Know Candidates', desc: 'Criminal records, assets & track record at a glance' },
  { icon: '🤝', title: 'Your Rights', desc: 'Know exactly what you\'re entitled to at the booth' },
  { icon: '📋', title: 'Manifestos', desc: 'AI-powered party manifesto comparison' },
  { icon: '🗳️', title: 'Mock EVM', desc: 'Practice voting before election day' },
  { icon: '🚨', title: 'C-Vigil', desc: 'Report election violations directly to ECI' },
]

const STATS = [
  { value: '97 Cr+', label: 'Registered Voters' },
  { value: '7', label: 'Election Phases' },
  { value: '10.5L', label: 'Polling Stations' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Navbar */}
      <nav style={{
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(145deg, #FF8F5F 0%, #E84E1A 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(255,107,53,0.3)',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
              <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--text)', lineHeight: 1.1 }}>NAMMA VOTE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>நம்ம வோட்</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/auth')}>Login</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/auth?mode=signup')}>Sign Up</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        flex: '0 0 auto',
        padding: '72px 24px 64px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <div className="badge badge-primary" style={{ marginBottom: 20, fontSize: '0.75rem' }}>
          Election Intelligence Platform · India 2026
        </div>
        <h1 style={{ marginBottom: 18, maxWidth: 560 }}>
          Vote Smart.{' '}
          <span className="text-gradient">Know More.</span>
        </h1>
        <p style={{ fontSize: '1.05rem', maxWidth: 480, marginBottom: 40 }}>
          Everything you need to be an informed voter — candidates, booth maps,
          manifestos, and your rights — in your language.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/auth?mode=signup')}>
            Get Started Free
          </button>
          <button className="btn btn-secondary btn-lg" onClick={() => navigate('/auth')}>
            Login
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 48, marginTop: 60, flexWrap: 'wrap', justifyContent: 'center' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '56px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div className="section-label" style={{ justifyContent: 'center', borderLeft: 'none', paddingLeft: 0, marginBottom: 10 }}>Everything for Election Day</div>
            <h2>Be the most informed voter<br />in your booth</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
            {FEATURES.map(f => (
              <div key={f.title} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{f.icon}</div>
                <h4 style={{ marginBottom: 6, color: 'var(--text)' }}>{f.title}</h4>
                <p style={{ fontSize: '0.8rem' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '56px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ marginBottom: 12 }}>Ready to vote smart?</h2>
          <p style={{ marginBottom: 28 }}>Join thousands of informed voters. It's free, private, and works offline.</p>
          <button className="btn btn-primary btn-lg btn-full" style={{ maxWidth: 320, margin: '0 auto', display: 'flex' }} onClick={() => navigate('/auth?mode=signup')}>
            Create Free Account
          </button>
          <button className="btn btn-ghost" style={{ marginTop: 12 }} onClick={() => navigate('/auth?mode=guest')}>
            Continue as Guest →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '20px 24px', textAlign: 'center', borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        © 2026 NAMMA VOTE · Every Vote. Informed. Protected. · India 🇮🇳
      </footer>
    </div>
  )
}

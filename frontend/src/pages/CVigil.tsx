import React from 'react'

const CameraIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
)

const PhoneIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)

const AttachIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
  </svg>
)

const DispatchIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
  </svg>
)

const AppIconSmall = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2"/>
    <line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
)

const WhatsAppIcon = (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
  </svg>
)

const STEP_ICONS = [CameraIcon, AppIconSmall, AttachIcon, DispatchIcon]

const REPORT_STEPS = [
  { step: 1, title: 'Take a Photo or Video', detail: 'Discreetly photograph or record the cash/gift distribution. Ensure faces and location are visible. Do NOT confront the persons.' },
  { step: 2, title: 'Open cVIGIL App', detail: 'Download from Play Store or App Store. The app uses your GPS automatically — no manual address entry needed. Your identity is kept anonymous.' },
  { step: 3, title: 'Attach Media & Submit', detail: 'Select the violation type (cash distribution, liquor, gifts, intimidation). Attach your photo/video. Hit Submit. You will receive a reference number.' },
  { step: 4, title: 'Flying Squad Dispatched', detail: "ECI's flying squad is required to reach the location within 100 minutes. The squad is empowered to seize cash and arrest on the spot." },
]

const REPORT_OPTIONS = [
  {
    icon: PhoneIcon,
    title: 'cVIGIL App',
    desc: 'Official ECI app — geo-tagged, anonymous, fastest response',
    action: () => window.open('https://cvigil.eci.gov.in', '_blank'),
    label: 'Open cVIGIL',
    color: 'var(--primary)',
    primary: true,
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.07 1.18 2 2 0 012.06 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
      </svg>
    ),
    title: '1950 Helpline',
    desc: 'National voter helpline — 24x7 on election day',
    action: () => window.open('tel:1950'),
    label: 'Call 1950 Now',
    color: 'var(--blue)',
    primary: false,
  },
  {
    icon: WhatsAppIcon,
    title: 'WhatsApp Report',
    desc: 'Send evidence to ECI WhatsApp: 9999009000',
    action: () => window.open('https://wa.me/919999009000?text=I%20want%20to%20report%20an%20election%20violation'),
    label: 'Open WhatsApp',
    color: '#25D366',
    primary: false,
  },
]

const SPENDING_LIMITS = [
  { type: 'Lok Sabha (LS) Constituency', limit: 'Rs 95 lakh', note: 'Per candidate, per election' },
  { type: 'Assembly — Large States', limit: 'Rs 40 lakh', note: 'AP, UP, Maharashtra, etc.' },
  { type: 'Assembly — Smaller States', limit: 'Rs 28 lakh', note: 'Goa, Himachal, etc.' },
  { type: 'Cash Without Declaration', limit: 'Rs 50,000', note: 'Above this = seizure by flying squad' },
]

const AFTER_REPORT = [
  { t: 'Instantly', d: "Your report reaches ECI's district control room with GPS coordinates and your media evidence." },
  { t: 'Within 15 min', d: 'A Flying Squad is assigned and dispatched toward the reported location.' },
  { t: 'Within 100 min', d: 'Flying squad must arrive — this is a mandated ECI SLA.' },
  { t: 'On Arrival', d: 'Squad seizes undeclared cash, confiscates liquor/gifts, detains violators, files FIR.' },
  { t: 'Your Identity', d: 'Remains completely anonymous. No one will know who filed the report.' },
]

export default function CVigil() {
  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0, color: 'var(--danger-light)' }}>cVIGIL — Report Corruption</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>Cash · Gifts · Intimidation · MCC Violations</p>
        </div>
      </div>

      <div style={{ background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.3)', borderRadius: 'var(--radius-lg)', padding: 14, marginBottom: 20 }}>
        <strong style={{ color: 'var(--danger-light)' }}>Accepting cash or gifts to vote is illegal</strong>
        <p style={{ marginTop: 4, fontSize: '0.85rem' }}>Violates Section 171B IPC and the Model Code of Conduct. Report anonymously — zero risk to you.</p>
      </div>

      {/* Report Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {REPORT_OPTIONS.map(opt => (
          <button
            key={opt.title}
            onClick={opt.action}
            style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
              background: opt.primary ? 'var(--primary)' : 'var(--surface)',
              border: `1px solid ${opt.primary ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)', cursor: 'pointer', fontFamily: 'inherit',
              color: opt.primary ? 'white' : 'var(--text)', textAlign: 'left',
            }}
          >
            <div style={{ flexShrink: 0, opacity: opt.primary ? 1 : 0.7 }}>{opt.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>{opt.title}</div>
              <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>{opt.desc}</div>
            </div>
            <span style={{ fontWeight: 600, fontSize: '0.85rem', color: opt.primary ? 'white' : opt.color }}>
              {opt.label} →
            </span>
          </button>
        ))}
      </div>

      {/* Step by Step */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 16 }}>How to File a cVIGIL Report</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {REPORT_STEPS.map((s, idx) => (
            <div key={s.step} style={{ display: 'flex', gap: 14, padding: 14, background: 'var(--surface-2)', borderRadius: 'var(--radius)', alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, background: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', color: 'white' }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Spending Limits */}
      <div className="card" style={{ marginBottom: 16 }}>
        <h3 style={{ marginBottom: 14 }}>Candidate Spending Limits</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SPENDING_LIMITS.map(item => (
            <div key={item.type} style={{ padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{item.note}</div>
              </div>
              <span className="badge" style={{ background: 'var(--danger)', color: 'white', flexShrink: 0 }}>{item.limit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* What Happens After */}
      <div className="card" style={{ marginBottom: 16, background: 'rgba(45,106,79,0.06)', border: '1px solid rgba(45,106,79,0.2)' }}>
        <h3 style={{ color: '#52B788', marginBottom: 12 }}>What Happens After You Report?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {AFTER_REPORT.map(item => (
            <div key={item.t} style={{ display: 'flex', gap: 10, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', alignItems: 'flex-start' }}>
              <span className="badge" style={{ flexShrink: 0, background: '#52B788', color: 'white' }}>{item.t}</span>
              <span style={{ fontSize: '0.825rem' }}>{item.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, marginBottom: 8 }}>
        Source: ECI cVIGIL guidelines and Model Code of Conduct 2024
      </div>
    </div>
  )
}

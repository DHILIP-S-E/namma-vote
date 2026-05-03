import React, { useState } from 'react'

const MYTHS = [
  {
    myth: 'EVMs can be hacked via Bluetooth or WiFi',
    truth: 'EVMs have NO wireless capability — no Bluetooth, no WiFi, no internet connection of any kind. They are completely standalone devices. This is verified independently by the Technical Expert Committee appointed by the Supreme Court of India.',
    verdict: 'FALSE',
  },
  {
    myth: 'The EVM can be programmed to always vote for one party',
    truth: 'EVM software is one-time programmable and burned at the factory. It cannot be reprogrammed after manufacturing. The chips are sealed and verified. No software update can be pushed remotely or even physically after programming.',
    verdict: 'FALSE',
  },
  {
    myth: 'Mock Poll results mean actual votes were already counted',
    truth: 'Every EVM must run a mandatory mock poll before voting starts — this is required by ECI rules. You will see numbers on the display. These are cleared and the machine is reset under observation of all candidates\' agents before actual voting begins.',
    verdict: 'FALSE',
  },
  {
    myth: 'You cannot verify your vote was recorded correctly',
    truth: 'The VVPAT machine next to every EVM prints a paper slip for 7 seconds showing exactly which candidate and party symbol you voted for. This is your physical verification. If the VVPAT shows the wrong candidate, you can raise it immediately to the Presiding Officer.',
    verdict: 'FALSE',
  },
  {
    myth: 'EVMs used in India are the same ones found vulnerable abroad',
    truth: 'Indian EVMs are a completely unique design developed by BEL and ECIL under ECI specification. They bear no relation to voting machines used in USA or Europe. The Indian EVM has no external port, no battery charger input during polling, and no external memory slot.',
    verdict: 'FALSE',
  },
  {
    myth: 'If NOTA gets the most votes, the election must be rerun',
    truth: 'Under current Indian election law, even if NOTA gets the highest number of votes, the candidate with the next highest votes is still declared the winner. NOTA is a recorded protest — it has no legal power to trigger a re-election under the Representation of the People Act.',
    verdict: 'FALSE',
  },
]

const HOW_EVM_WORKS = [
  { step: 1, title: 'You enter the booth', desc: 'The Presiding Officer verifies your identity and marks Form 17A. The Control Unit is activated for your vote.' },
  { step: 2, title: 'You see the Ballot Unit', desc: 'A vertical panel with buttons — each button has a candidate name, party name, and party symbol. Braille labels are present for blind voters.' },
  { step: 3, title: 'You press your choice', desc: 'Press the blue button next to your candidate. One button locks the EVM — you cannot change your vote after pressing.' },
  { step: 4, title: 'VVPAT confirms', desc: 'Within 1 second, the VVPAT prints a paper slip visible through a transparent window for 7 seconds. It shows the party symbol and candidate name you voted for.' },
  { step: 5, title: 'Beep confirms registration', desc: 'A short beep means your vote is recorded. The EVM is now locked until the next voter is allowed in by the Presiding Officer.' },
  { step: 6, title: 'Paper trail preserved', desc: 'The VVPAT paper slip falls into a sealed box. In case of disputes, a physical count of these slips is possible under court orders — this is the ultimate audit trail.' },
]

export default function EVMExplainer() {
  const [activeMyth, setActiveMyth] = useState<number | null>(null)
  const [tab, setTab] = useState<'myths' | 'how'>('myths')

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>EVM Facts & Security</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2, color: 'var(--text-secondary)' }}>How EVMs work · Why they are secure · Common myths busted</p>
        </div>
      </div>

      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        India uses over <strong>17 lakh EVMs</strong> across elections. Every EVM is verified by Technical Expert Committees and tested in mock polls before each election.
      </div>

      {/* Tab Toggle */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 4, marginBottom: 20 }}>
        {(['myths', 'how'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.875rem', transition: 'all 0.2s', background: tab === t ? 'var(--primary)' : 'transparent', color: tab === t ? 'white' : 'var(--text-secondary)' }}>
            {t === 'myths' ? '6 Myths Busted' : 'How EVM Works'}
          </button>
        ))}
      </div>

      {tab === 'myths' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {MYTHS.map((m, i) => (
            <div key={i} style={{ border: '1px solid rgba(230,57,70,0.25)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <button onClick={() => setActiveMyth(activeMyth === i ? null : i)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: activeMyth === i ? 'rgba(230,57,70,0.08)' : 'var(--surface)', border: 'none', cursor: 'pointer', fontFamily: 'inherit', color: 'var(--text)', textAlign: 'left' }}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(230,57,70,0.1)', border: '1px solid rgba(230,57,70,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--danger-light)' }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <span className="badge" style={{ background: 'var(--danger)', color: 'white', fontSize: '0.65rem', marginRight: 8 }}>MYTH</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{m.myth}</span>
                </div>
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{activeMyth === i ? '▲' : '▼'}</span>
              </button>
              {activeMyth === i && (
                <div style={{ padding: '0 16px 16px', background: 'var(--surface)' }}>
                  <div style={{ marginTop: 12, padding: 14, background: 'rgba(45,106,79,0.08)', border: '1px solid rgba(45,106,79,0.3)', borderRadius: 'var(--radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#52B788', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.6rem', color: 'white', fontWeight: 800 }}>✓</div>
                      <span style={{ fontWeight: 700, color: '#52B788', fontSize: '0.85rem' }}>THE TRUTH</span>
                    </div>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.7, margin: 0 }}>{m.truth}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8 }}>
            Source: ECI Technical Expert Committee Reports · Supreme Court of India · BEL/ECIL specifications
          </div>
        </div>
      )}

      {tab === 'how' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {HOW_EVM_WORKS.map(s => (
            <div key={s.step} style={{ display: 'flex', gap: 14, padding: 16, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', alignItems: 'flex-start' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.9rem', color: 'white' }}>
                {s.step}
              </div>
              <div>
                <div style={{ fontWeight: 700, marginBottom: 5, fontSize: '0.9rem' }}>{s.title}</div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div className="card" style={{ background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.2)', marginTop: 4 }}>
            <h4 style={{ color: 'var(--blue)', marginBottom: 10 }}>EVM Security Facts</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem' }}>
              {[
                'No external ports (no USB, no serial, no charging port during polling)',
                'One-time programmable chip — cannot be reprogrammed after manufacture',
                'Runs on AA batteries — no mains power connection',
                'Sealed with tamper-evident seals verified by all candidates\' agents',
                'Stored in district strong rooms with 24×7 CCTV and multi-party locks',
                'Random allocation — no one knows which EVM goes to which booth until the day',
              ].map((fact, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 'var(--radius)' }}>
                  <span style={{ color: '#52B788', flexShrink: 0 }}>✓</span>
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

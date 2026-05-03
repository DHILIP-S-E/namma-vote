import { useState, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'
import { useVoterStore } from '../store/voterStore'
import client from '../api/client'

interface QuizOption {
  text: string
  scores: Record<string, number>
}

interface QuizQuestion {
  id: string
  topic: string
  question: string
  options: QuizOption[]
}

interface Party {
  id: string
  name: string
  fullName: string
  color: string
  ideology: string
}

interface QuizData {
  questions: QuizQuestion[]
  parties: Party[]
}


export default function PolicyQuiz() {
  const { voter } = useVoterStore()
  const [step, setStep] = useState<'intro' | 'quiz' | 'result'>('intro')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [sharing, setSharing] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isError } = useQuery<QuizData>({
    queryKey: ['policy-quiz'],
    queryFn: async () => {
      const { data } = await client.get('/quiz/questions')
      return data
    },
  })

  const questions: QuizQuestion[] = data?.questions ?? []
  const parties: Party[] = data?.parties ?? []

  const handleSelect = (idx: number) => setSelected(idx)

  const handleNext = () => {
    if (selected === null) return
    const q = questions[current]
    setAnswers(prev => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(q.options[selected].scores).map(([k, v]) => [k, (prev[k] || 0) + v])
      ),
    }))
    setSelected(null)
    if (current + 1 < questions.length) setCurrent(c => c + 1)
    else setStep('result')
  }

  const maxScore = questions.length * 3
  const sorted = parties
    .map(p => ({
      ...p,
      score: answers[p.id] || 0,
      pct: Math.round(((answers[p.id] || 0) / Math.max(maxScore, 1)) * 100),
    }))
    .sort((a, b) => b.score - a.score)
  const winner = sorted[0]

  const handleShare = async () => {
    if (!resultRef.current) return
    setSharing(true)
    try {
      const canvas = await html2canvas(resultRef.current, { backgroundColor: null, scale: 3, useCORS: true, logging: false })
      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], 'policy-match-nammavote.png', { type: 'image/png' })
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({ title: 'My Policy Match — NAMMA VOTE', files: [file] })
        } else {
          const url = canvas.toDataURL('image/png')
          const a = document.createElement('a'); a.href = url; a.download = 'policy-match-nammavote.png'; a.click()
          toast.success('Result saved! Share it.')
        }
      }, 'image/png')
    } catch { toast.error('Could not generate image') }
    finally { setSharing(false) }
  }

  const reset = () => { setStep('intro'); setCurrent(0); setAnswers({}); setSelected(null) }

  return (
    <div className="page fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <button onClick={() => window.history.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div className="page-title-block" style={{ marginBottom: 0 }}>
          <h2>Policy Match Quiz</h2>
          <div className="subtitle">Find which party aligns with your values</div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div className="spinner spinner-lg" style={{ margin: '0 auto 12px' }} />
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>LOADING QUIZ…</div>
        </div>
      )}

      {/* Backend not running */}
      {isError && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>🔌</div>
          <h3 style={{ marginBottom: 8 }}>Backend Not Connected</h3>
          <p style={{ fontSize: '0.875rem' }}>Quiz questions are served from the backend. Start the server and refresh.</p>
          <button className="btn btn-secondary" style={{ marginTop: 16 }} onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {/* No questions yet */}
      {!isLoading && !isError && questions.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: '2rem', marginBottom: 12 }}>📝</div>
          <h3 style={{ marginBottom: 8 }}>Quiz Coming Soon</h3>
          <p style={{ fontSize: '0.875rem' }}>Policy quiz questions haven't been added yet. Check back soon.</p>
        </div>
      )}

      {/* Intro */}
      {!isLoading && !isError && questions.length > 0 && step === 'intro' && (
        <>
          <div style={{ background: 'linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(124,58,237,0.06) 100%)', border: '1px solid rgba(255,107,53,0.15)', borderRadius: 'var(--radius-xl)', padding: 24, marginBottom: 24, textAlign: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 8, color: 'var(--text)' }}>Discover Your Political Alignment</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              {questions.length} questions on real policy issues. No right or wrong answers — just your honest priorities. We match your responses against party manifestos and track records.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {[`~${Math.ceil(questions.length * 0.4)} minutes to complete`, 'Completely anonymous — no data stored', `Match % shown for ${parties.length} parties`, 'Shareable result card'].map(text => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontSize: '0.875rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary btn-full btn-lg" onClick={() => setStep('quiz')}>Start Quiz →</button>
        </>
      )}

      {/* Quiz */}
      {!isLoading && !isError && questions.length > 0 && step === 'quiz' && (
        <>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>QUESTION {current + 1} / {questions.length}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--primary)' }}>{Math.round((current / questions.length) * 100)}%</span>
            </div>
            <div className="match-bar-track">
              <div className="match-bar-fill" style={{ width: `${(current / questions.length) * 100}%`, background: 'linear-gradient(90deg, var(--primary), var(--purple))' }} />
            </div>
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 'var(--radius-pill)', marginBottom: 14 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--purple)', fontWeight: 600 }}>{questions[current].topic}</span>
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 20, lineHeight: 1.4, color: 'var(--text)' }}>{questions[current].question}</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            {questions[current].options.map((opt, i) => (
              <button key={i} className={`quiz-option${selected === i ? ' selected' : ''}`} onClick={() => handleSelect(i)}>
                <div className="quiz-radio">{selected === i && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 700 }}>✓</span>}</div>
                <span style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>{opt.text}</span>
              </button>
            ))}
          </div>

          <button className="btn btn-primary btn-full" onClick={handleNext} disabled={selected === null}>
            {current + 1 === questions.length ? 'See My Results →' : 'Next →'}
          </button>
        </>
      )}

      {/* Result */}
      {!isLoading && !isError && questions.length > 0 && step === 'result' && winner && (
        <>
          <div ref={resultRef} style={{ background: 'linear-gradient(135deg, #080C10 0%, #0F1520 50%, #080C10 100%)', border: `2px solid ${winner.color}40`, borderRadius: 20, padding: 24, marginBottom: 20, position: 'relative', overflow: 'hidden', boxShadow: `0 0 40px ${winner.color}20` }}>
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: `${winner.color}08`, pointerEvents: 'none' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,107,53,0.2)', border: '1px solid rgba(255,107,53,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: 3, background: '#FF6B35' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#FF6B35', letterSpacing: '0.05em', fontSize: '1rem' }}>NAMMA VOTE</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>POLICY MATCH RESULT</div>
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 20 }}>
              <div style={{ display: 'inline-flex', width: 48, height: 48, borderRadius: '50%', background: `${winner.color}22`, border: `2px solid ${winner.color}55`, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: winner.color }} />
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: winner.color, letterSpacing: '0.04em' }}>{winner.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{winner.fullName}</div>
              <div style={{ marginTop: 8 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'white' }}>{winner.pct}%</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>MATCH</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sorted.map((p, i) => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: i === 0 ? p.color : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800, color: i === 0 ? 'white' : 'rgba(255,255,255,0.4)', flexShrink: 0 }}>#{i + 1}</div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: i === 0 ? p.color : 'rgba(255,255,255,0.5)' }}>{p.name}</span>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: i === 0 ? p.color : 'rgba(255,255,255,0.4)', fontWeight: 700 }}>{p.pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${p.pct}%`, background: i === 0 ? p.color : 'rgba(255,255,255,0.15)', borderRadius: 3, transition: 'width 1s ease' }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.2)' }}>{voter?.name || 'Anonymous Voter'}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,107,53,0.5)' }}>nammavote.app</div>
            </div>
          </div>

          <div className="card card-neon-primary" style={{ marginBottom: 16 }}>
            <div className="card-terminal-header">ALIGNMENT ANALYSIS</div>
            <div style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
              Your answers most closely align with <strong style={{ color: winner.color }}>{winner.name}</strong>'s ideology of <em>{winner.ideology}</em>. This is based purely on policy positions — not on any individual candidate or election.
            </div>
            <div style={{ marginTop: 12, padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Note: This quiz reflects party manifestos and track records. Vote based on your complete research — candidate quality and local factors matter too.
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button className="btn btn-full" onClick={handleShare} disabled={sharing} style={{ background: `linear-gradient(135deg, ${winner.color} 0%, ${winner.color}aa 100%)`, color: 'white', borderRadius: 'var(--radius-pill)', padding: 16, fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
              {sharing ? 'Generating…' : 'Share My Result'}
            </button>
            <button className="btn btn-secondary btn-full" onClick={reset}>Retake Quiz</button>
          </div>
        </>
      )}
    </div>
  )
}

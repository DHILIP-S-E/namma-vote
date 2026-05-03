import React, { useState, useRef, useEffect } from 'react'
import { useVoterStore } from '../store/voterStore'
import client from '../api/client'
import AppIcon from './AppIcon'

interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
}

const QUICK_QUESTIONS = [
  'What documents do I need to vote?',
  'What is NOTA?',
  'How do I correct my name on voter ID?',
  'What if my name is missing at the booth?',
]

export default function AIChatBot() {
  const { voter, language } = useVoterStore()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: 'Hello! I am your NAMMA VOTE election assistant. Ask me anything about voting, registration, candidates, or your rights.' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const idRef = useRef(1)

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { id: idRef.current++, role: 'user', text: text.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)
    try {
      const { data } = await client.post('/chat/ask', {
        message: text.trim(),
        language,
        constituency: voter?.assembly_constituency,
        state: voter?.state_code,
      })
      setMessages(prev => [...prev, { id: idRef.current++, role: 'bot', text: data.answer }])
    } catch {
      setMessages(prev => [...prev, { id: idRef.current++, role: 'bot', text: 'Could not connect. For urgent help call 1950.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 80, right: 16, zIndex: 1000,
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--purple) 0%, #9B59B6 100%)',
          border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(188,140,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}
        aria-label="Open AI election assistant"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="9" width="18" height="12" rx="3"/>
            <path d="M8 9V7a4 4 0 1 1 8 0v2"/>
            <circle cx="9" cy="15" r="0.8" fill="white"/>
            <circle cx="15" cy="15" r="0.8" fill="white"/>
            <path d="M9.5 18.5h5"/>
          </svg>
        )}
      </button>

      {/* Chat Panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 142, right: 12, left: 12, zIndex: 999,
          maxWidth: 420, margin: '0 auto',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', height: 420,
        }}>
          {/* Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(188,140,255,0.04)' }}>
            <AppIcon gradient="linear-gradient(145deg, #A78BFA, #6D28D9)" size={32} style={{ borderRadius: 9 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="18" height="12" rx="3"/>
                <path d="M8 9V7a4 4 0 1 1 8 0v2"/>
                <circle cx="9" cy="15" r="0.8" fill="white"/>
                <circle cx="15" cy="15" r="0.8" fill="white"/>
                <path d="M9.5 18.5h5"/>
              </svg>
            </AppIcon>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.03em' }}>AI Election Assistant</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--success-light)', letterSpacing: '0.08em' }}>● GEMINI · ONLINE</div>
            </div>
            <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>EN / TA / HI</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '82%', padding: '10px 13px', borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: m.role === 'user' ? 'var(--primary)' : 'var(--surface-2)',
                  color: m.role === 'user' ? 'white' : 'var(--text)',
                  fontSize: '0.855rem', lineHeight: 1.6,
                }}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 13px', background: 'var(--surface-2)', borderRadius: '16px 16px 16px 4px', width: 'fit-content' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--text-muted)', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                ))}
              </div>
            )}

            {/* Quick Questions */}
            {messages.length <= 1 && !loading && (
              <div style={{ marginTop: 6 }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>Quick questions:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {QUICK_QUESTIONS.map(q => (
                    <button key={q} onClick={() => sendMessage(q)}
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 12px', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.8rem', textAlign: 'left', color: 'var(--purple)' }}>
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '10px 12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about voting, rights, forms..."
              style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--surface-2)', color: 'var(--text)', fontFamily: 'inherit', fontSize: '0.875rem', outline: 'none' }}
            />
            <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()}
              style={{ padding: '10px 14px', background: 'var(--purple)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', opacity: loading || !input.trim() ? 0.5 : 1 }}>
              ↑
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0) }
          30% { transform: translateY(-6px) }
        }
      `}</style>
    </>
  )
}

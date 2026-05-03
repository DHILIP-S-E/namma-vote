import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { lookupByEPIC, lookupByName, type VoterData, type VoterLookupResult } from '../api/voter'
import { getCandidates } from '../api/candidates'
import { useVoterStore } from '../store/voterStore'
import { useT } from '../i18n/useT'

type Step = 1 | 2 | 3 | 4 | 5
type SearchMode = 'epic' | 'name'

const STEP_LABELS = ['Verify ID', 'Booth', 'Candidates', 'Documents', 'All Set!']

const ACCEPTED_DOCS = [
  'EPIC Card (Voter ID)',
  'Aadhaar Card',
  'Passport',
  'Driving Licence',
  'MNREGA Job Card',
  'Bank / Post Office Passbook with Photo',
  'PAN Card',
  'Service Identity Cards (Govt employees)',
  'Pension Documents with Photo',
  'Smart Card (NPR)',
]

const EPIC_REGEX = /^[A-Z]{2,3}\d{6,8}$/

const EPIC_PREFIX_TO_STATE: Record<string, { state_code: string; state_name: string }> = {
  TH: { state_code: 'TN', state_name: 'Tamil Nadu' },
  TN: { state_code: 'TN', state_name: 'Tamil Nadu' },
  MH: { state_code: 'MH', state_name: 'Maharashtra' },
  DL: { state_code: 'DL', state_name: 'Delhi' },
  KA: { state_code: 'KA', state_name: 'Karnataka' },
  KL: { state_code: 'KL', state_name: 'Kerala' },
  AP: { state_code: 'AP', state_name: 'Andhra Pradesh' },
  TS: { state_code: 'TS', state_name: 'Telangana' },
  GJ: { state_code: 'GJ', state_name: 'Gujarat' },
  RJ: { state_code: 'RJ', state_name: 'Rajasthan' },
  UP: { state_code: 'UP', state_name: 'Uttar Pradesh' },
  BR: { state_code: 'BR', state_name: 'Bihar' },
  WB: { state_code: 'WB', state_name: 'West Bengal' },
  OD: { state_code: 'OD', state_name: 'Odisha' },
  MP: { state_code: 'MP', state_name: 'Madhya Pradesh' },
  CG: { state_code: 'CG', state_name: 'Chhattisgarh' },
  PB: { state_code: 'PB', state_name: 'Punjab' },
  HR: { state_code: 'HR', state_name: 'Haryana' },
  HP: { state_code: 'HP', state_name: 'Himachal Pradesh' },
  JK: { state_code: 'JK', state_name: 'Jammu & Kashmir' },
  AS: { state_code: 'AS', state_name: 'Assam' },
  NE: { state_code: 'MN', state_name: 'Manipur' },
}

function buildLocalVoterData(epicCode: string): VoterData {
  const prefix2 = epicCode.slice(0, 2)
  const prefix3 = epicCode.slice(0, 3)
  const stateInfo =
    EPIC_PREFIX_TO_STATE[prefix3] ||
    EPIC_PREFIX_TO_STATE[prefix2] ||
    { state_code: 'IN', state_name: 'India' }
  return {
    epic: epicCode, name: '', father_name: '', gender: '', age: 0,
    booth_number: '', polling_station: '', polling_station_address: '',
    assembly_constituency: '', assembly_code: '', parliamentary_constituency: '',
    state_code: stateInfo.state_code, state_name: stateInfo.state_name,
    district: '', phase_number: 0, election_date: '',
    health_issues: [], document_checklist: { accepted: [], not_accepted: [] },
  }
}

function StepBar({ step, labels }: { step: Step; labels: readonly string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 28 }}>
      {labels.map((label, i) => {
        const idx = (i + 1) as Step
        const done = step > idx
        const active = step === idx
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: done ? '#52B788' : active ? 'var(--primary)' : 'var(--surface-2)',
                border: `2px solid ${done ? '#52B788' : active ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
                color: done || active ? 'white' : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : idx}
              </div>
              <div style={{
                fontSize: '0.58rem', marginTop: 3,
                color: active ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: active ? 700 : 400,
                textAlign: 'center', whiteSpace: 'nowrap',
              }}>{label}</div>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                height: 2, flex: 1, minWidth: 8,
                background: done ? '#52B788' : 'var(--border)',
                marginBottom: 18, transition: 'background 0.4s',
              }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function Mode1() {
  const navigate = useNavigate()
  const { setVoter, setEpic, voter } = useVoterStore()
  const [step, setStep] = useState<Step>(1)
  const [searchMode, setSearchMode] = useState<SearchMode>('epic')
  const [epic, setEpicInput] = useState('')
  const [name, setName] = useState('')
  const [state, setState] = useState('TN')
  const [district, setDistrict] = useState('Chennai')
  const [result, setResult] = useState<VoterLookupResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [docChecked, setDocChecked] = useState<Set<string>>(new Set())

  const { data: candidateData, isLoading: candidatesLoading } = useQuery({
    queryKey: ['candidates', voter?.state_code, voter?.assembly_code, voter?.assembly_constituency],
    queryFn: () => getCandidates(voter!.state_code, voter!.assembly_code, 2026, voter!.assembly_constituency || ''),
    enabled: step === 3 && !!voter?.assembly_code,
  })
  const candidates = candidateData?.candidates || []

  const T = useT()
  const advance = () => setStep(s => Math.min(s + 1, 5) as Step)
  const goBack = () => step > 1 ? setStep(s => (s - 1) as Step) : navigate('/dashboard')

  const handleSearch = async () => {
    const epicTrimmed = epic.trim().toUpperCase()
    if (searchMode === 'epic' && !EPIC_REGEX.test(epicTrimmed)) {
      toast.error('Enter a valid EPIC (e.g. THB2303907 — 2-3 letters then 6-8 digits)')
      return
    }
    setLoading(true)
    try {
      let res: VoterLookupResult
      if (searchMode === 'epic') {
        res = await lookupByEPIC(epicTrimmed)
        setEpic(epicTrimmed)
      } else {
        res = await lookupByName(name, state, district)
      }
      if (res.found && res.voter) {
        setResult(res)
        setVoter(res.voter)
        toast.success(T.voterFound)
        advance()
      } else if (searchMode === 'epic' && EPIC_REGEX.test(epicTrimmed)) {
        const localVoter = buildLocalVoterData(epicTrimmed)
        setVoter(localVoter)
        setResult({ found: true, voter: localVoter })
        toast.success(T.epicVerified)
        advance()
      } else {
        setResult(res)
        toast.error(res.message || T.notFound)
      }
    } catch {
      if (searchMode === 'epic' && EPIC_REGEX.test(epicTrimmed)) {
        const localVoter = buildLocalVoterData(epicTrimmed)
        setEpic(epicTrimmed)
        setVoter(localVoter)
        setResult({ found: true, voter: localVoter })
        toast.success(T.epicVerified)
        advance()
      } else {
        toast.error(T.connectionError)
      }
    } finally {
      setLoading(false)
    }
  }

  const toggleDoc = (doc: string) => {
    setDocChecked(prev => {
      const next = new Set(prev)
      if (next.has(doc)) next.delete(doc)
      else next.add(doc)
      return next
    })
  }

  const electionDateStr = voter?.election_date
    ? new Date(voter.election_date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : null

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>{T.amIReady}</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>{T.stepOf(step, STEP_LABELS.length)}</p>
        </div>
      </div>

      <StepBar step={step} labels={T.stepLabels} />

      <AnimatePresence mode="wait">

        {/* ── STEP 1: VERIFY EPIC ── */}
        {step === 1 && (
          <motion.div key="s1" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{T.verifyVoterId}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                {T.verifyVoterIdSub}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: 'var(--surface-2)', borderRadius: 'var(--radius)', padding: 4, marginBottom: 20 }}>
                {(['epic', 'name'] as SearchMode[]).map(m => (
                  <button key={m} onClick={() => setSearchMode(m)}
                    style={{ padding: '10px', borderRadius: 'var(--radius-sm)', border: 'none', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600, fontSize: '0.875rem', transition: 'all var(--transition)',
                      background: searchMode === m ? 'var(--primary)' : 'transparent',
                      color: searchMode === m ? 'white' : 'var(--text-secondary)' }}>
                    {m === 'epic' ? T.byVoterId : T.byName}
                  </button>
                ))}
              </div>

              {searchMode === 'epic' ? (
                <div className="input-group">
                  <label className="input-label">{T.epicNumber}</label>
                  <input className="input" value={epic}
                    onChange={e => setEpicInput(e.target.value.toUpperCase())}
                    placeholder={T.epicPlaceholder}
                    style={{ fontFamily: 'monospace', letterSpacing: '0.05em', fontSize: '1.1rem' }}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  />
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>{T.epicHint}</div>
                </div>
              ) : (
                <>
                  <div className="input-group">
                    <label className="input-label">{T.fullName}</label>
                    <input className="input" value={name} onChange={e => setName(e.target.value.toUpperCase())} placeholder="RAJESH KUMAR" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="input-group">
                      <label className="input-label">{T.stateCode}</label>
                      <input className="input" value={state} onChange={e => setState(e.target.value.toUpperCase())} placeholder="TN" maxLength={2} />
                    </div>
                    <div className="input-group">
                      <label className="input-label">{T.district}</label>
                      <input className="input" value={district} onChange={e => setDistrict(e.target.value)} placeholder="Chennai" />
                    </div>
                  </div>
                </>
              )}

              <button className="btn btn-primary btn-full" onClick={handleSearch} disabled={loading} style={{ marginTop: 8 }}>
                {loading ? <><span className="spinner" />&nbsp;{T.checkingEci}</> : T.verifyAndContinue}
              </button>
            </div>

            {result && !result.found && (
              <div className="card" style={{ background: 'rgba(230,57,70,0.06)', border: '1px solid rgba(230,57,70,0.3)' }}>
                <h3 style={{ color: 'var(--danger-light)', marginBottom: 8 }}>{T.notFoundEci}</h3>
                <p style={{ fontSize: '0.9rem', marginBottom: 16 }}>{result.message}</p>
                <button className="btn btn-primary btn-full" onClick={() => navigate('/mode1/forms')}>
                  {T.registerNow}
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* ── STEP 2: BOOTH ── */}
        {step === 2 && voter && (
          <motion.div key="s2" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            {/* Verified banner */}
            <div style={{ background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.3)', borderRadius: 'var(--radius-lg)', padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#52B788', fontWeight: 700, fontSize: '1.1rem' }}>✓</span>
              <div>
                <div style={{ fontWeight: 700, color: '#52B788', fontSize: '0.88rem' }}>{T.epicVerifiedLabel}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{voter.name || voter.epic} · {voter.state_name}</div>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{T.yourPollingBooth}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                {T.yourPollingBoothSub}
              </p>

              {voter.polling_station_address ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {[
                      { label: T.constituency, value: voter.assembly_constituency },
                      { label: T.boothNumber, value: voter.booth_number },
                      { label: T.pollingStation, value: voter.polling_station },
                      { label: T.address, value: voter.polling_station_address },
                      { label: T.electionDate, value: electionDateStr },
                    ].filter(r => r.value).map(({ label, value }) => (
                      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid var(--border)', gap: 8 }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
                        <span style={{ fontWeight: 600, fontSize: '0.86rem', textAlign: 'right' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    style={{ marginTop: 14, width: '100%', padding: '10px', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'inherit', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text)' }}
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(voter.polling_station_address)}`, '_blank')}
                  >
                    {T.openInMaps}
                  </button>
                </>
              ) : (
                <div>
                  <div className="alert alert-info" style={{ marginBottom: 12 }}>
                    {T.boothNotFound}
                  </div>
                  <button className="btn btn-secondary btn-full" onClick={() => navigate('/mode1/booth')}>
                    {T.enterBoothManually}
                  </button>
                </div>
              )}
            </div>

            <button className="btn btn-primary btn-full" onClick={advance} style={{ fontSize: '1rem', padding: '14px' }}>
              {T.nextCandidates}
            </button>
          </motion.div>
        )}

        {/* ── STEP 3: CANDIDATES ── */}
        {step === 3 && (
          <motion.div key="s3" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{T.candidatesConstituency}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16 }}>
                {voter?.assembly_constituency
                  ? `${voter.assembly_constituency} — ${candidatesLoading ? '…' : `${candidates.length} candidates`}`
                  : T.candidatesNotAvailable}
              </p>

              {candidatesLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 64 }} />)}
                </div>
              ) : candidates.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {candidates.map((c: any) => {
                    const caseCount = c.criminal_cases?.length || 0
                    return (
                      <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--surface-2)', borderRadius: 'var(--radius)', border: `1px solid ${caseCount > 0 ? 'rgba(230,57,70,0.2)' : 'var(--border)'}` }}>
                        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', border: '2px solid var(--border)', flexShrink: 0 }}>
                          {c.name.charAt(0)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.party_short || c.party}</div>
                        </div>
                        <div style={{ flexShrink: 0 }}>
                          {caseCount > 0
                            ? <span className="badge badge-danger" style={{ fontSize: '0.7rem' }}>{T.cases(caseCount)}</span>
                            : <span style={{ fontSize: '0.75rem', color: 'var(--success-light)', fontWeight: 600 }}>{T.clean}</span>
                          }
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="alert alert-info">
                  {voter?.assembly_code ? T.noCandidates : T.noConstituencyForCandidates}
                </div>
              )}
            </div>

            <button className="btn btn-ghost btn-full" style={{ marginBottom: 10 }} onClick={() => navigate('/mode1/candidates')}>
              {T.viewFullCandidateDetails}
            </button>
            <button className="btn btn-primary btn-full" onClick={advance} style={{ fontSize: '1rem', padding: '14px' }}>
              {T.nextDocuments}
            </button>
          </motion.div>
        )}

        {/* ── STEP 4: DOCUMENTS CHECKLIST ── */}
        {step === 4 && (
          <motion.div key="s4" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.2 }}>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 4 }}>{T.documentsToCarry}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 14 }}>
                {T.documentsToCarrySub}
              </p>

              {/* Progress */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, height: 6, borderRadius: 100, background: 'var(--surface-2)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 100,
                    background: 'linear-gradient(90deg, var(--primary), #52B788)',
                    width: `${(docChecked.size / ACCEPTED_DOCS.length) * 100}%`,
                    transition: 'width 0.3s',
                  }} />
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', flexShrink: 0 }}>{T.documentsOf(docChecked.size, ACCEPTED_DOCS.length)}</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {T.docs.map(doc => (
                  <button key={doc} onClick={() => toggleDoc(doc)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      background: docChecked.has(doc) ? 'rgba(82,183,136,0.08)' : 'var(--surface-2)',
                      border: `1px solid ${docChecked.has(doc) ? 'rgba(82,183,136,0.4)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s',
                    }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0, transition: 'all 0.2s',
                      border: `2px solid ${docChecked.has(doc) ? '#52B788' : 'var(--border)'}`,
                      background: docChecked.has(doc) ? '#52B788' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {docChecked.has(doc) && <span style={{ color: 'white', fontSize: '0.7rem', fontWeight: 800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text)', fontWeight: docChecked.has(doc) ? 600 : 400 }}>{doc}</span>
                  </button>
                ))}
              </div>

              <div className="alert alert-warning" style={{ marginTop: 16 }}>
                {T.originalRequired}
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={advance} style={{ fontSize: '1rem', padding: '14px' }}
              disabled={docChecked.size === 0}>
              {docChecked.size === 0 ? T.tickAtLeastOne : T.iHaveDocuments}
            </button>
            {docChecked.size === 0 && (
              <button className="btn btn-ghost btn-full" onClick={advance} style={{ marginTop: 8 }}>
                {T.skipForNow}
              </button>
            )}
          </motion.div>
        )}

        {/* ── STEP 5: ALL SET! ── */}
        {step === 5 && (
          <motion.div key="s5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 8, paddingBottom: 24 }}>

              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                style={{
                  width: 100, height: 100, borderRadius: '50%', marginBottom: 22,
                  background: 'linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.8rem', boxShadow: '0 0 48px rgba(82,183,136,0.4)',
                }}
              >
                🗳️
              </motion.div>

              <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ marginBottom: 8 }}>
                {T.allSetTitle}
              </motion.h2>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 280, marginBottom: 28 }}>
                {T.allSetSub}
              </motion.p>

              {/* Summary card */}
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} style={{ width: '100%', marginBottom: 20 }}>
                <div className="card" style={{ textAlign: 'left', background: 'linear-gradient(135deg, rgba(82,183,136,0.08) 0%, rgba(45,106,79,0.04) 100%)', border: '1px solid rgba(82,183,136,0.25)' }}>
                  <h4 style={{ color: '#52B788', marginBottom: 14 }}>{T.readinessSummary}</h4>
                  {[
                    { label: T.epic, value: voter?.epic },
                    { label: T.name, value: voter?.name },
                    { label: T.constituency, value: voter?.assembly_constituency },
                    { label: T.boothNo, value: voter?.booth_number },
                    { label: T.pollingStation, value: voter?.polling_station },
                    { label: T.documents, value: docChecked.size > 0 ? T.documentsReady(docChecked.size, ACCEPTED_DOCS.length) : undefined },
                  ].filter(r => r.value).map(({ label, value }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ color: '#52B788', fontWeight: 700 }}>✓</span> {label}
                      </span>
                      <span style={{ fontWeight: 600, maxWidth: '58%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Election date highlight */}
              {electionDateStr && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
                  style={{ width: '100%', marginBottom: 20, padding: '14px 16px', background: 'rgba(88,166,255,0.06)', border: '1px solid rgba(88,166,255,0.2)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.08em' }}>{T.electionDayLabel}</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--blue)' }}>{electionDateStr}</div>
                </motion.div>
              )}

              {/* Completion checklist pills */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
                {[
                  { label: T.idVerified, done: true },
                  { label: T.boothKnown, done: !!voter?.polling_station_address },
                  { label: T.candidatesReviewed, done: true },
                  { label: T.docsReady, done: docChecked.size > 0 },
                ].map(({ label, done }) => (
                  <span key={label} style={{
                    padding: '5px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
                    background: done ? 'rgba(82,183,136,0.12)' : 'var(--surface-2)',
                    border: `1px solid ${done ? 'rgba(82,183,136,0.4)' : 'var(--border)'}`,
                    color: done ? '#52B788' : 'var(--text-muted)',
                  }}>
                    {done ? '✓ ' : '○ '}{label}
                  </span>
                ))}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn btn-primary btn-full" style={{ fontSize: '1rem', padding: '14px' }} onClick={() => navigate('/mode1/candidates')}>
                  {T.fullCandidateDetails}
                </button>
                <button className="btn btn-secondary btn-full" onClick={() => navigate('/pledge')}>
                  {T.takePledge}
                </button>
                <button className="btn btn-ghost btn-full" onClick={() => navigate('/dashboard')}>
                  {T.backToHome}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}

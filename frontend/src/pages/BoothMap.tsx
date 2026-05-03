import React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useVoterStore } from '../store/voterStore'
import client from '../api/client'
import { lookupByEPIC } from '../api/voter'

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ['Verify EPIC', 'Find Booth', 'All Set!']
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 20 }}>
      {steps.map((label, i) => {
        const idx = i + 1
        const done = step > idx
        const active = step === idx
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: done ? '#52B788' : active ? 'var(--primary)' : 'var(--surface-2)',
                border: `2px solid ${done ? '#52B788' : active ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700,
                color: done || active ? 'white' : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>
                {done ? '✓' : idx}
              </div>
              <div style={{ fontSize: '0.65rem', marginTop: 4, color: active ? 'var(--text)' : 'var(--text-muted)', fontWeight: active ? 700 : 400, textAlign: 'center' }}>{label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ height: 2, flex: 1, background: done ? '#52B788' : 'var(--border)', marginBottom: 20, transition: 'background 0.3s' }} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

declare global {
  interface Window { google: any; initMap: () => void }
}

function formatElectionDate(dateStr: string) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BoothMap() {
  const navigate = useNavigate()
  const { state: locState } = useLocation()
  const inFlow = !!(locState as any)?.flow
  const { voter, setVoter } = useVoterStore()
  const mapRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const [showForm, setShowForm] = useState(false)
  const [scanning, setScanning] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [form, setForm] = useState({
    name: voter?.name || '',
    polling_station: voter?.polling_station || '',
    polling_station_address: voter?.polling_station_address || '',
    booth_number: voter?.booth_number || '',
    assembly_constituency: voter?.assembly_constituency || '',
    election_date: voter?.election_date || '',
  })

  useEffect(() => {
    if (!voter) return
    setForm(f => ({
      ...f,
      name: voter.name || f.name,
      polling_station: voter.polling_station || f.polling_station,
      polling_station_address: voter.polling_station_address || f.polling_station_address,
      booth_number: voter.booth_number || f.booth_number,
      assembly_constituency: voter.assembly_constituency || f.assembly_constituency,
      election_date: voter.election_date || f.election_date,
    }))
  }, [voter])

  const saveDetails = () => {
    if (!voter) return
    setVoter({ ...voter, ...form })
    setShowForm(false)
    toast.success('Booth details saved')
  }

  const handleScanCard = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setScanning(true)
    toast('Scanning your Voter ID card with AI…', { icon: '🔍' })
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
      const { data } = await client.post('/chat/extract-voter-card', {
        image_base64: base64,
        mime_type: file.type || 'image/jpeg',
      })
      if (data.extracted) {
        setForm(f => ({
          ...f,
          name: data.extracted.name || f.name,
          assembly_constituency: data.extracted.assembly_constituency || f.assembly_constituency,
          booth_number: data.extracted.booth_number || f.booth_number,
          polling_station: data.extracted.polling_station || f.polling_station,
          polling_station_address: data.extracted.polling_station_address || f.polling_station_address,
          election_date: data.extracted.election_date || f.election_date,
        }))
        toast.success('Details extracted! Review and save.')
      } else {
        toast.error('Could not read card — try a clearer photo')
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.message || ''
      if (msg.includes('quota') || msg.includes('429')) {
        toast.error('AI quota reached for today — enter details below manually', { duration: 5000 })
      } else {
        toast.error('Scan failed — enter details manually below')
      }
    } finally {
      setScanning(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  useEffect(() => {
    setShowForm(!voter?.polling_station_address)
  }, [voter?.polling_station_address])

  useEffect(() => {
    if (!voter?.epic || voter.polling_station_address) return
    let cancelled = false
    setFetching(true)
    lookupByEPIC(voter.epic).then(res => {
      if (!cancelled && res.found && res.voter?.polling_station_address) {
        setVoter({ ...voter, ...res.voter })
      }
    }).catch(() => {}).finally(() => { if (!cancelled) setFetching(false) })
    return () => { cancelled = true }
  }, [voter?.epic])

  useEffect(() => {
    if (!voter || !mapRef.current) return
    const lat = voter.lat || 12.9751
    const lng = voter.lng || 80.2201

    // Load Google Maps
    const existingScript = document.getElementById('gmaps-script')
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''

    const initMap = () => {
      if (!mapRef.current || !window.google) return
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng }, zoom: 16,
        styles: darkMapStyles,
        disableDefaultUI: false,
        zoomControl: true,
      })
      new window.google.maps.Marker({
        position: { lat, lng }, map,
        title: voter.polling_station,
        icon: { url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' }
      })
    }

    if (!existingScript && apiKey) {
      window.initMap = initMap
      const script = document.createElement('script')
      script.id = 'gmaps-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`
      script.async = true
      document.head.appendChild(script)
    } else if (window.google) {
      initMap()
    }
  }, [voter])

  const openInMaps = () => {
    if (!voter) return
    const q = encodeURIComponent(voter.polling_station_address)
    window.open(`https://maps.google.com/?q=${q}`, '_blank')
  }

  if (!voter) return (
    <div className="page"><div className="empty-state">
      <div className="empty-state-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      </div>
      <h3>No voter data</h3>
      <p>Check your voter registration first</p>
      <button className="btn btn-primary" onClick={() => navigate('/mode1')} style={{ marginTop: 16 }}>Check Registration</button>
    </div></div>
  )

  return (
    <div className="page fade-in">
      <div className="page-header">
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '1.2rem' }}>←</button>
        <div>
          <h2 style={{ marginBottom: 0 }}>Your Polling Booth</h2>
          <p style={{ fontSize: '0.8rem', marginTop: 2 }}>Booth No. {voter.booth_number}</p>
        </div>
      </div>

      {inFlow && <StepIndicator step={2} />}

      {/* Map */}
      <div style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', height: 250, background: 'var(--surface-2)', marginBottom: 16, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        {!import.meta.env.VITE_GOOGLE_MAPS_API_KEY && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 8, background: 'var(--surface-2)' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.4 }}><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>
            <div style={{ fontWeight: 700 }}>Map Preview</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '0 20px' }}>
              Add VITE_GOOGLE_MAPS_API_KEY to enable live map
            </div>
          </div>
        )}
      </div>

      {/* Booth Info — show saved data or editable form */}
      <div className="card" style={{ marginBottom: 16 }}>
        {fetching ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span className="spinner" />
            Fetching your booth details from ECI…
          </div>
        ) : !showForm && voter.polling_station_address ? (
          <>
            {voter.polling_station && <h3 style={{ marginBottom: 16 }}>{voter.polling_station}</h3>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'EPIC Number', value: voter.epic },
                { label: 'Full Name', value: voter.name },
                { label: 'State', value: voter.state_name },
                { label: 'Assembly', value: voter.assembly_constituency },
                { label: 'Booth Number', value: voter.booth_number },
                { label: 'Address', value: voter.polling_station_address },
                { label: 'Election Date', value: formatElectionDate(voter.election_date) },
              ].filter(row => row.value).map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flexShrink: 0, marginRight: 12 }}>{label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', textAlign: 'right' }}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setShowForm(true)}
              style={{ marginTop: 12, background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer', fontFamily: 'inherit' }}>
              Edit details
            </button>
          </>
        ) : (
          <>
            <div style={{ marginBottom: 14 }}>
              <h4 style={{ margin: '0 0 4px' }}>Your Booth Details</h4>
            </div>

            {/* Verified fields (read-only) */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>EPIC ✓</div>
                <div style={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '0.88rem' }}>{voter.epic}</div>
              </div>
              <div style={{ flex: 1, padding: '10px 12px', background: 'rgba(5,150,105,0.06)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>STATE ✓</div>
                <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{voter.state_name}</div>
              </div>
            </div>

            {/* Scan Voter ID card */}
            <input ref={fileRef} type="file" accept="image/*" capture="environment"
              style={{ display: 'none' }} onChange={handleScanCard} />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={scanning}
              style={{
                width: '100%', padding: '14px', marginBottom: 16,
                background: scanning ? 'var(--surface-3)' : 'linear-gradient(135deg, #FF6B35 0%, #E63946 100%)',
                color: scanning ? 'var(--text-muted)' : 'white',
                border: 'none', borderRadius: 'var(--radius)',
                fontFamily: 'inherit', fontWeight: 700, fontSize: '0.95rem',
                cursor: scanning ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
              }}>
              {scanning ? (
                <><span className="spinner" style={{ borderTopColor: 'var(--text-muted)' }} />Reading your Voter ID card…</>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  Scan Voter ID Card (AI)
                </>
              )}
            </button>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 14, textAlign: 'center' }}>
              Take a photo of your Voter ID card — AI fills the form automatically
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { key: 'name', label: 'Full Name', placeholder: 'As on ECI portal' },
                { key: 'assembly_constituency', label: 'Assembly Constituency', placeholder: 'e.g. Velachery' },
                { key: 'booth_number', label: 'Booth / Part Number', placeholder: 'e.g. 28' },
                { key: 'polling_station', label: 'Polling Station Name', placeholder: 'e.g. Muslim School' },
                { key: 'polling_station_address', label: 'Polling Station Address', placeholder: 'Full address of booth' },
                { key: 'election_date', label: 'Election Date (optional)', placeholder: 'YYYY-MM-DD' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4, fontWeight: 600 }}>{label}</label>
                  <input
                    className="input"
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
            <button className="btn btn-primary btn-full" onClick={saveDetails} style={{ marginTop: 16 }}>
              Save Booth Details
            </button>
            {showForm && voter.polling_station_address && (
              <button onClick={() => setShowForm(false)}
                style={{ marginTop: 8, width: '100%', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn btn-secondary btn-full" onClick={openInMaps} disabled={!voter.polling_station_address}>
          Open in Google Maps
        </button>
        <button className="btn btn-ghost btn-full" onClick={() => navigate('/mode2/documents')}>
          Documents I Need
        </button>
      </div>

      {inFlow && (
        <button
          className="btn btn-primary btn-full"
          onClick={() => navigate('/mode1/complete')}
          style={{ marginTop: 16, fontSize: '1rem', padding: '16px', background: 'linear-gradient(135deg, #52B788 0%, #2D6A4F 100%)', border: 'none' }}
        >
          I'm All Set! →
        </button>
      )}
    </div>
  )
}

const darkMapStyles: any[] = []

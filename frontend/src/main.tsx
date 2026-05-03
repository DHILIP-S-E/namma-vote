import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initMessaging, requestFCMToken } from './firebase'
import { registerFCMToken } from './api/voter'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

// Initialize PWA service worker + FCM in background
async function bootstrapPWA() {
  if (!('serviceWorker' in navigator)) return

  try {
    await initMessaging()
    const token = await requestFCMToken()
    if (!token) return

    // Register token with backend if voter data exists in storage
    const stored = localStorage.getItem('nammavote-voter')
    if (!stored) return
    const { state } = JSON.parse(stored)
    const voter = state?.voter
    const epicHash = state?.epicHash
    if (!voter || !epicHash) return

    await registerFCMToken({
      epic_hash: epicHash,
      fcm_token: token,
      state: voter.state_code,
      constituency: voter.assembly_code,
      language: state.language || 'en',
    })
    console.log('[FCM] Token registered')
  } catch (e) {
    // Non-critical — app works without notifications
    console.warn('[FCM] Push notification setup failed:', e)
  }
}

bootstrapPWA()

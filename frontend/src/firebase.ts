import { initializeApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
}

const isConfigured = !!firebaseConfig.apiKey

export let app: ReturnType<typeof initializeApp> | null = null
let messagingInstance: ReturnType<typeof getMessaging> | null = null

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig)
  } catch (e) {
    console.warn('[FCM] Firebase init failed:', e)
  }
}

export async function initMessaging() {
  if (!isConfigured || !app) return null
  try {
    const supported = await isSupported()
    if (!supported) return null
    messagingInstance = getMessaging(app)
    return messagingInstance
  } catch {
    return null
  }
}

export async function requestFCMToken(): Promise<string | null> {
  if (!isConfigured) return null
  try {
    const messaging = messagingInstance || await initMessaging()
    if (!messaging) return null
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return null
    const token = await getToken(messaging, {
      vapidKey: firebaseConfig.vapidKey,
      serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(),
    })
    return token || null
  } catch (e) {
    console.warn('[FCM] Token request failed:', e)
    return null
  }
}

export function onForegroundMessage(callback: (payload: any) => void) {
  if (!messagingInstance) return () => {}
  return onMessage(messagingInstance, callback)
}

export { isConfigured }

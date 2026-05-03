import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { VoterData } from '../api/voter'

interface AuthUser {
  uid: string
  email: string | null
  displayName: string | null
}

interface VoterStore {
  voter: VoterData | null
  epic: string
  epicHash: string
  language: 'en' | 'ta' | 'hi'
  persona: string
  onboardingDone: boolean
  authUser: AuthUser | null
  isAuthenticated: boolean
  setVoter: (voter: VoterData) => void
  setEpic: (epic: string) => void
  setEpicHash: (hash: string) => void
  setLanguage: (lang: 'en' | 'ta' | 'hi') => void
  setPersona: (persona: string) => void
  setOnboardingDone: (done: boolean) => void
  clearVoter: () => void
  setAuthUser: (user: AuthUser) => void
  logout: () => void
}

export const useVoterStore = create<VoterStore>()(
  persist(
    (set) => ({
      voter: null,
      epic: '',
      epicHash: '',
      language: 'en',
      persona: '',
      onboardingDone: false,
      authUser: null,
      isAuthenticated: false,
      setVoter: (voter) => set({ voter }),
      setEpic: (epic) => set({ epic }),
      setEpicHash: (epicHash) => set({ epicHash }),
      setLanguage: (language) => set({ language }),
      setPersona: (persona) => set({ persona }),
      setOnboardingDone: (onboardingDone) => set({ onboardingDone }),
      clearVoter: () => set({ voter: null, epic: '', epicHash: '' }),
      setAuthUser: (authUser) => set({ authUser, isAuthenticated: true }),
      logout: () => set({ authUser: null, isAuthenticated: false, onboardingDone: false, voter: null, epic: '', epicHash: '' }),
    }),
    { name: 'nammavote-voter', version: 2 }
  )
)

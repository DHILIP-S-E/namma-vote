import { useVoterStore } from '../store/voterStore'
import t, { type Lang } from './translations'

export function useT() {
  const lang = (useVoterStore(s => s.language) || 'en') as Lang
  return t[lang] ?? t.en
}

import client from './client'

export type Verdict = 'TRUE' | 'FALSE' | 'MISLEADING'

export interface RumourResult {
  claim: string
  verdict: Verdict
  explanation: string
  source_url: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
  language: string
}

export const checkRumour = async (claim: string, language = 'en', state?: string): Promise<RumourResult> => {
  const { data } = await client.post('/rumour/check', { claim, language, state })
  return data
}

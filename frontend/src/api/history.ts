import client from './client'

export interface PastResult {
  year: number
  winner: string
  party: string
  party_short: string
  votes: number
  margin: number
  turnout: number | null
}

export interface NotaRecord {
  year: number
  votes: number
  pct: number
}

export interface ConstituencyHistoryData {
  state_code: string
  constituency_code: string
  constituency_name: string
  swing_note: string
  insight: string
  past: PastResult[]
  nota: NotaRecord[]
}

export interface PhaseInfo {
  phase: number
  election_date: string | null
  counting_date: string | null
  states: string[]
  state_codes: string[]
}

export interface PhasesData {
  phases: PhaseInfo[]
  counting_date: string | null
}

export async function getConstituencyHistory(state: string, constituency: string): Promise<ConstituencyHistoryData> {
  const res = await client.get(`/history/${state}/${constituency}`)
  return res.data
}

export async function getElectionPhases(): Promise<PhasesData> {
  const res = await client.get('/schedule/phases')
  return res.data
}

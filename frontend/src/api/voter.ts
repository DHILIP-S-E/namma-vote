import client from './client'

export interface VoterData {
  epic?: string
  name: string
  father_name: string
  gender: string
  age: number
  booth_number: string
  polling_station: string
  polling_station_address: string
  assembly_constituency: string
  assembly_code: string
  parliamentary_constituency: string
  state_code: string
  state_name: string
  district: string
  phase_number: number
  election_date: string
  health_issues: HealthIssue[]
  document_checklist: DocumentChecklist
  lat?: number
  lng?: number
}

export interface HealthIssue {
  type: 'name_mismatch' | 'address' | 'duplicate' | 'other'
  detail: string
  form: '6' | '7' | '8'
}

export interface DocumentChecklist {
  accepted: string[]
  not_accepted: string[]
}

export interface VoterLookupResult {
  found: boolean
  voter?: VoterData
  action?: string
  message?: string
}

export const lookupByEPIC = async (epic: string): Promise<VoterLookupResult> => {
  const { data } = await client.post('/voter/lookup', { epic })
  return data
}

export const lookupByName = async (name: string, state: string, district: string): Promise<VoterLookupResult> => {
  const { data } = await client.post('/voter/lookup', { name, state, district })
  return data
}

export const registerFCMToken = async (payload: {
  epic_hash: string
  fcm_token: string
  state: string
  constituency: string
  language: string
}) => {
  const { data } = await client.post('/notify/fcm/register', payload)
  return data
}

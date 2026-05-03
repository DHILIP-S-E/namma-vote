import client from './client'

export interface Candidate {
  id: string
  name: string
  party: string
  party_short: string
  party_symbol_url: string
  photo_url: string
  serial_number: number
  criminal_cases: CriminalCase[]
  total_assets_inr: number
  assets_detail: AssetsDetail
  education: string
  education_discrepancy: boolean
  affidavit_url: string
}

export interface CriminalCase {
  section: string
  description: string
  court: string
  year: number
}

export interface AssetsDetail {
  movable: number
  immovable: number
  vehicles: number
  bank_balance: number
}

export const getCandidates = async (state: string, constituency: string, year = 2026, constituencyName = ''): Promise<{ candidates: Candidate[]; count: number }> => {
  const params = constituencyName ? { name: constituencyName } : {}
  const { data } = await client.get(`/candidates/${state}/${constituency}/${year}`, { params })
  return data
}

export const getSchedule = async (state: string, constituency: string) => {
  const { data } = await client.get(`/schedule/${state}/${constituency}`)
  return data
}

export const getDocuments = async (state: string) => {
  const { data } = await client.get(`/documents/${state}`)
  return data
}

export const formatAssets = (inr: number): string => {
  if (inr >= 10000000) return `₹${(inr / 10000000).toFixed(1)} Cr`
  if (inr >= 100000)   return `₹${(inr / 100000).toFixed(1)} Lakh`
  return `₹${inr.toLocaleString('en-IN')}`
}

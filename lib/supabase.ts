import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: false },
})

export type Flow = 'Light' | 'Medium' | 'Heavy'

export type CycleRow = { id: string; start_date: string; length: number; flow: Flow; notes: string; created_at: string }
export type SupplyRow = { id: string; name: string; checked: boolean; created_at: string }
export type CareNoteRow = { id: string; author: string; text: string; created_at: string }
export type CheckinRow = { id: string; mood: string; note: string; created_at: string }
export type SettingsRow = {
  id: number
  name_a: string
  name_b: string
  default_cycle_length: number
  default_period_length: number
  notifications: boolean
  updated_at: string
}
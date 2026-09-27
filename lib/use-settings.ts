'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type SettingsRow } from '@/lib/supabase'

const fallback: SettingsRow = {
  id: 1,
  name_a: 'G',
  name_b: 'S',
  default_cycle_length: 28,
  default_period_length: 5,
  notifications: true,
  updated_at: new Date().toISOString(),
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsRow>(fallback)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle()
    if (error) setError(error.message)
    else if (data) setSettings(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`settings-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'settings' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [refresh])

  async function update(patch: Partial<SettingsRow>) {
    const next = { ...settings, ...patch }
    setSettings(next)
    const { error } = await supabase.from('settings').update({ ...patch, updated_at: new Date().toISOString() }).eq('id', 1)
    if (error) setError(error.message)
  }

  return { settings, loading, error, update }
}
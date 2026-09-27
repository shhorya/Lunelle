'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type CycleRow, type Flow } from '@/lib/supabase'

export function useCycles() {
  const [cycles, setCycles] = useState<CycleRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from('cycles').select('*').order('start_date', { ascending: false })
    if (error) setError(error.message)
    else setCycles(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`cycles-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cycles' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [refresh])

  async function addCycle(entry: { startDate: string; length: number; flow: Flow; notes: string; painLevel?: number | null }) {
    const { error } = await supabase.from('cycles').insert({
      start_date: entry.startDate,
      length: entry.length,
      flow: entry.flow,
      notes: entry.notes,
      pain_level: entry.painLevel ?? null,
    })
    if (error) setError(error.message)
    else refresh()
  }

  async function removeCycle(id: string) {
    const { error } = await supabase.from('cycles').delete().eq('id', id)
    if (error) setError(error.message)
    else refresh()
  }

  return { cycles, loading, error, addCycle, removeCycle, refresh }
}
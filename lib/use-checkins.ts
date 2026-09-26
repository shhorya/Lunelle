'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type CheckinRow } from '@/lib/supabase'

export function useCheckins() {
  const [checkins, setCheckins] = useState<CheckinRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from('checkins').select('*').order('created_at', { ascending: false }).limit(30)
    if (error) setError(error.message)
    else setCheckins(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`checkins-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'checkins' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [refresh])

  async function addCheckin(mood: string, note: string) {
    const { error } = await supabase.from('checkins').insert({ mood, note })
    if (error) setError(error.message)
    else refresh()
  }

  return { checkins, loading, error, addCheckin, latest: checkins[0] ?? null }
}
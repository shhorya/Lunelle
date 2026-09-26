'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type CareNoteRow } from '@/lib/supabase'

export function useCareNotes() {
  const [notes, setNotes] = useState<CareNoteRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from('care_notes').select('*').order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setNotes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`care-notes-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'care_notes' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [refresh])

  async function addNote(author: string, text: string) {
    const { error } = await supabase.from('care_notes').insert({ author, text })
    if (error) setError(error.message)
    else refresh()
  }

  async function removeNote(id: string) {
    const { error } = await supabase.from('care_notes').delete().eq('id', id)
    if (error) setError(error.message)
    else refresh()
  }

  return { notes, loading, error, addNote, removeNote, refresh }
}
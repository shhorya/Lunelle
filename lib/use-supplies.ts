'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase, type SupplyRow } from '@/lib/supabase'

export function useSupplies() {
  const [items, setItems] = useState<SupplyRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from('supplies').select('*').order('created_at', { ascending: true })
    if (error) setError(error.message)
    else setItems(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    const channel = supabase
      .channel(`supplies-changes-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'supplies' }, () => refresh())
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [refresh])

  async function addItem(name: string) {
    const { error } = await supabase.from('supplies').insert({ name, checked: false })
    if (error) setError(error.message)
    else refresh()
  }

  async function toggleItem(id: string, checked: boolean) {
    const { error } = await supabase.from('supplies').update({ checked }).eq('id', id)
    if (error) setError(error.message)
    else refresh()
  }

  async function removeItem(id: string) {
    const { error } = await supabase.from('supplies').delete().eq('id', id)
    if (error) setError(error.message)
    else refresh()
  }

  return { items, loading, error, addItem, toggleItem, removeItem, refresh }
}
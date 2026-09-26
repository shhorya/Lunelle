'use client'

import { useState } from 'react'
import { CalendarDays, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useCycles } from '@/lib/use-cycles'
import type { Flow } from '@/lib/supabase'

export function MyCyclesPage() {
  const { cycles, loading, error, addCycle, removeCycle } = useCycles()
  const [startDate, setStartDate] = useState('')
  const [length, setLength] = useState('28')
  const [flow, setFlow] = useState<Flow>('Medium')
  const [notes, setNotes] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!startDate) return
    addCycle({ startDate, length: Number(length) || 28, flow, notes })
    setStartDate('')
    setLength('28')
    setFlow('Medium')
    setNotes('')
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><CalendarDays size={14} /> My cycles</p>
          <h1>Your history<span>.</span></h1>
          <p className="lede">Every cycle you log is synced with your partner in real time.</p>
        </div>
      </div>

      {error && <div className="banner">Couldn&apos;t reach the database: {error}</div>}

      <div className="dashboard-grid">
        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Add a cycle</p><h3>Log a past period</h3></div></div>
          <form className="field-group" onSubmit={submit}>
            <div className="field-row">
              <label>Start date
                <input className="text-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </label>
              <label>Length (days)
                <input className="text-input" type="number" min={1} max={90} value={length} onChange={(e) => setLength(e.target.value)} />
              </label>
            </div>
            <label>Flow
              <select className="select-input" value={flow} onChange={(e) => setFlow(e.target.value as Flow)}>
                <option>Light</option>
                <option>Medium</option>
                <option>Heavy</option>
              </select>
            </label>
            <label>Notes (optional)
              <input className="text-input" type="text" placeholder="How did this cycle feel?" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button type="submit" className="primary-button full"><Plus size={18} /> Save cycle</button>
          </form>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Timeline</p><h3>{loading ? 'Loading\u2026' : `${cycles.length} cycle${cycles.length === 1 ? '' : 's'} logged`}</h3></div></div>
          {!loading && cycles.length === 0 && <p className="empty-state">No cycles logged yet — add your first one on the left.</p>}
          {cycles.map((cycle) => (
            <div className="log-item" key={cycle.id}>
              <span>{new Date(cycle.start_date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}</span>
              <div>
                <b>{cycle.length}-day cycle · {cycle.flow} flow</b>
                <small>{cycle.notes || 'No notes'}</small>
              </div>
              <button className="delete-btn" onClick={() => removeCycle(cycle.id)} aria-label="Delete entry"><Trash2 size={14} /></button>
            </div>
          ))}
        </GlassCard>
      </div>
    </>
  )
}
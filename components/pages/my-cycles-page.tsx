'use client'

import { useState } from 'react'
import { CalendarDays, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useLocalStorage } from '@/lib/use-local-storage'

type CycleEntry = {
  id: string
  startDate: string
  length: number
  flow: 'Light' | 'Medium' | 'Heavy'
  notes: string
}

const seedCycles: CycleEntry[] = [
  { id: '1', startDate: '2024-09-02', length: 28, flow: 'Medium', notes: '' },
  { id: '2', startDate: '2024-08-05', length: 27, flow: 'Light', notes: 'Felt tired the first two days.' },
]

export function MyCyclesPage() {
  const [cycles, setCycles] = useLocalStorage<CycleEntry[]>('lunelle-cycles', seedCycles)
  const [startDate, setStartDate] = useState('')
  const [length, setLength] = useState('28')
  const [flow, setFlow] = useState<CycleEntry['flow']>('Medium')
  const [notes, setNotes] = useState('')

  const sorted = [...cycles].sort((a, b) => (a.startDate < b.startDate ? 1 : -1))

  function addCycle(event: React.FormEvent) {
    event.preventDefault()
    if (!startDate) return
    const entry: CycleEntry = {
      id: crypto.randomUUID(),
      startDate,
      length: Number(length) || 28,
      flow,
      notes,
    }
    setCycles([entry, ...cycles])
    setStartDate('')
    setLength('28')
    setFlow('Medium')
    setNotes('')
  }

  function removeCycle(id: string) {
    setCycles(cycles.filter((c) => c.id !== id))
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><CalendarDays size={14} /> My cycles</p>
          <h1>Your history<span>.</span></h1>
          <p className="lede">Every cycle you log is saved on this device, so you can look back anytime.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Add a cycle</p><h3>Log a past period</h3></div></div>
          <form className="field-group" onSubmit={addCycle}>
            <div className="field-row">
              <label>Start date
                <input className="text-input" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
              </label>
              <label>Length (days)
                <input className="text-input" type="number" min={1} max={90} value={length} onChange={(e) => setLength(e.target.value)} />
              </label>
            </div>
            <label>Flow
              <select className="select-input" value={flow} onChange={(e) => setFlow(e.target.value as CycleEntry['flow'])}>
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
          <div className="card-heading"><div><p className="eyebrow">Timeline</p><h3>{sorted.length} cycle{sorted.length === 1 ? '' : 's'} logged</h3></div></div>
          {sorted.length === 0 && <p className="empty-state">No cycles logged yet — add your first one on the left.</p>}
          {sorted.map((cycle) => (
            <div className="log-item" key={cycle.id}>
              <span>{new Date(cycle.startDate).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}</span>
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
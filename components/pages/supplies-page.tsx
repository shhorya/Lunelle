'use client'

import { useState } from 'react'
import { PawPrint, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useSupplies } from '@/lib/use-supplies'

export function SuppliesPage() {
  const { items, loading, error, addItem, toggleItem, removeItem } = useSupplies()
  const [name, setName] = useState('')

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    addItem(name.trim())
    setName('')
  }

  const stocked = items.filter((i) => i.checked).length

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><PawPrint size={14} /> Supplies</p>
          <h1>Stock check<span>.</span></h1>
          <p className="lede">{loading ? 'Loading\u2026' : `${stocked} of ${items.length} items are stocked up.`}</p>
        </div>
      </div>

      {error && <div className="banner">Couldn&apos;t reach the database: {error}</div>}

      <div className="dashboard-grid">
        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Add item</p><h3>New supply</h3></div></div>
          <form className="field-group" onSubmit={submit}>
            <input className="text-input" type="text" placeholder="e.g. Chocolate, tampons, tea…" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit" className="primary-button full"><Plus size={18} /> Add to list</button>
          </form>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Checklist</p><h3>Tick what you have</h3></div></div>
          {!loading && items.length === 0 && <p className="empty-state">Nothing here yet. Add your first supply on the left.</p>}
          <div className="checklist">
            {items.map((item) => (
              <label className="checklist-item" key={item.id}>
                <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id, !item.checked)} />
                <span className={item.checked ? '' : 'muted-day'}>{item.name}</span>
                <button type="button" className="delete-btn" onClick={() => removeItem(item.id)} aria-label="Remove item"><Trash2 size={14} /></button>
              </label>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
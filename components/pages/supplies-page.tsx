'use client'

import { useState } from 'react'
import { PawPrint, Plus, Trash2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useLocalStorage } from '@/lib/use-local-storage'

type SupplyItem = { id: string; name: string; checked: boolean }

const seedSupplies: SupplyItem[] = [
  { id: '1', name: 'Pads', checked: true },
  { id: '2', name: 'Pain relief', checked: true },
  { id: '3', name: 'Heating pad', checked: false },
]

export function SuppliesPage() {
  const [items, setItems] = useLocalStorage<SupplyItem[]>('lunelle-supplies', seedSupplies)
  const [name, setName] = useState('')

  function addItem(event: React.FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    setItems([...items, { id: crypto.randomUUID(), name: name.trim(), checked: false }])
    setName('')
  }

  function toggleItem(id: string) {
    setItems(items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)))
  }

  function removeItem(id: string) {
    setItems(items.filter((item) => item.id !== id))
  }

  const stocked = items.filter((i) => i.checked).length

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><PawPrint size={14} /> Supplies</p>
          <h1>Stock check<span>.</span></h1>
          <p className="lede">{stocked} of {items.length} items are stocked up.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Add item</p><h3>New supply</h3></div></div>
          <form className="field-group" onSubmit={addItem}>
            <input className="text-input" type="text" placeholder="e.g. Chocolate, tampons, tea…" value={name} onChange={(e) => setName(e.target.value)} />
            <button type="submit" className="primary-button full"><Plus size={18} /> Add to list</button>
          </form>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Checklist</p><h3>Tick what you have</h3></div></div>
          {items.length === 0 && <p className="empty-state">Nothing here yet — add your first supply on the left.</p>}
          <div className="checklist">
            {items.map((item) => (
              <label className="checklist-item" key={item.id}>
                <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} />
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
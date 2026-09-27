'use client'

import { useState } from 'react'
import { Check, Settings2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useSettings } from '@/lib/use-settings'

export function SettingsPage() {
  const { settings, loading, error, update } = useSettings()
  const [saved, setSaved] = useState(false)

  function flashSaved() {
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1600)
  }

  async function handleUpdate(key: 'name_a' | 'name_b' | 'default_cycle_length' | 'default_period_length' | 'notifications', value: any) {
    await update({ [key]: value } as any)
    flashSaved()
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><Settings2 size={14} /> Settings</p>
          <h1>Preferences<span>.</span></h1>
          <p className="lede">{loading ? 'Loading\u2026' : 'Saved live to your shared space, visible to both of you.'}</p>
        </div>
        {saved && <span className="sync-pill"><span className="dot" /> Saved</span>}
      </div>

      {error && <div className="banner">Couldn&apos;t reach the database: {error}</div>}

      <div className="dashboard-grid settings-grid">
        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Names</p><h3>Who&apos;s using this</h3></div></div>
          <div className="field-group">
            <div className="field-row">
              <label>Partner 1
                <input className="text-input" type="text" value={settings.name_a} onChange={(e) => handleUpdate('name_a', e.target.value)} />
              </label>
              <label>Partner 2
                <input className="text-input" type="text" value={settings.name_b} onChange={(e) => handleUpdate('name_b', e.target.value)} />
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Defaults</p><h3>Cycle assumptions</h3></div></div>
          <div className="field-group">
            <div className="field-row">
              <label>Cycle length (days)
                <input className="text-input" type="number" min={15} max={60} value={settings.default_cycle_length} onChange={(e) => handleUpdate('default_cycle_length', Number(e.target.value) || 28)} />
              </label>
              <label>Period length (days)
                <input className="text-input" type="number" min={1} max={14} value={settings.default_period_length} onChange={(e) => handleUpdate('default_period_length', Number(e.target.value) || 5)} />
              </label>
            </div>
            <label className="checklist-item">
              <input type="checkbox" checked={settings.notifications} onChange={(e) => handleUpdate('notifications', e.target.checked)} />
              <span>Gentle reminders enabled</span>
              {settings.notifications && <Check size={14} color="#65af96" />}
            </label>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
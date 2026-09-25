'use client'

import { Settings2 } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useLocalStorage } from '@/lib/use-local-storage'

type Settings = {
  nameA: string
  nameB: string
  defaultCycleLength: number
  defaultPeriodLength: number
  notifications: boolean
}

const defaultSettings: Settings = {
  nameA: 'A',
  nameB: 'J',
  defaultCycleLength: 28,
  defaultPeriodLength: 5,
  notifications: true,
}

export function SettingsPage() {
  const [settings, setSettings] = useLocalStorage<Settings>('lunelle-settings', defaultSettings)

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings({ ...settings, [key]: value })
  }

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><Settings2 size={14} /> Settings</p>
          <h1>Preferences<span>.</span></h1>
          <p className="lede">These are saved on this device only.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Names</p><h3>Who&apos;s using this</h3></div></div>
          <div className="field-group">
            <div className="field-row">
              <label>Partner 1
                <input className="text-input" type="text" value={settings.nameA} onChange={(e) => update('nameA', e.target.value)} />
              </label>
              <label>Partner 2
                <input className="text-input" type="text" value={settings.nameB} onChange={(e) => update('nameB', e.target.value)} />
              </label>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="card-heading"><div><p className="eyebrow">Defaults</p><h3>Cycle assumptions</h3></div></div>
          <div className="field-group">
            <div className="field-row">
              <label>Cycle length (days)
                <input className="text-input" type="number" min={15} max={60} value={settings.defaultCycleLength} onChange={(e) => update('defaultCycleLength', Number(e.target.value) || 28)} />
              </label>
              <label>Period length (days)
                <input className="text-input" type="number" min={1} max={14} value={settings.defaultPeriodLength} onChange={(e) => update('defaultPeriodLength', Number(e.target.value) || 5)} />
              </label>
            </div>
            <label className="checklist-item">
              <input type="checkbox" checked={settings.notifications} onChange={(e) => update('notifications', e.target.checked)} />
              <span>Gentle reminders enabled</span>
            </label>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
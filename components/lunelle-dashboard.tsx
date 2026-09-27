'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Heart,
  Home,
  LayoutGrid,
  LogOut,
  Moon,
  MoreHorizontal,
  PawPrint,
  Plus,
  Search,
  Settings2,
  Sun,
  TimerReset,
  Trash2,
  User,
  X,
} from 'lucide-react'
import { MushroomPet } from '@/components/lunelle-shared'
import { CustomCursor } from '@/components/custom-cursor'
import { OverviewPage } from '@/components/pages/overview-page'
import { MyCyclesPage } from '@/components/pages/my-cycles-page'
import { InsightsPage } from '@/components/pages/insights-page'
import { SuppliesPage } from '@/components/pages/supplies-page'
import { CareNotesPage } from '@/components/pages/care-notes-page'
import { SettingsPage } from '@/components/pages/settings-page'
import { useCycles } from '@/lib/use-cycles'
import { useSupplies } from '@/lib/use-supplies'
import { useCareNotes } from '@/lib/use-care-notes'
import { useSettings } from '@/lib/use-settings'
import { computeCycleStats } from '@/lib/cycle-math'

const navItems = [
  { label: 'Overview', icon: Home },
  { label: 'My cycles', icon: CalendarDays },
  { label: 'Insights', icon: Activity },
  { label: 'Supplies', icon: PawPrint },
]

export function LunelleDashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [dark, setDark] = useState(false)
  const [mood, setMood] = useState('Double click Mushroom to give him a little love')
  const [toast, setToast] = useState<{ title: string; body: string } | null>(null)
  const [showLog, setShowLog] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [query, setQuery] = useState('')
  const [addingCycle, setAddingCycle] = useState(false)
  const [quickDate, setQuickDate] = useState('')

  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  const { cycles, addCycle, removeCycle } = useCycles()
  const { items: supplies } = useSupplies()
  const { notes } = useCareNotes()
  const { settings } = useSettings()

  useEffect(() => {
    const stored = window.localStorage.getItem('lunelle-theme')
    if (stored === 'dark') setDark(true)
  }, [])

  useEffect(() => {
    window.localStorage.setItem('lunelle-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false)
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfileMenu(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return
      setShowLog(false)
      setShowSearch(false)
      setShowHelp(false)
      setAddingCycle(false)
      setQuery('')
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const [timeGreeting, setTimeGreeting] = useState('Hello')
  useEffect(() => {
    const hour = new Date().getHours()
    setTimeGreeting(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening')
  }, [])
  const greeting = useMemo(
    () => (activeNav === 'Overview' ? `${timeGreeting}, ${settings.name_a}.` : activeNav),
    [activeNav, settings.name_a, timeGreeting],
  )

  const stats = useMemo(
    () => computeCycleStats(cycles, settings.default_cycle_length, settings.default_period_length),
    [cycles, settings.default_cycle_length, settings.default_period_length],
  )

  const notifications = useMemo(() => {
    const list: { title: string; body: string }[] = []
    if (stats.hasData && stats.daysToGo <= 3) {
      list.push({
        title: 'Period expected soon',
        body: stats.daysToGo === 0 ? 'Your next period is expected today.' : `Expected in ${stats.daysToGo} day${stats.daysToGo === 1 ? '' : 's'}.`,
      })
    }
    const unchecked = supplies.filter((s) => !s.checked)
    if (unchecked.length > 0) {
      list.push({ title: 'Supplies running low', body: `${unchecked.length} item${unchecked.length === 1 ? '' : 's'} still need restocking.` })
    }
    const latestNote = notes[0]
    if (latestNote) {
      const hoursAgo = (Date.now() - new Date(latestNote.created_at).getTime()) / 3.6e6
      if (hoursAgo < 48) {
        list.push({ title: `New note from ${latestNote.author}`, body: latestNote.text.slice(0, 60) })
      }
    }
    return list
  }, [stats, supplies, notes])

  function logPeriod() {
    const today = new Date().toISOString().slice(0, 10)
    addCycle({ startDate: today, length: settings.default_cycle_length, flow: 'Medium', notes: '' })
    setToast({ title: 'Logged with love', body: 'Your cycle note is saved for today.' })
    window.setTimeout(() => setToast(null), 2600)
  }

  function addPastCycle(e: React.FormEvent) {
    e.preventDefault()
    if (!quickDate) return
    addCycle({ startDate: quickDate, length: settings.default_cycle_length, flow: 'Medium', notes: '' })
    setQuickDate('')
    setAddingCycle(false)
  }

  const searchResults = useMemo(() => {
    if (!query.trim()) return []
    const q = query.trim().toLowerCase()
    const results: { label: string; sub: string; nav: string }[] = []
    cycles.forEach((c) => {
      if (c.flow.toLowerCase().includes(q) || c.notes.toLowerCase().includes(q) || c.start_date.includes(q)) {
        results.push({ label: `Cycle started ${c.start_date}`, sub: `${c.length}-day \u00b7 ${c.flow} flow`, nav: 'My cycles' })
      }
    })
    supplies.forEach((s) => {
      if (s.name.toLowerCase().includes(q)) {
        results.push({ label: s.name, sub: s.checked ? 'Stocked' : 'Needs restocking', nav: 'Supplies' })
      }
    })
    notes.forEach((n) => {
      if (n.text.toLowerCase().includes(q)) {
        results.push({ label: n.text.slice(0, 50), sub: `Note from ${n.author}`, nav: 'Care notes' })
      }
    })
    return results.slice(0, 8)
  }, [query, cycles, supplies, notes])

  function renderPage() {
    switch (activeNav) {
      case 'My cycles':
        return <MyCyclesPage />
      case 'Insights':
        return <InsightsPage />
      case 'Supplies':
        return <SuppliesPage />
      case 'Care notes':
        return <CareNotesPage />
      case 'Settings':
        return <SettingsPage />
      default:
        return <OverviewPage greeting={greeting} mood={mood} setMood={setMood} logPeriod={logPeriod} stats={stats} />
    }
  }

  return (
    <main className={dark ? 'lunelle dark-mode' : 'lunelle'}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <aside className="sidebar">
        <div className="brand-mark"><span className="brand-orb">✳</span><span>lunelle</span></div>
        <div className="profile-mini" ref={profileRef} style={{ position: 'relative' }}>
          <div className="avatar">{settings.name_a?.[0] ?? 'A'}</div>
          <div><strong>{settings.name_a} & {settings.name_b}</strong><span>Our little space</span></div>
          <button aria-label="Profile menu" onClick={() => setShowProfileMenu((v) => !v)} style={{ background: 'none', border: 0, color: 'inherit', display: 'flex' }}>
            <MoreHorizontal size={17} />
          </button>
          {showProfileMenu && (
            <div className="dropdown-menu" style={{ top: 'calc(100% + 6px)' }}>
              <button onClick={() => { setActiveNav('Settings'); setShowProfileMenu(false) }}><User size={14} /> Edit names</button>
              <button onClick={() => { setActiveNav('Settings'); setShowProfileMenu(false) }}><Settings2 size={14} /> Preferences</button>
              <button className="danger" onClick={() => { setShowProfileMenu(false); setToast({ title: 'This is a shared space', body: 'There\u2019s no sign-out here, it\u2019s just the two of you.' }); window.setTimeout(() => setToast(null), 2600) }}><LogOut size={14} /> Sign out</button>
            </div>
          )}
        </div>
        <nav aria-label="Main navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label)}>
              <Icon size={18} /><span>{label}</span>{label === 'Insights' && cycles.length > 0 && <i>{cycles.length}</i>}
            </button>
          ))}
          <span className="nav-label later">Personal</span>
          <button className="nav-item" onClick={() => setShowLog(true)}><TimerReset size={18} /><span>Cycle log</span></button>
          <button className={activeNav === 'Care notes' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav('Care notes')}><Heart size={18} /><span>Care notes</span>{notes.length > 0 && <i>{notes.length}</i>}</button>
        </nav>
        <div className="sidebar-bottom">
          <button className={activeNav === 'Settings' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav('Settings')}><Settings2 size={18} /><span>Settings</span></button>
          <button className="help-pill" onClick={() => setShowHelp(true)}><CircleHelp size={16} /> Need a little help?</button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="mobile-brand">lunelle</div>
          <div className="crumb"><LayoutGrid size={16} /> Personal dashboard <ChevronRight size={14} /> <span>{activeNav}</span></div>
          <div className="top-actions" style={{ position: 'relative' }}>
            <button className="icon-button" aria-label="Search" onClick={() => setShowSearch(true)}><Search size={18} /></button>
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button className="icon-button notification" aria-label="Notifications" onClick={() => setShowNotifs((v) => !v)}>
                <Bell size={18} />{notifications.length > 0 && <i />}
              </button>
              {showNotifs && (
                <div className="notif-panel">
                  <h4>Notifications</h4>
                  {notifications.length === 0 && <p className="notif-empty">You&apos;re all caught up.</p>}
                  {notifications.map((n, i) => (
                    <div className="notif-item" key={i}>
                      <span className="dot-icon" />
                      <div><b>{n.title}</b><small>{n.body}</small></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button className="theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}<span>{dark ? 'Light' : 'Dark'}</span></button>
            <button className="avatar small" onClick={() => setActiveNav('Settings')} aria-label="Open settings" style={{ border: 0, cursor: 'pointer' }}>{settings.name_a?.[0] ?? 'A'}</button>
          </div>
        </header>

        <div className="content">{renderPage()}</div>
      </div>

      <MushroomPet onMoodChange={setMood} />
      <CustomCursor />

      {toast && (
        <div className="toast">
          <span className="toast-check"><Check size={16} /></span>
          <div><b>{toast.title}</b><small>{toast.body}</small></div>
          <button onClick={() => setToast(null)}><X size={16} /></button>
        </div>
      )}
      {showLog && (
        <div className="modal-backdrop" onClick={() => { setShowLog(false); setAddingCycle(false) }}>
          <div className="log-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => { setShowLog(false); setAddingCycle(false) }}><X size={18} /></button>
            <p className="eyebrow pink">Your story so far</p>
            <h2>Cycle log</h2>
            <p className="lede">A soft, private timeline of your recent rhythms.</p>
            {cycles.length === 0 && <p className="empty-state">No cycles logged yet.</p>}
            {cycles.slice(0, 6).map((cycle) => (
              <div className="log-item" key={cycle.id}>
                <span>{new Date(cycle.start_date).toLocaleDateString(undefined, { month: 'short', day: '2-digit' })}</span>
                <div><b>Period started</b><small>{cycle.length} days \u00b7 {cycle.flow.toLowerCase()} flow</small></div>
                <span className="log-badge">Complete</span>
                <button className="delete-btn" aria-label="Delete" onClick={() => removeCycle(cycle.id)}><Trash2 size={14} /></button>
              </div>
            ))}
            {addingCycle ? (
              <form className="field-group" onSubmit={addPastCycle}>
                <input className="text-input" type="date" required value={quickDate} onChange={(e) => setQuickDate(e.target.value)} />
                <button type="submit" className="primary-button full"><Plus size={18} /> Save cycle</button>
              </form>
            ) : (
              <button className="primary-button full" onClick={() => setAddingCycle(true)}><Plus size={18} /> Add past cycle</button>
            )}
          </div>
        </div>
      )}
      {showSearch && (
        <div className="search-overlay" onClick={() => { setShowSearch(false); setQuery('') }}>
          <div className="search-box" onClick={(e) => e.stopPropagation()}>
            <input
              autoFocus
              placeholder={'Search cycles, supplies, notes\u2026'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query.trim() && (
              <div className="search-results">
                {searchResults.length === 0 && <div className="search-empty">No matches for &quot;{query}&quot;</div>}
                {searchResults.map((r, i) => (
                  <button key={i} className="search-result" onClick={() => { setActiveNav(r.nav); setShowSearch(false); setQuery('') }}>
                    <Search size={14} />
                    <div><span>{r.label}</span><small>{r.sub}</small></div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {showHelp && (
        <div className="modal-backdrop" onClick={() => setShowHelp(false)}>
          <div className="log-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowHelp(false)}><X size={18} /></button>
            <p className="eyebrow pink">A little help</p>
            <h2>How Lunelle works</h2>
            <p className="lede" style={{ marginBottom: 16 }}>Everything you log here syncs live between you and {settings.name_b || 'your partner'}, no accounts, just a shared space.</p>
            <div className="log-item"><div><b>Log today</b><small>Adds a period start on the Overview page.</small></div></div>
            <div className="log-item"><div><b>My cycles</b><small>See and edit your full cycle history.</small></div></div>
            <div className="log-item"><div><b>Supplies & Care notes</b><small>A shared checklist and message board for you two.</small></div></div>
            <div className="log-item"><div><b>Settings</b><small>Change your names and default cycle assumptions.</small></div></div>
          </div>
        </div>
      )}
    </main>
  )
}
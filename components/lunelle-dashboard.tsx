'use client'

import { useMemo, useState } from 'react'
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
  Moon,
  MoreHorizontal,
  PawPrint,
  Plus,
  Search,
  Settings2,
  Sun,
  TimerReset,
  X,
} from 'lucide-react'
import { MushroomPet } from '@/components/lunelle-shared'
import { OverviewPage } from '@/components/pages/overview-page'
import { MyCyclesPage } from '@/components/pages/my-cycles-page'
import { InsightsPage } from '@/components/pages/insights-page'
import { SuppliesPage } from '@/components/pages/supplies-page'
import { CareNotesPage } from '@/components/pages/care-notes-page'
import { SettingsPage } from '@/components/pages/settings-page'

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
  const [toast, setToast] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [periodLogged, setPeriodLogged] = useState(false)

  const greeting = useMemo(() => (activeNav === 'Overview' ? 'Good morning, A.' : activeNav), [activeNav])

  const logPeriod = () => {
    setPeriodLogged(true)
    setToast(true)
    window.setTimeout(() => setToast(false), 2600)
  }

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
        return <OverviewPage greeting={greeting} mood={mood} setMood={setMood} logPeriod={logPeriod} />
    }
  }

  return (
    <main className={dark ? 'lunelle dark-mode' : 'lunelle'}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <aside className="sidebar">
        <div className="brand-mark"><span className="brand-orb">✳</span><span>lunelle</span></div>
        <div className="profile-mini"><div className="avatar">A</div><div><strong>A & J</strong><span>Our little space</span></div><MoreHorizontal size={17} /></div>
        <nav aria-label="Main navigation">
          <span className="nav-label">Workspace</span>
          {navItems.map(({ label, icon: Icon }) => (
            <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label)}>
              <Icon size={18} /><span>{label}</span>{label === 'Insights' && <i>2</i>}
            </button>
          ))}
          <span className="nav-label later">Personal</span>
          <button className="nav-item" onClick={() => setShowLog(true)}><TimerReset size={18} /><span>Cycle log</span></button>
          <button className={activeNav === 'Care notes' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav('Care notes')}><Heart size={18} /><span>Care notes</span></button>
        </nav>
        <div className="sidebar-bottom">
          <button className={activeNav === 'Settings' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav('Settings')}><Settings2 size={18} /><span>Settings</span></button>
          <button className="help-pill"><CircleHelp size={16} /> Need a little help?</button>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="mobile-brand">lunelle</div>
          <div className="crumb"><LayoutGrid size={16} /> Personal dashboard <ChevronRight size={14} /> <span>{activeNav}</span></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search"><Search size={18} /></button>
            <button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>
            <button className="theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}<span>{dark ? 'Light' : 'Dark'}</span></button>
            <div className="avatar small">A</div>
          </div>
        </header>

        <div className="content">{renderPage()}</div>
      </div>

      <MushroomPet onMoodChange={setMood} />
      <div className="cursor-dot" />
      {toast && (
        <div className="toast">
          <span className="toast-check"><Check size={16} /></span>
          <div><b>Logged with love</b><small>Your cycle note is saved for today.</small></div>
          <button onClick={() => setToast(false)}><X size={16} /></button>
        </div>
      )}
      {showLog && (
        <div className="modal-backdrop" onClick={() => setShowLog(false)}>
          <div className="log-modal" onClick={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowLog(false)}><X size={18} /></button>
            <p className="eyebrow pink">Your story so far</p>
            <h2>Cycle log</h2>
            <p className="lede">A soft, private timeline of your recent rhythms.</p>
            <div className="log-item"><span>02 Sep</span><div><b>Period started</b><small>5 days · medium flow</small></div><span className="log-badge">Complete</span></div>
            <div className="log-item"><span>05 Aug</span><div><b>Period started</b><small>4 days · light flow</small></div><span className="log-badge">Complete</span></div>
            <button className="primary-button full" onClick={() => { setShowLog(false); setPeriodLogged(true) }}><Plus size={18} /> Add past cycle</button>
          </div>
        </div>
      )}
    </main>
  )
}
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ChevronRight,
  CircleHelp,
  Droplets,
  Heart,
  Home,
  LayoutGrid,
  Moon,
  MoreHorizontal,
  PawPrint,
  Plus,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Target,
  TimerReset,
  UserRound,
  X,
  Zap,
} from 'lucide-react'

const mascotSrc = '/mushroom.png'

const calendarDays = Array.from({ length: 35 }, (_, index) => {
  const day = index - 1
  return { day: day <= 0 ? 30 + day : day, active: day >= 6 && day <= 10, today: day === 4 }
})

const navItems = [
  { label: 'Overview', icon: Home },
  { label: 'My cycles', icon: CalendarDays },
  { label: 'Insights', icon: Activity },
  { label: 'Supplies', icon: PawPrint },
]

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`glass-card ${className}`}>{children}</section>
}

function MushroomPet({ onMoodChange }: { onMoodChange: (mood: string) => void }) {
  const petRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 75, y: 75 })
  const [dragging, setDragging] = useState(false)
  const [jumping, setJumping] = useState(false)
  const [mood, setMood] = useState('happy')
  const [eyes, setEyes] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      const node = petRef.current
      if (!node || dragging) return
      const rect = node.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.max(Math.hypot(dx, dy), 1)
      setEyes({ x: Math.max(-3, Math.min(3, (dx / distance) * 3)), y: Math.max(-2, Math.min(2, (dy / distance) * 2)) })
    }
    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [dragging])

  const pet = () => {
    setMood('loved')
    setJumping(true)
    onMoodChange('Mushroom is feeling very loved')
    window.setTimeout(() => setJumping(false), 700)
  }

  const dragStart = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
    setMood('held')
    onMoodChange('Pick me up!')
  }

  const dragMove = (event: React.PointerEvent) => {
    if (!dragging) return
    const x = Math.max(8, Math.min(87, (event.clientX / window.innerWidth) * 100 - 7))
    const y = Math.max(8, Math.min(84, (event.clientY / window.innerHeight) * 100 - 8))
    setPosition({ x, y })
  }

  const dragEnd = () => {
    setDragging(false)
    setMood('landed')
    setJumping(true)
    onMoodChange('That was a soft landing')
    window.setTimeout(() => setJumping(false), 600)
  }

  return (
    <div
      ref={petRef}
      className={`mushroom-pet ${dragging ? 'is-held' : ''} ${jumping ? 'is-jumping' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onPointerDown={dragStart}
      onPointerMove={dragMove}
      onPointerUp={dragEnd}
      onDoubleClick={pet}
      role="button"
      tabIndex={0}
      aria-label="Mushroom the penguin. Double click to pet, drag to move."
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') pet() }}
    >
      <div className="pet-bubble">{mood === 'held' ? 'wheee' : mood === 'loved' ? '♡' : 'hi!'}</div>
      <div className="pet-shadow" />
      <div className="pet-sprite">
        <div className="pet-eye left" style={{ transform: `translate(${eyes.x}px, ${eyes.y}px)` }} />
        <div className="pet-eye right" style={{ transform: `translate(${eyes.x}px, ${eyes.y}px)` }} />
        <img src={mascotSrc} alt="Mushroom, the cheerful blue penguin" />
      </div>
      <div className="pet-tag"><PawPrint size={12} /> Mushroom</div>
    </div>
  )
}

export function LunelleDashboard() {
  const [activeNav, setActiveNav] = useState('Overview')
  const [dark, setDark] = useState(false)
  const [mood, setMood] = useState('Double click Mushroom to give him a little love')
  const [toast, setToast] = useState(false)
  const [showLog, setShowLog] = useState(false)
  const [periodLogged, setPeriodLogged] = useState(false)

  const greeting = useMemo(() => activeNav === 'Overview' ? 'Good morning, A.' : activeNav, [activeNav])

  const logPeriod = () => {
    setPeriodLogged(true)
    setToast(true)
    window.setTimeout(() => setToast(false), 2600)
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
          {navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? 'nav-item active' : 'nav-item'} onClick={() => setActiveNav(label)}><Icon size={18} /><span>{label}</span>{label === 'Insights' && <i>2</i>}</button>)}
          <span className="nav-label later">Personal</span>
          <button className="nav-item" onClick={() => setShowLog(true)}><TimerReset size={18} /><span>Cycle log</span></button>
          <button className="nav-item"><Heart size={18} /><span>Care notes</span></button>
        </nav>
        <div className="sidebar-bottom"><button className="nav-item"><Settings2 size={18} /><span>Settings</span></button><button className="help-pill"><CircleHelp size={16} /> Need a little help?</button></div>
      </aside>

      <div className="main-shell">
        <header className="topbar"><div className="mobile-brand">lunelle</div><div className="crumb"><LayoutGrid size={16} /> Personal dashboard <ChevronRight size={14} /> <span>{activeNav}</span></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={18} /></button><button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button><button className="theme-button" onClick={() => setDark(!dark)} aria-label="Toggle theme">{dark ? <Sun size={16} /> : <Moon size={16} />}<span>{dark ? 'Light' : 'Dark'}</span></button><div className="avatar small">A</div></div></header>

        <div className="content">
          <div className="welcome-row"><div><p className="eyebrow"><Sparkles size={14} /> Tuesday, 24 September</p><h1>{greeting}<span>.</span></h1><p className="lede">Here&apos;s the gentle overview of your cycle and how you&apos;re feeling.</p></div><button className="primary-button" onClick={logPeriod}><Plus size={18} /> Log today</button></div>

          <div className="dashboard-grid">
            <GlassCard className="cycle-hero"><div className="card-topline"><div><p className="eyebrow pink">Your cycle</p><h2>Day 18 <small>of 28</small></h2></div><div className="status-chip"><span /> On track</div></div><div className="cycle-ring"><div className="ring-center"><span>10</span><small>days to go</small></div></div><div className="cycle-meta"><div><span>Last period</span><strong>Sep 02 — 06</strong></div><div><span>Expected next</span><strong>Sep 30 — Oct 04</strong></div></div><div className="progress-track"><span style={{ width: '64%' }} /></div><p className="micro-copy">You&apos;re in your <b>luteal phase</b> · energy may feel softer today.</p></GlassCard>

            <GlassCard className="mood-card"><div className="card-heading"><div><p className="eyebrow">How are you?</p><h3>A tiny check-in</h3></div><button className="more-button"><MoreHorizontal size={18} /></button></div><div className="mood-options"><button className="mood active" onClick={() => setMood('You are feeling calm today')}><span>☁</span><small>Calm</small></button><button className="mood" onClick={() => setMood('Sending you extra energy')}><span>✦</span><small>Good</small></button><button className="mood" onClick={() => setMood('Soft days are valid too')}><span>◌</span><small>Low</small></button><button className="mood" onClick={() => setMood('Let us take it easy')}><span>⌁</span><small>Tender</small></button></div><div className="mood-note"><Heart size={15} fill="currentColor" /> {mood}</div></GlassCard>

            <GlassCard className="symptoms-card"><div className="card-heading"><div><p className="eyebrow">This month</p><h3>Body signals</h3></div><button className="more-button"><MoreHorizontal size={18} /></button></div><div className="signal-list"><div><span className="signal-icon blush"><Droplets size={16} /></span><span><b>Flow</b><small>Light · day 2</small></span><strong>↗</strong></div><div><span className="signal-icon yellow"><Zap size={16} /></span><span><b>Energy</b><small>Steady & bright</small></span><strong>↗</strong></div><div><span className="signal-icon lilac"><Target size={16} /></span><span><b>Symptoms</b><small>2 gentle notes</small></span><strong>→</strong></div></div></GlassCard>

            <GlassCard className="calendar-card"><div className="card-heading"><div><p className="eyebrow">September 2024</p><h3>Your rhythm</h3></div><div className="calendar-actions"><button className="round-arrow">‹</button><button className="round-arrow">›</button></div></div><div className="weekdays">{['M','T','W','T','F','S','S'].map((day, i) => <span key={`${day}-${i}`}>{day}</span>)}</div><div className="calendar-grid">{calendarDays.map((item, index) => <div key={index} className={`calendar-day ${item.active ? 'period-day' : ''} ${item.today ? 'today' : ''} ${item.day > 30 ? 'muted-day' : ''}`}>{item.day}</div>)}</div><div className="calendar-legend"><span><i className="dot pink-dot" /> Period days</span><span><i className="dot outline-dot" /> Today</span></div></GlassCard>

            <GlassCard className="insight-card"><div className="insight-art"><div className="mini-mushroom">🍄</div><div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="line-art" /></div><div className="insight-copy"><p className="eyebrow">Lunelle note</p><h3>Your body is asking for a softer pace.</h3><p>Make room for comfort this week. A warm drink, an early night, and no guilt attached.</p><button className="text-button">Read more <ChevronRight size={15} /></button></div></GlassCard>
          </div>
        </div>
      </div>

      <MushroomPet onMoodChange={setMood} />
      <div className="cursor-dot" />
      {toast && <div className="toast"><span className="toast-check"><Check size={16} /></span><div><b>Logged with love</b><small>Your cycle note is saved for today.</small></div><button onClick={() => setToast(false)}><X size={16} /></button></div>}
      {showLog && <div className="modal-backdrop" onClick={() => setShowLog(false)}><div className="log-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setShowLog(false)}><X size={18} /></button><p className="eyebrow pink">Your story so far</p><h2>Cycle log</h2><p className="lede">A soft, private timeline of your recent rhythms.</p><div className="log-item"><span>02 Sep</span><div><b>Period started</b><small>5 days · medium flow</small></div><span className="log-badge">Complete</span></div><div className="log-item"><span>05 Aug</span><div><b>Period started</b><small>4 days · light flow</small></div><span className="log-badge">Complete</span></div><button className="primary-button full" onClick={() => { setShowLog(false); setPeriodLogged(true) }}><Plus size={18} /> Add past cycle</button></div></div>}
    </main>
  )
}

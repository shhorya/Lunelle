'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronRight, Droplets, Heart, MoreHorizontal, Plus, Sparkles, Target, Zap } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useCheckins } from '@/lib/use-checkins'
import { useCycles } from '@/lib/use-cycles'
import { buildCalendarDays, phaseCopy, type computeCycleStats } from '@/lib/cycle-math'

type Stats = ReturnType<typeof computeCycleStats>

const moods = [
  { key: 'calm', icon: '\u2601', label: 'Calm', line: 'You are feeling calm today' },
  { key: 'good', icon: '\u2726', label: 'Good', line: 'Sending you extra energy' },
  { key: 'low', icon: '\u25cc', label: 'Low', line: 'Soft days are valid too' },
  { key: 'tender', icon: '\u2301', label: 'Tender', line: 'Let us take it easy' },
]

export function OverviewPage({
  greeting,
  mood,
  setMood,
  logPeriod,
  stats,
}: {
  greeting: string
  mood: string
  setMood: (m: string) => void
  logPeriod: () => void
  stats: Stats
}) {
  const { addCheckin, latest } = useCheckins()
  const { cycles, addCycle } = useCycles()
  const [activeMoodKey, setActiveMoodKey] = useState(latest?.mood ?? 'calm')
  const [month, setMonth] = useState(() => new Date())
  const [showMoreMenu, setShowMoreMenu] = useState<'mood' | 'symptoms' | null>(null)
  const [expandedInsight, setExpandedInsight] = useState(false)
  const [justLogged, setJustLogged] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  function logDay(date: Date) {
    const iso = date.toISOString().slice(0, 10)
    addCycle({ startDate: iso, length: stats.cycleLength, flow: 'Medium', notes: '' })
    setJustLogged(iso)
    window.setTimeout(() => setJustLogged(null), 2000)
  }

  const [todayLabel, setTodayLabel] = useState('')
  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' }))
  }, [])

  function pickMood(m: (typeof moods)[number]) {
    setActiveMoodKey(m.key)
    setMood(m.line)
    addCheckin(m.key, m.line)
  }

  const calendarDays = useMemo(() => buildCalendarDays(stats.latestStart, 5, month), [stats.latestStart, month])
  const weekdayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  const monthLabel = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })

  const phaseSentence = stats.hasData
    ? phaseCopy(stats.phase)
    : 'Log your first cycle to start seeing personalized phase insights here.'

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> {todayLabel}</p>
          <h1>{greeting}<span>.</span></h1>
          <p className="lede">Here&apos;s the gentle overview of your cycle and how you&apos;re feeling.</p>
        </div>
        <button className="primary-button" onClick={logPeriod}><Plus size={18} /> Log today</button>
      </div>

      <div className="dashboard-grid">
        <GlassCard className="cycle-hero">
          <div className="card-topline">
            <div><p className="eyebrow pink">Your cycle</p><h2>Day {stats.hasData ? stats.dayOfCycle : '\u2014'} <small>of {stats.cycleLength}</small></h2></div>
            <div className="status-chip"><span /> {stats.hasData ? 'On track' : 'No data yet'}</div>
          </div>
          <div className="cycle-ring"><div className="ring-center"><span>{stats.hasData ? stats.daysToGo : '\u2014'}</span><small>days to go</small></div></div>
          <div className="cycle-meta">
            <div><span>Last period</span><strong>{stats.lastPeriodLabel}</strong></div>
            <div><span>Expected next</span><strong>{stats.nextPeriodLabel}</strong></div>
          </div>
          <div className="progress-track"><span style={{ width: `${stats.progressPct}%` }} /></div>
          <p className="micro-copy">{phaseSentence}</p>
        </GlassCard>

        <GlassCard className="mood-card">
          <div className="card-heading">
            <div><p className="eyebrow">How are you?</p><h3>A tiny check-in</h3></div>
            <div ref={menuRef} style={{ position: 'relative' }}>
              <button className="more-button" onClick={() => setShowMoreMenu(showMoreMenu === 'mood' ? null : 'mood')}><MoreHorizontal size={18} /></button>
              {showMoreMenu === 'mood' && (
                <div className="dropdown-menu">
                  <button onClick={() => setShowMoreMenu(null)}>View mood history</button>
                  <button onClick={() => { setActiveMoodKey('calm'); setMood('Double click Mushroom to give him a little love'); setShowMoreMenu(null) }}>Reset check-in</button>
                </div>
              )}
            </div>
          </div>
          <div className="mood-options">
            {moods.map((m) => (
              <button key={m.key} className={activeMoodKey === m.key ? 'mood active' : 'mood'} onClick={() => pickMood(m)}>
                <span>{m.icon}</span><small>{m.label}</small>
              </button>
            ))}
          </div>
          <div className="mood-note"><Heart size={15} fill="currentColor" /> {mood}</div>
        </GlassCard>

        <GlassCard className="symptoms-card">
          <div className="card-heading">
            <div><p className="eyebrow">This month</p><h3>Body signals</h3></div>
            <div style={{ position: 'relative' }}>
              <button className="more-button" onClick={() => setShowMoreMenu(showMoreMenu === 'symptoms' ? null : 'symptoms')}><MoreHorizontal size={18} /></button>
              {showMoreMenu === 'symptoms' && (
                <div className="dropdown-menu">
                  <button onClick={() => setShowMoreMenu(null)}>Log a symptom</button>
                  <button onClick={() => setShowMoreMenu(null)}>View history</button>
                </div>
              )}
            </div>
          </div>
          <div className="signal-list">
            <div><span className="signal-icon blush"><Droplets size={16} /></span><span><b>Flow</b><small>{stats.hasData ? `Day ${stats.dayOfCycle} of cycle` : 'No data yet'}</small></span><strong>{stats.hasData ? '\u2197' : '\u2013'}</strong></div>
            <div><span className="signal-icon yellow"><Zap size={16} /></span><span><b>Energy</b><small>{stats.phase === 'menstrual' ? 'Take it slow' : 'Steady & bright'}</small></span><strong>{stats.phase === 'menstrual' ? '\u2193' : '\u2197'}</strong></div>
            <div><span className="signal-icon lilac"><Target size={16} /></span><span><b>Cycles logged</b><small>{cycles.length} total</small></span><strong>{'\u2192'}</strong></div>
          </div>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading">
            <div><p className="eyebrow">{monthLabel}</p><h3>Your rhythm</h3></div>
            <div className="calendar-actions">
              <button className="round-arrow" aria-label="Previous month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>{'\u2039'}</button>
              <button className="round-arrow" aria-label="Next month" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>{'\u203a'}</button>
            </div>
          </div>
          <div className="weekdays">{weekdayLabels.map((day, i) => <span key={`${day}-${i}`}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarDays.map((item, index) => (
              <button
                key={index}
                type="button"
                className={`calendar-day ${item.isPeriod ? 'period-day' : ''} ${item.isToday ? 'today' : ''} ${!item.inMonth ? 'muted-day' : ''}`}
                title={justLogged === item.date.toISOString().slice(0, 10) ? 'Logged!' : `${item.date.toDateString()} \u2014 click to log a period start here`}
                onClick={() => logDay(item.date)}
              >
                {item.day}
              </button>
            ))}
          </div>
          <div className="calendar-legend"><span><i className="dot pink-dot" /> Period days</span><span><i className="dot outline-dot" /> Today</span></div>
        </GlassCard>

        <GlassCard className="insight-card">
          <div className="insight-art"><div className="mini-mushroom">🍄</div><div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="line-art" /></div>
          <div className="insight-copy">
            <p className="eyebrow">Lunelle note</p>
            <h3>{stats.hasData ? phaseSentence : 'Start logging to unlock your insights.'}</h3>
            {!expandedInsight ? (
              <>
                <p>Make room for comfort this week. A warm drink, an early night, and no guilt attached.</p>
                <button className="text-button" onClick={() => setExpandedInsight(true)}>Read more <ChevronRight size={15} /></button>
              </>
            ) : (
              <>
                <p>Make room for comfort this week. A warm drink, an early night, and no guilt attached.</p>
                <p className="insight-extra">Your energy naturally ebbs and flows across the month. Tracking consistently for a few cycles will make these notes sharper and more personal to you.</p>
                <button className="text-button" onClick={() => setExpandedInsight(false)}>Show less <ChevronRight size={15} style={{ transform: 'rotate(90deg)' }} /></button>
              </>
            )}
          </div>
        </GlassCard>
      </div>
    </>
  )
}
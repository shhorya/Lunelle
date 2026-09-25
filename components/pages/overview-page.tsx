'use client'

import { ChevronRight, Droplets, Heart, MoreHorizontal, Plus, Sparkles, Target, Zap } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'

const calendarDays = Array.from({ length: 35 }, (_, index) => {
  const day = index - 1
  return { day: day <= 0 ? 30 + day : day, active: day >= 6 && day <= 10, today: day === 4 }
})

export function OverviewPage({
  greeting,
  mood,
  setMood,
  logPeriod,
}: {
  greeting: string
  mood: string
  setMood: (m: string) => void
  logPeriod: () => void
}) {
  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow"><Sparkles size={14} /> Tuesday, 24 September</p>
          <h1>{greeting}<span>.</span></h1>
          <p className="lede">Here&apos;s the gentle overview of your cycle and how you&apos;re feeling.</p>
        </div>
        <button className="primary-button" onClick={logPeriod}><Plus size={18} /> Log today</button>
      </div>

      <div className="dashboard-grid">
        <GlassCard className="cycle-hero">
          <div className="card-topline">
            <div><p className="eyebrow pink">Your cycle</p><h2>Day 18 <small>of 28</small></h2></div>
            <div className="status-chip"><span /> On track</div>
          </div>
          <div className="cycle-ring"><div className="ring-center"><span>10</span><small>days to go</small></div></div>
          <div className="cycle-meta">
            <div><span>Last period</span><strong>Sep 02 — 06</strong></div>
            <div><span>Expected next</span><strong>Sep 30 — Oct 04</strong></div>
          </div>
          <div className="progress-track"><span style={{ width: '64%' }} /></div>
          <p className="micro-copy">You&apos;re in your <b>luteal phase</b> · energy may feel softer today.</p>
        </GlassCard>

        <GlassCard className="mood-card">
          <div className="card-heading">
            <div><p className="eyebrow">How are you?</p><h3>A tiny check-in</h3></div>
            <button className="more-button"><MoreHorizontal size={18} /></button>
          </div>
          <div className="mood-options">
            <button className="mood active" onClick={() => setMood('You are feeling calm today')}><span>☁</span><small>Calm</small></button>
            <button className="mood" onClick={() => setMood('Sending you extra energy')}><span>✦</span><small>Good</small></button>
            <button className="mood" onClick={() => setMood('Soft days are valid too')}><span>◌</span><small>Low</small></button>
            <button className="mood" onClick={() => setMood('Let us take it easy')}><span>⌁</span><small>Tender</small></button>
          </div>
          <div className="mood-note"><Heart size={15} fill="currentColor" /> {mood}</div>
        </GlassCard>

        <GlassCard className="symptoms-card">
          <div className="card-heading">
            <div><p className="eyebrow">This month</p><h3>Body signals</h3></div>
            <button className="more-button"><MoreHorizontal size={18} /></button>
          </div>
          <div className="signal-list">
            <div><span className="signal-icon blush"><Droplets size={16} /></span><span><b>Flow</b><small>Light · day 2</small></span><strong>↗</strong></div>
            <div><span className="signal-icon yellow"><Zap size={16} /></span><span><b>Energy</b><small>Steady & bright</small></span><strong>↗</strong></div>
            <div><span className="signal-icon lilac"><Target size={16} /></span><span><b>Symptoms</b><small>2 gentle notes</small></span><strong>→</strong></div>
          </div>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading">
            <div><p className="eyebrow">September 2024</p><h3>Your rhythm</h3></div>
            <div className="calendar-actions"><button className="round-arrow">‹</button><button className="round-arrow">›</button></div>
          </div>
          <div className="weekdays">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => <span key={`${day}-${i}`}>{day}</span>)}</div>
          <div className="calendar-grid">
            {calendarDays.map((item, index) => (
              <div key={index} className={`calendar-day ${item.active ? 'period-day' : ''} ${item.today ? 'today' : ''} ${item.day > 30 ? 'muted-day' : ''}`}>{item.day}</div>
            ))}
          </div>
          <div className="calendar-legend"><span><i className="dot pink-dot" /> Period days</span><span><i className="dot outline-dot" /> Today</span></div>
        </GlassCard>

        <GlassCard className="insight-card">
          <div className="insight-art"><div className="mini-mushroom">🍄</div><div className="sparkle s1">✦</div><div className="sparkle s2">✧</div><div className="line-art" /></div>
          <div className="insight-copy">
            <p className="eyebrow">Lunelle note</p>
            <h3>Your body is asking for a softer pace.</h3>
            <p>Make room for comfort this week. A warm drink, an early night, and no guilt attached.</p>
            <button className="text-button">Read more <ChevronRight size={15} /></button>
          </div>
        </GlassCard>
      </div>
    </>
  )
}
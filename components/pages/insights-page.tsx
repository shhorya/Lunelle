'use client'

import { Activity } from 'lucide-react'
import { GlassCard } from '@/components/lunelle-shared'
import { useCycles } from '@/lib/use-cycles'

export function InsightsPage() {
  const { cycles, loading } = useCycles()

  const lengths = cycles.map((c) => c.length)
  const avgLength = lengths.length ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length) : 0
  const shortest = lengths.length ? Math.min(...lengths) : 0
  const longest = lengths.length ? Math.max(...lengths) : 0
  const recent = [...cycles].sort((a, b) => (a.start_date < b.start_date ? 1 : -1)).slice(0, 6).reverse()
  const maxBar = Math.max(...recent.map((c) => c.length), 1)
  const painValues = cycles.map((c) => c.pain_level).filter((p): p is number => p != null)
  const avgPain = painValues.length ? Math.round((painValues.reduce((a, b) => a + b, 0) / painValues.length) * 10) / 10 : 0
  const worstPain = painValues.length ? Math.max(...painValues) : 0

  return (
    <>
      <div className="welcome-row">
        <div>
          <p className="eyebrow pink"><Activity size={14} /> Insights</p>
          <h1>Patterns & trends<span>.</span></h1>
          <p className="lede">{loading ? 'Loading\u2026' : 'A quick look at what your logged cycles show so far.'}</p>
        </div>
      </div>

      <div className="dashboard-grid">
        <GlassCard>
          <div className="stat-grid">
            <div className="stat-box"><span>Average length</span><strong>{avgLength ? `${avgLength} days` : '—'}</strong></div>
            <div className="stat-box"><span>Shortest</span><strong>{shortest ? `${shortest} days` : '—'}</strong></div>
            <div className="stat-box"><span>Longest</span><strong>{longest ? `${longest} days` : '—'}</strong></div>
          </div>
        </GlassCard>

        <GlassCard>
          <div className="stat-grid">
            <div className="stat-box"><span>Avg pain level</span><strong>{painValues.length ? `${avgPain}/10` : '—'}</strong></div>
            <div className="stat-box"><span>Worst logged</span><strong>{painValues.length ? `${worstPain}/10` : '—'}</strong></div>
            <div className="stat-box"><span>Entries logged</span><strong>{painValues.length}</strong></div>
          </div>
        </GlassCard>

        <GlassCard className="calendar-card">
          <div className="card-heading"><div><p className="eyebrow">Recent cycles</p><h3>Length over time</h3></div></div>
          {!loading && recent.length === 0 && <p className="empty-state">Log a few cycles on the &quot;My cycles&quot; page and your trend will show up here.</p>}
          {recent.length > 0 && (
            <div className="bar-chart">
              {recent.map((c) => (
                <div className="bar" key={c.id} style={{ height: `${(c.length / maxBar) * 100}%` }} title={`${c.length} days`}>
                  <span>{c.length}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </>
  )
}
import type { CycleRow } from '@/lib/supabase'

export function daysBetween(a: Date, b: Date) {
  const ms = b.setHours(0, 0, 0, 0) - a.setHours(0, 0, 0, 0)
  return Math.round(ms / 86400000)
}

export function phaseForDay(day: number, cycleLength: number, periodLength: number) {
  if (day <= periodLength) return 'menstrual'
  if (day <= Math.round(cycleLength / 2) - 2) return 'follicular'
  if (day <= Math.round(cycleLength / 2) + 2) return 'ovulation'
  return 'luteal'
}

export function phaseCopy(phase: string) {
  switch (phase) {
    case 'menstrual':
      return 'Your body is asking for a softer pace this week.'
    case 'follicular':
      return 'Energy tends to build now — a good window for new plans.'
    case 'ovulation':
      return "You're near your fertile window — energy often peaks here."
    default:
      return 'You\u2019re in your luteal phase \u00b7 energy may feel softer today.'
  }
}

export function computeCycleStats(cycles: CycleRow[], defaultCycleLength: number, defaultPeriodLength: number) {
  const sorted = [...cycles].sort((a, b) => (a.start_date < b.start_date ? 1 : -1))
  const latest = sorted[0]

  const lengths = sorted.map((c) => c.length).filter(Boolean)
  const avgCycleLength = lengths.length
    ? Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
    : defaultCycleLength

  if (!latest) {
    return {
      hasData: false,
      dayOfCycle: 0,
      cycleLength: defaultCycleLength,
      daysToGo: defaultCycleLength,
      progressPct: 0,
      phase: 'unknown',
      lastPeriodLabel: 'No cycles logged yet',
      nextPeriodLabel: 'Log a cycle to get a prediction',
      avgCycleLength,
    }
  }

  const start = new Date(latest.start_date)
  const today = new Date()
  const dayOfCycle = Math.max(1, daysBetween(new Date(start), new Date(today)) + 1)
  const cycleLength = avgCycleLength
  const daysToGo = Math.max(0, cycleLength - dayOfCycle)
  const progressPct = Math.min(100, Math.round((dayOfCycle / cycleLength) * 100))
  const phase = phaseForDay(dayOfCycle, cycleLength, latest.length ? Math.min(latest.length, defaultPeriodLength) : defaultPeriodLength)

  const periodEnd = new Date(start)
  periodEnd.setDate(periodEnd.getDate() + defaultPeriodLength - 1)

  const nextStart = new Date(start)
  nextStart.setDate(nextStart.getDate() + cycleLength)
  const nextEnd = new Date(nextStart)
  nextEnd.setDate(nextEnd.getDate() + defaultPeriodLength - 1)

  const fmt = (d: Date) => d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })

  return {
    hasData: true,
    dayOfCycle,
    cycleLength,
    daysToGo,
    progressPct,
    phase,
    lastPeriodLabel: `${fmt(start)} - ${fmt(periodEnd)}`,
    nextPeriodLabel: `${fmt(nextStart)} - ${fmt(nextEnd)}`,
    avgCycleLength,
    latestStart: start,
    nextStart,
  }
}

export function buildCalendarDays(latestStart: Date | undefined, periodLength: number, month: Date) {
  const year = month.getFullYear()
  const m = month.getMonth()
  const firstOfMonth = new Date(year, m, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const prevDaysInMonth = new Date(year, m, 0).getDate()

  const cells: { day: number; inMonth: boolean; date: Date }[] = []
  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ day: prevDaysInMonth - i, inMonth: false, date: new Date(year, m - 1, prevDaysInMonth - i) })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: new Date(year, m, d) })
  }
  while (cells.length % 7 !== 0) {
    const next = cells.length - (startOffset + daysInMonth) + 1
    cells.push({ day: next, inMonth: false, date: new Date(year, m + 1, next) })
  }

  const today = new Date()
  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString()

  return cells.map((cell) => {
    let isPeriod = false
    if (latestStart) {
      const diff = daysBetween(new Date(latestStart), new Date(cell.date))
      isPeriod = diff >= 0 && diff < periodLength
    }
    return { ...cell, isPeriod, isToday: isSameDay(cell.date, today) }
  })
}
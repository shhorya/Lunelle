'use client'

import { useEffect, useRef, useState } from 'react'
import { PawPrint } from 'lucide-react'

export const mascotSrc = '/mushroom.png'

export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`glass-card ${className}`}>{children}</section>
}

const idleLines = ['hii gappu!', 'momos khaaegi?','nice day, huh?', 'I love You!', 'hello mushroom ki mushroomi', 'cuddle me!', 'miss you already', 'just vibing here', 'pick me!', 'tap me!', 'aaann, college nhi jaana', 'hehe']
const consolingLines = [
  "it's okay to rest today",
  "wanna go on another mkt date?",
  "it's okay to cry",
  "cuddle me, i'm here for you",
  "you're doing great",
  'breathe. you got this',
  'sending you a big hug',
  "today doesn't have to be perfect",
  'proud of you, always',
]

type FloatingHeart = { id: number; x: number }

export function MushroomPet({ onMoodChange }: { onMoodChange: (mood: string) => void }) {
  const petRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 75, y: 75 })
  const [facing, setFacing] = useState(1)
  const [dragging, setDragging] = useState(false)
  const [jumping, setJumping] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [bubbleText, setBubbleText] = useState(idleLines[0])
  const [hearts, setHearts] = useState<FloatingHeart[]>([])
  const [eyes, setEyes] = useState({ x: 0, y: 0 })

  const dragStartPos = useRef<{ x: number; y: number } | null>(null)
  const movedRef = useRef(false)
  const heartId = useRef(0)
  const idleIndex = useRef(0)

  // reactive eyes
  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      const node = petRef.current
      if (!node || dragging) return
      const rect = node.getBoundingClientRect()
      const dx = event.clientX - (rect.left + rect.width / 2)
      const dy = event.clientY - (rect.top + rect.height * 0.3)
      const distance = Math.max(Math.hypot(dx, dy), 1)
      setEyes({ x: Math.max(-2, Math.min(2, (dx / distance) * 2)), y: Math.max(-1.6, Math.min(1.6, (dy / distance) * 1.6)) })
    }
    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [dragging])

  // idle bubble rotation
  useEffect(() => {
    const interval = window.setInterval(() => {
      if (dragging || hovered) return
      idleIndex.current = (idleIndex.current + 1) % idleLines.length
      setBubbleText(idleLines[idleIndex.current])
    }, 5000)
    return () => window.clearInterval(interval)
  }, [dragging, hovered])

  // hover shows a consoling line
  useEffect(() => {
    if (dragging) return
    if (hovered) {
      setBubbleText(consolingLines[Math.floor(Math.random() * consolingLines.length)])
    } else {
      setBubbleText(idleLines[idleIndex.current])
    }
  }, [hovered, dragging])

  // wandering
  useEffect(() => {
    let cancelled = false
    function wander() {
      if (cancelled || dragging) return
      setPosition((prev) => {
        const nextX = Math.max(8, Math.min(87, prev.x + (Math.random() * 40 - 20)))
        const nextY = Math.max(15, Math.min(84, prev.y + (Math.random() * 24 - 12)))
        setFacing(nextX >= prev.x ? 1 : -1)
        return { x: nextX, y: nextY }
      })
    }
    const interval = window.setInterval(wander, 4500 + Math.random() * 2000)
    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [dragging])

  function spawnHearts() {
    const fresh: FloatingHeart[] = [0, 1, 2].map((i) => ({ id: heartId.current++, x: (i - 1) * 16 }))
    setHearts((prev) => [...prev, ...fresh])
    fresh.forEach((h) => {
      window.setTimeout(() => setHearts((prev) => prev.filter((x) => x.id !== h.id)), 900)
    })
  }

  function pet() {
    setJumping(true)
    spawnHearts()
    onMoodChange('Mushroom is feeling very loved')
    setBubbleText('♡')
    window.setTimeout(() => setJumping(false), 700)
    window.setTimeout(() => { if (!hovered) setBubbleText(idleLines[idleIndex.current]) }, 1400)
  }

  const dragStart = (event: React.PointerEvent) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartPos.current = { x: event.clientX, y: event.clientY }
    movedRef.current = false
  }

  const dragMove = (event: React.PointerEvent) => {
    if (!dragStartPos.current) return
    const dx = event.clientX - dragStartPos.current.x
    const dy = event.clientY - dragStartPos.current.y
    if (!movedRef.current && Math.hypot(dx, dy) > 6) {
      movedRef.current = true
      setDragging(true)
      setBubbleText('wheee')
      onMoodChange('Pick me up!')
    }
    if (movedRef.current) {
      const x = Math.max(8, Math.min(87, (event.clientX / window.innerWidth) * 100 - 7))
      const y = Math.max(8, Math.min(84, (event.clientY / window.innerHeight) * 100 - 8))
      setPosition({ x, y })
    }
  }

  const dragEnd = () => {
    if (movedRef.current) {
      setDragging(false)
      setJumping(true)
      onMoodChange('That was a soft landing')
      setBubbleText('that tickled')
      window.setTimeout(() => setJumping(false), 600)
      window.setTimeout(() => { if (!hovered) setBubbleText(idleLines[idleIndex.current]) }, 1400)
    } else {
      pet()
    }
    dragStartPos.current = null
    movedRef.current = false
  }

  const pupilX = eyes.x * facing

  return (
    <div
      ref={petRef}
      className={`mushroom-pet ${dragging ? 'is-held' : ''} ${jumping ? 'is-jumping' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
      onPointerDown={dragStart}
      onPointerMove={dragMove}
      onPointerUp={dragEnd}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="Mushroom the penguin. Tap to pet, drag to move."
      onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') pet() }}
    >
      <div className="pet-bubble"><span className="pet-bubble-inner">{bubbleText}</span></div>
      <div className="pet-shadow" />
      <div className="pet-sprite">
        <div className="pet-flip" style={{ ['--face' as any]: facing }}>
          <div className="pet-eyes">
            <span className="pet-eye"><span className="eye-pupil" style={{ transform: `translate(${eyes.x}px, ${eyes.y}px)` }} /></span>
            <span className="pet-eye"><span className="eye-pupil" style={{ transform: `translate(${eyes.x}px, ${eyes.y}px)` }} /></span>
          </div>
          <img
            src={mascotSrc}
            alt="Mushroom, the cheerful blue penguin"
            draggable={false}
            onDragStart={(event) => event.preventDefault()}
          />
        </div>
      </div>
      <div className="pet-tag"><PawPrint size={12} /> Mushroom</div>
      {hearts.map((h) => (
        <span key={h.id} className="pet-float-heart" style={{ left: `calc(50% + ${h.x}px)` }}>♥</span>
      ))}
    </div>
  )
}
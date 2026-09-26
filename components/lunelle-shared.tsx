'use client'

import { useEffect, useRef, useState } from 'react'
import { PawPrint } from 'lucide-react'

export const mascotSrc = '/mushroom.png'

export function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <section className={`glass-card ${className}`}>{children}</section>
}

export function MushroomPet({ onMoodChange }: { onMoodChange: (mood: string) => void }) {
  const petRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 75, y: 75 })
  const [facing, setFacing] = useState(1) // 1 = facing right, -1 = facing left (mirrored)
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
      const dy = event.clientY - (rect.top + rect.height * 0.3)
      const distance = Math.max(Math.hypot(dx, dy), 1)
      setEyes({ x: Math.max(-2, Math.min(2, (dx / distance) * 2)), y: Math.max(-1.6, Math.min(1.6, (dy / distance) * 1.6)) })
    }
    window.addEventListener('pointermove', handlePointer)
    return () => window.removeEventListener('pointermove', handlePointer)
  }, [dragging])

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

  // counter the parent's scaleX(-1) mirror so pupils always point at the real cursor, not the mirrored one
  const pupilX = eyes.x * facing

  return (
    <div
      ref={petRef}
      className={`mushroom-pet ${dragging ? 'is-held' : ''} ${jumping ? 'is-jumping' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%`, ['--face' as any]: facing }}
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
        <div className="pet-eyes">
          <span className="pet-eye">
            <span className="eye-pupil" style={{ transform: `translate(${pupilX}px, ${eyes.y}px)` }} />
          </span>
          <span className="pet-eye">
            <span className="eye-pupil" style={{ transform: `translate(${pupilX}px, ${eyes.y}px)` }} />
          </span>
        </div>
        <img
          src={mascotSrc}
          alt="Mushroom, the cheerful blue penguin"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
        />
      </div>
      <div className="pet-tag"><PawPrint size={12} /> Mushroom</div>
    </div>
  )
}
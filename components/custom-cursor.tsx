'use client'

import { useEffect, useRef, useState } from 'react'

type TrailDot = { id: number; x: number; y: number }

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [trail, setTrail] = useState<TrailDot[]>([])
  const [visible, setVisible] = useState(false)
  const trailId = useRef(0)
  const lastSpawn = useRef(0)

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      if (event.pointerType !== 'mouse') return
      setVisible(true)
      const { clientX: x, clientY: y } = event
      if (dotRef.current) dotRef.current.style.transform = `translate(${x}px, ${y}px)`
      if (ringRef.current) ringRef.current.style.transform = `translate(${x}px, ${y}px)`

      const now = performance.now()
      if (now - lastSpawn.current > 60) {
        lastSpawn.current = now
        trailId.current += 1
        const id = trailId.current
        setTrail((prev) => [...prev.slice(-9), { id, x, y }])
        window.setTimeout(() => {
          setTrail((prev) => prev.filter((dot) => dot.id !== id))
        }, 550)
      }
    }

    function handleLeave() {
      setVisible(false)
    }

    window.addEventListener('pointermove', handleMove)
    document.addEventListener('mouseleave', handleLeave)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      document.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div className="custom-cursor-layer" style={{ opacity: visible ? 1 : 0 }}>
      {trail.map((dot) => (
        <span key={dot.id} className="cursor-trail-dot" style={{ left: dot.x, top: dot.y }}>♥</span>
      ))}
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot-custom" />
    </div>
  )
}
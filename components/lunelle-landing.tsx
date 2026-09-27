'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Heart, Sparkles } from 'lucide-react'
import { CustomCursor } from '@/components/custom-cursor'

const pills = ['Private & shared', 'Gentle insights', 'Real-time sync', 'Just for two', 'No account needed']

function GlossyHeart({ tilt }: { tilt: { x: number; y: number } }) {
  return (
    <svg
      className="love-heart-svg"
      viewBox="0 0 100 92"
      style={{ transform: `translate(${tilt.x}px, ${tilt.y}px) rotate(${tilt.x * 0.15}deg)` }}
    >
      <defs>
        <linearGradient id="heartFill" x1="15%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#ffe1e8" />
          <stop offset="45%" stopColor="#f8859f" />
          <stop offset="100%" stopColor="#c94a72" />
        </linearGradient>
        <filter id="softBlur"><feGaussianBlur stdDeviation="3.2" /></filter>
      </defs>
      <path
        d="M50 88C50 88 6 58 6 30C6 14 18 4 33 4C41 4 48 9 50 18C52 9 59 4 67 4C82 4 94 14 94 30C94 58 50 88 50 88Z"
        fill="url(#heartFill)"
        stroke="rgba(255,255,255,.55)"
        strokeWidth="1.4"
      />
      <ellipse cx="32" cy="24" rx="13" ry="8" fill="white" opacity=".5" filter="url(#softBlur)" transform="rotate(-24 32 24)" />
      <ellipse cx="66" cy="30" rx="6" ry="4" fill="white" opacity=".3" filter="url(#softBlur)" />
    </svg>
  )
}

export function LunelleLanding() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      const node = heroRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height * 0.42
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      if (!inside) {
        setTilt({ x: 0, y: 0 })
        return
      }
      setTilt({
        x: Math.max(-26, Math.min(26, dx * 0.06)),
        y: Math.max(-18, Math.min(18, dy * 0.06)),
      })
    }
    window.addEventListener('pointermove', handleMove)
    return () => window.removeEventListener('pointermove', handleMove)
  }, [])

  return (
    <div className="landing">
      <div className="landing-swirl landing-swirl-a" />
      <div className="landing-swirl landing-swirl-b" />
      <div className="landing-swirl landing-swirl-c" />

      <div className="landing-card" ref={heroRef}>
        <header className="landing-nav">
          <div className="brand-mark"><img src="/logo.png" alt="Lunelle" className="brand-orb" /><span>lunelle</span></div>
          <div className="landing-nav-right">
            <span className="landing-nav-hint">Made specially for Gunjan</span>
            <Link href="/dashboard" className="landing-link">Open Lunelle <ArrowRight size={14} /></Link>
          </div>
        </header>

        <div className="landing-pills">
          {pills.map((p) => (
            <span className="landing-pill" key={p}>{p}</span>
          ))}
        </div>

        <div className="landing-hero">
          <h1 className="landing-wordmark" aria-hidden="true">LUNELLE</h1>
          <div className="love-heart-wrap">
            <GlossyHeart tilt={tilt} />
          </div>
        </div>

        <p className="landing-tagline">
          A softer way to <Link href="/dashboard" className="landing-underline">track her Period Cycle</Link>, every day.
        </p>

        <Link href="/dashboard" className="landing-cta">
          <Heart size={16} fill="currentColor" /> Enter Lunelle
        </Link>

        <p className="landing-footnote"><Sparkles size={12} /> Made with love, just for Gunjan.</p>
      </div>
      <CustomCursor />
    </div>
  )
}
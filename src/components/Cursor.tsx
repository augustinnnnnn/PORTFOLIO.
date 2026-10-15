import { useEffect, useRef, useState } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion'
import './Cursor.css'

/**
 * Curseur discret : un point et un anneau doré qui s'agrandit sur les éléments
 * interactifs et affiche un libellé sur ceux qui portent data-cursor="…".
 * Desktop uniquement, désactivé si les animations sont réduites.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion())
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.55, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.55, ease: 'power3' })
    let shown = false

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.4 })
      }
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>('a, button, [data-cursor], [role="button"], input, label')
      ring.current?.classList.toggle('is-hover', !!t)
      setLabel(t?.dataset.cursor ?? '')
    }
    const leave = () => {
      shown = false
      gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 })
    }
    const down = () => ring.current?.classList.add('is-down')
    const up = () => ring.current?.classList.remove('is-down')

    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over)
    document.documentElement.addEventListener('pointerleave', leave)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
      document.documentElement.removeEventListener('pointerleave', leave)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className={`cursor-ring${label ? ' has-label' : ''}`} aria-hidden="true">
        <span>{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}

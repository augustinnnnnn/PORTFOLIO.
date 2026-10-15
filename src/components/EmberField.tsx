import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

type Ember = { x: number; y: number; vx: number; vy: number; r: number; a: number; t: number; s: number }

/**
 * Braises qui s'élèvent lentement (canvas 2D léger).
 * Mise en pause hors écran et quand l'onglet est caché.
 */
export function EmberField({ className, density = 1 }: { className?: string; density?: number }) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = canvas.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const reduced = prefersReducedMotion()
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let embers: Ember[] = []
    let raf = 0
    let visible = true

    const spawn = (initial: boolean): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -(0.15 + Math.random() * 0.45),
      r: 0.5 + Math.random() * 1.7,
      a: 0.25 + Math.random() * 0.65,
      t: Math.random() * 100,
      s: 0.5 + Math.random() * 1.5,
    })

    const resize = () => {
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(((w * h) / 22000) * density * (w < 700 ? 0.6 : 1))
      embers = Array.from({ length: Math.min(count, 110) }, () => spawn(true))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const e of embers) {
        e.t += 0.01 * e.s
        e.x += e.vx + Math.sin(e.t) * 0.25
        e.y += e.vy
        if (e.y < -10) Object.assign(e, spawn(false))
        const flicker = 0.6 + Math.sin(e.t * 6) * 0.4
        const alpha = e.a * flicker * Math.min(1, e.y / (h * 0.25))
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4)
        g.addColorStop(0, `rgba(255, 220, 160, ${alpha})`)
        g.addColorStop(0.35, `rgba(214, 160, 80, ${alpha * 0.45})`)
        g.addColorStop(1, 'rgba(200, 120, 40, 0)')
        ctx.fillStyle = g
        ctx.beginPath()
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const loop = () => {
      draw()
      raf = requestAnimationFrame(loop)
    }
    const start = () => {
      cancelAnimationFrame(raf)
      if (visible && !document.hidden && !reduced) raf = requestAnimationFrame(loop)
    }

    resize()
    draw()
    start()
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      start()
    })
    io.observe(cv)
    const onVis = () => start()
    document.addEventListener('visibilitychange', onVis)
    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(cv)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [density])

  return <canvas ref={canvas} className={className} aria-hidden="true" />
}

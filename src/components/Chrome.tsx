import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'
import { getScrollY } from '../lib/scroll'
import './Chrome.css'

const TOP_LABELS = Array.from({ length: 30 }, (_, i) => (i + 1) * 100)
const LEFT_COUNT = 16

/**
 * Cadre fixe façon « table de travail » : règles graduées (haut et gauche),
 * repères du curseur, coins, et télémétrie verticale (x, y, progression, section).
 */
export function Chrome({ section }: { section: string }) {
  const topMark = useRef<HTMLSpanElement>(null)
  const leftMark = useRef<HTMLSpanElement>(null)
  const leftTicks = useRef<HTMLDivElement>(null)
  const leftLabels = useRef<HTMLDivElement>(null)
  const readX = useRef<HTMLSpanElement>(null)
  const readY = useRef<HTMLSpanElement>(null)
  const readP = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let px = 0
    let py = 0
    let lastY = -1
    const onMove = (e: PointerEvent) => {
      px = e.clientX
      py = e.clientY
    }
    const pad = (n: number) => String(Math.max(0, Math.round(n))).padStart(4, '0')
    const labels = leftLabels.current ? Array.from(leftLabels.current.children) as HTMLElement[] : []
    const tick = () => {
      if (topMark.current) topMark.current.style.transform = `translateX(${px}px)`
      if (leftMark.current) leftMark.current.style.transform = `translateY(${py}px)`
      if (readX.current) readX.current.textContent = pad(px)
      if (readY.current) readY.current.textContent = pad(py)
      const y = getScrollY()
      if (y !== lastY) {
        lastY = y
        const off = y % 100
        if (leftTicks.current) leftTicks.current.style.backgroundPositionY = `${-off}px`
        const base = Math.floor(y / 100) * 100
        labels.forEach((el, i) => {
          el.textContent = String(base + i * 100)
          el.style.transform = `translateY(${i * 100 - off}px)`
        })
        const max = document.documentElement.scrollHeight - window.innerHeight
        const smoothMax = (document.getElementById('smooth-content')?.offsetHeight ?? 0) - window.innerHeight
        const p = Math.min(1, y / Math.max(1, Math.max(max, smoothMax)))
        if (readP.current) readP.current.textContent = String(Math.round(p * 100)).padStart(3, '0')
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    gsap.ticker.add(tick)
    return () => {
      window.removeEventListener('pointermove', onMove)
      gsap.ticker.remove(tick)
    }
  }, [])

  return (
    <div className="chrome" aria-hidden="true">
      <div className="ruler ruler--top">
        <div className="ruler__ticks" />
        {TOP_LABELS.map((n) => (
          <span key={n} className="ruler__label" style={{ left: n }}>
            {n}
          </span>
        ))}
        <span ref={topMark} className="ruler__mark ruler__mark--top" />
      </div>
      <div className="ruler ruler--left">
        <div ref={leftTicks} className="ruler__ticks" />
        <div ref={leftLabels}>
          {Array.from({ length: LEFT_COUNT }, (_, i) => (
            <span key={i} className="ruler__label" />
          ))}
        </div>
        <span ref={leftMark} className="ruler__mark ruler__mark--left" />
      </div>
      <span className="corner corner--tl">+</span>
      <span className="corner corner--tr">+</span>
      <span className="corner corner--bl">+</span>
      <span className="corner corner--br">+</span>
      <p className="readout">
        X:<span ref={readX}>0000</span> Y:<span ref={readY}>0000</span> P:<span ref={readP}>000</span>% S:<span>{section}</span>
      </p>
    </div>
  )
}

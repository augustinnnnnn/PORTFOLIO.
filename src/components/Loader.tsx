import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { GraceSigil } from './Glyphs'
import './Loader.css'

/** Écran d'ouverture court (≈ 2 s) : le sceau se dessine, puis le rideau se lève. */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (prefersReducedMotion()) {
      gsap.to(el, { opacity: 0, duration: 0.4, delay: 0.2, onComplete: () => { el.style.display = 'none'; onDone() } })
      return
    }
    const counter = { v: 0 }
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true })
      tl.set(el.querySelectorAll('.sigil-ring, .sigil-ray'), { strokeDasharray: 1, strokeDashoffset: 1 })
        .to(el.querySelectorAll('.sigil-ring'), { strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.15 })
        .to(el.querySelectorAll('.sigil-ray'), { strokeDashoffset: 0, duration: 0.6, stagger: 0.03, ease: 'power2.out' }, 0.4)
        .from(el.querySelector('.sigil-core'), { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(2)' }, 0.9)
        .to(counter, {
          v: 100,
          duration: 1.4,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
          },
        }, 0)
        .from(el.querySelectorAll('.loader__text > *'), { yPercent: 120, duration: 0.9, stagger: 0.08, ease: 'expo.out' }, 0.2)
        .addLabel('out', '+=0.15')
        .to(el.querySelector('.loader__inner'), { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, 'out')
        .to(el.querySelectorAll('.loader__panel'), { yPercent: (i) => (i === 0 ? -100 : 100), duration: 1.1, ease: 'expo.inOut' }, 'out+=0.2')
        .add(onDone, 'out+=0.55')
        .set(el, { display: 'none' })
      fonts.then(() => tl.play())
    }, el)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="loader" ref={root} role="status" aria-label="Chargement du portfolio">
      <div className="loader__panel" />
      <div className="loader__panel" />
      <div className="loader__inner">
        <GraceSigil className="loader__sigil" />
        <div className="loader__text">
          <span>Le voyage commence</span>
        </div>
        <span className="loader__count" ref={count} aria-hidden="true">
          000
        </span>
      </div>
    </div>
  )
}

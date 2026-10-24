import { useEffect, useRef } from 'react'
import { loader, profile } from '../content/site'
import { gsap, prefersReducedMotion } from '../lib/motion'
import './Loader.css'

/**
 * Intro : le nom s'écrit en haut à gauche, des visuels s'empilent en haut
 * à droite, un compteur 000 → 100 avance sur une règle graduée ; à 100,
 * tout s'estompe et le rideau remonte pour dévoiler la page.
 */
export function Loader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const name = `${profile.firstName} ${profile.lastName}`.trim().toUpperCase()

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
      const cards = gsap.utils.toArray<HTMLElement>('.loader__card')
      const tl = gsap.timeline({ paused: true })
      tl.set('.loader__count', { opacity: 1 })
        .from('.loader__dot', { scale: 0, duration: 0.4, ease: 'back.out(3)' })
        .from('.loader__name .ch', { opacity: 0, duration: 0.01, stagger: 0.08 }, 0.25)
        .from('.loader__ruler', { scaleX: 0, transformOrigin: 'left', duration: 1, ease: 'expo.out' }, 0)
        .to(
          counter,
          {
            v: 100,
            duration: 2.6,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (count.current) count.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
            },
          },
          0.15,
        )
        .fromTo('.loader__mark', { left: '0%' }, { left: '100%', duration: 2.6, ease: 'power2.inOut' }, 0.15)
      cards.forEach((card, i) => {
        tl.fromTo(
          card,
          { opacity: 0, scale: 1.35, rotate: gsap.utils.random(-30, 30), y: -20 },
          { opacity: 1, scale: 1, rotate: (i % 2 ? 1 : -1) * gsap.utils.random(3, 9), y: 0, duration: 0.45, ease: 'back.out(1.6)' },
          0.3 + i * 0.5,
        )
      })
      tl.addLabel('out', 2.95)
        .to('.loader__content', { opacity: 0.25, duration: 0.35, ease: 'power1.out' }, 'out')
        .add(onDone, 'out+=0.3')
        .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, 'out+=0.3')
        .set(el, { display: 'none' })
      fonts.then(() => tl.play())
    }, el)
    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="loader" ref={root} role="status" aria-label="Chargement du portfolio">
      <div className="loader__content">
        <p className="loader__name poster" aria-hidden="true">
          <i className="loader__dot" />
          {[...name].map((c, i) => (
            <span className="ch" key={i}>
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </p>
        <div className="loader__stack" aria-hidden="true">
          <span className="loader__card loader__card--blank" />
          {loader.images.map((src) => (
            <span className="loader__card" key={src}>
              <img src={src} alt="" />
            </span>
          ))}
        </div>
        <div className="loader__bottom" aria-hidden="true">
          <span className="loader__count poster" ref={count}>
            000
          </span>
          <span className="loader__ruler">
            <span className="loader__mark" />
          </span>
        </div>
      </div>
    </div>
  )
}

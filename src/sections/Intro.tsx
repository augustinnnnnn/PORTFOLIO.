import { useEffect, useRef } from 'react'
import { intro } from '../content/site'
import { Rich } from '../components/Rich'
import { Brush, HandArrow } from '../components/Hand'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { drawBrush, revealChars, revealUp } from '../lib/anim'
import './Intro.css'

export function Intro() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      revealChars(el, '.intro__title')
      drawBrush(el)
      revealUp(el, '.intro__sub')
      if (prefersReducedMotion()) return
      // Les chiffres comptent jusqu'à leur valeur
      el.querySelectorAll<HTMLElement>('[data-count]').forEach((n) => {
        const target = Number(n.dataset.count)
        const o = { v: 0 }
        gsap.to(o, {
          v: target,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: n, start: 'top 85%', once: true },
          onUpdate: () => (n.textContent = String(Math.round(o.v))),
        })
      })
      gsap.from('.intro__stat', { y: 50, opacity: 0, stagger: 0.12, duration: 1, scrollTrigger: { trigger: '.intro__stats', start: 'top 85%', once: true } })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="profil" ref={root} className="sec sec--aside intro" aria-labelledby="profil-title">
      <div className="intro__head">
        <Rich as="h2" id="profil-title" text={intro.title} split className="title poster intro__title" />
        <Brush className="intro__brush" />
      </div>
      <p className="intro__sub micro">{intro.subtitle}</p>

      <div className="intro__stats">
        <HandArrow className="intro__arrow" />
        {intro.stats.map((s) => (
          <div className="intro__stat" key={s.label}>
            <span className="intro__num poster">
              <span data-count={s.value}>{s.value}</span>
            </span>
            <span className="intro__label">
              {s.label.split('\n').map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

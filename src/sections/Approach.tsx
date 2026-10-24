import { useEffect, useRef } from 'react'
import { approach } from '../content/site'
import { Rich } from '../components/Rich'
import { Brush } from '../components/Hand'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { drawBrush, revealChars, revealUp } from '../lib/anim'
import './Approach.css'

/** « Approche » : mes principes de travail, présentés en éventail de cartes. */
export function Approach() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      revealChars(el, '.appr__title')
      drawBrush(el)
      revealUp(el, '.appr__list, .appr__note')
      if (prefersReducedMotion()) return
      const cards = gsap.utils.toArray<HTMLElement>('.acard')
      const n = cards.length
      gsap.fromTo(
        cards,
        { rotate: (i) => (i - (n - 1) / 2) * 3 - 26, opacity: 0, y: 80 },
        {
          rotate: (i) => (i - (n - 1) / 2) * 13,
          opacity: 1,
          y: 0,
          ease: 'none',
          stagger: 0.03,
          scrollTrigger: { trigger: '.appr__fan', start: 'top 95%', end: 'center 55%', scrub: 0.8 },
        },
      )
      gsap.to('.appr__fan-inner', {
        rotate: 10,
        ease: 'none',
        scrollTrigger: { trigger: '.appr__fan', start: 'center 55%', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="approche" ref={root} className="sec sec--aside appr" aria-labelledby="approche-title">
      <div className="appr__head">
        <Rich as="h2" id="approche-title" text={approach.title} split className="title poster appr__title" />
        <Brush className="appr__brush" />
        <p className="appr__note annot">→ {approach.note}</p>
      </div>

      <div className="appr__list">
        <p className="micro">{approach.listTitle}</p>
        <ol>
          {approach.cards.map((c, i) => (
            <li key={c.title}>
              <span className="gold">{String(i + 1).padStart(2, '0')}</span> {c.title} — <span>{c.text}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="appr__fan" aria-hidden="true">
        <div className="appr__fan-inner">
          {approach.cards.map((c, i) => (
            <div key={c.title} className={`acard${i % 2 ? ' acard--gold' : ''}`} style={{ '--i': i, '--n': approach.cards.length } as React.CSSProperties}>
              <span className="acard__num poster">{String(i + 1).padStart(2, '0')}</span>
              <p className="poster acard__title">{c.title}</p>
              <p className="acard__text">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef } from 'react'
import { fragments, ranks } from '../content/fragments'
import { fragmentsSection } from '../content/site'
import { useGame } from '../game/GameContext'
import { Rich } from '../components/Rich'
import { Brush, Scribble } from '../components/Hand'
import { Rune } from '../components/Glyphs'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { drawBrush, revealChars, revealUp } from '../lib/anim'
import './Fragments.css'

/**
 * « Je voulais savoir jusqu'où tu irais… » : la collection de fragments,
 * présentée comme un éventail de cartes qui tourne au fil du scroll.
 */
export function Fragments() {
  const root = useRef<HTMLElement>(null)
  const { isFound, progress, total, rankIndex, setCodexOpen } = useGame()

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      revealChars(el, '.frag__title')
      drawBrush(el)
      revealUp(el, '.frag__list, .frag__note')
      if (prefersReducedMotion()) return
      const cards = gsap.utils.toArray<HTMLElement>('.fcard')
      const n = cards.length
      gsap.fromTo(
        cards,
        { rotate: (i) => (i - (n - 1) / 2) * 4 - 30, opacity: 0 },
        {
          rotate: (i) => (i - (n - 1) / 2) * 11,
          opacity: 1,
          ease: 'none',
          stagger: 0.02,
          scrollTrigger: { trigger: '.frag__fan', start: 'top 95%', end: 'bottom 60%', scrub: 0.8 },
        },
      )
      gsap.to('.frag__fan-inner', {
        rotate: 14,
        ease: 'none',
        scrollTrigger: { trigger: '.frag__fan', start: 'center 60%', end: 'bottom top', scrub: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="fragments" ref={root} className="sec sec--aside frag" aria-labelledby="fragments-title">
      <div className="frag__head">
        <Rich as="h2" id="fragments-title" text={fragmentsSection.title} split className="title poster frag__title" />
        <Brush className="frag__brush" />
        <p className="frag__note annot">→ {fragmentsSection.note}</p>
      </div>

      <div className="frag__list">
        <p className="micro">
          {fragmentsSection.listTitle} — {progress.found.length}/{total} · Rang : <span className="gold">{ranks[rankIndex].title}</span>
        </p>
        <ul>
          {fragments.map((f) => {
            const ok = isFound(f.id)
            return (
              <li key={f.id} className={ok ? 'is-found' : undefined}>
                {ok ? f.name : '???'} <span>({f.place})</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="frag__fan" aria-hidden="true">
        <div className="frag__fan-inner">
          {fragments.map((f, i) => {
            const ok = isFound(f.id)
            return (
              <div key={f.id} className={`fcard${ok ? ' is-found' : ''}`} style={{ '--i': i } as React.CSSProperties}>
                <Rune index={i} className="fcard__rune" />
                <p className="poster fcard__name">{ok ? f.name : 'Fragment inconnu'}</p>
                <p className="fcard__place micro">{f.place}</p>
                <span className="fcard__num poster">{String(i + 1).padStart(2, '0')}</span>
              </div>
            )
          })}
        </div>
        <button type="button" className="scribble hand frag__cta" onClick={() => setCodexOpen(true)} aria-hidden="false">
          <Scribble>{fragmentsSection.cta} ↗</Scribble>
        </button>
      </div>
    </section>
  )
}

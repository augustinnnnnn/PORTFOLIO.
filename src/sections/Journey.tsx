import { useEffect, useRef, useState } from 'react'
import { journey } from '../content/journey'
import { useGame } from '../game/GameContext'
import { SectionHeading } from '../components/Lines'
import { GraceSigil, Rune } from '../components/Glyphs'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import './Journey.css'

export function Journey() {
  const root = useRef<HTMLElement>(null)
  const [reachedEnd, setReachedEnd] = useState(false)
  const { discover, isFound } = useGame()
  const found = isFound('path-end')

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      // Le fil se dessine au fil du scroll, chaque étape s'allume au passage.
      if (!reduced) {
        gsap.fromTo(
          '.journey__line-fill',
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.journey__list', start: 'top 62%', end: 'bottom 62%', scrub: 0.6 } },
        )
        gsap.utils.toArray<HTMLElement>('.journey__step').forEach((step, i) => {
          gsap.from(step.querySelector('.journey__card'), {
            x: i % 2 === 0 ? -50 : 50,
            opacity: 0,
            duration: 1.2,
            scrollTrigger: { trigger: step, start: 'top 80%', once: true },
          })
        })
      }
      gsap.utils.toArray<HTMLElement>('.journey__step, .journey__end').forEach((step) => {
        ScrollTrigger.create({ trigger: step, start: 'top 62%', toggleClass: { targets: step, className: 'is-lit' } })
      })
      ScrollTrigger.create({ trigger: '.journey__end', start: 'top 70%', once: true, onEnter: () => setReachedEnd(true) })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="chemin" ref={root} className="section journey" aria-labelledby="chemin-title">
      <span className="section-index" aria-hidden="true">
        IV
      </span>
      <div className="container">
        <SectionHeading kicker="IV — Le chemin parcouru" title={'Le chemin\nparcouru'} id="chemin-title" />

        <div className="journey__wrap">
          <div className="journey__line" aria-hidden="true">
            <span className="journey__line-fill" />
          </div>
          <ol className="journey__list">
            {journey.map((step, i) => (
              <li key={`${step.title}-${i}`} className={`journey__step${i % 2 ? ' journey__step--right' : ''}`}>
                <span className="journey__marker" aria-hidden="true">
                  <GraceSigil />
                </span>
                <article className="journey__card">
                  <p className="journey__period">
                    <span className="label">{step.kind}</span>
                    <span>{step.period}</span>
                  </p>
                  <h3 className="journey__title display">{step.title}</h3>
                  {step.place && <p className="journey__place">{step.place}</p>}
                  <p className="journey__text">{step.text}</p>
                  {step.placeholder && <span className="placeholder-badge">À compléter</span>}
                </article>
              </li>
            ))}
          </ol>
          <div className="journey__end">
            <button
              type="button"
              className={`journey__ember${reachedEnd ? ' is-awake' : ''}${found ? ' is-found' : ''}`}
              onClick={() => discover('path-end')}
              disabled={!reachedEnd}
              aria-label={found ? 'Braise du chemin (découverte)' : 'Une braise s’éveille au bout du chemin'}
              data-cursor={found ? undefined : '?'}
            >
              <Rune index={5} />
            </button>
            <p className="journey__end-text display">La suite s’écrit à chaque nouveau projet.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

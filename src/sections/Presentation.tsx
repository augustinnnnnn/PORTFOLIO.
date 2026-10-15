import { useEffect, useRef, useState } from 'react'
import { presentation } from '../content/site'
import { useGame } from '../game/GameContext'
import { SectionHeading } from '../components/Lines'
import { gsap, prefersReducedMotion } from '../lib/motion'
import './Presentation.css'

export function Presentation() {
  const root = useRef<HTMLElement>(null)
  const { discover, isFound } = useGame()
  const found = isFound('origin-word')
  const [revealed, setRevealed] = useState(found)

  // Le texte se dévoile mot à mot au rythme du scroll ; le portrait glisse en parallaxe.
  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll('.origin__statement .word'),
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.origin__statement', start: 'top 82%', end: 'bottom 45%', scrub: true },
        },
      )
      gsap.fromTo(
        '.origin__portrait img',
        { yPercent: -8, scale: 1.15 },
        { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.origin__portrait', start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  const onSecret = () => {
    setRevealed(true)
    discover('origin-word')
  }

  // Découpe le texte en mots ; le mot entre [crochets] devient le fragment.
  const words = presentation.statement.split(' ')

  return (
    <section id="origine" ref={root} className="section origin" aria-labelledby="origine-title">
      <span className="section-index" aria-hidden="true">
        I
      </span>
      <div className="container">
        <SectionHeading kicker={presentation.kicker} title={presentation.title} id="origine-title" />

        <div className="origin__grid">
          <div className="origin__text">
            <p className="origin__statement display">
              {words.map((w, i) => {
                const m = w.match(/^\[(.+)\](.*)$/)
                if (m) {
                  return (
                    <span className="word" key={i}>
                      <button type="button" className={`secret${found ? ' is-found' : ''}`} onClick={onSecret} data-cursor="?">
                        {m[1]}
                      </button>
                      {m[2]}{' '}
                    </span>
                  )
                }
                return (
                  <span className="word" key={i}>
                    {w}{' '}
                  </span>
                )
              })}
            </p>
            <p className={`origin__inscription${revealed ? ' is-visible' : ''}`} aria-live="polite">
              {revealed ? presentation.inscription : ''}
            </p>

            <div className="origin__columns" data-reveal="stagger">
              {presentation.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <dl className="origin__sheet" data-reveal="stagger">
              {presentation.attributes.map((a) => (
                <div key={a.label} className="origin__attr">
                  <dt>{a.label}</dt>
                  <dd>{a.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="origin__portrait">
            <div className="origin__frame" data-reveal="clip">
              <img src={presentation.portrait.src} alt={presentation.portrait.alt} loading="lazy" decoding="async" width={1600} height={1000} />
            </div>
            <figcaption>
              {presentation.portrait.placeholder ? (
                <span className="placeholder-badge">Visuel temporaire — remplace-le par ton portrait</span>
              ) : (
                <span className="label">Portrait</span>
              )}
            </figcaption>
            <span className="origin__corner origin__corner--tl" aria-hidden="true" />
            <span className="origin__corner origin__corner--br" aria-hidden="true" />
          </figure>
        </div>
      </div>
    </section>
  )
}

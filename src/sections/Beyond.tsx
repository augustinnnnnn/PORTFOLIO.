import { useEffect, useRef, useState } from 'react'
import { beyond } from '../content/site'
import { useGame } from '../game/GameContext'
import { Lines } from '../components/Lines'
import { gsap, prefersReducedMotion } from '../lib/motion'
import './Beyond.css'

const LINGER_MS = 1600
const SCRAMBLE = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'

export function Beyond() {
  const root = useRef<HTMLElement>(null)
  const timer = useRef<number>()
  const { discover, isFound } = useGame()
  const found = isFound('ground-message')
  const [lingering, setLingering] = useState(false)
  const [text, setText] = useState(found ? beyond.groundMessage.revealed : beyond.groundMessage.hidden)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = prefersReducedMotion()
    const ctx = gsap.context(() => {
      if (reduced) return
      // L'aube : le fond passe du noir à la pierre claire, puis retombe vers la nuit.
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 5%', scrub: true } })
        .fromTo(el, { '--b-bg': '#0b0a09', '--b-fg': '#e8e1d3', '--b-muted': '#a39b8b' }, { '--b-bg': '#d9cfbb', '--b-fg': '#15120e', '--b-muted': '#4f473b', ease: 'none' })
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: 'bottom 85%', end: 'bottom 15%', scrub: true } })
        .to(el, { '--b-bg': '#0b0a09', '--b-fg': '#e8e1d3', '--b-muted': '#a39b8b', ease: 'none' })
      gsap.fromTo(
        '.beyond__marquee-inner',
        { xPercent: 0 },
        { xPercent: -35, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
      gsap.fromTo(
        '.beyond__quote .line-mask > span',
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.12, ease: 'expo.out', duration: 1.4, scrollTrigger: { trigger: '.beyond__quote', start: 'top 80%', once: true } },
      )
    }, el)
    return () => ctx.revert()
  }, [])

  // Révélation du message : décodage des glyphes en texte lisible.
  const reveal = () => {
    setLingering(false)
    discover('ground-message')
    const target = beyond.groundMessage.revealed
    if (prefersReducedMotion()) {
      setText(target)
      return
    }
    const state = { p: 0 }
    gsap.to(state, {
      p: 1,
      duration: 1.6,
      ease: 'power2.out',
      onUpdate: () => {
        const n = Math.floor(state.p * target.length)
        let out = target.slice(0, n)
        for (let i = n; i < target.length; i++) out += target[i] === ' ' ? ' ' : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]
        setText(out)
      },
    })
  }
  const startLinger = () => {
    if (found || timer.current) return
    setLingering(true)
    timer.current = window.setTimeout(reveal, LINGER_MS)
  }
  const stopLinger = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
    setLingering(false)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  return (
    <section id="au-dela" ref={root} className="section beyond" aria-labelledby="au-dela-title">
      <div className="beyond__marquee" aria-hidden="true">
        <div className="beyond__marquee-inner">Explorer · Concevoir · Forger · Transmettre · Explorer · Concevoir ·</div>
      </div>
      <div className="container">
        <header className="section-heading">
          <p className="kicker" data-reveal="fade">
            {beyond.kicker}
          </p>
          <Lines as="h2" id="au-dela-title" text={beyond.title} className="display section-heading__title" />
        </header>

        <blockquote className="beyond__quote display">
          {beyond.quote.split(/(?<=,|\.)\s/).map((l, i) => (
            <span className="line-mask" key={i}>
              <span>{l}</span>
            </span>
          ))}
        </blockquote>

        <ol className="beyond__principles" data-reveal="stagger">
          {beyond.principles.map((p) => (
            <li key={p.title}>
              <span className="beyond__numeral">{p.numeral}</span>
              <h3 className="display">{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ol>

        <div className="beyond__passion">
          <div className="beyond__passion-text" data-reveal="fade">
            <h3 className="display">{beyond.passionTitle}</h3>
            <p>{beyond.passion}</p>
          </div>

          <button
            type="button"
            className={`beyond__tablet${lingering ? ' is-lingering' : ''}${found ? ' is-found' : ''}`}
            onPointerEnter={(e) => e.pointerType === 'mouse' && startLinger()}
            onPointerLeave={(e) => e.pointerType === 'mouse' && stopLinger()}
            onFocus={startLinger}
            onBlur={stopLinger}
            onClick={startLinger}
            aria-label={found ? `Message au sol : ${beyond.groundMessage.revealed}` : 'Une inscription effacée. Attarde-toi dessus pour la lire.'}
            data-reveal="fade"
          >
            <span className="beyond__tablet-label label">Message au sol</span>
            <span className={`beyond__tablet-text${found ? '' : ' is-blurred'}`} aria-hidden="true">
              {text}
            </span>
            <span className="beyond__tablet-progress" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}

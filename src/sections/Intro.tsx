import { useEffect, useRef, useState } from 'react'
import { intro } from '../content/site'
import { useGame } from '../game/GameContext'
import { Rich } from '../components/Rich'
import { Brush, HandArrow } from '../components/Hand'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { drawBrush, revealChars, revealUp } from '../lib/anim'
import './Intro.css'

const LINGER_MS = 1600
const SCRAMBLE = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'

export function Intro() {
  const root = useRef<HTMLElement>(null)
  const timer = useRef<number | undefined>(undefined)
  const { discover, isFound } = useGame()
  const wordFound = isFound('origin-word')
  const msgFound = isFound('ground-message')
  const [inscription, setInscription] = useState(wordFound)
  const [lingering, setLingering] = useState(false)
  const [msg, setMsg] = useState(msgFound ? intro.groundMessage.revealed : intro.groundMessage.hidden)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const ctx = gsap.context(() => {
      revealChars(el, '.intro__title')
      drawBrush(el)
      revealUp(el, '.intro__sub, .intro__vision > *, .intro__tablet')
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

  const reveal = () => {
    setLingering(false)
    discover('ground-message')
    const target = intro.groundMessage.revealed
    if (prefersReducedMotion()) return setMsg(target)
    const s = { p: 0 }
    gsap.to(s, {
      p: 1,
      duration: 1.5,
      onUpdate: () => {
        const n = Math.floor(s.p * target.length)
        setMsg(target.slice(0, n) + [...target.slice(n)].map((c) => (c === ' ' ? ' ' : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)])).join(''))
      },
    })
  }
  const startLinger = () => {
    if (msgFound || timer.current) return
    setLingering(true)
    timer.current = window.setTimeout(reveal, LINGER_MS)
  }
  const stopLinger = () => {
    window.clearTimeout(timer.current)
    timer.current = undefined
    setLingering(false)
  }
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const [before, rest] = intro.subtitle.split('[')
  const [word, after] = (rest ?? '').split(']')

  return (
    <section id="origine" ref={root} className="sec sec--aside intro" aria-labelledby="origine-title">
      <div className="intro__head">
        <Rich as="h2" id="origine-title" text={intro.title} split className="title poster intro__title" />
        <Brush className="intro__brush" />
      </div>
      <p className="intro__sub micro">
        {before}
        {word && (
          <button
            type="button"
            className={`secret${wordFound ? ' is-found' : ''}`}
            onClick={() => {
              setInscription(true)
              discover('origin-word')
            }}
          >
            {word}
          </button>
        )}
        {after}
      </p>
      <p className={`intro__inscription hand${inscription ? ' is-on' : ''}`} aria-live="polite">
        {inscription ? intro.inscription : ''}
      </p>

      <div className="intro__stats">
        <HandArrow className="intro__arrow" />
        {intro.stats.map((s) => (
          <div className="intro__stat" key={s.label}>
            <span className="intro__num poster">
              <span data-count={s.value}>{s.value}</span>
              {s.suffix}
            </span>
            <span className="intro__label">
              {s.label.split('\n').map((l) => (
                <span key={l}>{l}</span>
              ))}
            </span>
          </div>
        ))}
      </div>

      <div className="intro__lower">
        <div className="intro__vision">
          {intro.vision.map((v) => (
            <article key={v.title}>
              <h3 className="poster">{v.title}</h3>
              <p>{v.text}</p>
            </article>
          ))}
        </div>
        <button
          type="button"
          className={`intro__tablet${lingering ? ' is-lingering' : ''}${msgFound ? ' is-found' : ''}`}
          onPointerEnter={(e) => e.pointerType === 'mouse' && startLinger()}
          onPointerLeave={(e) => e.pointerType === 'mouse' && stopLinger()}
          onFocus={startLinger}
          onBlur={stopLinger}
          onClick={startLinger}
          aria-label={msgFound ? `Message au sol : ${intro.groundMessage.revealed}` : 'Une inscription effacée. Attarde-toi dessus pour la lire.'}
        >
          <span className="micro">Message au sol</span>
          <span className={`intro__tablet-text hand${msgFound ? '' : ' is-blurred'}`} aria-hidden="true">
            {msg}
          </span>
          <span className="intro__tablet-bar" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}

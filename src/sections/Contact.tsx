import { useRef, useState } from 'react'
import { contact } from '../content/site'
import { useGame } from '../game/GameContext'
import { Lines } from '../components/Lines'
import { ArrowGlyph, GraceSigil } from '../components/Glyphs'
import { EmberField } from '../components/EmberField'
import { useMagnetic } from '../components/useMagnetic'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import './Contact.css'

export function Contact() {
  const cta = useRef<HTMLAnchorElement>(null)
  const grace = useRef<HTMLButtonElement>(null)
  const rest = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const [resting, setResting] = useState(false)
  const { discover, isFound, setCodexOpen, reset, progress, total } = useGame()
  const [confirmReset, setConfirmReset] = useState(false)
  useMagnetic(cta, 0.25)
  useMagnetic(grace, 0.15)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  // Se reposer à la grâce : court moment de calme + fragment.
  const onRest = () => {
    discover('last-grace')
    if (prefersReducedMotion()) return
    setResting(true)
    requestAnimationFrame(() => {
      gsap
        .timeline({ onComplete: () => setResting(false) })
        .fromTo(rest.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
        .from(rest.current!.querySelectorAll('.rest__line'), { scaleX: 0, duration: 1.2, ease: 'expo.out' }, 0.2)
        .from(rest.current!.querySelector('.rest__text'), { opacity: 0, letterSpacing: '0.9em', duration: 1.6, ease: 'expo.out' }, 0.3)
        .to(rest.current, { opacity: 0, duration: 0.9, ease: 'power2.in' }, '+=1.1')
    })
  }

  return (
    <section id="contact" className="contact" aria-labelledby="contact-title">
      <EmberField className="contact__embers" density={0.6} />
      <div className="contact__glow" aria-hidden="true" />
      <div className="container contact__inner">
        <button
          ref={grace}
          type="button"
          className={`contact__grace${isFound('last-grace') ? ' is-found' : ''}`}
          onClick={onRest}
          aria-label="Se reposer auprès de la lumière"
          data-cursor="Se reposer"
        >
          <span className="contact__flame" aria-hidden="true" />
          <GraceSigil className="contact__sigil" />
        </button>

        <p className="kicker contact__kicker" data-reveal="fade">
          {contact.kicker}
        </p>
        <Lines as="h2" id="contact-title" text={contact.title} className="display contact__title" />
        <p className="contact__lead" data-reveal="fade">
          {contact.lead}
        </p>

        <div className="contact__actions" data-reveal="fade">
          <a ref={cta} className="contact__cta" href={`mailto:${contact.email}`} data-cursor="Écrire">
            <span>{contact.cta}</span>
            <ArrowGlyph />
          </a>
          <button type="button" className="contact__copy" onClick={copy}>
            <span className="label">{copied ? 'Adresse copiée' : 'Copier l’adresse'}</span>
            <span className="contact__email">{contact.email}</span>
          </button>
          <span className="sr-only" aria-live="polite">
            {copied ? 'Adresse e-mail copiée dans le presse-papiers' : ''}
          </span>
        </div>

        <ul className="contact__links" data-reveal="stagger">
          {contact.links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noreferrer">
                <span className="display">{l.label}</span>
                {l.note && <span className="placeholder-badge">{l.note}</span>}
                <ArrowGlyph />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <footer className="footer container">
        <p>
          © {new Date().getFullYear()} — {contact.footer}
        </p>
        <div className="footer__actions">
          <button type="button" onClick={() => setCodexOpen(true)}>
            Codex · {progress.found.length}/{total}
          </button>
          {confirmReset ? (
            <button
              type="button"
              className="footer__danger"
              onClick={() => {
                reset()
                setConfirmReset(false)
              }}
              onBlur={() => setConfirmReset(false)}
            >
              Confirmer la réinitialisation
            </button>
          ) : (
            <button type="button" onClick={() => setConfirmReset(true)}>
              Réinitialiser la progression
            </button>
          )}
          <button type="button" onClick={() => scrollToTarget(0)}>
            Retour au commencement ↑
          </button>
        </div>
      </footer>

      {resting && (
        <div ref={rest} className="rest" aria-hidden="true">
          <span className="rest__line" />
          <p className="rest__text">Lumière retrouvée</p>
          <span className="rest__line" />
        </div>
      )}
    </section>
  )
}

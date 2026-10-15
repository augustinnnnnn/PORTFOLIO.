import { useEffect, useRef, useState } from 'react'
import { exploredSections, fragments, ranks } from '../content/fragments'
import { GraceSigil, Rune } from '../components/Glyphs'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { scrollToTarget, setScrollLocked } from '../lib/scroll'
import { useGame } from './GameContext'
import './GameUI.css'

/** Compteur discret, en bas à gauche : ouvre le codex. */
export function Hud() {
  const { progress, total, rankIndex, setCodexOpen, toast } = useGame()
  const count = progress.found.length
  return (
    <button type="button" className={`hud${toast ? ' is-pulsing' : ''}`} onClick={() => setCodexOpen(true)} aria-label={`Codex des fragments : ${count} sur ${total} découverts. Rang : ${ranks[rankIndex].title}`}>
      <GraceSigil className="hud__sigil" />
      <span className="hud__text">
        <span className="hud__count">
          {count}
          <span>/{total}</span>
        </span>
        <span className="hud__rank">{ranks[rankIndex].title}</span>
      </span>
    </button>
  )
}

/** Bannière de découverte, à la manière d'un objet ramassé. */
export function FragmentToast() {
  const { toast, progress, total } = useGame()
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!toast || !el.current || prefersReducedMotion()) return
    const tl = gsap
      .timeline()
      .fromTo(el.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' })
      .fromTo(el.current.querySelectorAll('.toast__line'), { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.out' }, 0.1)
      .fromTo(el.current.querySelector('.toast__rune'), { scale: 0.3, rotate: -90, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, duration: 1, ease: 'back.out(2)' }, 0.15)
      .to(el.current, { opacity: 0, y: -10, duration: 0.6, ease: 'power2.in' }, 3.5)
    return () => {
      tl.kill()
    }
  }, [toast])

  const index = toast ? fragments.findIndex((f) => f.id === toast.id) : 0
  return (
    <div className="toast-region" aria-live="polite" aria-atomic="true">
      {toast && (
        <div ref={el} className="toast" key={toast.id}>
          <span className="toast__line" />
          <div className="toast__body">
            <Rune index={index} className="toast__rune" />
            <div>
              <p className="toast__kicker">
                Fragment retrouvé · {progress.found.length}/{total}
              </p>
              <p className="toast__name">{toast.name}</p>
              <p className="toast__lore">{toast.lore}</p>
            </div>
          </div>
          <span className="toast__line" />
        </div>
      )}
    </div>
  )
}

/** Le codex : collection, progression, réinitialisation. */
export function Codex() {
  const { codexOpen, setCodexOpen, progress, total, rankIndex, isFound, reset, replayFinale } = useGame()
  const [confirm, setConfirm] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const opener = useRef<Element | null>(null)

  useEffect(() => {
    if (!codexOpen) return
    opener.current = document.activeElement
    setScrollLocked(true)
    closeBtn.current?.focus()
    if (root.current && !prefersReducedMotion()) {
      gsap.fromTo(root.current.querySelector('.codex__sheet'), { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: 'expo.out' })
      gsap.fromTo(root.current.querySelector('.codex__backdrop'), { opacity: 0 }, { opacity: 1, duration: 0.6 })
      gsap.from(root.current.querySelectorAll('.codex__item'), { x: 30, opacity: 0, stagger: 0.04, duration: 0.7, delay: 0.25 })
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codexOpen])

  const close = () => {
    setConfirm(false)
    setCodexOpen(false)
    ;(opener.current as HTMLElement | null)?.focus?.({ preventScroll: true })
  }

  if (!codexOpen) return null
  const found = progress.found.length
  return (
    <div ref={root} className="codex" role="dialog" aria-modal="true" aria-labelledby="codex-title" data-lenis-prevent>
      <div className="codex__backdrop" onClick={close} />
      <div className="codex__sheet">
        <header className="codex__head">
          <div>
            <p className="kicker">Codex</p>
            <h2 id="codex-title" className="display">
              Fragments de mémoire
            </h2>
          </div>
          <button ref={closeBtn} type="button" className="codex__close" onClick={close}>
            Fermer <span aria-hidden="true">✕</span>
          </button>
        </header>

        <p className="codex__intro">
          Des fragments sont cachés dans ce portfolio. Ils ne bloquent rien : ce sont de petites récompenses pour les curieux. Ta progression est enregistrée uniquement dans ce navigateur.
        </p>

        <div className="codex__stats">
          <div>
            <span className="codex__big">
              {found}
              <small>/{total}</small>
            </span>
            <span className="label">Fragments</span>
          </div>
          <div>
            <span className="codex__big">
              {progress.visited.length}
              <small>/{exploredSections.length}</small>
            </span>
            <span className="label">Terres explorées</span>
          </div>
        </div>

        <ol className="codex__ranks" aria-label="Progression">
          {ranks.map((r, i) => (
            <li key={r.title} className={i <= rankIndex ? 'is-reached' : ''} aria-current={i === rankIndex ? 'step' : undefined}>
              <span className="codex__rank-dot" />
              <span className="label">{r.stage}</span>
              <span className="codex__rank-title">{r.title}</span>
              <span className="codex__rank-text">{r.text}</span>
            </li>
          ))}
        </ol>

        <ul className="codex__list">
          {fragments.map((f, i) => {
            const ok = isFound(f.id)
            return (
              <li key={f.id} className={`codex__item${ok ? ' is-found' : ''}`}>
                <Rune index={i} className="codex__rune" />
                <div>
                  <p className="codex__name">{ok ? f.name : 'Fragment inconnu'}</p>
                  <p className="codex__place label">{f.place}</p>
                  <p className="codex__lore">{ok ? f.lore : `Indice : ${f.hint}`}</p>
                </div>
              </li>
            )
          })}
        </ul>

        <footer className="codex__foot">
          {found === total && (
            <button type="button" className="btn" onClick={() => { close(); replayFinale() }}>
              Revoir l’épilogue
            </button>
          )}
          {confirm ? (
            <div className="codex__confirm">
              <p>Effacer toutes les découvertes ?</p>
              <button type="button" className="btn" onClick={() => { reset(); setConfirm(false) }}>
                Oui, tout effacer
              </button>
              <button type="button" className="codex__link" onClick={() => setConfirm(false)}>
                Annuler
              </button>
            </div>
          ) : (
            <button type="button" className="codex__link" onClick={() => setConfirm(true)}>
              Réinitialiser la progression
            </button>
          )}
        </footer>
      </div>
    </div>
  )
}

/** Écran final : tous les fragments réunis. */
export function Finale() {
  const { finaleOpen, closeFinale } = useGame()
  const root = useRef<HTMLDivElement>(null)
  const btn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!finaleOpen) return
    setScrollLocked(true)
    btn.current?.focus({ preventScroll: true })
    const el = root.current
    let tl: gsap.core.Timeline | undefined
    if (el && !prefersReducedMotion()) {
      tl = gsap
        .timeline()
        .fromTo(el, { opacity: 0 }, { opacity: 1, duration: 1.2 })
        .fromTo(el.querySelectorAll('.sigil-ring, .sigil-ray'), { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2, stagger: 0.04, ease: 'power2.inOut' }, 0.3)
        .from(el.querySelectorAll('.finale__reveal'), { y: 30, opacity: 0, filter: 'blur(8px)', stagger: 0.25, duration: 1.4, ease: 'expo.out' }, 1)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeFinale()
    window.addEventListener('keydown', onKey)
    return () => {
      tl?.kill()
      window.removeEventListener('keydown', onKey)
      setScrollLocked(false)
    }
  }, [finaleOpen, closeFinale])

  if (!finaleOpen) return null
  return (
    <div ref={root} className="finale" role="dialog" aria-modal="true" aria-labelledby="finale-title">
      <GraceSigil className="finale__sigil" />
      <p className="kicker finale__reveal">Accomplissement</p>
      <h2 id="finale-title" className="display finale__title finale__reveal">
        Mémoire restaurée
      </h2>
      <p className="finale__text finale__reveal">
        Tu as retrouvé chaque fragment. Peu de visiteurs prennent le temps de tout explorer : cette curiosité est exactement ce que j’essaie de récompenser dans mon travail.
      </p>
      <p className="finale__text finale__text--small finale__reveal">Le nom au sommet du site porte désormais un éclat doré, en souvenir de ton passage.</p>
      <div className="finale__actions finale__reveal">
        <button
          type="button"
          className="btn"
          onClick={() => {
            closeFinale()
            window.setTimeout(() => scrollToTarget('#contact'), 300)
          }}
        >
          Faisons connaissance
        </button>
        <button ref={btn} type="button" className="codex__link" onClick={closeFinale}>
          Continuer l’exploration
        </button>
      </div>
    </div>
  )
}

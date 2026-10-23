import { useEffect, useMemo, useRef } from 'react'
import { contact } from '../content/site'
import { projects } from '../content/projects'
import { useGame } from '../game/GameContext'
import { Rich } from '../components/Rich'
import { Rune } from '../components/Glyphs'
import { Brush, HandArrow } from '../components/Hand'
import { CopyEmail, Socials } from '../components/Sidebar'
import { Draggable, ScrollTrigger, gsap, prefersReducedMotion } from '../lib/motion'
import { revealChars } from '../lib/anim'
import { scrollToTarget } from '../lib/scroll'
import './Contact.css'

const COLS = 9
const ROWS = 6
/** Position de la tuile secrète (en bas à droite, souvent hors champ). */
const SECRET = { col: 8, row: 5 }

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const wall = useRef<HTMLDivElement>(null)
  const { discover, isFound, setCodexOpen, reset, progress, total } = useGame()
  const found = isFound('last-grace')

  const tiles = useMemo(() => {
    const imgs = projects.map((p) => p.coverSmall ?? p.cover)
    return Array.from({ length: COLS * ROWS }, (_, i) => {
      const col = i % COLS
      const row = Math.floor(i / COLS)
      return { i, col, row, src: imgs[(i * 5 + row) % imgs.length], secret: col === SECRET.col && row === SECRET.row }
    })
  }, [])

  useEffect(() => {
    const el = root.current
    const w = wall.current
    if (!el || !w) return
    const ctx = gsap.context(() => {
      revealChars(el, '.contact__question')
      // Le mur prend tout l'écran : la barre latérale s'efface.
      ScrollTrigger.create({
        trigger: '.contact__wall',
        start: 'top 35%',
        end: 'max',
        toggleClass: { targets: document.documentElement, className: 'wall-on' },
      })
      if (!prefersReducedMotion()) {
        // Le mur s'assemble en arrivant à l'écran
        gsap.fromTo(
          '.contact__tilt',
          { rotateX: 48, scale: 0.55, yPercent: 18, opacity: 0.2 },
          { rotateX: 0, scale: 1, yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.contact__wall', start: 'top bottom', end: 'top top', scrub: 0.6 } },
        )
        gsap.from('.contact__tile', {
          opacity: 0,
          scale: 0.6,
          stagger: { each: 0.01, from: 'center', grid: [ROWS, COLS] },
          ease: 'none',
          scrollTrigger: { trigger: '.contact__wall', start: 'top 90%', end: 'top 20%', scrub: 0.6 },
        })
        gsap.from('.contact__card', { y: 50, opacity: 0, duration: 1, scrollTrigger: { trigger: '.contact__wall', start: 'top 15%', once: true } })
      }
    }, el)
    // Le mur se fait glisser (souris ou doigt)
    const viewport = w.parentElement!
    const [drag] = Draggable.create(w, {
      type: 'x,y',
      bounds: { minX: -(w.offsetWidth - viewport.offsetWidth) / 2 - 80, maxX: (w.offsetWidth - viewport.offsetWidth) / 2 + 80, minY: -(w.offsetHeight - viewport.offsetHeight) / 2 - 80, maxY: (w.offsetHeight - viewport.offsetHeight) / 2 + 80 },
      edgeResistance: 0.8,
      dragClickables: false,
      allowContextMenu: true,
      onPress() {
        w.classList.add('is-dragging')
      },
      onRelease() {
        w.classList.remove('is-dragging')
      },
    })
    return () => {
      ctx.revert()
      drag.kill()
    }
  }, [])

  return (
    <section id="contact" ref={root} className="contact" aria-labelledby="contact-title">
      <div className="sec sec--aside contact__ask">
        <Rich as="p" text={contact.question} split className="title poster contact__question" />
      </div>

      <div className="contact__wall">
        <div className="contact__tilt">
          <div ref={wall} className="contact__grid" style={{ '--cols': COLS } as React.CSSProperties}>
            {tiles.map((t) =>
              t.secret ? (
                <button
                  key={t.i}
                  type="button"
                  className={`contact__tile contact__tile--secret${found ? ' is-found' : ''}`}
                  onClick={() => discover('last-grace')}
                  aria-label={found ? 'Dernière grâce (découverte)' : 'Une tuile brille plus que les autres'}
                >
                  <Rune index={7} />
                </button>
              ) : (
                <div key={t.i} className="contact__tile" aria-hidden="true">
                  <img src={t.src} alt="" loading="lazy" draggable={false} />
                </div>
              ),
            )}
          </div>
        </div>
        <div className="contact__shade" aria-hidden="true" />

        <div className="contact__card">
          <Rich as="h2" id="contact-title" text={contact.title} className="poster contact__title" />
          <Brush className="contact__brush" gold />
          <CopyEmail className="contact__copy" />
          <p className="micro">{contact.availability}</p>
          <Socials className="contact__socials" />
        </div>

        <p className="contact__drag annot" aria-hidden="true">
          {contact.drag} <HandArrow />
        </p>
        <button type="button" className="contact__top annot" onClick={() => scrollToTarget(0)}>
          {contact.top}
        </button>
      </div>

      <footer className="footer">
        <p>
          © {new Date().getFullYear()} — {contact.footer}
        </p>
        <div className="footer__actions">
          <button type="button" onClick={() => setCodexOpen(true)}>
            Codex · {progress.found.length}/{total}
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Effacer toutes les découvertes ?')) reset()
            }}
          >
            Réinitialiser la progression
          </button>
        </div>
      </footer>
    </section>
  )
}

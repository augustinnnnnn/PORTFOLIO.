import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { projects, type Project } from '../content/projects'
import { ArrowGlyph } from '../components/Glyphs'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { setScrollLocked } from '../lib/scroll'
import './ProjectPanel.css'

type Props = {
  project: Project
  originRect: DOMRect | null
  onClose: () => void
  onNavigate: (p: Project) => void
}

/** Clip-path qui correspond au rectangle d'origine (la vignette cliquée). */
function insetFrom(rect: DOMRect) {
  const w = window.innerWidth
  const h = window.innerHeight
  return `inset(${Math.max(0, rect.top)}px ${Math.max(0, w - rect.right)}px ${Math.max(0, h - rect.bottom)}px ${Math.max(0, rect.left)}px)`
}

export function ProjectPanel({ project, originRect, onClose, onNavigate }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const closing = useRef(false)
  const index = projects.findIndex((p) => p.id === project.id)
  const next = projects[(index + 1) % projects.length]

  useEffect(() => {
    setScrollLocked(true)
    return () => setScrollLocked(false)
  }, [])

  // Ouverture : l'image s'étend depuis la vignette, puis le contenu monte.
  useEffect(() => {
    const el = root.current
    if (!el) return
    el.scrollTop = 0
    closeBtn.current?.focus({ preventScroll: true })
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()
      tl.fromTo(el, { backgroundColor: 'rgba(11,10,9,0)' }, { backgroundColor: 'rgba(11,10,9,1)', duration: 0.5 })
      if (originRect) {
        tl.fromTo('.panel__cover', { clipPath: insetFrom(originRect) }, { clipPath: 'inset(0px 0px 0px 0px)', duration: 1.2, ease: 'expo.inOut' }, 0)
      } else {
        tl.fromTo('.panel__cover', { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' }, 0)
      }
      tl.from('.panel__cover img', { scale: 1.25, duration: 1.8, ease: 'expo.out' }, 0.2)
        .from('.panel__title .line-mask > span', { yPercent: 110, duration: 1.2, ease: 'expo.out' }, 0.7)
        .from('.panel__fade', { y: 40, opacity: 0, duration: 1, stagger: 0.06 }, 0.85)
    }, el)
    return () => ctx.revert()
  }, [project.id, originRect])

  const close = () => {
    const el = root.current
    if (!el || closing.current) return
    closing.current = true
    if (prefersReducedMotion()) {
      onClose()
      return
    }
    gsap
      .timeline({ onComplete: onClose })
      .to(el.querySelectorAll('.panel__body, .panel__head'), { opacity: 0, y: 20, duration: 0.35, ease: 'power2.in' })
      .to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'expo.inOut' }, 0.15)
  }

  // Échap pour fermer + piège de focus simple.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'Tab' && root.current) {
        const focusables = root.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return createPortal(
    <div ref={root} className="panel" role="dialog" aria-modal="true" aria-labelledby="panel-title">
      <button ref={closeBtn} type="button" className="panel__close" onClick={close}>
        <span>Fermer</span>
        <span className="panel__close-x" aria-hidden="true" />
      </button>

      <div className="panel__cover">
        <img src={project.cover} alt={project.coverAlt} />
        <div className="panel__cover-shade" />
        <div className="panel__head panel__wrap">
          <p className="micro gold panel__fade">
            Projet {String(index + 1).padStart(2, "0")} · {project.year}
          </p>
          <h2 id="panel-title" className="poster panel__title">
            <span className="line-mask">
              <span>{project.title}</span>
            </span>
          </h2>
          <p className="panel__category panel__fade">{project.category}</p>
          {project.placeholder && <span className="placeholder-badge panel__fade">Projet de démonstration — contenu à remplacer</span>}
        </div>
      </div>

      <div className="panel__body panel__wrap">
        <aside className="panel__facts panel__fade">
          <dl>
            {project.client && (
              <div>
                <dt>Client</dt>
                <dd>{project.client}</dd>
              </div>
            )}
            <div>
              <dt>{project.duration ? 'Durée' : 'Année'}</dt>
              <dd>{project.duration ?? project.year}</dd>
            </div>
            {project.role && (
              <div>
                <dt>Rôle</dt>
                <dd>{project.role}</dd>
              </div>
            )}
            <div>
              <dt>Type</dt>
              <dd>{project.category}</dd>
            </div>
            <div>
              <dt>Outils</dt>
              <dd>
                <ul className="work__tags">
                  {project.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          {project.link?.href && (
            <a className="boxbtn" href={project.link.href} target="_blank" rel="noreferrer">
              {project.link.label} <ArrowGlyph />
            </a>
          )}
        </aside>

        <div className="panel__story">
          <p className="panel__summary poster panel__fade">{project.summary}</p>
          <section className="panel__block panel__fade">
            <h3 className="micro">Contexte</h3>
            <p>{project.context}</p>
          </section>
          <section className="panel__block panel__fade">
            <h3 className="micro">Démarche</h3>
            <ol className="panel__steps">
              {project.process.map((s, i) => (
                <li key={s.title}>
                  <span className="panel__step-num">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h4>{s.title}</h4>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
          {project.challenges && (
            <section className="panel__block panel__fade">
              <h3 className="micro">Difficultés &amp; solutions</h3>
              <ul className="panel__challenges">
                {project.challenges.map((c) => (
                  <li key={c.problem}>
                    <span className="panel__problem">{c.problem}</span>
                    <span className="panel__arrow" aria-hidden="true">→</span>
                    <span>{c.solution}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="panel__block panel__fade">
            <h3 className="micro">Résultat</h3>
            <p>{project.result}</p>
            {project.learnings && (
              <p>
                <strong>Ce que j’en retiens : </strong>
                {project.learnings}
              </p>
            )}
          </section>
          {project.improvements && (
            <section className="panel__block panel__fade">
              <h3 className="micro">Avec le recul, j’améliorerais</h3>
              <ul className="panel__list">
                {project.improvements.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      {project.images && (
        <section className="panel__gallery panel__wrap" aria-label="Galerie du projet">
          <h3 className="micro">Galerie</h3>
          {project.images.map((im, i) => (
            <figure key={im.src + i} className={i % 3 === 0 ? 'is-wide' : undefined}>
              <img src={im.src} alt={im.caption} loading="lazy" decoding="async" width={1600} height={1000} />
              <figcaption className="micro">
                <span className="gold">{String(i + 1).padStart(2, '0')}</span> {im.caption}
              </figcaption>
            </figure>
          ))}
        </section>
      )}

      <button type="button" className="panel__next" onClick={() => onNavigate(next)} data-cursor="Suivant">
        <span className="micro">Projet suivant</span>
        <span className="poster panel__next-title">
          {next.title} <ArrowGlyph />
        </span>
      </button>
    </div>,
    document.body,
  )
}

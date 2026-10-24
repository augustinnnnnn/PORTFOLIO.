import { useEffect, useRef, useState } from 'react'
import { projects, type Project } from '../content/projects'
import { worksSection } from '../content/site'
import { Rich } from '../components/Rich'
import { Brush, HandArrow } from '../components/Hand'
import { gsap } from '../lib/motion'
import { revealChars } from '../lib/anim'
import { ProjectPanel } from './ProjectPanel'
import './Works.css'

export type OpenProject = (project: Project, from: HTMLElement | null) => void

/** Panneau projet partagé par le carrousel et la vitrine. */
export function useProjectPanel() {
  const [open, setOpen] = useState<{ project: Project; rect: DOMRect | null; trigger: HTMLElement | null } | null>(null)
  const openProject: OpenProject = (project, from) => {
    const frame = from?.querySelector('img') ?? from
    setOpen({ project, rect: frame?.getBoundingClientRect() ?? null, trigger: from })
  }
  const panel = open && (
    <ProjectPanel
      project={open.project}
      originRect={open.rect}
      onClose={() => {
        const t = open.trigger
        setOpen(null)
        t?.focus({ preventScroll: true })
      }}
      onNavigate={(p) => setOpen({ project: p, rect: null, trigger: open.trigger })}
    />
  )
  return { openProject, panel }
}

/** Carrousel 3D en arc : les projets défilent sur un cylindre au rythme du scroll. */
export function Works({ onOpen }: { onOpen: OpenProject }) {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add({ desk: '(min-width: 900px)', reduce: '(prefers-reduced-motion: reduce)' }, (c) => {
      const { desk, reduce } = c.conditions as { desk: boolean; reduce: boolean }
      revealChars(el, '.works__title')
      revealChars(el, '.works__outro', { start: 'top 90%' })
      if (reduce) return
      const ring = el.querySelector<HTMLElement>('.works__ring')!
      const cards = gsap.utils.toArray<HTMLElement>('.wcard', el)
      const step = desk ? 17 : 26
      const radius = () => (desk ? window.innerWidth * 0.62 : window.innerWidth * 1.1)
      // Rotation PUIS recul : chaque carte se pose sur la face intérieure du cylindre.
      const place = () =>
        cards.forEach((card, i) => {
          card.style.transform = `rotateY(${i * step}deg) translateZ(${-radius()}px)`
        })
      place()
      const span = (cards.length - 1) * step
      gsap.set(ring, { z: radius() })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: desk ? '+=170%' : '+=130%',
          scrub: 0.8,
          pin: el.querySelector('.works__pin'),
          invalidateOnRefresh: true,
          onRefresh: () => {
            place()
            gsap.set(ring, { z: radius() })
          },
        },
      })
      tl.fromTo(ring, { rotateY: step * 2.2 }, { rotateY: -span - step * 0.6, ease: 'none', duration: 1 }, 0)
        .from('.works__outro-wrap', { opacity: 0, y: 40, duration: 0.25 }, 0.55)
    })
    return () => {
      mm.revert()
      el.querySelectorAll<HTMLElement>('.wcard').forEach((c) => (c.style.transform = ''))
    }
  }, [])

  return (
    <section id="projets" ref={root} className="sec sec--aside works" aria-labelledby="projets-title">
      <div className="works__pin">
        <div className="works__head">
          <Rich as="h2" id="projets-title" text={worksSection.title} split className="title poster works__title" />
          <Brush className="works__brush" />
        </div>

        <div className="works__stage">
          <ul className="works__ring">
            {projects.map((p, i) => (
              <li key={p.id} className="wcard">
                <button type="button" className="wcard__btn" onClick={(e) => onOpen(p, e.currentTarget)} aria-label={`Ouvrir le projet ${p.title}`}>
                  <img src={p.coverSmall ?? p.cover} alt={p.coverAlt} loading="lazy" />
                  <span className="wcard__tag poster">
                    <i /> {p.title} / {String(i + 1).padStart(2, '0')}
                  </span>
                  {p.placeholder && <span className="placeholder-badge wcard__badge">Exemple</span>}
                </button>
              </li>
            ))}
          </ul>
          <p className="works__note annot" aria-hidden="true">
            {worksSection.note} <HandArrow />
          </p>
        </div>

        <div className="works__outro-wrap">
          <Rich as="p" text={worksSection.outro} split className="poster works__outro" />
          <Brush className="works__brush works__brush--small" gold />
          <p className="micro works__caption">{worksSection.caption}</p>
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { projects, type Project } from '../content/projects'
import { useGame } from '../game/GameContext'
import { Lines } from '../components/Lines'
import { ArrowGlyph } from '../components/Glyphs'
import { gsap, prefersReducedMotion } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import { ProjectPanel } from './ProjectPanel'
import './Works.css'

const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII']

export function Works() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const bar = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState<{ project: Project; rect: DOMRect | null; trigger: HTMLElement | null } | null>(null)
  const [current, setCurrent] = useState(0)
  const { discover } = useGame()

  useEffect(() => {
    const el = root.current
    const tr = track.current
    if (!el || !tr) return
    const reduced = prefersReducedMotion()
    const mm = gsap.matchMedia()

    mm.add('(min-width: 900px)', () => {
      if (reduced) return
      const distance = () => tr.scrollWidth - window.innerWidth
      const horizontal = gsap.to(tr, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          pin: el.querySelector('.works__pin'),
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`
            setCurrent(Math.min(projects.length - 1, Math.floor(self.progress * projects.length)))
          },
        },
      })
      tr.querySelectorAll<HTMLElement>('.work').forEach((work) => {
        const media = work.querySelector('.work__media')
        const img = work.querySelector('img')
        gsap.fromTo(
          media,
          { clipPath: 'inset(8% 0% 8% 100%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'power2.out',
            scrollTrigger: { containerAnimation: horizontal, trigger: work, start: 'left 95%', end: 'left 45%', scrub: true },
          },
        )
        gsap.fromTo(
          img,
          { xPercent: -10, scale: 1.2 },
          { xPercent: 10, ease: 'none', scrollTrigger: { containerAnimation: horizontal, trigger: work, start: 'left right', end: 'right left', scrub: true } },
        )
        gsap.from(work.querySelectorAll('.work__meta > *'), {
          y: 30,
          opacity: 0,
          stagger: 0.06,
          duration: 1,
          scrollTrigger: { containerAnimation: horizontal, trigger: work, start: 'left 70%' },
        })
      })
      gsap.fromTo(
        tr.querySelectorAll('.work__numeral'),
        { xPercent: 30 },
        { xPercent: -30, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${distance()}`, scrub: true } },
      )
    })

    mm.add('(max-width: 899px)', () => {
      if (reduced) return
      tr.querySelectorAll<HTMLElement>('.work').forEach((work) => {
        gsap.fromTo(
          work.querySelector('.work__media'),
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: work, start: 'top 85%', once: true } },
        )
        gsap.from(work.querySelectorAll('.work__meta > *'), { y: 24, opacity: 0, stagger: 0.06, duration: 1, scrollTrigger: { trigger: work, start: 'top 70%', once: true } })
      })
    })

    return () => mm.revert()
  }, [])

  const openProject = (project: Project, trigger: HTMLElement) => {
    const frame = trigger.querySelector('.work__frame')
    setOpen({ project, rect: frame?.getBoundingClientRect() ?? null, trigger })
    discover('relic')
  }

  return (
    <section id="oeuvres" ref={root} className="works" aria-labelledby="oeuvres-title">
      <div className="works__pin">
        <div className="works__track" ref={track}>
          <header className="works__intro">
            <p className="kicker" data-reveal="fade">
              III — Œuvres forgées
            </p>
            <Lines as="h2" id="oeuvres-title" text={'Les œuvres\nforgées'} className="display works__title" />
            <p className="works__lead" data-reveal="fade">
              Chaque projet est une relique : une image, mais surtout une démarche. Ouvre-les pour découvrir comment ils ont été pensés et construits.
            </p>
            <p className="works__hint label" aria-hidden="true">
              Continue de défiler <ArrowGlyph className="works__hint-arrow" />
            </p>
          </header>

          {projects.map((p, i) => (
            <article key={p.id} className={`work work--${p.layout}`} aria-labelledby={`${p.id}-title`}>
              <span className="work__numeral" aria-hidden="true">
                {roman[i] ?? i + 1}
              </span>
              <button
                type="button"
                className="work__media"
                onClick={(e) => openProject(p, e.currentTarget)}
                data-cursor="Ouvrir"
                aria-label={`Ouvrir le projet ${p.title}`}
              >
                <span className="work__frame">
                  <img src={p.cover} srcSet={p.coverSmall ? `${p.coverSmall} 800w, ${p.cover} 1600w` : undefined} sizes="(min-width: 900px) 55vw, 100vw" alt={p.coverAlt} loading="lazy" decoding="async" width={1600} height={1000} />
                </span>
                {p.placeholder && <span className="placeholder-badge work__badge">Exemple — à remplacer</span>}
              </button>
              <div className="work__meta">
                <p className="work__chapter label">
                  Chapitre {roman[i] ?? i + 1} · {p.year}
                </p>
                <h3 id={`${p.id}-title`} className="work__title display">
                  {p.title}
                </h3>
                <p className="work__category">{p.category}</p>
                <p className="work__summary">{p.summary}</p>
                <ul className="work__tags" aria-label="Technologies">
                  {p.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <aside className="works__end">
            <p className="display works__end-title">D’autres œuvres sont encore dans la forge.</p>
            <a
              href="#contact"
              className="btn"
              onClick={(e) => {
                e.preventDefault()
                scrollToTarget('#contact')
              }}
            >
              Parlons de la prochaine <ArrowGlyph />
            </a>
          </aside>
        </div>

        <div className="works__progress" aria-hidden="true">
          <span className="label">
            {roman[current]} / {roman[projects.length - 1]}
          </span>
          <span className="works__bar">
            <span ref={bar} />
          </span>
        </div>
      </div>

      {open && (
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
      )}
    </section>
  )
}

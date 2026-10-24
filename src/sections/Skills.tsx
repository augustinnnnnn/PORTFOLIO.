import { Fragment, useEffect, useRef, useState } from 'react'
import { skillCategories } from '../content/skills'
import { skillsSection } from '../content/site'
import { HandArrow } from '../components/Hand'
import { ScrollTrigger, gsap, prefersReducedMotion } from '../lib/motion'
import './Skills.css'

export function Skills() {
  const root = useRef<HTMLElement>(null)
  const [open, setOpen] = useState<string | null>(null)

  // Chaque catégorie s'allume lettre par lettre en traversant l'écran.
  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.skill').forEach((row) => {
        gsap.fromTo(
          row.querySelectorAll('.skill__title .ch'),
          { color: '#3b3732' },
          { color: '#ece5d6', stagger: 0.04, ease: 'none', scrollTrigger: { trigger: row, start: 'top 85%', end: 'top 45%', scrub: true } },
        )
        gsap.fromTo(
          row.querySelectorAll('.skill__num, .skill__keys'),
          { opacity: 0.15 },
          { opacity: 1, ease: 'none', scrollTrigger: { trigger: row, start: 'top 80%', end: 'top 50%', scrub: true } },
        )
        gsap.from(row, { xPercent: -6, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'top 40%', scrub: true } })
      })
    }, el)
    return () => ctx.revert()
  }, [])

  // Anime l'ouverture du détail, puis recalcule les déclencheurs situés plus bas
  // (la page a changé de hauteur).
  useEffect(() => {
    const panel = open ? root.current?.querySelector(`#skill-${open}`) : null
    if (!panel || prefersReducedMotion()) {
      ScrollTrigger.refresh()
      return
    }
    gsap.fromTo(panel, { height: 0, opacity: 0 }, { height: 'auto', opacity: 1, duration: 0.7, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() })
    gsap.from(panel.querySelectorAll('li'), { y: 20, opacity: 0, stagger: 0.05, duration: 0.6, delay: 0.1 })
  }, [open])

  const toggle = (id: string) => setOpen((o) => (o === id ? null : id))

  return (
    <section id="competences" ref={root} className="sec sec--aside skills" aria-labelledby="competences-title">
      <h2 id="competences-title" className="sr-only">
        Compétences
      </h2>
      <p className="skills__hint micro">{skillsSection.hint}</p>
      <ol className="skills__list">
        {skillCategories.map((c, i) => (
          <li key={c.id} className="skill" style={{ '--i': i } as React.CSSProperties}>
            <button
              type="button"
              className={`skill__head${open === c.id ? ' is-open' : ''}`}
              aria-expanded={open === c.id}
              aria-controls={`skill-${c.id}`}
              onClick={() => toggle(c.id)}
            >
              <span className="skill__num poster">{String(i + 1).padStart(2, '0')}</span>
              <span className="skill__title poster" aria-label={c.title}>
                {c.title.split(' ').map((w, wi) => (
                  <Fragment key={wi}>
                    <span className="wd" aria-hidden="true">
                      {[...w].map((ch, ci) => (
                        <span className="ch" key={ci}>
                          {ch}
                        </span>
                      ))}
                    </span>{' '}
                  </Fragment>
                ))}
              </span>
              <span className="skill__plus" aria-hidden="true" />
            </button>
            <p className="skill__keys">
              {c.skills.map((s) => s.name).join('  ·  ')}
            </p>
            {i === skillCategories.length - 1 && (
              <p className="skill__note annot" aria-hidden="true">
                {skillsSection.note} <HandArrow direction="right" />
              </p>
            )}
            {open === c.id && (
              <div id={`skill-${c.id}`} className="skill__detail">
                <p className="skill__summary">{c.summary}</p>
                <ul>
                  {c.skills.map((s) => (
                    <li key={s.name}>
                      <span className="skill__glyph poster">{s.glyph}</span>
                      <div>
                        <h3 className="poster">{s.name}</h3>
                        <p>{s.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}

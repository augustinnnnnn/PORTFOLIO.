import { useEffect, useRef, useState } from 'react'
import { skillCategories } from '../content/skills'
import { useGame } from '../game/GameContext'
import { SectionHeading } from '../components/Lines'
import { Rune } from '../components/Glyphs'
import { gsap, prefersReducedMotion } from '../lib/motion'
import './Arsenal.css'

export function Arsenal() {
  const root = useRef<HTMLElement>(null)
  const grid = useRef<HTMLUListElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [catIndex, setCatIndex] = useState(0)
  const [itemIndex, setItemIndex] = useState(0)
  const { inspectCategory, progress } = useGame()
  const category = skillCategories[catIndex]
  const item = category.skills[Math.min(itemIndex, category.skills.length - 1)]

  // La première catégorie compte comme inspectée quand la section est vue.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          inspectCategory(skillCategories[0].id, skillCategories.length)
          io.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [inspectCategory])

  // Les emplacements apparaissent en cascade à chaque changement de catégorie.
  useEffect(() => {
    if (!grid.current || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      grid.current.children,
      { opacity: 0, y: 24, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.05, ease: 'expo.out' },
    )
    return () => {
      tween.kill()
    }
  }, [catIndex])

  // Fondu de l'inspection quand l'objet change.
  useEffect(() => {
    if (!panel.current || prefersReducedMotion()) return
    const tween = gsap.fromTo(
      panel.current.querySelectorAll('[data-inspect]'),
      { opacity: 0, x: 14 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.04, ease: 'power3.out' },
    )
    return () => {
      tween.kill()
    }
  }, [catIndex, itemIndex])

  const selectCategory = (i: number) => {
    setCatIndex(i)
    setItemIndex(0)
    inspectCategory(skillCategories[i].id, skillCategories.length)
  }

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    const next = (i + dir + skillCategories.length) % skillCategories.length
    selectCategory(next)
    root.current?.querySelector<HTMLButtonElement>(`#tab-${skillCategories[next].id}`)?.focus()
  }

  return (
    <section id="arsenal" ref={root} className="section arsenal" aria-labelledby="arsenal-title">
      <span className="section-index" aria-hidden="true">
        II
      </span>
      <div className="container">
        <SectionHeading kicker="II — Arsenal" title={'Mon\narsenal'} id="arsenal-title" />
        <p className="arsenal__intro" data-reveal="fade">
          Survole ou sélectionne un emplacement pour l’inspecter.
          <span className="arsenal__count">
            {progress.inspected.length} / {skillCategories.length} catégories inspectées
          </span>
        </p>

        <div className="arsenal__layout" data-reveal="fade">
          <div className="arsenal__cats" role="tablist" aria-label="Catégories de compétences" aria-orientation="vertical">
            {skillCategories.map((c, i) => (
              <button
                key={c.id}
                id={`tab-${c.id}`}
                type="button"
                role="tab"
                aria-selected={i === catIndex}
                aria-controls="arsenal-panel"
                tabIndex={i === catIndex ? 0 : -1}
                className={`arsenal__cat${i === catIndex ? ' is-active' : ''}${progress.inspected.includes(c.id) ? ' is-seen' : ''}`}
                onClick={() => selectCategory(i)}
                onKeyDown={(e) => onTabKey(e, i)}
              >
                <Rune index={i + 2} className="arsenal__cat-rune" />
                <span className="arsenal__cat-text">
                  <span className="arsenal__cat-slot">{c.slot}</span>
                  <span className="arsenal__cat-title">{c.title}</span>
                </span>
                <span className="arsenal__cat-num">{String(c.skills.length).padStart(2, '0')}</span>
              </button>
            ))}
          </div>

          <div id="arsenal-panel" role="tabpanel" aria-labelledby={`tab-${category.id}`} className="arsenal__slots">
            <p className="arsenal__summary">{category.summary}</p>
            <ul ref={grid} className="arsenal__grid">
              {category.skills.map((s, i) => (
                <li key={s.name}>
                  <button
                    type="button"
                    className={`arsenal__slot${i === itemIndex ? ' is-active' : ''}`}
                    aria-pressed={i === itemIndex}
                    onMouseEnter={() => setItemIndex(i)}
                    onFocus={() => setItemIndex(i)}
                    onClick={() => setItemIndex(i)}
                  >
                    <span className="arsenal__glyph">{s.glyph}</span>
                    <span className="arsenal__slot-name">{s.name}</span>
                  </button>
                </li>
              ))}
              {Array.from({ length: Math.max(0, 6 - category.skills.length) }, (_, i) => (
                <li key={`empty-${i}`} aria-hidden="true">
                  <span className="arsenal__slot arsenal__slot--empty" />
                </li>
              ))}
            </ul>
          </div>

          <div ref={panel} className="arsenal__inspect" aria-live="polite">
            <div className="arsenal__inspect-head">
              <span className="arsenal__inspect-glyph" data-inspect>
                {item.glyph}
              </span>
              <div>
                <h3 className="arsenal__inspect-name" data-inspect>
                  {item.name}
                </h3>
                <p className="arsenal__inspect-kind" data-inspect>
                  {item.kind} — {category.slot}
                </p>
              </div>
            </div>
            <div className="ornament" data-inspect>
              <i />
            </div>
            <p className="arsenal__inspect-desc" data-inspect>
              {item.description}
            </p>
            <div data-inspect>
              <p className="label">Usages</p>
              <ul className="arsenal__uses">
                {item.uses.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

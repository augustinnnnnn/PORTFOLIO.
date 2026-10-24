import { useEffect, useRef, useState } from 'react'
import { projects } from '../content/projects'
import { journey } from '../content/journey'
import { showcaseSection } from '../content/site'
import { Rich } from '../components/Rich'
import { Brush, HandArrow, Scribble } from '../components/Hand'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { revealChars, revealUp } from '../lib/anim'
import type { OpenProject } from './Works'
import './Showcase.css'

const featured = projects.find((p) => p.featured) ?? projects[0]
const gallery = featured.gallery?.length ? featured.gallery : [{ src: featured.cover, caption: featured.title }]

export function Showcase({ onOpen }: { onOpen: OpenProject }) {
  const root = useRef<HTMLElement>(null)
  const [slide, setSlide] = useState(0)
  const [full, setFull] = useState(false)

  // Le parcours déplié change la hauteur de la page.
  useEffect(() => {
    ScrollTrigger.refresh()
  }, [full])

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = prefersReducedMotion()
    const ctx = gsap.context(() => {
      revealChars(el, '.show__heading')
      revealUp(el, '.show__claim, .show__facts, .show__exp')
      if (reduce) return

      // 1. Le grand mot s'assemble lettre par lettre
      const chars = gsap.utils.toArray<HTMLElement>('.show__word .ch')
      gsap.fromTo(
        chars,
        {
          yPercent: () => gsap.utils.random(-90, 90),
          xPercent: () => gsap.utils.random(-40, 40),
          rotate: () => gsap.utils.random(-35, 35),
          opacity: 0.25,
          color: '#5a3f17',
        },
        {
          yPercent: 0,
          xPercent: 0,
          rotate: 0,
          opacity: 1,
          color: '#d9a94f',
          ease: 'power2.out',
          stagger: { each: 0.03, from: 'random' },
          scrollTrigger: { trigger: '.show__word', start: 'top 95%', end: 'top 35%', scrub: 0.8 },
        },
      )

      // 2. Galerie épinglée : une image par palier de scroll
      const slides = gsap.utils.toArray<HTMLElement>('.show__slide')
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.show__gallery',
          start: 'top top',
          end: () => `+=${slides.length * 55}%`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => setSlide(Math.min(slides.length - 1, Math.floor(self.progress * slides.length * 0.999))),
        },
      })
      slides.forEach((s, i) => {
        if (i === 0) return
        tl.fromTo(s, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1, ease: 'power2.inOut' })
          .fromTo(s.querySelector('img'), { scale: 1.3, xPercent: 10 }, { scale: 1, xPercent: 0, duration: 1, ease: 'power2.out' }, '<')
          .to(slides[i - 1].querySelector('img'), { scale: 0.92, opacity: 0.4, duration: 1 }, '<')
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="vitrine" ref={root} className="sec sec--aside show" aria-labelledby="vitrine-title">
      <p className="show__eyebrow">
        <span className="micro">Projet phare / {featured.year}</span>
        <span className="hand gold"> → {featured.category}</span>
      </p>
      <div className="show__word-wrap">
        <HandArrow className="show__word-arrow" />
        <h2 id="vitrine-title" className="show__word poster" aria-label={featured.title}>
          {[...featured.title.toUpperCase()].map((c, i) => (
            <span className="ch" key={i} aria-hidden="true">
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </h2>
        <Brush className="show__brush" />
      </div>
      <div className="show__claim">
        <p className="poster">{showcaseSection.claim}</p>
        <p className="micro">{showcaseSection.claimNote}</p>
      </div>
      <div className="show__facts">
        <dl>
          <div>
            <dt className="micro gold">Année</dt>
            <dd>{featured.year}</dd>
          </div>
          <div>
            <dt className="micro gold">Type</dt>
            <dd>{featured.category}</dd>
          </div>
          <div>
            <dt className="micro gold">Outils</dt>
            <dd>{featured.tags.join(', ')}</dd>
          </div>
        </dl>
        <p className="hand show__down">
          {showcaseSection.showcase} <span aria-hidden="true">↓</span>
        </p>
      </div>

      <div className="show__gallery">
        <div className="show__gallery-head">
          <div>
            <p className="micro">
              {featured.title} / {featured.year}
            </p>
            <Rich as="p" text={showcaseSection.heading} className="poster show__heading title" split />
          </div>
          <button type="button" className="scribble hand show__enter" onClick={(e) => onOpen(featured, e.currentTarget)}>
            <Scribble>{showcaseSection.enter} ↗</Scribble>
          </button>
        </div>
        <div className="show__gallery-body">
          <div className="show__counter">
            <p className="poster">
              <span className="gold">{String(slide + 1).padStart(2, '0')}</span> / {String(gallery.length).padStart(2, '0')}
            </p>
            <p className="hand">{showcaseSection.scroll} →</p>
          </div>
          <div className="show__frame">
            {gallery.map((g, i) => (
              <figure className="show__slide" key={g.src + i} aria-hidden={i !== slide}>
                <img src={g.src} alt={g.caption} loading="lazy" />
                <figcaption className="micro">
                  <span className="gold">● {String(i + 1).padStart(2, '0')}</span> {g.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      <div className="show__exp">
        <ul className={`show__grid${full ? ' is-full' : ''}`}>
          {journey.map((j, i) => (
            <li key={j.title + i}>
              <p className="micro">
                {j.period} <span className="gold">→</span> {j.kind}
              </p>
              <h3 className="poster">{j.title}</h3>
              {j.place && <p className="micro show__place">{j.place}</p>}
              <p className="show__text">{j.text}</p>
            </li>
          ))}
        </ul>
        <div className="show__exp-side">
          <button type="button" className="scribble hand" aria-expanded={full} onClick={() => setFull((f) => !f)}>
            <Scribble>{full ? 'replier' : showcaseSection.experienceCta} ↗</Scribble>
          </button>
        </div>
      </div>
    </section>
  )
}

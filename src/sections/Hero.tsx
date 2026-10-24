import { useEffect, useRef } from 'react'
import { hero, profile } from '../content/site'
import { Brush, HandArrow } from '../components/Hand'
import { NameMark } from '../components/NameMark'
import { Socials } from '../components/Sidebar'
import { gsap, isFinePointer, prefersReducedMotion } from '../lib/motion'
import './Hero.css'

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  // État initial (avant la fin du chargement)
  useEffect(() => {
    const el = root.current
    if (!el || prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.set('.hero__backdrop', { opacity: 1, scale: 1.08 })
      gsap.set('.hero__orb', { scale: 0.6, opacity: 0 })
      gsap.set('.hero__note, .hero__scroll, .hero__socials', { opacity: 0, y: 16 })
      gsap.set('.hero__brush', { clipPath: 'inset(0 100% 0 0)' })
      gsap.set(['.hero__name', '[data-flyer="name"] .namemark'], { opacity: 0, y: 60 })
      gsap.set(['.hero__portrait', '[data-flyer="portrait"]'], { clipPath: 'inset(100% 0 0 0)' })
    })
    return () => ctx.revert()
  }, [])

  // Entrée en scène
  useEffect(() => {
    const el = root.current
    if (!el || !ready || prefersReducedMotion()) return
    const tl = gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .to('.hero__backdrop', { opacity: 0, scale: 1, duration: 2.2, ease: 'power2.inOut' }, 0.4)
      .to('.hero__orb', { scale: 1, opacity: 1, duration: 2.2 }, 1.2)
      .to(['.hero__name', '[data-flyer="name"] .namemark'], { opacity: 1, y: 0, duration: 1.4 }, 0)
      .to(['.hero__portrait', '[data-flyer="portrait"]'], { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut' }, 0.1)
      .to('.hero__brush', { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.inOut' }, 0.5)
      .to('.hero__note, .hero__scroll, .hero__socials', { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.7)
    return () => {
      tl.progress(1).kill()
    }
  }, [ready])

  // L'orbe suit doucement la souris
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return
    const orb = root.current?.querySelector('.hero__orb-inner')
    if (!orb) return
    const x = gsap.quickTo(orb, 'x', { duration: 2, ease: 'power3.out' })
    const y = gsap.quickTo(orb, 'y', { duration: 2, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      x((e.clientX / window.innerWidth - 0.5) * 40)
      y((e.clientY / window.innerHeight - 0.5) * 30)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <section id="accueil" ref={root} className="hero" aria-label="Accueil">
      <div className="hero__backdrop" aria-hidden="true">
        <img src={hero.backdrop} alt="" />
      </div>
      <div className="hero__orb" aria-hidden="true">
        <div className="hero__orb-inner" data-speed="0.7">
          <img src={hero.backdrop} alt="" />
        </div>
      </div>

      <div className="hero__stage">
        <p className="hero__note hand">
          <HandArrow direction="down-left" className="hero__note-arrow" />
          {hero.note}
        </p>
        <div className="hero__row">
          <NameMark as="h1" className="hero__name hero-name" />
          <figure className="hero__portrait">
            <img src={profile.portrait.src} alt={profile.portrait.alt} />
          </figure>
        </div>
        <div className="hero__bottom">
          <a href="#profil" className="hero__scroll hand">
            <span aria-hidden="true">↓</span> {hero.scroll}
          </a>
          <Brush className="hero__brush" />
          <Socials className="hero__socials" />
        </div>
      </div>
    </section>
  )
}

import { useEffect, useRef, useState } from 'react'
import { navigation, profile } from '../content/site'
import { useGame } from '../game/GameContext'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion'
import { scrollToTarget, setScrollLocked } from '../lib/scroll'
import { GraceSigil } from './Glyphs'
import './Nav.css'

const HOLD_DURATION = 1.4

export function Nav({ active }: { active: string }) {
  const header = useRef<HTMLElement>(null)
  const ring = useRef<SVGCircleElement>(null)
  const hold = useRef<gsap.core.Tween | null>(null)
  const pressStart = useRef(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [praying, setPraying] = useState(false)
  const { discover, isFound } = useGame()

  // Masque la barre en descendant, la réaffiche en remontant.
  useEffect(() => {
    const el = header.current
    if (!el) return
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const hide = self.direction === 1 && self.scroll() > window.innerHeight * 0.6
        el.classList.toggle('is-hidden', hide)
        document.documentElement.classList.toggle('is-scrolling-down', hide)
        el.classList.toggle('is-scrolled', self.scroll() > 40)
      },
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    setScrollLocked(menuOpen)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // ----- Secret : maintenir le sceau (souris, toucher ou clavier) -----
  const startHold = () => {
    pressStart.current = performance.now()
    if (!ring.current) return
    setPraying(true)
    hold.current?.kill()
    hold.current = gsap.to(ring.current, {
      strokeDashoffset: 0,
      duration: prefersReducedMotion() ? 0.01 : HOLD_DURATION,
      ease: 'none',
      onComplete: () => {
        discover('threshold')
        gsap.to(ring.current, { strokeDashoffset: 1, duration: 0.8, delay: 0.6, ease: 'power2.inOut' })
        setPraying(false)
      },
    })
  }
  const endHold = (allowClick: boolean) => {
    const short = performance.now() - pressStart.current < 300
    setPraying(false)
    if (hold.current && hold.current.progress() < 1) {
      hold.current.kill()
      gsap.to(ring.current, { strokeDashoffset: 1, duration: 0.4, ease: 'power2.out' })
      if (short && allowClick) scrollToTarget(0)
    }
  }

  const go = (id: string) => {
    setMenuOpen(false)
    window.setTimeout(() => scrollToTarget(`#${id}`), menuOpen ? 450 : 0)
  }

  return (
    <header ref={header} className={`nav${menuOpen ? ' is-open' : ''}`}>
      <div className="nav__bar">
        <button
          type="button"
          className={`nav__seal${praying ? ' is-praying' : ''}${isFound('threshold') ? ' is-blessed' : ''}`}
          aria-label={`${profile.firstName} — retour en haut (maintenir pour prier)`}
          onPointerDown={startHold}
          onPointerUp={() => endHold(true)}
          onPointerLeave={() => endHold(false)}
          onPointerCancel={() => endHold(false)}
          onContextMenu={(e) => e.preventDefault()}
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
              e.preventDefault()
              startHold()
            }
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter' || e.key === ' ') endHold(true)
          }}
        >
          <span className="nav__sigil">
            <GraceSigil />
            <svg viewBox="0 0 48 48" className="nav__hold" aria-hidden="true">
              <circle ref={ring} cx="24" cy="24" r="22" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
            </svg>
          </span>
          <span className="nav__name">{profile.firstName}</span>
        </button>

        <nav className="nav__links" aria-label="Sections">
          <ul>
            {navigation.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={active === item.id ? 'is-active' : undefined}
                  aria-current={active === item.id ? 'location' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    go(item.id)
                  }}
                >
                  <span className="nav__numeral">{item.numeral}</span>
                  <span className="nav__label" data-text={item.label}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="sr-only">{menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
          <span className="nav__burger-text" aria-hidden="true">
            {menuOpen ? 'Fermer' : 'Menu'}
          </span>
          <span className="nav__burger-lines" aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </div>

      <div id="mobile-menu" className="nav__menu" hidden={!menuOpen}>
        <ul>
          {navigation.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault()
                  go(item.id)
                }}
              >
                <span className="nav__numeral">{item.numeral}</span>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ornament nav__menu-ornament">
          <i />
        </div>
      </div>
    </header>
  )
}

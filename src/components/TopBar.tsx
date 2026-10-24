import { useEffect, useState } from 'react'
import { navigation, profile } from '../content/site'
import { scrollToTarget, setScrollLocked } from '../lib/scroll'
import { CycleWords } from './CycleWords'
import './TopBar.css'

export function Tagline({ className }: { className?: string }) {
  return (
    <p className={`tagline poster ${className ?? ''}`}>
      Code / Design / <CycleWords words={profile.cycleWords} className="tagline__word" />
    </p>
  )
}

export function NavLinks({ active, onGo, className }: { active: string; onGo: (id: string) => void; className?: string }) {
  return (
    <ul className={`navlinks ${className ?? ''}`}>
      {navigation.map((item, i) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            className={active === item.id ? 'is-active' : undefined}
            aria-current={active === item.id ? 'location' : undefined}
            onClick={(e) => {
              e.preventDefault()
              onGo(item.id)
            }}
          >
            <span className="navlinks__num">{String(i + 1).padStart(2, '0')}</span>
            <span className="navlinks__label">{item.label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** Barre du haut : slogan à gauche, navigation à droite (menu plein écran sur mobile). */
export function TopBar({ active }: { active: string }) {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    setScrollLocked(open)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const go = (id: string) => {
    const wasOpen = open
    setOpen(false)
    window.setTimeout(() => scrollToTarget(`#${id}`), wasOpen ? 350 : 0)
  }

  return (
    <header className={`topbar${open ? ' is-open' : ''}`}>
      <div className="topbar__left">
        <a href="#accueil" className="topbar__tagline" data-fly="tagline" aria-label="Retour au début" onClick={(e) => { e.preventDefault(); go('accueil') }}>
          <Tagline />
        </a>
        <p className="micro topbar__index" data-fly-fade>
          Index — Portfolio / {profile.year}
        </p>
      </div>
      <nav className="topbar__nav" aria-label="Sections" data-fly-fade>
        <NavLinks active={active} onGo={go} />
      </nav>
      <button type="button" className="topbar__burger" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">{open ? 'Fermer le menu' : 'Ouvrir le menu'}</span>
        <i aria-hidden="true" />
        <i aria-hidden="true" />
      </button>
      <div id="mobile-menu" className="topbar__menu" hidden={!open}>
        <NavLinks active={active} onGo={go} className="navlinks--big" />
      </div>
    </header>
  )
}

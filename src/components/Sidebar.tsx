import { useState } from 'react'
import { contact, profile } from '../content/site'
import { projects } from '../content/projects'
import { scrollToTarget } from '../lib/scroll'
import { Icon } from './Glyphs'
import { Brush } from './Hand'
import { FragmentBadge, NavLinks, Tagline } from './TopBar'
import { NameMark } from './NameMark'
import './Sidebar.css'

export function CopyEmail({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }
  return (
    <div className={`copymail ${className ?? ''}`}>
      <a href={`mailto:${contact.email}`} className="copymail__mail">
        {contact.email}
      </a>
      <button type="button" className="copymail__btn" onClick={copy} aria-label="Copier l’adresse e-mail">
        <Icon name={copied ? 'mail' : 'copy'} />
      </button>
      <span className={`copymail__copied${copied ? ' is-on' : ''}`} aria-live="polite">
        {copied ? 'Copiée' : ''}
      </span>
    </div>
  )
}

export function Socials({ className }: { className?: string }) {
  return (
    <ul className={`socials ${className ?? ''}`}>
      {contact.links.map((l) => (
        <li key={l.label}>
          <a href={l.href} target="_blank" rel="noreferrer" aria-label={l.label}>
            <Icon name={l.icon} />
          </a>
        </li>
      ))}
      <li>
        <a href={`mailto:${contact.email}`} aria-label="E-mail">
          <Icon name="mail" />
        </a>
      </li>
    </ul>
  )
}

/**
 * Barre latérale fixe (ordinateur). Le nom, le slogan et le portrait du hero
 * viennent s'y poser au scroll : les emplacements [data-slot] servent de cibles.
 */
export function Sidebar({ active, mode }: { active: string; mode: 'portrait' | 'works' }) {
  const thumbs = projects.slice(0, 6)
  return (
    <aside className={`sidebar sidebar--${mode}`} aria-label="Profil">
      <div className="sidebar__name-slot" data-slot="name">
        <NameMark className="sidebar__name-static" />
      </div>
      <div className="sidebar__brush" data-side-fade>
        <Brush />
      </div>
      <div className="sidebar__tagline-slot" data-slot="tagline">
        <Tagline className="sidebar__tagline-static" />
      </div>
      <div className="sidebar__body" data-side-fade>
        <Socials />
        <p className="sidebar__role">
          {profile.role}
          <br />
          <span>{profile.stack}</span>
        </p>
        <p className="sidebar__meta">
          <span>
            <Icon name="pin" /> {profile.location}
          </span>
          <span>
            <Icon name="globe" /> {profile.availability}
          </span>
        </p>
        <nav aria-label="Sections (barre latérale)" className="sidebar__nav">
          <NavLinks active={active} onGo={(id) => scrollToTarget(`#${id}`)} className="navlinks--grid" />
          <FragmentBadge />
        </nav>
      </div>
      <div className="sidebar__media" data-side-fade>
        <div className="sidebar__portrait-slot" data-slot="portrait">
          <img className="sidebar__portrait-static" src={profile.portrait.src} alt={profile.portrait.alt} />
          <span className="sidebar__portrait-label poster">Portrait / 01</span>
        </div>
        <ul className="sidebar__thumbs" aria-hidden={mode !== 'works'}>
          {thumbs.map((p, i) => (
            <li key={p.id} style={{ transitionDelay: `${i * 0.05}s` }}>
              <img src={p.coverSmall ?? p.cover} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
        <span className="sidebar__vtag poster">
          {mode === 'works' ? 'Œuvres / en forge' : profile.portrait.tag}
        </span>
      </div>
      <div data-side-fade>
        <CopyEmail />
      </div>
    </aside>
  )
}

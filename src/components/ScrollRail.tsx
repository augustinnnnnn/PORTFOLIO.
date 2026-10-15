import { useEffect, useRef } from 'react'
import { navigation } from '../content/site'
import { ScrollTrigger } from '../lib/motion'
import { scrollToTarget } from '../lib/scroll'
import './ScrollRail.css'

/** Rail vertical (desktop) : progression dans la page + accès aux sections. */
export function ScrollRail({ active }: { active: string }) {
  const fill = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (fill.current) fill.current.style.transform = `scaleY(${self.progress})`
      },
    })
    return () => st.kill()
  }, [])
  return (
    <nav className="rail" aria-label="Progression dans la page">
      <span className="rail__track" aria-hidden="true">
        <span ref={fill} className="rail__fill" />
      </span>
      <ul>
        {navigation.map((n) => (
          <li key={n.id}>
            <button type="button" className={active === n.id ? 'is-active' : undefined} onClick={() => scrollToTarget(`#${n.id}`)} aria-label={`Aller à ${n.label}`}>
              <span className="rail__label">{n.label}</span>
              <span className="rail__tick" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

import { useRef, type HTMLAttributes } from 'react'
import { profile } from '../content/site'
import { useGame } from '../game/GameContext'
import { gsap, prefersReducedMotion } from '../lib/motion'
import './NameMark.css'

const HOLD = 1.4

/**
 * Le nom (prénom + nom en or). Secret : le maintenir enfoncé le remplit d'or
 * (souris, toucher ou clavier) et libère un fragment.
 */
export function NameMark({ className, as = 'p', ...rest }: { className?: string; as?: 'p' | 'h1' } & HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLButtonElement>(null)
  const tween = useRef<gsap.core.Tween | null>(null)
  const { discover, isFound } = useGame()
  const Tag = as
  const found = isFound('threshold')

  const start = () => {
    const el = ref.current
    if (!el || found) return
    tween.current?.kill()
    tween.current = gsap.to(el, {
      '--hold': 1,
      duration: prefersReducedMotion() ? 0.01 : HOLD,
      ease: 'none',
      onComplete: () => discover('threshold'),
    })
  }
  const stop = () => {
    if (!ref.current || !tween.current || tween.current.progress() === 1) return
    tween.current.kill()
    gsap.to(ref.current, { '--hold': 0, duration: 0.4 })
  }

  return (
    <Tag className={`namemark poster ${found ? 'is-blessed' : ''} ${className ?? ''}`} {...rest}>
      <button
        ref={ref}
        type="button"
        className="namemark__btn"
        aria-label={`${profile.firstName} ${profile.lastName}`.trim() + (found ? '' : ' — maintenir pour révéler un secret')}
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
            e.preventDefault()
            start()
          }
        }}
        onKeyUp={(e) => (e.key === 'Enter' || e.key === ' ') && stop()}
      >
        <span className="namemark__first glitch" data-text={profile.firstName}>
          {profile.firstName}
        </span>
        {profile.lastName && (
          <span className="namemark__last glitch" data-text={profile.lastName}>
            {profile.lastName}
          </span>
        )}
      </button>
    </Tag>
  )
}

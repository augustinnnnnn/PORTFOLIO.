import type { HTMLAttributes } from 'react'
import { profile } from '../content/site'
import './NameMark.css'

/** Le nom (prénom + nom en or), avec un léger effet de glitch. */
export function NameMark({ className, as = 'p', ...rest }: { className?: string; as?: 'p' | 'h1' } & HTMLAttributes<HTMLElement>) {
  const Tag = as
  return (
    <Tag className={`namemark poster ${className ?? ''}`} {...rest}>
      <span className="namemark__first glitch" data-text={profile.firstName}>
        {profile.firstName}
      </span>
      {profile.lastName && (
        <span className="namemark__last glitch" data-text={profile.lastName}>
          {profile.lastName}
        </span>
      )}
    </Tag>
  )
}

/** Éléments « dessinés à la main » : coup de pinceau, flèches, cercle griffonné. */

export function Brush({ className, gold = false }: { className?: string; gold?: boolean }) {
  return (
    <svg className={`brush ${className ?? ''}`} viewBox="0 0 600 26" preserveAspectRatio="none" aria-hidden="true">
      <g fill={gold ? 'var(--gold)' : 'var(--bone)'}>
        <path d="M3 15 C 90 9, 210 7, 330 8 C 430 9, 520 8, 597 9 L 596 14 C 500 14, 420 15, 320 15 C 200 16, 100 18, 5 21 Z" />
        <path d="M30 18 C 160 15, 300 14, 470 14 L 470 15.5 C 300 16, 160 18, 32 20 Z" opacity="0.55" />
        <path d="M120 10 C 260 7, 420 6, 560 7 L 559 8.4 C 420 8, 260 9, 122 11.5 Z" opacity="0.4" />
      </g>
    </svg>
  )
}

export function HandArrow({ className, direction = 'up-right' }: { className?: string; direction?: 'up-right' | 'down' | 'right' | 'down-left' }) {
  const rot = { 'up-right': 0, right: 40, down: 130, 'down-left': 200 }[direction]
  return (
    <svg className={`hand-arrow ${className ?? ''}`} viewBox="0 0 60 60" aria-hidden="true" style={{ transform: `rotate(${rot}deg)` }}>
      <path
        d="M8 52 C 18 40, 30 26, 48 12 M33 11 C 39 11, 44 10, 50 9 C 49 15, 48 20, 48 26"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Cercle griffonné autour d'un texte (le texte est l'enfant). */
export function Scribble({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`scribble ${className ?? ''}`}>
      {children}
      <svg viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true">
        <path
          d="M18 34 C 14 14, 120 4, 196 16 C 222 22, 214 46, 150 52 C 90 58, 16 54, 8 38 C 2 24, 60 10, 140 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

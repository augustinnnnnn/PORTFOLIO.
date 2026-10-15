import type { SVGProps } from 'react'

/** Sceau de grâce : le motif central du site (logo, chargement, contact). */
export function GraceSigil({ className, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" {...rest}>
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <circle className="sigil-ring" cx="50" cy="50" r="34" pathLength={1} />
        <circle className="sigil-ring sigil-ring--inner" cx="50" cy="50" r="22" pathLength={1} opacity="0.55" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2
          const long = i % 3 === 0
          const r1 = long ? 6 : 38
          const r2 = long ? 49 : 44
          return (
            <line
              key={i}
              className="sigil-ray"
              x1={50 + Math.cos(a) * r1}
              y1={50 + Math.sin(a) * r1}
              x2={50 + Math.cos(a) * r2}
              y2={50 + Math.sin(a) * r2}
              opacity={long ? 0.9 : 0.5}
              pathLength={1}
            />
          )
        })}
        <path className="sigil-core" d="M50 40 L60 50 L50 60 L40 50 Z" fill="currentColor" stroke="none" />
      </g>
    </svg>
  )
}

const runePaths = [
  'M12 3v18M12 9 7 4M12 9l5-5M12 15l-4 3M12 15l4 3',
  'M12 2v20M7 12a5 5 0 1 0 10 0 5 5 0 1 0-10 0',
  'M12 4l7 14H5zM12 4v16',
  'M6 4l12 16M18 4 6 20M12 2v6',
  'M5 18a7 7 0 0 1 14 0M12 4v14M9 7h6',
  'M6 4l6 6-6 6 6 6M18 4v16',
  'M8 3v18M16 3v18M8 12h8M5 6h14',
  'M12 3l7 9-7 9-7-9zM12 9v6',
]

/** Runes originales (aucune reprise de symbole existant). */
export function Rune({ index, className, ...rest }: { index: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" {...rest}>
      <path d={runePaths[index % runePaths.length]} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 12h15M14 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

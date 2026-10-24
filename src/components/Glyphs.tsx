export function ArrowGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M4 12h15M14 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Icon({ name, className }: { name: 'linkedin' | 'github' | 'link' | 'mail' | 'copy' | 'pin' | 'globe'; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === 'linkedin' && (
        <g {...common}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
        </g>
      )}
      {name === 'github' && (
        <path
          {...common}
          d="M9 19c-4 1.3-4-2-6-2.5M15 21v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 2.8 5.8 3.1 5.8 3.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
        />
      )}
      {name === 'link' && <path {...common} d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />}
      {name === 'mail' && (
        <g {...common}>
          <rect x="3" y="5" width="18" height="14" rx="1.5" />
          <path d="m3.5 6 8.5 7 8.5-7" />
        </g>
      )}
      {name === 'copy' && (
        <g {...common}>
          <rect x="8" y="8" width="12" height="12" rx="1.5" />
          <path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" />
        </g>
      )}
      {name === 'pin' && (
        <g {...common}>
          <path d="M12 21s-6-5.3-6-10a6 6 0 0 1 12 0c0 4.7-6 10-6 10Z" />
          <circle cx="12" cy="11" r="2" />
        </g>
      )}
      {name === 'globe' && (
        <g {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
        </g>
      )}
    </svg>
  )
}

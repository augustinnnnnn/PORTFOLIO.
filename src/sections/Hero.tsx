import { useEffect, useMemo, useRef, useState } from 'react'
import { heroOutro, profile } from '../content/site'
import { useGame } from '../game/GameContext'
import { EmberField } from '../components/EmberField'
import { Rune } from '../components/Glyphs'
import { gsap, isDesktop, isFinePointer, prefersReducedMotion } from '../lib/motion'
import { GATE_FOCUS, columnPath, columns, gateOpening, gatePath, ridgePath } from './heroScene'
import './Hero.css'

const toRoman = (n: number) =>
  [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ].reduce((acc, [v, s]) => {
    while (n >= (v as number)) {
      acc += s
      n -= v as number
    }
    return acc
  }, '')

/**
 * Cadrage du décor. En portrait, le viewBox est plus haut : le décor recule
 * pour que l'arche ne mange pas tout l'écran.
 */
const PORTRAIT_TOP = 520
const isPortrait = () => typeof window !== 'undefined' && window.innerWidth / window.innerHeight < 0.8

/** Convertit un point du viewBox (slice, xMidYMax) en pixels écran. */
function focusPoint(el: HTMLElement) {
  const w = el.clientWidth
  const h = el.clientHeight
  const top = isPortrait() ? PORTRAIT_TOP : 0
  const vh = 1000 + top
  const s = Math.max(w / 1600, h / vh)
  return { x: (w - 1600 * s) / 2 + GATE_FOCUS.x * s, y: h - vh * s + (GATE_FOCUS.y + top) * s }
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const [portrait, setPortrait] = useState(isPortrait)
  const VB = { viewBox: portrait ? `0 -${PORTRAIT_TOP} 1600 ${1000 + PORTRAIT_TOP}` : '0 0 1600 1000', preserveAspectRatio: 'xMidYMax slice' } as const

  useEffect(() => {
    const onResize = () => setPortrait(isPortrait())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const { discover, isFound } = useGame()
  const runeFound = isFound('hero-rune')

  const paths = useMemo(
    () => ({
      far: ridgePath(3, 560, 230, 34, 2.4),
      far2: ridgePath(11, 640, 170, 30, 3.5),
      mid: ridgePath(5, 820, 160, 26, 2.2),
      fgLeft: 'M-40,1000 L-40,780 L60,800 L150,850 L240,870 L330,930 L420,960 L470,1000 Z',
      fgRight: 'M1640,1000 L1640,760 L1540,790 L1440,850 L1360,880 L1270,940 L1180,1000 Z',
    }),
    [],
  )

  // ---------- Scroll + parallaxe (créés au montage pour respecter l'ordre des pins) ----------
  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = prefersReducedMotion()
    const q = gsap.utils.selector(el)
    const mm = gsap.matchMedia()

    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.set(q('.hero__scene'), { scale: 1.18, opacity: 0 })
      gsap.set(q('.hero__char'), { yPercent: 115, y: 0 })
      gsap.set(q('.hero__intro-fade'), { opacity: 0, y: 20 })
      gsap.set(q('.hero__halo-inner'), { scale: 0.5, opacity: 0 })

      // Plongée dans la porte au scroll
      mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (c) => {
        const desktop = c.conditions?.desktop
        const origin = () => {
          const p = focusPoint(q('.hero__scene')[0] as HTMLElement)
          return `${p.x}px ${p.y}px`
        }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: desktop ? '+=190%' : '+=130%',
            scrub: desktop ? 1 : 0.6,
            pin: q('.hero__pin')[0],
            invalidateOnRefresh: true,
          },
        })
        tl.fromTo(q('.hero__char'), { yPercent: 0, y: 0, opacity: 1 }, { yPercent: -120, opacity: 0, stagger: { each: 0.02, from: 'center' }, duration: 0.3, ease: 'power2.in', immediateRender: false }, 0)
          .fromTo(q('.hero__title-meta, .hero__bottom, .hero__rune'), { y: 0 }, { opacity: 0, y: -30, duration: 0.18, immediateRender: false }, 0)
          .to(q('.hero__halo'), { yPercent: 18, scale: 1.25, opacity: 0.25, duration: 0.7 }, 0)
          .to(q('.hero__far'), { scale: 1.25, transformOrigin: origin, yPercent: 4, duration: 1 }, 0)
          .to(q('.hero__mid'), { scale: 1.9, transformOrigin: origin, yPercent: 6, duration: 1 }, 0)
          .to(q('.hero__light'), { scale: 3.2, opacity: 1, transformOrigin: origin, duration: 1 }, 0)
          .to(q('.hero__arch'), { scale: desktop ? 9 : 11, transformOrigin: origin, duration: 1, ease: 'power2.in' }, 0)
          .to(q('.hero__fg'), { scale: 2.4, yPercent: 30, transformOrigin: '50% 100%', duration: 0.7, ease: 'power1.in' }, 0)
          .to(q('.hero__door'), { opacity: 0.15, duration: 0.45 }, 0.15)
          .to(q('.hero__fog'), { opacity: 0.35, duration: 0.6 }, 0.1)
          .to(q('.hero__flash'), { opacity: 1, duration: 0.18 }, 0.68)
          .to(q('.hero__veil'), { opacity: 1, duration: 0.2 }, 0.84)
          .from(q('.hero__outro .word'), { opacity: 0, yPercent: 60, filter: 'blur(8px)', stagger: 0.012, duration: 0.12 }, 0.9)
          .to({}, { duration: 0.12 })
      })

      // Parallaxe à la souris (desktop)
      if (isFinePointer() && isDesktop()) {
        const layers = q<HTMLElement>('[data-depth]').map((layer) => ({
          x: gsap.quickTo(layer, 'x', { duration: 1.4, ease: 'power3.out' }),
          y: gsap.quickTo(layer, 'y', { duration: 1.4, ease: 'power3.out' }),
          d: Number(layer.dataset.depth),
        }))
        const onMove = (e: PointerEvent) => {
          const nx = e.clientX / window.innerWidth - 0.5
          const ny = e.clientY / window.innerHeight - 0.5
          layers.forEach((l) => {
            l.x(-nx * l.d)
            l.y(-ny * l.d * 0.6)
          })
        }
        window.addEventListener('pointermove', onMove, { passive: true })
        return () => window.removeEventListener('pointermove', onMove)
      }
    }, el)

    return () => {
      mm.revert()
      ctx.revert()
    }
  }, [])

  // ---------- Entrée en scène, après l'écran de chargement ----------
  useEffect(() => {
    const el = root.current
    if (!el || !ready || prefersReducedMotion()) return
    const q = gsap.utils.selector(el)
    const tl = gsap
      .timeline({ defaults: { ease: 'expo.out' } })
      .to(q('.hero__scene'), { scale: 1, opacity: 1, duration: 2.6 })
      .to(q('.hero__halo-inner'), { scale: 1, opacity: 1, duration: 2.4 }, 0.2)
      .to(q('.hero__char'), { yPercent: 0, y: 0, duration: 1.6, stagger: 0.07 }, 0.5)
      .to(q('.hero__intro-fade'), { opacity: 1, y: 0, duration: 1.2, stagger: 0.1 }, 1.1)
    return () => {
      tl.progress(1).kill()
    }
  }, [ready])

  const onRune = (e: React.MouseEvent<HTMLButtonElement>) => {
    discover('hero-rune')
    if (!prefersReducedMotion()) {
      gsap.fromTo(e.currentTarget.querySelector('.hero__rune-burst'), { scale: 0.2, opacity: 1 }, { scale: 3.5, opacity: 0, duration: 1.2, ease: 'expo.out' })
    }
  }

  const letters = profile.firstName.toUpperCase().split('')

  return (
    <section id="accueil" ref={root} className="hero" aria-labelledby="hero-title">
      <div className="hero__pin">
        <div className="hero__scene" aria-hidden="true">
          <div className="hero__layer hero__sky" />
          <div className="hero__layer hero__halo">
            <div className="hero__mouse" data-depth="10">
              <div className="hero__halo-inner">
                <div className="hero__halo-glow" />
                <svg viewBox="0 0 200 200" className="hero__halo-sigil">
                  <g fill="none" stroke="currentColor" vectorEffect="non-scaling-stroke">
                    <circle cx="100" cy="100" r="96" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.5" />
                    <circle cx="100" cy="100" r="80" strokeWidth="1" vectorEffect="non-scaling-stroke" strokeDasharray="1 5" />
                    <circle cx="100" cy="100" r="58" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity="0.7" />
                    {Array.from({ length: 48 }, (_, i) => {
                      const a = (i / 48) * Math.PI * 2
                      const r2 = i % 4 === 0 ? 104 : 99
                      return <line key={i} x1={100 + Math.cos(a) * 96} y1={100 + Math.sin(a) * 96} x2={100 + Math.cos(a) * r2} y2={100 + Math.sin(a) * r2} strokeWidth="1" vectorEffect="non-scaling-stroke" />
                    })}
                  </g>
                </svg>
              </div>
            </div>
          </div>
          <div className="hero__layer hero__far">
            <div className="hero__mouse" data-depth="16">
              <svg {...VB}>
                <defs>
                  <linearGradient id="farGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#5d5446" />
                    <stop offset="0.6" stopColor="#2c2721" />
                  </linearGradient>
                </defs>
                <path d={paths.far} fill="url(#farGrad)" opacity="0.75" />
                <path d={paths.far2} fill="#211d19" opacity="0.9" />
              </svg>
            </div>
          </div>
          <div className="hero__layer hero__light">
            <div className="hero__mouse" data-depth="22">
              <div className="hero__light-glow" />
            </div>
          </div>
          <div className="hero__layer hero__mid">
            <div className="hero__mouse" data-depth="26">
              <svg {...VB}>
                <path d={paths.mid} fill="#15130f" />
              </svg>
            </div>
          </div>
          <div className="hero__layer hero__arch">
            <div className="hero__mouse" data-depth="34">
              <svg {...VB}>
                <defs>
                  <linearGradient id="stoneGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1c1915" />
                    <stop offset="1" stopColor="#0c0b09" />
                  </linearGradient>
                  <linearGradient id="doorLight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f6e2b0" />
                    <stop offset="0.55" stopColor="#d7a85c" />
                    <stop offset="1" stopColor="#6d4a20" />
                  </linearGradient>
                  <linearGradient id="ray" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#fffaf0" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#fffaf0" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="spill" cx="800" cy="720" r="330" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#d9a85a" stopOpacity="0.38" />
                    <stop offset="0.5" stopColor="#a87a3a" stopOpacity="0.1" />
                    <stop offset="1" stopColor="#a87a3a" stopOpacity="0" />
                  </radialGradient>
                </defs>
                {columns.map((c, i) => (
                  <path key={i} d={columnPath(c)} fill="url(#stoneGrad)" />
                ))}
                <g className="hero__door">
                  <path d={gateOpening + ' Z'} fill="url(#doorLight)" />
                  {[722, 760, 812, 858].map((x, i) => (
                    <rect key={x} x={x} y="470" width={10 + (i % 2) * 14} height="530" fill="url(#ray)" className="hero__ray" style={{ animationDelay: `${i * -1.7}s` }} />
                  ))}
                  <path d="M700,812 L900,812" stroke="#fff4d8" strokeWidth="1" opacity="0.5" />
                </g>
                <path d={gatePath} fill="url(#stoneGrad)" fillRule="evenodd" />
                <path d={gatePath} fill="url(#spill)" fillRule="evenodd" />
                <path d={gateOpening} fill="none" stroke="#e6c784" strokeWidth="1.5" opacity="0.7" />
                <path d="M585,336 L1015,336" stroke="#c8a45c" strokeWidth="1" opacity="0.35" />
                <path d="M712,244 L888,244" stroke="#c8a45c" strokeWidth="1" opacity="0.45" />
                {/* marches */}
                {[0, 1, 2, 3, 4].map((k) => (
                  <rect key={k} x={660 - k * 46} y={1000 - (5 - k) * 18} width={280 + k * 92} height="18" fill={`rgba(10,9,8,${0.75 + k * 0.05})`} />
                ))}
                {/* le voyageur */}
                <g fill="#0a0807">
                  <circle cx="800" cy="870" r="6.5" />
                  <path d="M792,877 L808,877 L813,912 L787,912 Z" />
                </g>
              </svg>
            </div>
          </div>
          <div className="hero__layer hero__fog">
            <div className="hero__fog-band hero__fog-band--a" />
            <div className="hero__fog-band hero__fog-band--b" />
          </div>
          <EmberField className="hero__layer hero__embers" />
          <div className="hero__layer hero__fg">
            <div className="hero__mouse" data-depth="48">
              <svg {...VB}>
                <path d={paths.fgLeft} fill="#070606" />
                <path d={paths.fgRight} fill="#070606" />
              </svg>
            </div>
          </div>
          <div className="hero__layer hero__flash" />
        </div>

        <div className="hero__title-wrap">
          <p className="hero__title-meta hero__intro-fade">
            <span>Portfolio</span>
            <i className="hero__dash" />
            <span>{toRoman(profile.year)}</span>
          </p>
          <h1 id="hero-title" className="hero__title" aria-label={`${profile.firstName} — ${profile.status}`}>
            {letters.map((l, i) => (
              <span className="hero__char-mask" key={i} aria-hidden="true">
                <span className="hero__char">{l}</span>
              </span>
            ))}
          </h1>
          <p className="hero__tagline hero__title-meta hero__intro-fade">{profile.tagline}</p>
        </div>

        <button
          type="button"
          className={`hero__rune${runeFound ? ' is-found' : ''}`}
          onClick={onRune}
          aria-label={runeFound ? 'Rune de l’aube (découverte)' : 'Un symbole scintille dans le ciel'}
          data-cursor={runeFound ? undefined : '?'}
        >
          <span className="hero__rune-burst" />
          <Rune index={0} />
        </button>

        <div className="hero__bottom hero__intro-fade">
          <span aria-hidden="true" />
          <a href="#origine" className="hero__scroll" aria-label="Commencer l’exploration">
            <span className="hero__scroll-line">
              <i />
            </span>
            <span className="label">Descendre</span>
          </a>
          <p className="hero__status hero__status--right">
            <span className="label">Chapitre I — Le commencement</span>
            <span>{profile.status}</span>
          </p>
        </div>

        <div className="hero__veil" aria-hidden="true">
          <p className="hero__outro display">
            {heroOutro.split(' ').map((w, i) => (
              <span className="word" key={i}>
                {w}{' '}
              </span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}

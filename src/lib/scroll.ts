import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

let lenis: Lenis | null = null

/** Smooth scroll discret, désactivé si l'utilisateur réduit les animations. */
export function initSmoothScroll() {
  if (prefersReducedMotion() || lenis) return lenis
  lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, touchMultiplier: 1.4 })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  return lenis
}

export function getLenis() {
  return lenis
}

export function scrollToTarget(target: string | HTMLElement | number, immediate = false) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el === null) return
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, { duration: immediate ? 0 : 1.6, immediate })
    return
  }
  const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: immediate || prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Bloque le défilement (panneaux, menus). */
export function setScrollLocked(locked: boolean) {
  document.documentElement.classList.toggle('is-locked', locked)
  if (!lenis) return
  if (locked) lenis.stop()
  else lenis.start()
}

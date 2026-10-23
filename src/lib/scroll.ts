import { ScrollSmoother, ScrollTrigger, isFinePointer, prefersReducedMotion } from './motion'

let smoother: ScrollSmoother | null = null

/**
 * Défilement amorti (GSAP ScrollSmoother) sur ordinateur.
 * Sur écran tactile ou si les animations sont réduites : défilement natif.
 */
export function initSmoothScroll() {
  if (smoother || prefersReducedMotion() || !isFinePointer()) return smoother
  smoother = ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 1.1,
    effects: true,
  })
  return smoother
}

export function getSmoother() {
  return smoother
}

export function getScrollY() {
  return smoother ? smoother.scrollTop() : window.scrollY
}

export function scrollToTarget(target: string | HTMLElement | number) {
  if (smoother) {
    smoother.scrollTo(target as string | HTMLElement | number, true, 'top top')
    return
  }
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (el === null) return
  const top = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Bloque le défilement (panneaux, menus). */
export function setScrollLocked(locked: boolean) {
  document.documentElement.classList.toggle('is-locked', locked)
  smoother?.paused(locked)
  if (!locked) ScrollTrigger.update()
}

import { gsap, prefersReducedMotion } from './motion'

/**
 * Animations réutilisables, déclenchées à l'entrée dans l'écran.
 * Toutes sont ignorées si l'utilisateur réduit les animations.
 */
export function revealChars(scope: Element, selector: string, opts: { start?: string; stagger?: number } = {}) {
  if (prefersReducedMotion()) return
  scope.querySelectorAll<HTMLElement>(selector).forEach((title) => {
    gsap.from(title.querySelectorAll('.ch'), {
      yPercent: 110,
      rotate: 6,
      opacity: 0,
      duration: 1,
      stagger: opts.stagger ?? 0.018,
      ease: 'expo.out',
      scrollTrigger: { trigger: title, start: opts.start ?? 'top 82%', once: true },
    })
  })
}

export function revealUp(scope: Element, selector: string, opts: { start?: string; stagger?: number } = {}) {
  if (prefersReducedMotion()) return
  scope.querySelectorAll<HTMLElement>(selector).forEach((el) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 1.1, scrollTrigger: { trigger: el, start: opts.start ?? 'top 88%', once: true } })
  })
}

export function drawBrush(scope: Element, selector = '.brush') {
  if (prefersReducedMotion()) return
  scope.querySelectorAll<SVGElement>(selector).forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 100% 0 0)' },
      { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power3.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } },
    )
  })
}

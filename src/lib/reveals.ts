import { gsap, ScrollTrigger, prefersReducedMotion } from './motion'

/**
 * Révélations génériques déclenchées à l'entrée dans le viewport.
 *   data-reveal="lines"  → lignes qui montent depuis un masque (.line-mask > span)
 *   data-reveal="fade"   → apparition douce vers le haut
 *   data-reveal="clip"   → image dévoilée par un masque vertical
 *   data-reveal="stagger"→ enfants directs révélés en cascade
 * Les éléments restent visibles si JS / animations sont désactivés.
 */
export function initReveals(root: ParentNode = document) {
  if (prefersReducedMotion()) return () => {}
  const ctx = gsap.context(() => {
    root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      const type = el.dataset.reveal
      const delay = Number(el.dataset.delay ?? 0)
      const trigger = { trigger: el, start: 'top 88%', once: true }
      if (type === 'lines') {
        gsap.from(el.querySelectorAll('.line-mask > span'), {
          yPercent: 115,
          rotate: 2,
          duration: 1.3,
          stagger: 0.09,
          delay,
          ease: 'expo.out',
          scrollTrigger: trigger,
        })
      } else if (type === 'clip') {
        gsap.fromTo(
          el,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, delay, ease: 'expo.inOut', scrollTrigger: trigger },
        )
        const img = el.querySelector('img')
        if (img) gsap.from(img, { scale: 1.35, duration: 2.2, delay, ease: 'expo.out', scrollTrigger: trigger })
      } else if (type === 'stagger') {
        gsap.from(el.children, { y: 36, opacity: 0, duration: 1.1, stagger: 0.08, delay, scrollTrigger: trigger })
      } else {
        gsap.from(el, { y: 40, opacity: 0, duration: 1.2, delay, scrollTrigger: trigger })
      }
    })
  }, root as Element)
  ScrollTrigger.refresh()
  return () => ctx.revert()
}

import { useEffect } from 'react'
import { DESKTOP_QUERY, gsap } from './motion'

/**
 * Position d'un élément du contenu défilant, comme si la page était tout en haut.
 * Calculée à partir de la mise en page (offsetTop…) : les transformations
 * d'animation (entrées, décalages) n'influencent pas la mesure.
 */
function restRect(el: HTMLElement) {
  let x = 0
  let y = 0
  let e: HTMLElement | null = el
  while (e) {
    x += e.offsetLeft
    y += e.offsetTop
    e = e.offsetParent as HTMLElement | null
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}
const fixedRect = (el: Element) => {
  const r = el.getBoundingClientRect()
  return { x: r.left, y: r.top, w: r.width, h: r.height }
}

/**
 * L'envol : en quittant le hero, le nom, le slogan et le portrait rejoignent
 * la barre latérale ; la navigation du haut s'efface, celle de la barre apparaît.
 * Actif uniquement sur ordinateur et si les animations ne sont pas réduites.
 */
export function useFlight() {
  useEffect(() => {
    const root = document.documentElement
    const mm = gsap.matchMedia()
    mm.add({ desk: DESKTOP_QUERY, reduce: '(prefers-reduced-motion: reduce)' }, (c) => {
      const { desk, reduce } = c.conditions as { desk: boolean; reduce: boolean }
      if (!desk || reduce) {
        root.classList.remove('fly-on')
        // Ordinateur sans animations : la barre latérale est affichée d'emblée.
        root.classList.toggle('side-static', desk)
        return () => root.classList.remove('side-static')
      }
      root.classList.add('fly-on')
      const $ = (s: string) => document.querySelector(s) as HTMLElement
      const flyName = $('[data-flyer="name"]')
      const flyPortrait = $('[data-flyer="portrait"]')
      const heroName = $('#accueil .namemark.hero__name')
      const heroPortrait = $('#accueil .hero__portrait')
      const sideName = $('.sidebar__name-static')
      const sidePortrait = $('.sidebar__portrait-slot')
      const tagline = $('[data-fly="tagline"]')
      const taglineHome = $('.topbar__left')
      const sideTagline = $('.sidebar__tagline-static')
      if (!flyName || !heroName || !sideName || !flyPortrait || !heroPortrait || !sidePortrait || !tagline || !sideTagline) return

      const setInert = (p: number) => {
        document.querySelectorAll('[data-side-fade]').forEach((el) => el.toggleAttribute('inert', p < 0.6))
        document.querySelectorAll('[data-fly-fade]').forEach((el) => el.toggleAttribute('inert', p > 0.3))
      }
      setInert(0)
      gsap.set('[data-side-fade]', { opacity: 0, y: 18 })
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut', duration: 1 },
        scrollTrigger: {
          trigger: '#accueil',
          start: 'top top',
          end: 'bottom 15%',
          scrub: 0.7,
          invalidateOnRefresh: true,
          // Ce qui est invisible ne doit pas recevoir le focus clavier.
          onUpdate: (self) => setInert(self.progress),
          onRefresh: (self) => setInert(self.progress),
        },
      })
      tl.fromTo(
        flyName,
        { x: () => restRect(heroName).x, y: () => restRect(heroName).y, scale: 1 },
        { x: () => fixedRect(sideName).x, y: () => fixedRect(sideName).y, scale: () => fixedRect(sideName).w / restRect(heroName).w },
        0,
      )
        .fromTo(
          flyPortrait,
          {
            x: () => restRect(heroPortrait).x,
            y: () => restRect(heroPortrait).y,
            width: () => restRect(heroPortrait).w,
            height: () => restRect(heroPortrait).h,
          },
          {
            x: () => fixedRect(sidePortrait).x,
            y: () => fixedRect(sidePortrait).y,
            width: () => fixedRect(sidePortrait).w,
            height: () => fixedRect(sidePortrait).h,
          },
          0,
        )
        .fromTo(
          tagline,
          { x: 0, y: 0, scale: 1 },
          {
            x: () => fixedRect(sideTagline).x - fixedRect(taglineHome).x,
            y: () => fixedRect(sideTagline).y - fixedRect(taglineHome).y,
            scale: () => fixedRect(sideTagline).w / tagline.offsetWidth,
          },
          0,
        )
        .to('[data-fly-fade]', { opacity: 0, y: -14, duration: 0.25, ease: 'power1.in' }, 0.05)
        .to('[data-side-fade]', { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }, 0.62)

      return () => {
        root.classList.remove('fly-on')
        gsap.set('[data-side-fade], [data-fly-fade], [data-fly="tagline"]', { clearProps: 'all' })
        document.querySelectorAll('[inert]').forEach((el) => el.removeAttribute('inert'))
      }
    })
    return () => mm.revert()
  }, [])
}

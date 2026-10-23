import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { Draggable } from 'gsap/Draggable'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Draggable)
gsap.defaults({ ease: 'power3.out' })

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

/** Mise en page « barre latérale » (comme sur ordinateur). */
export const DESKTOP_QUERY = '(min-width: 1100px)'
export const isDesktop = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_QUERY).matches

export { gsap, ScrollTrigger, ScrollSmoother, Draggable }

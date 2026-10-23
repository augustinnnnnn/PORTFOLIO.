import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/** Mot qui change à intervalle régulier, avec un léger brouillage. */
export function CycleWords({ words, className }: { words: string[]; className?: string }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (prefersReducedMotion() || words.length < 2) return
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), 2600)
    return () => window.clearInterval(id)
  }, [words.length])
  useEffect(() => {
    const target = words[i]
    if (prefersReducedMotion()) return setText(target)
    const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃ#/_'
    let frame = 0
    const id = window.setInterval(() => {
      frame++
      const n = Math.floor((frame / 10) * target.length)
      setText(target.slice(0, n) + [...target.slice(n)].map(() => glyphs[Math.floor(Math.random() * glyphs.length)]).join(''))
      if (frame >= 10) window.clearInterval(id)
    }, 40)
    return () => window.clearInterval(id)
  }, [i, words])
  return (
    <span className={className} aria-label={words[i]}>
      <span aria-hidden="true">{text}</span>
    </span>
  )
}

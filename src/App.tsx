import { useCallback, useEffect, useState } from 'react'
import { GameProvider, useGame } from './game/GameContext'
import { Codex, Finale, FragmentToast, Hud } from './game/GameUI'
import { Loader } from './components/Loader'
import { Nav } from './components/Nav'
import { Cursor } from './components/Cursor'
import { ScrollRail } from './components/ScrollRail'
import { Hero } from './sections/Hero'
import { Presentation } from './sections/Presentation'
import { Arsenal } from './sections/Arsenal'
import { Works } from './sections/Works'
import { Journey } from './sections/Journey'
import { Beyond } from './sections/Beyond'
import { Contact } from './sections/Contact'
import { initSmoothScroll } from './lib/scroll'
import { initReveals } from './lib/reveals'
import { ScrollTrigger } from './lib/motion'
import './styles/sections.css'

const SECTION_IDS = ['accueil', 'origine', 'arsenal', 'oeuvres', 'chemin', 'au-dela', 'contact']

function Experience() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState('accueil')
  const { visit } = useGame()
  const onLoaded = useCallback(() => setReady(true), [])

  useEffect(() => {
    initSmoothScroll()
    const cleanup = initReveals()
    // Les polices et images modifient la mise en page : on recalcule les déclencheurs.
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => {
      cleanup()
      window.removeEventListener('load', onLoad)
    }
  }, [])

  // Section active (navigation) + exploration (gamification).
  useEffect(() => {
    const triggers = SECTION_IDS.map((id) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) {
            setActive(id)
            visit(id)
          }
        },
      }),
    )
    visit('accueil')
    return () => triggers.forEach((t) => t.kill())
  }, [visit])

  return (
    <>
      <a href="#origine" className="skip-link">
        Aller au contenu
      </a>
      <Loader onDone={onLoaded} />
      <Nav active={active} />
      <main>
        <Hero ready={ready} />
        <Presentation />
        <Arsenal />
        <Works />
        <Journey />
        <Beyond />
        <Contact />
      </main>
      <ScrollRail active={active} />
      <Hud />
      <FragmentToast />
      <Codex />
      <Finale />
      <Cursor />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export function App() {
  return (
    <GameProvider>
      <Experience />
    </GameProvider>
  )
}

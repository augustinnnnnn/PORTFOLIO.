import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { GameProvider, useGame } from './game/GameContext'
import { Codex, Finale, FragmentToast } from './game/GameUI'
import { Loader } from './components/Loader'
import { Chrome } from './components/Chrome'
import { TopBar } from './components/TopBar'
import { Sidebar } from './components/Sidebar'
import { Flyers } from './components/Flyers'
import { Hero } from './sections/Hero'
import { Intro } from './sections/Intro'
import { Skills } from './sections/Skills'
import { Works, useProjectPanel } from './sections/Works'
import { Showcase } from './sections/Showcase'
import { Fragments } from './sections/Fragments'
import { Contact } from './sections/Contact'
import { initSmoothScroll } from './lib/scroll'
import { useFlight } from './lib/useFlight'
import { ScrollTrigger } from './lib/motion'

const SECTIONS = [
  { id: 'accueil', label: 'Accueil', nav: '' },
  { id: 'origine', label: 'Origine', nav: 'origine' },
  { id: 'arsenal', label: 'Arsenal', nav: 'arsenal' },
  { id: 'oeuvres', label: 'Œuvres', nav: 'oeuvres' },
  { id: 'vitrine', label: 'Vitrine', nav: 'oeuvres' },
  { id: 'fragments', label: 'Fragments', nav: 'fragments' },
  { id: 'contact', label: 'Contact', nav: 'contact' },
]

/** Crée le défilement amorti avant tous les ScrollTriggers (useLayoutEffect passe en premier). */
function SmoothInit() {
  useLayoutEffect(() => {
    initSmoothScroll()
  }, [])
  return null
}

function Experience() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState(SECTIONS[0])
  const { visit } = useGame()
  const { openProject, panel } = useProjectPanel()
  const onLoaded = useCallback(() => setReady(true), [])

  useFlight()

  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)
    return () => window.removeEventListener('load', onLoad)
  }, [])

  // Section active (navigation, télémétrie) + exploration (gamification)
  useEffect(() => {
    const triggers = SECTIONS.map((s) =>
      ScrollTrigger.create({
        trigger: `#${s.id}`,
        start: 'top 55%',
        end: 'bottom 55%',
        onToggle: (self) => {
          if (self.isActive) {
            setActive(s)
            visit(s.id)
          }
        },
      }),
    )
    visit('accueil')
    return () => triggers.forEach((t) => t.kill())
  }, [visit])

  const mode = active.id === 'oeuvres' || active.id === 'vitrine' ? 'works' : 'portrait'

  return (
    <>
      <a href="#origine" className="skip-link">
        Aller au contenu
      </a>
      <Loader onDone={onLoaded} />
      <Chrome section={active.label} />
      <TopBar active={active.nav} />
      <Sidebar active={active.nav} mode={mode} />
      <Flyers />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <SmoothInit />
          <main>
            <Hero ready={ready} />
            <Intro />
            <Skills />
            <Works onOpen={openProject} />
            <Showcase onOpen={openProject} />
            <Fragments />
            <Contact />
          </main>
        </div>
      </div>
      {panel}
      <FragmentToast />
      <Codex />
      <Finale />
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

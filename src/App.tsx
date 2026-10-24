import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
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
import { Approach } from './sections/Approach'
import { Contact } from './sections/Contact'
import { initSmoothScroll } from './lib/scroll'
import { useFlight } from './lib/useFlight'
import { ScrollTrigger } from './lib/motion'

const SECTIONS = [
  { id: 'accueil', label: 'Accueil', nav: '' },
  { id: 'profil', label: 'Profil', nav: 'profil' },
  { id: 'competences', label: 'Compétences', nav: 'competences' },
  { id: 'projets', label: 'Projets', nav: 'projets' },
  { id: 'vitrine', label: 'Projet phare', nav: 'projets' },
  { id: 'approche', label: 'Approche', nav: 'approche' },
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
          if (self.isActive) setActive(s)
        },
      }),
    )
    return () => triggers.forEach((t) => t.kill())
  }, [])

  const mode = active.id === 'projets' || active.id === 'vitrine' ? 'works' : 'portrait'

  return (
    <>
      <a href="#profil" className="skip-link">
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
            <Approach />
            <Contact />
          </main>
        </div>
      </div>
      {panel}
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export function App() {
  return <Experience />
}

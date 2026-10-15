import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { exploredSections, fragments, ranks, type Fragment, type FragmentId } from '../content/fragments'
import { readJSON, removeKey, writeJSON } from '../lib/storage'

const STORAGE_KEY = 'augustin.portfolio.progress.v1'

type Progress = {
  found: FragmentId[]
  visited: string[]
  inspected: string[]
  finaleSeen: boolean
}

const empty: Progress = { found: [], visited: [], inspected: [], finaleSeen: false }

type GameValue = {
  progress: Progress
  total: number
  rankIndex: number
  isFound: (id: FragmentId) => boolean
  discover: (id: FragmentId) => void
  visit: (section: string) => void
  inspectCategory: (id: string, totalCategories: number) => void
  reset: () => void
  toast: Fragment | null
  codexOpen: boolean
  setCodexOpen: (open: boolean) => void
  finaleOpen: boolean
  closeFinale: () => void
  replayFinale: () => void
}

const GameContext = createContext<GameValue | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => ({ ...empty, ...readJSON<Partial<Progress>>(STORAGE_KEY, {}) }))
  const [toast, setToast] = useState<Fragment | null>(null)
  const [codexOpen, setCodexOpen] = useState(false)
  const [finaleOpen, setFinaleOpen] = useState(false)
  const queue = useRef<Fragment[]>([])
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => writeJSON(STORAGE_KEY, progress), [progress])

  const showNext = useCallback(() => {
    const next = queue.current.shift() ?? null
    setToast(next)
    timer.current = next ? window.setTimeout(showNext, 4200) : undefined
  }, [])

  const foundRef = useRef(progress.found)
  foundRef.current = progress.found

  const discover = useCallback(
    (id: FragmentId) => {
      if (foundRef.current.includes(id)) return
      foundRef.current = [...foundRef.current, id]
      const fragment = fragments.find((f) => f.id === id)
      if (fragment) {
        queue.current.push(fragment)
        if (!timer.current) {
          timer.current = -1
          window.setTimeout(showNext, 0)
        }
      }
      setProgress((p) => (p.found.includes(id) ? p : { ...p, found: [...p.found, id] }))
    },
    [showNext],
  )

  // Tous les fragments réunis : écran final, une seule fois (rejouable depuis le codex).
  useEffect(() => {
    if (progress.found.length === fragments.length && !progress.finaleSeen) {
      const t = window.setTimeout(() => setFinaleOpen(true), 2600)
      return () => window.clearTimeout(t)
    }
  }, [progress.found.length, progress.finaleSeen])

  const visit = useCallback((section: string) => {
    if (!exploredSections.includes(section)) return
    setProgress((p) => (p.visited.includes(section) ? p : { ...p, visited: [...p.visited, section] }))
  }, [])

  const inspectedRef = useRef(progress.inspected)
  inspectedRef.current = progress.inspected

  const inspectCategory = useCallback(
    (id: string, totalCategories: number) => {
      if (inspectedRef.current.includes(id)) return
      const inspected = [...inspectedRef.current, id]
      inspectedRef.current = inspected
      setProgress((p) => ({ ...p, inspected }))
      if (inspected.length >= totalCategories) discover('armory')
    },
    [discover],
  )

  const reset = useCallback(() => {
    removeKey(STORAGE_KEY)
    foundRef.current = []
    inspectedRef.current = []
    queue.current = []
    window.clearTimeout(timer.current)
    timer.current = undefined
    setToast(null)
    setProgress({ ...empty, visited: ['accueil'] })
  }, [])

  const closeFinale = useCallback(() => {
    setFinaleOpen(false)
    setProgress((p) => ({ ...p, finaleSeen: true }))
  }, [])

  const rankIndex = useMemo(() => {
    const input = { found: progress.found.length, total: fragments.length, visited: progress.visited.length }
    let index = 0
    ranks.forEach((r, i) => {
      if (r.reached(input)) index = i
    })
    return index
  }, [progress.found.length, progress.visited.length])

  useEffect(() => {
    document.documentElement.toggleAttribute('data-restored', progress.found.length === fragments.length)
  }, [progress.found.length])

  const value = useMemo<GameValue>(
    () => ({
      progress,
      total: fragments.length,
      rankIndex,
      isFound: (id) => progress.found.includes(id),
      discover,
      visit,
      inspectCategory,
      reset,
      toast,
      codexOpen,
      setCodexOpen,
      finaleOpen,
      closeFinale,
      replayFinale: () => setFinaleOpen(true),
    }),
    [progress, rankIndex, discover, visit, inspectCategory, reset, toast, codexOpen, finaleOpen, closeFinale],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame doit être utilisé dans <GameProvider>')
  return ctx
}


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/anton/latin-400.css'
import '@fontsource/permanent-marker/latin-400.css'
import '@fontsource-variable/inter-tight/wght.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/layout.css'
import { App } from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

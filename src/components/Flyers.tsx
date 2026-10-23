import { profile } from '../content/site'
import { NameMark } from './NameMark'
import './Flyers.css'

/**
 * Éléments qui « s'envolent » du hero vers la barre latérale (ordinateur).
 * Leur position est entièrement pilotée par le scroll (voir useFlight).
 */
export function Flyers() {
  return (
    <div className="flyers">
      <div className="flyer flyer--name" data-flyer="name">
        <NameMark className="hero-name" />
      </div>
      <div className="flyer flyer--portrait" data-flyer="portrait">
        <img src={profile.portrait.src} alt={profile.portrait.alt} />
        <span className="flyer__label poster">Portrait / 01</span>
      </div>
    </div>
  )
}

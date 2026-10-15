import type { ElementType } from 'react'

/**
 * Découpe un texte en lignes masquées (séparateur : \n) pour les révélations.
 * Le texte complet reste lisible par les lecteurs d'écran.
 */
export function Lines({ text, as: Tag = 'span', className, id }: { text: string; as?: ElementType; className?: string; id?: string }) {
  return (
    <Tag className={className} id={id} data-reveal="lines" aria-label={text.replace(/\n/g, ' ')}>
      {text.split('\n').map((line, i) => (
        <span className="line-mask" key={i} aria-hidden="true">
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}

export function SectionHeading({ kicker, title, id }: { kicker: string; title: string; id: string }) {
  return (
    <header className="section-heading">
      <p className="kicker" data-reveal="fade">
        {kicker}
      </p>
      <Lines as="h2" id={id} text={title} className="display section-heading__title" />
    </header>
  )
}

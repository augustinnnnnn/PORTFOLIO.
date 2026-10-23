import { Fragment, type ElementType } from 'react'

/**
 * Texte enrichi : \n = retour à la ligne, *texte* = en or.
 * Avec `split`, chaque lettre est enveloppée pour être animée (.ch),
 * chaque ligne dans .line. Le texte brut reste lisible (aria-label).
 */
export function Rich({ text, as: Tag = 'span', className, split = false, id }: { text: string; as?: ElementType; className?: string; split?: boolean; id?: string }) {
  const plain = text.replace(/\*/g, '').replace(/\n/g, ' ')
  const lines = text.split('\n')
  return (
    <Tag className={className} id={id} aria-label={split ? plain : undefined}>
      {lines.map((line, li) => (
        <span className="line" key={li} aria-hidden={split || undefined}>
          {line.split(/(\*[^*]+\*)/).map((seg, si) => {
            if (!seg) return null
            const gold = seg.startsWith('*')
            const content = gold ? seg.slice(1, -1) : seg
            const inner = split
              ? content.split(/(\s+)/).map((word, wi) =>
                  /^\s+$/.test(word) ? (
                    <Fragment key={wi}> </Fragment>
                  ) : (
                    <span className="wd" key={wi}>
                      {[...word].map((c, ci) => (
                        <span className="ch" key={ci}>
                          {c}
                        </span>
                      ))}
                    </span>
                  ),
                )
              : content
            return gold ? (
              <em key={si} className="gold">
                {inner}
              </em>
            ) : (
              <Fragment key={si}>{inner}</Fragment>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}

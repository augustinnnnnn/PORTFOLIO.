/**
 * ============================================================
 *  LE CHEMIN PARCOURU — ta chronologie.
 * ============================================================
 *  Ordre : du plus ancien au plus récent.
 *  `kind` : 'Formation' | 'Apprentissage' | 'Expérience' | 'Projet' (libre)
 *  Les étapes « À COMPLÉTER » sont des emplacements : remplace-les
 *  ou supprime-les. Rien n'a été inventé.
 */

export type JourneyStep = {
  period: string
  title: string
  place?: string
  kind: string
  text: string
  placeholder?: boolean
}

export const journey: JourneyStep[] = [
  {
    period: 'À COMPLÉTER',
    title: 'Baccalauréat',
    place: 'Établissement à compléter',
    kind: 'Formation',
    text: 'Indique ici ton baccalauréat, tes spécialités et ce qui t’a conduit vers le multimédia.',
    placeholder: true,
  },
  {
    period: 'À COMPLÉTER',
    title: 'Les premiers pas',
    kind: 'Apprentissage',
    text: 'Le moment où tout a commencé : premier site, premier logiciel de création, première curiosité pour le web.',
    placeholder: true,
  },
  {
    period: 'Aujourd’hui',
    title: 'BUT Métiers du Multimédia et de l’Internet',
    place: 'IUT — à compléter',
    kind: 'Formation',
    text: 'Développement web, design, communication et production audiovisuelle : une formation qui croise la technique et la création.',
  },
  {
    period: 'Prochainement',
    title: 'Stage ou alternance',
    kind: 'Expérience',
    text: 'Emplacement réservé à ta prochaine expérience professionnelle.',
    placeholder: true,
  },
]

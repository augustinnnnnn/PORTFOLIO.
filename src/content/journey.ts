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
    period: '2025 – 2026',
    title: 'BUT MMI — 2e année',
    place: 'IUT de Blois · Université de Tours',
    kind: 'Formation',
    text: 'Métiers du Multimédia et de l’Internet : développement web, design, communication et production audiovisuelle.',
  },
  {
    period: 'Avril → juin 2026',
    title: 'Stage — Ferme de la Buissière',
    place: 'Saint-Jean-de-Braye (45) · 11 semaines',
    kind: 'Expérience',
    text: 'Création complète de la communication d’une ferme : charte graphique, logo (Illustrator), dépliant (Canva), wireframes (Figma) et site WordPress.',
  },
  {
    period: '2026 – 2027',
    title: 'BUT MMI — 3e année',
    place: 'IUT de Blois',
    kind: 'Formation',
    text: 'Objectif : approfondir la communication visuelle, la retouche photo et les supports imprimés.',
  },
]

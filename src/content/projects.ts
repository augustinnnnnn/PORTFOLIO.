/**
 * ============================================================
 *  ŒUVRES FORGÉES — tes projets.
 * ============================================================
 *  Pour ajouter un projet : copie un bloc, change les valeurs,
 *  puis place ton image de couverture dans /public/images/projets/.
 *
 *  - `placeholder: true` affiche le badge « Exemple — à remplacer ».
 *    Passe-le à `false` (ou supprime-le) pour un vrai projet.
 *  - `layout` varie la composition dans la galerie :
 *      'wide' (large), 'tall' (vertical), 'square' (carré), 'offset' (décalé)
 *  - `link` est optionnel. Laisse-le vide si le projet n'est pas en ligne.
 *  - `process` : les étapes affichées dans le panneau détaillé.
 */

export type ProjectLayout = 'wide' | 'tall' | 'square' | 'offset'

export type Project = {
  id: string
  title: string
  /** Sous-titre court, ex. « Site vitrine », « Identité visuelle »… */
  category: string
  year: string
  cover: string
  coverSmall?: string
  coverAlt: string
  summary: string
  tags: string[]
  link?: { label: string; href: string }
  layout: ProjectLayout
  placeholder?: boolean
  context: string
  process: { title: string; text: string }[]
  result: string
}

const demoProcess = [
  { title: 'Comprendre', text: 'Décris ici le besoin, la cible et les contraintes du projet.' },
  { title: 'Concevoir', text: 'Présente tes recherches, moodboards, wireframes et maquettes.' },
  { title: 'Forger', text: 'Explique les choix techniques, les difficultés rencontrées et comment tu les as résolues.' },
]

export const projects: Project[] = [
  {
    id: 'projet-1',
    title: 'Les Crêtes',
    category: 'Exemple · Site vitrine',
    year: '20XX',
    cover: '/images/relic-peaks.webp',
    coverSmall: '/images/relic-peaks-sm.webp',
    coverAlt: 'Visuel d’ambiance temporaire : chaîne de montagnes dans la brume au coucher du soleil',
    summary: 'Emplacement de démonstration. Remplace ce texte par une description courte de ton projet (deux lignes maximum).',
    tags: ['HTML', 'CSS', 'JavaScript'],
    layout: 'wide',
    placeholder: true,
    context: 'Contexte du projet : cadre (cours, projet personnel, commande), durée, équipe et ton rôle.',
    process: demoProcess,
    result: 'Résultat obtenu, retours reçus et ce que tu as appris. Ajoute un lien si le projet est en ligne.',
  },
  {
    id: 'projet-2',
    title: 'Le Monolithe',
    category: 'Exemple · Identité visuelle',
    year: '20XX',
    cover: '/images/relic-monolith.webp',
    coverSmall: '/images/relic-monolith-sm.webp',
    coverAlt: 'Visuel d’ambiance temporaire : monolithe sombre dressé dans la brume',
    summary: 'Emplacement de démonstration pour un projet de design graphique ou d’identité.',
    tags: ['Illustrator', 'Typographie'],
    layout: 'tall',
    placeholder: true,
    context: 'Contexte du projet à compléter.',
    process: demoProcess,
    result: 'Résultat à compléter.',
  },
  {
    id: 'projet-3',
    title: 'La Colonnade',
    category: 'Exemple · UX/UI',
    year: '20XX',
    cover: '/images/relic-colonnade.webp',
    coverSmall: '/images/relic-colonnade-sm.webp',
    coverAlt: 'Visuel d’ambiance temporaire : allée de colonnes en ruine menant vers la lumière',
    summary: 'Emplacement de démonstration pour une maquette ou un prototype d’application.',
    tags: ['Figma', 'Prototype', 'Tests'],
    layout: 'square',
    placeholder: true,
    context: 'Contexte du projet à compléter.',
    process: demoProcess,
    result: 'Résultat à compléter.',
  },
  {
    id: 'projet-4',
    title: 'La Grande Porte',
    category: 'Exemple · Expérience interactive',
    year: '20XX',
    cover: '/images/relic-gate.webp',
    coverSmall: '/images/relic-gate-sm.webp',
    coverAlt: 'Visuel d’ambiance temporaire : silhouette devant une arche monumentale illuminée',
    summary: 'Emplacement de démonstration pour un projet web animé ou interactif.',
    tags: ['JavaScript', 'Animation'],
    layout: 'offset',
    placeholder: true,
    context: 'Contexte du projet à compléter.',
    process: demoProcess,
    result: 'Résultat à compléter.',
  },
  {
    id: 'projet-5',
    title: 'L’Arbre de lumière',
    category: 'Exemple · Motion design',
    year: '20XX',
    cover: '/images/relic-tree.webp',
    coverSmall: '/images/relic-tree-sm.webp',
    coverAlt: 'Visuel d’ambiance temporaire : arbre doré lumineux dans la nuit',
    summary: 'Emplacement de démonstration pour une vidéo, une animation ou un projet audiovisuel.',
    tags: ['After Effects', 'Montage'],
    layout: 'tall',
    placeholder: true,
    context: 'Contexte du projet à compléter.',
    process: demoProcess,
    result: 'Résultat à compléter.',
  },
  {
    id: 'projet-6',
    title: 'La Tour',
    category: 'Exemple · Projet personnel',
    year: '20XX',
    cover: '/images/relic-tower.webp',
    coverSmall: '/images/relic-tower-sm.webp',
    coverAlt: 'Visuel d’ambiance temporaire : tour isolée au-dessus d’une mer de nuages',
    summary: 'Emplacement de démonstration pour un projet personnel qui te tient à cœur.',
    tags: ['À définir'],
    layout: 'wide',
    placeholder: true,
    context: 'Contexte du projet à compléter.',
    process: demoProcess,
    result: 'Résultat à compléter.',
  },
]

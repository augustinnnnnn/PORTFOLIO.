/**
 * ============================================================
 *  FRAGMENTS DE MÉMOIRE — la gamification du site.
 * ============================================================
 *  Les textes (noms, indices, récits) sont modifiables ici.
 *  Les identifiants (`id`) sont reliés au code : ne les change pas.
 */

export type FragmentId =
  | 'hero-rune'
  | 'threshold'
  | 'origin-word'
  | 'armory'
  | 'relic'
  | 'path-end'
  | 'ground-message'
  | 'last-grace'

export type Fragment = {
  id: FragmentId
  name: string
  place: string
  hint: string
  lore: string
}

export const fragments: Fragment[] = [
  {
    id: 'hero-rune',
    name: 'Rune de l’aube',
    place: 'Le commencement',
    hint: 'Quelque chose scintille dans le ciel, au-dessus du nom.',
    lore: 'Une marque gravée avant le premier pas. Ceux qui lèvent les yeux trouvent toujours un peu plus que les autres.',
  },
  {
    id: 'threshold',
    name: 'Prière du seuil',
    place: 'La navigation',
    hint: 'Le sceau en haut de la page répond à ceux qui patientent.',
    lore: 'Maintenir plutôt que frapper. Certaines portes ne s’ouvrent qu’à la persévérance.',
  },
  {
    id: 'origin-word',
    name: 'Éclat d’origine',
    place: 'Origine',
    hint: 'Dans « Qui suis-je ? », un mot n’est pas tout à fait comme les autres.',
    lore: 'Tout commence par l’envie de comprendre ce qu’il y a derrière la prochaine colline.',
  },
  {
    id: 'armory',
    name: 'Mémoire de l’armurier',
    place: 'Arsenal',
    hint: 'Inspecte chacune des quatre catégories de l’arsenal.',
    lore: 'Chaque outil fut d’abord inconnu. On ne forge rien sans connaître son métal.',
  },
  {
    id: 'relic',
    name: 'Relique examinée',
    place: 'Œuvres forgées',
    hint: 'Ouvre une œuvre pour en lire la genèse.',
    lore: 'Une œuvre ne se résume pas à son image : la démarche est la véritable relique.',
  },
  {
    id: 'path-end',
    name: 'Braise du chemin',
    place: 'Le chemin parcouru',
    hint: 'Marche jusqu’au bout du chemin, puis regarde ce qui s’y allume.',
    lore: 'Le chemin ne s’arrête pas ici. La braise attend simplement le prochain pas.',
  },
  {
    id: 'ground-message',
    name: 'Message au sol',
    place: 'Au-delà de l’écran',
    hint: 'Une inscription effacée attend qu’on s’y attarde.',
    lore: 'Laissé par un voyageur inconnu : « Courage, l’essentiel est déjà là. »',
  },
  {
    id: 'last-grace',
    name: 'Dernière grâce',
    place: 'Contact',
    hint: 'Repose-toi auprès de la dernière lumière.',
    lore: 'Un feu qui ne brûle pas. Ici, chaque rencontre commence par un repos.',
  },
]

/** Sections comptées pour l'exploration (ids des <section>). */
export const exploredSections = ['accueil', 'origine', 'arsenal', 'oeuvres', 'chemin', 'au-dela', 'contact']

export type RankInput = { found: number; total: number; visited: number }

/** Paliers de progression, du plus bas au plus haut. */
export const ranks = [
  { stage: 'Départ', title: 'Sans-lueur', text: 'Le voyage commence.', reached: () => true },
  { stage: 'Exploration', title: 'Voyageur', text: 'Au moins quatre terres ont été foulées.', reached: (s: RankInput) => s.visited >= 4 },
  { stage: 'Collection', title: 'Porteur de fragments', text: 'Trois fragments ou plus ont été retrouvés.', reached: (s: RankInput) => s.found >= 3 },
  { stage: 'Accomplissement', title: 'Gardien des mémoires', text: 'Tous les fragments sont réunis.', reached: (s: RankInput) => s.found === s.total },
]

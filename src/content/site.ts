/**
 * ============================================================
 *  CONTENU GÉNÉRAL DU SITE — modifie librement ce fichier.
 * ============================================================
 *  Les éléments marqués « À COMPLÉTER » doivent être remplacés
 *  par tes propres informations.
 *
 *  Dans les titres, le texte entre *astérisques* s'affiche en or
 *  et \n force un retour à la ligne.
 */

export const profile = {
  firstName: 'Augustin',
  /** Ton nom de famille : il s'affichera en or à côté du prénom (laisse vide pour ne pas l'afficher). */
  lastName: '',
  /** Mots qui défilent après « CODE / DESIGN / ». */
  cycleWords: ['Motion', 'Interface', 'Créatif', 'Précis'],
  /** Ligne sous le nom dans la barre latérale. */
  role: 'Étudiant BUT MMI | Web créatif',
  stack: 'HTML, CSS, JavaScript, Figma, Motion',
  location: 'À COMPLÉTER — ta ville',
  availability: 'Stage / alternance',
  year: 2026,
  portrait: {
    src: '/images/wanderer.webp',
    alt: 'Visuel temporaire à remplacer par ton portrait',
    /** Mets `false` quand tu remplaces l'image par ta photo. */
    placeholder: true,
    /** Petit texte vertical à côté du portrait. */
    tag: 'BUT / MMI',
  },
}

export const navigation = [
  { id: 'profil', label: 'Profil' },
  { id: 'competences', label: 'Compétences' },
  { id: 'projets', label: 'Projets' },
  { id: 'approche', label: 'Approche' },
  { id: 'contact', label: 'Contact' },
] as const

/** Écran de chargement : images qui s'empilent en haut à droite. */
export const loader = {
  images: ['/images/relic-peaks-sm.webp', '/images/relic-gate-sm.webp', '/images/relic-colonnade-sm.webp', '/images/relic-tree-sm.webp'],
}

export const hero = {
  /** Annotation manuscrite au-dessus du nom. */
  note: 'je conçois des sites qui marquent',
  /** Invitation à descendre. */
  scroll: 'découvre la suite',
  /** Image plein écran dévoilée à la fin du chargement, puis assombrie. */
  backdrop: '/images/relic-gate.webp',
}

/** Section « Profil » (présentation). */
export const intro = {
  title: 'D’abord, que ça marche,\n*Ensuite, que ça marque…*',
  subtitle: 'Étudiant en BUT Métiers du Multimédia et de l’Internet — j’apprends à concevoir, designer et développer des expériences web soignées, du prototype à la mise en ligne.',
  /** Chiffres clés : modifie-les librement (évite d'inventer). */
  stats: [
    { value: 3, label: 'Années\nBUT MMI' },
    { value: 4, label: 'Domaines\nde compétences' },
    { value: 6, label: 'Projets\nprésentés' },
  ],
}

export const skillsSection = {
  note: 'là où tout se joue',
  hint: 'Clique sur une catégorie pour voir le détail',
}

export const worksSection = {
  title: 'J’en ai conçu. *J’en ai cassé…*',
  outro: 'Et à chaque fois, *j’ai appris.*',
  caption: 'Pensé. Codé. Recommencé.',
  note: 'projets',
}

export const showcaseSection = {
  /** Phrase sous le grand titre du projet phare. */
  claim: 'Projet phare.',
  claimNote: 'Remplace-le par ton meilleur projet.',
  heading: 'Ça m’a pris *du temps.*',
  enter: 'voir le projet',
  scroll: 'scroll',
  showcase: 'en détail',
  experienceCta: 'le parcours complet',
}

/** Section « Approche » : ta façon de travailler, en cartes. */
export const approach = {
  title: 'Ce qui me guide,\n*projet après projet.*',
  note: 'ma méthode',
  listTitle: 'Mes principes',
  cards: [
    { title: 'Vision', text: 'Des interfaces qui respectent l’attention : peu d’éléments, chacun à sa place.' },
    { title: 'Méthode', text: 'Comprendre, esquisser, prototyper, tester, recommencer — par itérations courtes.' },
    { title: 'Accessibilité', text: 'Contrastes, clavier, textes alternatifs : concevoir pour tout le monde.' },
    { title: 'Détail', text: 'Le rythme, les transitions, les états : ce qui fait passer de correct à soigné.' },
    { title: 'Inspirations', text: 'Le design éditorial, les sites primés pour leur narration et les jeux vidéo qui racontent sans expliquer.' },
  ],
}

/** Section contact. Tous les liens se modifient ici. */
export const contact = {
  question: 'Alors… on crée\n*quelque chose ensemble ?*',
  title: '*Parle-moi* de ton projet',
  /** ⚠️ À REMPLACER par ton adresse réelle. */
  email: 'ton.adresse@exemple.fr',
  availability: 'Disponible pour : À COMPLÉTER',
  drag: 'fais-moi glisser',
  top: 'retour en haut',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ton-profil', icon: 'linkedin' },
    { label: 'GitHub', href: 'https://github.com/augustinnnnnn', icon: 'github' },
    // Ajoute d'autres liens ici, par exemple :
    // { label: 'Behance', href: 'https://www.behance.net/ton-profil', icon: 'link' },
  ] as { label: string; href: string; icon: 'linkedin' | 'github' | 'link' }[],
  footer: 'Conçu et développé par Augustin.',
}

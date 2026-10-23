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
  cycleWords: ['Obscur', 'Mythique', 'Curieux', 'Forgé', 'Vivant'],
  /** Ligne sous le nom dans la barre latérale. */
  role: 'Étudiant BUT MMI | Web créatif',
  stack: 'HTML, CSS, JavaScript, Figma, Motion',
  location: 'À COMPLÉTER — ta ville',
  availability: 'Stage / alternance',
  year: 2026,
  portrait: {
    src: '/images/wanderer.webp',
    alt: 'Visuel temporaire : silhouette d’un voyageur au bord d’une falaise',
    /** Mets `false` quand tu remplaces l'image par ta photo. */
    placeholder: true,
    /** Petit texte vertical à côté du portrait. */
    tag: 'BUT / MMI',
  },
}

export const navigation = [
  { id: 'origine', label: 'Origine' },
  { id: 'arsenal', label: 'Arsenal' },
  { id: 'oeuvres', label: 'Œuvres' },
  { id: 'fragments', label: 'Fragments' },
  { id: 'contact', label: 'Contact' },
] as const

export const hero = {
  /** Annotation manuscrite au-dessus du nom. */
  note: 'je forge des sites qui se vivent',
  /** Invitation à descendre. */
  scroll: 'continue, voyageur',
}

/** Section « Origine » (présentation). */
export const intro = {
  title: 'D’abord, que ça marche,\n*Ensuite, que ça envoûte…*',
  /** Sous-titre. Le mot entre [crochets] cache un fragment : garde-en un seul. */
  subtitle: 'Étudiant en BUT MMI — j’apprends à concevoir, designer et développer des expériences web qu’on a envie d’[explorer].',
  inscription: '« Ce qui est caché n’attend que d’être cherché. »',
  /** Chiffres clés : modifie-les librement (évite d'inventer). */
  stats: [
    { value: 3, suffix: '', label: 'Années\nBUT MMI' },
    { value: 8, suffix: '', label: 'Fragments\ncachés ici' },
    { value: 1, suffix: '', label: 'Obsession\nle détail' },
  ],
  vision: [
    {
      title: 'Ma façon de faire',
      text: 'Comprendre le besoin, esquisser, prototyper, tester, recommencer. Des interfaces claires d’abord, de l’émotion ensuite — jamais l’inverse.',
    },
    {
      title: 'Ce que m’a appris FromSoftware',
      text: 'Elden Ring, Dark Souls et Sekiro m’ont montré qu’un décor peut raconter sans un mot et que la curiosité mérite d’être récompensée. C’est ce que j’essaie d’apporter au web.',
    },
  ],
  groundMessage: {
    hidden: 'Essaie de t’attarder…',
    revealed: 'Merci d’être resté jusqu’ici. La curiosité est déjà une qualité.',
  },
}

export const skillsSection = {
  note: 'c’est la partie forge !',
  hint: 'Clique sur une catégorie pour l’inspecter',
}

export const worksSection = {
  title: 'J’en ai forgé. *J’en ai brisé…*',
  outro: 'Et à chaque fois, *j’ai appris.*',
  caption: 'Pensé. Codé. Recommencé.',
  note: 'œuvres',
}

export const showcaseSection = {
  /** Phrase sous le grand titre de l'œuvre phare. */
  claim: 'Celle-ci compte.',
  claimNote: 'Œuvre phare — remplace-la par ton meilleur projet.',
  heading: 'Ça m’a pris *du temps.*',
  enter: 'voir l’œuvre',
  scroll: 'scroll',
  showcase: 'vitrine',
  experienceCta: 'le chemin complet',
}

export const fragmentsSection = {
  title: 'Je voulais savoir\n*jusqu’où tu irais…*',
  note: 'cherche bien',
  listTitle: 'Fragments de mémoire',
  cta: 'fragments',
}

/** Section contact. Tous les liens se modifient ici. */
export const contact = {
  question: 'Alors… on forge\n*quelque chose ensemble ?*',
  title: '*Écris-moi* avec ton idée',
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

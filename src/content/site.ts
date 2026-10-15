/**
 * ============================================================
 *  CONTENU GÉNÉRAL DU SITE — modifie librement ce fichier.
 * ============================================================
 *  Tous les textes visibles (hors projets, compétences et parcours)
 *  sont centralisés ici. Les éléments marqués « À COMPLÉTER »
 *  doivent être remplacés par tes propres informations.
 */

export const profile = {
  firstName: 'Augustin',
  /** Affiché sous le prénom dans le hero. */
  tagline: 'Web créatif · Design d’interface · Expériences interactives',
  status: 'Étudiant en BUT MMI',
  /** Année affichée en chiffres romains dans le hero. */
  year: 2026,
}

export const navigation = [
  { id: 'origine', numeral: 'I', label: 'Origine' },
  { id: 'arsenal', numeral: 'II', label: 'Arsenal' },
  { id: 'oeuvres', numeral: 'III', label: 'Œuvres' },
  { id: 'chemin', numeral: 'IV', label: 'Chemin' },
  { id: 'au-dela', numeral: 'V', label: 'Au-delà' },
  { id: 'contact', numeral: 'VI', label: 'Contact' },
] as const

export const heroOutro = 'Chaque projet est un voyage. Voici le mien.'

/** Section « Qui suis-je ? » */
export const presentation = {
  kicker: 'I — Origine',
  title: 'Qui suis-je ?',
  /**
   * Le texte principal se dévoile mot à mot au scroll.
   * Le mot entouré de [crochets] devient un fragment caché cliquable :
   * garde exactement un mot entre crochets.
   */
  statement:
    'Je suis Augustin, étudiant en BUT Métiers du Multimédia et de l’Internet. J’aime concevoir des sites qui se vivent plutôt qu’ils ne se lisent : des interfaces claires, des animations qui ont un sens et des univers que l’on prend plaisir à [explorer].',
  inscription: '« Ce qui est caché n’attend que d’être cherché. »',
  paragraphs: [
    'Le BUT MMI m’apprend à passer d’une idée à un produit fini : comprendre un besoin, imaginer une interface, la designer puis la développer.',
    'Ma manière de travailler : partir de l’intention, construire des maquettes, tester tôt et soigner les détails qui font la différence. Ce portfolio en est le premier exemple.',
  ],
  /** Fiche « personnage ». Remplace les valeurs par les tiennes. */
  attributes: [
    { label: 'Formation', value: 'BUT MMI' },
    { label: 'Terrain de jeu', value: 'Web créatif & interfaces' },
    { label: 'Recherche', value: 'À COMPLÉTER — stage, alternance…' },
    { label: 'Point de départ', value: 'À COMPLÉTER — ta ville' },
  ],
  portrait: {
    src: '/images/wanderer.webp',
    alt: 'Silhouette d’un voyageur au bord d’une falaise, face à une vallée brumeuse',
    /** Mets `false` quand tu remplaces l’image par ta photo. */
    placeholder: true,
  },
}

/** Section « Au-delà de l'écran » */
export const beyond = {
  kicker: 'V — Au-delà de l’écran',
  title: 'Ce qui me guide',
  quote: 'Un bon design ne dit pas tout. Il donne envie de chercher.',
  principles: [
    {
      numeral: 'I',
      title: 'Vision',
      text: 'Je crois aux interfaces qui respectent l’attention : peu d’éléments, mais chacun à sa place. L’émotion doit servir la compréhension, jamais la remplacer.',
    },
    {
      numeral: 'II',
      title: 'Méthode',
      text: 'Comprendre, esquisser, prototyper, tester, recommencer. J’avance par itérations courtes et je garde toujours une trace de la démarche.',
    },
    {
      numeral: 'III',
      title: 'Inspirations',
      text: 'Le design éditorial, la photographie de paysage, les sites primés pour leur narration… et les jeux vidéo qui racontent sans expliquer.',
    },
  ],
  passionTitle: 'Ce que m’ont appris les mondes de FromSoftware',
  passion:
    'Elden Ring, Dark Souls et Sekiro m’ont montré qu’un environnement peut raconter une histoire sans un mot, que la curiosité mérite d’être récompensée et que la difficulté bien dosée crée de la satisfaction. J’essaie d’appliquer ces leçons au web : une narration par l’espace, des détails qui se découvrent et une progression qui donne envie d’aller plus loin.',
  groundMessage: {
    hidden: 'Essaie de t’attarder…',
    revealed: 'Merci d’être resté jusqu’ici. La curiosité est déjà une qualité.',
  },
}

/** Section contact. Tous les liens se modifient ici. */
export const contact = {
  kicker: 'VI — La dernière grâce',
  title: 'Reposons-nous un instant',
  lead: 'Un projet, un stage, une question ou simplement l’envie d’échanger ? Ma porte est ouverte.',
  /** ⚠️ À REMPLACER par ton adresse réelle : le bouton « Écrire » l’utilise. */
  email: 'ton.adresse@exemple.fr',
  cta: 'Écrire un message',
  links: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ton-profil', note: 'À COMPLÉTER' },
    { label: 'GitHub', href: 'https://github.com/augustinnnnnn' },
    // Ajoute d'autres liens ici, par exemple :
    // { label: 'Behance', href: 'https://www.behance.net/ton-profil' },
  ] as { label: string; href: string; note?: string }[],
  footer: 'Conçu et développé par Augustin.',
}

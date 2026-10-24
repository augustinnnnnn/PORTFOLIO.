/**
 * ============================================================
 *  PROJETS — tes réalisations.
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
 *  - `featured: true` : le projet phare, mis en vitrine avec son grand titre
 *    (`shortTitle`) et sa galerie (`gallery`, 3 à 6 images). Un seul à la fois.
 *  - Champs facultatifs du panneau détaillé : `role`, `duration`, `client`,
 *    `challenges` (difficultés → solutions), `improvements`, `learnings`,
 *    `images` (galerie complète affichée en bas du panneau).
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
  featured?: boolean
  /** Titre court affiché en très grand dans la vitrine du projet phare. */
  shortTitle?: string
  /** Phrase d'accroche et note sous le grand titre de la vitrine. */
  showcase?: { claim: string; note: string }
  gallery?: { src: string; caption: string }[]
  role?: string
  duration?: string
  client?: string
  context: string
  process: { title: string; text: string }[]
  challenges?: { problem: string; solution: string }[]
  result: string
  learnings?: string
  improvements?: string[]
  images?: { src: string; caption: string }[]
}

const demoProcess = [
  { title: 'Comprendre', text: 'Décris ici le besoin, la cible et les contraintes du projet.' },
  { title: 'Concevoir', text: 'Présente tes recherches, moodboards, wireframes et maquettes.' },
  { title: 'Réaliser', text: 'Explique les choix techniques, les difficultés rencontrées et comment tu les as résolues.' },
]

export const projects: Project[] = [
  {
    id: 'ferme-buissiere',
    title: 'Ferme de la Buissière',
    shortTitle: 'Buissière',
    category: 'Stage · Identité visuelle & site web',
    year: '2026',
    cover: '/images/projets/buissiere/cover.webp',
    coverSmall: '/images/projets/buissiere/cover-sm.webp',
    coverAlt: 'Recto du dépliant triptyque de la Ferme de la Buissière, vert forêt et crème, avec le logo pomme et poire',
    summary: 'Une ferme familiale du Loiret sans aucune communication : en 11 semaines de stage, j’ai créé sa charte graphique, son logo, son dépliant et son site WordPress.',
    tags: ['Illustrator', 'Canva', 'Figma', 'WordPress', 'Elementor'],
    layout: 'wide',
    featured: true,
    showcase: {
      claim: 'Tout était à créer.',
      note: 'Stage de 2e année · identité visuelle, dépliant et site web d’une ferme du Loiret.',
    },
    gallery: [
      { src: '/images/projets/buissiere/identite.webp', caption: 'Le logo pomme + poire et ses déclinaisons' },
      { src: '/images/projets/buissiere/charte.webp', caption: 'La charte : 7 teintes, 3 typographies' },
      { src: '/images/projets/buissiere/depliant.webp', caption: 'Le dépliant triptyque, recto et verso' },
      { src: '/images/projets/buissiere/wireframes.webp', caption: 'Les wireframes des 3 pages sur Figma' },
      { src: '/images/projets/buissiere/site.webp', caption: 'Le site WordPress : Accueil, Nos Produits, À Propos' },
    ],
    role: 'Stagiaire en communication visuelle, en autonomie',
    duration: '11 semaines · 13 avril → 26 juin 2026',
    client: 'Ferme de la Buissière · pommes, poires et jus · Saint-Jean-de-Braye (45)',
    context:
      'La Ferme de la Buissière produit une dizaine de variétés de pommes et quatre de poires, presse ses propres jus et propose des légumes de producteurs locaux, en vente directe et en livraison aux professionnels. Avant mon arrivée, sa communication se limitait à quelques panneaux en ville et au bouche-à-oreille : ni identité visuelle, ni site web, ni réseaux sociaux.',
    process: [
      {
        title: 'Cadrer et s’organiser',
        text: 'Analyse de l’existant et définition des missions avec la gérante, puis un tableau de bord Excel dès la première semaine : missions, avancement, livrables et journal hebdomadaire. Chaque réalisation était validée avant de passer à la suivante.',
      },
      {
        title: 'La charte graphique, socle du projet',
        text: 'Un moodboard d’identités de fermes, de cidreries et d’épiceries, puis une palette de 7 teintes autour de 3 couleurs (vert forêt #2D3F24, rouge pomme #B6322A, crème #F4EAD5) et 3 polices Google Fonts : Fraunces pour les titres, Work Sans pour les textes, Caveat pour les touches manuscrites.',
      },
      {
        title: 'Le logo',
        text: 'Trois pistes en croquis, un monogramme et deux emblèmes. L’emblème pomme + poire a été retenu car il montre directement les produits. Dessiné en vectoriel sous Illustrator, en deux versions (emblème seul, et complet avec le nom et le slogan) déclinées sur fond crème et blanc, avec un vrai travail de précision sur la symétrie des traits.',
      },
      {
        title: 'Le dépliant',
        text: 'Un triptyque recto-verso de 6 volets : produits, tarifs, horaires, coordonnées et QR code. Réalisé sur Canva pour que la gérante puisse modifier elle-même ses tarifs et ses horaires, sans dépendre d’un prestataire.',
      },
      {
        title: 'Les wireframes',
        text: 'La structure des 3 pages (Accueil, Nos Produits, À Propos) posée sur Figma, en zonage simple, et validée avant toute mise en forme.',
      },
      {
        title: 'Le site WordPress',
        text: 'Installation en local avec XAMPP et phpMyAdmin, thème Astra et constructeur Elementor. Chaque page reproduit les wireframes et applique la charte : fond crème, logo, couleurs et polices de la ferme.',
      },
    ],
    challenges: [
      { problem: 'Prise en main d’Elementor', solution: 'Entraide avec des camarades et beaucoup d’essais jusqu’à maîtriser l’outil.' },
      { problem: 'Logo SVG bloqué par WordPress (sécurité)', solution: 'Installation de l’extension Safe SVG.' },
      { problem: 'Affichage sur mobile', solution: 'Partiellement réglé : c’est le prochain chantier avant la mise en ligne.' },
      { problem: 'Le temps, quand les difficultés s’accumulent', solution: 'Priorité donnée au site, en accord avec la gérante ; la vidéo promotionnelle n’a pas été réalisée.' },
    ],
    result:
      'Une entreprise qui n’avait aucun support de communication dispose désormais d’une identité complète et cohérente, du dépliant au site web. La charte et le logo ont été validés sans grande modification ; le site est fonctionnel en local, avec ses 3 pages et sa navigation.',
    learnings: 'Autonomie et organisation, faire des choix et les assumer, et présenter mes idées simplement à une interlocutrice qui n’est pas spécialiste du design.',
    improvements: [
      'Commencer le site plus tôt et fixer un temps limite par mission.',
      'Finaliser l’affichage mobile, puis mettre le site en ligne.',
      'Retoucher des photos des produits pour enrichir le site.',
    ],
    images: [
      { src: '/images/projets/buissiere/contexte.webp', caption: 'Le point de départ : les vergers, les jus pressés et l’ancien panneau publicitaire' },
      { src: '/images/projets/buissiere/recherche.webp', caption: 'Recherche : le moodboard et les croquis des pistes de logo' },
      { src: '/images/projets/buissiere/charte.webp', caption: 'La charte graphique : palette chromatique et typographies' },
      { src: '/images/projets/buissiere/identite.webp', caption: 'Le logo final, emblème seul et version complète (Illustrator)' },
      { src: '/images/projets/buissiere/depliant.webp', caption: 'Le dépliant triptyque, recto et verso (Canva)' },
      { src: '/images/projets/buissiere/wireframes.webp', caption: 'Les wireframes des trois pages (Figma)' },
      { src: '/images/projets/buissiere/accueil.webp', caption: 'La page d’accueil du site WordPress' },
      { src: '/images/projets/buissiere/site.webp', caption: 'Les trois pages du site : Accueil, Nos Produits, À Propos' },
    ],
  },
  {
    id: 'projet-1',
    title: 'Atlas',
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
    title: 'Nova',
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
    title: 'Prisme',
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
    title: 'Écho',
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
    title: 'Lumen',
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
    title: 'Orbite',
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

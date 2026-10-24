/**
 * ============================================================
 *  COMPÉTENCES — tes compétences, regroupées par catégories.
 * ============================================================
 *  ⚠️ Liste de départ basée sur les enseignements habituels du BUT MMI :
 *  vérifie-la, retire ce que tu ne maîtrises pas et ajoute le reste.
 *
 *  - `glyph` : 1 à 3 caractères affichés dans la pastille (pas de logo de marque).
 *  - `uses`  : où / comment tu utilises la compétence.
 *  Aucune jauge ni pourcentage : la description parle d'elle-même.
 */

export type Skill = {
  name: string
  glyph: string
  description: string
  uses: string[]
}

export type SkillCategory = {
  id: string
  title: string
  summary: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'dev',
    title: 'Développement web',
    summary: 'Les outils avec lesquels je donne vie aux interfaces.',
    skills: [
      {
        name: 'HTML & CSS',
        glyph: 'Hc',
        description: 'Structurer un contenu de façon sémantique et accessible, puis le mettre en forme avec des mises en page responsives.',
        uses: ['Intégration de maquettes', 'Responsive design', 'Animations CSS'],
      },
      {
        name: 'JavaScript',
        glyph: 'Js',
        description: 'Rendre une page interactive : manipulation du DOM, événements, logique d’interface et premières animations.',
        uses: ['Interactions', 'Consommation d’API', 'Logique front-end'],
      },
      {
        name: 'WordPress',
        glyph: 'Wp',
        description: 'Monter un site de A à Z : installation en local (XAMPP, phpMyAdmin), thème Astra, pages construites avec Elementor, extensions comme Safe SVG.',
        uses: ['Site de la Ferme de la Buissière', 'Elementor', 'Astra'],
      },
      {
        name: 'React',
        glyph: 'Re',
        description: 'Découper une interface en composants réutilisables et gérer son état. À valider selon ton niveau réel.',
        uses: ['Applications monopage', 'Composants réutilisables'],
      },
      {
        name: 'PHP & SQL',
        glyph: 'Ph',
        description: 'Créer des pages dynamiques reliées à une base de données : formulaires, contenus, gestion simple.',
        uses: ['Sites dynamiques', 'Bases de données'],
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & intégration',
    summary: 'Ce qui protège la cohérence d’un projet, du pixel au système.',
    skills: [
      {
        name: 'Charte graphique',
        glyph: 'Cg',
        description: 'Construire l’identité d’une marque à partir d’un moodboard : palette, typographies et règles d’usage, appliquées ensuite à tous les supports.',
        uses: ['Charte Ferme de la Buissière : 7 teintes, 3 polices', 'Moodboard'],
      },
      {
        name: 'Typographie',
        glyph: 'Ty',
        description: 'Choisir et composer les caractères pour créer une hiérarchie lisible et une personnalité.',
        uses: ['Hiérarchie', 'Mise en page éditoriale'],
      },
      {
        name: 'Intégration fidèle',
        glyph: 'If',
        description: 'Traduire une maquette en code en respectant espacements, états et comportements responsive.',
        uses: ['Design system', 'Responsive'],
      },
    ],
  },
  {
    id: 'ux',
    title: 'UX/UI & prototypage',
    summary: 'Comprendre les utilisateurs avant de dessiner la moindre interface.',
    skills: [
      {
        name: 'Figma',
        glyph: 'Fg',
        description: 'Wireframes, maquettes haute fidélité, composants et prototypes interactifs.',
        uses: ['Wireframes de 3 pages (stage)', 'Moodboard', 'Maquettes'],
      },
      {
        name: 'Gestion de projet',
        glyph: 'Gp',
        description: 'Planifier et suivre un projet : tableau de bord Excel, planning hebdomadaire, livrables et validations régulières avec le client.',
        uses: ['Excel', 'Suivi des livrables', 'Points client'],
      },
      {
        name: 'Recherche utilisateur',
        glyph: 'Ru',
        description: 'Personas, parcours utilisateurs et tests simples pour vérifier qu’une interface répond au besoin.',
        uses: ['Personas', 'Parcours', 'Tests'],
      },
      {
        name: 'Accessibilité',
        glyph: 'Ac',
        description: 'Contrastes, navigation au clavier, textes alternatifs : concevoir pour tout le monde.',
        uses: ['Bonnes pratiques', 'Audit simple'],
      },
    ],
  },
  {
    id: 'media',
    title: 'Création graphique & multimédia',
    summary: 'Image, son et mouvement pour raconter autrement.',
    skills: [
      {
        name: 'Illustrator',
        glyph: 'Ai',
        description: 'Dessiner un logo en vectoriel, utilisable à toutes les tailles, et le décliner selon les fonds et les supports.',
        uses: ['Logo de la Ferme de la Buissière', 'Déclinaisons'],
      },
      {
        name: 'Canva',
        glyph: 'Cv',
        description: 'Mettre en page des supports imprimés en respectant une charte, tout en les laissant modifiables par le client.',
        uses: ['Dépliant triptyque', 'Supports print'],
      },
      {
        name: 'Photoshop',
        glyph: 'Ps',
        description: 'Retouche et composition d’images : un axe que je veux approfondir en 3e année.',
        uses: ['Retouche', 'Visuels'],
      },
      {
        name: 'Motion design',
        glyph: 'Mo',
        description: 'Animer des éléments graphiques pour expliquer, rythmer ou surprendre.',
        uses: ['Animations', 'Transitions'],
      },
      {
        name: 'Vidéo & montage',
        glyph: 'Vd',
        description: 'Tourner, monter et étalonner de courtes vidéos avec une intention narrative.',
        uses: ['Montage', 'Étalonnage', 'Son'],
      },
    ],
  },
]

/**
 * ============================================================
 *  ARSENAL — tes compétences, regroupées par catégories.
 * ============================================================
 *  ⚠️ Liste de départ basée sur les enseignements habituels du BUT MMI :
 *  vérifie-la, retire ce que tu ne maîtrises pas et ajoute le reste.
 *
 *  - `glyph` : 1 à 3 caractères gravés dans l'emplacement (pas de logo de marque).
 *  - `kind`  : le « type d'objet » affiché dans l'inspection (pure ambiance).
 *  - `uses`  : où / comment tu utilises la compétence.
 *  Aucune jauge ni pourcentage : la description parle d'elle-même.
 */

export type Skill = {
  name: string
  glyph: string
  kind: string
  description: string
  uses: string[]
}

export type SkillCategory = {
  id: string
  title: string
  /** Nom « équipement » affiché sous le titre. */
  slot: string
  summary: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'dev',
    title: 'Développement web',
    slot: 'Armes',
    summary: 'Les outils avec lesquels je donne vie aux interfaces.',
    skills: [
      {
        name: 'HTML & CSS',
        glyph: 'Hc',
        kind: 'Lame de fondation',
        description: 'Structurer un contenu de façon sémantique et accessible, puis le mettre en forme avec des mises en page responsives.',
        uses: ['Intégration de maquettes', 'Responsive design', 'Animations CSS'],
      },
      {
        name: 'JavaScript',
        glyph: 'Js',
        kind: 'Catalyseur',
        description: 'Rendre une page interactive : manipulation du DOM, événements, logique d’interface et premières animations.',
        uses: ['Interactions', 'Consommation d’API', 'Logique front-end'],
      },
      {
        name: 'React',
        glyph: 'Re',
        kind: 'Arme composite',
        description: 'Découper une interface en composants réutilisables et gérer son état. À valider selon ton niveau réel.',
        uses: ['Applications monopage', 'Composants réutilisables'],
      },
      {
        name: 'PHP & SQL',
        glyph: 'Ph',
        kind: 'Outil de forge',
        description: 'Créer des pages dynamiques reliées à une base de données : formulaires, contenus, gestion simple.',
        uses: ['Sites dynamiques', 'Bases de données'],
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & intégration',
    slot: 'Armures',
    summary: 'Ce qui protège la cohérence d’un projet, du pixel au système.',
    skills: [
      {
        name: 'Direction artistique',
        glyph: 'Da',
        kind: 'Heaume',
        description: 'Définir une ambiance : palette, typographie, images et rythme visuel au service d’un message.',
        uses: ['Moodboards', 'Identité visuelle'],
      },
      {
        name: 'Typographie',
        glyph: 'Ty',
        kind: 'Plastron',
        description: 'Choisir et composer les caractères pour créer une hiérarchie lisible et une personnalité.',
        uses: ['Hiérarchie', 'Mise en page éditoriale'],
      },
      {
        name: 'Intégration fidèle',
        glyph: 'If',
        kind: 'Gantelets',
        description: 'Traduire une maquette en code en respectant espacements, états et comportements responsive.',
        uses: ['Design system', 'Responsive'],
      },
    ],
  },
  {
    id: 'ux',
    title: 'UX/UI & prototypage',
    slot: 'Talismans',
    summary: 'Comprendre les utilisateurs avant de dessiner la moindre interface.',
    skills: [
      {
        name: 'Figma',
        glyph: 'Fg',
        kind: 'Talisman de l’esquisse',
        description: 'Wireframes, maquettes haute fidélité, composants et prototypes interactifs.',
        uses: ['Maquettes', 'Prototypes', 'Composants'],
      },
      {
        name: 'Recherche utilisateur',
        glyph: 'Ru',
        kind: 'Talisman de l’écoute',
        description: 'Personas, parcours utilisateurs et tests simples pour vérifier qu’une interface répond au besoin.',
        uses: ['Personas', 'Parcours', 'Tests'],
      },
      {
        name: 'Accessibilité',
        glyph: 'Ac',
        kind: 'Talisman du seuil',
        description: 'Contrastes, navigation au clavier, textes alternatifs : concevoir pour tout le monde.',
        uses: ['Bonnes pratiques', 'Audit simple'],
      },
    ],
  },
  {
    id: 'media',
    title: 'Création graphique & multimédia',
    slot: 'Sorts',
    summary: 'Image, son et mouvement pour raconter autrement.',
    skills: [
      {
        name: 'Photoshop & Illustrator',
        glyph: 'Ps',
        kind: 'Incantation picturale',
        description: 'Retouche, composition et création d’illustrations ou d’éléments vectoriels.',
        uses: ['Retouche', 'Visuels', 'Logos'],
      },
      {
        name: 'Motion design',
        glyph: 'Mo',
        kind: 'Incantation du mouvement',
        description: 'Animer des éléments graphiques pour expliquer, rythmer ou surprendre.',
        uses: ['Animations', 'Transitions'],
      },
      {
        name: 'Vidéo & montage',
        glyph: 'Vd',
        kind: 'Incantation du récit',
        description: 'Tourner, monter et étalonner de courtes vidéos avec une intention narrative.',
        uses: ['Montage', 'Étalonnage', 'Son'],
      },
    ],
  },
]

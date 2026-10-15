# Portfolio — Augustin

Portfolio immersif : une traversée sombre et contemplative, inspirée de l'atmosphère des jeux FromSoftware, au service de projets web et design.

**Stack** : Vite · React 18 · TypeScript · GSAP + ScrollTrigger · Lenis (défilement fluide). Aucune autre dépendance d'exécution.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # version de production dans dist/
npm run preview   # tester la version de production
```

---

## Modifier le contenu (sans toucher au code)

Tout le texte est dans `src/content/`. Les éléments marqués **À COMPLÉTER** sont des emplacements à remplacer.

| Fichier | Contenu |
| --- | --- |
| `src/content/site.ts` | Prénom, accroche, navigation, section « Qui suis-je ? », « Au-delà de l'écran », **e-mail et liens de contact** |
| `src/content/projects.ts` | **Les projets** (titre, image, description, outils, année, lien, démarche) |
| `src/content/skills.ts` | L'arsenal : catégories et compétences |
| `src/content/journey.ts` | La chronologie du parcours |
| `src/content/fragments.ts` | Gamification : noms, indices et textes des fragments, paliers de progression |

### Ajouter un projet

1. Place l'image de couverture dans `public/images/projets/` (format conseillé : `.webp`, environ 1600 × 1000 px, moins de 250 Ko). Une version de 800 px de large est un plus (`coverSmall`).
2. Dans `src/content/projects.ts`, copie un bloc existant et remplace les valeurs.
3. Mets `placeholder: false` (ou supprime la ligne) : le badge « Exemple — à remplacer » disparaît.
4. Choisis une composition avec `layout` : `'wide'`, `'tall'`, `'square'` ou `'offset'`. Alterne-les pour garder du rythme.

Les six projets actuels sont **des exemples** : remplace-les ou supprime-les.

### Contact

Dans `src/content/site.ts` → `contact` :
- `email` : **à remplacer** (le bouton « Écrire un message » ouvre un `mailto:` vers cette adresse) ;
- `links` : LinkedIn (à compléter), GitHub (déjà renseigné) ; ajoute-en d'autres sur le même modèle.

### Remplacer les images

Les visuels de `public/images/` sont **temporaires**. Ils sont générés par le script `scripts/generate-art.py` (`npm run images`, nécessite Python, numpy et Pillow). Ce sont des créations procédurales originales, libres de droits, qui ne représentent aucune réalisation.
- Portrait de la section « Qui suis-je ? » : `presentation.portrait` dans `site.ts` (passe `placeholder` à `false`).
- Couvertures de projets : champ `cover` de chaque projet.

---

## Ce qui est en place

- **Hero cinématique** : décor en couches SVG (montagnes, colonnades, porte monumentale), braises dans un canvas léger, brume animée en CSS, parallaxe à la souris. Au scroll, la caméra plonge à travers la porte jusqu'à la lumière, puis une phrase de transition apparaît.
- **Scrollytelling** : texte révélé mot à mot, images dévoilées par masque, galerie horizontale épinglée (verticale sur mobile), chronologie qui se dessine, passage du noir à la pierre claire (« l'aube ») puis retour à la nuit.
- **Panneau projet** : l'image s'étend depuis la vignette cliquée ; démarche en étapes ; navigation vers l'œuvre suivante ; fermeture avec Échap.
- **Gamification** (8 fragments de mémoire, sauvegardés en `localStorage`, aucune donnée personnelle) :
  1. une rune dans le ciel du hero ;
  2. le sceau de la navigation, à maintenir enfoncé (souris, toucher ou clavier) ;
  3. un mot cliquable dans « Qui suis-je ? » ;
  4. inspecter les 4 catégories de l'arsenal ;
  5. ouvrir un projet ;
  6. la braise au bout du chemin ;
  7. le « message au sol », à survoler longuement ;
  8. se reposer auprès de la grâce du contact.

  Compteur en bas à gauche → **Codex** (collection, indices, paliers *Sans-lueur → Voyageur → Porteur de fragments → Gardien des mémoires*, réinitialisation). Quand tout est trouvé : écran final et prénom doré dans le hero.
- **Navigation** : barre qui se masque en descendant, rail de progression (ordinateur), menu plein écran (mobile), curseur personnalisé (souris uniquement).
- **Accessibilité et performance** : `prefers-reduced-motion` respecté (pas d'épinglage ni de défilement fluide, contenu visible immédiatement), navigation au clavier (lien d'évitement, onglets de l'arsenal au clavier, focus géré à l’ouverture et à la fermeture des panneaux), canvas mis en pause hors écran, images WebP chargées en différé.

## Structure

```
src/
  content/     ← textes et données (à modifier)
  sections/    ← Hero, Presentation, Arsenal, Works, ProjectPanel, Journey, Beyond, Contact
  components/  ← Nav, Loader, Cursor, ScrollRail, EmberField, Glyphs, Lines…
  game/        ← GameContext (état, sauvegarde) + GameUI (HUD, notification, codex, épilogue)
  lib/         ← GSAP, Lenis, révélations au scroll, stockage
  styles/      ← tokens (palette, typographies), base, styles partagés
```

Palette et typographies : `src/styles/tokens.css` (Cormorant Garamond pour les titres, Cinzel pour les inscriptions, Inter Tight pour le texte).

## Mise en ligne

Le site est statique : `npm run build` produit le dossier `dist/`.

- **Vercel** ou **Netlify** : importe le dépôt GitHub. Commande de build : `npm run build`, dossier de sortie : `dist`. Le déploiement se refait à chaque push.
- **GitHub Pages** : si le site est servi depuis `https://<pseudo>.github.io/<depot>/`, ajoute `base: '/<depot>/'` dans `vite.config.ts` et préfixe les chemins d'images de `src/content/` avec ce même sous-dossier (ou utilise un domaine personnalisé pour garder `/`). Publie ensuite `dist/` avec une GitHub Action ou la branche `gh-pages`.

Avant la mise en ligne : remplacer l'e-mail, le lien LinkedIn, les textes « À COMPLÉTER », les projets d'exemple et le portrait temporaire. Mettre aussi à jour l'image de partage (`og:image` dans `index.html`).

# Portfolio — Augustin

Portfolio en une page, construit sur la structure, l'intro et le rythme de défilement de [danielkiss.hu](https://danielkiss.hu) (repéré sur Awwwards), dans une direction artistique sombre et dorée. Le code, les textes et les visuels sont originaux.

**Stack** : Vite · React 18 · TypeScript · GSAP (ScrollTrigger, ScrollSmoother, Draggable). Polices : Anton (titres), Permanent Marker (annotations manuscrites), Inter Tight (texte).

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # version de production dans dist/
npm run preview   # tester la version de production
```

---

## Modifier le contenu (sans toucher au code)

Tout le texte est dans `src/content/`. Les éléments marqués **À COMPLÉTER** sont des emplacements à remplacer. Dans les titres, `*texte*` s'affiche en or et `\n` force un retour à la ligne.

| Fichier | Contenu |
| --- | --- |
| `src/content/site.ts` | Prénom (et nom, affiché en or s'il est rempli), mots qui défilent, portrait, images de l'intro, textes de chaque section, principes de la section Approche, **e-mail et liens de contact** |
| `src/content/projects.ts` | **Les projets** (titre, image, description, outils, année, lien, démarche) et le **projet phare** (`featured: true` + `gallery`) |
| `src/content/skills.ts` | L'arsenal : catégories et compétences |
| `src/content/journey.ts` | Le parcours (grille sous le projet phare) |

### Ajouter un projet

1. Place l'image de couverture dans `public/images/projets/` (`.webp` conseillé, environ 1600 × 1000 px, moins de 250 Ko ; une version de 800 px de large va dans `coverSmall`).
2. Dans `src/content/projects.ts`, copie un bloc existant et remplace les valeurs.
3. Mets `placeholder: false` (ou supprime la ligne) : le badge « Exemple » disparaît.
4. Pour en faire le projet phare : `featured: true` et une `gallery` de 3 à 6 images (et retire `featured` de l'ancien).

Le premier projet, **Ferme de la Buissière** (stage de 2e année), est réel et sert de projet phare. Ses planches de présentation sont dans `public/images/projets/buissiere/` : elles ont été composées à partir du rapport de stage et du diaporama de soutenance, avec les coordonnées de la ferme floutées ou recadrées. Les cinq autres projets sont **des exemples** : remplace-les ou supprime-les.

### Contact

Dans `src/content/site.ts` → `contact` :
- `email` : **à remplacer** (utilisé par tous les boutons « e-mail » et « copier ») ;
- `links` : LinkedIn (à compléter), GitHub (déjà renseigné) ; ajoute-en d'autres sur le même modèle.

### Remplacer les images

Les visuels de `public/images/` sont **temporaires** : créations procédurales originales, libres de droits, générées par `scripts/generate-art.py` (`npm run images`, nécessite Python, numpy et Pillow). Elles ne représentent aucune réalisation.
- Portrait : `profile.portrait` dans `site.ts` (passe `placeholder` à `false`).
- Couvertures et galerie : champs `cover`, `coverSmall` et `gallery` des projets.

---

## Le parcours de la page

1. **Intro** — le nom s'écrit en haut à gauche, des visuels s'empilent en haut à droite, un compteur 000 → 100 avance sur une règle graduée ; à 100, le rideau remonte et dévoile la page.
2. **Hero** — nom géant, orbe tramé, portrait, annotation manuscrite. Au scroll, le nom, le slogan et le portrait **s'envolent dans la barre latérale fixe** (ordinateur).
3. **Barre latérale** — nom, slogan à mots changeants, liens, navigation numérotée, portrait (remplacé par les vignettes des projets dans la section Projets), e-mail à copier.
4. **Cadre** — règles graduées en haut et à gauche, repères du curseur, télémétrie verticale (x, y, progression, section).
5. **Profil** — grand titre bicolore et chiffres clés qui comptent.
6. **Compétences** — catégories numérotées qui s'allument lettre par lettre ; un clic déplie le détail.
7. **Projets** — carrousel 3D en arc piloté par le scroll ; chaque carte ouvre le panneau projet.
8. **Projet phare** — le titre s'assemble lettre par lettre, puis galerie épinglée « 01 / 05 » et parcours.
9. **Approche** — mes principes de travail, en éventail de cartes.
10. **Contact** — mur de vignettes qui s'assemble, à faire glisser, avec la carte de contact au centre.

### Accessibilité et performance

- `prefers-reduced-motion` : intro écourtée, pas de défilement amorti, d'envol ni d'épinglage ; la barre latérale est affichée d'emblée et tout le contenu est visible.
- Écran tactile : défilement natif ; sous 1100 px, mise en page mobile (menu plein écran, sans barre latérale).
- Navigation au clavier (lien d'évitement, focus géré dans le panneau projet), images WebP chargées en différé.

## Structure

```
src/
  content/     ← textes et données (à modifier)
  sections/    ← Hero, Intro, Skills, Works, Showcase, Approach, Contact, ProjectPanel
  components/  ← Loader (intro), Chrome (cadre), TopBar, Sidebar, Flyers, NameMark, Hand (pinceau, flèches), Rich…
  lib/         ← GSAP, défilement amorti, envol (useFlight), animations
  styles/      ← tokens (palette, typographies), base, mise en page
```

## Mise en ligne

Le site est statique : `npm run build` produit le dossier `dist/`.

- **Vercel** ou **Netlify** : importe le dépôt GitHub. Commande de build : `npm run build`, dossier de sortie : `dist`. Le déploiement se refait à chaque push.
- **GitHub Pages** : si le site est servi depuis `https://<pseudo>.github.io/<depot>/`, ajoute `base: '/<depot>/'` dans `vite.config.ts` et préfixe les chemins d'images de `src/content/` avec ce sous-dossier (ou utilise un domaine personnalisé).

Avant la mise en ligne : remplacer l'e-mail, le lien LinkedIn, les textes « À COMPLÉTER », les projets d'exemple et le portrait temporaire, et mettre à jour l'image de partage (`og:image` dans `index.html`).

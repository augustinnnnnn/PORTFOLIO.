# Portfolio — Augustin

Portfolio en une page, construit sur la structure et le rythme de défilement de [danielkiss.hu](https://danielkiss.hu) (repéré sur Awwwards), réinterprété dans un univers sombre et doré inspiré des jeux FromSoftware. Le code, les textes et les visuels sont originaux.

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
| `src/content/site.ts` | Prénom (et nom, affiché en or s'il est rempli), mots qui défilent, portrait, textes de chaque section, **e-mail et liens de contact** |
| `src/content/projects.ts` | **Les projets** (titre, image, description, outils, année, lien, démarche) et l'**œuvre phare** (`featured: true` + `gallery`) |
| `src/content/skills.ts` | L'arsenal : catégories et compétences |
| `src/content/journey.ts` | Le parcours (grille sous la vitrine) |
| `src/content/fragments.ts` | Gamification : noms, indices et textes des fragments, paliers |

### Ajouter un projet

1. Place l'image de couverture dans `public/images/projets/` (`.webp` conseillé, environ 1600 × 1000 px, moins de 250 Ko ; une version de 800 px de large va dans `coverSmall`).
2. Dans `src/content/projects.ts`, copie un bloc existant et remplace les valeurs.
3. Mets `placeholder: false` (ou supprime la ligne) : le badge « Exemple » disparaît.
4. Pour en faire l'œuvre phare : `featured: true` et une `gallery` de 3 à 6 images (et retire `featured` de l'ancien).

Les six projets actuels sont **des exemples** : remplace-les ou supprime-les.

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

1. **Hero** — nom géant, orbe de lumière tramé, portrait, annotation manuscrite. Au scroll, le nom, le slogan et le portrait **s'envolent dans la barre latérale fixe** (ordinateur).
2. **Barre latérale** — nom, slogan à mots changeants, liens, navigation numérotée, portrait (remplacé par les vignettes des œuvres dans la section Œuvres), e-mail à copier.
3. **Cadre** — règles graduées en haut et à gauche, repères du curseur, télémétrie verticale (x, y, progression, section).
4. **Origine** — grand titre bicolore, chiffres clés qui comptent, vision, « message au sol ».
5. **Arsenal** — catégories numérotées qui s'allument lettre par lettre ; un clic déplie le détail.
6. **Œuvres** — carrousel 3D en arc piloté par le scroll (section épinglée) ; chaque carte ouvre le panneau projet.
7. **Vitrine** — le titre de l'œuvre phare s'assemble lettre par lettre, puis galerie épinglée « 01 / 05 » et parcours.
8. **Fragments** — l'éventail de cartes et la liste des fragments trouvés (à la place des récompenses de la référence).
9. **Contact** — mur de vignettes qui s'assemble, à faire glisser, avec la carte de contact au centre.

### Gamification (8 fragments, sauvegardés en `localStorage`, aucune donnée personnelle)

1. une rune dans l'orbe de lumière du hero ;
2. maintenir le nom enfoncé (souris, toucher ou clavier) ;
3. un mot cliquable dans « Origine » ;
4. le « message au sol », à survoler longuement ;
5. ouvrir les 4 catégories de l'arsenal ;
6. ouvrir une œuvre ;
7. la braise au bout du parcours ;
8. une tuile lumineuse cachée dans le mur du contact.

Le compteur `0/8` (navigation) ouvre le **Codex** : collection, indices, paliers *Sans-lueur → Voyageur → Porteur de fragments → Gardien des mémoires*, réinitialisation. Quand tout est trouvé : écran final et nom doré.

### Accessibilité et performance

- `prefers-reduced-motion` : pas de défilement amorti, d'envol ni d'épinglage ; la barre latérale est affichée d'emblée et tout le contenu est visible.
- Écran tactile : défilement natif ; sous 1100 px, mise en page mobile (menu plein écran, sans barre latérale).
- Navigation au clavier (lien d'évitement, focus géré dans le panneau projet et le codex), images WebP chargées en différé.

## Structure

```
src/
  content/     ← textes et données (à modifier)
  sections/    ← Hero, Intro, Skills, Works, Showcase, Fragments, Contact, ProjectPanel
  components/  ← Chrome (cadre), TopBar, Sidebar, Flyers, NameMark, Hand (pinceau, flèches), Rich…
  game/        ← GameContext (état, sauvegarde) + GameUI (notification, codex, écran final)
  lib/         ← GSAP, défilement amorti, envol (useFlight), animations
  styles/      ← tokens (palette, typographies), base, mise en page
```

## Mise en ligne

Le site est statique : `npm run build` produit le dossier `dist/`.

- **Vercel** ou **Netlify** : importe le dépôt GitHub. Commande de build : `npm run build`, dossier de sortie : `dist`. Le déploiement se refait à chaque push.
- **GitHub Pages** : si le site est servi depuis `https://<pseudo>.github.io/<depot>/`, ajoute `base: '/<depot>/'` dans `vite.config.ts` et préfixe les chemins d'images de `src/content/` avec ce sous-dossier (ou utilise un domaine personnalisé).

Avant la mise en ligne : remplacer l'e-mail, le lien LinkedIn, les textes « À COMPLÉTER », les projets d'exemple et le portrait temporaire, et mettre à jour l'image de partage (`og:image` dans `index.html`).

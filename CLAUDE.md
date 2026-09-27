# SIRA — le chemin des cultures

Ce fichier est lu par Claude Code à chaque session, pour chaque membre de l'équipe. Il fixe les règles communes. Si une demande contredit ce fichier, signale-le avant d'agir.

## Le projet

Jeu mobile gratuit « 4 images → 1 mot » sur le patrimoine du Burkina Faso, porté par FASO ESPORT. PWA jouable hors-ligne, cible : Android d'entrée de gamme, data limitée, 12–35 ans.

Anciens noms de travail : « Faso Devine », « Kibaré ». Ils ne doivent apparaître nulle part dans le code ni l'interface.

## Périmètre

On construit la **V1**. Une session = une tâche précise : ne fais que ce qui est demandé, même si la suite te paraît évidente. Les écrans et fonctionnalités non demandés sont réservés à d'autres membres de l'équipe (voir `docs/taches-equipe.md`). Si tu vois un travail utile hors périmètre, propose-le en fin de réponse, ne le code pas.

## Sources de vérité (par ordre de priorité)

1. `docs/design/maquettes/` (17 écrans) + `docs/design/couleurs-v1.md` : écrans, parcours, couleurs. Priment sur le GDD.
2. `src/config/game.json` : tous les chiffres réglables (gains, coûts, seuils). Propriété du pôle Game Design. Ne jamais coder un de ces chiffres en dur.
3. `docs/gdd-v3.md` : règles de jeu pour tout ce que les maquettes ne couvrent pas. Écrit avant le nom SIRA et la charte : son annexe 2 (couleurs, typo) est périmée.

En cas de conflit non couvert : ne pas trancher seul, ouvrir une question dans la PR.

## Stack

- Vue 3 (Composition API, `<script setup>`), Vite, TypeScript
- `vite-plugin-pwa` (hors-ligne, installable)
- Pinia (état), Vue Router
- Dexie (IndexedDB) : progression, Cauris, historique des énigmes. **Jamais de localStorage** pour les données de jeu.
- Icônes : `lucide-vue-next`. Le cauri est une icône SVG maison (`src/components/icons/IconCauri.vue`). Jamais d'emoji comme icône.
- Polices auto-hébergées (`@fontsource`), jamais de CDN : le jeu doit tourner hors-ligne.
- Tests : Vitest.
- **Aucun backend.** Supabase est réservé à la V2 (multijoueur en ligne).

## Commandes

- `npm run dev` : serveur local
- `npm run content` : reconstruit le contenu depuis `content-source/` (voir plus bas)
- `npm run test` : tests Vitest
- `npm run lint` : ESLint + vérification des types
- `npm run build` : build de production

## Structure

```
src/
  engine/       logique de jeu PURE (pas de Vue, pas de DOM) : normalisation, tuiles, économie, progression
  stores/       Pinia : branche l'engine sur l'UI et sur Dexie
  db/           schéma Dexie et migrations
  config/       game.json (chiffres réglables)
  content/      puzzles.json GÉNÉRÉ (ne pas éditer à la main)
  assets/       fichiers de marque (logo…) importés par le code
  components/   composants réutilisables (boutons, puces, tuiles, modales)
  screens/      un fichier par écran des maquettes
  styles/       tokens.css (couleurs, espacements, rayons)
  i18n/         fr.ts : tous les textes d'interface
  dev/          outils de dev uniquement (page /kit), absents du build de production
public/content/ images WebP GÉNÉRÉES
scripts/        build-content (dossiers → WebP + puzzles.json)
content-source/ contenu brut, IGNORÉ par git
docs/           GDD, maquettes, couleurs
```

Règle : toute logique de jeu va dans `src/engine/` et a ses tests. Les composants affichent, ils ne calculent pas.

## Contenu

Source : `content-source/` (non versionné, trop lourd). Arborescence : `<Région>(<Chef-lieu>)/<Réponse>/` avec 4 images + 1 fichier `.txt` (anecdote). **Le nom du dossier de réponse est la réponse.**

`npm run content` produit `src/content/puzzles.json` et `public/content/img/*.webp`, et affiche un rapport d'erreurs (images manquantes, encodage, région inconnue). `npm run content -- --check` vérifie sans rien écrire. Seul `puzzles.json` est versionné : les WebP ne vont pas sur GitHub tant que les droits des images ne sont pas vérifiés, chaque membre les génère en local avec `npm run content`.

Un fichier `meta.json` optionnel dans un dossier de réponse surcharge les valeurs par défaut (logique A/B, langue, leurres, source, crédits images).

Les propositions du Carré/Duo et les lettres-leurres du Direct sont générées automatiquement à partir des autres réponses, sauf si `meta.json` les fournit.

Mooré : les caractères Ɛ Ɔ Ŋ Ñ sont des tuiles comme les autres. Toujours normaliser les chaînes en NFC. Comparer les réponses tuile par tuile, jamais par comparaison de chaînes approximative.

## Design

- Couleurs : uniquement via les variables de `src/styles/tokens.css`, qui reprennent `docs/design/couleurs-v1.md`. **Aucun hex dans un composant.**
- Une couleur = un rôle : vert = avancer/réussir, jaune = récompense/Cauris, rouge = identité + pression du temps, neutres = structure + verrouillé.
- Un seul bouton principal (vert) par écran.
- Cibles tactiles ≥ 44×44 px. Contraste AA minimum (tableau dans `couleurs-v1.md`).
- La couleur n'est jamais le seul signal : coche, croix, cadenas ou texte l'accompagnent toujours.
- Les tuiles leurres ont exactement le même aspect que les bonnes tuiles.
- Respecter `prefers-reduced-motion`.
- Mobile d'abord (375 px), pas de scroll horizontal.

## Performance

Téléphones modestes et 3G : images WebP compressées, précache par région, pas de librairie lourde sans justification. Vérifier la taille du bundle avant d'ajouter une dépendance.

## Conventions

- Code (variables, fonctions, fichiers) en anglais. Textes d'interface et commentaires en français.
- Tous les textes d'interface dans `src/i18n/fr.ts`, pas en dur dans les composants.
- Branches : `feat/…`, `fix/…`, `content/…`, `chore/…` (maintenance sans nouvelle fonctionnalité). Jamais de commit direct sur `main`.
- Une PR = une tâche. Elle doit passer `lint`, `test` et `build`.
- Messages de commit en français, à l'impératif : « Ajoute la modale Indice ».

## Ce qu'il ne faut pas faire

- Pas de localStorage pour la progression, pas de backend, pas de CDN.
- Pas de chiffre de jeu en dur (tout est dans `game.json`).
- Pas d'édition manuelle de `puzzles.json` ni des WebP générés.
- Ne pas ajouter de fonctionnalité hors V1 (multijoueur en ligne, cosmétiques) : la noter dans une issue « V2 ».

# Tâches réservées à l'équipe

Le **cœur jouable** (Splash, Hub, Tour du Faso, écran Question, Bravo, Réessayer, Région terminée, et les composants `ResultIcon`, `AnswerReveal`, `TagPill`, `RegionNode`, `PuzzleImages`) est construit par le responsable du dépôt. Les tâches ci-dessous viennent **s'y brancher** : 9 de niveau débutant, 9 de niveau intermédiaire.

Claude Code ne code aucune de ces tâches : quand il repère un travail hors de sa mission, il l'ajoute ici.

**Avant tout :** installe le projet en suivant le [`README.md`](../README.md), et lis [`CLAUDE.md`](../CLAUDE.md).

## Sommaire

| | Tâche | Interrupteur | Dépend de |
|---|---|---|---|
| D1 | [Qualité WebP : moins de 40 Ko par image](#d1-qualité-webp--moins-de-40-ko-par-image) | — | — |
| D2 | [Tableau de correspondance PNG ↔ PDF](#d2-tableau-de-correspondance-png--pdf-des-maquettes) | — | — |
| D3 | [Modale « Pas assez de Cauris »](#d3-modale--pas-assez-de-cauris-) | — | — |
| D4 | [Modale « Champion verrouillé »](#d4-modale--champion-verrouillé-) | — | — |
| D5 | [Écran « Temps écoulé »](#d5-écran--temps-écoulé-) | — | — |
| D6 | [Écran « Run terminé »](#d6-écran--run-terminé--variante-récompense-de-tagpill) | — | — |
| D7 | [Écran Paramètres](#d7-écran-paramètres--son-et-réinitialisation) | `settings` | — |
| D8 | [Garder la sauvegarde](#d8-demander-au-navigateur-de-garder-la-sauvegarde) | `persistStorage` | — |
| D9 | [Icônes PWA à partir du logo](#d9-icônes-pwa-à-partir-du-logo) | — | — |
| I1 | [CI GitHub Actions](#i1-intégration-continue--github-actions-sur-chaque-pr) | — | — |
| I2 | [Option `--prune`](#i2-option---prune-du-script-de-contenu) | — | — |
| I3 | [Modale Indice et les 3 indices](#i3-modale-indice-et-branchement-des-3-indices) | `hints` | D3 |
| I4 | [Bibliothèque](#i4-bibliothèque-et-son-accès-depuis-le-hub) | `library` | — |
| I5 | [Mode Champion](#i5-mode-champion--logique-et-écran) | `champion` | D4, D5, D6 |
| I6 | [Mode Maître](#i6-mode-maître-avec-le-format-duo) | `maitre` | I5, D5 |
| I7 | [Sons](#i7-intégration-des-sons) | `sounds` | D7 |
| I8 | [Précache hors-ligne par région](#i8-précache-hors-ligne-par-région) | — | — |
| I9 | [Duel local](#i9-duel-local-sur-le-même-téléphone) | `duelLocal` | — |

## Comment prendre une tâche

1. Mets ton nom dans « Pris par » (dans une petite PR, ou en prévenant le responsable), pour que deux personnes ne fassent pas la même chose.
2. Crée ta branche depuis `main` à jour : `git switch main`, `git pull`, puis `git switch -c feat/…` (ou `fix/…`, `content/…`, `chore/…`).
3. Une tâche = une PR. Avant de l'ouvrir : `npm run lint`, `npm run test` et `npm run build` doivent passer.
4. Si ta tâche a un **interrupteur**, passe-le à `true` dans `src/config/features.ts` **dans ta PR**, et retire son nom de la liste `stillOff` de `src/config/features.test.ts`. Tant qu'il est à `false`, ta fonctionnalité ne doit laisser aucune trace dans le jeu (ni bouton, ni lien, ni écran vide).
5. Mets dans la PR une capture à 375 px de large, à côté de la maquette couleur.

**Niveaux :**
- **Débutant :** assembler des composants qui existent déjà, régler, observer ; peu de logique.
- **Intermédiaire :** de la logique en TypeScript, avec des tests Vitest.

## Règles communes

- **Maquettes :** les PNG de `docs/design/maquettes/` donnent la disposition ; les couleurs viennent de `maquettes-couleur-v1.pdf`, dont l'ordre des pages **n'est pas** celui des PNG. Chaque tâche indique les deux numéros.
- **Composants :** uniquement ceux de `src/components/`, visibles sur **http://localhost:5173/kit**. S'il en manque un, crée-le dans `src/components/` et ajoute-le à `/kit` (`src/dev/KitScreen.vue`, textes dans `src/dev/kit-texts.ts`) avec tous ses états.
- **Où mettre quoi :**

  | Quoi | Où |
  |---|---|
  | Texte affiché au joueur | `src/i18n/fr.ts` |
  | Couleur, espacement, rayon, taille | un token de `src/styles/tokens.css` (`var(--space-16)`…) ; **aucun hex** dans un composant |
  | Chiffre de jeu (gain, coût, seuil) | `src/config/game.json`, vérifié par `validateGameConfig` dans `src/engine/config.ts` |
  | Délai d'interface | `src/config/ui.ts` |
  | Règle de jeu | `src/engine/` (TypeScript pur, testé ; hasard **uniquement** via `createRng`) |
  | Lecture ou écriture de la sauvegarde | `src/db/repository.ts`, appelé **par un store**, jamais par un écran |

- **Sauvegarde :** une nouvelle table ou un nouveau champ = une **nouvelle version** du schéma (voir le commentaire en tête de `src/db/database.ts`, et le test de migration dans `src/db/database.test.ts`). Si deux tâches en ont besoin en même temps, la première fusionnée prend la version 2, l'autre la version 3.
- **Voir un écran pas encore relié au jeu :** ajoute une route `/dev/<écran>` avec des props factices dans le bloc `if (import.meta.env.DEV)` de `src/router.ts` :

  ```ts
  routes.push({
    path: '/dev/temps-ecoule',
    component: () => import('@/screens/TimeUpModal.vue'),
    props: { open: true, answer: 'Bankui' },
  })
  ```

- **Accessibilité :** cibles tactiles d'au moins 44×44 px ; un seul bouton principal (vert) par écran ; jamais la couleur comme seul signal (ajoute une icône ou un texte) ; aucun défilement horizontal à 375 px ni à 320 px.

## Aide-mémoire du code existant

| Tu cherches… | C'est ici |
|---|---|
| L'état du joueur (Cauris, points, série) | `usePlayerStore()` dans `src/stores/player.ts` : `profile`, `spendCauris(cost)`, `addCauris(n)`, `championUnlocked()` |
| La progression des régions | `useProgressStore()` dans `src/stores/progress.ts` : `regions`, `isUnlocked(id)`, `completeRegion(…)` |
| La partie en cours du Classique | `useGameStore()` dans `src/stores/game.ts` : `round`, `run`, `lastResult`, `startRegion(id)`, `submit(choiceId?)`, `requestHint(hint)`, `next()` |
| Préparer une énigme (propositions ou plateau) | `createRound()` dans `src/engine/round.ts` |
| Les indices | `applyHint()` dans `src/engine/hints.ts` |
| Les gains | `answerReward()`, `baseGain()`, `spend()` dans `src/engine/economy.ts` |
| Le hasard reproductible | `createRng(seed)`, `seedFromString(code)` dans `src/engine/random.ts` |
| Les réglages du jeu, typés | `gameConfig` dans `src/config/game.ts` |
| Les énigmes et les régions | `catalog` dans `src/content/catalog.ts` |
| Des données de test toutes prêtes | `testConfig()`, `makePuzzle()`, `PUZZLES` dans `src/engine/testing.ts` |
| Un exemple de test de composant | `src/components/GameModal.test.ts`, `src/screens/screens.test.ts` |
| Un exemple de test avec la sauvegarde | `src/db/database.test.ts` (fake-indexeddb) |

---

# Débutant

## D1. Qualité WebP : moins de 40 Ko par image

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**En bref :** trouver la qualité WebP qui garde de belles photos tout en passant sous 40 Ko par image.

**Contexte.** Le jeu vise des téléphones modestes et la 3G : chaque image d'énigme devrait peser moins de 40 Ko. Avec la qualité actuelle (70), 10 images dépassent :

| Réponse | Fichier source | WebP actuel |
|---|---|---|
| Mossi | `images2.jpg` | 62,5 Ko |
| Mossi | `FB_IMG_1751467563616.jpg` | 58,4 Ko |
| Peul | `1316434-Jeunes_hommes_peuls.jpg` | 48,3 Ko |
| Birifor | `images1.jpg` | 47,4 Ko |
| Bwaba | `Masque_de_l'éthnie_Bwaba.jpg` | 46,6 Ko |
| Samo | `MCM_1992_BF_S_PN1_005.jpg` | 46,1 Ko |
| Gourmantché | `FB_IMG_1752162035483.jpg` | 43,3 Ko |
| Dagara | `Dagara-1.jpg` | 41,9 Ko |
| Mossi | `images1.jpg` | 41,8 Ko |
| Bobo | `Bobo.jpg` | 40,1 Ko |

**À lire avant de commencer :** le haut de `scripts/build-content.ts` (les constantes de réglage) et la fonction `convertImage`, qui fait la conversion avec `sharp`.

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `scripts/build-content.ts` | modifier | changer la valeur de `WEBP_QUALITY` (ligne `const WEBP_QUALITY = 70`) |

**Étapes :**
1. Lance `npm run dev` et ouvre une région où apparaît une image lourde (Mossi : Kadiogo ; Bobo : Guiriko).
2. Supprime le dossier `public/content/img/` (il n'est pas versionné, il se régénère). **Sans ça, le script garde les anciennes images.**
3. Mets `WEBP_QUALITY` à 60, lance `npm run content`, recharge le jeu, fais une capture de l'écran Question à 375 px.
4. Recommence avec 50 (et une autre valeur si besoin).
5. Compare les captures : visages, textures des masques, textes sur les images.

**Vérifier :** le rapport de `npm run content` affiche la ligne « Poids WebP » et les avertissements « WebP de plus de 40 Ko ».

**Critères de fin :**
- [ ] Au moins 3 valeurs essayées, avec les captures de comparaison dans la PR.
- [ ] Le choix est expliqué dans la PR.
- [ ] Le rapport n'affiche plus « WebP de plus de 40 Ko », ou chaque exception restante est justifiée.

**Pièges :** oublier de vider `public/content/img/` entre deux essais (tu compares alors les mêmes images) ; juger sur l'ordinateur au lieu de la largeur téléphone.

## D2. Tableau de correspondance PNG ↔ PDF des maquettes

- **Pris par :** —
- **Maquette :** toutes
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**En bref :** un tableau qui dit, pour chaque écran, quel PNG et quelle page du PDF le montrent.

**Contexte.** Les PNG de `docs/design/maquettes/` (noir et blanc, disposition) et les pages de `maquettes-couleur-v1.pdf` (couleurs) ne sont pas dans le même ordre : la Bibliothèque est le PNG 16 mais la page 4 du PDF. Toute l'équipe se trompe.

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `docs/design/maquettes/README.md` | modifier | ajouter le tableau sous la phrase existante |

**Étapes :**
1. Ouvre chaque PNG (1 à 17) et note le nom de l'écran (Splash, Hub, Tour du Faso, Question Carré…).
2. Ouvre le PDF et note, pour chaque page, l'écran qu'elle montre.
3. Écris le tableau en Markdown : `| Écran | PNG | Page du PDF |`.

**Critères de fin :**
- [ ] Les 17 écrans y sont, vérifiés en ouvrant chaque fichier (pas recopiés de ce document).
- [ ] Le tableau s'affiche correctement sur GitHub.

## D3. Modale « Pas assez de Cauris »

- **Pris par :** —
- **Maquette :** PNG 13, page 15 du PDF
- **Interrupteur :** aucun (elle sera ouverte par la modale Indice, tâche I3)
- **Dépend de :** aucune tâche

**En bref :** la modale qui dit « Il te faut 15 Cauris pour cet indice (tu en as 8). »

**À lire avant de commencer :**
- `src/screens/RetryModal.vue` : une modale du jeu complète et courte, **le meilleur modèle à copier**.
- `src/components/GameModal.vue` (la modale), `src/components/ResultIcon.vue` (le disque, variante `reward`).
- Les sections « GameModal » et « ResultIcon » de `/kit`.

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/screens/NotEnoughCaurisModal.vue` | créer | la modale, sur le modèle de `RetryModal.vue` |
| `src/i18n/fr.ts` | modifier | ajouter une section, par exemple `notEnoughCauris: { title, need: (cost, balance) => …, hint, button }` |
| `src/router.ts` | modifier | ajouter `/dev/pas-assez-de-cauris` dans le bloc `DEV` |

**Props :** `open: boolean`, `cost: number`, `balance: number`. **Événement :** `close`.

**Étapes :**
1. Copie `RetryModal.vue` en `NotEnoughCaurisModal.vue`.
2. Remplace la variante de `ResultIcon` par `reward`, le titre par « Pas assez de Cauris », et le bouton par « Continuer sans indice » (qui émet `close`).
3. Écris dans `fr.ts` une **fonction** qui reçoit les deux nombres (sur le modèle de `fr.cauri.count`). Pour mettre les nombres en gras, découpe la phrase en morceaux plutôt que d'écrire du HTML dans `fr.ts`.
4. Ajoute la route de dev avec `props: { open: true, cost: 15, balance: 8 }` et ouvre http://localhost:5173/dev/pas-assez-de-cauris.

**Critères de fin :**
- [ ] Conforme à la maquette couleur (page 15).
- [ ] Les deux nombres sont en gras ; la phrase « Gagnes-en en répondant juste… » est en `text-medium`.
- [ ] Le bouton émet `close`.
- [ ] Aucun texte en dur dans le `.vue` : tout vient de `fr.ts`.

**Pièges :** écrire « 15 » dans le fichier au lieu d'utiliser la prop `cost` ; oublier que le coût vient de `game.json` (c'est la tâche I3 qui passera la vraie valeur).

## D4. Modale « Champion verrouillé »

- **Pris par :** —
- **Maquette :** PNG 14, page 16 du PDF
- **Interrupteur :** aucun (elle ne sera visible dans le jeu qu'avec `champion`, tâche I5)
- **Dépend de :** aucune tâche

**En bref :** la modale qui explique comment débloquer le mode Champion (« Atteins 100 points en Classique ») et montre où en est le joueur.

**À lire avant de commencer :** `src/screens/RetryModal.vue` (modèle), `src/components/ProgressBar.vue`, et `src/screens/HubScreen.vue` (la liste `otherModes`, où est construite la carte Champion).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/screens/ChampionLockedModal.vue` | créer | la modale |
| `src/i18n/fr.ts` | modifier | titre, phrase avec le nombre de points (fonction), libellé « 62 / 100 points » (fonction), bouton |
| `src/router.ts` | modifier | route `/dev/champion-verrouille` avec `props: { open: true, points: 62, required: 100 }` |
| `src/screens/HubScreen.vue` | modifier | ouvrir la modale au toucher de la carte Champion verrouillée, **seulement si `features.champion` vaut `true`** |

**Props :** `open: boolean`, `points: number`, `required: number`. **Événements :** `close`, `play-classic`.

**Étapes :**
1. Crée la modale : `GameModal` avec `dismissible` (Échap et toucher du voile ferment), `ResultIcon variant="locked"`, `ProgressBar :value="points" :max="required"`, `BaseButton` « Jouer en Classique ».
2. Dans le Hub, la carte Champion doit devenir cliquable **uniquement si** `features.champion` est `true` et que le mode est verrouillé : passe alors `locked-clickable` à `ModeCard` et écoute `@locked-click`. La valeur à passer en `required` est `gameConfig.unlocks.champion.classiquePoints`, et `points` vient de `usePlayerStore().profile.points`.
3. Vérifie sur `/dev/champion-verrouille`, puis passe temporairement `champion` à `true` dans `features.ts` pour tester le Hub, **et remets-le à `false`** avant la PR.

**Critères de fin :**
- [ ] La barre suit `points / required`.
- [ ] « Jouer en Classique » émet `play-classic` ; Échap ferme la modale.
- [ ] Avec `champion` à `false`, le Hub ne change pas (carte « Bientôt », non cliquable) : `src/screens/screens.test.ts` doit toujours passer.

**Pièges :** laisser `features.champion` à `true` dans la PR ; écrire 100 en dur.

## D5. Écran « Temps écoulé »

- **Pris par :** —
- **Maquette :** PNG 10, page 12 du PDF
- **Interrupteur :** aucun (il sera utilisé par Champion et Maître, tâches I5 et I6)
- **Dépend de :** aucune tâche

**En bref :** la modale « Temps écoulé », avec le chrono à 0 en rouge et la bonne réponse.

**Contexte.** En mode chrono, quand le temps est fini, on **montre** la réponse (contrairement au Classique, où le joueur réessaie). Le 0 est rouge : c'est le temps qui est en cause, pas le joueur (couleurs-v1.md §6).

**À lire avant de commencer :** `src/screens/RetryModal.vue` (modèle), `src/components/ChronoRing.vue`, `src/components/AnswerReveal.vue` (déjà prêt pour cet écran).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/screens/TimeUpModal.vue` | créer | la modale |
| `src/i18n/fr.ts` | modifier | « Temps écoulé », « Continuer » |
| `src/router.ts` | modifier | route `/dev/temps-ecoule` avec `props: { open: true, answer: 'Bankui' }` |

**Props :** `open: boolean`, `answer: string`. **Événement :** `next`.

**Étapes :**
1. `GameModal` (pas `dismissible`), avec dans l'emplacement `icon` un `ChronoRing :seconds="0" :total="1"`.
2. `AnswerReveal :answer="answer"`, puis `BaseButton` « Continuer » qui émet `next`.

**Critères de fin :**
- [ ] Conforme à la maquette couleur (page 12).
- [ ] Le bouton émet `next` ; Échap ne ferme pas la modale.

**Piège :** `ChronoRing` affiche aussi « sec » sous le chiffre : vérifie avec le pôle Design si la maquette le veut ; sinon, ajoute une prop au composant et mets `/kit` à jour.

## D6. Écran « Run terminé » (variante récompense de `TagPill`)

- **Pris par :** —
- **Maquette :** PNG 12, page 14 du PDF
- **Interrupteur :** aucun (il sera utilisé par Champion, tâche I5)
- **Dépend de :** aucune tâche

**En bref :** l'écran de fin d'une partie Champion : score en très grand, record perso, deux cartes de statistiques.

**À lire avant de commencer :** `src/components/TagPill.vue` (variante `neutral` seulement), `src/screens/RegionDoneScreen.vue` (un écran de fin complet, bon modèle de mise en page).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/components/TagPill.vue` | modifier | ajouter la variante `reward` : fond `var(--reward)`, texte `var(--reward-text)`, icône `Trophy` de `lucide-vue-next` |
| `src/dev/KitScreen.vue` + `src/dev/kit-texts.ts` | modifier | montrer `TagPill variant="reward"` |
| `src/styles/tokens.css` | modifier | un token pour la taille du score (par exemple `--font-size-display`), valeur à demander au pôle Design |
| `src/screens/RunDoneScreen.vue` | créer | l'écran |
| `src/i18n/fr.ts` | modifier | « Run terminé », « Score », « Nouveau record perso ! », « Bonnes réponses », « Série max », « Rejouer », « Retour au hub » |
| `src/router.ts` | modifier | route `/dev/run-termine` |

**Props :** `score`, `isRecord`, `correct`, `total`, `bestStreak`. **Événements :** `replay`, `back-to-hub`.

**Étapes :**
1. Ajoute la variante `reward` à `TagPill` (le type de la prop devient `'neutral' | 'reward'`), et vérifie-la sur `/kit`.
2. Construis l'écran : titre, score, `TagPill variant="reward"` affichée **seulement si** `isRecord`, deux cartes de statistiques (dans l'écran, pas besoin d'un composant partagé), puis les deux boutons (principal « Rejouer », secondaire « Retour au hub »).
3. Route de dev avec `props: { score: 145, isRecord: true, correct: 12, total: 15, bestStreak: 6 }`.

**Critères de fin :**
- [ ] Les 2 variantes de `TagPill` sont sur `/kit`.
- [ ] « Nouveau record perso ! » n'apparaît que si `isRecord` vaut `true`.
- [ ] Aucune taille en `px` écrite en dur pour le score : elle vient d'un token.

## D7. Écran Paramètres : son et réinitialisation

- **Pris par :** —
- **Maquette :** aucune : à demander au pôle Design (en attendant, s'inspirer de la Bibliothèque, PNG 16)
- **Interrupteur :** `settings`
- **Dépend de :** aucune tâche

**En bref :** un écran avec un réglage « Son » et un bouton « Réinitialiser ma progression » (avec confirmation).

**Contexte.**
- **Son** : la ligne n'apparaît que si `features.sounds` vaut `true` (tâche I7) ; le choix est enregistré quand même.
- **Réinitialiser** : efface Cauris, points, série, progression, historique et anecdotes, **après confirmation**.

**À lire avant de commencer :** `src/db/database.ts` (commentaire sur les migrations), `src/db/repository.ts`, `src/db/database.test.ts` (tests avec fake-indexeddb), `src/stores/player.ts` et `src/stores/progress.ts` (fonction `load`).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/db/database.ts` | modifier | ajouter `this.version(2).stores({ settings: 'key' })` (sans toucher à la version 1) et le type `SettingRow` |
| `src/db/repository.ts` | modifier | `loadSettings()`, `saveSetting(key, value)`, et `resetProgress()` qui vide `profile`, `regionProgress`, `history` et `anecdotes` |
| `src/db/database.test.ts` | modifier | tests de `resetProgress()` et des réglages |
| `src/stores/settings.ts` | créer | store `useSettingsStore` (son activé ou non) |
| `src/screens/SettingsScreen.vue` | créer | l'écran |
| `src/router.ts` | modifier | route `/parametres` (hors du bloc `DEV`, mais seulement si `features.settings`) |
| `src/screens/HubScreen.vue` | modifier | un accès aux Paramètres (par exemple une icône `Settings` de lucide dans l'en-tête), seulement si `features.settings` |
| `src/i18n/fr.ts` | modifier | textes de l'écran et de la confirmation |
| `src/config/features.ts` + `features.test.ts` | modifier | `settings: true`, et retirer `settings` de `stillOff` |

**Étapes :**
1. Sauvegarde : version 2, fonctions du repository, **tests d'abord** (`npm run test -- src/db`).
2. Store `settings`, puis l'écran : `ScreenHeader` avec retour, une ligne « Son » (si `features.sounds`), un `BaseButton variant="secondary"` « Réinitialiser ma progression ».
3. La confirmation : `GameModal` « Tout effacer ? » avec « Effacer » et « Annuler ». Après « Effacer » : `resetProgress()`, puis recharger les stores `player` et `progress` (leur fonction `load()`), puis retour au Hub.

**Critères de fin :**
- [ ] Rien n'est effacé sans confirmation ; « Annuler » ne touche à rien.
- [ ] Après réinitialisation : 0 Cauri, seule la première région ouverte.
- [ ] Le choix du son survit à la fermeture de l'onglet.
- [ ] Tests de `resetProgress()` et de la migration vers la version 2.
- [ ] Avec `settings` à `false`, aucun accès aux Paramètres (ni lien, ni route).

**Pièges :** modifier la version 1 du schéma au lieu d'en ajouter une (les joueurs perdraient leur partie) ; utiliser `localStorage` (interdit pour les données du jeu) ; oublier de recharger les stores (l'écran afficherait encore les anciens Cauris).

## D8. Demander au navigateur de garder la sauvegarde

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** `persistStorage`
- **Dépend de :** aucune tâche

**En bref :** demander au navigateur de ne jamais effacer la partie du joueur quand le téléphone manque de place.

**Contexte.** `navigator.storage.persist()` demande au navigateur de protéger les données du site. Chrome l'accorde souvent quand la PWA est installée. Documentation : [MDN, StorageManager.persist](https://developer.mozilla.org/fr/docs/Web/API/StorageManager/persist).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/db/persist.ts` | créer | `requestPersistentStorage(): Promise<boolean>` |
| `src/db/persist.test.ts` | créer | tests : API absente, refus, accord |
| `src/main.ts` | modifier | l'appeler une fois au démarrage si `features.persistStorage` |
| `src/config/features.ts` + `features.test.ts` | modifier | `persistStorage: true`, et retirer le nom de `stillOff` |

**Étapes :**
1. Dans `persist.ts` : si `navigator.storage?.persist` n'existe pas, renvoyer `false` ; sinon, vérifier `navigator.storage.persisted()` d'abord, et ne demander que si ce n'est pas déjà accordé.
2. Tout entourer d'un `try/catch` : une erreur ne doit jamais empêcher le jeu de démarrer.
3. En dev seulement (`import.meta.env.DEV`), écrire le résultat dans la console.
4. Tests : remplace `navigator.storage` par un faux objet avec `vi.stubGlobal`.

**Critères de fin :**
- [ ] Une seule demande par démarrage, et aucune si c'est déjà accordé.
- [ ] Navigateur sans l'API ou refus : aucune erreur.
- [ ] Le résultat n'apparaît dans la console qu'en dev.

## D9. Icônes PWA à partir du logo

- **Pris par :** —
- **Maquette :** `src/assets/brand/logo-sira-full.png`
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**En bref :** remplacer les icônes provisoires (un « S » pixelisé sur fond vert) par le cercle rouge avec le S du logo.

**Contexte.** Ces icônes apparaissent sur l'écran d'accueil du téléphone quand le jeu est installé. Le manifest (dans `vite.config.ts`) cite déjà les noms de fichiers : on remplace les fichiers, **sans changer leurs noms**. Ne modifie pas le logo original.

**Tailles attendues :**

| Fichier | Taille | Particularité |
|---|---|---|
| `public/icons/icon-192.png` | 192×192 | — |
| `public/icons/icon-512.png` | 512×512 | — |
| `public/icons/maskable-512.png` | 512×512 | le cercle doit tenir dans la **zone sûre** (le disque central de 80 %), car Android peut rogner les bords |
| `public/icons/apple-touch-icon.png` | 180×180 | sans transparence (fond plein) |

**Deux façons de faire :**
- **Avec un logiciel d'image** (GIMP, Photopea…) : recadrer le cercle rouge, exporter aux 4 tailles.
- **Avec un petit script** `sharp` (déjà installé, voir `scripts/build-content.ts`) : `sharp(source).extract({ left, top, width, height }).resize(512).png().toFile(…)`. Lance-le une fois avec `node`, sans l'ajouter au projet.

**Vérifier :** `npm run build` puis `npm run preview`, ouvre http://localhost:4173, puis `F12` → onglet *Application* → *Manifest* : les icônes s'affichent, avec un aperçu « maskable ». Pour tester la zone sûre : [maskable.app](https://maskable.app).

**Critères de fin :**
- [ ] Les 4 fichiers remplacent les provisoires, avec les mêmes noms, chacun de moins de 30 Ko.
- [ ] Aucune erreur dans l'onglet *Manifest* de Chrome.
- [ ] L'app installée sur un téléphone montre le cercle rouge, non rogné.

---

# Intermédiaire

## I1. Intégration continue : GitHub Actions sur chaque PR

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**En bref :** GitHub vérifie tout seul `lint`, `test`, `build` et le contenu à chaque PR.

**À lire avant de commencer :** `package.json` (les scripts), et la documentation [GitHub Actions pour Node.js](https://docs.github.com/fr/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `.github/workflows/ci.yml` | créer | le workflow |
| `CLAUDE.md` | modifier | section Conventions : « la CI doit être verte avant de fusionner » |
| `README.md` | modifier | mentionner la CI dans « Travailler sur une tâche » |

**Étapes :**
1. Déclencheurs : `pull_request` vers `main`, et `push` sur `main`.
2. Étapes : `actions/checkout`, `actions/setup-node` (Node 24, `cache: npm`), `npm ci`, puis `npm run lint`, `npm run test`, `npm run build`, `npm run content -- --check`.
3. Ouvre une PR de test : elle doit passer au vert. Puis casse volontairement un type (dans une branche jetable) : elle doit passer au rouge.

**Critères de fin :**
- [ ] Le workflow tourne sur chaque PR vers `main` et sur chaque push sur `main`.
- [ ] Node 24, `npm ci`, cache npm.
- [ ] Les 4 commandes, dans cet ordre.
- [ ] Preuve dans la PR : une exécution verte, et une rouge sur une erreur volontaire.

**Piège :** `content-source/` n'est pas sur GitHub. C'est voulu : `npm run content -- --check` affiche alors un message et **réussit**. N'essaie pas de télécharger le contenu dans la CI.

## I2. Option `--prune` du script de contenu

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**En bref :** `npm run content -- --prune` supprime les images WebP qui ne servent plus.

**Contexte.** Chaque image est enregistrée sous le nom de son empreinte (`3f9a1c0b2d4e.webp`). Quand une image source est remplacée ou supprimée, l'ancien WebP reste dans `public/content/img/` : inutile, il prend de la place et fausse le poids total.

**À lire avant de commencer :** `scripts/build-content.ts` (la fonction `main`, et `checkOnly` pour la gestion de `--check`), `scripts/content/regions.ts` et `regions.test.ts` (modèle d'un module testé).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `scripts/content/prune.ts` | créer | une fonction pure : `filesToPrune(existingFiles, referencedFiles): string[]` |
| `scripts/content/prune.test.ts` | créer | ses tests |
| `scripts/build-content.ts` | modifier | lire l'option `--prune`, appeler `filesToPrune`, supprimer (ou seulement lister avec `--check`), l'ajouter au rapport |
| `CLAUDE.md` et `README.md` | modifier | documenter l'option |

**Étapes :**
1. Écris `filesToPrune` et ses tests : ne garder que les `.webp` non référencés ; ne jamais renvoyer `.gitkeep` ni un fichier qui ne se termine pas par `.webp`.
2. Dans `build-content.ts`, après l'écriture de `puzzles.json` (donc seulement s'il n'y a pas d'erreur), liste `public/content/img/`, calcule les fichiers à supprimer, supprime-les (`unlink` de `node:fs/promises`).
3. Avec `--check --prune` : n'affiche que la liste, sans rien supprimer.
4. Ajoute au rapport final une ligne « Supprimés : N fichiers (X Ko) ».

**Critères de fin :**
- [ ] `--prune` supprime les `.webp` qui ne sont cités par aucune énigme.
- [ ] Rien n'est supprimé s'il y a une erreur bloquante ; aucun autre fichier n'est touché.
- [ ] `--check --prune` liste sans supprimer.
- [ ] Le rapport affiche le nombre et le poids des fichiers supprimés.
- [ ] Tests de `filesToPrune`.

## I3. Modale Indice et branchement des 3 indices

- **Pris par :** —
- **Maquette :** PNG 15, page 17 du PDF (et PNG 4 et 5 pour le bouton Indice)
- **Interrupteur :** `hints`
- **Dépend de :** tâche D3 (modale « Pas assez de Cauris »)

**En bref :** le joueur qui bloque peut acheter un indice avec ses Cauris.

**Contexte.** Tout existe déjà côté règles : `applyHint()` dans `src/engine/hints.ts`, et `useGameStore().requestHint(hint)`, qui paie et applique l'indice. Il renvoie `{ ok: true }` ou une erreur typée : `insufficient-cauris`, `wrong-format`, `nothing-left`. Les coûts et les formats sont dans `game.json` (`hints.eliminer_2`, `hints.retirer_leurre`, `hints.placer_lettre`). Il reste l'interface.

**À lire avant de commencer :**
- `src/screens/QuestionScreen.vue` : le bouton Indice existe déjà (caché par `v-if="features.hints"`), et ouvre `hintsOpen`.
- `src/engine/hints.ts` et `hints.test.ts` : ce que fait chaque indice.
- `src/components/AnswerOption.vue` (état `eliminated`), `LetterTile.vue` (état `disabled`).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/screens/HintModal.vue` | créer | la liste des indices du format en cours, avec leur coût |
| `src/screens/QuestionScreen.vue` | modifier | brancher `hintsOpen` sur `HintModal`, gérer les erreurs, ouvrir D3 si le solde est insuffisant |
| `src/i18n/fr.ts` | modifier | libellés des 3 indices, « il te manque X », « plus rien à retirer », « Fermer » |
| `src/screens/HintModal.test.ts` | créer | tests de la modale |
| `src/config/features.ts` + `features.test.ts` | modifier | `hints: true`, et retirer `hints` de `stillOff` |

**Étapes :**
1. `HintModal` reçoit `open`, `format` (le format de la manche en cours) et `balance` (les Cauris). Elle ne montre que les indices dont `gameConfig.hints[id].formats` contient le format, chacun avec un `CauriChip size="sm"` du coût.
2. Une ligne trop chère affiche « il te manque X » (couleurs-v1.md §6, écran 15), reste cliquable et ouvre la modale de D3.
3. Au toucher d'une ligne disponible : `await game.requestHint(id)`. Si c'est `nothing-left`, grise la ligne avec un texte explicatif ; si c'est `ok`, ferme la modale.
4. Vérifie l'affichage du résultat dans l'écran Question : options éliminées barrées, leurre retiré grisé, lettre placée verrouillée (ces états existent déjà dans les composants).
5. Le bouton Indice du bas : affiche le coût le moins cher du format (par exemple avec un `CauriChip`), et désactive-le pendant l'affichage du résultat (c'est déjà fait avec `game.answered`).

**Critères de fin :**
- [ ] Les Cauris baissent exactement du coût ; un indice inutile n'est jamais payé.
- [ ] « Éliminer 2 » n'apparaît qu'au Carré ; « Retirer un leurre » et « Placer une lettre » qu'au Direct.
- [ ] Tests de composant pour les 3 erreurs (sur le modèle de `src/components/GameModal.test.ts`).
- [ ] Avec `hints` à `false`, aucun bouton Indice (`src/screens/screens.test.ts` le vérifie).

**Piège :** recalculer le coût ou le solde dans la modale ; tout est déjà dans `gameConfig` et `usePlayerStore().profile.cauris`.

## I4. Bibliothèque et son accès depuis le Hub

- **Pris par :** —
- **Maquette :** PNG 16, page 4 du PDF
- **Interrupteur :** `library`
- **Dépend de :** aucune tâche

**En bref :** l'écran qui liste les anecdotes gagnées, et le titre « Griot du Faso » en cours.

**Contexte.** Chaque énigme réussie débloque son anecdote (table `anecdotes`, fonction `listAnecdotes` de `src/db/repository.ts`). Les titres et les textes sont dans `catalog.puzzles` (`puzzle.anecdote.title` et `.text`).

**À lire avant de commencer :** `src/db/repository.ts`, `src/stores/player.ts` (modèle d'un store qui lit la sauvegarde), `src/screens/TourScreen.vue` (un écran avec `ScreenHeader`), `src/components/InfoCard.vue` (la bande de motif).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/stores/library.ts` | créer | store `useLibraryStore` : charge `listAnecdotes()`, expose les anecdotes débloquées |
| `src/screens/LibraryScreen.vue` | créer | l'écran |
| `src/components/PatternBand.vue` | créer (conseillé) | sortir la bande de motif d'`InfoCard` pour la réutiliser dans la carte du titre ; mettre `InfoCard` et `/kit` à jour |
| `src/router.ts` | modifier | route `/bibliotheque`, seulement si `features.library` |
| `src/screens/HubScreen.vue` | modifier | un accès à la Bibliothèque, seulement si `features.library` |
| `src/i18n/fr.ts` | modifier | textes de l'écran |
| `src/config/features.ts` + `features.test.ts` | modifier | `library: true`, et retirer `library` de `stillOff` |

**Étapes :**
1. Le store, et un test avec fake-indexeddb (sur le modèle de `src/stores/game.test.ts`).
2. L'écran : `ScreenHeader` (retour, sous-titre « Anecdotes débloquées · N »), la carte du titre (bande de motif, « Titre : Griot du Faso », `TagPill` « en cours · x/17 régions »), puis une ligne par anecdote.
3. Une ligne débloquée affiche le titre, la région et un chevron, et ouvre l'anecdote (une `InfoCard` dans une `GameModal`, par exemple). Une ligne verrouillée est grisée, avec un cadenas et « Anecdote verrouillée ».

**Question à trancher avec le pôle Contenu :** une même anecdote est aujourd'hui copiée dans plusieurs régions (Mossi ×9). Faut-il l'afficher une seule fois ?

**Critères de fin :**
- [ ] Une anecdote gagnée en jouant apparaît, même après fermeture de l'onglet.
- [ ] Lignes d'au moins 44 px de haut ; une ligne verrouillée n'est pas cliquable.
- [ ] Avec `library` à `false`, aucun accès.

## I5. Mode Champion : logique et écran

- **Pris par :** —
- **Maquettes :** PNG 6 (question Champion) et 12 (Run terminé) ; pages 7 et 14 du PDF
- **Interrupteur :** `champion`
- **Dépend de :** tâches D4 (Champion verrouillé), D5 (Temps écoulé), D6 (Run terminé)

**En bref :** un mode contre la montre : 20 secondes par énigme, une série, un score, un record.

**Contexte.** Débloqué à 100 points en Classique (`unlocks.champion.classiquePoints`, fonction `isChampionUnlocked`). Chrono de 20 s par énigme (`timers.championSeconds`).

**Questions au pôle Game Design, à trancher AVANT de coder** (puis à ranger dans `game.json`) :
- Combien d'énigmes dans un run ? (La maquette montre 15.) Quel format ? (La maquette montre un Carré en 2×2.)
- Comment se calcule le score : points du format, bonus de série, bonus de temps restant ?
- Le temps écoulé compte-t-il comme une réponse fausse ?
- Le run se termine-t-il seulement au bout des N énigmes, ou aussi après X erreurs ?
- Le Champion rapporte-t-il aussi des Cauris ?

**À lire avant de commencer :** `src/engine/classic.ts` (modèle d'une progression : file, `recordAnswer`), `src/stores/game.ts` (modèle d'un store de partie), `src/engine/round.ts` (`createRound`, à réutiliser), `src/screens/QuestionScreen.vue` (modèle d'écran de question), `src/components/ChronoRing.vue`.

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/config/game.json` | modifier | une section `champion` (nombre d'énigmes, format, score…) selon les réponses du pôle Game Design |
| `src/engine/config.ts` + `config.test.ts` | modifier | type et vérification de la nouvelle section |
| `src/engine/champion.ts` + `champion.test.ts` | créer | tirage du run (avec graine), score, série, fin de run |
| `src/stores/champion.ts` | créer | la partie en cours et le chrono |
| `src/db/database.ts` + `repository.ts` | modifier | le record perso (nouvelle version du schéma) |
| `src/screens/ChampionScreen.vue` | créer | l'écran de question Champion |
| `src/router.ts` | modifier | route `/champion` |
| `src/screens/HubScreen.vue` | modifier | carte Champion : jouable si débloqué, sinon modale de D4 |
| `src/i18n/fr.ts` | modifier | textes |
| `src/config/features.ts` + `features.test.ts` | modifier | `champion: true`, et retirer `champion` de `stillOff` |

**Étapes :**
1. Fais valider les questions ci-dessus, puis écris la section `champion` de `game.json` et sa vérification.
2. `champion.ts` : fonctions pures, testées, qui reçoivent un `Rng`. **Le chrono n'est pas dans l'engine** : l'engine reçoit seulement « réponse » ou « temps écoulé ».
3. Le store : `setInterval` pour le chrono, arrêté quand l'écran se ferme ; le temps écoulé ouvre la modale de D5.
4. L'écran : `ChronoRing`, `TagPill` « Série ×N », `PuzzleImages`, les `AnswerOption` (via `createRound`), puis l'écran Run terminé (D6) à la fin.
5. Le record : version suivante du schéma Dexie, test de migration.

**Critères de fin :**
- [ ] Même graine, même run (test) : préparation du Duel.
- [ ] Tests : temps écoulé, série cassée, dernier tour, record battu ou non.
- [ ] Le record survit à la fermeture de l'onglet (test avec fake-indexeddb).
- [ ] Le chrono s'arrête quand on quitte l'écran (pas de minuterie qui tourne en arrière-plan).
- [ ] Avec `champion` à `false`, la carte reste « Bientôt ».

## I6. Mode Maître (avec le format Duo)

- **Pris par :** —
- **Maquette :** PNG 7, page 8 du PDF
- **Interrupteur :** `maitre`
- **Dépend de :** tâches I5 (déblocage « Après Champion ») et D5 (Temps écoulé)

**En bref :** pour chaque énigme, le joueur choisit comment répondre (Duo, Carré ou Directe) ; plus c'est dur, plus ça rapporte. 10 s de chrono après le choix.

**Contexte.** La maquette affiche 25 %, 45 % et 100 % : c'est le rapport des points de chaque format à ceux du Direct dans `game.json` (25, 45, 100). Le chrono de 10 s (`timers.maitreSeconds`) démarre **après** le choix. C'est le seul mode qui utilise le Duo : `createRound` et l'écran Question le gèrent déjà.

**Questions au pôle Game Design, à trancher AVANT de coder :**
- Quelle est la condition exacte de déblocage (« Après Champion » : un score minimal ? un run terminé ?) ?
- Combien d'énigmes dans une partie, et comment se calcule le score ?
- Les pourcentages affichés sont-ils bien calculés à partir des points des formats ?
- Le Maître rapporte-t-il des Cauris, et selon quel barème ?

**À lire avant de commencer :** tout ce qui est listé pour I5, plus le travail d'I5 une fois fusionné (même structure).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/config/game.json` + `src/engine/config.ts` | modifier | section `maitre` |
| `src/engine/maitre.ts` + `maitre.test.ts` | créer | règles du mode |
| `src/stores/maitre.ts` | créer | partie en cours et chrono |
| `src/screens/MaitreScreen.vue` | créer | écran de choix du format (maquette 7), puis la question |
| `src/router.ts`, `src/screens/HubScreen.vue`, `src/i18n/fr.ts` | modifier | route, carte du Hub, textes |
| `src/config/features.ts` + `features.test.ts` | modifier | `maitre: true`, et retirer `maitre` de `stillOff` |

**Critères de fin :**
- [ ] Le format choisi passe par `createRound` : aucune nouvelle logique de propositions ni de plateau.
- [ ] Les pourcentages sont calculés depuis `game.json`, jamais écrits en dur.
- [ ] Tests : chaque format, temps écoulé après le choix, score.
- [ ] Avec `maitre` à `false`, la carte reste « Bientôt ».

## I7. Intégration des sons

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** `sounds`
- **Dépend de :** tâche D7 (réglage du son)

**En bref :** des sons courts aux moments clés, coupables dans les Paramètres.

**Contexte.** Moments visés : bonne réponse, réponse fausse, toucher d'une tuile, région terminée. Les fichiers sont à fournir par le pôle Design (ambiance sonore, GDD §14).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/audio/sounds.ts` | créer | `playSound(name)` ; ne joue rien si `features.sounds` vaut `false` ou si le son est coupé (store de D7) |
| `src/audio/sounds.test.ts` | créer | tests (son coupé, interrupteur à `false`) |
| `src/assets/sounds/*.webm` (ou `public/sounds/`) | créer | les fichiers audio |
| `src/screens/QuestionScreen.vue`, `RegionDoneScreen.vue` | modifier | déclencher les sons |
| `src/config/features.ts` + `features.test.ts` | modifier | `sounds: true`, et retirer `sounds` de `stillOff` |

**Étapes :**
1. Récupère ou prépare des sons très courts, en `.webm` (Opus) ou `.mp3`, de quelques Ko chacun.
2. `playSound` : crée l'élément `Audio` au premier usage seulement (les navigateurs bloquent le son avant le premier toucher du joueur).
3. Branche les sons dans les écrans, puis vérifie qu'ils ne partent pas en double.

**Critères de fin :**
- [ ] Chaque son pèse moins de 20 Ko, l'ensemble moins de 100 Ko.
- [ ] Couper le son dans les Paramètres coupe tout, immédiatement.
- [ ] Avec `sounds` à `false`, aucun fichier son n'est téléchargé (vérifie dans l'onglet *Network* de `F12`).
- [ ] Les sons se jouent hors-ligne.

## I8. Précache hors-ligne par région

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**En bref :** les images d'une région se téléchargent à l'avance, pour que le jeu marche sans réseau.

**Contexte.** Le service worker (`vite-plugin-pwa`) précache le code et les polices, mais **pas les images des énigmes** (`public/content/img/`, voir `workbox.globPatterns` dans `vite.config.ts`). Sans réseau, les images d'une région pas encore vue ne s'affichent pas. Tout précacher à l'installation coûterait plus de 2 Mo de data : CLAUDE.md demande un **précache par région**.

**À lire avant de commencer :** `vite.config.ts` (bloc `VitePWA`), la documentation de [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) et de [Workbox runtimeCaching](https://developer.chrome.com/docs/workbox/modules/workbox-build#generatesw), `src/content/catalog.ts` (la liste des images par énigme : `puzzle.images`).

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `vite.config.ts` | modifier | `workbox.runtimeCaching` pour `/content/img/*.webp` (stratégie « cache d'abord »), avec une limite (`expiration.maxEntries`) |
| `src/offline/precache.ts` | créer | `precacheRegion(regionId)` : télécharge en arrière-plan les images de la région |
| `src/offline/precache.test.ts` | créer | tests : liste des images d'une région, sans doublon |
| `src/stores/game.ts` ou `src/screens/TourScreen.vue` | modifier | précacher la région en cours et la suivante |

**Étapes :**
1. La règle `runtimeCaching` dans `vite.config.ts`, avec un nom de cache (par exemple `sira-images`).
2. `precacheRegion` : récupère les images des énigmes de la région (et de la suivante dans `regionOrder`), puis les charge avec `fetch` pour qu'elles entrent dans le cache.
3. Teste sur la version finale : `npm run build`, `npm run preview`, ouvre une région, puis `F12` → *Network* → « Offline », recharge, et joue.

**Critères de fin :**
- [ ] En mode avion, une région déjà ouverte se joue en entier avec ses images, même après fermeture de l'onglet.
- [ ] À la première installation, seules les images de la première région sont téléchargées.
- [ ] Une nouvelle version du contenu ne laisse pas d'anciennes images en cache indéfiniment.

**Piège :** le service worker n'existe pas en `npm run dev` : teste toujours avec `build` puis `preview`.

## I9. Duel local sur le même téléphone

- **Pris par :** —
- **Maquette :** aucune : à demander au pôle Design
- **Interrupteur :** `duelLocal`
- **Dépend de :** aucune tâche

**En bref :** deux joueurs se passent le téléphone et répondent aux mêmes énigmes ; le meilleur score gagne (GDD §8).

**Contexte.** Le hasard à graine garantit que les deux joueurs voient les mêmes énigmes et les mêmes propositions : même `createRng(seed)` ⇒ même tirage.

**Questions au pôle Game Design :** combien d'énigmes, quels formats, quel calcul du score, et le duel rapporte-t-il des Cauris ?

**À lire avant de commencer :** `src/engine/random.ts`, `src/engine/round.ts`, `src/engine/classic.ts` (`startRegionRun` : un tirage d'énigmes avec une graine), `src/stores/game.ts`.

**Fichiers :**

| Fichier | Action | Ce qu'il faut faire |
|---|---|---|
| `src/config/game.json` + `src/engine/config.ts` | modifier | section `duel` |
| `src/engine/duel.ts` + `duel.test.ts` | créer | tirage commun, scores, vainqueur |
| `src/stores/duel.ts` | créer | la partie à deux (sans toucher à la progression du Tour) |
| `src/screens/` | créer | choix des noms, « Passe le téléphone à … », questions, résultat |
| `src/router.ts`, `src/screens/HubScreen.vue`, `src/i18n/fr.ts` | modifier | route, accès depuis le Hub (seulement si `features.duelLocal`), textes |
| `src/config/features.ts` + `features.test.ts` | modifier | `duelLocal: true`, et retirer le nom de `stillOff` |

**Critères de fin :**
- [ ] Même graine : les deux joueurs voient exactement les mêmes énigmes, dans le même ordre, avec les mêmes propositions (test).
- [ ] Un écran de transition empêche le joueur 2 de voir les réponses du joueur 1.
- [ ] Le duel ne modifie ni les Cauris ni la progression du Tour (sauf décision contraire du pôle Game Design).
- [ ] Avec `duelLocal` à `false`, aucun accès.

---

# Plus tard

Hors V1, ou à reprendre après les tâches ci-dessus.

- **Duel WhatsApp (interrupteur `duelWhatsapp`) :** le joueur génère un Code Défi et l'envoie à un ami, qui joue les mêmes énigmes. La base existe : `seedFromString()` dans `src/engine/random.ts` transforme un code en graine.
- **Rejouer une région terminée :** aujourd'hui, une région terminée ne peut pas être rejouée (toutes ses énigmes sont réussies). Il faudra décider ce que rapporte un rejeu.

# Hors code (pôle Design)

- **Icône cauri définitive :** `src/components/icons/IconCauri.vue` est un dessin provisoire. Le pôle Design fournit un dessin de 24×24 (`viewBox="0 0 24 24"`), en traits `currentColor` d'épaisseur 2 comme les icônes lucide, lisible à 12 px et à 40 px. Un développeur remplace ensuite le contenu du `<svg>`, sans changer les props.
- **Maquettes manquantes :** écran Paramètres (D7), écrans du Duel local (I9).
- **Maquette 9 et `couleurs-v1.md` à mettre à jour** (décision du responsable, septembre 2026) : après une erreur au Classique, le jeu ne montre **plus** la réponse ni l'anecdote. La modale « Presque ! » est remplacée par « Pas tout à fait ! » avec un bouton « Réessayer », et le joueur réessaie aussitôt la même énigme (propositions ou tuiles re-mélangées). La bonne option ne passe plus en vert après une erreur (couleurs-v1.md §5, option « Juste »). L'anecdote ne s'affiche qu'avec Bravo. L'encadré « La réponse était » (`AnswerReveal`) sert encore pour « Temps écoulé » (D5).

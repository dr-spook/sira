# Tâches réservées à l'équipe

Ces tâches sont repérées pendant le développement mais ne font pas partie de la tâche en cours. Elles sont réservées aux membres de l'équipe : Claude Code ne les code pas, il les ajoute ici.

**Pour prendre une tâche :** mets ton nom dans « Pris par », crée une branche (`feat/…`, `fix/…`, `content/…` ou `chore/…`, voir CLAUDE.md), et ouvre une PR par tâche. Elle doit passer `npm run lint`, `npm run test` et `npm run build`.

Niveaux :
- **Débutant** : peu de code, surtout de l'observation et des essais.
- **Intermédiaire** : du code TypeScript, avec des tests.

---

## 1. Nettoyer les WebP qui ne servent plus (`--prune`)

- **Niveau :** intermédiaire
- **Pris par :** —

**Contexte.** `npm run content` enregistre chaque image dans `public/content/img/` sous le nom de son empreinte (`3f9a1c0b2d4e.webp`). Quand une image source est remplacée ou supprimée dans `content-source/`, l'ancien WebP reste sur le disque : personne ne l'utilise, mais il prend de la place et fausse le poids total.

**Fichiers concernés :**
- `scripts/build-content.ts` (le script)
- `scripts/content/` (y mettre la logique à tester, par exemple `prune.ts` avec `prune.test.ts`)
- `CLAUDE.md`, section Contenu (documenter l'option)

**Critères de fin :**
- `npm run content -- --prune` supprime de `public/content/img/` les `.webp` qui ne sont cités par aucune énigme de `puzzles.json`.
- Rien n'est supprimé s'il y a une erreur bloquante.
- Seuls les `.webp` de `public/content/img/` peuvent être supprimés. Tout autre fichier ou dossier est laissé tel quel, `.gitkeep` compris.
- `npm run content -- --check --prune` affiche la liste de ce qui **serait** supprimé, sans rien supprimer.
- Le rapport final affiche le nombre et le poids des fichiers supprimés.
- Sans `--prune`, le comportement actuel ne change pas.
- Un test Vitest couvre le choix des fichiers à supprimer.

---

## 2. Régler la qualité WebP pour rester sous 40 Ko par image

- **Niveau :** débutant
- **Pris par :** —

**Contexte.** Le jeu vise des téléphones modestes et la 3G : chaque image devrait peser moins de 40 Ko. Avec la qualité actuelle (70), 10 images dépassent :

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

Baisser la qualité allège les fichiers, mais peut rendre les photos floues ou « en blocs ». Il faut trouver le bon compromis **en regardant** les images.

**Fichiers concernés :**
- `scripts/build-content.ts` : la constante `WEBP_QUALITY` en haut du fichier.
- Attention : le script ne reconvertit pas une image dont le WebP existe déjà. Avant chaque essai, vide `public/content/img/` (ce dossier n'est pas versionné, on peut le supprimer sans risque), puis relance `npm run content`.

**Critères de fin :**
- Au moins trois valeurs essayées (par exemple 70, 60 et 50), et les 10 images ci-dessus comparées à la taille d'un écran de téléphone (375 px de large).
- La PR contient les captures de comparaison et explique le choix.
- Avec la valeur retenue, le rapport de `npm run content` n'affiche plus d'avertissement « WebP de plus de 40 Ko ». S'il en reste, chaque exception est justifiée dans la PR (par exemple « en dessous de 60, le visage devient flou »).

---

## 3. Intégration continue : GitHub Actions sur chaque PR

- **Niveau :** intermédiaire
- **Pris par :** —

**Contexte.** Aujourd'hui, chacun doit penser à lancer `lint`, `test` et `build` avant d'ouvrir une PR. Une vérification automatique sur GitHub évite de fusionner du code cassé dans `main`.

**Fichiers concernés :**
- `.github/workflows/ci.yml` (à créer)
- `CLAUDE.md`, section Conventions (indiquer que la CI doit être verte avant de fusionner)

**Critères de fin :**
- Le workflow se lance sur chaque PR vers `main` et sur chaque push sur `main`.
- Il utilise Node 24 (`package.json` demande au moins Node 22.18), installe avec `npm ci`, et met en cache les paquets npm.
- Il lance, dans cet ordre : `npm run lint`, `npm run test`, `npm run build`, `npm run content -- --check`.
- Si une étape échoue, la PR est marquée en rouge.
- `content-source/` n'est pas sur GitHub : `--check` affiche alors un message et réussit. C'est le comportement attendu, il ne faut pas essayer de récupérer le contenu dans la CI.
- La preuve que ça marche : une PR de test verte, et une PR volontairement cassée (par exemple une faute de type) marquée en rouge.

---

# Écrans à construire avec le kit visuel

Ces tâches assemblent les composants du kit (`src/components/`, visibles sur `/kit` avec `npm run dev`) pour reproduire une maquette. **Données factices uniquement** : l'écran reçoit ses valeurs en props, écrites en dur dans la route de dev. Aucune logique de jeu, aucun store, aucun accès à Dexie. L'écran Question est réservé : il ne fait pas partie de cette liste.

**Maquettes.** Les PNG de `docs/design/maquettes/` donnent la disposition. Les couleurs viennent du PDF `maquettes-couleur-v1.pdf`, dont l'ordre des pages **n'est pas** celui des PNG : chaque tâche indique les deux numéros.

**Règles communes à toutes les tâches d'écran :**
- Un fichier par écran dans `src/screens/` (par exemple `BravoModal.vue`), avec des props typées.
- Pour voir l'écran : ajoute une ligne dans le bloc `if (import.meta.env.DEV)` de `src/router.ts`, avec la route `/dev/<écran>` et les props factices. Exemple : `routes.push({ path: '/dev/bravo', component: () => import('@/screens/BravoModal.vue'), props: { open: true, cauris: 20, points: 50, anecdote: '…' } })`.
- Les textes fixes de l'écran (« Bravo ! », « Énigme suivante »…) vont dans `src/i18n/fr.ts`. Les données (nombres, anecdote, nom de région) arrivent par les props.
- Aucun chiffre de jeu écrit dans l'écran : « +20 », « 15 Cauris », « 100 points » sont des props.
- Couleurs uniquement via les tokens sémantiques, aucun hex. Espacements, rayons et tailles via les tokens de `src/styles/tokens.css`.
- Un seul bouton principal (vert) par écran. Cibles tactiles d'au moins 44×44 px. Aucun défilement horizontal à 375 px ni à 320 px.
- **Composant partagé :** s'il manque un composant, il est créé dans `src/components/` **par la seule tâche indiquée comme propriétaire**, et ajouté à `/kit` avec tous ses états. Les tâches qui en dépendent attendent qu'il soit fusionné dans `main`.
- La PR contient une capture à 375 px de large, à côté de la maquette couleur.

**Composants partagés à créer, et leur tâche propriétaire :**

| Composant | Rôle | Créé par | Utilisé aussi par |
|---|---|---|---|
| `ResultIcon` | Disque central des résultats : coche verte avec rayons jaunes, « ! » encre, cauri sur jaune, cadenas sur gris | Tâche 6 (Bravo) | 7, 9, 11, 12 |
| `AnswerReveal` | Encadré « La réponse était » + réponse en `green-800` sur `green-50` | Tâche 7 (Presque) | 8 |
| `TagPill` | Puce de texte : neutre (« en cours · 2/17 régions », « Série ×4 ») et récompense jaune avec icône (« Nouveau record perso ! ») | Tâche 10 (Run terminé) | 14 |

---

## 4. Écran Splash

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 1, page 1 du PDF
- **Dépend de :** aucune tâche

**Contexte.** Premier écran au lancement : le logo complet, une barre de chargement et « Chargement… ». C'est le seul écran qui montre le logo en entier (couleurs-v1.md §6).

**Composants du kit :** `ProgressBar`.

**Props attendues :** `progress: number` (de 0 à 1).

**Fichiers concernés :**
- `src/screens/SplashScreen.vue`
- `src/assets/brand/` : une version **réduite** du logo (l'original fait 4167×4167 px et 511 Ko). Par exemple `logo-sira-480.webp`, 480 px de large, moins de 40 Ko. Garde l'original tel quel.
- `src/i18n/fr.ts` (« Chargement… », texte alternatif du logo)
- `src/router.ts` (route de dev)

**Critères de fin :**
- Le logo affiché est la version réduite, avec un texte alternatif.
- La barre suit la prop `progress`, et « Chargement… » est en `text-medium`.
- Le logo est centré et ne déborde pas à 320 px.

---

## 5. Écran Hub

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 2, page 2 du PDF
- **Dépend de :** aucune tâche

**Contexte.** L'écran d'accueil : le nom SIRA, le compteur de Cauris, la progression « Griot du Faso », puis les cartes des modes de jeu. Seule la carte Classique est débloquée.

**Composants du kit :** `ScreenHeader` (sans retour, avec `CauriChip` dans la zone de droite), `ProgressBar` avec `segments`, `ModeCard`.

**Props attendues :**
- `cauris: number`
- `regionsDone: number`, `regionsTotal: number`
- `modes: { id: string; title: string; subtitle: string; locked: boolean; lockLabel?: string }[]`

Données factices : Classique débloqué ; Champion (« 100 pts en Classique »), Maître (« Après Champion »), Puzzle (« Phase 3 ») et Multijoueur (« En ligne ») verrouillés.

**Fichiers concernés :** `src/screens/HubScreen.vue`, `src/i18n/fr.ts` (« Choisis un mode », « Griot du Faso »), `src/router.ts`.

**Critères de fin :**
- Barre en 17 cases, avec le libellé « Griot du Faso · 2/17 ».
- Un toucher sur une carte verrouillée émet un événement avec l'identifiant du mode (l'ouverture de la modale « Champion verrouillé » viendra plus tard).
- JOUER est le seul bouton vert de l'écran.

---

## 6. Modale Bravo (propriétaire de `ResultIcon`)

- **Niveau :** intermédiaire
- **Pris par :** —
- **Maquette :** PNG 8, page 10 du PDF
- **Dépend de :** aucune tâche

**Contexte.** S'affiche après une bonne réponse : disque vert avec une coche et des rayons jaunes, « Bravo ! », Cauris gagnés, points, carte « Le savais-tu ? », bouton « Énigme suivante ».

**Composants du kit :** `GameModal`, `CauriChip` (`lg`, `signed`), `InfoCard`, `BaseButton`.

**Composant partagé à créer : `ResultIcon`**, avec une prop `variant` :
- `success` : disque `green-700`, coche blanche, rayons `yellow-500` ;
- `neutral` : disque encre, « ! » blanc (Presque) ;
- `reward` : disque `yellow-500`, icône cauri encre (Pas assez de Cauris) ;
- `locked` : disque `neutral-100`, cadenas `neutral-300` (Champion verrouillé).

Le disque est décoratif (`aria-hidden`) : c'est le titre de la modale qui porte le sens. Les rayons peuvent s'animer à l'apparition : la règle globale de `base.css` coupe l'animation si le joueur a réduit les animations.

**Props attendues :** `open: boolean`, `cauris: number`, `points: number`, `anecdote: string`.

**Fichiers concernés :** `src/components/ResultIcon.vue` (et sa section dans `src/dev/KitScreen.vue`), `src/screens/BravoModal.vue`, `src/i18n/fr.ts`, `src/router.ts`.

**Critères de fin :**
- Les 4 variantes de `ResultIcon` sont visibles sur `/kit`.
- La modale correspond à la maquette, et le bouton émet `next`.
- La modale ne se ferme pas avec Échap (pas `dismissible`).

---

## 7. Modale Presque (propriétaire de `AnswerReveal`)

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 9, page 11 du PDF
- **Dépend de :** tâche 6 (`ResultIcon`, variante `neutral`)

**Contexte.** S'affiche après une mauvaise réponse. Pas de rouge : on apprend, on n'est pas sanctionné (couleurs-v1.md §2). La bonne réponse est mise en avant en vert.

**Composants du kit :** `GameModal`, `InfoCard`, `BaseButton`.

**Composant partagé à créer : `AnswerReveal`**. Il affiche « La réponse était » en petit, puis la réponse en grand, en `state-success-text` sur `state-success-bg`, avec un contour vert. Prop : `answer: string`.

**Props attendues :** `open: boolean`, `answer: string`, `anecdote: string`.

**Fichiers concernés :** `src/components/AnswerReveal.vue` (+ `/kit`), `src/screens/AlmostModal.vue`, `src/i18n/fr.ts` (« Presque ! », « Aucun Cauri perdu — on apprend ! »), `src/router.ts`.

**Critères de fin :**
- `AnswerReveal` est visible sur `/kit`.
- Aucune couleur rouge dans la modale.
- Le bouton « Énigme suivante » émet `next`.

---

## 8. Modale Temps écoulé

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 10, page 12 du PDF
- **Dépend de :** tâche 7 (`AnswerReveal`)

**Contexte.** S'affiche quand le chrono arrive à 0 (modes Champion et Maître). Le 0 est rouge : c'est le temps qui est en cause, pas le joueur.

**Composants du kit :** `GameModal`, `ChronoRing` (avec `seconds` à 0), `BaseButton`, plus `AnswerReveal`.

**Props attendues :** `open: boolean`, `answer: string`.

**Fichiers concernés :** `src/screens/TimeUpModal.vue`, `src/i18n/fr.ts` (« Temps écoulé », « Continuer »), `src/router.ts`.

**Critères de fin :** conforme à la maquette ; le bouton « Continuer » émet `next`.

---

## 9. Écran Région terminée

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 11, page 13 du PDF
- **Dépend de :** tâche 6 (`ResultIcon`, variante `success`)

**Contexte.** Plein écran, après la 5ᵉ énigme d'une région : nom de la région, disque avec rayons, « Région terminée ! », bonus de Cauris, progression « Griot du Faso ».

**Composants du kit :** `CauriChip` (avec `label`), `ProgressBar`, `BaseButton` (principal « Région suivante », secondaire « Retour à la carte »).

**Props attendues :** `regionName: string`, `bonus: number`, `regionsDone: number`, `regionsTotal: number`.

**Fichiers concernés :** `src/screens/RegionDoneScreen.vue`, `src/i18n/fr.ts`, `src/router.ts`.

**Critères de fin :** les deux boutons sont en bas de l'écran et émettent `next` et `back-to-map`.

---

## 10. Écran Run terminé (propriétaire de `TagPill`)

- **Niveau :** intermédiaire
- **Pris par :** —
- **Maquette :** PNG 12, page 14 du PDF
- **Dépend de :** aucune tâche

**Contexte.** Fin d'une partie Champion : le score en très grand, un éventuel « Nouveau record perso ! », deux cartes de statistiques (bonnes réponses, série max).

**Composants du kit :** `BaseButton` (principal « Rejouer », secondaire « Retour au hub »).

**Composant partagé à créer : `TagPill`**, avec une prop `variant` :
- `neutral` : fond blanc, contour encre, texte encre ;
- `reward` : fond `yellow-500`, texte encre, icône trophée (lucide `Trophy`).

Il servira aussi à la Bibliothèque (tâche 14) et à l'écran Question.

**À créer dans l'écran** (non partagé) : les deux cartes de statistiques.

**Props attendues :** `score: number`, `isRecord: boolean`, `correct: number`, `total: number`, `bestStreak: number`.

**Point à faire valider :** le score est plus grand que la plus grande taille de l'échelle (48 px). Demande la taille voulue au pôle Design, et ajoute-la comme token dans `tokens.css` (par exemple `--font-size-display`), pas en dur dans l'écran.

**Fichiers concernés :** `src/components/TagPill.vue` (+ `/kit`), `src/screens/RunDoneScreen.vue`, `src/styles/tokens.css` (taille du score), `src/i18n/fr.ts`, `src/router.ts`.

**Critères de fin :**
- `TagPill` est visible sur `/kit` dans ses 2 variantes.
- « Nouveau record perso ! » ne s'affiche que si `isRecord` vaut `true`.

---

## 11. Modale Pas assez de Cauris

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 13, page 15 du PDF
- **Dépend de :** tâche 6 (`ResultIcon`, variante `reward`)

**Contexte.** S'affiche quand le joueur veut un indice trop cher : « Il te faut 15 Cauris pour cet indice (tu en as 8). »

**Composants du kit :** `GameModal`, `BaseButton` (« Continuer sans indice »).

**Props attendues :** `open: boolean`, `cost: number`, `balance: number`.

**Fichiers concernés :** `src/screens/NotEnoughCaurisModal.vue`, `src/i18n/fr.ts` (une fonction qui reçoit les deux nombres, comme `fr.cauri.count`), `src/router.ts`.

**Critères de fin :** les deux nombres sont en gras ; la phrase secondaire est en `text-medium` ; le bouton émet `close`.

---

## 12. Modale Champion verrouillé

- **Niveau :** débutant
- **Pris par :** —
- **Maquette :** PNG 14, page 16 du PDF
- **Dépend de :** tâche 6 (`ResultIcon`, variante `locked`)

**Contexte.** S'affiche quand on touche la carte Champion verrouillée sur le Hub : la condition de déblocage et la progression vers elle.

**Composants du kit :** `GameModal`, `ProgressBar` (avec le libellé « 62 / 100 points »), `BaseButton` (« Jouer en Classique »).

**Props attendues :** `open: boolean`, `points: number`, `required: number`.

**Fichiers concernés :** `src/screens/ChampionLockedModal.vue`, `src/i18n/fr.ts`, `src/router.ts`.

**Critères de fin :** la barre suit `points / required` ; le bouton émet `play-classic` ; la modale se ferme avec Échap (`dismissible`).

---

## 13. Modale Utiliser un indice

- **Niveau :** intermédiaire
- **Pris par :** —
- **Maquette :** PNG 15, page 17 du PDF
- **Dépend de :** aucune tâche

**Contexte.** La liste des indices disponibles et leur coût. Les indices dépendent du format : « Éliminer 2 mauvaises réponses » pour le Carré, « Retirer un leurre » et « Placer une lettre » pour le Direct.

**Composants du kit :** `GameModal` (`dismissible`), `CauriChip` (`sm`), `BaseButton` (secondaire « Fermer »).

**À créer dans l'écran** (non partagé) : une ligne d'indice (libellé et coût), avec deux états :
- disponible : carte blanche cliquable ;
- trop cher : puce `neutral-100`, texte `neutral-600` et mention « il te manque X » (couleurs-v1.md §6, écran 15). La ligne reste cliquable : la toucher émet un événement, qui ouvrira plus tard la modale « Pas assez de Cauris ».

**Props attendues :** `open: boolean`, `balance: number`, `hints: { id: string; label: string; cost: number }[]`.

**Fichiers concernés :** `src/screens/HintModal.vue`, `src/i18n/fr.ts`, `src/router.ts`.

**Critères de fin :**
- Avec `balance: 12`, l'indice à 10 est disponible, et ceux à 15 affichent « il te manque 3 ».
- Toucher une ligne émet `pick` avec l'identifiant de l'indice.
- « Fermer » et Échap ferment la modale.

---

## 14. Écran Bibliothèque

- **Niveau :** intermédiaire
- **Pris par :** —
- **Maquette :** PNG 16, page 4 du PDF
- **Dépend de :** tâche 10 (`TagPill`, variante `neutral`)

**Contexte.** La liste des anecdotes débloquées, et le titre honorifique en cours. La carte du titre porte la même bande tissée que « Le savais-tu ? ».

**Composants du kit :** `ScreenHeader` (avec retour et le sous-titre « Anecdotes débloquées · 8 »), la bande de motif d'`InfoCard`.

**À créer dans l'écran** (non partagé) :
- la carte du titre : bande de motif, « Titre : Griot du Faso », `TagPill` « en cours · 2/17 régions », disque `yellow-500` avec un trophée ;
- une ligne d'anecdote : titre et région, chevron à droite si elle est débloquée, grisée avec un cadenas si elle est verrouillée.

Pour réutiliser la bande sans la recopier, tu peux sortir le motif d'`InfoCard` dans un petit composant. Dans ce cas, mets `/kit` à jour.

**Props attendues :**
- `unlockedCount: number`, `regionsDone: number`, `regionsTotal: number`
- `anecdotes: { id: string; title: string; region: string; locked: boolean }[]`

**Fichiers concernés :** `src/screens/LibraryScreen.vue`, `src/i18n/fr.ts`, `src/router.ts`.

**Critères de fin :**
- Une ligne verrouillée n'est pas cliquable et affiche un cadenas avec « Anecdote verrouillée » (pas seulement la couleur).
- Une ligne débloquée fait au moins 44 px de haut et émet `open` avec l'identifiant.

---

# Autres tâches

## 15. Dessin définitif de l'icône cauri

- **Niveau :** débutant
- **Pris par :** — (pôle Design & Graphisme, avec un membre du pôle Développement)
- **Dépend de :** aucune tâche

**Contexte.** `src/components/icons/IconCauri.vue` est un dessin provisoire, fait pour le kit : un ovale, une fente et des dents. Le cauri est la monnaie du jeu et apparaît sur presque tous les écrans : il mérite un dessin validé par le pôle Design, cohérent avec l'icône des maquettes.

**Fichiers concernés :** `src/components/icons/IconCauri.vue` (seulement le contenu du `<svg>`).

**Critères de fin :**
- Le nouveau dessin tient dans un carré de 24×24 (`viewBox="0 0 24 24"`), en traits `currentColor` d'épaisseur 2, comme les icônes lucide.
- Il reste lisible à 12 px (puce `sm`) et à 40 px, en noir sur jaune (vérifier sur `/kit`).
- Les props (`size`, `title`) et l'accessibilité ne changent pas.

---

## 16. Documenter la correspondance entre PNG et pages du PDF

- **Niveau :** débutant
- **Pris par :** —
- **Dépend de :** aucune tâche

**Contexte.** Les PNG de `docs/design/maquettes/` et les pages de `maquettes-couleur-v1.pdf` ne sont pas dans le même ordre (par exemple, la Bibliothèque est le PNG 16 mais la page 4 du PDF). C'est une source d'erreurs.

**Fichiers concernés :** `docs/design/maquettes/README.md`.

**Critères de fin :** le README contient un tableau « écran → PNG → page du PDF » pour les 17 écrans, vérifié en ouvrant chaque fichier.

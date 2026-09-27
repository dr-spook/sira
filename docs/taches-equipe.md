# Tâches réservées à l'équipe

Le **cœur jouable** (Splash, Hub, Tour du Faso, écran Question, Bravo, Presque, Région terminée, et les composants `ResultIcon`, `AnswerReveal`, `TagPill`, `RegionNode`) est construit par le responsable du dépôt. Les tâches ci-dessous viennent **s'y brancher** : 9 de niveau débutant, 9 de niveau intermédiaire.

Claude Code ne code aucune de ces tâches : quand il repère un travail hors de sa mission, il l'ajoute ici.

## Comment prendre une tâche

1. Mets ton nom dans « Pris par », et préviens l'équipe.
2. Crée une branche (`feat/…`, `fix/…`, `content/…` ou `chore/…`, voir CLAUDE.md).
3. Une tâche = une PR. Elle doit passer `npm run lint`, `npm run test` et `npm run build`.
4. Si ta tâche a un **interrupteur**, passe-le à `true` dans `src/config/features.ts` **dans ta PR**, et retire son nom de la liste `stillOff` de `src/config/features.test.ts`. Tant qu'il est à `false`, ta fonctionnalité ne doit laisser aucune trace dans le jeu.

**Niveaux :**
- **Débutant :** assembler des composants existants, régler, observer, peu de logique.
- **Intermédiaire :** de la logique en TypeScript, avec des tests.

## Règles communes

- **Maquettes :** les PNG de `docs/design/maquettes/` donnent la disposition ; les couleurs viennent de `maquettes-couleur-v1.pdf`, dont l'ordre des pages **n'est pas** celui des PNG. Chaque tâche indique les deux numéros.
- **Composants :** uniquement ceux de `src/components/` (visibles sur `/kit` avec `npm run dev`). S'il en manque un, crée-le dans `src/components/` et ajoute-le à `/kit` avec tous ses états.
- **Textes** dans `src/i18n/fr.ts`. **Couleurs, espacements, tailles** via `src/styles/tokens.css` (aucun hex). **Chiffres de jeu** dans `src/config/game.json`, validés par `src/engine/config.ts`. **Délais d'interface** dans `src/config/ui.ts`.
- **Règles de jeu** dans `src/engine/` (TypeScript pur, testé ; hasard uniquement via `createRng`). Les écrans passent par les stores, **jamais par Dexie directement**.
- **Sauvegarde :** une nouvelle table ou un nouveau champ = une **nouvelle version** du schéma (voir le commentaire en tête de `src/db/database.ts`). Si deux tâches en ont besoin en même temps, la première fusionnée prend la version 2, l'autre la version 3.
- **Voir un écran pas encore relié au jeu :** ajoute une route `/dev/<écran>` avec des props factices dans le bloc `if (import.meta.env.DEV)` de `src/router.ts`.
- **Accessibilité :** cibles tactiles d'au moins 44×44 px, un seul bouton principal (vert) par écran, jamais la couleur comme seul signal, aucun défilement horizontal à 375 px ni à 320 px.
- La PR contient une capture à 375 px de large, à côté de la maquette couleur.

---

# Débutant

## D1. Qualité WebP : moins de 40 Ko par image

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

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

Baisser la qualité allège les fichiers mais peut rendre les photos floues : il faut trouver le compromis **en regardant** les images dans l'écran Question.

**Fichiers concernés :** `scripts/build-content.ts`, constante `WEBP_QUALITY` en haut du fichier. Attention : le script ne reconvertit pas une image dont le WebP existe déjà. Avant chaque essai, vide `public/content/img/` (dossier non versionné), puis relance `npm run content`.

**Critères de fin :**
- Au moins trois valeurs essayées (par exemple 70, 60, 50), et les 10 images comparées dans l'écran Question à 375 px.
- La PR contient les captures et explique le choix.
- Le rapport de `npm run content` n'affiche plus « WebP de plus de 40 Ko », ou chaque exception restante est justifiée.

## D2. Tableau de correspondance PNG ↔ PDF des maquettes

- **Pris par :** —
- **Maquette :** toutes
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**Contexte.** Les PNG de `docs/design/maquettes/` et les pages de `maquettes-couleur-v1.pdf` ne sont pas dans le même ordre (la Bibliothèque est le PNG 16 mais la page 4 du PDF). C'est une source d'erreurs pour toute l'équipe.

**Fichiers concernés :** `docs/design/maquettes/README.md`.

**Critères de fin :** le README contient un tableau « écran → PNG → page du PDF » pour les 17 écrans, vérifié en ouvrant chaque fichier.

## D3. Modale « Pas assez de Cauris »

- **Pris par :** —
- **Maquette :** PNG 13, page 15 du PDF
- **Interrupteur :** aucun (elle sera ouverte par la modale Indice, tâche I3)
- **Dépend de :** cœur jouable fusionné (`ResultIcon`)

**Contexte.** S'affiche quand le joueur choisit un indice trop cher : « Il te faut 15 Cauris pour cet indice (tu en as 8). »

**Composants du kit :** `GameModal`, `ResultIcon` (variante `reward`), `BaseButton` (« Continuer sans indice »).

**Props attendues :** `open: boolean`, `cost: number`, `balance: number`. Événement `close`.

**Fichiers concernés :** `src/screens/NotEnoughCaurisModal.vue`, `src/i18n/fr.ts` (une fonction qui reçoit les deux nombres, comme `fr.cauri.count`), `src/router.ts` (route `/dev/pas-assez-de-cauris`).

**Critères de fin :** conforme à la maquette ; les deux nombres en gras ; la phrase secondaire en `text-medium` ; le bouton émet `close`.

## D4. Modale « Champion verrouillé »

- **Pris par :** —
- **Maquette :** PNG 14, page 16 du PDF
- **Interrupteur :** aucun (elle ne sera visible dans le jeu qu'avec `champion`, tâche I5)
- **Dépend de :** cœur jouable fusionné (`ResultIcon`)

**Contexte.** Quand le mode Champion existera, toucher sa carte verrouillée sur le Hub ouvrira cette modale : la condition de déblocage (`unlocks.champion.classiquePoints` dans `game.json`) et la progression du joueur vers elle.

**Composants du kit :** `GameModal` (`dismissible`), `ResultIcon` (variante `locked`), `ProgressBar` (libellé « 62 / 100 points »), `BaseButton` (« Jouer en Classique »).

**Props attendues :** `open: boolean`, `points: number`, `required: number`. Événements `close` et `play-classic`.

**Fichiers concernés :** `src/screens/ChampionLockedModal.vue`, `src/i18n/fr.ts`, `src/router.ts` (route `/dev/champion-verrouille`). Dans `src/screens/HubScreen.vue`, prépare l'ouverture **seulement quand `features.champion` vaut `true`** : aujourd'hui la carte affiche « Bientôt » et ne réagit pas.

**Critères de fin :** la barre suit `points / required` ; « Jouer en Classique » émet `play-classic` ; Échap ferme la modale ; avec `champion` à `false`, rien ne change sur le Hub.

## D5. Écran « Temps écoulé »

- **Pris par :** —
- **Maquette :** PNG 10, page 12 du PDF
- **Interrupteur :** aucun (il sera utilisé par Champion et Maître, tâches I5 et I6)
- **Dépend de :** cœur jouable fusionné (`AnswerReveal`)

**Contexte.** S'affiche quand le chrono arrive à 0. Le 0 est rouge : c'est le temps qui est en cause, pas le joueur (couleurs-v1.md §6).

**Composants du kit :** `GameModal`, `ChronoRing` (`seconds` à 0), `AnswerReveal`, `BaseButton` (« Continuer »).

**Props attendues :** `open: boolean`, `answer: string`. Événement `next`.

**Fichiers concernés :** `src/screens/TimeUpModal.vue`, `src/i18n/fr.ts`, `src/router.ts` (route `/dev/temps-ecoule`).

**Critères de fin :** conforme à la maquette ; le bouton émet `next` ; la modale ne se ferme pas avec Échap.

## D6. Écran « Run terminé » (variante récompense de `TagPill`)

- **Pris par :** —
- **Maquette :** PNG 12, page 14 du PDF
- **Interrupteur :** aucun (il sera utilisé par Champion, tâche I5)
- **Dépend de :** cœur jouable fusionné (`TagPill`)

**Contexte.** Fin d'une partie Champion : le score en très grand, un éventuel « Nouveau record perso ! », deux cartes de statistiques (bonnes réponses, série max), puis « Rejouer » et « Retour au hub ».

**Composants du kit :** `TagPill`, `BaseButton`.

**À faire :**
- Ajouter à `TagPill` (qui existe en variante `neutral`) une variante **`reward`** : fond `reward`, texte `reward-text`, icône trophée (lucide `Trophy`). La montrer sur `/kit`.
- Créer dans l'écran les deux cartes de statistiques.
- Le score dépasse la plus grande taille de l'échelle (48 px) : demander la taille au pôle Design et l'ajouter comme token dans `tokens.css` (par exemple `--font-size-display`), pas en dur dans l'écran.

**Props attendues :** `score: number`, `isRecord: boolean`, `correct: number`, `total: number`, `bestStreak: number`. Événements `replay` et `back-to-hub`.

**Fichiers concernés :** `src/components/TagPill.vue`, `src/dev/KitScreen.vue`, `src/screens/RunDoneScreen.vue`, `src/styles/tokens.css`, `src/i18n/fr.ts`, `src/router.ts` (route `/dev/run-termine`).

**Critères de fin :** les 2 variantes de `TagPill` sont sur `/kit` ; « Nouveau record perso ! » n'apparaît que si `isRecord` vaut `true`.

## D7. Écran Paramètres : son et réinitialisation

- **Pris par :** —
- **Maquette :** aucune : à demander au pôle Design (en attendant, s'inspirer de la Bibliothèque, PNG 16)
- **Interrupteur :** `settings`
- **Dépend de :** cœur jouable fusionné

**Contexte.** Deux réglages :
- **Son** activé ou désactivé. La ligne n'apparaît que si `features.sounds` vaut `true` (tâche I7) ; le choix est quand même enregistré.
- **Réinitialiser la progression** : efface Cauris, points, série, progression des régions, historique et anecdotes, **après confirmation**.

**Composants du kit :** `ScreenHeader` (avec retour), `BaseButton` (la réinitialisation est un bouton **secondaire**), `GameModal` pour la confirmation (« Tout effacer ? », « Effacer », « Annuler »).

**Fichiers concernés :**
- `src/screens/SettingsScreen.vue`, route `/parametres` dans `src/router.ts`, et un accès depuis le Hub (visible seulement avec `settings`).
- `src/db/database.ts` : une table `settings` (nouvelle version du schéma, **pas de localStorage**) ; `src/db/repository.ts` : `resetProgress()`.
- `src/stores/` : un store `settings`, et le rechargement de `player` et `progress` après réinitialisation.
- `src/i18n/fr.ts`.

**Critères de fin :**
- Rien n'est effacé sans confirmation ; « Annuler » ne touche à rien.
- Après réinitialisation, le jeu revient à l'état de départ (première région seule ouverte, 0 Cauri).
- Le choix du son survit à la fermeture de l'onglet.
- Test de `resetProgress()` avec fake-indexeddb (sur le modèle de `src/db/database.test.ts`).
- Avec `settings` à `false`, aucun accès aux Paramètres.

## D8. Demander au navigateur de garder la sauvegarde

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** `persistStorage`
- **Dépend de :** aucune tâche

**Contexte.** Sur un téléphone qui manque de place, le navigateur peut effacer les données d'un site, donc la progression du joueur. `navigator.storage.persist()` lui demande de ne pas le faire (Chrome l'accorde souvent quand la PWA est installée).

**Fichiers concernés :** `src/db/` (une fonction `requestPersistentStorage()`), appelée une fois au démarrage (`src/main.ts` ou le store `player`), seulement si `features.persistStorage` vaut `true`.

**Critères de fin :**
- La demande est faite une seule fois ; un refus, ou un navigateur qui ne connaît pas l'API, ne provoque aucune erreur.
- Le résultat (accordé ou non) s'affiche dans la console en dev seulement.

## D9. Icônes PWA à partir du logo

- **Pris par :** —
- **Maquette :** `src/assets/brand/logo-sira-full.png`
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**Contexte.** Les icônes de `public/icons/` sont provisoires (un « S » blanc pixelisé sur fond vert). L'icône définitive est **le cercle rouge avec le S** du logo. Ne modifie pas le logo original.

**Tailles attendues** (les noms ne changent pas, le manifest les cite déjà dans `vite.config.ts`) :
- `icon-192.png` (192×192) et `icon-512.png` (512×512) ;
- `maskable-512.png` (512×512) : le cercle doit tenir dans la **zone sûre** (le cercle central de 80 %), car Android peut rogner les bords ;
- `apple-touch-icon.png` (180×180, sans transparence).

**Fichiers concernés :** `public/icons/*.png`. Pour les produire : un logiciel d'image, ou un petit script avec `sharp` (déjà dans le projet, comme dans `scripts/build-content.ts`).

**Critères de fin :**
- Les 4 fichiers remplacent les provisoires, chacun de moins de 30 Ko.
- Dans Chrome (outils de développement → Application → Manifest), les icônes s'affichent sans erreur, y compris en mode « maskable ».
- L'app installée sur un téléphone montre le cercle rouge, non rogné.

---

# Intermédiaire

## I1. Intégration continue : GitHub Actions sur chaque PR

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**Contexte.** Aujourd'hui, chacun doit penser à lancer `lint`, `test` et `build` avant d'ouvrir une PR. Une vérification automatique évite de fusionner du code cassé dans `main`.

**Fichiers concernés :** `.github/workflows/ci.yml` (à créer) ; `CLAUDE.md`, section Conventions (la CI doit être verte avant de fusionner).

**Critères de fin :**
- Le workflow se lance sur chaque PR vers `main` et sur chaque push sur `main`.
- Il utilise Node 24 (`package.json` demande au moins Node 22.18), installe avec `npm ci`, et met en cache les paquets npm.
- Il lance, dans cet ordre : `npm run lint`, `npm run test`, `npm run build`, `npm run content -- --check`.
- `content-source/` n'est pas sur GitHub : `--check` affiche alors un message et réussit. C'est voulu.
- Preuve : une PR de test verte, et une PR volontairement cassée marquée en rouge.

## I2. Option `--prune` du script de contenu

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** aucune tâche

**Contexte.** `npm run content` enregistre chaque image sous le nom de son empreinte (`3f9a1c0b2d4e.webp`). Quand une image source est remplacée ou supprimée, l'ancien WebP reste dans `public/content/img/` : inutile, il prend de la place et fausse le poids total.

**Fichiers concernés :** `scripts/build-content.ts` ; la logique testable dans `scripts/content/` (par exemple `prune.ts` et `prune.test.ts`) ; `CLAUDE.md`, section Contenu.

**Critères de fin :**
- `npm run content -- --prune` supprime les `.webp` de `public/content/img/` qui ne sont cités par aucune énigme de `puzzles.json`.
- Rien n'est supprimé s'il y a une erreur bloquante ; aucun autre fichier n'est touché (`.gitkeep` compris).
- `npm run content -- --check --prune` affiche ce qui **serait** supprimé, sans rien supprimer.
- Le rapport affiche le nombre et le poids des fichiers supprimés.
- Un test Vitest couvre le choix des fichiers à supprimer.

## I3. Modale Indice et branchement des 3 indices

- **Pris par :** —
- **Maquette :** PNG 15, page 17 du PDF (et PNG 4 et 5 pour le bouton Indice)
- **Interrupteur :** `hints`
- **Dépend de :** cœur jouable fusionné (écran Question) ; tâche D3 (modale « Pas assez de Cauris »)

**Contexte.** Les 3 indices existent déjà dans l'engine (`src/engine/hints.ts`) et dans le store (`useGameStore().requestHint`), avec leurs erreurs typées : `insufficient-cauris`, `wrong-format`, `nothing-left`. Il reste l'interface.

**Composants du kit :** `GameModal` (`dismissible`), `CauriChip` (`sm`), `BaseButton` (secondaire « Fermer ») ; dans l'écran Question : `AnswerOption` (état `eliminated`), `LetterTile` (état `disabled`), `LetterSlot`.

**À faire :**
- Dans `src/screens/QuestionScreen.vue`, le bouton « Indice » (avec son coût) en bas à gauche, **seulement si `features.hints`**.
- `src/screens/HintModal.vue` : n'afficher que les indices du format en cours (`hints.*.formats` de `game.json`). Une ligne trop chère montre « il te manque X » (couleurs-v1.md §6, écran 15) et ouvre la modale de D3 au toucher. Une ligne qui renverrait `nothing-left` est grisée avec un texte explicatif.
- Afficher le résultat : options éliminées barrées, leurre retiré grisé, lettre placée verrouillée.

**Fichiers concernés :** `src/screens/QuestionScreen.vue`, `src/screens/HintModal.vue`, `src/i18n/fr.ts`, `src/config/features.ts`.

**Critères de fin :**
- Les Cauris baissent du coût exact, et jamais un indice inutile n'est payé.
- Tests de composants (sur le modèle de `src/components/GameModal.test.ts`) pour les 3 erreurs.
- Avec `hints` à `false`, aucun bouton Indice.

## I4. Bibliothèque et son accès depuis le Hub

- **Pris par :** —
- **Maquette :** PNG 16, page 4 du PDF
- **Interrupteur :** `library`
- **Dépend de :** cœur jouable fusionné (`TagPill`)

**Contexte.** Chaque énigme réussie débloque son anecdote (table `anecdotes` de Dexie, fonction `listAnecdotes` de `src/db/repository.ts`). La Bibliothèque les liste, avec le titre honorifique en cours (« Titre : Griot du Faso · en cours · 2/17 régions »).

**Composants du kit :** `ScreenHeader` (retour et sous-titre « Anecdotes débloquées · 8 »), `TagPill`, la bande de motif d'`InfoCard` (tu peux la sortir dans un petit composant ; mets alors `/kit` à jour).

**À faire :**
- Un store `library` qui lit les anecdotes via le repository (jamais Dexie dans l'écran).
- `src/screens/LibraryScreen.vue`, route `/bibliotheque`, et un accès depuis le Hub **seulement si `features.library`**.
- Une ligne par anecdote : titre (`anecdote.title` de `puzzles.json`) et région, chevron si elle est débloquée ; grisée avec un cadenas et « Anecdote verrouillée » sinon. Toucher une ligne débloquée ouvre l'anecdote (une `InfoCard` dans une `GameModal`, par exemple).
- **Point à trancher avec le pôle Contenu :** une même anecdote est aujourd'hui copiée dans plusieurs régions (Mossi ×9). Faut-il l'afficher une seule fois ?

**Critères de fin :**
- Une anecdote débloquée en jouant apparaît dans la Bibliothèque, y compris après fermeture de l'onglet.
- Les lignes font au moins 44 px de haut ; une ligne verrouillée n'est pas cliquable.
- Avec `library` à `false`, aucun accès.

## I5. Mode Champion : logique et écran

- **Pris par :** —
- **Maquettes :** PNG 6 (question Champion) et 12 (Run terminé) ; pages 7 et 14 du PDF
- **Interrupteur :** `champion`
- **Dépend de :** tâches D4 (Champion verrouillé), D5 (Temps écoulé), D6 (Run terminé)

**Contexte.** Mode contre la montre, débloqué à 100 points en Classique (`unlocks.champion.classiquePoints`, fonction `isChampionUnlocked`). Chaque énigme a un chrono de 20 s (`timers.championSeconds`). Le joueur enchaîne les énigmes, avec une série (« Série ×4 ») et un score, jusqu'à l'écran « Run terminé ».

**Questions au pôle Game Design, à trancher avant de coder** (puis à ranger dans `game.json`) :
- Combien d'énigmes dans un run ? (La maquette montre 15.) Quel format ? (La maquette montre un Carré en 2×2.)
- Comment se calcule le score : points du format, bonus de série, bonus de temps restant ?
- Le temps écoulé compte-t-il comme une réponse fausse ?
- Le run se termine-t-il seulement au bout des N énigmes, ou aussi après X erreurs ?
- Le Champion rapporte-t-il aussi des Cauris ?

**Composants du kit :** `ChronoRing`, `AnswerOption`, `TagPill` (« Série ×4 »), `GameModal` ; les écrans de D4, D5 et D6.

**Fichiers concernés :**
- `src/engine/champion.ts` et `champion.test.ts` : tirage du run (avec graine), score, série, fin de run.
- `src/stores/champion.ts` : le chrono (le store mesure le temps ; l'engine reçoit seulement « réponse » ou « temps écoulé »).
- `src/screens/ChampionScreen.vue`, route, et la carte du Hub (débloquée selon les points, sinon modale D4).
- `src/db/database.ts` et `repository.ts` : le record perso (nouvelle version du schéma).
- `src/config/game.json`, `src/engine/config.ts` et son test.

**Critères de fin :**
- Même graine, même run (préparation du Duel).
- Tests : temps écoulé, série cassée, dernier tour, record battu ou non.
- Le record perso survit à la fermeture de l'onglet (test avec fake-indexeddb).
- Avec `champion` à `false`, la carte reste « Bientôt ».

## I6. Mode Maître (avec le format Duo)

- **Pris par :** —
- **Maquette :** PNG 7, page 8 du PDF
- **Interrupteur :** `maitre`
- **Dépend de :** tâches I5 (déblocage « Après Champion ») et D5 (Temps écoulé)

**Contexte.** Pour chaque énigme, le joueur voit les 4 images puis **choisit comment répondre** : Duo, Carré ou Directe. Plus le format est difficile, plus il rapporte : la maquette affiche 25 %, 45 % et 100 %, ce qui correspond au rapport des points de chaque format à ceux du Direct dans `game.json` (25, 45, 100). Le chrono de 10 s (`timers.maitreSeconds`) démarre **après** le choix. C'est le seul mode qui utilise le Duo : l'engine et l'écran Question le gèrent déjà.

**Questions au pôle Game Design, à trancher avant de coder :**
- Quelle est la condition exacte de déblocage (« Après Champion » : un score minimal ? un run terminé ?) ?
- Combien d'énigmes dans une partie, et comment se calcule le score ?
- Les pourcentages affichés sont-ils bien calculés à partir des points des formats ?
- Le Maître rapporte-t-il des Cauris, et selon quel barème ?

**Composants du kit :** `ModeCard` ou des cartes sur son modèle pour le choix, `ChronoRing` ; l'écran Question pour répondre.

**Fichiers concernés :** `src/engine/maitre.ts` et `maitre.test.ts`, `src/stores/maitre.ts`, `src/screens/MaitreScreen.vue`, route, carte du Hub, `src/config/game.json`, `src/engine/config.ts`.

**Critères de fin :**
- Le choix du format passe par `createRound` (`src/engine/round.ts`) : aucune nouvelle logique de propositions ni de plateau.
- Les pourcentages viennent de `game.json`, jamais écrits en dur.
- Tests : chaque format choisi, temps écoulé après le choix, score.
- Avec `maitre` à `false`, la carte reste « Bientôt ».

## I7. Intégration des sons

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** `sounds`
- **Dépend de :** tâche D7 (réglage du son)

**Contexte.** Des sons courts pour les moments clés : bonne réponse, réponse fausse, toucher d'une tuile, région terminée. Les fichiers sont à fournir par le pôle Design (ambiance sonore, GDD §14).

**À faire :**
- Un petit module (par exemple `src/audio/`) qui joue un son par son nom, et ne joue rien si `features.sounds` vaut `false` ou si le joueur a coupé le son (D7).
- Des fichiers audio courts et légers (par exemple en `.webm`/Opus, quelques Ko chacun), jouables hors-ligne.
- Aucun son au démarrage : les navigateurs bloquent le son avant le premier toucher.

**Fichiers concernés :** le module audio, les fichiers sons (dans `public/` ou `src/assets/`), les écrans qui déclenchent les sons, `src/config/features.ts`.

**Critères de fin :**
- Chaque son pèse moins de 20 Ko, et l'ensemble moins de 100 Ko.
- Couper le son dans les Paramètres coupe tout, immédiatement.
- Avec `sounds` à `false`, aucun fichier son n'est téléchargé.

## I8. Précache hors-ligne par région

- **Pris par :** —
- **Maquette :** aucune
- **Interrupteur :** aucun
- **Dépend de :** cœur jouable fusionné

**Contexte.** Le service worker (`vite-plugin-pwa`) précache déjà le code et les polices, mais **pas les images des énigmes** (`public/content/img/`) : sans réseau, les images d'une région pas encore vue ne s'affichent pas. Tout précacher à l'installation coûterait trop de data (plus de 2 Mo). CLAUDE.md demande un **précache par région**.

**À faire :**
- Une règle de cache pour `/content/img/*.webp` (cache d'abord, puis réseau), dans la configuration `workbox` de `vite.config.ts`.
- Quand le joueur ouvre une région (ou la carte), télécharger en arrière-plan les images de la région en cours et de la suivante (la liste est dans `puzzles.json`).
- Une limite de taille du cache, pour ne pas remplir le téléphone.

**Fichiers concernés :** `vite.config.ts`, un module de précache (par exemple `src/offline/`), l'appel depuis le store `game` ou l'écran Tour du Faso.

**Critères de fin :**
- En mode avion, une région déjà ouverte se joue en entier avec ses images, même après fermeture de l'onglet.
- À la première installation, seules les images de la première région sont téléchargées.
- Une nouvelle version du contenu ne laisse pas d'anciennes images en cache indéfiniment.

## I9. Duel local sur le même téléphone

- **Pris par :** —
- **Maquette :** aucune : à demander au pôle Design
- **Interrupteur :** `duelLocal`
- **Dépend de :** cœur jouable fusionné

**Contexte.** Deux joueurs se passent le téléphone et répondent tour à tour aux **mêmes énigmes** ; les scores sont comparés à la fin (GDD §8). Le hasard à graine (`createRng`) garantit que les deux joueurs voient les mêmes énigmes et les mêmes propositions.

**Questions au pôle Game Design :** combien d'énigmes, quels formats, comment se calcule le score, et le duel rapporte-t-il des Cauris ?

**Fichiers concernés :** `src/engine/duel.ts` et `duel.test.ts`, `src/stores/duel.ts`, `src/screens/` (choix des noms, écran « passe le téléphone à… », résultat), route, accès depuis le Hub **seulement si `features.duelLocal`**.

**Critères de fin :**
- Même graine : les deux joueurs voient exactement les mêmes énigmes, dans le même ordre, avec les mêmes propositions (test).
- Un écran de transition empêche le joueur 2 de voir les réponses du joueur 1.
- Le duel ne modifie pas la progression du Tour du Faso.
- Avec `duelLocal` à `false`, aucun accès.

---

# Plus tard

Hors V1, ou à reprendre après les tâches ci-dessus.

- **Duel WhatsApp (interrupteur `duelWhatsapp`) :** le joueur génère un Code Défi et l'envoie à un ami, qui joue les mêmes énigmes. La base existe : `seedFromString()` dans `src/engine/random.ts` transforme un code en graine.
- **Rejouer une région terminée :** aujourd'hui, une région terminée ne peut pas être rejouée (toutes ses énigmes sont réussies). Il faudra décider ce que rapporte un rejeu.

# Hors code (pôle Design)

- **Icône cauri définitive :** `src/components/icons/IconCauri.vue` est un dessin provisoire. Le pôle Design fournit un dessin de 24×24 (`viewBox="0 0 24 24"`), en traits `currentColor` d'épaisseur 2 comme les icônes lucide, lisible à 12 px et à 40 px. Un développeur remplace ensuite le contenu du `<svg>`, sans changer les props.
- **Maquettes manquantes :** écran Paramètres (D7), écrans du Duel local (I9).

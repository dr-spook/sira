# Tâches réservées à l'équipe

Ces tâches sont repérées pendant le développement mais ne font pas partie de la tâche en cours. Elles sont réservées aux membres de l'équipe : Claude Code ne les code pas, il les ajoute ici.

**Pour prendre une tâche :** mets ton nom dans « Pris par », crée une branche (`feat/…`, `fix/…` ou `content/…`, voir CLAUDE.md), et ouvre une PR par tâche. Elle doit passer `npm run lint`, `npm run test` et `npm run build`.

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

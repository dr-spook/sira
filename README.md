# SIRA — le chemin des cultures

Jeu mobile gratuit « 4 images → 1 mot » sur le patrimoine du Burkina Faso, porté par FASO ESPORT. C'est une PWA : elle se joue dans le navigateur du téléphone, hors-ligne, et peut s'installer comme une application.

- **Règles de l'équipe :** [`CLAUDE.md`](CLAUDE.md) (à lire avant de coder).
- **Tâches à prendre :** [`docs/taches-equipe.md`](docs/taches-equipe.md).
- **Maquettes et couleurs :** [`docs/design/`](docs/design/). **Règles du jeu :** [`docs/gdd-v3.md`](docs/gdd-v3.md).

---

## 1. Installer le projet sur son ordinateur

### Ce qu'il faut installer (une seule fois)

| Outil                   | Version                      | Où le trouver                                          | Vérifier        |
| ----------------------- | ---------------------------- | ------------------------------------------------------ | --------------- |
| **Node.js**             | 22.18 ou plus (24 conseillé) | [nodejs.org](https://nodejs.org), version « LTS »      | `node -v`       |
| **Git**                 | récente                      | [git-scm.com](https://git-scm.com)                     | `git --version` |
| **VS Code** (conseillé) | récente                      | [code.visualstudio.com](https://code.visualstudio.com) | —               |

Dans VS Code, installe l'extension **Vue - Official** (Vue.js) : elle colore et vérifie les fichiers `.vue`. Les extensions ESLint et Prettier sont utiles aussi.

`npm` est installé avec Node.js. Sous Windows, ouvre un terminal **PowerShell** ou le terminal de VS Code (menu _Terminal_ → _Nouveau terminal_).

### Récupérer le code

```bash
git clone git@github.com:dr-spook/sira.git
cd sira
npm install
```

`npm install` télécharge les dépendances dans `node_modules/` (quelques minutes la première fois). Si `git clone` refuse l'accès, demande au responsable du dépôt de t'ajouter, et configure ta clé SSH ([guide GitHub](https://docs.github.com/fr/authentication/connecting-to-github-with-ssh)).

### Récupérer le contenu du jeu (images et anecdotes)

Le contenu brut **n'est pas sur GitHub** : il est trop lourd, et les droits des images ne sont pas encore vérifiés.

1. Demande le dossier `content-source/` au pôle Contenu, et place-le **à la racine du projet** (à côté de `package.json`).
2. Génère les images du jeu :

   ```bash
   npm run content
   ```

   Le script crée `public/content/img/*.webp` et met à jour `src/content/puzzles.json`, puis affiche un rapport. Les `[attention]` ne bloquent pas ; les `[ERREUR]` si.

Sans `content-source/`, le jeu tourne quand même : les images sont remplacées par des cases grises « Image 1 », « Image 2 »…

### Lancer le jeu

```bash
npm run dev
```

Ouvre l'adresse affichée (en général **http://localhost:5173**) dans Chrome ou Edge. Pour voir le jeu comme sur un téléphone : `F12`, puis l'icône téléphone (« Toggle device toolbar »), et choisis une largeur de 375 px.

- **`/kit`** (http://localhost:5173/kit) : tous les composants de l'interface, dans tous leurs états. C'est la référence visuelle de l'équipe. Cette page n'existe qu'en dev.
- Le serveur recharge la page tout seul quand tu enregistres un fichier. `Ctrl + C` dans le terminal pour l'arrêter.

---

## 2. Tester sur son téléphone (par le Wi-Fi)

Le téléphone et l'ordinateur doivent être **sur le même réseau Wi-Fi**.

1. Lance le serveur en l'ouvrant au réseau local :

   ```bash
   npm run dev -- --host
   ```

2. Le terminal affiche deux adresses. Prends celle marquée **Network**, par exemple :

   ```
   ➜  Local:   http://localhost:5173/
   ➜  Network: http://192.168.1.23:5173/
   ```

3. Tape cette adresse `Network` dans le navigateur du téléphone (Chrome sur Android).

**Si la page ne s'ouvre pas sur le téléphone :**

- **Pare-feu Windows :** au premier lancement, Windows demande d'autoriser Node.js. Accepte pour les **réseaux privés**. Si tu as refusé : Pare-feu Windows Defender → « Autoriser une application » → coche Node.js.
- Vérifie que le téléphone n'est pas sur les données mobiles, ni sur un Wi-Fi « invité » isolé.
- Certains réseaux (école, café) bloquent les échanges entre appareils : utilise alors le partage de connexion d'un téléphone, avec l'ordinateur connecté dessus.

**Bon à savoir :**

- Ta progression est sauvegardée **dans le navigateur de chaque appareil** : le téléphone et l'ordinateur ont chacun leur propre partie.
- En Wi-Fi local (adresse `http://192.168…`), le téléphone ne propose pas d'installer l'application : l'installation d'une PWA exige une connexion sécurisée (`https`). Pour tester l'installation, utilise l'ordinateur (voir « Tester la version finale »).

---

## 3. Les commandes

| Commande                     | À quoi elle sert                                             |
| ---------------------------- | ------------------------------------------------------------ |
| `npm run dev`                | Lance le jeu en développement (http://localhost:5173)        |
| `npm run dev -- --host`      | Pareil, accessible depuis un téléphone sur le même Wi-Fi     |
| `npm run content`            | Génère les images et `puzzles.json` depuis `content-source/` |
| `npm run content -- --check` | Vérifie `content-source/` sans rien écrire                   |
| `npm run test`               | Lance les tests automatiques (Vitest)                        |
| `npm run lint`               | Vérifie le style du code et les types TypeScript             |
| `npm run format`             | Remet en forme tous les fichiers (Prettier)                  |
| `npm run build`              | Construit la version finale dans `dist/`                     |
| `npm run preview`            | Sert la version finale (après `build`), pour la tester       |

**Tester la version finale** (service worker, hors-ligne, installation) :

```bash
npm run build
npm run preview
```

Puis ouvre http://localhost:4173 : Chrome propose l'installation dans la barre d'adresse.

---

## 4. Travailler sur une tâche

1. Choisis une tâche dans [`docs/taches-equipe.md`](docs/taches-equipe.md), et mets ton nom dans « Pris par ».
2. Pars de `main` à jour, et crée ta branche :

   ```bash
   git switch main
   git pull
   git switch -c feat/nom-de-ta-tache
   ```

   Préfixes : `feat/…` (fonctionnalité), `fix/…` (correction), `content/…` (contenu), `chore/…` (maintenance).

3. Code, puis vérifie **avant chaque PR** :

   ```bash
   npm run lint
   npm run test
   npm run build
   ```

4. Commite en français, à l'impératif (« Ajoute la modale Indice »), pousse, et ouvre une Pull Request vers `main`. **Jamais de commit directement sur `main`.**

---

## 5. Où se trouve quoi

```
src/
  engine/       règles du jeu, en TypeScript pur et testé (pas de Vue, pas de Dexie)
  stores/       Pinia : relie les règles, la sauvegarde et les écrans
  db/           sauvegarde locale (Dexie / IndexedDB) et ses versions
  config/       game.json (chiffres du jeu), features.ts (interrupteurs), ui.ts (délais)
  content/      puzzles.json, GÉNÉRÉ par npm run content (ne pas l'éditer)
  components/   composants réutilisables (visibles sur /kit)
  screens/      un fichier par écran des maquettes
  styles/       tokens.css (couleurs, espacements, tailles), polices
  i18n/         fr.ts : tous les textes affichés
  assets/       logo
  dev/          page /kit (dev uniquement)
scripts/        build-content : content-source/ → images WebP + puzzles.json
docs/           GDD, maquettes, couleurs, rapport de contenu, tâches
```

Chaque dossier de `src/` a un `README.md` qui explique ce qu'on y met.

---

## 6. Problèmes fréquents

| Problème                                                                                                          | Solution                                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `node` n'est pas reconnu                                                                                          | Node.js n'est pas installé, ou le terminal a été ouvert avant l'installation : ferme-le et rouvre-le.                                                                                           |
| `npm install` échoue                                                                                              | Vérifie `node -v` (22.18 minimum). Supprime `node_modules/` et relance `npm install`.                                                                                                           |
| Les images sont des cases grises                                                                                  | `content-source/` manque, ou `npm run content` n'a pas été lancé.                                                                                                                               |
| `Port 5173 is in use`                                                                                             | Un autre `npm run dev` tourne déjà : ferme-le, ou utilise l'adresse que Vite propose.                                                                                                           |
| Windows : erreur **4551** « une stratégie de contrôle d'application a bloqué ce fichier » pendant `npm run build` | Smart App Control (ou une stratégie d'entreprise) bloque un fichier de `node_modules/`. Vois Sécurité Windows → Contrôle des applications et du navigateur, ou demande au responsable du dépôt. |
| Je veux repartir de zéro dans le jeu                                                                              | Dans le navigateur : `F12` → onglet _Application_ → _Storage_ → « Clear site data ». (Sur téléphone, efface les données du site dans les réglages du navigateur.)                               |
| `npm run lint` signale un problème de format                                                                      | Lance `npm run format`, puis `npm run lint` à nouveau.                                                                                                                                          |

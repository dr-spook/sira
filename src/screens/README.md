# screens/

Un fichier par écran des maquettes (`docs/design/maquettes/`), branché sur une route dans `src/router.ts`.

- Un écran assemble des composants de `src/components/` et lit les stores.
- Pas de logique de jeu ici : elle va dans `src/engine/`.
- Un seul bouton principal (vert) par écran.

`PlaceholderScreen.vue` est provisoire : il sera remplacé par le Splash et le Hub.

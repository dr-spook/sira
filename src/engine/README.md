# engine/

La logique de jeu **pure** : normalisation des réponses, tuiles du plateau, économie des Cauris, progression.

- Pas de Vue, pas de DOM, pas de Dexie ici : seulement des fonctions TypeScript qui reçoivent des données et en renvoient.
- Chaque fichier a son test à côté (`tuiles.ts` → `tuiles.test.ts`), lancé par `npm run test`.
- Les chiffres (gains, coûts, seuils) viennent de `src/config/game.json`, jamais écrits en dur.

Pourquoi ? Du code sans interface se teste facilement et ne casse pas quand on change un écran.

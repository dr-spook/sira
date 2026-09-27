# dev/

Outils réservés au développement. **Rien ici n'arrive dans le jeu publié** : la route `/kit` n'existe qu'avec `npm run dev` (voir `src/router.ts`).

- `KitScreen.vue` : la page `/kit`, la référence visuelle de l'équipe. Elle montre chaque composant de `src/components/` dans chacun de ses états.
- `kit-texts.ts` : les textes et les données factices de cette page. Ils ne sont pas dans `src/i18n/fr.ts`, sinon ils partiraient dans le bundle du jeu.

Ne jamais importer un fichier de `dev/` depuis un écran ou un composant du jeu.

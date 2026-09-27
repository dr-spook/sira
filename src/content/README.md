# content/

`puzzles.json` : la liste des énigmes, **générée** par `npm run content` à partir de `content-source/`.

- Ne jamais éditer ce fichier à la main : il serait écrasé à la prochaine génération.
- Pour corriger une énigme, on corrige `content-source/` (ou son `meta.json`), puis on relance `npm run content`.
- Les images correspondantes sont générées dans `public/content/`.

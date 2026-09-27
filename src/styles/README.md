# styles/

Les styles globaux, importés une seule fois dans `src/main.ts`.

- `tokens.css` : les couleurs, recopiées de `docs/design/couleurs-v1.md`. C'est le **seul** endroit où on écrit un hex. Dans les composants, utiliser les tokens sémantiques (`var(--action-primary)`, `var(--text-medium)`…), pas les primitives (`--green-700`).
- `fonts.css` : la police Montserrat, auto-hébergée (pas de CDN, le jeu doit marcher hors-ligne).
- `base.css` : les règles de base de la page (fond, police, texte).

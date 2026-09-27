# components/

Les composants **réutilisables** : boutons, puces Cauris, tuiles, modales, icônes (`icons/`)…

- Un composant **affiche**, il ne calcule pas : il reçoit ses données en props et signale les actions par des événements.
- Couleurs uniquement via les variables de `src/styles/tokens.css`, jamais de hex.
- Textes uniquement via `src/i18n/fr.ts`.
- Cibles tactiles d'au moins 44×44 px.
- Icônes : `lucide-vue-next`, ou `icons/IconCauri.vue` pour le cauri. Jamais d'emoji.

**Voir tous les composants :** lance `npm run dev` et ouvre `/kit`. Chaque composant y est montré dans chacun de ses états. Si tu ajoutes un composant ou un état, ajoute-le aussi à `/kit` (`src/dev/KitScreen.vue`).

Les tokens (`var(--space-16)`, `var(--radius-lg)`, `var(--font-size-24)`…) sont décrits dans `src/styles/tokens.css`.

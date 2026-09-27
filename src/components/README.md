# components/

Les composants **réutilisables** : boutons, puces Cauris, tuiles, modales, icônes (`icons/`)…

- Un composant **affiche**, il ne calcule pas : il reçoit ses données en props et signale les actions par des événements.
- Couleurs uniquement via les variables de `src/styles/tokens.css`, jamais de hex.
- Textes uniquement via `src/i18n/fr.ts`.
- Cibles tactiles d'au moins 44×44 px.
- Icônes : `lucide-vue-next`, ou `icons/IconCauri.vue` pour le cauri. Jamais d'emoji.

# assets/

Les fichiers de marque importés par le code (logo…), rangés dans `brand/`.

- Un fichier ici passe par Vite : il est optimisé et renommé au build. On l'importe dans un composant (`import logo from '@/assets/brand/logo-sira-full.png'`).
- Pas d'images d'énigmes ici : elles sont générées dans `public/content/` par `npm run content`.
- `brand/logo-sira-full.png` : logo complet (source haute définition, 4167×4167). Il n'est pas encore utilisé : les icônes et le splash seront faits plus tard.

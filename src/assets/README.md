# assets/

Les fichiers de marque importés par le code (logo…), rangés dans `brand/`.

- Un fichier ici passe par Vite : il est optimisé et renommé au build. On l'importe dans un composant (`import logo from '@/assets/brand/logo-sira-full.png'`).
- Pas d'images d'énigmes ici : elles sont générées dans `public/content/` par `npm run content`.
- `brand/logo-sira-full.png` : logo complet, source haute définition (4167×4167). **Ne jamais le modifier**, ni l'importer dans le jeu (511 Ko).
- `brand/logo-sira-640.webp` : version légère affichée par le Splash (640 px de large, 22 Ko). Générée une fois depuis l'original, avec sharp : marges retirées (`trim`), largeur 640, WebP qualité 80.

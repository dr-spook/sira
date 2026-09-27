# db/

Le schéma **Dexie** (IndexedDB) et ses migrations : progression, Cauris, historique des énigmes.

- Tout ce qui doit survivre à la fermeture de l'app passe par ici.
- **Jamais de localStorage** pour les données de jeu (trop petit, synchrone, peut être vidé).
- Changer le schéma = ajouter une nouvelle version Dexie, ne jamais modifier une version déjà publiée : les joueurs ont des données dans l'ancienne.

# stores/

Les stores **Pinia** : l'état partagé de l'app (Cauris, progression, énigme en cours…).

Un store fait le lien entre trois choses :

- l'**engine** (`src/engine/`), qui calcule ;
- **Dexie** (`src/db/`), qui enregistre sur le téléphone ;
- les **écrans**, qui lisent le store et appellent ses actions.

Un store ne contient pas de règle de jeu : il appelle l'engine.

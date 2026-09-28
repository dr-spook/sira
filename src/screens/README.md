# screens/

Un fichier par écran des maquettes (`docs/design/maquettes/`), branché sur une route dans `src/router.ts`.

- Un écran assemble des composants de `src/components/` et lit les stores.
- Pas de logique de jeu ici : elle va dans `src/engine/`.
- Un seul bouton principal (vert) par écran.

**Écrans du cœur jouable :**

| Fichier                                                          | Route                        | Maquette   |
| ---------------------------------------------------------------- | ---------------------------- | ---------- |
| `SplashScreen.vue`                                               | `/`                          | 1          |
| `HubScreen.vue`                                                  | `/hub`                       | 2          |
| `TourScreen.vue`                                                 | `/tour`                      | 3          |
| `QuestionScreen.vue` (avec `BravoModal.vue` et `RetryModal.vue`) | `/jouer/:regionId`           | 4, 5, 8, 9 |
| `RegionDoneScreen.vue`                                           | `/region/:regionId/terminee` | 11         |

- Une fonctionnalité réservée à l'équipe n'apparaît que si son interrupteur de `src/config/features.ts` vaut `true`.
- Les délais d'interface (Splash, affichage du résultat) sont dans `src/config/ui.ts`.
- `screens.test.ts` vérifie que le cœur fonctionne avec tous les interrupteurs à `false`.

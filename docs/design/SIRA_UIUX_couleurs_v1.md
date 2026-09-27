# SIRA — Système de couleurs v1 (pôle UI/UX)

> Périmètre : couche couleur appliquée aux 17 maquettes monochromes existantes. La structure, la typo, les formes et les ombres des maquettes ne sont pas remises en cause ici. Document propre au pôle UI/UX, à ne pas fusionner avec les specs des autres pôles.
> Statut : proposition à valider (checkpoint sur 3 écrans : Hub, Question Carré, Bravo) avant application aux 17.

---

## 1. Décision de fond : logo vs charte FASO ESPORT

Le logo de la com n'utilise pas les couleurs FASO ESPORT : rouge `#FF3131` (vs `#CE1126`), vert `#00BE62` (vs `#00853F`), jaune `#FFD21F` (≈ `#FCD116`), plus un gris `#B4B4B4`.

**Proposition : on ne choisit pas, on superpose.** Les teintes du logo deviennent les **tons vifs** (illustration, grandes surfaces, décor), les teintes FASO ESPORT deviennent les **tons foncés** de la même rampe (surfaces qui portent du texte blanc). Justification :

- Le vert logo `#00BE62` avec texte blanc = **2,46:1**, illisible. Le vert FASO `#00853F` = **4,74:1**, conforme AA. Il faut de toute façon un vert plus foncé pour les boutons : autant que ce soit celui de la charte.
- Même logique pour le rouge : `#FF3131` + blanc = 3,66:1 (grands textes uniquement), `#CE1126` + blanc = 5,63:1.
- Résultat : SIRA garde l'éclat du logo, et la filiation FASO ESPORT est structurelle, pas juste une signature en pied de page.

À faire valider par la com.

---

## 2. Principe : une couleur = une signification

Les maquettes ont été faites en monochrome, ce qui est la bonne méthode : la hiérarchie tient déjà sans couleur. La couleur arrive donc comme une couche de **sens**, pas de décoration. Quatre familles, quatre rôles, jamais mélangés :

| Famille | Signification unique | Exemples |
|---|---|---|
| **Vert** | Avancer / réussir | Bouton principal, bonne réponse, région débloquée, progression |
| **Jaune** | Récompense / économie | Cauris, coûts d'indice, bonus, record perso, titre |
| **Rouge** | Identité SIRA + pression du temps | Logo, splash, chrono qui s'épuise, réponse fausse (bref) |
| **Neutres chauds** | Structure + verrouillé | Surfaces, texte, contours, tout ce qui est verrouillé |

Répartition visée par écran (60-30-10) : ~60 % neutres clairs, ~30 % encre (texte, contours, tuiles), ~10 % couleur. Si un écran dépasse, c'est qu'une couleur est utilisée hors de son rôle.

**Pourquoi le bouton principal est vert et pas rouge :** dans un quiz, le rouge est lu comme « faux ». Un « JOUER » rouge et un « mauvaise réponse » rouge se contrediraient (loi de similarité). Le vert = « vas-y » ET « c'est juste », ce qui est cohérent : les deux veulent dire « avance ».

**Pourquoi l'échec n'est pas rouge :** vos écrans le disent déjà (« Aucun Cauri perdu — on apprend ! »). Un grand écran rouge punirait. L'écran « Presque ! » reste neutre et met la **bonne réponse en vert** : on apprend, on n'est pas sanctionné.

**Le gris du logo trouve son rôle :** il devient la couleur du verrouillé. Cohérent avec les maquettes, qui utilisent déjà le gris pour ça.

---

## 3. Primitives (valeurs brutes)

Les neutres reçoivent une pointe de chaleur (brun latérite) pour ne pas faire « dashboard » froid et s'accorder avec les tons terre des masques.

| Token | Hex | Origine / usage |
|---|---|---|
| `red-50` | `#FFF0F0` | Fond d'état « faux » |
| `red-500` | `#FF3131` | **Logo**. Grandes surfaces, grands textes ≥ 24px uniquement |
| `red-700` | `#CE1126` | **FASO ESPORT**. Chrono critique, remplissage avec texte blanc |
| `red-800` | `#A30D1E` | Texte rouge sur fond clair |
| `green-50` | `#E8F7EF` | Fond d'état « juste » |
| `green-500` | `#00BE62` | **Logo**. Illustration, anneaux, barres de progression (sans texte dessus) |
| `green-700` | `#00853F` | **FASO ESPORT**. Bouton principal, bonne réponse (texte blanc) |
| `green-800` | `#006B33` | Texte vert sur fond clair ; état pressé du bouton |
| `yellow-50` | `#FFF8DB` | Fond de puce Cauris discrète |
| `yellow-500` | `#FFD21F` | **Logo**. Puce Cauris, badges récompense (texte encre uniquement) |
| `yellow-800` | `#8C6A00` | Texte « récompense » sur fond clair |
| `neutral-0` | `#FFFFFF` | Cartes, tuiles, modales |
| `neutral-50` | `#F4F2EF` | Fond de page |
| `neutral-100` | `#E9E5E0` | Carte verrouillée, emplacements vides |
| `neutral-200` | `#D6D0C9` | Bordures douces, séparateurs |
| `neutral-300` | `#B4ADA6` | Icônes et décor verrouillés (reprise chaude du gris logo) |
| `neutral-600` | `#6B625B` | Texte secondaire (minimum pour tout texte informatif) |
| `neutral-900` | `#1C1714` | Encre : texte principal, contours, tuiles de lettres |

`neutral-500` (`#8A817A`, 3,42:1) est volontairement **absent** : trop faible pour du texte, trop proche des autres pour du décor. Le gris clair des maquettes actuelles (« Rappel · 20 s », « Chargement… ») est sous le seuil AA et passe en `neutral-600`.

---

## 4. Tokens sémantiques

| Rôle | Token sémantique | → Primitive |
|---|---|---|
| Fond de page | `surface-page` | `neutral-50` |
| Carte / modale / tuile | `surface-card` | `neutral-0` |
| Surface verrouillée | `surface-locked` | `neutral-100` |
| Voile derrière modale | `surface-scrim` | `neutral-900` à 60 % |
| Texte principal | `text-high` | `neutral-900` |
| Texte secondaire | `text-medium` | `neutral-600` |
| Texte sur couleur foncée | `text-on-color` | `neutral-0` |
| Contour des éléments interactifs | `border-strong` | `neutral-900` |
| Contour doux | `border-soft` | `neutral-200` |
| Action principale | `action-primary` | `green-700` (pressé : `green-800`) |
| Action secondaire | `action-secondary` | `neutral-0` + contour `neutral-900` |
| Juste / débloqué | `state-success` | `green-700` (fond `green-50`, texte `green-800`) |
| Faux | `state-error` | `red-700` (fond `red-50`, texte `red-800`) |
| Verrouillé | `state-locked` | `neutral-300` (icône), `neutral-600` (texte), `neutral-100` (fond) |
| Progression | `progress-fill` | `green-500` sur piste `neutral-100` |
| Récompense / Cauris | `reward` | `yellow-500` (texte `neutral-900`) |
| Pression temps | `urgency` | `red-700` |
| Identité | `brand` | `red-500` |
| Focus clavier | `focus-ring` | `neutral-900` 2px + décalage 2px |

Règle : les composants ne référencent **jamais** un hex, uniquement ces rôles. Changer le vert du bouton = un seul endroit.

---

## 5. Tokens composants

**Bouton principal** (JOUER, CONTINUER, VALIDER, ÉNIGME SUIVANTE, RÉGION SUIVANTE, REJOUER) : fond `action-primary`, libellé `text-on-color` (4,74:1), bord inférieur « épaisseur 3D » en `green-800`. Pressé : fond `green-800`, s'enfonce. Désactivé (VALIDER sans lettres) : fond `neutral-100`, libellé `neutral-600`, pas d'épaisseur.

**Bouton secondaire** (RETOUR À LA CARTE, RETOUR AU HUB, FERMER) : inchangé par rapport aux maquettes : blanc, contour encre, texte encre.

**Puce Cauris** (compteur en haut, « +20 Cauris », coûts d'indice) : fond `yellow-500`, icône cauri + texte `neutral-900` (12,26:1). Remplace les puces noires actuelles : le joueur doit reconnaître la monnaie d'un coup d'œil sur tous les écrans.

**Option de réponse (Duo / Carré)**

| État | Fond | Contour | Texte | Signal non couleur |
|---|---|---|---|---|
| Repos | `neutral-0` | `neutral-900` | `neutral-900` | — |
| Pressée | `neutral-100` | `neutral-900` | `neutral-900` | s'enfonce |
| Juste | `green-700` | `green-800` | blanc | icône coche |
| Fausse (choisie) | `red-50` | `red-700` | `red-800` | icône croix + secousse |
| Éliminée (indice) | `neutral-100` | aucun | `neutral-600` barré | non cliquable |

La bonne option passe en vert même quand le joueur s'est trompé : il voit la réponse avant la modale.

**Tuiles de lettres (Directe)** : banque = fond `neutral-900`, lettre blanche. Placée dans un emplacement = fond `neutral-0`, contour encre. Emplacement vide = pointillés `neutral-300`. Validation juste : emplacements en `green-700`. Validation fausse : contour `red-700` + secousse, puis retour à l'état normal.

**Chrono** (Champion, Maître) : anneau `neutral-900` qui se vide. À ≤ 5 s : anneau et chiffre passent en `red-700` + pulsation légère (désactivée si mouvement réduit). Le chiffre reste affiché : la couleur n'est jamais le seul signal.

**Carte de mode (hub)** : débloquée = `surface-card` + contour encre ; verrouillée = `surface-locked`, titre et condition en `neutral-600` (lisibles, 4,75:1), cadenas `neutral-300`.

**Nœud de carte (Tour du Faso)** : terminé = disque `green-700` + coche blanche ; en cours = disque blanc, contour encre, anneau de progression `green-500` ; verrouillé = disque `neutral-100` + cadenas `neutral-300`. Tracé parcouru en `green-500`, tracé à venir en `neutral-200`.

---

## 6. Application écran par écran

| # | Écran | Couleur appliquée |
|---|---|---|
| 1 | Splash | Seul écran avec le logo complet (triade). Barre de chargement `progress-fill`. Texte « Chargement… » en `text-medium` |
| 2 | Hub | Puce Cauris jaune. Barre « Griot du Faso » en vert. Carte Classique blanche + JOUER vert. Autres cartes verrouillées |
| 3 | Tour du Faso | Nœuds et tracé selon §5. CONTINUER vert. Légende alignée sur les mêmes couleurs |
| 4 | Question Carré | Puce « CARRÉ · +20 » : icône cauri jaune. Options selon §5. Bouton Indice : contour encre + puce coût jaune. « Abandonner » en `text-medium` |
| 5 | Question Directe | Tuiles selon §5. VALIDER vert (désactivé tant que la réponse est incomplète) |
| 6 | Champion | Chrono selon §5. « Série ×4 » neutre (c'est du score, pas des Cauris) |
| 7 | Maître – choix | Option sélectionnée : contour encre épais (la sélection n'est pas une validation, donc pas verte). Pourcentages neutres |
| 8 | Bravo | Disque coche `green-700`, rayons `yellow-500`. Puce « +20 Cauris » jaune. Carte « Le savais-tu ? » : voir §8 (signature) |
| 9 | Presque | Disque « ! » encre (pas de rouge). Bonne réponse « TÔ » en `green-800` sur fond `green-50` |
| 10 | Temps écoulé | Chrono « 0 » en `red-700` (c'est le temps, pas le joueur). Réponse en `green-800` / `green-50` |
| 11 | Région terminée | Coche verte, puce bonus jaune, barre de progression verte |
| 12 | Run terminé | Score encre. « Nouveau record perso » jaune (récompense). REJOUER vert |
| 13 | Pas assez de Cauris | Icône cauri jaune (remplace le « C »). Chiffres « 15 » et « 8 » en gras encre |
| 14 | Champion verrouillé | Cadenas `neutral-300`, barre 62/100 verte, JOUER EN CLASSIQUE vert |
| 15 | Indice | Puces coût jaunes. Option trop chère : puce `neutral-100` + texte `neutral-600` + mention « il te manque X » |
| 16 | Bibliothèque | Carte titre : trophée `yellow-500`. Anecdotes débloquées neutres, verrouillées selon §5 |
| 17 | Puzzle (Phase 3) | Emplacements pointillés `neutral-300`, pièces blanches. Pas de couleur propre : l'image reconstituée apporte la couleur |

Modales (8 à 15) : voile `surface-scrim` à la place du gris uni actuel, pour que le fond de jeu reste perceptible derrière.

---

## 7. Accessibilité (WCAG 2.1 AA)

| Paire | Ratio | Usage | Verdict |
|---|---|---|---|
| Blanc sur `green-700` | 4,74 | Boutons principaux | AA |
| Blanc sur `green-800` | 6,66 | Bouton pressé | AA |
| `green-800` sur `green-50` | 6,02 | Réponse correcte | AA |
| `neutral-900` sur `yellow-500` | 12,26 | Puces Cauris | AAA |
| `red-800` sur `red-50` | 7,20 | Option fausse | AAA |
| Blanc sur `red-700` | 5,63 | Remplissage rouge | AA |
| Blanc sur `red-500` | 3,66 | Logo uniquement, texte ≥ 24px | AA grand texte seulement |
| `neutral-600` sur `neutral-50` | 5,33 | Texte secondaire | AA |
| `neutral-600` sur `neutral-100` | 4,75 | Texte des cartes verrouillées | AA |
| `neutral-900` sur `neutral-50` | 15,90 | Texte principal | AAA |
| Blanc sur `green-500` | 2,46 | — | **Interdit** : pas de texte sur le vert logo |
| Blanc sur `yellow-500` | 1,45 | — | **Interdit** : jamais de texte blanc sur jaune |

Chaque état coloré a un second signal (coche, croix, cadenas, chiffre, secousse) : le joueur daltonien rouge/vert ne perd aucune information.

---

## 8. Points ouverts à trancher

1. **Leurres visibles dans la maquette 5.** Les tuiles leurres sont grisées : c'est une annotation de maquette, mais à ne surtout pas coder tel quel, sinon le jeu devient trivial. Côté joueur, toutes les tuiles de la banque sont identiques. Une tuile ne devient grise que si l'indice « Retirer un leurre » la désactive.
2. **Tuiles Mooré.** Même style que les autres tuiles, mélangées à la banque, pas une ligne à part (sinon elles révèlent que la réponse est en mooré).
3. **Élément signature (proposition).** Une fine bande tissée inspirée du **Faso Dan Fani** (textile national, spécifiquement burkinabè) en tête des cartes « Le savais-tu ? » et de la Bibliothèque, en rouge / jaune / vert logo. C'est le cœur culturel du jeu : c'est là que la couleur se permet d'être riche, et nulle part ailleurs. Motif à faire sourcer par la com.
4. **Validation com** : superposition logo (vif) / FASO ESPORT (foncé), et confirmation Burkina de la kora et de l'édifice du logo (signalé précédemment).
5. **Mode sombre** : hors Phase 1. Les alias sémantiques permettent de l'ajouter plus tard sans toucher aux composants.

---

## 9. Journal d'autocritique

- **Défaut générique écarté** : « drapeau partout », c'est-à-dire les trois couleurs réparties au hasard sur les écrans. Remplacé par une couleur = un rôle, et la triade complète réservée au logo et à la signature.
- **Défaut générique écarté** : rouge pour le bouton principal parce que c'est la couleur du logo. Écarté pour le conflit sémantique avec « faux ».
- **Élément retiré** : couleur par mode de jeu (Classique vert, Champion rouge…). Écartée : trop de teintes concurrentes, le hub redeviendrait un tableau de bord.
- **Test du plissement d'yeux** : sur le hub, on ne voit ressortir que JOUER (vert) et le compteur Cauris (jaune). C'est l'intention.
- **Contrastes** : toutes les paires texte vérifiées ≥ 4,5:1, sauf le logo (grand texte, 3,66:1, acceptable).

> Écrit avant le nom et la charte : les maquettes et couleurs-v1 priment.

# SIRA

**Game Design Document (GDD)**

*Version 3.0 — mise à jour complète*

Jeu éducatif et culturel sur le Burkina Faso

Structure porteuse : FASO ESPORT

*Document de travail interne — Juin 2026*

***Générer avec IA hein***

## Journal des modifications (v2.0 → v3.0)

Cette version intègre les décisions de conception arrêtées après discussion d’équipe. Les points ci-dessous sont les changements de fond par rapport à la v2.0.

| **Élément** | **Avant (v2.0)** | **Maintenant (v3.0)** |
|---|---|---|
| Cœur du jeu | Ambigu : questions écrites OU images | **Tranché : énigme à 4 images, jamais de question écrite de quiz** |
| Les 3 formats | Présentés comme 3 types de questions | Reclarifiés : 3 façons de répondre (difficulté + récompense croissantes) |
| Saisie « Direct » | Clavier virtuel à coder | **Plateau de lettres (tuiles) avec leurres — plus de clavier custom** |
| Indices | « Révéler une lettre / 1re syllabe » | Remplacés par « Retirer un leurre » et « Placer une lettre » |
| Stockage | LocalStorage / IndexedDB | IndexedDB (LocalStorage écarté : trop limité) |
| Techno front | Vanilla ou Vue/React « léger » | **Décision ferme : Vue 3 + Vite + PWA** |
| Rejouabilité | Non traitée | Nouvelle section dédiée (options + recommandation) |
| 17 régions | Liste fournie | Vérifiée sur source officielle (Conseil des ministres, 02/07/2025) |

## 1. Informations générales

| **Champ** | **Détail** |
|---|---|
| Nom du projet | **SIRA** |
| Structure porteuse | FASO ESPORT |
| Genre | Puzzle visuel / Jeu éducatif, culturel et inclusif |
| Modèle économique | 100 % gratuit, sans publicité intrusive |
| Cible principale | Jeunes Burkinabè (12–35 ans), scolaires, étudiants, diaspora |
| Plateforme | PWA (Progressive Web App) — jouable au navigateur, sans téléchargement |
| Technologie | Vue 3 + Vite (voir section 13) |
| Langues | Français (interface et défaut) + prise en charge du Mooré pour certaines réponses |
| Statut | MVP — Version 1.0 en préparation |

## 2. Vision & objectifs

**Vision.** Combler le manque de contenus numériques locaux en transformant le smartphone en outil de fierté nationale et d’apprentissage. SIRA fait découvrir le patrimoine du Burkina Faso par le jeu, sans barrière financière ni technique.

**Objectifs :**

- Offrir un divertissement intelligent et accessible à tous, gratuit.
- Faire (re)découvrir le patrimoine culturel, historique, géographique et linguistique du pays.
- Intégrer la réforme territoriale (passage de 13 à 17 régions) et faire apprendre les nouveaux noms endogènes.
- Favoriser l’inclusion linguistique grâce à un plateau de lettres adapté aux langues nationales.
- Créer un outil viral via WhatsApp pour toucher un maximum de jeunes, diaspora comprise.

## 3. La boucle de gameplay

Un cycle court et addictif, répété à chaque énigme :

| **Étape** | **Action du joueur** |
|---|---|
| 1. Observer | 4 images liées par un point commun (une région, un plat, un symbole, un personnage…). |
| 2. Analyser | Le joueur cherche le mot ou le concept caché. |
| 3. Répondre | Selon le format, il choisit une proposition ou compose le mot avec le plateau de lettres. |
| 4. Valider | La réponse est vérifiée instantanément. |
| 5. Progresser | En cas de succès : gain de Cauris, déblocage d’une anecdote culturelle, avancée dans le chapitre régional. |

## 4. Le cœur du jeu : l’énigme à 4 images

**Principe fondateur.** Le joueur voit toujours 4 images. Il n’y a pas de question écrite de quiz. Ce sont les images qui posent l’énigme ; un court texte d’accompagnement constant (ex. « Quel mot relie ces 4 images ? ») cadre l’écran sans donner la réponse.

**Deux logiques d’énigme, en difficulté croissante :**

> **Logique A — Reconnaissance (début de région, facile)**  
> **Les 4 images SONT la réponse, montrée 4 fois.**  
> Exemple : 4 photos de tô → réponse « TÔ ». 4 masques différents → « MASQUE ».  
> On entre dans le thème, on gagne en confiance.

> **Logique B — Déduction (fin de région, difficile)**  
> **Les 4 images sont des INDICES qui pointent vers un concept caché ; la réponse n’est sur aucune image.**  
> Exemple : Dédougou + un masque + une carte de l’Ouest + un fleuve → réponse « BANKUI ».  
> On teste la vraie connaissance culturelle.

**Progression retenue :** mélange progressif à l’intérieur de chaque région. Les premières énigmes en logique A, puis montée vers la logique B pour les énigmes les mieux récompensées. Ce gradient interne étale aussi l’effort de production du contenu (toutes les énigmes ne demandent pas le même travail).

## 5. Les 3 formats de réponse (façons de répondre)

Pour une même énigme à 4 images, la manière de répondre fait varier la difficulté et la récompense. Ce ne sont pas trois jeux différents : c’est un seul jeu, trois niveaux d’exigence.

| **Format** | **Comment on répond** | **Cauris** | **Quand l’utiliser** |
|---|---|---|---|
| Le Carré | Choisir 1 proposition parmi 4 | **10** | Facile / découverte |
| Le 50/50 | Choisir 1 proposition parmi 2 (ou Vrai/Faux) | **20** | Intermédiaire |
| Le Direct | Composer le mot avec le plateau de lettres | **50** | Difficile / puriste |

**À valider par le pôle Game Design :** pour le Carré et le 50/50, les propositions s’affichent-elles en texte ou en vignettes d’images ? (Voir section 16).

## 6. Le plateau de lettres (remplace le clavier)

**Décision.** Le format Direct n’utilise pas un clavier virtuel, mais un plateau de lettres : des tuiles affichées à l’écran que le joueur assemble pour former le mot, à la manière du jeu « 4 images 1 mot ».

**Pourquoi ce choix :**

- **Mooré simplifié.** Les caractères spéciaux (Ɛ, Ɔ, Ŋ, Ñ) deviennent de simples tuiles ; plus de clavier spécial à développer ni à maintenir.
- **Validation fiable.** On contrôle exactement les lettres disponibles : fini l’enfer de l’orthographe où un joueur qui savait la réponse est marqué faux pour un accent mal placé. Crucial pour un jeu éducatif.
- **Accessibilité.** Plus simple et plus ludique que taper au clavier, pour tous les âges et tous les niveaux.

**Difficulté réglable par les leurres.** Le plateau contient les bonnes lettres plus des lettres-leurres. Peu de leurres = facile ; beaucoup de leurres mélangés = difficile. Le gradient de difficulté est ainsi intégré au format Direct.

> **Conséquence sur les indices**  
> **Les anciens indices « Révéler une lettre » et « Montrer la première syllabe » n’ont plus de sens** (les lettres sont déjà visibles). Ils sont remplacés (voir section 9.2).

## 7. Structure du jeu : « Le Tour du Faso » Ahh ce sont des propositions hein (mencon de griot numérique)

Le mode principal est organisé autour des 17 régions administratives (réforme de juillet 2025). Chaque région est un chapitre.

- Le joueur répond correctement à 5 énigmes pour valider une région et débloquer la suivante.
- Les énigmes portent sur l’histoire, la géographie, la gastronomie, les ethnies, les langues, les sites, les personnalités locales.
- Une fois les 17 régions complétées, le joueur devient **« Griot Numérique du Faso »** (titre honorifique).

**Les 17 régions et leurs chefs-lieux** *(liste officielle vérifiée — voir annexe 1) :*

| **Région (nom endogène)** | **Chef-lieu** | **Région (nom endogène)** | **Chef-lieu** |
|---|---|---|---|
| Bankui | Dédougou | Nazinon | Manga |
| Djôrô | Gaoua | Oubri | Ziniaré |
| Goulmou | Fada N’Gourma | Sirba | Bogandé |
| Guiriko | Bobo-Dioulasso | Soum | Djibo |
| Kadiogo | Ouagadougou | Sourou | Tougan |
| Kuilsé | Kaya | Tannounyan | Banfora |
| Liptako | Dori | Tapoa | Diapaga |
| Nakambé | Tenkodogo | Yaadga | Ouahigouya |
| Nando | Koudougou |  |  |

## 8. Modes social (sans connexion)

| **Mode** | **Description** |
|---|---|
| Duel WhatsApp | Le joueur génère un Code Défi qu’il envoie à un ami via WhatsApp. L’ami saisit le code et répond aux mêmes énigmes. Le meilleur score gagne. |
| Duel Local (même écran) | Deux joueurs se passent le téléphone et répondent tour à tour aux mêmes énigmes. Les scores sont comparés à la fin. |

> **Multijoueur en ligne — reporté à la V2**  
> Le multijoueur tour-par-tour à distance (salles, score temps réel) nécessite un serveur. Il est **prévu après validation du MVP**, pas dans la V1.

## 9. Économie : Cauris, indices, anecdotes

### 9.1 Les Cauris (monnaie du jeu)

Les Cauris servent à acheter des indices et à débloquer des anecdotes culturelles bonus (et, en V2, des éléments cosmétiques).

**Gains :**

- Réponse correcte → 10, 20 ou 50 Cauris selon le format.
- Série de 5 bonnes réponses → bonus de 20 Cauris.
- Région terminée (5 énigmes) → bonus de 50 Cauris.

**Pertes :**

- Achat d’indice (voir 9.2).
- **Réponse incorrecte : aucune perte.** On ne pénalise pas l’apprentissage.

### 9.2 Les indices (révisés)

| **Indice** | **Effet** | **Format** | **Coût** |
|---|---|---|---|
| Éliminer 2 mauvaises réponses | Supprime 2 propositions incorrectes | Carré | **15** |
| Retirer un leurre | Enlève une lettre-leurre du plateau | Direct | **10** |
| Placer une lettre à sa bonne position | Positionne correctement une lettre du mot | Direct | **15** |

### 9.3 Les anecdotes culturelles

Chaque énigme réussie débloque une anecdote (texte court, image ou audio), stockée dans une bibliothèque consultable à tout moment. Exemple : « Dédougou (région de Bankui) accueille le FESTIMA, festival international des masques. » Atout pour le contenu : chaque toponyme a une signification (ex. Bankui = « ban » forêts + « kui » village/localité), matière idéale pour les anecdotes.

## 10. Rejouabilité & rétention (Fait pas attention c’est un MVP donc on dose pour l’instant. Apres on pourra augmenter les niveaus et tout)

**Le point à ne pas négliger.** 85 énigmes factuelles (5 × 17), c’est environ une demi-heure de jeu, et une fois les réponses connues il n’y a plus de raison de revenir. Or l’objectif du projet est la viralité et le partage. Il faut donc un mécanisme de retour. Options proposées, à arbitrer par le pôle Game Design :

| **Option** | **Principe** | **Effort** | **Effet rétention** |
|---|---|---|---|
| Défi quotidien | Une énigme nouvelle ou tirée au sort chaque jour, avec série (« streak ») | Faible | **Élevé** |
| Banque élargie | Plus de 5 énigmes par région ; on en pioche 5 au hasard à chaque passage | Moyen | Moyen |
| Contenu évolutif | Ajout régulier de nouvelles régions/thèmes après le lancement | Continu | Moyen |
| Classement amis | Comparaison de scores via les duels WhatsApp | Faible | Moyen |

**Recommandation :** retenir au minimum le Défi quotidien + une banque d’énigmes un peu plus large que 5 par région. C’est le meilleur rapport effort / rétention pour un MVP.

## 11. Interface utilisateur (écrans clés)

### 11.1 Écran d’accueil

- Logo « SIRA », typographie stylisée, couleurs du drapeau (vert, jaune, rouge).
- Boutons : « Le Tour du Faso », « Défis », « Bibliothèque », « Paramètres ».
- Compteur de Cauris en haut à droite (ex. 🐚 245).

### 11.2 Écran carte des régions

- Carte interactive du Burkina, 17 régions ; verrouillées en gris, débloquées en couleur, région en cours en surbrillance.
- Nom endogène en grand (+ ancien nom en petit si utile) ; indicateur de progression « 3/5 ».

### 11.3 Écran d’énigme (4 images)

- Les 4 images au centre + court texte de cadrage constant.
- **Carré :** 4 boutons de réponse. **50/50 :** 2 boutons. **Direct :** plateau de lettres (tuiles + leurres) et zone de composition.
- Compteur de Cauris ; bouton « Indice » ; bouton « Abandonner » (retour carte).

### 11.4 Écran de résultat

- Animation positive/neutre ; Cauris gagnés ; anecdote débloquée ; boutons « Énigme suivante » et « Retour à la carte ».

## 12. Langues : français par défaut, Mooré comme épice

Le jeu n’est pas « en Mooré ». Le français est la langue par défaut : interface, consignes, anecdotes et la grande majorité des réponses. Le Mooré n’apparaît que lorsque la réponse est un mot propre au Mooré.

- **Réponse en français / nom propre** (ex. TÔ, MASQUE, BANKUI) → plateau de lettres latines normales.
- **Réponse en Mooré** (ex. bɔɔrɔ, pɛɛm) → le plateau sort les tuiles Ɛ, Ɔ, Ŋ, Ñ. Le joueur ne configure rien : le jeu adapte selon le mot.

**Dosage.** Le Mooré reste minoritaire (il exige une maîtrise réelle de l’orthographe pour ne pas introduire d’erreurs). Réservé aux moments où il apporte une vraie valeur culturelle. Un joueur 100 % francophone peut finir le jeu — les énigmes Mooré sont alors des occasions d’apprendre un mot. Les autres langues nationales (Dioula, Fulfuldé…) sont réservées à plus tard ; le MVP reste Mooré uniquement.

## 13. Technologie & déploiement

**Plateforme : PWA confirmée.** Coût nul, multiplateforme (Android, iOS, PC), installable depuis un lien WhatsApp, fonctionne hors-ligne, pas de store ni de licence Apple. Choix idéal pour la cible.

**Stack recommandée :**

| **Composant** | **Choix** | **Pourquoi** |
|---|---|---|
| Framework front | **Vue 3 + Vite** | Courbe d’apprentissage douce, doc en français, runtime léger (téléphones modestes), build minuscule. Juste milieu entre le vanilla (ingérable à plusieurs) et Next.js (surdimensionné pour un jeu hors-ligne). |
| PWA / hors-ligne | vite-plugin-pwa | Service worker, installation et cache quasi sans configuration. |
| Stockage | **IndexedDB** | Asynchrone, grande capacité, stocke aussi les images. LocalStorage écarté (synchrone, ~5 Mo, texte seul). Wrapper simple : idb-keyval ou Dexie. |
| Images | WebP/AVIF + précache | Les images sont le vrai goulot sur connexion lente : compression agressive et précache par région pour rester jouable hors-ligne. |
| Hébergement | Netlify / Vercel / GitHub Pages | Gratuit, déploiement par simple lien partageable. |
| Backend (V2 only) | Supabase | Pour le multijoueur en ligne : Postgres + temps réel + auth, offre gratuite généreuse. Hors MVP. |

> **Note d’architecture**  
> Au MVP, le jeu tourne entièrement côté client (hors-ligne, IndexedDB). Il n’y a **pas de serveur à développer** avant la V2. Les rôles Architecte / Back-end / DevOps restent donc volontairement légers à ce stade.

## 14. Organisation des équipes & rôles

Chaque pôle a un responsable, des missions claires et des livrables. Les fiches de poste détaillées (une par pôle) sont fournies séparément.

| **Pôle** | **Responsable** | **Missions principales** |
|---|---|---|
| Game Design | SAMORY | Règles, gameplay, progression, récompenses, formats, gradient A→B, rejouabilité. |
| Développement | FATAO | PWA Vue 3, prototype, système de réponse, score, Cauris, plateau de lettres. |
| Design & Graphisme | BERENICE | Logo, charte, interfaces, carte des 17 régions, images des énigmes, ambiance sonore. |
| Contenu & Culture | LESLI | Rechercher/vérifier le contenu, rédiger énigmes, réponses, indices et anecdotes (≈ 5 par région). |
| Communication | DIEUDONNE | Réseaux, affiches, teasers, communauté, partenaires. |
| Test & Qualité | LEILA | Tester gameplay, fluidité, difficulté, intérêt ; détecter les bugs ; rapports. |
| Coordination | ____________ | Superviser, réunions, calendrier, interfaces entre pôles. |

## 15. Planning MVP (8 semaines)

| **Phase** | **Tâches** | **Pôles** | **Échéance** |
|---|---|---|---|
| Pré-production | Finaliser le GDD, maquettes UI, valider les premières énigmes | Game Design + Contenu | Sem. 1–2 |
| Production | Développer la PWA, créer les interfaces, intégrer énigmes et carte | Développement + Design | Sem. 3–6 |
| Tests | Tester, corriger les bugs, ajuster la difficulté | Test & Qualité | Sem. 7 |
| Lancement | Déployer la PWA, communiquer, partager le lien WhatsApp | Communication + Coordination | Sem. 8 |

**Livrables MVP :**

- Prototype PWA jouable (Vue 3).
- Banque d’énigmes rédigées et vérifiées (≥ 5 par région).
- Interface complète (accueil, carte, écran d’énigme, résultat).
- Système de Cauris et d’indices fonctionnel.
- Plateau de lettres avec support Mooré.
- Documentation technique et utilisateur.

## 16. Points de design à finaliser (pôle Game Design) ’Es ceque cette partie sert meme ?? bref c’est IA’

Le GDD est solide, mais ces décisions restent ouvertes et doivent être tranchées tôt car elles impactent le contenu et le développement :

1. **Rejouabilité :** retenir le Défi quotidien et/ou une banque élargie (section 10) ?
1. **Affichage des réponses Carré / 50-50 :** propositions en texte ou en vignettes d’images ?
1. **Dosage A → B :** combien d’énigmes « reconnaissance » vs « déduction » par région ?
1. **Énigmes Mooré :** prévenir le joueur (badge « réponse en mooré ») ou le laisser découvrir ?
1. **Banque d’énigmes :** viser plus de 5 par région dès le MVP pour soutenir la rejouabilité ?

## Annexe 1 — Les 17 régions (source officielle) bref prenez ça comme ça seulement

**Source :** Conseil des ministres du Burkina Faso, 2 juillet 2025 (décrets de réorganisation territoriale et de changement de toponymes). Liste vérifiée pour ce document.

| **N°** | **Nom endogène** | **Chef-lieu** |
|---|---|---|
| 1 | Bankui | Dédougou |
| 2 | Djôrô | Gaoua |
| 3 | Goulmou | Fada N’Gourma |
| 4 | Guiriko | Bobo-Dioulasso |
| 5 | Kadiogo | Ouagadougou |
| 6 | Kuilsé | Kaya |
| 7 | Liptako | Dori |
| 8 | Nakambé | Tenkodogo |
| 9 | Nando | Koudougou |
| 10 | Nazinon | Manga |
| 11 | Oubri | Ziniaré |
| 12 | Sirba | Bogandé |
| 13 | Soum | Djibo |
| 14 | Sourou | Tougan |
| 15 | Tannounyan | Banfora |
| 16 | Tapoa | Diapaga |
| 17 | Yaadga | Ouahigouya |

*Note : quatre régions sont nouvelles (Soum, Sirba, Tapoa, Sourou). Certains noms remplacent d’anciennes appellations — ex. Bankui ← Boucle du Mouhoun, Kadiogo ← Centre, Nazinon ← Centre-Sud, Guiriko ← Hauts-Bassins.*

## Annexe 2 — Charte graphique (repères) bref l’équipe design s’occupe de ça donc….

- **Couleurs :** Vert #00853F · Jaune #FCD116 · Rouge #CE1126 (drapeau du Burkina).
- **Typographie :** moderne, lisible, afro-inspirée (ex. Montserrat).
- **Icônes :** symboles locaux (masques, cauris, carte du Burkina).

*— Fin du document —*

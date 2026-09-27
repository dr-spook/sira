# Rapport sur le contenu : version 1

Pour : Leslie (pôle Contenu & Culture)
État analysé : le dossier `content-source/` de septembre 2026.

Ce document liste ce qu'il faut compléter ou vérifier dans le contenu du jeu. Aucune anecdote n'a été modifiée : les corrections sont à faire par le pôle Contenu.

---

## 1. Les chiffres

| | Aujourd'hui | Objectif (GDD) |
|---|---|---|
| Régions avec du contenu | 17 sur 17 | 17 |
| Énigmes (dossiers réponse) | **41** | 85 (5 par région) |
| Réponses différentes | **18** | — |
| Régions qui ont 5 énigmes | **aucune** | toutes |

Il manque donc **44 énigmes** pour atteindre 5 par région :

| Région | Énigmes | Il manque |
|---|---|---|
| Bankui | 4 | 1 |
| Djôrô | 3 | 2 |
| Guiriko | 3 | 2 |
| Kuilsé | 3 | 2 |
| Nakambé | 3 | 2 |
| Sirba | 3 | 2 |
| Soum | 3 | 2 |
| Goulmou | 2 | 3 |
| Kadiogo | 2 | 3 |
| Liptako | 2 | 3 |
| Nando | 2 | 3 |
| Nazinon | 2 | 3 |
| Sourou | 2 | 3 |
| Tannounyan | 2 | 3 |
| Tapoa | 2 | 3 |
| Yaadga | 2 | 3 |
| **Oubri** | **1** | **4** |

Toutes les réponses actuelles sont des noms de peuples. Le GDD prévoit aussi des énigmes sur l'histoire, la géographie, la gastronomie, les sites et les personnalités : c'est une piste pour les énigmes manquantes.

---

## 2. Les doublons

La même réponse, avec les **mêmes 4 images** et la **même anecdote**, est copiée dans plusieurs régions :

| Réponse | Nombre de régions | Régions |
|---|---|---|
| Mossi | 9 | Bankui, Kadiogo, Kuilsé, Nakambé, Nando, Nazinon, Oubri, Sirba, Yaadga |
| Peul | 8 | Bankui, Goulmou, Kadiogo, Kuilsé, Liptako, Sirba, Soum, Tapoa |
| Gourmantché | 3 | Goulmou, Sirba, Tapoa |
| Gourounsi | 3 | Nakambé, Nando, Nazinon |
| Bwaba | 2 | Bankui, Guiriko |
| Marka | 2 | Bankui, Sourou |
| Fulsé | 2 | Kuilsé, Yaadga |
| Tuareg | 2 | Liptako, Soum |

Pour le joueur, cela veut dire qu'il répondra « Mossi » 9 fois devant les mêmes photos pendant le Tour du Faso.

**À faire :** pour chaque doublon, choisir entre :
- le garder dans une seule région (celle où il est le plus représentatif) et le remplacer ailleurs par une autre énigme ;
- ou le garder dans plusieurs régions, mais avec des images et une anecdote **propres à chaque région** (par exemple les Mossi de Kadiogo et le Moro Naba, les Mossi du Yaadga et le Yatenga Naba).

---

## 3. Les points à traiter

### 3.1 Titres des anecdotes

La Bibliothèque du jeu affiche un titre pour chaque anecdote (par exemple « FESTIMA de Dédougou »). Aujourd'hui, aucune anecdote n'a de titre : le jeu affiche alors simplement le nom de la réponse (« Lobi »).

**À faire :** ajouter un titre court dans le `meta.json` de chaque dossier, champ `"title"` (voir l'exemple au §4).

### 3.2 Anecdotes trop longues

La carte « Le savais-tu ? » est petite. Le conseil est de rester **sous 300 caractères** (espaces compris). 17 anecdotes sur 18 dépassent :

| Réponse | Caractères |
|---|---|
| Birifor | 583 |
| Bella | 521 |
| Sénoufo | 446 |
| Lobi | 436 |
| Fulsé | 431 |
| Samo | 423 |
| Gouin | 419 |
| Bwaba | 417 |
| Mossi | 413 |
| Toussian | 411 |
| Bobo | 403 |
| Tuareg | 392 |
| Peul | 379 |
| Dagara | 371 |
| Marka | 369 |
| Bissa | 366 |
| Gourmantché | 315 |

Seule l'anecdote Gourounsi (243) est dans la limite. Ce n'est pas bloquant : le jeu fonctionne, mais le texte risque de déborder de la carte.

**À faire :** raccourcir en gardant le fait le plus surprenant. Une idée : garder la version longue pour plus tard (Bibliothèque) et écrire une version courte pour la carte.

### 3.3 Cohérence entre la région et l'anecdote

- **Fulsé** : l'anecdote parle du Yatenga (Ouahigouya), donc de la région Yaadga. Elle est aussi rangée dans **Kuilsé** (Kaya), où elle ne correspond pas.
- **Mossi** : l'anecdote dit que Moro Naba Oubri était « le fils » de Yennenga. La tradition la plus courante fait d'Oubri le **petit-fils** de Yennenga (fils de Zoungrana). La formule « d'un chasseur éléphant » est aussi à revoir (« chasseur d'éléphants » ?). **À vérifier dans une source fiable.**
- **Fulsé** et **Mossi** utilisent encore l'ancien nom « Yatenga » : à garder si c'est voulu (nom historique du royaume), sinon à préciser.

**À faire :** vérifier chaque fait avec une source, et l'indiquer dans le champ `"source"` du `meta.json`.

### 3.4 Orthographe et typographie

- **Gourounsi** : « en realité » → « en réalité » ; « pour designer » → « pour désigner » ; « voisin(Babato) » : il manque un espace avant la parenthèse ; « leur vrai noms » → « leurs vrais noms ».
- **Bella** : « Chez les Bella les femmes » : il manque une virgule après « Bella » ; « en peau utilisé » → « en peau utilisées ».
- **Guillemets** : plusieurs anecdotes utilisent des guillemets droits `"…"` (Lobi, Tuareg, Samo, Sénoufo). En français, on écrit plutôt « … ».
- Plusieurs anecdotes commencent par « L'anecdote veut que… » ou « L'anecdote réside… » : la formule est répétitive dans la carte « Le savais-tu ? ».

### 3.5 Noms des réponses

Le nom du dossier **est** la réponse que le joueur doit composer, lettre par lettre. Il faut donc qu'il soit exactement celui qu'on veut apprendre.

- **Tuareg** : l'anecdote écrit « Touaregs ». En français, l'orthographe courante est « Touareg ». Choisir une seule forme.
- **Fulsé** : l'anecdote écrit « Fulsé/Kurumba ». Quel nom le joueur doit-il retenir ?
- **Gourounsi** : l'anecdote explique que ce nom a été donné par un chef de guerre étranger, et que ces peuples réclament leurs vrais noms (Lyele, Nuni, Kasséna). Utiliser ce nom comme réponse du jeu est donc délicat. Faut-il le remplacer, par exemple par une énigme par peuple ?
- **Accents** : le joueur verra une tuile « É » distincte de « E ». « Gourmantché », « Fulsé » et « Sénoufo » doivent donc être écrits avec l'accent voulu, sans faute.

### 3.6 Droits des images

**Aucune image n'a de crédit aujourd'hui.** Tant que les droits ne sont pas vérifiés, les images ne sont pas publiées sur GitHub, et le jeu ne peut pas sortir.

Les noms de certains fichiers montrent qu'ils viennent de sources protégées :

| Origine probable | Où | Fichiers |
|---|---|---|
| **Getty Images** (payant, interdit sans licence) | Peul | `GettyImages-1231877039.jpg`, `_106170967_gettyimages-453374484.jpg.webp` |
| **Tropenmuseum** (souvent CC BY-SA : citer l'auteur et la licence) | Bella | `COLLECTIE_TROPENMUSEUM_Portret_van_een_Bella_man_met_amuletten_TMnr_20010119.jpg`, `COLLECTIE_TROPENMUSEUM_Portret_van_een_Bella_vrouw_met_diverse_haarsieraden_nabij_Gorom-Gorom_TMnr_20010122.jpg` |
| **Facebook** (photo de quelqu'un : demander l'autorisation) | Mossi, Gourmantché (2), Gourounsi (2), Bella | fichiers `FB_IMG_…` |
| **Bandcamp** (pochette d'album, probablement protégée) | Bwaba | `a3061792622_16.jpg` |
| **Inconnue** (nom générique, sans trace de l'origine) | presque tous les dossiers | `images.jpg`, `images1.jpg`… |

**À faire :** pour chaque image, retrouver l'auteur, la source et la licence, puis les écrire dans le champ `"credits"` du `meta.json`. Si une image ne peut pas être créditée ou autorisée, il faut la remplacer. Les photos prises par l'équipe elle-même sont les plus simples.

### 3.7 Images trop petites

Dans le jeu, chaque image est affichée en petit, mais sur des écrans à haute densité : en dessous de **400 pixels de large**, elle risque d'être floue. 17 images sont trop petites :

| Réponse | Fichier | Largeur |
|---|---|---|
| Gouin | `images.jpg` | 150 px |
| Gouin | `images2.jpg` | 222 px |
| Sénoufo | `images3.jpg` | 225 px |
| Bella | `COLLECTIE_TROPENMUSEUM_Portret_van_een_Bella_vrouw_met_diverse_haarsieraden_nabij_Gorom-Gorom_TMnr_20010122.jpg` | 250 px |
| Gouin | `images1.jpg` | 275 px |
| Gouin | `images3.jpg` | 276 px |
| Dagara | `funerailles-dagara-2.jpg` | 300 px |
| Birifor | `images.jpg` | 362 px |
| Samo | `images2.jpg` | 364 px |
| Marka | `images.jpg` | 365 px |
| Fulsé | `images3.jpg` | 365 px |
| Lobi | `images1.jpg` | 370 px |
| Gourmantché | `images1.jpg` | 383 px |
| Sénoufo | `images1.jpg` | 386 px |
| Marka | `images1.jpg` | 387 px |
| Bobo | `masque_bois_et_raphia_assis_480x480.jpg` | 393 px |
| Lobi | `images.jpg` | 399 px |

Les **4 images de Gouin** sont toutes trop petites : c'est la priorité.

**À faire :** remplacer par des images d'au moins **480 px de large** (plus grand ne sert à rien, le jeu les réduit).

**Bon à savoir sur le cadrage :** dans le jeu, les images seront **recadrées automatiquement** pour remplir leur case, un peu plus large que haute. Les bords d'une photo en hauteur (portrait) seront coupés en haut et en bas. Préférez des images où le sujet est **au centre**.

---

## 4. Le fichier meta.json

Chaque dossier réponse peut contenir un fichier `meta.json` en plus des 4 images et de `Anecdote.txt`. Il est **facultatif**, et chaque champ l'est aussi : on ne met que ce dont on a besoin. Mais il sera nécessaire pour les titres, les crédits et les sources.

### Exemple complet

Cet exemple a été testé sur une copie du dossier `Djôrô(Gaoua)/Lobi` : il passe la vérification sans erreur. Les auteurs et les liens sont **fictifs**, à remplacer par les vrais.

```json
{
  "title": "Le Soukala des Lobi",
  "logic": "A",
  "lang": "fr",
  "images": [
    "images1.jpg",
    "382b8d3782570445d756f78552586f35.jpg",
    "images.jpg",
    "images2.jpg"
  ],
  "distractors": ["Dagara", "Birifor", "Bobo"],
  "decoyLetters": ["A", "E", "R"],
  "credits": [
    {
      "image": "382b8d3782570445d756f78552586f35.jpg",
      "author": "Prénom Nom",
      "source": "https://commons.wikimedia.org/wiki/File:Exemple.jpg",
      "license": "CC BY-SA 4.0"
    },
    {
      "image": "images.jpg",
      "author": "Prénom Nom",
      "source": "https://www.exemple.bf/article-lobi",
      "license": "Autorisation écrite de l'auteur (mail du 12/10/2026)"
    },
    {
      "image": "images1.jpg",
      "author": "Équipe SIRA",
      "source": "Photo prise par l'équipe à Gaoua",
      "license": "Propriété de FASO ESPORT"
    },
    {
      "image": "images2.jpg",
      "author": "Prénom Nom",
      "source": "https://www.exemple.org/photo",
      "license": "CC BY 4.0"
    }
  ],
  "source": "Ouvrage ou site qui confirme l'anecdote (titre, auteur, année ou lien)"
}
```

### Ce que veut dire chaque champ

| Champ | Ce qu'il faut y mettre | Si on ne le met pas |
|---|---|---|
| `title` | Le titre de l'anecdote, affiché dans la Bibliothèque. | Le titre est le nom de la réponse. |
| `logic` | `"A"` si les 4 images **montrent** la réponse (reconnaissance). `"B"` si ce sont des **indices** et que la réponse n'est sur aucune image (déduction). | `"A"` |
| `lang` | `"fr"` pour une réponse en français ou un nom propre, `"moore"` pour un mot mooré. | `"fr"` |
| `images` | L'ordre d'affichage des 4 images, avec **les noms exacts des fichiers**. Utile surtout en logique B. | Ordre alphabétique des noms de fichiers. |
| `distractors` | Les mauvaises réponses proposées dans le Carré et le Duo. | Le jeu les choisit parmi les autres réponses. |
| `decoyLetters` | Les lettres-pièges ajoutées au plateau de lettres (une lettre par case). | Le jeu les choisit automatiquement. |
| `credits` | Pour **chacune** des 4 images : `image` (nom exact du fichier), `author` (auteur), `source` (lien ou description), `license` (licence ou autorisation). | Avertissement « aucun crédit ». |
| `source` | D'où vient l'anecdote : livre, site, personne interrogée. | Rien. |

### Les pièges à éviter

- Le fichier s'appelle exactement `meta.json`, et il est enregistré en **UTF-8** (le choix par défaut dans VS Code ou Notepad++).
- Les textes sont entre **guillemets droits** `"…"`, pas « … » (à l'intérieur d'un texte, les « » sont permis).
- Une **virgule** entre deux éléments, mais **pas de virgule après le dernier**.
- **Pas de commentaire** (`// …`) dans le fichier : un commentaire rend le fichier illisible.
- Les noms de fichiers dans `images` et `credits` doivent être **identiques** aux vrais noms, majuscules et accents compris.
- Un champ mal écrit (par exemple `"titel"`) déclenche un avertissement : relisez-le.

### Pour une réponse en mooré

Le nom du dossier s'écrit avec les vraies lettres mooré (ɛ, ɔ, ŋ, ñ), par exemple `bɔɔrɔ`, et on met `"lang": "moore"` dans le `meta.json`. Le plateau affichera les tuiles Ɛ, Ɔ, Ŋ, Ñ.

---

## 5. Comment vérifier son travail

Après chaque modification dans `content-source/`, on lance une vérification. Elle ne modifie rien, elle lit seulement les dossiers et affiche un rapport.

1. Ouvrir un terminal dans le dossier du projet (dans VS Code : menu *Terminal* → *Nouveau terminal*).
2. Taper :
   ```
   npm run content -- --check
   ```
3. Lire le rapport :
   - en haut, les totaux (régions, énigmes, images) ;
   - ensuite, dossier par dossier :
     - `[ERREUR]` : **bloquant**, le jeu ne peut pas être généré. À corriger en priorité (image manquante, `meta.json` mal écrit, nom de région inconnu…).
     - `[attention]` : pas bloquant, mais à améliorer (anecdote longue, crédits manquants, image trop petite…).
4. Le but : **0 erreur**, et le moins d'avertissements possible.

Si la commande ne marche pas sur votre ordinateur (Node.js non installé), demandez à un membre du pôle Développement de la lancer avec vous : c'est l'affaire de quelques minutes.

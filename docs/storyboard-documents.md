# Storyboard — motion « Documents » (Shephr), version française

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composition Remotion à créer : **`DocumentsFR`**
> (script `"render:documents": "remotion render DocumentsFR out/documents-fr.mp4"`).
> Durée : **2 880 images = 96,0 s**. Français uniquement, sans voix off ; musique « Dieu fait
> toutes choses nouvelles », la même que « Évènements » et « Journal » (§ 5).
> Rédigé et validé par JP le 20/10/2026 ; codé dans `src/documents/` le 20/10/2026. Ce document
> suit le code : les durées sont les `DUREE_P*` des fichiers `plans/*.tsx`, les titres ceux de
> `donnees.ts`.
>
> Sources vérifiées :
> - règles : `cmfipraise-backend/docs/shephr/18_10_2026/01_Plan_Liseuse_Partage_Documents.md` et
>   `02_Contrat_API_Documents.md` (D-DOC-03/04/05/08/11, RG-FOLDER-02 § 5.4) ;
> - écrans : `shephr-app/mobile/app/documents/index.tsx` (espace Documents, étiquette de portée
>   l. 117-119), `app/d/[slug].tsx` (lecteur, mur) ; libellés : `mobile/utils/i18n/locales/fr.json`
>   § `documents` et `home.tiles.documents*`.

---

## 1. Ce que la vidéo doit faire comprendre

Public : **les membres et les dirigeants** d'un ministère (adopter l'espace Documents). Une idée par
plan, sans jargon (pas de « module », « slug », « endpoint »).

| Partie | Message |
|---|---|
| **Le problème** | Les documents circulent en PDF sur WhatsApp : (1) **perdus** dans le fil ; (2) **plusieurs versions**, personne ne sait laquelle est la bonne ; (3) un document **d'un pays** part dans un groupe international et arrive chez tout le monde. |
| *Bascule* | « Tous vos documents, au même endroit. » — sur la montée du chant. |
| **1 · Mondial et par pays** | Un document peut être pour **tout le ministère** (tout le monde le voit) ou pour **un pays** (seul ce pays le voit). Un membre de Paris et un membre de Douala ont la même rangée « Tout le ministère », mais chacun ne voit que **son** pays. |
| **2 · Retrouver** | L'espace Documents de l'app : des dossiers, le PDF s'ouvre, il se relit hors ligne. |
| **3 · Toujours à jour** | Le document est remplacé : **même lien**, nouvelle version, l'ancienne disparaît pour tout le monde. |
| **4 · Partager** | Un seul lien sur WhatsApp, avec la couverture. Celui qui n'est pas dans l'app lit les premières pages, puis la suite l'invite à rejoindre son assemblée. |
| **Fin** | « Mondial ou par pays. Chacun voit *ce qui le concerne*. » + Shephr. |

Réponse de l'app à chacun des trois problèmes :

| Problème (WhatsApp) | Réponse montrée | Plans |
|---|---|---|
| 1. Perdu dans le fil | Un seul endroit, rangé en dossiers | P4, P7 |
| 2. Plusieurs versions | Même lien, toujours la dernière version | P8 |
| 3. Diffusé à tout le monde | Mondial ou par pays : chacun voit son pays | P5, P6 |

**Géographie : le pays seulement (JP 20/10).** Le module sait aussi rattacher un document à une
région, une ville ou une assemblée, mais la vidéo ne montre que **ministère / pays**.

**Formulation retenue (exactitude).** La vidéo parle de ce que chacun **voit dans son espace
Documents** (vrai : RG-FOLDER-02). Elle ne promet **pas** qu'un lien transféré à un autre pays est
illisible : aujourd'hui, un lien se lit en entier par tout compte rattaché (D-DOC-12, P5 ouvert).
Si JP choisit de fermer ce cas (option B), on pourra ajouter un plan « réservé à un autre pays ».

---

## 2. Principes de mise en scène

Mêmes principes que « Journal » (`docs/storyboard-journal.md` § 2), réutilisés tels quels :

- **Téléphone** `src/ui/Telephone.tsx` posé par `Plateau` ; écrans de l'app **redessinés en code**
  (thème et briques de `src/evenements/ui/app.tsx`, habillage `src/evenements/ui/Habillage.tsx`).
- **Gestes** `Appui` ; zoom de caméra 1,25–1,5 et halo argile sur l'information clé.
- **Légendes** `LegendeShephr` en haut (y 130 → 400), 2 lignes au plus, mot clé `*argile*`,
  typographie française (U+202F avant ? ! ;, U+00A0 avant : et dans « »).
- **Pastilles de partie** (gabarit `PastilleChapitre`) :

  | Partie | Plans | Pastille | Couleur |
  |---|---|---|---|
  | Le problème | P1–P3 | `LE PROBLÈME` | `ink2 #5C544A` |
  | — | P4 | aucune (bascule) | — |
  | 1 · Mondial et par pays | P5–P6 | `1 · MONDIAL ET PAR PAYS` | `moss #1E3A2F` |
  | 2 · Retrouver | P7 | `2 · RETROUVER` | sauge `#7A8B6F` |
  | 3 · À jour | P8 | `3 · TOUJOURS À JOUR` | `earthDeep #A7754B` |
  | 4 · Partager | P9 | `4 · PARTAGER` | `clay #B86A4A` |
  | Fin | P10 | aucune | — |

- **Partie « Le problème »** : une conversation WhatsApp **stylisée** (bulles neutres, aucun logo ni
  vert WhatsApp : on évite d'imiter la marque), sur le fond parchemin.
- **Carte** (P3, P5, P6) : planisphère simplifié en aplats (ton `parchmentDeep`, contours `ink3`),
  France et Cameroun mis en évidence ; drapeaux de `src/ui/Drapeaux.tsx` (à compléter si `CM`
  manque).

---

## 3. Découpage

Temps en secondes de la vidéo (30 i/s) ; entre crochets, la constante du code et l'image de début.

### Le problème (0 → 19,5 s) — `plans/Probleme.tsx`

**P1 · « Quelqu'un a le PDF ? » (0 → 6,5 s)** [`DUREE_P1` = 195, image 0]
Panneau de conversation (hors téléphone) du groupe « Responsables — CMCI ». En vue : « Il y a 3 mois »,
Jean « Voici la retranscription de l'enseignement », puis la bulle fichier
`UMPJ_Retranscript_Enseignement_TA.pdf` (« PDF · 12 pages · 1,8 Mo », halo argile i 12 → 44),
« Merci Jean 🙏 ». À i 44, sept messages arrivent coup sur coup et poussent le PDF hors du fil, puis
« Aujourd'hui » et les trois questions, de trois personnes (i 96, 122, 148) : « Quelqu'un a le PDF de
l'enseignement ? » (Marc) · « Je ne le retrouve plus 🙏 » (Sophie) · « Tu peux me le renvoyer ? » (Paul).
Légende : « Le PDF est *quelque part* / dans le fil… »

**P2 · Trois versions (6,5 → 13 s)** [`DUREE_P2` = 195, image 195]
Même groupe. « On prie pour la JS de Paris ? » / « Oui, je vous envoie le texte », puis « Cette
semaine » et le même document envoyé trois fois (i 14, 40, 66) : `priere_JS_paris.pdf` (Jean) ·
`priere_JS_paris(1).pdf` (Sophie) · « J'ai corrigé deux dates » · `priere_JS_paris_corrige.pdf`
(Marc). Les trois fichiers s'entourent d'argile, un grand « ? » argile se pose dessus (i 100) et le
panneau tremble.
Légende : « Laquelle est *la bonne* ? »

**P3 · Envoyé à tout le monde (13 → 19,5 s)** [`DUREE_P3` = 195, image 390]
Planisphère. La France s'allume (étiquette « France » + drapeau) ; le fichier
`programme_national_france.pdf` en sort (i 22) et file vers le rond « Groupe « International » »
au milieu de l'Atlantique (i 40 → 64). Dix-sept flèches argile en partent (i 78 → 130) ; à chaque
arrivée, un point et une icône de fichier ; étiquettes « Canada », « Côte d'Ivoire », « Cameroun ».
Légende : « Un document pour la France… / *arrive partout*. »

### Bascule (19,5 → 24,5 s) — `plans/Cartons.tsx`

**P4 · Un seul endroit** [`DUREE_P4` = 150, image 585]
Six bulles et fichiers des P1–P3, épars, s'aspirent vers le centre (i 4 → 34) ; la tuile d'accueil
« **Documents** · Enseignements à lire et partager » (icône `library-outline`, teinte `mossSoft`)
jaillit agrandie 2,6 fois (i 28). Image 585 = 24,0 s du fichier : la montée du chant.
Carton : « Tous vos documents, / *au même endroit*. »

### 1 · Mondial et par pays (24,5 → 50 s) — `plans/Monde.tsx`

**P5 · Tout le ministère (24,5 → 34 s)** [`DUREE_P5` = 285, image 735]
Le bandeau « 🌐 Tout le ministère » (mousse) se pose en haut de la carte, la nappe descend et teinte
toutes les terres (i 26 → 86). La carte `UMPJ — Retranscription de l'enseignement TA` · *Tout le
ministère* tombe au milieu (i 100) ; un point mousse s'allume dans chaque nation (i 140 → 210),
puis la carte descend sous le planisphère (i 236 → 266), où elle reste en P6. Un seul document
mondial.
Légende : « Un document pour / *tout le ministère*… »

**P6 · Chaque pays le sien (34 → 50 s)** [`DUREE_P6` = 480, image 1 020]
La France s'allume (terre) : `Prière — JS Paris` puis `Programme national` · *France* tombent au
large de la France, reliés à elle par un pointillé (i 24, 44). Le Cameroun s'allume (mousse claire) :
`Convention nationale — Douala` · *Cameroun* tombe dans le golfe de Guinée (i 100). Légende 1 :
« …ou pour *un pays*. » (jusqu'à i 180).
À i 176, la carte remonte et s'efface ; deux téléphones montent côte à côte (échelle 1,24), chacun sur
l'espace Documents (surtitre « Enseignements », titre « Documents ») :

| 🇫🇷 Marie · Paris | 🇨🇲 Paul · Douala |
|---|---|
| `UMPJ — Retranscription de l'enseignement TA` · *Tout le ministère · 12 pages* | `UMPJ — Retranscription de l'enseignement TA` · *Tout le ministère · 12 pages* |
| `Prière — JS Paris` · *France · 4 pages* | `Convention nationale — Douala` · *Cameroun · 8 pages* |
| `Programme national` · *France · 6 pages* | |

Halo commun argile sur les deux premières lignes (i 236 → 302), puis les lignes de chaque pays, la
France en terre, le Cameroun en mousse claire (i 306 → 372). La carte fantôme `Programme national`
(bord pointillé argile) se détache de la liste de Marie (i 380), file vers celle de Paul
(i 384 → 410), bute et se dissout (i 412 → 436).
Légende 2 : « Chacun voit *son pays*. »
(Étiquette de portée : `Tout le ministère` = `documents.space.wholeMinistry`, sinon le nom du pays —
`app/documents/index.tsx` l. 117-119.)

### 2 · Retrouver (50 → 64 s) — `plans/Retrouver.tsx`

**P7 · Des dossiers, et hors ligne** [`DUREE_P7` = 420, image 1 500]
Un seul téléphone (Marie). Accueil (« Octobre 20, 2026 », « Bon retour, *Marie*. », tuiles
« Déclarer une action », « Documents », « Créer une assemblée », « Cantiques ») → halo et appui sur la
tuile Documents (i 46) → racine de l'espace, section « Dossiers » : `Enseignements` (2 documents) ·
`Formation des dirigeants` (3 documents) · `Programmes` (1 document), caméra 1,28 → appui sur
`Enseignements` (i 112) → fil d'Ariane « Documents », titre « Enseignements », section « Documents » :
`UMPJ — Retranscription de l'enseignement TA` · `Prière — JS Paris` → appui sur l'UMPJ (i 172) → le
lecteur s'ouvre (couverture en page 1, « Page 1 / 12 », barre « D'autres documents »), les pages
défilent (« Page 2 / 12 »…). À i 252, mode avion (icône de la barre d'état + pastille avion sur le
coin du téléphone) ; la lecture continue jusqu'à la page 4.
Légendes : « Rangés en *dossiers*. » (i 6 → 210) puis « Et lisibles *hors ligne*. » (à partir de
i 246).

### 3 · Toujours à jour (64 → 73 s) — `plans/AJour.tsx`

**P8 · Même lien, nouvelle version** [`DUREE_P8` = 270, image 1 920]
Une pastille lien `www.shephr.org/d/k7Qm2xPa9T` en haut. Sous elle, la couverture « Prière — JS
Paris » en v1 (couleurs passées, pastille grise « v1 »). À i 60 — l'entrée de l'orchestre, calculée
par `calage.ts` (`BASCULE_V2`) — elle se retourne et devient la v2 (couleurs pleines, pastille mousse
« v2 ») ; la pastille lien ne bouge pas, elle pulse, « MÊME LIEN » s'inscrit dessous ; la v1 se
détache et tombe en s'effaçant. En bas, deux téléphones réduits (🇫🇷 Marie · Paris, 🇫🇷 Lucie ·
Lyon), lecteur ouvert sur le document : la page passe de v1 à v2 en même temps, halo argile.
Légende : « Corrigé une fois, / *à jour pour tous*. »

### 4 · Partager (73 → 90 s) — `plans/Partager.tsx`

**P9 · Un lien qui fait venir** [`DUREE_P9` = 510, image 2 190]
Téléphone de Marie, lecteur de l'UMPJ → halo et appui sur « Partager » (`documents.reader.share`,
i 46) → la conversation du groupe de P1, avec les trois questions ; la réponse de Marie arrive (i 80) :
carte d'aperçu (vignette de couverture, titre, « Lisez un aperçu gratuit, puis la suite dans l'app
Shephr. », `www.shephr.org`) puis le message partagé (titre et lien `https://www.shephr.org/d/…`).
Caméra 1,3 et halo sur l'aperçu. Légende : « Un seul *lien* à partager. »
À i 242, le téléphone glisse à gauche ; celui d'un ami arrive de la droite (pastille « UN AMI · SANS
COMPTE ») : conversation avec Marie, appui sur l'aperçu (i 298) → le lecteur en aperçu
(« Aperçu — page 1 sur 5 offertes », en argile, pas de barre du bas), les pages défilent jusqu'à
« Aperçu — page 5 sur 5 offertes » (i 326 → 420) → le mur monte (i 426) : « Vous avez lu l'aperçu de
« UMPJ — Retranscription de l'enseignement TA » » · « La suite vous attend dans Shephr, avec d'autres
enseignements. » · « Encore 7 pages » · « Connectez-vous ou créez votre compte : vous reviendrez
directement sur ce document. » · « Se connecter → » / « Créer un compte » (halo i 452 → 506).
Légende : « Et la suite *dans l'app*. »

### Fin (90 → 96 s) — `plans/Cartons.tsx`

**P10 · Carton final** [`DUREE_P10` = 180, image 2 700]
« Mondial ou par pays. » / « Chacun voit » / « *ce qui le concerne*. » puis l'icône Shephr
(`public/shephr/logo.png`) et le logotype ; fondu de sortie de la musique (2,5 s).

---

## 4. Données fictives

Titres finaux de JP (20/10) — les fichiers du problème reviennent **rangés** dans l'app :

| Élément | Valeur |
|---|---|
| Ministère | CMCI |
| Personnes | Marie (Paris 🇫🇷), Paul (Douala 🇨🇲), Lucie (Lyon 🇫🇷, P8) ; dans le groupe : Jean, Sophie, Marc |
| Tout le ministère | `UMPJ — Retranscription de l'enseignement TA` (12 p., 5 offertes) ← `UMPJ_Retranscript_Enseignement_TA.pdf` (P1) ; ouvert en P7, partagé en P9 |
| France | `Prière — JS Paris` (4 p.) ← `priere_JS_paris.pdf` et ses copies (P2) ; une seule version, mise à jour en P8 · `Programme national` (6 p.) ← `programme_national_france.pdf` (P3) |
| Cameroun | `Convention nationale — Douala` (8 p.) |
| Dossiers (P7) | `Enseignements` (l'UMPJ, la prière de Paris) · `Formation des dirigeants` · `Programmes` |
| Lien (P8, P9) | `https://www.shephr.org/d/k7Qm2xPa9T` (slug fictif) |

Aucun nom réel de personne ; couvertures dessinées en code (aplats + titre Fraunces).

## 5. Musique

« Dieu fait toutes choses nouvelles » (`public/audio/dieu-fait-toutes-choses-nouvelles.mp3`),
départ à 4,5 s du fichier comme « Journal » (`trimBefore` 135) : la montée de 24,0 s tombe à
19,5 s de vidéo (image 585), sur la bascule P4. L'entrée de l'orchestre (70,5 s du fichier = 66,0 s
de vidéo, image 1 980) tombe sur le retournement v1 → v2 de P8 (i 60, `BASCULE_V2` de `calage.ts`,
calculé depuis P4–P7 ; garde : entre 40 et 150). Fondu de sortie de 2,5 s sur P10.

---

## 6. Organisation du code

`src/documents/` sur le modèle de `src/journal/` : `textes.ts`, `donnees.ts`, `ecrans/`
(`Accueil`, `EspaceDocuments`, `Lecteur` — avec le mur —, `ApercuLien` — les conversations du
téléphone —), `ui/` (`Carte` — planisphère —, `Conversation`, `Couverture`), `plans/` (`Probleme`,
`Cartons`, `Monde`, `Retrouver`, `AJour`, `Partager`, `commun`), `calage.ts`, `Video.tsx` ;
composition `DocumentsFR` dans `src/Root.tsx` ; script `render:documents` ; section dans `README.md`.
Retouches partagées sans effet sur les autres vidéos : `Halo` (`teinte`), `Bouton` (`iconeDroite`),
export de la `Tuile` d'accueil, drapeaux du Cameroun et de la Côte d'Ivoire.

---

## 7. Points ouverts

1. ~~Validation JP du découpage et des données fictives~~ : validé le 20/10, titres finaux au § 4.
2. **Écart P6 / P7 (dossiers)** : l'app range les documents en dossiers (D-DOC-16) ; pour montrer
   d'un coup d'œil ce que voit chacun, P6 les affiche à plat à la racine, sous « Sans dossier »,
   alors qu'en P7 ils sont dans des dossiers. À trancher par JP (autre piste : P6 dans un dossier).
3. **Écart P8 (second téléphone)** : le document mis à jour est désormais réservé à la France ;
   Paul (Cameroun) ne le voit pas. Le second téléphone est celui de Lucie, à Lyon.
4. **Option B** (lien illisible hors de son pays) : non montrée tant qu'elle n'est pas codée.
5. Version anglaise (`DocumentsEN`) : plus tard, si demandée.

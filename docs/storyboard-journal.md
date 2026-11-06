# Storyboard — motion « Journal de l'assemblée » (Shephr), version française

> Version anglaise (`JournalEN`, 14/10/2026) : § 10.

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composition Remotion à créer : **`JournalFR`**
> (script `"render:journal": "remotion render JournalFR out/journal-fr.mp4"`).
> Durée : **2 700 images = 90,0 s**. Français uniquement, sans voix off ; musique « Dieu fait toutes
> choses nouvelles », la même que la vidéo « Évènements » (§ 5).
> Rédigé le 14/10/2026, à coder dans `src/journal/`. Les images locales du § 4 deviendront les
> constantes des fichiers `plans/*.tsx` ; ce document devra suivre le code.
>
> Sources vérifiées :
> - règles : `cmfipraise-backend/docs/shephr/23_09_2026/01_Plan_Vie_Assemblee_Member_Care.md`
>   (D-ASM-03, D-ASM-11, D-ASM-13, D-ASM-14, D-ASM-18, RG-ASM-03 à 08, § 5.2, § 5.4) ;
> - écrans : `shephr-app/mobile` (fichiers listés au § 7.1) ; libellés de
>   `mobile/utils/i18n/locales/fr.json` (§ 7.2) ; contenu du PDF : `utils/assemblyJournal.ts`
>   (`buildJournalHtml`, `buildConsolidatedJournalHtml`) (§ 7.3) ;
> - backend : `AssemblyMeetingRepository` (réunions triées par date décroissante),
>   `AssemblyServiceImpl.loadProgressData` (avancement : un bloc par module du ministère).

---

## 1. Ce que la vidéo doit faire comprendre

Une idée par plan, sans jargon (pas de « module ASSEMBLY », « endpoint », « canWrite »…).

| Partie | Message |
|---|---|
| **Le cahier** (problème) | Le compte rendu de chaque réunion s'écrit dans un cahier : (1) **un seul exemplaire**, qui se perd ou part avec l'ancien dirigeant ; (2) au bout de dix ans, **une pile de cahiers** ; (3) **rien de visible** : il faut tout recompter, et la ville ne voit rien. |
| *Bascule* | « Le journal de l'assemblée, tenu dans l'app » — sur la montée du chant (24,0 s). |
| **1 · Saisir** | Après la réunion, le dirigeant d'assemblée fait son compte rendu en quelques gestes : présents cochés, fraction de pain, chapitres lus ; le texte s'écrit tout seul et se copie pour WhatsApp. |
| **2 · Conserver** | Réunion après réunion, le journal grandit ; on le relit année par année : 1 an, 5 ans, 10 ans, même après un changement de dirigeant. L'avancement des livres est suivi. |
| **3 · Imprimer** | Le Journal PDF : on choisit la période (mois, trimestre, semestre, année), on génère, et le document est prêt : la synthèse en tête, puis chaque réunion dans l'ordre. Il se partage et s'imprime. Le PDF éclate sur l'entrée de l'orchestre (70,5 s). |
| **4 · La hiérarchie** | Le dirigeant de ville voit les statistiques de ses assemblées, l'alerte « sans compte rendu depuis 3 semaines », et sort le journal de toutes ses assemblées dans **un seul PDF**. |
| **Fin** | « Votre histoire, préservée. » + Shephr. |

Réponse de l'app à chacun des trois problèmes retenus par JP :

| Problème (cahier) | Réponse montrée | Plans |
|---|---|---|
| 1. Perte / passation | Le journal est gardé par l'app ; le nouveau dirigeant retrouve tout l'historique (repère « Nouveau dirigeant · 2024 » sur la frise des années). | P11 |
| 2. Cahiers éparpillés | Une seule continuité, consultable année par année (‹ 2026 › → 2017). | P11 |
| 3. Rien de visible | La synthèse est calculée (en tête du PDF) ; la ville voit les statistiques et l'alerte dans la Hiérarchie. | P14, P16, P17 |

---

## 2. Principes de mise en scène

Mêmes principes que la vidéo « Évènements » (`docs/storyboard-evenements.md` § 2), en bref :

- **Le téléphone** de `src/ui/Telephone.tsx`, posé par `Plateau` (640 px de large, haut de l'écran à
  y = 430). Les écrans de l'app sont **redessinés en code** à l'identique (§ 7). Toute information
  clé est amenée à l'œil par un **zoom de caméra** (1,25 à 1,5) et/ou un **halo** argile.
- **Gestes** : `Appui` (disque + onde mousse) à chaque toucher ; pas de clavier (aucune saisie de
  texte dans ce film).
- **Navigation fidèle à l'app** : l'onglet « Assemblée » est une **pile** (`app/(tabs)/assembly/_layout.tsx`,
  `Stack`) : formulaire, compte rendu et Journal PDF **arrivent de la droite** (`Pile`), la barre
  d'onglets reste visible. La Hiérarchie (`/hierarchie`) arrive aussi de la droite
  (`slide_from_right`), **sans** barre d'onglets. Changer d'onglet ou de segment (« Réunions » /
  « Avancement ») = coupe franche, comme dans l'app.
- **Légendes** : en haut (zone y 130 → 400), **2 lignes au plus**, `LegendeShephr` (Fraunces 600,
  80 px, encre ; mot clé `*entre astérisques*` en argile `clay`). Entrée ligne à ligne, fondu de
  sortie qui s'achève sur la dernière image de son plan (ou de sa tranche). Typographie française :
  espace fine insécable (U+202F) avant ? ! ;, insécable (U+00A0) avant : et dans « », apostrophe ’.
  Les libellés de l'app restent à la lettre de `fr.json` (y compris « Ce qui a été fait: », sans
  espace : c'est le modèle du § 5.4 du plan).
- **Pastille de partie** en haut de l'image (gabarit de `PastilleChapitre`, y = 56, JetBrains Mono
  26 px, texte `#F2E9D2`). Pas d'intertitre plein cadre : à 90 s, ils coûteraient 10 s.

  | Partie | Plans | Pastille | Couleur |
  |---|---|---|---|
  | Le cahier | P1–P5 | `LE CAHIER` | `ink2 #5C544A` |
  | — | P6 | aucune (carton) | — |
  | 1 · Saisir | P7–P10 | `1 · SAISIR` | `moss #1E3A2F` |
  | 2 · Conserver | P11–P12 | `2 · CONSERVER` | sauge `#7A8B6F` |
  | 3 · Imprimer | P13–P15 | `3 · IMPRIMER` | `earthDeep #A7754B` |
  | 4 · La hiérarchie | P16–P17 | `4 · HIÉRARCHIE` | `clay #B86A4A` |
  | Fin | P18 | aucune | — |

- **Partie « Le cahier »** (P1–P5) : **illustrations**, pas d'écran d'app. Objets plats aux couleurs
  de la palette : cahier à couverture kraft (`earth`), pages `paper` à lignes `hair`, écriture en
  Fraunces italique 400 couleur `ink2` (police déjà chargée — pas de nouvelle dépendance ; si JP veut
  une vraie écriture manuscrite, ajouter `@fontsource/caveat` dans `public/fonts/`). Silhouettes
  simples (tête ronde + buste, `mossSoft` / `ink3`), comme les boîtes de P7 dans « Évènements ».
- **Annotations vidéo** (hors de l'app) : toujours **hors du téléphone** ou en surimpression
  nettement distincte — frise des années (P11), pages du PDF (P14, P17), classeurs (P15).
- **Fond** : `FondShephr` (paper2 + halos lents).
- **Rythme** : posé. Chaque plan commence par 6 à 15 images de respiration ; chaque information
  clé reste tenue ≈ 1 à 1,5 s ; légende ≥ 2,5 s (≈ 1 s pour 4–5 mots, sans traîner).

---

## 3. Découpage

| N° | Partie | Images (début → fin) | Durée | Idée |
|---|---|---|---|---|
| P1 | Le cahier | 0 → 90 | 90 i · 3,0 s | Chaque réunion s'écrit au cahier |
| P2 | Le cahier | 90 → 210 | 120 i · 4,0 s | Un seul exemplaire, et il se perd |
| P3 | Le cahier | 210 → 330 | 120 i · 4,0 s | Le dirigeant change, le cahier s'en va |
| P4 | Le cahier | 330 → 435 | 105 i · 3,5 s | Dix ans : une pile de cahiers |
| P5 | Le cahier | 435 → 585 | 150 i · 5,0 s | Tout recompter ; la ville ne voit rien |
| P6 | Bascule | **585** → 690 | 105 i · 3,5 s | Carton « Le journal de l'assemblée » — **montée du chant (24,0 s)** |
| P7 | 1 · Saisir | 690 → 810 | 120 i · 4,0 s | L'onglet Assemblée, « Nouveau CR » |
| P8 | 1 · Saisir | 810 → 990 | 180 i · 6,0 s | Présents cochés, fraction de pain |
| P9 | 1 · Saisir | 990 → 1200 | 210 i · 7,0 s | Chapitres lus ; le texte s'écrit seul ; enregistrer |
| P10 | 1 · Saisir | 1200 → 1305 | 105 i · 3,5 s | Copier pour WhatsApp |
| P11 | 2 · Conserver | 1305 → 1590 | 285 i · 9,5 s | Le journal grandit : 1 an, 5 ans, 10 ans |
| P12 | 2 · Conserver | 1590 → 1725 | 135 i · 4,5 s | L'avancement des livres |
| P13 | 3 · Imprimer | 1725 → 1980 | 255 i · 8,5 s | Journal PDF : périodicité, période, « Générer le PDF » |
| P14 | 3 · Imprimer | **1980** → 2145 | 165 i · 5,5 s | Le PDF : synthèse puis chaque réunion — **entrée de l'orchestre (70,5 s)** |
| P15 | 3 · Imprimer | 2145 → 2235 | 90 i · 3,0 s | Imprimer ; les années rangées |
| P16 | 4 · Hiérarchie | 2235 → 2445 | 210 i · 7,0 s | Le dirigeant de ville : statistiques et alerte |
| P17 | 4 · Hiérarchie | 2445 → 2580 | 135 i · 4,5 s | Plusieurs assemblées, un seul PDF |
| P18 | Fin | 2580 → 2700 | 120 i · 4,0 s | « Votre histoire, préservée. » |

Totaux : le cahier 19,5 s · bascule 3,5 s · saisir 20,5 s · conserver 14 s · imprimer 17 s ·
hiérarchie 11,5 s · fin 4 s → **2 700 images = 90,0 s**.

⚠ **Contrainte musicale** (§ 5) : de P6 (585) à P14 (1980), il doit y avoir **exactement
1 395 images** (46,5 s, l'écart entre la montée de 24,0 s et l'orchestre de 70,5 s dans le fichier).
P6 à P13 totalisent 105 + 120 + 180 + 210 + 105 + 285 + 135 + 255 = 1 395. Si l'on retouche une
durée entre P6 et P13, P13 doit absorber la différence (recommandation de code au § 5).

---

## 4. Plans détaillés

Images **locales** (i 0 = début du plan). Les libellés entre guillemets sont ceux de l'app (clé
`fr.json` au § 7.2), sauf mention « annotation vidéo ». Personnes et chiffres : § 6.

### P1 — Chaque réunion s'écrit au cahier · 90 i (3,0 s) · images 0 → 90

- **À l'écran** (illustration) : un cahier fermé, couverture kraft, étiquette manuscrite
  « Comptes rendus — Paris Nord ». Il s'ouvre sur une page lignée où s'écrit un compte rendu à la
  main (les mêmes rubriques que dans l'app — clin d'œil) :
  « Mercredi 7 octobre » / « Présents : Antoine, Camille, » / « Claire, Élise, Julien, Léa… » /
  « Fraction de pain : oui » / « Lecture : chapitre 12 » (lignes courtes : Fraunces italique 30 px sur
  une page de 480 px ; cahier agrandi à 1,06 en P1–P2).
- **Animation** : i 0 → 18 le cahier se pose (fondu montant + léger ressort). i 20 → 36 il s'ouvre
  (rotation de la couverture). i 38 → 80 les lignes s'écrivent de gauche à droite (révélation par
  masque, une ligne toutes les 8 images). Tenue jusqu'à i 90.
- **Légende** : `Chaque réunion` / `s’écrit *au cahier*.`
- **Transition** : enchaînée — même cahier en P2.
- Pastille `LE CAHIER` de i 0 à la fin de P5 (fondu d'entrée 10 images).

### P2 — Un seul exemplaire, et il se perd · 120 i (4,0 s) · images 90 → 210

- **À l'écran** (illustration) : le cahier ouvert de P1 ; une goutte, une tache d'eau ; puis un
  carton marqué « DÉMÉNAGEMENT » (JetBrains Mono, `earthDeep`).
- **Animation** : i 10 une goutte tombe sur la page ; i 14 → 50 la tache s'étend (disque
  `rgba(30,58,47,0.10)` aux bords irréguliers) et l'encre **bave** (flou 0 → 4 px, opacité des
  lignes 1 → 0,35). i 56 → 68 le cahier se referme. i 70 → 92 le carton monte du bas, le cahier
  tombe dedans, les rabats se ferment. i 96 → 114 le carton sort du cadre par la droite ; reste un
  **contour pointillé** vide là où était le cahier, tenu jusqu'à i 120.
- **Légende** : `Un seul exemplaire…` / `et il se *perd*.`
- **Transition** : coupe sur P3.
- **Problème 1** (eau, déménagement ; l'oubli n'est pas illustré, faute de temps).

### P3 — Le dirigeant change, le cahier s'en va · 120 i (4,0 s) · images 210 → 330

- **À l'écran** (illustration) : deux silhouettes côte à côte, étiquettes Inter 600 30 px sous
  chacune : « Ancien dirigeant » (`ink3`, le cahier sous le bras) et « Nouveau dirigeant »
  (`mossSoft`).
- **Animation** : i 6 → 26 les deux silhouettes se posent. i 40 → 78 l'ancien dirigeant sort du
  cadre par la gauche, **avec le cahier**. i 80 → 92 une bulle « ? » (Fraunces 600, `clay`)
  apparaît au-dessus du nouveau dirigeant ; i 88 → 100 un cahier neuf, ouvert sur une page
  **blanche**, se pose devant lui. Tenue jusqu'à i 120.
- **Légende** : `Le dirigeant change,` / `*le cahier s’en va*.`
- **Transition** : coupe sur P4.
- **Problème 1** (passation : la continuité est rompue).

### P4 — Dix ans : une pile de cahiers · 105 i (3,5 s) · images 330 → 435

- **À l'écran** (illustration) : dix cahiers **dépareillés** (couleurs kraft, mousse, argile,
  parchemin, encre 3 ; formats différents), dos visibles portant les années **2017 → 2026**.
- **Animation** : i 4 → 40 les cahiers tombent un à un sur la pile (4 images d'écart, petit rebond).
  i 40 → 80 la pile **vacille** (rotation ± 2°) ; i 66 → 90 le cahier « 2020 » glisse et sort du
  cadre (un trou dans la pile). Tenue jusqu'à i 105.
- **Légende** : `Dix ans plus tard :` / `une *pile de cahiers*.`
- **Transition** : coupe sur P5.
- **Problème 2** (cahiers éparpillés).

### P5 — Tout recompter ; la ville ne voit rien · 150 i (5,0 s) · images 435 → 585

- **À l'écran** (illustration) :
  1. une page de cahier avec quelques comptes rendus ; dans la marge, des **bâtons** de comptage
     au crayon (`ink3`) ; autour, trois étiquettes (cartes `paper`, rayon 16, Inter 600 28 px,
     « ? » en `clay`) : « Présence moyenne ? », « Fractions de pain ? », « Où en est le livre ? ».
  2. recul : au-dessus du cahier, une boîte « VILLE · PARIS » (gabarit des boîtes de P7 / P12 de
     « Évènements ») avec une silhouette ; entre la ville et le cahier, un trait **pointillé
     interrompu** et un « ? » (`clay`).
- **Animation** : i 0 → 12 la page se pose. i 14 → 56 les bâtons s'ajoutent (un trait toutes les
  3 images, regroupés par cinq). i 26 → 66 les trois étiquettes apparaissent en ressort (12 images
  d'écart). i 76 → 96 recul de caméra (échelle 1 → 0,72), la boîte « VILLE · PARIS » descend du
  haut, le pointillé se trace puis se brise (i 96 → 104), « ? » (i 104). Tenue jusqu'à i 150.
- **Légendes** : `Combien de présents ?` / `*Tout recompter.*` (i 6 → 74), puis `Et la ville` /
  `*ne voit rien*.` (i 80 → fin).
- **Transition** : **sur la montée du chant** (P6, image 585) : tout le dessin descend et s'efface
  en 10 images.
- **Problème 3** (aucun chiffre sans tout recompter ; la hiérarchie ne voit rien sans se déplacer).

### P6 — Bascule : « Le journal de l'assemblée » · 105 i (3,5 s) · images 585 → 690

- **Calage** : i 0 = **24,0 s du chant** (nette montée, +6 dB).
- **À l'écran** (sans téléphone) : tuile de l'icône Shephr (`TuileLogo`, 220 px), logotype
  « shephr » + point terre (`Logotype`), puis **« Le journal »** / **« de l'assemblée »**
  (Fraunces 600, 110 px, `ink` ; « l'assemblée » en `clay`) et la ligne **« Tenu dans l'app,
  d'année en année. »** (Inter 500, 44 px, `ink2`).
- **Animation** : i 0 → 10 sortie du dessin de P5. i 4 tuile en ressort ; i 14 logotype ; i 22 titre ;
  i 34 sous-titre (fondus montants, gabarit de `P0Ouverture`). Carton complet tenu jusqu'à i 105.
- **Légende** : aucune (le carton est le texte).
- **Transition** : le carton s'efface (i 95 → 105) pendant que le téléphone de P7 monte.

### P7 — L'onglet Assemblée, « Nouveau CR » · 120 i (4,0 s) · images 690 → 810

- **À l'écran** : Thomas Lefèvre, dirigeant de l'assemblée Paris Nord. Onglet **Assemblée**
  (`app/(tabs)/assembly/index.tsx`), fond `parchment` :
  - « Vie d'assemblée » (Fraunces 28) ; « Réunions, comptes rendus et avancement des modules
    d'enseignement. » ;
  - une seule assemblée visible, donc pas de liste déroulante : « Paris Nord » (Fraunces 19)
    « · Paris » (Inter 13, `ink3`) ;
  - segments « Réunions » (actif, fond `paper`, texte `moss`) | « Avancement » ;
  - année « ‹ 2026 › » (› à 30 % : pas d'année future) ;
  - bouton plein `moss` « + Nouveau CR » ; bouton contour « Journal PDF » (icône document) ;
  - carte des réunions (dates décroissantes, `MeetingRows`) : « 7 octobre 2026 » / « 10 présents ·
    Fraction de pain · L'église de maison dans les desseins éternels de Dieu — chapitre 12 » ;
    « 30 septembre 2026 » / « 9 présents · Fraction de pain · L'église de maison… — chapitre 11 » ;
    « 23 septembre 2026 » / « 10 présents · L'église de maison… — chapitre 10 » ; « 16 septembre
    2026 » / « 8 présents · Fraction de pain · Pas de lecture »… (sous-titre limité à 2 lignes,
    « … » comme dans l'app) ;
  - barre d'onglets : Accueil · Objectifs · **Assemblée** (actif) · Évènements · Profil.
- **Animation** : i 0 → 24 le téléphone monte, déjà sur l'onglet. i 14 → 30 zoom 1,3 sur la barre
  d'onglets, halo sur « Assemblée » (i 20 → 48) ; dézoom i 44 → 58. i 58 → 70 halo sur « Nouveau
  CR » ; **appui i 84** ; i 88 → 104 le formulaire arrive de la droite. Tenue jusqu'à i 120.
- **Légende** : `Après la réunion,` / `*le compte rendu*.`
- **Transition** : enchaînée — P8 commence sur le formulaire.

### P8 — Présents cochés, fraction de pain · 180 i (6,0 s) · images 810 → 990

- **À l'écran** : `app/(tabs)/assembly/form.tsx`, de haut en bas :
  - chevron retour ; « Nouveau compte rendu » (Fraunces 26) ; « Paris Nord » ;
  - carte « DATE DE LA RÉUNION » : icône calendrier, « 14 octobre 2026 » (date du jour, préremplie),
    chevron bas ;
  - carte « PRÉSENTS · 0 » + lien « Tout cocher » ; les 11 personnes de l'assemblée par ordre
    alphabétique, case vide, « Thomas Lefèvre » suivi de l'étiquette « DIRIGEANT » (`earthDeep`) ;
  - carte « Fraction de pain » + interrupteur (éteint).
- **Animation** : i 0 → 12 respiration ; halo léger sur la date (i 6 → 30 : rien à toucher, c'est
  aujourd'hui). i 40 **appui « Tout cocher »** → les 11 cases se cochent en cascade (1 image
  d'écart), « PRÉSENTS · 11 », le lien devient « Tout décocher ». i 64 appui sur « Hugo Chevalier »
  (décoché, « · 10 ») ; i 80 appui sur « Léa Bonnet » (« · 9 »). Zoom 1,25 sur la carte des
  présents de i 30 à i 100 (le compteur « PRÉSENTS · 9 » tenu ≈ 0,7 s). i 104 → 124 défilement
  jusqu'à « Fraction de pain » ; **i 136 appui sur l'interrupteur** → il passe en `moss`. Halo sur
  la carte i 140 → 172, tenue jusqu'à i 180.
- **Légende** : `Les présents,` / `*la fraction de pain*.`
- **Transition** : enchaînée — le défilement continue en P9.

### P9 — Chapitres lus ; le texte s'écrit seul ; enregistrer · 210 i (7,0 s) · images 990 → 1200

- **À l'écran** (même formulaire, plus bas) :
  - carte « LECTURE » : pastilles « Aucune » (choisie), « L'église de maison dans les desseins
    éternels de Dieu », « Les fondements de la foi », « La prière du disciple », « Une vie
    consacrée », « Servir dans la maison de Dieu », « Marcher avec Dieu au quotidien » ;
  - après le choix : « CHAPITRES », grille de cases 44 × 44 (1 à 20, 6 par ligne), **point terre**
    en haut à droite des chapitres 1 à 12 (déjà lus) ; « Un point signale un chapitre déjà lu par
    l'assemblée. » ;
  - carte « APERÇU DU CR » : interrupteur « Inclure la liste des présents » (allumé), le texte en
    JetBrains Mono 12 (§ 6.4, au caractère près), boutons « Copier » et « Partager » ;
  - bouton « Enregistrer le CR » (pleine largeur, 52 pt).
- **Animation** : i 0 → 14 défilement jusqu'à « LECTURE ». **i 22 appui** sur « L'église de maison
  dans les desseins éternels de Dieu » → pastille pleine `moss`, la grille apparaît (i 26 → 36).
  Zoom 1,3 sur la grille (i 36 → 50). **i 54 appui « 13 », i 66 appui « 14 »** → cases pleines
  `moss` (texte clair). Halo sur les points des chapitres lus + la phrase d'aide (i 72 → 100).
  Dézoom i 100 → 112. i 112 → 132 défilement jusqu'à l'aperçu ; zoom 1,35 sur le texte (i 132 → 146),
  halo sur les lignes « - Fraction de pain: Oui » et « - Lecture du livre … chapitres 13 et 14 »
  (i 148 → 178), tenu jusqu'à i 178 (le texte a été mis à jour en direct à chaque geste — voir
  ci-dessous). Dézoom + défilement jusqu'au bouton (i 178 → 192) ; **i 196 appui « Enregistrer le
  CR »** (l'onde s'efface à i 202, quand l'écran part).
- **Mise à jour en direct** : l'aperçu est présent dès l'arrivée du formulaire et suit chaque geste
  (présents, fraction, chapitres) ; on ne le montre qu'ici, déjà à jour.
- **Légende** : `Les chapitres lus :` / `*le texte s’écrit seul*.`
- **Transition** : i 200 → 210, le compte rendu enregistré arrive de la droite (dans l'app,
  `router.replace` vers `meeting/[id]`).

### P10 — Copier pour WhatsApp · 105 i (3,5 s) · images 1200 → 1305

- **À l'écran** : `app/(tabs)/assembly/meeting/[id].tsx` : chevron retour, icônes « modifier » et
  « supprimer » (dirigeant de l'assemblée) ; « COMPTE RENDU » ; « 14 octobre 2026 » (Fraunces 26) ;
  « Paris Nord » ; carte « FRACTION DE PAIN » « Oui », « LECTURE » « L'église de maison dans les
  desseins éternels de Dieu — chapitres 13 et 14 » ; carte « PRÉSENTS · 9 » (les 9 noms) ; plus bas
  la carte « APERÇU DU CR » (`MeetingReportCard`).
- **Animation** : i 0 → 8 fin de l'arrivée. i 10 → 30 défilement jusqu'à l'aperçu. **i 44 appui
  « Copier »** → i 48 ligne « Compte rendu copié : collez-le dans WhatsApp. » (coche `mossSoft`),
  zoom 1,3 sur elle (i 50 → 62), tenu jusqu'à i 98 ; dézoom i 92 → 105.
- **Légende** : `Un geste,` / `*prêt pour WhatsApp*.`
- **Transition** : P11 s'ouvre sur un retour arrière (le compte rendu recule vers la liste).
- Non montré : « Partager », qui ouvre directement la feuille de partage (WhatsApp).

### P11 — Le journal grandit : 1 an, 5 ans, 10 ans · 285 i (9,5 s) · images 1305 → 1590

- **À l'écran** :
  1. la liste « Réunions » de P7, avec **en tête** la réunion du jour : « 14 octobre 2026 » /
     « 9 présents · Fraction de pain · L'église de maison dans les desseins éternels de Dieu —
     chapitres 13 et 14 » ;
  2. puis la même liste pour 2025, 2024 … 2017 (une liste par année, comme dans l'app ; § 6.3) ;
     en 2017, la liste se termine (défilée en bas) par « 10 mai 2017 » / « 6 présents · Pas de
     lecture », la première réunion ;
  3. **annotation vidéo** à droite du téléphone : une **frise verticale des années**, de 2026 en
     haut à 2017 en bas, chaque année avec son nombre de comptes rendus (JetBrains Mono 28 px,
     `ink2`) : 2026 · 38, 2025 · 48, 2024 · 48, 2023 · 46, 2022 · 47, 2021 · 45, 2020 · 41,
     2019 · 46, 2018 · 44, 2017 · 22 ; trois accolades sauge **« 1 an »** (2026), **« 5 ans »**
     (2022 → 2026), **« 10 ans »** (2017 → 2026) ; au bas, **« 425 comptes rendus »** (Fraunces 600,
     `moss`) ; entre 2023 et 2024, une petite étiquette « Nouveau dirigeant · 2024 » (silhouette
     `mossSoft`) — réponse au problème de P3.
- **Animation** : i 0 → 14 retour arrière (le compte rendu recule). i 16 → 50 halo sur la nouvelle
  ligne en tête (elle a pris sa place dans le journal). i 54 → 74 le téléphone se décale à gauche et
  se réduit (`Decale`, réduction 0,78), la frise se pose à droite, « 2026 · 38 » allumé, accolade
  « 1 an » (i 70 → 80). Appuis sur « ‹ » (chaque appui : l'année bascule — `Bascule` 6 images — et la
  liste change par fondu de 4 images, la frise allume l'année) : **2025 à i 90**, 2024 à i 114,
  2023 à i 132 (étiquette « Nouveau dirigeant · 2024 » i 120 → 132), **2022 à i 148** + accolade
  « 5 ans » (i 150 → 162), 2021 à i 172, 2020 à i 186, 2019 à i 200, 2018 à i 212, **2017 à i 224**
  + accolade « 10 ans » (i 226 → 238) ; i 228 → 240 la liste 2017 défile jusqu'à « 10 mai 2017 » ;
  i 240 « 425 comptes rendus » en ressort. Tout tenu jusqu'à i 285 (≈ 1,5 s).
- **Légendes** : `Réunion après réunion,` / `*le journal grandit*.` (i 6 → 84), puis `1 an, 5 ans,` /
  `*10 ans* : tout est là.` (i 88 → fin).
- **Transition** : la frise s'efface (i 275 → 285) ; P12 recentre le téléphone.

### P12 — L'avancement des livres · 135 i (4,5 s) · images 1590 → 1725

- **À l'écran** : même onglet, segment **« Avancement »** (`UnitProgressView`) : une carte, un bloc
  par module du ministère (`ModuleProgressBlock`) — titre, pourcentage (JetBrains Mono, `mossSoft`),
  barre (`moss` sur `mossTint2`), ligne « 14 / 20 chapitres · Dernier : chapitre 14 · 14 octobre
  2026 ». Ordre et valeurs au § 6.3 : le livre en cours (**70 %**) en premier, puis cinq livres à
  **100 %**.
- **Animation** : i 0 → 16 le téléphone revient au centre (réduction 0,78 → 1). i 20 → 26 retour sur
  2026 (coupe : dans l'app l'année affichée reste 2017 ; voir § 7.4). **i 30 appui « Avancement »** →
  coupe franche vers l'avancement. i 34 → 64 les barres se remplissent (annotation : dans l'app,
  elles s'affichent pleines d'emblée). i 50 → 66 zoom 1,3 sur le premier bloc (70 %), halo sur la
  ligne « 14 / 20 chapitres · Dernier : chapitre 14 · 14 octobre 2026 » (i 66 → 110), tenu jusqu'à
  i 118 ; dézoom i 118 → 135.
- **Légende** : `Livre après livre,` / `*l’avancement est suivi*.`
- **Transition** : coupe — P13 commence par l'appui sur « Réunions ».

### P13 — Journal PDF : périodicité, période, générer · 255 i (8,5 s) · images 1725 → 1980

- **À l'écran** :
  1. retour au segment « Réunions » (liste 2026) ;
  2. `app/(tabs)/assembly/journal.tsx` : chevron retour ; « Journal de l'assemblée » (Fraunces 26) ;
     « Paris Nord · Paris » ; carte « PÉRIODICITÉ » : pastilles « Mois » (choisie par défaut),
     « Trimestre », « Semestre », « Année » (« Année » passe à la ligne : les quatre pastilles ne
     tiennent pas sur les 318 points de la carte, comme dans l'app) ; ligne « ‹ Octobre 2026 › » (› à 30 %) ;
     « 2 comptes rendus sur cette période » ; carte « Inclure la liste des présents » (allumé) +
     « Le journal contient une synthèse de la période (réunions, présence moyenne, fractions de pain,
     lectures) puis chaque compte rendu dans l'ordre chronologique. » ; bouton plein « Générer le
     PDF » (icône document).
- **Animation** : **i 8 appui « Réunions »** (coupe). i 14 → 34 halo sur « Journal PDF » ; **i 40
  appui** ; i 44 → 60 l'écran arrive de la droite. i 66 → 80 zoom 1,3 sur la carte « PÉRIODICITÉ » ;
  halo qui balaie les quatre pastilles (i 72 → 108). **i 114 appui « Année »** → « 2026 »,
  « 38 comptes rendus sur cette période ». **i 138 appui « ‹ »** → « 2025 » (bascule 6 images),
  « 48 comptes rendus sur cette période » (halo i 146 → 196). Dézoom i 196 → 210 ; halo sur la
  phrase « Le journal contient… » (i 200 → 222). **i 228 appui « Générer le PDF »** → le bouton
  passe en chargement (indicateur rotatif, i 230 → 255).
- **Légendes** : `Le journal *en PDF*,` / `sur la période choisie.` (i 6 → 110), puis
  `Une année entière,` / `*en un geste*.` (i 116 → fin).
- **Transition** : **sur l'entrée de l'orchestre** (P14, image 1980).

### P14 — Le PDF : synthèse puis chaque réunion · 165 i (5,5 s) · images 1980 → 2145

- **Calage** : i 0 = **70,5 s du chant** (l'orchestre entre en plein).
- **À l'écran** :
  1. dans le téléphone, la **feuille de partage** du système monte du bas (gabarit `Feuille`) ;
     en-tête : vignette du document, « Journal-Paris-Nord-2025.pdf », « Document PDF » ;
  2. **annotation vidéo** : trois pages A4 (proportion 595 × 842, ≈ 600 × 850 px, fond blanc cassé
     `paper2`, ombre douce) **sortent de la vignette** et se déploient en éventail à droite du
     téléphone, page 1 devant. Leur contenu est celui de `buildJournalHtml` (§ 7.3), données § 6.5 :
     - page 1 : « Journal de l'assemblée » (Georgia, `moss`) ; « Paris Nord · Paris — 2025 » ;
       « Édité le 14/10/2026 » ; filet `moss` ; « Synthèse de la période » ; trois cases
       **« 48 » RÉUNIONS**, **« 8,6 » PRÉSENCE MOYENNE**, **« 44 / 48 » FRACTIONS DE PAIN** ;
       « Lectures » : « **Marcher avec Dieu au quotidien** — chapitres 7, 8, 9, 10, 11, 12, 13, 14,
       15 et 16 » ; « Comptes rendus » ; « 8 janvier 2025 » (Présents 8 + les 8 noms, Fraction de
       pain Oui, Lecture « Marcher avec Dieu au quotidien — chapitre 7 ») ; « 15 janvier 2025 »
       (Présents 9 + noms, Oui, « Aucune lecture ») ; « 22 janvier 2025 »…
     - pages 2 et 3 : la suite des comptes rendus (blocs date / Présents / Fraction de pain / Lecture).
- **Animation** : i 0 → 12 la feuille de partage monte ; i 0 → 18 le téléphone se décale à gauche
  et se réduit (0,72) ; **i 6 → 28 les pages jaillissent** de la vignette (ressort, 4 images
  d'écart) — le temps fort, sur l'orchestre. i 30 → 44 zoom 1,8 sur la synthèse de la page 1 (la page
  occupe alors presque toute la largeur : les chiffres se lisent sur un téléphone), halo
  sur les trois cases (i 44 → 84). i 88 → 108 la caméra descend sur la page 1 jusqu'aux comptes
  rendus, halo sur le bloc « 8 janvier 2025 » (i 108 → 140). i 140 → 158 dézoom ; les pages se
  rangent en pile derrière la page 1.
- **Légendes** : `En tête,` / `*la synthèse de l’année*.` (i 6 → 84), puis `Puis chaque réunion,` /
  `*dans l’ordre*.` (i 90 → fin).
- **Transition** : enchaînée — P15 garde la feuille de partage.

### P15 — Imprimer ; les années rangées · 90 i (3,0 s) · images 2145 → 2235

- **À l'écran** :
  1. la feuille de partage : rangée d'apps (WhatsApp, Mail, Messages), puis actions « Imprimer »,
     « Enregistrer dans Fichiers » (libellés du système iOS, § 7.4) ;
  2. **annotation vidéo** : la pile de pages devient un **classeur** au dos « 2025 », qui vient se
     ranger à droite d'une rangée bien droite de classeurs identiques « 2017 » … « 2024 » (réponse à
     la pile de P4).
- **Animation** : i 0 → 10 le téléphone revient vers le centre-gauche ; i 12 → 22 halo sur
  « Imprimer » ; **i 26 appui « Imprimer »**. i 30 → 54 les pages se referment en classeur et
  glissent dans la rangée (les huit autres classeurs apparaissent i 30 → 46, 2 images d'écart).
  Tenue jusqu'à i 90.
- **Légende** : `Prêt à *imprimer*,` / `année après année.`
- **Transition** : le téléphone et les classeurs descendent et s'effacent (i 78 → 90).

### P16 — Le dirigeant de ville : statistiques et alerte · 210 i (7,0 s) · images 2235 → 2445

- **À l'écran** :
  1. l'**accueil** de Daniel Mercier, dirigeant de la ville de Paris (`app/(tabs)/home.tsx`, gabarit
     de l'accueil de « Évènements » : « Octobre 14, 2026 », « Bon retour, » / *Daniel*., pastille
     « DM », carte « Mes objectifs ») ; tuiles : « Déclarer une action » / « Évangélisation »,
     « Créer une assemblée » / « Dans la ville de votre choix », « Membres » / « Annuaire de votre
     périmètre », **« Hiérarchie » / « Votre leadership »** (icône réseau, teinte sauge). Cadrage
     sur ces deux rangées (la 3ᵉ, « Cantiques », reste hors champ — § 7.4) ;
  2. `app/hierarchie.tsx` : flèche retour, « Hiérarchie » (Fraunces 28) ; « Votre leadership : vos
     dirigeants, leurs assemblées et les membres de ces assemblées. » ; bandeau « ↑ Vous rendez
     compte à **Bernard Lemoine** » ; carte « Mon superviseur » / « Déclarer à qui vous rendez compte,
     ou voir qui vous supervisez. » ; puis le **bloc « Vie d'assemblée »** (`AssemblyStatsBlock`) :
     segments « Mois » (actif, plein `moss`) · « Trimestre » · « Semestre » · « Année » ;
     « ‹ Octobre 2026 › » ; six cases : **4** « Réunions », **2 / 3** « Assemblées actives »,
     **8,8** « Présence moy. », **19** « Personnes distinctes », **3** « Fractions de pain »,
     **1** « Sans CR > 3 sem. » (chiffre en `clay`) ; encadré argile « ⚠ Sans compte rendu depuis
     3 semaines » / « Paris Sud » ; note « Une personne qui fréquente plusieurs assemblées est
     comptée dans chacune. » ; bouton doux « Journal PDF de ma hiérarchie ». Sous le bloc : segments
     « Dirigeants » | « Assemblées » et le début de l'arbre (Daniel Mercier, pastille « VOUS »).
- **Animation** : i 0 → 24 le téléphone monte sur l'accueil. i 26 → 42 halo sur « Hiérarchie » ;
  **i 46 appui** ; i 50 → 66 la Hiérarchie arrive de la droite. i 70 → 84 défilement (≈ 150 pt) qui
  amène le bloc au centre. i 84 → 100 zoom 1,35 sur les six cases ; halo sur les cinq premières
  (i 100 → 128). i 130 → 190 halo argile sur la case « Sans CR > 3 sem. » puis sur l'encadré
  « Paris Sud » (i 140 → 190). i 190 → 205 dézoom.
- **Légendes** : `Le dirigeant de ville` / `voit *ses assemblées*.` (i 6 → 120), puis
  `Plus de compte rendu ?` / `*L’alerte s’affiche*.` (i 124 → fin).
- **Transition** : enchaînée — même écran en P17.
- Pastille `4 · HIÉRARCHIE` de P16 à P17.

### P17 — Plusieurs assemblées, un seul PDF · 135 i (4,5 s) · images 2445 → 2580

- **À l'écran** : la Hiérarchie de P16 ; puis **annotation vidéo** : une page A4 du journal
  consolidé (`buildConsolidatedJournalHtml`, § 7.3, données § 6.6) : « Journal des assemblées » ;
  « Toute ma hiérarchie — octobre 2026 » (minuscule : `periodLabel` n'est pas capitalisé dans le
  PDF, seul l'écran l'est) ; « Édité le 14/10/2026 » ; « Synthèse de la période » :
  six cases (ordre du PDF) **4** RÉUNIONS · **2 / 3** ASSEMBLÉES ACTIVES · **1** SANS CR > 3 SEM. ·
  **8,8** PRÉSENCE MOY. · **19** PERSONNES DISTINCTES · **3** FRACTIONS DE PAIN ; « ⚠ Sans compte
  rendu depuis 3 semaines — Paris Sud » ; « Assemblées » : tableau Assemblée | Ville | Réunions |
  Présence moy. | Fractions de pain | Dernier CR | ⚠ avec les trois lignes Paris Est, Paris Nord,
  Paris Sud ; « Comptes rendus » : « Paris Est · Paris », « 4 octobre 2026 »… (le **nombre** de
  présents, jamais de nom).
- **Animation** : i 6 → 14 halo sur « Journal PDF de ma hiérarchie » ; **i 18 appui** → chargement
  (indicateur, i 20 → 36). i 36 → 56 le téléphone se décale à gauche (réduction 0,72) et la page
  jaillit à droite. i 60 → 74 zoom 1,9 sur le tableau ; halo sur la ligne « Paris Sud … ⚠ »
  (i 76 → 112). Tenue jusqu'à i 122 ; i 122 → 135 téléphone et page s'effacent.
- **Légende** : `Plusieurs assemblées,` / `*un seul PDF*.`
- **Transition** : fondu vers P18.

### P18 — Fin · 120 i (4,0 s) · images 2580 → 2700

- **À l'écran** (sans téléphone) : **« Votre histoire, »** / **« préservée. »** (Fraunces 600,
  104 px, `ink`, « préservée » en `clay`), puis la tuile de l'icône et le logotype (gabarit de
  `P18Fin` de « Évènements »).
- **Animation** : phrase en fondu montant (i 8), tuile en ressort (i 30), logotype (i 42) ; image
  fixe jusqu'à la fin, pas de fondu au noir. La musique s'éteint sur les 75 dernières images
  (i 45 → 120).
- **Phrase de fin — choix proposé** : **« Votre histoire, préservée. »** (court, répond à
  « perdu » et « éparpillé », la même structure que « Chaque action compte. »).
  Variantes : « Votre assemblée, son histoire, préservée. » (proposition de départ, 3 lignes à
  104 px) ; « Dix ans de réunions, un seul journal. ».

---

## 5. Calage musical

Piste : `public/audio/dieu-fait-toutes-choses-nouvelles.mp3` (7 min 32), la même que « Évènements ».
Enveloppe mesurée : 0–10 s très doux ; 10–24 s montée douce ; **24,0 s nette montée (+6 dB)** ;
24–70 s intensité moyenne ; **70,5 s orchestre en plein** ; fort et stable jusqu'à ≈ 412 s.

| | Fichier (s) | Fichier (images) | Vidéo (images) | Vidéo (s) |
|---|---|---|---|---|
| Point de départ (`trimBefore`) | **4,5** | **135** | 0 | 0 |
| Bascule « problème → l'app » (début de P6) | 24,0 | 720 | **585** | 19,5 |
| PDF qui jaillit (début de P14) | 70,5 | 2 115 | **1 980** | 66,0 |
| Fin de la vidéo | 94,5 | 2 835 | 2 700 | 90,0 |

- Écart entre les deux calages : 2 115 − 720 = **1 395 images** dans le fichier comme dans la
  vidéo (1 980 − 585) : les deux tombent juste avec un seul `trimBefore` de 135.
- Ce que l'on entend : P1 (0–3 s) dans le très doux (4,5–7,5 s du fichier) ; P2–P5 sur la montée
  douce ; la nette montée **ouvre** le carton P6 ; l'intensité moyenne porte la saisie et les années ;
  l'orchestre éclate quand les pages sortent (P14, i 6 → 28) ; la hiérarchie et la fin sont sur la
  partie forte.
- Fondus : entrée de **12 images** (0 → 0,9) ; sortie de **75 images** (2,5 s), images 2 625 → 2 699,
  prises sur P18. Volume de croisière 0,9 (celui de « Évènements »).
- **Code recommandé** (`src/journal/Video.tsx`, commentaire au format de `CALAGE_AUDIO` de
  `src/evenements/Video.tsx`) : `MONTEE = Math.round(24.0 * IPS)`, `ORCHESTRE = Math.round(70.5 * IPS)` ;
  `trimBefore = MONTEE − debut(P6)` ; **`DUREE_P13` calculée** comme
  `ORCHESTRE − MONTEE − (P6 + … + P12)` (plan tampon), avec une garde qui lève une erreur si elle
  descend sous 240 images (codé dans `src/journal/calage.ts` ; « Générer le PDF » est posé à
  `DUREE_P13 − 27`) — ainsi, retoucher une durée entre P6 et P12 ne décale jamais l'orchestre.
  Si l'on retouche P1–P5, `trimBefore` se recalcule seul ; il doit rester ≥ 0 (le problème ne peut
  pas dépasser 24 s).

---

## 6. Données fictives

Toutes inventées ; aucune donnée réelle. Date de l'histoire : **mercredi 14 octobre 2026** (même jour
que la vidéo « Évènements » ; l'assemblée Paris Nord, Élise Durand et Daniel Mercier y figurent déjà).
Paris Nord se réunit **le mercredi** soir.

### 6.1 Personnes

| Personne | Rôle | Apparaît |
|---|---|---|
| **Thomas Lefèvre** | dirigeant de l'assemblée Paris Nord (`DIRIGEANT_UNITE`) depuis janvier 2024 | P7–P15 (étiquette « DIRIGEANT » dans les présents) |
| Paul Renaud | ancien dirigeant de Paris Nord (2017–2023) — **jamais nommé à l'écran** (silhouette de P3, étiquette « Nouveau dirigeant · 2024 » de P11) | — |
| **Daniel Mercier** | dirigeant de la ville de Paris (`DIRIGEANT`), superviseur des trois dirigeants d'assemblée | P16–P17 |
| Bernard Lemoine | superviseur de Daniel (dirigeant senior Île-de-France) | P16 (« Vous rendez compte à ») |
| Sophie Marchand, Marc Dubois | dirigeants de Paris Est et de Paris Sud | arbre de P16 (bas de l'écran) |

**Les 11 personnes de Paris Nord** (ordre alphabétique de l'app, `localeCompare` sans accents) :
Antoine Morel · Camille Roux · Claire Petit · Élise Durand · Hugo Chevalier · Julien Garnier ·
Léa Bonnet · Mathieu Girard · Nicolas Faure · Sarah Lambert · Thomas Lefèvre (dirigeant).
- 7 octobre 2026 : 10 présents (absent : Hugo Chevalier), fraction de pain, chapitre 12.
- **14 octobre 2026** (P8–P10) : **9 présents** (absents : Hugo Chevalier, Léa Bonnet), fraction de
  pain **Oui**, chapitres **13 et 14**.

### 6.2 Structure

Un ministère, une nation : France › Île-de-France › **Paris** › Paris Est, **Paris Nord**, Paris Sud
(nom du nœud « Paris Nord », comme dans « Évènements »). Arbre de supervision de Daniel :
Daniel Mercier → Sophie Marchand (Paris Est), Thomas Lefèvre (Paris Nord), Marc Dubois (Paris Sud).
Abonnements supposés : `GOALS`, `ASSEMBLY`, `EVENTS` (barre d'onglets Accueil · Objectifs ·
Assemblée · Évènements · Profil, celle de « Évènements ») ; pas de `DONATIONS` ni de `MEMBER_CARE`
dans le scénario (sinon « Déclarations » / « Brebis » apparaîtraient) ; **aucun But actif** (le bloc
« Ce que porte mon leadership » de la Hiérarchie et les pastilles d'objectifs de l'arbre ne
s'affichent donc pas — c'est le comportement de l'app).

### 6.3 Modules d'enseignement (communs au ministère, tous actifs)

| Ordre | Livre (titre affiché) | Chapitres | Lu par Paris Nord | Avancement (P12) |
|---|---|---|---|---|
| 1 | L'église de maison dans les desseins éternels de Dieu | 20 | 2026 | **70 %** · « 14 / 20 chapitres · Dernier : chapitre 14 · 14 octobre 2026 » |
| 2 | Les fondements de la foi | 12 | 2017–2018 | 100 % · « 12 / 12 chapitres · Dernier : chapitre 12 · 14 mars 2018 » |
| 3 | La prière du disciple | 15 | 2018–2019 | 100 % · « 15 / 15 chapitres · Dernier : chapitre 15 · 26 juin 2019 » |
| 4 | Une vie consacrée | 18 | 2019–2021 | 100 % · « 18 / 18 chapitres · Dernier : chapitre 18 · 10 février 2021 » |
| 5 | Servir dans la maison de Dieu | 14 | 2021–2023 | 100 % · « 14 / 14 chapitres · Dernier : chapitre 14 · 22 novembre 2023 » |
| 6 | Marcher avec Dieu au quotidien | 16 | 2024–2025 | 100 % · « 16 / 16 chapitres · Dernier : chapitre 16 · 17 décembre 2025 » |

Modules sans parties (« chapitre 14 », pas « partie 2, chapitre 14 »). Le livre en cours est en
tête parce que le ministère l'a classé premier (ordre `order_index` du back-office).
Toutes les dates citées sont des mercredis.

### 6.4 Texte du compte rendu du 14 octobre 2026 (P9–P10, au caractère près)

Généré par `buildMeetingReport` (liste des présents incluse) :

```
CR Assemblée 14/10/2026
*Assemblée de maison : Paris Nord

 - Nombre de frères présents  : 9
* Antoine Morel
* Camille Roux
* Claire Petit
* Élise Durand
* Julien Garnier
* Mathieu Girard
* Nicolas Faure
* Sarah Lambert
* Thomas Lefèvre


Ce qui a été fait:

- Fraction de pain: Oui
- Lecture du livre L'église de maison dans les desseins éternels de Dieu, chapitres 13 et 14
```

(espace initiale et double espace de « Nombre de frères présents  : » comprises ; `*` ouvrant non
refermé : modèle du plan, § 5.4.)

### 6.5 Les années de Paris Nord (P11) et le journal 2025 (P13–P14)

| Année | Comptes rendus | Remarque |
|---|---|---|
| 2017 | 22 | première réunion le 10 mai 2017 (6 présents, pas de lecture) |
| 2018 | 44 | |
| 2019 | 46 | |
| 2020 | 41 | |
| 2021 | 45 | |
| 2022 | 47 | |
| 2023 | 46 | |
| 2024 | 48 | Thomas Lefèvre dirige l'assemblée |
| 2025 | **48** | tous les mercredis sauf 1ᵉʳ janvier, 6, 13 et 20 août, 31 décembre |
| 2026 | **38** | du 7 janvier au 14 octobre, sauf 5, 12 et 19 août |
| **Total** | **425** | |

Journal PDF 2025 (`Journal-Paris-Nord-2025.pdf`) : 48 réunions, du 8 janvier au 24 décembre 2025 ;
**413 présences** → présence moyenne **8,6** ; fraction de pain **44 / 48** ; lectures : « Marcher avec
Dieu au quotidien — chapitres 7, 8, 9, 10, 11, 12, 13, 14, 15 et 16 » (chapitres 1 à 6 lus en 2024).
Blocs visibles : « 8 janvier 2025 » — Présents 8 (Antoine Morel · Camille Roux · Claire Petit ·
Julien Garnier · Mathieu Girard · Nicolas Faure · Sarah Lambert · Thomas Lefèvre), Fraction de pain
Oui, Lecture « Marcher avec Dieu au quotidien — chapitre 7 » ; « 15 janvier 2025 » — Présents 9 (les
mêmes + Léa Bonnet), Oui, « Aucune lecture ». (Élise Durand et Hugo Chevalier ne viennent qu'en 2026.)
Octobre 2026, vue du journal de Thomas : 2 comptes rendus (7 et 14 octobre).

### 6.6 Hiérarchie de Daniel — Octobre 2026 (P16–P17)

| Assemblée | Réunions (1–14 oct.) | Présences | Distinctes | Fractions | Dernier CR | Alerte (> 21 j) |
|---|---|---|---|---|---|---|
| Paris Est (dimanche) | 2 (4 et 11 oct. : 8 + 8) | 16 → moy. **8** | 9 | 1 | 11/10/2026 (3 j) | — |
| Paris Nord (mercredi) | 2 (7 et 14 oct. : 10 + 9) | 19 → moy. **9,5** | 10 | 2 | 14/10/2026 (aujourd'hui) | — |
| Paris Sud (jeudi) | 0 | — | 0 | 0 | 17/09/2026 (**27 j**) | **⚠** |
| **Total** | **4** | 35 → **8,8** | **19** | **3** | | **1** |

« Assemblées actives » **2 / 3** ; présence moyenne pondérée 35 / 4 = 8,75 → **8,8** (arrondi de
l'app au dixième). Lectures de Paris Est : « Les fondements de la foi — chapitre 5 » (4 oct., fraction
Oui) et « chapitre 6 » (11 oct., fraction Non).
Journal consolidé : `Journal-Toute-ma-hierarchie-2026-10.pdf` (nom non montré).

---

## 7. Fidélité à l'app

### 7.1 Écrans reproduits (`shephr-app/mobile`)

| Plan(s) | Fichier(s) | Ce qui est repris |
|---|---|---|
| P7, P11, P12, P13 | `app/(tabs)/assembly/index.tsx` (`MeetingsView`, `MeetingRows`, `UnitProgressView`, `ModuleProgressBlock`) | titre, sous-titre, nom d'assemblée + ville (une seule assemblée : pas de liste déroulante), segments Réunions / Avancement, année ‹ › (pas d'année future), « Nouveau CR » si dirigeant de l'assemblée, « Journal PDF » (masqué pour un simple membre), lignes « N présents · Fraction de pain · livre — chapitres », blocs d'avancement |
| P8, P9 | `app/(tabs)/assembly/form.tsx`, `components/MeetingReportCard.tsx` | date du jour préremplie, présents (MEMBRE + dirigeant, ordre alphabétique, « Tout cocher / Tout décocher », étiquette « dirigeant »), interrupteur fraction de pain, pastilles de livres (« Aucune » d'abord), grille de chapitres 44 × 44 avec point des chapitres déjà lus, aperçu mono en direct, « Enregistrer le CR » → arrivée sur le compte rendu |
| P10 | `app/(tabs)/assembly/meeting/[id].tsx`, `MeetingReportCard.tsx` | « Compte rendu », date, assemblée, fraction / lecture, présents, Copier → « Compte rendu copié : collez-le dans WhatsApp. » |
| P13 | `app/(tabs)/assembly/journal.tsx` | périodicité (Mois par défaut), période ‹ › (pas de période future), compte des comptes rendus, « Inclure la liste des présents », phrase de contenu, « Générer le PDF » + chargement |
| P14, P15 | `utils/pdfShare.ts`, `utils/assemblyJournal.ts` (`buildJournalHtml`, `journalFileName`) | PDF A4 composé sur le téléphone puis **feuille de partage** (natif) ; nom « Journal-Paris-Nord-2025.pdf » |
| P16, P17 | `app/hierarchie.tsx`, `components/AssemblyHierarchyStats.tsx` (`AssemblyStatsBlock`), `utils/assemblyHierarchyStats.ts`, `utils/assemblyJournal.ts` (`buildConsolidatedJournalHtml`) | ordre de l'écran (titre, intro, « Vous rendez compte à », « Mon superviseur », bloc Vie d'assemblée), segments de périodicité, six cases, encadré d'alerte, note, « Journal PDF de ma hiérarchie », contenu du PDF consolidé |
| P16 | `app/(tabs)/home.tsx` | en-tête, tuiles d'un dirigeant (« Hiérarchie » teinte `#7A8B6F`, icône réseau) |
| P7–P15 | `app/(tabs)/_layout.tsx` | onglet « Assemblée » (icône livre), visible pour un dirigeant avec l'abonnement |

Palette, polices, rayons : ceux de `src/evenements/theme.ts` (`S`, `P`, `R`), recopiés de
`mobile/theme/colors.ts` et `typography.ts`. Icônes Ionicons ↔ `react-icons/io5`
(`IoBookOutline`, `IoDocumentTextOutline`, `IoAdd`, `IoCalendarOutline`, `IoChevronBack`,
`IoChevronForward`, `IoChevronDown`, `IoCheckbox`, `IoSquareOutline`, `IoCopyOutline`,
`IoShareSocialOutline`, `IoCheckmarkCircle`, `IoCreateOutline`, `IoTrashOutline`,
`IoRestaurantOutline`, `IoPersonOutline`, `IoGitNetworkOutline`, `IoArrowBack`, `IoArrowUp`,
`IoPeopleCircleOutline`).

### 7.2 Libellés exacts repris de `mobile/utils/i18n/locales/fr.json`

| Clé | Texte |
|---|---|
| `tabs.home` / `goals` / `assembly` / `events` / `profile` | Accueil · Objectifs · Assemblée · Évènements · Profil |
| `assemblyLife.title` / `subtitle` | Vie d'assemblée / Réunions, comptes rendus et avancement des modules d'enseignement. |
| `assemblyLife.tabMeetings` / `tabProgress` | Réunions / Avancement |
| `assemblyLife.newReport` | Nouveau CR |
| `assemblyLife.attendees_other` / `breadBreaking` / `noReading` | {n} présents / Fraction de pain / Pas de lecture |
| `assemblyLife.form.titleNew` / `date` / `attendees` / `checkAll` / `uncheckAll` / `leaderTag` | Nouveau compte rendu / Date de la réunion / Présents / Tout cocher / Tout décocher / dirigeant |
| `assemblyLife.form.reading` / `noModule` / `chapters` / `alreadyReadHint` / `save` | Lecture / Aucune / Chapitres / Un point signale un chapitre déjà lu par l'assemblée. / Enregistrer le CR |
| `assemblyLife.reportUi.preview` / `includeAttendees` / `copy` / `share` / `copied` | Aperçu du CR / Inclure la liste des présents / Copier / Partager / Compte rendu copié : collez-le dans WhatsApp. |
| `assemblyLife.report.*` | CR Assemblée {date} / *Assemblée de maison : {nom} / ` - Nombre de frères présents  : {n}` / Ce qui a été fait: / - Fraction de pain: {Oui} / - Lecture du livre {livre}, {chapitres} / chapitre {n} / chapitres {liste} et {dernier} |
| `assemblyLife.detail.title` / `reading` / `yes` | Compte rendu / Lecture / Oui |
| `assemblyLife.progress.readOf` / `last` | {lus} / {total} chapitres / Dernier : chapitre {n} · {date} |
| `assemblyLife.journal.open` / `title` / `periodicity` | Journal PDF / Journal de l'assemblée / Périodicité |
| `assemblyLife.journal.kind.month` / `quarter` / `semester` / `year` | Mois / Trimestre / Semestre / Année |
| `assemblyLife.journal.reportCount_other` | {n} comptes rendus sur cette période |
| `assemblyLife.journal.contentHint` | Le journal contient une synthèse de la période (réunions, présence moyenne, fractions de pain, lectures) puis chaque compte rendu dans l'ordre chronologique. |
| `assemblyLife.journal.generate` | Générer le PDF |
| `assemblyLife.journal.docTitle` / `generatedOn` / `summary` | Journal de l'assemblée / Édité le {date} / Synthèse de la période |
| `assemblyLife.journal.statMeetings` / `statAverage` / `statBread` | Réunions / Présence moyenne / Fractions de pain |
| `assemblyLife.journal.readings` / `reports` / `attendees` / `breadBreaking` / `reading` / `noReading` | Lectures / Comptes rendus / Présents / Fraction de pain / Lecture / Aucune lecture |
| `common.monthsLong` | janvier … décembre (dates « 14 octobre 2026 », période « Octobre 2026 ») |
| `dashboard.welcomeBack`, `dashboard.tiles.hierarchie` / `hierarchieHint` | Bon retour, / Hiérarchie / Votre leadership |
| `dashboard.tiles.events`, `structure`, `membres` (+ `Hint`) | Déclarer une action / Évangélisation ; Créer une assemblée / Dans la ville de votre choix ; Membres / Annuaire de votre périmètre |
| `hierarchy.title` / `introSubtree` / `reportsTo` / `you` / `viewLeaders` / `viewUnits` | Hiérarchie / Votre leadership : vos dirigeants, leurs assemblées et les membres de ces assemblées. / Vous rendez compte à / Vous / Dirigeants / Assemblées |
| `supervisor.title` / `shortcutHint` | Mon superviseur / Déclarer à qui vous rendez compte, ou voir qui vous supervisez. |
| `assemblyLife.hierarchy.title` | Vie d'assemblée |
| `assemblyLife.hierarchy.statMeetings` / `statActive` / `statAverage` / `statDistinct` / `statBread` / `statAlert` | Réunions / Assemblées actives / Présence moy. / Personnes distinctes / Fractions de pain / Sans CR > 3 sem. |
| `assemblyLife.hierarchy.alertTitle` / `distinctNote` / `journalAll` | Sans compte rendu depuis 3 semaines / Une personne qui fréquente plusieurs assemblées est comptée dans chacune. / Journal PDF de ma hiérarchie |
| `assemblyLife.hierarchy.docTitle` / `scopeAll` / `unitsTitle` | Journal des assemblées / Toute ma hiérarchie / Assemblées |
| `assemblyLife.hierarchy.colUnit` / `colCity` / `colMeetings` / `colAverage` / `colBread` / `colLast` | Assemblée / Ville / Réunions / Présence moy. / Fractions de pain / Dernier CR |

`Label` met ses textes en **majuscules** (« DATE DE LA RÉUNION », « PRÉSENTS · 9 », « APERÇU DU CR »,
« COMPTE RENDU », « PÉRIODICITÉ ») ; le rôle « Dirigeant » de l'arbre vient de
`MODULE_ROLE_LABELS` (`services/authApi.ts`).

### 7.3 Contenu réel des PDF

**Journal d'une assemblée** (`buildJournalHtml`, A4 595 × 842 pt, marges 16 × 14 mm) :
1. en-tête : « Journal de l'assemblée » (Georgia 24 pt, `moss`), « {assemblée} · {ville} — {période} »
   (12 pt, `ink2`), « Édité le jj/mm/aaaa » (9 pt, `ink3`), filet `moss` de 2 px ;
2. « Synthèse de la période » (Georgia 15 pt, `moss`) : trois cases (fond `paper2`, bord
   `parchmentDeep`, rayon 8) — Réunions, Présence moyenne (virgule décimale), Fractions de pain
   « N / total » ; libellés en petites majuscules `ink3` ;
3. « Lectures » : une puce par livre, « **livre** — chapitres … » (tous les chapitres de la période,
   dédoublonnés, triés) ; « Aucune lecture sur la période. » sinon ;
4. « Comptes rendus » : un bloc par réunion, **ordre chronologique** (du plus ancien au plus récent),
   jamais coupé entre deux pages : date « 8 janvier 2025 » (Georgia 13 pt) ; tableau « Présents »
   (nombre, puis les noms séparés par « · », si l'option est cochée), « Fraction de pain »
   (Oui / Non), « Lecture » (« livre — chapitre(s) » ou « Aucune lecture »).
Corps en Helvetica / Arial (polices système du PDF, **pas** Fraunces ni Inter) : la vidéo les
reproduit telles quelles (`Georgia, 'Times New Roman', serif` ; `-apple-system, Helvetica, Arial,
sans-serif`).

**Journal consolidé** (`buildConsolidatedJournalHtml`, depuis la Hiérarchie) : en-tête « Journal des
assemblées » / « Toute ma hiérarchie — {période} » ; synthèse en **six** cases (ordre du PDF :
réunions, assemblées actives, sans CR > 3 sem., présence moy., personnes distinctes, fractions de
pain — l'écran les range autrement) ; ligne d'alerte « ⚠ Sans compte rendu depuis 3 semaines — … » ;
note des personnes distinctes ; tableau « Assemblées » (en-têtes en majuscules, tri par nom,
« — » sans réunion, ⚠ en `clay`) ; puis, par assemblée ayant des réunions, ses comptes rendus dans
l'ordre chronologique — **le nombre de présents seulement, aucun nom** (D-ASM-18).

### 7.4 Écarts assumés et points relevés

- **Partie « Le cahier »**, **frise des années** (P11), **pages qui jaillissent** (P14, P17),
  **classeurs** (P15), **remplissage des barres** (P12) : annotations vidéo. Dans l'app, « Générer le
  PDF » ouvre directement la feuille de partage (natif) ou la boîte d'impression (web) : il n'y a pas
  d'aperçu dans l'app. Les pages montrées sont le **contenu réel** du fichier (§ 7.3).
- **Feuille de partage et « Imprimer »** (P14, P15) : interface du **système** (iOS), redessinée
  sobrement ; libellés iOS, pas ceux de `fr.json`. Sur Android, l'impression ne passe pas forcément
  par cette feuille.
- **Un PDF par période, une année au plus** : périodicités mois / trimestre / semestre / année, toujours
  contenues dans une année civile (`assemblyJournal.ts`). Dix ans = dix journaux annuels. Aucune
  légende ne dit « 10 ans dans un PDF » : P13 dit « Une année entière », P15 « année après année ».
- **Retour sur 2026 en P12** : dans l'app, l'année choisie reste celle de la liste (2017) quand on
  revient ; la vidéo raccorde par une coupe sur 2026 (sans effet sur l'avancement, qui ne dépend pas
  de l'année).
- **Dix ans d'historique** : la Vie d'assemblée existe depuis septembre 2026 ; un historique
  2017–2025 suppose des comptes rendus saisis après coup (rien ne l'empêche : seules les dates
  futures sont refusées) ou une projection dans le temps. C'est le propos du film (« sur 1, 5,
  10 ans »).
- **« Dirigeant de ville »** : la Hiérarchie montre les assemblées de l'**arbre de supervision**
  (règle J-4), pas celles de la géographie. Dans le scénario, les trois dirigeants d'assemblée de
  Paris ont Daniel pour superviseur : les deux coïncident.
- **L'alerte** « sans compte rendu depuis 3 semaines » est un **affichage** (pas de notification ni
  de relance, D-ASM-09 gelé) : la légende dit « L'alerte s'affiche ».
- **Accueil de Daniel** : date « Octobre 14, 2026 » (format réel de `home.tsx`, voir « Évènements »
  § 6.3) ; la tuile « Cantiques » (« Chris est Vainqueur », coquille probable) reste hors champ.
- **Texte du CR** : « Nombre de frères présents » même quand des sœurs sont présentes ; `*` non
  refermé ; « Ce qui a été fait: » sans espace — tout cela vient du modèle de JP (§ 5.4 du plan),
  reproduit à l'identique.
- **Doc du dépôt** : `shephr-app/CLAUDE.md` indique l'onglet « Assemblée » à `isLeader && hasAssembly` ;
  le code l'ouvre aussi au membre rattaché (`(isLeader || hasMemberGoals(me)) && hasAssembly`,
  D-ASM-17). Sans effet sur la vidéo (Thomas est dirigeant).

### 7.5 Chaque affirmation, vérifiée

| Affirmation (plan) | Source |
|---|---|
| Le dirigeant de l'assemblée rédige le CR (« Nouveau CR ») (P7) | D-ASM-03, RG-ASM-04 ; `index.tsx` (`canWrite`) |
| Date du jour préremplie ; date future refusée (P8) | `form.tsx` (`new Date()`), `assemblyLife.form.pickDateHint` |
| Présents = membres + dirigeant de l'assemblée, tout cocher (P8) | RG-ASM-03 ; `form.tsx` (`getRoster`, `allChecked`) |
| Fraction de pain oui / non ; lecture d'un livre, plusieurs chapitres (P8, P9) | D-ASM-13, D-ASM-10, RG-ASM-03 |
| Chapitres déjà lus signalés (P9) | plan § 6.2 ; `form.tsx` (`readIds`, point `earth`) |
| Texte du CR généré seul, en direct, copiable pour WhatsApp (P9, P10) | plan § 5.4, D-ASM-14 ; `meetingReport.ts`, `MeetingReportCard.tsx` |
| Liste des réunions par année, toutes les années (P11) | plan § 5.2 (`/units/{id}/meetings?year=`) ; `index.tsx` (‹ › sans borne basse) |
| Le nouveau dirigeant retrouve tout l'historique (P11) | RG-ASM-05 (lecture par assemblée), D-ASM-03 (écriture = dirigeant de l'assemblée) ; réunions rattachées à l'assemblée (`unit_id`) |
| Avancement par livre : chapitres distincts lus / total, dernier chapitre (P12) | RG-ASM-08 ; `AssemblyServiceImpl.progressOf` |
| Journal PDF par mois, trimestre, semestre ou année (P13) | JP 08/10 ; `assemblyJournal.ts` (`PERIODICITIES`), `journal.tsx` |
| Synthèse en tête, puis chaque CR dans l'ordre ; liste des présents optionnelle (P14) | `buildJournalHtml` ; D-ASM-14 |
| Partager / imprimer (P15) | `pdfShare.ts` (`printToFileAsync` + `shareAsync` ; `printAsync` sur le web) |
| Statistiques de la Hiérarchie : réunions, assemblées actives, présence moyenne, personnes distinctes, fractions de pain (P16) | D-ASM-18 ; `AssemblyStatsBlock`, `aggregate` |
| Alerte « sans CR depuis 3 semaines » = plus de 21 jours, ou aucun CR (P16) | D-ASM-18 ; `assemblyHierarchyStats.ts` (`ALERT_DAYS = 21`, `isAlert`) |
| Plusieurs assemblées dans un seul PDF, sans nom de personne (P17) | D-ASM-18 ; `buildConsolidatedJournalHtml` |
| Le bloc n'apparaît qu'avec l'abonnement et un rôle de dirigeant | `hierarchie.tsx` (`hasAssembly && isLeader`), RG-06 |

---

## 8. Réalisation dans `cmfipraise-motion`

- **Ne pas toucher** à `CategoriesFR` / `CategoriesEN` ni à `EvenementsFR`, ni à aucun fichier de
  `out/`. `Root.tsx` gagne une quatrième `<Composition id="JournalFR" component={VideoJournal}
  durationInFrames={DUREE_JOURNAL} fps={30} width={1080} height={1920} />`.
- **Réalisé le 14/10/2026** : le code suit ce storyboard ; les écarts de mise au point sont reportés
  dans les plans concernés (P1, P13, P14, P17) et au § 5.
- **Arborescence** `src/journal/` : `Video.tsx` (découpage, calage § 5, pastilles), `calage.ts`, `textes.ts`
  (légendes et libellés FR, ceux du § 7.2 à la lettre), `donnees.ts` (§ 6), `plans/` (`Cahier.tsx`
  P1–P5, `Cartons.tsx` P6 + P18, `Saisir.tsx` P7–P10, `Conserver.tsx` P11–P12, `Imprimer.tsx`
  P13–P15, `Hierarchie.tsx` P16–P17), `ecrans/` (Vie d'assemblée, formulaire, compte rendu, Journal
  PDF, Hiérarchie, feuille de partage, pages PDF), `ui/` (cahier, silhouettes, frise, classeurs).
- **Réutilisé tel quel** : `ui/Telephone`, `ui/Plateau`, `ui/Pile`, `ui/Scene` ; de
  `src/evenements/` : `theme.ts` (`S`, `P`, `R`, `ONDE`), `ui/Habillage` (`FondShephr`, `TuileLogo`,
  `Logotype`), `ui/app.tsx` (`Ecran`, `Carte`, `Pastille`, `Bouton`, `Halo`, `BarreOnglets` avec
  `actif = ONGLETS.assemblee`, `Etiquette`), `ui/Feuille` (feuille de partage), `ui/Bascule` (année
  qui bascule), `plans/commun.tsx` (`LegendeShephr`, `Voile`, `Appui`, `montee`, `lisse`, `Decale`,
  `Fondu`), l'écran d'accueil (`ecrans/Accueil.tsx`) s'il accepte un prénom et un jeu de tuiles.
- **À paramétrer sans changer le rendu actuel** : `PastilleChapitre` lit `CHAPITRES` de la vidéo
  « Évènements » ; lui ajouter des props facultatives (`texte`, `couleur`) dont l'absence redonne le
  rendu actuel — ou en faire une copie locale. Idem pour `Accueil` (prénom, initiales, tuiles). Toute
  brique partagée modifiée : captures **avant / après** de `EvenementsFR` (images 115, 808, 1510,
  2688, 3409, 3732) et de `CategoriesFR` (quelques images), identiques au pixel.
- **Musique** : `PISTE_AUDIO` en tête de `src/journal/Video.tsx`, calage § 5 documenté en commentaire.
- **Script** : `"render:journal": "remotion render JournalFR out/journal-fr.mp4"` ; une ligne au
  `README.md`.
- **Captures de contrôle** (`npx remotion still JournalFR <fichier.png> --frame=<n>`, dans le
  scratchpad) : P1 70 · P2 180 · P3 310 · P4 410 · P5 560 · **P6 590 / 660** (montée) · P7 780 ·
  P8 900 · P9 1140 · P10 1270 · P11 1560 · P12 1680 · P13 1960 · **P14 1990 / 2040** (orchestre) ·
  P15 2200 · P16 2400 · P17 2540 · P18 2690.

---

## 9. Points à valider par JP

1. La durée (90 s) et l'ordre : problème 19,5 s, puis saisir → conserver → imprimer → hiérarchie.
2. Les trois problèmes et leurs images (P2 : eau + déménagement ; P3 : départ du dirigeant ; P4 : pile
   de cahiers ; P5 : recompter + la ville ne voit rien).
3. Les légendes (§ 4) et la phrase de fin : « Votre histoire, préservée. » (ou une variante du P18).
4. Les données fictives (§ 6) : prénoms, livres d'enseignement, chiffres, assemblée fondée en 2017.
5. L'écriture « manuscrite » du cahier en Fraunces italique, ou une vraie police manuscrite
   (`@fontsource/caveat`, une dépendance de plus).

---

## 10. Version anglaise (`JournalEN`, demande de JP du 14/10/2026)

La même vidéo en anglais : composition `JournalEN`, rendu par
`npm run render:journal:en` → `out/journal-en.mp4`. Même découpage, mêmes durées (2 700 images),
même piste, mêmes calages (montée de 24,0 s sur P6, orchestre de 70,5 s sur P14) : seuls changent
les textes et les données fictives. Modèle : `CategoriesFR` / `CategoriesEN` (prop `langue`).

### 10.1 Réalisation

- `VideoJournal` reçoit `langue: 'fr' | 'en'` (`Root.tsx` : `JournalFR` et `JournalEN`, comme
  `CategoriesFR` / `CategoriesEN`) et la pose dans un contexte (`src/journal/langue.tsx`) ; chaque
  plan et chaque écran lit `useJournal()` → `{ legendes, cartons, app, d }`.
- `src/journal/textes.ts` : `TEXTES_JOURNAL.fr` (inchangé) et `.en` ; le type anglais est dérivé du
  français (mêmes clés, mêmes longueurs de tableaux : un oubli ne compile pas).
- `src/journal/donnees.ts` : les faits (dates ISO, présences, fractions, lectures, nombres de CR) ne
  sont écrits qu'une fois ; `construire(langue)` les met en forme comme l'app (`fmtIsoDay`,
  `formatChapters`, `toLocaleString`). Les chiffres sont donc identiques par construction.
- Brique partagée touchée : `BarreOnglets` (`src/evenements/ui/app.tsx`) accepte une prop facultative
  `libelles` ; sans elle, rendu inchangé (« Évènements » non modifiée, vérifié au pixel, § 10.7).
- Trois ajustements de mise en page, propres à l'anglais (le français ne bouge pas) :
  1. P9 : l'aide « A dot marks a chapter the assembly has already read. » tient sur deux lignes
     (une en français) ; l'aperçu et le bouton défilent de 18 points de plus (`decalageAide`,
     `plans/Saisir.tsx`).
  2. P13 : « Month · Quarter · Half-year · Year » tiennent sur une ligne (« Année » passe à la ligne
     en français) ; appuis relevés à nouveau (`PT_JOURNAL_EN`, `ecrans/JournalPdf.tsx`).
  3. P17 : colonnes du tableau « Assemblies » du PDF consolidé élargies pour « AVG. ATTENDANCE » et
     « BREAD BREAKINGS » (`ui/Pages.tsx`).
  Le titre anglais du livre en cours est choisi assez long pour que sa pastille passe sur deux lignes
  comme en français (P9) : la grille des chapitres reste au même endroit.

### 10.2 Légendes FR → EN

Adaptation, pas du mot à mot ; deux lignes au plus, aussi courtes que le français, typographie
anglaise (pas d'espace avant « : ? », apostrophe ’). En *italique* : le mot en argile.

| Plan | Français | Anglais |
|---|---|---|
| P1 | Chaque réunion / s’écrit *au cahier*. | Every meeting / goes *in the notebook*. |
| P2 | Un seul exemplaire… / et il se *perd*. | Just one copy… / and it gets *lost*. |
| P3 | Le dirigeant change, / *le cahier s’en va*. | The leader moves on, / *the notebook goes too*. |
| P4 | Dix ans plus tard : / une *pile de cahiers*. | Ten years later: / a *stack of notebooks*. |
| P5 a | Combien de présents ? / *Tout recompter.* | How many came? / *Count it all again.* |
| P5 b | Et la ville / *ne voit rien*. | And the city / *sees nothing*. |
| P6 | Le journal / de *l’assemblée* — Tenu dans l’app, d’année en année. | The assembly / *journal* — Kept in the app, year after year. |
| P7 | Après la réunion, / *le compte rendu*. | After the meeting, / *the report*. |
| P8 | Les présents, / *la fraction de pain*. | Attendance, / *the breaking of bread*. |
| P9 | Les chapitres lus : / *le texte s’écrit seul*. | Pick the chapters: / *the text writes itself*. |
| P10 | Un geste, / *prêt pour WhatsApp*. | One tap, / *ready for WhatsApp*. |
| P11 a | Réunion après réunion, / *le journal grandit*. | Meeting after meeting, / *the journal grows*. |
| P11 b | 1 an, 5 ans, / *10 ans* : tout est là. | 1 year, 5 years, / *10 years*: it’s all there. |
| P12 | Livre après livre, / *l’avancement est suivi*. | Book after book, / *progress is tracked*. |
| P13 a | Le journal *en PDF*, / sur la période choisie. | The journal *as a PDF*, / for the period you choose. |
| P13 b | Une année entière, / *en un geste*. | A whole year, / *in one tap*. |
| P14 a | En tête, / *la synthèse de l’année*. | First, / *the year at a glance*. |
| P14 b | Puis chaque réunion, / *dans l’ordre*. | Then every meeting, / *in order*. |
| P15 | Prêt à *imprimer*, / année après année. | Ready to *print*, / year after year. |
| P16 a | Le dirigeant de ville / voit *ses assemblées*. | The city leader / sees *every assembly*. |
| P16 b | Plus de compte rendu ? / *L’alerte s’affiche*. | Reports stopped? / *An alert shows up*. |
| P17 | Plusieurs assemblées, / *un seul PDF*. | Several assemblies, / *one single PDF*. |
| P18 | Votre histoire, / *préservée*. | Your story, / *safely kept*. |

Pastilles de partie : THE NOTEBOOK · 1 · RECORD · 2 · KEEP · 3 · PRINT · 4 · HIERARCHY.

Illustrations du cahier (écriture « manuscrite ») et annotations vidéo :

| Élément | Français | Anglais |
|---|---|---|
| Étiquette du cahier (P1–P2) | Comptes rendus / Paris Nord | Meeting notes / Leeds North |
| Page du cahier (P1–P2) | Mercredi 7 octobre · Présents : Antoine, Camille, / Claire, Élise, Julien, Léa… · Fraction de pain : oui · Lecture : chapitre 12 | Wednesday 7 October · Present: Andrew, Chloe, / Claire, Emily, James, Lucy… · Bread breaking: yes · Reading: chapter 12 |
| Page des comptes (P5) | 14 janvier : 8 présents · pain : oui · chap. 7 · 21 janvier : 9 présents · pain : oui · 28 janvier : 7 présents · pain : non · chap. 8 | 14 January: 8 present · bread: yes · ch. 7 · 21 January: 9 present · bread: yes · 28 January: 7 present · bread: no · ch. 8 |
| Carton (P2) | DÉMÉNAGEMENT | MOVING |
| Silhouettes (P3) | Ancien dirigeant · Nouveau dirigeant | Former leader · New leader |
| Questions (P5) | Présence moyenne ? · Fractions de pain ? · Où en est le livre ? | Average attendance? · Bread broken? · How far in the book? |
| Ville (P5) | VILLE · PARIS | CITY · LEEDS |
| Frise (P11) | 1 an · 5 ans · 10 ans · Nouveau dirigeant · 2024 · 425 comptes rendus | 1 year · 5 years · 10 years · New leader · 2024 · 425 reports |
| Feuille de partage iOS (P14–P15) | Document PDF · Copier · Imprimer · Enregistrer dans Fichiers | PDF Document · Copy · Print · Save to Files |

### 10.3 Données fictives anglaises

Une assemblée de **Leeds** (Royaume-Uni) ; formats de date de l'app anglaise (« 14 October 2026 »,
jour d'abord : `fmtIsoDay` avec `common.monthsLong`). Tous les chiffres sont ceux du § 6.

| Français | Anglais |
|---|---|
| Paris Nord · Paris Est · Paris Sud (ville : Paris) | Leeds North · Leeds East · Leeds South (ville : Leeds) |
| Thomas Lefèvre (dirigeant de l'assemblée) | Thomas Walker |
| Daniel Mercier (DM, dirigeant de ville) | Daniel Morgan (DM) |
| Bernard Lemoine (superviseur de Daniel) | Richard Bell |
| Sophie Marchand · Marc Dubois | Sophie Turner · Mark Evans |
| Antoine Morel · Camille Roux · Claire Petit · Élise Durand | Andrew Mitchell · Chloe Roberts · Claire Parker · Emily Davies |
| Hugo Chevalier (absent) · Julien Garnier · Léa Bonnet (absente) | Henry Cooper (absent) · James Green · Lucy Bennett (absente) |
| Mathieu Girard · Nicolas Faure · Sarah Lambert | Matthew Graham · Nathan Foster · Sarah Lewis |

Les prénoms anglais gardent l'ordre alphabétique de l'app : les deux absents restent 5ᵉ et 7ᵉ de la
liste, le dirigeant dernier (appuis de P8 inchangés).

Modules d'enseignement :

| Français | Anglais |
|---|---|
| L'église de maison dans les desseins éternels de Dieu | The House Church in the Eternal Purpose of God |
| Les fondements de la foi | The Foundations of the Faith |
| La prière du disciple | The Disciple’s Prayer |
| Une vie consacrée | A Consecrated Life |
| Servir dans la maison de Dieu | Serving in God’s House |
| Marcher avec Dieu au quotidien | Walking with God Every Day |

Nombres et dates de l'app en anglais : présence moyenne 8.6 (journal 2025), 8.8, 9.5 (hiérarchie) ;
`Journal-Leeds-North-2025.pdf` ; « Issued on 14/10/2026 » (`formatReportDate`, jj/mm/aaaa dans les
deux langues) ; période « October 2026 » à l'écran (capitalisée), « October 2026 » dans le PDF.

Texte du compte rendu du 14 octobre 2026 (P9–P10), tel que `buildMeetingReport` le produit avec les
clés anglaises `assemblyLife.report.*` :

```
Assembly report 14/10/2026
*House assembly: Leeds North

 - Number of brothers present: 9
* Andrew Mitchell
* Chloe Roberts
* Claire Parker
* Emily Davies
* James Green
* Matthew Graham
* Nathan Foster
* Sarah Lewis
* Thomas Walker


What was done:

- Breaking of bread: Yes
- Reading of the book The House Church in the Eternal Purpose of God, chapters 13 and 14
```

PDF (P14, `buildJournalHtml`) : « Assembly journal » · « Leeds North · Leeds — 2025 » ·
« Issued on 14/10/2026 » · « Period summary » : 48 MEETINGS · 8.6 AVERAGE ATTENDANCE ·
44 / 48 BREAD BREAKING · « Readings » : **Walking with God Every Day** — chapters 7, 8, 9, 10, 11, 12,
13, 14, 15 and 16 · « Reports » : « 8 January 2025 », Present / Bread breaking (Yes / No) / Reading
(« No reading »). PDF consolidé (P17, `buildConsolidatedJournalHtml`) : « Assemblies journal » ·
« My whole hierarchy — October 2026 » · six cases (MEETINGS, ACTIVE ASSEMBLIES, NO REPORT > 3 WKS,
AVG. ATTENDANCE, DISTINCT PEOPLE, BREAD BREAKING) · « ⚠ No report for 3 weeks — Leeds South » ·
tableau « Assemblies » (ASSEMBLY, CITY, MEETINGS, AVG. ATTENDANCE, BREAD BREAKINGS, LAST REPORT, ⚠).

### 10.4 Libellés repris de `mobile/utils/i18n/locales/en.json`

Mêmes clés que la version française (§ 7.2), valeurs anglaises :

- `tabs.*` : Home · Goals · Assembly · Events · Profile.
- `dashboard.*` : Welcome back, · My goals · Five-Year Goal — pledges & current status ; tuiles :
  Record an action / Evangelism · Create an assembly / In the city of your choice · Members / Your
  scope's directory · Hierarchy / Your leadership.
- `assemblyLife.*` : Assembly life · Meetings, reports and progress through the teaching modules. ·
  Meetings · Progress · New report · `attendees_*` « 9 present » · Bread breaking · No reading ·
  `progress.readOf` « 14 / 20 chapters » · `progress.last` « Last: chapter 14 · 14 October 2026 ».
- `assemblyLife.form.*` : New report · Meeting date · Present · Check all · Uncheck all · leader ·
  Reading · None · Chapters · A dot marks a chapter the assembly has already read. · Save report.
- `assemblyLife.reportUi.*` : Report preview · Include the list of those present · Copy · Share ·
  Report copied: paste it into WhatsApp.
- `assemblyLife.detail.*` : Report · Present · Reading · Yes.
- `assemblyLife.report.*` : le texte du CR ci-dessus.
- `assemblyLife.journal.*` : PDF journal · Assembly journal · Period · `kind.*` Month / Quarter /
  Half-year / Year · `reportCount_*` « 2 reports for this period » · contentHint · Generate PDF ·
  docTitle · Issued on {{date}} · Period summary · Meetings · Average attendance · Bread breaking ·
  Readings · Reports · Present · Reading · No reading.
- `assemblyLife.hierarchy.*` : Assembly life · Meetings · Active assemblies · No report > 3 wks (espace insécable dans « 3 wks », revue 14/10) ·
  Avg. attendance · Distinct people · Bread breaking · No report for 3 weeks · distinctNote · PDF
  journal of my hierarchy · My whole hierarchy · Assemblies journal · Assemblies · `col*` ·
  `leaderSummary_*` « 3 assemblies » · `alertCount_*` « 1 ⚠ ».
- `hierarchy.*` / `supervisor.*` : Hierarchy · `introSubtree` · You report to · You · Leaders ·
  Assemblies · `unitsCount_*` « 1 assembly » · My supervisor · `shortcutHint`.

### 10.5 Ce que l'app anglaise affiche encore en français (traduit dans la vidéo — revue 14/10)

- **Date de l'accueil** (P16) : l'app affiche « Octobre 14, 2026 ». `home.tsx` la compose avec
  `monthLabel` (`utils/format.ts`), dont les mois sont en français en dur, quelle que soit la langue.
- **Rôles de la Hiérarchie** (P16–P17) : l'app affiche « Dirigeant », « Dirigeant d'unité ».
  `MODULE_ROLE_LABELS` (`services/authApi.ts`) n'est pas traduit.

Revue 14/10 : un spectateur anglophone lisait « Octobre » comme une coquille. La vidéo montre donc
ces libellés traduits, tels que l'app les afficherait une fois ces deux points passés en i18n :
`APP_EN.dateAccueil` = « October 14, 2026 » (ordre de `home.tsx` conservé, mois de
`common.monthsLong`), `APP_EN.hierarchie.roleDirigeant` = « Leader », `roleDirigeantUnite` =
« Assembly leader » (repris de `structure.leader`). **À confirmer par JP** : soit corriger l'app
(recommandé), soit revenir au rendu actuel de l'app dans `textes.ts`.

**Frise P11 (EN)** : « 1 year » est plus long que l'accolade d'une seule année ; il part du bas de
l'accolade et ne déborde que vers le haut (`versLeHaut`, `plans/Conserver.tsx`). « 1 an » reste centré.

### 10.6 Captures de contrôle (anglais)

Une image au milieu de chaque plan (45, 150, 270, 382, 510, 637, 750, 900, 1095, 1252, 1447, 1657,
1852, 2062, 2190, 2340, 2512, 2640), plus les appuis (774, 850, 874, 890, 946, 1044, 1056, 1186,
1839, 1863, 1953, 2281, 2463) et quelques poses (15, 85, 185, 230, 310, 1555, 2010) : relues une à
une (légendes sur deux lignes, appuis sur leur cible, textes de l'app et du PDF).

### 10.7 Non-régression

Avant toute modification : 25 images de `JournalFR` (le milieu des 18 plans + 7 autres), 3 de
`EvenementsFR` (300, 1800, 3500), 3 de `CategoriesFR` et 3 de `CategoriesEN` (100, 600, 1250), en
PNG. Après : mêmes images, comparées octet par octet (`cmp`) : **34 / 34 identiques**.

### 10.8 Points à valider par JP (version anglaise)

1. Les légendes (§ 10.2), le titre « The assembly journal » et la fin « Your story, safely kept. ».
2. Leeds et les noms anglais (§ 10.3) ; le titre long du premier livre.
3. Les deux restes de français de l'app anglaise (§ 10.5) : les garder (fidélité) ou corriger l'app
   d'abord.

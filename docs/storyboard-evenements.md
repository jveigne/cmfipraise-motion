# Storyboard — motion « Évènements » (Shephr), version française

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composition Remotion à créer : **`EvenementsFR`**.
> Durée : **3 745 images = 124,8 s** (≈ 2 min, retour JP du 14/10). Français uniquement, sans voix
> off ; musique « Dieu fait toutes choses nouvelles » (§ 7).
> Rédigé le 14/10/2026, codé dans `src/evenements/` ; ce document suit le code (images locales du § 4
> = constantes des fichiers `plans/*.tsx`).
> Mis à jour (même jour) pour **D-EVT-15** : « Âmes gagnées » devient « Conversions », s'ajoutent
> « Restaurations » et « Baptêmes » (déclaration P2, clôtures P6 / P10, détails P5–P11, six KPI et
> totaux à quatre chiffres P13–P17) — découpage, durées et calage musical inchangés.
> Mis à jour (même jour) pour **D-EVT-16** (« Prédicateur », texte libre d'un type évangélique, juste
> après le type et la date, en évidence dans le détail et sur les lignes) et **D-EVT-17** (« Invités »,
> pour tout type, juste après « Participants », inclus dans les participants ; septième KPI) : champ
> « Prédicateur » visible en P2, saisi par Élise en P5 (« Pasteur Jean-Marc Lefort »), prérempli en
> P6, saisi par Daniel à la clôture en P10 (« Pasteur Samuel Kouassi ») ; invités partout où des
> participants sont saisis ou affichés ; seconde légende en P10. Découpage, durées et calage musical
> inchangés ; défilements, points de toucher et zooms ajustés.
>
> Sources vérifiées :
> - règles : `cmfipraise-backend/docs/shephr/14_10_2026/01_Plan_Evenements_Recensement_Evangelisation.md`
>   (D-EVT-01 à 17, RG-ACT-*, RG-EVT-*), `02_Contrat_API_Evenements.md` (§ 3.2, § 3.5, § 3.12, § 6),
>   `03_Guide_Secretariat_Evenements.md`, spec « Shephr Spec Recensement Actions » v1.0 (13/10/2026) ;
> - écrans : `shephr-app/mobile` (fichiers listés au § 6), libellés de
>   `mobile/utils/i18n/locales/fr.json`.

---

## 1. Ce que la vidéo doit faire comprendre

Une idée par plan, sans jargon : pas de « PLANNED / DONE », pas de « nœud », aucun code.

| Chapitre | Message |
|---|---|
| **1 · Le membre** | Depuis l'accueil, « Déclarer une action » : le type et la date suffisent, l'action compte tout de suite. Ça marche sans réseau : elle part plus tard. On peut aussi **programmer** une action à venir dans son assemblée, puis la **marquer comme réalisée** (participants dont invités — D-EVT-17 — et, pour une action d'évangélisation, conversions, restaurations, baptêmes — D-EVT-15). Le **prédicateur** d'une action d'évangélisation se note dès la programmation (D-EVT-16). Le membre ne voit que **son assemblée**. |
| **2 · Le dirigeant** | L'agenda de son périmètre (à clôturer / à venir / réalisés). Il programme **à son niveau** (une campagne de ville), clôture — en notant le prédicateur et les invités —, et peut poser « à vérifier », qui ne retire **jamais** l'action du total. |
| **3 · La hiérarchie** | Chaque dirigeant voit son périmètre : assemblée → ville → région → nation. Le secrétariat suit tout le ministère par les statistiques. |
| **4 · La géographie** | Assemblée → Ville → Région → Nation : les totaux remontent seuls. Statistiques en descente Nation → Région → Ville → Assemblée, par type et par mois. Un évènement de ville compte **une seule fois**, à la ville. |
| **Fin** | « Chaque action compte. » + Shephr. |

---

## 2. Principes de mise en scène

- **Le téléphone** est celui du projet (`src/ui/Telephone.tsx`, posé par `Plateau` : 640 px de large,
  haut de l'écran à y = 430). Tous les écrans de l'app sont **redessinés en code** à l'identique (§ 6).
  Le texte de l'app est petit à l'échelle du téléphone (13 pt ≈ 21 px) : chaque information clé est
  amenée à l'œil par un **zoom de caméra** (`Plateau zoom/foyer`, facteur 1,25 à 1,6) et/ou une
  **surbrillance** douce (halo argile `clay` à 18 % autour de l'élément).
- **Gestes** : `Toucher` (disque + onde) à chaque appui ; saisie au clavier simulée par apparition
  lettre à lettre (2 images par caractère), sans clavier à l'écran (il masquerait le formulaire).
- **Navigation fidèle à l'app** (`mobile/app/_layout.tsx`) : `events/declare` et `events/plan` sont des
  **modales qui montent du bas** ; `events/[id]` arrive **de la droite** (`Pile`) ; le passage
  « détail ↔ formulaire de clôture » dans `[id].tsx` est un changement d'état : **fondu enchaîné** de
  8 images.
- **Légendes** : en haut de l'image (zone y 130 → 400, au-dessus du téléphone), **2 lignes au plus**,
  Fraunces 600, 80 px (≈ 24 caractères par ligne), encre `ink #2A2620` ; le mot clé `*entre astérisques*`
  passe en argile `clay #B86A4A` (la couleur des surtitres de l'app). Entrée ligne à ligne en fondu
  montant, sortie en fondu sur les 10 dernières images (comportement actuel de `Legende`). Une
  légende reste lisible **au moins 2,5 s**.
  Typographie française dans les légendes et cartons (`textes.ts` › `LEGENDES`, `CARTONS`) : espace
  fine insécable (U+202F) avant ? ! ;, insécable (U+00A0) avant : et dans « », apostrophe ’. Les
  libellés de l'app (`APP`) restent à la lettre de `fr.json`.
- **Chapitres reconnaissables** : (a) un **intertitre** plein cadre de 2,5 s (75 images) ; (b) pendant
  tout le chapitre, une **pastille** en haut de l'image (y = 56, centrée, JetBrains Mono 26 px,
  majuscules, fond de la couleur du chapitre, texte `#F2E9D2`) : `1 · MEMBRE`, `2 · DIRIGEANT`,
  `3 · HIÉRARCHIE`, `4 · GÉOGRAPHIE`.

  | Chapitre | Couleur (palette de l'app) |
  |---|---|
  | 1 · Membre | `moss #1E3A2F` |
  | 2 · Dirigeant | `clay #B86A4A` |
  | 3 · Hiérarchie | sauge `#7A8B6F` (teinte de la tuile « Hiérarchie » de l'accueil, `home.tsx`) |
  | 4 · Géographie | `earthDeep #A7754B` |

- **Fond** : `paper2 #FBF5E6` avec deux halos lents (mousse à 10 %, terre à 12 %), sur le modèle de
  `src/ui/Fond.tsx`.
- **Schémas** (plans 7, 12, 14) : des **boîtes et une échelle de niveaux**, jamais une carte. D-EVT-10 :
  le module n'a pas de carte géographique — la vidéo ne doit pas en suggérer une.
- **Rythme** : posé. Chaque plan commence par 10 à 20 images de « respiration » avant le premier geste.
  Retour JP 14/10 : les gestes gardent leur vitesse, ce sont les poses qui s'allongent (§ 3) ; une
  légende finit son fondu sur la dernière image de son plan.

---

## 3. Découpage

| N° | Chapitre | Images (début → fin) | Durée | Idée |
|---|---|---|---|---|
| P0 | Ouverture | 0 → 75 | 75 i · 2,5 s | Shephr · Évènements |
| I1 | 1 · Membre | 75 → 150 | 75 i · 2,5 s | Intertitre « Le membre » |
| P1 | 1 · Membre | 150 → 266 | 116 i · 3,9 s | La tuile de l'accueil |
| P2 | 1 · Membre | 266 → 454 | 188 i · 6,3 s | Type + date suffisent |
| P3 | 1 · Membre | 454 → 630 | 176 i · 5,9 s | Elle compte tout de suite |
| P4 | 1 · Membre | 630 → 800 | 170 i · 5,7 s | Même sans réseau |
| P5 | 1 · Membre | 800 → 1129 | 329 i · 11,0 s | L'onglet Évènements, puis programmer |
| P6 | 1 · Membre | 1129 → 1300 | 171 i · 5,7 s | La marquer réalisée |
| P7 | 1 · Membre | 1300 → 1406 | 106 i · 3,5 s | Elle ne voit que son assemblée |
| I2 | 2 · Dirigeant | 1406 → 1481 | 75 i · 2,5 s | Intertitre « Le dirigeant » |
| P8 | 2 · Dirigeant | 1481 → 1719 | 238 i · 7,9 s | L'onglet Évènements : l'agenda du périmètre |
| P9 | 2 · Dirigeant | 1719 → 1975 | 256 i · 8,5 s | Programmer depuis l'agenda, à son niveau |
| P10 | 2 · Dirigeant | 1975 → 2147 | 172 i · 5,7 s | Clôturer |
| P11 | 2 · Dirigeant | 2147 → 2315 | 168 i · 5,6 s | « À vérifier » reste compté |
| I3 | 3 · Hiérarchie | 2315 → 2390 | 75 i · 2,5 s | Intertitre « La hiérarchie » |
| P12 | 3 · Hiérarchie | 2390 → 2628 | 238 i · 7,9 s | À chaque dirigeant, son périmètre |
| P13 | 3 · Hiérarchie | 2628 → 2790 | 162 i · 5,4 s | Le secrétariat, tout le ministère |
| I4 | 4 · Géographie | 2790 → 2865 | 75 i · 2,5 s | Intertitre « La géographie » |
| P14 | 4 · Géographie | 2865 → 3083 | 218 i · 7,3 s | Les totaux remontent |
| P15 | 4 · Géographie | 3083 → 3259 | 176 i · 5,9 s | Descente nation → ville |
| P16 | 4 · Géographie | 3259 → 3457 | 198 i · 6,6 s | Un évènement de ville compte une fois |
| P17 | 4 · Géographie | 3457 → 3615 | 158 i · 5,3 s | Par type, par mois |
| P18 | Fin | 3615 → 3745 | 130 i · 4,3 s | « Chaque action compte. » |

Totaux par chapitre (intertitre compris) : ouverture 2,5 s · membre 44,4 s · dirigeant 30,3 s ·
hiérarchie 15,8 s · géographie 27,5 s · fin 4,3 s → **3 745 images = 124,8 s**.

Retour JP du 14/10 sur la version de 98,9 s : « c'est trop rapide, ça avance trop rapidement » →
viser ≈ 2 min ; et « bien montrer que pour programmer un évènement, il faut cliquer sur Évènements
dans la bottom nav ». Ce qui a changé :

- **Rythme** : aucun geste n'est ralenti (montées de modale, défilements, bascules, saisies, appuis
  gardent leur durée) ; ce sont les **poses** qui s'allongent — chaque information clé (date
  préremplie, bandeau de rattachement, compteur qui bascule, pastille de statut, total, addition)
  reste tenue ≈ 1 à 1,5 s, l'état final ≈ 1 s après la dernière animation. Un premier passage
  (poses de 1,5 à 2 s) menait le film à 147 s : les poses ont été resserrées de façon égale sur tous
  les plans pour tenir 123 s. La revue visuelle du 14/10 a ensuite rendu 42 images (124,8 s) à
  trois poses trop courtes : le total France de P14, la lecture des blocs de l'agenda en P8, et
  l'appui sur « Accueil » qui ouvre P5.
- **Intertitres** portés de 1,8 s à 2,5 s (75 images).
- **Légendes** : leur fondu de sortie s'achève exactement sur la dernière image du plan — jamais
  coupées ni figées à mi-fondu sous un intertitre.
- **L'onglet Évènements de la barre du bas** est montré trois fois : P5 (le membre le touche pour
  programmer), P8 (c'est là qu'est l'agenda du dirigeant), P13 (le secrétariat y est déjà, ouvert sur
  « Statistiques », son onglet par défaut — l'appui sans effet a été retiré à la revue du 14/10).

---

## 4. Plans détaillés

Les images indiquées dans un plan sont **locales** (0 = début du plan). Tous les libellés entre
guillemets sont ceux de l'app (clé `fr.json` au § 6), sauf mention « annotation vidéo ».

### P0 — Ouverture · 75 i (2,5 s) · images 0 → 75

- **À l'écran** (sans téléphone) : sur le fond `paper2`, l'icône Shephr (`mobile/assets/logo-512.png`,
  logo circulaire sur blanc, présenté en tuile blanche arrondie de 240 px, ombre douce) ; dessous le
  logotype « shephr » + point terre (reproduction de `components/Wordmark.tsx` : Fraunces 500, `moss`,
  point `earth`), puis le titre **« Évènements »** (Fraunces 600, 120 px, `ink`) et la ligne
  **« Comment ça marche ? »** (Inter 500, 44 px, `ink2`).
- **Animation** : tuile en ressort (i 4), logotype (i 12), titre (i 18), ligne (i 28) en fondu montant ;
  carton complet tenu jusqu'à i 75.
- **Légende** : aucune (le carton est le texte).
- **Transition** : I1 monte du bas et recouvre le carton, figé sur sa dernière image (10 images).

### I1 — Intertitre « Le membre » · 75 i (2,5 s) · images 75 → 150

- **À l'écran** : aplat `moss` plein cadre ; grand « 1 » Fraunces italique 300 px en `earth` à 60 % ;
  **« Le membre »** Fraunces 600, 110 px, `#F2E9D2` ; dessous `CHAPITRE 1 / 4` (JetBrains Mono 28 px,
  `parchment` à 70 %).
- **Animation** : l'aplat monte du bas (i 0 → 10), textes en fondu montant (i 6 → 18), l'aplat repart
  vers le haut en découvrant P1 (i 65 → 75).
- **Même gabarit pour I2, I3, I4** (seuls changent la couleur, le chiffre et le titre).

### P1 — « Déclarer une action » depuis l'accueil · 116 i (3,9 s) · images 150 → 266

- **À l'écran** : l'**accueil** d'Élise, simple membre de l'assemblée Paris Nord
  (`app/(tabs)/home.tsx`), fond `parchment` :
  - `Octobre 14, 2026` (Inter 13, `ink3`) — format réel de l'accueil, voir § 6.3 ;
  - `Bon retour,` / *`Élise`*`.` (Fraunces 28, prénom en italique) ; pastille ronde `moss` « ÉD » ;
  - carte pleine `moss` : drapeau, « Mes objectifs » / « But Quinquennal — engagements & état actuel » ;
  - grille de tuiles (2 colonnes) : **« Déclarer une action » / « Évangélisation »** (icône
    mégaphone `clay` sur fond `clay` à 10 %), « Créer une assemblée » / « Dans la ville de votre
    choix », « Cantiques » / « Chris est Vainqueur » (voir § 6.3) ;
  - barre d'onglets flottante : Accueil · Objectifs · Assemblée · Évènements · Profil.
- **Animation** : le téléphone monte du bas (ressort, i 0 → 24, comme `ScenePlans2et3`). i 40 → 65 :
  zoom 1,3 sur la tuile ; halo argile sur « Déclarer une action » (i 44 → 54), tenu jusqu'à l'appui
  (i 81). i 85 → 109 dézoom ; i 89 → 111 la modale « Déclarer une action » **monte du bas**.
- **Légende** : `Une action menée ?` / `*Déclarez-la*`
- **Transition** : enchaînée — la modale ouverte est l'image de départ de P2.

### P2 — Le type et la date suffisent · 188 i (6,3 s) · images 266 → 454

- **À l'écran** : `app/events/declare.tsx`, de haut en bas :
  - en-tête : à gauche, icône liste + « Mes actions » (`moss`) ; à droite, croix de fermeture ;
  - surtitre « ÉVANGÉLISATION » (JetBrains Mono, `clay`) ; titre « Déclarer une action » (Fraunces 30) ;
    intro « Le type et la date suffisent : tout le reste est facultatif. » ;
  - « TYPE D'ACTION » + pastilles : Retraite · Campagne · Conférence · Concert · Implantation d'église
    de maison · Action de grâce · Autre ;
  - « DATE DE L'ACTION » : carte « 14 octobre 2026 » + « Aujourd'hui » (`earthDeep`) ;
  - dès qu'un type est choisi (tous évangéliques), **« PRÉDICATEUR »** (`EventPreacherField`,
    D-EVT-16), champ « Nom du prédicateur », juste après la date ; Élise le laisse vide (le type et la
    date suffisent) ;
  - « LIEU » (« Ville, quartier, lieu-dit… ») ;
  - compteurs (`components/EventCounterFields.tsx`, D-EVT-15 / D-EVT-17), grille de cellules à 47 %,
    deux par ligne, champs « — » (pavé numérique dans l'app) : tant qu'aucun type n'est choisi,
    **« PARTICIPANTS » / « INVITÉS »** (aide « dont personnes extérieures » sous « Invités ») ; dès
    « Campagne », s'ajoutent « CONVERSIONS » / « RESTAURATIONS », « BAPTÊMES », et dessous
    « Facultatif : laissez vide ce que vous ne savez pas. » ;
  - « NOTE » + compteur « 0/280 » ;
  - bandeau `mossTint` : « Cette action sera enregistrée pour l'assemblée Paris Nord. » (pas de
    sélecteur : un membre n'a qu'une assemblée) ;
  - bouton « Enregistrer » (coche), **grisé (opacité 0,4) tant qu'aucun type n'est choisi** ;
  - note : « Votre action compte dès son enregistrement, sans validation. Sans réseau, elle est gardée
    sur votre téléphone et envoyée dès le retour de la connexion. »
- **Animation** : i 0 → 20 respiration. i 28 : appui sur « Campagne » → la pastille passe en `moss`
  plein, texte clair. i 44 → 60 zoom 1,35 sur « DATE DE L'ACTION », **tenu jusqu'à i 90** : « Aujourd'hui »
  s'illumine (halo i 50 → 92 ; la date est déjà remplie) — le zoom montre aussi, dessous, le champ
  « PRÉDICATEUR » apparu au choix du type ; dézoom i 90 → 100. i 104 → 134 : la page défile de 533 pt
  (230 avant D-EVT-15, 342 avant D-EVT-16 / D-EVT-17 : prédicateur et ligne « Participants | Invités »
  ajoutent 191 pt, relevés à l'écran) ;
  le bouton « Enregistrer », désormais actif, et le bandeau d'assemblée arrivent au
  centre (halo sur le bandeau, i 128 → 166, plein i 136 → 158). i 164 : appui sur « Enregistrer ».
- **Légende** : `Le type et la date` / `*suffisent*`
- **Transition** : i 169 → 181, fondu enchaîné vers l'écran de confirmation (dans l'app, c'est le même
  écran qui change d'état).

### P3 — Elle compte tout de suite · 176 i (5,9 s) · images 454 → 630

- **À l'écran** :
  1. Confirmation (`SuccessScreen` de `declare.tsx`) : bulle ronde `moss` avec coche,
     « Action enregistrée 🙏 », « Elle est enregistrée pour Paris Nord. » ; boutons « Déclarer une
     autre action », « Mes actions », « Terminer ».
  2. Après « Mes actions » : la modale descend et découvre l'onglet **Évènements** du membre, sa vue
     d'assemblée (`components/EventMemberView.tsx`) : surtitre « ÉVÈNEMENTS », titre « Mes actions »,
     sous-titre « Les actions de votre assemblée : les vôtres, celles des autres membres et de vos
     dirigeants. », ligne maison + « Paris Nord », **carte des compteurs** « EN OCTOBRE » /
     « EN 2026 » (`EventCounters`), « Sont comptées les actions réalisées d'un type évangélique. »,
     boutons « Déclarer » (plein) et « Programmer » (doux), bloc « À venir » (1), bloc « Actions
     d’évangélisation » (10) dont la première ligne est la sienne : « Campagne » + pastille
     **« Mon action »**, « 14 octobre 2026 · Paris Nord ».
- **Animation** : i 0 → 44 confirmation (zoom 1,2 sur le titre, tenu i 16 → 34). i 50 : appui sur
  « Mes actions ». i 56 → 76 : la modale descend. i 84 → 98 : zoom 1,5 sur les compteurs, qui passent
  (i 104 → 114) **2 → 3** (« EN OCTOBRE ») et **9 → 10** (« EN 2026 ») — bascule verticale du chiffre,
  10 images, puis petit éclat `moss` (annotation vidéo, voir § 6.3) ; zoom tenu jusqu'à i 144 (1 s
  après la bascule). **La ligne « Campagne · Mon action » entre en tête de liste au même moment**
  (i 104 → 118, insertion glissée comme en P4) : avant la bascule, la liste ne la montre pas — chiffres,
  badge et liste restent cohérents. i 144 → 166 : dézoom, défilement, halo sur la ligne « Mon action »,
  tenue jusqu'à i 176.
- **Légende** : `Elle compte` / `*tout de suite*`
- **Transition** : coupe franche sur P4 (même vue, le mode avion s'active).

### P4 — Même sans réseau · 170 i (5,7 s) · images 630 → 800

- **À l'écran** :
  1. Barre d'état en **mode avion** (avion orange, `Telephone avion`), pastille ronde « hors
     connexion » sur le coin du téléphone, décalée vers le haut et la droite pour ne pas couvrir la barre
     d'état (reprise de `Badge` de `Plan6HorsLigne`, icône
     `cloud-offline-outline` en `moss`).
  2. Confirmation **hors ligne** d'une seconde déclaration (« Concert », lieu « Gare du Nord ») : bulle
     `earthDeep` avec nuage montant (`cloud-upload-outline`), « Action enregistrée 🙏 », puis « Pas de
     réseau pour l'instant : elle est gardée sur votre téléphone et partira d'elle-même dès le retour de
     la connexion. »
  3. Retour du réseau : la vue « Mes actions » ; la ligne « Concert » + « Mon action », « 14 octobre
     2026 · Gare du Nord · Paris Nord » apparaît **en tête** de la liste, compteurs **3 → 4** et
     **10 → 11**.
- **Animation** : i 0 → 15 l'avion apparaît (ressort), pastille hors connexion (i 6). i 18 → 30 : fondu
  vers la confirmation hors ligne (la saisie elle-même a été montrée en P2 : on ne la refait pas).
  i 30 → 46 : zoom 1,4 sur le texte « Pas de réseau… », tenu jusqu'à i 84 (halo i 40 → 90) ; dézoom
  i 84 → 96. i 98 → 108 : l'avion disparaît, la pastille s'efface. i 106 → 121 : fondu vers « Mes
  actions » ; i 126 → 144 la ligne glisse en tête, les compteurs basculent (i 136 → 146), tenus
  jusqu'à i 170.
- **Légende** : `Même *sans réseau*` / `elle partira plus tard`
- **Transition** : sans coupe : P5 reprend sur cette même vue et le doigt touche « Accueil ».
- **Fidélité** : on ne montre **pas** la vue « Mes actions » pendant la coupure (hors ligne, l'app y
  afficherait des bandeaux d'erreur de chargement des listes) ; la file d'attente est évoquée par la
  confirmation, qui en est le texte exact.

### P5 — Programmer une action à venir · 329 i (11,0 s) · images 800 → 1129

Retour JP 14/10 : « bien montrer que pour programmer un évènement, il faut cliquer sur Évènements dans
la bottom nav ». L'accueil n'a pas de tuile « Programmer » (la tuile « Déclarer une action » n'ouvre que
la déclaration) : on programme depuis l'onglet **Évènements**.

- **À l'écran** :
  0. L'**accueil** d'Élise (gabarit de P1), barre d'onglets du bas : Accueil · Objectifs · Assemblée ·
     **Évènements** · Profil — onglets d'un membre rattaché (`app/(tabs)/_layout.tsx` : pas de
     « Déclarations » sans abonnement aux dons, ni « Trésorerie », ni « Brebis », réservé aux
     dirigeants).
  1. L'onglet **Évènements** du membre, sa vue d'assemblée (`EventMemberView`, la vue de P3) :
     appui sur **« Programmer »**.
  2. Modale `app/events/plan.tsx` + `components/EventForm.tsx` : croix ; « ÉVÈNEMENTS » ;
     « Programmer un évènement » ; intro « Il apparaîtra dans l'agenda de votre périmètre. Les chiffres
     (participants, invités et, pour une action d’évangélisation, conversions, restaurations,
     baptêmes) se saisissent une fois l'évènement réalisé. » (quatre lignes) ;
     « TYPE D'ÉVÈNEMENT » (mêmes
     pastilles) ; « INTITULÉ » (« Ex. Conférence de rentrée (facultatif) ») ; « DATE » / « FIN »
     (« Un seul jour ») ; **« PRÉDICATEUR »** (D-EVT-16 : on le connaît souvent dès la programmation) ;
     bandeau « Cet évènement sera programmé pour l'assemblée Paris Nord. » ;
     « LIEU », « NOTE » ; bouton « Programmer » (icône calendrier).
  3. Après enregistrement, le **détail** (`app/events/[id].tsx`) : « ÉVANGÉLISATION », « Campagne »,
     « Campagne de quartier », pastille « Programmé » (`earthDeep`) ; **carte teintée du prédicateur**
     (micro `moss`, « Prédicateur », « Pasteur Jean-Marc Lefort » en Fraunces 18 — D-EVT-16, comme
     `[id].tsx`) ; carte de détail avec les lignes « Participants », « Invités » (D-EVT-17),
     « Conversions », « Restaurations », « Baptêmes » à « — » (D-EVT-15) ; texte
     « Programmé : il comptera une fois marqué comme réalisé. » ; bouton « Marquer comme réalisé »
     grisé et « Disponible à partir de la date de l’évènement. »
- **Animation** (revue du 14/10) : P4 finit déjà sur la vue membre ; P5 s'ouvre donc sur un
  **avant-plan de 10 images** : le doigt touche « **Accueil** » (i 8) et l'accueil s'affiche à i 10 —
  plus de retour en arrière par une coupe sèche. Les images qui suivent sont **locales au corps du plan**
  (image 10 de P5 = i 0). Premier temps, l'onglet. i 14 → 34 zoom 1,3 sur la barre d'onglets ; halo sur
  « Évènements » (i 22 → 32), tenu jusqu'à l'**appui sur l'onglet (i 56)** ; **coupe franche** à i 62
  vers la vue membre de l'onglet (changement d'onglet instantané, comme dans l'app — l'ancien fondu
  enchaîné faisait une double exposition) ; dézoom i 68 → 86. i 90 → 98 halo sur « Programmer », **appui i 112**.
  Second temps, le formulaire : i 116 → 136 la modale monte. i 142 appui « Campagne ». i 150 → 170
  l'intitulé s'écrit « Campagne de quartier » (1 caractère par image, un peu plus vite qu'avant pour
  faire place au prédicateur). i 172 → 180 : la date passe de « 14 octobre 2026 » à « 17 octobre
  2026 » (bascule + halo jusqu'à i 194 ; le calendrier de choix n'est pas montré, voir § 6.3).
  i 182 → 194 : zoom 1,3, foyer y 730, qui cadre ensemble le champ « PRÉDICATEUR » et le bandeau ;
  i 188 → 212 « Pasteur Jean-Marc Lefort » s'écrit (halo i 186 → 218) ; puis halo sur le bandeau
  « … pour l'assemblée Paris Nord. » (i 216 → 246 ; elle programme dans SON assemblée), zoom tenu
  jusqu'à i 242 ; dézoom i 242 → 250. i 252 → 264 : défilement de 422 pt jusqu'au bouton ; i 270 appui
  « Programmer » (l'onde s'efface dès que le détail arrive). i 274 → 290 : le détail arrive de la
  droite ; halos sur la pastille « Programmé » (i 282 →), sur la **carte du prédicateur** (i 284 →) et
  sur « il comptera une fois marqué comme réalisé » (i 288 →), tenus jusqu'à la fin du corps (i 319).
  i 296 → 308 : le détail défile de 236 pt (prédicateur et quatre lignes de plus depuis D-EVT-15 /
  D-EVT-17) pour montrer la phrase, le bouton grisé et « Disponible à partir de la date de
  l’évènement. ».
- **Légendes** (images du corps) : `Pour programmer :` / `l'onglet *Évènements*` (i 6 → 94), puis
  `Une action à venir ?` / `*Programmez-la*` (i 98 → fin, fondu achevé sur la dernière image).
- **Transition** : la pastille calendrier de P6 apparaît par-dessus.

### P6 — Le jour venu, la marquer réalisée · 171 i (5,7 s) · images 1129 → 1300

- **À l'écran** :
  1. Pastille ronde sur le coin du téléphone (gabarit du `Badge` de P4) : icône calendrier + **« 17 OCT. »**
     (annotation vidéo : saut dans le temps).
  2. Le détail « Campagne de quartier » : « Marquer comme réalisé » est maintenant **actif**.
  3. Le formulaire de clôture (`DoneForm` de `[id].tsx`) : « MARQUER COMME RÉALISÉ », « Campagne »,
     « Saisissez ce qui s’est passé — tout est facultatif. Un champ laissé vide garde sa valeur. »,
     « PRÉDICATEUR » **prérempli** « Pasteur Jean-Marc Lefort » (D-EVT-16, `DoneForm`), grille des
     compteurs (`EventCounterFields`) : « PARTICIPANTS » **25**, « INVITÉS » **8** (« dont personnes
     extérieures », D-EVT-17), « CONVERSIONS » **2**, « RESTAURATIONS » **1**, « BAPTÊMES » **1**,
     « Facultatif : laissez vide ce que vous ne savez pas. », « NOTE », bouton « Marquer comme réalisé ».
  4. Retour au détail : pastille **« Réalisé »** (`moss`), carte du prédicateur, carte teintée
     « Évènement marqué comme réalisé. », lignes « Participants 25 », « Invités 8 », « Conversions 2 »,
     « Restaurations 1 », « Baptêmes 1 », et « Cet évènement compte dans les statistiques
     d’évangélisation. »
- **Animation** : i 0 → 15 pastille « 17 OCT. » (ressort), elle reste jusqu'à i 146 → 156. Le détail
  repart du défilement de fin de P5 (236 pt) et descend à 252 pt (i 6 → 20) : le bouton revient à sa
  place d'avant. i 28 appui « Marquer comme réalisé » ; i 32 → 40 fondu vers le formulaire ; halo sur
  le prédicateur prérempli (i 40 → 66). « 25 » s'écrit (i 46 → 54), puis « 8 » invités (i 54), « 2 »
  (i 60), « 1 » (i 66), « 1 » (i 72), le curseur passant d'un champ à l'autre jusqu'à i 80. i 88 appui
  sur le bouton (y 766 : le formulaire a grandi de 197 pt) ; i 92 → 100 fondu vers le détail. Le détail
  « Réalisé » ne tient plus d'un bloc : zoom **1,1** (1,2 avant), foyer y 450, i 104 → 120 ; d'abord
  la pastille « Réalisé » et la carte du prédicateur (halos i 104 → 130), puis défilement de 180 pt
  (i 124 → 136) jusqu'aux chiffres — halo sur « Participants 25 / Invités 8 » — et à « Cet évènement
  compte… » (halos i 130 → 148), tenu jusqu'à i 142.
- **Légendes** : `Le jour venu,` / `*marquez-la réalisée*` (i 6 → 44), puis, pendant la saisie et sur
  le détail, `Conversions,` / `restaurations, *baptêmes*` (i 48 → fin, fondu achevé sur la dernière
  image) — les trois compteurs D-EVT-15 valorisés sans allonger le plan.
- **Transition** : i 154 → 171, le téléphone descend et s'efface (comme `Plan9Fin`) ; le schéma de P7
  apparaît.

### P7 — Elle ne voit que son assemblée · 106 i (3,5 s) · images 1300 → 1406

- **À l'écran** (schéma, pas d'écran d'app) : en haut, une boîte « VILLE · PARIS » ; dessous, trois
  cartes d'assemblée au style des cartes de l'app (`paper`, rayon 22, icône maison `mossSoft`) :
  « Paris Est », **« Paris Nord »**, « Paris Sud ». Au-dessus de la ville, deux bandes plus pâles
  « RÉGION · ÎLE-DE-FRANCE » et « NATION · FRANCE ».
- **Animation** : i 0 → 38 les boîtes se posent (décalées de 4 images). i 40 → 50 : « Paris Nord »
  s'allume (bord `moss`, fond `mossTint`, petite silhouette « Élise »). i 56 → 76 : tout le reste passe
  à 35 % d'opacité et reçoit un petit cadenas `ink3` (dès i 62 : Paris Est, Paris Sud, la ville, la
  région, la nation). Schéma tenu jusqu'à i 106.
- **Légende** : `Elle ne voit que` / `*son assemblée*` (le « que » porte la règle : rien d'autre que son
  assemblée)
- **Transition** : I2 monte du bas.
- **Règle illustrée** : D-EVT-14 — le simple membre ne lit que son assemblée et ses propres
  évènements ; ni assemblée sœur, ni ville, ni région, ni nation.

### I2 — Intertitre « Le dirigeant » · 75 i (2,5 s) · images 1406 → 1481

Gabarit de I1 ; aplat `clay`, « 2 », **« Le dirigeant »**, `CHAPITRE 2 / 4`.

### P8 — L'agenda de son périmètre · 238 i (7,9 s) · images 1481 → 1719

- **À l'écran** : Daniel, dirigeant de la ville de Paris. Onglet **Évènements**, vue dirigeant
  (`app/(tabs)/events/index.tsx` + `components/EventAgenda.tsx`) :
  - « ÉVÈNEMENTS », titre « Agenda & statistiques », « Les évènements de votre périmètre et les actions
    d’évangélisation réalisées. » ;
  - sélecteur segmenté « Agenda » (actif) | « Statistiques » ;
  - boutons « Programmer » (plein, calendrier) et « Déclarer » (doux, mégaphone) ;
  - « PÉRIMÈTRE AFFICHÉ » : « Tout mon périmètre » ;
  - **« À clôturer »** + pastille `clay` « 1 », « Programmés dont la date est passée : à marquer comme
    réalisés ou à annuler. » ; ligne « Concert » + « À clôturer », « Concert de louange »,
    « 10 octobre 2026 · Paris 10e · Paris » ;
  - **« À venir »** + pastille `earthDeep` « 2 », « Programmés à partir d'aujourd'hui. » ; lignes
    « Campagne » + « Programmé », « Campagne de quartier », « 17 octobre 2026 · Paris 18e · Paris Nord » ;
    « Retraite » + « Programmé », « Retraite d'automne », « 7 novembre 2026 → 8 novembre 2026 ·
    Fontainebleau · Paris Nord » ;
  - **« Réalisés »**, « Évènements et actions réalisés sur la période choisie. », pastilles « Mois » /
    « Année » (active) / « Plage », « ‹ 2026 › », puis les lignes réalisées (« Concert · 14 octobre
    2026 · Gare du Nord · Paris Nord », « Campagne · 14 octobre 2026 · Paris Nord », « Action de grâce ·
    11 octobre 2026 · Paris 18e · Paris Nord » + « 40 participants · 2 conversions · 1 baptême »,
    « Implantation d'église de maison · 9 octobre 2026 · Paris 14e · Paris Sud » + « 8 participants dont
    3 invités · 1 conversion »…). Ligne de chiffres = `EventFigures` / `counterParts` : seulement les
    compteurs saisis, dans l'ordre participants (« dont N invités », D-EVT-17) · conversions ·
    restaurations · baptêmes (D-EVT-15) ; « Action de grâce » : « 40 participants dont 12 invités ·
    2 conversions · 1 baptême ». La ligne « Campagne de quartier » porte, sous la date, **« Prédicateur :
    Pasteur Jean-Marc Lefort »** (micro `moss`, `EventPreacherLine`, D-EVT-16).
- **Animation** : premier temps, l'onglet (retour JP 14/10) : i 0 → 24 le téléphone monte ; i 14 → 30
  zoom 1,3 sur la barre d'onglets du bas (celle du membre, § P5 : le scénario n'a ni Member Care ni
  abonnement aux dons, donc ni « Brebis » ni « Déclarations ») ; halo sur l'onglet actif
  **« Évènements »** (i 20 → 56, plein i 28 → 48) — sans appui : Daniel y est déjà ; dézoom i 50 → 64.
  Second temps, l'agenda (halos allongés à la revue du 14/10, défilements à la même vitesse) :
  i 68 → 82 zoom 1,2 ; halo sur « À clôturer » (i 80 → 116, plein ≈ 0,8 s : il annonce P10) ;
  défilement i 114 → 134 jusqu'à « À venir » (halo i 136 → 172, plein ≈ 0,8 s) ; défilement
  i 170 → 185 jusqu'à « Réalisés » (arrêt à 580 pt au lieu de 480, pour lire « 40 participants dont
  12 invités · … ») (halo i 187 → 219, plein ≈ 0,7 s) — halos serrés verticalement, qui
  ne mordent pas sur le sous-titre placé dessous. Au passage de « Campagne de quartier », petit halo
  (i 142 → 172) : c'est l'action programmée par Élise en P5 — le dirigeant la voit.
- **Légendes** : `Son agenda :` / `l'onglet *Évènements*` (i 6 → 72), puis `L'agenda de` /
  `*son périmètre*` (i 78 → fin).
- **Transition** : retour en haut de la page (i 217 → 237), dézoom pendant ce retour (i 222 → 236),
  enchaîné sur P9.

### P9 — Programmer à son niveau : une campagne de ville · 256 i (8,5 s) · images 1719 → 1975

- **À l'écran** : modale « Programmer un évènement » (mêmes éléments qu'en P5), mais Daniel a plusieurs
  niveaux possibles : le champ **« RATTACHEMENT »** apparaît (`SelectField`), valeur « Ville · Paris »
  (son niveau, proposé par défaut), sous le champ « PRÉDICATEUR » que Daniel laisse vide (facultatif,
  D-EVT-16). La liste ouverte montre « Ville · Paris », « Assemblée · Paris Est »,
  « Assemblée · Paris Nord », « Assemblée · Paris Sud ». Bandeau : « Cet évènement sera programmé pour
  la ville Paris. » Après enregistrement, le détail : « ÉVANGÉLISATION », « Campagne », « Grande
  campagne de Paris », pastille « Programmé », ligne « Rattachement · Paris · Ville » (la carte porte
  aussi « Participants », « Invités », « Conversions », « Restaurations », « Baptêmes » à « — »).
- **Animation** : premier temps, bref (le chemin a été montré en P5) : i 2 → 14 zoom 1,25 sur
  « Programmer » de l'agenda, halo (i 6 → 36) ; **appui i 30** ; dézoom i 32 → 44 ; i 34 → 52 la modale
  monte. i 54 appui « Campagne ». i 60 → 84 l'intitulé s'écrit « Grande campagne de Paris » (saisie
  resserrée). i 86 → 94 la date passe à « 24 octobre 2026 » (halo jusqu'à i 108). i 96 → 104 : court
  défilement de 100 pt (le champ « PRÉDICATEUR » a fait descendre le rattachement et le bandeau de
  91 pt). i 110 appui sur
  « RATTACHEMENT » : la liste s'ouvre (i 112 → 124, modale du sélecteur), « Ville · Paris » en gras
  `mossDeep` ; i 134 appui sur « Ville · Paris », la liste se ferme (i 136 → 146) et l'onde de l'appui
  s'efface avec elle. i 142 → 150 zoom 1,35 sur le bandeau « … pour la ville Paris. », **tenu jusqu'à
  i 186** ; dézoom i 186 → 194. i 193 → 201 défilement (jusqu'à 511 pt ; 440 avant D-EVT-16) ;
  i 206 appui « Programmer » ; i 210 → 226 le
  détail arrive de la droite (l'onde s'efface au départ). i 224 → 232 halo sur la ligne
  **« Rattachement · Paris · Ville »**, tenu jusqu'à la fin (≈ 0,8 s de lecture après le halo).
- **Légendes** : `Depuis l'agenda :` / `*Programmer*` (i 6 → 96), puis `Il programme` /
  `*à son niveau*` (i 102 → fin).
- **Transition** : P10 s'ouvre sur un retour arrière (le détail recule vers l'agenda), pas sur une coupe.

### P10 — Après l'évènement, il le clôture · 172 i (5,7 s) · images 1975 → 2147

- **À l'écran** : détail du « Concert » / « Concert de louange » (ouvert depuis « À clôturer ») :
  pastille « À clôturer » (`clay`), lignes « Date 10 octobre 2026 », « Rattachement Paris · Ville »,
  « Lieu Paris 10e », « Participants », « Invités », « Conversions », « Restaurations », « Baptêmes »
  (« — »), « Enregistré par Daniel Mercier » ; boutons « Marquer comme réalisé », « Modifier »,
  « Marquer « à vérifier » », « Annuler l'évènement », « Supprimer ». Puis le formulaire de clôture :
  **« PRÉDICATEUR »** saisi après coup, « Pasteur Samuel Kouassi » (D-EVT-16 : inconnu à la
  programmation), et `EventCounterFields` : **150** participants, **45** invités (D-EVT-17), **6**
  conversions, **3** restaurations, **2** baptêmes ; puis le détail avec la pastille « Réalisé », la
  carte du prédicateur, « Évènement marqué comme réalisé. » et les cinq compteurs.
- **Animation** : i 0 → 12 retour arrière : le détail « Grande campagne de Paris » de P9 recule vers
  l'agenda (navigation « retour » de la pile). Cet agenda, comme celui derrière le détail de P11, compte
  désormais **3 « À venir »** : la « Grande campagne de Paris » (24 octobre, Paris · Ville) s'y range
  entre la « Campagne de quartier » et la « Retraite d'automne » (`A_VENIR_APRES_P9`, revue du 14/10). i 14 → 28 le détail du concert arrive de la droite ;
  i 28 → 40 il défile de 116 pt (deux lignes de plus depuis D-EVT-15) pour ramener « Marquer comme
  réalisé » à sa place (174 pt depuis la ligne « Invités »). i 44 appui « Marquer comme réalisé » ;
  fondu (i 48 → 56). Le prédicateur s'écrit (i 58 → 72, halo i 56 → 78), puis « 150 » (i 72), « 45 »
  (i 78), « 6 » (i 84), « 3 » (i 88), « 2 » (i 92), le curseur passant d'un champ à l'autre jusqu'à
  i 96. i 100 appui (y 766) ; fondu (i 104 → 112) vers le détail. i 118 → 132 zoom **1,1** (1,2
  avant), foyer y 450 : d'abord la pastille « Réalisé » et la carte du prédicateur (halos i 114 → 144),
  puis défilement de 180 pt (i 140 → 152) jusqu'à « Participants 150 / Invités 45 » et « compte dans
  les statistiques » (halos à partir de i 150), tenus jusqu'à la fin.
- **Légendes** : `Après l'évènement,` / `*il le clôture*` (i 6 → 56), puis `Le *prédicateur*,` /
  `les *invités*` (i 60 → fin) — D-EVT-16 / D-EVT-17 valorisés sans allonger le plan.
- **Transition** : coupe sur P11.

### P11 — « À vérifier » ne retire jamais l'action du total · 168 i (5,6 s) · images 2147 → 2315

- **À l'écran** : détail d'une action réalisée de l'assemblée Paris Sud : « Implantation d'église de
  maison », « 9 octobre 2026 », « Paris Sud · Assemblée », « Participants 8 », « Conversions 1 »,
  « Invités 3 », « Restaurations — », « Baptêmes — » (non saisis par Marc Lefèvre : tout est
  facultatif ; pas de prédicateur saisi, la carte n'apparaît donc pas), « Cet évènement compte dans les statistiques d’évangélisation. » ; boutons « Modifier »,
  **« Marquer « à vérifier » »**, « Supprimer ». Après l'appui : pastille **« À vérifier »**
  (`clay`, drapeau), carte « Marqué « à vérifier ». », texte « Marqué « à vérifier » : il reste compté
  dans les statistiques. », bouton devenu « Retirer « à vérifier » ».
  À droite du téléphone, **annotation vidéo** au style d'une carte KPI de l'app (`mossTint`) :
  « PARIS · ACTIONS COMPTÉES » **28**.
- **Animation** : i 0 → 15 le détail arrive ; i 16 → 30 il défile de 184 pt (trois lignes de plus
  depuis D-EVT-15 / D-EVT-17) jusqu'au bouton. i 35 appui « Marquer « à vérifier » ». i 39 → 55 : la
  pastille apparaît (ressort), la phrase change (halo), seules à l'écran ≈ 1 s ; i 40 → 54 le détail
  remonte à 100 pt pour montrer ensemble la pastille et « il reste compté ». i 77 → 93 le téléphone
  se décale à gauche, i 81 → 97 la carte KPI glisse depuis la droite, « 28 » ; i 99 → 119 le chiffre
  « tressaille » sans changer, puis (i 119) une coche `moss` « inchangé » apparaît sous la carte
  (annotation vidéo). Tenue jusqu'à i 168.
- **Légende** : `« À vérifier » ?` / `L'action *reste comptée*`
- **Transition** : I3 monte du bas.

### I3 — Intertitre « La hiérarchie » · 75 i (2,5 s) · images 2315 → 2390

Gabarit de I1 ; aplat sauge `#7A8B6F`, « 3 », **« La hiérarchie »**, `CHAPITRE 3 / 4`.

### P12 — À chaque dirigeant, son périmètre · 238 i (7,9 s) · images 2390 → 2628

- **À l'écran** (schéma) : quatre **boîtes emboîtées** aux coins arrondis, de l'intérieur vers
  l'extérieur. Chaque boîte porte en haut à gauche son niveau (JetBrains Mono, majuscules) et, sur son
  bord, une étiquette de rôle (pastille sauge, Inter 600 30 px) :

  | Boîte | Niveau | Rôle | Ce que montre la boîte |
  |---|---|---|---|
  | 1 | ASSEMBLÉE · PARIS NORD | Dirigeant d'assemblée | l'assemblée seule |
  | 2 | VILLE · PARIS | Dirigeant de ville | Paris Est, Paris Nord, Paris Sud |
  | 3 | RÉGION · ÎLE-DE-FRANCE | Dirigeant de région | Créteil, Paris, Versailles |
  | 4 | NATION · FRANCE | Coordinateur de nation | Auvergne-Rhône-Alpes, Hauts-de-France, Île-de-France |

- **Animation** : la caméra part serrée sur la boîte 1 (rôle « Dirigeant d'assemblée » allumé
  i 14 → 22), puis recule en trois temps (i 54, i 108, i 162 ; recul de 25 images) — chaque rôle reste
  seul allumé ≈ 1,1 s : à chaque recul, la boîte suivante se
  dessine autour (trait sauge 4 px qui se trace en 15 images), ses sous-boîtes sœurs apparaissent
  (pâles, en pointillés) puis passent **en plein contraste** — texte encre, bordure pleine sauge, petit
  compteur d'actions (Paris Est 7, Paris Sud 8 ; Créteil 11, Versailles 9 ; Auvergne-Rhône-Alpes 31,
  Hauts-de-France 24) — quand son étiquette de rôle s'allume : elles font partie de son périmètre (le
  pâle reste réservé au « hors de portée » de P7). L'étiquette s'allume pendant que la précédente
  s'atténue. i 200 → 214 : plan large, les quatre rôles se rallument, tenus jusqu'à i 238.
- **Légende** : `À chaque dirigeant,` / `*son périmètre*`
- **Transition** : fondu vers P13 (le téléphone remonte).
- **Règle illustrée** : D-EVT-07 — la visibilité suit le périmètre **géographique** du rôle (ce n'est
  pas la chaîne des superviseurs de Member Care). Les statistiques de chacun s'ouvrent sur ce même
  niveau (contrat § 6 : « sa nation pour un coordinateur, sa région pour un senior, sa ville pour un
  dirigeant de ville, son assemblée pour un DIRIGEANT_UNITE »). Volontairement non montré : la lecture
  seule, « par le haut », des évènements de la ville / région / nation d'un dirigeant.

### P13 — Le secrétariat suit tout le ministère · 162 i (5,4 s) · images 2628 → 2790

- **À l'écran** : onglet **Évènements** d'un compte du secrétariat, qui **s'ouvre sur « Statistiques »**
  (D-EVT-09 ; `isSecretariat(me) ? 'stats' : 'agenda'`) : sélecteur « Agenda » | « Statistiques »
  (actif) ; pastilles « Mois » / « Année » (active) / « Plage », « ‹ 2026 › » ; fil d'Ariane
  « France » ; **sept** cartes KPI sur quatre rangées (`EventStatsDrill`, D-EVT-15 / D-EVT-17) :
  « ACTIONS COMPTÉES » **106** (carte teintée), « PARTICIPANTS » **2331**, « INVITÉS » **697**,
  « CONVERSIONS » **143**, « RESTAURATIONS » **44**, « BAPTÊMES » **36**, « PROGRAMMÉS À VENIR »
  **14** + « 3 à clôturer » (`clay`), seule sur la dernière rangée, pleine largeur ; dessous : « Sont comptées les actions réalisées d'un type évangélique, une
  seule fois, au niveau où elles sont rattachées. « À vérifier » ne retire rien du total. »
- **Animation** : i 0 → 24 le téléphone monte, déjà sur l'onglet **« Évènements »** de la barre du bas
  (actif), ouvert sur « Statistiques », l'onglet par défaut du secrétariat : halo sur « Statistiques »
  i 44 → 80 (plein i 52 → 72). Pas d'appui sur « Évènements » : l'écran y est déjà, le geste ne
  produisait rien (retiré à la revue du 14/10). i 76 → 96 zoom 1,45 sur la grille KPI, foyer y 640
  (464 avant D-EVT-17) — les sept tuiles tiennent dans le cadre — (halo i 98 → 138), tenu jusqu'à i 136 ; dézoom
  i 136 → 156.
- **Légende** : `Le secrétariat suit` / `*tout le ministère*` (fondu achevé sur la dernière image, gelée
  sous I4 : plus de légende en filigrane).
- **Transition** : I4 monte du bas.
- **Note** : les données fictives ont **une seule nation** ; la racine est donc « France » (contrat § 6).
  Avec plusieurs nations, le fil d'Ariane commencerait par « Tout le ministère ».

### I4 — Intertitre « La géographie » · 75 i (2,5 s) · images 2790 → 2865

Gabarit de I1 ; aplat `earthDeep`, « 4 », **« La géographie »**, `CHAPITRE 4 / 4`.

### P14 — Les totaux remontent tout seuls · 218 i (7,3 s) · images 2865 → 3083

- **À l'écran** (schéma) : une **échelle verticale** de quatre cartes reliées par un trait, de bas en
  haut ; chaque carte reprend le gabarit des cartes de sous-niveau de l'app (icône de niveau de
  `EventStatsDrill` : maison, immeuble, carte, drapeau ; nom ; nombre en Fraunces) :
  « Assemblée · Paris Nord » **10** → « Ville · Paris » **27** → « Région · Île-de-France » **48** →
  « Nation · France » **105**.
- **Animation** : i 0 → 33 les cartes se posent de bas en haut. i 32 : un jeton « +1 » `moss`
  (mégaphone) naît sur Paris Nord, qui passe à **11** (i 38) ; le jeton monte le long du trait et
  s'arrête 14 images sur chaque carte, dont le nombre bascule à son arrivée : Paris **28** (i 80),
  Île-de-France **49** (i 116), France **106** (i 152). i 154 → 166 le jeton s'efface, halo sur la
  carte France, **tenue jusqu'à i 204** (≈ 1,3 s : l'aboutissement du plan, allongé à la revue du 14/10).
- **Légende** : `Les totaux` / `*remontent* tout seuls`
- **Transition** : le schéma s'efface (i 204 → 218) ; le téléphone de P15 monte.
- **Règle illustrée** : RG-ACT-05 (les statistiques somment en remontant l'arbre) ; rien n'est
  saisi aux niveaux supérieurs.

### P15 — De la nation jusqu'à l'assemblée · 176 i (5,9 s) · images 3083 → 3259

- **À l'écran** : statistiques du secrétariat (`EventStatsDrill`), période « Année » 2026, la page
  défilée de manière à montrer les cartes de sous-niveau (« Touchez une carte pour descendre d’un
  niveau. »). Chaque carte porte ses totaux, zéros compris (`figures` = `counterParts`, D-EVT-15 /
  D-EVT-17 : « N participants dont M invités · … ») — la ligne passe sur deux lignes dans la carte,
  comme dans l'app (valeurs : § 5.3) :
  1. fil d'Ariane « France » ; « Par région » : « Auvergne-Rhône-Alpes » **31** (« 540 participants dont
     162 invités · 37 conversions · 11 restaurations · 9 baptêmes »), « Hauts-de-France » **24** (« 410
     participants dont 118 invités · 26 conversions · 8 restaurations · 6 baptêmes »), « Île-de-France » **49** (« 1061
     participants dont 321 invités · 68 conversions · 22 restaurations · 19 baptêmes ») ; « Dont 2 actions rattachées
     directement à France, comptées dans aucun sous-niveau. »
  2. appui sur Île-de-France → fil « France › Île-de-France » ; « Par ville » : « Créteil » **11**
     (« 188 participants dont 55 invités · 12 conversions · 4 restaurations · 3 baptêmes »), « Paris » **28** (« 651
     participants dont 203 invités · 43 conversions · 15 restaurations · 13 baptêmes »), « Versailles » **9** (« 142
     participants dont 41 invités · 8 conversions · 2 restaurations · 2 baptêmes ») ; « Dont 1 action rattachée
     directement à Île-de-France, comptée dans aucun sous-niveau. »
  3. appui sur Paris → fil « France › Île-de-France › Paris » ; « Par assemblée » : « Paris Est »
     **7** (« 131 participants dont 40 invités · 9 conversions · 3 restaurations · 2 baptêmes »), « Paris Nord » **11**
     (« 214 participants dont 71 invités · 17 conversions · 6 restaurations · 5 baptêmes »), « Paris Sud » **8** (« 96
     participants dont 29 invités · 7 conversions · 2 restaurations · 3 baptêmes »).
- **Animation** : i 0 → 24 le téléphone monte, zoom 1,2 centré sur les cartes (page défilée de 560 pt ;
  380 avant D-EVT-15 : + 86,5 pt pour la rangée de KPI ajoutée, + 14,5 pt par carte ; 490 avant
  D-EVT-17 : + 70 pt pour la rangée de la tuile « Invités ») ; fil d'Ariane agrandi
  sous la légende (annotation, i 12 → 22). i 42 → 50 halo sur « Île-de-France », appui i 58 ;
  i 59 → 65 le niveau précédent s'estompe (opacité 0,6, comme dans l'app pendant le chargement) puis
  les nouvelles cartes arrivent en fondu (i 68 → 76), le fil d'Ariane s'allonge (halo sur le nouveau
  maillon). L'onde de chaque appui s'efface avant le niveau suivant (i 65 → 68, puis 139 → 142) : elle
  ne flotte ni sur « Versailles » ni sur les assemblées. Niveau lu ≈ 1,4 s ; i 118 → 142 halo sur « Paris », appui i 132 ; même mouvement
  (i 142 → 150). Tenue sur le niveau Paris jusqu'à i 176.
- **Légende** : `De la nation` / `*jusqu'à l'assemblée*`
- **Transition** : enchaînée — même écran en P16.

### P16 — Un évènement de ville compte une seule fois · 198 i (6,6 s) · images 3259 → 3457

- **À l'écran** : le niveau Paris de P15. Sous les trois cartes d'assemblée : **« Dont 2 actions
  rattachées directement à Paris, comptées dans aucun sous-niveau. »** À droite du téléphone,
  **annotation vidéo** : une étiquette « Concert de louange · ville de Paris » (le concert clôturé en P10)
  posée **juste sous la phrase**, pointe vers elle, dans l'espace libre au-dessus de la barre d'onglets —
  sur aucune carte d'assemblée ; et l'addition « 7 + 11 + 8 + 2 = 28 » (contrôle de cohérence du
  guide secrétariat, § 3).
- **Animation** : i 0 → 15 léger défilement (de 560 à 620 pt) pour amener la phrase au centre. i 18 → 45 zoom 1,5 sur la
  phrase, halo. i 38 → 58 l'étiquette « Concert de louange » glisse depuis la droite et se pose sous la
  phrase, **pas** sur une assemblée (les trois cartes restent à 7, 11, 8), lue jusqu'à i 88. i 88 → 102
  recul : le téléphone se décale à gauche. i 98 → 128 l'addition s'écrit terme à terme, « = Paris 28 »
  à i 122 → 132 ; **addition entière tenue i 132 → 174** (1,4 s). i 174 → 182 l'addition s'éteint, puis
  seulement i 183 → 193 le téléphone revient au centre (zoom 1,2 de P17).
- **Légende** : `Un évènement de ville` / `compte *une seule fois*`
- **Transition** : enchaînée — P17.
- **Règle illustrée** : D-EVT-04 (un évènement compte une fois, au niveau où il est rattaché, dans
  aucune assemblée).

### P17 — Par type, par mois · 158 i (5,3 s) · images 3457 → 3615

- **À l'écran** : appui sur « Paris Nord » → fil « France › Île-de-France › Paris › Paris Nord » ;
  KPI « Actions comptées » **11**, « Participants » **214**, « Invités » **71**, « Conversions » **17**,
  « Restaurations » **6**, « Baptêmes » **5**, « Programmés à venir » **2** + « 0 à clôturer » ; pas de cartes de
  sous-niveau (une assemblée n'en a pas) ; puis **« Par type »** (lignes chiffrées sur deux lignes) :
  Retraite 0 · Campagne **5** (« 51 participants dont 18 invités · 7 conversions · 2 restaurations ·
  3 baptêmes ») · Conférence 0 · Concert **2** (« 85 participants dont 30 invités · 4 conversions ·
  2 restaurations · 0 baptême ») · Implantation d'église de maison **1** (« 9 participants dont
  2 invités · 1 conversion · 0 restauration · 1 baptême ») · Action de grâce **3** (« 69 participants
  dont 21 invités · 5 conversions · 2 restaurations · 1 baptême ») · Autre 0 ; et **« Par mois »** :
  « janvier 2026 » … « décembre 2026 » (12 lignes, mois vides à 0), dont « septembre 2026 » **3**
  (« 100 participants dont 35 invités · 7 conversions · 3 restaurations · 0 baptême ») et « octobre
  2026 » **4** (« 58 participants dont 19 invités · 5 conversions · 0 restauration · 3 baptêmes »).
  Les lignes chiffrées restent sur deux lignes. En français, 0 et 1 sont au singulier (`_one` d'i18next) : « 0 baptême ».
- **Animation** : i 6 appui sur « Paris Nord » ; i 5 → 22 le niveau Paris s'estompe, Paris Nord arrive.
  Halo sur « Par type » i 36 → 84 (plein i 42 → 76). i 82 → 102 défilement jusqu'à « Par mois » (de 550
  à 1 304 pt ; 1 010 avant D-EVT-15, 1 234 avant D-EVT-17) ; halo
  sur « octobre 2026 · 4 » (i 104 → 110), tenu jusqu'à i 144.
- **Légende** : `Par *type*` / `et par *mois*`
- **Transition** : le téléphone descend et s'efface (i 144 → 158, comme `Plan9Fin`).

### P18 — Fin · 130 i (4,3 s) · images 3615 → 3745

- **À l'écran** (sans téléphone) : **« Chaque action compte. »** (Fraunces 600, 104 px, `ink`, le mot
  « compte » en `clay`), puis l'icône Shephr (tuile de P0) et le logotype « shephr » + point terre.
- **Animation** : phrase en fondu montant (i 8), icône en ressort (i 30), logotype (i 42). Tenue
  jusqu'à la fin (≈ 2 s une fois tout posé) ; pas de fondu au noir (la vidéo se termine sur l'image
  fixe, comme `Plan9Fin`). La musique s'éteint sur les 75 dernières images (i 55 → 130).
- **Légende** : la phrase elle-même.

---

## 5. Données fictives

Toutes inventées ; aucune donnée réelle de personne. Date de l'histoire : **mercredi 14 octobre 2026**
(barre d'état : « 11:10 », celle du `Telephone` existant).

### 5.1 Personnes

| Personne | Rôle | Apparaît |
|---|---|---|
| **Élise Durand** | simple membre de l'assemblée Paris Nord (aucun rôle de dirigeant) | P1–P7 (« Bon retour, Élise. », « ÉD », « Enregistré par ») |
| **Daniel Mercier** | dirigeant de la ville de Paris (`DIRIGEANT`) | P8–P11 (« Enregistré par » du concert) |
| Un compte du secrétariat | `SECRETARIAT` | P13, P15–P17 (aucun nom affiché) |

### 5.2 Arbre (un ministère, une nation)

```
France (Nation)
├── Auvergne-Rhône-Alpes (Région)
├── Hauts-de-France (Région)
└── Île-de-France (Région)
    ├── Créteil (Ville)
    ├── Paris (Ville)
    │   ├── Paris Est (Assemblée)
    │   ├── Paris Nord (Assemblée)   ← Élise
    │   └── Paris Sud (Assemblée)
    └── Versailles (Ville)
```

Le nom du nœud d'assemblée est **« Paris Nord »** : l'app ajoute elle-même « l'assemblée … »
(`events.scopeOf.UNIT`). Nommer le nœud « Assemblée Paris Nord » donnerait « l'assemblée Assemblée Paris
Nord ». Les sous-niveaux sont triés par nom (contrat § 6), comme dans l'ordre ci-dessus.

### 5.3 Statistiques (année 2026, état du 14/10 au soir)

Instantané montré en P13–P17 : les deux déclarations d'Élise et la clôture du concert (P10) y sont ;
la « Campagne de quartier » du 17/10 (P5–P6) et la « Grande campagne de Paris » du 24/10 (P9) n'y
sont **pas** encore (programmées, non comptées).

| Nœud | Actions comptées | Participants | Invités | Conversions | Restaurations | Baptêmes | Dont rattachées au nœud lui-même (n · part. · inv. · conv. · rest. · bapt.) |
|---|---|---|---|---|---|---|---|
| France | **106** | 2331 | 697 | 143 | 44 | 36 | 2 (320 · 96 · 12 · 3 · 2) |
| ↳ Auvergne-Rhône-Alpes | 31 | 540 | 162 | 37 | 11 | 9 | — |
| ↳ Hauts-de-France | 24 | 410 | 118 | 26 | 8 | 6 | — |
| ↳ Île-de-France | **49** | 1061 | 321 | 68 | 22 | 19 | 1 (80 · 22 · 5 · 1 · 1) |
| ↳↳ Créteil | 11 | 188 | 55 | 12 | 4 | 3 | — |
| ↳↳ Paris | **28** | 651 | 203 | 43 | 15 | 13 | 2 (210 · 63 · 10 · 4 · 3) |
| ↳↳↳ Paris Est | 7 | 131 | 40 | 9 | 3 | 2 | — |
| ↳↳↳ Paris Nord | **11** | 214 | 71 | 17 | 6 | 5 | — |
| ↳↳↳ Paris Sud | 8 | 96 | 29 | 7 | 2 | 3 | — |
| ↳↳ Versailles | 9 | 142 | 41 | 8 | 2 | 2 | — |

D-EVT-15 (JP 14/10) : les conversions reprennent à l'identique les anciennes « âmes gagnées » (renommage
sans perte) ; restaurations et baptêmes sont ajoutés. Un compteur non renseigné vaut 0 dans les sommes.
Les deux actions propres à Paris : le « Concert de louange » clôturé en P10 (150 · 45 invités · 6 · 3 ·
2) et une autre (60 · 18 invités · 4 · 1 · 1).

D-EVT-17 (JP 14/10) : les invités sont **inclus** dans les participants — invités ≤ participants à
chaque ligne, à chaque niveau (RG-EVT-09) ; non renseigné = 0 dans les sommes. Toutes les sommes
ci-dessous (assemblée → ville → région → nation, par type, par mois, cartes = KPI du niveau suivant)
sont vérifiées par un script qui relit `src/evenements/donnees.ts` (73 contrôles, tous verts).

Contrôles (actions ; participants ; conversions ; restaurations ; baptêmes) :
- Paris : 7 + 11 + 8 + 2 = 28 ; 131 + 214 + 96 + 210 = 651 ; 9 + 17 + 7 + 10 = 43 ; 3 + 6 + 2 + 4 = 15 ;
  2 + 5 + 3 + 3 = 13.
- Île-de-France : 11 + 28 + 9 + 1 = 49 ; 188 + 651 + 142 + 80 = 1061 ; 12 + 43 + 8 + 5 = 68 ;
  4 + 15 + 2 + 1 = 22 ; 3 + 13 + 2 + 1 = 19.
- France : 31 + 24 + 49 + 2 = 106 ; 540 + 410 + 1061 + 320 = 2331 ; 37 + 26 + 68 + 12 = 143 ;
  11 + 8 + 22 + 3 = 44 ; 9 + 6 + 19 + 2 = 36.
- Invités : Paris 40 + 71 + 29 + 63 = 203 ; Île-de-France 55 + 203 + 41 + 22 = 321 ; France
  162 + 118 + 321 + 96 = 697.

« Programmés à venir » : France 14 (« 3 à clôturer »), Paris Nord 2 (« 0 à clôturer »).

### 5.4 Les 11 actions comptées de Paris Nord en 2026

« — » = non renseigné (tout est facultatif, RG-ACT-03) ; la ligne d'un évènement (`EventFigures`)
n'affiche que les compteurs saisis.

| Date | Type | Lieu | Participants · invités · conversions · restaurations · baptêmes |
|---|---|---|---|
| mars | Campagne | — | 12 · 4 · 1 · 1 · — |
| avril | Campagne | — | 15 · 5 · 2 · — · 1 |
| mai | Action de grâce | — | 20 · 6 · 1 · 2 · — |
| juin | Implantation d'église de maison | — | 9 · 2 · 1 · — · 1 |
| septembre | Concert | — | 85 · 30 · 4 · 2 · — |
| septembre | Campagne | — | 6 · 2 · 1 · 1 · — |
| 26 septembre | Action de grâce | — | 9 · 3 · 2 · — · — |
| 3 octobre | Campagne | Marché de la Chapelle | 18 · 7 · 3 · — · 2 |
| 11 octobre | Action de grâce | Paris 18e | 40 · 12 · 2 · — · 1 |
| 14 octobre | Campagne (Élise, P2) | — | — |
| 14 octobre | Concert (Élise, hors ligne, P4) | Gare du Nord | — |

Par type : Campagne 5 (51 · 18 · 7 · 2 · 3), Concert 2 (85 · 30 · 4 · 2 · 0), Implantation 1
(9 · 2 · 1 · 0 · 1), Action de grâce 3 (69 · 21 · 5 · 2 · 1), Retraite / Conférence / Autre 0 → 11
(214 · 71 · 17 · 6 · 5).
Par mois : mars 1 (12 · 4 · 1 · 1 · 0), avril 1 (15 · 5 · 2 · 0 · 1), mai 1 (20 · 6 · 1 · 2 · 0), juin 1
(9 · 2 · 1 · 0 · 1), septembre 3 (100 · 35 · 7 · 3 · 0), octobre 4 (58 · 19 · 5 · 0 · 3), autres mois 0
→ 11 (214 · 71 · 17 · 6 · 5).
Compteurs d'Élise : avant P2 « 2 » en octobre / « 9 » en 2026 ; après P2 « 3 / 10 » ; après P4
« 4 / 11 ». Badge du bloc « Actions d’évangélisation » : 10 puis 11 (le bloc n'a pas de filtre de
période ; toutes les actions sont de 2026).

### 5.5 Évènements programmés (agenda)

| Évènement | Date | Rattachement | Créé par | Plans |
|---|---|---|---|---|
| Concert · « Concert de louange » | 10 octobre 2026 (passé → « À clôturer ») | Ville · Paris | Daniel | P8, P10 (clôturé : prédicateur « Pasteur Samuel Kouassi » saisi à la clôture ; 150 · 45 invités · 6 · 3 · 2) |
| Campagne · « Campagne de quartier », Paris 18e | 17 octobre 2026 | Assemblée · Paris Nord | Élise | P5 (prédicateur « Pasteur Jean-Marc Lefort » saisi en programmant), P6 (clôturé le 17/10 : 25 · 8 invités · 2 · 1 · 1), P8 |
| Campagne · « Grande campagne de Paris » | 24 octobre 2026 | Ville · Paris | Daniel | P9 |
| Retraite · « Retraite d'automne », Fontainebleau | 7 → 8 novembre 2026 | Assemblée · Paris Nord | dirigeant de Paris Nord | P3, P8 |

Paris : « À venir » = 2 avant P9, 3 après. Aucun évènement programmé aux niveaux Île-de-France ou
France dans ces données (sinon il apparaîtrait aussi dans l'agenda de Daniel, en lecture « par le
haut »). Autres lieux libres : « Paris 10e » (concert), « Paris 14e » (implantation de Paris Sud,
9 octobre 2026, 8 · 3 invités · 1 · — · —, sans prédicateur, posée « à vérifier » en P11).

Prédicateurs (D-EVT-16, texte libre, noms fictifs) : « Pasteur Jean-Marc Lefort » (Campagne de
quartier), « Pasteur Samuel Kouassi » (Concert de louange). Aucune statistique par prédicateur (plan
§ 8).

---

## 6. Fidélité à l'app

### 6.1 Écrans reproduits (mobile — l'usage principal)

| Plan(s) | Fichier(s) `shephr-app/mobile` | Ce qui est repris |
|---|---|---|
| P1 | `app/(tabs)/home.tsx`, `app/(tabs)/_layout.tsx` | en-tête date + « Bon retour, », pastille d'initiales, carte « Mes objectifs », `Tile` (surface `paper`, icône sur teinte à 10 %, titre Fraunces 17, indice Inter 11,5), barre d'onglets flottante |
| P2, P3, P4 | `app/events/declare.tsx` (formulaire + `SuccessScreen`), `components/Chip.tsx`, `Button.tsx`, `Label.tsx`, `Card.tsx` | ordre des champs, pastilles de type, carte de date + « Aujourd'hui », compteurs (`components/EventCounterFields.tsx` : « Participants » seul sans type, + conversions / restaurations / baptêmes pour un type évangélique, grille à 47 %, indication « Facultatif : … »), bandeau de rattachement, bouton grisé tant qu'aucun type, confirmation en ligne (bulle `moss`, coche) et en file (bulle `earthDeep`, nuage) ; `components/EventPreacherField.tsx` (D-EVT-16, après la date, type évangélique) ; « Participants » / « Invités » + aide « dont personnes extérieures » (D-EVT-17) |
| P3, P4, P5 | `components/EventMemberView.tsx`, `EventCounters.tsx`, `EventRow.tsx`, `EventAgenda.tsx` (`AgendaBlock`) | vue membre : titre « Mes actions », nom d'assemblée, compteurs mois / année, boutons « Déclarer » / « Programmer », blocs « À venir » et « Actions d’évangélisation », pastille « Mon action », ligne de chiffres `EventFigures` / `counterParts` (compteurs saisis seulement, « dont N invités », D-EVT-15 / D-EVT-17), ligne « Prédicateur : … » (`EventPreacherLine`, D-EVT-16) |
| P5, P9 | `app/events/plan.tsx`, `components/EventForm.tsx`, `components/SelectField.tsx` | formulaire de programmation, « PRÉDICATEUR » après les dates (D-EVT-16), « RATTACHEMENT » seulement s'il y a un choix (dirigeant), bandeau « … sera programmé pour … » |
| P5, P6, P10, P11 | `app/events/[id].tsx` (détail + `DoneForm`) | surtitre, pastilles de statut (`EventStatusPills`), carte de détail, phrases de comptage, boutons dérivés des droits (`canEdit`, `canFlag`), lignes « Conversions » / « Restaurations » / « Baptêmes » d'un type évangélique, clôture par `EventPreacherField` (prérempli, saisissable) + `EventCounterFields` (participants, invités, trois compteurs D-EVT-15) ; carte teintée du prédicateur sous les pastilles (micro `moss`, nom en Fraunces 18, D-EVT-16) ; ligne « Invités » après « Participants » (D-EVT-17) |
| P8 | `app/(tabs)/events/index.tsx` (`LeaderEventsTab`), `components/EventAgenda.tsx`, `EventPeriodPicker.tsx` | ordre « À clôturer » → « À venir » → « Réalisés », pastilles de compte, sélecteur de période |
| P13, P15–P17 | `components/EventStatsDrill.tsx` | fil d'Ariane, 7 KPI (actions, participants, invités — D-EVT-17 —, conversions, restaurations, baptêmes — D-EVT-15 —, programmés à venir), règle de comptage, cartes par sous-niveau avec leurs totaux (« dont N invités »), phrase « Dont N … », « Par type », « Par mois » |
| P0, P18 | `components/Wordmark.tsx`, `assets/logo-512.png` | logotype « shephr » + point terre, icône |

Palette (`mobile/theme/colors.ts`) : `moss #1E3A2F`, `mossDeep #16291F`, `mossSoft #2E5142`,
`mossTint rgba(30,58,47,0.06)`, `parchment #E8DCC4` (fond des écrans, `ScreenShell`),
`parchmentDeep #D7C7A6` (bouton « doux »), `paper #F5ECD8` (cartes), `paper2 #FBF5E6`,
`earth #C9956B`, `earthDeep #A7754B`, `clay #B86A4A`, `ink #2A2620`, `ink2 #5C544A`, `ink3 #8B8275`,
`white #F2E9D2` ; rayons 10 / 16 / 22 / 28. Polices (`mobile/theme/typography.ts`) : **Fraunces**
(titres, chiffres), **Inter** (texte), **JetBrains Mono** (surtitres, compteurs) — toutes trois
disponibles dans `@remotion/google-fonts`. Icônes : Ionicons de l'app ↔ `react-icons/io5`
(`IoMegaphoneOutline`, `IoCalendarOutline`, `IoCheckmark`, `IoCheckmarkDone`, `IoCloudUploadOutline`,
`IoLocationOutline`, `IoHomeOutline`, `IoBusinessOutline`, `IoMapOutline`, `IoFlagOutline`,
`IoTimeOutline`, `IoPersonOutline`, `IoListOutline`…).

### 6.2 Libellés exacts repris de `mobile/utils/i18n/locales/fr.json`

| Clé | Texte |
|---|---|
| `dashboard.welcomeBack` | Bon retour, |
| `dashboard.myGoals` / `myGoalsSub` | Mes objectifs / But Quinquennal — engagements & état actuel |
| `dashboard.tiles.events` / `eventsHint` | Déclarer une action / Évangélisation |
| `dashboard.tiles.structure` / `structureHint` | Créer une assemblée / Dans la ville de votre choix |
| `dashboard.tiles.cantique` / `cantiqueHint` | Cantiques / Chris est Vainqueur |
| `tabs.home`, `goals`, `assembly`, `events`, `profile` | Accueil · Objectifs · Assemblée · Évènements · Profil |
| `events.declare.kicker` / `title` | Évangélisation / Déclarer une action |
| `events.declare.intro` | Le type et la date suffisent : tout le reste est facultatif. |
| `events.declare.type` / `date` / `place` / `participants` / `note` | Type d'action / Date de l'action / Lieu / Participants / Note |
| `events.declare.conversions` / `restorations` / `baptisms` / `countersHint` (D-EVT-15) | Conversions / Restaurations / Baptêmes / Facultatif : laissez vide ce que vous ne savez pas. |
| `events.declare.preacher` / `preacherPlaceholder` (D-EVT-16) | Prédicateur / Nom du prédicateur |
| `events.declare.guests` / `guestsHint` (D-EVT-17) | Invités / dont personnes extérieures |
| `events.mine.preacher` (D-EVT-16) | Prédicateur : {name} |
| `events.mine.guests_*` / `ofWhichGuests_*` (D-EVT-17) | {n} invité(s) / dont {n} invité(s) — 0 et 1 au singulier |
| `events.stats.kpiGuests` (D-EVT-17) | Invités |
| `events.declare.placePlaceholder` / `notePlaceholder` | Ville, quartier, lieu-dit… / Un commentaire, en une ou deux lignes |
| `common.today` | Aujourd'hui |
| `events.declare.recordedFor` + `events.scopeOf.UNIT` | Cette action sera enregistrée pour l'assemblée {nom}. |
| `events.declare.submit` | Enregistrer |
| `events.declare.footnote` | Votre action compte dès son enregistrement, sans validation. Sans réseau, elle est gardée sur votre téléphone et envoyée dès le retour de la connexion. |
| `events.declare.successTitle` / `successFor` | Action enregistrée 🙏 / Elle est enregistrée pour {nom}. |
| `events.declare.successQueued` | Pas de réseau pour l'instant : elle est gardée sur votre téléphone et partira d'elle-même dès le retour de la connexion. |
| `events.declare.another` / `finish` | Déclarer une autre action / Terminer |
| `events.tab.kicker` | Évènements |
| `events.mine.title` | Mes actions |
| `events.member.subtitle` | Les actions de votre assemblée : les vôtres, celles des autres membres et de vos dirigeants. |
| `events.mine.thisMonth` / `thisYear` | En {mois} / En {année} (affichés en majuscules par `Label`) |
| `events.mine.countedHint` | Sont comptées les actions réalisées d'un type évangélique. |
| `events.tab.declare` / `plan` | Déclarer / Programmer |
| `events.member.doneTitle` | Actions d’évangélisation |
| `events.mine.ownBadge` | Mon action |
| `events.mine.participants_*` / `conversions_*` / `restorations_*` / `baptisms_*` | {n} participant(s) / {n} conversion(s) / {n} restauration(s) / {n} baptême(s) — 0 et 1 au singulier |
| `events.plan.title` / `intro` / `submit` | Programmer un évènement / Il apparaîtra dans l'agenda de votre périmètre. Les chiffres (participants, invités et, pour une action d’évangélisation, conversions, restaurations, baptêmes) se saisissent une fois l'évènement réalisé. / Programmer |
| `events.form.type` / `title` / `titlePlaceholder` / `date` / `endDate` / `endDateNone` / `scope` | Type d'évènement / Intitulé / Ex. Conférence de rentrée (facultatif) / Date / Fin / Un seul jour / Rattachement |
| `events.form.plannedFor` + `events.scopeOf.*` | Cet évènement sera programmé pour l'assemblée {nom} / la ville {nom}. |
| `events.levels.*` | Nation · Région · Ville · Assemblée |
| `events.status.PLANNED` / `DONE` | Programmé / Réalisé |
| `events.detail.kickerEvangelism` | Évangélisation |
| `events.detail.plannedHint` | Programmé : il comptera une fois marqué comme réalisé. |
| `events.detail.markDone` / `markDoneIntro` / `markedDone` | Marquer comme réalisé / Saisissez ce qui s’est passé — tout est facultatif. Un champ laissé vide garde sa valeur. / Évènement marqué comme réalisé. |
| `events.detail.counted` / `countedToVerify` | Cet évènement compte dans les statistiques d’évangélisation. / Marqué « à vérifier » : il reste compté dans les statistiques. |
| `events.detail.flag` / `unflag` / `flagged` | Marquer « à vérifier » / Retirer « à vérifier » / Marqué « à vérifier ». |
| `events.detail.scope` / `author` / `cancel` | Rattachement / Enregistré par / Annuler l'évènement |
| `events.mine.toVerify` | À vérifier |
| `events.tab.title` / `subtitle` | Agenda & statistiques / Les évènements de votre périmètre et les actions d’évangélisation réalisées. |
| `events.tab.agenda` / `stats` | Agenda / Statistiques |
| `events.agenda.node` / `allPerimeter` | Périmètre affiché / Tout mon périmètre |
| `events.agenda.toClose` / `toCloseSub` / `toCloseBadge` | À clôturer / Programmés dont la date est passée : à marquer comme réalisés ou à annuler. / À clôturer |
| `events.agenda.upcoming` / `upcomingSub` | À venir / Programmés à partir d'aujourd'hui. |
| `events.agenda.done` / `doneSub` | Réalisés / Évènements et actions réalisés sur la période choisie. |
| `events.period.month` / `year` / `range` | Mois / Année / Plage |
| `events.stats.kpiCount` / `kpiParticipants` / `kpiConversions` / `kpiRestorations` / `kpiBaptisms` / `kpiAgenda` / `toClose_*` | Actions comptées / Participants / Conversions / Restaurations / Baptêmes / Programmés à venir / {n} à clôturer |
| `events.stats.countingRule` | Sont comptées les actions réalisées d'un type évangélique, une seule fois, au niveau où elles sont rattachées. « À vérifier » ne retire rien du total. |
| `events.stats.byLevel.ZONE` / `LOCALITY` / `UNIT` | Par région / Par ville / Par assemblée |
| `events.stats.drillHint` | Touchez une carte pour descendre d’un niveau. |
| `events.stats.ownLevel_*` | Dont {n} action(s) rattachée(s) directement à {nom}, comptée(s) dans aucun sous-niveau. |
| `events.stats.byType` / `byMonth` | Par type / Par mois |
| `common.edit` / `common.delete` | Modifier / Supprimer |

Types d'évènement : libellés et ordre du catalogue initial
(`cmfipraise-backend/src/main/resources/db/changes/events/01-events.sql`) : Retraite, Campagne,
Conférence, Concert, Implantation d'église de maison, Action de grâce, Autre — tous évangéliques.

### 6.3 Écarts assumés et points relevés dans l'app

- **Le « +1 » animé des compteurs** (P3, P4) et des cartes (P14) est une mise en scène : dans l'app, la
  vue s'affiche directement avec le chiffre à jour.
- **Le calendrier de choix de date** (`DatePickerModal`) n'est pas montré (P5, P9) : la date change
  avec une bascule. Ce n'est pas une saisie au clavier dans l'app.
- **Saut dans le temps** (P6) : signalé par la pastille « 17 OCT. » (annotation vidéo). Dans l'app,
  « Marquer comme réalisé » est grisé avant la date (« Disponible à partir de la date de l’évènement. »),
  ce que montre P5.
- **Hors ligne** (P4) : la vue « Mes actions » n'est montrée qu'au retour du réseau (voir P4).
- **Annotations vidéo** (cadenas de P7, carte « PARIS · ACTIONS COMPTÉES » et coche « inchangé » de
  P11, étiquette et addition de P16, schémas de P7 / P12 / P14) : elles ne sont pas des écrans de l'app
  et sont dessinées hors du téléphone ou en surimpression clairement distincte.
- **Date de l'accueil** : l'app affiche « Octobre 14, 2026 » (`home.tsx` : mois capitalisé, jour,
  virgule, année — ordre anglais). Reproduit tel quel ; à corriger dans l'app si ce n'est pas voulu
  (« 14 octobre 2026 »), et la vidéo suivra.
- **Tuile « Cantiques »** : l'indice est « Chris est Vainqueur » dans `fr.json` — coquille probable de
  « Christ est Vainqueur ». Elle est visible en P1 (deuxième rangée de tuiles). À corriger dans l'app,
  ou bien cadrer P1 sur la première rangée seulement.
- **Pavé numérique** : dans l'app, toucher un compteur ouvre le pavé numérique du téléphone
  (`keyboardType="number-pad"`). Comme pour l'intitulé de P5 / P9, la vidéo ne montre aucun clavier :
  les chiffres s'écrivent directement dans les champs (P6, P10). Omission délibérée : le pavé
  masquerait le formulaire, et le film suit la même convention partout.
- **Coupures des lignes de chiffres** : les totaux à quatre parts (P15 → P17) passent sur deux
  lignes. La vidéo lie chaque nombre à son nom et le séparateur au mot qui le précède par une espace
  insécable (`accorde` / `chiffres` de `textes.ts`) : jamais « · 5 » / « baptêmes » à la coupure, ni
  de ligne commençant par « · ». Le texte reste celui de l'app ; l'app, elle, peut couper n'importe où.
- **« PROGRAMMÉS À VENIR »** : sur la grille de sept tuiles (P13, P15 → P17, D-EVT-17), elle reste
  seule sur la quatrième rangée et s'étire sur toute la largeur (`flexBasis` 47 % + `flexGrow`),
  libellé sur une ligne. C'est aussi le cas dans l'app : laissé tel quel par fidélité.
- **Prédicateur dans le détail** : la vidéo suit `mobile/app/events/[id].tsx` — carte teintée sous les
  pastilles, micro `moss`, libellé « Prédicateur », nom en Fraunces 18 couleur `ink`. Le web
  (`EventDetail.tsx`) l'affiche autrement : ligne juste après la date, nom en vert (`--green-800`).
  Le film étant tourné sur mobile, c'est la présentation mobile qui est reproduite.
- **Invités > participants** (RG-EVT-09) : la vidéo saisit toujours des invités cohérents ; le message
  « Les invités ne peuvent pas dépasser le nombre de participants. » et le bouton grisé ne sont pas
  montrés.
- **Détails « Réalisé » plus hauts** (D-EVT-16 / D-EVT-17) : la carte du prédicateur et la ligne
  « Invités » ne laissent plus tenir pastille, chiffres et « il compte » d'un seul cadrage ; P6 et P10
  les montrent en deux temps (zoom 1,1, puis défilement).
- **Grands nombres sans séparateur** : les KPI de l'app affichent la valeur brute (« 2331 »,
  « 1061 ») ; la vidéo fait de même.

### 6.4 Chaque affirmation, vérifiée

| Affirmation (plan) | Source |
|---|---|
| Tuile « Déclarer une action » sur l'accueil (P1) | `home.tsx` (`hasEvents && canDeclareEvents(me)`), plan § 6.3, spec § 4.1 |
| Le type et la date suffisent, date préremplie à aujourd'hui (P2) | RG-ACT-03 ; `declare.tsx` (`canSubmit`, date = `new Date()`) |
| Rattachement automatique, sans sélecteur pour un membre (P2) | RG-ACT-02, RG-EVT-02 ; contrat § 3.2 (`scopes.length === 1`) |
| Elle compte tout de suite, sans validation (P3) | RG-ACT-04, D-EVT-02 (créée réalisée), `events.declare.footnote` |
| Compteurs du mois / de l'année de son assemblée (P3) | D-EVT-14, contrat § 3.12 ; `EventMemberView` (`/stats` sur l'année) |
| Sans réseau : gardée, envoyée au retour (P4) | RG-ACT-08 ; `declare.tsx` (`enqueueEvent`), `EventQueueSync` (vidage au retour réseau) |
| Un membre programme dans son assemblée (P5) | D-EVT-13, RG-EVT-03 ; `plan.tsx`, `EventMemberView` (bouton si `canPlan`) |
| Un programmé ne compte qu'une fois réalisé ; participants et compteurs à la clôture (P5, P6, P10) | D-EVT-02, D-EVT-03 ; `events.detail.plannedHint` ; `DoneForm` |
| Conversions, restaurations, baptêmes : facultatifs, pour un type évangélique seulement ; « Participants » pour tous (P2, P6, P10) | D-EVT-15, RG-ACT-03 ; `EventCounterFields.tsx`, `utils/events.ts` (`counterKeysFor`) |
| Prédicateur : texte libre facultatif d'un type évangélique, après le type et la date, en évidence dans le détail et sur les lignes, saisissable à la programmation et à la clôture (P2, P5, P6, P8, P10) | D-EVT-16, RG-EVT-08 ; `EventPreacherField.tsx`, `EventForm.tsx`, `declare.tsx`, `[id].tsx` (`closingPreacher`), `EventRow.tsx` (`EventPreacherLine`) |
| Invités : tout type, après « Participants », inclus dans les participants (P2, P6, P8, P10, P11, P13, P15–P17) | D-EVT-17, RG-EVT-09 ; `EventCounterFields.tsx`, `utils/events.ts` (`GENERAL_COUNTERS`, `counterParts`, `guestsExceedParticipants`), `EventStatsDrill.tsx` (KPI `kpiGuests`) |
| Les statistiques somment les trois compteurs à chaque niveau (P13, P15–P17) | D-EVT-15, RG-EVT-08 ; `EventStatsDrill.tsx` (`figures`, KPI) |
| Clôture possible à partir de la date (P6) | RG-EVT-05 ; `[id].tsx` (`notYetHeld`) |
| Le membre ne voit que son assemblée (P7) | D-EVT-14, D-EVT-07 ; contrat § 3.5 |
| Agenda : à clôturer / à venir / réalisés du périmètre (P8) | plan § 6.2 / § 6.3 ; `EventAgenda.tsx` |
| Le dirigeant voit les programmés des membres (P8) | D-EVT-13 (« les dirigeants du périmètre gardent leurs droits ») |
| Programmer à son niveau ou en dessous ; son niveau par défaut (P9) | RG-EVT-03, contrat § 3.2 (nœud par défaut, ordre des nœuds) |
| Le dirigeant clôture (P10) | RG-EVT-04, RG-EVT-06 |
| « À vérifier » : dirigeants du périmètre, ne retire jamais du total (P11) | RG-ACT-07, D-EVT-03, RG-EVT-04 ; `events.detail.countedToVerify` |
| Chaque dirigeant voit son périmètre ; statistiques ouvertes à son niveau (P12) | D-EVT-07 ; contrat § 6 (« Racine sans nœud ») |
| Le secrétariat voit tout le ministère, onglet Statistiques par défaut (P13) | D-EVT-07, D-EVT-09 ; `events/index.tsx` (`isSecretariat`) |
| Les totaux remontent automatiquement (P14) | RG-ACT-05 ; plan § 5.3 (agrégation en mémoire) |
| Descente nation → région → ville → assemblée (P15) | D-EVT-09, plan § 6.2 ; `EventStatsDrill` |
| Un évènement de ville compte une fois, à la ville, dans aucune assemblée (P16) | D-EVT-04 ; `events.stats.ownLevel_*` ; guide secrétariat § 3 et § 5 |
| Par type et par mois (P17) | plan § 5.3 ; contrat § 6 (`byType` ordre du catalogue, `byMonth` 12 mois) |
| Aucun objectif chiffré montré (toute la vidéo) | D-EVT-06 |

---

## 7. Réalisation dans `cmfipraise-motion`

- **Ne pas toucher à la vidéo « Catégories »** : `Root.tsx` gagne une troisième `<Composition
  id="EvenementsFR" … durationInFrames={DUREE_EVENEMENTS} fps={30} width={1080} height={1920} />`
  (durée calculée par `Video.tsx` depuis les `DUREE_P*` des plans et `DUREE_INTERTITRE`) ; `CategoriesFR` /
  `CategoriesEN`, `src/Video.tsx`, `src/textes.ts`, `src/donnees.ts`, `src/theme.ts` et `src/plans/`
  restent tels quels.
- **Arborescence proposée** : `src/evenements/` — `theme.ts` (palette et polices Shephr ci-dessus),
  `textes.ts` (toutes les légendes et libellés FR de ce storyboard), `donnees.ts` (§ 5), `Video.tsx`
  (enchaînement des plans par `Series`, durées exportées par chaque plan comme dans le projet),
  `plans/` (P0 … P18, intertitres par un composant `Intertitre` commun), `ecrans/` (écrans Shephr
  redessinés : accueil, déclarer, confirmation, vue membre, programmer, détail, clôture, agenda,
  statistiques) et `ui/` (pastille de chapitre, barre d'onglets Shephr, schémas).
- **Réutilisé tel quel** : `ui/Telephone`, `ui/Plateau`, `ui/Pile` (arrivée par la droite),
  `ui/Scene`, `anim.doux`, le principe du `Badge` de `Plan6HorsLigne`.
- **Composants partagés à paramétrer sans changer leur rendu actuel** : `ui/Legende` (police, couleur
  du texte, couleur du mot mis en avant — props facultatives dont les valeurs par défaut sont les
  actuelles) et `ui/Toucher` (couleur de l'onde, aujourd'hui bleu CMFI ; `moss` pour Shephr). Après
  modification, rendre quelques images de `CategoriesFR` avant / après pour s'assurer qu'elles sont
  identiques. À créer : une modale qui monte du bas (`declare`, `plan`) et un fond `FondShephr`.
- **Logo** : copier `shephr-app/mobile/assets/logo-512.png` dans `public/shephr/logo.png`.
- **Musique** : `public/audio/dieu-fait-toutes-choses-nouvelles.mp3` (fournie par JP le 14/10,
  7 min 32), `PISTE_AUDIO` en tête de `src/evenements/Video.tsx`. L'orchestre entre en plein à 70,5 s
  du fichier ; le calage est **calculé depuis le découpage** (`CALAGE_AUDIO`) : on vise l'intertitre
  « La hiérarchie » ; s'il tombe avant 70,5 s, la piste démarre en cours de chant (`trimBefore`) ;
  s'il tombe après, à 2 s au plus, le chant part du début du fichier, décalé d'autant dans la vidéo
  (`Sequence from`) ; au-delà, l'orchestre est aligné sur l'intertitre « Le dirigeant ». Avec le
  découpage actuel, « La hiérarchie » est à 77,2 s (6,7 s trop tard) : l'orchestre éclate sur
  « Le dirigeant » (image 1 406 = 46,9 s), la vidéo démarre à 23,6 s du fichier (`trimBefore` 709). Fondu d'entrée de
  12 images, fondu de sortie de 75 images (2,5 s) pris sur le plan de fin. Changer une durée de plan
  recale tout seul la musique.
- **Scripts** : ajouter `"render:evenements": "remotion render EvenementsFR out/evenements-fr.mp4"`
  dans `package.json`, et une ligne au `README.md`.
- **Captures de contrôle** : `npx remotion still EvenementsFR <fichier.png> --frame=<n>` (images
  repères : intertitres 115, 1446, 2355, 2830 ; P5 « Accueil » 808, onglet 866, « Programmer » 922 ;
  P8 onglet 1510 ; P9 « Programmer » 1749 ; P13 « Statistiques » 2688 ; P14 France 3055 ; P16 addition
  3409 ; fin 3732).

---

## 8. Points à valider par JP

1. Le découpage en 4 chapitres et la durée : 124,8 s après le retour du 14/10 (« trop rapide », viser
   ≈ 2 min).
2. Les légendes (§ 4), une par plan.
3. Les données fictives (§ 5) : prénoms, villes, chiffres.
4. La date de l'accueil (« Octobre 14, 2026 ») et la coquille « Chris est Vainqueur » : corriger dans
   l'app avant le tournage, ou cadrer autrement (§ 6.3).

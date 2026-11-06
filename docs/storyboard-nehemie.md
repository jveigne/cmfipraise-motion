# Storyboard — motion « Offre Néhémie » (Shephr), version française

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composition Remotion **`NehemieFR`** à enregistrer par
> l'intégration (`src/nehemie/Video.tsx` › `VideoNehemie`, durée `DUREE_NEHEMIE`), MP4
> `out/nehemie-fr.mp4` (script proposé : `"render:nehemie": "remotion render NehemieFR out/nehemie-fr.mp4"`).
> Durée : **2 550 images = 85,0 s**. Français, **sans voix off**, **aucun prix nulle part** ; musique
> « Dieu fait toutes choses nouvelles », comme « Étude » (§ 5).
> Rédigé et codé le 27/10/2026 dans `src/nehemie/` ; ce document suit le code.
>
> Sources vérifiées :
> - commande : `cmfipraise-backend/docs/shephr/27_10_2026/05_Plan_Offres_Caleb_Nehemie.md` § 9 V2
>   (contenu, format), § 1 (l'offre), § 3.3 et § 3.5 (journal de ville, évènements dans la ville),
>   § 3.8 (nom, sous-titre, verset), D-OFF-05, D-OFF-12, P-08 ;
> - règles du suivi de ville : `02_Contrat_API_Abonnement_Ville.md`, D-ABO-21 (qui voit), D-ETU-42,
>   D-ETU-55 ;
> - écrans : `shephr-app/web/src/pages/CityStudy.tsx` (onglets Assemblées et Membres),
>   `components/Sidebar.tsx`, `components/EventStatsDrill.tsx`, `components/ui.tsx`,
>   `theme/styles.css` ; libellés : `web/src/i18n/locales/fr.json` (§ 7.2).

---

## 1. Ce que la vidéo doit faire comprendre

Public : **le pasteur et les responsables d'une ville** (dirigeants de ville, de région, de nation).
Une idée par plan, sans jargon (pas de « droit `ETUDE_SUIVI` », « `LOCALITY` », « abonnement »).

| Partie | Message |
|---|---|
| **Ouverture** | « Levons-nous, et bâtissons ! » (Néhémie 2 : 18, Louis Segond 1910) ; la muraille se bâtit pierre à pierre. Puis le nom : **Offre Néhémie — Le suivi de toute ma ville**. |
| **Pour qui** | Le pasteur et les responsables de la ville, au-dessus de la ville et de **toutes** ses assemblées ; sur l'espace web, le menu « Suivi de la ville ». |
| **1 · Le Message de Bertoua** | Chaque assemblée, leçon par leçon (✓ / –) ; chaque membre, enseigné ou non enseigné : on sait qui accompagner. |
| **2 · Le journal de la ville** | Les réunions de toute la ville (réunions, présence, fractions de pain, l'assemblée sans compte rendu depuis 3 semaines) — **des nombres, jamais de noms** ; le journal en PDF. |
| **3 · Les évènements** | Les fruits de la ville et les évènements **assemblée par assemblée** (la vue à l'intérieur de la ville). |
| **Une ville, tous ses responsables** | La ville bâtie de ses six assemblées ; de la ville à la nation, chacun de ses responsables la suit. |
| **Fin** | « Disponible sur l'espace web Shephr » + Shephr. |

**Formulations retenues (exactitude).**
- « Tous ses responsables » = les comptes qui voient la ville (D-ABO-21 : dirigeants de la ville, de
  sa région, de sa nation ; LEADER / SECRETARIAT) — montrés par trois silhouettes « VILLE »,
  « RÉGION », « NATION ». Les dirigeants d'assemblée ne sont **pas** montrés (ils n'ont pas cette vue).
- « Jamais de noms » ne vaut que pour le **journal** (D-OFF-05 : `attendeeCount`, aucun nom de
  présent) ; l'onglet Membres de Bertoua, lui, nomme les membres (c'est l'écran livré) — la vidéo
  ne dit pas le contraire.
- Évènements : la vidéo montre la répartition **par assemblée** d'une ville (ce que l'offre ouvre,
  D-OFF-12) ; elle ne prétend pas que les totaux de la ville sont payants.
- Aucun prix, aucun « payer », « s'abonner », « carte », « code » à l'image. Le bouton « Journal
  PDF » et les exports sont des libellés de l'app, pas des incitations.

---

## 2. Principes de mise en scène

- **Écrans de l'espace web**, pas de l'app mobile (la vidéo finit sur « Disponible sur l'espace web
  Shephr ») : une **fenêtre de navigateur** sans marque (`src/nehemie/ui/Navigateur.tsx` : trois
  pastilles, onglet « shephr · Administration », barre d'adresse `www.shephr.org/study/city` — en P4, `www.shephr.org/study` (page d'origine) jusqu'au
  clic sur « Suivi de la ville », D-FIX vidéos, JP 29/10),
  960 × 1 388 px posée à x = 60, y = 452. La page est dessinée en px CSS dans une vue de **600 px**
  (mise en page étroite du web, `@media (max-width: 900px)` : barre `.mobile-topbar`, menu en
  tiroir) à l'échelle **1,6** — la taille du texte des téléphones des autres vidéos.
- Pilotage à la **souris** (`Curseur` : flèche, onde au clic), pas au doigt.
- Jetons de couleur du web recopiés de `theme/styles.css` (`src/nehemie/web.ts`) ; primitives
  redessinées (`ui/Web.tsx` : `.card`, `.kpi`, `table.tbl` zébrée, `.badge`, `.tabs`, `Field` /
  `Picker`, `.btn.sm`, `.sidebar`).
- **Légendes** : `LegendeDocuments` (via `LegendeEtude`), en haut (y 130 → 330), 2 lignes au plus,
  mot clé en argile, typographie française (U+202F avant ! ? ;, U+00A0 avant : et dans « »).
- **Pastilles de partie** (`PastillePartie` de « Journal ») et **intertitres** de 2,5 s (gabarit
  d'« Étude », textes de cette vidéo, `ui/Decor.tsx`) :

  | Partie | Plans | Pastille | Couleur |
  |---|---|---|---|
  | Ouverture | P1–P2 | aucune | — |
  | Pour qui | P3–P4 | `POUR QUI` | sauge `#7A8B6F` |
  | 1 · Le Message de Bertoua | P5–P6 | `1 · LE MESSAGE DE BERTOUA` | `moss #1E3A2F` |
  | 2 · Le journal de la ville | P7 | `2 · LE JOURNAL DE LA VILLE` | `earthDeep #A7754B` |
  | 3 · Les évènements | P8 | `3 · LES ÉVÈNEMENTS` | `clay #B86A4A` |
  | Une ville / Fin | P9–P10 | aucune | — |

  Intertitres : « 1 · Le Message de Bertoua — Toutes les assemblées, leçon par leçon. »,
  « 2 · Le journal de la ville — Toutes les réunions, sans aucun nom. », « 3 · Les évènements —
  À l'intérieur de la ville. » L'aplat recouvre le plan précédent (figé 10 images) et découvre le
  suivant (figé 10 images), comme dans « Étude ».
- **Rythme** (retours de JP sur les vidéos précédentes : « trop rapide ») : chaque légende tient
  2,5 à 4 s, une seule action par légende, poses longues entre les gestes, intertitres de 2,5 s.
- **Métaphore** : la muraille de Néhémie. Au verset, quatre rangées de pierres se posent ; en P9,
  la ville se bâtit de six pierres, une par assemblée, et l'offre la couvre.
- **Fond** : `FondShephr` (paper2 + halos lents).

---

## 3. Découpage

| N° | Partie | Images (début → fin) | Durée | Idée |
|---|---|---|---|---|
| P1 | Ouverture | 0 → 195 | 195 i · 6,5 s | « Levons-nous, et bâtissons ! » — Néhémie 2 : 18 · Louis Segond 1910 ; la muraille se bâtit |
| P2 | Ouverture | 195 → 330 | 135 i · 4,5 s | « Offre Néhémie » — « Le suivi de toute ma ville » |
| P3 | Pour qui | 330 → 510 | 180 i · 6,0 s | Le pasteur et les responsables, au-dessus de Douala et de ses six assemblées |
| P4 | Pour qui | 510 → 645 | 135 i · 4,5 s | L'espace web : le menu, « Suivi de la ville » |
| — | intertitre | 645 → 720 | 75 i · 2,5 s | « 1 · Le Message de Bertoua » |
| P5 | 1 · Bertoua | **720** → 1020 | 300 i · 10,0 s | Assemblées × leçons : les coches tombent — **montée du chant (24,0 s)** ; Bonamoussadi 5 / 5, Deïdo 0 / 5 |
| P6 | 1 · Bertoua | 1020 → 1260 | 240 i · 8,0 s | Membres : enseigné / non enseigné ; filtre « Non enseigné » → 14 membres |
| — | intertitre | 1260 → 1335 | 75 i · 2,5 s | « 2 · Le journal de la ville » |
| P7 | 2 · Journal | 1335 → 1695 | 360 i · 12,0 s | Vie d'assemblée de la ville : synthèse, alerte Deïdo, tableau par assemblée ; le journal PDF |
| — | intertitre | 1695 → 1770 | 75 i · 2,5 s | « 3 · Les évènements » |
| P8 | 3 · Évènements | 1770 → 2115 | 345 i · 11,5 s | Les fruits de la ville ; par assemblée ; Akwa — **plan tampon** |
| P9 | Une ville | **2115** → 2370 | 255 i · 8,5 s | La ville bâtie de ses assemblées ; ville, région, nation — **entrée de l'orchestre (70,5 s)** |
| P10 | Fin | 2370 → 2550 | 180 i · 6,0 s | « Disponible sur l'espace web Shephr » |

Totaux : ouverture 11,0 s · pour qui 10,5 s · Bertoua 20,5 s (intertitre compris) · journal 14,5 s ·
évènements 14,0 s · une ville 8,5 s · fin 6,0 s → **2 550 images = 85,0 s**, **10 plans** et
3 intertitres (cible du plan 05 : 60 à 90 s).

⚠ **Contraintes musicales** (§ 5) : P1 à l'intertitre 1 compris = **720 images exactement** (garde
dans `calage.ts`) ; de P5 à P9, **1 395 images** : P8 en reçoit le reste (garde : 300 au moins).

---

## 4. Plans détaillés

Images **locales** (i 0 = début du plan). Libellés entre guillemets : ceux du web (clé au § 7.2),
sauf « annotation vidéo ».

### P1 — Le verset · 195 i (6,5 s)
- **À l'écran** : sur le fond clair, « « Levons-nous, / et *bâtissons* ! » » (Fraunces 600, 116 px,
  « bâtissons » en argile), puis « *Néhémie 2 : 18* » (Fraunces italique 54, `ink2`) et
  « LOUIS SEGOND 1910 » (JetBrains Mono 28, `ink3`). En bas, la **muraille** : quatre rangées de
  pierres arrondies (teintes parchemin, terre, papier), en quinconce.
- **Animation** : i 12 et i 26 les deux lignes du verset glissent ; i 56, i 66 la référence et la
  version. De i 24 à i 144, les pierres se posent une à une, de la rangée du bas vers le haut
  (ressort depuis le haut, léger rebond). i 180 → 195 le verset s'efface ; la muraille reste.
- **Son** : la partie très douce du chant (0–6,5 s).

### P2 — L'offre · 135 i (4,5 s)
- **À l'écran** : la muraille achevée en bas ; au centre « Offre *Néhémie* » (Fraunces 600, 132 px,
  « Néhémie » en argile), un trait terre, « *Le suivi de toute ma ville* » (italique 64, `ink2`).
- **Animation** : i 6 le titre, i 18 → 34 le trait se tire, i 24 le sous-titre. i 120 → 135 tout
  s'efface, la muraille descend.

### P3 — Pour qui · 180 i (6,0 s)
- **À l'écran** (illustration) : en haut, trois silhouettes (`Silhouette` de « Journal ») :
  **« Pasteur »** au centre (`moss`), **« Responsable »** de part et d'autre (`mossSoft`) ; dessous,
  une grande carte papier « VILLE · DOUALA » (mono) avec six maisons d'assemblée (toit + façade,
  mousse) : **Akwa, Bali, Bonabéri, Bonamoussadi, Deïdo, Makepe**. Des traits pointillés vont des
  silhouettes à la ville.
- **Animation** : i 10 → 30 les silhouettes en ressort ; i 26 la carte monte ; i 34 → 60 les
  maisons en cascade ; i 58 → 80 les traits se tirent ; i 100 → 176 la carte s'entoure d'un liseré
  argile (« d'un seul regard ») ; i 166 → 180 fondu de sortie.
- **Légendes** : `Pour le *pasteur*` / `et les responsables de la ville.` (i 6 → 92), puis
  `Toutes ses assemblées,` / `*d’un seul regard*.` (i 96 → fin).

### P4 — Dans l'espace web : Suivi de la ville · 135 i (4,5 s)
- **À l'écran** : la fenêtre monte du bas (ressort) sur la page « Le Message de Bertoua » ; clic
  sur le menu (≡) : le **tiroir** vert s'ouvre (`.sidebar` : « shephr / ADMINISTRATION » ;
  PILOTAGE : « Objectifs », « Vie d'assemblée », « Le Message de Bertoua », **« Suivi de la ville »**,
  « Évènements », « Suivi pastoral », « Documents » ; ORGANISATION : « Structure », « Membres »,
  « Hiérarchie des dirigeants »).
- **Animation** : i 0 → 22 la fenêtre monte ; i 34 clic sur ≡, le tiroir glisse (i 36 → 48) ;
  i 50 → 80 le pointeur descend sur « Suivi de la ville » (halo i 58 → 92) ; i 86 clic : l'entrée
  passe active, le tiroir se referme (i 92 → 104) et la page « Suivi de la ville — Douala »
  apparaît, grille vide (i 94 → 106).
- **Légende** : `Dans l’espace web :` / `*Suivi de la ville*.` (i 6 → fin).

### Intertitre 1 · 75 i — « 1 · Le Message de Bertoua — Toutes les assemblées, leçon par leçon. »

### P5 — Chaque assemblée, leçon par leçon · 300 i (10,0 s) — sur la montée (24,0 s)
- **À l'écran** : la page « Suivi de la ville — Douala » (fil « shephr › Le Message de Bertoua ›
  Suivi de la ville »), les trois parties (« Le Message de Bertoua » actif, « Vie d'assemblée »,
  « Évènements »), les onglets « Assemblées » (actif) · « Membres » · « Statistiques ». Carte
  « UEMB002 · Devenir et être disciple du Seigneur Jésus-Christ  5 leçons » ; tableau zébré :
  ASSEMBLÉE (nom + « 14 membres »…) · AVANCEMENT (barre + « 4/5 ») · 1 · 2 · 3 · 4 · 5 (✓ vert
  ou –).
- **Animation** : i 8 → 70 les ✓ tombent leçon par leçon, assemblée après assemblée, les barres se
  remplissent ; i 100 → 118 léger zoom (1,16, foyer en haut de la page) ; i 112 → 192 halo vert sur
  **Bonamoussadi** (5/5) ; i 198 → 290 halo argile sur **Deïdo** (0/5) ; i 276 → 296 dézoom.
- **Légendes** : `Chaque assemblée,` / `*leçon par leçon*.` (i 6 → 104) ; `Bonamoussadi :` /
  `*5 leçons sur 5*.` (i 110 → 190) ; `Deïdo :` / `*pas encore commencé*.` (i 196 → fin).

### P6 — Enseigné ou non enseigné · 240 i (8,0 s)
- **À l'écran** : onglet « Membres » : champs « Statut » (« Tous les membres ») et « Assemblée »
  (« Toutes les assemblées »), « 75 membres », tableau MEMBRE · ASSEMBLÉE · ENSEIGNÉ (badge vert
  « Enseigné » / gris « Non enseigné ») · LEÇONS FAITES (« 3/5 »…).
- **Animation** : i 4 → 24 le pointeur va sur « Membres », clic i 28, la page change (i 30 → 38) ;
  i 100 → 124 le pointeur va sur « Statut », clic i 128 : le statut devient « Non enseigné », les
  lignes se renouvellent (i 130 → 142), « 14 membres » (halo i 148 → 232).
- **Légendes** : `Chaque membre :` / `*enseigné* ou non enseigné.` (i 36 → 130) ; `Vous savez` /
  `*qui accompagner*.` (i 140 → fin).

### Intertitre 2 · 75 i — « 2 · Le journal de la ville — Toutes les réunions, sans aucun nom. »

### P7 — Le journal de la ville · 360 i (12,0 s)
- **À l'écran** : partie « Vie d'assemblée » active (halo i 2 → 44). Carte « Vie d'assemblée ·
  comptes rendus » (bouton « Journal PDF »), période « ‹ Octobre 2026 › », six indicateurs :
  « Réunions tenues » 22, « Assemblées actives » 5, « Sans CR depuis 3 semaines » 1 (en ocre),
  « Présence moyenne » 11,4, « Personnes distinctes présentes » 68, « Fractions de pain » 9 ;
  « ⚠ Sans compte rendu depuis 3 semaines : Deïdo ». Carte « Par assemblée » : ASSEMBLÉE ·
  RÉUNIONS · PRÉSENCE MOY. · FRACTIONS DE PAIN · DERNIER CR.
- **Animation** : i 8 → 40 les chiffres montent ; i 104 → 124 la page défile jusqu'au tableau ;
  i 110 → 186 halo sur l'alerte et la ligne Deïdo (21/09/2026) ; i 190 → 232 halo sur tout le
  tableau ; i 226 → 242 retour en haut ; i 236 → 258 le pointeur va sur « Journal PDF », clic
  i 262 : un voile assombrit la fenêtre, la **page 1 du PDF** monte (ressort) : « Journal des
  assemblées », « Douala — octobre 2026 », « Édité le 15 novembre 2026 », « Synthèse de la
  période », « Par assemblée », « Comptes rendus » : Akwa · Douala, « Dimanche 25 octobre 2026 »,
  « Présents 13 » (halo i 300 → 356), « Fraction de pain Oui », « Lecture Disciple coûte que coûte,
  chapitre 4 » — **un nombre, jamais un nom**.
- **Légendes** : `Les réunions` / `de *toute la ville*.` (i 6 → 100) ; `Deïdo : *aucun compte
  rendu*` / `depuis 3 semaines.` (i 106 → 184) ; `Des *nombres*,` / `jamais de noms.` (i 190 → 258) ;
  `Le journal *en PDF*,` / `pour toute la ville.` (i 266 → fin).

### Intertitre 3 · 75 i — « 3 · Les évènements — À l'intérieur de la ville. »

### P8 — Les évènements, assemblée par assemblée · 345 i (11,5 s) — plan tampon
- **À l'écran** : partie « Évènements » active ; « Période » « Année · 2026 » ; six indicateurs :
  « Actions comptées » 38, « Participants » 1 240, « Invités » 312, « Conversions » 46,
  « Restaurations » 14, « Baptêmes » 9 ; carte « Par assemblée » (« Cliquez sur une ligne pour
  descendre d'un niveau. ») : NIVEAU · ACTIONS · PARTICIPANTS · CONVERSIONS · › ; pied : « Dont 2
  actions rattachées directement à la ville Douala : elles comptent à ce niveau, dans aucun
  sous-niveau. »
- **Animation** : i 8 → 44 les chiffres montent ; i 30 → 108 halo sur Conversions et Baptêmes ;
  i 112 → 132 défilement jusqu'au tableau, halo i 136 → 216 ; i 226 → fin − 22 halo sur **Akwa**
  (9 actions, 310 participants, 12 conversions) ; sur les 16 dernières images la fenêtre descend et
  s'efface.
- **Légendes** : `Les *fruits* de la ville :` / `conversions, baptêmes…` (i 6 → 108) ;
  `Les évènements,` / `*assemblée par assemblée*.` (i 114 → 218) ; `Akwa : *9 actions*,` /
  `12 conversions cette année.` (i 224 → fin).

### P9 — Une ville, tous ses responsables · 255 i (8,5 s) — sur l'orchestre (70,5 s)
- **À l'écran** (illustration) : en bas, la ville se bâtit en pyramide de six pierres nommées
  (Akwa, Bali, Bonabéri ; Bonamoussadi, Deïdo ; Makepe) — rappel de la muraille du verset ; au
  sommet, le sceau argile **« Offre Néhémie »** ; en haut, trois silhouettes (`moss`) coiffées de
  pastilles « VILLE », « RÉGION », « NATION » ; des traits pointillés les relient à la ville, une
  lueur argile y descend en boucle.
- **Animation** : i 2 → 32 les pierres tombent (6 images d'écart) sur l'entrée de l'orchestre ;
  i 46 le sceau se pose (rebond) ; i 66 → 86 les silhouettes ; i 100 → 128 les traits ; i 130 →
  les lueurs ; i 240 → 255 fondu.
- **Légendes** : `Une ville,` / `*tous ses responsables*.` (i 6 → 122) ; `De la ville à la nation,` /
  `*chacun la suit*.` (i 128 → fin).

### P10 — Fin · 180 i (6,0 s)
- « *Offre Néhémie* » (italique 52), « Disponible sur » / « *l’espace web Shephr* » (Fraunces 600,
  88 px, seconde ligne en argile), tuile du logo Shephr (ressort i 30) et logotype « shephr. »
  (i 42). La musique s'éteint sur les 2,5 dernières secondes.

---

## 5. Musique et calage

Piste : `public/audio/dieu-fait-toutes-choses-nouvelles.mp3` (451,8 s), la même que « Journal »,
« Documents » et « Étude » ; volume 0,9, fondu d'entrée 12 images, fondu de sortie 75 images.
Enveloppe : 0–10 s très doux ; 10–24 s montée douce ; **24,0 s** nette montée ; 24–70 s intensité
moyenne ; **70,5 s** l'orchestre entre en plein.

- **Départ au début du fichier** (`trimBefore` 0) : le verset sur la partie très douce.
- **Montée de 24,0 s → image 720 = début de P5** : la grille de Douala se remplit de ✓.
- **Orchestre de 70,5 s → image 2 115 = début de P9** : la ville se bâtit de ses assemblées.
- `src/nehemie/calage.ts` calcule `DUREE_P8` = 2 115 − 720 − (P5 + P6 + P7 + 2 intertitres) = 345 ;
  gardes : P1 → intertitre 1 = 720 exactement, P8 ≥ 300. `Video.tsx` revérifie les deux rendez-vous.

---

## 6. Données fictives (`src/nehemie/donnees.ts`)

Ville de **Douala** (Cameroun), six assemblées de maison (noms de quartiers), triées par nom comme le
serveur. Programme : **UEMB002** (5 leçons), celui de la vidéo « Étude ». Vue au 15 novembre 2026.
Sommes vérifiées au chargement (une incohérence lève une erreur).

| Assemblée | Membres | Leçons faites | Enseignés | Réunions oct. | Présence moy. | Fractions | Dernier CR | Actions 2026 | Participants | Conversions |
|---|---|---|---|---|---|---|---|---|---|---|
| Akwa | 14 | 1–4 | 14 | 4 | 12,5 | 2 | 25/10/2026 | 9 | 310 | 12 |
| Bali | 11 | 1–2 | 9 | 4 | 9 | 1 | 28/10/2026 | 5 | 140 | 5 |
| Bonabéri | 16 | 1–3 | 16 | 5 | 13,8 | 2 | 29/10/2026 | 8 | 265 | 11 |
| Bonamoussadi | 12 | 1–5 | 12 | 5 | 11,2 | 3 | 30/10/2026 | 7 | 230 | 9 |
| Deïdo | 9 | — | 0 | 0 | — | 0 | 21/09/2026 ⚠ | 1 | 25 | 0 |
| Makepe | 13 | 1 | 10 | 4 | 10 | 1 | 27/10/2026 | 6 | 180 | 6 |
| **Ville** | **75** | | **61** (14 non enseignés) | **22** | **11,4** | **9** | 1 alerte | **36 + 2 à la ville = 38** | **1 240** | **46** |

Autres totaux : 5 assemblées actives, 68 personnes distinctes présentes ; invités 312,
restaurations 14, baptêmes 9. Membres nommés (onglet Membres, fictifs) : Achille Ekambi, Adèle
Moukoko, Alain Ebanda, Annie Ndoumbe… ; non enseignés : Alain Ebanda, Brigitte Essomba, Carine
Ngono, Didier Kotto, Estelle Mouelle, Franck Ndjock, Gisèle Tchinda, Hervé Mandengue, Irène Epée.
Journal PDF : Akwa, dimanches 25 octobre (13 présents, fraction de pain, chapitre 4) et 18 octobre
(12 présents, chapitre 3).

Fil : Bonamoussadi a fini l'unité ; **Deïdo** n'a pas commencé, n'a plus de compte rendu depuis trois
semaines et n'a eu qu'une action : l'assemblée que le pasteur ira voir.

---

## 7. Textes

### 7.1 Textes de la vidéo (`src/nehemie/textes.ts` › `LEGENDES`, `CARTONS`)
Voir § 4 (à la lettre). Verset : Louis Segond 1910, Néhémie 2 : 18 (« Ils dirent : Levons-nous, et
bâtissons ! »). Nom et sous-titre : plan 05 § 3.8.

### 7.2 Libellés de l'espace web (`textes.ts` › `WEB`, copiés de `web/src/i18n/locales/fr.json`)
`nav.*` (Pilotage, Organisation, Objectifs, Vie d'assemblée, Le Message de Bertoua, Suivi de la
ville, Évènements, Suivi pastoral, Documents, Structure, Membres, Hiérarchie des dirigeants) ;
`common.brand`, `common.administration` ; `cityStudy.titleCity`, `cityStudy.title`,
`cityStudy.tabs.*`, `cityStudy.overview.{assembly,members_other,progress,lessons_other}`,
`cityStudy.members.{name,assembly,taught,lessons,count_other}`, `cityStudy.status.*`,
`cityStudy.filters.*` ; `hierarchy.stats.{title,journal,meetings,active,alert,average,distinct,bread,alertList}` ;
`assembly.journal.{byUnit,colUnit,colMeetings,colAverage,colBreadCount,colLastReport,docTitle,generatedOn,summary,stat*,reports,attendees,breadBreaking,reading}`,
`assembly.report.{yes,no}` ; `events.period.{label,year}`, `events.stats.{kpiCount,byLevel.UNIT,drillHint,colNode,colCount,ownLevel_other}`,
`events.levelOf.LOCALITY`, `events.counters.*`. Onglet du navigateur : `<title>` de `index.html`
(« shephr · Administration ») ; barre mobile : « Shephr » (`AppShell.tsx`) ; domaine : P1 (JP 18/10).

### 7.3 Écarts assumés (écrans pas encore livrés)
Le lot « Offres » (plan 05) n'est pas codé au 27/10. La vidéo dessine, d'après le plan :
- la page **« Suivi de la ville »** à trois parties (« Le Message de Bertoua » · « Vie d'assemblée »
  · « Évènements ») — proposition **P-08** (une seule page, une seule entrée de menu) ; les parties
  sont des pastilles au-dessus des onglets livrés de Bertoua ;
- la **vue « Journal de la ville »** (§ 3.3, D-OFF-05) avec le gabarit du bloc « Vie d'assemblée ·
  comptes rendus » de la Hiérarchie et du journal PDF consolidé, `attendeeCount` à la place des noms ;
- les **statistiques d'Évènements dans la ville** (§ 3.5, D-OFF-12) avec le gabarit
  d'`EventStatsDrill` (indicateurs, « Par assemblée », colonnes réduites à ACTIONS · PARTICIPANTS ·
  CONVERSIONS pour tenir dans 600 px).
À recaler (libellés, disposition) quand le lot sera livré. Le tableau « Membres » ne montre que 4 des
7 colonnes (le web les fait défiler horizontalement dans une fenêtre étroite) ; la colonne
« Dernière séance » de la grille Assemblées est omise pour la même raison.

---

## 8. Fichiers (`src/nehemie/`)

`Video.tsx` (`VideoNehemie`, `DUREE_NEHEMIE`, `PLANS_NEHEMIE` ; enchaînement, musique, pastilles,
intertitres), `calage.ts`, `textes.ts`, `donnees.ts`, `web.ts` (jetons du web), `ui/Navigateur.tsx`
(fenêtre, caméra, pointeur), `ui/Web.tsx` (primitives du web, tiroir), `ui/Decor.tsx` (muraille,
maison, intertitre), `ecrans/Pages.tsx` (Assemblées, Membres, Journal, Évènements),
`ecrans/PdfJournal.tsx`, `plans/` (`Ouverture`, `PourQui`, `Bertoua`, `Journal`, `Evenements`,
`Ville`, `commun`). Réutilisés sans modification : thème, `FondShephr`, `TuileLogo`, `Logotype`,
`Halo` (« Évènements ») ; `PastillePartie`, `Silhouette` (« Journal ») ; `LegendeEtude`,
`PastillePersonne`, `haloEntre` (« Étude ») ; `doux` (`src/anim.ts`).

Enregistrement (à faire par l'intégration, `src/Root.tsx`) :

```tsx
import { DUREE_NEHEMIE, VideoNehemie } from './nehemie/Video';
<Composition id="NehemieFR" component={VideoNehemie} durationInFrames={DUREE_NEHEMIE} fps={FPS} width={1080} height={1920} />
```

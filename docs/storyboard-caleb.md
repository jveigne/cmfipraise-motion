# Storyboard — motion « Offre Caleb » (Shephr), version française

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composition Remotion **`CalebFR`** (à enregistrer dans
> `src/Root.tsx` par l'agent d'intégration : `component={VideoCaleb}`, `durationInFrames={DUREE_CALEB}`),
> rendu `out/caleb-fr.mp4` (script proposé : `"render:caleb": "remotion render CalebFR out/caleb-fr.mp4"`).
> Durée : **2 670 images = 89,0 s** (plan : 60 à 90 s ; garde dans `Video.tsx`). Français, sans voix
> off, **aucun prix nulle part**, musique « Dieu fait toutes choses nouvelles » (§ 5).
> Rédigé et codé le 27/10/2026 dans `src/caleb/` (V3 du plan
> `cmfipraise-backend/docs/shephr/27_10_2026/05_Plan_Offres_Caleb_Nehemie.md` § 9).
>
> Sources vérifiées :
> - règles : plan 27/10 § 1 (tableau des offres), § 2 (D-OFF-02, D-OFF-04, D-OFF-06), § 3.2 à 3.4,
>   § 3.8 (libellés « Offre Caleb » / « Le suivi de ma hiérarchie », verset) ; avenant
>   `04_Avenant_Offre_Dirigeant.md` (D-ABO-31 : chaîne ≠ géographie ; D-ABO-36 : droit personnel) ;
> - écrans : `shephr-app/mobile` — `app/hierarchie.tsx`, `components/AssemblyHierarchyStats.tsx`,
>   `components/StudyHierarchyStats.tsx`, `app/(tabs)/assembly/index.tsx`,
>   `app/(tabs)/assembly/meeting/[id].tsx`, `app/(tabs)/care/index.tsx`, `app/(tabs)/_layout.tsx` ;
> - libellés : `mobile/utils/i18n/locales/fr.json` (§ 7) ; `supervisorChain` = les dirigeants
>   ENTRE l'appelant et le dirigeant de l'assemblée (`HierarchyScope.UnitChain`, backend).

---

## 1. Ce que la vidéo doit faire comprendre

| Partie | Message |
|---|---|
| *Ouverture* | « Donne-moi donc cette montagne » (Josué 14 : 12, Louis Segond 1910), puis « Offre Caleb — Le suivi de ma hiérarchie », pour chaque dirigeant, le long de **sa** chaîne de leadership. |
| **1 · La chaîne** | Caleb suit la **chaîne** (qui rend compte à qui), **pas la carte** des villes : une assemblée d'une autre ville en fait partie si son dirigeant vous rend compte, une assemblée de la même ville n'en fait pas partie sinon. On le voit dans l'arbre de la Hiérarchie. |
| **2 · Les assemblées** | Statistiques des comptes rendus de toute la chaîne (réunions, présences, fraction du pain), l'alerte « sans compte rendu depuis 3 semaines », le journal PDF de toute la chaîne ; les comptes rendus de chaque assemblée, en lecture — seul son dirigeant les rédige. |
| **3 · Bertoua et les brebis** | L'avancement du Message de Bertoua assemblée par assemblée (leçons, enseignés, notes, jamais les réponses) ; les fiches Member Care de toute la chaîne, en lecture. |
| **4 · Chacun pour soi** | Une offre par dirigeant : celle de Daniel n'ouvre rien à Marc (ni à Bernard). |
| *Fin* | « Offre Caleb — Disponible sur l'espace web Shephr ». |

---

## 2. Principes de mise en scène

Mêmes principes qu'« Étude » et « Journal » (rythme revu après les retours de JP, « trop rapide ») :

- **Téléphone** de `src/ui/Telephone.tsx` posé par `Plateau` ; il monte du bas en ressort au début
  de chaque plan d'app (`montee`). Écrans **redessinés en code** aux mêmes tailles en points
  (`src/caleb/ecrans/`), hauteurs posées explicitement (les appuis et la caméra en dépendent).
- **Gestes** : `Appui` (disque + onde mousse). **Caméra** : zoom 1,3 à 1,35 + `Voile` sous la
  légende ; **halos** argile (`Halo`, `haloEntre`).
- **Légendes** : `LegendeEtude` (= légende de « Documents ») en haut, deux lignes au plus, deux par
  plan au plus (trois en P5), chacune tenue 2,7 à 4,8 s.
- **Intertitres** de 2,5 s (`IntertitreCaleb`, gabarit de l'`Intertitre` d'« Étude ») avant les
  parties 1, 2 et 3 ; la partie 4 (un seul plan) n'a que sa pastille.
- **Pastilles de partie** (gabarit `PastillePartie` de « Journal ») :

  | Partie | Plans | Pastille | Couleur |
  |---|---|---|---|
  | — | P1–P2 | aucune | — |
  | 1 · La chaîne | P3–P4 | `1 · LA CHAÎNE` | sauge `#7A8B6F` (teinte de la tuile Hiérarchie) |
  | 2 · Les assemblées | P5–P6 | `2 · LES ASSEMBLÉES` | `moss #1E3A2F` |
  | 3 · Bertoua et brebis | P7–P8 | `3 · BERTOUA ET BREBIS` | `earthDeep #A7754B` |
  | 4 · Chacun pour soi | P9 | `4 · CHACUN POUR SOI` | `clay #B86A4A` |
  | — | P10 | aucune | — |

- **Aucun prix**, aucun bouton « S'abonner », aucune caisse : l'offre n'est nommée que par son
  libellé commercial (« Offre Caleb ») et l'adresse du web en fin.

---

## 3. Découpage

| # | Plan | Images | Durée | Début → fin (images) |
|---|---|---|---|---|
| P1 | Verset « Donne-moi donc cette montagne » | 165 | 5,5 s | 0 → 165 |
| P2 | « Offre Caleb — Le suivi de ma hiérarchie » | 150 | 5,0 s | 165 → 315 |
| I1 | Intertitre « 1 · La chaîne » | 75 | 2,5 s | 315 → 390 |
| P3 | Pas la carte, la chaîne (illustration) | 240 | 8,0 s | 390 → 630 |
| P4 | L'arbre de la Hiérarchie, jusqu'à Évry | 300 | 10,0 s | 630 → 930 |
| I2 | Intertitre « 2 · Les assemblées » | 75 | 2,5 s | 930 → 1005 |
| P5 | Statistiques, alerte, journal PDF | 330 | 11,0 s | 1005 → 1335 |
| P6 | Les comptes rendus de Paris Ouest (**plan tampon**) | 300 | 10,0 s | 1335 → 1635 |
| I3 | Intertitre « 3 · Bertoua et les brebis » | 75 | 2,5 s | 1635 → 1710 |
| P7 | Le Message de Bertoua de la chaîne | 300 | 10,0 s | 1710 → 2010 |
| P8 | Les brebis de la chaîne | 270 | 9,0 s | 2010 → 2280 |
| P9 | Chacun pour soi (illustration) | 225 | 7,5 s | 2280 → 2505 |
| P10 | Fin | 165 | 5,5 s | 2505 → 2670 |

**10 plans + 3 intertitres, 2 670 images = 89,0 s.** Autour des intertitres, le plan voisin déborde
de 10 images figées (`RECOUVREMENT`, comme « Étude »).

---

## 4. Plans détaillés

Images locales au plan.

### P1 — Le verset · 165 i
- Sans téléphone. En bas, une **montagne au trait** (deux chaînes, un sommet enneigé) qui se dessine
  (i 0 → 70) puis se remplit (i 50 → 80). Au centre, en Fraunces italique 96 :
  `« Donne-moi donc` / `cette montagne »` (i 14, i 26), puis `Josué 14 : 12` (argile, i 48) et
  `Louis Segond 1910` (i 56). Sortie vers le haut en fondu (i 150 → 165).

### P2 — Le titre · 150 i
- Tuile de l'icône Shephr (ressort, i 2) ; `Offre Caleb` (« Caleb » en argile, i 12) ;
  `Le suivi de ma hiérarchie` (i 24) ; filet terre (i 40) ; `Pour chaque dirigeant,` /
  `le long de *sa chaîne de leadership*.` (i 50, i 60). Sortie i 138 → 150.

### P3 — Pas la carte, la chaîne · 240 i (illustration)
- i 0 → 100 : **la carte** — deux zones en pointillés `PARIS` (Paris Nord, Paris Ouest, Paris Est,
  Paris Sud) et `ÉVRY` (Évry Centre, Évry Sud), une maison par assemblée.
- i 92 → 112 : **Évry Sud s'efface** (pas dans la chaîne de Daniel) ; i 100 → 124 les zones
  s'effacent.
- i 112 → 150 : les maisons **quittent la carte** et se rangent dans l'arbre, à côté de leur
  dirigeant (nom + « · ville ») ; i 128 → 160 les personnes arrivent l'une après l'autre : Daniel
  Mercier (`VOUS`), Sophie Marchand, Thomas Lefèvre, Samuel Fotso, Marc Dubois, puis, sous Marc,
  Nadège Mbarga ; i 150 → 182 les traits de la chaîne se dessinent.
- i 184 → 228 : halo sur `Évry Centre · Évry`. Sortie en fondu i 228 → 240.
- Légendes : `Pas *la carte*` / `des villes…` (i 6 → 106), `…mais *votre chaîne*` /
  `de leadership.` (i 110 → fin).

### P4 — L'arbre de la Hiérarchie · 300 i
- Le téléphone monte sur la **Hiérarchie** de Daniel (titre, « Votre leadership : … », « Vous rendez
  compte à **Bernard Lemoine** », « Mon superviseur », haut du bloc « Vie d'assemblée »).
- i 44 → 74 : défilement jusqu'à l'arbre (segment `Dirigeants`) : `Daniel Mercier` `VOUS` /
  `Dirigeant` / `5 assemblées · 1 ⚠` · `Journal PDF` ; sous lui Sophie, Thomas, Samuel, Marc
  (`Dirigeant d'unité · 1 assemblée`), chacun avec son assemblée (`Paris Est · Paris`, `10 membres`,
  `Dernier CR il y a 1 j · 8,3 présents en moyenne`…). Halos : Daniel (i 80 → 112), ses quatre
  dirigeants (i 108 → 146).
- i 150 → 176 : défilement jusqu'à Marc (`2 assemblées · 1 ⚠`), `Paris Sud · Paris`
  (`⚠ Aucun CR depuis 3 semaines · dernier il y a 60 j`, argile) et **Nadège Mbarga**, repliée
  (profondeur 2 : `useState(depth < 2)`). **Appui i 186** ; i 188 → 202 elle se déplie :
  `Évry Centre · Évry`, `8 membres`, `Dernier CR il y a 2 j · 7,5 présents en moyenne`.
- i 204 → 220 zoom 1,35 sur Évry Centre, halo i 220 → 276, retour i 278 → 294.
- Légendes : `Dans votre *Hiérarchie*,` / `toute votre chaîne.` (i 6 → 150), `Même dans` /
  `*une autre ville*.` (i 156 → fin).

### P5 — Statistiques, alerte, journal · 330 i
- Le téléphone monte sur la Hiérarchie défilée au bloc **« Vie d'assemblée »** : `Mois` choisi,
  `‹ Novembre 2026 ›` (› grisé), six cases `10 Réunions`, `4 / 5 Assemblées actives`,
  `10,1 Présence moy.`, `43 Personnes distinctes`, `9 Fractions de pain`, `1 Sans CR > 3 sem.`
  (argile), l'encadré `⚠ Sans compte rendu depuis 3 semaines` / `Paris Sud`, la note, le bouton
  `Journal PDF de ma hiérarchie`.
- Zoom 1,35 (i 28 → 44, retour i 300 → 316), la caméra va des cases à l'alerte (i 138 → 152) puis
  au bouton (i 222 → 238). Halos : Réunions (i 48 → 82), Présence moy. (i 72 → 106), Fractions de
  pain (i 96 → 134), la case et l'encadré d'alerte (i 154 → 220), le bouton (i 240 → 312). Aucun
  appui : l'alerte est un affichage, ni notification ni relance.
- Légendes : `Réunions, présences,` / `*fraction du pain*.` (i 6 → 140) ;
  `Sans CR depuis 3 semaines ?` / `*L’alerte s’affiche*.` (i 144 → 226) ; `Et le *journal PDF*` /
  `de toute la chaîne.` (i 230 → fin).

### P6 — Les comptes rendus d'une assemblée de la chaîne · 300 i (plan tampon)
- Le téléphone monte sur l'arbre défilé sur Samuel Fotso et `Paris Ouest · Paris` ; halo sur la
  ligne `Dernier CR il y a 1 j · 14 présents en moyenne` (i 18 → 52), **appui i 52** (la ligne ouvre
  la Vie d'assemblée de l'assemblée, `?unitId=`) ; i 56 → 72 l'onglet **Assemblée** arrive :
  `Vie d'assemblée`, liste déroulante `ASSEMBLÉE` `Paris Ouest · Paris` (halo i 78 → 112),
  `Réunions | Avancement`, `‹ 2026 ›`, **`Lecture seule : seul le dirigeant de l'assemblée rédige
  les comptes rendus.`** (halo i 108 → 142 ; pas de « Nouveau CR »), `Journal PDF`, puis les
  réunions (15, 8, 1 novembre, 25 octobre…).
- **Appui i 160** sur le 8 novembre ; i 164 → 180 le compte rendu : `COMPTE RENDU`,
  `8 novembre 2026`, `Paris Ouest`, ni modifier ni supprimer ; `FRACTION DE PAIN Oui`,
  `LECTURE Devenir et être disciple du Seigneur Jésus-Christ — chapitre 3` (halo i 186 → 226) ;
  défilement (i 230 → 260) sur `PRÉSENTS · 15` et les noms (halo i 260 → 290).
- Légendes : `Chaque assemblée,` / `*ses comptes rendus*.` (i 6 → 154) ;
  `Écrits par son dirigeant,` / `*lus par sa chaîne*.` (i 160 → fin).
- Durée **calculée** (`calage.ts`) ; l'ouverture du compte rendu se place à 52 % du plan (160 images
  au moins).

### P7 — Le Message de Bertoua · 300 i
- Le téléphone monte sur le bloc **« Le Message de Bertoua »** : `ANNÉE 2026`, `8 Séances
  terminées`, `7 Leçons faites`, `40 Membres enseignés`, `77 % Note moyenne` (zoom 1,3 i 26 → 42,
  halo i 44 → 106) ; `DEVENIR ET ÊTRE DISCIPLE DU SEIGNEUR JÉSUS-CHRIST` (une seule unité : pas de
  pastilles d'unité) ; une ligne par assemblée.
- i 124 → 150 défilement : halo sur `Paris Ouest · Paris` (`3 / 5 leçons faites`,
  `14 / 15 enseignés · 1 non enseigné`, `Moyenne 84 %`, i 152 → 190), puis sur `Évry Centre · Évry`
  (`Dirigeant : Nadège Mbarga · via Marc Dubois`, i 186 → 226) ; zoom 1,3 (i 226 → 242) sur la note
  `Enseigné : … Aucune réponse ni aucun nom de membre n'est affiché ici.` (halo i 242 → 290).
- L'orchestre entre sur la première image de P7 (§ 5).
- Légendes : `*Le Message de Bertoua*,` / `assemblée par assemblée.` (i 6 → 146) ;
  `Leçons, enseignés, notes :` / `*jamais les réponses*.` (i 150 → fin).

### P8 — Les brebis de la chaîne · 270 i
- Le téléphone monte sur l'onglet **Brebis** (six onglets ; halo sur `Brebis` i 18 → 46) :
  `Suivi des brebis`, `Suivi | Redevabilité`, cinq pastilles d'assemblée (`Paris Est · Paris` …
  `Évry Centre · Évry`, halo i 40 → 112), `Paris Ouest · Paris` choisie ; `Lecture seule : seul le
  dirigeant de l'assemblée met à jour les fiches.` ; recherche ; `Tous`, `Nouveau`, `En intégration`,
  `Engagé`, `En danger`, `Rétrograde` ; fiches (pastille de couleur, nom, `Engagé · présent le 15 novembre 2026`…).
- **Appui i 118** sur `Évry Centre · Évry` ; i 122 → 132 la liste passe aux fiches d'Évry Centre.
- Zoom 1,3 (i 146 → 162, retour i 236 → 252) sur la ligne « Lecture seule » (halo i 164 → 236).
- Légendes : `*Les brebis*` / `de toute la chaîne.` (i 6 → 136) ; `Le dirigeant d’assemblée` /
  `*garde la plume*.` (i 140 → fin).

### P9 — Chacun pour soi · 225 i (illustration)
- Trois cartes l'une sous l'autre, reliées par la chaîne : `Bernard Lemoine` / `Dirigeant senior`,
  `Daniel Mercier` / `Dirigeant`, `Marc Dubois` / `Dirigeant d'unité`, et sous Marc ses deux
  assemblées `Paris Sud`, `Évry Centre`. Chaque carte porte une pastille `Offre Caleb` éteinte.
- i 40 : la pastille de **Daniel** s'allume (`✓ Offre Caleb`, mousse) ; i 56 → 76 une zone sauge
  entoure Daniel, Marc et les assemblées sous Marc : ce que Daniel suit.
- i 122 → 136 : un **cadenas** argile se pose sur la pastille de Marc ; celle de Bernard reste
  éteinte. Sortie i 212 → 225.
- Légendes : `*Chacun pour soi* :` / `une offre par dirigeant.` (i 6 → 112) ; `L’offre de Daniel` /
  `*n’ouvre rien à Marc*.` (i 116 → fin).

### P10 — Fin · 165 i
- `Offre Caleb` (i 4), `Disponible sur` / `l’espace web *Shephr*` (i 14, i 24), tuile de l'icône
  (ressort, i 40), logotype (i 52). Image fixe ; la musique s'éteint sur les 75 dernières images.

---

## 5. Calage musical

Piste : `public/audio/dieu-fait-toutes-choses-nouvelles.mp3` (451,8 s), celle de « Journal »,
« Documents » et « Étude ». Enveloppe : 0–10 s très doux, 10–24 s montée douce, **24,0 s nette
montée**, 24–70 s intensité moyenne, **70,5 s entrée de l'orchestre**.

- La **montée de 24,0 s** tombe sur l'intertitre « 1 · La chaîne » (image 315) : `trimBefore` =
  720 − 315 = **405 images (13,5 s du fichier)** ; verset et titre se jouent sur la montée douce.
- L'**orchestre** (70,5 s, 1 395 images après la montée) tombe sur **P7** (image 1 710) : le bloc
  « Le Message de Bertoua ».
- **P6** est le plan tampon : `DUREE_P6 = 1 395 − (I1 + P3 + P4 + I2 + P5 + I3) = 1 395 − 1 095 =
  300` (garde : 240 au moins). Retoucher P3, P4, P5 ou un intertitre se reporte sur P6 ; retoucher P1
  ou P2 change le point de départ dans le chant.
- Fondu d'entrée de 12 images, fondu de sortie de 2,5 s sur P10, volume 0,9.

---

## 6. Données fictives (`src/caleb/donnees.ts`)

Date de l'histoire : **lundi 16 novembre 2026**. Les personnes de « Journal » et « Étude » :

| Personne | Rôle | Assemblée | Rend compte à |
|---|---|---|---|
| Bernard Lemoine | Dirigeant senior | — | — |
| **Daniel Mercier** (`Vous`) | Dirigeant | — | Bernard |
| Sophie Marchand | Dirigeant d'unité | Paris Est · Paris | Daniel |
| Thomas Lefèvre | Dirigeant d'unité | Paris Nord · Paris | Daniel |
| Samuel Fotso | Dirigeant d'unité | Paris Ouest · Paris (l'assemblée d'« Étude ») | Daniel |
| Marc Dubois | Dirigeant d'unité | Paris Sud · Paris | Daniel |
| **Nadège Mbarga** (nouvelle) | Dirigeant d'unité | **Évry Centre · Évry** | **Marc** |

Évry Sud (Évry) n'est pas dans la chaîne : elle n'apparaît que sur la carte de P3.

**Vie d'assemblée, novembre 2026** (1er → 16) :

| Assemblée | Réunions (présents) | Pain | Dernier CR | Distinctes | Ligne de l'arbre |
|---|---|---|---|---|---|
| Paris Est | 3 (8, 9, 8) | 3 | 15/11 | 10 | `Dernier CR il y a 1 j · 8,3 présents en moyenne` |
| Paris Nord | 2 (10, 9) | 2 | 11/11 | 10 | `Dernier CR il y a 5 j · 9,5 présents en moyenne` |
| Paris Ouest | 3 (14, 15, 13) | 2 | 15/11 | 15 | `Dernier CR il y a 1 j · 14 présents en moyenne` |
| Paris Sud | 0 | 0 | 17/09 | 0 | `⚠ Aucun CR depuis 3 semaines · dernier il y a 60 j` |
| Évry Centre | 2 (7, 8) | 2 | 14/11 | 8 | `Dernier CR il y a 2 j · 7,5 présents en moyenne` |
| **Total** | **10** | **9** | | **43** | `4 / 5` actives, `10,1` présents en moyenne, 1 alerte |

**Le Message de Bertoua, année 2026** (UEMB002, 5 leçons ; avancement de « Étude » au 8 novembre
pour Paris) :

| Assemblée | Leçons | Séances | Enseignés / membres | Moyenne | Dernière séance |
|---|---|---|---|---|---|
| Paris Est | 1 / 5 | 1 | 9 / 10 | 71 % | 8 novembre 2026 |
| Paris Nord | 2 / 5 | 3 | 10 / 11 | 78 % | 11 novembre 2026 |
| Paris Ouest | 3 / 5 | 3 | 14 / 15 (Samuel, dirigeant, sans copie) | 84 % | 8 novembre 2026 |
| Paris Sud | 0 / 5 | 0 | 0 / 9 | — | Aucune séance terminée |
| Évry Centre (via Marc Dubois) | 1 / 5 | 1 | 7 / 8 | 69 % | 14 novembre 2026 |
| **Total** | **7** | **8** | **40** | **77 %** (pondérée) | |

Comptes rendus de Paris Ouest : 15 novembre (13 présents, pain, pas de lecture), 8 novembre (15,
pain, chapitre 3), 1er novembre (14, sans pain, chapitre 2), 25 octobre (14, pain, chapitre 1),
18 octobre (12, pain). Le 8 novembre : les 15 de « Étude ». Lecture = l'unité d'étude
« Devenir et être disciple du Seigneur Jésus-Christ » (le catalogue est partagé, D-ETU-29).

Member Care : statuts par défaut du ministère (`MemberCareServiceImpl.DEFAULT_STATUSES` : `Nouveau`,
`En intégration`, `Engagé`, `En danger`, `Rétrograde` — alignés sur « Gratuit » à l'intégration du 27/10) ; fiches de Paris Ouest (Aline Tchoua … Joël Mvondo) et d'Évry Centre (Arnaud Biloa …
Laure Fouda) ; le dirigeant d'assemblée n'a pas de fiche.

Les chiffres sont recalculés et vérifiés au chargement (`donnees.ts`, fin du fichier).

---

## 7. Libellés repris de l'app (`mobile/utils/i18n/locales/fr.json`)

`hierarchy.title`, `hierarchy.introSubtree`, `hierarchy.reportsTo`, `hierarchy.you`,
`hierarchy.viewLeaders` / `viewUnits`, `hierarchy.unitsCount_*`, `hierarchy.membersCount_*`,
`hierarchy.leaderPrefix`, `supervisor.title`, `supervisor.shortcutHint` ;
`assemblyLife.hierarchy.*` (`title`, `stat*`, `alertTitle`, `distinctNote`, `journalAll`,
`leaderSummary_*`, `alertCount_*`, `lastReport_*`, `lastReportShort_*`, `averageLine`,
`noRecentReport`), `assemblyLife.journal.kind.*`, `assemblyLife.journal.open` ;
`study.tile.title`, `hierarchy.study.*` (`yearTitle`, `stat*`, `via`, `lessonsDone`, `taught_*`,
`notTaught_*`, `average`, `lastSession`, `noSession`, `note`) ; `assemblyLife.title`, `subtitle`,
`unitPicker`, `readOnly`, `detail.*`, `breadBreaking` ; `care.title`, `subtitle`, `tabRecords`,
`tabAccountability`, `searchPlaceholder`, `readOnly`, `lastAttendanceShort`, `common.all` ;
`tabs.*` ; rôles : `MODULE_ROLE_LABELS` (`services/authApi.ts`).

Hors app (cartons) : « Offre Caleb », « Le suivi de ma hiérarchie » (plan § 3.8 — les clés
`offers.*` ne sont pas encore dans les i18n au 27/10), le verset (Louis Segond 1910).

---

## 8. Écarts assumés et points relevés

1. **Écrans du téléphone, pas du web** : tout ce que montre la vidéo existe sur l'app (blocs de la
   Hiérarchie, Vie d'assemblée d'une autre assemblée, Brebis) dès que le droit est ouvert ; seule la
   **souscription** se fait sur le web, d'où la fin « Disponible sur l'espace web Shephr ».
2. **Pas de bloc « Ce que porte mon leadership »** ni de pastilles d'objectifs dans l'arbre (comme
   « Journal ») : ils sont gratuits et hors sujet.
3. **Barre d'onglets à six** (`BarreOnglets6`, `src/caleb/ui/Onglets.tsx`) : la `BarreOnglets`
   partagée n'en a que cinq ; libellés ramenés à 10 points pour que « Évènements » ne touche pas ses
   voisins (l'app, à 11, les serre aussi).
4. **Ordre des assemblées** du bloc Bertoua : celui de l'arbre (`ctx.units()` côté serveur) ; non
   vérifié sur un vrai jeu de données.
5. **Unité d'étude** : une seule (UEMB002) ⇒ pas de pastilles d'unité dans le bloc Bertoua
   (`modules.length > 1`).
6. **Aucun appui sur « Journal PDF de ma hiérarchie »** (P5) : un halo et une légende suffisent ;
   le PDF consolidé a été montré dans « Journal » (P17).
7. **Retour vers l'onglet Assemblée** depuis la ligne de l'arbre : transition de pile (`Pile`),
   comme les autres écrans poussés.

---

## 9. Réalisation (`src/caleb/`)

- `textes.ts` (légendes, cartons, libellés de l'app), `donnees.ts` (données fictives vérifiées),
  `ecrans/` (`Hierarchie.tsx` — un seul long écran, `Assemblee.tsx`, `Brebis.tsx`), `ui/`
  (`Intertitre.tsx`, `Onglets.tsx`), `plans/` (`Cartons.tsx` P1 / P2 / P10, `Chaine.tsx` P3 / P4,
  `Assemblees.tsx` P5 / P6, `Suivi.tsx` P7 / P8, `Chacun.tsx` P9), `calage.ts`, `Video.tsx`
  (exporte `VideoCaleb`, par défaut aussi, `DUREE_CALEB` = 2 670 et `PLANS_CALEB` = 10).
- Réutilisés **sans modification** : thème et briques d'app d'« Évènements » (`Ecran`, `Carte`,
  `Halo`, `Etiquette`, `FondShephr`, `TuileLogo`, `Logotype`), `Plateau`, `Pile`, `Telephone`,
  éléments de « Journal » (`Segments`, `LignePeriode`, `LignesReunions`, `BoutonListe`, `CarteForm`,
  `Retour`, `Chargement`, `PastillePartie`), outils de plan d'« Étude » (`Appui`, `Voile`, `montee`,
  `lisse`, `haloEntre`, `LegendeEtude`, `DUREE_INTERTITRE`). Aucun fichier partagé retouché.
- À faire par l'intégration : enregistrer `CalebFR` dans `src/Root.tsx`, ajouter le script de rendu
  et rendre `out/caleb-fr.mp4`.

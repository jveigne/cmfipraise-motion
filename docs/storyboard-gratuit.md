# Storyboard — « Ce qui est et restera gratuit » (Shephr, V4)

> Vidéo V4 du plan `cmfipraise-backend/docs/shephr/27_10_2026/05_Plan_Offres_Caleb_Nehemie.md` § 9.
> Code : `src/gratuit/` (composant `VideoGratuit`, durée `DUREE_GRATUIT`). Rédigé le 27/10/2026.

## 1. Objet et format

- **Message** : ce que Shephr offre gratuitement, aujourd'hui et demain — une idée par plan :
  le Message de Bertoua dans son assemblée ; la vie de son assemblée (comptes rendus, réunions,
  journal) ; le suivi des brebis de son assemblée ; les objectifs (Goals & Reporting) ; l'arbre de la
  Hiérarchie et l'état des objectifs ; créer et déclarer des évènements, et leurs statistiques
  jusqu'à la ville ; lire les documents ; CMFIPraise (chants et projection).
- **Format** : 9:16, 1080 × 1920, 30 i/s, **2 520 images = 84,0 s**, français, sans voix off.
- **Aucun prix, nulle part**, aucune mention d'offre payante (pas de phrase finale sur les offres :
  la fin reste « Tout cela est et restera gratuit. »).
- **Rythme lent** (retours de JP sur les vidéos précédentes, « trop rapide ») : plans de 8,3 s,
  deux légendes par plan — l'idée (≈ 4 s), puis son explication (≈ 4 s) —, intertitres de 2,5 s,
  gestes à la vitesse de l'app, poses longues sur chaque écran.
- **Musique** : « Dieu fait toutes choses nouvelles » (`public/audio/`), comme « Étude », « Journal »
  et « Documents » (calage § 5).

## 2. Habillage

- Fond, téléphone, palette et polices de Shephr (`src/evenements/theme.ts`, `FondShephr`).
- **Pastilles de partie** en haut (gabarit de « Journal ») : `1 · SON ASSEMBLÉE` (mousse),
  `2 · SES OBJECTIFS` (argile), `3 · ET AUSSI` (sauge) ; mêmes couleurs pour les intertitres.
- **Intertitres** plein cadre de 2,5 s (gabarit d'« Étude ») : numéro, titre, phrase d'explication.
- **Tampon « Gratuit »** : à chaque plan à téléphone, une pastille ronde (la `PastilleCoin`
  d'« Évènements ») se pose en ressort sur le coin du téléphone, coche mousse + `GRATUIT`. Il
  s'efface avant que le téléphone tourne en P9.
- **Pastilles de personne** (gabarit d'« Étude ») : `SAMUEL · DIRIGEANT D'UNITÉ` (P2–P5, libellé de l'app
  « Dirigeant d'unité », JP 29/10),
  `DANIEL · DIRIGEANT DE VILLE` (P6), `BERNARD · DIRIGEANT SENIOR` (P7).
- **Légendes** : Fraunces 600, encre, mot clé en argile, taille ajustée (`LegendeDocuments`).

## 3. Découpage

| # | Images | Temps | Partie | Contenu |
|---|---|---|---|---|
| P1 | 0–135 | 0:00–0:04,5 | — | Ouverture : icône Shephr, « Ce qui est / et **restera** gratuit », « Pour chaque membre, chaque assemblée, chaque dirigeant. » |
| T1 | 135–210 | 0:04,5–0:07 | — | Intertitre « 1 · Son assemblée — Tout ce qui se vit chez soi, chaque semaine. » (sur la montée du chant) |
| P2 | 210–460 | 0:07–0:15,3 | 1 | Accueil de Samuel (date « Octobre 25, 2026 ») : halo puis appui sur la tuile « Le Message de Bertoua » → accueil de l'étude du dirigeant, l'unité UEMB002 se déplie, halo sur « Leçon 1 · Le prix à payer — Commencer ». |
| P3 | 460–710 | 0:15,3–0:23,7 | 1 | Onglet Assemblée de Paris Ouest : halos « Nouveau CR », « Journal PDF », la réunion du 18 octobre → son compte rendu (fraction de pain, lecture, 13 présents) qui défile. |
| P4 | 710–960 | 0:23,7–0:32 | 1 | Onglet Brebis : « Suivi des brebis », les 14 fiches de Paris Ouest arrivent ; halo sur les statuts ; la liste défile, halo sur Joël Mvondo « En danger · présent le 4 octobre 2026 ». |
| T2 | 960–1035 | 0:32–0:34,5 | — | Intertitre « 2 · Ses objectifs — S'engager, rendre compte, voir son arbre. » |
| P5 | 1035–1285 | 0:34,5–0:42,8 | 2 | « Objectifs » de Samuel (Vue : Personnelle, 2026, « Modifiable jusqu'au 31 déc. 2026. », Mes assemblées, Relancer) ; défilement sur « Mes objectifs », la barre d'« Effectifs » se remplit (5 personnes engagées, 3 versées, 60 %) ; puis « Déclarer l'état actuel » et « Soumettre mes engagements ». |
| P6 | 1285–1530 | 0:42,8–0:51 | 2 | Hiérarchie de Daniel : l'arbre arrive ligne à ligne (Daniel « Vous · Soumis », Marc Dubois « Rien déclaré », Samuel Fotso « Brouillon », Sophie Marchand « Soumis », leurs assemblées) ; appui sur Paris Ouest → ses 15 membres et l'état de leurs objectifs. **Plan tampon** (§ 5). |
| T3 | 1530–1605 | 0:51–0:53,5 | — | Intertitre « 3 · Et aussi — Évènements, documents, chants. » (sur l'entrée de l'orchestre) |
| P7 | 1605–1855 | 0:53,5–1:01,8 | 3 | Accueil de **Bernard** (dirigeant senior de l'Île-de-France, « Octobre 14, 2026 ») → tuile « Déclarer une action » → feuille de déclaration (type « Campagne », date « 14 octobre 2026 · Aujourd'hui » en halo) ; puis l'onglet Évènements, statistiques de l'Île-de-France défilées sur « Par ville » (Créteil 11, Paris 28, Versailles 9), halo sur Paris. |
| P8 | 1855–2105 | 1:01,8–1:10,2 | 3 | Espace Documents : dossiers, « Enseignements », « UMPJ — Retranscription de l'enseignement TA » → le lecteur, les pages défilent. |
| P9 | 2105–2355 | 1:10,2–1:18,5 | 3 | CMFIPraise : les paroles d'un chant, « Plein écran », le téléphone tourne, projection en paysage, partie suivante. |
| P10 | 2355–2520 | 1:18,5–1:24 | — | Fin : « Tout cela est / et **restera** gratuit. », icône, logotype ; fondu musical de 2,5 s. |

**10 plans** (dont 2 cartons) **et 3 intertitres**. Les plans qui suivent un intertitre (P2, P5, P7)
s'ouvrent sur le téléphone qui monte du bas ; entre deux plans d'une même partie, l'écran change
d'un coup, la légende annonce l'idée suivante.

## 4. Légendes (`src/gratuit/textes.ts`)

| Plan | Idée | Explication (à partir de) |
|---|---|---|
| P2 | Le Message de Bertoua / dans *son assemblée* | Séances, réponses, / *notes* et progression (i 146) |
| P3 | La vie de / *son assemblée* | Comptes rendus, réunions, / *journal* en PDF (i 96) |
| P4 | Le suivi des *brebis* / de son assemblée | Un statut pour chacun, / ses *présences* (i 146) |
| P5 | Ses *objectifs* / et leur avancement | S'engager, déclarer, / puis *soumettre* (i 156) |
| P6 | L'arbre de / sa *hiérarchie* | Qui a *soumis*, / qui n'a rien déclaré (i 146) |
| P7 | Créer, *déclarer*, / programmer | Les statistiques, / *jusqu'à la ville* (i 130) — dites sur le téléphone de Bernard, qui lit sa région (§ 7.4) |
| P8 | Les *documents*, / rangés en dossiers | À lire / *dans l'app* (i 136) |
| P9 | *CMFIPraise* : / tous les chants | Et la *projection* / en plein écran (i 110) |

Libellés de l'app : copiés de `shephr-app/mobile/utils/i18n/locales/fr.json` (clé en commentaire
dans `textes.ts` pour les écrans redessinés ici ; les écrans repris gardent les textes de leur
vidéo, déjà copiés de l'app). Libellés de CMFIPraise : ceux de « Catégories de chants » (`src/textes.ts`).

## 5. Calage musical (`src/gratuit/calage.ts`)

Piste de 451,8 s : 24,0 s nette montée, 70,5 s entrée de l'orchestre.

- La **montée** tombe sur l'intertitre « 1 » (fin de l'ouverture) : la vidéo part à
  24,0 s − 4,5 s = **19,5 s** du fichier (`TRIM_BEFORE` = 585 images).
- L'**orchestre** tombe sur l'intertitre « 3 · Et aussi », 1 395 images après la montée.
- **P6 est le plan tampon** : sa durée est calculée, 1 395 − (75 + 3 × 250 + 75 + 250) = **245
  images** ; garde à 235 images (`DUREE_P6_MIN`). Retoucher P2–P5 ou un intertitre se reporte sur P6 ;
  retoucher P1 déplace le point de départ dans le chant. `Video.tsx` vérifie les deux rendez-vous
  au chargement.
- Fondu d'entrée de 12 images, fondu de sortie de 2,5 s sur la fin.

## 6. Données fictives (`src/gratuit/donnees.ts`)

Toutes inventées, reprises des vidéos précédentes pour rester cohérentes :

- **Paris Ouest** (ville de Paris), dirigée par **Samuel Fotso** (« Étude », « Guide ») ; ses 15
  comptes rattachés (`MEMBRES_PARIS_OUEST` d'« Étude »), dont 14 fiches de suivi (Samuel, dirigeant
  d'unité, n'en a pas) ; journal de « Guide » (dernier compte rendu le 18 octobre, 13 présents, Joël
  et Rose absents) ; statuts Member Care par défaut du serveur (Nouveau, En intégration, Engagé, En
  danger, Rétrograde) ; Joël « En danger », présent pour la dernière fois le 4 octobre.
- **Objectifs de Samuel** (But Quinquennal, catégories réelles du serveur) : Couples missionnaires
  2 / 2 couples, Effectifs 5 engagées / 3 personnes ; les catégories en euros (Livres, Fonds
  d'urgence, Hall) « À compléter » — **aucun montant à l'image**. Samuel est « Brouillon », comme
  dans l'arbre de Daniel.
- **Bernard Lemoine** (« Journal », « Caleb ») : dirigeant senior de l'Île-de-France, superviseur
  de Daniel ; accueil « Bon retour, Bernard. », initiales BL (P7).
- **Hiérarchie de Daniel Mercier** (dirigeant de la ville, « Journal »), qui rend compte à Bernard
  Lemoine : Marc Dubois (Paris Sud, 9 membres, Rien déclaré), Samuel Fotso (Paris Ouest, 15 membres,
  Brouillon), Sophie Marchand (Paris Est, 10 membres comme dans « Caleb », Soumis). Date limite de l'année au 31 décembre :
  personne n'est « En retard ».
- **Évènements**, **Documents**, **CMFIPraise** : données des vidéos « Évènements », « Documents »
  et « Catégories de chants ».

## 7. Choix et écarts assumés

1. **Aucun montant** : les écrans Objectifs et Hiérarchie ne montrent que des catégories comptées ;
   le bloc « Ce que porte mon leadership » (sommes en euros) n'est pas dessiné.
2. **Hiérarchie** : seuls l'en-tête, « Mon superviseur », les segments et l'arbre sont dessinés ;
   les blocs de statistiques au-dessus de l'arbre (et leur verrou) ne le sont pas — la vidéo
   parle de ce qui est gratuit.
3. **Barre d'onglets à six onglets** (Accueil, Objectifs, Assemblée, Évènements, Brebis, Profil) :
   celle d'un dirigeant qui a Vie d'assemblée, Évènements et Member Care — Samuel (P2–P5) comme
   Bernard (P7) : les onglets Assemblée et Brebis suivent `isLeader`, pas le rang. Elle est posée par-dessus la barre à cinq
   onglets des écrans repris (`BarreOnglets6`, fond opaque), pour que Samuel ait la même barre
   partout ; libellés en 9,5 points pour tenir à six.
4. **Statistiques d'Évènements** : niveau région (Île-de-France), la liste « Par ville » — gratuit
   jusqu'au niveau ville, toutes les villes comptées (D-OFF-12) ; la ventilation à l'intérieur d'une
   ville n'est pas montrée. **Revue du 27/10** : P7 se joue sur le téléphone de **Bernard Lemoine,
   dirigeant senior** de l'Île-de-France, et non plus de Samuel. D-OFF-12 ouvre ces statistiques
   dans le **périmètre de lecture géographique** de chacun : `EventStatsServiceImpl.stats` refuse
   (403) une racine que `perimeter.canRead` n'admet pas, et un dirigeant d'unité ne lit que ses
   assemblées — la région lui serait refusée. La légende « Les statistiques, jusqu'à la ville »
   reste juste pour Bernard. Le fil d'Ariane (« France › Île-de-France ») reste hors champ (écran
   défilé sur « Par ville »).
5. **P7** : la feuille de déclaration est celle d'« Évènements », reprise sans modification ; le
   haut seul est à l'image (type, date), le bandeau de rattachement et le sélecteur qu'aurait un
   dirigeant senior restent hors champ. L'accueil porte la date de la feuille de déclaration d'« Évènements » (14 octobre, «
   Aujourd'hui »), pour que les deux écrans disent le même jour.
6. **P9** : écrans de CMFIPraise (l'autre application), onde du doigt bleue de CMFIPraise ; pas de
   pastille de personne.
7. Écrans repris **sans modification** : accueil et accueil de l'étude (« Étude »), Vie d'assemblée
   et compte rendu (« Journal », avec le jeu Paris Ouest de « Guide » par `FournisseurJournal`),
   déclaration et statistiques (« Évènements »), espace Documents et lecteur (« Documents »), paroles
   et présentation (« Catégories »). Écrans redessinés ici : Brebis, Objectifs, Hiérarchie (arbre).

## 8. Intégration (à faire par l'agent d'intégration)

- Composition à enregistrer dans `src/Root.tsx` :
  `<Composition id="GratuitFR" component={VideoGratuit} durationInFrames={DUREE_GRATUIT} fps={FPS} width={1080} height={1920} />`
  (import `{ DUREE_GRATUIT, VideoGratuit } from './gratuit/Video'`).
- Script de rendu : `"render:gratuit": "remotion render GratuitFR out/gratuit-fr.mp4"`.

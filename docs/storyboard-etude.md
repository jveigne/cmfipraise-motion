# Storyboard — motion « L'Étude de l'assemblée » (Shephr), version française

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composition Remotion **`EtudeFR`** (prop `langue: 'fr'`)
> (script `"render:etude": "remotion render EtudeFR out/etude-fr.mp4"`).
> Durée : **5 010 images = 167,0 s (2 min 47)**. Français, sans voix off ; musique « Dieu fait
> toutes choses nouvelles », la même que « Journal » et « Documents » (§ 5).
> Rédigé le 21/10/2026 (lot ETU7), codé dans `src/etude/` ; **révisé le 21/10** sur les
> retours de JP (§ 8.2) : plus lent (112 s → 167 s, poses, légendes d'explication, intertitres), la
> réunion **le dimanche, en journée**, un vrai moment pour ceux qui répondent **sur papier** (livret
> ou cahier, P11 et P16), la phrase de fin « Le Message de Bertoua, simplement. ». Les images du § 3
> sont celles du code ; le § 4 décrit chaque plan. **Version anglaise** `EtudeEN` (21/10) : § 10.
>
> Sources vérifiées :
> - règles : `cmfipraise-backend/docs/shephr/21_10_2026/01_Plan_Etude_Assemblee.md` (§ 1, D-ETU-05
>   à 13, D-ETU-18, D-ETU-23, RG-ETU-01 à 18, § 6.3, § 7.1) et `02_Contrat_API_Etude.md` (§ 2.3,
>   § 4.1 à 4.8, § 5) ; présentation au pasteur `Etude_Assemblee_Presentation.pdf` (version 2,
>   20/10 : déroulé en trois temps, Marie K., Jean P., Esther M., Paul N.) ;
> - contenu de la leçon : `cmfipraise-backend/docs/shephr/21_10_2026/uemb002-exemple.json` (les
>   questions de la spec, leçon 1 « Le prix à payer ») ;
> - écrans **livrés** (lot ETU4, branche `feat/etude-assemblee`) : `shephr-app/mobile/app/(tabs)/home.tsx`
>   (tuile), `app/study/index.tsx`, `app/study/session/[id].tsx`, `app/study/results/[id].tsx`,
>   `app/study/progress.tsx`, `components/StudyQuestionList.tsx` ; libellés :
>   `mobile/utils/i18n/locales/fr.json` § `study.*` (§ 7.2).

---

## 1. Ce que la vidéo doit faire comprendre

Public : **les dirigeants d'assemblée et les membres** (adopter l'étude dans l'app), puis le pasteur
et la hiérarchie. Une idée par plan, sans jargon (pas de « séance `REPONSES_OUVERTES` », « copie
APP », « module »). Fil conducteur (plan § 7.1) : **une assemblée typique mise en exergue**. On
suit **leur** réunion, du salon au bilan, plutôt qu'une démonstration de fonctions.

| Partie | Message |
|---|---|
| **Le problème** | Un dimanche, en journée, une assemblée de maison dans un salon : le dirigeant, une douzaine de personnes, le livre « Disciple coûte que coûte », les livrets. Aujourd'hui (1) on **échange les cahiers** et on corrige à la main ; (2) les **notes se perdent** sur une feuille volante ; (3) **rien de visible** : le dirigeant ne sait pas où en est chacun, et la ville encore moins. |
| *Bascule* | « On lit, on répond, on corrige ensemble. » (phrase de la présentation au pasteur), sur la montée du chant (24,0 s). |
| **1 · Lire** | On lit la portion ensemble ; le dirigeant touche la tuile « Le Message de Bertoua », puis *Commencer*. |
| **2 · Répondre** | Les questions arrivent sur chaque téléphone : vrai / faux, cases, réponse écrite, question personnelle ; « enregistré ✓ », même sans réseau. Puis tout le salon répond (sur l'entrée de l'orchestre, 70,5 s) : **pas d'application ? on répond dans son livret (Paul) ou dans un cahier (Hélène), comme aujourd'hui**. |
| **3 · Corriger** | *Passer à la correction* ; les questions fermées se corrigent seules ; on **échange les téléphones** : *Juste* / *À préciser* / *À revoir* ; la question personnelle reste masquée. |
| **4 · Terminer** | *Terminer* : chacun voit sa note ; le dirigeant voit les résultats et saisit la note du livret de Paul et du cahier d'Hélène (« copie papier », la note seule) : les deux copies papier rejoignent les résultats. |
| **5 · Au fil des réunions** | Dimanche après dimanche : 3 leçons sur 5, chacun voit sa progression ; la ville voit l'avancement des assemblées, **jamais les réponses personnelles**. |
| **Fin** | « Le Message de Bertoua, simplement. » + Shephr. |

Réponse de l'app à chacun des trois problèmes :

| Problème (cahiers) | Réponse montrée | Plans |
|---|---|---|
| 1. Cahiers échangés, corrigés à la main | Les fermées se corrigent seules ; on échange les **téléphones**, avec la réponse du manuel sous les yeux | P13, P14 |
| 2. Notes perdues | La note s'affiche à la fin, les résultats sont gardés, les notes papier s'y ajoutent | P15, P16 |
| 3. Rien de visible | Progression de chacun (3 / 5), avancement de l'assemblée et des assemblées de la ville | P17, P18 |

Et ceux qui n'ont pas l'application ne sont pas laissés de côté (JP 21/10) : ils répondent dans
leur livret ou dans un cahier, **comme aujourd'hui** (P11), et le dirigeant saisit leur note
(P16) — D-ETU-13 : une copie papier, c'est **la note seule**, pas les réponses.

**Formulations retenues (exactitude).**
- Le dirigeant a **trois boutons** (*Commencer*, *Passer à la correction*, *Terminer*), plan § 1 ;
  *Annuler la séance* existe mais n'est pas montré.
- « Même sans réseau » : la réponse est **enregistrée sur le téléphone** (« enregistré ✓ ») et part
  au retour du réseau (D-ETU-11). La vidéo ne promet pas qu'une réponse tapée **après** le passage à
  la correction compte (elle est ignorée au-delà de 2 min, RG-ETU-04).
- « Jamais les réponses personnelles » : la ville voit les **notes** et les leçons faites
  (D-ETU-08), pas le contenu des copies (D-ETU-09). La légende ne dit rien de plus large.

---

## 2. Principes de mise en scène

Mêmes principes que « Journal » et « Documents » (`docs/storyboard-journal.md` § 2,
`docs/storyboard-documents.md` § 2), réutilisés tels quels :

- **Téléphone** `src/ui/Telephone.tsx` posé par `Plateau` (640 px de large, haut de l'écran à
  y = 430) ; mode avion par sa prop `avion` (mécanisme de P7 de « Documents »). Écrans de l'app
  **redessinés en code** à l'identique des écrans livrés (§ 7) : thème et briques de
  `src/evenements/ui/app.tsx`, habillage `src/evenements/ui/Habillage.tsx`.
- **Navigation fidèle à l'app** : les écrans de l'étude sont poussés sur la pile racine
  (`app/_layout.tsx`, `slide_from_right`) : ils **arrivent de la droite** (`Pile`) et n'ont **pas** de
  barre d'onglets (`ScreenShell withTabBar={false}`). Seul l'accueil a la barre d'onglets. Les
  confirmations (`confirmDialog`) sont des **alertes système** iOS : titre, message, « Annuler » et
  le bouton de confirmation (§ 7.4).
- **Plusieurs téléphones** (P8, P14, P15) : réduits (0,62 à 0,8), côte à côte, chacun coiffé d'une
  **pastille de personne** hors du téléphone (annotation vidéo, gabarit des pastilles « 🇫🇷 Marie ·
  Paris » de « Documents ») : `MARIE`, `JEAN`, `ESTHER`, `PAUL`, `HÉLÈNE`, `SAMUEL · DIRIGEANT`, `DANIEL · VILLE`.
  C'est ainsi que l'on suit les mêmes personnes d'un plan à l'autre.
- **Gestes** `Appui` ; zoom de caméra 1,25–1,5 et halo argile sur l'information clé. **Saisie de
  texte** (P9, P16) : le texte s'écrit lettre à lettre dans le champ, sans clavier dessiné (§ 7.4).
- **Légendes** `LegendeShephr` en haut (y 130 → 400), 2 lignes au plus, mot clé `*argile*`,
  typographie française (U+202F avant ? ! ;, U+00A0 avant : et dans « », apostrophe ’). Les
  libellés de l'app restent à la lettre de `fr.json`.
- **Pastilles de partie** (`PastillePartie` de `src/journal/plans/commun.tsx`, y = 56,
  JetBrains Mono 26 px, texte `#F2E9D2`) :

  | Partie | Plans | Pastille | Couleur |
  |---|---|---|---|
  | Le problème | P1–P4 | `LE PROBLÈME` | `ink2 #5C544A` |
  | — | P5 | aucune (bascule) | — |
  | 1 · Lire | P6–P7 | `1 · LIRE` | `moss #1E3A2F` |
  | 2 · Répondre | P8–P11 | `2 · RÉPONDRE` | sauge `#7A8B6F` |
  | 3 · Corriger | P12–P14 | `3 · CORRIGER` | `earthDeep #A7754B` |
  | 4 · Terminer | P15–P16 | `4 · TERMINER` | `clay #B86A4A` |
  | 5 · Au fil des réunions | P17–P18 | `5 · AU FIL DES RÉUNIONS` | `mossSoft #2E5142` |
  | Fin | P19 | aucune | — |

- **Intertitres** (révision du 21/10, modèle d'« Évènements ») : 2,5 s (75 images) plein cadre
  **avant les parties 2 à 5**, à la couleur de la partie : le numéro (Fraunces italique 300 px,
  `earth` à 60 %), le titre (Fraunces 600, `white`) et une phrase d'explication (Fraunces italique
  46 px, `parchment`) : « 2 · Répondre — Sur son téléphone, ou sur papier. », « 3 · Corriger — On
  échange les téléphones. », « 4 · Terminer — Chacun voit sa note. », « 5 · Au fil des réunions —
  Dimanche après dimanche. ». L'aplat monte sur le plan précédent (figé 10 images) et repart en
  découvrant le suivant (figé 10 images), comme dans « Évènements ». La partie 1 n'en a pas : la
  bascule P5 lui sert d'ouverture.

- **Partie « Le problème » et plan P6** : **illustrations**, pas d'écran d'app, dans le style de
  « Le cahier » de « Journal » (objets plats aux couleurs de la palette, écriture en Fraunces
  italique 400 `ink2`, silhouettes `Silhouette` tête ronde + buste). **Le salon** (P1, P6) : un
  canapé et deux fauteuils (`parchmentDeep`, contours `ink3`), une table basse, une lampe **éteinte**,
  une **fenêtre de jour** (ciel clair, soleil voilé `earth`, un arbre `sauge`) dont la lumière se pose
  en biais sur le sol ; **pas de lampe allumée** : la réunion a lieu le dimanche, en journée (JP 21/10) ;
  dans le fauteuil, **Hélène**, l'aînée (cheveux blancs en chignon, canne) ; sur la table, le livre « Disciple coûte que
  coûte » (couverture dessinée : aplat `moss`, titre Fraunces `white` — **pas** la couverture réelle
  de l'éditeur) et une pile de livrets (couverture kraft `earth`, « Livret de l'étudiant · UEMB002 »).
  Le salon revient en fond, flouté et assombri, sous les téléphones de P8, P14 et P15 : on reste
  dans la même pièce, le même dimanche. En P11, il revient net, chacun un téléphone allumé en main,
  sauf Paul (son livret) et Hélène (un cahier).
- **Fond** : `FondShephr` (paper2 + halos lents), sauf quand le salon est en fond.
- **Rythme** (révision du 21/10, retour JP : « plus lent, pour bien expliquer ») : les **gestes
  gardent leur vitesse**, les **poses s'allongent**. Mécanisme : chaque plan garde sa chorégraphie
  d'origine (« images d'origine » au § 4) et reçoit des **poses** — `[image d'origine, durée]` : à cet
  instant tout s'arrête (rien ne bouge, on lit), puis reprend (`Ralenti` dans
  `src/etude/plans/commun.tsx`, un `Freeze` sur l'image d'origine). Les poses tombent sur des
  instants calmes : jamais pendant un appui (−8 → +22 images autour de l'appui), un ressort ou une
  transition. Les légendes sont posées dans le temps ralenti (« images du plan ») ; chacune ≥ 2 s,
  la plupart ≈ 2,5 à 4 s. Légendes d'explication ajoutées là où une étape passait vite (P1, P7,
  P8, P9, P10, P12, P13, P14, P15, P16, P18).

---

## 3. Découpage

| N° | Partie | Images (début → fin) | Durée | Idée |
|---|---|---|---|---|
| P1 | Le problème | 0 → 225 | 225 i · 7,5 s | Le dimanche, une assemblée de maison ; chacun répond dans son cahier |
| P2 | Le problème | 225 → 405 | 180 i · 6,0 s | On échange les cahiers, on corrige à la main |
| P3 | Le problème | 405 → 555 | 150 i · 5,0 s | Les notes, sur une feuille volante, se perdent |
| P4 | Le problème | 555 → 720 | 165 i · 5,5 s | Le dirigeant ne voit rien, la ville non plus |
| P5 | Bascule | **720** → 870 | 150 i · 5,0 s | Tuile + carton « On lit, on répond, on corrige ensemble. » — **montée du chant (24,0 s)** |
| P6 | 1 · Lire | 870 → 1020 | 150 i · 5,0 s | La leçon lue ensemble dans le livre |
| P7 | 1 · Lire | 1020 → 1335 | 315 i · 10,5 s | Samuel : la tuile, la leçon 1, *Commencer* ; la séance ouverte |
| — | intertitre | 1335 → 1410 | 75 i · 2,5 s | « 2 · Répondre — Sur son téléphone, ou sur papier. » |
| P8 | 2 · Répondre | 1410 → 1635 | 225 i · 7,5 s | La tuile « En cours » ; les questions arrivent sur chaque téléphone |
| P9 | 2 · Répondre | 1635 → 1950 | 315 i · 10,5 s | Marie répond : vrai / faux, cases, écrit, personnelle ; « enregistré ✓ » |
| P10 | 2 · Répondre | 1950 → 2115 | 165 i · 5,5 s | Jean sans réseau : « enregistré ✓ », les réponses partent au retour du réseau — **plan tampon** |
| P11 | 2 · Répondre | **2115** → 2415 | 300 i · 10,0 s | Tout le salon répond ; **Paul dans son livret, Hélène dans un cahier** — **entrée de l'orchestre (70,5 s)** |
| — | intertitre | 2415 → 2490 | 75 i · 2,5 s | « 3 · Corriger — On échange les téléphones. » |
| P12 | 3 · Corriger | 2490 → 2655 | 165 i · 5,5 s | Samuel : *Passer à la correction* |
| P13 | 3 · Corriger | 2655 → 2895 | 240 i · 8,0 s | La correction s'ouvre ; les questions fermées se corrigent seules (2 / 4) |
| P14 | 3 · Corriger | 2895 → 3285 | 390 i · 13,0 s | On échange les téléphones : *Juste* / *À préciser* / *À revoir* ; la personnelle masquée |
| — | intertitre | 3285 → 3360 | 75 i · 2,5 s | « 4 · Terminer — Chacun voit sa note. » |
| P15 | 4 · Terminer | 3360 → 3630 | 270 i · 9,0 s | *Terminer* : chacun voit sa note |
| P16 | 4 · Terminer | 3630 → 4125 | 495 i · 16,5 s | Les résultats ; les copies papier de Paul et d'Hélène |
| — | intertitre | 4125 → 4200 | 75 i · 2,5 s | « 5 · Au fil des réunions — Dimanche après dimanche. » |
| P17 | 5 · Au fil | 4200 → 4470 | 270 i · 9,0 s | Dimanche après dimanche : 3 leçons sur 5 |
| P18 | 5 · Au fil | 4470 → 4830 | 360 i · 12,0 s | La ville voit l'avancement, jamais les réponses personnelles |
| P19 | Fin | 4830 → 5010 | 180 i · 6,0 s | « Le Message de Bertoua, simplement. » |

Totaux : le problème 24,0 s · bascule 5,0 s · lire 15,5 s · répondre 36,0 s (intertitre compris) ·
corriger 29,0 s · terminer 28,0 s · au fil des réunions 23,5 s · fin 6,0 s → **5 010 images =
167,0 s** (cible JP du 21/10 : ≈ 2 min 45 à 3 min ; version précédente : 112 s).

⚠ **Contraintes musicales** (§ 5) :
- la partie « Le problème » ne peut pas dépasser **24,0 s** (720 images) : elle y est exactement,
  la vidéo part donc du début du fichier ;
- de P5 (720) à P11 (2115), il doit y avoir **exactement 1 395 images** (46,5 s, l'écart entre la
  montée de 24,0 s et l'orchestre de 70,5 s dans le fichier). P5 à P9, intertitre compris, totalisent
  150 + 150 + 315 + 75 + 225 + 315 = 1 230 ; **P10 est le plan tampon**, sa durée est calculée :
  1 395 − 1 230 = **165** (garde : 135 au moins). Retoucher une durée entre P5 et P9 se reporte sur
  P10.

---

## 4. Plans détaillés

Images **locales** (i 0 = début du plan). Pour les plans ralentis (révision du 21/10, § 2 « Rythme »),
**« Animation » décrit la chorégraphie d'origine** (images d'origine, gestes à leur vitesse) ;
la ligne **« Poses »** donne les arrêts ajoutés `[image d'origine, durée]` et la ligne
**« Légendes »** les images **du plan ralenti** (celles de la vidéo). Les libellés entre guillemets
sont ceux de l'app (clé `fr.json` au § 7.2), sauf mention « annotation vidéo ». Personnes, questions
et notes : § 6.
`Label` met ses textes en majuscules (« COMMENCER UNE SÉANCE », « MA NOTE », « 11 COPIES ») ;
le surtitre des écrans de l'étude (`kicker`) aussi.

### P1 — Le dimanche, une assemblée de maison · 225 i (7,5 s) · images 0 → 225

- **À l'écran** (illustration) : le salon en plein jour (§ 2), vu de face, un peu en plongée. Treize silhouettes
  assises en arc autour de la table basse (canapé, fauteuils, chaises ajoutées, deux sur des
  poufs), livret ouvert sur les genoux ; au centre, debout près de la lampe éteinte, le dirigeant, le livre
  « Disciple coûte que coûte » à la main. Cinq étiquettes (cartes `paper`, rayon 16, Inter 600
  28 px) se posent sous cinq silhouettes : **« Samuel · dirigeant »** (silhouette `moss`),
  **« Marie »**, **« Jean »**, **« Esther »**, **« Paul »** (`mossSoft`) ; les autres restent
  anonymes (`ink3`), dont Hélène dans le fauteuil (présentée en P11).
- **Animation** (images d'origine, 165) : i 0 → 20 le salon se pose (fondu montant), la lumière du
  jour sur le sol. i 24 → 60 les silhouettes s'assoient en cascade (2 images d'écart, petit rebond). i 70 →
  110 les cinq étiquettes en ressort (8 images d'écart), Samuel d'abord. i 120 → 150 chacun sort
  un **cahier** (petits rectangles kraft `PetitCahier`) et y écrit (trait qui se trace). i 150 → 165
  travelling vers Marie et Jean.
- **Poses** : [119, 30] (les cinq étiquettes), [150, 30] (chacun écrit).
- **Légendes** : `Le dimanche,` / `*une assemblée de maison*.` (i 6 → 148), puis `Chacun répond` /
  `*dans son cahier*.` (i 152 → fin).
- **Transition** : enchaînée — la caméra avance sur Marie et Jean (P2).
- Pastille `LE PROBLÈME` de i 0 à la fin de P4 (fondu d'entrée 10 images).

### P2 — On échange les cahiers, on corrige à la main · 180 i (6,0 s) · images 225 → 405

- **À l'écran** (illustration) : gros plan sur Marie et Jean côte à côte, chacun son cahier ouvert
  (page lignée `PageLignee`, écriture Fraunces italique) : sur celui de Marie, « Leçon 1 » /
  « Q1. Que nous fassions des disciples. » / « Q11. b c f a ».
- **Animation** (images d'origine, 150) : i 0 → 14 respiration (fin du travelling). i 16 → 50 les deux cahiers
  **s'échangent** en arc (Marie → Jean, Jean → Marie). i 56 → 90 sur le cahier de Marie, une main
  invisible (trait `clay`) coche « ✓ » à côté de Q1, puis hésite sur Q11 : un « ? » argile
  (`Question`) se pose (i 92). i 96 → 130 la ligne « Q11 » se rature et se réécrit (le crayon
  gomme, la page se froisse un peu). Tenue jusqu'à i 150.
- **Poses** : [52, 15] (cahiers échangés), [92, 15] (avant le « ? »).
- **Légende** : `On échange *les cahiers*,` / `on corrige *à la main*.` (i 6 → fin).
- **Transition** : coupe sur P3.

### P3 — Les notes se perdent · 150 i (5,0 s) · images 405 → 555

- **À l'écran** (illustration) : Samuel, livre ouvert ; une **feuille volante** glissée entre deux
  pages, où il note au crayon : « Marie 10,5 » / « Jean 9 » / « Esther 12,5 » / « Paul ? ».
- **Animation** (images d'origine, 120) : i 0 → 12 respiration. i 14 → 50 les quatre lignes s'écrivent (une toutes les
  9 images). i 60 → 78 le livre se referme d'un coup ; la feuille dépasse, se détache (i 80) et
  sort du cadre en virevoltant (i 80 → 110) ; reste un **contour pointillé** vide là où elle était,
  tenu jusqu'à i 120.
- **Pose** : [52, 30] (les quatre notes écrites, lisibles).
- **Légende** : `Les notes, sur une feuille…` / `et elles *se perdent*.`
- **Transition** : coupe sur P4.

### P4 — Le dirigeant ne voit rien, la ville non plus · 165 i (5,5 s) · images 555 → 720

- **À l'écran** (illustration) :
  1. Samuel seul (silhouette `moss`), trois étiquettes « ? » autour de lui (gabarit de P5 de
     « Journal ») : « Qui a fait la leçon 3 ? », « Où en est Paul ? », « Qui a besoin d'aide ? » ;
  2. recul : au-dessus, la boîte « VILLE · PARIS » (gabarit des boîtes de « Journal » P5) avec une
     silhouette ; entre la ville et l'assemblée, un trait **pointillé interrompu** et un « ? »
     (`clay`).
- **Animation** (images d'origine, 150) : i 0 → 12 Samuel se pose. i 14 → 56 les trois étiquettes en ressort (14 images
  d'écart). i 76 → 96 recul de caméra (1 → 0,72), la boîte « VILLE · PARIS » descend du haut, le
  pointillé se trace puis se brise (i 96 → 104), « ? » (i 104). Tenue jusqu'à i 150.
- **Pose** : [72, 15] (les trois questions).
- **Légendes** : `Où en est chacun ?` / `*Personne ne sait.*` (i 6 → 89), puis `Et la ville` /
  `*ne voit rien*.` (i 95 → fin).
- **Transition** : **sur la montée du chant** (P5, image 720) : tout le dessin descend et s'efface
  en 10 images.

### P5 — Bascule : « On lit, on répond, on corrige ensemble. » · 150 i (5,0 s) · images 720 → 870

- **Calage** : i 0 = **24,0 s du chant** (nette montée, +6 dB).
- **À l'écran** (sans téléphone) : les cahiers, la feuille volante et les « ? » de P1–P4 s'aspirent
  vers le centre ; la tuile d'accueil **« Le Message de Bertoua » · « Étude de l'assemblée »**
  (icône `school-outline`, teinte `moss`, gabarit `Tuile` exporté par « Évènements ») jaillit
  agrandie 2,6 fois (gabarit de P4 de « Documents »). Carton dessous : **« On lit, on répond, »** /
  **« on corrige *ensemble*. »** (Fraunces 600, 104 px, `ink` ; « ensemble » en `clay`).
- **Animation** (images d'origine, 135) : i 0 → 10 sortie du dessin de P4. i 4 → 34 aspiration ; i 28 la tuile en ressort ;
  i 40 et i 50 les deux lignes du carton (fondus montants). Tenu jusqu'à i 125 ; i 125 → 135 le
  carton s'efface, la tuile reste et se réduit vers le haut (elle sera celle de l'accueil de P7).
- **Pose** : [90, 15] (la phrase, tenue).
- **Légende** : aucune (le carton est le texte).

### P6 — On lit ensemble · 150 i (5,0 s) · images 870 → 1020

- **À l'écran** (illustration) : retour au salon de P1, cadré sur Samuel et la table basse. Le
  livre « Disciple coûte que coûte » est ouvert (double page : « Préface » à gauche,
  « Chapitre 1 » à droite, lignes de texte en aplats `hair`) ; autour, les livrets ouverts sur
  « Leçon 1 · Le prix à payer ». Une ligne de lecture (surlignage `earth` à 30 %) descend la page
  pendant que Samuel lit ; les silhouettes de Marie, Jean, Esther et Paul suivent dans leur livret.
- **Animation** (images d'origine, 120) : i 0 → 14 le salon revient (fondu). i 16 → 100 la ligne de lecture descend la page
  de droite. i 90 → 110 Samuel pose le livre et sort son téléphone (petit rectangle `ink`). Tenue
  jusqu'à i 120.
- **Pose** : [60, 30] (la lecture s'attarde sur une ligne).
- **Légende** : `D’abord, on lit` / `*la leçon ensemble*.`
- **Transition** : le téléphone de Samuel monte et remplit le cadre (P7).
- Pastille `1 · LIRE` de P6 à P7.

### P7 — La tuile, la leçon 1, *Commencer* · 315 i (10,5 s) · images 1020 → 1335

- **À l'écran** (pastille `SAMUEL · DIRIGEANT` au-dessus du téléphone) :
  1. l'**accueil** de Samuel (`app/(tabs)/home.tsx`, gabarit de l'accueil de « Documents ») :
     « Octobre 25, 2026 », « Bon retour, » / *Samuel*., pastille « SF », carte « Mes objectifs » ;
     tuiles dans l'ordre du code : « Déclarer une action » / « Évangélisation », « Documents » /
     « Enseignements à lire et partager », **« Le Message de Bertoua » / « Étude de l'assemblée »**
     (icône école, teinte `moss`, **sans** pastille : aucune séance ouverte), « Créer une
     assemblée » / « Dans la ville de votre choix », « Membres » / « Annuaire de votre périmètre »,
     « Hiérarchie » / « Votre leadership » (cadrage sur les trois premières rangées) ; barre
     d'onglets Accueil · Objectifs · Assemblée · Évènements · Profil ;
  2. l'**accueil de l'étude** (`app/study/index.tsx`, dirigeant, aucune séance en cours) : chevron
     retour ; « ÉTUDE DE L'ASSEMBLÉE » (surtitre mono `clay`) ; « Le Message de Bertoua »
     (Fraunces 28) ; « PARIS OUEST » (`Label`, `mossSoft`) ; « COMMENCER UNE SÉANCE » ; la rangée
     de l'unité : icône école sur `mossTint`, **« UEMB002 · Devenir et être disciple du Seigneur
     Jésus-Christ »** (Fraunces 16, 2 lignes) / « 0 / 5 leçons », chevron bas ; « SÉANCES
     TERMINÉES » / « Aucune séance terminée pour l'instant. » ; bouton doux « Avancement de
     l'assemblée » ;
  3. après l'appui sur l'unité : *« Disciple coûte que coûte »* (Fraunces italique) puis les cinq
     leçons, cercle vide : **« Leçon 1 · Le prix à payer »** / « Préface et chapitre 1 » ·
     « Commencer » ; « Leçon 2 » / « Chapitre 2 » · « Commencer » ; … jusqu'à « Leçon 5 » ;
  4. l'**alerte** « Commencer la séance ? » / « Leçon 1 · Le prix à payer — les répondants
     pourront répondre dès maintenant. » / « Annuler » · « Commencer » ;
  5. la **séance** (`app/study/session/[id].tsx`, arrivée de la droite) : surtitre « UEMB002 ·
     DEVENIR ET ÊTRE DISCIPLE DU SEIGNEUR JÉSUS-CHRIST » (2 lignes) ; « Leçon 1 · Le prix à payer »
     (Fraunces 26) ; *« Préface et chapitre 1 »* ; pastille « RÉPONSES OUVERTES » (contour `moss`) ·
     « Paris Ouest » ; carte « DIRIGEANT » + lien « Résultats » : « 0 répondant », « Afficher les
     réponses du manuel », bouton plein « Passer à la correction », bouton « Annuler la séance »
     (danger) ; puis « 0 / 10 répondues » et la première question.
- **Animation** (images d'origine, 255) : i 0 → 20 le téléphone monte sur l'accueil (la tuile de P5 s'y pose à sa place,
  raccord). i 22 → 42 halo sur la tuile ; **appui i 46** ; i 50 → 66 l'accueil de l'étude arrive de
  la droite. i 72 → 86 halo sur la rangée UEMB002 ; **appui i 90** → les leçons se déroulent
  (i 92 → 104). i 106 → 120 zoom 1,3 sur les leçons ; halo sur « Leçon 1 · Le prix à payer » +
  « Préface et chapitre 1 » (i 112 → 136). **Appui « Commencer » i 140** → l'alerte monte
  (i 144 → 156). **Appui « Commencer » de l'alerte i 172** → i 178 → 194 la séance arrive de la
  droite (dézoom). i 198 → 240 halo sur la pastille « RÉPONSES OUVERTES », puis sur « 0
  répondant ». Tenue jusqu'à i 255.
- **Poses** : [34, 15] (halo sur la tuile), [124, 15] (les cinq leçons, « Leçon 1 · Le prix à
  payer »), [163, 15] (l'alerte), [230, 15] (la séance ouverte, « 0 répondant »).
- **Légendes** : `Le dirigeant touche` / `*Le Message de Bertoua*.` (i 6 → 101), `Il choisit` /
  `*la leçon du jour*.` (i 103 → 168), `Un geste :` / `*Commencer*.` (i 170 → 241), puis
  `La séance est ouverte :` / `chacun peut *répondre*.` (i 243 → fin).
- **Transition** : le téléphone de Samuel se réduit et glisse hors cadre à gauche (images d'origine 245 → 255).

### P8 — Les questions arrivent sur chaque téléphone · 225 i (7,5 s) · images 1410 → 1635

- **À l'écran** : le salon flouté en fond ; trois téléphones côte à côte (échelle 0,62), pastilles
  `MARIE`, `JEAN`, `ESTHER`. Chacun :
  1. son **accueil** (membre rattaché) : tuiles « Déclarer une action », « Documents », **« Le
     Message de Bertoua » avec la pastille « EN COURS »** (`livePill` : texte `white` sur `clay`),
     « Créer une assemblée », « Cantiques » ;
  2. l'**accueil de l'étude** (répondant) : la carte pleine `moss` de la séance en cours — point
     `earth` + « RÉPONSES OUVERTES », « Leçon 1 · Le prix à payer », « UEMB002 · Devenir et être
     disciple du Seigneur Jésus-Christ », « Répondre › » ; dessous, bouton « Ma progression » ;
  3. la **séance** en *Répondre* : en-tête de P7 (sans carte « Dirigeant »), « 0 / 10 répondues »,
     « Q1 » · « 2 pts » · « Quel est l'appel ultime du Seigneur Jésus ? » · champ « Votre réponse… ».
- **Animation** (images d'origine, 180) : i 0 → 24 les trois téléphones montent (6 images d'écart). i 26 → 50 halo sur les
  trois pastilles « EN COURS » (elles pulsent). **Appuis sur la tuile** i 54 / 62 / 70 ; l'accueil
  de l'étude arrive de la droite sur chacun. **Appuis « Répondre »** i 100 / 108 / 116 ; la séance
  arrive. i 130 → 170 halo commun sur les trois « Q1 » : la même question, au même moment, sur
  chaque téléphone. Tenue jusqu'à i 180.
- **Poses** : [44, 15] (les pastilles « En cours »), [150, 30] (la même Q1 sur les trois).
- **Légendes** : `Chez chacun, la tuile` / `passe *« En cours »*.` (i 6 → 111), puis `Les questions
  arrivent` / `*sur chaque téléphone*.` (i 113 → fin).
- **Transition** : le téléphone de Marie s'avance et grandit (échelle 1), les deux autres s'effacent.
- Pastille `2 · RÉPONDRE` de P8 à P11 (après l'intertitre « 2 · Répondre »).

### P9 — Marie répond · 315 i (10,5 s) · images 1635 → 1950

- **À l'écran** (pastille `MARIE`) : la séance en *Répondre* (`StudyQuestionList`, mode `answer`),
  questions de la leçon 1 dans l'ordre (§ 6.3) — chaque carte : numéro « Q5 » (mono `clay`),
  points à droite (« 1 pt », « 2 pts », « 4 pts »), énoncé, référence biblique en italique s'il y
  en a, puis la saisie selon le type :
  - Q1 (écrite) : champ « Votre réponse… » → « Que nous fassions des disciples. » ;
  - Q5 (oui / non) : « Oui » / « Non » (boutons radio) → « Oui » ;
  - Q6 (vrai / faux) : « Vrai » / « Faux » → « Vrai » ;
  - Q7 (consigne, Fraunces italique, sans points) « Lis les passages suivants : Exode 20 : 1-17 ;
    Romains 3 : 23. », puis ses **sous-questions** 7.a et 7.b, en retrait sous elle (filet gauche
    `mossTint2`), écrites → « Tous ont péché. » / « Romains 3 » ;
  - Q10, étiquette **« PERSONNELLE »** : « Y a-t-il encore des péchés dans ta vie ? » → champ
    rempli (texte de deux lignes, cadré petit, jamais zoomé) ;
  - Q11 (cases) : « Coche celles qui montrent le prix à payer pour être disciple. » · *Luc 14 :
    25-33* · sept cases « a. Garder la première place pour soi-même » … « g. Haïr sa propre vie à
    cause de Lui » → b, c, f, **et a** cochées.
  En haut, le compteur : « 1 / 10 répondues · enregistrement… » → « · enregistré ✓ ».
- **Animation** (images d'origine, 255) : i 0 → 10 respiration. **Appui sur le champ Q1 i 14** ; i 18 → 52 le texte s'écrit ;
  le compteur passe à « 1 / 10 répondues · enregistrement… » (i 52) puis « · enregistré ✓ »
  (i 73 : l'enregistrement part 0,7 s après la dernière frappe). i 76 → 90 défilement ; **appui
  « Oui » (Q5) i 94**, **« Vrai » (Q6) i 108**. i 112 → 124 défilement jusqu'à Q7 ; 7.a et 7.b
  s'écrivent (i 126 → 150). i 152 → 176 zoom 1,4 sur le compteur **« 5 / 10 répondues ·
  enregistré ✓ »**, halo, tenu ≈ 1 s. Dézoom et défilement jusqu'à Q10 (i 176 → 190) : halo sur
  l'étiquette « PERSONNELLE » (i 192 → 222) pendant que le champ se remplit. i 224 → 232 défilement ;
  **appuis b, c, f, a** de Q11 (i 234, 240, 246, 252). Fin sur « 7 / 10 répondues ».
- **Poses** : [74, 15] (« enregistré ✓ » après Q1), [166, 30] (zoom sur « 5 / 10 répondues ·
  enregistré ✓ »), [214, 15] (la question personnelle).
- **Légendes** : `Vrai ou faux, cases,` / `*réponses écrites*…` (i 6 → 161), `Chaque réponse` /
  `*s’enregistre aussitôt*.` (i 163 → 231), puis `…et questions` / `*personnelles*.` (i 233 → fin).
- **Transition** : coupe — P10 commence sur le téléphone de Jean.
- Q12 (exercice), Q13 et Q31 sont répondues hors champ (Marie finit à 10 / 10, § 6.4).

### P10 — Sans réseau · 165 i (5,5 s, **plan tampon**) · images 1950 → 2115

- **À l'écran** (pastille `JEAN`) : la séance de Jean, cadrée sur Q11 ; le téléphone en **mode
  avion** (icône de la barre d'état + pastille avion sur le coin, comme en P7 de « Documents ») ;
  après les appuis, le bandeau `earth` à 10 % : icône nuage barré, « Hors ligne — vos réponses sont
  sur le téléphone et partiront au retour du réseau. » ; compteur « 8 / 10 répondues · enregistré ✓ ».
- **Animation** : i 0 → 10 respiration. i 10 → 20 le mode avion s'allume. **Appuis** sur deux cases
  de Q11 (i 28, 36) ; i 40 le bandeau « Hors ligne » glisse sous l'en-tête ; le défilement remonte
  au compteur, zoom 1,3 sur le compteur « enregistré ✓ » et le bandeau, halo (i 46 → D − 52).
  Dézoom (D − 50 → D − 38) ; **le réseau revient** à D − 34 (i 131) : l'avion s'éteint, le bandeau
  s'efface. Tenue jusqu'à la fin.
- **Durée calculée** (`calage.ts`) pour que P11 tombe sur l'orchestre : le début est fixe, la fin
  est posée depuis la fin du plan (`D − n`) ; garde : 135 images au moins.
- **Légendes** : `Sans réseau,` / `*rien n’est perdu*.` (i 6 → 84), puis `Les réponses partent` /
  `*au retour du réseau*.` (i 88 → fin).
- **Transition** : coupe sur le salon (P11), **sur l'entrée de l'orchestre**.

### P11 — Tout le monde répond : son livret, un cahier · 300 i (10,0 s) · images 2115 → 2415

- **Calage** : i 0 = **70,5 s du chant** (l'orchestre entre en plein).
- **À l'écran** :
  1. (illustration) le salon de P1 en plein jour, net : chacun tient un **téléphone** dont l'écran
     s'allume, sauf **Paul** (son livret) et **Hélène** (un cahier) ; deux anneaux `clay` les
     désignent, avec leurs étiquettes « Paul » et « Hélène » ;
  2. (illustration) deux colonnes : à gauche, pastille `PAUL`, sa silhouette et la page de son
     **livret de l'étudiant** (couverture kraft, « UEMB002 », « Leçon 1 · Le prix à payer », les
     questions **imprimées** — « 1. Quel est l’appel ultime du Seigneur Jésus ? », « 5. Le Seigneur
     Jésus a vécu une vie sans péché. », « 6. Le disciple doit être discipliné. », « 7.a Que montrent
     ces passages ? » — et ses réponses **à la main** dessous, Fraunces italique `moss` : « L’appel à
     faire des disciples. », « Oui », « Vrai », « Tous ont péché. ») ; à droite, pastille `HÉLÈNE`, sa
     silhouette (cheveux blancs en chignon, canne) et la page d'un **simple cahier** ligné (gabarit
     `PageLignee` de « Journal ») où elle écrit « Leçon 1 », « Q1. Faire des disciples. »,
     « Q5. Oui », « Q6. Vrai », « Q7.a Tous ont péché. » ; sous chaque page, en JetBrains Mono `earthDeep`
     (annotation vidéo) : **« SON LIVRET »**, **« UN CAHIER »** ; un crayon suit la réponse en cours sur
     chaque page.
- **Animation** : i 0 → 24 le salon se pose (léger recul, 1,06 → 1), sur l'orchestre ; i 8 → 40 les
  écrans des téléphones s'allument ; i 50 → 64 les anneaux, i 54 les étiquettes en ressort. i 104 →
  124 le salon s'efface (léger zoom avant) ; i 116 → 140 les deux colonnes montent ; i 140 → 156 les
  mentions « SON LIVRET » / « UN CAHIER ». À partir de i 150, Paul écrit une réponse toutes les
  26 images, Hélène une ligne toutes les 22 ; le livret est souligné d'un liseré `clay` (i 150 → 212),
  puis le cahier (i 208 → 300). Tenue jusqu'à i 300.
- **Légendes** : `Tout le monde répond,` / `*même sans smartphone*.` (i 6 → 106), `Pas d’application ?`
  / `On répond *dans son livret*…` (i 110 → 206), puis `…ou *dans un cahier*,` /
  `comme aujourd’hui.` (i 210 → fin).
- **Exactitude** (D-ETU-13) : rien n'est saisi dans l'app ici ; ces réponses restent sur papier, et
  le dirigeant n'en saisira que la **note** (P16).
- **Transition** : intertitre « 3 · Corriger ».

### P12 — *Passer à la correction* · 165 i (5,5 s) · images 2490 → 2655

- **À l'écran** (pastille `SAMUEL · DIRIGEANT`) : la séance de Samuel, cadrée sur la carte
  « DIRIGEANT » : « 11 répondants », « Afficher les réponses du manuel », « Passer à la
  correction », « Annuler la séance » ; puis l'alerte « Passer à la correction » / « La saisie sera
  verrouillée sur les téléphones et les questions fermées corrigées. » / « Annuler » · « Passer à
  la correction » ; puis l'état *Correction* : pastille **« CORRECTION »** (contour `earthDeep`) ;
  la carte « DIRIGEANT » **sans** le lien « Résultats » (§ 7.4) : « 30 avis restants » (Fraunces
  18) / « 11 répondants » / bouton « Terminer ».
- **Animation** (images d'origine, 120) : i 0 → 14 le téléphone monte. i 14 → 34 halo sur « 11 répondants ». **Appui
  « Passer à la correction » i 40** ; l'alerte monte (i 44 → 56). **Appui de confirmation i 70** ;
  i 74 → 84 la pastille bascule « RÉPONSES OUVERTES » → « CORRECTION » (`Bascule`), la carte se
  recompose ; halo sur la pastille et « 30 avis restants » (i 86 → 116). Tenue jusqu'à i 120.
- **Poses** : [28, 15] (« 11 répondants »), [62, 15] (l'alerte), [100, 15] (« Correction », « 30 avis
  restants »).
- **Légendes** : `Chacun a répondu ?` / `*Passer à la correction*.` (i 6 → 96), puis `La saisie se
  verrouille` / `*sur chaque téléphone*.` (i 100 → fin).
- **Transition** : coupe sur le téléphone de Marie (P13).
- Pastille `3 · CORRIGER` de P12 à P14.

### P13 — Les questions fermées se corrigent seules · 240 i (8,0 s) · images 2655 → 2895

- **À l'écran** (pastille `MARIE`) : la séance de Marie en *Correction* (`StudyQuestionList`,
  mode `review`) : la carte teintée « ⇄ Échangez les téléphones : votre voisin lit la réponse
  donnée et la réponse du manuel, puis choisit un avis. » ; « 3 réponses écrites restantes » ;
  puis, corrigées, avec leur note à droite (mono `moss`) : Q5 « 1 / 1 » · ◉ « Oui » ; Q6 « 1 / 1 » ·
  ◉ « Vrai » ; **Q11 « 2 / 4 »** : « a. Garder la première place pour soi-même » cochée en `clay`
  + « faux », « b. … », « c. … », « f. … » cochées en `moss`, « g. Haïr sa propre vie à cause de
  Lui » non cochée en `moss` + « bonne réponse » (seules les cases cochées ou attendues restent).
- **Animation** : l'écran est déjà en *Correction* (le rafraîchissement ≈ 5 s l'a fait basculer,
  sans geste). i 24 → 78 halo sur « 3 réponses écrites restantes ». i 80 → 100 défilement jusqu'à
  Q5–Q6, halo sur leurs notes (i 100 → 140). i 140 → 152 défilement jusqu'à Q11 ; zoom 1,35 ; halo
  sur « faux », « bonne réponse » et « 2 / 4 » (i 156 → 226). Le défilement remonte vers Q1 sur les
  12 dernières images, prêt pour l'échange.
- **Légendes** : `Chaque téléphone passe` / `*en correction*.` (i 6 → 78), `Les questions fermées` /
  `*se corrigent seules*.` (i 82 → 152), puis `Une case fausse, une oubliée :` /
  `*2 points sur 4*.` (i 156 → fin).
- **Transition** : coupe sur P14.

### P14 — On échange les téléphones · 390 i (13,0 s) · images 2895 → 3285

- **À l'écran** : le salon flouté en fond ;
  1. deux téléphones côte à côte (échelle 0,8), pastilles `MARIE` et `JEAN`, chacun en
     *Correction* ; ils **se croisent** et changent de place ; les pastilles deviennent,
     sur deux lignes, « Copie de **Marie** / entre les mains de **Jean** » et « Copie de **Jean** /
     entre les mains de **Marie** » (une ligne une fois le téléphone de Marie au premier plan) (annotation vidéo : l'écran de l'app ne porte pas de nom, § 7.4) ;
  2. le téléphone de Marie, tenu par Jean, seul et agrandi : Q1 « – / 2 » (`earthDeep` : avis
     attendu) · « Quel est l'appel ultime du Seigneur Jésus ? » ; encadré **« RÉPONSE DONNÉE »** /
     « Que nous fassions des disciples. » ; encadré `mossTint` **« RÉPONSE DU MANUEL »** /
     « L'appel à faire des disciples. » ; les trois boutons **« Juste »** (`moss`), **« À
     préciser »** (`earthDeep`), **« À revoir »** (`clay`) ;
  3. plus bas, 7.a (« Tous ont péché. » / « Tous ont péché et sont privés de la gloire de Dieu. »)
     et 7.b (« Romains 3 » / « Romains 3 : 23. ») ; puis **Q10** masquée : « Q10 ✓ » / « Question
     personnelle — répondu ✓ ».
- **Animation** (images d'origine, 300) : **i 0 → 30 les deux téléphones montent et se croisent**
  en arc ; i 30 → 50 les pastilles changent. i 56 → 74 Jean (téléphone de Marie) passe
  au premier plan, l'autre s'efface ; zoom 1,3 sur Q1. Halo sur « Réponse donnée » puis « Réponse du
  manuel » (i 78 → 120). **Appui « Juste » i 130** → le bouton se remplit (`moss`, texte `white`),
  la note passe à « 2 / 2 » (`moss`) ; en haut, « 2 réponses écrites restantes » (montré par un
  court retour du cadrage, i 136 → 150). i 152 → 166 défilement jusqu'à 7.a ; **appui « Juste »
  i 170** (« 1 / 1 ») ; **appui « À préciser » sur 7.b i 186** (« 0,5 / 1 »). i 192 → 206
  défilement jusqu'à Q10 ; halo appuyé sur « Question personnelle — répondu ✓ » (i 208 → 270), le
  cadre se resserre dessus (zoom 1,45). Tenue jusqu'à i 300.
- **Poses** : [52, 30] (les deux pastilles « Copie de … entre les mains de … »), [112, 30] (la
  réponse donnée et la réponse du manuel), [220, 30] (« Question personnelle — répondu ✓ »).
- **Légendes** : `On échange` / `*les téléphones*.` (i 6 → 104), `Le voisin compare avec` /
  `*la réponse du manuel*.` (i 106 → 188), `*Juste*, *À préciser*,` / `*À revoir*.` (i 190 → 260),
  puis `La question personnelle` / `*reste masquée*.` (i 264 → fin).
- **Transition** : intertitre « 4 · Terminer ».

### P15 — *Terminer* : chacun voit sa note · 270 i (9,0 s) · images 3360 → 3630

- **À l'écran** :
  1. (pastille `SAMUEL · DIRIGEANT`) la carte « DIRIGEANT » : « Tous les avis sont posés. » /
     « 11 répondants » / « Terminer » ; l'alerte « Terminer » / « Les notes seront arrêtées. Vous
     pourrez encore ajuster des points depuis les résultats. » / « Annuler » · « Terminer » ; puis
     pastille « TERMINÉE » (`ink3`), « Séance terminée — 11 copies », lien « Résultats » revenu ;
  2. trois téléphones (échelle 0,62, salon en fond), pastilles `MARIE`, `JEAN`, `ESTHER`, chacun
     sur sa séance terminée : carte « MA NOTE » (`mossSoft`) et la note en Fraunces 44 `moss` —
     **« 10,5 / 13 »**, **« 9 / 13 »**, **« 12,5 / 13 »** — puis le bouton « Ma progression ».
- **Animation** (images d'origine, 210) : i 0 → 14 le téléphone de Samuel monte. **Appui « Terminer » i 26** ; l'alerte
  (i 30 → 42) ; **appui « Terminer » de l'alerte i 56** ; i 60 → 70 la pastille bascule en
  « TERMINÉE », halo sur « Séance terminée — 11 copies » (i 72 → 96). i 98 → 116 Samuel s'efface,
  les trois téléphones montent ; les notes apparaissent en ressort (i 120 / 128 / 136), halo commun
  (i 140 → 196). Tenue jusqu'à i 210.
- **Poses** : [46, 15] (l'alerte), [96, 30] (« Séance terminée — 11 copies »), [150, 15] (les trois
  notes).
- **Légendes** : `Tous les avis sont posés :` / `*Terminer*.` (i 6 → 142), puis `Et chacun voit` /
  `*sa note*, aussitôt.` (i 145 → fin).
- **Transition** : coupe sur le téléphone de Samuel (P16).
- Pastille `4 · TERMINER` de P15 à P16.

### P16 — Les résultats ; les copies papier de Paul et d'Hélène · 495 i (16,5 s) · images 3630 → 4125

- **À l'écran** (pastille `SAMUEL · DIRIGEANT`) :
  1. `app/study/results/[id].tsx` (arrivée de la droite) : chevron ; « RÉSULTATS » ; « Leçon 1 · Le
     prix à payer » (Fraunces 26) ; « Paris Ouest · 25 octobre 2026 · Terminée » ; « UEMB002 ·
     Devenir et être disciple du Seigneur Jésus-Christ — note sur 13 » ; bouton doux « Ajouter une
     copie papier » (icône document) ; « 11 COPIES » ; les copies **triées par nom** (§ 6.4), chacune
     « Nom » / « 10 réponses » · « 10,5 / 13 » › ;
  2. la modale « Ajouter une copie papier » / « Pour un membre qui a répondu sur son livret (ou
     rattrape une séance) : sa note seule. » ; « MEMBRE » + « Choisir… » (liste qui se déroule sous
     le champ) : « Hélène Mballa », « Paul Nana », « Rose Eyenga », « Samuel Fotso » ; « NOTE (SUR
     13) » ; champ « 0 » ; « Enregistrer » (inactif tant que membre et note manquent) ; « Annuler » ;
     Samuel choisit **Paul Nana** et tape « 11 » ;
  3. « 12 COPIES » ; puis la même modale, dont la liste ne propose plus que « Hélène Mballa »,
     « Rose Eyenga », « Samuel Fotso » : **Hélène Mballa**, « 10 » ;
  4. « 13 COPIES » : défilement jusqu'aux deux lignes **« Hélène Mballa »** et **« Paul Nana »**,
     chacune avec la pastille **« PAPIER »** (contour `earth`) · « 10 / 13 » et « 11 / 13 » (pas de
     nombre de réponses pour une copie papier).
- **Animation** : i 0 → 10 respiration (même écran qu'en fin de P15). **Appui « Résultats » i 14** ;
  i 18 → 34 les résultats arrivent de la droite. i 50 → 64 défilement léger ; halos sur Esther, Jean
  et Marie (i 66 → 124). **Paul** : appui « Ajouter une copie papier » i 136, modale i 140 → 150,
  tenue pour lire la consigne ; appui « Choisir… » i 190 (la liste se déroule), **appui « Paul
  Nana » i 214**, appui sur le champ i 228, « 11 » s'écrit (i 232 → 240), **appui « Enregistrer »
  i 252** ; la modale se ferme (i 256 → 266), « 12 COPIES » en halo. **Hélène** : appui « Ajouter une
  copie papier » i 300, modale i 304 → 314 ; « Choisir… » i 324, **« Hélène Mballa » i 342**, champ
  i 356, « 10 » (i 360 → 368), **« Enregistrer » i 380** ; fermeture i 384 → 394, « 13 COPIES » en
  halo. i 420 → 436 défilement jusqu'aux deux lignes « papier », halos (i 438 → 493). Tenue jusqu'à
  la fin.
- **Légendes** : `Le dirigeant voit` / `*les résultats de chacun*.` (i 6 → 126), `Des réponses sur
  papier ?` / `*Une copie papier*, la note seule.` (i 130 → 210), `Il saisit la note` / `*du livret
  de Paul*…` (i 214 → 296), `…puis celle` / `*du cahier d’Hélène*.` (i 300 → 418), puis `Les copies
  papier` / `*rejoignent les résultats*.` (i 422 → fin).
- **Transition** : intertitre « 5 · Au fil des réunions ».

### P17 — Dimanche après dimanche : 3 leçons sur 5 · 270 i (9,0 s) · images 4200 → 4470

- **À l'écran** :
  1. **annotation vidéo** à droite : une frise verticale de trois dimanches, chacun avec une petite
     icône de salon, le jour (JetBrains Mono 24 px, `earthDeep`) au-dessus de la leçon (Fraunces 32 px)
     et un livret coché : « DIM. 25 OCT. » / « Leçon 1 », « DIM. 1ER NOV. » / « Leçon 2 »,
     « DIM. 8 NOV. » / « Leçon 3 » ; dessous, en pointillé, « Leçon 4 », « Leçon 5 » ;
  2. (pastille `MARIE`) `app/study/progress.tsx?mine=1` : « LE MESSAGE DE BERTOUA » ; « Ma
     progression » (Fraunces 28) ; carte « UEMB002 · Devenir et être disciple du Seigneur
     Jésus-Christ » / **« 3 / 5 leçons »** (`moss`) / barre à 60 % / « Note cumulée : 18,5 / 22 » ;
     puis les cinq leçons : ✓ « Leçon 1 · Le prix à payer » / « 25 octobre 2026 » · « 10,5 / 13 » › ;
     ✓ « Leçon 2 » / « 1 novembre 2026 » · « 5 / 6 » › ; ✓ « Leçon 3 » / « 8 novembre 2026 » ·
     « 3 / 3 » › ; ○ « Leçon 4 » / « Pas encore faite » ; ○ « Leçon 5 » / « Pas encore faite ».
- **Animation** (images d'origine, 210) : i 0 → 16 le téléphone de Marie monte, décalé à gauche
  (réduction 0,78), sur sa note de la leçon 1 (raccord P15). i 18 → 70 la frise se pose : les trois
  dimanches s'allument un à un
  (16 images d'écart). **Appui « Ma progression » i 78** ; i 82 → 98 l'écran arrive de la droite.
  i 100 → 160 la barre se remplit de 0 à 60 % (annotation : dans l'app elle s'affiche pleine
  d'emblée) ; zoom 1,3 sur « 3 / 5 leçons » et la barre, halo (i 112 → 170) ; halo léger sur
  « Note cumulée : 18,5 / 22 » (i 170 → 200). Tenue jusqu'à i 210.
- **Poses** : [69, 30] (la frise), [175, 30] (« 3 / 5 leçons », la note cumulée).
- **Légendes** : `Dimanche après dimanche,` / `*leçon après leçon*.` (i 6 → 126), puis
  `*3 leçons sur 5* :` / `chacun voit où il en est.` (i 130 → fin).
- **Transition** : la frise s'efface ; coupe sur P18.
- Pastille `5 · AU FIL DES RÉUNIONS` de P17 à P18.

### P18 — La ville voit l'avancement, jamais les réponses personnelles · 360 i (12,0 s) · images 4470 → 4830

- **À l'écran** (pastille `DANIEL · VILLE`) :
  1. l'**accueil** de Daniel Mercier, dirigeant de la ville de Paris : « Novembre 9, 2026 »,
     « Bon retour, » / *Daniel*., pastille « DM » ; tuiles « Déclarer une action », « Documents »,
     **« Le Message de Bertoua »** (sans pastille), « Créer une assemblée », « Membres »,
     « Hiérarchie » ;
  2. l'**accueil de l'étude** sans assemblée (vue d'ensemble, D-ETU-08) : « ÉTUDE DE L'ASSEMBLÉE » ;
     « Le Message de Bertoua » ; « AVANCEMENT DES ASSEMBLÉES » ; quatre rangées ›, chacune « Nom ·
     Paris » / « UEMB002 · n / 5 leçons » : Paris Est (1 / 5), Paris Nord (2 / 5), **Paris Ouest
     (3 / 5)**, Paris Sud (0 / 5) ;
  3. `progress?unitId=` : « AVANCEMENT DE L'ASSEMBLÉE » ; « Paris Ouest » ; carte UEMB002 /
     « 3 / 5 leçons » / barre / « Dernière séance le 8 novembre 2026 » ; « MEMBRES » ; rangées
     « Nom » / « n / 5 leçons » · note cumulée › (Hélène Mballa comprise ; défilement jusqu'à Marie Kamga) ;
  4. `progress?userId=` (Marie, vue par Daniel) : « LE MESSAGE DE BERTOUA » ; « Marie Kamga » ; la
     même carte et les mêmes leçons qu'en P17, notes comprises, **mais sans chevron** : aucune
     copie ne s'ouvre (le lien n'est offert qu'à Marie et à son dirigeant) ;
  5. **annotation vidéo** à droite : une enveloppe fermée, cadenas `clay`, « Réponses de Marie » /
     « Marie et son dirigeant seulement ».
- **Animation** (images d'origine, 270) : i 0 → 16 le téléphone monte sur l'accueil. i 18 → 34 halo sur la tuile ; **appui
  i 38** ; i 42 → 58 la vue d'ensemble arrive de la droite. i 62 → 108 halo sur la rangée « Paris
  Ouest · Paris » / « UEMB002 · 3 / 5 leçons ». **Appui i 114** ; i 118 → 134 l'avancement de Paris
  Ouest arrive ; halo sur « 3 / 5 leçons » (i 136 → 160). **Appui sur « Marie Kamga » i 170** ;
  i 174 → 190 sa progression arrive. i 194 → 210 le téléphone se décale à gauche (0,78) ;
  l'enveloppe se pose à droite (i 206 → 222), le cadenas se ferme (i 224) ; halo sur la colonne des
  leçons sans chevron (i 214 → 262). Tenue jusqu'à i 270.
- **Poses** : [88, 15] (« Paris Ouest · Paris » / « 3 / 5 leçons »), [148, 30] (l'avancement de
  Paris Ouest), [232, 45] (l'enveloppe fermée, les leçons sans chevron).
- **Légendes** : `La ville voit` / `*l’avancement des assemblées*…` (i 6 → 125), `…leçon par leçon,`
  / `*avec les notes*…` (i 127 → 231), puis `…jamais les réponses` / `*personnelles*.` (i 235 → fin).
- **Transition** : téléphone et enveloppe descendent et s'effacent (images d'origine 258 → 270) ;
  fondu vers P19.

### P19 — Fin · 180 i (6,0 s) · images 4830 → 5010

- **À l'écran** (sans téléphone) : **« Le Message de Bertoua, »** / **« *simplement*. »** (Fraunces
  600, 88 px pour que la première ligne tienne, `ink`, « simplement » en `clay`), puis la tuile de l'icône Shephr (`TuileLogo`) et le
  logotype (gabarit de `P18Fin` de « Évènements »).
- **Animation** : phrase en fondu montant (i 8), tuile en ressort (i 30), logotype (i 42) ; image
  fixe jusqu'à la fin, pas de fondu au noir. La musique s'éteint sur les 75 dernières images
  (i 105 → 180).
- **Phrase de fin** : **« Le Message de Bertoua, simplement. »** (choix de JP, 21/10 ; remplace
  « Votre réunion, simplement. »).

---

## 5. Calage musical

Piste : `public/audio/dieu-fait-toutes-choses-nouvelles.mp3`, la même que « Journal » et
« Documents » ; **451,8 s** (7 min 32, mesurée au `ffprobe` le 21/10) : bien plus longue que la
vidéo de 167 s, **aucune boucle ni prolongation n'est nécessaire**. Enveloppe mesurée : 0–10 s très
doux ; 10–24 s montée douce ; **24,0 s nette montée (+6 dB)** ; 24–70 s intensité moyenne ; **70,5 s
orchestre en plein** ; fort et stable ensuite.

| | Fichier (s) | Fichier (images) | Vidéo (images) | Vidéo (s) |
|---|---|---|---|---|
| Point de départ (`trimBefore`) | **0,0** | **0** | 0 | 0 |
| Bascule « problème → l'app » (début de P5) | 24,0 | 720 | **720** | 24,0 |
| Tout le salon répond, livret et cahier (début de P11) | 70,5 | 2 115 | **2 115** | 70,5 |
| Fin de la vidéo | 167,0 | 5 010 | 5 010 | 167,0 |

- **Départ plus tôt** (solution retenue pour la vidéo plus longue) : le problème, ralenti, dure
  exactement 24,0 s ; pour que la bascule tombe encore sur la montée, la vidéo part du **début du
  fichier** (`trimBefore` 0, au lieu de 4,5 s). P1 s'ouvre donc dans les 0–10 s « très doux » du
  chant : c'est le calme du salon. La garde de `Video.tsx` refuse un problème de plus de 24 s.
- **L'orchestre** : à 46,5 s de la montée (1 395 images), le rythme ralenti n'arrive plus à
  l'échange des téléphones (≈ 1 min 37) ; on le pose sur **P11**, le moment fort demandé par JP —
  le salon entier qui répond, chacun sur son téléphone, Paul dans son livret, Hélène dans un cahier.
  P10 (Jean sans réseau) est le **plan tampon** : sa durée est calculée.
- Ce que l'on entend : P1–P4 sur l'ouverture douce puis la montée douce ; la nette montée **ouvre**
  la tuile de P5 ; l'intensité moyenne porte la lecture, les réponses de Marie et de Jean ;
  l'orchestre éclate **sur le salon de P11** ; la correction, l'échange, les notes, les résultats et
  la progression sont sur la partie forte.
- Fondus : entrée de **12 images** (0 → 0,9) ; sortie de **75 images** (2,5 s), images 4 935 → 5 009,
  prises sur P19. Volume de croisière 0,9.
- **Code** (`src/etude/calage.ts`, mécanisme de `src/journal/calage.ts`) : `MONTEE =
  Math.round(24.0 * IPS)`, `ORCHESTRE = Math.round(70.5 * IPS)` ; `trimBefore = MONTEE − debut(P5)`
  (garde : ≥ 0) ; **`DUREE_P10` calculée** comme `ORCHESTRE − MONTEE − (P5 + … + P9 + intertitre)`
  = 165, avec une garde qui lève une erreur sous 135 images ; le retour du réseau de P10 est posé
  depuis sa fin. `Video.tsx` vérifie que `debut(P11) + trimBefore === ORCHESTRE`.

---

## 6. Données fictives

Toutes inventées ; aucune donnée réelle (`src/etude/donnees.ts`, par langue). Mêmes prénoms que
la présentation au pasteur (Marie K., Jean P., Esther M., Paul N.), complétés d'un nom (l'app
affiche le nom complet du compte, `displayName`), plus **Hélène Mballa** (révision du 21/10). Les
réunions ont lieu **le dimanche, en journée** (JP 21/10). Date de la réunion : **dimanche 25 octobre
2026** (la vidéo se passe un peu après la livraison) ; les leçons 2 et 3 les dimanches **1er** et
**8 novembre** ; la vue de la ville le **lundi 9 novembre**. Dates de l'app au format de
`fmtIsoDay` (« 1 novembre 2026 », sans « 1er ») ; la frise (annotation vidéo) écrit « DIM. 1ER NOV. ».

### 6.1 Personnes

| Personne | Rôle | Apparaît |
|---|---|---|
| **Samuel Fotso** | dirigeant de l'assemblée Paris Ouest (`DIRIGEANT_UNITE`) ; pilote la séance et **ne répond pas** (pas de copie) | P1, P3, P4, P6, P7, P12, P15, P16 |
| **Marie Kamga** | membre ; répond, sa copie est corrigée par Jean | P1, P2, P8, P9, P13–P15, P17, P18 |
| **Jean Petit** | membre ; répond hors ligne, corrige la copie de Marie | P1, P2, P8, P10, P14, P15 |
| **Esther Mbida** | membre | P1, P8, P15 |
| **Paul Nana** | membre **sans smartphone** : répond dans son **livret**, note papier | P1, P11, P16 |
| **Hélène Mballa** | membre, l'aînée de l'assemblée (cheveux blancs, canne), **sans smartphone** : répond dans un **cahier**, note papier (révision du 21/10) | P1 (anonyme, dans le fauteuil), P11, P16, P18 (liste) |
| **Daniel Mercier** | dirigeant de la ville de Paris (`DIRIGEANT`, le même que dans « Journal »), sans assemblée de rattachement | P4 (silhouette « VILLE · PARIS »), P18 |

**Paris Ouest** (assemblée de maison, le dimanche en journée, dans le salon de Samuel) —
15 répondants (D-ETU-06) : Aline Tchoua · Christelle Abena · David Laurent · Esther Mbida · Grâce
Ngo · Hélène Mballa · Jean Petit · Joël Mvondo · Lucie Roche · Marie Kamga · Paul Nana · Rose
Eyenga · Ruth Ateba · Samuel Fotso (dirigeant) · Sylvain Ondoa.
Le 25 octobre : **13 membres présents** et Samuel (Rose Eyenga absente) — « une douzaine de
personnes ». 11 répondent dans l'app, Paul dans son livret, Hélène dans un cahier.

### 6.2 Structure et abonnements

France › Île-de-France › **Paris** › Paris Est, Paris Nord, **Paris Ouest** (nouvelle), Paris Sud.
Abonnements supposés : `GOALS`, `ASSEMBLY`, `EVENTS`, `DOCUMENTS` (tuiles « Déclarer une action »,
« Documents », « Le Message de Bertoua ») ; pas de `DONATIONS`. Tuile de l'étude : `hasAssembly &&
isAttachedAccount(me)` (D-ETU-05) — vraie pour les membres rattachés, Samuel et Daniel.

### 6.3 Le contenu : UEMB002, leçon 1

Unité **UEMB002** « Devenir et être disciple du Seigneur Jésus-Christ », livre « Disciple coûte que
coûte », 5 leçons ; prérequis : aucun (une seconde unité n'est pas montrée). Contenu **à la lettre**
de `uemb002-exemple.json` (questions de la spec), sauf les titres des leçons 2 à 5 (§ 7.4).

| Leçon | Titre affiché | Portion | Questions à répondre | Note sur |
|---|---|---|---|---|
| 1 | « Leçon 1 · Le prix à payer » | Préface et chapitre 1 | 10 | **13** |
| 2 | « Leçon 2 » | Chapitre 2 | 2 | 6 |
| 3 | « Leçon 3 » | Chapitre 3 | 2 | 3 |
| 4 | « Leçon 4 » | Chapitre 4 | 1 | 1 |
| 5 | « Leçon 5 » | Chapitre 5 | 2 | 1 |

Leçon 1, dans l'ordre de l'écran : Q1 écrite (2 pts) « Quel est l'appel ultime du Seigneur
Jésus ? » — manuel « L'appel à faire des disciples. » · Q5 oui / non (1 pt) → Oui · Q6 vrai / faux
(1 pt) « Le disciple doit être discipliné. » → Vrai · Q7 consigne « Lis les passages suivants :
Exode 20 : 1-17 ; Romains 3 : 23. » · 7.a écrite (1 pt) — manuel « Tous ont péché et sont privés de
la gloire de Dieu. » · 7.b écrite (1 pt) « Justifie ta réponse par un verset. » — manuel « Romains
3 : 23. » · Q10 personnelle (écrite, 1 pt) · Q11 cases (4 pts, clé b, c, f, g, *Luc 14 : 25-33*) ·
Q12 exercice (non noté) · Q13 personnelle oui / non (1 pt) · Q31 choix unique (1 pt, clé d).
Total des questions notées = **13** ; questions à répondre (toutes sauf la consigne) = **10** ;
réponses écrites = **3** (Q1, 7.a, 7.b) — d'où « 3 réponses écrites restantes », comme dans la
présentation.

### 6.4 Les copies du 25 octobre

| Copie | Source | Réponses | Note / 13 | Détail |
|---|---|---|---|---|
| Aline Tchoua | app | 10 | 11 | |
| Christelle Abena | app | 10 | 9,5 | |
| David Laurent | app | 9 | 8 | |
| **Esther Mbida** | app | 10 | **12,5** | tout juste sauf 7.b « À préciser » |
| Grâce Ngo | app | 10 | 10 | |
| **Jean Petit** | app | 10 | **9** | Q1 « À préciser » 1 · 7.b « À revoir » 0 · Q11 b, c, g → 3 · Q31 a → 0 |
| Joël Mvondo | app | 8 | 7,5 | |
| Lucie Roche | app | 10 | 11,5 | |
| **Marie Kamga** | app | 10 | **10,5** | Q1 Juste 2 · Q5 1 · Q6 1 · 7.a Juste 1 · 7.b À préciser 0,5 · Q10 1 · Q11 b, c, f, a → **2** (RG-ETU-06 : 4 × (3 − 1) / 4) · Q12 fait · Q13 1 · Q31 d 1 |
| **Hélène Mballa** | **papier** | — | **10** | saisie par Samuel en P16 (son cahier) |
| **Paul Nana** | **papier** | — | **11** | saisie par Samuel en P16 (son livret) |
| Ruth Ateba | app | 10 | 12 | |
| Sylvain Ondoa | app | 9 | 9 | |

Sans copie (`withoutCopy`, modale de P16, ordre alphabétique) : Hélène Mballa et Paul Nana (avant
leur saisie), Rose Eyenga (absente), Samuel Fotso (dirigeant, n'a pas répondu). Après la saisie de
Paul, la liste ne propose plus que Hélène, Rose et Samuel. Avis à poser au passage en correction
(P12) : 11 copies × 3 réponses écrites − 3 sans réponse (David, Joël) = **30** ; « Séance terminée —
11 copies » (P15) : les copies papier s'ajoutent ensuite, depuis les résultats (11 → 12 → 13).

### 6.5 Avancement au 8 novembre (P17–P18)

| Personne | Leçon 1 | Leçon 2 | Leçon 3 | Leçons faites | Note cumulée |
|---|---|---|---|---|---|
| **Marie Kamga** | 10,5 / 13 | 5 / 6 | 3 / 3 | **3 / 5** | **18,5 / 22** |
| Jean Petit | 9 / 13 | 4 / 6 | 3 / 3 | 3 / 5 | 16 / 22 |
| Esther Mbida | 12,5 / 13 | 6 / 6 | 3 / 3 | 3 / 5 | 21,5 / 22 |
| Paul Nana | 11 / 13 (papier) | 4 / 6 (papier) | 2 / 3 (papier) | 3 / 5 | 17 / 22 |
| Hélène Mballa | 10 / 13 (papier) | 4 / 6 (papier) | 2 / 3 (papier) | 3 / 5 | 16 / 22 |
| Rose Eyenga | — | 5 / 6 | 3 / 3 | 2 / 5 | 8 / 9 |
| Samuel Fotso | — | — | — | 0 / 5 | « – » |

Paris Ouest : **3 / 5 leçons**, « Dernière séance le 8 novembre 2026 ». Vue d'ensemble de la ville
(Daniel) : Paris Est 1 / 5 · Paris Nord 2 / 5 · Paris Ouest 3 / 5 · Paris Sud 0 / 5.
Points et notes affichés sans zéro inutile, virgule décimale (`fmtPoints`) : « 10,5 », « 0,5 »,
« 13 ».

---

## 7. Fidélité à l'app

### 7.1 Écrans reproduits (`shephr-app/mobile`, écrans livrés au lot ETU4)

| Plan(s) | Fichier(s) | Ce qui est repris |
|---|---|---|
| P7, P8, P18 | `app/(tabs)/home.tsx` (`Tile`, `livePill`) | tuile « Le Message de Bertoua » / « Étude de l'assemblée », icône `school-outline`, teinte `moss`, placée après « Documents » et avant « Créer une assemblée » ; pastille « En cours » (`clay`) si une séance de son assemblée est ouverte (`/study/me`, relu à chaque retour sur l'accueil) ; visible si `hasAssembly && isAttachedAccount(me)` |
| P7, P8, P18 | `app/study/index.tsx` (`AssemblySection`, `Overview`) | surtitre « Étude de l'assemblée », titre « Le Message de Bertoua » ; dirigeant : nom de l'assemblée, « Commencer une séance », unité `code · nom` + « n / 5 leçons » (ou verrouillée), leçons dépliées avec le livre en italique, « Commencer » / « Refaire », alerte de confirmation, « Séances terminées », « Avancement de l'assemblée » ; répondant : carte `moss` de la séance en cours (« Répondre » / « Corriger ») ou « Aucune étude en cours », « Ma progression » ; sans assemblée : « Avancement des assemblées » |
| P7–P15 | `app/study/session/[id].tsx` (`LeaderPanel`, `StatusPill`) | un écran, trois temps ; surtitre `code · nom` du module, « Leçon 1 · Le prix à payer », portion en italique, pastille d'état, nom de l'assemblée ; compteur « n / 10 répondues · enregistré ✓ » ; bandeau hors ligne ; carte d'échange et « n réponses écrites restantes » en *Correction* ; « Ma note » en fin ; panneau dirigeant (répondants, réponses du manuel, *Passer à la correction*, *Annuler la séance*, avis restants, *Terminer*, « Séance terminée — n copies ») ; rafraîchissement ≈ 5 s |
| P9, P13, P14 | `components/StudyQuestionList.tsx` | saisie par type (§ 2.3 du contrat), consigne en italique, sous-questions en retrait, étiquettes « Personnelle » / « Exercice », points « 1 pt » / « 2 pts » ; en correction : choix marqués juste / « faux » / « bonne réponse », note « 2 / 4 », « Réponse donnée », « Réponse du manuel », *Juste* / *À préciser* / *À revoir*, « Question personnelle — répondu ✓ » |
| P16 | `app/study/results/[id].tsx` (`PaperModal`) | « Résultats », leçon, assemblée · date · état, « note sur 13 », « Ajouter une copie papier », « n copies », lignes nom + « papier » + « n réponses » + note, modale (membre en liste déroulée sous le champ, « Note (sur 13) », « Enregistrer ») |
| P17, P18 | `app/study/progress.tsx` (`UnitView`, `PersonView`, `ProgressBar`) | *Ma progression* (« 3 / 5 leçons », barre, « Note cumulée : 18,5 / 22 », leçons ✓ / ○, date, note, « Pas encore faite ») ; avancement d'une assemblée (« Dernière séance le … », « Membres ») ; progression d'un membre vue par la ville **sans** lien vers les copies |
| P7–P18 | `app/_layout.tsx` | écrans de l'étude poussés depuis la droite, sans barre d'onglets |

Palette, polices, rayons : ceux de `src/evenements/theme.ts` (`S`, `P`, `R`). Icônes Ionicons ↔
`react-icons/io5` : `IoSchoolOutline`, `IoChevronBack`, `IoChevronForward`, `IoChevronDown`,
`IoChevronUp`, `IoCheckmarkCircle`, `IoEllipseOutline`, `IoRadioButtonOn`, `IoRadioButtonOff`,
`IoCheckbox`, `IoSquareOutline`, `IoSwapHorizontal`, `IoCloudOfflineOutline`, `IoEyeOutline`,
`IoTrendingUpOutline`, `IoDocumentTextOutline`, `IoMapOutline`, `IoLockClosedOutline`, plus celles
de l'accueil déjà dessinées (`IoMegaphoneOutline`, `IoLibraryOutline`, `IoAdd`,
`IoPeopleOutline`, `IoGitNetworkOutline`, `IoMusicalNotesOutline`).

### 7.2 Libellés exacts repris de `mobile/utils/i18n/locales/fr.json`

| Clé | Texte |
|---|---|
| `study.tile.title` / `hint` / `live` | Le Message de Bertoua / Étude de l'assemblée / En cours |
| `study.kicker` | Étude de l'assemblée |
| `study.lesson` / `lessonTitled` / `score` | Leçon {n} / Leçon {n} · {titre} / {note} / {max} |
| `study.points_one` / `points_other` | {v} pt / {v} pts |
| `study.status.REPONSES_OUVERTES` / `CORRECTION` / `TERMINEE` | Réponses ouvertes / Correction / Terminée |
| `study.types.PERSONNELLE` / `EXERCICE` | Personnelle / Exercice |
| `study.verdict.JUSTE` / `A_PRECISER` / `A_REVOIR` | Juste / À préciser / À revoir |
| `study.values.VRAI` / `FAUX` / `OUI` / `NON` | Vrai / Faux / Oui / Non |
| `study.home.answer` / `noCurrent` / `startSession` / `lessonsDone` / `start` | Répondre / Aucune étude en cours / Commencer une séance / {n} / {total} leçons / Commencer |
| `study.home.startTitle` / `startConfirm` | Commencer la séance ? / {leçon} — les répondants pourront répondre dès maintenant. |
| `study.home.sessions` / `noSessions` / `unitProgress` / `myProgress` / `overviewTitle` | Séances terminées / Aucune séance terminée pour l'instant. / Avancement de l'assemblée / Ma progression / Avancement des assemblées |
| `study.session.answered` / `save.saving` / `save.saved` | {n} / {total} répondues / enregistrement… / enregistré ✓ |
| `study.session.offlinePending` | Hors ligne — vos réponses sont sur le téléphone et partiront au retour du réseau. |
| `study.session.correctionHint` | Échangez les téléphones : votre voisin lit la réponse donnée et la réponse du manuel, puis choisit un avis. |
| `study.session.writtenLeft_other` / `writtenLeft_one` / `myScore` | {n} réponses écrites restantes / {n} réponse écrite restante / Ma note |
| `study.question.number` / `placeholder` / `wrong` / `expected` | Q{n} / Votre réponse… / faux / bonne réponse |
| `study.question.given` / `manual` / `personalAnswered` | Réponse donnée / Réponse du manuel / Question personnelle — répondu ✓ |
| `study.leader.panel` / `results` / `respondents_one` / `respondents_other` / `showKey` | Dirigeant / Résultats / {n} répondant / {n} répondants / Afficher les réponses du manuel |
| `study.leader.toCorrection` / `toCorrectionConfirm` / `cancel` | Passer à la correction / La saisie sera verrouillée sur les téléphones et les questions fermées corrigées. / Annuler la séance |
| `study.leader.reviewsLeft_other` / `reviewsDone` / `finish` / `finishConfirm` / `finished_other` | {n} avis restants / Tous les avis sont posés. / Terminer / Les notes seront arrêtées. Vous pourrez encore ajuster des points depuis les résultats. / Séance terminée — {n} copies |
| `study.results.kicker` / `outOf` / `copies_other` / `paper` / `answeredCount_other` | Résultats / note sur {max} / {n} copies / papier / {n} réponses |
| `study.results.addPaper` / `addPaperHint` / `member` / `scoreOutOf` | Ajouter une copie papier / Pour un membre qui a répondu sur son livret (ou rattrape une séance) : sa note seule. / Membre / Note (sur {max}) |
| `study.progress.unitTitle` / `mineTitle` / `members` / `lastSession` / `cumulative` / `notDone` | Avancement de l'assemblée / Ma progression / Membres / Dernière séance le {date} / Note cumulée : {note} / {max} / Pas encore faite |
| `common.cancel` / `save` / `choose` | Annuler / Enregistrer / Choisir… |
| `dashboard.welcomeBack`, `dashboard.tiles.*` | Bon retour, ; Déclarer une action / Évangélisation ; Documents / Enseignements à lire et partager ; Créer une assemblée / Dans la ville de votre choix ; Membres / Annuaire de votre périmètre ; Hiérarchie / Votre leadership |
| `tabs.*` | Accueil · Objectifs · Assemblée · Évènements · Profil |

`src/etude/textes.ts` les copie **à la lettre** (plan § 7.1), avec les légendes et cartons du § 4
(`TEXTES_ETUDE.fr` ; l'anglais viendra à la même forme, avec les libellés de `en.json`).

### 7.3 Ce que l'on voit, d'après le code livré

- **Le compteur** compte les questions **à répondre** (toutes sauf la consigne, `isAnswerable`) :
  « 5 / 10 répondues ». « enregistré ✓ » s'affiche quand le brouillon est écrit **sur le
  téléphone** (`saveStudyDraft`), avant tout envoi : c'est exact hors ligne.
- **Le bandeau hors ligne** n'apparaît qu'après un échec d'envoi ou de rafraîchissement (≈ 5 s) :
  il arrive donc après les appuis de Jean (P10), pas à l'allumage du mode avion.
- **La séance des membres bascule seule** en *Correction* par le rafraîchissement ≈ 5 s
  (D-ETU-23) : pas de notification, pas de geste (P13).
- **Le dirigeant ne voit pas le lien « Résultats » en *Correction*** (`resultsOpen`) : son téléphone
  peut être entre les mains d'un voisin. Il revient en *Terminée* (P15, P16).
- **La pastille « En cours »** est relue à chaque retour sur l'accueil (`useFocusEffect`), pas en
  continu : en P8, elle est déjà là quand les membres regardent leur accueil après le
  *Commencer* de Samuel.
- **Les choix corrigés** : ne restent affichés que les choix cochés ou attendus (`CorrectedAnswer`).
- **La vue de la ville** : l'accueil de l'étude montre « Avancement des assemblées » quand
  `/study/me` ne renvoie **aucune** assemblée (Daniel n'est ni rattaché à une assemblée ni son
  dirigeant). La progression d'un membre ouverte par la ville n'a **pas** de lien vers les copies
  (`canOpenCopy` faux : ni soi, ni `leader`), et le serveur la refuserait (RG-ETU-13).

### 7.4 Écarts assumés et points relevés

- **Partie « Le problème »**, **salon** (P1, P6, P11, fonds de P8, P14, P15), **livret de Paul et
  cahier d'Hélène** (P11), **intertitres**, **frise des dimanches** (P17), **enveloppe au cadenas**
  (P18), **pastilles de personnes** et **remplissage de la barre** (P17) : annotations vidéo.
- **« Copie de Marie · entre les mains de Jean »** (P14) : la maquette de la présentation au
  pasteur titrait « Copie de Marie K. » ; l'écran **livré** n'affiche **aucun** nom (la correction
  porte sur la copie du compte connecté, RG-ETU-10). La vidéo met le nom dans la pastille, hors du
  téléphone.
- **Alertes de confirmation** (P7, P12, P15) : `confirmDialog` ouvre l'alerte **native** (iOS),
  redessinée sobrement : titre, message, « Annuler » à gauche, le bouton de confirmation à droite.
  Brique `src/etude/ui/Alerte.tsx`.
- **Saisie de texte sans clavier** (P9, P16) : le texte s'écrit dans le champ ; le clavier du
  système n'est pas dessiné (il cacherait les questions).
- **Numérotation Q1, Q5, Q6, Q7, Q10, Q11…** : c'est celle du manuel, dont `uemb002-exemple.json`
  ne reprend que des extraits ; à l'écran, la liste saute donc de Q1 à Q5. Rien à corriger dans
  l'app ; si JP préfère une leçon sans trous, il faut une leçon 1 complète (point ouvert 3).
- **Titres des leçons 2 à 5** : `uemb002-exemple.json` leur donne le titre « Leçon 2 »… ; l'app
  afficherait alors **« Leçon 2 · Leçon 2 »** (`study.lessonTitled`). La vidéo suppose un titre
  vide (affiché « Leçon 2 »). **À signaler pour la recette ETU6** : vider ces titres dans le JSON,
  ou y mettre les vrais titres du livret.
- **Notes sur 13** (contenu de `uemb002-exemple.json`) au lieu de « 38 / 42 » et « 5 / 14
  répondues » de la présentation (chiffres d'illustration) ; **11 copies dans l'app et
  2 copies papier** au lieu de « 14 présents » (consigne « une douzaine de personnes »).
- **Le dirigeant ne répond pas** : il est répondant (D-ETU-06) mais pilote la séance ; il apparaît
  donc parmi les membres sans copie de la modale papier (P16) et avec « – » dans l'avancement.
- **Le retour du réseau** de Jean (P10) arrive avant le passage à la correction : le cas d'une
  réponse tapée hors ligne et envoyée après (acceptée jusqu'à 2 min après la correction, ignorée
  au-delà et signalée) n'est pas montré.
- **Non montrés** : *Annuler la séance*, *Refaire* une leçon (meilleure note, D-ETU-18), le
  verrou d'une unité par son prérequis, la séance oubliée proposée à *Terminer* (D-ETU-22),
  l'ajustement des points par le dirigeant, la lecture des réponses personnelles par le dirigeant
  (RG-ETU-18), l'espace web (D-ETU-14).
- **Accueils** : date au format réel de `home.tsx` (« Octobre 25, 2026 », voir « Journal » § 7.4) ;
  la tuile « Cantiques » reste hors champ.
- **Livre** : la couverture de « Disciple coûte que coûte » est dessinée (aplat, titre), pas
  reproduite. **Livret de l'étudiant** (P11) : page dessinée, questions imprimées reprises des
  énoncés de la leçon 1 (raccourcies pour 5 et 7.a), pas la mise en page réelle du livret.
- **Copies papier** (P16) : deux saisies à la suite, gestes à la vitesse de l'app ; aucune
  réponse n'est saisie (D-ETU-13), la note seule ; la liste « Membre » perd Paul après sa saisie
  (`withoutCopy`).

### 7.5 Chaque affirmation, vérifiée

| Affirmation (plan) | Source |
|---|---|
| La tuile « Le Message de Bertoua » de l'accueil, pour tout compte rattaché si le ministère a l'abonnement (P7, P8, P18) | D-ETU-04, D-ETU-05 ; `home.tsx` (`hasStudy`) |
| Le dirigeant choisit l'unité puis la leçon et appuie sur *Commencer* (P7) | D-ETU-07, RG-ETU-02b ; `index.tsx` (`onStart`) |
| Les questions arrivent sur chaque téléphone, sans la réponse du manuel (P8, P9) | RG-ETU-03, RG-ETU-12 ; contrat § 4.4 |
| Vrai / faux, oui / non, cases, réponses écrites, sous-questions, consigne, question personnelle (P9) | RG-ETU-20, RG-ETU-09 ; contrat § 2.3 ; `StudyQuestionList` (`AnswerInput`) |
| « enregistré ✓ » même sans réseau ; envoi au retour du réseau (P10) | D-ETU-11 ; `session/[id].tsx` (`persistNow`, `flush`), `services/studyDraft.ts` |
| Sans application, on répond dans son livret ou dans un cahier ; le dirigeant saisit la note seule (P11, P16) | D-ETU-13 ; `results/[id].tsx` (`PaperModal`) |
| *Passer à la correction* verrouille la saisie et corrige les fermées (P12, P13) | RG-ETU-01, RG-ETU-03, RG-ETU-05, RG-ETU-11 ; contrat § 4.3 |
| Cases à cocher au prorata : b, c, f, a → 2 / 4 (P13) | RG-ETU-06 (exemple du plan) ; contrat § 5 |
| On échange les téléphones ; *Juste* / *À préciser* / *À revoir* ; aucun correcteur désigné (P14) | RG-ETU-07, RG-ETU-10, D-ETU-20 |
| *À préciser* = la moitié des points (0,5 / 1) (P14) | RG-ETU-07 (à confirmer par le pasteur, plan § 10) |
| La question personnelle n'est jamais montrée pendant l'échange (P14) | RG-ETU-08 ; `StudyQuestionList` (`maskPersonal`) |
| *Terminer* : chacun voit sa note (P15) | RG-ETU-01, RG-ETU-11 ; `session/[id].tsx` (`scoreCard`) |
| Le dirigeant voit les résultats de l'assemblée (P16) | RG-ETU-14 ; `results/[id].tsx` |
| Leçons faites par unité (3 / 5), note de chaque leçon, note cumulée (P17) | D-ETU-10, RG-ETU-17 ; `progress.tsx` (`PersonView`) |
| La ville voit l'avancement et les notes de ses assemblées (P18) | D-ETU-08, RG-ETU-14, RG-ETU-17b ; `index.tsx` (`Overview`), `progress.tsx` (`UnitView`) |
| La ville ne lit jamais le contenu des copies, réponses personnelles comprises (P18) | D-ETU-09, RG-ETU-13 ; `progress.tsx` (`canOpenCopy`) |
| Trois boutons pour le dirigeant (fin) | plan § 1 |

---

## 8. Réalisation dans `cmfipraise-motion`

- **Ne pas toucher** à `CategoriesFR` / `CategoriesEN`, `EvenementsFR`, `JournalFR` / `JournalEN`,
  `DocumentsFR`, ni à leurs fichiers de `out/`. `Root.tsx` : `<Composition id="EtudeFR"
  component={VideoEtude} durationInFrames={DUREE_ETUDE} fps={30} width={1080} height={1920}
  defaultProps={{ langue: 'fr' }} />`.
- **Arborescence** `src/etude/` (modèle de `src/journal/`) : `textes.ts` (`TEXTES_ETUDE.fr` :
  `legendes`, `cartons`, `app` — libellés du § 7.2 copiés de `fr.json`, légendes, intertitres et
  cartons du § 4 ; type `TextesEtude` « élargi » pour l'anglais à venir), `donnees.ts` (`DONNEES.fr`,
  § 6, type `DonneesEtude`), `langue.tsx` (prop `langue` de la composition → contexte →
  `useEtude()` ; une langue absente lève une erreur), `calage.ts` (§ 5), `Video.tsx` (découpage,
  intertitres, pastilles, musique) ; `ecrans/` (`Accueil`, `AccueilEtude`, `Seance`, `Questions`,
  `Resultats` — avec la modale papier, liste en prop —, `Progression`) ; `ui/` (`Salon` — de jour,
  Hélène, téléphones en main —, `Livre`, `Alerte`, `Annotations` — frise des dimanches, enveloppe —,
  `Papier` — livret de Paul, crayon —, `Intertitre`) ; `plans/` (`Probleme` P1–P4, `Cartons` P5 +
  P19, `Lire` P6–P7, `Repondre` P8–P11, `Corriger` P12–P14, `Terminer` P15–P16, `AuFil` P17–P18,
  `commun` — dont `Ralenti`, `imageRalentie`, `dureeRalentie`). **Aucune chaîne visible en dur** hors
  de `textes.ts` et `donnees.ts` : la version anglaise (`EtudeEN`, faite le 21/10, § 10) n'avait qu'à remplir
  `TEXTES_ETUDE.en` et `DONNEES.en` (avec les nombres de lignes `l` des questions anglaises, qui
  pilotent les positions) et à déclarer la composition.
- **Réutilisé tel quel** : `ui/Telephone` (dont `avion`), `ui/Plateau`, `ui/Pile`, `ui/Scene` ; de
  `src/evenements/` : `theme.ts` (`S`, `P`, `R`, `ONDE`), `ui/Habillage` (`FondShephr`, `TuileLogo`,
  `Logotype`, `PastilleCoin`), `ui/app.tsx` (`Ecran`, `Carte`, `Bouton`, `Halo`, `BarreOnglets` —
  avec ses `libelles` facultatifs, déjà existants —, `Etiquette`), `plans/commun.tsx` (`Appui`,
  `montee`, `lisse`, `tape`, `Decale`, `Fondu`, `Voile`), la `Tuile` exportée de
  `ecrans/Accueil.tsx` ; de `src/journal/` : `ui/Illustrations.tsx` (`PageLignee`, `PetitCahier`,
  `Silhouette`, `Question`), `ui/elements.tsx` (`Retour`), `plans/commun.tsx` (`PastillePartie`) ;
  de `src/documents/` : `LegendeDocuments`. L'intertitre reprend le gabarit de celui
  d'« Évènements » dans `src/etude/ui/Intertitre.tsx` (textes propres à l'étude).
- **Retouches partagées** : **aucune** (ni dans la première version, ni dans la révision).
- **Script** : `"render:etude": "remotion render EtudeFR out/etude-fr.mp4"` ; section « Vidéo
  « Étude de l'assemblée » (Shephr) » dans le `README.md`.
- **Captures de contrôle** de la révision (rendu `renderStill` à l'échelle 0,5, dans le
  scratchpad, regardées une à une) : 140 · 200 (P1) · 330 (P2) · 480 (P3) · 690 (P4) · 800 (P5) ·
  960 (P6) · 1130 / 1230 / 1320 (P7) · 1370 (intertitre) · 1480 / 1600 (P8) · 1760 / 1880 (P9) ·
  2030 / 2100 (P10) · **2150 / 2200 / 2300 / 2400** (P11, orchestre) · 2560 (P12) · 2780 / 2880
  (P13) · 2960 / 2980 / 3100 / 3250 (P14) · 3320 (intertitre) · 3500 / 3600 (P15) · 3700 / 3800 /
  3880 / 3960 / 4100 (P16) · 4160 (intertitre) · 4300 / 4440 (P17) · 4560 / 4630 / 4685 / 4700 / 4800
  (P18) · 4950 (P19).

### 8.1 Écarts de la réalisation (ETU7, étape 2, 21/10)

Première version (112 s), **numérotation de l'époque** (P10 = Jean et Paul, P11 = passer à la
correction … P18 = fin) ; ces ajustements ont été faits au vu des captures de contrôle et restent
valables dans la révision (§ 8.2) :

- **Fichiers** : `ui/Livre.tsx` réunit livre et livrets ; `ui/Annotations.tsx` réunit la frise et
  l'enveloppe (pas de fichier par objet). `plans/Corriger.tsx` reçoit la durée calculée de P12 en
  prop (`Video.tsx`), sans importer `calage.ts` : pas d'import circulaire.
- **Échelles des téléphones** : trois téléphones à 0,62 du téléphone au repos ne tiennent pas dans
  1 080 px ; ils sont à 0,8 point → pixel (≈ 0,49 du repos) en P8 et P14. En P13, deux téléphones à
  1,24 (≈ 0,76, gabarit de P6 de « Documents »).
- **P5** : carton à 98 px (au lieu de 104) pour que « on corrige ensemble. » tienne sur une ligne.
- **P7** : le libellé de l'unité est coupé à deux lignes (`numberOfLines={2}` de l'app). Samuel étant
  répondant (D-ETU-06), son accueil de l'étude montre aussi « Ma progression », et sa séance
  « 0 / 10 répondues » ; en *Correction*, sans réponse, la carte « Vous n'avez pas répondu dans
  l'application : rien à corriger sur ce téléphone. » ; en *Terminée*, « Ma note » / « Vous n'avez
  pas de copie dans l'application pour cette séance. » (écran livré).
- **P9** : le compteur passe à « 1 / 10 répondues · enregistrement… » dès la première frappe (i 18),
  comme l'app (`onAnswer`), et « enregistré ✓ » 0,7 s après la dernière (i 71) ; 7.a et 7.b sont
  saisies plus tôt (i 122 → 140) pour tenir « 5 / 10 répondues · enregistré ✓ » ≈ 0,7 s sous le
  zoom ; le défilement remonte au compteur avant le zoom (le compteur n'est pas fixe dans l'écran).
- **P10** : le défilement remonte du Q11 au bandeau et au compteur (i 40 → 56) pour le zoom.
- **P11** : « Passer à la correction » ne tient pas sur une demi-alerte : comme iOS, les boutons
  s'empilent (confirmation en haut, « Annuler » en bas).
- **P13** : le court retour du cadrage (i 136 → 150) est inutile : « 2 réponses écrites restantes »
  reste dans le champ au zoom 1,3.
- **P16** : zoom 1,15 (au lieu de 1,3) : le téléphone décalé ne sort pas du cadre et ne mord pas sur la
  frise.
- **P17** : un défilement (i 150 → 166) amène « Marie Kamga » (9ᵉ membre) dans le champ avant l'appui.


### 8.2 Révision du 21/10 (retours de JP)

1. **Plus lent, pour bien expliquer** (112 s → **167 s**, cible ≈ 2 min 45 à 3 min ; modèle
   d'« Évènements ») : gestes à vitesse inchangée, **poses** ajoutées dans chaque plan (`Ralenti`,
   § 2 « Rythme », liste au § 4), **légendes d'explication** ajoutées (la tuile, la leçon du jour, la
   séance ouverte, « En cours », « s'enregistre aussitôt », « au retour du réseau », « Chacun a
   répondu ? », « la saisie se verrouille », « en correction », « une case fausse, une oubliée »,
   « le voisin compare avec la réponse du manuel », « aussitôt », « la copie papier, la note
   seule », « avec les notes »), **intertitres de 2,5 s** avant les parties 2 à 5. P13 (fermées) et
   P16 (résultats et copies papier) sont réécrits pour leur nouvelle durée ; P10 est désormais le
   plan tampon.
2. **Le dimanche, en journée** : légende « Le dimanche, », fenêtre de jour (ciel, soleil voilé, un
   arbre), lumière au sol, lampe éteinte (`ui/Salon.tsx`) ; frise « Dimanche après dimanche » ;
   dates : dimanche 25 octobre 2026 (réunion), dimanches 1er et 8 novembre (leçons 2 et 3), lundi
   9 novembre (vue de la ville) — accueils (« Octobre 25, 2026 », « Novembre 9, 2026 »), résultats,
   progression, « Dernière séance le 8 novembre 2026 », frise. L'heure de la barre d'état (11:10,
   commune à toutes les vidéos) convient au jour.
3. **Sans application : son livret ou un cahier** : nouveau plan **P11** (10 s, sur l'entrée de
   l'orchestre) — le salon où tout le monde répond, puis Paul dans son **livret** et **Hélène**,
   l'aînée sans smartphone, dans un **simple cahier** ; légendes « Pas d’application ? On répond dans
   son livret… » / « …ou dans un cahier, comme aujourd’hui. ». En **P16**, Samuel saisit les deux
   **copies papier** (la note seule, D-ETU-13, libellés `study.results.*`, écran `results/[id].tsx`) :
   « 12 copies » puis « 13 copies », les deux lignes « papier » dans les résultats.
4. **Phrase de fin** : « Le Message de Bertoua, simplement. » (P19, 88 px).
5. **Préparation de la version anglaise** : structure de `src/journal/` (prop `langue`, `langue.tsx`,
   textes et données par langue) ; français seul rempli ; `EtudeEN` créée ensuite (§ 10).
6. **Musique** : même piste ; départ au début du fichier ; orchestre sur P11 (§ 5).

---

## 9. Points à valider par JP

1. La durée (**167 s**, 2 min 47) et le rythme : poses, légendes d'explication, intertitres de
   2,5 s avant les parties 2 à 5 (pas d'intertitre pour la partie 1, ouverte par la bascule P5).
2. **L'orchestre sur P11** (le salon qui répond, livret et cahier) plutôt que sur l'échange des
   téléphones, qui arrive désormais trop tard dans le chant (§ 5) ; la vidéo part du début du
   fichier.
3. **Hélène Mballa**, l'aînée sans smartphone qui répond dans un cahier (nom, allure : cheveux
   blancs, canne) ; les deux copies papier saisies l'une après l'autre en P16 (16,5 s).
4. Les personnages (§ 6.1) : noms complets de Marie K., Jean P., Esther M., Paul N. ; le dirigeant
   **Samuel Fotso** ; l'assemblée **Paris Ouest** (le dimanche, en journée) sous Daniel Mercier, la
   ville de « Journal ».
5. Le contenu : la leçon 1 de `uemb002-exemple.json` (notes sur 13, 10 questions, numérotation du
   manuel) — ou une leçon 1 complète fictive aux chiffres de la présentation (sur 42, 14 questions) ;
   les titres des leçons 2 à 5 (vides, ou les vrais titres du livret).
6. L'enveloppe de P18 « Marie et son dirigeant seulement » reprend D-ETU-09, encore **à faire
   confirmer par le pasteur** (plan § 10, point 1) ; de même *À préciser* = la moitié (point 2).
7. L'écriture « manuscrite » des cahiers et du livret en Fraunces italique (comme « Journal »), ou une
   vraie police manuscrite (une dépendance de plus).

---

## 10. Version anglaise (`EtudeEN`, demande de JP du 21/10/2026)

La même vidéo en anglais : composition `EtudeEN` (`defaultProps={{ langue: 'en' }}`), rendu par
`npm run render:etude:en` → `out/etude-en.mp4`. Modèle : `JournalEN` (`docs/storyboard-journal.md`
§ 10). **Même découpage, mêmes durées (5 010 images = 167,0 s), même piste, mêmes calages** (montée
de 24,0 s sur P5, orchestre de 70,5 s sur P11) : aucune image ne bouge, seuls changent les textes et
les données fictives. Mêmes chiffres partout (notes, copies, avancements, avis restants).

### 10.1 Réalisation

- `src/etude/textes.ts` : `TEXTES_ETUDE.en` (`LEGENDES_EN`, `CARTONS_EN`, `APP_EN`), typés par le
  français (mêmes clés, mêmes longueurs de tableaux : un oubli ne compile pas).
- `src/etude/donnees.ts` : `construireEn()`, même forme `DonneesEtude`. Une garde (`memesChiffres`)
  compare au chargement la structure des deux jeux, chaînes et annotations `l*` mises à part : un
  chiffre différent lève une erreur.
- `Root.tsx` : `EtudeEN` ; `package.json` : `"render:etude:en"`.
- **Une retouche de code**, sans effet sur le français (vérifié au pixel, § 10.7) : l'appui de P18 sur
  l'assemblée de la vue d'ensemble suit sa rangée (`rangeeAssemblee`, `ecrans/AccueilEtude.tsx`). Le
  serveur trie les assemblées par nom (`StudyServiceImpl`) : « Leeds West » est la 4ᵉ rangée (East,
  North, South, West), là où « Paris Ouest » est la 3ᵉ.
- Aucune taille de police changée : toutes les légendes anglaises tiennent sur leurs deux lignes
  (la `LegendeShephr` réduit d'elle-même les plus longues, comme en français pour P13 et P16).

### 10.2 Légendes et cartons FR → EN

Adaptation, pas du mot à mot ; deux lignes au plus ; typographie anglaise (rien avant « : ? »,
apostrophe ’, guillemets “ ”). En *italique* : le mot en argile.

| Plan | Français | Anglais |
|---|---|---|
| P1 | Le dimanche, / *une assemblée de maison*. — Chacun répond / *dans son cahier*. | On Sunday, / *a house assembly*. — Everyone answers / *in their notebook*. |
| P2 | On échange *les cahiers*, / on corrige *à la main*. | We swap *notebooks*, / we correct *by hand*. |
| P3 | Les notes, sur une feuille… / et elles *se perdent*. | Scores, on a loose sheet… / and they *get lost*. |
| P4 | Où en est chacun ? / *Personne ne sait.* — Et la ville / *ne voit rien*. | Where is everyone up to? / *Nobody knows.* — And the city / *sees nothing*. |
| P5 | On lit, on répond, / on corrige *ensemble*. | We read, we answer, / we correct *together*. |
| P6 | D’abord, on lit / *la leçon ensemble*. | First, we read / *the lesson together*. |
| P7 | Le dirigeant touche / *Le Message de Bertoua*. — Il choisit / *la leçon du jour*. — Un geste : / *Commencer*. — La séance est ouverte : / chacun peut *répondre*. | The leader taps / *Bertoua message*. — He picks / *today’s lesson*. — One tap: / *Start*. — The session is open: / everyone can *answer*. |
| P8 | Chez chacun, la tuile / passe *« En cours »*. — Les questions arrivent / *sur chaque téléphone*. | On every phone, the tile / shows *“Live”*. — The questions arrive / *on every phone*. |
| P9 | Vrai ou faux, cases, / *réponses écrites*… — Chaque réponse / *s’enregistre aussitôt*. — …et questions / *personnelles*. | True or false, boxes, / *written answers*… — Every answer / *is saved at once*. — …and *personal* / *questions*. |
| P10 | Sans réseau, / *rien n’est perdu*. — Les réponses partent / *au retour du réseau*. | No network, / *nothing is lost*. — Answers are sent / *once back online*. |
| P11 | Tout le monde répond, / *même sans smartphone*. — Pas d’application ? / On répond *dans son livret*… — …ou *dans un cahier*, / comme aujourd’hui. | Everyone answers, / *even without a smartphone*. — No app? / Answer *in your booklet*… — …or *in a notebook*, / just like today. |
| P12 | Chacun a répondu ? / *Passer à la correction*. — La saisie se verrouille / *sur chaque téléphone*. | Has everyone answered? / *Move to correction*. — Answering is locked / *on every phone*. |
| P13 | Chaque téléphone passe / *en correction*. — Les questions fermées / *se corrigent seules*. — Une case fausse, une oubliée : / *2 points sur 4*. | Every phone moves / *to correction*. — Closed questions / *correct themselves*. — One wrong box, one missed: / *2 points out of 4*. |
| P14 | On échange / *les téléphones*. — Le voisin compare avec / *la réponse du manuel*. — *Juste*, *À préciser*, / *À revoir*. — La question personnelle / *reste masquée*. | We swap / *phones*. — The neighbour checks against / *the manual’s answer*. — *Right*, *Needs detail*, / *Review*. — The personal question / *stays hidden*. |
| P15 | Tous les avis sont posés : / *Terminer*. — Et chacun voit / *sa note*, aussitôt. | Every verdict is in: / *Finish*. — And everyone sees / *their score*, right away. |
| P16 | Le dirigeant voit / *les résultats de chacun*. — Des réponses sur papier ? / *Une copie papier*, la note seule. — Il saisit la note / *du livret de Paul*… — …puis celle / *du cahier d’Hélène*. — Les copies papier / *rejoignent les résultats*. | The leader sees / *everyone’s results*. — Answers on paper? / *A paper copy*, the score only. — He enters the score / *from Paul’s booklet*… — …then the one / *from Helen’s notebook*. — The paper copies / *join the results*. |
| P17 | Dimanche après dimanche, / *leçon après leçon*. — *3 leçons sur 5* : / chacun voit où il en est. | Sunday after Sunday, / *lesson after lesson*. — *3 lessons out of 5*: / everyone sees where they are. |
| P18 | La ville voit / *l’avancement des assemblées*… — …leçon par leçon, / *avec les notes*… — …jamais les réponses / *personnelles*. | The city sees / *each assembly’s progress*… — …lesson by lesson, / *with the scores*… — …never anyone’s / *personal answers*. |
| P19 | Le Message de Bertoua, / *simplement*. | **Bertoua message, / *simply*.** (JP 21/10) |

Pastilles de partie : THE PROBLEM · 1 · READ · 2 · ANSWER · 3 · CORRECT · 4 · FINISH ·
5 · MEETING AFTER MEETING. Intertitres : « 2 · Answer — On your phone, or on paper. », « 3 · Correct
— We swap phones. », « 4 · Finish — Everyone sees their score. », « 5 · Meeting after meeting —
Sunday after Sunday. ». Les verbes des parties et des intertitres sont ceux des boutons de l'app
(*Start*, *Answer*, *Finish*) ; « Correct » reprend `study.status.CORRECTION`.

Illustrations et annotations vidéo :

| Élément | Français | Anglais |
|---|---|---|
| Pastilles de personne | SAMUEL · DIRIGEANT, MARIE, JEAN, ESTHER, PAUL, HÉLÈNE, DANIEL · VILLE | SAMUEL · LEADER, MARY, JOHN, ESTHER, PAUL, HELEN, DANIEL · CITY |
| Étiquettes du salon (P1, P2, P4, P11) | Samuel · dirigeant, Marie, Jean, Esther, Paul, Hélène | Samuel · leader, Mary, John, Esther, Paul, Helen |
| Copie échangée (P14) | Copie de **Marie** · entre les mains de **Jean** | Copy of **Mary** · held by **John** |
| Livre (couverture dessinée) | Disciple coûte que coûte | Discipleship at Any Cost (titre anglais du livre de Z. T. Fomum) |
| Livrets | Livret de l’étudiant · UEMB002 ; Leçon 1 · Le prix à payer | Student booklet · UEMB002 ; Lesson 1 · The Cost |
| Livre ouvert (P3, P6) | Préface · Chapitre 1 | Preface · Chapter 1 |
| Cahiers de Marie et Jean (P2) | Leçon 1 · Q1. Que nous fassions des disciples. · Q11. b c f a / Q1. Faire des disciples. · Q11. b c g ; « Q11 : 2 ou 3 ? » | Lesson 1 · Q1. That we make disciples. · Q11. b c f a / Q1. Make disciples. · Q11. b c g ; « Q11: 2 or 3? » |
| Feuille volante (P3) | Marie 10,5 · Jean 9 · Esther 12,5 · Paul ? | Mary 10.5 · John 9 · Esther 12.5 · Paul? |
| Questions (P4) | Qui a fait la leçon 3 ? · Où en est Paul ? · Qui a besoin d’aide ? | Who did lesson 3? · How far is Paul? · Who needs help? |
| Ville (P4) | VILLE · PARIS | CITY · LEEDS |
| Petits cahiers (P5) | LEÇON 1 | LESSON 1 |
| Livret de Paul (P11) | 1. Quel est l’appel ultime… → L’appel à faire des disciples. · 5. … → Oui · 6. … → Vrai · 7.a … → Tous ont péché. | 1. What is the Lord Jesus’ ultimate call? → The call to make disciples. · 5. The Lord Jesus lived a life without sin. → Yes · 6. The disciple must be disciplined. → True · 7.a What do these passages show? → All have sinned. |
| Cahier d’Hélène (P11) | Leçon 1 · Q1. Faire des disciples. · Q5. Oui · Q6. Vrai · Q7.a Tous ont péché. | Lesson 1 · Q1. Make disciples. · Q5. Yes · Q6. True · Q7.a All have sinned. |
| Supports (P11) | SON LIVRET · UN CAHIER | HIS BOOKLET · A NOTEBOOK |
| Frise (P17) | DIM. 25 OCT. · DIM. 1ER NOV. · DIM. 8 NOV. ; Leçon 1…5 | SUN 25 OCT · SUN 1 NOV · SUN 8 NOV ; Lesson 1…5 |
| Enveloppe (P18) | Réponses de Marie · Marie et son dirigeant seulement | Mary’s answers · Mary and her leader only |

### 10.3 Données fictives anglaises

Une assemblée de maison anglophone, **Leeds West**, dans la ville de **Leeds** — celle de
`JournalEN` (Leeds North, Leeds East, Leeds South), dont **Daniel Morgan** est le dirigeant de ville,
comme Daniel Mercier pour Paris. Réunion **le dimanche, en journée**, dans le salon de Samuel ; mêmes
dimanches : réunion le **Sunday 25 October 2026**, leçons 2 et 3 les **1 et 8 November**, vue de la
ville le **Monday 9 November**. Dates de l'app anglaise (`fmtIsoDay`, jour d'abord) :
« 25 October 2026 », « Last session on 8 November 2026 » ; nombres à point décimal
(`fmtPoints(n, 'en')`) : « 10.5 / 13 », « 0.5 / 1 », « Cumulative score: 18.5 / 22 ».

Mêmes personnes, mêmes rôles, mêmes initiales :

| Français | Anglais | Rôle |
|---|---|---|
| Samuel Fotso (SF) | **Samuel Fisher** (SF) | dirigeant de l'assemblée, ne répond pas |
| Marie Kamga (MK) | **Mary Kent** (MK) | répond, copie corrigée par John |
| Jean Petit (JP) | **John Price** (JP) | répond hors ligne, corrige la copie de Mary |
| Esther Mbida (EM) | **Esther Morris** (EM) | répond |
| Paul Nana (PN) | **Paul Newton** (PN) | sans smartphone : son livret, note papier |
| Hélène Mballa (HM) | **Helen Marshall** (HM) | l'aînée sans smartphone : un cahier, note papier |
| Daniel Mercier (DM) | **Daniel Morgan** (DM) | dirigeant de la ville (le même que `JournalEN`) |
| Aline Tchoua · Christelle Abena · David Laurent | Alice Thompson · Charlotte Adams · David Lawson | |
| Grâce Ngo · Joël Mvondo · Lucie Roche | Grace Nolan · Joseph Moore · Lucy Reed | |
| Rose Eyenga (absente) · Ruth Ateba · Sylvain Ondoa | Rose Ellis (absente) · Ruth Allen · Simon Owen | |

Les noms gardent **l'ordre alphabétique** du français : chacun reste à la même ligne des résultats
(P16), de la liste « Member » (Helen, Paul, Rose, Samuel) et des membres (P18, Mary Kent 10ᵉ) — appuis
et défilements inchangés. Vue d'ensemble de Leeds : Leeds East 1 / 5 · Leeds North 2 / 5 · Leeds
South 0 / 5 · **Leeds West 3 / 5** (ordre du serveur, § 10.1).

**La leçon** (contenu fictif / illustratif, comme le français) : traduction de la leçon 1 de la
version française — l'avenant langue : une assemblée anglophone étudie la version anglaise de
l'unité, même code **UEMB002** « Becoming and Being a Disciple of the Lord Jesus Christ », livre
« Discipleship at Any Cost ». Leçon 1 **« The Cost »** (« Preface and chapter 1 ») ; leçons 2 à 5 sans
titre (« Chapter 2 »…). Mêmes types, mêmes points, mêmes clés :

| Q | Énoncé anglais | Manuel / choix |
|---|---|---|
| 1 | What is the Lord Jesus' ultimate call? | The call to make disciples. |
| 5 | The Lord Jesus lived a life without sin. Yes or No? | Yes |
| 6 | The disciple must be disciplined. | True |
| 7 | Read the following passages: Exodus 20:1-17; Romans 3:23. | |
| 7.a | What do these passages show about man's state before God? | All have sinned and fall short of the glory of God. |
| 7.b | Support your answer with a verse. | Romans 3:23. |
| 10 | Are there still sins in your life? (Personal) | Each believer must answer |
| 11 | Tick the ones that show the price to pay to be a disciple. *Luke 14:25-33* | a. Keep first place for oneself · b. Love the Lord above one's family · c. Carry one's cross every day · d. Follow the Lord when it suits · e. Keep one's possessions for later · f. Give up everything one owns · g. Hate one's own life because of Him (clé b, c, f, g) |
| 12 | List all your possessions… Now pray and hand them over to the Lord. (Exercise) | |
| 13 | Have you given the Lord your right to marriage? Yes or No? (Personal) | Each believer must answer |
| 31 | Who has priority rights over the disciple's life? | His parents · His spouse · Himself · The Lord Jesus (clé d) |

Copies : Mary « That we make disciples. », « All have sinned. », « Romans 3 », « Yes: impatience, and
sometimes pride. I give them to the Lord. », b c f a ; John « Make disciples. », « All are
sinners. », « Romans 6 », « Yes, anger. » ; Esther « The call to make disciples. ».

Nombres de lignes `l` recalculés pour l'anglais (mesure des chaînes en Inter / Fraunces aux largeurs
des cartes de `ecrans/Questions.tsx`, calibrée sur les valeurs françaises, retrouvées toutes) :
énoncés inchangés (Q1 1, Q5 2, Q6 1, Q7 2, 7.a 2, 7.b 1, Q10 1, Q11 2, Q12 2, Q13 2, Q31 2 ; manuel
7.a 2) ; choix de Q11 tous sur une ligne (a et d en tenaient deux en français), g sur deux avec
« right answer ». Écarts de libellé choisis pour la mise en page : « above one's family » (b, une
ligne sûre) et le titre « The Cost » (« The Price to Pay » passait sur deux lignes dans la rangée de
« My progress », P17).

### 10.4 Libellés repris de `mobile/utils/i18n/locales/en.json`

Mêmes clés que la version française (§ 7.2), valeurs anglaises à la lettre (apostrophes droites
comprises) : `study.tile.*` Bertoua message / Assembly study / Live · `study.kicker` Assembly study ·
`study.lesson*` Lesson {n} (· {title}) · `study.points_*` 1 pt / 2 pts · `study.status.*` Answering /
Correction / Finished · `study.types.*` Personal / Exercise · `study.verdict.*` Right / Needs detail /
Review · `study.values.*` True / False / Yes / No · `study.home.*` Answer · Start a session ·
{n} / {total} lessons · Start · Start the session? · {lesson} — respondents can answer right away. ·
Finished sessions · No finished session yet. · Assembly progress · My progress · Assemblies' progress
· `study.session.*` {n} / {total} answered · saving… · saved ✓ · Offline — your answers are on the
phone and will be sent when the network is back. · Swap phones: your neighbour reads the given answer
and the manual's answer, then picks a verdict. · {n} written answers left · My score · You did not
answer in the app: nothing to correct on this phone. · You have no app copy for this session. ·
`study.question.*` Your answer… · Done ✓ · Given answer · Manual's answer · wrong · right answer ·
Personal question — answered ✓ · `study.leader.*` Leader · Results · {n} respondents · Show the
manual's answers · Move to correction · Answering will be locked on the phones and closed questions
corrected. · Cancel the session · {n} verdicts left · Every verdict is in. · Finish · Scores will be
closed. You can still adjust points from the results. · Session finished — {n} copies ·
`study.results.*` Results · out of {max} · {n} copies · paper · {n} answers · Add a paper copy · For a
member who answered in the booklet (or catches up on a session): the score only. · Member · Score
(out of {max}) · `study.progress.*` Assembly progress · My progress · Members · Last session on
{date} · Cumulative score: {score} / {max} · Not done yet · `common.*` Cancel · Save · Choose… ·
`dashboard.*` Welcome back, · My goals · Five-Year Goal — pledges & current status · Record an action /
Evangelism · Documents / Teachings to read and share · Create an assembly / In the city of your choice
· Members / Your scope's directory · Hierarchy / Your leadership · Hymn / Chris The Victor ·
`tabs.*` Home · Goals · Assembly · Events · Profile.

Pluriels i18next anglais : 1 seul au singulier — P7 montre donc « 0 respondents » (« 0 répondant »
en français).

### 10.5 Ce que l'app anglaise affiche encore en français (traduit dans la vidéo)

**Date de l'accueil** (P7, P8, P18) : `home.tsx` la compose avec `monthLabel` (`utils/format.ts`),
mois français en dur : l'app anglaise afficherait « Octobre 25, 2026 ». Comme `JournalEN` (§ 10.5 de
son storyboard), la vidéo montre « October 25, 2026 » et « November 9, 2026 » (`APP_EN.dateSamuel`,
`dateDaniel`, ordre de `home.tsx`, mois de `common.monthsLong`). **À confirmer par JP** (corriger
l'app, recommandé, ou revenir au rendu actuel dans `textes.ts`).

### 10.6 Captures de contrôle (anglais)

74 images (`renderStill`, échelle 0,5, scratchpad), regardées une à une, la plupart côte à côte avec
la française au même numéro : 60 · 140 · 200 · 330 · 380 · 480 · 520 · 600 · 690 · 800 · 960 · 1000 ·
1060 · 1130 · 1180 · 1230 · 1280 · 1320 · 1370 · 1480 · 1550 · 1600 · 1700 · 1760 · 1820 · 1880 · 1900 ·
2030 · 2060 · 2100 · 2150 · 2200 · 2300 · 2400 · 2450 · 2560 · 2620 · 2700 · 2780 · 2850 · 2880 · 2960 ·
2980 · 3050 · 3100 · 3150 · 3200 · 3250 · 3320 · 3420 · 3500 · 3600 · 3700 · 3750 · 3800 · 3850 · 3880 ·
3960 · 4000 · 4050 · 4100 · 4160 · 4300 · 4380 · 4440 · 4560 · **4599** (appui sur Leeds West) · 4630 ·
4685 · 4700 · 4740 · 4800 · 4900 · 4950. Corrigé au vu des captures : la légende de P10 (« when the
network is back » réduisait la police) et le titre de la leçon (§ 10.3).

### 10.7 Non-régression

Avant toute modification : 45 images d'`EtudeFR` (celles du § 8) en PNG ; après : mêmes images,
comparées octet par octet (`cmp`) : **45 / 45 identiques**. `npx remotion compositions` : `EtudeFR`
et `EtudeEN` à 5 010 images (167,00 s). Aucun fichier partagé avec les autres vidéos n'est modifié.

### 10.8 Points à valider par JP (version anglaise)

1. Les légendes (§ 10.2), les intertitres et la fin « Bertoua message, simply. ».
2. Leeds West, Samuel Fisher et les noms anglais (§ 10.3) ; Daniel Morgan, le même que `JournalEN`.
3. La leçon traduite : titre « The Cost », titre anglais du livre « Discipleship at Any Cost »,
   références à l'anglaise (« Exodus 20:1-17 », « Luke 14:25-33 ») ; le titre et le nom de l'unité
   réels de la version anglaise d'UEMB002, s'ils existent, à reprendre.
4. La date de l'accueil traduite (§ 10.5) alors que l'app anglaise affiche « Octobre ».

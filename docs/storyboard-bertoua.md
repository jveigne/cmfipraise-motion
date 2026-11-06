# Storyboard — motion « Le Message de Bertoua en détail » (Shephr), V1

> Vidéo 9:16, **1080 × 1920, 30 i/s**, composant `VideoBertoua` (`src/bertoua/Video.tsx`, export par
> défaut et nommé), durée `DUREE_BERTOUA` = **7 140 images = 238,0 s (3 min 58)**, **24 plans**,
> 6 intertitres de 2,5 s et un intertitre final « Gratuit ». Composition prévue : `BertouaFR` →
> `out/bertoua-fr.mp4` (enregistrement et rendu : agent d'intégration — `src/Root.tsx` et
> `package.json` ne sont pas touchés ici).
> Français, sans voix off, **aucun prix nulle part**. Musique existante « Dieu fait toutes choses
> nouvelles » (`public/audio/`). Rédigé et codé le 27/10/2026.
>
> Cadre : plan `cmfipraise-backend/docs/shephr/27_10_2026/05_Plan_Offres_Caleb_Nehemie.md` § 9, V1 ;
> part du storyboard `docs/storyboard-etude.md` (`src/etude/`, 2 min 47) **sans le modifier** et
> l'étend avec ce qui a été livré depuis (avenants 04 et 05 du 23/10, Étude gratuite du 27/10).
>
> Sources vérifiées : `shephr-app/CLAUDE.md` n° 15 (règles de l'étude, D-ETU-*) ; écrans réels
> `shephr-app/mobile/app/study/index.tsx` (`AssemblySection`, `BriefingSheet`, `CatchUpRow`),
> `session/[id].tsx` (`LeaderPanel` avec « Notes du dirigeant », `StopAfterSheet`, rattrapage,
> `memberActions`), `results/[id].tsx`, `progress.tsx`, `components/StudyQuestionList.tsx`
> (`studyRangeOf`, `StudyNotesText`, `StudyMemberActions`) ; libellés
> `mobile/utils/i18n/locales/fr.json` § `study.*`.

---

## 1. Ce que la vidéo doit faire comprendre

Public : dirigeants d'assemblée et membres. Une **vraie réunion du dimanche**, dans l'ordre, puis
la semaine et le dimanche suivant, et ce que chacun voit ensuite. Même assemblée que « Étude » et
« Guide » : Paris Ouest, chez Samuel (dirigeant), avec Marie, Jean, Esther, Paul (son livret),
Hélène (un cahier) et Rose (absente).

| Partie | Message |
|---|---|
| Ouverture | Le Message de Bertoua ; le dimanche, une assemblée de maison. |
| **1 · Commencer** | On lit la leçon ensemble. Le dirigeant ouvre le **programme** (unités, la suivante verrouillée par son prérequis), lit **« À lire avant la leçon »** (recommandations pour lui seul, ce que chaque membre devra faire), choisit la **question de départ**, *Commencer* ; ses **notes** restent dans le panneau. |
| **2 · Répondre** | Les questions arrivent sur chaque téléphone ; **sept sortes** de questions (vrai / faux, oui / non, choix unique, choix multiple, réponse écrite, personnelle, exercice) ; « enregistré ✓ », même sans réseau ; **sans smartphone, sur papier** (livret, cahier). |
| **3 · Corriger** | *Passer à la correction* ; le temps manque : **on s'arrête après la question 11** ; les fermées se corrigent seules ; **on échange les téléphones** (*Juste* / *À préciser* / *À revoir*) ; la question **personnelle reste masquée**. |
| **4 · Terminer** | *Terminer* : **chacun voit sa note** ; **« Cette semaine, chaque membre doit : »** ; résultats et **copies papier** (la note seule). |
| **5 · La suite** | La leçon n'est pas finie (6 / 9 questions) ; Rose **rattrape à la maison** ; le dimanche suivant, **la suite** (départ à la question 12) et les **réponses déjà données sont reprises**. |
| **6 · L'avancement** | La **progression du membre** (sa note seule) et **l'avancement de l'assemblée** (dirigeant). |
| Fin | **« Gratuit — pour toutes les assemblées. »** puis « Le Message de Bertoua, simplement. » + Shephr. |

**Ce que la vidéo ne montre pas, exprès** : le suivi au-dessus de l'assemblée (la ville, la
hiérarchie) — payant depuis le 27/10 (`ETUDE_SUIVI`, offre Néhémie ; `HIERARCHIE_SUIVI`, offre
Caleb) : la vue « Avancement des assemblées » de Daniel (P18 d'« Étude ») n'est **pas** reprise.
Aucun prix, aucun bouton « S'abonner ».

---

## 2. Principes de mise en scène

Ceux d'« Étude » (§ 2 de `storyboard-etude.md`), réutilisés tels quels : téléphone `Plateau`,
écrans redessinés à l'identique de l'app, écrans de l'étude poussés de la droite (`Pile`), alertes
iOS (`Alerte`), plusieurs téléphones avec pastilles de personne, légendes `LegendeEtude` en haut
(deux lignes, mot clé argile), pastilles de partie, salon flouté en fond, typographie française.

- **Rythme lent et lisible** (retours de JP : « trop rapide ») : gestes à la vitesse de l'app,
  tenues longues (chaque légende ≥ 2 s, la plupart 2,5 à 3 s), une légende d'explication par étape,
  intertitre de 2,5 s avant **chacune** des six parties.
- **Pastilles de personne** avec le jour quand il change : `ROSE · MERCREDI 28 OCT.`,
  `SAMUEL · DIM. 1ER NOV.`, `MARIE · LUNDI 2 NOV.`… (annotation vidéo).
- **Intertitres** (`IntertitreBertoua`, même dessin et mêmes temps que celui d'« Étude ») :

  | Partie | Pastille | Couleur | Intertitre |
  |---|---|---|---|
  | 1 | `1 · COMMENCER` | `moss` | « 1 · Commencer — On lit, puis on ouvre la leçon. » |
  | 2 | `2 · RÉPONDRE` | `sauge` | « 2 · Répondre — Sur son téléphone, ou sur papier. » |
  | 3 | `3 · CORRIGER` | `earthDeep` | « 3 · Corriger — On échange les téléphones. » |
  | 4 | `4 · TERMINER` | `clay` | « 4 · Terminer — Chacun voit sa note. » |
  | 5 | `5 · LA SUITE` | `mossSoft` | « 5 · La suite — Une leçon, plusieurs dimanches. » |
  | 6 | `6 · L'AVANCEMENT` | `mossDeep` | « 6 · L'avancement — De chacun, et de l'assemblée. » |
  | fin | — | `moss` | « Gratuit — pour toutes les assemblées. » (105 images, `CartonGratuit`) |

---

## 3. Découpage

« Repris » = plan d'« Étude » importé tel quel (ses légendes, ses gestes) ; « repris, plage 1 à 11 »
= le même plan, alimenté par le jeu `ETUDE_PLAGE1` (séance arrêtée après la question 11).

| N° | Partie | Images (début → fin) | Durée | Idée | Code |
|---|---|---|---|---|---|
| O1 | Ouverture | 0 → 150 | 5,0 s | Titre « Le Message de Bertoua », la tuile | `O1Titre` |
| O2 | Ouverture | **150** → 315 | 5,5 s | Le salon de Samuel, le dimanche — **nette montée (24,0 s), plan tampon** | `O2Salon` |
| — | intertitre 1 | 315 → 390 | 2,5 s | « 1 · Commencer » | |
| P6 | 1 | 390 → 540 | 5,0 s | On lit la leçon ensemble (repris) | `P6Lecture` |
| A1 | 1 | 540 → 870 | 11,0 s | La tuile ; le programme : UEMB002, UEMB003 verrouillée ; la leçon 1 | `A1Programme` |
| A2 | 1 | 870 → 1140 | 9,0 s | « À lire avant la leçon » : notes pour le dirigeant, actions des membres | `A2Briefing` |
| A3 | 1 | 1140 → 1470 | 11,0 s | Question de départ (toute la leçon), *Commencer* ; « Notes du dirigeant » | `A3Depart` |
| — | intertitre 2 | 1470 → 1545 | 2,5 s | « 2 · Répondre » | |
| P8 | 2 | **1545** → 1770 | 7,5 s | Les questions arrivent sur chaque téléphone (repris) — **orchestre (70,5 s)** | `P8Arrivee` |
| P9 | 2 | 1770 → 2085 | 10,5 s | Marie répond : écrite, oui / non, vrai / faux, consigne, personnelle, cases (repris) | `P9Marie` |
| B1 | 2 | 2085 → 2415 | 11,0 s | Exercice *Fait*, personnelle oui / non, choix unique ; les sept sortes | `B1Types` |
| P10 | 2 | 2415 → 2580 | 5,5 s | Jean sans réseau : « enregistré ✓ » (repris) | `P10` |
| P11 | 2 | 2580 → 2880 | 10,0 s | Tout le salon répond ; Paul son livret, Hélène un cahier (repris) | `P11Papier` |
| — | intertitre 3 | 2880 → 2955 | 2,5 s | « 3 · Corriger » | |
| C1 | 3 | 2955 → 3315 | 12,0 s | *Passer à la correction* ; s'arrêter après la question 11 ; « 28 avis restants » | `C1Arret` |
| P13 | 3 | 3315 → 3555 | 8,0 s | Les fermées se corrigent seules, Q11 2 / 4 (repris, plage 1 à 11) | `P13` |
| P14 | 3 | 3555 → 3945 | 13,0 s | On échange les téléphones ; *Juste* / *À préciser* ; personnelle masquée (repris, plage 1 à 11) | `P14` |
| — | intertitre 4 | 3945 → 4020 | 2,5 s | « 4 · Terminer » | |
| D1 | 4 | 4020 → 4320 | 10,0 s | *Terminer* ; Jean 8 / 11, Marie 8,5 / 11, Esther 10,5 / 11 | `D1Notes` |
| D2 | 4 | 4320 → 4530 | 7,0 s | « Cette semaine, chaque membre doit : » | `D2Semaine` |
| P16 | 4 | 4530 → 5025 | 16,5 s | Résultats ; copies papier de Paul (9) et d'Hélène (8) (repris, plage 1 à 11) | `P16` |
| — | intertitre 5 | 5025 → 5100 | 2,5 s | « 5 · La suite » | |
| E1 | 5 | 5100 → 5280 | 6,0 s | Le soir, Marie : leçon 1 commencée, « 6 / 9 questions », 8,5 / 13 | `E1Partiel` |
| E2 | 5 | 5280 → 5670 | 13,0 s | Rose rattrape à la maison ; *Envoyer ma copie* | `E2Rattrapage` |
| E3 | 5 | 5670 → 6000 | 11,0 s | Dimanche 1er novembre : *Continuer*, départ à la question 12, *Commencer* | `E3Suite` |
| E4 | 5 | 6000 → 6240 | 8,0 s | Marie retrouve ses réponses (12, 13, 31) ; la leçon 1 est faite | `E4Reprises` |
| — | intertitre 6 | 6240 → 6315 | 2,5 s | « 6 · L'avancement » | |
| F1 | 6 | 6315 → 6555 | 8,0 s | *Ma progression* de Marie : 1 / 5 leçons, 10,5 / 13 | `F1Progression` |
| F2 | 6 | 6555 → 6855 | 10,0 s | L'avancement de l'assemblée (Samuel) : note de chacun | `F2Assemblee` |
| — | « Gratuit » | 6855 → 6960 | 3,5 s | « Gratuit — pour toutes les assemblées. » | `CartonGratuit` |
| P19 | Fin | 6960 → 7140 | 6,0 s | « Le Message de Bertoua, simplement. » + Shephr (repris) | `P19Fin` |

Totaux : ouverture 10,5 s · commencer 38,5 s (intertitre compris) · répondre 47 s · corriger 35,5 s ·
terminer 36 s · la suite 40,5 s · avancement 20,5 s · fin 9,5 s → **7 140 images = 238,0 s**
(cible du plan : 3 à 4 min ; garde dans `Video.tsx` : 5 400 à 7 200 images).

---

## 4. Plans nouveaux (détail)

Images locales au plan. Libellés entre guillemets : ceux de l'app (`fr.json`), sauf mention.

### O1 — Titre · 150 i
Sur le fond Shephr : la tuile « Le Message de Bertoua » / « Étude de l'assemblée » (celle de
l'accueil, ×2,3, en ressort), le surtitre mono argile `ÉTUDE DE L'ASSEMBLÉE`, le titre « Le Message /
de Bertoua » (Fraunces 600, 118 px, la seconde ligne en argile), puis « Une réunion du dimanche,
pas à pas. » (annotation vidéo). Fondu de sortie sur les 12 dernières images.

### O2 — Le salon · 165 i (plan tampon)
Le salon d'« Étude » (`Salon`) se pose, chacun s'assoit, les étiquettes Samuel · dirigeant, Marie,
Jean, Esther, Paul, Hélène arrivent ; lent travelling avant. Légendes : `Le dimanche,` / `*une
assemblée de maison*.` puis `Paris Ouest, chez Samuel,` / `*le dirigeant*.` (bascule à 52 % du plan).

### A1 — La tuile, le programme, la leçon 1 · 330 i
Le téléphone de Samuel monte (raccord avec la fin de P6). Halo de la tuile (20 → 50), appui (50),
l'accueil de l'étude arrive de la droite. **Le programme** : « Commencer une séance », l'unité
« UEMB002 · Devenir et être disciple du Seigneur Jésus-Christ » « 0 / 5 leçons » (halo 100 → 166),
puis, zoom 1,18, l'unité **« UEMB003 · Délivrance de tout amour du moi »** verrouillée — cadenas,
« Verrouillée : terminez d'abord l'unité prérequise dans l'assemblée » (halo 176 → 238). Appui sur
l'unité (246), les cinq leçons se déplient, halo de « Leçon 1 · Le prix à payer », appui
« Commencer » (314).
Légendes : `Le dirigeant touche` / `*Le Message de Bertoua*.` · `Le programme se suit` / `*unité par
unité*.` · `L'unité suivante s'ouvre` / `*quand celle-ci est faite*.` · `Il ouvre l'unité et
choisit` / `*la leçon du jour*.`

### A2 — « À lire avant la leçon » · 270 i
La feuille `BriefingSheet` (écran `EcranBriefing` de « Guide ») se pose sur le programme :
« À lire avant la leçon », « Leçon 1 · Le prix à payer », « Présentation de l'unité »,
« Recommandations pour la leçon » (halo, zoom 1,16), « Aperçu — chaque membre devra : » et ses
trois actions. Légendes : `Avant de commencer :` / `*à lire avant la leçon*.` · `Les conseils du
manuel,` / `*pour le dirigeant seul*.` (D-ETU-34) · `Et ce que chaque membre` / `*devra faire*.`

### A3 — Question de départ, *Commencer*, notes du dirigeant · 330 i
La feuille défile (−150) : « Question de départ », « Cette séance : toute la leçon » (halo), « Par
défaut : le début de la leçon. Touchez une autre question pour commencer ailleurs. », les numéros
1, 5, 6, 7, 10, 11, 12, 13, 31 (le 1 choisi, D-ETU-49). Appui sur *Commencer* (150) : la séance
arrive de la droite — « Leçon 1 · questions 1 à 31 », « Réponses ouvertes », panneau « Dirigeant »,
« 0 répondant ». Appui sur « Notes du dirigeant » (236) : le bloc se déplie (présentation de
l'unité, recommandations, aperçu des actions), l'écran défile vers lui.
Légendes : `Puis` / `*la question de départ*.` · `Par défaut, *le début*` / `de la leçon.` ·
`Un geste :` / `*Commencer*.` · `Ses notes restent` / `*sous la main*.`

### B1 — Les sortes de questions · 330 i
Suite directe de P9 (téléphone de Marie, défilé sur Q11). Q12 « Exercice » : appui sur « Fait »
(44) ; Q13 « Personnelle », oui / non : « Oui » (106) ; Q31, choix unique : « d. Le Seigneur Jésus »
(184) ; « enregistrement… » puis « enregistré ✓ » après chaque appui. Retour en haut : « 10 / 10
répondues · enregistré ✓ » (halo). Le téléphone se range à gauche (0,78) et la colonne `SORTES DE
QUESTIONS` (annotation) arrive à droite, avec les libellés de l'app `study.types.*` : « Vrai ou
faux », « Oui ou non », « Choix unique », « Choix multiple », « Réponse écrite », « Personnelle »,
« Exercice ».
Légendes : `Un exercice ?` / `On coche *Fait*.` · `Une question personnelle,` / `*oui ou non*.` ·
`Un *choix unique*,` / `parmi quatre.` · `*Sept sortes* de questions,` / `toutes sur le téléphone.`

### C1 — *Passer à la correction*, s'arrêter après la question 11 · 360 i
Samuel : « 10 répondants » (halo), appui *Passer à la correction* (56). La feuille
`StopAfterSheet` : « Passer à la correction », « S'arrêter après la question : », neuf lignes
(Q1 … Q31, « dernière » cochée par défaut, halo), pied « La saisie sera verrouillée sur les
téléphones et les questions fermées corrigées. ». Appui sur **Q11** (120) : le pied devient « Les
questions après Q11 seront retirées de cette séance (ni corrigées ni notées) ; les réponses déjà
données seront reprises à la prochaine séance de la leçon. La saisie sera verrouillée et les
questions fermées corrigées. » (halo). Appui sur *Passer à la correction* (246) : « Leçon 1 ·
questions 1 à 11 », « Correction », « 28 avis restants », « 10 répondants », *Terminer*, « Notes
du dirigeant », « Vous n'avez pas répondu dans l'application : rien à corriger sur ce téléphone. ».
Légendes : `Chacun a répondu ?` / `*Passer à la correction*.` · `Le temps manque ?` / `On s'arrête
*après la question 11*.` · `Les questions suivantes` / `*attendront dimanche prochain*.` · `La
saisie se verrouille` / `*sur chaque téléphone*.`

### D1 — *Terminer*, chacun voit sa note · 300 i
Samuel : « Tous les avis sont posés. », appui *Terminer* (30), alerte « Terminer » / « Les notes
seront arrêtées. Vous pourrez encore ajuster des points depuis les résultats. », appui (60) ;
« Terminée », « Séance terminée — 10 copies ». Puis, sur le salon flouté, les trois téléphones
(gabarit de P15 d'« Étude ») : Jean **8 / 11**, Marie **8,5 / 11**, Esther **10,5 / 11** (« Ma note »).
Légendes : `Tous les avis sont posés :` / `*Terminer*.` · `Chacun voit *sa note*,` / `sur les
questions du jour.`

### D2 — « Cette semaine, chaque membre doit : » · 210 i
Téléphone de Marie, séance terminée : « Ma note » 8,5 / 11, puis la carte teintée « Cette semaine,
chaque membre doit : » et ses trois actions (halo, zoom 1,14 ; D-ETU-36).
Légendes : `Et pour la semaine,` / `*ce que chacun doit faire*.` · `Le même rappel,` / `*pour tous
les membres*.`

### E1 — Le soir, 6 / 9 questions · 180 i
`MARIE · LE SOIR` : « Ma progression », « 0 / 5 leçons », « Leçon 1 · Le prix à payer »
« 6 / 9 questions » « 8,5 / 13 » (halo ; D-ETU-42/43). Légendes : `Le soir, Marie voit` / `*où elle
en est*.` · `Leçon commencée :` / `*6 questions sur 9*.`

### E2 — Rose rattrape à la maison · 390 i
`ROSE · MERCREDI 28 OCT.` : accueil de l'étude, « À rattraper », « Vous n'étiez pas à la séance :
répondez seul aux questions, puis envoyez votre copie. », la séance du 25 octobre (questions 1 à
11), appui *Rattraper* (60). La séance « Terminée » en rattrapage : carte « Rattrapage : répondez
seul, à votre rythme. Les corrections et les réponses du manuel s'afficheront après l'envoi de
votre copie. » (halo, zoom), « 4 / 7 répondues », ses réponses, défilement jusqu'à *Envoyer ma
copie* (halo, appui 262) ; alerte « Envoyer votre copie ? » / « 4 / 7 répondues. Vous ne pourrez
plus la modifier : les questions fermées seront corrigées tout de suite, les réponses écrites
attendront l'avis du dirigeant. », appui *Envoyer ma copie* (304).
Légendes : `Rose était absente.` / `Elle *rattrape à la maison*.` · `Le manuel et les corrections`
/ `*viennent après l'envoi*.` · `Elle répond seule,` / `*à son rythme*.` · `Ses réponses écrites` /
`*attendent l'avis du dirigeant*.`

### E3 — Dimanche suivant : la suite · 330 i
`SAMUEL · DIM. 1ER NOV.` : la leçon 1 « Déjà traitées : questions 1 à 11 », « Suite : questions
12 à 31 », *Continuer* (halo, appui 64) ; la feuille : « Cette séance : questions 12 à 31 » (halo),
« Déjà traitées : questions 1 à 11 », « Par défaut : question 12, la première non encore traitée… »,
le 12 choisi ; *Commencer* (210) ; la séance « Leçon 1 · questions 12 à 31 » (halo).
Légendes : `Dimanche suivant :` / `*la suite de la leçon*.` · `Le départ est déjà` / `*la question
12*.` · `*Commencer*,` / `et l'on reprend.`

### E4 — Les réponses reprises · 240 i
`MARIE · DIM. 1ER NOV.` : « Leçon 1 · questions 12 à 31 », « 3 / 3 répondues · enregistré ✓ »,
Q12 *Fait*, Q13 *Oui*, Q31 *d* déjà cochés (D-ETU-41, halos).
Légendes : `Les réponses déjà données` / `*sont reprises*.` · `Marie n'a` / `*rien à refaire*.` ·
`On corrige, on termine :` / `*la leçon 1 est faite*.`

### F1 — Ma progression · 240 i
`MARIE · LUNDI 2 NOV.` : « Ma progression », « 1 / 5 leçons » (la barre se remplit, annotation),
« Note cumulée : 10,5 / 13 », « Leçon 1 · Le prix à payer » ✓ « 1 novembre 2026 » « 10,5 / 13 ».
Légendes : `Marie suit` / `*sa progression*.` · `Un membre ne voit` / `*que sa propre note*.`
(D-ETU-10).

### F2 — L'avancement de l'assemblée · 300 i
`SAMUEL · LUNDI 2 NOV.` : « Avancement de l'assemblée », « Paris Ouest », « 1 / 5 leçons »,
« Dernière séance le 1 novembre 2026 », « Membres » (Aline Tchoua 11 / 13 … Jean Petit 9 / 13 …
Rose Eyenga 7 / 13, Joël Mvondo « – », Samuel Fotso « – »), défilement.
Légendes : `Samuel suit` / `*l'avancement de l'assemblée*.` · `Leçon par leçon,` / `*la note de
chacun*.`

### Intertitre final — « Gratuit » · 105 i
Aplat mousse : l'icône de l'étude (`school-outline`, terre), **« Gratuit »** (Fraunces 600, 168 px),
« pour toutes / les assemblées. ». Règle D-ETU-50 (27/10) : l'étude dans son assemblée ne demande
aucun abonnement. Aucun prix.

---

## 5. Calage musical (`src/bertoua/calage.ts`)

Piste « Dieu fait toutes choses nouvelles » (451,8 s) ; enveloppe : 0–10 s très doux, 10–24 s
montée douce, **24,0 s nette montée**, **70,5 s orchestre**.

| | Fichier (s) | Vidéo (images) | Vidéo (s) |
|---|---|---|---|
| Départ (`trimBefore` = 720 − 150 = **570**) | 19,0 | 0 | 0 |
| Nette montée → début de **O2** (le salon) | 24,0 | 150 | 5,0 |
| Orchestre → début de **P8** (les questions arrivent sur chaque téléphone) | 70,5 | 1 545 | 51,5 |
| Fin | 257,0 | 7 140 | 238,0 |

**O2 est le plan tampon** : `DUREE_O2 = 1 395 − (intertitre + P6 + A1 + A2 + A3 + intertitre)` =
165 (garde : 150). Toute retouche entre O2 et P8 se reporte sur O2. `Video.tsx` vérifie les deux
rendez-vous. Fondus : entrée 12 images, sortie 75 images sur le plan de fin ; volume 0,9.

---

## 6. Données fictives (`src/bertoua/donnees.ts`)

Toutes inventées ; celles de « Guide » (`etudeGuide`), elles-mêmes construites sur « Étude ».

- **Dimanche 25 octobre 2026** — leçon 1 d'UEMB002, séance arrêtée après la question 11 (note sur
  11). Absents : Joël Mvondo, Rose Eyenga. 10 copies dans l'app ; avis à poser : 10 × 3 − 2 = 28.
  Jean **8**, Marie **8,5**, Esther **10,5** ; copies papier Paul **9** (livret), Hélène **8** (cahier).
- **Mercredi 28 octobre** — Rose rattrape (4 réponses sur 7 : Q1, Q5, Q6, 7.a).
- **Dimanche 1er novembre** — questions 12 à 31 ; Marie retrouve Q12 *Fait*, Q13 *Oui*, Q31 *d*.
- **Lundi 2 novembre** — Marie : 1 / 5 leçons, 10,5 / 13 (8,5 + 2). Avancement de Paris Ouest :
  celui de « Guide » (`avancementAssemblee`).
- **Programme** : UEMB002 « Devenir et être disciple du Seigneur Jésus-Christ » (5 leçons, livre
  « Disciple coûte que coûte ») ; **UEMB003 « Délivrance de tout amour du moi »**, verrouillée —
  nom illustratif, celui que le tableau du manuel réserve à l'UE suivante (note de
  `cmfipraise-backend/src/test/resources/study/uemb03-extrait.json`).
- **Notes du dirigeant / actions des membres** : extraits courts de « Guide » (`NOTES_DIRIGEANT`),
  adaptés du fichier d'import UEMB03.
- **Correctif** : « Guide » donne Jean 7 / 11 sur la plage 1 à 11 ; sa copie vaut 8 (1 + 1 + 1 +
  1 + 0 + 1 + 3). Cette vidéo affiche 8 (notes, résultats) ; la note cumulée 9 / 13 de « Guide »
  reste juste (8 + 1 + 0).

---

## 7. Fidélité à l'app, écarts assumés

- **Écrans redessinés pour cette vidéo** (`src/bertoua/ecrans/`) : le programme avec une unité
  verrouillée (`EcranProgramme`, copie d'`EcranAccueilDirigeant` d'« Étude » + une rangée) ; la
  séance vue par le dirigeant **avec le bloc « Notes du dirigeant »** et la ligne de plage
  (`EcranSeanceDirigeant` — l'`EcranSeance` d'« Étude » est antérieur à l'avenant 04) ; la feuille
  « S'arrêter après la question : » à hauteurs posées (`FeuilleArret`, dessin de l'`EcranArret` de
  « Guide »).
- **Ligne de plage** (« Leçon 1 · questions 1 à 11 ») : l'app l'affiche toujours (`studyRangeOf`).
  Les écrans du dirigeant et ceux de la suite (E3, E4) la montrent ; les plans repris d'« Étude »
  (P8 à P11, P13, P14, P16, D1–D2 côté membres) ne l'ont pas — écart hérité d'« Étude » et de
  « Guide ».
- **P16 repris** : le dessous (l'écran du dirigeant avant *Résultats*) est celui d'« Étude », sans
  le bloc « Notes du dirigeant » ; il ne reste à l'écran qu'une demi-seconde.
- **Salon** : l'illustration montre treize personnes assises ; le 25 octobre, douze répondants sont
  présents (dix dans l'app, Paul, Hélène) — une silhouette anonyme de plus (un visiteur).
- **Après l'envoi du rattrapage** (E2), l'app affiche la séance terminée avec « Vos réponses
  écrites attendent l'avis du dirigeant. » : la vidéo s'arrête sur l'alerte de confirmation, qui dit
  la même chose ; l'avis du dirigeant sur le rattrapage n'est pas montré.
- **Non montrés** : *Annuler la séance*, *Refaire*, l'ajustement des points, la langue d'une unité,
  la suggestion de chapitre dans le compte rendu, la séance oubliée ; et tout suivi au-dessus de
  l'assemblée (payant).
- **Numérotation Q1, Q5, Q6, Q7…** : celle de l'extrait de la leçon (`uemb002-exemple.json`), comme
  dans « Étude ».

---

## 8. Réalisation

`src/bertoua/` : `Video.tsx` (enchaînement, `VideoBertoua`, `DUREE_BERTOUA`, `PLANS_BERTOUA`),
`calage.ts`, `textes.ts` (légendes, cartons, libellés `fr.json` manquants), `donnees.ts` (jeux
`ETUDE_PLAGE1`, `ETUDE_PLAGE2`, `ETUDE_LECON`, `ETUDE_APRES`), `ecrans/` (Programme, SeanceDirigeant,
Arret), `ui/Cartons.tsx` (titre, intertitres, « Gratuit »), `plans/` (Ouverture, Commencer,
Repondre, Corriger, Terminer, Suite, Avancement). Aucun fichier d'« Étude », de « Guide », de
« Journal » ni partagé n'est modifié : tout est importé.

Enregistrement attendu (agent d'intégration) :

```tsx
import { DUREE_BERTOUA, VideoBertoua } from './bertoua/Video';
<Composition id="BertouaFR" component={VideoBertoua} durationInFrames={DUREE_BERTOUA} fps={30} width={1080} height={1920} />
// package.json : "render:bertoua": "remotion render BertouaFR out/bertoua-fr.mp4"
```

Contrôle : `npx tsc --noEmit` sans erreur ; images fixes vérifiées le 27/10 (appuis du doigt sur
les boutons touchés, légendes, halos, transitions).

## 9. Points à valider par JP

1. Nom de l'unité verrouillée (« UEMB003 · Délivrance de tout amour du moi »), illustratif.
2. La phrase de l'intertitre final : « Gratuit — pour toutes les assemblées. »
3. Les jours dans les pastilles de personne (`ROSE · MERCREDI 28 OCT.` …), annotation vidéo.

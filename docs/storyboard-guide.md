# Storyboard — « Guide » : le journal de l'assemblée et le Message de Bertoua, pas à pas (Shephr)

> Vidéo **16:9, 1920 × 1080, 30 i/s**, compositions Remotion **`GuideFR`** et **`GuideEN`** (prop
> `langue`), demande de JP du 26/10/2026 : « une vidéo longue qui explique pas à pas le journal de
> l'assemblée et le Message de Bertoua. 4 à 6 min ce n'est pas grave. Tu mettras du texte pour
> expliquer. Je pourrais choisir ou non de mettre une voix. »
> Durée : **9 978 images = 5 min 32,6 s**, identique en français et en anglais (le découpage prend,
> plan par plan, la plus longue des deux langues).
> Code : `src/guide/` ; scripts `npm run render:guide` → `out/guide-fr.mp4`, `npm run render:guide:en`
> → `out/guide-en.mp4`. Scripts de narration minutés : `docs/script-voix-guide-fr.md` / `-en.md`
> (générés par `node scripts/script-voix-guide.mjs`). Images de contrôle :
> `node scripts/stills-guide.mjs fr|en` → `out/stills/guide-fr|en/`.

---

## 1. Ce que la vidéo doit faire comprendre

Public : **tout le monde** — dirigeants d'assemblée, membres, dirigeants de ville — sans jargon
technique. On alterne le téléphone du dirigeant (Samuel) et celui d'un membre (Marie, puis Rose),
avec un regard sur la ville (Daniel). Une idée par étape ; chaque texte reste à l'écran au moins le
temps de le lire calmement.

1. **Introduction** : une assemblée de maison (Paris Ouest, le dimanche chez Samuel), les personnes,
   le sommaire en deux parties + le lien.
2. **Partie 1 — le journal de l'assemblée** (Vie d'assemblée) : Nouveau CR, date, présents, fraction
   de pain, chapitres lus, texte du CR qui s'écrit seul, enregistrer et copier pour WhatsApp, le
   journal année après année, l'avancement des livres, le journal PDF ; ce que voit un membre ; ce
   que voit la ville.
3. **Partie 2 — le Message de Bertoua** : on lit ensemble, la tuile, l'unité et la leçon, « À lire
   avant la leçon », la question de départ, Commencer ; « En cours » chez Marie, les types de
   questions, l'enregistrement hors ligne, le papier (livret, cahier) ; Passer à la correction et
   « S'arrêter après la question 11 » ; fermées corrigées seules, échange des téléphones, question
   personnelle masquée ; Terminer, la note, « Cette semaine, chaque membre doit » ; copies papier ;
   « 6 / 9 questions » ; le rattrapage de Rose ; la suite le dimanche suivant et les réponses
   reprises ; l'avancement de l'assemblée et la vue de la ville.
4. **Le lien entre les deux** : le compte rendu du jour d'une séance propose la leçon étudiée.
5. **Conclusion** : rappel des étapes, « Le Message de Bertoua, simplement. » / « Bertoua message,
   simply. », logo.

## 2. Mise en page 16:9

- **Téléphone à gauche** (repère d'écran 390 × 844 points des vidéos 9:16, posé à 1,12 pixel par
  point : texte de l'app à 13 pt → ≈ 15 px ; zooms de caméra 1,1 à 1,25 sur les détails, installés
  en douceur sur les 20 premières images du plan), **panneau de texte à droite** (x 860 → 1820) :
  partie (mono argile) · « Étape n sur N » ; pastille de la personne qui tient le téléphone
  (DIRIGEANT · SAMUEL, MEMBRE · MARIE, JEAN CORRIGE MARIE, MEMBRE · ROSE, VILLE · DANIEL, PAUL ·
  HÉLÈNE, L'ASSEMBLÉE) ; titre Fraunces 58–76 px (`*mot*` en argile) ; une phrase Inter 42 px.
- Illustrations d'« Étude » (salon, livre, livret de Paul, cahier d'Hélène) dans la zone gauche.
- Cartons plein cadre : titre, personnes, sommaire, trois intertitres (mousse, argile, sauge),
  rappels, fin.
- Enchaînement : fondu de 10 images d'un plan au suivant (le suivant, opaque, apparaît sur le
  précédent figé) ; halos argile et appuis du doigt = annotations vidéo.
- **Durées** (`src/guide/frise.ts`) : par plan, le maximum de (a) la lecture de l'écran, 1 s pour
  12 caractères + 1,2 s, 3,5 s au moins ; (b) la voix, mots / 2,5 + 1 s ; (c) un plancher quand
  l'animation le demande ; arrondi au quart de seconde ; le plus long des deux langues.

## 3. Découpage (timecodes de la version française ; l'anglaise a les mêmes)

| Plan | Début → fin | Durée | Qui | À l'écran (titre — phrase) | Image |
|---|---|---|---|---|---|
| i1 | 0:00.0 → 0:08.3 | 8,3 s | — | Le journal de l’assemblée et le Message de Bertoua — Pas à pas, dans l’app Shephr | Carton titre : tuile Shephr, titre en deux lignes |
| i2 | 0:08.3 → 0:14.8 | 6,5 s | L’ASSEMBLÉE | Une assemblée de maison — Paris Ouest, le dimanche, chez Samuel. | Salon de Samuel (illustration d’« Étude », recadrée), étiquettes des personnes |
| i3 | 0:14.8 → 0:21.8 | 7,0 s | — | Les personnes — Un dirigeant, des membres, la ville. | Huit médaillons : Samuel, Marie, Jean, Esther, Paul, Hélène, Rose, Daniel |
| i4 | 0:21.8 → 0:30.0 | 8,3 s | — | Au programme — Le journal de l’assemblée / Le Message de Bertoua / Le lien entre les deux | Sommaire : 1 · 2 · + |
| t1 | 0:30.0 → 0:36.0 | 6,0 s | — | Le journal de l’assemblée — Une réunion, un compte rendu. | Intertitre mousse |
| j1 | 0:36.0 → 0:42.8 | 6,8 s | DIRIGEANT · SAMUEL | Nouveau CR — Onglet Assemblée. Seul le dirigeant rédige. | Vie d’assemblée (Samuel) : appui sur l’onglet Assemblée, puis « Nouveau CR » |
| j2 | 0:42.8 → 0:48.8 | 6,0 s | DIRIGEANT · SAMUEL | La date — Celle du jour. Jamais une date future. | Formulaire : carte « Date de la réunion » (zoom) |
| j3 | 0:48.8 → 0:54.8 | 6,0 s | DIRIGEANT · SAMUEL | Les présents — Tout cocher, puis décocher les absents. | « Tout cocher », puis Joël et Rose décochés |
| j4 | 0:54.8 → 1:00.3 | 5,5 s | DIRIGEANT · SAMUEL | La fraction de pain — Oui ou non : un interrupteur. | Interrupteur « Fraction de pain » (zoom) |
| j5 | 1:00.3 → 1:07.3 | 7,0 s | DIRIGEANT · SAMUEL | Les chapitres lus — Le livre, puis les chapitres. Un point : déjà lu. | Lecture : livre choisi, chapitres 13 et 14, points « déjà lu » |
| j6 | 1:07.3 → 1:13.3 | 6,0 s | DIRIGEANT · SAMUEL | Le texte s’écrit seul — L’aperçu suit chaque choix. | Aperçu du CR, lignes fraction de pain + lecture éclairées |
| j7 | 1:13.3 → 1:20.1 | 6,8 s | DIRIGEANT · SAMUEL | Enregistrer, copier — Prêt à coller dans WhatsApp. | « Enregistrer le CR », puis le CR enregistré : « Copier » → « Compte rendu copié… » |
| j8 | 1:20.1 → 1:25.6 | 5,5 s | DIRIGEANT · SAMUEL | Le journal — Toutes les réunions, année après année. | Liste 2026 : la réunion du 18 octobre entre en tête |
| j9 | 1:25.6 → 1:31.1 | 5,5 s | DIRIGEANT · SAMUEL | L’avancement — Livre par livre : les chapitres lus. | Segment « Avancement » : barres des livres |
| j10 | 1:31.1 → 1:37.6 | 6,5 s | DIRIGEANT · SAMUEL | Le journal en PDF — Un mois, un trimestre ou l’année, à imprimer. | Écran « Journal de l’assemblée » : Mois, Octobre 2026, « Générer le PDF » |
| j11 | 1:37.6 → 1:44.6 | 7,0 s | MEMBRE · MARIE | Ce que voit un membre — Les comptes rendus, en lecture seule. | Vue de Marie : « en lecture seule », pastilles Présent / Absent |
| j12 | 1:44.6 → 1:50.3 | 5,8 s | MEMBRE · MARIE | Mon avancement — Les chapitres lus quand elle était là. | Vue de Marie, Avancement : « Mon avancement » puis « Avancement de l’assemblée » |
| j13 | 1:50.3 → 1:57.8 | 7,5 s | VILLE · DANIEL | Ce que voit la ville — Les chiffres, et une alerte sans CR. | Hiérarchie de Daniel : six cases, alerte « Sans compte rendu depuis 3 semaines » (Paris Sud) |
| t2 | 1:57.8 → 2:03.1 | 5,3 s | — | Le Message de Bertoua — Lire, répondre, corriger. | Intertitre argile |
| e1 | 2:03.1 → 2:09.9 | 6,8 s | L’ASSEMBLÉE | On lit ensemble — Préface et chapitre 1. | Livre ouvert (préface, chapitre 1), deux livrets |
| e2 | 2:09.9 → 2:15.9 | 6,0 s | DIRIGEANT · SAMUEL | La tuile Le Message de Bertoua — Sur l’accueil de l’app. | Accueil de Samuel (25 octobre) : tuile « Le Message de Bertoua » |
| e3 | 2:15.9 → 2:20.9 | 5,0 s | DIRIGEANT · SAMUEL | L’unité, la leçon — Leçon 1 : Le prix à payer. | Accueil de l’étude : unité dépliée, leçon 1 « Commencer » |
| e4 | 2:20.9 → 2:27.1 | 6,3 s | DIRIGEANT · SAMUEL | À lire avant la leçon — Les conseils du manuel, pour lui seul. | Feuille « À lire avant la leçon » : présentation de l’unité, recommandations, aperçu des actions |
| e5 | 2:27.1 → 2:33.4 | 6,3 s | DIRIGEANT · SAMUEL | La question de départ — Ici : toute la leçon. | Même feuille, défilée : « Question de départ », « Cette séance : toute la leçon », numéros |
| e6 | 2:33.4 → 2:37.4 | 4,0 s | DIRIGEANT · SAMUEL | Commencer — La séance est ouverte. | Séance ouverte, panneau du dirigeant « 0 répondant » |
| e7 | 2:37.4 → 2:43.7 | 6,3 s | MEMBRE · MARIE | « En cours » — Marie touche Répondre. | Accueil de Marie : pastille « En cours », puis carte « Répondre » |
| e8 | 2:43.7 → 2:51.7 | 8,0 s | MEMBRE · MARIE | Toutes sortes de questions — Vrai ou faux, cases, réponses écrites. | Séance de Marie défilée : oui/non, vrai/faux, écrite, personnelle, cases, exercice |
| e9 | 2:51.7 → 2:57.9 | 6,3 s | MEMBRE · MARIE | Enregistré, même hors ligne — Sans réseau, rien n’est perdu. | Compteur « enregistré ✓ », puis bandeau « Hors ligne — … » |
| e10 | 2:57.9 → 3:03.9 | 6,0 s | PAUL · HÉLÈNE | Sans smartphone : papier — Un livret, ou un cahier. | Livret de Paul et cahier d’Hélène qui s’écrivent |
| e11 | 3:03.9 → 3:09.2 | 5,3 s | DIRIGEANT · SAMUEL | Passer à la correction — Quand chacun a répondu. | Panneau du dirigeant : « 10 répondants », appui « Passer à la correction » |
| e12 | 3:09.2 → 3:16.7 | 7,5 s | DIRIGEANT · SAMUEL | S’arrêter après la question… — Le temps manque ? La suite, dimanche prochain. | Feuille « S’arrêter après la question : », Q31 « dernière » puis Q11, texte de coupe |
| e13 | 3:16.7 → 3:23.0 | 6,3 s | MEMBRE · MARIE | Les fermées se corrigent seules — Et la saisie se verrouille. | Copie de Marie en correction : Q11 « faux » / « bonne réponse », 2 / 4 |
| e14 | 3:23.0 → 3:32.0 | 9,0 s | JEAN CORRIGE MARIE | On échange les téléphones — Juste, À préciser ou À revoir. | Q1 : « Réponse donnée » / « Réponse du manuel », appui « Juste » |
| e15 | 3:32.0 → 3:39.0 | 7,0 s | JEAN CORRIGE MARIE | La question personnelle reste cachée — Jean voit seulement « répondu ». | Q10 : « Question personnelle — répondu ✓ » |
| e16 | 3:39.0 → 3:43.2 | 4,3 s | DIRIGEANT · SAMUEL | Terminer — Les notes sont arrêtées. | Panneau : « Tous les avis sont posés. », appui « Terminer » |
| e17 | 3:43.2 → 3:50.2 | 7,0 s | MEMBRE · MARIE | Chacun voit sa note — 8,5 sur 11, pour cette séance. | « Ma note » 8,5 / 11 (zoom) |
| e18 | 3:50.2 → 3:55.5 | 5,3 s | MEMBRE · MARIE | Cette semaine… — Ce que chaque membre doit faire. | Carte « Cette semaine, chaque membre doit : » |
| e19 | 3:55.5 → 4:03.5 | 8,0 s | DIRIGEANT · SAMUEL | Les copies papier — Samuel saisit la note de Paul et d’Hélène. | Modale « Ajouter une copie papier » (Paul, 9), puis résultats avec Paul et Hélène « papier » |
| e20 | 4:03.5 → 4:10.3 | 6,8 s | MEMBRE · MARIE | Ma progression — 6 / 9 questions. Sa note, à elle seule. | « Ma progression » : leçon 1 « 6 / 9 questions », 8,5 / 13 |
| e21 | 4:10.3 → 4:17.0 | 6,8 s | MEMBRE · ROSE | Absente ? On rattrape — Rose répond seule, à la maison. | Accueil de l’étude de Rose : « À rattraper », leçon 1, « Rattraper » |
| e22 | 4:17.0 → 4:23.3 | 6,3 s | MEMBRE · ROSE | Envoyer ma copie — Les corrections viennent après l’envoi. | Séance en rattrapage défilée jusqu’à « Envoyer ma copie » |
| e23 | 4:23.3 → 4:29.3 | 6,0 s | MEMBRE · ROSE | Jusqu’à une autre leçon — Ensuite, le rattrapage se ferme. | Haut de la séance en rattrapage : carte « Rattrapage : … » |
| e24 | 4:29.3 → 4:36.3 | 7,0 s | DIRIGEANT · SAMUEL | Dimanche suivant : la suite — Questions 12 à 31. | Accueil de Samuel (1er novembre) : « Déjà traitées : questions 1 à 11 », « Suite : questions 12 à 31 », « Continuer » ; puis la feuille « Cette séance : questions 12 à 31 » |
| e25 | 4:36.3 → 4:42.8 | 6,5 s | MEMBRE · MARIE | Réponses déjà données — Marie les retrouve : rien à refaire. | Séance de Marie « Leçon 1 · questions 12 à 31 », « 3 / 3 répondues » |
| e26 | 4:42.8 → 4:49.1 | 6,3 s | DIRIGEANT · SAMUEL | L’avancement de l’assemblée — Leçons faites, note de chacun. | « Avancement de l’assemblée » : 1 / 5 leçons, notes sur 13 |
| e27 | 4:49.1 → 4:55.8 | 6,8 s | VILLE · DANIEL | La ville voit l’ensemble — Jamais le contenu des copies. | « Avancement des assemblées » de Daniel : Paris Est, Ouest, Sud |
| t3 | 4:55.8 → 5:01.6 | 5,8 s | — | Le lien entre les deux — Quand l’assemblée a les deux. | Intertitre sauge |
| l1 | 5:01.6 → 5:09.6 | 8,0 s | DIRIGEANT · SAMUEL | Le CR propose la leçon — Un jour d’étude, elle est pré-cochée. | Nouveau CR du 25 octobre : livre « Disciple coûte que coûte », chapitre 1 pré-coché, indice éclairé, puis l’aperçu |
| c1 | 5:09.6 → 5:18.6 | 9,0 s | — | En résumé : le journal — Nouveau CR / Présents, pain, chapitres / Enregistrer, copier / Journal PDF | Rappel du journal (4 étapes) |
| c2 | 5:18.6 → 5:26.6 | 8,0 s | — | En résumé : l’étude — Commencer / Lire, répondre / Corriger ensemble / Terminer / Rattraper | Rappel de l’étude (5 étapes) |
| c3 | 5:26.6 → 5:32.6 | 6,0 s | — | Le Message de Bertoua, simplement. —  | « Le Message de Bertoua, simplement. », tuile, logo, logotype |

Parties : introduction 0:00.0 → 0:30.0 · partie 1 0:30.0 → 1:57.8 · partie 2 1:57.8 → 4:55.8 ·
lien 4:55.8 → 5:09.6 · conclusion 5:09.6 → 5:32.6.

## 4. Données fictives (`src/guide/donnees.ts`)

Toutes inventées ; l'assemblée et les personnes sont celles de la vidéo « Étude » (FR : Paris
Ouest, Samuel Fotso, Marie Kamga, Jean Petit, Esther Mbida, Paul Nana, Hélène Mballa, Rose Eyenga,
Joël Mvondo ; Daniel Mercier, ville de Paris — EN : Leeds West, Samuel Fisher, Mary Kent, John Price,
Esther Morris, Paul Newton, Helen Marshall, Rose Ellis, Joseph Moore ; Daniel Morgan, Leeds), les
livres et la Hiérarchie de Daniel celles de « Journal » (Paris Ouest y remplace Paris Nord).

- **Dimanche 18 octobre 2026** (partie 1) : 15 personnes rattachées, 13 présents (Joël et Rose
  absents), fraction de pain, « L'église de maison dans les desseins éternels de Dieu » chapitres 13
  et 14 (12 déjà lus). Réunions précédentes : 11 et 4 octobre, 27, 20, 13 et 6 septembre. Marie
  absente le 20 septembre ; 46 réunions suivies. Hiérarchie d'octobre : 5 réunions, 2 / 3
  assemblées actives, 10,8 de présence moyenne, 23 personnes distinctes, 4 fractions de pain, Paris
  Sud en alerte.
- **Dimanche 25 octobre** : leçon 1 d'UEMB002 « Le prix à payer » (questions de
  `uemb002-exemple.json`, celles de « Étude » ; EN « The Cost »), 9 questions de premier niveau
  (1, 5, 6, 7, 10, 11, 12, 13, 31). Séance arrêtée **après Q11** : note sur 11. Marie 8,5 / 11 (Q1
  Juste, 7.a Juste, 7.b À préciser, Q11 b c f a = 2 / 4). 10 copies dans l'app (Joël et Rose
  absents ; Samuel pilote sans copie), puis Paul 9 et Hélène 8 sur papier → 12 copies.
- **Mercredi 28 octobre** : Rose rattrape la plage 1 à 11 (4 / 7 répondues à l'image).
- **Dimanche 1er novembre** : la suite, questions 12 à 31 ; Marie y retrouve Q12, Q13 et Q31 (déjà
  répondues le 25) → 3 / 3. Leçon 1 faite pour l'assemblée ; Marie 10,5 / 13 (8,5 + 2).
- **Lundi 2 novembre** : avancement de Paris Ouest 1 / 5 leçons, « Dernière séance le 1 novembre
  2026 », notes sur 13 (Joël « – » : il n'a couvert que 12 à 31) ; vue de Daniel : Paris Est 1 / 5,
  Paris Ouest 1 / 5, Paris Sud 0 / 5.
- **Recommandations au dirigeant et actions des membres** (avenant 04) : extraits courts adaptés du
  fichier d'import d'UEMB03 (`~/Downloads/UEMB03.json`, leçon « Le prix à payer pour être
  disciple ») — compétence de l'unité, objectif et N.B. de la leçon, trois des cinq actions ; EN
  traduit. **À valider par JP** (§ 9).

## 5. Sources vérifiées

Libellés de l'app : `shephr-app/mobile/utils/i18n/locales/fr.json` et `en.json` (`assemblyLife.*`,
`study.*`, `tabs.*`), copiés à la lettre (clé en commentaire dans `src/guide/textes.ts` et dans les
`textes.ts` de « Journal » et « Étude »).

| Affirmation | Source |
|---|---|
| Seul le dirigeant de l'assemblée rédige le CR (« Nouveau CR ») | D-ASM-03 ; `app/(tabs)/assembly/index.tsx` (`canWrite`) |
| Date du jour préremplie, date future refusée | `form.tsx` (`new Date()`), `assemblyLife.form.pickDateHint` |
| Présents : tout cocher / décocher ; fraction de pain oui / non | `form.tsx` ; `assemblyLife.form.*` |
| Livre puis chapitres ; un point = chapitre déjà lu | `form.tsx` (`readIds`), `assemblyLife.form.alreadyReadHint` |
| Texte du CR généré en direct, avec ou sans les présents ; Copier / Partager → WhatsApp | `components/MeetingReportCard.tsx`, `utils/meetingReport.ts`, `assemblyLife.reportUi.*` |
| Réunions par année (flèches) ; avancement par livre | `index.tsx` (`MeetingsView`, `UnitProgressView`) |
| Journal PDF : mois, trimestre, semestre, année | `assembly/journal.tsx`, `assemblyLife.journal.*` |
| Membre : CR en lecture seule, Présent / Absent, « Mon avancement », pas de Journal PDF ; onglet ouvert au membre rattaché | D-ASM-17 ; `index.tsx` (`isMember`, `MyProgressView`), `(tabs)/_layout.tsx` |
| Ville : statistiques de la Hiérarchie, alerte après 3 semaines sans CR | D-ASM-18 ; storyboard « Journal » § 7.5 |
| Tuile « Le Message de Bertoua » pour tout compte rattaché (module STUDY) | D-ETU-28 ; `home.tsx`, `app/study/index.tsx` |
| On lit la portion avant de commencer | présentation au pasteur (déroulé), storyboard « Étude » P6 |
| « À lire avant la leçon » : unité (1re séance de l'unité), leçon, aperçu des actions ; dirigeant seulement | D-ETU-33..35, avenant 04 ; `study/index.tsx` (`BriefingSheet`) |
| Aperçu « toute la leçon » / « questions 12 à 31 », choix de la question de départ dès la 1re séance | D-ETU-49, avenant 05 § 8 ; `BriefingSheet` |
| Commencer → séance ouverte ; tuile « En cours » chez les répondants | D-ETU-07 ; `study/index.tsx`, `home.tsx` |
| Types de questions ; question personnelle | contrat § 2.3 ; `StudyQuestionList.tsx` |
| Chaque réponse enregistrée ; hors ligne, envoi au retour du réseau | D-ETU-11 ; `services/studyDraft.ts`, `study.session.offlinePending` |
| Livret ou cahier, copie papier saisie par le dirigeant (note seule), après la correction | D-ETU-13, D-ETU-48 ; `results/[id].tsx`, `study.results.addPaperHint` |
| « S'arrêter après la question N » ; questions suivantes retirées, réponses reprises plus tard | D-ETU-40/41 ; `session/[id].tsx` (`StopAfterSheet`), `study.leader.stopAfterCut` |
| Saisie verrouillée, fermées corrigées automatiquement | RG-ETU-03/05/06 ; `study.leader.toCorrectionConfirm` |
| Échange des téléphones : Juste / À préciser / À revoir ; personnelle masquée | RG-ETU-07/08 ; `study.session.correctionHint`, `study.question.personalAnswered` |
| Terminer : notes arrêtées ; « Ma note » sur les points de la plage | D-ETU-40 (`maxScore` de la plage) ; `study.leader.finishConfirm` |
| « Cette semaine, chaque membre doit : » montré à tous à la fin | D-ETU-36 ; `session/[id].tsx` |
| « n / N questions », un membre ne voit que sa note | D-ETU-42/43, D-ETU-10 ; `progress.tsx` |
| Rattrapage : « À rattraper », réponses du manuel après « Envoyer ma copie », avis du dirigeant, fenêtre fermée par une autre leçon | D-ETU-44/45, D-ETU-47 ; `study/index.tsx` (`CatchUpRow`), `session/[id].tsx` |
| La séance suivante reprend à la première question non traitée ; réponses déjà données reprises | D-ETU-39, D-ETU-41 ; `study.home.covered`, `nextRange`, `continue` |
| Dirigeant : avancement et notes de chaque membre ; ville : vue d'ensemble, jamais le contenu des copies | D-ETU-08/09, RG-ETU-13 ; `progress.tsx`, `Overview` |
| Le CR du jour d'une séance pré-coche la leçon (ministère avec les deux modules, création seulement, rien coché) | D-ETU-30 ; `form.tsx`, `assemblyLife.form.studySuggestionHint` |

## 6. Réalisation et écarts

- **Réutilisé** : thème, `Telephone`, briques d'app (`Ecran`, `Carte`, `Bouton`, `Halo`,
  `BarreOnglets`…), écrans de « Journal » (Vie d'assemblée, formulaire, compte rendu, Journal PDF,
  Hiérarchie) et d'« Étude » (accueil, accueil de l'étude, séance, liste des questions, résultats,
  modale papier, vue d'ensemble), illustrations (salon, livre, livrets, livret de Paul, cahier),
  `TuileLogo`, `Logotype`. Les écrans lisent leurs contextes, alimentés par `src/guide/langue.tsx`
  avec l'assemblée de la vidéo.
- **Nouveaux écrans** (`src/guide/ecrans/`), d'après le code livré : feuille « À lire avant la
  leçon » et question de départ, « S'arrêter après la question », accueil de l'étude avec la suite
  d'une leçon, accueil de Rose (« À rattraper »), séance en rattrapage, « Ma progression » d'une
  leçon en cours, avancement de l'assemblée au 2 novembre, vue du membre de la Vie d'assemblée,
  carte « Lecture » avec le chapitre pré-coché.
- **Retouches partagées, sans effet sur les autres vidéos** (props facultatives, exports) :
  `src/journal/langue.tsx` et `src/etude/langue.tsx` exportent `FournisseurJournal` /
  `FournisseurEtude` ; `EcranSeance` accepte `plage` (ligne « Leçon 1 · questions 1 à 11 ») et
  `apresNote` ; `EcranResultats` accepte `plage`. Contrôle : images d'`EtudeFR` inchangées.
- **Écarts assumés** : la date de l'accueil et les écrans sont statiques (pas de navigation animée
  complète) ; la vue du membre ne montre pas « Mes réunions dans d'autres assemblées » (sans objet) ;
  la feuille « À lire avant la leçon » de la 2e séance montre encore la présentation de l'unité (la
  leçon 1 n'est pas « faite » le 1er novembre au matin : règle D-ETU-35) ; le chapitre pré-coché du
  CR est montré sur un CR du 25 octobre (le jour de la séance), alors que la partie 1 saisit celui du
  18 ; dans « Ma progression », la note en cours d'une leçon partielle est affichée sur le maximum
  de la leçon (8,5 / 13), comme `progress.tsx` (`bestScore` / `maxScore`).

## 7. Musique et voix

- Musique : « Dieu fait toutes choses nouvelles » (`public/audio/`, 451,8 s, plus longue que la
  vidéo), du début du fichier, fondu d'entrée 12 images, fondu de sortie 2,5 s. Volume 0,9.
- Props : `voix` (chemin d'un fichier de `public/`, joué dès l'image 0) — la musique passe alors à
  **0,18** (≈ −14 dB, « ducking ») ; `musique: false` la coupe.
- Exemple : `npx remotion render GuideFR out/guide-fr-voix.mp4 --props='{"voix":"audio/voix-guide-fr.mp3"}'`.
- Script de narration : une ligne par plan (timecodes, texte à l'écran, texte à dire, mots /
  place à 2,5 mots/s). L'écran donne les mots-clés, la voix les dit avec d'autres mots.

## 7 bis. Vérifications (26/10)

- `npx tsc --noEmit` : propre.
- `out/guide-fr.mp4` et `out/guide-en.mp4` : 1920 × 1080, 332,65 s (ffprobe), vidéo + audio.
- Une image par plan extraite des MP4 (`out/stills/guide-fr/`, `out/stills/guide-en/`, à 70 % du
  plan) et regardée : aucun texte coupé, aucun mot français dans la version anglaise (une ligne
  « Leçon 1 · questions 12 to 31 » trouvée en e25 et corrigée), téléphones lisibles.
- Audio, sur 10 s (images 300 → 599) : musique seule −29,4 dBFS RMS ; `{"musique":false}` → aucune
  piste audio ; voix factice silencieuse → musique à −43,3 dBFS (−13,9 dB) ; voix factice (bip) →
  la voix passe sur la musique baissée. Fichiers de test supprimés.
- Images d'`EtudeFR` inchangées après les retouches partagées (contrôle visuel).

## 8. Version anglaise (`GuideEN`)

Même découpage, mêmes durées, mêmes données chiffrées. Textes adaptés (pas du mot à mot), libellés
de `en.json` (« Assembly life », « New report », « Save report », « PDF journal », « Bertoua
message », « Read before the lesson », « Starting question », « Move to correction », « Stop after
question: », « Right / Needs detail / Review », « This week, each member must: », « To catch up »,
« Send my paper », « n / N questions »…), personnes et assemblée de `EtudeEN` (Leeds West), livres
et Hiérarchie de `JournalEN` (Leeds West y remplace Leeds North). Fin : « Bertoua message, simply. ».
Comme dans « Journal » et « Étude », la date de l'accueil est montrée traduite (l'app anglaise
afficherait « Octobre 25, 2026 », `monthLabel` non traduit).

## 9. Points à valider par JP

1. La durée (5 min 33) et le rythme ; l'ordre « on lit, puis Commencer ».
2. Les formulations du panneau et des voix (FR et EN), en particulier « Seul le dirigeant rédige »,
   « Un membre ne voit que sa propre note », « jamais le contenu des copies ».
3. Les extraits de recommandations et d'actions tirés d'UEMB03 et leur traduction anglaise ; le code
   UEMB002 gardé pour la leçon d'exemple (comme la vidéo « Étude »).
4. Le scénario de la séance arrêtée après Q11, la note 8,5 / 11 puis 10,5 / 13 ; l'affichage
   « 8,5 / 13 » d'une leçon en cours dans « Ma progression ».
5. Les données fictives : Joël et Rose absents, Rose en rattrapage, chiffres de la Hiérarchie.
6. La voix : enregistrée par JP d'après `docs/script-voix-guide-*.md`, un fichier calé sur 0:00.

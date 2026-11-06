# CMFIPraise — motion « Catégories de chants »

Vidéo 9:16 (1080 × 1920, 30 i/s) codée avec [Remotion](https://www.remotion.dev).
Storyboard : brief monteur « Motion « Catégories de chants » » (Claude Docs).

- `npm run studio` : aperçu interactif dans le navigateur, image par image.
- `npm run render:fr` / `npm run render:en` : rendu MP4 dans `out/`.

Les textes des deux langues sont dans `src/textes.ts`, les couleurs et polices (reprises de
l'app) dans `src/theme.ts`. Les écrans de l'app sont redessinés en code (`src/ui/`).

État : les 9 plans (45 s), sans musique. Contenu réel extrait de l'API le 13/10/2026 (`data/`) ; la liste anglaise des catégories et ses chants sont une maquette (voir `src/donnees.ts`).

## Vidéo « Évènements » (Shephr)

Vidéo 9:16 (1080 × 1920, 30 i/s, 3 703 images = 123,4 s), en français : comment fonctionne le
module Évènements de Shephr pour un membre, un dirigeant, par la hiérarchie et par la géographie.
Rythme revu le 14/10 (retour JP : « trop rapide », viser ≈ 2 min ; montrer que l'on programme depuis
l'onglet Évènements de la barre du bas) : gestes à vitesse inchangée, poses allongées, intertitres de
2,5 s.
Storyboard : `docs/storyboard-evenements.md`.

- `npm run render:evenements` : rendu MP4 dans `out/evenements-fr.mp4` (composition `EvenementsFR`).
- Tout est dans `src/evenements/` : `theme.ts` (palette et polices de l'app Shephr), `textes.ts`
  (légendes et libellés copiés de `shephr-app/mobile/utils/i18n/locales/fr.json`), `donnees.ts`
  (données fictives), `ecrans/` (écrans de l'app redessinés), `plans/` (un fichier par chapitre),
  `Video.tsx` (enchaînement ; la durée totale se calcule depuis les `DUREE_P*` des plans).
- Musique : « Dieu fait toutes choses nouvelles » (`public/audio/`, `PISTE_AUDIO` en tête de
  `src/evenements/Video.tsx`). Le calage sur l'entrée de l'orchestre (70,5 s du fichier) est calculé
  depuis le découpage : aujourd'hui sur l'intertitre « Le dirigeant » (règle détaillée dans le
  commentaire de `CALAGE_AUDIO` et au § 7 du storyboard) ; fondu de sortie de 2,5 s sur le plan de
  fin.

## Vidéo « Journal de l'assemblée » (Shephr)

Vidéo 9:16 (1080 × 1920, 30 i/s, 2 700 images = 90 s), en français et en anglais : le problème du cahier papier
(perdu, parti avec l'ancien dirigeant, dix ans de cahiers en pile, rien de visible pour la ville),
puis le journal tenu dans l'app — saisir un compte rendu, le conserver d'année en année, l'imprimer
en PDF, le suivre depuis la Hiérarchie.
Storyboard : `docs/storyboard-journal.md`.

- `npm run render:journal` : rendu MP4 dans `out/journal-fr.mp4` (composition `JournalFR`).
- `npm run render:journal:en` : la même vidéo en anglais, dans `out/journal-en.mp4` (composition
  `JournalEN`, demande de JP du 14/10) — même découpage, même musique, mêmes calages ; légendes
  adaptées, libellés de `en.json`, données fictives anglaises (Leeds North) aux mêmes chiffres.
  Storyboard § 10.
- Tout est dans `src/journal/` : `textes.ts` (légendes et libellés de `fr.json` / `en.json`, par
  langue), `donnees.ts` (données fictives des deux langues, construites à partir des mêmes faits),
  `langue.tsx` (prop `langue` de la composition → `useJournal()` dans les plans et écrans),
  `ecrans/` (écrans de l'app redessinés), `ui/` (illustrations du cahier, pages des PDF, briques de
  la Vie d'assemblée), `plans/` (une partie par fichier), `calage.ts` (calage musical), `Video.tsx`
  (enchaînement). Réutilise le thème, les briques d'app et l'habillage d'« Évènements » ; seule
  retouche, sans effet sur « Évènements » : `BarreOnglets` accepte des `libelles` facultatifs
  (onglets en anglais).
- Musique : la même piste qu'« Évènements ». La bascule « problème → l'app » tombe sur la montée de
  24,0 s du chant, le PDF qui jaillit sur l'entrée de l'orchestre (70,5 s) : la vidéo part à 4,5 s du
  fichier et la durée de P13 est calculée pour tenir le second rendez-vous (`calage.ts`).

## Vidéo « Documents » (Shephr)

Vidéo 9:16 (1080 × 1920, 30 i/s, 2 880 images = 96 s), en français : le problème des PDF qui
circulent dans les conversations de groupe (perdus dans le fil, plusieurs versions, un document d'un
pays envoyé à tout le monde), puis l'espace Documents de l'app — un document pour tout le ministère
ou pour un pays (chacun voit le sien), des dossiers et la lecture hors ligne, un même lien toujours à
jour, un lien à partager qui fait venir dans l'app.
Storyboard : `docs/storyboard-documents.md` (validé par JP le 20/10/2026).

- `npm run render:documents` : rendu MP4 dans `out/documents-fr.mp4` (composition `DocumentsFR`).
- Tout est dans `src/documents/` : `textes.ts` (légendes et libellés copiés de `fr.json`),
  `donnees.ts` (documents fictifs, ce que voit chacun), `ecrans/` (accueil, espace Documents,
  lecteur et mur de l'aperçu, conversations), `ui/` (planisphère en SVG tracé à la main, conversation
  stylisée sans marque, couvertures et pages de PDF dessinées), `plans/` (une partie par fichier),
  `calage.ts` (calage musical), `Video.tsx` (enchaînement). Réutilise le thème, les briques d'app et
  l'habillage d'« Évènements » et la légende / les pastilles de « Journal ». Retouches partagées,
  sans effet sur les autres vidéos (props facultatives) : `Halo` accepte une `teinte`, `Bouton` une
  `iconeDroite` ; la `Tuile` de l'accueil d'« Évènements » est exportée ; `src/ui/Drapeaux.tsx`
  gagne le Cameroun et la Côte d'Ivoire.
- Musique : la même piste que « Journal », départ à 4,5 s du fichier : la bascule P4 tombe sur la
  montée de 24,0 s ; l'entrée de l'orchestre (70,5 s) tombe sur le passage v1 → v2 de P8 (image
  calculée dans `calage.ts`) ; fondu de sortie de 2,5 s sur le plan de fin.

## Vidéo « Étude de l'assemblée » (Shephr)

Vidéo 9:16 (1080 × 1920, 30 i/s, 5 010 images = 167 s), en français et en anglais : une assemblée de maison (Paris
Ouest, un dimanche en journée dans le salon de Samuel), le problème des cahiers (échangés et
corrigés à la main, notes perdues sur une feuille volante, rien de visible pour le dirigeant ni pour
la ville), puis l'étude dans l'app, programme « Le Message de Bertoua » — lire la leçon ensemble et
*Commencer*, répondre sur chaque téléphone (même sans réseau), et sans application dans son livret
(Paul) ou dans un cahier (Hélène), *Passer à la correction* et échanger les téléphones (*Juste* /
*À préciser* / *À revoir*, la question personnelle masquée), *Terminer* et voir sa note, les deux
copies papier saisies par le dirigeant (la note seule), la progression dimanche après dimanche et
l'avancement vu par la ville, jamais les réponses personnelles. Fin : « Le Message de Bertoua,
simplement. ». On suit les mêmes personnes tout au long : Samuel, Marie, Jean, Esther, Paul, Hélène,
puis Daniel (le dirigeant de la ville de « Journal »).
Rythme revu le 21/10 (retour JP : « plus lent, pour bien expliquer », 112 s → 167 s, modèle
d'« Évènements ») : gestes à vitesse inchangée, poses allongées (`Ralenti` de
`src/etude/plans/commun.tsx`), légendes d'explication ajoutées, intertitres de 2,5 s avant les
parties 2 à 5 ; réunion le dimanche, en journée.
Storyboard : `docs/storyboard-etude.md` (révision : § 8.2).

- `npm run render:etude` : rendu MP4 dans `out/etude-fr.mp4` (composition `EtudeFR`, prop
  `langue: 'fr'`).
- `npm run render:etude:en` : la même vidéo en anglais, dans `out/etude-en.mp4` (composition
  `EtudeEN`, prop `langue: 'en'`, demande de JP du 21/10) — même découpage, même durée, même musique,
  mêmes calages ; légendes adaptées, libellés de `en.json` (tuile « Bertoua message »), assemblée
  anglophone fictive Leeds West (Samuel Fisher, Mary, John, Esther, Paul, Helen ; Daniel Morgan, le
  dirigeant de ville de `JournalEN`) aux mêmes chiffres, leçon 1 traduite (« The Cost ») ; fin
  « Bertoua message, simply. ». Storyboard § 10.
- Tout est dans `src/etude/`, structuré comme `src/journal/` :
  `textes.ts` (`TEXTES_ETUDE` par langue — légendes, cartons, intertitres et libellés `study.*`
  copiés de `shephr-app/mobile/utils/i18n/locales/fr.json` et `en.json`), `donnees.ts` (`DONNEES` par langue —
  assemblée fictive, leçon 1 d'UEMB002 reprise de `uemb002-exemple.json`, copies, copies papier et
  avancement), `langue.tsx` (prop `langue` → `useEtude()` dans les plans et écrans ; `fr` et `en`,
  mêmes chiffres vérifiés au chargement), `ecrans/` (accueil avec la tuile de l'étude et sa pastille « En cours », accueil de
  l'étude, séance en trois temps et panneau du dirigeant, liste des questions, résultats et modale
  de copie papier, progression), `ui/` (salon de jour, livre et livrets, livret de Paul, alerte iOS,
  intertitre, frise des dimanches et enveloppe au cadenas), `plans/` (une partie par fichier),
  `calage.ts` (calage musical), `Video.tsx` (enchaînement). Aucune chaîne visible en dur hors de
  `textes.ts` et `donnees.ts`. Réutilise le thème, les briques d'app et l'habillage d'« Évènements »,
  les illustrations, la pastille de partie et les éléments de « Journal », la légende de
  « Documents ». Aucune retouche des fichiers partagés.
- Musique : la même piste que « Journal » et « Documents » (451,8 s, bien plus longue que la vidéo),
  **départ au début du fichier** : la partie « Le problème » dure 24,0 s, la bascule P5 (la tuile
  « Le Message de Bertoua ») tombe donc sur la montée de 24,0 s ; l'entrée de l'orchestre (70,5 s)
  tombe sur P11, le salon où tout le monde répond — téléphone, livret ou cahier ; P10 (Jean sans
  réseau) est le plan tampon, sa durée est calculée dans `calage.ts` ; fondu de sortie de 2,5 s sur
  le plan de fin.

## Vidéo « Guide » : le journal de l'assemblée et le Message de Bertoua, pas à pas (Shephr)

Vidéo **16:9** (1920 × 1080, 30 i/s, 9 978 images = 5 min 33), en français et en anglais (demande de
JP du 26/10) : pour tout le monde, pas à pas, le journal de l'assemblée (Vie d'assemblée) puis
l'étude « Le Message de Bertoua », le lien entre les deux et un rappel. Téléphone à gauche, panneau
de texte à droite (partie, étape, qui tient le téléphone, titre, une phrase). Même assemblée que la
vidéo « Étude » (Paris Ouest / Leeds West).
Storyboard : `docs/storyboard-guide.md` ; scripts de narration minutés :
`docs/script-voix-guide-fr.md` et `docs/script-voix-guide-en.md`.

- `npm run render:guide` → `out/guide-fr.mp4` (composition `GuideFR`) ;
  `npm run render:guide:en` → `out/guide-en.mp4` (composition `GuideEN`).
- Props : `voix` (facultative) = chemin d'un fichier audio de `public/` ; `musique` (défaut `true`).
  Avec une voix, la musique baisse nettement (≈ −14 dB).
- **Ajouter sa voix** : enregistrer la narration d'après le script (une ligne par plan, à partir de
  son timecode de début), exporter **un seul fichier** calé sur 0:00 et de la durée de la vidéo (MP3
  ou WAV), le poser dans `public/audio/` (ex. `public/audio/voix-guide-fr.mp3`), puis :

  ```bash
  npx remotion render GuideFR out/guide-fr-voix.mp4 --props='{"voix":"audio/voix-guide-fr.mp3"}'
  npx remotion render GuideEN out/guide-en-voix.mp4 --props='{"voix":"audio/voix-guide-en.mp3"}'
  # sans musique :
  npx remotion render GuideFR out/guide-fr-voix-seule.mp4 --props='{"voix":"audio/voix-guide-fr.mp3","musique":false}'
  ```
- Tout est dans `src/guide/` : `textes.ts` (panneau, voix et libellés de l'app manquants, FR / EN),
  `frise.ts` (ordre et durées calculées depuis les textes : lecture 1 s / 12 caractères, 3,5 s au
  moins, voix 2,5 mots/s), `donnees.ts` (assemblée de « Étude » + livres et Hiérarchie de « Journal »,
  séance arrêtée après la question 11, rattrapage, suite), `langue.tsx` (contextes), `ui/` (mise en
  page 16:9, cartons), `ecrans/` (écrans des avenants 04/05 et vue du membre), `plans/Plans.tsx`
  (un composant par plan), `Video.tsx`. Réutilise les écrans et illustrations de « Journal » et
  « Étude » ; retouches partagées sans effet sur les autres vidéos (exports `FournisseurJournal` /
  `FournisseurEtude`, props facultatives `plage` et `apresNote`).
- Après une retouche de texte ou de durée : `node scripts/script-voix-guide.mjs` (régénère les deux
  scripts) et `node scripts/stills-guide.mjs fr|en` (images de contrôle dans `out/stills/`).

## Vidéos « Offres » (Shephr, plan 05 du 27/10/2026, § 9)

Quatre vidéos 9:16 (1080 × 1920, 30 i/s), en français, sans voix off, **sans aucun prix** (ni
montant, ni bouton « S'abonner », ni caisse), rythme lent (légendes d'explication, intertitres de
2,5 s). Données fictives cohérentes avec « Étude », « Journal » et « Guide » ; libellés copiés de
`shephr-app/mobile/utils/i18n/locales/fr.json` et `shephr-app/web/src/i18n/locales/fr.json` (clé en
commentaire dans chaque `textes.ts`). Musique : « Dieu fait toutes choses nouvelles »
(`public/audio/`), calée dans chaque `calage.ts` (montée de 24,0 s et orchestre de 70,5 s du
fichier) ; des gardes lèvent une erreur au chargement si le calage casse ; fondu de sortie de 2,5 s.
Chaque dossier suit le gabarit d'« Étude » (`Video.tsx`, `calage.ts`, `textes.ts`, `donnees.ts`,
`ecrans/`, `plans/`, `ui/`) et réutilise par import, sans les modifier, le thème, les briques d'app
et l'habillage d'« Évènements », « Journal », « Étude », « Documents » et « Guide ».

### « Le Message de Bertoua » en détail

Vidéo de 7 140 images = 238 s (3 min 58) : une réunion du dimanche à Paris Ouest, en six parties
(Commencer · Répondre · Corriger · Terminer · La suite · L'avancement) — programme et unités (UEMB),
« À lire avant la leçon » et notes du dirigeant, choix du départ, réponse sur téléphone (les sept
sortes de questions), sur livret ou cahier, passage en correction et « S'arrêter après la question »,
échange des téléphones, question personnelle masquée, *Terminer* et notes, « Cette semaine, chaque
membre doit : », copies papier, leçon en plusieurs séances (réponses reportées), rattrapage à la
maison, avancement du membre et de l'assemblée ; carton « Gratuit — pour toutes les assemblées. ».
Aucun suivi de ville ni de hiérarchie (payants). Storyboard : `docs/storyboard-bertoua.md`.

- `npm run render:bertoua` → `out/bertoua-fr.mp4` (composition `BertouaFR`).
- Tout est dans `src/bertoua/`. Réutilise les plans d'« Étude » (lecture, réponses, correction,
  résultats) et les données de « Guide » (séance arrêtée après la question 11, Rose rattrape, suite
  le 1er novembre). Seul écart avec « Guide » : Jean a 8 / 11 (et non 7 / 11) ; son cumul 9 / 13
  reste juste.
- Musique : départ à 19,0 s du fichier (après le titre O1) ; la montée de 24,0 s ouvre le salon
  (O2, plan tampon calculé), l'orchestre de 70,5 s tombe sur le plan où tout le monde répond.

### « Offre Néhémie » — le suivi de toute ma ville

Vidéo de 2 550 images = 85 s : verset « Levons-nous, et bâtissons ! » (Néhémie 2 : 18, Louis Segond
1910), « Offre Néhémie — Le suivi de toute ma ville », pour qui (le pasteur et les responsables de
Douala), puis l'espace web « Suivi de la ville » en trois parties — le Message de Bertoua dans les
6 assemblées (grille assemblées × leçons, enseignés / non enseignés), le journal de la ville (des
nombres, aucun nom, journal PDF), les évènements assemblée par assemblée ; une ville, tous ses
responsables ; fin « Disponible sur l'espace web Shephr ». Storyboard : `docs/storyboard-nehemie.md`
(§ 7.3 : écrans dessinés d'après le plan, le lot « Offres » n'étant pas livré au 27/10).

- `npm run render:nehemie` → `out/nehemie-fr.mp4` (composition `NehemieFR`).
- Tout est dans `src/nehemie/` ; écrans web redessinés dans une fenêtre de navigateur
  (`ui/Navigateur.tsx`, vue de 600 px CSS à l'échelle 1,6, jetons de `web/src/theme/styles.css`).
- Musique : départ au début du fichier ; P5 (la grille) sur la montée, P9 (les responsables) sur
  l'orchestre, P8 plan tampon.

### « Offre Caleb » — le suivi de ma hiérarchie

Vidéo de 2 670 images = 89 s : verset « Donne-moi donc cette montagne » (Josué 14 : 12, Louis Segond
1910), « Offre Caleb — Le suivi de ma hiérarchie », puis la chaîne (pas la carte : les assemblées
quittent la carte de Paris et d'Évry pour se ranger sous leur dirigeant), le bloc Vie d'assemblée de
la Hiérarchie (réunions, présences, fraction du pain, alerte « Sans compte rendu depuis 3 semaines »,
journal PDF de ma hiérarchie), les comptes rendus en lecture seule, le bloc Le Message de Bertoua de
la chaîne (jamais les réponses), les brebis de toute la chaîne ; chacun pour soi (l'offre de Daniel
n'ouvre rien à Marc) ; fin « Disponible sur l'espace web Shephr ». Storyboard :
`docs/storyboard-caleb.md`.

- `npm run render:caleb` → `out/caleb-fr.mp4` (composition `CalebFR`).
- Tout est dans `src/caleb/` ; Daniel Mercier (rend compte à Bernard Lemoine), Sophie, Thomas,
  Samuel et Marc à Paris, Nadège Mbarga à Évry Centre sous Marc. Statuts Member Care : ceux par
  défaut du backend (`Nouveau` … `Rétrograde`), comme « Gratuit ».
- Musique : départ à 13,5 s du fichier ; montée sur l'intertitre 1, orchestre sur P7, P6 plan tampon.

### « Ce qui est et restera gratuit »

Vidéo de 2 520 images = 84 s : le Message de Bertoua dans son assemblée, la vie de son assemblée
(réunions, comptes rendus, journal PDF), le suivi des brebis de son assemblée, ses objectifs (Goals
& Reporting), l'arbre de sa Hiérarchie et l'état de soumission des objectifs, déclarer un évènement
et ses statistiques jusqu'à la ville, les documents, CMFIPraise (paroles et projection) ; tampon
« Gratuit » sur chaque téléphone ; fin « Tout cela est et restera gratuit. ». Aucune mention d'offre
payante ; les catégories d'objectifs en euros restent « À compléter ». Storyboard :
`docs/storyboard-gratuit.md`.

- `npm run render:gratuit` → `out/gratuit-fr.mp4` (composition `GratuitFR`).
- Tout est dans `src/gratuit/` (écrans redessinés : brebis, objectifs, arbre de la Hiérarchie ; le
  reste vient d'« Étude », « Journal », « Évènements », « Documents » et des écrans CMFIPraise).
- Musique : départ à 19,5 s du fichier ; montée sur l'intertitre 1, orchestre sur l'intertitre 3,
  P6 plan tampon.

## Vidéo « Enseignements sur les finances », chapitre 1

Vidéo **16:9** pour YouTube (1920 × 1080, 30 i/s, 7 506 images = 4 min 10), en français, sans voix ni
musique : le chapitre « L'argent, test et thermomètre de la vie spirituelle » de Théodore Andoseh (UMPJ
des finances), en illustrations animées et en phrases du livre. Storyboard :
`docs/storyboard-finances-ch1.md`.

- `npm run render:finances:ch1` → `out/finances-ch1-fr.mp4` (composition `FinancesCh1FR`).
- Tout est dans `src/finances/` : `textes.ts` (phrases du livre), `frise.ts` (durées calculées depuis les
  textes), `theme.ts`, `ui/Illustrations.tsx` (une illustration par partie), `Video.tsx`.
- `node scripts/stills-finances.mjs` : images de contrôle dans `out/stills/finances-ch1/`.

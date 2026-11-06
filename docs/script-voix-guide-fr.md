# Script de narration — vidéo « Guide » (GuideFR)

Durée de la vidéo : **5:32.6** (9978 images à 30 i/s). Une ligne par plan ; le texte à dire tient dans la durée du plan au rythme parlé d’environ 2,5 mots par seconde (colonne « mots / place »).

Généré par `node scripts/script-voix-guide.mjs` depuis `src/guide/textes.ts` et `src/guide/frise.ts` : ne pas modifier ce fichier à la main, il serait écrasé.

**Enregistrer sa voix.** Lire chaque ligne en commençant à son timecode de début (la colonne « À l’écran » rappelle ce qui est affiché). Laisser un court silence en début de plan : le texte à l’écran apparaît en ≈ 0,5 s. Exporter **un seul fichier** de la durée de la vidéo (MP3 ou WAV, 48 kHz conseillé), calé sur 0:00.0, dans `public/audio/` (ex. `public/audio/voix-guide-fr.mp3`), puis rendre :

```bash
npx remotion render GuideFR out/guide-fr-voix.mp4 --props='{"voix":"audio/voix-guide-fr.mp3"}'
```

La musique baisse alors nettement sous la voix ; ajouter `"musique":false` aux props pour la couper.

| # | Plan | Début → fin | Durée | À l’écran | Texte à dire | mots / place |
|---|---|---|---|---|---|---|
| 1 | i1 | 0:00.0 → 0:08.3 | 8,3 s | Le journal de l’assemblée et le Message de Bertoua — Pas à pas, dans l’app Shephr | Bienvenue. Voici, pas à pas, le journal de l’assemblée et le Message de Bertoua, dans l’application Shephr. | 17 / 19 |
| 2 | i2 | 0:08.3 → 0:14.8 | 6,5 s | Une assemblée de maison — Paris Ouest, le dimanche, chez Samuel. | Prenons Paris Ouest : une assemblée de maison, réunie le dimanche chez Samuel. | 12 / 14 |
| 3 | i3 | 0:14.8 → 0:21.8 | 7,0 s | Les personnes — Un dirigeant, des membres, la ville. | Samuel dirige l’assemblée. Marie, Jean et Esther sont membres. Daniel dirige la ville. | 13 / 16 |
| 4 | i4 | 0:21.8 → 0:30.0 | 8,3 s | Au programme — Le journal de l’assemblée — Le Message de Bertoua — Le lien entre les deux | D’abord, le journal de l’assemblée. Ensuite, l’étude du Message de Bertoua. Enfin, le lien entre les deux. | 17 / 19 |
| 5 | t1 | 0:30.0 → 0:36.0 | 6,0 s | Le journal de l’assemblée — Une réunion, un compte rendu. | Première partie : le journal de l’assemblée. | 6 / 13 |
| 6 | j1 | 0:36.0 → 0:42.8 | 6,8 s | Nouveau CR — Onglet Assemblée. Seul le dirigeant rédige. | Après la réunion, Samuel, le dirigeant, ouvre l’onglet Assemblée et touche Nouveau CR. | 13 / 15 |
| 7 | j2 | 0:42.8 → 0:48.8 | 6,0 s | La date — Celle du jour. Jamais une date future. | La date est déjà celle du jour. Une date future est refusée. | 12 / 13 |
| 8 | j3 | 0:48.8 → 0:54.8 | 6,0 s | Les présents — Tout cocher, puis décocher les absents. | Il coche tout le monde, puis décoche les deux absents. | 10 / 13 |
| 9 | j4 | 0:54.8 → 1:00.3 | 5,5 s | La fraction de pain — Oui ou non : un interrupteur. | La fraction de pain : oui ou non, d’un geste. | 9 / 12 |
| 10 | j5 | 1:00.3 → 1:07.3 | 7,0 s | Les chapitres lus — Le livre, puis les chapitres. Un point : déjà lu. | Il choisit le livre, puis les chapitres du jour. Un point marque ceux déjà lus. | 15 / 16 |
| 11 | j6 | 1:07.3 → 1:13.3 | 6,0 s | Le texte s’écrit seul — L’aperçu suit chaque choix. | Pendant ce temps, le texte du compte rendu s’écrit tout seul. | 11 / 13 |
| 12 | j7 | 1:13.3 → 1:20.1 | 6,8 s | Enregistrer, copier — Prêt à coller dans WhatsApp. | Il enregistre. Puis Copier ou Partager : le texte part dans le groupe WhatsApp. | 13 / 15 |
| 13 | j8 | 1:20.1 → 1:25.6 | 5,5 s | Le journal — Toutes les réunions, année après année. | Réunion après réunion, le journal se remplit, année après année. | 10 / 12 |
| 14 | j9 | 1:25.6 → 1:31.1 | 5,5 s | L’avancement — Livre par livre : les chapitres lus. | Avancement montre, livre par livre, les chapitres déjà lus par l’assemblée. | 11 / 12 |
| 15 | j10 | 1:31.1 → 1:37.6 | 6,5 s | Le journal en PDF — Un mois, un trimestre ou l’année, à imprimer. | Journal PDF rassemble les comptes rendus d’une période, à imprimer ou à partager. | 13 / 14 |
| 16 | j11 | 1:37.6 → 1:44.6 | 7,0 s | Ce que voit un membre — Les comptes rendus, en lecture seule. | Marie, membre, lit les comptes rendus sans les modifier, et voit si elle était présente. | 15 / 16 |
| 17 | j12 | 1:44.6 → 1:50.3 | 5,8 s | Mon avancement — Les chapitres lus quand elle était là. | Mon avancement : les chapitres lus aux réunions où elle était présente. | 11 / 12 |
| 18 | j13 | 1:50.3 → 1:57.8 | 7,5 s | Ce que voit la ville — Les chiffres, et une alerte sans CR. | Daniel, pour la ville, suit ses assemblées. Trois semaines sans compte rendu : une alerte s’affiche. | 15 / 17 |
| 19 | t2 | 1:57.8 → 2:03.1 | 5,3 s | Le Message de Bertoua — Lire, répondre, corriger. | Deuxième partie : l’étude du Message de Bertoua. | 7 / 11 |
| 20 | e1 | 2:03.1 → 2:09.9 | 6,8 s | On lit ensemble — Préface et chapitre 1. | On lit d’abord ensemble la portion du jour : la préface et le chapitre 1. | 14 / 15 |
| 21 | e2 | 2:09.9 → 2:15.9 | 6,0 s | La tuile Le Message de Bertoua — Sur l’accueil de l’app. | L’étude s’ouvre depuis l’accueil, par la tuile Le Message de Bertoua. | 11 / 13 |
| 22 | e3 | 2:15.9 → 2:20.9 | 5,0 s | L’unité, la leçon — Leçon 1 : Le prix à payer. | Samuel ouvre l’unité, puis choisit la leçon du jour. | 9 / 11 |
| 23 | e4 | 2:20.9 → 2:27.1 | 6,3 s | À lire avant la leçon — Les conseils du manuel, pour lui seul. | Avant de commencer, les recommandations du manuel. Seul le dirigeant les voit. | 12 / 14 |
| 24 | e5 | 2:27.1 → 2:33.4 | 6,3 s | La question de départ — Ici : toute la leçon. | Puis le point de départ : ici, toute la leçon. Il peut commencer ailleurs. | 13 / 14 |
| 25 | e6 | 2:33.4 → 2:37.4 | 4,0 s | Commencer — La séance est ouverte. | Il touche Commencer : la séance est ouverte. | 7 / 8 |
| 26 | e7 | 2:37.4 → 2:43.7 | 6,3 s | « En cours » — Marie touche Répondre. | Sur le téléphone de Marie, la tuile affiche En cours. Elle touche Répondre. | 13 / 14 |
| 27 | e8 | 2:43.7 → 2:51.7 | 8,0 s | Toutes sortes de questions — Vrai ou faux, cases, réponses écrites. | Vrai ou faux, cases à cocher, réponses écrites, questions personnelles. | 10 / 18 |
| 28 | e9 | 2:51.7 → 2:57.9 | 6,3 s | Enregistré, même hors ligne — Sans réseau, rien n’est perdu. | Chaque réponse s’enregistre. Sans réseau, elles partent plus tard. | 9 / 14 |
| 29 | e10 | 2:57.9 → 3:03.9 | 6,0 s | Sans smartphone : papier — Un livret, ou un cahier. | Pas de smartphone ? Paul répond dans son livret, Hélène dans un cahier. | 12 / 13 |
| 30 | e11 | 3:03.9 → 3:09.2 | 5,3 s | Passer à la correction — Quand chacun a répondu. | Quand chacun a répondu, Samuel touche Passer à la correction. | 10 / 11 |
| 31 | e12 | 3:09.2 → 3:16.7 | 7,5 s | S’arrêter après la question… — Le temps manque ? La suite, dimanche prochain. | Le temps manque ? Il s’arrête après la question 11. La suite, dimanche prochain. | 13 / 17 |
| 32 | e13 | 3:16.7 → 3:23.0 | 6,3 s | Les fermées se corrigent seules — Et la saisie se verrouille. | La saisie se verrouille. Les questions fermées sont corrigées toutes seules. | 11 / 14 |
| 33 | e14 | 3:23.0 → 3:32.0 | 9,0 s | On échange les téléphones — Juste, À préciser ou À revoir. | On échange les téléphones. Jean compare avec la réponse du manuel, et choisit un avis. | 15 / 21 |
| 34 | e15 | 3:32.0 → 3:39.0 | 7,0 s | La question personnelle reste cachée — Jean voit seulement « répondu ». | La question personnelle reste cachée : Jean voit seulement qu’elle a une réponse. | 12 / 16 |
| 35 | e16 | 3:39.0 → 3:43.2 | 4,3 s | Terminer — Les notes sont arrêtées. | Tous les avis sont posés : Samuel touche Terminer. | 8 / 9 |
| 36 | e17 | 3:43.2 → 3:50.2 | 7,0 s | Chacun voit sa note — 8,5 sur 11, pour cette séance. | Chacun voit aussitôt sa note : Marie a huit et demi sur onze. | 12 / 16 |
| 37 | e18 | 3:50.2 → 3:55.5 | 5,3 s | Cette semaine… — Ce que chaque membre doit faire. | En dessous : ce que chaque membre doit faire cette semaine. | 10 / 11 |
| 38 | e19 | 3:55.5 → 4:03.5 | 8,0 s | Les copies papier — Samuel saisit la note de Paul et d’Hélène. | Dans les résultats, Samuel ajoute la note du livret de Paul et du cahier d’Hélène. | 15 / 18 |
| 39 | e20 | 4:03.5 → 4:10.3 | 6,8 s | Ma progression — 6 / 9 questions. Sa note, à elle seule. | Ma progression : six questions sur neuf. Un membre ne voit que sa propre note. | 14 / 15 |
| 40 | e21 | 4:10.3 → 4:17.0 | 6,8 s | Absente ? On rattrape — Rose répond seule, à la maison. | Rose était absente. Elle rattrape la séance seule, à la maison. | 11 / 15 |
| 41 | e22 | 4:17.0 → 4:23.3 | 6,3 s | Envoyer ma copie — Les corrections viennent après l’envoi. | Corrections et réponses du manuel n’apparaissent qu’après l’envoi de sa copie. | 11 / 14 |
| 42 | e23 | 4:23.3 → 4:29.3 | 6,0 s | Jusqu’à une autre leçon — Ensuite, le rattrapage se ferme. | Le rattrapage reste ouvert tant qu’une autre leçon n’a pas commencé. | 11 / 13 |
| 43 | e24 | 4:29.3 → 4:36.3 | 7,0 s | Dimanche suivant : la suite — Questions 12 à 31. | Le dimanche suivant, la leçon reprend à la question 12. | 10 / 16 |
| 44 | e25 | 4:36.3 → 4:42.8 | 6,5 s | Réponses déjà données — Marie les retrouve : rien à refaire. | Marie retrouve les réponses qu’elle avait déjà données. Rien à refaire. | 11 / 14 |
| 45 | e26 | 4:42.8 → 4:49.1 | 6,3 s | L’avancement de l’assemblée — Leçons faites, note de chacun. | Samuel voit les leçons faites et la note de chaque membre. | 11 / 14 |
| 46 | e27 | 4:49.1 → 4:55.8 | 6,8 s | La ville voit l’ensemble — Jamais le contenu des copies. | Daniel voit où en est chaque assemblée, jamais le contenu des copies. | 12 / 15 |
| 47 | t3 | 4:55.8 → 5:01.6 | 5,8 s | Le lien entre les deux — Quand l’assemblée a les deux. | Enfin, le lien entre les deux. | 6 / 12 |
| 48 | l1 | 5:01.6 → 5:09.6 | 8,0 s | Le CR propose la leçon — Un jour d’étude, elle est pré-cochée. | Un jour d’étude, le compte rendu coche déjà la leçon étudiée. Samuel peut la décocher. | 15 / 18 |
| 49 | c1 | 5:09.6 → 5:18.6 | 9,0 s | En résumé : le journal — Nouveau CR — Présents, pain, chapitres — Enregistrer, copier — Journal PDF | En résumé : après chaque réunion, un compte rendu, enregistré puis partagé. | 11 / 21 |
| 50 | c2 | 5:18.6 → 5:26.6 | 8,0 s | En résumé : l’étude — Commencer — Lire, répondre — Corriger ensemble — Terminer — Rattraper | Pour l’étude : commencer, lire, répondre, corriger ensemble, terminer. Et les absents rattrapent. | 12 / 18 |
| 51 | c3 | 5:26.6 → 5:32.6 | 6,0 s | Le Message de Bertoua, simplement. | Le Message de Bertoua, simplement. | 5 / 13 |

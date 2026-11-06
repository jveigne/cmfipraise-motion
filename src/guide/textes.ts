/**
 * Textes de la vidéo « Guide » (16:9, JP 26/10/2026) : le journal de l'assemblée et le Message de
 * Bertoua, pas à pas. Fichier sans React : `frise.ts` (durées) et le générateur des scripts de
 * narration (`scripts/script-voix-guide.ts`) le lisent aussi.
 *
 * Pour chaque plan : `titre` et `texte` (le panneau de texte à l'écran : mots-clés, phrase courte,
 * `*mot*` passe en argile) et `voix` (la narration : phrases courtes, rythme parlé ≈ 2,5 mots/s ;
 * elle dit la même chose que l'écran, avec d'autres mots). Typographie française : espace fine
 * insécable (U+202F) avant ? ! ;, insécable (U+00A0) avant : et dans « » — à l'écran seulement ;
 * la voix est écrite simplement, pour être lue.
 *
 * Les libellés de l'app montrés à l'écran (`APP_GUIDE`) sont copiés à la lettre de
 * shephr-app/mobile/utils/i18n/locales/fr.json et en.json (clé en commentaire) ; ceux que les
 * vidéos « Journal » et « Étude » ont déjà relevés sont repris de leurs `textes.ts`.
 */
import type { Langue } from '../textes';

const F = ' ';
const N = ' ';

/** Les plans, dans l'ordre de la vidéo (voir `frise.ts`). */
export const ID_PLANS = [
  // Introduction
  'i1', 'i2', 'i3', 'i4',
  // Partie 1 — le journal de l'assemblée
  't1', 'j1', 'j2', 'j3', 'j4', 'j5', 'j6', 'j7', 'j8', 'j9', 'j10', 'j11', 'j12', 'j13',
  // Partie 2 — le Message de Bertoua
  't2', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12', 'e13', 'e14', 'e15',
  'e16', 'e17', 'e18', 'e19', 'e20', 'e21', 'e22', 'e23', 'e24', 'e25', 'e26', 'e27',
  // Le lien entre les deux
  't3', 'l1',
  // Conclusion
  'c1', 'c2', 'c3',
] as const;
export type IdPlan = (typeof ID_PLANS)[number];

/** Qui tient le téléphone (étiquette du panneau de texte). */
export type Role = 'samuel' | 'marie' | 'jean' | 'rose' | 'daniel' | 'papier' | 'assemblee';

export interface TextePlan {
  role?: Role;
  titre: string;
  /** Texte du panneau (une ou deux phrases courtes). Listes (sommaire, rappels) : une ligne par élément. */
  texte: string | readonly string[];
  voix: string;
}

export type Plans = Record<IdPlan, TextePlan>;

// ---------------------------------------------------------------------------------------------
// Français

const PLANS_FR: Plans = {
  i1: {
    titre: 'Le journal de l’assemblée et le Message de Bertoua',
    texte: 'Pas à pas, dans l’app Shephr',
    voix: 'Bienvenue. Voici, pas à pas, le journal de l’assemblée et le Message de Bertoua, dans l’application Shephr.',
  },
  i2: {
    role: 'assemblee',
    titre: 'Une *assemblée de maison*',
    texte: 'Paris Ouest, le dimanche, chez Samuel.',
    voix: 'Prenons Paris Ouest : une assemblée de maison, réunie le dimanche chez Samuel.',
  },
  i3: {
    titre: 'Les *personnes*',
    texte: 'Un dirigeant, des membres, la ville.',
    voix: 'Samuel dirige l’assemblée. Marie, Jean et Esther sont membres. Daniel dirige la ville.',
  },
  i4: {
    titre: 'Au *programme*',
    texte: ['Le journal de l’assemblée', 'Le Message de Bertoua', 'Le lien entre les deux'],
    voix: 'D’abord, le journal de l’assemblée. Ensuite, l’étude du Message de Bertoua. Enfin, le lien entre les deux.',
  },

  t1: { titre: 'Le journal de l’assemblée', texte: 'Une réunion, un compte rendu.', voix: 'Première partie : le journal de l’assemblée.' },
  j1: {
    role: 'samuel',
    titre: '*Nouveau CR*',
    texte: 'Onglet Assemblée. Seul le dirigeant rédige.',
    voix: 'Après la réunion, Samuel, le dirigeant, ouvre l’onglet Assemblée et touche Nouveau CR.',
  },
  j2: {
    role: 'samuel',
    titre: 'La *date*',
    texte: 'Celle du jour. Jamais une date future.',
    voix: 'La date est déjà celle du jour. Une date future est refusée.',
  },
  j3: {
    role: 'samuel',
    titre: 'Les *présents*',
    texte: 'Tout cocher, puis décocher les absents.',
    voix: 'Il coche tout le monde, puis décoche les deux absents.',
  },
  j4: {
    role: 'samuel',
    titre: 'La *fraction de pain*',
    texte: `Oui ou non${N}: un interrupteur.`,
    voix: 'La fraction de pain : oui ou non, d’un geste.',
  },
  j5: {
    role: 'samuel',
    titre: 'Les *chapitres lus*',
    texte: `Le livre, puis les chapitres. Un point${N}: déjà lu.`,
    voix: 'Il choisit le livre, puis les chapitres du jour. Un point marque ceux déjà lus.',
  },
  j6: {
    role: 'samuel',
    titre: 'Le texte *s’écrit seul*',
    texte: 'L’aperçu suit chaque choix.',
    voix: 'Pendant ce temps, le texte du compte rendu s’écrit tout seul.',
  },
  j7: {
    role: 'samuel',
    titre: '*Enregistrer*, *copier*',
    texte: 'Prêt à coller dans WhatsApp.',
    voix: 'Il enregistre. Puis Copier ou Partager : le texte part dans le groupe WhatsApp.',
  },
  j8: {
    role: 'samuel',
    titre: 'Le *journal*',
    texte: 'Toutes les réunions, année après année.',
    voix: 'Réunion après réunion, le journal se remplit, année après année.',
  },
  j9: {
    role: 'samuel',
    titre: 'L’*avancement*',
    texte: `Livre par livre${N}: les chapitres lus.`,
    voix: 'Avancement montre, livre par livre, les chapitres déjà lus par l’assemblée.',
  },
  j10: {
    role: 'samuel',
    titre: 'Le journal *en PDF*',
    texte: 'Un mois, un trimestre ou l’année, à imprimer.',
    voix: 'Journal PDF rassemble les comptes rendus d’une période, à imprimer ou à partager.',
  },
  j11: {
    role: 'marie',
    titre: 'Ce que voit *un membre*',
    texte: 'Les comptes rendus, en lecture seule.',
    voix: 'Marie, membre, lit les comptes rendus sans les modifier, et voit si elle était présente.',
  },
  j12: {
    role: 'marie',
    titre: '*Mon avancement*',
    texte: 'Les chapitres lus quand elle était là.',
    voix: 'Mon avancement : les chapitres lus aux réunions où elle était présente.',
  },
  j13: {
    role: 'daniel',
    titre: 'Ce que voit *la ville*',
    texte: 'Les chiffres, et une alerte sans CR.',
    voix: 'Daniel, pour la ville, suit ses assemblées. Trois semaines sans compte rendu : une alerte s’affiche.',
  },

  t2: { titre: 'Le Message de Bertoua', texte: 'Lire, répondre, corriger.', voix: 'Deuxième partie : l’étude du Message de Bertoua.' },
  e2: {
    role: 'samuel',
    titre: 'La tuile *Le Message de Bertoua*',
    texte: 'Sur l’accueil de l’app.',
    voix: 'L’étude s’ouvre depuis l’accueil, par la tuile Le Message de Bertoua.',
  },
  e3: {
    role: 'samuel',
    titre: 'L’*unité*, la *leçon*',
    texte: `Leçon 1${N}: Le prix à payer.`,
    voix: 'Samuel ouvre l’unité, puis choisit la leçon du jour.',
  },
  e4: {
    role: 'samuel',
    titre: '*À lire* avant la leçon',
    texte: 'Les conseils du manuel, pour lui seul.',
    voix: 'Avant de commencer, les recommandations du manuel. Seul le dirigeant les voit.',
  },
  e5: {
    role: 'samuel',
    titre: 'La *question de départ*',
    texte: `Ici${N}: toute la leçon.`,
    voix: 'Puis le point de départ : ici, toute la leçon. Il peut commencer ailleurs.',
  },
  e6: {
    role: 'samuel',
    titre: '*Commencer*',
    texte: 'La séance est ouverte.',
    voix: 'Il touche Commencer : la séance est ouverte.',
  },
  e1: {
    role: 'assemblee',
    titre: 'On lit *ensemble*',
    texte: 'Préface et chapitre 1.',
    voix: 'On lit d’abord ensemble la portion du jour : la préface et le chapitre 1.',
  },
  e7: {
    role: 'marie',
    titre: `«${N}*En cours*${N}»`,
    texte: 'Marie touche Répondre.',
    voix: 'Sur le téléphone de Marie, la tuile affiche En cours. Elle touche Répondre.',
  },
  e8: {
    role: 'marie',
    titre: 'Toutes sortes de *questions*',
    texte: 'Vrai ou faux, cases, réponses écrites.',
    voix: 'Vrai ou faux, cases à cocher, réponses écrites, questions personnelles.',
  },
  e9: {
    role: 'marie',
    titre: '*Enregistré*, même hors ligne',
    texte: 'Sans réseau, rien n’est perdu.',
    voix: 'Chaque réponse s’enregistre. Sans réseau, elles partent plus tard.',
  },
  e10: {
    role: 'papier',
    titre: `Sans smartphone${N}: *papier*`,
    texte: 'Un livret, ou un cahier.',
    voix: 'Pas de smartphone ? Paul répond dans son livret, Hélène dans un cahier.',
  },
  e11: {
    role: 'samuel',
    titre: '*Passer à la correction*',
    texte: 'Quand chacun a répondu.',
    voix: 'Quand chacun a répondu, Samuel touche Passer à la correction.',
  },
  e12: {
    role: 'samuel',
    titre: '*S’arrêter* après la question…',
    texte: `Le temps manque${F}? La suite, dimanche prochain.`,
    voix: 'Le temps manque ? Il s’arrête après la question 11. La suite, dimanche prochain.',
  },
  e13: {
    role: 'marie',
    titre: 'Les fermées *se corrigent seules*',
    texte: 'Et la saisie se verrouille.',
    voix: 'La saisie se verrouille. Les questions fermées sont corrigées toutes seules.',
  },
  e14: {
    role: 'jean',
    titre: 'On *échange les téléphones*',
    texte: 'Juste, À préciser ou À revoir.',
    voix: 'On échange les téléphones. Jean compare avec la réponse du manuel, et choisit un avis.',
  },
  e15: {
    role: 'jean',
    titre: 'La question personnelle *reste cachée*',
    texte: `Jean voit seulement «${N}répondu${N}».`,
    voix: 'La question personnelle reste cachée : Jean voit seulement qu’elle a une réponse.',
  },
  e16: {
    role: 'samuel',
    titre: '*Terminer*',
    texte: 'Les notes sont arrêtées.',
    voix: 'Tous les avis sont posés : Samuel touche Terminer.',
  },
  e17: {
    role: 'marie',
    titre: 'Chacun voit *sa note*',
    texte: '8,5 sur 11, pour cette séance.',
    voix: 'Chacun voit aussitôt sa note : Marie a huit et demi sur onze.',
  },
  e18: {
    role: 'marie',
    titre: '*Cette semaine*…',
    texte: 'Ce que chaque membre doit faire.',
    voix: 'En dessous : ce que chaque membre doit faire cette semaine.',
  },
  e19: {
    role: 'samuel',
    titre: 'Les *copies papier*',
    texte: 'Samuel saisit la note de Paul et d’Hélène.',
    voix: 'Dans les résultats, Samuel ajoute la note du livret de Paul et du cahier d’Hélène.',
  },
  e20: {
    role: 'marie',
    titre: '*Ma progression*',
    texte: '6 / 9 questions. Sa note, à elle seule.',
    voix: 'Ma progression : six questions sur neuf. Un membre ne voit que sa propre note.',
  },
  e21: {
    role: 'rose',
    titre: `Absente${F}? *On rattrape*`,
    texte: 'Rose répond seule, à la maison.',
    voix: 'Rose était absente. Elle rattrape la séance seule, à la maison.',
  },
  e22: {
    role: 'rose',
    titre: '*Envoyer ma copie*',
    texte: 'Les corrections viennent après l’envoi.',
    voix: 'Corrections et réponses du manuel n’apparaissent qu’après l’envoi de sa copie.',
  },
  e23: {
    role: 'rose',
    titre: 'Jusqu’à *une autre leçon*',
    texte: 'Ensuite, le rattrapage se ferme.',
    voix: 'Le rattrapage reste ouvert tant qu’une autre leçon n’a pas commencé.',
  },
  e24: {
    role: 'samuel',
    titre: `Dimanche suivant${N}: *la suite*`,
    texte: 'Questions 12 à 31.',
    voix: 'Le dimanche suivant, la leçon reprend à la question 12.',
  },
  e25: {
    role: 'marie',
    titre: 'Réponses *déjà données*',
    texte: `Marie les retrouve${N}: rien à refaire.`,
    voix: 'Marie retrouve les réponses qu’elle avait déjà données. Rien à refaire.',
  },
  e26: {
    role: 'samuel',
    titre: 'L’avancement *de l’assemblée*',
    texte: 'Leçons faites, note de chacun.',
    voix: 'Samuel voit les leçons faites et la note de chaque membre.',
  },
  e27: {
    role: 'daniel',
    titre: 'La ville voit *l’ensemble*',
    texte: 'Jamais le contenu des copies.',
    voix: 'Daniel voit où en est chaque assemblée, jamais le contenu des copies.',
  },

  t3: { titre: 'Le lien entre les deux', texte: 'Quand l’assemblée a les deux.', voix: 'Enfin, le lien entre les deux.' },
  l1: {
    role: 'samuel',
    titre: 'Le CR *propose la leçon*',
    texte: 'Un jour d’étude, elle est pré-cochée.',
    voix: 'Un jour d’étude, le compte rendu coche déjà la leçon étudiée. Samuel peut la décocher.',
  },

  c1: {
    titre: `En résumé${N}: *le journal*`,
    texte: ['Nouveau CR', 'Présents, pain, chapitres', 'Enregistrer, copier', 'Journal PDF'],
    voix: 'En résumé : après chaque réunion, un compte rendu, enregistré puis partagé.',
  },
  c2: {
    titre: `En résumé${N}: *l’étude*`,
    texte: ['Commencer', 'Lire, répondre', 'Corriger ensemble', 'Terminer', 'Rattraper'],
    voix: 'Pour l’étude : commencer, lire, répondre, corriger ensemble, terminer. Et les absents rattrapent.',
  },
  c3: {
    titre: 'Le Message de Bertoua, simplement.',
    texte: '',
    voix: 'Le Message de Bertoua, simplement.',
  },
};

const CARTONS_FR = {
  roles: {
    samuel: 'DIRIGEANT · SAMUEL',
    marie: 'MEMBRE · MARIE',
    jean: 'JEAN CORRIGE MARIE',
    rose: 'MEMBRE · ROSE',
    daniel: 'VILLE · DANIEL',
    papier: 'PAUL · HÉLÈNE',
    assemblee: 'L’ASSEMBLÉE',
  } satisfies Record<Role, string>,
  parties: {
    intro: 'INTRODUCTION',
    journal: 'PARTIE 1 · LE JOURNAL',
    etude: 'PARTIE 2 · LE MESSAGE DE BERTOUA',
    lien: 'LE LIEN ENTRE LES DEUX',
    fin: 'EN RÉSUMÉ',
  },
  etape: (n: number, total: number) => `Étape ${n} sur ${total}`,
  /** Intertitres : numéro (ou signe), titre (de `PLANS.t*`), phrase. */
  numeros: { t1: '1', t2: '2', t3: '+' },
  /** i1 : le titre en deux lignes. */
  titreVideo: ['Le journal de l’assemblée', 'et le Message de Bertoua'],
  /** i3 : les personnes, avec leur rôle. */
  personnes: [
    { nom: 'Samuel', role: 'dirigeant' },
    { nom: 'Marie', role: 'membre' },
    { nom: 'Jean', role: 'membre' },
    { nom: 'Esther', role: 'membre' },
    { nom: 'Paul', role: 'son livret' },
    { nom: 'Hélène', role: 'un cahier' },
    { nom: 'Rose', role: 'absente' },
    { nom: 'Daniel', role: 'la ville' },
  ],
  /** e10 : sous le livret et le cahier. */
  supports: ['LE LIVRET DE PAUL', 'LE CAHIER D’HÉLÈNE'],
  /** Fin. */
  fin: ['Le Message de Bertoua,', 'simplement', '.'],
};

/**
 * Libellés de l'app que les textes de « Journal » et « Étude » ne contiennent pas (avenants 04 et
 * 05, vue du membre) : fr.json, à la lettre (clé en commentaire).
 */
const APP_FR = {
  range: (a: string, b: string) => `questions ${a} à ${b}`, // study.range
  wholeLesson: 'toute la leçon', // study.home.wholeLesson
  sessionRange: (r: string) => `Cette séance : ${r}`, // study.home.sessionRange
  nextRange: (r: string) => `Suite : ${r}`, // study.home.nextRange
  startPick: 'Question de départ', // study.home.startPick
  startPickFirst: 'Par défaut : le début de la leçon. Touchez une autre question pour commencer ailleurs.', // study.home.startPickFirst
  startPickNext: (n: string) =>
    `Par défaut : question ${n}, la première non encore traitée. Touchez une autre question pour commencer ailleurs.`, // study.home.startPickNext
  covered: (r: string) => `Déjà traitées : ${r}`, // study.home.covered
  continue: 'Continuer', // study.home.continue
  copies: (n: number) => `${n} ${n <= 1 ? 'copie' : 'copies'}`, // study.home.copies_*
  catchUpTitle: 'À rattraper', // study.home.catchUpTitle
  catchUpHint: "Vous n'étiez pas à la séance : répondez seul aux questions, puis envoyez votre copie.", // study.home.catchUpHint
  catchUpAction: 'Rattraper', // study.home.catchUpAction
  noCurrent: 'Aucune étude en cours', // study.home.noCurrent
  noCurrentHint: 'Quand votre dirigeant commencera une séance, elle apparaîtra ici.', // study.home.noCurrentHint
  briefingTitle: 'À lire avant la leçon', // study.briefing.title
  unitNotes: "Présentation de l'unité", // study.briefing.unitNotes
  lessonNotes: 'Recommandations pour la leçon', // study.briefing.lessonNotes
  memberActionsPreview: 'Aperçu — chaque membre devra :', // study.briefing.memberActions
  memberActionsTitle: 'Cette semaine, chaque membre doit :', // study.memberActions.title
  leaderNotes: 'Notes du dirigeant', // study.leader.notes
  stopAfter: "S'arrêter après la question :", // study.leader.stopAfter
  stopLast: 'dernière', // study.leader.stopLast
  stopAfterCut: (n: string) =>
    `Les questions après Q${n} seront retirées de cette séance (ni corrigées ni notées) ; les réponses déjà données seront reprises à la prochaine séance de la leçon. La saisie sera verrouillée et les questions fermées corrigées.`, // study.leader.stopAfterCut
  catchUpSessionHint:
    "Rattrapage : répondez seul, à votre rythme. Les corrections et les réponses du manuel s'afficheront après l'envoi de votre copie.", // study.session.catchUpHint
  catchUpSubmit: 'Envoyer ma copie', // study.session.catchUpSubmit
  questionsCovered: (a: number, b: number) => `${a} / ${b} questions`, // study.progress.questionsCovered
  // assemblyLife.* (vue du membre, D-ASM-17 ; lien étude, D-ETU-30)
  memberHint: 'Comptes rendus de votre assemblée, en lecture seule.', // assemblyLife.memberHint
  present: 'Présent', // assemblyLife.present
  absent: 'Absent', // assemblyLife.absent
  mineTitle: 'Mon avancement', // assemblyLife.progress.mineTitle
  mineSub: (n: number) =>
    n <= 1
      ? `Chapitres lus lors de la réunion où vous étiez présent (${n} réunion).`
      : `Chapitres lus lors des réunions où vous étiez présent (${n} réunions).`, // assemblyLife.progress.mineSub_*
  assemblyTitle: "Avancement de l'assemblée", // assemblyLife.progress.assemblyTitle
  studySuggestionHint:
    "Chapitre pré-coché d'après la séance d'étude « Le Message de Bertoua » du jour de la réunion : décochez-le s'il n'a pas été lu.", // assemblyLife.form.studySuggestionHint
};

// ---------------------------------------------------------------------------------------------
// Anglais (adaptation, pas du mot à mot ; libellés de en.json)

const PLANS_EN: Plans = {
  i1: {
    titre: 'The assembly journal and the Bertoua message',
    texte: 'Step by step, in the Shephr app',
    voix: 'Welcome. Here, step by step, are the assembly journal and the Bertoua message study, in the Shephr app.',
  },
  i2: {
    role: 'assemblee',
    titre: 'A *house assembly*',
    texte: 'Leeds West, on Sundays, at Samuel’s.',
    voix: 'Take Leeds West: a house assembly that meets on Sundays at Samuel’s home.',
  },
  i3: {
    titre: 'The *people*',
    texte: 'A leader, members, the city.',
    voix: 'Samuel leads the assembly. Mary, John and Esther are members. Daniel leads the city.',
  },
  i4: {
    titre: 'What’s *ahead*',
    texte: ['The assembly journal', 'The Bertoua message', 'How the two connect'],
    voix: 'First, the assembly journal. Then, the Bertoua message study. Finally, how the two connect.',
  },

  t1: { titre: 'The assembly journal', texte: 'One meeting, one report.', voix: 'Part one: the assembly journal.' },
  j1: {
    role: 'samuel',
    titre: '*New report*',
    texte: 'Assembly tab. Only the leader writes it.',
    voix: 'After the meeting, Samuel, the leader, opens the Assembly tab and taps New report.',
  },
  j2: {
    role: 'samuel',
    titre: 'The *date*',
    texte: 'Today’s. Never a future date.',
    voix: 'The date is already today’s. A future date is refused.',
  },
  j3: {
    role: 'samuel',
    titre: 'Who was *present*',
    texte: 'Check all, then untick those absent.',
    voix: 'He checks everyone, then unticks the two who were absent.',
  },
  j4: {
    role: 'samuel',
    titre: 'The *breaking of bread*',
    texte: 'Yes or no: a switch.',
    voix: 'Breaking of bread: yes or no, in one tap.',
  },
  j5: {
    role: 'samuel',
    titre: 'The *chapters read*',
    texte: 'The book, then the chapters. A dot: already read.',
    voix: 'He picks the book, then today’s chapters. A dot marks those already read.',
  },
  j6: {
    role: 'samuel',
    titre: 'The text *writes itself*',
    texte: 'The preview follows every choice.',
    voix: 'Meanwhile, the text of the report writes itself.',
  },
  j7: {
    role: 'samuel',
    titre: '*Save*, *copy*',
    texte: 'Ready to paste into WhatsApp.',
    voix: 'He saves it. Then Copy or Share: the text goes to the WhatsApp group.',
  },
  j8: {
    role: 'samuel',
    titre: 'The *journal*',
    texte: 'Every meeting, year after year.',
    voix: 'Meeting after meeting, the journal fills up, year after year.',
  },
  j9: {
    role: 'samuel',
    titre: '*Progress*',
    texte: 'Book by book: the chapters read.',
    voix: 'Progress shows, book by book, the chapters the assembly has read.',
  },
  j10: {
    role: 'samuel',
    titre: 'The journal *as a PDF*',
    texte: 'A month, a quarter or the year, to print.',
    voix: 'PDF journal gathers the reports of a period, to print or to share.',
  },
  j11: {
    role: 'marie',
    titre: 'What *a member* sees',
    texte: 'The reports, read-only.',
    voix: 'Mary, a member, reads the reports without changing them, and sees whether she was present.',
  },
  j12: {
    role: 'marie',
    titre: '*My progress*',
    texte: 'The chapters read when she was there.',
    voix: 'My progress: the chapters read at the meetings she attended.',
  },
  j13: {
    role: 'daniel',
    titre: 'What *the city* sees',
    texte: 'The figures, and an alert with no report.',
    voix: 'Daniel, for the city, follows his assemblies. Three weeks without a report: an alert shows up.',
  },

  t2: { titre: 'The Bertoua message', texte: 'Read, answer, correct.', voix: 'Part two: the Bertoua message study.' },
  e2: {
    role: 'samuel',
    titre: 'The *Bertoua message* tile',
    texte: 'On the app’s home screen.',
    voix: 'The study opens from the home screen, with the Bertoua message tile.',
  },
  e3: {
    role: 'samuel',
    titre: 'The *unit*, the *lesson*',
    texte: 'Lesson 1: The Cost.',
    voix: 'Samuel opens the unit, then picks today’s lesson.',
  },
  e4: {
    role: 'samuel',
    titre: '*Read* before the lesson',
    texte: 'The manual’s notes, for him alone.',
    voix: 'Before starting, the manual’s notes. Only the leader sees them.',
  },
  e5: {
    role: 'samuel',
    titre: 'The *starting question*',
    texte: 'Here: the whole lesson.',
    voix: 'Then the starting point: here, the whole lesson. He can start elsewhere.',
  },
  e6: {
    role: 'samuel',
    titre: '*Start*',
    texte: 'The session is open.',
    voix: 'He taps Start: the session is open.',
  },
  e1: {
    role: 'assemblee',
    titre: 'We read *together*',
    texte: 'Preface and chapter 1.',
    voix: 'First, we read today’s portion together: the preface and chapter one.',
  },
  e7: {
    role: 'marie',
    titre: '“*Live*”',
    texte: 'Mary taps Answer.',
    voix: 'On Mary’s phone, the tile shows Live. She taps Answer.',
  },
  e8: {
    role: 'marie',
    titre: 'All kinds of *questions*',
    texte: 'True or false, boxes, written answers.',
    voix: 'True or false, tick boxes, written answers, personal questions.',
  },
  e9: {
    role: 'marie',
    titre: '*Saved*, even offline',
    texte: 'No network, nothing lost.',
    voix: 'Every answer is saved. Without a network, they are sent later.',
  },
  e10: {
    role: 'papier',
    titre: 'No smartphone: *paper*',
    texte: 'A booklet, or a notebook.',
    voix: 'No smartphone? Paul answers in his booklet, Helen in a notebook.',
  },
  e11: {
    role: 'samuel',
    titre: '*Move to correction*',
    texte: 'Once everyone has answered.',
    voix: 'Once everyone has answered, Samuel taps Move to correction.',
  },
  e12: {
    role: 'samuel',
    titre: '*Stop* after question…',
    texte: 'Short of time? The rest, next Sunday.',
    voix: 'Short of time? He stops after question eleven. The rest, next Sunday.',
  },
  e13: {
    role: 'marie',
    titre: 'Closed questions *mark themselves*',
    texte: 'And answering is locked.',
    voix: 'Answering is locked. Closed questions are marked automatically.',
  },
  e14: {
    role: 'jean',
    titre: 'We *swap phones*',
    texte: 'Right, Needs detail or Review.',
    voix: 'We swap phones. John checks against the manual’s answer, and picks a verdict.',
  },
  e15: {
    role: 'jean',
    titre: 'The personal question *stays hidden*',
    texte: 'John only sees “answered”.',
    voix: 'The personal question stays hidden: John only sees that it has an answer.',
  },
  e16: {
    role: 'samuel',
    titre: '*Finish*',
    texte: 'Scores are closed.',
    voix: 'Every verdict is in: Samuel taps Finish.',
  },
  e17: {
    role: 'marie',
    titre: 'Everyone sees *their score*',
    texte: '8.5 out of 11, for this session.',
    voix: 'Everyone sees their score at once: Mary has eight and a half out of eleven.',
  },
  e18: {
    role: 'marie',
    titre: '*This week*…',
    texte: 'What each member must do.',
    voix: 'Below it: what each member must do this week.',
  },
  e19: {
    role: 'samuel',
    titre: '*Paper copies*',
    texte: 'Samuel enters Paul’s and Helen’s scores.',
    voix: 'In the results, Samuel adds the score from Paul’s booklet and Helen’s notebook.',
  },
  e20: {
    role: 'marie',
    titre: '*My progress*',
    texte: '6 / 9 questions. Her score, hers alone.',
    voix: 'My progress: six questions out of nine. A member only sees their own score.',
  },
  e21: {
    role: 'rose',
    titre: 'Missed it? *Catch up*',
    texte: 'Rose answers on her own, at home.',
    voix: 'Rose was absent. She catches up on the session on her own, at home.',
  },
  e22: {
    role: 'rose',
    titre: '*Send my paper*',
    texte: 'Corrections come after sending.',
    voix: 'Corrections and the manual’s answers only appear once she has sent her paper.',
  },
  e23: {
    role: 'rose',
    titre: 'Until *another lesson*',
    texte: 'Then catching up closes.',
    voix: 'Catching up stays open until another lesson has started.',
  },
  e24: {
    role: 'samuel',
    titre: 'Next Sunday: *carry on*',
    texte: 'Questions 12 to 31.',
    voix: 'The next Sunday, the lesson resumes at question twelve.',
  },
  e25: {
    role: 'marie',
    titre: 'Answers *already given*',
    texte: 'Mary finds them again: nothing to redo.',
    voix: 'Mary finds the answers she had already given. Nothing to redo.',
  },
  e26: {
    role: 'samuel',
    titre: 'The *assembly’s* progress',
    texte: 'Lessons done, everyone’s score.',
    voix: 'Samuel sees the lessons done and each member’s score.',
  },
  e27: {
    role: 'daniel',
    titre: 'The city sees *the whole picture*',
    texte: 'Never what is in the papers.',
    voix: 'Daniel sees how far each assembly has got, never what is in the papers.',
  },

  t3: { titre: 'How the two connect', texte: 'When the assembly has both.', voix: 'Finally, how the two connect.' },
  l1: {
    role: 'samuel',
    titre: 'The report *suggests the lesson*',
    texte: 'On a study day, it is pre-ticked.',
    voix: 'On a study day, the report already ticks the lesson studied. Samuel can untick it.',
  },

  c1: {
    titre: 'In short: *the journal*',
    texte: ['New report', 'Present, bread, chapters', 'Save, copy', 'PDF journal'],
    voix: 'In short: after every meeting, a report, saved and then shared.',
  },
  c2: {
    titre: 'In short: *the study*',
    texte: ['Start', 'Read, answer', 'Correct together', 'Finish', 'Catch up'],
    voix: 'For the study: start, read, answer, correct together, finish. And those absent catch up.',
  },
  c3: {
    titre: 'Bertoua message, simply.',
    texte: '',
    voix: 'Bertoua message, simply.',
  },
};

const CARTONS_EN: typeof CARTONS_FR = {
  roles: {
    samuel: 'LEADER · SAMUEL',
    marie: 'MEMBER · MARY',
    jean: 'JOHN CORRECTS MARY',
    rose: 'MEMBER · ROSE',
    daniel: 'CITY · DANIEL',
    papier: 'PAUL · HELEN',
    assemblee: 'THE ASSEMBLY',
  },
  parties: {
    intro: 'INTRODUCTION',
    journal: 'PART 1 · THE JOURNAL',
    etude: 'PART 2 · THE BERTOUA MESSAGE',
    lien: 'HOW THE TWO CONNECT',
    fin: 'IN SHORT',
  },
  etape: (n: number, total: number) => `Step ${n} of ${total}`,
  numeros: { t1: '1', t2: '2', t3: '+' },
  titreVideo: ['The assembly journal', 'and the Bertoua message'],
  personnes: [
    { nom: 'Samuel', role: 'leader' },
    { nom: 'Mary', role: 'member' },
    { nom: 'John', role: 'member' },
    { nom: 'Esther', role: 'member' },
    { nom: 'Paul', role: 'his booklet' },
    { nom: 'Helen', role: 'a notebook' },
    { nom: 'Rose', role: 'absent' },
    { nom: 'Daniel', role: 'the city' },
  ],
  supports: ['PAUL’S BOOKLET', 'HELEN’S NOTEBOOK'],
  fin: ['Bertoua message,', 'simply', '.'],
};

const APP_EN: typeof APP_FR = {
  range: (a: string, b: string) => `questions ${a} to ${b}`, // study.range
  wholeLesson: 'the whole lesson', // study.home.wholeLesson
  sessionRange: (r: string) => `This session: ${r}`, // study.home.sessionRange
  nextRange: (r: string) => `Next: ${r}`, // study.home.nextRange
  startPick: 'Starting question', // study.home.startPick
  startPickFirst: 'Default: the beginning of the lesson. Tap another question to start elsewhere.', // study.home.startPickFirst
  startPickNext: (n: string) => `Default: question ${n}, the first one not yet covered. Tap another question to start elsewhere.`, // study.home.startPickNext
  covered: (r: string) => `Already covered: ${r}`, // study.home.covered
  continue: 'Continue', // study.home.continue
  copies: (n: number) => `${n} ${n === 1 ? 'copy' : 'copies'}`, // study.home.copies_*
  catchUpTitle: 'To catch up', // study.home.catchUpTitle
  catchUpHint: 'You missed the session: answer the questions on your own, then send your paper.', // study.home.catchUpHint
  catchUpAction: 'Catch up', // study.home.catchUpAction
  noCurrent: 'No study in progress', // study.home.noCurrent
  noCurrentHint: 'When your leader starts a session, it will show up here.', // study.home.noCurrentHint
  briefingTitle: 'Read before the lesson', // study.briefing.title
  unitNotes: 'About this unit', // study.briefing.unitNotes
  lessonNotes: 'Notes for this lesson', // study.briefing.lessonNotes
  memberActionsPreview: 'Preview — each member will have to:', // study.briefing.memberActions
  memberActionsTitle: 'This week, each member must:', // study.memberActions.title
  leaderNotes: 'Leader notes', // study.leader.notes
  stopAfter: 'Stop after question:', // study.leader.stopAfter
  stopLast: 'last', // study.leader.stopLast
  stopAfterCut: (n: string) =>
    `Questions after Q${n} will be removed from this session (neither marked nor scored); answers already given will carry over to the next session on this lesson. Answering will be locked and closed questions marked.`, // study.leader.stopAfterCut
  catchUpSessionHint:
    "Catch-up: answer on your own, at your own pace. Corrections and the manual's answers will show once you have sent your paper.", // study.session.catchUpHint
  catchUpSubmit: 'Send my paper', // study.session.catchUpSubmit
  questionsCovered: (a: number, b: number) => `${a} / ${b} questions`, // study.progress.questionsCovered
  memberHint: "Your assembly's meeting reports, read-only.", // assemblyLife.memberHint
  present: 'Present', // assemblyLife.present
  absent: 'Absent', // assemblyLife.absent
  mineTitle: 'My progress', // assemblyLife.progress.mineTitle
  mineSub: (n: number) => (n === 1 ? `Chapters read at the meeting you attended (${n} meeting).` : `Chapters read at the meetings you attended (${n} meetings).`), // assemblyLife.progress.mineSub_*
  assemblyTitle: 'Assembly progress', // assemblyLife.progress.assemblyTitle
  studySuggestionHint:
    'Chapter pre-selected from the "Bertoua message" study session held on the meeting day: untick it if it was not read.', // assemblyLife.form.studySuggestionHint
};

export type CartonsGuide = typeof CARTONS_FR;
export type AppGuide = typeof APP_FR;

export interface TextesGuide {
  plans: Plans;
  cartons: CartonsGuide;
  app: AppGuide;
}

export const TEXTES_GUIDE: Record<Langue, TextesGuide> = {
  fr: { plans: PLANS_FR, cartons: CARTONS_FR, app: APP_FR },
  en: { plans: PLANS_EN, cartons: CARTONS_EN, app: APP_EN },
};

/** Texte du panneau, sans les marques `*` : ce qui se lit à l'écran (durée de lecture). */
export const texteLu = (p: TextePlan) =>
  [p.titre, ...(Array.isArray(p.texte) ? p.texte : [p.texte])].join(' ').replace(/\*/g, '');

/** Nombre de mots de la voix. */
export const motsVoix = (p: TextePlan) => p.voix.split(/\s+/).filter((m) => /[\p{L}\p{N}]/u.test(m)).length;

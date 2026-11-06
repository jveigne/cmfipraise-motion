/**
 * Textes de la vidéo « L'Étude de l'assemblée » (Shephr), par langue (`TEXTES_ETUDE.fr` / `.en`,
 * modèle de `src/journal/textes.ts` ; version anglaise `EtudeEN` demandée par JP le 21/10/2026, même
 * forme `TextesEtude`). Les composants les lisent par `useEtude()` (`langue.tsx`), jamais par
 * import direct : aucune chaîne visible n'est écrite en dur ailleurs que dans ce fichier et dans
 * `donnees.ts`.
 *
 * - `legendes` : les légendes du storyboard (docs/storyboard-etude.md § 4), deux lignes au plus ;
 *   `*mot*` passe en argile. Typographie française : espace fine insécable (U+202F) avant ? ! ;,
 *   insécable (U+00A0) avant : et dans « », apostrophe ’. Anglais : adaptation, pas du mot à mot
 *   (storyboard § 10), typographie anglaise (rien avant ? ! : ;), apostrophe ’, guillemets “ ”.
 * - `cartons` : textes hors de l'app (pastilles de partie et de personne, bascule, intertitres, fin,
 *   illustrations et annotations vidéo).
 * - `app` : les libellés de l'app, copiés à la lettre de
 *   shephr-app/mobile/utils/i18n/locales/fr.json, clés `study.*` surtout (clé en commentaire),
 *   apostrophes droites comprises : la vidéo montre exactement ce que l'utilisateur verra
 *   (plan 21/10 § 7.1). Les pluriels suivent i18next en français (0 et 1 au singulier). En
 *   anglais : en.json, mêmes clés ; pluriels i18next anglais (1 seul au singulier : « 0 respondents »).
 */
import type { Langue } from '../textes';

const FINE = ' ';
const INSEC = ' ';

const LEGENDES_FR = {
  // Le problème (P1–P4)
  p1: ['Le dimanche,', '*une assemblée de maison*.'],
  p1Cahiers: ['Chacun répond', '*dans son cahier*.'],
  p2: ['On échange *les cahiers*,', 'on corrige *à la main*.'],
  p3: ['Les notes, sur une feuille…', 'et elles *se perdent*.'],
  p4Chacun: [`Où en est chacun${FINE}?`, '*Personne ne sait.*'],
  p4Ville: ['Et la ville', '*ne voit rien*.'],
  // 1 · Lire (P6–P7)
  p6: ['D’abord, on lit', '*la leçon ensemble*.'],
  p7Tuile: ['Le dirigeant touche', '*Le Message de Bertoua*.'],
  p7Lecon: ['Il choisit', '*la leçon du jour*.'],
  p7Geste: [`Un geste${INSEC}:`, '*Commencer*.'],
  p7Ouverte: [`La séance est ouverte${INSEC}:`, 'chacun peut *répondre*.'],
  // 2 · Répondre (P8–P11)
  p8EnCours: ['Chez chacun, la tuile', `passe *«${INSEC}En cours${INSEC}»*.`],
  p8: ['Les questions arrivent', '*sur chaque téléphone*.'],
  p9Types: ['Vrai ou faux, cases,', '*réponses écrites*…'],
  p9Enregistre: ['Chaque réponse', '*s’enregistre aussitôt*.'],
  p9Perso: ['…et questions', '*personnelles*.'],
  p10Reseau: ['Sans réseau,', '*rien n’est perdu*.'],
  p10Retour: ['Les réponses partent', '*au retour du réseau*.'],
  p11Tous: ['Tout le monde répond,', '*même sans smartphone*.'],
  p11Livret: [`Pas d’application${FINE}?`, 'On répond *dans son livret*…'],
  p11Cahier: ['…ou *dans un cahier*,', 'comme aujourd’hui.'],
  // 3 · Corriger (P12–P14)
  p12Repondu: [`Chacun a répondu${FINE}?`, '*Passer à la correction*.'],
  p12Verrou: ['La saisie se verrouille', '*sur chaque téléphone*.'],
  p13Bascule: ['Chaque téléphone passe', '*en correction*.'],
  p13Fermees: ['Les questions fermées', '*se corrigent seules*.'],
  p13Cases: [`Une case fausse, une oubliée${INSEC}:`, '*2 points sur 4*.'],
  p14Echange: ['On échange', '*les téléphones*.'],
  p14Manuel: ['Le voisin compare avec', '*la réponse du manuel*.'],
  p14Avis: ['*Juste*, *À préciser*,', '*À revoir*.'],
  p14Perso: ['La question personnelle', '*reste masquée*.'],
  // 4 · Terminer (P15–P16)
  p15Terminer: [`Tous les avis sont posés${INSEC}:`, '*Terminer*.'],
  p15Note: ['Et chacun voit', '*sa note*, aussitôt.'],
  p16Resultats: ['Le dirigeant voit', '*les résultats de chacun*.'],
  p16Papier: [`Des réponses sur papier${FINE}?`, '*Une copie papier*, la note seule.'],
  p16Paul: ['Il saisit la note', '*du livret de Paul*…'],
  p16Helene: ['…puis celle', '*du cahier d’Hélène*.'],
  p16Resultat: ['Les copies papier', '*rejoignent les résultats*.'],
  // 5 · Au fil des réunions (P17–P18)
  p17Dimanches: ['Dimanche après dimanche,', '*leçon après leçon*.'],
  p17Progression: [`*3 leçons sur 5*${INSEC}:`, 'chacun voit où il en est.'],
  p18Avancement: ['La ville voit', '*l’avancement des assemblées*…'],
  p18Notes: ['…leçon par leçon,', '*avec les notes*…'],
  p18Perso: ['…jamais les réponses', '*personnelles*.'],
} as const;

const CARTONS_FR = {
  /** Pastilles de partie (gabarit de `PastillePartie` de « Journal »), storyboard § 2. */
  parties: {
    probleme: 'LE PROBLÈME',
    lire: '1 · LIRE',
    repondre: '2 · RÉPONDRE',
    corriger: '3 · CORRIGER',
    terminer: '4 · TERMINER',
    aufil: '5 · AU FIL DES RÉUNIONS',
  },
  /**
   * Intertitres de 2,5 s avant les parties 2 à 5 (modèle d'« Évènements » ; la partie 1 suit la
   * bascule P5, qui lui sert d'ouverture) : numéro, titre, une phrase d'explication.
   */
  intertitres: {
    repondre: { numero: '2', titre: 'Répondre', phrase: 'Sur son téléphone, ou sur papier.' },
    corriger: { numero: '3', titre: 'Corriger', phrase: 'On échange les téléphones.' },
    terminer: { numero: '4', titre: 'Terminer', phrase: 'Chacun voit sa note.' },
    aufil: { numero: '5', titre: 'Au fil des réunions', phrase: 'Dimanche après dimanche.' },
  },
  /** Pastilles de personne, au-dessus des téléphones (annotation vidéo, § 2). */
  pastilles: {
    samuel: 'SAMUEL · DIRIGEANT',
    marie: 'MARIE',
    jean: 'JEAN',
    esther: 'ESTHER',
    paul: 'PAUL',
    helene: 'HÉLÈNE',
    daniel: 'DANIEL · VILLE',
  },
  /**
   * P14 : la copie et la personne qui tient le téléphone (annotation vidéo : l'écran livré ne porte
   * aucun nom, RG-ETU-10, storyboard § 7.4).
   */
  copie: (de: string, mains: string) => ['Copie de ', de, ' · ', 'entre les mains de ', mains] as const,
  /** P5 : « On lit, on répond, on corrige ensemble. » (présentation au pasteur). */
  bascule: ['On lit, on répond,', 'on corrige ', 'ensemble', '.'],
  /** P19 : « Le Message de Bertoua, simplement. » (JP 21/10). */
  fin: ['Le Message de Bertoua,', 'simplement', '.'],

  /** Étiquettes posées sous les personnages (P1, P2, P11). */
  etiquettes: {
    samuel: 'Samuel · dirigeant',
    marie: 'Marie',
    jean: 'Jean',
    esther: 'Esther',
    paul: 'Paul',
    helene: 'Hélène',
  },
  /** Livre et livrets (couvertures dessinées, pas celles de l'éditeur : § 7.4). */
  livre: 'Disciple coûte que coûte',
  livret: ['Livret de l’étudiant', 'UEMB002'],
  /** P6 : la double page lue et la leçon ouverte dans les livrets. */
  pagesLivre: ['Préface', 'Chapitre 1'],
  leconLivret: 'Leçon 1 · Le prix à payer',
  /** P2 : les cahiers de Marie et de Jean ; la ligne réécrite pendant la correction à la main. */
  cahierMarie: ['Leçon 1', 'Q1. Que nous fassions des disciples.', 'Q11. b c f a'],
  cahierJean: ['Leçon 1', 'Q1. Faire des disciples.', 'Q11. b c g'],
  reecriture: `Q11${INSEC}: 2 ou 3${FINE}?`,
  /** P5 : l'étiquette des petits cahiers aspirés par la bascule. */
  cahierEtiquette: 'LEÇON 1',
  /** P3 : la feuille volante de Samuel. */
  feuille: ['Marie 10,5', 'Jean 9', 'Esther 12,5', `Paul${FINE}?`],
  /** P4 : les trois questions autour de Samuel, la ville au-dessus. */
  questions: [`Qui a fait la leçon 3${FINE}?`, `Où en est Paul${FINE}?`, `Qui a besoin d’aide${FINE}?`],
  ville: 'VILLE · PARIS',
  /**
   * P11 : le livret de Paul (questions imprimées, réponses à la main) et le cahier d'Hélène
   * (lignes manuscrites seules) ; la légende sous chacun.
   */
  livretPaul: {
    entete: 'Leçon 1 · Le prix à payer',
    lignes: [
      { imprime: `1. Quel est l’appel ultime du Seigneur Jésus${FINE}?`, main: 'L’appel à faire des disciples.' },
      { imprime: '5. Le Seigneur Jésus a vécu une vie sans péché.', main: 'Oui' },
      { imprime: '6. Le disciple doit être discipliné.', main: 'Vrai' },
      { imprime: `7.a Que montrent ces passages${FINE}?`, main: 'Tous ont péché.' },
    ],
  },
  cahierHelene: ['Leçon 1', 'Q1. Faire des disciples.', 'Q5. Oui', 'Q6. Vrai', 'Q7.a Tous ont péché.'],
  supports: ['SON LIVRET', 'UN CAHIER'],
  /** P17 : la frise des dimanches (les deux dernières leçons en pointillé). */
  frise: [
    { jour: 'DIM. 25 OCT.', lecon: 'Leçon 1' },
    { jour: 'DIM. 1ER NOV.', lecon: 'Leçon 2' },
    { jour: 'DIM. 8 NOV.', lecon: 'Leçon 3' },
    { jour: null, lecon: 'Leçon 4' },
    { jour: null, lecon: 'Leçon 5' },
  ],
  /** P18 : l'enveloppe au cadenas (D-ETU-09, à faire confirmer par le pasteur). */
  enveloppe: ['Réponses de Marie', 'Marie et son dirigeant seulement'],
};

/** Pluriel i18next en français : 0 et 1 au singulier. */
const pluriel = (n: number, un: string, plusieurs: string) => (n <= 1 ? un : plusieurs);

/** `fmtPoints` (utils/format.ts) : sans zéro inutile, virgule décimale ; `null` → « – ». */
const fmtPointsFr = (n: number | null | undefined) => (n == null ? '–' : String(Math.round(n * 100) / 100).replace('.', ','));

const APP_FR = {
  fmtPoints: fmtPointsFr,
  // home.tsx — mois capitalisé, jour, virgule, année (ordre de l'app) : la réunion du dimanche
  // 25 octobre 2026 ; la vue de la ville le lundi 9 novembre, lendemain de la leçon 3.
  dateSamuel: 'Octobre 25, 2026',
  dateDaniel: 'Novembre 9, 2026',
  welcomeBack: 'Bon retour,', // dashboard.welcomeBack
  myGoals: 'Mes objectifs', // dashboard.myGoals
  myGoalsSub: 'But Quinquennal — engagements & état actuel', // dashboard.myGoalsSub
  onglets: ['Accueil', 'Objectifs', 'Assemblée', 'Évènements', 'Profil'], // tabs.*
  tuiles: {
    events: 'Déclarer une action', // dashboard.tiles.events
    eventsHint: 'Évangélisation', // dashboard.tiles.eventsHint
    documents: 'Documents', // dashboard.tiles.documents
    documentsHint: 'Enseignements à lire et partager', // dashboard.tiles.documentsHint
    structure: 'Créer une assemblée', // dashboard.tiles.structure
    structureHint: 'Dans la ville de votre choix', // dashboard.tiles.structureHint
    membres: 'Membres', // dashboard.tiles.membres
    membresHint: 'Annuaire de votre périmètre', // dashboard.tiles.membresHint
    hierarchie: 'Hiérarchie', // dashboard.tiles.hierarchie
    hierarchieHint: 'Votre leadership', // dashboard.tiles.hierarchieHint
    cantique: 'Cantiques', // dashboard.tiles.cantique
    cantiqueHint: 'Chris est Vainqueur', // dashboard.tiles.cantiqueHint (tel quel dans fr.json)
  },

  tile: {
    title: 'Le Message de Bertoua', // study.tile.title
    hint: "Étude de l'assemblée", // study.tile.hint
    live: 'En cours', // study.tile.live
  },
  kicker: "Étude de l'assemblée", // study.kicker
  lesson: (n: number) => `Leçon ${n}`, // study.lesson
  lessonTitled: (n: number, titre: string) => `Leçon ${n} · ${titre}`, // study.lessonTitled
  score: (note: string, max: string) => `${note} / ${max}`, // study.score
  points: (v: number) => `${fmtPointsFr(v)} ${pluriel(v, 'pt', 'pts')}`, // study.points_one / _other
  status: {
    REPONSES_OUVERTES: 'Réponses ouvertes', // study.status.REPONSES_OUVERTES
    CORRECTION: 'Correction', // study.status.CORRECTION
    TERMINEE: 'Terminée', // study.status.TERMINEE
  },
  types: { PERSONNELLE: 'Personnelle', EXERCICE: 'Exercice' }, // study.types.*
  verdict: { JUSTE: 'Juste', A_PRECISER: 'À préciser', A_REVOIR: 'À revoir' }, // study.verdict.*
  values: { VRAI: 'Vrai', FAUX: 'Faux', OUI: 'Oui', NON: 'Non' }, // study.values.*

  home: {
    answer: 'Répondre', // study.home.answer
    startSession: 'Commencer une séance', // study.home.startSession
    lessonsDone: (fait: number, total: number) => `${fait} / ${total} leçons`, // study.home.lessonsDone
    start: 'Commencer', // study.home.start
    startTitle: 'Commencer la séance ?', // study.home.startTitle
    startConfirm: (lecon: string) => `${lecon} — les répondants pourront répondre dès maintenant.`, // study.home.startConfirm
    sessions: 'Séances terminées', // study.home.sessions
    noSessions: "Aucune séance terminée pour l'instant.", // study.home.noSessions
    unitProgress: "Avancement de l'assemblée", // study.home.unitProgress
    myProgress: 'Ma progression', // study.home.myProgress
    overviewTitle: 'Avancement des assemblées', // study.home.overviewTitle
  },
  session: {
    answered: (fait: number, total: number) => `${fait} / ${total} répondues`, // study.session.answered
    saving: 'enregistrement…', // study.session.save.saving
    saved: 'enregistré ✓', // study.session.save.saved
    offlinePending: 'Hors ligne — vos réponses sont sur le téléphone et partiront au retour du réseau.', // study.session.offlinePending
    correctionHint:
      'Échangez les téléphones : votre voisin lit la réponse donnée et la réponse du manuel, puis choisit un avis.', // study.session.correctionHint
    writtenLeft: (n: number) => `${n} ${pluriel(n, 'réponse écrite restante', 'réponses écrites restantes')}`, // study.session.writtenLeft_*
    writtenDone: 'Toutes les réponses écrites ont un avis.', // study.session.writtenDone
    noAnswerCorrection: "Vous n'avez pas répondu dans l'application : rien à corriger sur ce téléphone.", // study.session.noAnswerCorrection
    myScore: 'Ma note', // study.session.myScore
    noCopy: "Vous n'avez pas de copie dans l'application pour cette séance.", // study.session.noCopy
  },
  question: {
    number: (n: string) => `Q${n}`, // study.question.number
    placeholder: 'Votre réponse…', // study.question.placeholder
    exerciseDone: 'Fait', // study.question.exerciseDone
    exerciseDoneMark: 'Fait ✓', // study.question.exerciseDoneMark
    noAnswer: 'Sans réponse', // study.question.noAnswer
    given: 'Réponse donnée', // study.question.given
    manual: 'Réponse du manuel', // study.question.manual
    wrong: 'faux', // study.question.wrong
    expected: 'bonne réponse', // study.question.expected
    personalAnswered: 'Question personnelle — répondu ✓', // study.question.personalAnswered
  },
  leader: {
    panel: 'Dirigeant', // study.leader.panel
    results: 'Résultats', // study.leader.results
    respondents: (n: number) => `${n} ${pluriel(n, 'répondant', 'répondants')}`, // study.leader.respondents_*
    showKey: 'Afficher les réponses du manuel', // study.leader.showKey
    toCorrection: 'Passer à la correction', // study.leader.toCorrection
    toCorrectionConfirm: 'La saisie sera verrouillée sur les téléphones et les questions fermées corrigées.', // study.leader.toCorrectionConfirm
    cancel: 'Annuler la séance', // study.leader.cancel
    reviewsLeft: (n: number) => `${n} ${pluriel(n, 'avis restant', 'avis restants')}`, // study.leader.reviewsLeft_*
    reviewsDone: 'Tous les avis sont posés.', // study.leader.reviewsDone
    finish: 'Terminer', // study.leader.finish
    finishConfirm: 'Les notes seront arrêtées. Vous pourrez encore ajuster des points depuis les résultats.', // study.leader.finishConfirm
    finished: (n: number) => `Séance terminée — ${n} ${pluriel(n, 'copie', 'copies')}`, // study.leader.finished_*
  },
  results: {
    kicker: 'Résultats', // study.results.kicker
    outOf: (max: string) => `note sur ${max}`, // study.results.outOf
    copies: (n: number) => `${n} ${pluriel(n, 'copie', 'copies')}`, // study.results.copies_*
    paper: 'papier', // study.results.paper
    answeredCount: (n: number) => `${n} ${pluriel(n, 'réponse', 'réponses')}`, // study.results.answeredCount_*
    addPaper: 'Ajouter une copie papier', // study.results.addPaper
    addPaperHint: 'Pour un membre qui a répondu sur son livret (ou rattrape une séance) : sa note seule.', // study.results.addPaperHint
    member: 'Membre', // study.results.member
    scoreOutOf: (max: string) => `Note (sur ${max})`, // study.results.scoreOutOf
  },
  progress: {
    unitTitle: "Avancement de l'assemblée", // study.progress.unitTitle
    mineTitle: 'Ma progression', // study.progress.mineTitle
    members: 'Membres', // study.progress.members
    lastSession: (date: string) => `Dernière séance le ${date}`, // study.progress.lastSession
    cumulative: (note: string, max: string) => `Note cumulée : ${note} / ${max}`, // study.progress.cumulative
    notDone: 'Pas encore faite', // study.progress.notDone
  },
  common: { cancel: 'Annuler', save: 'Enregistrer', choose: 'Choisir…' }, // common.*
};

// ---------------------------------------------------------------------------------------------

/** Type d'un texte « élargi » : chaînes littérales → `string`, tableaux gardés à leur longueur. */
type Elargi<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends (...a: infer A) => infer R
      ? (...a: A) => Elargi<R>
      : T extends object
        ? { readonly [K in keyof T]: Elargi<T[K]> }
        : T;

export type LegendesEtude = Elargi<typeof LEGENDES_FR>;
export type CartonsEtude = Elargi<typeof CARTONS_FR>;
export type AppEtude = Elargi<typeof APP_FR>;

export interface TextesEtude {
  legendes: LegendesEtude;
  cartons: CartonsEtude;
  app: AppEtude;
}

// ---------------------------------------------------------------------------------------------
// Version anglaise (`EtudeEN`, JP 21/10/2026) : mêmes clés, mêmes longueurs de tableaux (le type
// dérivé du français l'impose). Légendes : même sens, même rythme, deux lignes au plus.

const LEGENDES_EN: LegendesEtude = {
  // The problem (P1–P4)
  p1: ['On Sunday,', '*a house assembly*.'],
  p1Cahiers: ['Everyone answers', '*in their notebook*.'],
  p2: ['We swap *notebooks*,', 'we correct *by hand*.'],
  p3: ['Scores, on a loose sheet…', 'and they *get lost*.'],
  p4Chacun: ['Where is everyone up to?', '*Nobody knows.*'],
  p4Ville: ['And the city', '*sees nothing*.'],
  // 1 · Read (P6–P7)
  p6: ['First, we read', '*the lesson together*.'],
  p7Tuile: ['The leader taps', '*Bertoua message*.'],
  p7Lecon: ['He picks', '*today’s lesson*.'],
  p7Geste: ['One tap:', '*Start*.'],
  p7Ouverte: ['The session is open:', 'everyone can *answer*.'],
  // 2 · Answer (P8–P11)
  p8EnCours: ['On every phone, the tile', 'shows *“Live”*.'],
  p8: ['The questions arrive', '*on every phone*.'],
  p9Types: ['True or false, boxes,', '*written answers*…'],
  p9Enregistre: ['Every answer', '*is saved at once*.'],
  p9Perso: ['…and *personal*', '*questions*.'],
  p10Reseau: ['No network,', '*nothing is lost*.'],
  p10Retour: ['Answers are sent', '*once back online*.'],
  p11Tous: ['Everyone answers,', '*even without a smartphone*.'],
  p11Livret: ['No app?', 'Answer *in your booklet*…'],
  p11Cahier: ['…or *in a notebook*,', 'just like today.'],
  // 3 · Correct (P12–P14)
  p12Repondu: ['Has everyone answered?', '*Move to correction*.'],
  p12Verrou: ['Answering is locked', '*on every phone*.'],
  p13Bascule: ['Every phone moves', '*to correction*.'],
  p13Fermees: ['Closed questions', '*correct themselves*.'],
  p13Cases: ['One wrong box, one missed:', '*2 points out of 4*.'],
  p14Echange: ['We swap', '*phones*.'],
  p14Manuel: ['The neighbour checks against', '*the manual’s answer*.'],
  p14Avis: ['*Right*, *Needs detail*,', '*Review*.'],
  p14Perso: ['The personal question', '*stays hidden*.'],
  // 4 · Finish (P15–P16)
  p15Terminer: ['Every verdict is in:', '*Finish*.'],
  p15Note: ['And everyone sees', '*their score*, right away.'],
  p16Resultats: ['The leader sees', '*everyone’s results*.'],
  p16Papier: ['Answers on paper?', '*A paper copy*, the score only.'],
  p16Paul: ['He enters the score', '*from Paul’s booklet*…'],
  p16Helene: ['…then the one', '*from Helen’s notebook*.'],
  p16Resultat: ['The paper copies', '*join the results*.'],
  // 5 · Meeting after meeting (P17–P18)
  p17Dimanches: ['Sunday after Sunday,', '*lesson after lesson*.'],
  p17Progression: ['*3 lessons out of 5*:', 'everyone sees where they are.'],
  p18Avancement: ['The city sees', '*each assembly’s progress*…'],
  p18Notes: ['…lesson by lesson,', '*with the scores*…'],
  p18Perso: ['…never anyone’s', '*personal answers*.'],
};

const CARTONS_EN: CartonsEtude = {
  parties: {
    probleme: 'THE PROBLEM',
    lire: '1 · READ',
    repondre: '2 · ANSWER',
    corriger: '3 · CORRECT',
    terminer: '4 · FINISH',
    aufil: '5 · MEETING AFTER MEETING',
  },
  intertitres: {
    repondre: { numero: '2', titre: 'Answer', phrase: 'On your phone, or on paper.' },
    corriger: { numero: '3', titre: 'Correct', phrase: 'We swap phones.' },
    terminer: { numero: '4', titre: 'Finish', phrase: 'Everyone sees their score.' },
    aufil: { numero: '5', titre: 'Meeting after meeting', phrase: 'Sunday after Sunday.' },
  },
  pastilles: {
    samuel: 'SAMUEL · LEADER',
    marie: 'MARY',
    jean: 'JOHN',
    esther: 'ESTHER',
    paul: 'PAUL',
    helene: 'HELEN',
    daniel: 'DANIEL · CITY',
  },
  /** « Copy of Mary · held by John » : le nom reste en deuxième et en dernier, comme en français. */
  copie: (de: string, mains: string) => ['Copy of ', de, ' · ', 'held by ', mains] as const,
  bascule: ['We read, we answer,', 'we correct ', 'together', '.'],
  /** P19 : « Bertoua message, simply. » (JP 21/10 ; « Bertoua message » = `study.tile.title`). */
  fin: ['Bertoua message,', 'simply', '.'],

  etiquettes: {
    samuel: 'Samuel · leader',
    marie: 'Mary',
    jean: 'John',
    esther: 'Esther',
    paul: 'Paul',
    helene: 'Helen',
  },
  /** Titre anglais du livre de Z. T. Fomum (« Disciple coûte que coûte »). */
  livre: 'Discipleship at Any Cost',
  livret: ['Student booklet', 'UEMB002'],
  pagesLivre: ['Preface', 'Chapter 1'],
  leconLivret: 'Lesson 1 · The Cost',
  cahierMarie: ['Lesson 1', 'Q1. That we make disciples.', 'Q11. b c f a'],
  cahierJean: ['Lesson 1', 'Q1. Make disciples.', 'Q11. b c g'],
  reecriture: 'Q11: 2 or 3?',
  cahierEtiquette: 'LESSON 1',
  feuille: ['Mary 10.5', 'John 9', 'Esther 12.5', 'Paul?'],
  questions: ['Who did lesson 3?', 'How far is Paul?', 'Who needs help?'],
  ville: 'CITY · LEEDS',
  livretPaul: {
    entete: 'Lesson 1 · The Cost',
    lignes: [
      { imprime: '1. What is the Lord Jesus’ ultimate call?', main: 'The call to make disciples.' },
      { imprime: '5. The Lord Jesus lived a life without sin.', main: 'Yes' },
      { imprime: '6. The disciple must be disciplined.', main: 'True' },
      { imprime: '7.a What do these passages show?', main: 'All have sinned.' },
    ],
  },
  cahierHelene: ['Lesson 1', 'Q1. Make disciples.', 'Q5. Yes', 'Q6. True', 'Q7.a All have sinned.'],
  supports: ['HIS BOOKLET', 'A NOTEBOOK'],
  /** Frise : jour abrégé à l'anglaise (« SUN 25 OCT »), mêmes dimanches. */
  frise: [
    { jour: 'SUN 25 OCT', lecon: 'Lesson 1' },
    { jour: 'SUN 1 NOV', lecon: 'Lesson 2' },
    { jour: 'SUN 8 NOV', lecon: 'Lesson 3' },
    { jour: null, lecon: 'Lesson 4' },
    { jour: null, lecon: 'Lesson 5' },
  ],
  enveloppe: ['Mary’s answers', 'Mary and her leader only'],
};

/** Pluriel i18next en anglais : 1 seul au singulier (0 et 0,5 au pluriel). */
const plurielEn = (n: number, un: string, plusieurs: string) => (n === 1 ? un : plusieurs);

/** `fmtPoints(n, 'en')` (utils/format.ts) : sans zéro inutile, point décimal ; `null` → « – ». */
const fmtPointsEn = (n: number | null | undefined) => (n == null ? '–' : String(Math.round(n * 100) / 100));

/**
 * Libellés de l'app anglaise (en.json, mêmes clés que `APP_FR`). Seule entorse, comme « Journal »
 * (storyboard-journal § 10.5) : la date de l'accueil. `home.tsx` la compose avec `monthLabel`
 * (utils/format.ts), dont les mois sont en français en dur : l'app anglaise afficherait
 * « Octobre 25, 2026 ». La vidéo la montre traduite (mois de `common.monthsLong`, ordre de
 * `home.tsx`), décision à confirmer par JP.
 */
const APP_EN: AppEtude = {
  fmtPoints: fmtPointsEn,
  dateSamuel: 'October 25, 2026',
  dateDaniel: 'November 9, 2026',
  welcomeBack: 'Welcome back,', // dashboard.welcomeBack
  myGoals: 'My goals', // dashboard.myGoals
  myGoalsSub: 'Five-Year Goal — pledges & current status', // dashboard.myGoalsSub
  onglets: ['Home', 'Goals', 'Assembly', 'Events', 'Profile'], // tabs.*
  tuiles: {
    events: 'Record an action', // dashboard.tiles.events
    eventsHint: 'Evangelism', // dashboard.tiles.eventsHint
    documents: 'Documents', // dashboard.tiles.documents
    documentsHint: 'Teachings to read and share', // dashboard.tiles.documentsHint
    structure: 'Create an assembly', // dashboard.tiles.structure
    structureHint: 'In the city of your choice', // dashboard.tiles.structureHint
    membres: 'Members', // dashboard.tiles.membres
    membresHint: "Your scope's directory", // dashboard.tiles.membresHint
    hierarchie: 'Hierarchy', // dashboard.tiles.hierarchie
    hierarchieHint: 'Your leadership', // dashboard.tiles.hierarchieHint
    cantique: 'Hymn', // dashboard.tiles.cantique
    cantiqueHint: 'Chris The Victor', // dashboard.tiles.cantiqueHint (tel quel dans en.json)
  },

  tile: {
    title: 'Bertoua message', // study.tile.title
    hint: 'Assembly study', // study.tile.hint
    live: 'Live', // study.tile.live
  },
  kicker: 'Assembly study', // study.kicker
  lesson: (n: number) => `Lesson ${n}`, // study.lesson
  lessonTitled: (n: number, titre: string) => `Lesson ${n} · ${titre}`, // study.lessonTitled
  score: (note: string, max: string) => `${note} / ${max}`, // study.score
  points: (v: number) => `${fmtPointsEn(v)} ${plurielEn(v, 'pt', 'pts')}`, // study.points_one / _other
  status: {
    REPONSES_OUVERTES: 'Answering', // study.status.REPONSES_OUVERTES
    CORRECTION: 'Correction', // study.status.CORRECTION
    TERMINEE: 'Finished', // study.status.TERMINEE
  },
  types: { PERSONNELLE: 'Personal', EXERCICE: 'Exercise' }, // study.types.*
  verdict: { JUSTE: 'Right', A_PRECISER: 'Needs detail', A_REVOIR: 'Review' }, // study.verdict.*
  values: { VRAI: 'True', FAUX: 'False', OUI: 'Yes', NON: 'No' }, // study.values.*

  home: {
    answer: 'Answer', // study.home.answer
    startSession: 'Start a session', // study.home.startSession
    lessonsDone: (fait: number, total: number) => `${fait} / ${total} lessons`, // study.home.lessonsDone
    start: 'Start', // study.home.start
    startTitle: 'Start the session?', // study.home.startTitle
    startConfirm: (lecon: string) => `${lecon} — respondents can answer right away.`, // study.home.startConfirm
    sessions: 'Finished sessions', // study.home.sessions
    noSessions: 'No finished session yet.', // study.home.noSessions
    unitProgress: 'Assembly progress', // study.home.unitProgress
    myProgress: 'My progress', // study.home.myProgress
    overviewTitle: "Assemblies' progress", // study.home.overviewTitle
  },
  session: {
    answered: (fait: number, total: number) => `${fait} / ${total} answered`, // study.session.answered
    saving: 'saving…', // study.session.save.saving
    saved: 'saved ✓', // study.session.save.saved
    offlinePending: 'Offline — your answers are on the phone and will be sent when the network is back.', // study.session.offlinePending
    correctionHint: "Swap phones: your neighbour reads the given answer and the manual's answer, then picks a verdict.", // study.session.correctionHint
    writtenLeft: (n: number) => `${n} ${plurielEn(n, 'written answer left', 'written answers left')}`, // study.session.writtenLeft_*
    writtenDone: 'Every written answer has a verdict.', // study.session.writtenDone
    noAnswerCorrection: 'You did not answer in the app: nothing to correct on this phone.', // study.session.noAnswerCorrection
    myScore: 'My score', // study.session.myScore
    noCopy: 'You have no app copy for this session.', // study.session.noCopy
  },
  question: {
    number: (n: string) => `Q${n}`, // study.question.number
    placeholder: 'Your answer…', // study.question.placeholder
    exerciseDone: 'Done', // study.question.exerciseDone
    exerciseDoneMark: 'Done ✓', // study.question.exerciseDoneMark
    noAnswer: 'No answer', // study.question.noAnswer
    given: 'Given answer', // study.question.given
    manual: "Manual's answer", // study.question.manual
    wrong: 'wrong', // study.question.wrong
    expected: 'right answer', // study.question.expected
    personalAnswered: 'Personal question — answered ✓', // study.question.personalAnswered
  },
  leader: {
    panel: 'Leader', // study.leader.panel
    results: 'Results', // study.leader.results
    respondents: (n: number) => `${n} ${plurielEn(n, 'respondent', 'respondents')}`, // study.leader.respondents_*
    showKey: "Show the manual's answers", // study.leader.showKey
    toCorrection: 'Move to correction', // study.leader.toCorrection
    toCorrectionConfirm: 'Answering will be locked on the phones and closed questions corrected.', // study.leader.toCorrectionConfirm
    cancel: 'Cancel the session', // study.leader.cancel
    reviewsLeft: (n: number) => `${n} ${plurielEn(n, 'verdict left', 'verdicts left')}`, // study.leader.reviewsLeft_*
    reviewsDone: 'Every verdict is in.', // study.leader.reviewsDone
    finish: 'Finish', // study.leader.finish
    finishConfirm: 'Scores will be closed. You can still adjust points from the results.', // study.leader.finishConfirm
    finished: (n: number) => `Session finished — ${n} ${plurielEn(n, 'copy', 'copies')}`, // study.leader.finished_*
  },
  results: {
    kicker: 'Results', // study.results.kicker
    outOf: (max: string) => `out of ${max}`, // study.results.outOf
    copies: (n: number) => `${n} ${plurielEn(n, 'copy', 'copies')}`, // study.results.copies_*
    paper: 'paper', // study.results.paper
    answeredCount: (n: number) => `${n} ${plurielEn(n, 'answer', 'answers')}`, // study.results.answeredCount_*
    addPaper: 'Add a paper copy', // study.results.addPaper
    addPaperHint: 'For a member who answered in the booklet (or catches up on a session): the score only.', // study.results.addPaperHint
    member: 'Member', // study.results.member
    scoreOutOf: (max: string) => `Score (out of ${max})`, // study.results.scoreOutOf
  },
  progress: {
    unitTitle: 'Assembly progress', // study.progress.unitTitle
    mineTitle: 'My progress', // study.progress.mineTitle
    members: 'Members', // study.progress.members
    lastSession: (date: string) => `Last session on ${date}`, // study.progress.lastSession
    cumulative: (note: string, max: string) => `Cumulative score: ${note} / ${max}`, // study.progress.cumulative
    notDone: 'Not done yet', // study.progress.notDone
  },
  common: { cancel: 'Cancel', save: 'Save', choose: 'Choose…' }, // common.*
};

/** Textes par langue. */
export const TEXTES_ETUDE: Partial<Record<Langue, TextesEtude>> = {
  fr: { legendes: LEGENDES_FR, cartons: CARTONS_FR, app: APP_FR },
  en: { legendes: LEGENDES_EN, cartons: CARTONS_EN, app: APP_EN },
};

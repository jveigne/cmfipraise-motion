/**
 * Textes de la vidéo « Journal de l'assemblée », par langue (`TEXTES_JOURNAL.fr` / `.en`, modèle
 * de `src/textes.ts` pour « Catégories » ; version anglaise demandée par JP le 14/10/2026). Les
 * composants les lisent par `useJournal()` (`langue.tsx`), jamais par import direct.
 *
 * - `legendes` : les cartons du storyboard (docs/storyboard-journal.md § 4), deux lignes au plus ;
 *   `*mot*` passe en argile. Typographie française : espace fine insécable (U+202F) avant ? ! ;,
 *   insécable (U+00A0) avant : et dans « », apostrophe ’.
 *   Anglais : adaptation, pas du mot à mot (storyboard, « Version anglaise »), typographie
 *   anglaise (rien avant ? ! : ;), apostrophe ’.
 * - `app` : les libellés de l'app, copiés à la lettre de
 *   shephr-app/mobile/utils/i18n/locales/fr.json et en.json (clé en commentaire). Ne pas les
 *   reformuler : la vidéo doit montrer exactement ce que l'utilisateur verra (« Ce qui a été
 *   fait: » compris), y compris là où l'app anglaise affiche encore du français (voir `APP_EN`).
 */
import type { Langue } from '../textes';

const FINE = ' ';
const INSEC = ' ';

const LEGENDES_FR = {
  p1: ['Chaque réunion', 's’écrit *au cahier*.'],
  p2: ['Un seul exemplaire…', 'et il se *perd*.'],
  p3: ['Le dirigeant change,', '*le cahier s’en va*.'],
  p4: [`Dix ans plus tard${INSEC}:`, 'une *pile de cahiers*.'],
  p5Compter: [`Combien de présents${FINE}?`, '*Tout recompter.*'],
  p5Ville: ['Et la ville', '*ne voit rien*.'],
  p7: ['Après la réunion,', '*le compte rendu*.'],
  p8: ['Les présents,', '*la fraction de pain*.'],
  p9: [`Les chapitres lus${INSEC}:`, '*le texte s’écrit seul*.'],
  p10: ['Un geste,', '*prêt pour WhatsApp*.'],
  p11Grandit: ['Réunion après réunion,', '*le journal grandit*.'],
  p11Annees: ['1 an, 5 ans,', `*10 ans*${INSEC}: tout est là.`],
  p12: ['Livre après livre,', '*l’avancement est suivi*.'],
  p13Pdf: ['Le journal *en PDF*,', 'sur la période choisie.'],
  p13Annee: ['Une année entière,', '*en un geste*.'],
  p14Synthese: ['En tête,', '*la synthèse de l’année*.'],
  p14Reunions: ['Puis chaque réunion,', '*dans l’ordre*.'],
  p15: ['Prêt à *imprimer*,', 'année après année.'],
  p16Stats: ['Le dirigeant de ville', 'voit *ses assemblées*.'],
  p16Alerte: [`Plus de compte rendu${FINE}?`, '*L’alerte s’affiche*.'],
  p17: ['Plusieurs assemblées,', '*un seul PDF*.'],
} as const;

/** Cartons sans téléphone et annotations vidéo (hors de l'app). */
const CARTONS_FR = {
  /** P6 : la bascule, sur la montée du chant. */
  titre: ['Le journal', 'de ', 'l’assemblée'],
  sousTitre: 'Tenu dans l’app, d’année en année.',
  /** P18 : « Votre histoire, préservée. » (choix du storyboard § 4, P18). */
  fin: ['Votre histoire,', 'préservée', '.'],
  /** Pastilles de partie (gabarit de `PastilleChapitre` d'« Évènements »). */
  parties: {
    cahier: 'LE CAHIER',
    saisir: '1 · SAISIR',
    conserver: '2 · CONSERVER',
    imprimer: '3 · IMPRIMER',
    hierarchie: '4 · HIÉRARCHIE',
  },
  /** P1 : étiquette et page manuscrites du cahier. */
  etiquetteCahier: ['Comptes rendus', 'Paris Nord'],
  pageCahier: [
    'Mercredi 7 octobre',
    `Présents${INSEC}: Antoine, Camille,`,
    'Claire, Élise, Julien, Léa…',
    `Fraction de pain${INSEC}: oui`,
    `Lecture${INSEC}: chapitre 12`,
  ],
  /** P5 : quelques comptes rendus sur une même page. */
  pageComptes: [
    `14 janvier${INSEC}: 8 présents`,
    `pain${INSEC}: oui · chap. 7`,
    `21 janvier${INSEC}: 9 présents`,
    `pain${INSEC}: oui`,
    `28 janvier${INSEC}: 7 présents`,
    `pain${INSEC}: non · chap. 8`,
  ],
  /** P2 : le carton de déménagement. */
  demenagement: 'DÉMÉNAGEMENT',
  /** P3 : les deux silhouettes. */
  ancienDirigeant: 'Ancien dirigeant',
  nouveauDirigeant: 'Nouveau dirigeant',
  /** P5 : les questions sans réponse, la ville. */
  questions: [`Présence moyenne${FINE}?`, `Fractions de pain${FINE}?`, `Où en est le livre${FINE}?`],
  ville: 'VILLE · PARIS',
  /** P11 : la frise des années. */
  unAn: '1 an',
  cinqAns: '5 ans',
  dixAns: '10 ans',
  nouveauDirigeant2024: 'Nouveau dirigeant · 2024',
  totalComptesRendus: (n: number) => `${n.toLocaleString('fr-FR').replace(/\s/g, INSEC)} comptes rendus`,
  /** P15 : feuille de partage iOS (libellés du système, pas de fr.json). */
  partage: {
    typeDocument: 'Document PDF',
    apps: ['AirDrop', 'Messages', 'Mail', 'WhatsApp'],
    actions: ['Copier', 'Imprimer', 'Enregistrer dans Fichiers'],
  },
} as const;

const APP_FR = {
  onglets: ['Accueil', 'Objectifs', 'Assemblée', 'Évènements', 'Profil'], // tabs.*

  /** home.tsx : mois capitalisé, jour, virgule, année — l'ordre est celui de l'app. */
  dateAccueil: 'Octobre 14, 2026',
  welcomeBack: 'Bon retour,', // dashboard.welcomeBack
  myGoals: 'Mes objectifs', // dashboard.myGoals
  myGoalsSub: 'But Quinquennal — engagements & état actuel', // dashboard.myGoalsSub
  tuiles: {
    events: 'Déclarer une action', // dashboard.tiles.events
    eventsHint: 'Évangélisation', // dashboard.tiles.eventsHint
    structure: 'Créer une assemblée', // dashboard.tiles.structure
    structureHint: 'Dans la ville de votre choix', // dashboard.tiles.structureHint
    membres: 'Membres', // dashboard.tiles.membres
    membresHint: 'Annuaire de votre périmètre', // dashboard.tiles.membresHint
    hierarchie: 'Hiérarchie', // dashboard.tiles.hierarchie
    hierarchieHint: 'Votre leadership', // dashboard.tiles.hierarchieHint
  },

  // assemblyLife.*
  title: "Vie d'assemblée",
  subtitle: "Réunions, comptes rendus et avancement des modules d'enseignement.",
  tabMeetings: 'Réunions',
  tabProgress: 'Avancement',
  newReport: 'Nouveau CR',
  attendees: (n: number) => `${n} présent${n > 1 ? 's' : ''}`, // assemblyLife.attendees_*
  breadBreaking: 'Fraction de pain',
  noReading: 'Pas de lecture',
  progress: {
    readOf: (lus: number, total: number) => `${lus} / ${total} chapitres`, // progress.readOf
    last: (n: number, date: string) => `Dernier : chapitre ${n} · ${date}`, // progress.last
  },
  form: {
    titleNew: 'Nouveau compte rendu',
    date: 'Date de la réunion',
    attendees: 'Présents',
    checkAll: 'Tout cocher',
    uncheckAll: 'Tout décocher',
    leaderTag: 'dirigeant',
    reading: 'Lecture',
    noModule: 'Aucune',
    chapters: 'Chapitres',
    alreadyReadHint: "Un point signale un chapitre déjà lu par l'assemblée.",
    save: 'Enregistrer le CR',
  },
  reportUi: {
    preview: 'Aperçu du CR',
    includeAttendees: 'Inclure la liste des présents',
    copy: 'Copier',
    share: 'Partager',
    copied: 'Compte rendu copié : collez-le dans WhatsApp.',
  },
  detail: { title: 'Compte rendu', attendees: 'Présents', reading: 'Lecture', yes: 'Oui' },
  journal: {
    open: 'Journal PDF',
    title: "Journal de l'assemblée",
    periodicity: 'Périodicité',
    kinds: ['Mois', 'Trimestre', 'Semestre', 'Année'],
    reportCount: (n: number) => `${n} compte${n > 1 ? 's' : ''} rendu${n > 1 ? 's' : ''} sur cette période`,
    contentHint:
      'Le journal contient une synthèse de la période (réunions, présence moyenne, fractions de pain, lectures) puis chaque compte rendu dans l\'ordre chronologique.',
    generate: 'Générer le PDF',
    docTitle: "Journal de l'assemblée",
    generatedOn: (d: string) => `Édité le ${d}`,
    summary: 'Synthèse de la période',
    statMeetings: 'Réunions',
    statAverage: 'Présence moyenne',
    statBread: 'Fractions de pain',
    readings: 'Lectures',
    reports: 'Comptes rendus',
    attendees: 'Présents',
    breadBreaking: 'Fraction de pain',
    reading: 'Lecture',
    noReading: 'Aucune lecture',
    yes: 'Oui', // assemblyLife.report.yes
    no: 'Non', // assemblyLife.report.no
  },
  hierarchy: {
    title: 'Vie d\'assemblée', // assemblyLife.hierarchy.title
    statMeetings: 'Réunions',
    statActive: 'Assemblées actives',
    statAlert: 'Sans CR > 3 sem.',
    statAverage: 'Présence moy.',
    statDistinct: 'Personnes distinctes',
    statBread: 'Fractions de pain',
    alertTitle: 'Sans compte rendu depuis 3 semaines',
    distinctNote: 'Une personne qui fréquente plusieurs assemblées est comptée dans chacune.',
    journalAll: 'Journal PDF de ma hiérarchie',
    scopeAll: 'Toute ma hiérarchie',
    docTitle: 'Journal des assemblées',
    unitsTitle: 'Assemblées',
    cols: ['Assemblée', 'Ville', 'Réunions', 'Présence moy.', 'Fractions de pain', 'Dernier CR'],
    leaderSummary: (n: number) => `${n} assemblée${n > 1 ? 's' : ''}`, // leaderSummary_*
    alertCount: (n: number) => `${n} ⚠`, // alertCount_*
  },
  // hierarchy.* / supervisor.*
  hierarchie: {
    title: 'Hiérarchie',
    intro: 'Votre leadership : vos dirigeants, leurs assemblées et les membres de ces assemblées.',
    reportsTo: 'Vous rendez compte à',
    you: 'Vous',
    viewLeaders: 'Dirigeants',
    viewUnits: 'Assemblées',
    supervisorTitle: 'Mon superviseur',
    supervisorHint: 'Déclarer à qui vous rendez compte, ou voir qui vous supervisez.',
    roleDirigeant: 'Dirigeant', // MODULE_ROLE_LABELS.DIRIGEANT (services/authApi.ts)
    roleDirigeantUnite: "Dirigeant d'unité", // MODULE_ROLE_LABELS.DIRIGEANT_UNITE
    unitsCount: (n: number) => `${n} assemblée${n > 1 ? 's' : ''}`, // hierarchy.unitsCount_*
  },
  /** assemblyLife.report.* : le texte du CR (`buildMeetingReport`, utils/meetingReport.ts). */
  report: {
    header: (d: string) => `CR Assemblée ${d}`,
    unitLine: (n: string) => `*Assemblée de maison : ${n}`,
    attendeeCount: (n: number) => ` - Nombre de frères présents  : ${n}`,
    done: 'Ce qui a été fait:',
    breadBreaking: (v: string) => `- Fraction de pain: ${v}`,
    yes: 'Oui',
    no: 'Non',
    reading: (livre: string, chapitres: string) => `- Lecture du livre ${livre}, ${chapitres}`,
    chapterOne: (n: number) => `chapitre ${n}`,
    chapterMany: (liste: string, dernier: number) => `chapitres ${liste} et ${dernier}`,
    chapterSep: ', ',
    /** Débuts des lignes éclairées dans l'aperçu (annotation vidéo) : fraction de pain, lecture. */
    lignesCles: ['- Fraction', '- Lecture'],
  },
} as const;

// ---------------------------------------------------------------------------------------------
// Version anglaise (JP 14/10/2026) : mêmes clés, mêmes longueurs de tableaux.

const LEGENDES_EN: Legendes = {
  p1: ['Every meeting', 'goes *in the notebook*.'],
  p2: ['Just one copy…', 'and it gets *lost*.'],
  p3: ['The leader moves on,', '*the notebook goes too*.'],
  p4: ['Ten years later:', 'a *stack of notebooks*.'],
  p5Compter: ['How many came?', '*Count it all again.*'],
  p5Ville: ['And the city', '*sees nothing*.'],
  p7: ['After the meeting,', '*the report*.'],
  /** Revue 14/10 : deux noms parallèles, comme « Les présents, la fraction de pain ». */
  p8: ['Attendance,', '*the breaking of bread*.'],
  /** Revue 14/10 : « The chapters read: » se lisait comme une phrase avant la 2e ligne. */
  p9: ['Pick the chapters:', '*the text writes itself*.'],
  p10: ['One tap,', '*ready for WhatsApp*.'],
  p11Grandit: ['Meeting after meeting,', '*the journal grows*.'],
  p11Annees: ['1 year, 5 years,', '*10 years*: it’s all there.'],
  p12: ['Book after book,', '*progress is tracked*.'],
  p13Pdf: ['The journal *as a PDF*,', 'for the period you choose.'],
  p13Annee: ['A whole year,', '*in one tap*.'],
  p14Synthese: ['First,', '*the year at a glance*.'],
  p14Reunions: ['Then every meeting,', '*in order*.'],
  p15: ['Ready to *print*,', 'year after year.'],
  p16Stats: ['The city leader', 'sees *every assembly*.'],
  p16Alerte: ['Reports stopped?', '*An alert shows up*.'],
  p17: ['Several assemblies,', '*one single PDF*.'],
};

const CARTONS_EN: Cartons = {
  titre: ['The assembly', '', 'journal'],
  sousTitre: 'Kept in the app, year after year.',
  /** Équivalent idiomatique de « Votre histoire, préservée. ». */
  fin: ['Your story,', 'safely kept', '.'],
  parties: {
    cahier: 'THE NOTEBOOK',
    saisir: '1 · RECORD',
    conserver: '2 · KEEP',
    imprimer: '3 · PRINT',
    hierarchie: '4 · HIERARCHY',
  },
  etiquetteCahier: ['Meeting notes', 'Leeds North'],
  pageCahier: ['Wednesday 7 October', 'Present: Andrew, Chloe,', 'Claire, Emily, James, Lucy…', 'Bread breaking: yes', 'Reading: chapter 12'],
  pageComptes: ['14 January: 8 present', 'bread: yes · ch. 7', '21 January: 9 present', 'bread: yes', '28 January: 7 present', 'bread: no · ch. 8'],
  demenagement: 'MOVING',
  ancienDirigeant: 'Former leader',
  nouveauDirigeant: 'New leader',
  /** Revue 14/10 : texte de la vidéo (pas un libellé de l'app) — « Bread breakings? » sonnait faux. */
  questions: ['Average attendance?', 'Bread broken?', 'How far in the book?'],
  ville: 'CITY · LEEDS',
  unAn: '1 year',
  cinqAns: '5 years',
  dixAns: '10 years',
  nouveauDirigeant2024: 'New leader · 2024',
  totalComptesRendus: (n: number) => `${n.toLocaleString('en-GB')} reports`,
  /** Feuille de partage iOS en anglais (libellés du système). */
  partage: {
    typeDocument: 'PDF Document',
    apps: ['AirDrop', 'Messages', 'Mail', 'WhatsApp'],
    actions: ['Copy', 'Print', 'Save to Files'],
  },
};

/**
 * Libellés de l'app anglaise (en.json). Deux endroits restent en français dans l'app elle-même :
 * la date de l'accueil (`monthLabel` de utils/format.ts, mois français en dur) et les rôles de la
 * Hiérarchie (`MODULE_ROLE_LABELS` de services/authApi.ts, non traduits). Revue 14/10 : la vidéo
 * les montre traduits (« Octobre » passait pour une coquille), tels que l'app les afficherait une
 * fois ces deux points passés en i18n — décision à confirmer par JP.
 */
const APP_EN: App = {
  onglets: ['Home', 'Goals', 'Assembly', 'Events', 'Profile'], // tabs.*

  /**
   * home.tsx : « Mois jour, année » (ordre de l'app, inchangé) avec le mois de `common.monthsLong`.
   * Revue 14/10 : l'app actuelle affiche encore « Octobre » (`monthLabel` non traduit).
   */
  dateAccueil: 'October 14, 2026',
  welcomeBack: 'Welcome back,', // dashboard.welcomeBack
  myGoals: 'My goals', // dashboard.myGoals
  myGoalsSub: 'Five-Year Goal — pledges & current status', // dashboard.myGoalsSub
  tuiles: {
    events: 'Record an action', // dashboard.tiles.events
    eventsHint: 'Evangelism', // dashboard.tiles.eventsHint
    structure: 'Create an assembly', // dashboard.tiles.structure
    structureHint: 'In the city of your choice', // dashboard.tiles.structureHint
    membres: 'Members', // dashboard.tiles.membres
    membresHint: "Your scope's directory", // dashboard.tiles.membresHint
    hierarchie: 'Hierarchy', // dashboard.tiles.hierarchie
    hierarchieHint: 'Your leadership', // dashboard.tiles.hierarchieHint
  },

  // assemblyLife.*
  title: 'Assembly life',
  subtitle: 'Meetings, reports and progress through the teaching modules.',
  tabMeetings: 'Meetings',
  tabProgress: 'Progress',
  newReport: 'New report',
  attendees: (n: number) => `${n} present`, // assemblyLife.attendees_one / _other
  breadBreaking: 'Bread breaking',
  noReading: 'No reading',
  progress: {
    readOf: (lus: number, total: number) => `${lus} / ${total} chapters`, // progress.readOf
    last: (n: number, date: string) => `Last: chapter ${n} · ${date}`, // progress.last
  },
  form: {
    titleNew: 'New report',
    date: 'Meeting date',
    attendees: 'Present',
    checkAll: 'Check all',
    uncheckAll: 'Uncheck all',
    leaderTag: 'leader',
    reading: 'Reading',
    noModule: 'None',
    chapters: 'Chapters',
    alreadyReadHint: 'A dot marks a chapter the assembly has already read.',
    save: 'Save report',
  },
  reportUi: {
    preview: 'Report preview',
    includeAttendees: 'Include the list of those present',
    copy: 'Copy',
    share: 'Share',
    copied: 'Report copied: paste it into WhatsApp.',
  },
  detail: { title: 'Report', attendees: 'Present', reading: 'Reading', yes: 'Yes' },
  journal: {
    open: 'PDF journal',
    title: 'Assembly journal',
    periodicity: 'Period',
    kinds: ['Month', 'Quarter', 'Half-year', 'Year'],
    reportCount: (n: number) => `${n} report${n === 1 ? '' : 's'} for this period`, // reportCount_one / _other
    contentHint:
      'The journal opens with a summary of the period (meetings, average attendance, bread breaking, readings), followed by each report in chronological order.',
    generate: 'Generate PDF',
    docTitle: 'Assembly journal',
    generatedOn: (d: string) => `Issued on ${d}`,
    summary: 'Period summary',
    statMeetings: 'Meetings',
    statAverage: 'Average attendance',
    statBread: 'Bread breaking',
    readings: 'Readings',
    reports: 'Reports',
    attendees: 'Present',
    breadBreaking: 'Bread breaking',
    reading: 'Reading',
    noReading: 'No reading',
    yes: 'Yes', // assemblyLife.report.yes
    no: 'No', // assemblyLife.report.no
  },
  hierarchy: {
    title: 'Assembly life', // assemblyLife.hierarchy.title
    statMeetings: 'Meetings',
    statActive: 'Active assemblies',
    /** Espace insécable dans « 3 wks » (revue 14/10) : « wks » ne part plus seul à la ligne. */
    statAlert: 'No report > 3\u00a0wks',
    statAverage: 'Avg. attendance',
    statDistinct: 'Distinct people',
    statBread: 'Bread breaking',
    alertTitle: 'No report for 3 weeks',
    distinctNote: 'Someone who attends several assemblies is counted in each of them.',
    journalAll: 'PDF journal of my hierarchy',
    scopeAll: 'My whole hierarchy',
    docTitle: 'Assemblies journal',
    unitsTitle: 'Assemblies',
    cols: ['Assembly', 'City', 'Meetings', 'Avg. attendance', 'Bread breakings', 'Last report'], // col*
    leaderSummary: (n: number) => `${n} assembl${n === 1 ? 'y' : 'ies'}`, // leaderSummary_*
    alertCount: (n: number) => `${n} ⚠`, // alertCount_*
  },
  // hierarchy.* / supervisor.*
  hierarchie: {
    title: 'Hierarchy',
    intro: 'Your leadership: your leaders, their assemblies and the members of those assemblies.', // hierarchy.introSubtree
    reportsTo: 'You report to',
    you: 'You',
    viewLeaders: 'Leaders',
    viewUnits: 'Assemblies',
    supervisorTitle: 'My supervisor', // supervisor.title
    supervisorHint: 'Declare who you report to, or see who you supervise.', // supervisor.shortcutHint
    // MODULE_ROLE_LABELS (services/authApi.ts) n'est pas traduit dans l'app (« Dirigeant »,
    // « Dirigeant d'unité ») ; revue 14/10 : libellés anglais, « Assembly leader » repris de
    // structure.leader (en.json).
    roleDirigeant: 'Leader',
    roleDirigeantUnite: 'Assembly leader',
    unitsCount: (n: number) => `${n} assembl${n === 1 ? 'y' : 'ies'}`, // hierarchy.unitsCount_*
  },
  report: {
    header: (d: string) => `Assembly report ${d}`,
    unitLine: (n: string) => `*House assembly: ${n}`,
    attendeeCount: (n: number) => ` - Number of brothers present: ${n}`,
    done: 'What was done:',
    breadBreaking: (v: string) => `- Breaking of bread: ${v}`,
    yes: 'Yes',
    no: 'No',
    reading: (livre: string, chapitres: string) => `- Reading of the book ${livre}, ${chapitres}`,
    chapterOne: (n: number) => `chapter ${n}`,
    chapterMany: (liste: string, dernier: number) => `chapters ${liste} and ${dernier}`,
    chapterSep: ', ',
    lignesCles: ['- Breaking', '- Reading'],
  },
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

type Legendes = Elargi<typeof LEGENDES_FR>;
type Cartons = Elargi<typeof CARTONS_FR>;
type App = Elargi<typeof APP_FR>;

export interface TextesJournal {
  legendes: Legendes;
  cartons: Cartons;
  app: App;
}

export const TEXTES_JOURNAL: Record<Langue, TextesJournal> = {
  fr: { legendes: LEGENDES_FR, cartons: CARTONS_FR, app: APP_FR },
  en: { legendes: LEGENDES_EN, cartons: CARTONS_EN, app: APP_EN },
};

/**
 * Chapitres lus, comme `formatNumbers` (utils/meetingReport.ts) : « chapitre 12 »,
 * « chapitres 13 et 14 », « chapters 7, 8 and 9 » ; triés et dédoublonnés.
 */
export const formatChapitres = (app: App, numeros: readonly number[]) => {
  const n = Array.from(new Set(numeros)).sort((a, b) => a - b);
  if (n.length === 0) return '';
  if (n.length === 1) return app.report.chapterOne(n[0]);
  return app.report.chapterMany(n.slice(0, -1).join(app.report.chapterSep), n[n.length - 1]);
};

/**
 * Textes de la vidéo « Offre Caleb » (Shephr), en français seulement (plan 27/10
 * `05_Plan_Offres_Caleb_Nehemie.md` § 9, V3). Aucune chaîne visible en dur hors de ce fichier et de
 * `donnees.ts`. AUCUN PRIX nulle part (§ 9).
 *
 * - `LEGENDES` : les cartons du storyboard (docs/storyboard-caleb.md § 4), deux lignes au plus ;
 *   `*mot*` passe en argile. Typographie française : espace fine insécable (U+202F) avant ? ! ;,
 *   insécable (U+00A0) avant : et dans « », apostrophe ’.
 * - `CARTONS` : textes hors de l'app (verset, titre, intertitres, pastilles de partie, illustrations,
 *   fin). Libellés commerciaux « Offre Caleb » / « Le suivi de ma hiérarchie » : plan § 3.8.
 * - `APP` : les libellés de l'app, copiés à la lettre de
 *   shephr-app/mobile/utils/i18n/locales/fr.json (clé en commentaire), apostrophes droites comprises :
 *   la vidéo montre exactement ce que l'utilisateur verra. Pluriels i18next français (0 et 1 au
 *   singulier). Les rôles viennent de `MODULE_ROLE_LABELS` (mobile/services/authApi.ts).
 */

const FINE = ' ';
const INSEC = ' ';

export const LEGENDES = {
  /** P3 — la carte, puis la chaîne. */
  p3Carte: ['Pas *la carte*', 'des villes…'],
  p3Chaine: ['…mais *votre chaîne*', 'de leadership.'],
  /** P4 — l'arbre de la Hiérarchie. */
  p4Arbre: ['Dans votre *Hiérarchie*,', 'toute votre chaîne.'],
  p4Ville: ['Même dans', '*une autre ville*.'],
  /** P5 — statistiques des comptes rendus. */
  p5Stats: ['Réunions, présences,', '*fraction du pain*.'],
  p5Alerte: [`Sans CR depuis 3 semaines${FINE}?`, '*L’alerte s’affiche*.'],
  p5Journal: ['Et le *journal PDF*', 'de toute la chaîne.'],
  /** P6 — le compte rendu d'une assemblée de la chaîne. */
  p6Assemblee: ['Chaque assemblée,', '*ses comptes rendus*.'],
  p6Detail: ['Écrits par son dirigeant,', '*lus par sa chaîne*.'],
  /** P7 — Le Message de Bertoua. */
  p7Bertoua: ['*Le Message de Bertoua*,', 'assemblée par assemblée.'],
  p7Jamais: [`Leçons, enseignés, notes${INSEC}:`, '*jamais les réponses*.'],
  /** P8 — Member Care. */
  p8Brebis: ['*Les brebis*', 'de toute la chaîne.'],
  p8Plume: ['Le dirigeant d’assemblée', '*garde la plume*.'],
  /** P9 — chacun pour soi. */
  p9Chacun: [`*Chacun pour soi*${INSEC}:`, 'une offre par dirigeant.'],
  p9Marc: ['L’offre de Daniel', '*n’ouvre rien à Marc*.'],
} as const;

export const CARTONS = {
  /** P1 — Josué 14 : 12, Louis Segond 1910 (plan § 3.8 et § 9). */
  verset: [`«${INSEC}Donne-moi donc`, `cette montagne${INSEC}»`],
  reference: `Josué 14${INSEC}:${INSEC}12`,
  traduction: 'Louis Segond 1910',
  /** P2 — le titre (libellés commerciaux du plan § 3.8). */
  offre: ['Offre ', 'Caleb'],
  sousTitre: 'Le suivi de ma hiérarchie',
  pourQui: ['Pour chaque dirigeant,', 'le long de ', 'sa chaîne de leadership', '.'],
  /** Pastilles de partie (gabarit de `PastillePartie` de « Journal »). */
  parties: {
    chaine: '1 · LA CHAÎNE',
    assemblees: '2 · LES ASSEMBLÉES',
    etude: '3 · BERTOUA ET BREBIS',
    chacun: '4 · CHACUN POUR SOI',
  },
  /** Intertitres de 2,5 s (gabarit de l'`Intertitre` d'« Étude ») : numéro, titre, une phrase. */
  intertitres: {
    chaine: { numero: '1', titre: 'La chaîne', phrase: 'Ceux qui vous rendent compte, où qu’ils soient.' },
    assemblees: { numero: '2', titre: 'Les assemblées', phrase: 'Comptes rendus, journal, statistiques.' },
    etude: { numero: '3', titre: 'Bertoua et les brebis', phrase: 'L’avancement de l’étude, le suivi pastoral.' },
  },
  /** P3 — étiquettes de la carte (illustration). */
  villes: { paris: 'PARIS', evry: 'ÉVRY' },
  vous: 'VOUS',
  /** P9 — la pastille de l'offre sur chaque carte de dirigeant (illustration, sans prix). */
  pastilleOffre: 'Offre Caleb',
  /** P10 — la fin (plan § 9 : « Disponible sur l'espace web Shephr »). */
  finOffre: 'Offre Caleb',
  fin: ['Disponible sur', 'l’espace web ', 'Shephr'],
} as const;

/** Pluriel i18next français : 0 et 1 au singulier. */
const pl = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

export const APP = {
  /** tabs.* — six onglets d'un dirigeant qui a Member Care (`(tabs)/_layout.tsx`, Dons masqués). */
  onglets: ['Accueil', 'Objectifs', 'Assemblée', 'Évènements', 'Brebis', 'Profil'],

  // hierarchy.* / supervisor.*
  hierarchie: {
    title: 'Hiérarchie', // hierarchy.title
    intro: 'Votre leadership : vos dirigeants, leurs assemblées et les membres de ces assemblées.', // hierarchy.introSubtree
    reportsTo: 'Vous rendez compte à', // hierarchy.reportsTo
    you: 'Vous', // hierarchy.you
    viewLeaders: 'Dirigeants', // hierarchy.viewLeaders
    viewUnits: 'Assemblées', // hierarchy.viewUnits
    supervisorTitle: 'Mon superviseur', // supervisor.title
    supervisorHint: 'Déclarer à qui vous rendez compte, ou voir qui vous supervisez.', // supervisor.shortcutHint
    unitsCount: (n: number) => `${n} ${pl(n, 'assemblée', 'assemblées')}`, // hierarchy.unitsCount_*
    membersCount: (n: number) => `${n} ${pl(n, 'membre', 'membres')}`, // hierarchy.membersCount_*
    leaderPrefix: (nom: string) => `Dirigeant : ${nom}`, // hierarchy.leaderPrefix
  },
  /** MODULE_ROLE_LABELS (mobile/services/authApi.ts). */
  roles: {
    senior: 'Dirigeant senior',
    dirigeant: 'Dirigeant',
    unite: "Dirigeant d'unité",
  },

  // assemblyLife.hierarchy.* (bloc « Vie d'assemblée » de la Hiérarchie)
  vie: {
    title: "Vie d'assemblée", // assemblyLife.hierarchy.title
    kinds: ['Mois', 'Trimestre', 'Semestre', 'Année'], // assemblyLife.journal.kind.*
    statMeetings: 'Réunions',
    statActive: 'Assemblées actives',
    statAverage: 'Présence moy.',
    statDistinct: 'Personnes distinctes',
    statBread: 'Fractions de pain',
    statAlert: 'Sans CR > 3 sem.',
    alertTitle: 'Sans compte rendu depuis 3 semaines',
    distinctNote: 'Une personne qui fréquente plusieurs assemblées est comptée dans chacune.',
    journalAll: 'Journal PDF de ma hiérarchie',
    journalOpen: 'Journal PDF', // assemblyLife.journal.open
    leaderSummary: (n: number) => `${n} ${pl(n, 'assemblée', 'assemblées')}`, // leaderSummary_*
    alertCount: (n: number) => `${n} ⚠`, // alertCount_*
    lastReport: (j: number) => (j === 0 ? "Dernier CR aujourd'hui" : `Dernier CR il y a ${j} j`), // lastReport_*
    lastReportShort: (j: number) => `dernier il y a ${j} j`, // lastReportShort_*
    averageLine: (v: string) => `${v} présents en moyenne`, // averageLine
    noRecentReport: 'Aucun CR depuis 3 semaines', // noRecentReport
  },

  // study.tile.title (libellé fixe D-ETU-04) + hierarchy.study.*
  etude: {
    title: 'Le Message de Bertoua', // study.tile.title
    yearTitle: (a: number) => `Année ${a}`,
    statSessions: 'Séances terminées',
    statLessons: 'Leçons faites',
    statTaught: 'Membres enseignés',
    statAverage: 'Note moyenne',
    via: (chaine: string) => `via ${chaine}`,
    lessonsDone: (fait: number, total: number) => `${fait} / ${total} leçons faites`,
    taught: (enseignes: number, n: number) => `${enseignes} / ${n} ${pl(n, 'enseigné', 'enseignés')}`, // taught_*
    notTaught: (n: number) => `${n} ${pl(n, 'non enseigné', 'non enseignés')}`, // notTaught_*
    average: (v: string) => `Moyenne ${v}`,
    lastSession: (date: string) => `Dernière séance le ${date}`,
    noSession: 'Aucune séance terminée',
    note: "Enseigné : au moins une copie comptée dans une séance terminée. Aucune réponse ni aucun nom de membre n'est affiché ici.",
  },

  // assemblyLife.* (onglet Assemblée) et détail d'un compte rendu
  assemblee: {
    title: "Vie d'assemblée", // assemblyLife.title
    subtitle: "Réunions, comptes rendus et avancement des modules d'enseignement.", // assemblyLife.subtitle
    unitPicker: 'Assemblée', // assemblyLife.unitPicker
    readOnly: "Lecture seule : seul le dirigeant de l'assemblée rédige les comptes rendus.", // assemblyLife.readOnly
    journalOpen: 'Journal PDF', // assemblyLife.journal.open
    detailTitle: 'Compte rendu', // assemblyLife.detail.title
    breadBreaking: 'Fraction de pain', // assemblyLife.breadBreaking
    reading: 'Lecture', // assemblyLife.detail.reading
    attendees: 'Présents', // assemblyLife.detail.attendees
    yes: 'Oui', // assemblyLife.detail.yes
  },

  // care.*
  care: {
    title: 'Suivi des brebis', // care.title
    subtitle: 'Les membres de votre assemblée et leur état spirituel.', // care.subtitle
    tabRecords: 'Suivi', // care.tabRecords
    tabAccountability: 'Redevabilité', // care.tabAccountability
    searchPlaceholder: 'Rechercher un membre…', // care.searchPlaceholder
    all: 'Tous', // common.all
    readOnly: "Lecture seule : seul le dirigeant de l'assemblée met à jour les fiches.", // care.readOnly
    lastAttendanceShort: (date: string) => `présent le ${date}`, // care.lastAttendanceShort
  },
} as const;

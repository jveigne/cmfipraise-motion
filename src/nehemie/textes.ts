/**
 * Textes de la vidéo « Offre Néhémie » (Shephr), en français (storyboard
 * `docs/storyboard-nehemie.md` § 7). Aucune chaîne visible en dur hors de ce fichier et de
 * `donnees.ts`.
 *
 * - `LEGENDES`, `CARTONS` : textes de la vidéo (annotation), typographie française : U+202F avant
 *   ? ! ; — U+00A0 avant : et dans « » — apostrophe ’. `*mot*` = mot clé en argile.
 * - `WEB` : libellés de l'espace web, copiés à la lettre de
 *   `shephr-app/web/src/i18n/locales/fr.json` (clé en commentaire ; apostrophe droite comme dans le
 *   fichier). Les pages du lot « Offres » pas encore codées (vue « Journal de la ville », statistiques
 *   d'Évènements dans la ville, plan 05 § 3.3, § 3.5, P-08) sont dessinées avec les libellés
 *   existants les plus proches : voir le storyboard § 7.3.
 * - Plan 05 § 3.8 : « Offre Néhémie », sous-titre « Le suivi de toute ma ville » ; verset Néhémie
 *   2 : 18, Louis Segond 1910 (« Ils dirent : Levons-nous, et bâtissons ! »). AUCUN PRIX (plan 05 § 9).
 */

const NB = ' ';
const FINE = ' ';

export const LEGENDES = {
  p3PourQui: ['Pour le *pasteur*', 'et les responsables de la ville.'],
  p3Regard: ['Toutes ses assemblées,', '*d’un seul regard*.'],
  p4Menu: [`Dans l’espace web${NB}:`, '*Suivi de la ville*.'],
  p5Lecons: ['Chaque assemblée,', '*leçon par leçon*.'],
  p5Finie: [`Bonamoussadi${NB}:`, '*5 leçons sur 5*.'],
  p5Pas: [`Deïdo${NB}:`, '*pas encore commencé*.'],
  p6Membres: [`Chaque membre${NB}:`, '*enseigné* ou non enseigné.'],
  p6Accompagner: ['Vous savez', '*qui accompagner*.'],
  p7Reunions: ['Les réunions', 'de *toute la ville*.'],
  p7Alerte: [`Deïdo${NB}: *aucun compte rendu*`, 'depuis 3 semaines.'],
  p7Nombres: ['Des *nombres*,', 'jamais de noms.'],
  p7Pdf: ['Le journal *en PDF*,', 'pour toute la ville.'],
  p8Fruits: [`Les *fruits* de la ville${NB}:`, 'conversions, baptêmes…'],
  p8Assemblees: ['Les évènements,', '*assemblée par assemblée*.'],
  p8Akwa: [`Akwa${NB}: *9 actions*,`, '12 conversions cette année.'],
  p9Responsables: ['Une ville,', '*tous ses responsables*.'],
  p9Chacun: ['De la ville à la nation,', '*chacun la suit*.'],
} as const;

export const CARTONS = {
  /** P1 — le verset (Louis Segond 1910). */
  verset: [`«${NB}Levons-nous,`, 'et ', 'bâtissons', `${FINE}!${NB}»`] as const,
  reference: `Néhémie 2${NB}: 18`,
  version: 'Louis Segond 1910',
  /** P2 — le nom de l'offre (plan 05 § 3.8). */
  offre: ['Offre ', 'Néhémie'] as const,
  sousTitre: 'Le suivi de toute ma ville',
  /** P3 — la ville illustrée. */
  villeEtiquette: 'VILLE · DOUALA',
  pasteur: 'Pasteur',
  responsable: 'Responsable',
  /** P9 — un responsable par niveau (annotation vidéo). */
  niveaux: ['VILLE', 'RÉGION', 'NATION'] as const,
  /** P10 — fin (plan 05 § 9 V2). */
  fin: ['Disponible sur', 'l’espace web Shephr'] as const,
  /** Intertitres de 2,5 s avant les parties 1 à 3 (gabarit d'« Étude »). */
  intertitres: {
    bertoua: { numero: '1', titre: 'Le Message de Bertoua', phrase: 'Toutes les assemblées, leçon par leçon.' },
    journal: { numero: '2', titre: 'Le journal de la ville', phrase: 'Toutes les réunions, sans aucun nom.' },
    evenements: { numero: '3', titre: 'Les évènements', phrase: 'À l’intérieur de la ville.' },
  },
  /** Pastilles de partie. */
  parties: {
    pourQui: 'POUR QUI',
    bertoua: '1 · LE MESSAGE DE BERTOUA',
    journal: '2 · LE JOURNAL DE LA VILLE',
    evenements: '3 · LES ÉVÈNEMENTS',
  },
} as const;

/** Libellés de l'espace web (`web/src/i18n/locales/fr.json`). */
export const WEB = {
  /** `index.html` <title>. */
  ongletNavigateur: 'shephr · Administration',
  /** `config/links.ts` (P1, JP 18/10) + route `/study/city`. */
  domaine: 'www.shephr.org',
  chemin: '/study/city',
  /** P4 : la page d'origine, avant le clic sur « Suivi de la ville » (route `/study`, accueil de
   * l'étude) — la barre d'adresse ne montre `/study/city` qu'après le clic (D-FIX vidéos, JP 29/10). */
  cheminEtude: '/study',
  /** `AppShell.tsx` › `.mobile-topbar-title`. */
  titreMobile: 'Shephr',
  /** `common.brand`, `common.administration`. */
  marque: 'shephr',
  administration: 'Administration',
  nav: {
    pilotage: 'Pilotage', // nav.section.pilotage
    organisation: 'Organisation', // nav.section.organisation
    goals: 'Objectifs', // nav.goals
    assembly: "Vie d'assemblée", // nav.assembly
    study: 'Le Message de Bertoua', // nav.study
    studyCity: 'Suivi de la ville', // nav.studyCity
    events: 'Évènements', // nav.events
    memberCare: 'Suivi pastoral', // nav.memberCare
    documents: 'Documents', // nav.documents
    structure: 'Structure', // nav.structure
    users: 'Membres', // nav.users
    hierarchy: 'Hiérarchie des dirigeants', // nav.hierarchy
  },
  ville: {
    titre: (ville: string) => `Suivi de la ville — ${ville}`, // cityStudy.titleCity
    titreCourt: 'Suivi de la ville', // cityStudy.title
    onglets: { overview: 'Assemblées', members: 'Membres', stats: 'Statistiques' }, // cityStudy.tabs.*
    assemblee: 'Assemblée', // cityStudy.overview.assembly
    membres: (n: number) => `${n} membres`, // cityStudy.overview.members_other
    avancement: 'Avancement', // cityStudy.overview.progress
    lecons: (n: number) => `${n} leçons`, // cityStudy.overview.lessons_other
    membre: 'Membre', // cityStudy.members.name
    enseigne: 'Enseigné', // cityStudy.members.taught
    leconsFaites: 'Leçons faites', // cityStudy.members.lessons
    compteMembres: (n: number) => `${n} membres`, // cityStudy.members.count_other
    statut: { TAUGHT: 'Enseigné', NOT_TAUGHT: 'Non enseigné' }, // cityStudy.status.*
    filtreStatut: 'Statut', // cityStudy.filters.status
    tousStatuts: 'Tous les membres', // cityStudy.filters.allStatuses
    filtreAssemblee: 'Assemblée', // cityStudy.filters.assembly
    toutesAssemblees: 'Toutes les assemblées', // cityStudy.filters.allAssemblies
    exportCsv: 'Exporter CSV', // cityStudy.export.csv
    exportPdf: 'Exporter PDF', // cityStudy.export.pdf
  },
  journal: {
    titre: "Vie d'assemblée · comptes rendus", // hierarchy.stats.title
    pdf: 'Journal PDF', // hierarchy.stats.journal
    precedente: 'Période précédente', // hierarchy.stats.previous
    reunions: 'Réunions tenues', // hierarchy.stats.meetings
    actives: 'Assemblées actives', // hierarchy.stats.active
    alerte: 'Sans CR depuis 3 semaines', // hierarchy.stats.alert
    moyenne: 'Présence moyenne', // hierarchy.stats.average
    distinctes: 'Personnes distinctes présentes', // hierarchy.stats.distinct
    pain: 'Fractions de pain', // hierarchy.stats.bread
    alerteListe: (liste: string) => `Sans compte rendu depuis 3 semaines : ${liste}`, // hierarchy.stats.alertList
    parAssemblee: 'Par assemblée', // assembly.journal.byUnit
    colAssemblee: 'Assemblée', // assembly.journal.colUnit
    colReunions: 'Réunions', // assembly.journal.colMeetings
    colMoyenne: 'Présence moy.', // assembly.journal.colAverage
    colPain: 'Fractions de pain', // assembly.journal.colBreadCount
    colDernier: 'Dernier CR', // assembly.journal.colLastReport
    docTitre: 'Journal des assemblées', // assembly.journal.docTitle
    edite: (date: string) => `Édité le ${date}`, // assembly.journal.generatedOn
    synthese: 'Synthèse de la période', // assembly.journal.summary
    statAlerte: 'Sans CR depuis 3 semaines', // assembly.journal.statAlert
    statMoyenne: 'Présence moyenne', // assembly.journal.statAverage
    statDistinctes: 'Personnes distinctes', // assembly.journal.statDistinct
    statPain: 'Fractions de pain', // assembly.journal.statBread
    statReunions: 'Réunions tenues', // assembly.journal.statMeetings
    statActives: 'Assemblées actives', // assembly.journal.statActive
    comptesRendus: 'Comptes rendus', // assembly.journal.reports
    presents: 'Présents', // assembly.journal.attendees
    fraction: 'Fraction de pain', // assembly.journal.breadBreaking
    lecture: 'Lecture', // assembly.journal.reading
    oui: 'Oui', // assembly.report.yes
    non: 'Non', // assembly.report.no
  },
  evenements: {
    periode: 'Période', // events.period.label
    annee: 'Année', // events.period.year
    actions: 'Actions comptées', // events.stats.kpiCount
    participants: 'Participants', // events.counters.participants
    invites: 'Invités', // events.counters.guests
    conversions: 'Conversions', // events.counters.conversions
    restaurations: 'Restaurations', // events.counters.restorations
    baptemes: 'Baptêmes', // events.counters.baptisms
    parAssemblee: 'Par assemblée', // events.stats.byLevel.UNIT
    descendre: "Cliquez sur une ligne pour descendre d'un niveau.", // events.stats.drillHint
    colNiveau: 'Niveau', // events.stats.colNode
    colActions: 'Actions', // events.stats.colCount
    /** events.stats.ownLevel_other avec `levelOf.LOCALITY` (« la ville {{name}} »). */
    propres: (n: number, ville: string) =>
      `Dont ${n} actions rattachées directement à la ville ${ville} : elles comptent à ce niveau, dans aucun sous-niveau.`,
  },
} as const;

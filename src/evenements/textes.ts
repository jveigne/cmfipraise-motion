/**
 * Textes de la vidéo « Évènements » (français uniquement).
 *
 * - `LEGENDES` : les cartons du storyboard (docs/storyboard-evenements.md § 4), une par plan,
 *   deux lignes au plus ; `*mot*` passe en argile.
 * - `APP` : les libellés de l'app, copiés à la lettre de
 *   shephr-app/mobile/utils/i18n/locales/fr.json (clé en commentaire). Ne pas les reformuler :
 *   la vidéo doit montrer exactement ce que l'utilisateur verra.
 */

export const LEGENDES = {
  p1: ['Une action menée ?', '*Déclarez-la*'],
  p2: ['Le type et la date', '*suffisent*'],
  p3: ['Elle compte', '*tout de suite*'],
  p4: ['Même *sans réseau*', 'elle partira plus tard'],
  // P5, premier temps (retour JP 14/10) : programmer passe par l'onglet « Évènements ».
  p5Onglet: ['Pour programmer :', 'l’onglet *Évènements*'],
  p5: ['Une action à venir ?', '*Programmez-la*'],
  p6: ['Le jour venu,', '*marquez-la réalisée*'],
  // P6, second temps (D-EVT-15, JP 14/10) : les trois compteurs d'une action d'évangélisation.
  p6Compteurs: ['Conversions,', 'restaurations, *baptêmes*'],
  p7: ['Elle ne voit que', '*son assemblée*'],
  // P8, premier temps (retour JP 14/10) : l'agenda du dirigeant est l'onglet « Évènements ».
  p8Onglet: ['Son agenda :', 'l’onglet *Évènements*'],
  p8: ['L’agenda de', '*son périmètre*'],
  // P9, premier temps : « Programmer » se touche depuis cet agenda.
  p9Agenda: ['Depuis l’agenda :', '*Programmer*'],
  p9: ['Il programme', '*à son niveau*'],
  p10: ['Après l’évènement,', '*il le clôture*'],
  // P10, second temps (D-EVT-16 / D-EVT-17, JP 14/10) : prédicateur saisi à la clôture, invités
  // comptés parmi les participants.
  p10Ajouts: ['Le *prédicateur*,', 'les *invités*'],
  p11: ['« À vérifier » ?', 'L’action *reste comptée*'],
  p12: ['À chaque dirigeant,', '*son périmètre*'],
  p13: ['Le secrétariat suit', '*tout le ministère*'],
  p14: ['Les totaux', '*remontent* tout seuls'],
  p15: ['De la nation', '*jusqu’à l’assemblée*'],
  p16: ['Un évènement de ville', 'compte *une seule fois*'],
  p17: ['Par *type*', 'et par *mois*'],
} as const;

/** Cartons sans téléphone (ouverture, fin) et annotations vidéo (hors app). */
export const CARTONS = {
  titre: 'Évènements',
  sousTitre: 'Comment ça marche ?',
  fin: ['Chaque action ', 'compte', '.'],
  chapitre: (n: number) => `CHAPITRE ${n} / 4`,
  /** P6 : saut dans le temps. */
  sautDate: '17 OCT.',
  /** P11 : carte KPI posée à côté du téléphone. */
  kpiParis: 'PARIS · ACTIONS COMPTÉES',
  inchange: 'inchangé',
  /** P16 : étiquette et addition. */
  etiquetteConcert: 'Concert de louange',
  etiquetteVille: 'ville de Paris',
  /** P7 / P12 / P14 : niveaux des schémas (libellés métier, events.levels.*). */
  niveaux: { nation: 'NATION', region: 'RÉGION', ville: 'VILLE', assemblee: 'ASSEMBLÉE' },
  roles: {
    assemblee: 'Dirigeant d’assemblée',
    ville: 'Dirigeant de ville',
    region: 'Dirigeant de région',
    nation: 'Coordinateur de nation',
  },
} as const;

export const APP = {
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
    cantique: 'Cantiques', // dashboard.tiles.cantique
    // ⚠ Tel quel dans fr.json (dashboard.tiles.cantiqueHint) : coquille probable de « Christ ».
    cantiqueHint: 'Chris est Vainqueur',
  },
  onglets: ['Accueil', 'Objectifs', 'Assemblée', 'Évènements', 'Profil'], // tabs.*

  declare: {
    kicker: 'Évangélisation', // events.declare.kicker
    title: 'Déclarer une action', // events.declare.title
    intro: 'Le type et la date suffisent : tout le reste est facultatif.',
    type: "Type d'action",
    date: "Date de l'action",
    place: 'Lieu',
    placePlaceholder: 'Ville, quartier, lieu-dit…',
    participants: 'Participants',
    // D-EVT-17 (JP 14/10) : invités, INCLUS dans les participants, pour tout type.
    guests: 'Invités', // events.declare.guests
    guestsHint: 'dont personnes extérieures', // events.declare.guestsHint
    // D-EVT-16 (JP 14/10) : prédicateur, type évangélique seulement, juste après le type et la date.
    preacher: 'Prédicateur', // events.declare.preacher
    preacherPlaceholder: 'Nom du prédicateur', // events.declare.preacherPlaceholder
    // D-EVT-15 (JP 14/10) : l'ancien compteur unique devient « Conversions » ; + restaurations, baptêmes.
    conversions: 'Conversions', // events.declare.conversions
    restorations: 'Restaurations', // events.declare.restorations
    baptisms: 'Baptêmes', // events.declare.baptisms
    countersHint: 'Facultatif : laissez vide ce que vous ne savez pas.', // events.declare.countersHint
    note: 'Note',
    notePlaceholder: 'Un commentaire, en une ou deux lignes',
    recordedFor: (noeud: string) => `Cette action sera enregistrée pour ${noeud}.`,
    submit: 'Enregistrer',
    footnote:
      'Votre action compte dès son enregistrement, sans validation. Sans réseau, elle est gardée sur votre téléphone et envoyée dès le retour de la connexion.',
    successTitle: 'Action enregistrée 🙏',
    successFor: (nom: string) => `Elle est enregistrée pour ${nom}.`,
    successQueued:
      "Pas de réseau pour l'instant : elle est gardée sur votre téléphone et partira d'elle-même dès le retour de la connexion.",
    another: 'Déclarer une autre action',
    finish: 'Terminer',
  },
  today: "Aujourd'hui", // common.today
  scopeOf: {
    UNIT: (nom: string) => `l'assemblée ${nom}`, // events.scopeOf.UNIT
    LOCALITY: (nom: string) => `la ville ${nom}`, // events.scopeOf.LOCALITY
  },
  levels: { COUNTRY: 'Nation', ZONE: 'Région', LOCALITY: 'Ville', UNIT: 'Assemblée' }, // events.levels.*

  mine: {
    kicker: 'Évènements', // events.tab.kicker
    title: 'Mes actions', // events.mine.title
    subtitle: 'Les actions de votre assemblée : les vôtres, celles des autres membres et de vos dirigeants.',
    thisMonth: 'En octobre', // events.mine.thisMonth
    thisYear: 'En 2026', // events.mine.thisYear
    countedHint: "Sont comptées les actions réalisées d'un type évangélique.",
    declare: 'Déclarer', // events.tab.declare
    plan: 'Programmer', // events.tab.plan
    upcoming: 'À venir', // events.agenda.upcoming
    plannedSub: 'Programmés dans votre assemblée, à partir d’aujourd’hui, le plus proche en haut.',
    doneTitle: 'Actions d’évangélisation', // events.member.doneTitle
    doneSub: 'Réalisées dans votre assemblée, les plus récentes en haut.',
    ownBadge: 'Mon action', // events.mine.ownBadge
    preacher: (nom: string) => `Prédicateur : ${nom}`, // events.mine.preacher (D-EVT-16)
  },

  plan: {
    title: 'Programmer un évènement', // events.plan.title
    intro:
      "Il apparaîtra dans l'agenda de votre périmètre. Les chiffres (participants, invités et, pour une action d’évangélisation, conversions, restaurations, baptêmes) se saisissent une fois l'évènement réalisé.",
    submit: 'Programmer',
  },
  form: {
    type: "Type d'évènement",
    title: 'Intitulé',
    titlePlaceholder: 'Ex. Conférence de rentrée (facultatif)',
    date: 'Date',
    endDate: 'Fin',
    endDateNone: 'Un seul jour',
    scope: 'Rattachement',
    plannedFor: (noeud: string) => `Cet évènement sera programmé pour ${noeud}.`,
  },
  cancel: 'Annuler', // common.cancel
  edit: 'Modifier', // common.edit
  delete: 'Supprimer', // common.delete

  status: { PLANNED: 'Programmé', DONE: 'Réalisé' }, // events.status.*
  toCloseBadge: 'À clôturer', // events.agenda.toCloseBadge
  toVerify: 'À vérifier', // events.mine.toVerify

  detail: {
    kickerEvangelism: 'Évangélisation',
    date: 'Date',
    scope: 'Rattachement',
    author: 'Enregistré par',
    counted: 'Cet évènement compte dans les statistiques d’évangélisation.',
    countedToVerify: 'Marqué « à vérifier » : il reste compté dans les statistiques.',
    plannedHint: 'Programmé : il comptera une fois marqué comme réalisé.',
    markDone: 'Marquer comme réalisé',
    markDoneIntro: 'Saisissez ce qui s’est passé — tout est facultatif. Un champ laissé vide garde sa valeur.',
    markedDone: 'Évènement marqué comme réalisé.',
    notYetHeld: 'Disponible à partir de la date de l’évènement.',
    cancel: "Annuler l'évènement",
    flag: 'Marquer « à vérifier »',
    unflag: 'Retirer « à vérifier »',
    flagged: 'Marqué « à vérifier ».',
  },

  tab: {
    title: 'Agenda & statistiques', // events.tab.title
    subtitle: 'Les évènements de votre périmètre et les actions d’évangélisation réalisées.',
    agenda: 'Agenda',
    stats: 'Statistiques',
  },
  agenda: {
    node: 'Périmètre affiché',
    allPerimeter: 'Tout mon périmètre',
    toClose: 'À clôturer',
    toCloseSub: 'Programmés dont la date est passée : à marquer comme réalisés ou à annuler.',
    upcoming: 'À venir',
    upcomingSub: "Programmés à partir d'aujourd'hui.",
    done: 'Réalisés',
    doneSub: 'Évènements et actions réalisés sur la période choisie.',
  },
  period: { month: 'Mois', year: 'Année', range: 'Plage' }, // events.period.*

  stats: {
    kpiCount: 'Actions comptées',
    kpiParticipants: 'Participants',
    kpiGuests: 'Invités', // events.stats.kpiGuests (D-EVT-17)
    kpiConversions: 'Conversions', // events.stats.kpiConversions (D-EVT-15)
    kpiRestorations: 'Restaurations', // events.stats.kpiRestorations
    kpiBaptisms: 'Baptêmes', // events.stats.kpiBaptisms
    kpiAgenda: 'Programmés à venir',
    toClose: (n: number) => `${n} à clôturer`, // events.stats.toClose_*
    countingRule:
      "Sont comptées les actions réalisées d'un type évangélique, une seule fois, au niveau où elles sont rattachées. « À vérifier » ne retire rien du total.",
    byLevel: { ZONE: 'Par région', LOCALITY: 'Par ville', UNIT: 'Par assemblée' },
    drillHint: 'Touchez une carte pour descendre d’un niveau.',
    ownLevel: (n: number, nom: string) =>
      n === 1
        ? `Dont 1 action rattachée directement à ${nom}, comptée dans aucun sous-niveau.`
        : `Dont ${n} actions rattachées directement à ${nom}, comptées dans aucun sous-niveau.`,
    byType: 'Par type',
    byMonth: 'Par mois',
  },
} as const;

/** Compteurs d'un évènement ou d'un total (D-EVT-15, D-EVT-17) ; absent / null = non renseigné. */
export interface Compteurs {
  participants?: number | null;
  /** D-EVT-17 : invités, inclus dans les participants. */
  invites?: number | null;
  conversions?: number | null;
  restaurations?: number | null;
  baptemes?: number | null;
}

/** `events.mine.<clé>_one` / `_other` : en français, 0 et 1 sont au singulier. */
// Espace insécable entre le nombre et son nom (typographie française : jamais « · 5 » / « baptêmes »
// à la coupure), et avant le séparateur (une ligne ne commence jamais par « · »). Revue 14/10.
const accorde = (n: number, un: string, plusieurs: string) => `${n}\u00a0${n > 1 ? plusieurs : un}`;

/**
 * « 40 participants dont 12 invités · 2 conversions · 1 baptême » (`counterParts` de utils/events.ts,
 * events.mine.*), dans l'ordre de l'app (`COUNTER_KEYS`) : seulement ce qui a été saisi. D-EVT-17 :
 * les invités se disent DANS les participants (« dont », events.mine.ofWhichGuests_*), seuls
 * « 12 invités ». Les statistiques (`figures` de EventStatsDrill.tsx) passent des totaux : toutes
 * les parts s'y disent, zéros compris.
 */
export const chiffres = (c: Compteurs): string =>
  [
    c.participants != null
      ? accorde(c.participants, 'participant', 'participants') +
        (c.invites != null ? ` dont\u00a0${accorde(c.invites, 'invité', 'invités')}` : '')
      : c.invites != null
        ? accorde(c.invites, 'invité', 'invités')
        : null,
    c.conversions != null ? accorde(c.conversions, 'conversion', 'conversions') : null,
    c.restaurations != null ? accorde(c.restaurations, 'restauration', 'restaurations') : null,
    c.baptemes != null ? accorde(c.baptemes, 'baptême', 'baptêmes') : null,
  ]
    .filter(Boolean)
    .join('\u00a0· ');

/**
 * Textes de la vidéo « Ce qui est et restera gratuit » (V4 du plan 27/10 § 9, français seulement).
 *
 * - `LEGENDES` : les légendes du storyboard (docs/storyboard-gratuit.md § 4), deux par plan au plus
 *   — l'idée, puis son explication (retour JP du 21/10 : « légendes d'explication ») ; deux lignes
 *   chacune ; `*mot*` passe en argile.
 * - `CARTONS` : textes hors de l'app (ouverture, intertitres, pastilles de partie et de personne,
 *   tampon « Gratuit », fin). AUCUN prix, aucune mention d'offre payante (plan § 9).
 * - `APP` : les libellés des écrans redessinés ici (Brebis, Objectifs, Hiérarchie, barre d'onglets
 *   à six onglets), copiés à la lettre de shephr-app/mobile/utils/i18n/locales/fr.json (clé en
 *   commentaire). Les écrans repris d'« Étude », « Journal », « Évènements », « Documents » et de
 *   CMFIPraise gardent leurs propres textes, déjà copiés de l'app.
 */

export const LEGENDES = {
  p2: ['Le Message de Bertoua', 'dans *son assemblée*'],
  p2Explication: ['Séances, réponses,', '*notes* et progression'],
  p3: ['La vie de', '*son assemblée*'],
  p3Explication: ['Comptes rendus, réunions,', '*journal* en PDF'],
  p4: ['Le suivi des *brebis*', 'de son assemblée'],
  p4Explication: ['Un statut pour chacun,', 'ses *présences*'],
  p5: ['Ses *objectifs*', 'et leur avancement'],
  p5Explication: ['S’engager, déclarer,', 'puis *soumettre*'],
  p6: ['L’arbre de', 'sa *hiérarchie*'],
  p6Explication: ['Qui a *soumis*,', 'qui n’a rien déclaré'],
  p7: ['Créer, *déclarer*,', 'programmer'],
  p7Explication: ['Les statistiques,', '*jusqu’à la ville*'],
  p8: ['Les *documents*,', 'rangés en dossiers'],
  p8Explication: ['À lire', '*dans l’app*'],
  p9: ['*CMFIPraise* :', 'tous les chants'],
  p9Explication: ['Et la *projection*', 'en plein écran'],
} as const;

export const CARTONS = {
  /** P1 : ouverture. */
  ouverture: { l1: 'Ce qui est', debut: 'et ', mot: 'restera', fin: ' gratuit' },
  ouvertureSous: 'Pour chaque membre, chaque assemblée, chaque dirigeant.',
  /** Pastilles de partie (gabarit de « Journal » / « Étude »). */
  parties: {
    assemblee: '1 · SON ASSEMBLÉE',
    objectifs: '2 · SES OBJECTIFS',
    aussi: '3 · ET AUSSI',
  },
  /** Intertitres de 2,5 s (numéro, titre, phrase d'explication). */
  intertitres: {
    assemblee: { numero: '1', titre: 'Son assemblée', phrase: 'Tout ce qui se vit chez soi, chaque semaine.' },
    objectifs: { numero: '2', titre: 'Ses objectifs', phrase: 'S’engager, rendre compte, voir son arbre.' },
    aussi: { numero: '3', titre: 'Et aussi', phrase: 'Évènements, documents, chants.' },
  },
  /** Pastilles de personne (annotation vidéo). */
  personnes: {
    samuel: "SAMUEL · DIRIGEANT D'UNITÉ", // MODULE_ROLE_LABELS.DIRIGEANT_UNITE (« Dirigeant d'unité ») — D-FIX vidéos, JP 29/10
    daniel: 'DANIEL · DIRIGEANT DE VILLE',
    /** P7 : la région se lit depuis le téléphone d'un dirigeant senior (D-OFF-12, périmètre de lecture). */
    bernard: 'BERNARD · DIRIGEANT SENIOR',
  },
  /** Tampon posé sur le coin du téléphone à chaque plan. */
  gratuit: 'GRATUIT',
  /** P10 : la fin. */
  fin: { l1: 'Tout cela est', debut: 'et ', mot: 'restera', fin: ' gratuit.' },
} as const;

/** fr.json, mêmes clés que l'app (clé en commentaire). */
export const APP = {
  /** Barre d'onglets d'un dirigeant d'assemblée avec Vie d'assemblée, Évènements et Member Care
   * (`(tabs)/_layout.tsx`, dans l'ordre des `Tabs.Screen`, Déclarations et Trésorerie masqués). */
  onglets: ['Accueil', 'Objectifs', 'Assemblée', 'Évènements', 'Brebis', 'Profil'], // tabs.home, goals, assembly, events, care, profile

  care: {
    title: 'Suivi des brebis', // care.title
    subtitle: 'Les membres de votre assemblée et leur état spirituel.', // care.subtitle
    tabRecords: 'Suivi', // care.tabRecords
    tabAccountability: 'Redevabilité', // care.tabAccountability
    searchPlaceholder: 'Rechercher un membre…', // care.searchPlaceholder
    all: 'Tous', // common.all
    lastAttendanceShort: (date: string) => `présent le ${date}`, // care.lastAttendanceShort
  },

  goals: {
    title: 'Objectifs', // goals.title
    viewBadge: 'Vue', // views.badge
    viewMember: 'Personnelle', // views.member
    deadlineFuture: (date: string) => `Modifiable jusqu'au ${date}.`, // goals.deadlineFuture
    navUnits: 'Mes assemblées', // goals.nav.units
    navUnitsHint: 'Suivi des engagements, assemblée par assemblée, jusqu’au membre.', // goals.nav.unitsHint
    navRemind: 'Relancer', // goals.nav.remind
    navRemindHint: "Les personnes de votre périmètre qui n'ont pas encore soumis.", // goals.nav.remindHint
    memberTitle: 'Mes objectifs', // goals.member.title
    lineToComplete: 'À compléter', // goals.lineToComplete
    lineDraft: 'Brouillon', // goals.lineDraft
    pledged: 'Engagé', // goals.pledged
    given: 'Versé', // goals.given
    addProgress: "Déclarer l'état actuel", // goals.addProgress
    historyBtn: 'Historique', // goals.historyBtn
    submitCta: 'Soumettre mes engagements', // goals.member.submitCta
  },

  hierarchy: {
    title: 'Hiérarchie', // hierarchy.title
    introSubtree: 'Votre leadership : vos dirigeants, leurs assemblées et les membres de ces assemblées.', // hierarchy.introSubtree
    reportsTo: 'Vous rendez compte à', // hierarchy.reportsTo
    supervisorTitle: 'Mon superviseur', // supervisor.title
    supervisorHint: 'Déclarer à qui vous rendez compte, ou voir qui vous supervisez.', // supervisor.shortcutHint
    viewLeaders: 'Dirigeants', // hierarchy.viewLeaders
    viewUnits: 'Assemblées', // hierarchy.viewUnits
    you: 'Vous', // hierarchy.you
    goalSubmitted: 'Soumis', // hierarchy.goalSubmitted
    goalDraft: 'Brouillon', // hierarchy.goalDraft
    goalNothing: 'Rien déclaré', // hierarchy.goalNothing
    goalLate: 'En retard', // hierarchy.goalLate
    unitsCount: (n: number) => `${n} assemblée${n > 1 ? 's' : ''}`, // hierarchy.unitsCount_one / _other
    membersCount: (n: number) => `${n} membre${n > 1 ? 's' : ''}`, // hierarchy.membersCount_one / _other
    roleDirigeant: 'Dirigeant', // MODULE_ROLE_LABELS.DIRIGEANT (services/authApi.ts)
    roleDirigeantUnite: "Dirigeant d'unité", // MODULE_ROLE_LABELS.DIRIGEANT_UNITE
  },
} as const;

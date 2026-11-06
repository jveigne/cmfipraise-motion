/**
 * Textes de la vidéo « Documents » (Shephr), en français seulement (storyboard
 * docs/storyboard-documents.md, validé par JP le 20/10/2026).
 *
 * - `LEGENDES` : les légendes du storyboard (§ 3), deux lignes au plus ; `*mot*` passe en argile.
 *   Typographie française : espace fine insécable (U+202F) avant ? ! ;, insécable (U+00A0) avant :
 *   et dans « », apostrophe ’.
 * - `CARTONS` : textes hors de l'app (pastilles de partie, bascule, fin, annotations vidéo).
 * - `APP` : les libellés de l'app, copiés à la lettre de
 *   shephr-app/mobile/utils/i18n/locales/fr.json (clé en commentaire), apostrophes droites
 *   comprises : la vidéo montre exactement ce que l'utilisateur verra.
 * - `FIL` : la conversation de groupe stylisée (P1, P2, P9) — une messagerie quelconque, pas une
 *   marque : ni logo, ni vert, ni nom d'application.
 */

const FINE = ' ';
const INSEC = ' ';

export const LEGENDES = {
  p1: ['Le PDF est *quelque part*', 'dans le fil…'],
  p2: [`Laquelle est *la bonne*${FINE}?`],
  p3: ['Un document pour la France…', '*arrive partout*.'],
  p5: ['Un document pour', '*tout le ministère*…'],
  p6Pays: ['…ou pour *un pays*.'],
  p6Chacun: ['Chacun voit *son pays*.'],
  p7Dossiers: ['Rangés en *dossiers*.'],
  p7HorsLigne: ['Et lisibles *hors ligne*.'],
  p8: ['Corrigé une fois,', '*à jour pour tous*.'],
  p9Lien: ['Un seul *lien* à partager.'],
  p9Suite: ['Et la suite *dans l’app*.'],
} as const;

export const CARTONS = {
  /** Pastilles de partie (gabarit de `PastilleChapitre` d'« Évènements »), storyboard § 2. */
  parties: {
    probleme: 'LE PROBLÈME',
    monde: '1 · MONDIAL ET PAR PAYS',
    retrouver: '2 · RETROUVER',
    ajour: '3 · TOUJOURS À JOUR',
    partager: '4 · PARTAGER',
  },
  /** P4 : « Tous vos documents, au même endroit. » */
  bascule: ['Tous vos documents,', 'au même endroit', '.'],
  /** P10 : « Mondial ou par pays. » / « Chacun voit ce qui le concerne. » */
  fin: ['Mondial ou par pays.', 'Chacun voit', 'ce qui le concerne', '.'],
  /** P3 : le groupe où part le programme de la France. */
  groupeInternational: `Groupe «${INSEC}International${INSEC}»`,
  /** P6 : les deux membres et leur ville. */
  marie: 'Marie · Paris',
  paul: 'Paul · Douala',
  /** P8 : le second membre français (le document mis à jour est réservé à la France). */
  lucie: 'Lucie · Lyon',
  /** P8 : sous la pastille du lien. */
  memeLien: 'MÊME LIEN',
  /** P9 : le téléphone de l'ami qui reçoit le lien. */
  ami: 'UN AMI · SANS COMPTE',
  /** P3 : noms de pays à l'arrivée des flèches. */
  pays: { CA: 'Canada', CI: `Côte d’Ivoire`, CM: 'Cameroun', FR: 'France' },
} as const;

export const APP = {
  // home.tsx — mois capitalisé, jour, virgule, année (ordre de l'app), le jour du storyboard.
  dateAccueil: 'Octobre 20, 2026',
  tuileDocuments: 'Documents', // dashboard.tiles.documents
  tuileDocumentsHint: 'Enseignements à lire et partager', // dashboard.tiles.documentsHint

  // documents.space.*
  space: {
    kicker: 'Enseignements',
    title: 'Documents',
    searchPlaceholder: 'Rechercher un titre…',
    wholeMinistry: 'Tout le ministère',
    folders: 'Dossiers',
    documents: 'Documents',
    unfiled: 'Sans dossier',
    pages: (n: number) => `${n} page${n > 1 ? 's' : ''}`, // pages_one / pages_other
    documentCount: (n: number) => `${n} document${n > 1 ? 's' : ''}`, // documentCount_*
  },

  // documents.reader.*
  reader: {
    share: 'Partager',
    more: "D'autres documents",
    previewIndicator: (page: number, count: number) => `Aperçu — page ${page} sur ${count} offertes`,
    pageIndicator: (page: number, count: number) => `Page ${page} / ${count}`,
  },

  // documents.wall.*
  wall: {
    title: (titre: string) => `Vous avez lu l'aperçu de « ${titre} »`,
    body: 'La suite vous attend dans Shephr, avec d\'autres enseignements.',
    remaining: (n: number) => `Encore ${n} page${n > 1 ? 's' : ''}`, // remaining_one / remaining_other
    loginHint: 'Connectez-vous ou créez votre compte : vous reviendrez directement sur ce document.',
    login: 'Se connecter',
    signup: 'Créer un compte',
  },

  /**
   * Aperçu du lien (balises OpenGraph de shephr-app/web/api/document-page.ts, `FALLBACK.FR`) : la
   * description par défaut, quand le document n'en a pas.
   */
  apercuDescription: 'Lisez un aperçu gratuit, puis la suite dans l’app Shephr.',
  domaine: 'www.shephr.org',
} as const;

/**
 * Conversation de groupe stylisée (P1, P2, P9). Les noms sont fictifs ; les fichiers du problème
 * sont ceux fournis par JP le 20/10/2026.
 */
export const FIL = {
  groupe: 'Responsables — CMCI',
  membresGroupe: 'Jean, Sophie, Marc, Marie et 8 autres',
  ilYa3Mois: 'Il y a 3 mois',
  aujourdhui: 'Aujourd’hui',
  cetteSemaine: 'Cette semaine',
  fichierUmpj: 'UMPJ_Retranscript_Enseignement_TA.pdf',
  fichiersPriere: ['priere_JS_paris.pdf', 'priere_JS_paris(1).pdf', 'priere_JS_paris_corrige.pdf'],
  fichierProgramme: 'programme_national_france.pdf',
  /** Autour du PDF d'origine, il y a trois mois (P1). */
  envoiUmpj: { de: 'Jean', texte: 'Voici la retranscription de l’enseignement' },
  merciUmpj: { de: 'Sophie', texte: 'Merci Jean 🙏' },
  /** P2 : les trois envois du même fichier, et la remarque entre deux. */
  envoisPriere: ['Jean', 'Sophie', 'Marc'],
  remarquePriere: { de: 'Sophie', texte: 'J’ai corrigé deux dates' },
  /** P2 : avant les envois, la semaine précédente. */
  avantPriere: [
    { de: 'Marc', texte: `On prie pour la JS de Paris${FINE}?` },
    { de: 'Jean', texte: 'Oui, je vous envoie le texte' },
  ],
  /** Messages qui défilent et poussent le PDF hors de vue (P1). */
  defilent: [
    { de: 'Sophie', texte: 'Merci pour la réunion d’hier 🙏' },
    { de: 'Marc', texte: `Rappel${INSEC}: prière demain à 6${INSEC}h` },
    { de: 'Jean', texte: 'Photos du culte de dimanche' },
    { de: 'Sophie', texte: 'Amen' },
    { de: 'Marc', texte: `Qui peut accueillir samedi${FINE}?` },
    { de: 'Jean', texte: `Moi, à 15${INSEC}h` },
    { de: 'Sophie', texte: 'Bonne semaine à tous' },
  ],
  /** Les trois questions (P1), de trois personnes. */
  questions: [
    { de: 'Marc', texte: `Quelqu’un a le PDF de l’enseignement${FINE}?` },
    { de: 'Sophie', texte: 'Je ne le retrouve plus 🙏' },
    { de: 'Paul', texte: `Tu peux me le renvoyer${FINE}?` },
  ],
  /** P9 : la conversation de l'ami avec Marie. */
  marie: 'Marie',
  enLigne: 'en ligne',
  saisie: 'Message',
} as const;

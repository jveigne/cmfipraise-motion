/**
 * Textes de la vidéo « Le Message de Bertoua en détail » (V1 du plan
 * cmfipraise-backend/docs/shephr/27_10_2026/05_Plan_Offres_Caleb_Nehemie.md § 9), en français
 * seulement. Les plans les lisent par import (`TEXTES_BERTOUA`) ; aucune chaîne visible n'est
 * écrite en dur ailleurs que dans ce fichier et dans `donnees.ts`. Les plans repris de la vidéo
 * « Étude » gardent leurs propres légendes (`src/etude/textes.ts`).
 *
 * - `legendes` : deux lignes au plus, `*mot*` passe en argile. Typographie française : espace fine
 *   insécable (U+202F) avant ? ! ;, insécable (U+00A0) avant : et dans « », apostrophe ’.
 * - `cartons` : textes hors de l'app (titre, pastilles de partie et de personne, intertitres,
 *   carton « Gratuit », annotations).
 * - `app` : libellés de l'app que ni « Étude » ni « Guide » n'ont relevés, copiés à la lettre de
 *   shephr-app/mobile/utils/i18n/locales/fr.json (clé en commentaire), apostrophes droites comprises.
 *
 * AUCUN PRIX nulle part (plan § 9) : « Gratuit » n'est pas un prix, c'est la règle D-ETU-50.
 */

const FINE = ' ';
const INSEC = ' ';

export const LEGENDES = {
  // Ouverture
  o2Dimanche: ['Le dimanche,', '*une assemblée de maison*.'],
  o2Samuel: ['Paris Ouest, chez Samuel,', '*le dirigeant*.'],
  // 1 · Commencer
  a1Tuile: ['Le dirigeant touche', '*Le Message de Bertoua*.'],
  a1Programme: ['Le programme se suit', '*unité par unité*.'],
  a1Verrou: ['L’unité suivante s’ouvre', '*quand celle-ci est faite*.'],
  a1Lecon: ['Il ouvre l’unité et choisit', '*la leçon du jour*.'],
  a2Lire: [`Avant de commencer${INSEC}:`, '*à lire avant la leçon*.'],
  a2Notes: ['Les conseils du manuel,', '*pour le dirigeant seul*.'],
  a2Actions: ['Et ce que chaque membre', '*devra faire*.'],
  a3Depart: ['Puis', '*la question de départ*.'],
  a3Defaut: ['Par défaut, *le début*', 'de la leçon.'],
  a3Commencer: [`Un geste${INSEC}:`, '*Commencer*.'],
  a3Notes: ['Ses notes restent', '*sous la main*.'],
  // 2 · Répondre (types de questions, après P9 repris)
  b1Exercice: [`Un exercice${FINE}?`, 'On coche *Fait*.'],
  b1Perso: ['Une question personnelle,', '*oui ou non*.'],
  b1Unique: ['Un *choix unique*,', 'parmi quatre.'],
  b1Types: ['*Sept sortes* de questions,', 'toutes sur le téléphone.'],
  // 3 · Corriger
  c1Repondu: [`Chacun a répondu${FINE}?`, '*Passer à la correction*.'],
  c1Arret: [`Le temps manque${FINE}?`, 'On s’arrête *après la question 11*.'],
  c1Suite: ['Les questions suivantes', '*attendront dimanche prochain*.'],
  c1Verrou: ['La saisie se verrouille', '*sur chaque téléphone*.'],
  // 4 · Terminer
  d1Terminer: [`Tous les avis sont posés${INSEC}:`, '*Terminer*.'],
  d1Notes: ['Chacun voit *sa note*,', 'sur les questions du jour.'],
  d2Semaine: ['Et pour la semaine,', '*ce que chacun doit faire*.'],
  d2Tous: ['Le même rappel,', '*pour tous les membres*.'],
  // 5 · La suite
  e1Soir: ['Le soir, Marie voit', '*où elle en est*.'],
  e1Partiel: [`Leçon commencée${INSEC}:`, '*6 questions sur 9*.'],
  e2Absente: ['Rose était absente.', 'Elle *rattrape à la maison*.'],
  e2Seule: ['Elle répond seule,', '*à son rythme*.'],
  e2Envoi: ['Le manuel et les corrections', '*viennent après l’envoi*.'],
  e2Avis: ['Ses réponses écrites', '*attendent l’avis du dirigeant*.'],
  e3Suite: [`Dimanche suivant${INSEC}:`, '*la suite de la leçon*.'],
  e3Depart: ['Le départ est déjà', '*la question 12*.'],
  e3Commencer: ['*Commencer*,', 'et l’on reprend.'],
  e4Reprises: ['Les réponses déjà données', '*sont reprises*.'],
  e4Rien: ['Marie n’a', '*rien à refaire*.'],
  e4Faite: [`On corrige, on termine${INSEC}:`, '*la leçon 1 est faite*.'],
  // 6 · L'avancement
  f1Marie: ['Marie suit', '*sa progression*.'],
  f1Note: ['Un membre ne voit', '*que sa propre note*.'],
  f2Samuel: ['Samuel suit', '*l’avancement de l’assemblée*.'],
  f2Membres: ['Leçon par leçon,', '*la note de chacun*.'],
} as const;

export const CARTONS = {
  /** Titre d'ouverture (O1). */
  titre: { surtitre: 'ÉTUDE DE L’ASSEMBLÉE', titre: ['Le Message', 'de Bertoua'], phrase: 'Une réunion du dimanche, pas à pas.' },
  /** Pastilles de partie (gabarit de `PastillePartie` de « Journal »). */
  parties: {
    commencer: '1 · COMMENCER',
    repondre: '2 · RÉPONDRE',
    corriger: '3 · CORRIGER',
    terminer: '4 · TERMINER',
    suite: '5 · LA SUITE',
    avancement: '6 · L’AVANCEMENT',
  },
  /** Intertitres de 2,5 s, avant chaque partie : numéro, titre, une phrase d'explication. */
  intertitres: {
    commencer: { numero: '1', titre: 'Commencer', phrase: 'On lit, puis on ouvre la leçon.' },
    repondre: { numero: '2', titre: 'Répondre', phrase: 'Sur son téléphone, ou sur papier.' },
    corriger: { numero: '3', titre: 'Corriger', phrase: 'On échange les téléphones.' },
    terminer: { numero: '4', titre: 'Terminer', phrase: 'Chacun voit sa note.' },
    suite: { numero: '5', titre: 'La suite', phrase: 'Une leçon, plusieurs dimanches.' },
    avancement: { numero: '6', titre: 'L’avancement', phrase: 'De chacun, et de l’assemblée.' },
  },
  /** Intertitre final (demande de la tâche, règle D-ETU-50 : l'Étude est gratuite). */
  gratuit: { titre: 'Gratuit', phrase: ['pour toutes', 'les assemblées.'] },
  /** Pastilles de personne au-dessus des téléphones (annotation vidéo), avec le jour quand il change. */
  pastilles: {
    samuel: "SAMUEL · DIRIGEANT D'UNITÉ", // MODULE_ROLE_LABELS.DIRIGEANT_UNITE (« Dirigeant d'unité ») — D-FIX vidéos, JP 29/10
    marie: 'MARIE',
    marieSoir: 'MARIE · LE SOIR',
    rose: 'ROSE · MERCREDI 28 OCT.',
    samuelSuite: 'SAMUEL · DIM. 1ER NOV.',
    marieSuite: 'MARIE · DIM. 1ER NOV.',
    marieApres: 'MARIE · LUNDI 2 NOV.',
    samuelApres: 'SAMUEL · LUNDI 2 NOV.',
    jean: 'JEAN',
    esther: 'ESTHER',
  },
  /** O2 : étiquettes sous les personnes du salon. */
  etiquettes: { samuel: 'Samuel · dirigeant', marie: 'Marie', jean: 'Jean', esther: 'Esther', paul: 'Paul', helene: 'Hélène' },
  /** B1 : la colonne des sortes de questions (libellés `study.types.*` de l'app). */
  typesTitre: 'SORTES DE QUESTIONS',
};

/** Libellés de l'app absents des textes d'« Étude » et de « Guide » : fr.json, à la lettre. */
export const APP = {
  types: {
    VRAI_FAUX: 'Vrai ou faux', // study.types.VRAI_FAUX
    OUI_NON: 'Oui ou non', // study.types.OUI_NON
    CHOIX_UNIQUE: 'Choix unique', // study.types.CHOIX_UNIQUE
    CHOIX_MULTIPLE: 'Choix multiple', // study.types.CHOIX_MULTIPLE
    OUVERTE: 'Réponse écrite', // study.types.OUVERTE
    PERSONNELLE: 'Personnelle', // study.types.PERSONNELLE
    EXERCICE: 'Exercice', // study.types.EXERCICE
  },
  locked: "Verrouillée : terminez d'abord l'unité prérequise dans l'assemblée", // study.home.locked
  leaderNotes: 'Notes du dirigeant', // study.leader.notes
  catchUpSubmitTitle: 'Envoyer votre copie ?', // study.session.catchUpSubmitTitle
  catchUpSubmitConfirm: (fait: number, total: number) =>
    `${fait} / ${total} répondues. Vous ne pourrez plus la modifier : les questions fermées seront corrigées tout de suite, les réponses écrites attendront l'avis du dirigeant.`, // study.session.catchUpSubmitConfirm
};

export const TEXTES_BERTOUA = { legendes: LEGENDES, cartons: CARTONS, app: APP };

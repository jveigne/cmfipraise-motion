/**
 * Données fictives de la vidéo « Journal de l'assemblée » (storyboard § 6). Toutes inventées :
 * aucune donnée réelle. Date de l'histoire : mercredi 14 octobre 2026. L'assemblée se réunit le
 * mercredi soir (toutes les dates citées sont des mercredis).
 *
 * Deux jeux, un par langue (`DONNEES.fr` / `DONNEES.en`), construits par `construire` à partir des
 * MÊMES faits (dates ISO, présences, fractions de pain, lectures) : seuls changent les noms (Paris
 * Nord → Leeds North, les personnes, les titres des modules) et la mise en forme, celle de l'app
 * dans la langue (`fmtIsoDay` : « 14 octobre 2026 » / « 14 October 2026 » ; présence moyenne par
 * `toLocaleString` : « 8,6 » / « 8.6 »). Les chiffres sont donc identiques dans les deux versions
 * (JP 14/10 : « aucune image ne bouge »).
 */
import type { Langue } from '../textes';
import { TEXTES_JOURNAL, formatChapitres } from './textes';

/** Les 11 personnes de l'assemblée (clés) ; leurs noms par langue sont dans `NOMS`. */
type ClePersonne =
  | 'antoine'
  | 'camille'
  | 'claire'
  | 'elise'
  | 'hugo'
  | 'julien'
  | 'lea'
  | 'mathieu'
  | 'nicolas'
  | 'sarah'
  | 'thomas';

/** Modules d'enseignement du ministère, dans l'ordre du back-office (storyboard § 6.3). */
type CleLivre = 'eglise' | 'fondements' | 'priere' | 'consacree' | 'servir' | 'marcher';
const ORDRE_LIVRES: CleLivre[] = ['eglise', 'fondements', 'priere', 'consacree', 'servir', 'marcher'];

/** Tout ce qui change d'une langue à l'autre. */
interface Dico {
  locale: string;
  /** `common.monthsLong` de l'app. */
  mois: string[];
  assemblee: string;
  ville: string;
  /** Les deux autres assemblées de la ville (P16–P17). */
  est: string;
  sud: string;
  personnes: Record<ClePersonne, string>;
  daniel: { nom: string; prenom: string; initiales: string };
  bernard: string;
  sophie: string;
  marc: string;
  livres: Record<CleLivre, string>;
}

const DICOS: Record<Langue, Dico> = {
  fr: {
    locale: 'fr',
    mois: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    assemblee: 'Paris Nord',
    ville: 'Paris',
    est: 'Paris Est',
    sud: 'Paris Sud',
    personnes: {
      antoine: 'Antoine Morel',
      camille: 'Camille Roux',
      claire: 'Claire Petit',
      elise: 'Élise Durand',
      hugo: 'Hugo Chevalier',
      julien: 'Julien Garnier',
      lea: 'Léa Bonnet',
      mathieu: 'Mathieu Girard',
      nicolas: 'Nicolas Faure',
      sarah: 'Sarah Lambert',
      thomas: 'Thomas Lefèvre',
    },
    daniel: { nom: 'Daniel Mercier', prenom: 'Daniel', initiales: 'DM' },
    bernard: 'Bernard Lemoine',
    sophie: 'Sophie Marchand',
    marc: 'Marc Dubois',
    livres: {
      eglise: "L'église de maison dans les desseins éternels de Dieu",
      fondements: 'Les fondements de la foi',
      priere: 'La prière du disciple',
      consacree: 'Une vie consacrée',
      servir: 'Servir dans la maison de Dieu',
      marcher: 'Marcher avec Dieu au quotidien',
    },
  },
  /**
   * Version anglaise (JP 14/10) : une assemblée de Leeds (Royaume-Uni). Les prénoms gardent l'ordre
   * alphabétique du français — l'absent Henry (ex-Hugo) reste 5ᵉ, Lucy (ex-Léa) 7ᵉ, Thomas, le
   * dirigeant, dernier — pour que les appuis de P8 tombent aux mêmes lignes. Daniel garde ses
   * initiales DM.
   */
  en: {
    locale: 'en',
    mois: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    assemblee: 'Leeds North',
    ville: 'Leeds',
    est: 'Leeds East',
    sud: 'Leeds South',
    personnes: {
      antoine: 'Andrew Mitchell',
      camille: 'Chloe Roberts',
      claire: 'Claire Parker',
      elise: 'Emily Davies',
      hugo: 'Henry Cooper',
      julien: 'James Green',
      lea: 'Lucy Bennett',
      mathieu: 'Matthew Graham',
      nicolas: 'Nathan Foster',
      sarah: 'Sarah Lewis',
      thomas: 'Thomas Walker',
    },
    daniel: { nom: 'Daniel Morgan', prenom: 'Daniel', initiales: 'DM' },
    bernard: 'Richard Bell',
    sophie: 'Sophie Turner',
    marc: 'Mark Evans',
    livres: {
      // Titre long à dessein : comme le français, sa pastille passe sur deux lignes (P9) — la grille
      // des chapitres reste à la même hauteur et les appuis de P9 tombent juste.
      eglise: 'The House Church in the Eternal Purpose of God',
      fondements: 'The Foundations of the Faith',
      priere: 'The Disciple’s Prayer',
      consacree: 'A Consecrated Life',
      servir: 'Serving in God’s House',
      marcher: 'Walking with God Every Day',
    },
  },
};

/** Une réunion de la liste (`MeetingRows`) : date affichée, présents, fraction, lecture. */
export interface Reunion {
  date: string;
  presents: number;
  pain: boolean;
  livre?: string;
  /** Texte des chapitres (`formatChapters`) : « chapitre 12 », « chapitres 13 et 14 ». */
  chapitres?: string;
}

export interface BlocJournal {
  date: string;
  noms: string[];
  pain: boolean;
  lecture: string | null;
}

// ---------------------------------------------------------------------------------------------
// Les faits, communs aux deux langues

/** Réunion brute : date ISO, présents, fraction de pain, livre et chapitre lus. */
type Brute = [string, number, boolean, CleLivre?, number?];

/** Le haut de la liste 2026 avant la saisie (dates décroissantes, comme le serveur). */
const BRUT_2026: Brute[] = [
  ['2026-10-07', 10, true, 'eglise', 12],
  ['2026-09-30', 9, true, 'eglise', 11],
  ['2026-09-23', 10, false, 'eglise', 10],
  ['2026-09-16', 8, true],
  ['2026-09-09', 10, true, 'eglise', 9],
  ['2026-09-02', 9, true, 'eglise', 8],
];

/**
 * Le haut de la liste de chaque année passée (décembre, dates décroissantes). Lectures cohérentes
 * avec l'avancement : Fondements 2017 → mars 2018, Prière → juin 2019, Vie consacrée → février 2021,
 * Servir → novembre 2023, Marcher 2024 → décembre 2025. Jusqu'en 2025, 9 personnes au plus
 * (Élise Durand et Hugo Chevalier n'arrivent qu'en 2026).
 */
const BRUT_PAR_ANNEE: Record<number, Brute[]> = {
  2025: [
    ['2025-12-24', 8, true],
    ['2025-12-17', 9, true, 'marcher', 16],
    ['2025-12-10', 9, true],
    ['2025-12-03', 8, true, 'marcher', 15],
    ['2025-11-26', 9, false],
  ],
  2024: [
    ['2024-12-18', 8, true, 'marcher', 6],
    ['2024-12-11', 9, true],
    ['2024-12-04', 7, true, 'marcher', 5],
    ['2024-11-27', 8, false, 'marcher', 4],
    ['2024-11-20', 9, true],
  ],
  2023: [
    ['2023-12-20', 8, true],
    ['2023-12-13', 7, true],
    ['2023-11-29', 8, false],
    ['2023-11-22', 9, true, 'servir', 14],
    ['2023-11-15', 8, true, 'servir', 13],
  ],
  2022: [
    ['2022-12-21', 7, true, 'servir', 11],
    ['2022-12-14', 8, true],
    ['2022-12-07', 8, true, 'servir', 10],
    ['2022-11-30', 6, false, 'servir', 9],
    ['2022-11-23', 7, true],
  ],
  2021: [
    ['2021-12-22', 8, true],
    ['2021-12-15', 7, true, 'servir', 5],
    ['2021-12-08', 8, false, 'servir', 4],
    ['2021-12-01', 7, true, 'servir', 3],
    ['2021-11-24', 8, true],
  ],
  2020: [
    ['2020-12-16', 6, true, 'consacree', 15],
    ['2020-12-09', 7, true, 'consacree', 14],
    ['2020-12-02', 5, false],
    ['2020-11-25', 6, true, 'consacree', 13],
    ['2020-11-18', 6, true, 'consacree', 12],
  ],
  2019: [
    ['2019-12-18', 8, true, 'consacree', 5],
    ['2019-12-11', 7, true, 'consacree', 4],
    ['2019-12-04', 8, false],
    ['2019-11-27', 7, true, 'consacree', 3],
    ['2019-11-20', 8, true],
  ],
  2018: [
    ['2018-12-19', 7, true, 'priere', 8],
    ['2018-12-12', 8, true, 'priere', 7],
    ['2018-12-05', 7, false],
    ['2018-11-28', 6, true, 'priere', 6],
    ['2018-11-21', 7, true],
  ],
  /** 2017 : la liste complète (22 réunions), la première le 10 mai 2017. */
  2017: [
    ['2017-12-20', 8, true, 'fondements', 9],
    ['2017-12-13', 7, true],
    ['2017-12-06', 7, true, 'fondements', 8],
    ['2017-11-29', 8, false],
    ['2017-11-22', 7, true, 'fondements', 7],
    ['2017-11-15', 7, true],
    ['2017-11-08', 6, true, 'fondements', 6],
    ['2017-10-25', 7, true],
    ['2017-10-18', 7, false, 'fondements', 5],
    ['2017-10-11', 6, true],
    ['2017-10-04', 7, true, 'fondements', 4],
    ['2017-09-27', 6, true],
    ['2017-09-20', 7, true, 'fondements', 3],
    ['2017-09-13', 6, false],
    ['2017-09-06', 6, true, 'fondements', 2],
    ['2017-06-28', 7, true],
    ['2017-06-21', 6, true, 'fondements', 1],
    ['2017-06-14', 6, true],
    ['2017-06-07', 7, false],
    ['2017-05-31', 6, true],
    ['2017-05-24', 5, true],
    ['2017-05-10', 6, false],
  ],
};

/** Ordre de l'app (`localeCompare`, sans accents) ; Thomas est le dirigeant. */
const ORDRE_ROSTER: ClePersonne[] = ['antoine', 'camille', 'claire', 'elise', 'hugo', 'julien', 'lea', 'mathieu', 'nicolas', 'sarah', 'thomas'];
/** Absents du 14 octobre 2026 : 9 présents. */
const ABSENTS: ClePersonne[] = ['hugo', 'lea'];
/** Les neuf de 2025 (Élise et Hugo n'arrivent qu'en 2026). */
const NEUF_2025: ClePersonne[] = ['antoine', 'camille', 'claire', 'julien', 'lea', 'mathieu', 'nicolas', 'sarah', 'thomas'];

/** Avancement (segment « Avancement », P12) : un bloc par module, dans l'ordre du ministère. */
const BRUT_AVANCEMENT: { livre: CleLivre; lus: number; total: number; date: string }[] = [
  { livre: 'eglise', lus: 14, total: 20, date: '2026-10-14' },
  { livre: 'fondements', lus: 12, total: 12, date: '2018-03-14' },
  { livre: 'priere', lus: 15, total: 15, date: '2019-06-26' },
  { livre: 'consacree', lus: 18, total: 18, date: '2021-02-10' },
  { livre: 'servir', lus: 14, total: 14, date: '2023-11-22' },
  { livre: 'marcher', lus: 16, total: 16, date: '2025-12-17' },
];

/**
 * Journal PDF 2025 : 48 réunions, 413 présences → 8,6 en moyenne, 44 fractions de pain, chapitres
 * 7 à 16 de « Marcher avec Dieu au quotidien ». Les comptes rendus du début de l'année, du plus
 * ancien au plus récent (ordre du PDF) : date, absents, fraction, chapitre lu.
 */
const BRUT_JOURNAL_2025: [string, ClePersonne[], boolean, number?][] = [
  ['2025-01-08', ['lea'], true, 7],
  ['2025-01-15', [], true],
  ['2025-01-22', [], true, 8],
  ['2025-01-29', ['nicolas'], false],
  ['2025-02-05', [], true],
  ['2025-02-12', ['claire', 'julien'], true, 9],
  ['2025-02-19', [], true],
  ['2025-02-26', ['sarah'], true],
  ['2025-03-05', [], true, 10],
  ['2025-03-12', ['camille'], true],
  ['2025-03-19', [], false],
  ['2025-03-26', ['antoine'], true],
];

/** Nombre de comptes rendus par année (frise de P11, storyboard § 6.5) ; total 425. */
const COMPTES_PAR_ANNEE: { annee: number; n: number }[] = [
  { annee: 2026, n: 38 },
  { annee: 2025, n: 48 },
  { annee: 2024, n: 48 },
  { annee: 2023, n: 46 },
  { annee: 2022, n: 47 },
  { annee: 2021, n: 45 },
  { annee: 2020, n: 41 },
  { annee: 2019, n: 46 },
  { annee: 2018, n: 44 },
  { annee: 2017, n: 22 },
];

// ---------------------------------------------------------------------------------------------
// Construction d'un jeu dans une langue

/** Nom de fichier du journal (`journalFileName` : accents retirés, tout le reste en tirets). */
const nomFichier = (assemblee: string, annee: number) =>
  `Journal-${assemblee.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}-${annee}.pdf`;

const construire = (langue: Langue) => {
  const d = DICOS[langue];
  const app = TEXTES_JOURNAL[langue].app;
  /** `fmtIsoDay` : « 14 octobre 2026 », « 14 October 2026 ». */
  const jour = (iso: string) => {
    const [a, m, j] = iso.split('-').map(Number);
    return `${j} ${d.mois[m - 1]} ${a}`;
  };
  /** Mois capitalisé et année (écrans : `capitalize(periodLabel(...))`). */
  const moisAnnee = (m: number, a: number) => `${d.mois[m - 1].charAt(0).toUpperCase()}${d.mois[m - 1].slice(1)} ${a}`;
  const decimal = (v: number) => v.toLocaleString(d.locale);
  const nom = (k: ClePersonne) => d.personnes[k];
  const livre = (k: CleLivre) => d.livres[k];
  const chapitres = (...n: number[]) => formatChapitres(app, n);
  const reunion = ([iso, presents, pain, l, n]: Brute): Reunion => ({
    date: jour(iso),
    presents,
    pain,
    livre: l ? livre(l) : undefined,
    chapitres: n == null ? undefined : chapitres(n),
  });
  const assemblee = d.assemblee;
  const ville = d.ville;
  const roster = ORDRE_ROSTER.map((k) => ({ nom: nom(k), dirigeant: k === 'thomas' ? true : undefined }));
  const absents = ABSENTS.map(nom);
  const lecture = (k: CleLivre, ...n: number[]) => `${livre(k)} — ${chapitres(...n)}`;

  return {
    ASSEMBLEE: assemblee,
    VILLE: ville,
    PERSONNES: {
      /** Dirigeant de l'assemblée depuis janvier 2024. */
      thomas: { nom: nom('thomas') },
      /** Dirigeant de la ville, superviseur des trois dirigeants d'assemblée. */
      daniel: d.daniel,
      /** Superviseur de Daniel. */
      bernard: { nom: d.bernard },
    },
    /** Les 11 personnes de l'assemblée, dans l'ordre de l'app. */
    ROSTER: roster as { nom: string; dirigeant?: boolean }[],
    /** Absents du 14 octobre 2026 (dans l'ordre de la liste : décochés l'un après l'autre en P8). */
    ABSENTS_DU_JOUR: absents,
    PRESENTS_DU_JOUR: roster.map((p) => p.nom).filter((n) => !absents.includes(n)),
    LIVRES: d.livres,
    MODULES: ORDRE_LIVRES.map(livre),
    AVANCEMENT: BRUT_AVANCEMENT.map((a) => ({ livre: livre(a.livre), lus: a.lus, total: a.total, dernier: a.lus, date: jour(a.date) })),
    /** La réunion saisie dans le film (P8 → P10). */
    REUNION_DU_JOUR: { date: jour('2026-10-14'), presents: 9, pain: true, livre: livre('eglise'), chapitres: chapitres(13, 14) } as Reunion,
    /** Date du CR (`formatReportDate` : jj/mm/aaaa dans les deux langues). */
    DATE_CR: '14/10/2026',
    REUNIONS_2026: BRUT_2026.map(reunion),
    REUNIONS_PAR_ANNEE: Object.fromEntries(Object.entries(BRUT_PAR_ANNEE).map(([a, l]) => [a, l.map(reunion)])) as Record<number, Reunion[]>,
    COMPTES_PAR_ANNEE,
    TOTAL_COMPTES: COMPTES_PAR_ANNEE.reduce((s, a) => s + a.n, 0),
    /** Période affichée sur l'écran du Journal PDF en P13 avant de passer à l'année. */
    PERIODE_MOIS: moisAnnee(10, 2026),
    JOURNAL_2025: {
      fichier: nomFichier(assemblee, 2025),
      sousTitre: `${assemblee} · ${ville} — 2025`,
      edition: '14/10/2026',
      reunions: 48,
      moyenne: decimal(Math.round((413 / 48) * 10) / 10),
      pain: '44 / 48',
      lectures: [{ livre: livre('marcher'), chapitres: chapitres(7, 8, 9, 10, 11, 12, 13, 14, 15, 16) }],
      blocs: BRUT_JOURNAL_2025.map(([iso, sans, pain, n]) => ({
        date: jour(iso),
        noms: NEUF_2025.filter((k) => !sans.includes(k)).map(nom),
        pain,
        lecture: n == null ? null : lecture('marcher', n),
      })) as BlocJournal[],
    },
    /** Hiérarchie de Daniel, octobre 2026 (storyboard § 6.6). */
    HIERARCHIE: {
      periode: moisAnnee(10, 2026),
      /** `periodLabel` sans majuscule dans le PDF (l'écran, lui, capitalise). */
      periodePdf: `${d.mois[9]} 2026`,
      reunions: 4,
      actives: '2 / 3',
      moyenne: decimal(8.8),
      distinctes: 19,
      pain: 3,
      alertes: 1,
      alerteNoms: d.sud,
      /** Tableau « Assemblées » du PDF consolidé, trié par nom. */
      lignes: [
        { assemblee: d.est, ville, reunions: 2, moyenne: decimal(8), pain: 1, dernier: '11/10/2026', alerte: false },
        { assemblee: d.assemblee, ville, reunions: 2, moyenne: decimal(9.5), pain: 2, dernier: '14/10/2026', alerte: false },
        { assemblee: d.sud, ville, reunions: 0, moyenne: '—', pain: 0, dernier: '17/09/2026', alerte: true },
      ],
      /** Comptes rendus du PDF consolidé : le nombre de présents seulement, jamais un nom (D-ASM-18). */
      comptesRendus: [
        {
          assemblee: d.est,
          blocs: [
            { date: jour('2026-10-04'), presents: 8, pain: true, lecture: lecture('fondements', 5) },
            { date: jour('2026-10-11'), presents: 8, pain: false, lecture: lecture('fondements', 6) },
          ],
        },
        {
          assemblee: d.assemblee,
          blocs: [
            { date: jour('2026-10-07'), presents: 10, pain: true, lecture: lecture('eglise', 12) },
            { date: jour('2026-10-14'), presents: 9, pain: true, lecture: lecture('eglise', 13, 14) },
          ],
        },
      ],
      /** Arbre de supervision : Daniel → les trois dirigeants d'assemblée. */
      equipe: [
        { nom: d.sophie, assemblee: d.est },
        { nom: nom('thomas'), assemblee: d.assemblee },
        { nom: d.marc, assemblee: d.sud },
      ],
    },
  };
};

export type DonneesJournal = ReturnType<typeof construire>;

export const DONNEES: Record<Langue, DonneesJournal> = { fr: construire('fr'), en: construire('en') };

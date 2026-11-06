/**
 * Données fictives de la vidéo « Guide » (JP 26/10/2026), par langue. Une seule assemblée tout du
 * long, celle de la vidéo « Étude » : Paris Ouest (Leeds West en anglais), le dimanche chez Samuel,
 * avec Marie, Jean, Esther, Paul (livret), Hélène (cahier), Rose (absente le 25 octobre) et Daniel,
 * dirigeant de la ville (le même que dans « Journal »). Toutes inventées.
 *
 * Chronologie :
 * - dimanche 18 octobre 2026 : le compte rendu saisi en partie 1 (13 présents, Joël et Rose absents,
 *   fraction de pain, « L'église de maison… » chapitres 13 et 14) ;
 * - dimanche 25 octobre : leçon 1 d'UEMB002, séance arrêtée après la question 11 (avenant 05,
 *   D-ETU-40) ; Marie 8,5 / 11 ; copies papier de Paul (9) et d'Hélène (8) ; Rose rattrape dans la
 *   semaine ;
 * - dimanche 1er novembre : la suite, questions 12 à 31 ; Marie retrouve ses réponses (D-ETU-41) ;
 *   leçon 1 faite pour l'assemblée (D-ETU-42), Marie 10,5 / 13 (D-ETU-43 : 8,5 + 2) ;
 * - lundi 2 novembre : avancement de l'assemblée et vue de la ville.
 *
 * Les jeux de « Journal » et d'« Étude » sont repris puis surchargés : les écrans de ces vidéos les
 * lisent par leurs contextes (`FournisseurJournal`, `FournisseurEtude`).
 */
import type { Langue } from '../textes';
import { TEXTES_JOURNAL, formatChapitres } from '../journal/textes';
import { DONNEES as DONNEES_JOURNAL, Reunion } from '../journal/donnees';
import type { Journal } from '../journal/langue';
import { TEXTES_ETUDE } from '../etude/textes';
import { DONNEES as DONNEES_ETUDE, Copie, LigneCopie, Question } from '../etude/donnees';
import type { Etude } from '../etude/langue';

const MOIS: Record<Langue, string[]> = {
  fr: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};

/** `fmtIsoDay` de l'app : « 18 octobre 2026 », « 18 October 2026 ». */
const jour = (langue: Langue, iso: string) => {
  const [a, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[langue][m - 1]} ${a}`;
};

const parNom = <T extends { nom: string }>(l: readonly T[], langue: Langue) => [...l].sort((a, b) => a.nom.localeCompare(b.nom, langue));

/** Noms propres à la vidéo (absents des jeux repris). */
const NOMS: Record<Langue, { rose: string; joel: string; ouest: string; nord: string; est: string; sud: string }> = {
  fr: { rose: 'Rose Eyenga', joel: 'Joël Mvondo', ouest: 'Paris Ouest', nord: 'Paris Nord', est: 'Paris Est', sud: 'Paris Sud' },
  en: { rose: 'Rose Ellis', joel: 'Joseph Moore', ouest: 'Leeds West', nord: 'Leeds North', est: 'Leeds East', sud: 'Leeds South' },
};

// ---------------------------------------------------------------------------------------------
// Partie 1 — le journal (jeu de « Journal » surchargé)

/** Réunions de 2026 avant le 18 octobre : [date ISO, présents, pain, chapitre lu de « L'église de maison… », Marie présente]. */
const BRUT_2026: [string, number, boolean, number | null, boolean][] = [
  ['2026-10-11', 13, true, 12, true],
  ['2026-10-04', 12, true, 11, true],
  ['2026-09-27', 14, false, 10, true],
  ['2026-09-20', 11, true, null, false],
  ['2026-09-13', 13, true, 9, true],
  ['2026-09-06', 12, true, 8, true],
];

export const journalGuide = (langue: Langue): Journal => {
  const textes = TEXTES_JOURNAL[langue];
  const base = DONNEES_JOURNAL[langue];
  const e = DONNEES_ETUDE[langue]!;
  const n = NOMS[langue];
  const app = textes.app;
  const samuel = e.PERSONNES.samuel.nom;
  const roster = parNom(
    e.MEMBRES_PARIS_OUEST.map((m) => ({ nom: m.nom, dirigeant: m.nom === samuel ? true : undefined })),
    langue,
  );
  const absents = parNom([{ nom: n.joel }, { nom: n.rose }], langue).map((p) => p.nom);
  const eglise = base.LIVRES.eglise;
  const reunion = ([iso, presents, pain, ch]: (typeof BRUT_2026)[number]): Reunion => ({
    date: jour(langue, iso),
    presents,
    pain,
    livre: ch == null ? undefined : eglise,
    chapitres: ch == null ? undefined : formatChapitres(app, [ch]),
  });
  const decimal = (v: number) => v.toLocaleString(langue);
  const hier = base.HIERARCHIE;
  return {
    ...textes,
    langue,
    d: {
      ...base,
      ASSEMBLEE: n.ouest,
      VILLE: e.VILLE,
      PERSONNES: { ...base.PERSONNES, thomas: { nom: samuel } },
      ROSTER: roster,
      ABSENTS_DU_JOUR: absents,
      PRESENTS_DU_JOUR: roster.map((p) => p.nom).filter((x) => !absents.includes(x)),
      REUNION_DU_JOUR: { date: jour(langue, '2026-10-18'), presents: 13, pain: true, livre: eglise, chapitres: formatChapitres(app, [13, 14]) },
      DATE_CR: '18/10/2026',
      REUNIONS_2026: BRUT_2026.map(reunion),
      AVANCEMENT: base.AVANCEMENT.map((a, i) => (i === 0 ? { ...a, date: jour(langue, '2026-10-18') } : a)),
      PERIODE_MOIS: base.PERIODE_MOIS,
      /**
       * Hiérarchie de Daniel, octobre 2026 jusqu'au 18 : Paris Ouest remplace Paris Nord de « Journal »
       * (3 réunions : 4, 11 et 18 octobre — 12, 13 et 13 présents) ; Paris Est inchangé (2 réunions,
       * 8 de moyenne) ; Paris Sud toujours en alerte. 5 réunions, (16 + 38) / 5 = 10,8 de moyenne.
       */
      HIERARCHIE: {
        ...hier,
        reunions: 5,
        actives: '2 / 3',
        moyenne: decimal(10.8),
        distinctes: 23,
        pain: 4,
        alertes: 1,
        equipe: hier.equipe.map((m) => (m.assemblee === n.nord ? { nom: samuel, assemblee: n.ouest } : m)),
      },
    },
  };
};

/** Vue du membre (Marie) : les réunions de 2026 avec sa présence, et « Mon avancement ». */
export const vueMembre = (langue: Langue) => {
  const j = journalGuide(langue);
  const presences = [true, ...BRUT_2026.map((b) => b[4])];
  return {
    reunions: [j.d.REUNION_DU_JOUR, ...j.d.REUNIONS_2026].map((r, i) => ({ ...r, present: presences[i] })),
    /** Réunions où Marie a été notée présente (`attendedCount`). */
    presences: 46,
    /** Ses modules : chapitres lus lors de ses présences. */
    avancement: [j.d.AVANCEMENT[0], j.d.AVANCEMENT[5]],
  };
};

// ---------------------------------------------------------------------------------------------
// Partie 2 — l'étude (jeu d'« Étude » surchargé)

const IDS_PLAGE_1 = ['q1', 'q5', 'q6', 'q7', 'q7a', 'q7b', 'q10', 'q11'];
const IDS_PLAGE_2 = ['q12', 'q13', 'q31'];

/** Numéros de premier niveau de la leçon 1 (`topLevelNumbers`) : 9 questions. */
export const NUMEROS_LECON = ['1', '5', '6', '7', '10', '11', '12', '13', '31'] as const;

export type Variante = 'lecon' | 'plage1' | 'plage2';

/** Copies du 25 octobre, notes sur 11 (plage 1 à 11, D-ETU-40 : `maxScore` = points de la plage). */
const COPIES_PLAGE_1: Record<Langue, LigneCopie[]> = {
  fr: [
    { nom: 'Aline Tchoua', reponses: 7, note: 9 },
    { nom: 'Christelle Abena', reponses: 7, note: 8 },
    { nom: 'David Laurent', reponses: 6, note: 6.5 },
    { nom: 'Esther Mbida', reponses: 7, note: 10.5 },
    { nom: 'Grâce Ngo', reponses: 7, note: 8.5 },
    { nom: 'Jean Petit', reponses: 7, note: 7 },
    { nom: 'Joël Mvondo', reponses: 0, note: 0 },
    { nom: 'Lucie Roche', reponses: 7, note: 9.5 },
    { nom: 'Marie Kamga', reponses: 7, note: 8.5 },
    { nom: 'Ruth Ateba', reponses: 7, note: 10 },
    { nom: 'Sylvain Ondoa', reponses: 6, note: 7.5 },
  ],
  en: [
    { nom: 'Alice Thompson', reponses: 7, note: 9 },
    { nom: 'Charlotte Adams', reponses: 7, note: 8 },
    { nom: 'David Lawson', reponses: 6, note: 6.5 },
    { nom: 'Esther Morris', reponses: 7, note: 10.5 },
    { nom: 'Grace Nolan', reponses: 7, note: 8.5 },
    { nom: 'John Price', reponses: 7, note: 7 },
    { nom: 'Joseph Moore', reponses: 0, note: 0 },
    { nom: 'Lucy Reed', reponses: 7, note: 9.5 },
    { nom: 'Mary Kent', reponses: 7, note: 8.5 },
    { nom: 'Ruth Allen', reponses: 7, note: 10 },
    { nom: 'Simon Owen', reponses: 6, note: 7.5 },
  ],
};

export const etudeGuide = (langue: Langue, variante: Variante): Etude => {
  const textes = TEXTES_ETUDE[langue]!;
  const base = DONNEES_ETUDE[langue]!;
  const n = NOMS[langue];
  const filtre = (ids: string[]) => base.QUESTIONS.filter((q) => ids.includes(q.id));
  const QUESTIONS: Question[] =
    variante === 'plage1' ? filtre(IDS_PLAGE_1) : variante === 'plage2' ? filtre(IDS_PLAGE_2) : base.QUESTIONS;
  // Joël était absent le 25 : pas de copie (la ligne du tableau sert de repère d'ordre, on l'ôte).
  const copies = parNom(COPIES_PLAGE_1[langue].filter((c) => c.reponses > 0), langue);
  const paul: LigneCopie = { nom: base.PERSONNES.paul.nom, papier: true, reponses: 0, note: 9 };
  const helene: LigneCopie = { nom: base.PERSONNES.helene.nom, papier: true, reponses: 0, note: 8 };
  return {
    ...textes,
    langue,
    d: {
      ...base,
      QUESTIONS,
      COPIES: copies,
      COPIES_AVEC_PAUL: parNom([...copies, paul], langue),
      COPIES_AVEC_PAPIER: parNom([...copies, paul, helene], langue),
      SANS_COPIE: parNom([base.PERSONNES.helene, base.PERSONNES.paul, { nom: n.joel }, { nom: n.rose }, base.PERSONNES.samuel], langue).map((p) => p.nom),
      NOTES_PAPIER: { paul: '9', helene: '8' },
      REPONDANTS: copies.length,
      /** Vue de la ville au 2 novembre : Paris Nord n'apparaît pas dans la Hiérarchie de Daniel (« Journal »). */
      ASSEMBLEES_PARIS: parNom([{ nom: n.est, faites: 1 }, { nom: n.ouest, faites: 1 }, { nom: n.sud, faites: 0 }], langue),
    },
  };
};

/** La copie de Marie, selon le moment. */
export const copiesMarie = (langue: Langue) => {
  const e = DONNEES_ETUDE[langue]!;
  const garder = (c: Copie, ids: string[]): Copie => Object.fromEntries(Object.entries(c).filter(([k]) => ids.includes(k)));
  return {
    /** Pendant les réponses (25 octobre) : elle répond aussi plus loin (Q12, Q13, Q31). */
    reponses: Object.fromEntries(Object.entries(e.COPIE_MARIE).map(([k, r]) => [k, { ...r, points: undefined }])) as Copie,
    /** Au passage en correction, plage 1 à 11 : fermées corrigées. */
    correction: garder(e.COPIE_MARIE, IDS_PLAGE_1),
    /** Après les avis de Jean : 8,5 / 11. */
    terminee: garder(e.COPIES_FINALES.marie, IDS_PLAGE_1),
    /** 1er novembre : ses réponses reprises sur 12 à 31 (D-ETU-41), sans points avant la correction. */
    reprise: Object.fromEntries(IDS_PLAGE_2.map((k) => [k, { ...e.COPIE_MARIE[k], points: undefined }])) as Copie,
  };
};

/** La copie de Rose (rattrapage, le mercredi 28 octobre) : 4 réponses sur 7. */
export const copieRose = (langue: Langue): Copie =>
  langue === 'fr'
    ? { q1: { texte: 'Faire des disciples de toutes les nations.' }, q5: { options: ['OUI'] }, q6: { options: ['VRAI'] }, q7a: { texte: 'Tous ont péché.' } }
    : { q1: { texte: 'To make disciples of all nations.' }, q5: { options: ['OUI'] }, q6: { options: ['VRAI'] }, q7a: { texte: 'All have sinned.' } };

/**
 * Recommandations au dirigeant et actions des membres (avenant 04) : extraits courts, adaptés, des
 * textes du fichier d'import d'UEMB03 (« Devenir et être disciple du Seigneur Jésus », leçon « Le
 * prix à payer pour être disciple ») — illustratifs, à faire valider par JP.
 */
export const NOTES_DIRIGEANT: Record<Langue, { unite: string; lecon: string; actions: string[] }> = {
  fr: {
    unite:
      'Compétence : l’étudiant doit devenir un disciple qui continue à faire du progrès, et qui fait aussi des autres des disciples.',
    lecon:
      'Objectif : présenter les prix à payer pour devenir et demeurer disciple du Seigneur Jésus-Christ.\nN.B. : s’en tenir à la lecture stricte de la portion prescrite du livre.',
    actions: [
      'Faire un travail personnel de confession de ses péchés avec précision.',
      'Tourner le dos à tous ses péchés par un acte délibéré.',
      'Demander à Dieu de lui pardonner et de le purifier.',
    ],
  },
  en: {
    unite: 'Skill: the student must become a disciple who keeps making progress, and who also makes disciples of others.',
    lecon:
      'Aim: to present the price to pay to become and remain a disciple of the Lord Jesus Christ.\nN.B.: keep strictly to reading the set portion of the book.',
    actions: [
      'Make a precise personal confession of one’s sins.',
      'Turn one’s back on all one’s sins by a deliberate act.',
      'Ask God to forgive and cleanse them.',
    ],
  },
};

/** Dates affichées par les écrans de l'étude. */
export const DATES = (langue: Langue) => ({
  seance1: jour(langue, '2026-10-25'),
  seance2: jour(langue, '2026-11-01'),
});

/**
 * Avancement de Paris Ouest au 2 novembre (leçon 1 faite pour l'assemblée, D-ETU-42) : leçons faites
 * et note cumulée de chaque membre (meilleur résultat par question, D-ETU-43). Rose : rattrapage
 * de la plage 1 à 11 et séance du 1er novembre. Samuel n'a pas de copie (il pilote).
 */
export const avancementAssemblee = (langue: Langue) => {
  const e = DONNEES_ETUDE[langue]!;
  const n = NOMS[langue];
  /** [nom, note cumulée] ; `null` : aucune leçon faite (« – »). Joël n'a fait que la plage 12 à 31. */
  const brut: [string, number | null][] = [
    ...COPIES_PLAGE_1[langue].map((c): [string, number | null] => [c.nom, c.reponses > 0 ? c.note + 2 : null]),
    [e.PERSONNES.paul.nom, 10.5],
    [e.PERSONNES.helene.nom, 9.5],
    [n.rose, 7],
    [e.PERSONNES.samuel.nom, null],
  ];
  return parNom(
    brut.map(([nom, note]) => ({ nom, faites: note == null ? 0 : 1, note, sur: 13 })),
    langue,
  );
};

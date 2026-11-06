/**
 * Données fictives de la vidéo « L'Étude de l'assemblée » (storyboard § 6), par langue
 * (`DONNEES.fr` / `DONNEES.en`, même forme `DonneesEtude` ; l'anglais en fin de fichier, storyboard
 * § 10). Toutes inventées ; mêmes
 * prénoms que la présentation au pasteur (Marie K., Jean P., Esther M., Paul N.), complétés d'un
 * nom, plus Hélène Mballa, une aînée sans smartphone qui répond dans un cahier (JP 21/10).
 * L'assemblée de maison Paris Ouest se réunit le dimanche, en journée, dans le salon de Samuel ;
 * Daniel Mercier, dirigeant de la ville de Paris, est le même que dans « Journal ». Réunion montrée :
 * le dimanche 25 octobre 2026 ; leçons 2 et 3 les dimanches 1er et 8 novembre ; vue de la ville le
 * lundi 9 novembre.
 *
 * Contenu de la leçon : `cmfipraise-backend/docs/shephr/21_10_2026/uemb002-exemple.json`, à la
 * lettre (questions de la spec), sauf les titres des leçons 2 à 5, supposés vides (§ 7.4).
 * Les composants lisent ces données par `useEtude().d` (`langue.tsx`).
 */
import type { Langue } from '../textes';

export type TypeQuestion = 'VRAI_FAUX' | 'OUI_NON' | 'CHOIX_UNIQUE' | 'CHOIX_MULTIPLE' | 'OUVERTE' | 'PERSONNELLE' | 'EXERCICE' | 'CONSIGNE';
export type Avis = 'JUSTE' | 'A_PRECISER' | 'A_REVOIR';

/**
 * Question de la leçon (`StudyQuestionView`). Les champs `l*` sont des annotations de mise en
 * page propres à la vidéo : nombre de lignes de l'énoncé (Inter 15, largeur de la carte), d'un
 * choix (Inter 14) seul ou suivi de sa note (« faux », « bonne réponse »), de la réponse du manuel.
 * Les positions d'appui et les défilements des plans en dépendent (relevés sur les captures).
 */
export interface Question {
  id: string;
  numero: string;
  parent?: string;
  enonce: string;
  type: TypeQuestion;
  format?: 'TEXT' | 'YES_NO';
  options?: readonly { cle: string; libelle: string; l?: number; lNote?: number }[];
  cle?: readonly string[];
  manuel?: string;
  points: number;
  bible?: string;
  l: number;
  lManuel?: number;
}

/** Réponse d'une copie (`StudyAnswerView`) : saisie, points (null : pas encore corrigée), avis. */
export interface Reponse {
  texte?: string;
  options?: readonly string[];
  fait?: boolean;
  points?: number | null;
  avis?: Avis;
}
export type Copie = Partial<Record<string, Reponse>>;

export interface Personne {
  nom: string;
  prenom: string;
  initiales: string;
}

export interface LigneCopie {
  nom: string;
  papier?: boolean;
  reponses: number;
  note: number;
}

export interface LeconUnite {
  numero: number;
  titre: string | null;
  portion: string;
  max: number;
}

/** Tri par nom affiché, comme les listes de l'app. */
const parNom = <T extends { nom: string }>(liste: readonly T[], langue: Langue) =>
  [...liste].sort((a, b) => a.nom.localeCompare(b.nom, langue));

const construireFr = () => {
  const PERSONNES: Record<'samuel' | 'marie' | 'jean' | 'esther' | 'paul' | 'helene' | 'daniel', Personne> = {
    samuel: { nom: 'Samuel Fotso', prenom: 'Samuel', initiales: 'SF' },
    marie: { nom: 'Marie Kamga', prenom: 'Marie', initiales: 'MK' },
    jean: { nom: 'Jean Petit', prenom: 'Jean', initiales: 'JP' },
    esther: { nom: 'Esther Mbida', prenom: 'Esther', initiales: 'EM' },
    paul: { nom: 'Paul Nana', prenom: 'Paul', initiales: 'PN' },
    helene: { nom: 'Hélène Mballa', prenom: 'Hélène', initiales: 'HM' },
    daniel: { nom: 'Daniel Mercier', prenom: 'Daniel', initiales: 'DM' },
  };

  // -------------------------------------------------------------------------------------------
  // Le contenu : UEMB002 (§ 6.3)

  const lecons: LeconUnite[] = [
    { numero: 1, titre: 'Le prix à payer', portion: 'Préface et chapitre 1', max: 13 },
    { numero: 2, titre: null, portion: 'Chapitre 2', max: 6 },
    { numero: 3, titre: null, portion: 'Chapitre 3', max: 3 },
    { numero: 4, titre: null, portion: 'Chapitre 4', max: 1 },
    { numero: 5, titre: null, portion: 'Chapitre 5', max: 1 },
  ];
  const UNITE = {
    code: 'UEMB002',
    nom: 'Devenir et être disciple du Seigneur Jésus-Christ',
    livre: 'Disciple coûte que coûte',
    lecons,
  };

  const QUESTIONS: Question[] = [
    { id: 'q1', numero: '1', enonce: "Quel est l'appel ultime du Seigneur Jésus ?", type: 'OUVERTE', manuel: "L'appel à faire des disciples.", points: 2, l: 1 },
    { id: 'q5', numero: '5', enonce: 'Le Seigneur Jésus a vécu une vie sans péché. Oui ou Non ?', type: 'OUI_NON', cle: ['OUI'], points: 1, l: 2 },
    { id: 'q6', numero: '6', enonce: 'Le disciple doit être discipliné.', type: 'VRAI_FAUX', cle: ['VRAI'], points: 1, l: 1 },
    {
      id: 'q7',
      numero: '7',
      enonce: 'Lis les passages suivants : Exode 20 : 1-17 ; Romains 3 : 23.',
      type: 'CONSIGNE',
      points: 0,
      bible: 'Exode 20 : 1-17 ; Romains 3 : 23',
      l: 2,
    },
    {
      id: 'q7a',
      numero: '7.a',
      parent: 'q7',
      enonce: "Que montrent ces passages sur l'état de l'homme devant Dieu ?",
      type: 'OUVERTE',
      manuel: 'Tous ont péché et sont privés de la gloire de Dieu.',
      points: 1,
      l: 2,
      lManuel: 2,
    },
    { id: 'q7b', numero: '7.b', parent: 'q7', enonce: 'Justifie ta réponse par un verset.', type: 'OUVERTE', manuel: 'Romains 3 : 23.', points: 1, l: 1 },
    { id: 'q10', numero: '10', enonce: 'Y a-t-il encore des péchés dans ta vie ?', type: 'PERSONNELLE', format: 'TEXT', manuel: 'Chaque croyant doit répondre', points: 1, l: 1 },
    {
      id: 'q11',
      numero: '11',
      enonce: 'Coche celles qui montrent le prix à payer pour être disciple.',
      type: 'CHOIX_MULTIPLE',
      options: [
        { cle: 'a', libelle: 'Garder la première place pour soi-même', l: 2, lNote: 2 },
        { cle: 'b', libelle: 'Aimer le Seigneur plus que sa famille', l: 1, lNote: 1 },
        { cle: 'c', libelle: 'Porter sa croix chaque jour', l: 1, lNote: 1 },
        { cle: 'd', libelle: 'Suivre le Seigneur quand cela arrange', l: 2, lNote: 2 },
        { cle: 'e', libelle: 'Garder ses biens pour plus tard', l: 1, lNote: 1 },
        { cle: 'f', libelle: "Renoncer à tout ce que l'on possède", l: 1, lNote: 1 },
        { cle: 'g', libelle: 'Haïr sa propre vie à cause de Lui', l: 1, lNote: 2 },
      ],
      cle: ['b', 'c', 'f', 'g'],
      points: 4,
      bible: 'Luc 14 : 25-33',
      l: 2,
    },
    { id: 'q12', numero: '12', enonce: 'Fais la liste de tous tes biens… Prie maintenant et remets-les au Seigneur.', type: 'EXERCICE', points: 0, l: 2 },
    {
      id: 'q13',
      numero: '13',
      enonce: 'As-tu donné au Seigneur ton droit au mariage ? Oui ou Non ?',
      type: 'PERSONNELLE',
      format: 'YES_NO',
      manuel: 'Chaque croyant doit répondre',
      points: 1,
      l: 2,
    },
    {
      id: 'q31',
      numero: '31',
      enonce: 'Qui a des droits prioritaires sur la vie du disciple ?',
      type: 'CHOIX_UNIQUE',
      options: [
        { cle: 'a', libelle: 'Ses parents' },
        { cle: 'b', libelle: 'Son conjoint' },
        { cle: 'c', libelle: 'Lui-même' },
        { cle: 'd', libelle: 'Le Seigneur Jésus' },
      ],
      cle: ['d'],
      points: 1,
      l: 2,
    },
  ];

  /**
   * La copie de Marie (§ 6.4) : ce qu'elle saisit en P9 (Q12, Q13 et Q31 hors champ), puis corrigée
   * au passage en correction (RG-ETU-05/06/08) et par Jean (P14 : Q1 Juste, 7.a Juste, 7.b À préciser).
   * Q11 b, c, f, a → 4 × (3 − 1) / 4 = 2 (RG-ETU-06).
   */
  const SAISIE_MARIE = {
    q1: 'Que nous fassions des disciples.',
    q7a: 'Tous ont péché.',
    q7b: 'Romains 3',
    q10: 'Oui : l’impatience, et parfois l’orgueil. Je les remets au Seigneur.',
    q11: ['b', 'c', 'f', 'a'],
  };

  const COPIE_MARIE: Copie = {
    q1: { texte: SAISIE_MARIE.q1 },
    q5: { options: ['OUI'], points: 1 },
    q6: { options: ['VRAI'], points: 1 },
    q7a: { texte: SAISIE_MARIE.q7a },
    q7b: { texte: SAISIE_MARIE.q7b },
    q10: { texte: SAISIE_MARIE.q10, points: 1 },
    q11: { options: SAISIE_MARIE.q11, points: 2 },
    q12: { fait: true },
    q13: { options: ['OUI'], points: 1 },
    q31: { options: ['d'], points: 1 },
  };

  /** La copie de Jean, à l'écran en P10 (Q11 en cours de saisie : b, c ; g suit hors champ). */
  const COPIE_JEAN: Copie = {
    q1: { texte: 'Faire des disciples.' },
    q5: { options: ['OUI'] },
    q6: { options: ['VRAI'] },
    q7a: { texte: 'Tous sont pécheurs.' },
    q7b: { texte: 'Romains 6' },
    q10: { texte: 'Oui, la colère.' },
    q12: { fait: true },
  };

  /** La copie de Jean au passage en correction (P14, sur son téléphone) : fermées corrigées. */
  const COPIE_JEAN_CORRECTION: Copie = {
    ...COPIE_JEAN,
    q5: { options: ['OUI'], points: 1 },
    q6: { options: ['VRAI'], points: 1 },
    q10: { texte: 'Oui, la colère.', points: 1 },
    q11: { options: ['b', 'c', 'g'], points: 3 },
    q13: { options: ['OUI'], points: 1 },
    q31: { options: ['a'], points: 0 },
  };

  /** La copie de Marie après les avis de Jean (P14) : Q1 Juste, 7.a Juste, 7.b À préciser. */
  const AVIS_JEAN: Record<'q1' | 'q7a' | 'q7b', { avis: Avis; points: number }> = {
    q1: { avis: 'JUSTE', points: 2 },
    q7a: { avis: 'JUSTE', points: 1 },
    q7b: { avis: 'A_PRECISER', points: 0.5 },
  };

  /** Les copies terminées (P15, sous « Ma note ») : Marie 10,5, Jean 9, Esther 12,5 (§ 6.4). */
  const COPIES_FINALES: Record<'marie' | 'jean' | 'esther', Copie> = {
    marie: {
      ...COPIE_MARIE,
      q1: { ...COPIE_MARIE.q1, ...AVIS_JEAN.q1 },
      q7a: { ...COPIE_MARIE.q7a, ...AVIS_JEAN.q7a },
      q7b: { ...COPIE_MARIE.q7b, ...AVIS_JEAN.q7b },
    },
    jean: {
      ...COPIE_JEAN_CORRECTION,
      q1: { texte: 'Faire des disciples.', avis: 'A_PRECISER', points: 1 },
      q7a: { texte: 'Tous sont pécheurs.', avis: 'JUSTE', points: 1 },
      q7b: { texte: 'Romains 6', avis: 'A_REVOIR', points: 0 },
    },
    esther: {
      q1: { texte: "L'appel à faire des disciples.", avis: 'JUSTE', points: 2 },
      q5: { options: ['OUI'], points: 1 },
      q6: { options: ['VRAI'], points: 1 },
      q7a: { texte: 'Tous ont péché.', avis: 'JUSTE', points: 1 },
      q7b: { texte: 'Romains 3', avis: 'A_PRECISER', points: 0.5 },
      q10: { texte: 'Oui.', points: 1 },
      q11: { options: ['b', 'c', 'f', 'g'], points: 4 },
      q12: { fait: true },
      q13: { options: ['OUI'], points: 1 },
      q31: { options: ['d'], points: 1 },
    },
  };

  // -------------------------------------------------------------------------------------------
  // Les copies du 25 octobre (§ 6.4) : 11 copies dans l'app, puis les deux copies papier saisies
  // par Samuel en P16 (D-ETU-13 : la note seule) — Paul (livret), Hélène (cahier).

  const COPIES: LigneCopie[] = parNom(
    [
      { nom: 'Aline Tchoua', reponses: 10, note: 11 },
      { nom: 'Christelle Abena', reponses: 10, note: 9.5 },
      { nom: 'David Laurent', reponses: 9, note: 8 },
      { nom: 'Esther Mbida', reponses: 10, note: 12.5 },
      { nom: 'Grâce Ngo', reponses: 10, note: 10 },
      { nom: 'Jean Petit', reponses: 10, note: 9 },
      { nom: 'Joël Mvondo', reponses: 8, note: 7.5 },
      { nom: 'Lucie Roche', reponses: 10, note: 11.5 },
      { nom: 'Marie Kamga', reponses: 10, note: 10.5 },
      { nom: 'Ruth Ateba', reponses: 10, note: 12 },
      { nom: 'Sylvain Ondoa', reponses: 9, note: 9 },
    ],
    'fr',
  );
  const COPIE_PAUL: LigneCopie = { nom: PERSONNES.paul.nom, papier: true, reponses: 0, note: 11 };
  const COPIE_HELENE: LigneCopie = { nom: PERSONNES.helene.nom, papier: true, reponses: 0, note: 10 };
  /** Après la saisie de Paul, puis après celle d'Hélène : chacun prend sa place dans l'ordre des noms. */
  const COPIES_AVEC_PAUL = parNom([...COPIES, COPIE_PAUL], 'fr');
  const COPIES_AVEC_PAPIER = parNom([...COPIES, COPIE_PAUL, COPIE_HELENE], 'fr');

  /** Répondants sans copie (`withoutCopy`, ordre alphabétique) : la liste de la modale papier. */
  const SANS_COPIE = parNom(
    [PERSONNES.helene, PERSONNES.paul, { nom: 'Rose Eyenga' }, PERSONNES.samuel].map((p) => ({ nom: p.nom })),
    'fr',
  ).map((p) => p.nom);
  const SANS_COPIE_APRES_PAUL = SANS_COPIE.filter((n) => n !== PERSONNES.paul.nom);

  /** Notes de la fin de séance (P15). */
  const NOTES = { marie: 10.5, jean: 9, esther: 12.5 };
  /** Notes papier saisies en P16, telles que tapées dans le champ. */
  const NOTES_PAPIER = { paul: '11', helene: '10' };

  // -------------------------------------------------------------------------------------------
  // Avancement au 8 novembre (§ 6.5)

  /** Progression de Marie (P17, P18) : leçons, date, meilleure note ; note cumulée 18,5 / 22. */
  const PROGRESSION_MARIE = {
    faites: 3,
    note: 18.5,
    sur: 22,
    lecons: [
      { numero: 1, titre: 'Le prix à payer' as string | null, date: '25 octobre 2026' as string | null, note: 10.5 as number | null, max: 13 },
      { numero: 2, titre: null, date: '1 novembre 2026', note: 5, max: 6 },
      { numero: 3, titre: null, date: '8 novembre 2026', note: 3, max: 3 },
      { numero: 4, titre: null, date: null, note: null, max: 1 },
      { numero: 5, titre: null, date: null, note: null, max: 1 },
    ],
  };

  /**
   * Membres de Paris Ouest (avancement de l'assemblée, P18) : répondants actuels, triés par nom ;
   * `note` / `sur` = note cumulée (meilleure note par leçon faite, RG-ETU-17). Paul et Hélène ont
   * toutes leurs leçons en copie papier.
   */
  const MEMBRES_PARIS_OUEST: { nom: string; faites: number; note: number | null; sur: number | null }[] = parNom(
    [
      { nom: 'Aline Tchoua', faites: 3, note: 17.5, sur: 22 },
      { nom: 'Christelle Abena', faites: 3, note: 15.5, sur: 22 },
      { nom: 'David Laurent', faites: 3, note: 13, sur: 22 },
      { nom: 'Esther Mbida', faites: 3, note: 21.5, sur: 22 },
      { nom: 'Grâce Ngo', faites: 3, note: 17, sur: 22 },
      { nom: 'Hélène Mballa', faites: 3, note: 16, sur: 22 },
      { nom: 'Jean Petit', faites: 3, note: 16, sur: 22 },
      { nom: 'Joël Mvondo', faites: 2, note: 11.5, sur: 19 },
      { nom: 'Lucie Roche', faites: 3, note: 19.5, sur: 22 },
      { nom: 'Marie Kamga', faites: 3, note: 18.5, sur: 22 },
      { nom: 'Paul Nana', faites: 3, note: 17, sur: 22 },
      { nom: 'Rose Eyenga', faites: 2, note: 8, sur: 9 },
      { nom: 'Ruth Ateba', faites: 3, note: 21, sur: 22 },
      { nom: 'Samuel Fotso', faites: 0, note: null, sur: null },
      { nom: 'Sylvain Ondoa', faites: 3, note: 15, sur: 22 },
    ],
    'fr',
  );

  /** Vue d'ensemble de la ville de Paris (Daniel, P18). */
  const ASSEMBLEES_PARIS = [
    { nom: 'Paris Est', faites: 1 },
    { nom: 'Paris Nord', faites: 2 },
    { nom: 'Paris Ouest', faites: 3 },
    { nom: 'Paris Sud', faites: 0 },
  ];

  return {
    PERSONNES,
    ASSEMBLEE: 'Paris Ouest',
    VILLE: 'Paris',
    UNITE,
    /** « UEMB002 · Devenir et être disciple du Seigneur Jésus-Christ » (`code · nom`). */
    UNITE_LIBELLE: `${UNITE.code} · ${UNITE.nom}`,
    QUESTIONS,
    SAISIE_MARIE,
    COPIE_MARIE,
    COPIE_JEAN,
    COPIE_JEAN_CORRECTION,
    AVIS_JEAN,
    COPIES_FINALES,
    COPIES,
    COPIES_AVEC_PAUL,
    COPIES_AVEC_PAPIER,
    SANS_COPIE,
    SANS_COPIE_APRES_PAUL,
    NOTES,
    NOTES_PAPIER,
    /** Avis à poser au passage en correction : 11 copies × 3 réponses écrites − 3 sans réponse. */
    AVIS_RESTANTS: 30,
    /** Copies dans l'app (les copies papier s'ajoutent après, depuis les résultats). */
    REPONDANTS: 11,
    PROGRESSION_MARIE,
    MEMBRES_PARIS_OUEST,
    ASSEMBLEES_PARIS,
    DERNIERE_SEANCE: '8 novembre 2026',
    DATE_SEANCE: '25 octobre 2026',
  };
};

export type DonneesEtude = ReturnType<typeof construireFr>;

// ---------------------------------------------------------------------------------------------
// Version anglaise (`EtudeEN`, JP 21/10/2026) — storyboard § 10.
//
// Une assemblée de maison anglophone fictive, Leeds West (ville de Leeds, celle de « Journal » en
// anglais : Daniel Morgan en est le dirigeant), réunie le dimanche, en journée, chez Samuel Fisher.
// Mêmes personnes, mêmes rôles, mêmes initiales : Samuel Fotso → Samuel Fisher, Marie Kamga →
// Mary Kent, Jean Petit → John Price, Esther Mbida → Esther Morris, Paul Nana → Paul Newton,
// Hélène Mballa → Helen Marshall, Daniel Mercier → Daniel Morgan. Les autres noms sont choisis pour
// garder l'ordre alphabétique de l'app : chacun reste à la même ligne des listes (appuis inchangés).
// Mêmes dimanches (25 octobre, 1er et 8 novembre 2026), dates au format de l'app anglaise
// (`fmtIsoDay` : « 25 October 2026 »). Mêmes chiffres : `memesChiffres` le vérifie au chargement.
//
// La leçon : traduction anglaise (illustrative, comme le français est un extrait) de la leçon 1 de
// UEMB002 — l'avenant langue : une assemblée anglophone étudie la version anglaise de l'unité, même
// code. Nombres de lignes `l*` mesurés pour le texte anglais (Inter, largeurs des cartes de
// `ecrans/Questions.tsx`).
// Titre de la leçon 1 : « The Cost » (Luc 14 : 28, « count the cost ») plutôt que « The Price to
// Pay », qui passait sur deux lignes dans « My progress » (P17, rangée avec note et chevron).

const construireEn = (): DonneesEtude => {
  const PERSONNES: DonneesEtude['PERSONNES'] = {
    samuel: { nom: 'Samuel Fisher', prenom: 'Samuel', initiales: 'SF' },
    marie: { nom: 'Mary Kent', prenom: 'Mary', initiales: 'MK' },
    jean: { nom: 'John Price', prenom: 'John', initiales: 'JP' },
    esther: { nom: 'Esther Morris', prenom: 'Esther', initiales: 'EM' },
    paul: { nom: 'Paul Newton', prenom: 'Paul', initiales: 'PN' },
    helene: { nom: 'Helen Marshall', prenom: 'Helen', initiales: 'HM' },
    daniel: { nom: 'Daniel Morgan', prenom: 'Daniel', initiales: 'DM' },
  };

  const lecons: LeconUnite[] = [
    { numero: 1, titre: 'The Cost', portion: 'Preface and chapter 1', max: 13 },
    { numero: 2, titre: null, portion: 'Chapter 2', max: 6 },
    { numero: 3, titre: null, portion: 'Chapter 3', max: 3 },
    { numero: 4, titre: null, portion: 'Chapter 4', max: 1 },
    { numero: 5, titre: null, portion: 'Chapter 5', max: 1 },
  ];
  const UNITE = {
    code: 'UEMB002',
    nom: 'Becoming and Being a Disciple of the Lord Jesus Christ',
    livre: 'Discipleship at Any Cost',
    lecons,
  };

  const QUESTIONS: Question[] = [
    { id: 'q1', numero: '1', enonce: "What is the Lord Jesus' ultimate call?", type: 'OUVERTE', manuel: 'The call to make disciples.', points: 2, l: 1 },
    { id: 'q5', numero: '5', enonce: 'The Lord Jesus lived a life without sin. Yes or No?', type: 'OUI_NON', cle: ['OUI'], points: 1, l: 2 },
    { id: 'q6', numero: '6', enonce: 'The disciple must be disciplined.', type: 'VRAI_FAUX', cle: ['VRAI'], points: 1, l: 1 },
    {
      id: 'q7',
      numero: '7',
      enonce: 'Read the following passages: Exodus 20:1-17; Romans 3:23.',
      type: 'CONSIGNE',
      points: 0,
      bible: 'Exodus 20:1-17; Romans 3:23',
      l: 2,
    },
    {
      id: 'q7a',
      numero: '7.a',
      parent: 'q7',
      enonce: "What do these passages show about man's state before God?",
      type: 'OUVERTE',
      manuel: 'All have sinned and fall short of the glory of God.',
      points: 1,
      l: 2,
      lManuel: 2,
    },
    { id: 'q7b', numero: '7.b', parent: 'q7', enonce: 'Support your answer with a verse.', type: 'OUVERTE', manuel: 'Romans 3:23.', points: 1, l: 1 },
    { id: 'q10', numero: '10', enonce: 'Are there still sins in your life?', type: 'PERSONNELLE', format: 'TEXT', manuel: 'Each believer must answer', points: 1, l: 1 },
    {
      id: 'q11',
      numero: '11',
      enonce: 'Tick the ones that show the price to pay to be a disciple.',
      type: 'CHOIX_MULTIPLE',
      options: [
        { cle: 'a', libelle: 'Keep first place for oneself', l: 1, lNote: 1 },
        { cle: 'b', libelle: "Love the Lord above one's family", l: 1, lNote: 1 },
        { cle: 'c', libelle: "Carry one's cross every day", l: 1, lNote: 1 },
        { cle: 'd', libelle: 'Follow the Lord when it suits', l: 1, lNote: 1 },
        { cle: 'e', libelle: "Keep one's possessions for later", l: 1, lNote: 1 },
        { cle: 'f', libelle: 'Give up everything one owns', l: 1, lNote: 1 },
        { cle: 'g', libelle: "Hate one's own life because of Him", l: 1, lNote: 2 },
      ],
      cle: ['b', 'c', 'f', 'g'],
      points: 4,
      bible: 'Luke 14:25-33',
      l: 2,
    },
    { id: 'q12', numero: '12', enonce: 'List all your possessions… Now pray and hand them over to the Lord.', type: 'EXERCICE', points: 0, l: 2 },
    {
      id: 'q13',
      numero: '13',
      enonce: 'Have you given the Lord your right to marriage? Yes or No?',
      type: 'PERSONNELLE',
      format: 'YES_NO',
      manuel: 'Each believer must answer',
      points: 1,
      l: 2,
    },
    {
      id: 'q31',
      numero: '31',
      enonce: "Who has priority rights over the disciple's life?",
      type: 'CHOIX_UNIQUE',
      options: [
        { cle: 'a', libelle: 'His parents' },
        { cle: 'b', libelle: 'His spouse' },
        { cle: 'c', libelle: 'Himself' },
        { cle: 'd', libelle: 'The Lord Jesus' },
      ],
      cle: ['d'],
      points: 1,
      l: 2,
    },
  ];

  /** La copie de Mary (= Marie) : mêmes réponses, mêmes points. */
  const SAISIE_MARIE = {
    q1: 'That we make disciples.',
    q7a: 'All have sinned.',
    q7b: 'Romans 3',
    q10: 'Yes: impatience, and sometimes pride. I give them to the Lord.',
    q11: ['b', 'c', 'f', 'a'],
  };

  const COPIE_MARIE: Copie = {
    q1: { texte: SAISIE_MARIE.q1 },
    q5: { options: ['OUI'], points: 1 },
    q6: { options: ['VRAI'], points: 1 },
    q7a: { texte: SAISIE_MARIE.q7a },
    q7b: { texte: SAISIE_MARIE.q7b },
    q10: { texte: SAISIE_MARIE.q10, points: 1 },
    q11: { options: SAISIE_MARIE.q11, points: 2 },
    q12: { fait: true },
    q13: { options: ['OUI'], points: 1 },
    q31: { options: ['d'], points: 1 },
  };

  /** La copie de John (= Jean), à l'écran en P10. */
  const COPIE_JEAN: Copie = {
    q1: { texte: 'Make disciples.' },
    q5: { options: ['OUI'] },
    q6: { options: ['VRAI'] },
    q7a: { texte: 'All are sinners.' },
    q7b: { texte: 'Romans 6' },
    q10: { texte: 'Yes, anger.' },
    q12: { fait: true },
  };

  const COPIE_JEAN_CORRECTION: Copie = {
    ...COPIE_JEAN,
    q5: { options: ['OUI'], points: 1 },
    q6: { options: ['VRAI'], points: 1 },
    q10: { texte: 'Yes, anger.', points: 1 },
    q11: { options: ['b', 'c', 'g'], points: 3 },
    q13: { options: ['OUI'], points: 1 },
    q31: { options: ['a'], points: 0 },
  };

  const AVIS_JEAN: Record<'q1' | 'q7a' | 'q7b', { avis: Avis; points: number }> = {
    q1: { avis: 'JUSTE', points: 2 },
    q7a: { avis: 'JUSTE', points: 1 },
    q7b: { avis: 'A_PRECISER', points: 0.5 },
  };

  const COPIES_FINALES: Record<'marie' | 'jean' | 'esther', Copie> = {
    marie: {
      ...COPIE_MARIE,
      q1: { ...COPIE_MARIE.q1, ...AVIS_JEAN.q1 },
      q7a: { ...COPIE_MARIE.q7a, ...AVIS_JEAN.q7a },
      q7b: { ...COPIE_MARIE.q7b, ...AVIS_JEAN.q7b },
    },
    jean: {
      ...COPIE_JEAN_CORRECTION,
      q1: { texte: 'Make disciples.', avis: 'A_PRECISER', points: 1 },
      q7a: { texte: 'All are sinners.', avis: 'JUSTE', points: 1 },
      q7b: { texte: 'Romans 6', avis: 'A_REVOIR', points: 0 },
    },
    esther: {
      q1: { texte: 'The call to make disciples.', avis: 'JUSTE', points: 2 },
      q5: { options: ['OUI'], points: 1 },
      q6: { options: ['VRAI'], points: 1 },
      q7a: { texte: 'All have sinned.', avis: 'JUSTE', points: 1 },
      q7b: { texte: 'Romans 3', avis: 'A_PRECISER', points: 0.5 },
      q10: { texte: 'Yes.', points: 1 },
      q11: { options: ['b', 'c', 'f', 'g'], points: 4 },
      q12: { fait: true },
      q13: { options: ['OUI'], points: 1 },
      q31: { options: ['d'], points: 1 },
    },
  };

  /** Les 11 copies dans l'app : même rang alphabétique et mêmes notes que le français. */
  const COPIES: LigneCopie[] = parNom(
    [
      { nom: 'Alice Thompson', reponses: 10, note: 11 },
      { nom: 'Charlotte Adams', reponses: 10, note: 9.5 },
      { nom: 'David Lawson', reponses: 9, note: 8 },
      { nom: 'Esther Morris', reponses: 10, note: 12.5 },
      { nom: 'Grace Nolan', reponses: 10, note: 10 },
      { nom: 'John Price', reponses: 10, note: 9 },
      { nom: 'Joseph Moore', reponses: 8, note: 7.5 },
      { nom: 'Lucy Reed', reponses: 10, note: 11.5 },
      { nom: 'Mary Kent', reponses: 10, note: 10.5 },
      { nom: 'Ruth Allen', reponses: 10, note: 12 },
      { nom: 'Simon Owen', reponses: 9, note: 9 },
    ],
    'en',
  );
  const COPIE_PAUL: LigneCopie = { nom: PERSONNES.paul.nom, papier: true, reponses: 0, note: 11 };
  const COPIE_HELENE: LigneCopie = { nom: PERSONNES.helene.nom, papier: true, reponses: 0, note: 10 };
  const COPIES_AVEC_PAUL = parNom([...COPIES, COPIE_PAUL], 'en');
  const COPIES_AVEC_PAPIER = parNom([...COPIES, COPIE_PAUL, COPIE_HELENE], 'en');

  const SANS_COPIE = parNom(
    [PERSONNES.helene, PERSONNES.paul, { nom: 'Rose Ellis' }, PERSONNES.samuel].map((p) => ({ nom: p.nom })),
    'en',
  ).map((p) => p.nom);
  const SANS_COPIE_APRES_PAUL = SANS_COPIE.filter((n) => n !== PERSONNES.paul.nom);

  const NOTES = { marie: 10.5, jean: 9, esther: 12.5 };
  const NOTES_PAPIER = { paul: '11', helene: '10' };

  const PROGRESSION_MARIE = {
    faites: 3,
    note: 18.5,
    sur: 22,
    lecons: [
      { numero: 1, titre: 'The Cost' as string | null, date: '25 October 2026' as string | null, note: 10.5 as number | null, max: 13 },
      { numero: 2, titre: null, date: '1 November 2026', note: 5, max: 6 },
      { numero: 3, titre: null, date: '8 November 2026', note: 3, max: 3 },
      { numero: 4, titre: null, date: null, note: null, max: 1 },
      { numero: 5, titre: null, date: null, note: null, max: 1 },
    ],
  };

  /** Les membres de Leeds West, mêmes avancements que ceux de Paris Ouest, ligne pour ligne. */
  const MEMBRES_PARIS_OUEST: { nom: string; faites: number; note: number | null; sur: number | null }[] = parNom(
    [
      { nom: 'Alice Thompson', faites: 3, note: 17.5, sur: 22 },
      { nom: 'Charlotte Adams', faites: 3, note: 15.5, sur: 22 },
      { nom: 'David Lawson', faites: 3, note: 13, sur: 22 },
      { nom: 'Esther Morris', faites: 3, note: 21.5, sur: 22 },
      { nom: 'Grace Nolan', faites: 3, note: 17, sur: 22 },
      { nom: 'Helen Marshall', faites: 3, note: 16, sur: 22 },
      { nom: 'John Price', faites: 3, note: 16, sur: 22 },
      { nom: 'Joseph Moore', faites: 2, note: 11.5, sur: 19 },
      { nom: 'Lucy Reed', faites: 3, note: 19.5, sur: 22 },
      { nom: 'Mary Kent', faites: 3, note: 18.5, sur: 22 },
      { nom: 'Paul Newton', faites: 3, note: 17, sur: 22 },
      { nom: 'Rose Ellis', faites: 2, note: 8, sur: 9 },
      { nom: 'Ruth Allen', faites: 3, note: 21, sur: 22 },
      { nom: 'Samuel Fisher', faites: 0, note: null, sur: null },
      { nom: 'Simon Owen', faites: 3, note: 15, sur: 22 },
    ],
    'en',
  );

  /**
   * Vue d'ensemble de la ville de Leeds (Daniel). Le serveur trie par nom (`StudyServiceImpl`) :
   * « Leeds West » passe en dernier (4ᵉ rangée au lieu de la 3ᵉ pour « Paris Ouest ») ; l'appui de
   * P18 suit sa rangée (`rangeeAssemblee`).
   */
  const ASSEMBLEES_PARIS = [
    { nom: 'Leeds East', faites: 1 },
    { nom: 'Leeds North', faites: 2 },
    { nom: 'Leeds South', faites: 0 },
    { nom: 'Leeds West', faites: 3 },
  ];

  return {
    PERSONNES,
    ASSEMBLEE: 'Leeds West',
    VILLE: 'Leeds',
    UNITE,
    UNITE_LIBELLE: `${UNITE.code} · ${UNITE.nom}`,
    QUESTIONS,
    SAISIE_MARIE,
    COPIE_MARIE,
    COPIE_JEAN,
    COPIE_JEAN_CORRECTION,
    AVIS_JEAN,
    COPIES_FINALES,
    COPIES,
    COPIES_AVEC_PAUL,
    COPIES_AVEC_PAPIER,
    SANS_COPIE,
    SANS_COPIE_APRES_PAUL,
    NOTES,
    NOTES_PAPIER,
    AVIS_RESTANTS: 30,
    REPONDANTS: 11,
    PROGRESSION_MARIE,
    MEMBRES_PARIS_OUEST,
    ASSEMBLEES_PARIS,
    DERNIERE_SEANCE: '8 November 2026',
    DATE_SEANCE: '25 October 2026',
  };
};

/**
 * Garde « mêmes chiffres » : les deux jeux ne diffèrent que par leurs textes. On compare leurs
 * structures en remplaçant chaque chaîne par un repère, hors annotations de mise en page (`l*`) et
 * hors vue de la ville, dont l'ordre suit le tri anglais (comparée à part, par nom de rangée).
 */
const squelette = (v: unknown, cle = ''): unknown => {
  if (typeof v === 'string') return 's';
  if (Array.isArray(v)) return v.map((x) => squelette(x));
  if (v && typeof v === 'object')
    return Object.fromEntries(
      Object.entries(v)
        .filter(([k]) => !/^l(Note|Manuel)?$/.test(k) && !(cle === '' && k === 'ASSEMBLEES_PARIS'))
        .map(([k, x]) => [k, squelette(x, k)]),
    );
  return v;
};
const memesChiffres = (fr: DonneesEtude, autre: DonneesEtude, langue: Langue) => {
  const avancement = (d: DonneesEtude) =>
    d.ASSEMBLEES_PARIS.map((a) => a.faites).sort().join() + '|' + d.ASSEMBLEES_PARIS.find((a) => a.nom === d.ASSEMBLEE)?.faites;
  if (JSON.stringify(squelette(fr)) !== JSON.stringify(squelette(autre)) || avancement(fr) !== avancement(autre))
    throw new Error(`Vidéo « Étude » : les données « ${langue} » n'ont pas les mêmes chiffres que le français.`);
  return autre;
};

const FR = construireFr();

/** Données par langue (mêmes chiffres, vérifiés au chargement). */
export const DONNEES: Partial<Record<Langue, DonneesEtude>> = { fr: FR, en: memesChiffres(FR, construireEn(), 'en') };

/** Questions à répondre : toutes sauf la consigne (`isAnswerable`) → 10. */
export const aRepondre = (questions: readonly Question[]) => questions.filter((q) => q.type !== 'CONSIGNE').length;
/** Note de la leçon : somme des questions notées → 13. */
export const noteSur = (questions: readonly Question[]) =>
  questions.reduce((s, q) => s + (q.type === 'EXERCICE' || q.type === 'CONSIGNE' ? 0 : q.points), 0);

/**
 * Données FICTIVES de la vidéo « Évènements » (storyboard § 5). Aucune personne réelle.
 * Date de l'histoire : mercredi 14 octobre 2026.
 *
 * Cohérence vérifiée (§ 5.3) : Paris 7 + 11 + 8 + 2 = 28 ; Île-de-France 11 + 28 + 9 + 1 = 49 ;
 * France 31 + 24 + 49 + 2 = 106 ; Paris Nord 11 = somme par type = somme par mois.
 *
 * D-EVT-15 (JP 14/10) : l'ancien compteur unique devient « Conversions » (mêmes chiffres, renommage sans
 * perte) ; s'ajoutent « Restaurations » et « Baptêmes ». Tous facultatifs : un compteur non
 * renseigné est absent de la ligne d'un évènement et vaut 0 dans les sommes. Sommes vérifiées à
 * chaque niveau (§ 5.3) — conversions / restaurations / baptêmes :
 *   Paris      9 + 17 + 7 + 10 = 43 ;  3 + 6 + 2 + 4 = 15 ;  2 + 5 + 3 + 3 = 13
 *   IDF       12 + 43 + 8 +  5 = 68 ;  4 + 15 + 2 + 1 = 22 ;  3 + 13 + 2 + 1 = 19
 *   France    37 + 26 + 68 + 12 = 143 ; 11 + 8 + 22 + 3 = 44 ;  9 + 6 + 19 + 2 = 36
 *   Paris Nord, par type : 7 + 4 + 1 + 5 = 17 ; 2 + 2 + 0 + 2 = 6 ; 3 + 0 + 1 + 1 = 5
 *   Paris Nord, par mois : 1 + 2 + 1 + 1 + 7 + 5 = 17 ; 1 + 0 + 2 + 0 + 3 + 0 = 6 ; 0 + 1 + 0 + 1 + 0 + 3 = 5
 *
 * D-EVT-17 (JP 14/10) : « Invités », la part de personnes extérieures parmi les participants (ils y
 * sont INCLUS : invités ≤ participants partout, RG-EVT-09). Facultatif pour tout type ; non
 * renseigné = absent de la ligne, 0 dans les sommes. Sommes vérifiées par script (assemblée →
 * ville → région → nation, par type, par mois, à partir des 11 actions de Paris Nord, storyboard § 5.4) :
 *   Paris      40 + 71 + 29 + 63 = 203 ; IDF 55 + 203 + 41 + 22 = 321 ; France 162 + 118 + 321 + 96 = 697
 *   Paris Nord, par type : 0 + 18 + 0 + 30 + 2 + 21 + 0 = 71 ; par mois : 4 + 5 + 6 + 2 + 35 + 19 = 71
 *
 * D-EVT-16 (JP 14/10) : « Prédicateur », texte libre facultatif d'un type évangélique. Montré sur la
 * « Campagne de quartier » (saisi par Élise en la programmant, P5) et sur le « Concert de louange »
 * (saisi par Daniel à la clôture, P10). Aucune statistique par prédicateur (plan § 8).
 */

export const PERSONNES = {
  membre: { prenom: 'Élise', nom: 'Élise Durand', initiales: 'ÉD' },
  dirigeant: { prenom: 'Daniel', nom: 'Daniel Mercier', initiales: 'DM' },
} as const;

/** Le nœud d'assemblée s'appelle « Paris Nord » : l'app écrit elle-même « l'assemblée … ». */
export const ASSEMBLEE = 'Paris Nord';
export const VILLE = 'Paris';

/** Catalogue initial, dans l'ordre du backend (db/changes/events/01-events.sql). */
export const TYPES = [
  'Retraite',
  'Campagne',
  'Conférence',
  'Concert',
  "Implantation d'église de maison",
  'Action de grâce',
  'Autre',
] as const;
export type TypeEvenement = (typeof TYPES)[number];

/** Une ligne d'évènement telle que l'affiche `EventRow`. */
export interface LigneEvenement {
  type: TypeEvenement;
  titre?: string;
  dates: string;
  lieu?: string;
  noeud: string;
  participants?: number;
  /** D-EVT-17 : invités, inclus dans les participants ; absent s'il n'a pas été saisi. */
  invites?: number;
  /** D-EVT-16 : prédicateur (type évangélique), absent s'il n'a pas été saisi. */
  predicateur?: string;
  /** D-EVT-15 : compteurs d'un type évangélique, absents s'ils n'ont pas été saisis. */
  conversions?: number;
  restaurations?: number;
  baptemes?: number;
  statut?: 'programme' | 'aCloturer';
  mien?: boolean;
}

// --- Vue membre (EventMemberView), assemblée Paris Nord -------------------------------------

export const RETRAITE: LigneEvenement = {
  type: 'Retraite',
  titre: "Retraite d'automne",
  dates: '7 novembre 2026 → 8 novembre 2026',
  lieu: 'Fontainebleau',
  noeud: ASSEMBLEE,
  statut: 'programme',
};

export const CAMPAGNE_ELISE: LigneEvenement = {
  type: 'Campagne',
  dates: '14 octobre 2026',
  noeud: ASSEMBLEE,
  mien: true,
};

export const CONCERT_ELISE: LigneEvenement = {
  type: 'Concert',
  dates: '14 octobre 2026',
  lieu: 'Gare du Nord',
  noeud: ASSEMBLEE,
  mien: true,
};

/** Actions réalisées de Paris Nord avant celles d'Élise, les plus récentes en haut. */
export const REALISEES_PARIS_NORD: LigneEvenement[] = [
  { type: 'Action de grâce', dates: '11 octobre 2026', lieu: 'Paris 18e', noeud: ASSEMBLEE, participants: 40, invites: 12, conversions: 2, baptemes: 1 },
  { type: 'Campagne', dates: '3 octobre 2026', lieu: 'Marché de la Chapelle', noeud: ASSEMBLEE, participants: 18, invites: 7, conversions: 3, baptemes: 2 },
  { type: 'Action de grâce', dates: '26 septembre 2026', noeud: ASSEMBLEE, participants: 9, invites: 3, conversions: 2 },
];

/** Compteurs d'Élise (EventCounters) : avant P2, après P2, après P4. */
export const COMPTEURS = { mois: [2, 3, 4], annee: [9, 10, 11] } as const;
/** Badge du bloc « Actions d'évangélisation » : toutes les actions comptées de 2026. */
export const BADGE_REALISEES = [9, 10, 11] as const;

// --- Programmés (agenda) ----------------------------------------------------------------------

export const CAMPAGNE_QUARTIER = {
  type: 'Campagne' as const,
  titre: 'Campagne de quartier',
  date: '17 octobre 2026',
  /** D-EVT-16 : saisi par Élise dès la programmation (P5), prérempli à la clôture (P6). */
  predicateur: 'Pasteur Jean-Marc Lefort',
};

export const GRANDE_CAMPAGNE = {
  type: 'Campagne' as const,
  titre: 'Grande campagne de Paris',
  date: '24 octobre 2026',
};

export const CONCERT_LOUANGE = {
  type: 'Concert' as const,
  titre: 'Concert de louange',
  date: '10 octobre 2026',
  lieu: 'Paris 10e',
  participants: 150,
  /** D-EVT-17 : 45 invités parmi les 150 participants. */
  invites: 45,
  /** D-EVT-16 : inconnu à la programmation, saisi par Daniel à la clôture (P10). */
  predicateur: 'Pasteur Samuel Kouassi',
  conversions: 6,
  restaurations: 3,
  baptemes: 2,
};

/** Agenda de Daniel (dirigeant de la ville de Paris). */
export const AGENDA = {
  aCloturer: [
    { type: 'Concert', titre: CONCERT_LOUANGE.titre, dates: CONCERT_LOUANGE.date, lieu: 'Paris 10e', noeud: VILLE, statut: 'aCloturer' },
  ] as LigneEvenement[],
  aVenir: [
    // Programmée par Élise en P5 : le dirigeant de la ville la voit dans son agenda.
    {
      type: 'Campagne',
      titre: CAMPAGNE_QUARTIER.titre,
      dates: CAMPAGNE_QUARTIER.date,
      noeud: ASSEMBLEE,
      predicateur: CAMPAGNE_QUARTIER.predicateur,
      statut: 'programme',
    },
    { ...RETRAITE },
  ] as LigneEvenement[],
  realises: [
    { type: 'Concert', dates: '14 octobre 2026', lieu: 'Gare du Nord', noeud: ASSEMBLEE },
    { type: 'Campagne', dates: '14 octobre 2026', noeud: ASSEMBLEE },
    REALISEES_PARIS_NORD[0],
    { type: "Implantation d'église de maison", dates: '9 octobre 2026', lieu: 'Paris 14e', noeud: 'Paris Sud', participants: 8, invites: 3, conversions: 1 },
    REALISEES_PARIS_NORD[1],
  ] as LigneEvenement[],
};

/**
 * « À venir » de l'agenda de Daniel après P9 (P10, P11) : la « Grande campagne de Paris » qu'il
 * vient de programmer s'y range à sa date, entre le 17 octobre et le 7 novembre (revue du 14/10).
 */
export const A_VENIR_APRES_P9: LigneEvenement[] = [
  AGENDA.aVenir[0],
  { type: GRANDE_CAMPAGNE.type, titre: GRANDE_CAMPAGNE.titre, dates: GRANDE_CAMPAGNE.date, noeud: VILLE, statut: 'programme' },
  ...AGENDA.aVenir.slice(1),
];

/** Action de Paris Sud posée « à vérifier » en P11. */
export const IMPLANTATION_SUD = {
  type: "Implantation d'église de maison" as const,
  date: '9 octobre 2026',
  noeud: 'Paris Sud',
  lieu: 'Paris 14e',
  participants: 8,
  invites: 3,
  conversions: 1,
  auteur: 'Marc Lefèvre',
};

// --- Statistiques (année 2026) ------------------------------------------------------------------

export interface Totaux {
  nom: string;
  nombre: number;
  participants: number;
  /** D-EVT-17 : somme des invités (inclus dans `participants`). */
  invites: number;
  conversions: number;
  restaurations: number;
  baptemes: number;
}

export interface NiveauStats {
  /** Fil d'Ariane jusqu'à ce niveau. */
  fil: string[];
  kpi: { nombre: number; participants: number; invites: number; conversions: number; restaurations: number; baptemes: number; aVenir: number; aCloturer: number };
  /** Titre de la liste des sous-niveaux (« Par région »…), absent pour une assemblée. */
  parNiveau?: string;
  icone?: 'carte' | 'immeuble' | 'maison';
  enfants: Totaux[];
  /** Actions rattachées au niveau lui-même (D-EVT-04). */
  propres: number;
}

export const STATS: Record<'france' | 'idf' | 'paris' | 'parisNord', NiveauStats> = {
  france: {
    fil: ['France'],
    kpi: { nombre: 106, participants: 2331, invites: 697, conversions: 143, restaurations: 44, baptemes: 36, aVenir: 14, aCloturer: 3 },
    parNiveau: 'Par région',
    icone: 'carte',
    enfants: [
      { nom: 'Auvergne-Rhône-Alpes', nombre: 31, participants: 540, invites: 162, conversions: 37, restaurations: 11, baptemes: 9 },
      { nom: 'Hauts-de-France', nombre: 24, participants: 410, invites: 118, conversions: 26, restaurations: 8, baptemes: 6 },
      { nom: 'Île-de-France', nombre: 49, participants: 1061, invites: 321, conversions: 68, restaurations: 22, baptemes: 19 },
    ],
    propres: 2,
  },
  idf: {
    fil: ['France', 'Île-de-France'],
    kpi: { nombre: 49, participants: 1061, invites: 321, conversions: 68, restaurations: 22, baptemes: 19, aVenir: 6, aCloturer: 1 },
    parNiveau: 'Par ville',
    icone: 'immeuble',
    enfants: [
      { nom: 'Créteil', nombre: 11, participants: 188, invites: 55, conversions: 12, restaurations: 4, baptemes: 3 },
      { nom: 'Paris', nombre: 28, participants: 651, invites: 203, conversions: 43, restaurations: 15, baptemes: 13 },
      { nom: 'Versailles', nombre: 9, participants: 142, invites: 41, conversions: 8, restaurations: 2, baptemes: 2 },
    ],
    propres: 1,
  },
  paris: {
    fil: ['France', 'Île-de-France', 'Paris'],
    kpi: { nombre: 28, participants: 651, invites: 203, conversions: 43, restaurations: 15, baptemes: 13, aVenir: 3, aCloturer: 0 },
    parNiveau: 'Par assemblée',
    icone: 'maison',
    enfants: [
      { nom: 'Paris Est', nombre: 7, participants: 131, invites: 40, conversions: 9, restaurations: 3, baptemes: 2 },
      { nom: 'Paris Nord', nombre: 11, participants: 214, invites: 71, conversions: 17, restaurations: 6, baptemes: 5 },
      { nom: 'Paris Sud', nombre: 8, participants: 96, invites: 29, conversions: 7, restaurations: 2, baptemes: 3 },
    ],
    propres: 2,
  },
  parisNord: {
    fil: ['France', 'Île-de-France', 'Paris', 'Paris Nord'],
    kpi: { nombre: 11, participants: 214, invites: 71, conversions: 17, restaurations: 6, baptemes: 5, aVenir: 2, aCloturer: 0 },
    enfants: [],
    propres: 0,
  },
};

/** Paris Nord, par type (ordre du catalogue, types à 0 compris). */
export const PAR_TYPE_PARIS_NORD: Totaux[] = [
  { nom: 'Retraite', nombre: 0, participants: 0, invites: 0, conversions: 0, restaurations: 0, baptemes: 0 },
  { nom: 'Campagne', nombre: 5, participants: 51, invites: 18, conversions: 7, restaurations: 2, baptemes: 3 },
  { nom: 'Conférence', nombre: 0, participants: 0, invites: 0, conversions: 0, restaurations: 0, baptemes: 0 },
  { nom: 'Concert', nombre: 2, participants: 85, invites: 30, conversions: 4, restaurations: 2, baptemes: 0 },
  { nom: "Implantation d'église de maison", nombre: 1, participants: 9, invites: 2, conversions: 1, restaurations: 0, baptemes: 1 },
  { nom: 'Action de grâce', nombre: 3, participants: 69, invites: 21, conversions: 5, restaurations: 2, baptemes: 1 },
  { nom: 'Autre', nombre: 0, participants: 0, invites: 0, conversions: 0, restaurations: 0, baptemes: 0 },
];

/**
 * Paris Nord, par mois (12 lignes, mois vides à 0) : nombre, participants, invités (D-EVT-17),
 * conversions, restaurations, baptêmes.
 */
export const PAR_MOIS_PARIS_NORD: Totaux[] = (
  [
    ['janvier', 0, 0, 0, 0, 0, 0],
    ['février', 0, 0, 0, 0, 0, 0],
    ['mars', 1, 12, 4, 1, 1, 0],
    ['avril', 1, 15, 5, 2, 0, 1],
    ['mai', 1, 20, 6, 1, 2, 0],
    ['juin', 1, 9, 2, 1, 0, 1],
    ['juillet', 0, 0, 0, 0, 0, 0],
    ['août', 0, 0, 0, 0, 0, 0],
    ['septembre', 3, 100, 35, 7, 3, 0],
    ['octobre', 4, 58, 19, 5, 0, 3],
    ['novembre', 0, 0, 0, 0, 0, 0],
    ['décembre', 0, 0, 0, 0, 0, 0],
  ] as const
).map(([m, nombre, participants, invites, conversions, restaurations, baptemes]) => ({
  nom: `${m} 2026`,
  nombre,
  participants,
  invites,
  conversions,
  restaurations,
  baptemes,
}));

/** P14 : l'échelle des totaux, avant / après la nouvelle action de Paris Nord. */
export const ECHELLE_TOTAUX = [
  { niveau: 'Assemblée', nom: 'Paris Nord', avant: 10, apres: 11, icone: 'maison' },
  { niveau: 'Ville', nom: 'Paris', avant: 27, apres: 28, icone: 'immeuble' },
  { niveau: 'Région', nom: 'Île-de-France', avant: 48, apres: 49, icone: 'carte' },
  { niveau: 'Nation', nom: 'France', avant: 105, apres: 106, icone: 'drapeau' },
] as const;

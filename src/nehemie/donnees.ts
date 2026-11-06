/**
 * Données fictives de la vidéo « Offre Néhémie » (storyboard § 6). Toutes inventées, mais
 * cohérentes entre elles (sommes vérifiées au chargement, en fin de fichier) : la ville de Douala
 * (Cameroun) et ses six assemblées de maison, triées par nom comme le serveur les renvoie. Le
 * programme est l'unité UEMB002 de la vidéo « Étude » (5 leçons). Date de la vue : dimanche
 * 15 novembre 2026 ; journal d'octobre 2026 ; évènements de l'année 2026.
 *
 * Fil : Bonamoussadi a fini l'unité, Deïdo n'a pas commencé — et Deïdo n'a plus de compte rendu
 * depuis trois semaines : c'est l'assemblée que le pasteur ira voir.
 */

export const VILLE = 'Douala';

export const UNITE = {
  code: 'UEMB002',
  nom: 'Devenir et être disciple du Seigneur Jésus-Christ',
  lecons: 5,
};
/** « UEMB002 · Devenir et être disciple du Seigneur Jésus-Christ » (`code · nom`, CityStudy.tsx). */
export const UNITE_LIBELLE = `${UNITE.code} · ${UNITE.nom}`;

export type NomAssemblee = 'Akwa' | 'Bali' | 'Bonabéri' | 'Bonamoussadi' | 'Deïdo' | 'Makepe';

/** Les six assemblées de Douala, dans l'ordre du serveur (par nom). */
export const ASSEMBLEES: readonly NomAssemblee[] = ['Akwa', 'Bali', 'Bonabéri', 'Bonamoussadi', 'Deïdo', 'Makepe'];

// ---------------------------------------------------------------------------------------------
// Le Message de Bertoua (onglet Assemblées et Membres de « Suivi de la ville »)

/** Avancement de chaque assemblée : membres, leçons faites (D-ETU-42 : union des plages terminées). */
export const AVANCEMENT: readonly { nom: NomAssemblee; membres: number; faites: readonly number[]; enseignes: number }[] = [
  { nom: 'Akwa', membres: 14, faites: [1, 2, 3, 4], enseignes: 14 },
  { nom: 'Bali', membres: 11, faites: [1, 2], enseignes: 9 },
  { nom: 'Bonabéri', membres: 16, faites: [1, 2, 3], enseignes: 16 },
  { nom: 'Bonamoussadi', membres: 12, faites: [1, 2, 3, 4, 5], enseignes: 12 },
  { nom: 'Deïdo', membres: 9, faites: [], enseignes: 0 },
  { nom: 'Makepe', membres: 13, faites: [1], enseignes: 10 },
];

export const TOTAL_MEMBRES = AVANCEMENT.reduce((s, a) => s + a.membres, 0); // 75
export const NON_ENSEIGNES = AVANCEMENT.reduce((s, a) => s + a.membres - a.enseignes, 0); // 14

export interface LigneMembre {
  nom: string;
  assemblee: NomAssemblee;
  enseigne: boolean;
  faites: number;
}

/** Premiers membres de la liste complète (tri par nom), tous statuts. */
export const MEMBRES_TOUS: readonly LigneMembre[] = [
  { nom: 'Achille Ekambi', assemblee: 'Bonabéri', enseigne: true, faites: 3 },
  { nom: 'Adèle Moukoko', assemblee: 'Akwa', enseigne: true, faites: 4 },
  { nom: 'Alain Ebanda', assemblee: 'Deïdo', enseigne: false, faites: 0 },
  { nom: 'Annie Ndoumbe', assemblee: 'Bonamoussadi', enseigne: true, faites: 5 },
  { nom: 'Bertrand Eyoum', assemblee: 'Makepe', enseigne: true, faites: 1 },
  { nom: 'Brigitte Essomba', assemblee: 'Bali', enseigne: false, faites: 0 },
  { nom: 'Carine Ngono', assemblee: 'Deïdo', enseigne: false, faites: 0 },
  { nom: 'Cédric Din', assemblee: 'Akwa', enseigne: true, faites: 4 },
  { nom: 'Christian Mbappé', assemblee: 'Bonabéri', enseigne: true, faites: 3 },
];

/** Filtre « Non enseigné » : les 14 (premières lignes, tri par nom). */
export const MEMBRES_NON_ENSEIGNES: readonly LigneMembre[] = [
  { nom: 'Alain Ebanda', assemblee: 'Deïdo', enseigne: false, faites: 0 },
  { nom: 'Brigitte Essomba', assemblee: 'Bali', enseigne: false, faites: 0 },
  { nom: 'Carine Ngono', assemblee: 'Deïdo', enseigne: false, faites: 0 },
  { nom: 'Didier Kotto', assemblee: 'Makepe', enseigne: false, faites: 0 },
  { nom: 'Estelle Mouelle', assemblee: 'Deïdo', enseigne: false, faites: 0 },
  { nom: 'Franck Ndjock', assemblee: 'Bali', enseigne: false, faites: 0 },
  { nom: 'Gisèle Tchinda', assemblee: 'Makepe', enseigne: false, faites: 0 },
  { nom: 'Hervé Mandengue', assemblee: 'Deïdo', enseigne: false, faites: 0 },
  { nom: 'Irène Epée', assemblee: 'Deïdo', enseigne: false, faites: 0 },
];

// ---------------------------------------------------------------------------------------------
// Le journal de la ville (octobre 2026) — nombres seulement, aucun nom de personne (D-OFF-05)

export const PERIODE_JOURNAL = 'Octobre 2026';
export const PERIODE_JOURNAL_PDF = 'octobre 2026';
export const EDITION_PDF = '15 novembre 2026';

export const JOURNAL: readonly { nom: NomAssemblee; reunions: number; moyenne: number | null; pain: number; dernier: string; alerte: boolean }[] = [
  { nom: 'Akwa', reunions: 4, moyenne: 12.5, pain: 2, dernier: '25/10/2026', alerte: false },
  { nom: 'Bali', reunions: 4, moyenne: 9, pain: 1, dernier: '28/10/2026', alerte: false },
  { nom: 'Bonabéri', reunions: 5, moyenne: 13.8, pain: 2, dernier: '29/10/2026', alerte: false },
  { nom: 'Bonamoussadi', reunions: 5, moyenne: 11.2, pain: 3, dernier: '30/10/2026', alerte: false },
  { nom: 'Deïdo', reunions: 0, moyenne: null, pain: 0, dernier: '21/09/2026', alerte: true },
  { nom: 'Makepe', reunions: 4, moyenne: 10, pain: 1, dernier: '27/10/2026', alerte: false },
];

const reunions = JOURNAL.reduce((s, l) => s + l.reunions, 0);
const presences = JOURNAL.reduce((s, l) => s + l.reunions * (l.moyenne ?? 0), 0);

/** Synthèse : 22 réunions, 5 assemblées actives, 1 alerte, 11,4 présents en moyenne, 68 personnes, 9 fractions. */
export const SYNTHESE = {
  reunions,
  actives: JOURNAL.filter((l) => l.reunions > 0).length,
  alertes: JOURNAL.filter((l) => l.alerte).length,
  moyenne: Math.round((presences / reunions) * 10) / 10,
  distinctes: 68,
  pain: JOURNAL.reduce((s, l) => s + l.pain, 0),
};

/** Comptes rendus du PDF : le nombre de présents seulement (`attendeeCount`, plan 05 § 3.3). */
export const COMPTES_RENDUS: readonly { assemblee: NomAssemblee; blocs: readonly { date: string; presents: number; pain: boolean; lecture: string }[] }[] = [
  {
    assemblee: 'Akwa',
    blocs: [
      { date: 'Dimanche 25 octobre 2026', presents: 13, pain: true, lecture: 'Disciple coûte que coûte, chapitre 4' },
      { date: 'Dimanche 18 octobre 2026', presents: 12, pain: false, lecture: 'Disciple coûte que coûte, chapitre 3' },
    ],
  },
];

/** Format français d'un nombre décimal (« 11,4 »). */
export const decimal = (n: number) => n.toLocaleString('fr-FR', { maximumFractionDigits: 1 });

// ---------------------------------------------------------------------------------------------
// Les évènements de l'année 2026 — à l'intérieur de la ville

export const ANNEE = '2026';

export const EVTS_ASSEMBLEES: readonly { nom: NomAssemblee; actions: number; participants: number; conversions: number }[] = [
  { nom: 'Akwa', actions: 9, participants: 310, conversions: 12 },
  { nom: 'Bali', actions: 5, participants: 140, conversions: 5 },
  { nom: 'Bonabéri', actions: 8, participants: 265, conversions: 11 },
  { nom: 'Bonamoussadi', actions: 7, participants: 230, conversions: 9 },
  { nom: 'Deïdo', actions: 1, participants: 25, conversions: 0 },
  { nom: 'Makepe', actions: 6, participants: 180, conversions: 6 },
];

/** Rattachées directement à la ville (D-EVT-04) : elles comptent à la ville, dans aucune assemblée. */
export const EVTS_VILLE = { actions: 2, participants: 90, conversions: 3 };

export const EVTS_TOTAL = {
  actions: EVTS_ASSEMBLEES.reduce((s, l) => s + l.actions, 0) + EVTS_VILLE.actions, // 38
  participants: EVTS_ASSEMBLEES.reduce((s, l) => s + l.participants, 0) + EVTS_VILLE.participants, // 1 240
  invites: 312,
  conversions: EVTS_ASSEMBLEES.reduce((s, l) => s + l.conversions, 0) + EVTS_VILLE.conversions, // 46
  restaurations: 14,
  baptemes: 9,
};

/**
 * « 1 240 » : séparateur de milliers français (espace fine insécable, comme `Intl` du web), posé à
 * la main — le Chromium du rendu ne groupe pas toujours les nombres de quatre chiffres.
 */
export const entier = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u202F');

// ---------------------------------------------------------------------------------------------
// Contrôles : les chiffres annoncés par les légendes et les sommes doivent tenir.

const verifier = (ok: boolean, message: string) => {
  if (!ok) throw new Error(`Vidéo « Néhémie » : ${message}`);
};
verifier(TOTAL_MEMBRES === 75, `75 membres attendus (${TOTAL_MEMBRES}).`);
verifier(NON_ENSEIGNES === 14, `14 non enseignés attendus (${NON_ENSEIGNES}).`);
verifier(SYNTHESE.reunions === 22 && SYNTHESE.actives === 5 && SYNTHESE.alertes === 1 && SYNTHESE.pain === 9, 'synthèse du journal.');
verifier(SYNTHESE.moyenne === 11.4, `présence moyenne 11,4 attendue (${SYNTHESE.moyenne}).`);
verifier(EVTS_TOTAL.actions === 38 && EVTS_TOTAL.participants === 1240 && EVTS_TOTAL.conversions === 46, 'totaux des évènements.');
verifier(EVTS_ASSEMBLEES[0].actions === 9 && EVTS_ASSEMBLEES[0].conversions === 12, 'Akwa : 9 actions, 12 conversions (légende P8).');
verifier(AVANCEMENT[3].faites.length === 5 && AVANCEMENT[4].faites.length === 0, 'Bonamoussadi 5 / 5, Deïdo 0 / 5 (légendes P5).');
verifier(
  MEMBRES_NON_ENSEIGNES.every((m) => AVANCEMENT.find((a) => a.nom === m.assemblee)!.enseignes < AVANCEMENT.find((a) => a.nom === m.assemblee)!.membres),
  'un non enseigné dans une assemblée où tout le monde l’est.',
);

/**
 * Données fictives de la vidéo « Ce qui est et restera gratuit ». Toutes inventées, reprises des
 * vidéos précédentes pour rester cohérentes : l'assemblée Paris Ouest de Samuel Fotso (« Étude »,
 * « Guide »), ses membres (`MEMBRES_PARIS_OUEST` d'« Étude »), Daniel Mercier, dirigeant de la
 * ville de Paris, et son superviseur Bernard Lemoine (« Journal »), les dirigeants Sophie Marchand
 * (Paris Est) et Marc Dubois (Paris Sud).
 *
 * Fin octobre 2026 : le dernier compte rendu de Paris Ouest est celui du dimanche 18 octobre (le
 * journal de « Guide », 13 présents, Joël et Rose absents) ; le 25 octobre, l'assemblée a fait la
 * leçon 1 du Message de Bertoua (« Étude »).
 *
 * Aucun montant : les catégories d'objectifs en euros (Livres, Fonds d'urgence, Hall) restent « À
 * compléter » (aucun engagement saisi, l'app n'affiche alors aucune valeur) ; seules les catégories
 * comptées (Couples missionnaires, Effectifs) portent des chiffres. Le bloc « Ce que porte mon
 * leadership » de la Hiérarchie (sommes en euros) n'est pas montré.
 */
import { DONNEES as DONNEES_ETUDE } from '../etude/donnees';
import { DONNEES as DONNEES_JOURNAL } from '../journal/donnees';

const ETUDE = DONNEES_ETUDE.fr!;
const JOURNAL = DONNEES_JOURNAL.fr;

export const ASSEMBLEE = ETUDE.ASSEMBLEE; // Paris Ouest
export const VILLE = ETUDE.VILLE; // Paris
export const SAMUEL = ETUDE.PERSONNES.samuel;
export const DANIEL = JOURNAL.PERSONNES.daniel;
export const BERNARD = JOURNAL.PERSONNES.bernard.nom;
/**
 * Bernard Lemoine, dirigeant senior de l'Île-de-France (« Journal », « Caleb ») : c'est sur SON
 * téléphone que P7 montre les statistiques de la région ventilées par ville. Revue du 27/10 : un
 * DIRIGEANT_UNITE (Samuel) ne lit pas la région — `EventStatsServiceImpl.stats` refuse (403) une
 * racine hors de son périmètre de lecture (ses assemblées) ; D-OFF-12 (JP 27/10) rend ces
 * statistiques gratuites jusqu'à la ville, mais dans le périmètre géographique de chacun.
 */
export const BERNARD_ACCUEIL = { prenom: 'Bernard', initiales: 'BL' } as const;

/** Couleurs des statuts par défaut de Member Care (`MemberCareServiceImpl.DEFAULT_STATUSES`). */
export const STATUTS = [
  { label: 'Nouveau', couleur: '#6CA0DC' },
  { label: 'En intégration', couleur: '#7FB069' },
  { label: 'Engagé', couleur: '#2E7D32' },
  { label: 'En danger', couleur: '#E0A458' },
  { label: 'Rétrograde', couleur: '#B4452F' },
] as const;
export type Statut = (typeof STATUTS)[number]['label'];

/** `fmtIsoDay` de l'app : « 25 octobre 2026 ». */
const OCT = (j: number) => `${j} octobre 2026`;

/**
 * Fiches de Paris Ouest (`GET /member-care/records`) : les comptes MEMBRE de l'assemblée, triés par
 * nom — Samuel, dirigeant d'unité, n'a pas de fiche. Dernière présence lue dans les comptes rendus.
 */
export const FICHES: readonly { nom: string; statut: Statut; presence: string }[] = (() => {
  const statut: Record<string, Statut> = {
    'Aline Tchoua': 'Engagé',
    'Christelle Abena': 'Engagé',
    'David Laurent': 'En intégration',
    'Esther Mbida': 'Engagé',
    'Grâce Ngo': 'Nouveau',
    'Hélène Mballa': 'Engagé',
    'Jean Petit': 'En intégration',
    'Joël Mvondo': 'En danger',
    'Lucie Roche': 'Engagé',
    'Marie Kamga': 'Engagé',
    'Paul Nana': 'Engagé',
    'Rose Eyenga': 'En intégration',
    'Ruth Ateba': 'Engagé',
    'Sylvain Ondoa': 'Engagé',
  };
  // Absents du 18 octobre (journal de « Guide ») : Joël, absent depuis le 4, et Rose.
  const presence: Record<string, string> = { 'Joël Mvondo': OCT(4), 'Rose Eyenga': OCT(11) };
  return ETUDE.MEMBRES_PARIS_OUEST.filter((m) => m.nom !== SAMUEL.nom).map((m) => {
    const s = statut[m.nom];
    if (!s) throw new Error(`Vidéo « Gratuit » : pas de statut pour ${m.nom}.`);
    return { nom: m.nom, statut: s, presence: presence[m.nom] ?? OCT(18) };
  });
})();

/** Index de la fiche mise en avant en P4 (Joël, « En danger », absent depuis le 4 octobre). */
export const FICHE_JOEL = FICHES.findIndex((f) => f.nom === 'Joël Mvondo');

/**
 * « Mes objectifs » de Samuel (catégories du But Quinquennal, `db/changes/goals/01-goals.sql`, dans
 * l'ordre d'affichage). `engage` / `verse` : catégories comptées seulement.
 */
export type CleCategorie = 'LIVRES' | 'MISSIONNAIRES' | 'URGENCE' | 'HALL' | 'EFFECTIFS';
export const OBJECTIFS: readonly { cle: CleCategorie; nom: string; unite?: string; engage?: number; verse?: number }[] = [
  { cle: 'LIVRES', nom: 'Livres' },
  { cle: 'MISSIONNAIRES', nom: 'Couples missionnaires', unite: 'couples', engage: 2, verse: 2 },
  { cle: 'URGENCE', nom: "Fonds d'urgence" },
  { cle: 'HALL', nom: 'Hall' },
  { cle: 'EFFECTIFS', nom: 'Effectifs', unite: 'personnes', engage: 5, verse: 3 },
];
/** Apparence des catégories (`constants/goalCategories.ts`). */
export const META_CATEGORIES: Record<CleCategorie, { ton: string }> = {
  LIVRES: { ton: '#3D6B4A' },
  MISSIONNAIRES: { ton: '#5C7CB0' },
  URGENCE: { ton: '#B86A4A' },
  HALL: { ton: '#8C6E54' },
  EFFECTIFS: { ton: '#B89A4A' },
};
/** Années visibles du But Quinquennal (sélecteur d'année) et date limite de l'année (`fmtDate`). */
export const ANNEES = [2026, 2027] as const;
export const DATE_LIMITE = '31 déc. 2026';

/** État de soumission d'une personne de l'arbre (`GoalPill`). */
export type EtatObjectifs = 'soumis' | 'brouillon' | 'rien';

/**
 * Hiérarchie de Daniel (`GET /leaders/hierarchy`, mode SUBTREE) : lui, puis les trois dirigeants
 * d'assemblée qu'il supervise (triés par nom), chacun avec son assemblée. Samuel est en
 * « Brouillon », comme son écran « Mes objectifs » en P5.
 */
/** Sophie Marchand (Paris Est), Thomas (Paris Nord, remplacé ici par Samuel), Marc Dubois (Paris Sud). */
const EQUIPE = JOURNAL.HIERARCHIE.equipe;

export const ARBRE = {
  daniel: { nom: DANIEL.nom, etat: 'soumis' as EtatObjectifs },
  dirigeants: [
    { nom: EQUIPE[2].nom, assemblee: EQUIPE[2].assemblee, membres: 9, etat: 'rien' as EtatObjectifs },
    { nom: SAMUEL.nom, assemblee: ASSEMBLEE, membres: ETUDE.MEMBRES_PARIS_OUEST.length, etat: 'brouillon' as EtatObjectifs },
    { nom: EQUIPE[0].nom, assemblee: EQUIPE[0].assemblee, membres: 10, etat: 'soumis' as EtatObjectifs },
  ],
} as const;

/** Index de Samuel dans `ARBRE.dirigeants` : son assemblée se déplie en P6. */
export const DIRIGEANT_SAMUEL = ARBRE.dirigeants.findIndex((d) => d.nom === SAMUEL.nom);

/** Membres de Paris Ouest et leur état (les 15 comptes rattachés, Samuel compris, triés par nom). */
export const MEMBRES_ARBRE: readonly { nom: string; etat: EtatObjectifs }[] = (() => {
  const etat: Record<string, EtatObjectifs> = {
    'Aline Tchoua': 'soumis',
    'Christelle Abena': 'soumis',
    'David Laurent': 'brouillon',
    'Esther Mbida': 'soumis',
    'Grâce Ngo': 'rien',
    'Hélène Mballa': 'soumis',
    'Jean Petit': 'brouillon',
    'Joël Mvondo': 'rien',
    'Lucie Roche': 'soumis',
    'Marie Kamga': 'soumis',
    'Paul Nana': 'soumis',
    'Rose Eyenga': 'brouillon',
    'Ruth Ateba': 'soumis',
    'Samuel Fotso': 'brouillon',
    'Sylvain Ondoa': 'soumis',
  };
  return ETUDE.MEMBRES_PARIS_OUEST.map((m) => {
    const e = etat[m.nom];
    if (!e) throw new Error(`Vidéo « Gratuit » : pas d'état d'objectifs pour ${m.nom}.`);
    return { nom: m.nom, etat: e };
  });
})();

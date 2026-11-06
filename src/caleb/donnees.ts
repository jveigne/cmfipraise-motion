/**
 * Données fictives de la vidéo « Offre Caleb » (storyboard § 6). Toutes inventées : aucune donnée
 * réelle, AUCUN PRIX. Date de l'histoire : lundi 16 novembre 2026.
 *
 * On retrouve les personnes des vidéos « Journal » et « Étude » : Daniel Mercier (dirigeant à Paris,
 * il rend compte à Bernard Lemoine), les dirigeants d'assemblée Sophie Marchand (Paris Est), Thomas
 * Lefèvre (Paris Nord), Samuel Fotso (Paris Ouest, l'assemblée de l'étude) et Marc Dubois (Paris Sud,
 * toujours sans compte rendu depuis le 17 septembre). Ajout : Nadège Mbarga, formée par Marc, a
 * ouvert l'assemblée Évry Centre, dans une AUTRE ville : elle rend compte à Marc, Marc à Daniel —
 * Évry Centre est donc dans la chaîne de Daniel (axe de la chaîne, `supervisor_id`, D-ABO-31), alors
 * que l'axe géographique ne la lui donnerait pas. Évry Sud, autre assemblée d'Évry, n'est pas dans
 * la chaîne (elle n'apparaît que sur la carte de P3).
 *
 * Chiffres vérifiés au chargement (fin du fichier) : les cases du bloc « Vie d'assemblée » sont les
 * sommes des assemblées ; l'avancement de Bertoua reprend celui de « Étude » au 8 novembre
 * (Paris Est 1 / 5, Paris Nord 2 / 5, Paris Ouest 3 / 5, Paris Sud 0 / 5).
 */
import { APP } from './textes';

/** `fmtIsoDay` de l'app : « 8 novembre 2026 » (sans « 1er », comme dans « Étude »). */
const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
const jour = (iso: string) => {
  const [a, m, j] = iso.split('-').map(Number);
  return `${j} ${MOIS[m - 1]} ${a}`;
};
const AUJOURDHUI = '2026-11-16';
const joursDepuis = (iso: string) => Math.round((Date.parse(AUJOURDHUI) - Date.parse(iso)) / 86_400_000);
/** `toLocaleString('fr')` d'une moyenne arrondie au dixième (`averageAttendance`). */
const decimal = (v: number) => (Math.round(v * 10) / 10).toLocaleString('fr-FR');

export const PERSONNES = {
  bernard: { nom: 'Bernard Lemoine', initiales: 'BL', role: APP.roles.senior },
  daniel: { nom: 'Daniel Mercier', initiales: 'DM', role: APP.roles.dirigeant },
  sophie: { nom: 'Sophie Marchand', initiales: 'SM', role: APP.roles.unite },
  thomas: { nom: 'Thomas Lefèvre', initiales: 'TL', role: APP.roles.unite },
  samuel: { nom: 'Samuel Fotso', initiales: 'SF', role: APP.roles.unite },
  marc: { nom: 'Marc Dubois', initiales: 'MD', role: APP.roles.unite },
  nadege: { nom: 'Nadège Mbarga', initiales: 'NM', role: APP.roles.unite },
} as const;

export type CleAssemblee = 'est' | 'nord' | 'ouest' | 'sud' | 'evry';

/**
 * Les cinq assemblées de la chaîne de Daniel, dans l'ordre de l'arbre. Réunions de novembre 2026
 * (du 1er au 16) : présences de chaque réunion, fractions de pain ; dernier CR ; personnes
 * distinctes présentes sur la période ; membres et avancement de Bertoua (UEMB002, année 2026).
 */
const BRUT: Record<
  CleAssemblee,
  {
    nom: string;
    ville: string;
    dirigeant: keyof typeof PERSONNES;
    presences: number[];
    pain: number;
    dernierCr: string;
    distinctes: number;
    membres: number;
    lecons: number;
    seances: number;
    enseignes: number;
    moyenne: number | null;
    derniereSeance: string | null;
  }
> = {
  est: { nom: 'Paris Est', ville: 'Paris', dirigeant: 'sophie', presences: [8, 9, 8], pain: 3, dernierCr: '2026-11-15', distinctes: 10, membres: 10, lecons: 1, seances: 1, enseignes: 9, moyenne: 71, derniereSeance: '2026-11-08' },
  nord: { nom: 'Paris Nord', ville: 'Paris', dirigeant: 'thomas', presences: [10, 9], pain: 2, dernierCr: '2026-11-11', distinctes: 10, membres: 11, lecons: 2, seances: 3, enseignes: 10, moyenne: 78, derniereSeance: '2026-11-11' },
  ouest: { nom: 'Paris Ouest', ville: 'Paris', dirigeant: 'samuel', presences: [14, 15, 13], pain: 2, dernierCr: '2026-11-15', distinctes: 15, membres: 15, lecons: 3, seances: 3, enseignes: 14, moyenne: 84, derniereSeance: '2026-11-08' },
  sud: { nom: 'Paris Sud', ville: 'Paris', dirigeant: 'marc', presences: [], pain: 0, dernierCr: '2026-09-17', distinctes: 0, membres: 9, lecons: 0, seances: 0, enseignes: 0, moyenne: null, derniereSeance: null },
  evry: { nom: 'Évry Centre', ville: 'Évry', dirigeant: 'nadege', presences: [7, 8], pain: 2, dernierCr: '2026-11-14', distinctes: 8, membres: 8, lecons: 1, seances: 1, enseignes: 7, moyenne: 69, derniereSeance: '2026-11-14' },
};

export const ORDRE: CleAssemblee[] = ['est', 'nord', 'ouest', 'sud', 'evry'];

/** Une assemblée, prête pour les écrans. */
export const ASSEMBLEES = Object.fromEntries(
  ORDRE.map((k) => {
    const a = BRUT[k];
    const reunions = a.presences.length;
    const jours = joursDepuis(a.dernierCr);
    const alerte = jours > 21;
    const total = a.presences.reduce((s, n) => s + n, 0);
    return [
      k,
      {
        cle: k,
        nom: a.nom,
        ville: a.ville,
        libelle: `${a.nom} · ${a.ville}`,
        dirigeant: PERSONNES[a.dirigeant].nom,
        membres: a.membres,
        reunions,
        presencesTotal: total,
        pain: a.pain,
        distinctes: a.distinctes,
        alerte,
        /** `UnitAssemblyLine` : texte de la ligne sous l'assemblée, dans l'arbre. */
        ligne: alerte
          ? `⚠ ${APP.vie.noRecentReport} · ${APP.vie.lastReportShort(jours)}`
          : `${APP.vie.lastReport(jours)} · ${APP.vie.averageLine(decimal(total / reunions))}`,
        /** Bertoua (hierarchy.study.*). */
        etude: {
          lecons: APP.etude.lessonsDone(a.lecons, 5),
          enseignes: APP.etude.taught(a.enseignes, a.membres),
          nonEnseignes: a.membres - a.enseignes > 0 ? APP.etude.notTaught(a.membres - a.enseignes) : null,
          moyenne: APP.etude.average(a.moyenne == null ? '—' : `${a.moyenne} %`),
          derniere: a.derniereSeance ? APP.etude.lastSession(jour(a.derniereSeance)) : APP.etude.noSession,
          leconsFaites: a.lecons,
          seances: a.seances,
          enseignesN: a.enseignes,
          moyenneN: a.moyenne,
        },
      },
    ];
  }),
) as Record<
  CleAssemblee,
  {
    cle: CleAssemblee;
    nom: string;
    ville: string;
    libelle: string;
    dirigeant: string;
    membres: number;
    reunions: number;
    presencesTotal: number;
    pain: number;
    distinctes: number;
    alerte: boolean;
    ligne: string;
    etude: {
      lecons: string;
      enseignes: string;
      nonEnseignes: string | null;
      moyenne: string;
      derniere: string;
      leconsFaites: number;
      seances: number;
      enseignesN: number;
      moyenneN: number | null;
    };
  }
>;

const liste = ORDRE.map((k) => ASSEMBLEES[k]);
const reunions = liste.reduce((s, a) => s + a.reunions, 0);
const presences = liste.reduce((s, a) => s + a.presencesTotal, 0);

/** Bloc « Vie d'assemblée » de la Hiérarchie de Daniel, période « Novembre 2026 ». */
export const VIE = {
  periode: 'Novembre 2026',
  reunions,
  actives: `${liste.filter((a) => a.reunions > 0).length} / ${liste.length}`,
  moyenne: decimal(presences / reunions),
  distinctes: liste.reduce((s, a) => s + a.distinctes, 0),
  pain: liste.reduce((s, a) => s + a.pain, 0),
  alertes: liste.filter((a) => a.alerte).length,
  alerteNoms: liste.filter((a) => a.alerte).map((a) => a.nom).join(' · '),
};

/** Bloc « Le Message de Bertoua » de la Hiérarchie de Daniel (année 2026, unité UEMB002). */
const notees = liste.filter((a) => a.etude.moyenneN != null);
export const ETUDE = {
  annee: 2026,
  seances: liste.reduce((s, a) => s + a.etude.seances, 0),
  lecons: liste.reduce((s, a) => s + a.etude.leconsFaites, 0),
  enseignes: liste.reduce((s, a) => s + a.etude.enseignesN, 0),
  /** Note moyenne de la chaîne, pondérée par les membres enseignés (calcul serveur, ici fictif). */
  moyenne: `${Math.round(notees.reduce((s, a) => s + (a.etude.moyenneN ?? 0) * a.etude.enseignesN, 0) / notees.reduce((s, a) => s + a.etude.enseignesN, 0))} %`,
  /** `selected.name` (libellé de section en majuscules). */
  unite: 'Devenir et être disciple du Seigneur Jésus-Christ',
  /** Le dirigeant d'Évry Centre est sous Marc : `supervisorChain` = les dirigeants ENTRE Daniel et elle. */
  via: { evry: [PERSONNES.marc.nom] } as Partial<Record<CleAssemblee, string[]>>,
};

/** Une réunion de la liste (`MeetingRows`) : même forme que `Reunion` de « Journal ». */
export interface ReunionCaleb {
  date: string;
  presents: number;
  pain: boolean;
  livre?: string;
  chapitres?: string;
}

/** Réunions de Paris Ouest (onglet Assemblée de Daniel, P6), dates décroissantes. */
export const REUNIONS_OUEST: ReunionCaleb[] = [
  { date: jour('2026-11-15'), presents: 13, pain: true },
  { date: jour('2026-11-08'), presents: 15, pain: true, livre: ETUDE.unite, chapitres: 'chapitre 3' },
  { date: jour('2026-11-01'), presents: 14, pain: false, livre: ETUDE.unite, chapitres: 'chapitre 2' },
  { date: jour('2026-10-25'), presents: 14, pain: true, livre: ETUDE.unite, chapitres: 'chapitre 1' },
  { date: jour('2026-10-18'), presents: 12, pain: true },
];

/** Le compte rendu ouvert par Daniel (P6) : le 8 novembre, tout le monde était là. */
export const CR_OUEST = {
  date: jour('2026-11-08'),
  assemblee: ASSEMBLEES.ouest.nom,
  lecture: `${ETUDE.unite} — chapitre 3`,
  /** Les 15 de Paris Ouest (« Étude »), ordre alphabétique de l'app. */
  presents: [
    'Aline Tchoua',
    'Christelle Abena',
    'David Laurent',
    'Esther Mbida',
    'Grâce Ngo',
    'Hélène Mballa',
    'Jean Petit',
    'Joël Mvondo',
    'Lucie Roche',
    'Marie Kamga',
    'Paul Nana',
    'Rose Eyenga',
    'Ruth Ateba',
    'Samuel Fotso',
    'Sylvain Ondoa',
  ],
};

/**
 * Statuts de suivi : les statuts par défaut de Member Care (`MemberCareServiceImpl.DEFAULT_STATUSES`),
 * les mêmes que dans « Gratuit » (intégration 27/10 : alignés, ils étaient fictifs).
 */
export const STATUTS = [
  { label: 'Nouveau', couleur: '#6CA0DC' },
  { label: 'En intégration', couleur: '#7FB069' },
  { label: 'Engagé', couleur: '#2E7D32' },
  { label: 'En danger', couleur: '#E0A458' },
  { label: 'Rétrograde', couleur: '#B4452F' },
] as const;

export interface Fiche {
  nom: string;
  statut: number;
  presence: string;
}

/** Fiches Member Care (P8) : comptes MEMBRE rattachés (le dirigeant d'assemblée n'a pas de fiche). */
export const FICHES: Partial<Record<CleAssemblee, Fiche[]>> = {
  ouest: [
    { nom: 'Aline Tchoua', statut: 2, presence: jour('2026-11-15') },
    { nom: 'Christelle Abena', statut: 2, presence: jour('2026-11-15') },
    { nom: 'David Laurent', statut: 1, presence: jour('2026-11-01') },
    { nom: 'Esther Mbida', statut: 2, presence: jour('2026-11-15') },
    { nom: 'Grâce Ngo', statut: 0, presence: jour('2026-11-08') },
    { nom: 'Hélène Mballa', statut: 2, presence: jour('2026-11-15') },
    { nom: 'Jean Petit', statut: 1, presence: jour('2026-11-15') },
    { nom: 'Joël Mvondo', statut: 3, presence: jour('2026-10-25') },
  ],
  evry: [
    { nom: 'Arnaud Biloa', statut: 2, presence: jour('2026-11-14') },
    { nom: 'Cédric Owona', statut: 1, presence: jour('2026-10-31') },
    { nom: 'Danielle Essomba', statut: 2, presence: jour('2026-11-14') },
    { nom: 'Fabrice Nkoulou', statut: 2, presence: jour('2026-11-14') },
    { nom: 'Inès Manga', statut: 3, presence: jour('2026-10-17') },
    { nom: 'Josué Ebanda', statut: 2, presence: jour('2026-11-07') },
    { nom: 'Laure Fouda', statut: 2, presence: jour('2026-11-14') },
  ],
};

/** P3 — les assemblées sur la carte : celles de la chaîne, plus Évry Sud (hors chaîne). */
export const HORS_CHAINE = { nom: 'Évry Sud', ville: 'Évry' };

// ---------------------------------------------------------------------------------------------
// Vérifications au chargement : les chiffres affichés doivent se tenir.

if (VIE.reunions !== 10 || VIE.actives !== '4 / 5' || VIE.alertes !== 1 || VIE.alerteNoms !== 'Paris Sud') {
  throw new Error('Vidéo « Caleb » : le bloc Vie d’assemblée ne correspond plus au storyboard.');
}
if (ETUDE.lecons !== 7 || ASSEMBLEES.ouest.etude.leconsFaites !== 3 || ASSEMBLEES.sud.etude.leconsFaites !== 0) {
  throw new Error('Vidéo « Caleb » : l’avancement de Bertoua ne correspond plus à celui de « Étude ».');
}
if (CR_OUEST.presents.length !== REUNIONS_OUEST[1].presents) {
  throw new Error('Vidéo « Caleb » : le compte rendu du 8 novembre ne compte pas ses présents.');
}
for (const k of ORDRE) {
  const a = BRUT[k];
  if (a.enseignes > a.membres || a.distinctes > a.membres + 2) throw new Error(`Vidéo « Caleb » : chiffres incohérents pour ${a.nom}.`);
}

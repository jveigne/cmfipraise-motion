/**
 * Durées de la série « Enseignements sur les finances », calculées depuis les textes avec la règle du
 * « Guide » : 1 s pour 12 caractères, 3,5 s au moins par phrase, plus une courte pause entre deux phrases.
 */
export type Temps = { texte: string; reference?: string };

export type Partie = {
  id: string;
  etiquette: string;
  /**
   * `pile` : les phrases s'empilent sur une page ; `remplace` : chaque phrase remplace la précédente ;
   * `auto` : les phrases s'empilent et passent à une nouvelle page quand la colonne est pleine.
   */
  mode: 'pile' | 'remplace' | 'auto';
  /** Mode `auto` : indices des phrases qui ouvrent une nouvelle page, à la place du calcul automatique. */
  pages?: number[];
  /** Corps du texte, pour une partie très dense (46 par défaut, 54 en mode `remplace`). */
  taille?: number;
  temps: Temps[];
};

export const IPS = 30;
const CARACTERES_PAR_S = 12;
const LECTURE_MIN = Math.round(3.5 * IPS);
const PAUSE = 15;
/** L'illustration s'installe avant la première phrase. */
const ENTREE = 30;
/** La dernière phrase reste un moment avant le plan suivant. */
const SORTIE = 30;

export const DUREE_OUVERTURE = 8 * IPS;
export const DUREE_FIN = 8 * IPS;
export const FONDU_PLANS = 10;

const longueur = (t: Temps) => (t.texte + (t.reference ?? '')).replace(/\*\*/g, '').length;
const lecture = (t: Temps) => Math.max(LECTURE_MIN, Math.ceil((longueur(t) / CARACTERES_PAR_S) * IPS)) + PAUSE;

export type Entree = { id: string; debut: number; duree: number; debuts: number[]; partie: Partie | null };

export const construireFrise = (parties: Partie[]): Entree[] => {
  const frise: Entree[] = [{ id: 'ouverture', debut: 0, duree: DUREE_OUVERTURE, debuts: [], partie: null }];
  let t = DUREE_OUVERTURE;
  for (const partie of parties) {
    const debuts: number[] = [];
    let local = ENTREE;
    for (const temps of partie.temps) {
      debuts.push(local);
      local += lecture(temps);
    }
    frise.push({ id: partie.id, debut: t, duree: local + SORTIE, debuts, partie });
    t += local + SORTIE;
  }
  frise.push({ id: 'fin', debut: t, duree: DUREE_FIN, debuts: [], partie: null });
  return frise;
};

export const dureeTotale = (frise: Entree[]) => frise[frise.length - 1].debut + DUREE_FIN;

const LARGEUR_COLONNE = 830;
const HAUTEUR_COLONNE = 760;
const ECART = 40;

/** Hauteur estimée d'une phrase, un peu large pour ne jamais déborder. */
const hauteurPhrase = (t: Temps, taille: number) => {
  const parLigne = Math.floor(LARGEUR_COLONNE / (taille * 0.47));
  const lignes = Math.ceil(t.texte.replace(/\*\*/g, '').length / parLigne);
  return lignes * taille * 1.3 + (t.reference ? 54 : 0);
};

/** Indices des phrases qui ouvrent chaque page (la première page ouvre toujours sur 0). */
export const paginer = (partie: Partie): number[] => {
  if (partie.pages) return [0, ...partie.pages.filter((i) => i > 0)];
  const taille = partie.taille ?? 46;
  const pages = [0];
  let cumul = 0;
  partie.temps.forEach((t, i) => {
    const h = hauteurPhrase(t, taille);
    if (i > 0 && cumul + ECART + h > HAUTEUR_COLONNE) {
      pages.push(i);
      cumul = h;
    } else {
      cumul += (i > 0 ? ECART : 0) + h;
    }
  });
  return pages;
};

import { PARTIES, Partie } from './textes';

/**
 * Durées calculées depuis les textes, avec la règle de lecture du « Guide » : 1 s pour 12 caractères,
 * 3,5 s au moins par phrase, plus une courte pause entre deux phrases.
 */
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

const longueur = (t: Partie['temps'][number]) => (t.texte + (t.reference ?? '')).replace(/\*\*/g, '').length;
const lecture = (t: Partie['temps'][number]) => Math.max(LECTURE_MIN, Math.ceil((longueur(t) / CARACTERES_PAR_S) * IPS)) + PAUSE;

export type Entree = { id: string; debut: number; duree: number; debuts: number[]; partie: Partie | null };

const construire = (): Entree[] => {
  const frise: Entree[] = [{ id: 'ouverture', debut: 0, duree: DUREE_OUVERTURE, debuts: [], partie: null }];
  let t = DUREE_OUVERTURE;
  for (const partie of PARTIES) {
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

export const FRISE = construire();
export const DUREE_FINANCES_CH1 = FRISE[FRISE.length - 1].debut + DUREE_FIN;

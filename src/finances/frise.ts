import { construireFrise, dureeTotale } from './moteur/frise';
import { PARTIES } from './textes';

/** Chapitre 1 : le moteur de durées est commun à la série (`moteur/frise.ts`). */
export const FRISE = construireFrise(PARTIES);
export const DUREE_FINANCES_CH1 = dureeTotale(FRISE);

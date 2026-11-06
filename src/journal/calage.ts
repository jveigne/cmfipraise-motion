import { DUREE_BASCULE } from './plans/Cartons';
import { DUREE_S1, DUREE_S2, DUREE_S3, DUREE_S4 } from './plans/Saisir';
import { DUREE_K1, DUREE_K2 } from './plans/Conserver';

/**
 * Calage musical (storyboard § 5). Piste : « Dieu fait toutes choses nouvelles » (7 min 32), la
 * même que la vidéo « Évènements ». Enveloppe mesurée : 0–10 s très doux ; 10–24 s montée douce ;
 * à 24,0 s nette montée (+6 dB) ; 24–70 s intensité moyenne ; à 70,5 s l'orchestre entre en plein ;
 * fort et stable ensuite jusqu'à ≈ 412 s.
 *
 * Deux rendez-vous : la bascule « problème → l'app » (début de P6) tombe sur la montée de 24,0 s ;
 * le PDF qui jaillit (début de P14) tombe sur l'entrée de l'orchestre à 70,5 s. Entre les deux, il
 * faut exactement (70,5 − 24,0) × 30 = 1 395 images, dans le fichier comme dans la vidéo.
 *
 * P13 (choix de la période, « Générer le PDF ») est le plan tampon : sa durée est CALCULÉE pour
 * que P14 tombe sur l'orchestre. Retoucher une durée entre P6 et P12 ne décale donc jamais
 * l'orchestre ; seule P13 s'allonge ou se raccourcit (garde : 240 images au moins, sinon ses
 * gestes n'ont plus la place). Retoucher P1–P5 ne change que le point de départ dans le chant
 * (`trimBefore`, Video.tsx).
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** Durées de P6 à P12 (bascule, saisir, conserver). */
const AVANT_P13 = DUREE_BASCULE + DUREE_S1 + DUREE_S2 + DUREE_S3 + DUREE_S4 + DUREE_K1 + DUREE_K2;

/** Durée de P13, plan tampon : 1 395 − 1 140 = 255 images (8,5 s) avec le découpage actuel. */
export const DUREE_I1 = ORCHESTRE - MONTEE - AVANT_P13;

/** Durée minimale de P13 : ses gestes vont jusqu'à « Générer le PDF » à `DUREE_I1` − 27. */
export const DUREE_I1_MIN = 240;
if (DUREE_I1 < DUREE_I1_MIN) {
  throw new Error(`Calage musical : P13 ne dure plus que ${DUREE_I1} images (minimum ${DUREE_I1_MIN}). Raccourcir P6–P12.`);
}

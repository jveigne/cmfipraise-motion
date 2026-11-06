import { DUREE_P1, DUREE_P2 } from './plans/Ouverture';
import { DUREE_P3, DUREE_P4 } from './plans/PourQui';
import { DUREE_P5, DUREE_P6 } from './plans/Bertoua';
import { DUREE_P7 } from './plans/Journal';
import { DUREE_P8_MIN } from './plans/Evenements';
import { DUREE_INTERTITRE } from './ui/Decor';

/**
 * Calage musical (storyboard § 5), mécanisme d'« Étude ». Piste : « Dieu fait toutes choses
 * nouvelles » (451,8 s, bien plus longue que la vidéo). Enveloppe mesurée : 0–10 s très doux ;
 * 10–24 s montée douce ; à 24,0 s nette montée (+6 dB) ; 24–70 s intensité moyenne ; à 70,5 s
 * l'orchestre entre en plein.
 *
 * La vidéo part du DÉBUT du fichier (`trimBefore` 0) :
 * - le verset, le nom de l'offre et « pour qui » tiennent dans la partie douce ; l'intertitre
 *   « 1 · Le Message de Bertoua » s'achève et la grille de la ville (P5) s'ouvre sur la montée de
 *   24,0 s (image 720) — les coches tombent avec elle ;
 * - l'orchestre (70,5 s, image 2 115) tombe sur P9, « Une ville, tous ses responsables ».
 *
 * P8 (les évènements) est le plan tampon : sa durée est CALCULÉE (1 395 images entre les deux
 * rendez-vous, moins P5, P6, P7 et deux intertitres) ; garde : 300 images au moins.
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** Avant P5 : 195 + 135 + 180 + 135 + 75 = 720 images. */
export const AVANT_P5 = DUREE_P1 + DUREE_P2 + DUREE_P3 + DUREE_P4 + DUREE_INTERTITRE;

/** De P5 à P7, deux intertitres compris : 300 + 240 + 75 + 360 + 75 = 1 050 images. */
const P5_A_P7 = DUREE_P5 + DUREE_P6 + DUREE_INTERTITRE + DUREE_P7 + DUREE_INTERTITRE;

/** Durée de P8, plan tampon : 1 395 − 1 050 = 345 images (11,5 s) avec le découpage actuel. */
export const DUREE_P8 = ORCHESTRE - MONTEE - P5_A_P7;

if (AVANT_P5 !== MONTEE) {
  throw new Error(`Calage musical : P5 doit commencer sur la montée (image ${MONTEE}), il commence image ${AVANT_P5}. Retoucher P1–P4.`);
}
if (DUREE_P8 < DUREE_P8_MIN) {
  throw new Error(`Calage musical : P8 ne dure plus que ${DUREE_P8} images (minimum ${DUREE_P8_MIN}). Raccourcir P5–P7.`);
}

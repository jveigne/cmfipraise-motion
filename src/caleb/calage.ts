import { DUREE_P3, DUREE_P4 } from './plans/Chaine';
import { DUREE_P5, DUREE_P6_MIN } from './plans/Assemblees';
import { DUREE_INTERTITRE } from './ui/Intertitre';

/**
 * Calage musical (storyboard § 5), mécanisme de « Journal », « Documents » et « Étude ». Piste :
 * « Dieu fait toutes choses nouvelles » (451,8 s, bien plus longue que la vidéo). Enveloppe mesurée :
 * 0–10 s très doux ; 10–24 s montée douce ; à 24,0 s nette montée (+6 dB) ; 24–70 s intensité
 * moyenne ; à 70,5 s l'orchestre entre en plein.
 *
 * Deux rendez-vous :
 * - la montée de 24,0 s tombe sur l'intertitre « 1 · La chaîne » (fin de l'ouverture : verset et
 *   titre se jouent sur la montée douce) ; le point de départ dans le fichier (`trimBefore`) s'en
 *   déduit (Video.tsx) ;
 * - l'orchestre (70,5 s, 1 395 images après la montée) tombe sur P7, le bloc « Le Message de
 *   Bertoua ».
 *
 * P6 (les comptes rendus de Paris Ouest) est le plan tampon : sa durée est CALCULÉE pour tenir le
 * second rendez-vous. Retoucher une durée entre l'intertitre 1 et P5 (ou l'intertitre 3) se reporte
 * donc sur P6 (garde : `DUREE_P6_MIN`).
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** De l'intertitre 1 à P5, plus l'intertitre 3 : 75 + 240 + 300 + 75 + 330 + 75 = 1 095 images. */
const AUTOUR_DE_P6 = DUREE_INTERTITRE + DUREE_P3 + DUREE_P4 + DUREE_INTERTITRE + DUREE_P5 + DUREE_INTERTITRE;

/** Durée de P6, plan tampon : 1 395 − 1 095 = 300 images (10,0 s) avec le découpage actuel. */
export const DUREE_P6 = ORCHESTRE - MONTEE - AUTOUR_DE_P6;

if (DUREE_P6 < DUREE_P6_MIN) {
  throw new Error(`Calage musical : P6 ne dure plus que ${DUREE_P6} images (minimum ${DUREE_P6_MIN}). Raccourcir P3–P5.`);
}

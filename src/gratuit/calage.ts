import { DUREE_P1 } from './plans/Cartons';
import { DUREE_P2, DUREE_P3, DUREE_P4 } from './plans/Assemblee';
import { DUREE_P5, DUREE_P6_MIN } from './plans/Objectifs';
import { DUREE_INTERTITRE } from './ui/Habillage';

/**
 * Calage musical (storyboard § 5), mécanisme d'« Étude » et de « Journal ». Piste : « Dieu fait
 * toutes choses nouvelles » (451,8 s). Enveloppe mesurée : 0–10 s très doux ; 10–24 s montée
 * douce ; à 24,0 s nette montée (+6 dB) ; 24–70 s intensité moyenne ; à 70,5 s l'orchestre entre.
 *
 * Deux rendez-vous :
 * - la montée de 24,0 s tombe sur l'intertitre « 1 · Son assemblée » (fin de l'ouverture P1) : la
 *   vidéo part donc à 24,0 s − durée de P1 du fichier (`TRIM_BEFORE`, 19,5 s aujourd'hui) ;
 * - l'orchestre (70,5 s), 46,5 s (1 395 images) après la montée, tombe sur l'intertitre « 3 · Et
 *   aussi » : la partie « gratuit au-delà de l'assemblée » s'ouvre en plein.
 *
 * P6 (l'arbre de la Hiérarchie) est le plan TAMPON : sa durée est CALCULÉE pour tenir le second
 * rendez-vous. Retoucher une durée entre l'intertitre 1 et P5 se reporte sur P6 (garde :
 * `DUREE_P6_MIN`). Retoucher P1 change le point de départ dans le chant.
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** Départ dans le fichier : 720 − 135 = 585 images (19,5 s). */
export const TRIM_BEFORE = MONTEE - DUREE_P1;
if (TRIM_BEFORE < 0) throw new Error('Calage musical : l’ouverture dépasse 24 s.');

/** De l'intertitre 1 à P5 compris : 75 + 3 × 250 + 75 + 250 = 1 150 images. */
const AVANT_P6 = DUREE_INTERTITRE + DUREE_P2 + DUREE_P3 + DUREE_P4 + DUREE_INTERTITRE + DUREE_P5;

/** Durée de P6, plan tampon : 1 395 − 1 150 = 245 images (8,2 s) avec le découpage actuel. */
export const DUREE_P6 = ORCHESTRE - MONTEE - AVANT_P6;

if (DUREE_P6 < DUREE_P6_MIN) {
  throw new Error(`Calage musical : P6 ne dure plus que ${DUREE_P6} images (minimum ${DUREE_P6_MIN}). Raccourcir P2–P5.`);
}

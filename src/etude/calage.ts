import { DUREE_P5 } from './plans/Cartons';
import { DUREE_P6, DUREE_P7 } from './plans/Lire';
import { DUREE_P8, DUREE_P9, DUREE_P10_MIN } from './plans/Repondre';
import { DUREE_INTERTITRE } from './ui/Intertitre';

/**
 * Calage musical (storyboard § 5), mécanisme de « Journal » et « Documents ». Piste : « Dieu fait
 * toutes choses nouvelles » (451,8 s : bien plus longue que la vidéo, aucune boucle ni prolongation
 * nécessaire). Enveloppe mesurée : 0–10 s très doux ; 10–24 s montée douce ; à 24,0 s nette montée
 * (+6 dB) ; 24–70 s intensité moyenne ; à 70,5 s l'orchestre entre en plein.
 *
 * Deux rendez-vous :
 * - la bascule « problème → l'app » (début de P5, la tuile qui jaillit) tombe sur la montée de
 *   24,0 s. Le problème dure désormais 24,0 s (retour JP du 21/10, poses allongées) : la vidéo part
 *   du DÉBUT du fichier (`trimBefore` 0, garde : le problème ne peut pas dépasser 24 s) ;
 * - l'entrée de l'orchestre à 70,5 s, 46,5 s (1 395 images) après la montée. Avec le rythme ralenti,
 *   l'échange des téléphones arrive bien plus tard (≈ 1 min 37) : l'orchestre tombe désormais sur
 *   P11, le salon où tout le monde répond — sur son téléphone, dans son livret ou dans un cahier —,
 *   un temps fort que JP a demandé de montrer clairement.
 *
 * P10 (Jean sans réseau) est le plan tampon : sa durée est CALCULÉE pour que P11 tombe sur
 * l'orchestre ; le retour du réseau est posé depuis sa fin. Retoucher une durée entre P5 et P9 (ou
 * l'intertitre « 2 · Répondre ») se reporte donc sur P10 (garde : 135 images au moins). Retoucher
 * P1–P4 change le point de départ dans le chant (`trimBefore`, Video.tsx).
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** De P5 à P9, intertitre « 2 · Répondre » compris : 150 + 150 + 315 + 75 + 225 + 315 = 1 230 images. */
const AVANT_P10 = DUREE_P5 + DUREE_P6 + DUREE_P7 + DUREE_INTERTITRE + DUREE_P8 + DUREE_P9;

/** Durée de P10, plan tampon : 1 395 − 1 230 = 165 images (5,5 s) avec le découpage actuel. */
export const DUREE_P10 = ORCHESTRE - MONTEE - AVANT_P10;

if (DUREE_P10 < DUREE_P10_MIN) {
  throw new Error(`Calage musical : P10 ne dure plus que ${DUREE_P10} images (minimum ${DUREE_P10_MIN}). Raccourcir P5–P9.`);
}

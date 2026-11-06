import { DUREE_P6 } from '../etude/plans/Lire';
import { DUREE_A1, DUREE_A2, DUREE_A3 } from './plans/Commencer';
import { DUREE_O1, DUREE_O2_MIN } from './plans/Ouverture';
import { DUREE_INTERTITRE } from './ui/Cartons';

/**
 * Calage musical de « Le Message de Bertoua en détail » (mécanisme de `src/etude/calage.ts`).
 * Piste : « Dieu fait toutes choses nouvelles » (451,8 s, bien plus longue que la vidéo). Enveloppe
 * mesurée (storyboard d'« Étude » § 5) : 0–10 s très doux ; 10–24 s montée douce ; à 24,0 s nette
 * montée (+6 dB) ; 24–70 s intensité moyenne ; à 70,5 s l'orchestre entre en plein.
 *
 * Deux rendez-vous :
 * - la nette montée de 24,0 s ouvre le salon (début de O2), juste après le titre : la vidéo part
 *   donc à 24,0 s − durée de O1 = 19,0 s du fichier (`trimBefore` 570) ;
 * - l'entrée de l'orchestre (70,5 s, 46,5 s = 1 395 images après la montée) tombe sur P8, le moment
 *   où les questions arrivent sur chaque téléphone du salon.
 * O2 (le salon) est le plan tampon : sa durée est CALCULÉE pour que P8 tombe sur l'orchestre ;
 * retoucher une durée entre O2 et P8 (intertitres compris) se reporte sur O2 (garde : 150 images).
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** De la fin de O2 au début de P8 : intertitre 1, P6, A1, A2, A3, intertitre 2 = 1 230 images. */
const APRES_O2 = DUREE_INTERTITRE + DUREE_P6 + DUREE_A1 + DUREE_A2 + DUREE_A3 + DUREE_INTERTITRE;

/** Durée de O2, plan tampon : 1 395 − 1 230 = 165 images (5,5 s). */
export const DUREE_O2 = ORCHESTRE - MONTEE - APRES_O2;

/** Point de départ dans le chant : la montée sur le début de O2. */
export const TRIM_BEFORE = MONTEE - DUREE_O1;

if (DUREE_O2 < DUREE_O2_MIN) {
  throw new Error(`Calage musical : O2 ne dure plus que ${DUREE_O2} images (minimum ${DUREE_O2_MIN}). Raccourcir A1–A3.`);
}
if (TRIM_BEFORE < 0) throw new Error('Calage musical : le titre dépasse 24 s.');

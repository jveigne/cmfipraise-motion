import { DUREE_P4 } from './plans/Cartons';
import { DUREE_P5, DUREE_P6 } from './plans/Monde';
import { DUREE_P7 } from './plans/Retrouver';

/**
 * Calage musical (storyboard § 5), mécanisme de « Journal » (`src/journal/calage.ts`). Piste :
 * « Dieu fait toutes choses nouvelles », la même que « Évènements » et « Journal ». Enveloppe
 * mesurée : 0–10 s très doux ; 10–24 s montée douce ; à 24,0 s nette montée (+6 dB) ; 24–70 s
 * intensité moyenne ; à 70,5 s l'orchestre entre en plein.
 *
 * Rendez-vous principal : la bascule P4 (« Tous vos documents, au même endroit. ») tombe sur la
 * montée de 24,0 s. La vidéo part donc à 24,0 − 19,5 = 4,5 s du fichier (`trimBefore` 135,
 * Video.tsx) tant que P1–P3 durent 19,5 s.
 *
 * Second rendez-vous : l'entrée de l'orchestre (70,5 s du fichier, 66,0 s de la vidéo) tombe
 * dans P8 ; la couverture s'y retourne de v1 en v2 à cet instant. L'image de la bascule est
 * CALCULÉE depuis les durées de P4 à P7 : les retoucher la déplace, jamais l'orchestre.
 */
export const IPS = 30;
export const MONTEE = Math.round(24.0 * IPS);
export const ORCHESTRE = Math.round(70.5 * IPS);

/** Durées de P4 à P7 (bascule, mondial et par pays, retrouver). */
const AVANT_P8 = DUREE_P4 + DUREE_P5 + DUREE_P6 + DUREE_P7;

/** Image de P8 où la couverture passe en v2 : 1 395 − 1 335 = 60 avec le découpage actuel. */
export const BASCULE_V2 = ORCHESTRE - MONTEE - AVANT_P8;

if (BASCULE_V2 < 40 || BASCULE_V2 > 150) {
  throw new Error(`Calage musical : la v2 de P8 tomberait à l'image ${BASCULE_V2} (attendu 40 à 150). Retoucher P4–P7.`);
}

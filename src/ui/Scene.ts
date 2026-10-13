import { CADRE, ECRAN } from './Telephone';

/** Téléphone au repos, commun à tous les plans : chaque plan commence et finit ainsi. */
export const ECHELLE = 640 / ECRAN.largeur;
export const TEL_X = (1080 - (ECRAN.largeur * ECHELLE + 2 * CADRE)) / 2;
export const TEL_Y = 430;

/** Repère écran (points) → repère vidéo (pixels), téléphone au repos. */
export const versVideo = (x: number, y: number) => ({
  x: TEL_X + CADRE + x * ECHELLE,
  y: TEL_Y + CADRE + y * ECHELLE,
});

/** Centre du téléphone, en pixels vidéo (axe des rotations portrait ↔ paysage). */
export const CENTRE_TEL = versVideo(ECRAN.largeur / 2, ECRAN.hauteur / 2);

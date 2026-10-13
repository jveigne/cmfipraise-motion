import { Easing, interpolate } from 'remotion';

/** Interpolation bornée, adoucie au départ et à l'arrivée : le mouvement de caméra par défaut. */
export const doux = (f: number, entrees: number[], sorties: number[]) =>
  interpolate(f, entrees, sorties, {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.cubic),
  });

/** Centre vertical d'une carte de catégorie, en points, liste non défilée. La première
 *  carte porte un nom sur deux lignes : elle est plus haute que les suivantes. */
export const centreCategorie = (i: number) => (i === 0 ? 266 : 356 + 80 * (i - 1));

/** Défilement qui amène la carte `i` au milieu de la zone visible. */
export const defilementVers = (i: number) => Math.min(0, 470 - centreCategorie(i));

import React from 'react';
import { AbsoluteFill, interpolate, spring } from 'remotion';
import { CameraWeb, Navigateur } from '../ui/Navigateur';

/**
 * Outils communs aux plans d'« Offre Néhémie » : légende à taille ajustée de « Documents » (via
 * « Étude »), pastille de partie de « Journal », pastille de personne et halo d'« Étude », ressort
 * d'« Évènements » — réexportés sans modification.
 */
export { LegendeEtude as Legende, PastillePersonne, haloEntre } from '../../etude/plans/commun';
export { PastillePartie, borne } from '../../journal/plans/commun';
export { lisse } from '../../evenements/plans/commun';

/** Fondu enchaîné entre deux pages de la fenêtre (`p` de 0 à 1). */
export const FonduPage: React.FC<{ p: number; avant: React.ReactNode; apres: React.ReactNode }> = ({ p, avant, apres }) => (
  <>
    {p < 1 ? <AbsoluteFill>{avant}</AbsoluteFill> : null}
    {p > 0 ? <AbsoluteFill style={{ opacity: p }}>{apres}</AbsoluteFill> : null}
  </>
);

/** Fenêtre au repos avec sa caméra : la page en `children`, les calques vidéo en `dessus`. */
export const Fenetre: React.FC<{
  zoom?: number;
  foyer?: { x: number; y: number };
  decalageY?: number;
  opacite?: number;
  dessus?: React.ReactNode;
  /** Chemin de la barre d'adresse (défaut `/study/city`). */
  chemin?: string;
  children: React.ReactNode;
}> = ({ children, chemin, ...camera }) => (
  <CameraWeb {...camera}>
    <Navigateur chemin={chemin}>{children}</Navigateur>
  </CameraWeb>
);

/** La fenêtre monte du bas en ressort (gabarit de `montee` d'« Évènements »). */
export const monteeFenetre = (f: number, fps: number, debut = 0) => (1 - spring({ frame: f - debut, fps, config: { damping: 18, mass: 0.9 } })) * 1500;

/** Compteur qui monte de 0 à 1 (chiffres des indicateurs). */
export const compteur = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: (t) => 1 - Math.pow(1 - t, 3) });

import React from 'react';
import { AbsoluteFill, Freeze, interpolate, useCurrentFrame } from 'remotion';
import { P, S, ONDE } from '../../evenements/theme';
import { Telephone } from '../../ui/Telephone';import { Toucher } from '../../ui/Toucher';
import { ECHELLE, TEL_X, TEL_Y } from '../../ui/Scene';

/**
 * Outils communs aux plans de la vidéo « L'Étude de l'assemblée » : ceux d'« Évènements » (`Appui`,
 * `Voile`, `montee`, `lisse`, `tape`, `Decale`, `Fondu`), de « Journal » (pastille de partie, `borne`)
 * et la légende à taille ajustée de « Documents », réexportés sans modification. S'y ajoutent les
 * pastilles de personne (annotation vidéo, § 2), les téléphones posés librement (plusieurs à la
 * fois, P8, P14, P15) et le ralenti par poses (`Ralenti`, retour JP du 21/10).
 */
export { Appui, Decale, Fondu, Voile, lisse, montee, tape, voilePour } from '../../evenements/plans/commun';
export { PastillePartie, borne } from '../../journal/plans/commun';
export { LegendeDocuments as LegendeEtude } from '../../documents/plans/commun';

/** Pastille de personne au-dessus d'un téléphone (« MARIE », « SAMUEL · DIRIGEANT »…). */
export const PastillePersonne: React.FC<{ x: number; y: number; opacite?: number; taille?: number; children: React.ReactNode }> = ({
  x,
  y,
  opacite = 1,
  taille = 30,
  children,
}) =>
  opacite <= 0.001 ? null : (
    <div style={{ position: 'absolute', left: x, top: y, transform: 'translate(-50%, -50%)', opacity: opacite, whiteSpace: 'nowrap' }}>
      <div
        style={{
          padding: `${taille * 0.36}px ${taille * 0.8}px`,
          borderRadius: 99,
          background: S.paper,
          border: `2px solid ${S.mossTint2}`,
          boxShadow: '0 10px 24px rgba(42,38,32,0.14)',
          fontFamily: P.mono,
          fontWeight: 500,
          fontSize: taille,
          letterSpacing: taille * 0.08,
          color: S.moss,
        }}
      >
        {children}
      </div>
    </div>
  );

/** Haut de la pastille de personne d'un téléphone au repos (entre la légende et l'écran). */
export const Y_PASTILLE = 372;

/** Téléphone posé librement : coin haut gauche (`x`, `y`) et échelle (pixels par point). */
export interface Pose {
  x: number;
  y: number;
  e: number;
}

/** Le téléphone au repos du `Plateau` : départ et arrivée des transitions. */
export const REPOS: Pose = { x: TEL_X, y: TEL_Y, e: ECHELLE };

/** Pose interpolée entre deux poses (`p` de 0 à 1). */
export const entre = (a: Pose, b: Pose, p: number): Pose => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, e: a.e + (b.e - a.e) * p });

/** Point d'écran (points) → pixels vidéo, pour un téléphone posé en `pose`. */
export const versPose = (pose: Pose, x: number, y: number) => ({ x: pose.x + 16 + x * pose.e, y: pose.y + 16 + y * pose.e });

/** Largeur totale d'un téléphone (cadre compris) posé à l'échelle `e`. */
export const largeurTel = (e: number) => 390 * e + 32;

export const TelephoneLibre: React.FC<{ pose: Pose; opacite?: number; avion?: number; children: React.ReactNode }> = ({ pose, opacite = 1, avion = 0, children }) =>
  opacite <= 0.001 ? null : (
    <AbsoluteFill style={{ opacity: opacite }}>
      <Telephone x={pose.x} y={pose.y} echelle={pose.e} avion={avion}>
        {children}
      </Telephone>
    </AbsoluteFill>
  );

/** Appui du doigt sur un point d'écran d'un téléphone posé librement. */
export const AppuiLibre: React.FC<{ pose: Pose; x: number; y: number; a: number; coupe?: number }> = ({ pose, x, y, a, coupe }) => {
  const f = useCurrentFrame();
  const v = versPose(pose, x, y);
  const opacite = coupe === undefined ? 1 : interpolate(f, [coupe, coupe + 3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (opacite <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: opacite, pointerEvents: 'none' }}>
      <Toucher x={v.x} y={v.y} a={a} taille={Math.max(26, 40 * (pose.e / ECHELLE))} couleurOnde={ONDE} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// Ralenti par poses (retour JP 21/10 : « plus lent, pour bien expliquer »)

/**
 * Poses ajoutées à un plan : `[image, durée]` — à l'image `image` de la chorégraphie d'origine,
 * tout s'arrête `durée` images (rien ne bouge : on lit). Les gestes gardent leur vitesse ; seules
 * les tenues s'allongent. Les poses se placent sur des instants calmes (aucun mouvement en cours).
 */
export type Poses = readonly (readonly [number, number])[];

/** Image de la chorégraphie d'origine montrée à l'image `f` du plan ralenti. */
export const imageOrigine = (f: number, poses: Poses) => {
  let t = f;
  for (const [p, d] of [...poses].sort((a, b) => a[0] - b[0])) {
    if (t <= p) return t;
    if (t <= p + d) return p;
    t -= d;
  }
  return t;
};

/** Image du plan ralenti où arrive l'image `a` de la chorégraphie d'origine (début de pose). */
export const imageRalentie = (a: number, poses: Poses) => a + poses.filter(([p]) => p < a).reduce((s, [, d]) => s + d, 0);

/** Durée du plan ralenti. */
export const dureeRalentie = (duree: number, poses: Poses) => duree + poses.reduce((s, [, d]) => s + d, 0);

/**
 * Joue `children` (écrits dans le temps d'origine) avec les poses : les composants qui lisent
 * `useCurrentFrame()` — appuis, ressorts — voient l'image d'origine (`Freeze` sur cette image).
 */
export const Ralenti: React.FC<{ poses: Poses; children: React.ReactNode }> = ({ poses, children }) => {
  const f = useCurrentFrame();
  return <Freeze frame={imageOrigine(f, poses)}>{children}</Freeze>;
};

/** Halo entre deux images (`a` → `b`) : monte en 10 images (moins si l'intervalle est court), tenu, redescend. */
export const haloEntre = (f: number, a: number, b: number) => {
  const r = Math.min(10, (b - a) / 3);
  return interpolate(f, [a, a + r, b - r, b], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};

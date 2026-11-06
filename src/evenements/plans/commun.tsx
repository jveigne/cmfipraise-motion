import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame } from 'remotion';
import { Legende } from '../../ui/Legende';
import { Toucher } from '../../ui/Toucher';
import { CENTRE_TEL, versVideo } from '../../ui/Scene';
import { ONDE, P, S } from '../theme';

/**
 * Outils communs aux plans de la vidéo « Évènements ». Les images (`a`, `f`) sont locales au
 * plan ; les positions d'écran sont en points (repère 390 × 844 du `Telephone`).
 */

/** Légende Shephr : Fraunces, encre, mot clé en argile (la couleur des surtitres de l'app). */
export const LegendeShephr: React.FC<{ lignes: readonly string[]; duree: number; debut?: number }> = ({
  lignes,
  duree,
  debut = 6,
}) => (
  <Legende
    lignes={[...lignes]}
    duree={duree}
    debut={debut}
    taille={80}
    delais={[0, 10]}
    police={P.serif}
    couleur={S.ink}
    couleurAccent={S.clay}
  />
);

/**
 * Voile clair sous la légende : quand la caméra s'approche, le haut du téléphone remonte
 * derrière le texte ; le voile le masque pour garder la légende lisible. `force` de 0 à 1.
 */
export const Voile: React.FC<{ force: number }> = ({ force }) =>
  force <= 0.001 ? null : (
    <AbsoluteFill
      style={{
        background: `linear-gradient(to bottom, ${S.paper2} 0px, ${S.paper2} 400px, rgba(251,245,230,0) 470px)`,
        opacity: Math.min(1, force),
        pointerEvents: 'none',
      }}
    />
  );

/** Force du voile pour un zoom donné : nul au repos, plein dès 1,08. */
export const voilePour = (zoom: number) => Math.max(0, Math.min(1, (zoom - 1) / 0.08));

/**
 * Appui du doigt sur un point d'écran (points), onde mousse. `coupe` (facultatif) : image à
 * partir de laquelle l'onde s'efface en 3 images — quand l'écran touché s'en va (liste qui se
 * ferme, écran suivant qui arrive), l'onde ne doit pas flotter sur le nouvel écran.
 */
export const Appui: React.FC<{ x: number; y: number; a: number; coupe?: number }> = ({ x, y, a, coupe }) => {
  const f = useCurrentFrame();
  const v = versVideo(x, y);
  const opacite = coupe === undefined ? 1 : interpolate(f, [coupe, coupe + 3], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  if (opacite <= 0) return null;
  return (
    <AbsoluteFill style={{ opacity: opacite, pointerEvents: 'none' }}>
      <Toucher x={v.x} y={v.y} a={a} taille={40} couleurOnde={ONDE} />
    </AbsoluteFill>
  );
};

/** Le téléphone monte du bas en ressort (comme `ScenePlans2et3`) : décalage vertical en pixels. */
export const montee = (f: number, fps: number, debut = 0) =>
  (1 - spring({ frame: f - debut, fps, config: { damping: 18, mass: 0.9 } })) * 1500;

/** Ressort amorti sans rebond, de 0 à 1, à partir de l'image `a`. */
export const lisse = (f: number, fps: number, a: number, duree = 16) =>
  spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: duree });

/** Texte tapé lettre à lettre : `parImage` caractères par image à partir de `a`. */
export const tape = (texte: string, f: number, a: number, parImage = 0.5) =>
  texte.slice(0, Math.max(0, Math.min(texte.length, Math.floor((f - a) * parImage))));

/**
 * Déplace et réduit tout le plateau (téléphone + calques) autour du centre du téléphone, pour
 * libérer la droite de l'image à une annotation (P11, P16).
 */
export const Decale: React.FC<{ dx: number; reduction: number; children: React.ReactNode }> = ({ dx, reduction, children }) => (
  <AbsoluteFill
    style={{
      transform: `translateX(${dx}px) scale(${reduction})`,
      transformOrigin: `${CENTRE_TEL.x}px ${CENTRE_TEL.y}px`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Fondu enchaîné entre deux états d'un même écran (`p` de 0 à 1). */
export const Fondu: React.FC<{ p: number; avant: React.ReactNode; apres: React.ReactNode }> = ({ p, avant, apres }) => (
  <>
    {p < 1 ? <div style={{ position: 'absolute', inset: 0 }}>{avant}</div> : null}
    {p > 0 ? <div style={{ position: 'absolute', inset: 0, opacity: p }}>{apres}</div> : null}
  </>
);

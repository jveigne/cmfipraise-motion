import React from 'react';
import { interpolate, useCurrentFrame, Easing } from 'remotion';

/**
 * Appui du doigt : un disque apparaît, se presse, puis une onde s'élargit.
 * `a` = image de l'appui. Coordonnées dans le repère du parent.
 */
export const Toucher: React.FC<{ x: number; y: number; a: number; taille?: number }> = ({
  x,
  y,
  a,
  taille = 44,
}) => {
  const f = useCurrentFrame() - a;
  if (f < -8 || f > 22) return null;

  const doigt = interpolate(f, [-8, -2, 0, 3, 12], [0, 0.85, 0.75, 0.85, 0], {
    extrapolateRight: 'clamp',
  });
  const echelle = interpolate(f, [-8, -2, 0, 3], [1.3, 1, 0.85, 1], { extrapolateRight: 'clamp' });
  const onde = interpolate(f, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - taille,
          top: y - taille,
          width: taille * 2,
          height: taille * 2,
          borderRadius: '50%',
          border: '3px solid rgba(22,104,184,0.7)',
          transform: `scale(${0.5 + onde * 1.2})`,
          opacity: f >= 0 ? 1 - onde : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: x - taille / 2,
          top: y - taille / 2,
          width: taille,
          height: taille,
          borderRadius: '50%',
          background: 'rgba(18,23,28,0.28)',
          border: '2px solid rgba(255,255,255,0.9)',
          boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          opacity: doigt,
          transform: `scale(${echelle})`,
        }}
      />
    </>
  );
};

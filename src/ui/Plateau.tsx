import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Telephone } from './Telephone';
import { CENTRE_TEL, ECHELLE, TEL_X, TEL_Y, versVideo } from './Scene';

/**
 * Le téléphone et sa caméra. `zoom` se fait autour de `foyer` (points d'écran) ;
 * `rotation` (degrés) et `reduction` se font autour du centre du téléphone (passage en
 * paysage). `dessus` : calques posés au-dessus (doigt, badges), dans le repère vidéo.
 */
export const Plateau: React.FC<{
  zoom?: number;
  foyer?: { x: number; y: number };
  rotation?: number;
  reduction?: number;
  decalageY?: number;
  opacite?: number;
  avion?: number;
  barreEtat?: number;
  dessus?: React.ReactNode;
  children: React.ReactNode;
}> = ({
  zoom = 1,
  foyer = { x: 195, y: 422 },
  rotation = 0,
  reduction = 1,
  decalageY = 0,
  opacite = 1,
  avion = 0,
  barreEtat = 1,
  dessus,
  children,
}) => {
  const f = versVideo(foyer.x, foyer.y);
  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${decalageY}px) scale(${zoom})`,
        transformOrigin: `${f.x}px ${f.y}px`,
        opacity: opacite,
      }}
    >
      <AbsoluteFill
        style={{
          transform: `rotate(${rotation}deg) scale(${reduction})`,
          transformOrigin: `${CENTRE_TEL.x}px ${CENTRE_TEL.y}px`,
        }}
      >
        <Telephone x={TEL_X} y={TEL_Y} echelle={ECHELLE} avion={avion} barreEtat={barreEtat}>
          {children}
        </Telephone>
      </AbsoluteFill>
      {dessus}
    </AbsoluteFill>
  );
};

/** Point d'un écran paysage (points) → repère vidéo, téléphone tourné de 90° et réduit. */
export const paysageVersVideo = (x: number, y: number, reduction: number, decalageY = 0) => ({
  x: CENTRE_TEL.x + (x - 422) * ECHELLE * reduction,
  y: CENTRE_TEL.y + (y - 195) * ECHELLE * reduction + decalageY,
});

/** En paysage, le téléphone remonte vers le texte : il laisserait sinon un grand vide. */
export const MONTEE_PAYSAGE = -220;

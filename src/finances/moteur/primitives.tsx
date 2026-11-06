import React from 'react';
import { Easing, interpolate } from 'remotion';
import { F, PoliceF } from '../theme';

/** Progression 0 → 1 entre deux images, adoucie. */
export const p = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

export type PropsIllustration = { f: number; d: number[]; duree: number };

export const Scene: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg viewBox="0 0 800 900" width={800} height={900} style={{ overflow: 'visible' }}>
    {children}
  </svg>
);

export const Libelle: React.FC<{ x: number; y: number; taille?: number; ancre?: 'start' | 'middle' | 'end'; couleur?: string; graisse?: number; opacite?: number; children: React.ReactNode }> = ({
  x, y, taille = 26, ancre = 'middle', couleur = F.encre, graisse = 500, opacite = 1, children,
}) => (
  <text x={x} y={y} textAnchor={ancre} fontFamily={PoliceF.sans} fontSize={taille} fontWeight={graisse} fill={couleur} opacity={opacite}>
    {children}
  </text>
);

export const Piece: React.FC<{ x: number; y: number; r: number; opacite?: number }> = ({ x, y, r, opacite = 1 }) => (
  <g opacity={opacite}>
    <circle cx={x} cy={y} r={r} fill={F.or} stroke={F.orFonce} strokeWidth={Math.max(2, r * 0.08)} />
    <circle cx={x} cy={y} r={r * 0.72} fill={F.orClair} stroke={F.orFonce} strokeWidth={Math.max(1, r * 0.04)} />
  </g>
);

export const Coeur: React.FC<{ x: number; y: number; s: number; rempli?: string; contour?: string; opacite?: number }> = ({
  x, y, s, rempli = F.argile, contour = F.encre, opacite = 1,
}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 42 C-64 2 -54 -48 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C54 -48 64 2 0 42 Z"
    fill={rempli}
    stroke={contour}
    strokeWidth={3 / s}
    opacity={opacite}
  />
);

/** Thermomètre : le fil conducteur de la vidéo. `niveau` de 0 à 1. */
export const Thermometre: React.FC<{ x: number; y: number; h: number; l: number; niveau: number; graduations?: boolean }> = ({ x, y, h, l, niveau, graduations = true }) => {
  const rBulbe = l * 1.05;
  const yBulbe = y + h + rBulbe * 0.72;
  const interieur = l - 12;
  const hauteur = Math.max(0, Math.min(1, niveau)) * h;
  return (
    <g>
      <rect x={x - l / 2} y={y - l / 2} width={l} height={h + l} rx={l / 2} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <circle cx={x} cy={yBulbe} r={rBulbe} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={x - interieur / 2} y={y + h - hauteur} width={interieur} height={hauteur + l} fill={F.or} />
      <circle cx={x} cy={yBulbe} r={rBulbe - 7} fill={F.or} />
      {graduations
        ? Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={x + l / 2 + 8} x2={x + l / 2 + (i % 2 === 0 ? 34 : 22)} y1={y + (h / 8) * i} y2={y + (h / 8) * i} stroke={F.encre2} strokeWidth={3} />
          ))
        : null}
    </g>
  );
};

/** Ouverture : une pièce tombe dans le thermomètre, le niveau monte un peu. */
export const IlluOuverture: React.FC<PropsIllustration> = ({ f }) => {
  const chute = p(f, 20, 62);
  return (
    <Scene>
      <Thermometre x={400} y={170} h={520} l={72} niveau={0.08 + 0.14 * p(f, 58, 110)} />
      {chute < 1 ? <Piece x={400} y={-60 + chute * 240} r={46} /> : null}
    </Scene>
  );
};

/** Fin : le thermomètre est plein, un cœur le surmonte. */
export const IlluFin: React.FC<PropsIllustration> = ({ f }) => {
  const c = p(f, 55, 85);
  return (
    <Scene>
      <Thermometre x={400} y={210} h={480} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
      {c > 0 ? <Coeur x={400} y={90} s={1.25 * c} /> : null}
    </Scene>
  );
};


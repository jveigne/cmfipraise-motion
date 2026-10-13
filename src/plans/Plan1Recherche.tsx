import React from 'react';
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from 'remotion';
import { Couleurs, Polices } from '../theme';
import { Legende } from '../ui/Legende';

/** Plan 1 (0–4 s) : des pages de recueil défilent vite sous le doigt, on cherche. */
const NUMEROS = [12, 87, 143, 56, 201, 34, 178, 99, 265, 7, 150, 222, 61, 118];
const PERIODE = 7;
const FIN_FEUILLETAGE = NUMEROS.length * PERIODE;

export const Plan1Recherche: React.FC<{ lignes: string[]; duree: number }> = ({ lignes, duree }) => {
  const f = useCurrentFrame();
  const sortie = interpolate(f, [duree - 16, duree], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          opacity: sortie,
          transform: `scale(${interpolate(sortie, [0, 1], [0.92, 1])})`,
        }}
      >
        {NUMEROS.map((n, k) => {
          // u ∈ [0,1] : la page entre par la droite ; u ∈ [1,2] : elle sort par la gauche.
          // La dernière page reste posée.
          const u = (f - k * PERIODE) / PERIODE;
          const derniere = k === NUMEROS.length - 1;
          if (u < 0 || (u > 2 && !derniere)) return null;
          const entree = Easing.out(Easing.cubic)(Math.min(1, u));
          const sortiePage = derniere ? 0 : Easing.in(Easing.cubic)(Math.max(0, Math.min(1, u - 1)));
          const x = (1 - entree) * 760 - sortiePage * 760;
          const rot = (1 - entree) * 7 - sortiePage * 7;
          const enMouvement = (u < 1 ? 1 - entree : sortiePage) > 0.02;
          return <Page key={k} numero={n} x={x} rot={rot} flou={enMouvement ? 5 : 0} graine={k} />;
        })}
        <Doigt f={f} />
      </AbsoluteFill>
      <Legende lignes={lignes} duree={duree} debut={8} />
    </AbsoluteFill>
  );
};

const Page: React.FC<{ numero: number; x: number; rot: number; flou: number; graine: number }> = ({
  numero,
  x,
  rot,
  flou,
  graine,
}) => {
  const largeurs = [0.92, 0.78, 0.86, 0.64, 0, 0.9, 0.72, 0.84, 0.58, 0, 0.88, 0.76];
  return (
    <div
      style={{
        position: 'absolute',
        left: 230,
        top: 620,
        width: 620,
        height: 900,
        borderRadius: 28,
        background: Couleurs.surface,
        boxShadow: '0 30px 70px rgba(18,23,28,0.14)',
        padding: '64px 60px',
        transform: `translateX(${x}px) rotate(${rot}deg)`,
        filter: flou ? `blur(${flou}px)` : undefined,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontFamily: Polices.serif, fontWeight: 600, fontSize: 64, color: Couleurs.bleuCmfi }}>
        N° {numero}
      </div>
      <div
        style={{
          height: 30,
          width: `${55 + (graine * 13) % 30}%`,
          borderRadius: 8,
          background: '#C9D1D8',
          margin: '26px 0 54px',
        }}
      />
      {largeurs.map((l, i) => {
        const w = l === 0 ? 0 : Math.min(1, l - ((graine * 7 + i * 5) % 12) / 100);
        return (
          <div
            key={i}
            style={{
              height: 18,
              width: `${w * 100}%`,
              borderRadius: 6,
              background: '#E4E9ED',
              marginBottom: l === 0 ? 26 : 22,
            }}
          />
        );
      })}
    </div>
  );
};

/** Le doigt balaie de droite à gauche à chaque page tournée. */
const Doigt: React.FC<{ f: number }> = ({ f }) => {
  if (f >= FIN_FEUILLETAGE - PERIODE) return null;
  const u = (f % PERIODE) / PERIODE;
  return (
    <div
      style={{
        position: 'absolute',
        left: interpolate(u, [0, 1], [820, 330]) - 30,
        top: 1240 - Math.sin(u * Math.PI) * 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        background: 'rgba(18,23,28,0.25)',
        border: '3px solid rgba(255,255,255,0.9)',
        opacity: interpolate(u, [0, 0.15, 0.8, 1], [0, 0.9, 0.9, 0]),
      }}
    />
  );
};

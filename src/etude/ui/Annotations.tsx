import React from 'react';
import { IoCheckmarkCircle, IoEllipseOutline, IoHomeOutline, IoLockClosed, IoLockOpen } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { useEtude } from '../langue';

/**
 * Annotations vidéo posées à droite d'un téléphone décalé (storyboard § 7.4) : la frise des
 * dimanches (P17) et l'enveloppe au cadenas (P18). Pixels vidéo.
 */

/**
 * Frise verticale : un dimanche par leçon faite (icône de salon ; le jour en JetBrains Mono 24 px,
 * la leçon en Fraunces 32 px dessous ; livret coché), puis les deux leçons à venir en pointillé.
 * `allumes(i)` : apparition de la ligne `i` (0 → 1).
 */
export const Frise: React.FC<{ x: number; y: number; allumes: (i: number) => number; opacite?: number }> = ({ x, y, allumes, opacite = 1 }) => {
  const { cartons } = useEtude();
  return (
  <div style={{ position: 'absolute', left: x, top: y, opacity: opacite }}>
    {/* Le fil de la frise. */}
    <div style={{ position: 'absolute', left: 27, top: 30, width: 4, height: 4 * 120, borderRadius: 2, background: S.hairStrong }} />
    {cartons.frise.map((e, i) => {
      const p = allumes(i);
      const fait = e.jour != null;
      return (
        <div
          key={e.lecon}
          style={{
            position: 'absolute',
            left: 0,
            top: i * 120,
            display: 'flex',
            alignItems: 'center',
            gap: 22,
            opacity: fait ? 0.25 + 0.75 * p : 0.6 * p,
            transform: `translateX(${(1 - p) * 30}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              boxSizing: 'border-box',
              background: fait ? S.paper : 'transparent',
              border: fait ? `3px solid ${S.moss}` : `3px dashed ${S.ink3}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: fait ? '0 8px 18px rgba(42,38,32,0.12)' : undefined,
            }}
          >
            {fait ? <IoHomeOutline size={28} color={S.moss} /> : null}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fait ? <div style={{ fontFamily: P.mono, fontWeight: 500, fontSize: 24, lineHeight: '28px', color: S.earthDeep, letterSpacing: 1 }}>{e.jour}</div> : null}
            <div style={{ fontFamily: P.serif, fontWeight: 500, fontSize: 32, lineHeight: '38px', color: fait ? S.ink : S.ink3 }}>{e.lecon}</div>
          </div>
          {fait ? (
            <IoCheckmarkCircle size={34} color={S.moss} style={{ opacity: p }} />
          ) : (
            <IoEllipseOutline size={34} color={S.ink3} />
          )}
        </div>
      );
    })}
  </div>
  );
};

/**
 * Enveloppe fermée, cadenas argile (D-ETU-09, à faire confirmer par le pasteur) : « Réponses de
 * Marie » / « Marie et son dirigeant seulement ». `cadenas` : 0 ouvert → 1 fermé.
 */
export const Enveloppe: React.FC<{ x: number; y: number; p: number; cadenas: number }> = ({ x, y, p, cadenas }) => {
  const { cartons } = useEtude();
  if (p <= 0.001) return null;
  const L = 380;
  const H = 250;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: L, opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 40}px) scale(${0.9 + 0.1 * p})` }}>
      <div style={{ position: 'relative', width: L, height: H }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 18, background: S.paper, border: `3px solid ${S.parchmentDeep}`, boxShadow: '0 24px 50px rgba(42,38,32,0.18)' }} />
        <svg width={L} height={H} style={{ position: 'absolute', left: 0, top: 0 }}>
          <path d={`M 10 14 L ${L / 2} ${H * 0.58} L ${L - 10} 14`} fill="none" stroke={S.parchmentDeep} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M 10 ${H - 12} L ${L * 0.38} ${H * 0.5}`} stroke={S.parchmentDeep} strokeWidth={4} />
          <path d={`M ${L - 10} ${H - 12} L ${L * 0.62} ${H * 0.5}`} stroke={S.parchmentDeep} strokeWidth={4} />
        </svg>
        <div
          style={{
            position: 'absolute',
            left: L / 2 - 46,
            top: H * 0.58 - 46,
            width: 92,
            height: 92,
            borderRadius: 46,
            background: S.clay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 24px rgba(184,106,74,0.35)',
            transform: `scale(${1 + 0.12 * Math.sin(Math.min(1, cadenas) * Math.PI)})`,
          }}
        >
          {cadenas >= 0.5 ? <IoLockClosed size={50} color={S.white} /> : <IoLockOpen size={50} color={S.white} />}
        </div>
      </div>
      <div style={{ marginTop: 26, textAlign: 'center', fontFamily: P.serif, fontWeight: 600, fontSize: 38, lineHeight: 1.15, color: S.ink }}>{cartons.enveloppe[0]}</div>
      <div style={{ marginTop: 10, textAlign: 'center', fontFamily: P.sans, fontWeight: 600, fontSize: 26, lineHeight: 1.3, color: S.clay }}>{cartons.enveloppe[1]}</div>
    </div>
  );
};

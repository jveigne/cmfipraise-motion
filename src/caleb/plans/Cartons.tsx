import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { CARTONS } from '../textes';

/**
 * Cartons sans téléphone : P1, le verset d'ouverture (Josué 14 : 12, Louis Segond 1910) ; P2, le
 * titre « Offre Caleb — Le suivi de ma hiérarchie » ; P10, la fin « Disponible sur l'espace web
 * Shephr » (plan 27/10 § 9, V3). Gabarits des cartons d'« Étude » et de « Journal ».
 */
export const DUREE_P1 = 165;
export const DUREE_P2 = 150;
/** P10 : la musique s'éteint sur les 2,5 dernières secondes (`FONDU_FINAL`, Video.tsx). */
export const DUREE_P10 = 165;

const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

/** La montagne, au trait (illustration) : deux sommets, le second enneigé ; le trait se dessine. */
const Montagne: React.FC<{ trace: number; fond: number }> = ({ trace, fond }) => {
  const LONGUEUR = 2600;
  const arriere = 'M 60 520 L 300 250 L 420 360 L 560 140 L 760 400 L 900 300 L 1020 520 Z';
  const avant = 'M 0 520 L 220 330 L 360 430 L 520 260 L 700 470 L 820 400 L 1080 520 Z';
  const neige = 'M 518 152 L 560 140 L 610 205 L 585 196 L 565 222 L 540 192 L 515 210 L 532 170 Z';
  const trait = { fill: 'none', strokeWidth: 5, strokeLinejoin: 'round' as const, strokeDasharray: LONGUEUR, strokeDashoffset: LONGUEUR * (1 - trace) };
  return (
    <svg width={1080} height={540} viewBox="0 0 1080 540" style={{ position: 'absolute', left: 0, top: 1180 }}>
      <path d={arriere} fill={S.parchmentDeep} opacity={fond} />
      <path d={avant} fill={S.sauge} opacity={0.35 * fond} />
      <path d={neige} fill={S.paper2} opacity={fond} />
      <path d={arriere} stroke={S.mossSoft} {...trait} />
      <path d={avant} stroke={S.moss} {...trait} />
    </svg>
  );
};

/** P1 — « Donne-moi donc cette montagne » (Josué 14 : 12, Louis Segond 1910). */
export const P1Verset: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [l1, l2] = CARTONS.verset;
  const sortie = doux(f, [150, 165], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateY(${-sortie * 50}px)` }}>
      <Montagne trace={doux(f, [0, 70], [0, 1])} fond={doux(f, [50, 80], [0, 1])} />
      <div style={{ position: 'absolute', top: 540, left: 40, right: 40, textAlign: 'center' }}>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 96, lineHeight: 1.15, letterSpacing: -2, color: S.ink }}>
          <div style={glisse(f, fps, 14)}>{l1}</div>
          <div style={glisse(f, fps, 26)}>{l2}</div>
        </div>
        <div style={{ marginTop: 50, fontFamily: P.serif, fontWeight: 500, fontSize: 48, color: S.clay, ...glisse(f, fps, 48) }}>{CARTONS.reference}</div>
        <div style={{ marginTop: 14, fontFamily: P.sans, fontWeight: 500, fontSize: 30, letterSpacing: 1, color: S.ink3, ...glisse(f, fps, 56) }}>{CARTONS.traduction}</div>
      </div>
    </AbsoluteFill>
  );
};

/** P2 — « Offre Caleb », « Le suivi de ma hiérarchie », pour qui. */
export const P2Titre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [offre, nom] = CARTONS.offre;
  const [q1, q2, mot, point] = CARTONS.pourQui;
  const sortie = doux(f, [138, 150], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60, opacity: 1 - sortie, transform: `translateY(${-sortie * 60}px)` }}>
      <TuileLogo taille={200} echelle={spring({ frame: f - 2, fps, config: { damping: 14 } })} />
      <div style={{ marginTop: 70, fontFamily: P.serif, fontWeight: 600, fontSize: 130, lineHeight: 1.05, letterSpacing: -3, color: S.ink, ...glisse(f, fps, 12) }}>
        {offre}
        <span style={{ color: S.clay }}>{nom}</span>
      </div>
      <div style={{ marginTop: 22, fontFamily: P.sans, fontWeight: 500, fontSize: 50, color: S.ink2, ...glisse(f, fps, 24) }}>{CARTONS.sousTitre}</div>
      <div style={{ marginTop: 70, width: 120, height: 4, borderRadius: 2, background: S.earth, ...glisse(f, fps, 40) }} />
      <div style={{ marginTop: 60, textAlign: 'center', fontFamily: P.serif, fontWeight: 500, fontSize: 56, lineHeight: 1.25, color: S.ink, padding: '0 50px' }}>
        <div style={glisse(f, fps, 50)}>{q1}</div>
        <div style={glisse(f, fps, 60)}>
          {q2}
          <span style={{ color: S.clay }}>{mot}</span>
          {point}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** P10 — « Offre Caleb » / « Disponible sur l'espace web Shephr », l'icône et le logotype. */
export const P10Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [l1, debut, mot] = CARTONS.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 64, letterSpacing: -1.5, color: S.ink2, ...glisse(f, fps, 4) }}>{CARTONS.finOffre}</div>
      <div style={{ marginTop: 30, fontFamily: P.serif, fontWeight: 600, fontSize: 92, letterSpacing: -2, color: S.ink, textAlign: 'center', lineHeight: 1.15, padding: '0 40px' }}>
        <div style={glisse(f, fps, 14)}>{l1}</div>
        <div style={glisse(f, fps, 24)}>
          {debut}
          <span style={{ color: S.clay }}>{mot}</span>
        </div>
      </div>
      <div style={{ marginTop: 100 }}>
        <TuileLogo taille={200} echelle={spring({ frame: f - 40, fps, config: { damping: 14 } })} />
      </div>
      <Logotype taille={60} style={{ marginTop: 36, ...glisse(f, fps, 52) }} />
    </AbsoluteFill>
  );
};

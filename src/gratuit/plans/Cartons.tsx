import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { CARTONS } from '../textes';

/**
 * Cartons sans téléphone (gabarits de la fin d'« Évènements » et d'« Étude ») : P1, l'ouverture
 * « Ce qui est et restera gratuit » ; P10, la fin « Tout cela est et restera gratuit. ».
 */

/** P1 : 4,5 s — l'icône, la phrase (tenue ≈ 3 s), le sous-titre ; elle s'efface sur l'intertitre « 1 ». */
export const DUREE_P1 = 135;
/** P10 : 5,5 s — la musique s'éteint sur les 2,5 dernières secondes. */
export const DUREE_P10 = 165;

const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

export const P1Ouverture: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const o = CARTONS.ouverture;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
      <TuileLogo taille={190} echelle={spring({ frame: f - 4, fps, config: { damping: 14 } })} />
      <div
        style={{
          marginTop: 90,
          fontFamily: P.serif,
          fontWeight: 600,
          fontSize: 104,
          lineHeight: 1.1,
          letterSpacing: -2.5,
          color: S.ink,
          textAlign: 'center',
        }}
      >
        <div style={glisse(f, fps, 16)}>{o.l1}</div>
        <div style={glisse(f, fps, 26)}>
          {o.debut}
          <span style={{ color: S.clay }}>{o.mot}</span>
          {o.fin}
        </div>
      </div>
      <div
        style={{
          marginTop: 50,
          padding: '0 90px',
          fontFamily: P.serif,
          fontStyle: 'italic',
          fontSize: 44,
          lineHeight: 1.3,
          color: S.ink2,
          textAlign: 'center',
          ...glisse(f, fps, 44),
        }}
      >
        {CARTONS.ouvertureSous}
      </div>
    </AbsoluteFill>
  );
};

export const P10Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = CARTONS.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 96, letterSpacing: -2, color: S.ink, textAlign: 'center', lineHeight: 1.15, padding: '0 40px' }}>
        <div style={glisse(f, fps, 8)}>{t.l1}</div>
        <div style={glisse(f, fps, 18)}>
          {t.debut}
          <span style={{ color: S.clay }}>{t.mot}</span>
          {t.fin}
        </div>
      </div>
      <div style={{ marginTop: 110 }}>
        <TuileLogo taille={220} echelle={spring({ frame: f - 36, fps, config: { damping: 14 } })} />
      </div>
      <Logotype taille={64} style={{ marginTop: 40, ...glisse(f, fps, 48) }} />
    </AbsoluteFill>
  );
};

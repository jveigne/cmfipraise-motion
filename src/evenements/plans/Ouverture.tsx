import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CARTONS } from '../textes';
import { P, S } from '../theme';
import { Logotype, TuileLogo } from '../ui/Habillage';

/**
 * P0 (2,5 s) : icône Shephr, logotype, « Évènements », « Comment ça marche ? ». Retour JP 14/10 :
 * les entrées gardent leur vitesse, le carton complet est tenu ≈ 0,8 s de plus (≈ 1,1 s avec le
 * gel sous l'intertitre).
 */
export const DUREE_P0 = 75;

/**
 * P18 (fin, 4,3 s) : « Chaque action compte. » puis l'icône et le logotype, posés ≈ 2 s jusqu'à
 * la dernière image (la musique s'éteint sur les 2,5 dernières secondes, `FONDU_FINAL` de Video.tsx).
 */
export const DUREE_P18 = 130;

const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

export const P0Ouverture: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 80 }}>
      <TuileLogo taille={240} echelle={spring({ frame: f - 4, fps, config: { damping: 14 } })} />
      <Logotype taille={64} style={{ marginTop: 40, ...glisse(f, fps, 12) }} />
      <div style={{ marginTop: 70, fontFamily: P.serif, fontWeight: 600, fontSize: 120, letterSpacing: -2.5, color: S.ink, ...glisse(f, fps, 18) }}>
        {CARTONS.titre}
      </div>
      <div style={{ marginTop: 14, fontFamily: P.sans, fontWeight: 500, fontSize: 44, color: S.ink2, ...glisse(f, fps, 28) }}>
        {CARTONS.sousTitre}
      </div>
    </AbsoluteFill>
  );
};

export const P18Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [avant, mot, point] = CARTONS.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 104, letterSpacing: -2.5, color: S.ink, textAlign: 'center', lineHeight: 1.1, ...glisse(f, fps, 8) }}>
        {avant}
        <span style={{ color: S.clay }}>{mot}</span>
        {point}
      </div>
      <div style={{ marginTop: 110 }}>
        <TuileLogo taille={220} echelle={spring({ frame: f - 30, fps, config: { damping: 14 } })} />
      </div>
      <Logotype taille={64} style={{ marginTop: 40, ...glisse(f, fps, 42) }} />
    </AbsoluteFill>
  );
};

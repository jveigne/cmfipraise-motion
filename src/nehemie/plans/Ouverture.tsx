import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { CARTONS } from '../textes';
import { Muraille, glisse } from '../ui/Decor';

/**
 * Ouverture : P1, le verset « Levons-nous, et bâtissons ! » (Néhémie 2 : 18, Louis Segond 1910)
 * pendant que la muraille se bâtit pierre à pierre ; P2, le nom de l'offre au-dessus de la muraille
 * achevée. Musique très douce (0–10 s du fichier).
 */
export const DUREE_P1 = 195;
export const DUREE_P2 = 135;

/** Muraille du bas : quatre rangées posées de i 24 à i 144 de P1, tenue achevée en P2. */
const DEBUT_MUR = 24;
const DUREE_MUR = 120;

export const P1Verset: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [l1, debut, mot, fin] = CARTONS.verset;
  const sortie = doux(f, [180, 195], [0, 1]);
  return (
    <AbsoluteFill>
      <Muraille debut={DEBUT_MUR} duree={DUREE_MUR} />
      <div style={{ position: 'absolute', top: 470, left: 40, right: 40, textAlign: 'center', opacity: 1 - sortie }}>
        <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 116, lineHeight: 1.1, letterSpacing: -2.5, color: S.ink }}>
          <div style={glisse(f, fps, 12)}>{l1}</div>
          <div style={glisse(f, fps, 26)}>
            {debut}
            <span style={{ color: S.clay }}>{mot}</span>
            {fin}
          </div>
        </div>
        <div style={{ marginTop: 56, fontFamily: P.serif, fontStyle: 'italic', fontSize: 54, color: S.ink2, ...glisse(f, fps, 56) }}>{CARTONS.reference}</div>
        <div style={{ marginTop: 14, fontFamily: P.mono, fontSize: 28, letterSpacing: 3, color: S.ink3, ...glisse(f, fps, 66) }}>{CARTONS.version.toUpperCase()}</div>
      </div>
    </AbsoluteFill>
  );
};

export const P2Offre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [offre, nom] = CARTONS.offre;
  const sortie = doux(f, [120, 135], [0, 1]);
  const trait = doux(f, [18, 34], [0, 1]);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', inset: 0, opacity: 1 - sortie, transform: `translateY(${sortie * 220}px)` }}>
        <Muraille debut={-1000} duree={DUREE_MUR} />
      </div>
      <div style={{ position: 'absolute', top: 560, left: 40, right: 40, textAlign: 'center', opacity: 1 - sortie }}>
        <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 132, letterSpacing: -3, color: S.ink, lineHeight: 1.05, ...glisse(f, fps, 6) }}>
          {offre}
          <span style={{ color: S.clay }}>{nom}</span>
        </div>
        <div style={{ margin: '44px auto 0', width: 260 * trait, height: 4, borderRadius: 2, background: S.earth }} />
        <div style={{ marginTop: 40, fontFamily: P.serif, fontStyle: 'italic', fontSize: 64, color: S.ink2, ...glisse(f, fps, 24) }}>{CARTONS.sousTitre}</div>
      </div>
    </AbsoluteFill>
  );
};

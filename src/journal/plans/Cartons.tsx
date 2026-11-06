import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { P, S } from '../../evenements/theme';
import { Logotype, TuileLogo } from '../../evenements/ui/Habillage';
import { useJournal } from '../langue';

/**
 * Cartons sans téléphone (gabarits de `P0Ouverture` / `P18Fin` d'« Évènements ») :
 * P6, la bascule « problème → l'app », qui s'ouvre sur la montée du chant (24,0 s du fichier) ;
 * P18, la fin.
 */
export const DUREE_BASCULE = 105;
/** P18 : phrase, tuile et logotype posés ≈ 2 s ; la musique s'éteint sur les 2,5 dernières secondes. */
export const DUREE_FIN = 120;

const glisse = (f: number, fps: number, a: number) => {
  const p = spring({ frame: f - a, fps, config: { damping: 200 } });
  return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
};

/** P6 — « Le journal de l'assemblée » / « Tenu dans l'app, d'année en année. » (EN : « The assembly journal »). */
export const BasculeTitre: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons } = useJournal();
  const [l1, de, mot] = cartons.titre;
  // Le carton s'efface (i 95 → 105) pendant que le téléphone de P7 monte.
  const sortie = doux(f, [93, 105], [0, 1]);
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 80, opacity: 1 - sortie, transform: `translateY(${-sortie * 60}px)` }}>
      <TuileLogo taille={220} echelle={spring({ frame: f - 4, fps, config: { damping: 14 } })} />
      <Logotype taille={60} style={{ marginTop: 36, ...glisse(f, fps, 14) }} />
      <div style={{ marginTop: 70, textAlign: 'center', fontFamily: P.serif, fontWeight: 600, fontSize: 110, lineHeight: 1.08, letterSpacing: -2.5, color: S.ink, ...glisse(f, fps, 22) }}>
        {l1}
        <br />
        {de}
        <span style={{ color: S.clay }}>{mot}</span>
      </div>
      <div style={{ marginTop: 30, fontFamily: P.sans, fontWeight: 500, fontSize: 44, color: S.ink2, ...glisse(f, fps, 34) }}>{cartons.sousTitre}</div>
    </AbsoluteFill>
  );
};

/** P18 — « Votre histoire, préservée. » (EN : « Your story, safely kept. ») puis l'icône et le logotype. */
export const Fin: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons } = useJournal();
  const [l1, mot, point] = cartons.fin;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 60 }}>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 104, letterSpacing: -2.5, color: S.ink, textAlign: 'center', lineHeight: 1.1, ...glisse(f, fps, 8) }}>
        {l1}
        <br />
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

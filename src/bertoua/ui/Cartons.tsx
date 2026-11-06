import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoSchoolOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { TuileEtude } from '../../etude/ecrans/Accueil';
import { CARTONS } from '../textes';

/**
 * Cartons plein cadre de la vidéo « Le Message de Bertoua en détail » :
 * - `IntertitreBertoua` : l'intertitre de 2,5 s d'« Étude » (`src/etude/ui/Intertitre.tsx`, même
 *   dessin, mêmes temps) pour les six parties de cette vidéo — celui d'« Étude » ne connaît que ses
 *   quatre parties ;
 * - `CartonGratuit` : l'intertitre final « Gratuit — pour toutes les assemblées. » (règle D-ETU-50),
 *   même mécanique, un peu plus long ;
 * - `CartonTitre` : l'ouverture (la tuile de l'accueil, le titre, une phrase).
 */
export const DUREE_INTERTITRE = 75;
export const DUREE_GRATUIT = 105;

export type PartieBertoua = keyof typeof CARTONS.intertitres;

const useAplat = (duree: number) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entree = interpolate(f, [0, 10], [1920, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sortie = interpolate(f, [duree - 10, duree], [0, -1920], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.cubic) });
  const texte = (a: number) => {
    const p = spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: 12 });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };
  return { decalage: entree + sortie, texte };
};

export const IntertitreBertoua: React.FC<{ partie: PartieBertoua; couleur: string }> = ({ partie, couleur }) => {
  const { decalage, texte } = useAplat(DUREE_INTERTITRE);
  const t = CARTONS.intertitres[partie];
  return (
    <AbsoluteFill style={{ transform: `translateY(${decalage}px)`, background: couleur }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 60px 60px' }}>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 300, lineHeight: 1, color: 'rgba(201,149,107,0.6)', ...texte(6) }}>{t.numero}</div>
        <div
          style={{
            fontFamily: P.serif,
            fontWeight: 600,
            fontSize: t.titre.length > 12 ? 92 : 110,
            lineHeight: 1.05,
            letterSpacing: -2,
            color: S.white,
            marginTop: 10,
            textAlign: 'center',
            ...texte(9),
          }}
        >
          {t.titre}
        </div>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 46, lineHeight: 1.25, color: S.parchment, marginTop: 34, textAlign: 'center', ...texte(14) }}>
          {t.phrase}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Intertitre final : « Gratuit » / « pour toutes les assemblées. », sur la mousse de l'app. */
export const CartonGratuit: React.FC = () => {
  const { decalage, texte } = useAplat(DUREE_GRATUIT);
  const { titre, phrase } = CARTONS.gratuit;
  return (
    <AbsoluteFill style={{ transform: `translateY(${decalage}px)`, background: S.moss }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 60px 80px' }}>
        <div
          style={{
            width: 180,
            height: 180,
            borderRadius: 48,
            background: 'rgba(242,233,210,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...texte(6),
          }}
        >
          <IoSchoolOutline size={96} color={S.earth} />
        </div>
        <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 168, lineHeight: 1.05, letterSpacing: -4, color: S.white, marginTop: 60, ...texte(10) }}>{titre}</div>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 70, lineHeight: 1.2, color: S.parchment, marginTop: 30, textAlign: 'center', ...texte(16) }}>
          {phrase[0]}
          <br />
          {phrase[1]}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Ouverture : la tuile « Le Message de Bertoua » en grand, le titre, une phrase (O1). */
export const CartonTitre: React.FC<{ duree: number }> = ({ duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glisse = (a: number) => {
    const p = spring({ frame: f - a, fps, config: { damping: 200 } });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };
  const tuile = spring({ frame: f - 6, fps, config: { damping: 13 } });
  const sortie = interpolate(f, [duree - 12, duree], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const { surtitre, titre, phrase } = CARTONS.titre;
  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', opacity: 1 - sortie, paddingBottom: 80 }}>
      <div style={{ transform: `scale(${2.3 * tuile})`, fontFamily: P.sans, color: S.ink, filter: 'drop-shadow(0 10px 18px rgba(42,38,32,0.16))', marginBottom: 190 }}>
        <TuileEtude />
      </div>
      <div style={{ fontFamily: P.mono, fontWeight: 500, fontSize: 30, letterSpacing: 4, color: S.clay, ...glisse(22) }}>{surtitre}</div>
      <div style={{ fontFamily: P.serif, fontWeight: 600, fontSize: 118, lineHeight: 1.05, letterSpacing: -3, color: S.ink, textAlign: 'center', marginTop: 24, ...glisse(28) }}>
        {titre[0]}
        <br />
        <span style={{ color: S.clay }}>{titre[1]}</span>
      </div>
      <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontSize: 50, lineHeight: 1.25, color: S.ink2, marginTop: 40, textAlign: 'center', padding: '0 80px', ...glisse(40) }}>
        {phrase}
      </div>
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { P, S } from '../../evenements/theme';
import { useEtude } from '../langue';

/**
 * Intertitre plein cadre de 2,5 s avant les parties 2 à 5 (gabarit de l'`Intertitre` d'« Évènements »,
 * retour JP du 21/10 : « plus lent, pour bien expliquer ») : l'aplat de la couleur de la partie monte
 * du bas (i 0 → 10), le numéro, le titre et une phrase d'explication arrivent (i 6 → 22), puis
 * l'aplat repart vers le haut en découvrant le plan suivant (i 65 → 75).
 */
export const DUREE_INTERTITRE = 75;

export type PartieIntertitre = 'repondre' | 'corriger' | 'terminer' | 'aufil';

export const Intertitre: React.FC<{ partie: PartieIntertitre; couleur: string }> = ({ partie, couleur }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons } = useEtude();
  const t = cartons.intertitres[partie];
  const entree = interpolate(f, [0, 10], [1920, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const sortie = interpolate(f, [DUREE_INTERTITRE - 10, DUREE_INTERTITRE], [0, -1920], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  });
  const texte = (a: number) => {
    const p = spring({ frame: f - a, fps, config: { damping: 200 }, durationInFrames: 12 });
    return { opacity: p, transform: `translateY(${(1 - p) * 40}px)` };
  };
  return (
    <AbsoluteFill style={{ transform: `translateY(${entree + sortie}px)`, background: couleur }}>
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: '0 60px 60px' }}>
        <div style={{ fontFamily: P.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 300, lineHeight: 1, color: 'rgba(201,149,107,0.6)', ...texte(6) }}>
          {t.numero}
        </div>
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

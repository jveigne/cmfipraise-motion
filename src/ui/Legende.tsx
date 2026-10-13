import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { Couleurs, Polices } from '../theme';

/**
 * Carton de texte en haut de l'image. Chaque ligne monte en fondu, l'une après l'autre ;
 * l'ensemble s'efface sur les `sortie` dernières images de `duree`.
 * Dans une ligne, `*mot*` est mis en avant en bleu CMFI. `delais` : image d'apparition de
 * chaque ligne (par défaut, 6 images d'écart) — la seconde ligne d'un carton « question /
 * réponse » arrive ainsi après un temps de lecture.
 */
export const Legende: React.FC<{
  lignes: string[];
  duree: number;
  debut?: number;
  sortie?: number;
  taille?: number;
  delais?: number[];
}> = ({ lignes, duree, debut = 0, sortie = 10, taille = 92, delais }) => {
  const frame = useCurrentFrame() - debut;
  const { fps } = useVideoConfig();

  const opaciteSortie = interpolate(frame, [duree - sortie, duree], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 130,
        left: 60,
        right: 60,
        textAlign: 'center',
        opacity: opaciteSortie,
      }}
    >
      {lignes.map((ligne, i) => {
        const p = spring({ frame: frame - (delais?.[i] ?? i * 6), fps, config: { damping: 200 } });
        return (
          <div
            key={i}
            style={{
              fontFamily: Polices.serif,
              fontWeight: 600,
              fontSize: taille,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              color: Couleurs.encre,
              opacity: p,
              transform: `translateY(${interpolate(p, [0, 1], [40, 0], {
                easing: Easing.out(Easing.quad),
              })}px)`,
            }}
          >
            {ligne.split(/(\*[^*]+\*)/).map((morceau, j) =>
              morceau.startsWith('*') ? (
                <span key={j} style={{ color: Couleurs.bleuCmfi }}>
                  {morceau.slice(1, -1)}
                </span>
              ) : (
                <span key={j}>{morceau}</span>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
};

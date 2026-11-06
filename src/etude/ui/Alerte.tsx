import React from 'react';
import { P, S } from '../../evenements/theme';
import { useEtude } from '../langue';

/**
 * Alerte de confirmation (`confirmDialog` de utils/dialogs.ts → `Alert.alert` natif sur iOS),
 * redessinée sobrement (storyboard § 7.4) : titre, message, « Annuler » (style `cancel`, en gras) à
 * gauche, le bouton de confirmation à droite. Posée dans le repère de l'écran (390 × 844 points),
 * centrée ; `p` (0 → 1) : apparition (voile, léger zoom arrière), `appui` : bouton enfoncé.
 * `empile` : comme iOS quand un libellé ne tient pas sur une demi-largeur (« Passer à la
 * correction »), les boutons s'empilent : la confirmation en haut, « Annuler » en bas.
 */

const LARGEUR = 270;
const LIGNE_MESSAGE = 18;

/** Hauteur et haut de l'alerte pour un message de `lignes` lignes. */
const geometrie = (lignes: number, empile = false) => {
  const hauteur = 20 + 22 + 4 + LIGNE_MESSAGE * lignes + 20 + (empile ? 2 * 45 : 45);
  return { hauteur, haut: 422 - hauteur / 2, gauche: (390 - LARGEUR) / 2 };
};

/** Centres des deux boutons (points d'écran) : appuis du doigt. */
export const boutonsAlerte = (lignes: number, empile = false) => {
  const g = geometrie(lignes, empile);
  const bas = g.haut + g.hauteur - 22;
  return empile
    ? { annuler: { x: 195, y: bas }, confirmer: { x: 195, y: bas - 45 } }
    : { annuler: { x: g.gauche + LARGEUR / 4, y: bas }, confirmer: { x: g.gauche + (3 * LARGEUR) / 4, y: bas } };
};

export const Alerte: React.FC<{
  titre: string;
  message: string;
  confirmer: string;
  lignes?: number;
  empile?: boolean;
  p: number;
  /** Bouton de confirmation enfoncé (0 → 1). */
  appui?: number;
}> = ({ titre, message, confirmer, lignes = 3, empile = false, p, appui = 0 }) => {
  const { app } = useEtude();
  if (p <= 0.001) return null;
  const g = geometrie(lignes, empile);
  return (
    <div style={{ position: 'absolute', inset: 0, background: `rgba(22,41,31,${0.32 * p})` }}>
      <div
        style={{
          position: 'absolute',
          left: g.gauche,
          top: g.haut,
          width: LARGEUR,
          height: g.hauteur,
          borderRadius: 14,
          background: 'rgba(245,236,216,0.97)',
          boxShadow: '0 20px 40px rgba(22,41,31,0.22)',
          opacity: Math.min(1, p * 1.6),
          transform: `scale(${1.12 - 0.12 * p})`,
          overflow: 'hidden',
          fontFamily: P.sans,
          textAlign: 'center',
          color: S.ink,
        }}
      >
        <div style={{ padding: '20px 16px 20px' }}>
          <div style={{ fontSize: 17, fontWeight: 600, lineHeight: '22px' }}>{titre}</div>
          <div style={{ marginTop: 4, fontSize: 13, lineHeight: `${LIGNE_MESSAGE}px`, color: S.ink2, height: LIGNE_MESSAGE * lignes }}>{message}</div>
        </div>
        <div style={{ height: 1, background: S.hairStrong }} />
        <div style={{ display: 'flex', flexDirection: empile ? 'column-reverse' : 'row', height: empile ? 89 : 44 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 600, color: S.moss }}>
            {app.common.cancel}
          </div>
          <div style={empile ? { height: 1, background: S.hairStrong } : { width: 1, background: S.hairStrong }} />
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              color: S.moss,
              background: `rgba(42,38,32,${0.08 * appui})`,
            }}
          >
            {confirmer}
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ECRAN } from '../../ui/Telephone';
import { S } from '../theme';

/** Haut de la feuille modale iOS (`presentation: 'modal'`), en points. */
export const HAUT_FEUILLE = 64;

/**
 * Modale iOS qui monte du bas (`events/declare`, `events/plan` : `presentation: 'modal'`,
 * `slide_from_bottom`). `p` = 0 → seul `dessous` ; 1 → la feuille est en place, l'écran du
 * dessous recule légèrement et s'assombrit, comme sur iPhone.
 */
export const Feuille: React.FC<{ p: number; dessous: React.ReactNode; children: React.ReactNode }> = ({
  p,
  dessous,
  children,
}) => {
  if (p > 0.995) p = 1;
  if (p < 0.005) p = 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${p * 12}px) scale(${1 - 0.07 * p})`,
          transformOrigin: '50% 0',
          borderRadius: 12 * p,
          overflow: 'hidden',
        }}
      >
        {dessous}
        <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.25 * p})` }} />
      </div>
      {p > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: HAUT_FEUILLE,
            height: ECRAN.hauteur - HAUT_FEUILLE,
            transform: `translateY(${(1 - p) * (ECRAN.hauteur - HAUT_FEUILLE + 20)}px)`,
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'hidden',
            background: S.parchment,
            boxShadow: '0 -6px 24px rgba(0,0,0,0.18)',
          }}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
};

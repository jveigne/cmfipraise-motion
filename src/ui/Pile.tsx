import React from 'react';
import { ECRAN } from './Telephone';

/**
 * Navigation iOS entre deux écrans : `p` = 0 → seul `dessous` ; 1 → `dessus` en place.
 * L'écran du dessous recule d'un tiers et s'assombrit, comme dans une pile de navigation.
 */
export const Pile: React.FC<{ p: number; dessous: React.ReactNode; dessus: React.ReactNode }> = ({
  p,
  dessous,
  dessus,
}) => {
  // Un ressort s'arrête à 0,999… : sans ce seuil, l'écran du dessous dépasse d'un liseré.
  if (p > 0.995) p = 1;
  if (p < 0.005) p = 0;
  return (
  <>
    {p < 1 ? (
      <div style={{ position: 'absolute', inset: 0, transform: `translateX(${-p * ECRAN.largeur * 0.3}px)` }}>
        {dessous}
        <div style={{ position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.12 * p})` }} />
      </div>
    ) : null}
    {p > 0 ? (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateX(${(1 - p) * ECRAN.largeur}px)`,
          boxShadow: '-8px 0 24px rgba(0,0,0,0.12)',
        }}
      >
        {dessus}
      </div>
    ) : null}
  </>
  );
};

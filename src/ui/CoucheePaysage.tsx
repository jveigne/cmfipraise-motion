import React from 'react';
import { ECRAN } from './Telephone';
import { PAYSAGE } from './EcranPresentation';

/**
 * Pose un écran paysage (844 × 390) dans l'écran portrait du téléphone, tourné de -90° :
 * quand le téléphone tourne de +90°, son contenu se retrouve droit.
 */
export const CoucheePaysage: React.FC<{ opacite: number; children: React.ReactNode }> = ({ opacite, children }) => (
  <div
    style={{
      position: 'absolute',
      left: (ECRAN.largeur - PAYSAGE.largeur) / 2,
      top: (ECRAN.hauteur - PAYSAGE.hauteur) / 2,
      width: PAYSAGE.largeur,
      height: PAYSAGE.hauteur,
      transform: 'rotate(-90deg)',
      opacity: opacite,
    }}
  >
    {children}
  </div>
);

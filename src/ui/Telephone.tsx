import React from 'react';
import { IoAirplane, IoBatteryFull, IoCellular, IoWifi } from 'react-icons/io5';
import { Couleurs, Polices } from '../theme';

/** Écran de référence en points iOS ; tout l'écran redessiné est posé dans ce repère. */
export const ECRAN = { largeur: 390, hauteur: 844 } as const;
export const CADRE = 16;

/**
 * Téléphone vu de face : cadre, Dynamic Island, barre d'état propre (batterie pleine, pas de
 * notification — consigne du brief). `echelle` = pixels vidéo par point d'écran.
 * `avion` : mode avion (plan 6). `barreEtat` : opacité de la barre d'état (masquée en plein écran).
 */
export const Telephone: React.FC<{
  x: number;
  y: number;
  echelle: number;
  avion?: number;
  barreEtat?: number;
  children: React.ReactNode;
}> = ({ x, y, echelle, avion = 0, barreEtat = 1, children }) => {
  const rayon = 47 * echelle;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        padding: CADRE,
        borderRadius: rayon + CADRE,
        background: '#1B1F24',
        boxShadow: '0 40px 90px rgba(18,23,28,0.28), inset 0 0 0 3px #3A4048',
      }}
    >
      <div
        style={{
          width: ECRAN.largeur * echelle,
          height: ECRAN.hauteur * echelle,
          borderRadius: rayon,
          overflow: 'hidden',
          position: 'relative',
          background: Couleurs.fondEcran,
        }}
      >
        <div
          style={{
            width: ECRAN.largeur,
            height: ECRAN.hauteur,
            transform: `scale(${echelle})`,
            transformOrigin: '0 0',
            position: 'relative',
          }}
        >
          {children}
          <BarreEtat avion={avion} opacite={barreEtat} />
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: 11,
              width: 124,
              height: 36,
              marginLeft: -62,
              borderRadius: 18,
              background: '#000',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const BarreEtat: React.FC<{ avion: number; opacite: number }> = ({ avion, opacite }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 54,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 30px 0 44px',
      fontFamily: Polices.sans,
      fontWeight: 600,
      fontSize: 17,
      color: Couleurs.encre,
      opacity: opacite,
    }}
  >
    <span>11:10</span>
    <span style={{ display: 'flex', gap: 6, alignItems: 'center', position: 'relative' }}>
      <span style={{ display: 'flex', gap: 6, alignItems: 'center', opacity: 1 - avion }}>
        <IoCellular size={17} />
        <IoWifi size={18} />
      </span>
      <span
        style={{
          position: 'absolute',
          left: 4,
          display: 'flex',
          opacity: avion,
          transform: `scale(${0.6 + 0.4 * avion})`,
          color: '#F59E0B',
        }}
      >
        <IoAirplane size={20} />
      </span>
      <IoBatteryFull size={27} />
    </span>
  </div>
);

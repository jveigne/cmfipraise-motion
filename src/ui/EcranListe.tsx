import React from 'react';
import { spring, useVideoConfig } from 'remotion';
import { IoArrowBack, IoSearch } from 'react-icons/io5';
import { GiGClef } from 'react-icons/gi';
import { Couleurs, Polices } from '../theme';
import { Chant } from '../donnees';
import { Textes } from '../textes';
import { LigneChant, PAS_LIGNE } from './LigneChant';
import { BarreOnglets } from './EcranRecueils';

/** Haut de la première ligne de chant, en points. */
export const HAUT_LISTE = 188;

/**
 * Liste des chants d'une catégorie (`app/(tabs)/praise/songs.tsx`) : en-tête avec le nom de
 * la catégorie et le nombre de chants, champ de recherche, lignes de chant.
 * `t` : images écoulées depuis l'ouverture (les lignes arrivent en cascade).
 */
export const EcranListe: React.FC<{
  textes: Textes;
  titre: string;
  total: number;
  chants: Chant[];
  t: number;
  defilement?: number;
  surbrillance?: number | null;
}> = ({ textes, titre, total, chants, t, defilement = 0, surbrillance = null }) => {
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: 'absolute', inset: 0, background: Couleurs.fondEcran, fontFamily: Polices.sans }}>
      <div style={{ position: 'absolute', top: HAUT_LISTE - 16, left: 0, right: 0, bottom: 84, overflow: 'hidden' }}>
        <div style={{ padding: '16px 16px 0', transform: `translateY(${defilement}px)` }}>
          {chants.map((c, i) => {
            const p = spring({ frame: t - 4 - Math.min(i, 8) * 2, fps, config: { damping: 200 } });
            const k = surbrillance === null ? 0 : Math.max(0, 1 - Math.abs(surbrillance - i));
            return (
              <LigneChant
                key={i}
                chant={c}
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px) scale(${1 + 0.03 * k})`,
                  outline: k > 0 ? `${1.5 * k}px solid ${Couleurs.bleuListe}` : undefined,
                  height: PAS_LIGNE - 8,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* En-tête */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 116,
          boxSizing: 'border-box',
          padding: '60px 16px 16px',
          background: Couleurs.surface,
          borderBottom: `1px solid ${Couleurs.filetListe}`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <BoutonRond>
          <IoArrowBack size={26} color={Couleurs.bleuListe} />
        </BoutonRond>
        <div style={{ flex: 1, minWidth: 0, textAlign: 'center', padding: '0 8px' }}>
          <div
            style={{
              fontFamily: Polices.serif,
              fontWeight: 600,
              fontSize: 18,
              color: Couleurs.encreListe,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {titre}
          </div>
          <div style={{ fontSize: 12, color: Couleurs.grisTexte, marginTop: 2 }}>{textes.ecran.chants(total)}</div>
        </div>
        <BoutonRond>
          <GiGClef size={22} color={Couleurs.bleuListe} />
        </BoutonRond>
      </div>

      {/* Recherche */}
      <div
        style={{
          position: 'absolute',
          top: 128,
          left: 16,
          right: 16,
          height: 44,
          borderRadius: 12,
          background: Couleurs.surface,
          border: `1px solid ${Couleurs.filetListe}`,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '0 12px',
          boxSizing: 'border-box',
          color: '#9CA3AF',
          fontSize: 15,
        }}
      >
        <IoSearch size={20} />
        {textes.ecran.rechercher}
      </div>

      <BarreOnglets libelles={textes.ecran.onglets} />
    </div>
  );
};

export const BoutonRond: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 40,
      height: 40,
      borderRadius: 20,
      background: Couleurs.grisBouton,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

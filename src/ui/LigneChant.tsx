import React from 'react';
import { IoChevronForward, IoHeart, IoHeartOutline } from 'react-icons/io5';
import { GiGClef } from 'react-icons/gi';
import { Couleurs, Polices } from '../theme';
import { Chant } from '../donnees';

/** Hauteur d'une ligne de chant + son espacement, en points (`components/praise/SongRow.tsx`). */
export const PAS_LIGNE = 80;

/**
 * Ligne de chant, redessinée d'après `SongRow` : pastille « • » (un chant de catégorie n'a
 * pas de numéro), titre, auteur, clé de sol si le chant a des accords, cœur, chevron.
 */
export const LigneChant: React.FC<{
  chant: Chant;
  favori?: boolean;
  style?: React.CSSProperties;
}> = ({ chant, favori = false, style }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      height: 72,
      boxSizing: 'border-box',
      padding: '0 16px',
      marginBottom: 8,
      borderRadius: 12,
      background: Couleurs.surface,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      ...style,
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        background: Couleurs.bleuPastille,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        flexShrink: 0,
        fontFamily: Polices.sans,
        fontWeight: 500,
        fontSize: 16,
        color: Couleurs.bleuListe,
      }}
    >
      •
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontFamily: Polices.serif,
          fontWeight: 600,
          fontSize: 15,
          color: Couleurs.encreListe,
          marginBottom: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {chant.titre}
      </div>
      {chant.auteur ? (
        <div
          style={{
            fontFamily: Polices.sans,
            fontSize: 12,
            color: Couleurs.grisTexte,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {chant.auteur}
        </div>
      ) : null}
    </div>
    {chant.accords ? <GiGClef size={22} color={Couleurs.bleuListe} style={{ marginRight: 8 }} /> : null}
    <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
      {favori ? <IoHeart size={24} color={Couleurs.rose} /> : <IoHeartOutline size={24} color="#9CA3AF" />}
    </div>
    <IoChevronForward size={20} color="#9CA3AF" />
  </div>
);

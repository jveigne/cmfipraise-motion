import React from 'react';
import { IoAdd, IoArrowBack, IoExpandOutline, IoHeartOutline, IoMusicalNote, IoRemove } from 'react-icons/io5';
import { Couleurs, Polices } from '../theme';
import { Paroles } from '../donnees';
import { Textes } from '../textes';
import { BarreOnglets } from './EcranRecueils';
import { BoutonRond } from './EcranListe';

/** Centre du bouton « Plein écran », en points (pour l'appui du doigt). */
export const BOUTON_PLEIN_ECRAN = { x: 304, y: 152 } as const;

/**
 * Paroles d'un chant (`app/(tabs)/praise/lyrics.tsx`) : en-tête, ligne Zoom + Plein écran,
 * ligne Accords, carte des paroles (refrain en italique, filet bleu à gauche).
 * `pressionPleinEcran` : 0 → 1 pendant l'appui sur le bouton.
 */
export const EcranParoles: React.FC<{
  textes: Textes;
  paroles: Paroles;
  pressionPleinEcran?: number;
}> = ({ textes, paroles, pressionPleinEcran = 0 }) => {
  const e = textes.ecran;
  let numeroCouplet = 0;
  return (
    <div style={{ position: 'absolute', inset: 0, background: Couleurs.fondEcran, fontFamily: Polices.sans }}>
      {/* En-tête */}
      <div
        style={{
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
              fontSize: 16,
              color: Couleurs.encreListe,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {paroles.titre}
          </div>
          <div style={{ fontSize: 12, color: Couleurs.grisTexte, marginTop: 2 }}>{paroles.auteur}</div>
        </div>
        <BoutonRond>
          <IoHeartOutline size={26} color={Couleurs.bleuListe} />
        </BoutonRond>
      </div>

      {/* Zoom + Plein écran */}
      <div
        style={{
          height: 72,
          boxSizing: 'border-box',
          padding: '0 16px',
          background: Couleurs.surface,
          borderBottom: `1px solid ${Couleurs.filetListe}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PetitRond>
            <IoRemove size={20} color={Couleurs.bleuListe} />
          </PetitRond>
          <span style={{ fontWeight: 500, fontSize: 14, color: Couleurs.grisTexte }}>{e.zoom}</span>
          <PetitRond>
            <IoAdd size={20} color={Couleurs.bleuListe} />
          </PetitRond>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '10px 16px',
            borderRadius: 20,
            border: `1px solid ${Couleurs.bleuListe}`,
            background: pressionPleinEcran > 0 ? `rgba(0,119,190,${0.15 * pressionPleinEcran})` : Couleurs.surface,
            transform: `scale(${1 - 0.06 * pressionPleinEcran})`,
            color: Couleurs.bleuListe,
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          <IoExpandOutline size={20} />
          {e.pleinEcran}
        </div>
      </div>

      {/* Accords */}
      <div
        style={{
          height: 44,
          boxSizing: 'border-box',
          padding: '0 16px',
          background: Couleurs.surface,
          borderBottom: `1px solid ${Couleurs.filetListe}`,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '6px 10px',
            borderRadius: 14,
            background: Couleurs.grisBouton,
            fontWeight: 500,
            fontSize: 13,
            color: Couleurs.grisTexte,
          }}
        >
          <IoMusicalNote size={13} />
          {e.accords}
        </div>
      </div>

      {/* Paroles */}
      <div style={{ position: 'absolute', top: 232 + 16, left: 16, right: 16, bottom: 84, overflow: 'hidden' }}>
        <div
          style={{
            background: Couleurs.surface,
            borderRadius: 12,
            padding: 20,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          {paroles.parties.slice(0, 3).map((p, i) => {
            const refrain = p.type === 'refrain';
            if (!refrain) numeroCouplet += 1;
            return (
              <div
                key={i}
                style={
                  refrain
                    ? { margin: '8px 0 20px', paddingLeft: 12, borderLeft: `3px solid ${Couleurs.bleuListe}` }
                    : { marginBottom: 20 }
                }
              >
                <div style={{ fontWeight: 500, fontSize: 16, color: Couleurs.encreListe, marginBottom: 8 }}>
                  {refrain ? 'R.' : `${numeroCouplet}.`}
                </div>
                {p.lignes.map((l, j) => (
                  <div
                    key={j}
                    style={{
                      fontFamily: Polices.serif,
                      fontStyle: refrain ? 'italic' : 'normal',
                      fontSize: 19,
                      lineHeight: 1.62,
                      color: Couleurs.encreListe,
                    }}
                  >
                    {l}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <BarreOnglets libelles={textes.ecran.onglets} />
    </div>
  );
};

const PetitRond: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      width: 36,
      height: 36,
      borderRadius: 18,
      background: Couleurs.grisBouton,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </div>
);

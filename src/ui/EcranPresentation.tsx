import React from 'react';
import { IoAdd, IoChevronBack, IoChevronForward, IoClose, IoRemove } from 'react-icons/io5';
import { Couleurs, Polices } from '../theme';
import { Paroles } from '../donnees';
import { Textes } from '../textes';

/** Écran paysage, en points : le téléphone tourné. */
export const PAYSAGE = { largeur: 844, hauteur: 390 } as const;

/**
 * Mode Plein écran (`renderPresentationMode` de lyrics.tsx) : paysage, fond sombre, une
 * diapositive par partie du chant, flèches de part et d'autre, barre du bas.
 * `diapo` : index (continu) de la partie affichée, pour glisser d'une partie à l'autre.
 */
export const EcranPresentation: React.FC<{ textes: Textes; paroles: Paroles; diapo: number }> = ({
  textes,
  paroles,
  diapo,
}) => {
  const total = paroles.parties.length;
  const courante = Math.round(diapo);
  const numeros = numeroter(paroles);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: Couleurs.nuitPresentation,
        fontFamily: Polices.sans,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '12px 56px 4px' }}>
        <Rond taille={48} attenue={courante === 0}>
          <IoChevronBack size={32} />
        </Rond>
        <div
          style={{
            flex: 1,
            margin: '0 12px',
            height: '90%',
            borderRadius: 12,
            background: Couleurs.surface,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {paroles.parties.map((p, i) => {
            const decalage = i - diapo;
            if (Math.abs(decalage) > 1) return null;
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `translateX(${decalage * 100}%)`,
                }}
              >
                <div style={{ fontWeight: 500, fontSize: 17, color: Couleurs.bleuListe, marginBottom: 8 }}>
                  {p.type === 'refrain' ? textes.ecran.refrain : textes.ecran.couplet} {numeros[i]}
                </div>
                {p.lignes.map((l, j) => (
                  <div
                    key={j}
                    style={{
                      fontFamily: Polices.serif,
                      fontStyle: p.type === 'refrain' ? 'italic' : 'normal',
                      // Zoom de l'app poussé d'un cran (« + ») : lisible de loin, comme en réunion.
                      fontSize: 23,
                      lineHeight: 1.3,
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
        <Rond taille={48} attenue={courante === total - 1}>
          <IoChevronForward size={32} />
        </Rond>
      </div>
      <div
        style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 76px',
          background: 'rgba(17,24,39,0.85)',
          color: '#fff',
        }}
      >
        <Rond taille={40}>
          <IoClose size={22} />
        </Rond>
        <span style={{ fontWeight: 500, fontSize: 15 }}>
          {courante + 1} / {total}
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <Rond taille={40}>
            <IoRemove size={22} />
          </Rond>
          <Rond taille={40}>
            <IoAdd size={22} />
          </Rond>
        </div>
      </div>
    </div>
  );
};

/** Numéro affiché de chaque partie : couplets et refrains sont comptés séparément. */
const numeroter = (paroles: Paroles) => {
  let c = 0;
  let r = 0;
  return paroles.parties.map((p) => (p.type === 'refrain' ? ++r : ++c));
};

/** Position du centre de la flèche « suivant », en points paysage. */
export const FLECHE_SUIVANTE = { x: PAYSAGE.largeur - 56 - 24, y: (PAYSAGE.hauteur - 60) / 2 + 4 } as const;

const Rond: React.FC<{ taille: number; attenue?: boolean; children: React.ReactNode }> = ({
  taille,
  attenue = false,
  children,
}) => (
  <div
    style={{
      width: taille,
      height: taille,
      borderRadius: taille / 2,
      background: Couleurs.boutonPresentation,
      color: attenue ? '#4B5563' : '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}
  >
    {children}
  </div>
);

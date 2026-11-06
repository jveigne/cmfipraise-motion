import React from 'react';
import { IoBookOutline, IoFlagOutline, IoHeartOutline, IoHomeOutline, IoMegaphoneOutline, IoPersonOutline } from 'react-icons/io5';
import { P, S } from '../../evenements/theme';
import { Halo } from '../../evenements/ui/app';
import { APP } from '../textes';

/**
 * Barre d'onglets de Daniel (`(tabs)/_layout.tsx`) : six onglets, car un dirigeant qui a Member Care
 * voit « Brebis » (`isLeader && hasMemberCare`) ; Déclarations et Trésorerie masqués (pas de Dons).
 * Même gabarit que `BarreOnglets` d'« Évènements » (cinq onglets, fichier partagé non modifié) :
 * marges 14, hauteur 60 + 34, icônes Ionicons « -outline » 24, actif en mousse.
 */
export const ONGLETS6 = { accueil: 0, objectifs: 1, assemblee: 2, evenements: 3, brebis: 4, profil: 5 } as const;

const BARRE = { marge: 14, hauteur: 94, haut: 8 };

export const BarreOnglets6: React.FC<{ actif: number; halo?: number }> = ({ actif, halo = 0 }) => {
  const icones = [IoHomeOutline, IoFlagOutline, IoBookOutline, IoMegaphoneOutline, IoHeartOutline, IoPersonOutline];
  return (
    <div
      style={{
        position: 'absolute',
        left: BARRE.marge,
        right: BARRE.marge,
        bottom: BARRE.marge,
        height: BARRE.hauteur,
        borderRadius: 24,
        border: '1px solid rgba(42,38,32,0.08)',
        background: 'rgba(245,236,216,0.96)',
        boxShadow: '0 8px 24px rgba(42,38,32,0.08)',
        display: 'flex',
        padding: `${BARRE.haut}px 0 38px`,
        boxSizing: 'border-box',
      }}
    >
      {APP.onglets.map((nom, i) => {
        const Icone = icones[i];
        const couleur = i === actif ? S.moss : S.ink3;
        return (
          <div key={nom} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <Halo intensite={i === actif ? halo : 0} rayon={10} marge={2} margeY={4} etalement={3}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                <Icone size={24} color={couleur} />
                {/* Six onglets sur 362 points : libellé ramené à 10 (« Évènements » touchait ses voisins à 11). */}
                <div style={{ fontFamily: P.sans, fontSize: 10, letterSpacing: -0.2, fontWeight: 600, color: couleur, whiteSpace: 'nowrap' }}>{nom}</div>
              </div>
            </Halo>
          </div>
        );
      })}
    </div>
  );
};

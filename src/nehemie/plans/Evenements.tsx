import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { doux } from '../../anim';
import { PageEvenements } from '../ecrans/Pages';
import { LEGENDES } from '../textes';
import { Fenetre, Legende, compteur, haloEntre } from './commun';

/**
 * Partie « 3 · Les évènements » (P8) : les statistiques d'Évènements à l'intérieur de Douala pour
 * 2026 — les fruits (conversions, baptêmes), puis la répartition par assemblée (la vue que
 * l'offre ouvre, plan 05 § 3.5, D-OFF-12), Akwa en tête. P8 est le plan TAMPON du calage musical :
 * sa durée est calculée (`calage.ts`) pour que P9 tombe sur l'entrée de l'orchestre ; tout ce qui
 * suit la légende « Akwa » se cale sur sa fin.
 */
export const DUREE_P8_MIN = 300;

const DEFILEMENT_TABLE = -205;

export const P8Evenements: React.FC<{ duree: number }> = ({ duree }) => {
  const f = useCurrentFrame();
  const defilement = DEFILEMENT_TABLE * doux(f, [112, 132], [0, 1]);
  const sortie = doux(f, [duree - 16, duree], [0, 1]);
  return (
    <AbsoluteFill>
      <Fenetre decalageY={sortie * 900} opacite={1 - sortie}>
        <PageEvenements
          compte={compteur(f, 8, 44)}
          haloSection={haloEntre(f, 2, 44)}
          haloKpis={haloEntre(f, 30, 108)}
          haloTable={haloEntre(f, 136, 216)}
          halos={{ 0: haloEntre(f, 226, duree - 22) }}
          defilement={defilement}
        />
      </Fenetre>
      <Legende lignes={LEGENDES.p8Fruits} duree={duree} fin={108} />
      <Legende lignes={LEGENDES.p8Assemblees} duree={duree} debut={114} fin={218} />
      <Legende lignes={LEGENDES.p8Akwa} duree={duree} debut={224} />
    </AbsoluteFill>
  );
};

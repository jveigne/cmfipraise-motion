import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Salon } from '../../etude/ui/Salon';
import { LegendeEtude } from '../../etude/plans/commun';
import { CartonTitre } from '../ui/Cartons';
import { LEGENDES } from '../textes';

/**
 * Ouverture (sans pastille de partie) : O1, le titre « Le Message de Bertoua » sur la tuile de
 * l'accueil ; O2, le salon de Samuel un dimanche en journée (illustration d'« Étude », `Salon`) — la
 * même assemblée que dans « Étude » et « Guide ». O2 est le plan tampon du calage musical : sa durée
 * est calculée (`calage.ts`), ses légendes sont posées depuis sa fin.
 */
export const DUREE_O1 = 150;
export const DUREE_O2_MIN = 150;

export const O1Titre: React.FC = () => <CartonTitre duree={DUREE_O1} />;

const ORDRE = ['samuel', 'marie', 'jean', 'esther', 'paul', 'helene'] as const;

export const O2Salon: React.FC<{ duree: number }> = ({ duree: D }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = doux(f, [0, 16], [0, 1]);
  const etiquettes = Object.fromEntries(ORDRE.map((nom, i) => [nom, spring({ frame: f - (34 + i * 7), fps, config: { damping: 12 } })]));
  // Lent travelling avant sur l'arc des présents.
  const zoom = 1 + 0.06 * doux(f, [0, D], [0, 1]);
  const bascule = Math.round(D * 0.52);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: '540px 1150px' }}>
        <Salon pose={pose} assis={(i) => spring({ frame: f - (10 + i * 2), fps, config: { damping: 14 } })} etiquettes={etiquettes} />
      </AbsoluteFill>
      <LegendeEtude lignes={LEGENDES.o2Dimanche} duree={D} fin={bascule - 2} />
      <LegendeEtude lignes={LEGENDES.o2Samuel} duree={D} debut={bascule + 2} />
    </AbsoluteFill>
  );
};

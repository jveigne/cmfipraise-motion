import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Textes } from '../textes';
import { Legende } from '../ui/Legende';
import { EcranRecueils } from '../ui/EcranRecueils';
import { Plateau } from '../ui/Plateau';
import { Toucher } from '../ui/Toucher';
import { versVideo } from '../ui/Scene';

/** Plan 8 (36–40 s) : l'onglet Favoris liste directement les chants favoris. */
export const DUREE_PLAN8 = 120;

const APPUI = 14;

export const Plan8Favoris: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const onglet = 1 + spring({ frame: f - APPUI, fps, config: { damping: 22 } });
  const appui = versVideo(313, 130);

  return (
    <AbsoluteFill>
      <Plateau dessus={<Toucher x={appui.x} y={appui.y} a={APPUI} taille={40} />}>
        <EcranRecueils textes={textes} onglet={onglet} tCategorie={1000} tFavoris={f - APPUI - 4} bascule={1} />
      </Plateau>
      <Legende lignes={textes.plan8} duree={DUREE_PLAN8} debut={4} />
    </AbsoluteFill>
  );
};

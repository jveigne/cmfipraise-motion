import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Textes } from '../textes';
import { Legende } from '../ui/Legende';
import { EcranRecueils } from '../ui/EcranRecueils';
import { Plateau } from '../ui/Plateau';
import { Toucher } from '../ui/Toucher';
import { versVideo } from '../ui/Scene';
import { doux } from '../anim';

/**
 * Plan 7 (31–36 s) : la bascule passe à l'autre langue, la liste change. Les catégories
 * anglaises n'existant pas dans l'app, leur liste est redessinée (noms traduits).
 */
export const DUREE_PLAN7 = 150;

const APPUI = 34;
/** Centres des boutons Français / English de la bascule, en points. */
const BOUTON = { fr: { x: 101, y: 185 }, en: { x: 288, y: 185 } } as const;

export const Plan7Langues: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cible = BOUTON[textes.langueListe === 'fr' ? 'en' : 'fr'];

  const bascule = spring({ frame: f - APPUI - 2, fps, config: { damping: 200 }, durationInFrames: 20 });
  const zoom = doux(f, [4, 24, 64, 88], [1, 1.25, 1.25, 1]);
  const appui = versVideo(cible.x, cible.y);

  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 185 }}
        avion={doux(f, [0, 10], [1, 0])}
        dessus={<Toucher x={appui.x} y={appui.y} a={APPUI} taille={40} />}
      >
        <EcranRecueils textes={textes} onglet={1} tCategorie={1000} bascule={bascule} />
      </Plateau>
      <Legende lignes={textes.plan7} duree={DUREE_PLAN7} debut={4} />
    </AbsoluteFill>
  );
};

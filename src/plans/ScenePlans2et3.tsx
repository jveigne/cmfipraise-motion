import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig, Sequence } from 'remotion';
import { Textes } from '../textes';
import { Legende } from '../ui/Legende';
import { EcranRecueils } from '../ui/EcranRecueils';
import { Toucher } from '../ui/Toucher';
import { Plateau } from '../ui/Plateau';
import { versVideo } from '../ui/Scene';
import { doux, defilementVers } from '../anim';
import { CAT_PRIERE } from '../donnees';

/** Un seul téléphone pour les plans 2 et 3 : la caméra se rapproche, l'écran reste continu. */
export const DUREE_PLAN2 = 120;
export const DUREE_PLAN3 = 150;

const APPUI_CATEGORIE = 46;
const OUVERTURE_CATEGORIE = 50;

export const ScenePlans2et3: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();

  const arrivee = spring({ frame: f, fps, config: { damping: 18, mass: 0.9 } });
  const onglet = spring({ frame: f - APPUI_CATEGORIE, fps, config: { damping: 22 } });

  // Plan 2 : zoom sur les onglets autour de l'appui. Plan 3 : le haut de l'écran reste fixe,
  // le téléphone grandit vers le bas sans passer sous le texte.
  const t3 = f - DUREE_PLAN2;
  const auPlan3 = t3 >= 0;
  const zoom = auPlan3
    ? doux(t3, [4, 30, 120, 146], [1, 1.12, 1.12, 1])
    : doux(f, [22, 40, 76, 100], [1, 1.32, 1.32, 1]);
  const foyer = auPlan3 ? { x: 195, y: 0 } : { x: 195, y: 130 };

  // Plan 3 : la lumière passe sur deux catégories, la liste défile jusqu'à « La prière »,
  // puis remonte pour le plan 4.
  const bas = defilementVers(CAT_PRIERE);
  const defilement = doux(t3, [58, 96, 122, 146], [0, bas, bas, 0]);
  const surbrillance = t3 < 58 ? doux(t3, [36, 46], [2, 5]) : CAT_PRIERE;
  const intensite = doux(t3, [20, 28, 50, 58, 98, 104, 114, 120], [0, 1, 1, 0, 0, 1, 1, 0]);

  const appui = versVideo(195, 130);

  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={foyer}
        decalageY={(1 - arrivee) * 1500}
        dessus={<Toucher x={appui.x} y={appui.y} a={APPUI_CATEGORIE} taille={40} />}
      >
        <EcranRecueils
          textes={textes}
          onglet={onglet}
          tCategorie={f - OUVERTURE_CATEGORIE}
          surbrillance={auPlan3 ? surbrillance : null}
          intensite={intensite}
          defilement={defilement}
        />
      </Plateau>

      <Sequence durationInFrames={DUREE_PLAN2} layout="none">
        <Legende lignes={textes.plan2} duree={DUREE_PLAN2} debut={6} />
      </Sequence>
      <Sequence from={DUREE_PLAN2} durationInFrames={DUREE_PLAN3} layout="none">
        <Legende lignes={textes.plan3} duree={DUREE_PLAN3} debut={4} />
      </Sequence>
    </AbsoluteFill>
  );
};

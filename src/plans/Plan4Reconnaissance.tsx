import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { Textes } from '../textes';
import { CAT_MERCI, CONTENU } from '../donnees';
import { Legende } from '../ui/Legende';
import { EcranRecueils } from '../ui/EcranRecueils';
import { EcranListe } from '../ui/EcranListe';
import { Pile } from '../ui/Pile';
import { Plateau } from '../ui/Plateau';
import { Toucher } from '../ui/Toucher';
import { versVideo } from '../ui/Scene';
import { centreCategorie, doux } from '../anim';

/** Plan 4 (13–19 s) : « Actions de grâce… » s'ouvre, la liste de ses chants défile. */
export const DUREE_PLAN4 = 180;

const APPUI = 12;
const OUVERTURE = 16;
const RETOUR = 150;

export const Plan4Reconnaissance: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const langue = textes.langueListe;
  const categorie = CONTENU.categories[langue][CAT_MERCI];

  const p =
    spring({ frame: f - OUVERTURE, fps, config: { damping: 200 }, durationInFrames: 18 }) -
    spring({ frame: f - RETOUR, fps, config: { damping: 200 }, durationInFrames: 18 });
  const appui = versVideo(195, centreCategorie(CAT_MERCI));

  return (
    <AbsoluteFill>
      <Plateau dessus={<Toucher x={appui.x} y={appui.y} a={APPUI} taille={40} />}>
        <Pile
          p={p}
          dessous={<EcranRecueils textes={textes} onglet={1} tCategorie={1000} />}
          dessus={
            <EcranListe
              textes={textes}
              titre={categorie.nom}
              total={categorie.chants}
              chants={CONTENU.merci[langue]}
              t={f - OUVERTURE}
              defilement={doux(f, [62, 140], [0, -640])}
            />
          }
        />
      </Plateau>
      <Legende lignes={textes.plan4} duree={DUREE_PLAN4} debut={2} delais={[0, 56]} taille={80} />
    </AbsoluteFill>
  );
};

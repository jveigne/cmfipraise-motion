import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { IoCloudOfflineOutline } from 'react-icons/io5';
import { Textes } from '../textes';
import { CAT_PRIERE, CONTENU } from '../donnees';
import { Couleurs } from '../theme';
import { Legende } from '../ui/Legende';
import { EcranRecueils } from '../ui/EcranRecueils';
import { EcranListe } from '../ui/EcranListe';
import { EcranPresentation } from '../ui/EcranPresentation';
import { CoucheePaysage } from '../ui/CoucheePaysage';
import { Pile } from '../ui/Pile';
import { MONTEE_PAYSAGE, Plateau } from '../ui/Plateau';
import { Toucher } from '../ui/Toucher';
import { versVideo } from '../ui/Scene';
import { centreCategorie, defilementVers, doux } from '../anim';
import { REDUCTION_PAYSAGE } from './Plan5Combat';

/**
 * Plan 6 (26–31 s) : retour en portrait, mode avion, et « La prière » s'ouvre quand même :
 * les catégories sont téléchargées avec les recueils.
 */
export const DUREE_PLAN6 = 150;

const AVION = 30;
const APPUI = 84;
const OUVERTURE = 88;
const RETOUR = 124;

export const Plan6HorsLigne: React.FC<{ textes: Textes }> = ({ textes }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const langue = textes.langueListe;
  const categorie = CONTENU.categories[langue][CAT_PRIERE];

  const rotation = doux(f, [0, 24], [90, 0]);
  const reduction = doux(f, [0, 24], [REDUCTION_PAYSAGE, 1]);
  const paysage = doux(f, [4, 18], [1, 0]);
  const avion = spring({ frame: f - AVION, fps, config: { damping: 14 } });
  const badge =
    spring({ frame: f - AVION - 4, fps, config: { damping: 11 } }) * doux(f, [126, 140], [1, 0]);

  const bas = defilementVers(CAT_PRIERE);
  const defilement = doux(f, [48, 78, 132, 150], [0, bas, bas, 0]);
  const p =
    spring({ frame: f - OUVERTURE, fps, config: { damping: 200 }, durationInFrames: 18 }) -
    spring({ frame: f - RETOUR, fps, config: { damping: 200 }, durationInFrames: 14 });
  const appui = versVideo(195, centreCategorie(CAT_PRIERE) + bas);

  return (
    <AbsoluteFill>
      <Plateau
        rotation={rotation}
        reduction={reduction}
        decalageY={doux(f, [0, 24], [MONTEE_PAYSAGE, 0])}
        avion={avion}
        barreEtat={1 - paysage}
        dessus={
          <>
            <Toucher x={appui.x} y={appui.y} a={APPUI} taille={40} />
            <Badge echelle={badge} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={
            <EcranRecueils
              textes={textes}
              onglet={1}
              tCategorie={1000}
              defilement={defilement}
              surbrillance={CAT_PRIERE}
              intensite={doux(f, [APPUI - 6, APPUI, OUVERTURE + 10, OUVERTURE + 14], [0, 1, 1, 0])}
            />
          }
          dessus={
            <EcranListe
              textes={textes}
              titre={categorie.nom}
              total={categorie.chants}
              chants={CONTENU.priere[langue]}
              t={f - OUVERTURE}
            />
          }
        />
        {paysage > 0 ? (
          <CoucheePaysage opacite={paysage}>
            <EcranPresentation textes={textes} paroles={CONTENU.paroles[langue]} diapo={1} />
          </CoucheePaysage>
        ) : null}
      </Plateau>
      <Legende lignes={textes.plan6} duree={DUREE_PLAN6} debut={20} />
    </AbsoluteFill>
  );
};

/** Pastille « hors connexion » posée sur le coin du téléphone. */
const Badge: React.FC<{ echelle: number }> = ({ echelle }) => {
  const coin = versVideo(372, 70);
  return (
    <div
      style={{
        position: 'absolute',
        left: coin.x - 80,
        top: coin.y - 80,
        width: 160,
        height: 160,
        borderRadius: 80,
        background: Couleurs.surface,
        boxShadow: '0 18px 40px rgba(18,23,28,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `scale(${echelle})`,
      }}
    >
      <IoCloudOfflineOutline size={84} color={Couleurs.bleuCmfi} />
    </div>
  );
};

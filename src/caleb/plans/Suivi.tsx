import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Appui, LegendeEtude, Voile, haloEntre, montee, voilePour } from '../../etude/plans/commun';
import { LEGENDES } from '../textes';
import { EcranHierarchieCaleb, Y_HIER } from '../ecrans/Hierarchie';
import { EcranBrebis, PT_BREBIS } from '../ecrans/Brebis';

/**
 * Partie « 3 · Bertoua et les brebis » : P7, le bloc « Le Message de Bertoua » de la Hiérarchie
 * (l'avancement de chaque assemblée de la chaîne, jamais une réponse ni un nom de membre) ; P8,
 * l'onglet « Brebis » : les fiches de toutes les assemblées de la chaîne, en lecture — seul le
 * dirigeant de l'assemblée les met à jour.
 */
export const DUREE_P7 = 300;
export const DUREE_P8 = 270;

// ---------------------------------------------------------------------------------------------
// P7 — Le Message de Bertoua

const D_ETUDE = -(Y_HIER.etude - 90);
/** Les lignes des assemblées : Paris Ouest en haut de l'écran. */
const D_LIGNES = -(Y_HIER.ligneEtude('ouest') - 190);

export const P7Bertoua: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const defilement = doux(f, [124, 150], [D_ETUDE, D_LIGNES]);
  const zoom = doux(f, [26, 42, 108, 122, 226, 242, 282, 296], [1, 1.3, 1.3, 1, 1, 1.3, 1.3, 1]);
  const foyerY = f < 170 ? Y_HIER.casesEtude + D_ETUDE : Y_HIER.noteEtude + D_LIGNES;
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={{ x: 195, y: foyerY }} decalageY={montee(f, fps)}>
        <EcranHierarchieCaleb
          defilement={defilement}
          halos={{
            casesEtude: haloEntre(f, 44, 106),
            etudeOuest: haloEntre(f, 152, 190),
            etudeEvry: haloEntre(f, 186, 226),
            noteEtude: haloEntre(f, 242, 290),
          }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeEtude lignes={LEGENDES.p7Bertoua} duree={DUREE_P7} debut={6} fin={146} />
      <LegendeEtude lignes={LEGENDES.p7Jamais} duree={DUREE_P7} debut={150} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P8 — les brebis de la chaîne

export const P8Brebis: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [146, 162, 236, 252], [1, 1.3, 1.3, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: PT_BREBIS.lectureSeule.y + 40 }}
        decalageY={montee(f, fps)}
        dessus={<Appui {...PT_BREBIS.evry} a={118} coupe={130} />}
      >
        <EcranBrebis
          choisie="ouest"
          vers="evry"
          p={doux(f, [122, 132], [0, 1])}
          haloOnglet={haloEntre(f, 18, 46)}
          haloPastilles={haloEntre(f, 40, 112)}
          haloLecture={haloEntre(f, 164, 236)}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeEtude lignes={LEGENDES.p8Brebis} duree={DUREE_P8} debut={6} fin={136} />
      <LegendeEtude lignes={LEGENDES.p8Plume} duree={DUREE_P8} debut={140} />
    </AbsoluteFill>
  );
};

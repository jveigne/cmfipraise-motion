import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { FournisseurEtude } from '../../etude/langue';
import { EcranMaProgression } from '../../etude/ecrans/Progression';
import { LegendeEtude, PastillePersonne, Voile, Y_PASTILLE, haloEntre, montee, voilePour } from '../../etude/plans/commun';
import { EcranAvancementGuide } from '../../guide/ecrans/Etude';
import { ETUDE_APRES } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';

/**
 * Partie « 6 · L'avancement », le lundi 2 novembre (la leçon 1 est faite pour l'assemblée) — sur
 * l'assemblée seule, ce qui est gratuit (D-ETU-50) ; le suivi au-dessus de l'assemblée (la ville, la
 * hiérarchie) relève des offres payantes et n'est pas montré ici :
 * - F1 : *Ma progression* de Marie (`progress.tsx` › `PersonView`) : 1 / 5 leçons, note cumulée
 *   10,5 / 13 ; un membre ne voit que sa propre note (D-ETU-10) ;
 * - F2 : l'avancement de l'assemblée vu par Samuel (`UnitView`, écran de « Guide ») : leçons faites
 *   et note de chaque membre, Rose comprise (son rattrapage).
 */
export const DUREE_F1 = 240;
export const DUREE_F2 = 300;

const Pastille: React.FC<{ texte: string }> = ({ texte }) => {
  const f = useCurrentFrame();
  return (
    <PastillePersonne x={540} y={Y_PASTILLE} opacite={doux(f, [4, 14], [0, 1])}>
      {texte}
    </PastillePersonne>
  );
};

export const F1Progression: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [20, 34], [1, 1.16]);
  return (
    <FournisseurEtude valeur={ETUDE_APRES}>
      <AbsoluteFill>
        <Plateau zoom={zoom} foyer={{ x: 195, y: 340 }} decalageY={montee(f, fps)}>
          <EcranMaProgression mienne remplissage={doux(f, [30, 60], [0, 1])} haloLecons={haloEntre(f, 30, 116)} haloCumul={haloEntre(f, 118, DUREE_F1 - 2)} />
        </Plateau>
        <Voile force={voilePour(zoom)} />
        <Pastille texte={CARTONS.pastilles.marieApres} />
        <LegendeEtude lignes={LEGENDES.f1Marie} duree={DUREE_F1} fin={112} />
        <LegendeEtude lignes={LEGENDES.f1Note} duree={DUREE_F1} debut={116} />
      </AbsoluteFill>
    </FournisseurEtude>
  );
};

export const F2Assemblee: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <FournisseurEtude valeur={ETUDE_APRES}>
      <AbsoluteFill>
        <Plateau decalageY={montee(f, fps)}>
          <EcranAvancementGuide
            haloCarte={doux(f, [14, 26, 120, 132], [0, 1, 1, 0])}
            haloMembres={haloEntre(f, 150, DUREE_F2 - 2)}
            defilement={doux(f, [150, 190, 230, 270], [0, -160, -160, -420])}
          />
        </Plateau>
        <Pastille texte={CARTONS.pastilles.samuelApres} />
        <LegendeEtude lignes={LEGENDES.f2Samuel} duree={DUREE_F2} fin={142} />
        <LegendeEtude lignes={LEGENDES.f2Membres} duree={DUREE_F2} debut={146} />
      </AbsoluteFill>
    </FournisseurEtude>
  );
};

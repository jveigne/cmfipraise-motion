import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { CARTONS, LEGENDES } from '../textes';
import { ARBRE, DIRIGEANT_SAMUEL } from '../donnees';
import { EcranObjectifs, LIGNE_EFFECTIFS } from '../ecrans/Objectifs';
import { EcranArbre } from '../ecrans/Arbre';
import { TamponGratuit } from '../ui/Habillage';
import { Appui, DUREE_PLAN, DeuxLegendes, PastillePersonne, Y_PASTILLE, haloEntre, lisse, montee, opacitePersonne } from './commun';

/**
 * Partie « 2 · Ses objectifs » :
 * - P5 : les objectifs de Samuel (Goals & Reporting) — engagements, état actuel, soumission ;
 * - P6 : l'arbre de la Hiérarchie de Daniel, dirigeant de la ville, et l'état de soumission des
 *   objectifs de chacun. P6 est le plan TAMPON du calage musical : sa durée est calculée
 *   (`calage.ts`) et passée en prop ; la chorégraphie tient dans `DUREE_P6_MIN` images, le reste
 *   est une pose sur l'arbre déplié.
 */
export const DUREE_P5 = DUREE_PLAN;
export const DUREE_P6_MIN = 235;

// ---------------------------------------------------------------------------------------------
// P5 — Ses objectifs

export const P5Objectifs: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const defilement = doux(f, [56, 86, 150, 176], [0, -420, -420, -540]);
  return (
    <AbsoluteFill>
      <Plateau decalageY={montee(f, fps)}>
        <EcranObjectifs
          defilement={defilement}
          remplissage={doux(f, [96, 130], [0, 1])}
          haloLigne={{ index: LIGNE_EFFECTIFS, intensite: haloEntre(f, 92, 148) }}
          haloEtat={haloEntre(f, 180, 208)}
          haloSoumettre={haloEntre(f, 206, 244)}
        />
      </Plateau>
      <PastillePersonne x={540} y={Y_PASTILLE} opacite={opacitePersonne(f, DUREE_P5)}>
        {CARTONS.personnes.samuel}
      </PastillePersonne>
      <TamponGratuit a={28} />
      <DeuxLegendes idee={LEGENDES.p5} explication={LEGENDES.p5Explication} bascule={150} duree={DUREE_P5} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P6 — L'arbre de sa hiérarchie

/** Appui sur l'assemblée Paris Ouest, une fois l'arbre défilé (points d'écran). */
const A6 = { assemblee: 132 } as const;
const DEFILEMENT_ARBRE = -300;
/** Haut de la carte de l'assemblée de Samuel, défilement nul (voir l'en-tête d'`EcranArbre`). */
const Y_ASSEMBLEE_SAMUEL = 613;

export const P6Hierarchie: React.FC<{ duree: number }> = ({ duree }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const lignes = 1 + 2 * ARBRE.dirigeants.length;
  const entrees = Array.from({ length: lignes }, (_, i) => lisse(f, fps, 8 + i * 6, 14));
  const defilement = doux(f, [104, 126], [0, DEFILEMENT_ARBRE]);
  const deplie = doux(f, [A6.assemblee + 4, A6.assemblee + 22], [0, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        dessus={<Appui x={195} y={Y_ASSEMBLEE_SAMUEL + DEFILEMENT_ARBRE} a={A6.assemblee} coupe={A6.assemblee + 10} />}
      >
        <EcranArbre
          entrees={entrees}
          defilement={defilement}
          deplie={{ index: DIRIGEANT_SAMUEL, p: deplie }}
          haloDirigeants={haloEntre(f, 52, 100)}
          haloAssemblee={haloEntre(f, 116, A6.assemblee + 4)}
          haloMembres={haloEntre(f, 162, Math.max(232, duree - 12))}
        />
      </Plateau>
      <PastillePersonne x={540} y={Y_PASTILLE} opacite={opacitePersonne(f, duree)}>
        {CARTONS.personnes.daniel}
      </PastillePersonne>
      <TamponGratuit a={22} />
      <DeuxLegendes idee={LEGENDES.p6} explication={LEGENDES.p6Explication} bascule={140} duree={duree} />
    </AbsoluteFill>
  );
};

import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { MEMBRES_NON_ENSEIGNES, MEMBRES_TOUS, NON_ENSEIGNES, TOTAL_MEMBRES } from '../donnees';
import { PageAssemblees, PageMembres, STATUT_NON, STATUT_TOUS } from '../ecrans/Pages';
import { LEGENDES } from '../textes';
import { Curseur, trajet } from '../ui/Navigateur';
import { Fenetre, FonduPage, Legende, haloEntre } from './commun';

/**
 * Partie « 1 · Le Message de Bertoua » : P5, la grille assemblées × leçons de Douala (les coches
 * tombent sur la montée du chant, 24,0 s), Bonamoussadi 5 / 5, Deïdo 0 / 5 ; P6, les membres,
 * enseignés ou non enseignés, puis le filtre « Non enseigné » (14).
 */
export const DUREE_P5 = 300;
export const DUREE_P6 = 240;

/** Teinte « mousse » des halos positifs (r,g,b de `--ok`). */
const VERT = '47,107,76';

/** Centre de la grille (px CSS) : foyer du léger zoom. */
const FOYER_GRILLE = { x: 300, y: 40 };

export const P5Assemblees: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const coche = (ligne: number, lecon: number) => spring({ frame: f - (8 + (lecon - 1) * 9 + ligne * 3), fps, config: { damping: 14 }, durationInFrames: 14 });
  const zoom = doux(f, [100, 118, 276, 296], [1, 1.16, 1.16, 1]);
  return (
    <AbsoluteFill>
      <Fenetre zoom={zoom} foyer={FOYER_GRILLE}>
        <PageAssemblees coche={coche} halos={{ 3: haloEntre(f, 112, 192), 4: haloEntre(f, 198, 290) }} teinteHalo={f < 195 ? VERT : undefined} />
      </Fenetre>
      <Legende lignes={LEGENDES.p5Lecons} duree={DUREE_P5} fin={104} />
      <Legende lignes={LEGENDES.p5Finie} duree={DUREE_P5} debut={110} fin={190} />
      <Legende lignes={LEGENDES.p5Pas} duree={DUREE_P5} debut={196} />
    </AbsoluteFill>
  );
};

/** Onglet « Membres » et sélecteur « Statut » (px CSS, relevés sur le rendu). */
const PT = { onglet: { x: 178, y: 222 }, statut: { x: 110, y: 284 } };

export const P6Membres: React.FC = () => {
  const f = useCurrentFrame();
  const A = { onglet: 28, statut: 128 };
  const versMembres = doux(f, [A.onglet + 2, A.onglet + 10], [0, 1]);
  const filtre = f >= A.statut + 6;
  const lignes = doux(f, [A.statut + 2, A.statut + 6, A.statut + 8, A.statut + 14], [1, 0, 0, 1]);
  const c = trajet(f, [4, A.onglet - 4, 100, A.statut - 4, 236], [{ x: 330, y: 470 }, PT.onglet, PT.onglet, PT.statut, { x: 300, y: 500 }]);
  const curseur = doux(f, [2, 8], [0, 1]);
  return (
    <AbsoluteFill>
      <Fenetre dessus={<Curseur x={c.x} y={c.y} clic={f < 80 ? A.onglet : A.statut} opacite={curseur} />}>
        <FonduPage
          p={versMembres}
          avant={<PageAssemblees />}
          apres={
            <PageMembres
              statut={filtre ? STATUT_NON : STATUT_TOUS}
              compte={filtre ? NON_ENSEIGNES : TOTAL_MEMBRES}
              lignes={filtre ? MEMBRES_NON_ENSEIGNES : MEMBRES_TOUS}
              opaciteLignes={lignes}
              haloOnglet={haloEntre(f, A.onglet - 6, A.onglet + 30)}
              haloStatut={haloEntre(f, A.statut - 4, A.statut + 30)}
              haloCompte={haloEntre(f, A.statut + 20, 232)}
            />
          }
        />
      </Fenetre>
      <Legende lignes={LEGENDES.p6Membres} duree={DUREE_P6} debut={36} fin={130} />
      <Legende lignes={LEGENDES.p6Accompagner} duree={DUREE_P6} debut={140} />
    </AbsoluteFill>
  );
};

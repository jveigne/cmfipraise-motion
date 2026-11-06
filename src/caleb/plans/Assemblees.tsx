import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { Appui, LegendeEtude, Voile, haloEntre, lisse, montee, voilePour } from '../../etude/plans/commun';
import { LEGENDES } from '../textes';
import { EcranHierarchieCaleb, Y_HIER, ligneArbre, rangeeArbre } from '../ecrans/Hierarchie';
import { EcranAssembleeOuest, EcranCompteRenduOuest, PT_ASSEMBLEE } from '../ecrans/Assemblee';

/**
 * Partie « 2 · Les assemblées » : P5, le bloc « Vie d'assemblée » de la Hiérarchie (réunions,
 * présences, fraction du pain, l'alerte « sans compte rendu depuis 3 semaines » sur Paris Sud, le
 * journal PDF de toute la chaîne) ; P6, depuis l'arbre, les comptes rendus de Paris Ouest — en
 * lecture : Daniel n'en est pas le dirigeant.
 */
export const DUREE_P5 = 330;
/** P6 : plan tampon du calage musical, durée calculée dans `calage.ts` (240 images au moins). */
export const DUREE_P6_MIN = 240;

// ---------------------------------------------------------------------------------------------
// P5 — les statistiques

const D_VIE = -(Y_HIER.vie - 90);

export const P5Stats: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [28, 44, 300, 316], [1, 1.35, 1.35, 1]);
  // Caméra : les cases, puis l'alerte, puis le bouton du journal.
  const foyerY = doux(f, [138, 152, 222, 238], [Y_HIER.cases, Y_HIER.alerte, Y_HIER.alerte, Y_HIER.journal.y]) + D_VIE;
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={{ x: 195, y: foyerY }} decalageY={montee(f, fps)}>
        <EcranHierarchieCaleb
          defilement={D_VIE}
          halos={{
            reunions: haloEntre(f, 48, 82),
            moyenne: haloEntre(f, 72, 106),
            pain: haloEntre(f, 96, 134),
            alerte: haloEntre(f, 154, 220),
            journal: haloEntre(f, 240, 312),
          }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeEtude lignes={LEGENDES.p5Stats} duree={DUREE_P5} debut={6} fin={140} />
      <LegendeEtude lignes={LEGENDES.p5Alerte} duree={DUREE_P5} debut={144} fin={226} />
      <LegendeEtude lignes={LEGENDES.p5Journal} duree={DUREE_P5} debut={230} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P6 — les comptes rendus d'une assemblée de la chaîne

/** L'arbre défilé sur Samuel et Paris Ouest. */
const D_OUEST = -(rangeeArbre('samuel').haut - 210);

export const P6CompteRendu: React.FC<{ duree: number }> = ({ duree: D }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ligne = ligneArbre('ouest');
  const versAssemblee = lisse(f, fps, 56, 16);
  // Le compte rendu s'ouvre à mi-plan (au moins 150 images après le début), puis défile vers les présents.
  const ouverture = Math.max(160, Math.round(D * 0.52));
  const versCr = lisse(f, fps, ouverture + 4, 16);
  const defilCr = doux(f, [ouverture + 70, ouverture + 100], [0, -150]);
  return (
    <AbsoluteFill>
      <Plateau
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui x={ligne.x} y={ligne.y + D_OUEST} a={52} coupe={60} />
            <Appui x={PT_ASSEMBLEE.reunion8.x} y={PT_ASSEMBLEE.reunion8.y} a={ouverture} coupe={ouverture + 8} />
          </>
        }
      >
        <Pile
          p={versAssemblee}
          dessous={<EcranHierarchieCaleb defilement={D_OUEST} halos={{ ligneOuest: haloEntre(f, 18, 52) }} />}
          dessus={
            <Pile
              p={versCr}
              dessous={
                <EcranAssembleeOuest
                  haloSelecteur={haloEntre(f, 78, 112)}
                  haloLecture={haloEntre(f, 108, ouverture - 18)}
                  haloReunion={haloEntre(f, ouverture - 16, ouverture + 2)}
                />
              }
              dessus={
                <EcranCompteRenduOuest
                  defilement={defilCr}
                  haloInfos={haloEntre(f, ouverture + 26, ouverture + 66)}
                  haloPresents={haloEntre(f, ouverture + 100, D - 10)}
                />
              }
            />
          }
        />
      </Plateau>
      <LegendeEtude lignes={LEGENDES.p6Assemblee} duree={D} debut={6} fin={ouverture - 6} />
      <LegendeEtude lignes={LEGENDES.p6Detail} duree={D} debut={ouverture} />
    </AbsoluteFill>
  );
};

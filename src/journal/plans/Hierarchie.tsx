import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useJournal } from '../langue';
import { EcranAccueilDaniel, EcranHierarchie, PT_HIER } from '../ecrans/Hierarchie';
import { PAGE, PageConsolidee } from '../ui/Pages';
import { Appui, Decale, LegendeJournal, Voile, borne, lisse, montee, voilePour } from './commun';

/**
 * Partie « 4 · Hiérarchie » (P16–P17) : Daniel Mercier, dirigeant de la ville de Paris (EN :
 * Daniel Morgan, Leeds), voit les
 * statistiques de ses trois assemblées dans sa Hiérarchie, l'alerte « sans compte rendu depuis
 * 3 semaines » (un affichage : ni notification ni relance), et sort le journal de toutes ses
 * assemblées dans un seul PDF — que des nombres, aucun nom (D-ASM-18). Réponse au problème 3 du
 * cahier : « la ville ne voit rien ».
 */
export const DUREE_H1 = 210;
export const DUREE_H2 = 135;

/** Défilement de la Hiérarchie qui amène le bloc « Vie d'assemblée » au centre. */
const DEF = -150;

// ---------------------------------------------------------------------------------------------
// P16 — Le dirigeant de ville : statistiques et alerte

export const H1Stats: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { legendes } = useJournal();
  const zoom = doux(f, [84, 100, 190, 205], [1, 1.35, 1.35, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: PT_HIER.cases.y + DEF + 30 }}
        decalageY={montee(f, fps)}
        dessus={<Appui {...PT_HIER.tuileHierarchie} a={46} coupe={54} />}
      >
        <Pile
          p={lisse(f, fps, 50, 16)}
          dessous={<EcranAccueilDaniel haloHierarchie={doux(f, [26, 32, 40, 46], [0, 1, 1, 0])} />}
          dessus={
            <EcranHierarchie
              defilement={doux(f, [70, 84], [0, DEF])}
              haloCases={doux(f, [100, 108, 122, 128], [0, 1, 1, 0])}
              haloAlerte={doux(f, [134, 142, 182, 190], [0, 1, 1, 0])}
            />
          }
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <LegendeJournal lignes={legendes.p16Stats} duree={DUREE_H1} debut={6} fin={120} />
      <LegendeJournal lignes={legendes.p16Alerte} duree={DUREE_H1} debut={124} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P17 — Plusieurs assemblées, un seul PDF

const E_PAGE = 0.74;
const POSE = { x: 446, y: 520 };
/** Caméra : zoom sur le tableau « Assemblées » de la page (coordonnées de page ≈ 470). */
const FOYER = { x: POSE.x + (PAGE.largeur / 2) * E_PAGE, y: POSE.y + 520 * E_PAGE };
const CIBLE = { x: 540, y: 1000 };
const ZOOM_PAGE = 1.9;

export const H2Consolide: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { legendes } = useJournal();
  const decale = doux(f, [36, 56], [0, 1]);
  const page = spring({ frame: f - 38, fps, config: { damping: 15, mass: 0.8 } });
  const z = doux(f, [60, 74, 112, 124], [1, ZOOM_PAGE, ZOOM_PAGE, 1]);
  const k = (z - 1) / (ZOOM_PAGE - 1);
  const sortie = doux(f, [122, 135], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie }}>
      <AbsoluteFill
        style={{
          transform: `translate(${(CIBLE.x - FOYER.x) * k}px, ${(CIBLE.y - FOYER.y) * k}px) scale(${z})`,
          transformOrigin: `${FOYER.x}px ${FOYER.y}px`,
        }}
      >
        <Decale dx={-300 * decale} reduction={1 - 0.28 * decale}>
          <Plateau dessus={<Appui x={PT_HIER.journalTout.x} y={PT_HIER.journalTout.y + DEF} a={18} />}>
            <EcranHierarchie defilement={DEF} haloJournal={doux(f, [6, 10, 14, 18], [0, 1, 1, 0])} generation={f >= 20 && f < 36} />
          </Plateau>
        </Decale>
        {f >= 38 ? (
          <div
            style={{
              position: 'absolute',
              left: POSE.x,
              top: POSE.y + (1 - page) * 300,
              transform: `scale(${0.3 + 0.7 * page})`,
              transformOrigin: '20% 50%',
              opacity: borne(page * 2),
            }}
          >
            <PageConsolidee echelle={E_PAGE} haloLigne={doux(f, [76, 84, 104, 112], [0, 1, 1, 0])} />
          </div>
        ) : null}
      </AbsoluteFill>
      <Voile force={voilePour(z)} />
      <LegendeJournal lignes={legendes.p17} duree={DUREE_H2} />
    </AbsoluteFill>
  );
};

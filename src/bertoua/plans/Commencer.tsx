import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useEtude } from '../../etude/langue';
import { EcranAccueil, TUILE_ETUDE } from '../../etude/ecrans/Accueil';
import { Appui, LegendeEtude, PastillePersonne, Voile, Y_PASTILLE, haloEntre, lisse, montee, voilePour } from '../../etude/plans/commun';
import { EcranBriefing } from '../../guide/ecrans/Etude';
import { TEXTES_GUIDE } from '../../guide/textes';
import { EcranProgramme, PT_PROGRAMME } from '../ecrans/Programme';
import { EcranSeanceDirigeant, positionsDirigeant } from '../ecrans/SeanceDirigeant';
import { CARTONS, LEGENDES } from '../textes';

/**
 * Partie « 1 · Commencer » (après la lecture de P6 d'« Étude », reprise telle quelle) :
 * - A1 : Samuel touche la tuile « Le Message de Bertoua » ; le programme — l'unité UEMB002, l'unité
 *   suivante verrouillée par son prérequis (D-ETU-19) ; il ouvre l'unité, la leçon 1, *Commencer* ;
 * - A2 : la feuille « À lire avant la leçon » (D-ETU-34/35) : présentation de l'unité,
 *   recommandations pour la leçon (pour le dirigeant seul), aperçu de ce que chaque membre devra
 *   faire ;
 * - A3 : la question de départ (D-ETU-49 : toute la leçon par défaut), *Commencer* ; la séance
 *   s'ouvre, et le bloc « Notes du dirigeant » du panneau garde ces notes sous la main.
 */
export const DUREE_A1 = 330;
export const DUREE_A2 = 270;
export const DUREE_A3 = 330;

const G = TEXTES_GUIDE.fr.app;

/** Le bouton *Commencer* de la feuille (modale de hauteur 844 − 96 : 796 − 18 − 44 − 8 − 24). */
const COMMENCER_FEUILLE = { x: 195, y: 702 };
/** Défilement de la feuille qui montre la question de départ (relevé dans « Guide »). */
const DEF_DEPART = -150;

const Samuel: React.FC<{ texte?: string }> = ({ texte = CARTONS.pastilles.samuel }) => {
  const f = useCurrentFrame();
  return (
    <PastillePersonne x={540} y={Y_PASTILLE} opacite={doux(f, [4, 14], [0, 1])}>
      {texte}
    </PastillePersonne>
  );
};

// ---------------------------------------------------------------------------------------------
// A1 — La tuile, le programme, la leçon 1

const A1_ = { tuile: 50, unite: 246, commencer: 314 } as const;

export const A1Programme: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: A, d } = useEtude();
  const p = lisse(f, fps, A1_.tuile + 4, 16);
  const ouverture = doux(f, [A1_.unite + 2, A1_.unite + 14], [0, 1]);
  const zoom = doux(f, [168, 182, 232, 244], [1, 1.18, 1.18, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: PT_PROGRAMME.verrou(0).y - 40 }}
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui {...TUILE_ETUDE} a={A1_.tuile} coupe={A1_.tuile + 8} />
            <Appui {...PT_PROGRAMME.unite} a={A1_.unite} coupe={A1_.unite + 10} />
            <Appui {...PT_PROGRAMME.commencer1} a={A1_.commencer} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={<EcranAccueil date={A.dateSamuel} prenom={d.PERSONNES.samuel.prenom} initiales={d.PERSONNES.samuel.initiales} dirigeant haloTuile={haloEntre(f, 20, A1_.tuile)} />}
          dessus={
            <EcranProgramme
              ouverture={ouverture}
              haloUnite={haloEntre(f, 100, 166)}
              haloVerrou={haloEntre(f, 176, 238)}
              haloLecon1={haloEntre(f, 266, A1_.commencer)}
            />
          }
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Samuel />
      <LegendeEtude lignes={LEGENDES.a1Tuile} duree={DUREE_A1} fin={92} />
      <LegendeEtude lignes={LEGENDES.a1Programme} duree={DUREE_A1} debut={96} fin={168} />
      <LegendeEtude lignes={LEGENDES.a1Verrou} duree={DUREE_A1} debut={172} fin={238} />
      <LegendeEtude lignes={LEGENDES.a1Lecon} duree={DUREE_A1} debut={242} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// A2 — « À lire avant la leçon »

/** La feuille posée sur le programme (leçon 1 dépliée), comme le `SousBriefing` de « Guide ». */
const Feuille: React.FC<{ p: number; defilement: number; haloNotes?: number; haloPlage?: number }> = ({ p, defilement, haloNotes, haloPlage }) => (
  <>
    <EcranProgramme ouverture={1} />
    {p > 0.001 ? (
      <div style={{ position: 'absolute', inset: 0, opacity: p }}>
        <EcranBriefing depart="1" defilement={defilement} haloNotes={haloNotes} haloPlage={haloPlage} />
      </div>
    ) : null}
  </>
);

export const A2Briefing: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = doux(f, [92, 106, 176, 190], [1, 1.16, 1.16, 1]);
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={{ x: 195, y: 300 }}>
        <Feuille p={doux(f, [0, 8], [0, 1])} defilement={0} haloNotes={haloEntre(f, 98, 178)} />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Samuel />
      <LegendeEtude lignes={LEGENDES.a2Lire} duree={DUREE_A2} fin={88} />
      <LegendeEtude lignes={LEGENDES.a2Notes} duree={DUREE_A2} debut={92} fin={180} />
      <LegendeEtude lignes={LEGENDES.a2Actions} duree={DUREE_A2} debut={184} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// A3 — La question de départ, *Commencer*, la séance ouverte, les notes du dirigeant

const A3_ = { commencer: 150, notes: 236 } as const;

export const A3Depart: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: A } = useEtude();
  const plage = [A.lesson(1), G.range('1', '31')].join(' · ');
  const pos = positionsDirigeant('REPONSES_OUVERTES');
  const defFeuille = doux(f, [8, 28], [0, DEF_DEPART]);
  const fermeture = 1 - doux(f, [A3_.commencer + 2, A3_.commencer + 8], [0, 1]);
  const p = lisse(f, fps, A3_.commencer + 6, 16);
  const notes = doux(f, [A3_.notes + 4, A3_.notes + 24], [0, 1]);
  const defSeance = doux(f, [A3_.notes + 4, A3_.notes + 24], [0, -(pos.notes.y - 230)]);
  const zoom = doux(f, [30, 44, 128, 142, 248, 262], [1, 1.14, 1.14, 1, 1, 1.12]);
  const foyer = f < 200 ? { x: 195, y: 520 } : { x: 195, y: 420 };
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={foyer}
        dessus={
          <>
            <Appui {...COMMENCER_FEUILLE} a={A3_.commencer} coupe={A3_.commencer + 8} />
            <Appui {...pos.notes} a={A3_.notes} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={<Feuille p={fermeture} defilement={defFeuille} haloPlage={haloEntre(f, 34, 136)} />}
          dessus={
            <EcranSeanceDirigeant
              statut="REPONSES_OUVERTES"
              plage={plage}
              repondants={0}
              notes={notes}
              defilement={defSeance}
              halos={{ pastille: haloEntre(f, 172, 222), plage: haloEntre(f, 180, 222), notes: haloEntre(f, 226, A3_.notes + 6), corps: haloEntre(f, 266, DUREE_A3 - 4) }}
            />
          }
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Samuel />
      <LegendeEtude lignes={LEGENDES.a3Depart} duree={DUREE_A3} fin={74} />
      <LegendeEtude lignes={LEGENDES.a3Defaut} duree={DUREE_A3} debut={78} fin={144} />
      <LegendeEtude lignes={LEGENDES.a3Commencer} duree={DUREE_A3} debut={148} fin={226} />
      <LegendeEtude lignes={LEGENDES.a3Notes} duree={DUREE_A3} debut={230} />
    </AbsoluteFill>
  );
};

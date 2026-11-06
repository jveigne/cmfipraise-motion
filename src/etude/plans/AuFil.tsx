import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useEtude } from '../langue';
import { Enveloppe, Frise } from '../ui/Annotations';
import { EcranAccueil, TUILE_ETUDE } from '../ecrans/Accueil';
import { EcranVueEnsemble, rangeeAssemblee } from '../ecrans/AccueilEtude';
import { EcranSeance, positionsSeance } from '../ecrans/Seance';
import { EcranAvancementAssemblee, EcranMaProgression, PT_PROGRESSION, centreMembre } from '../ecrans/Progression';
import {
  Appui,
  Decale,
  LegendeEtude,
  PastillePersonne,
  Poses,
  Ralenti,
  Y_PASTILLE,
  dureeRalentie,
  haloEntre,
  imageRalentie,
  lisse,
  montee,
} from './commun';

/**
 * Partie « 5 · Au fil des réunions » (P17–P18) : dimanche après dimanche, trois leçons sur cinq ;
 * Marie voit sa progression (D-ETU-10, RG-ETU-17) ; Daniel, dirigeant de la ville de Paris, voit
 * l'avancement des assemblées et les notes (D-ETU-08), jamais le contenu des copies : la progression
 * de Marie s'ouvre sans aucun chevron vers ses copies (D-ETU-09, RG-ETU-13). Poses du retour JP du
 * 21/10 (`Ralenti`).
 */
/** P17 : la frise des dimanches, puis « 3 / 5 leçons » et la note cumulée tenues. */
const POSES_P17: Poses = [
  [69, 30],
  [175, 30],
];
/** P18 : l'avancement des assemblées, celui de Paris Ouest, l'enveloppe fermée. */
const POSES_P18: Poses = [
  [88, 15],
  [148, 30],
  [232, 45],
];
export const DUREE_P17 = dureeRalentie(210, POSES_P17);
export const DUREE_P18 = dureeRalentie(270, POSES_P18);

/** Téléphone décalé à gauche pour libérer la droite à une annotation. */
const DX = -235;
const REDUCTION = 0.78;

// ---------------------------------------------------------------------------------------------
// P17 — Dimanche après dimanche : 3 leçons sur 5

export const P17Progression: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P17);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P17}>
        <P17Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p17Dimanches} duree={DUREE_P17} fin={n(96)} />
      <LegendeEtude lignes={legendes.p17Progression} duree={DUREE_P17} debut={n(100)} />
    </AbsoluteFill>
  );
};

const P17Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { cartons: CARTONS, d } = useEtude();
  const { COPIES_FINALES, NOTES, QUESTIONS } = d;
  const A = { progression: 78 } as const;
  const p = lisse(f, fps, A.progression + 4, 16);
  const pts = positionsSeance(QUESTIONS, { statut: 'TERMINEE', copie: COPIES_FINALES.marie });
  // « Ma progression » de la carte « Ma note » (bouton fantôme, aligné à gauche).
  const bouton = { x: 122, y: pts.noteFinale.y + 26 + 14 + 22 };
  // Zoom léger : le téléphone décalé ne doit ni sortir du cadre ni mordre sur la frise.
  const zoom = doux(f, [104, 116, 168, 180], [1, 1.15, 1.15, 1]);
  const frise = (i: number) => (i < 3 ? doux(f, [18 + i * 16, 28 + i * 16], [0, 1]) : doux(f, [62, 72], [0, 1]));
  return (
    <AbsoluteFill>
      <Decale dx={DX} reduction={REDUCTION}>
        <Plateau zoom={zoom} foyer={{ x: 195, y: PT_PROGRESSION.barre.y }} decalageY={montee(f, fps)} dessus={<Appui {...bouton} a={A.progression} coupe={A.progression + 6} />}>
          <Pile
            p={p}
            dessous={<EcranSeance statut="TERMINEE" copie={COPIES_FINALES.marie} note={NOTES.marie} />}
            dessus={
              <EcranMaProgression
                mienne
                remplissage={doux(f, [100, 160], [0, 1])}
                haloLecons={haloEntre(f, 112, 172)}
                haloCumul={haloEntre(f, 170, 202)}
              />
            }
          />
        </Plateau>
        <PastillePersonne x={540} y={Y_PASTILLE - 70} taille={34}>
          {CARTONS.pastilles.marie}
        </PastillePersonne>
      </Decale>
      <Frise x={625} y={760} allumes={frise} opacite={1 - doux(f, [196, 210], [0, 1])} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P18 — La ville voit l'avancement, jamais les réponses personnelles

export const P18Ville: React.FC = () => {
  const { legendes } = useEtude();
  const n = (a: number) => imageRalentie(a, POSES_P18);
  return (
    <AbsoluteFill>
      <Ralenti poses={POSES_P18}>
        <P18Coeur />
      </Ralenti>
      <LegendeEtude lignes={legendes.p18Avancement} duree={DUREE_P18} fin={n(110)} />
      <LegendeEtude lignes={legendes.p18Notes} duree={DUREE_P18} debut={n(112)} fin={n(186)} />
      <LegendeEtude lignes={legendes.p18Perso} duree={DUREE_P18} debut={n(190)} />
    </AbsoluteFill>
  );
};

const P18Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: APP, cartons: CARTONS, d } = useEtude();
  const { ASSEMBLEE, ASSEMBLEES_PARIS, MEMBRES_PARIS_OUEST, PERSONNES } = d;
  const A = { tuile: 38, ouest: 114, marie: 170 } as const;
  const p1 = lisse(f, fps, A.tuile + 4, 16);
  const p2 = lisse(f, fps, A.ouest + 4, 16);
  const p3 = lisse(f, fps, A.marie + 4, 16);
  const DEF = -330;
  const defilement = doux(f, [150, 166], [0, DEF]);
  const decale = doux(f, [194, 210], [0, 1]);
  const sortie = doux(f, [258, 270], [0, 1]);
  const marie = { x: 195, y: centreMembre(MEMBRES_PARIS_OUEST.findIndex((m) => m.nom === PERSONNES.marie.nom)) + DEF };
  return (
    <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateY(${sortie * 140}px)` }}>
      <Decale dx={DX * decale} reduction={1 - (1 - REDUCTION) * decale}>
        <Plateau
          decalageY={montee(f, fps)}
          dessus={
            <>
              <Appui {...TUILE_ETUDE} a={A.tuile} coupe={A.tuile + 6} />
              <Appui {...rangeeAssemblee(ASSEMBLEES_PARIS.findIndex((a) => a.nom === ASSEMBLEE))} a={A.ouest} coupe={A.ouest + 6} />
              <Appui {...marie} a={A.marie} coupe={A.marie + 6} />
            </>
          }
        >
          <Pile
            p={p1}
            dessous={<EcranAccueil date={APP.dateDaniel} prenom={PERSONNES.daniel.prenom} initiales={PERSONNES.daniel.initiales} dirigeant haloTuile={haloEntre(f, 18, 38)} />}
            dessus={
              <Pile
                p={p2}
                dessous={<EcranVueEnsemble haloOuest={haloEntre(f, 62, 110)} />}
                dessus={
                  <Pile
                    p={p3}
                    dessous={<EcranAvancementAssemblee defilement={defilement} haloLecons={haloEntre(f, 136, 160)} haloMarie={haloEntre(f, 160, 172)} />}
                    dessus={<EcranMaProgression mienne={false} haloListe={haloEntre(f, 214, 264)} />}
                  />
                }
              />
            }
          />
        </Plateau>
        <PastillePersonne x={540} y={Y_PASTILLE - 70 * decale} taille={30 + 4 * decale}>
          {CARTONS.pastilles.daniel}
        </PastillePersonne>
      </Decale>
      <Enveloppe x={660} y={900} p={doux(f, [206, 222], [0, 1])} cadenas={doux(f, [224, 232], [0, 1])} />
    </AbsoluteFill>
  );
};

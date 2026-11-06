import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { useEtude } from '../../etude/langue';
import { EcranAccueil, TUILE_ETUDE } from '../../etude/ecrans/Accueil';
import { EcranAccueilDirigeant, PT_ACCUEIL_ETUDE } from '../../etude/ecrans/AccueilEtude';
import { FournisseurJournal } from '../../journal/langue';
import { EcranVieAssemblee, PT_VIE } from '../../journal/ecrans/VieAssemblee';
import { EcranCompteRendu } from '../../journal/ecrans/CompteRendu';
import { journalGuide } from '../../guide/donnees';
import { CARTONS, LEGENDES } from '../textes';
import { FICHES, FICHE_JOEL, SAMUEL } from '../donnees';
import { EcranBrebis } from '../ecrans/Brebis';
import { BarreOnglets6, ONGLETS6, TamponGratuit } from '../ui/Habillage';
import {
  Appui,
  DUREE_PLAN,
  DeuxLegendes,
  PastillePersonne,
  Y_PASTILLE,
  haloEntre,
  lisse,
  montee,
  opacitePersonne,
} from './commun';

/**
 * Partie « 1 · Son assemblée » : Samuel Fotso, dirigeant de l'assemblée Paris Ouest (celle
 * d'« Étude » et de « Guide »). Un plan par idée :
 * - P2 : le Message de Bertoua dans son assemblée (tuile de l'accueil → accueil de l'étude) ;
 * - P3 : la vie de son assemblée (réunions, « Nouveau CR », « Journal PDF », un compte rendu) ;
 * - P4 : le suivi des brebis de son assemblée (statuts, dernières présences).
 */
export const DUREE_P2 = DUREE_PLAN;
export const DUREE_P3 = DUREE_PLAN;
export const DUREE_P4 = DUREE_PLAN;

/** Bascule de la légende « idée » vers la légende « explication ». */
const BASCULE = 140;

const PersonneSamuel: React.FC<{ duree: number }> = ({ duree }) => {
  const f = useCurrentFrame();
  return (
    <PastillePersonne x={540} y={Y_PASTILLE} opacite={opacitePersonne(f, duree)}>
      {CARTONS.personnes.samuel}
    </PastillePersonne>
  );
};

// ---------------------------------------------------------------------------------------------
// P2 — Le Message de Bertoua dans son assemblée

const A2 = { tuile: 70, unite: 116 } as const;

export const P2Bertoua: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: APP_ETUDE } = useEtude();
  const p = lisse(f, fps, A2.tuile + 4, 16);
  const ouverture = doux(f, [A2.unite + 4, A2.unite + 16], [0, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui {...TUILE_ETUDE} a={A2.tuile} coupe={A2.tuile + 6} />
            <Appui {...PT_ACCUEIL_ETUDE.unite} a={A2.unite} coupe={A2.unite + 10} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={
            <>
              <EcranAccueil date={APP_ETUDE.dateSamuel} prenom={SAMUEL.prenom} initiales={SAMUEL.initiales} dirigeant haloTuile={haloEntre(f, 34, 72)} />
              <BarreOnglets6 actif={ONGLETS6.accueil} />
            </>
          }
          dessus={<EcranAccueilDirigeant ouverture={ouverture} haloUnite={haloEntre(f, 96, 118)} haloLecon1={haloEntre(f, 160, 226)} />}
        />
      </Plateau>
      <PersonneSamuel duree={DUREE_P2} />
      <TamponGratuit a={28} />
      <DeuxLegendes idee={LEGENDES.p2} explication={LEGENDES.p2Explication} bascule={BASCULE} duree={DUREE_P2} />
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------------------------
// P3 — La vie de son assemblée

const JOURNAL_PARIS_OUEST = journalGuide('fr');
const A3 = { premiere: 150 } as const;

export const P3Vie: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d = JOURNAL_PARIS_OUEST.d;
  const p = lisse(f, fps, A3.premiere + 4, 16);
  const defilementCr = doux(f, [190, 222], [0, -230]);
  return (
    <FournisseurJournal valeur={JOURNAL_PARIS_OUEST}>
      <AbsoluteFill>
        <Plateau dessus={<Appui {...PT_VIE.premiereReunion} a={A3.premiere} coupe={A3.premiere + 6} />}>
          <Pile
            p={p}
            dessous={
              <EcranVieAssemblee
                onglet="reunions"
                reunions={[d.REUNION_DU_JOUR, ...d.REUNIONS_2026]}
                haloNouveau={haloEntre(f, 30, 78)}
                haloJournal={haloEntre(f, 84, 132)}
                haloPremiere={haloEntre(f, 136, 152)}
              />
            }
            dessus={<EcranCompteRendu defilement={defilementCr} />}
          />
          <BarreOnglets6 actif={ONGLETS6.assemblee} />
        </Plateau>
        <PersonneSamuel duree={DUREE_P3} />
        <TamponGratuit a={22} />
        <DeuxLegendes idee={LEGENDES.p3} explication={LEGENDES.p3Explication} bascule={BASCULE - 50} duree={DUREE_P3} />
      </AbsoluteFill>
    </FournisseurJournal>
  );
};

// ---------------------------------------------------------------------------------------------
// P4 — Le suivi des brebis de son assemblée

export const P4Brebis: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrees = FICHES.map((_, i) => lisse(f, fps, 8 + i * 4, 14));
  const defilement = doux(f, [124, 150], [0, -250]);
  return (
    <AbsoluteFill>
      <Plateau>
        <EcranBrebis
          entrees={entrees}
          haloStatuts={haloEntre(f, 64, 118)}
          haloLigne={{ index: FICHE_JOEL, intensite: haloEntre(f, 156, 236) }}
          defilement={defilement}
        />
      </Plateau>
      <PersonneSamuel duree={DUREE_P4} />
      <TamponGratuit a={22} />
      <DeuxLegendes idee={LEGENDES.p4} explication={LEGENDES.p4Explication} bascule={BASCULE} duree={DUREE_P4} />
    </AbsoluteFill>
  );
};

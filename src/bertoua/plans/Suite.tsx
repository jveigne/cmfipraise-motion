import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Pile } from '../../ui/Pile';
import { FournisseurEtude, useEtude } from '../../etude/langue';
import { Alerte, boutonsAlerte } from '../../etude/ui/Alerte';
import { EcranSeance } from '../../etude/ecrans/Seance';
import { miseEnPage } from '../../etude/ecrans/Questions';
import { Appui, LegendeEtude, PastillePersonne, Voile, Y_PASTILLE, haloEntre, lisse, montee, voilePour } from '../../etude/plans/commun';
import { EcranAccueilRose, EcranAccueilSuite, EcranBriefing, EcranProgressionPartielle, EcranRattrapage } from '../../guide/ecrans/Etude';
import { copieRose, copiesMarie } from '../../guide/donnees';
import { TEXTES_GUIDE } from '../../guide/textes';
import { EcranSeanceDirigeant } from '../ecrans/SeanceDirigeant';
import { ETUDE_LECON, ETUDE_PLAGE1, ETUDE_PLAGE2 } from '../donnees';
import { APP, CARTONS, LEGENDES } from '../textes';

/**
 * Partie « 5 · La suite » (avenant 05, leçon en plusieurs séances, et rattrapage) :
 * - E1 : le soir du 25 octobre, la progression de Marie — leçon 1 commencée, « 6 / 9 questions »,
 *   8,5 / 13 (D-ETU-42/43) ;
 * - E2 : Rose, absente, rattrape la séance à la maison le mercredi (D-ETU-44) : « À rattraper »,
 *   *Rattraper*, elle répond seule, sans réponses du manuel avant l'envoi, *Envoyer ma copie* ; ses
 *   réponses écrites attendront l'avis du dirigeant (`catchUpSubmitConfirm`) ;
 * - E3 : dimanche 1er novembre, Samuel : « Déjà traitées : questions 1 à 11 », *Continuer* ; la
 *   question de départ est déjà la 12 (D-ETU-39) ; *Commencer* ;
 * - E4 : Marie retrouve ses réponses déjà données aux questions 12 à 31 (D-ETU-41).
 * Écrans de « Guide » (avenants 04 et 05), posés en 9:16 comme ceux d'« Étude ».
 */
export const DUREE_E1 = 180;
export const DUREE_E2 = 390;
export const DUREE_E3 = 330;
export const DUREE_E4 = 240;

const G = TEXTES_GUIDE.fr.app;

const Personne: React.FC<{ texte: string }> = ({ texte }) => {
  const f = useCurrentFrame();
  return (
    <PastillePersonne x={540} y={Y_PASTILLE} opacite={doux(f, [4, 14], [0, 1])}>
      {texte}
    </PastillePersonne>
  );
};

// ---------------------------------------------------------------------------------------------
// E1 — Le soir : 6 / 9 questions

const E1Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [70, 84], [1, 1.16]);
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={{ x: 195, y: 330 }} decalageY={montee(f, fps)}>
        <EcranProgressionPartielle halo={haloEntre(f, 88, DUREE_E1 - 2)} />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Personne texte={CARTONS.pastilles.marieSoir} />
    </AbsoluteFill>
  );
};

export const E1Partiel: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <AbsoluteFill>
      <E1Coeur />
      <LegendeEtude lignes={LEGENDES.e1Soir} duree={DUREE_E1} fin={84} />
      <LegendeEtude lignes={LEGENDES.e1Partiel} duree={DUREE_E1} debut={88} />
    </AbsoluteFill>
  </FournisseurEtude>
);

// ---------------------------------------------------------------------------------------------
// E2 — Rose rattrape à la maison

const R = { rattraper: 60, envoyer: 262, confirmer: 304 } as const;
const LIGNES_ALERTE_R = 5;
/** « Rattraper » de la rangée « À rattraper » (relevé dans « Guide »). */
const PT_RATTRAPER = { x: 330, y: 290 };

/**
 * Haut de la liste de l'écran de rattrapage (points, défilement nul) : en-tête (167), portion (24),
 * plage (23), ligne d’état (36), carte « Rattrapage : … » sur trois lignes (14 + 83), compteur (14 + 18 + 10).
 */
const HAUT_LISTE_R = 167 + 24 + 23 + 36 + 14 + 83 + 14 + 18 + 10;

const E2Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { d } = useEtude();
  const copie = copieRose('fr');
  const liste = miseEnPage(d.QUESTIONS, 'answer', copie).hauteur;
  const envoi = { x: 195, y: HAUT_LISTE_R + liste + 18 + 25 };
  const defFin = -(envoi.y - 640);
  const defilement = doux(f, [176, 236], [0, defFin]);
  const p = lisse(f, fps, R.rattraper + 4, 16);
  const boutons = boutonsAlerte(LIGNES_ALERTE_R, true);
  const alerte = doux(f, [R.envoyer + 4, R.envoyer + 16], [0, 1]) * (1 - doux(f, [R.confirmer + 2, R.confirmer + 8], [0, 1]));
  const zoom = doux(f, [96, 110, 160, 174], [1, 1.14, 1.14, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 320 }}
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui {...PT_RATTRAPER} a={R.rattraper} coupe={R.rattraper + 8} />
            <Appui x={envoi.x} y={envoi.y + defFin} a={R.envoyer} coupe={R.envoyer + 10} />
            <Appui {...boutons.confirmer} a={R.confirmer} coupe={R.confirmer + 6} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={<EcranAccueilRose halo={haloEntre(f, 18, R.rattraper)} />}
          dessus={<EcranRattrapage copie={copie} defilement={defilement} haloAvis={haloEntre(f, 100, 172)} haloEnvoi={haloEntre(f, 238, R.envoyer + 4)} />}
        />
        <Alerte
          titre={APP.catchUpSubmitTitle}
          message={APP.catchUpSubmitConfirm(Object.keys(copie).length, d.QUESTIONS.filter((q) => q.type !== 'CONSIGNE').length)}
          confirmer={G.catchUpSubmit}
          lignes={LIGNES_ALERTE_R}
          empile
          p={alerte}
          appui={doux(f, [R.confirmer - 2, R.confirmer], [0, 1])}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Personne texte={CARTONS.pastilles.rose} />
    </AbsoluteFill>
  );
};

export const E2Rattrapage: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <AbsoluteFill>
      <E2Coeur />
      <LegendeEtude lignes={LEGENDES.e2Absente} duree={DUREE_E2} fin={94} />
      <LegendeEtude lignes={LEGENDES.e2Envoi} duree={DUREE_E2} debut={98} fin={172} />
      <LegendeEtude lignes={LEGENDES.e2Seule} duree={DUREE_E2} debut={176} fin={262} />
      <LegendeEtude lignes={LEGENDES.e2Avis} duree={DUREE_E2} debut={266} />
    </AbsoluteFill>
  </FournisseurEtude>
);

// ---------------------------------------------------------------------------------------------
// E3 — Dimanche 1er novembre : la suite

const S3 = { continuer: 64, commencer: 210 } as const;
/** « Continuer » de la leçon 1 (relevé dans « Guide ») ; *Commencer* de la feuille. */
const PT_CONTINUER = { x: 322, y: 395 };
const PT_COMMENCER = { x: 195, y: 702 };

const E3Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: A } = useEtude();
  const feuille = doux(f, [S3.continuer + 4, S3.continuer + 12], [0, 1]) * (1 - doux(f, [S3.commencer + 2, S3.commencer + 8], [0, 1]));
  const p = lisse(f, fps, S3.commencer + 6, 16);
  const zoom = doux(f, [96, 110, 196, 206], [1, 1.12, 1.12, 1]);
  return (
    <AbsoluteFill>
      <Plateau
        zoom={zoom}
        foyer={{ x: 195, y: 520 }}
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui {...PT_CONTINUER} a={S3.continuer} coupe={S3.continuer + 8} />
            <Appui {...PT_COMMENCER} a={S3.commencer} coupe={S3.commencer + 8} />
          </>
        }
      >
        <Pile
          p={p}
          dessous={
            <>
              <EcranAccueilSuite haloLecon={haloEntre(f, 14, S3.continuer)} />
              {feuille > 0.001 ? (
                <div style={{ position: 'absolute', inset: 0, opacity: feuille }}>
                  <EcranBriefing depart="12" couvertes={G.range('1', '11')} defilement={-230} haloPlage={haloEntre(f, 96, 204)} />
                </div>
              ) : null}
            </>
          }
          dessus={
            <FournisseurEtude valeur={ETUDE_PLAGE2}>
              <EcranSeanceDirigeant statut="REPONSES_OUVERTES" plage={[A.lesson(1), G.range('12', '31')].join(' · ')} halos={{ plage: haloEntre(f, 236, DUREE_E3 - 2), pastille: haloEntre(f, 236, 290) }} />
            </FournisseurEtude>
          }
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Personne texte={CARTONS.pastilles.samuelSuite} />
    </AbsoluteFill>
  );
};

export const E3Suite: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_LECON}>
    <AbsoluteFill>
      <E3Coeur />
      <LegendeEtude lignes={LEGENDES.e3Suite} duree={DUREE_E3} fin={94} />
      <LegendeEtude lignes={LEGENDES.e3Depart} duree={DUREE_E3} debut={98} fin={208} />
      <LegendeEtude lignes={LEGENDES.e3Commencer} duree={DUREE_E3} debut={212} />
    </AbsoluteFill>
  </FournisseurEtude>
);

// ---------------------------------------------------------------------------------------------
// E4 — Marie retrouve ses réponses

const E4Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: A } = useEtude();
  const zoom = doux(f, [8, 22], [1, 1.12]);
  return (
    <AbsoluteFill>
      <Plateau zoom={zoom} foyer={{ x: 195, y: 420 }} decalageY={montee(f, fps)}>
        <EcranSeance
          statut="REPONSES_OUVERTES"
          copie={copiesMarie('fr').reponses}
          repondues={3}
          enregistrement="saved"
          plage={[A.lesson(1), G.range('12', '31')].join(' · ')}
          halos={{ compteur: haloEntre(f, 14, 96), 'q12:numero': haloEntre(f, 40, 160), 'q13:numero': haloEntre(f, 40, 160), 'q31:numero': haloEntre(f, 40, 160) }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <Personne texte={CARTONS.pastilles.marieSuite} />
    </AbsoluteFill>
  );
};

export const E4Reprises: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE2}>
    <AbsoluteFill>
      <E4Coeur />
      <LegendeEtude lignes={LEGENDES.e4Reprises} duree={DUREE_E4} fin={88} />
      <LegendeEtude lignes={LEGENDES.e4Rien} duree={DUREE_E4} debut={92} fin={160} />
      <LegendeEtude lignes={LEGENDES.e4Faite} duree={DUREE_E4} debut={164} />
    </AbsoluteFill>
  </FournisseurEtude>
);

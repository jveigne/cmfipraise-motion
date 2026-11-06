import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Fondu } from '../../evenements/plans/commun';
import { FournisseurEtude, useEtude } from '../../etude/langue';
import { SalonFlou } from '../../etude/ui/Salon';
import { Alerte, boutonsAlerte } from '../../etude/ui/Alerte';
import { EcranSeance } from '../../etude/ecrans/Seance';
import { TROIS, pastillesTrois } from '../../etude/plans/Repondre';
import { DUREE_P16, P16Resultats } from '../../etude/plans/Terminer';
import { Appui, LegendeEtude, PastillePersonne, TelephoneLibre, Voile, Y_PASTILLE, haloEntre, largeurTel, montee, voilePour } from '../../etude/plans/commun';
import { CarteActions } from '../../guide/ecrans/Etude';
import { TEXTES_GUIDE } from '../../guide/textes';
import { EcranSeanceDirigeant, positionsDirigeant } from '../ecrans/SeanceDirigeant';
import { COPIES_TROIS, ETUDE_PLAGE1, NOTES_TROIS } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';

/**
 * Partie « 4 · Terminer » (séance du 25 octobre, questions 1 à 11, notes sur 11) :
 * - D1 : tous les avis sont posés, Samuel touche *Terminer* (alerte) ; « Séance terminée — 10 copies » ;
 *   chacun voit sa note (Jean 8, Marie 8,5, Esther 10,5) ;
 * - D2 : sous « Ma note », « Cette semaine, chaque membre doit : » (D-ETU-36 : les actions des
 *   membres, montrées à tous une fois la séance terminée) ;
 * - P16 d'« Étude » repris sur la plage 1 à 11 : les résultats, puis les copies papier du livret de
 *   Paul (9) et du cahier d'Hélène (8) — la note seule (D-ETU-13), après la correction (D-ETU-48).
 */
export const DUREE_D1 = 300;
export const DUREE_D2 = 210;
export { DUREE_P16 };

const G = TEXTES_GUIDE.fr.app;
const T = { terminer: 30, confirmer: 60 } as const;
const LIGNES_ALERTE = 3;

const D1Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: A, cartons, d } = useEtude();
  const plage = [A.lesson(1), G.range('1', '11')].join(' · ');
  const pos = positionsDirigeant('CORRECTION');
  const boutons = boutonsAlerte(LIGNES_ALERTE);
  const alerte = doux(f, [34, 46], [0, 1]) * (1 - doux(f, [T.confirmer + 2, T.confirmer + 8], [0, 1]));
  const bascule = doux(f, [64, 74], [0, 1]);
  const sortie = doux(f, [104, 118], [0, 1]);
  const PASTILLES = pastillesTrois(cartons);
  return (
    <AbsoluteFill>
      {sortie > 0.001 ? <SalonFlou opacite={sortie} /> : null}
      {sortie < 1 ? (
        <AbsoluteFill style={{ opacity: 1 - sortie, transform: `translateY(${sortie * 120}px)` }}>
          <Plateau
            zoom={1.12}
            foyer={{ x: 195, y: 330 }}
            decalageY={montee(f, fps)}
            dessus={
              <>
                <Appui {...pos.terminer} a={T.terminer} />
                <Appui {...boutons.confirmer} a={T.confirmer} coupe={T.confirmer + 6} />
              </>
            }
          >
            <Fondu
              p={bascule}
              avant={<EcranSeanceDirigeant statut="CORRECTION" plage={plage} repondants={d.REPONDANTS} avisRestants={0} halos={{ stat: haloEntre(f, 10, 34) }} />}
              apres={<EcranSeanceDirigeant statut="TERMINEE" plage={plage} repondants={d.REPONDANTS} halos={{ pastille: haloEntre(f, 70, 100), stat: haloEntre(f, 76, 104) }} />}
            />
            <Alerte
              titre={A.leader.finish}
              message={A.leader.finishConfirm}
              confirmer={A.leader.finish}
              lignes={LIGNES_ALERTE}
              p={alerte}
              appui={doux(f, [T.confirmer - 2, T.confirmer], [0, 1])}
            />
          </Plateau>
          <Voile force={voilePour(1.12)} />
          <PastillePersonne x={540} y={Y_PASTILLE}>
            {CARTONS.pastilles.samuel}
          </PastillePersonne>
        </AbsoluteFill>
      ) : null}

      {/* Les trois téléphones montent, chacun sur sa séance terminée : « Ma note », sur 11. */}
      {f >= 104
        ? TROIS.map((pose0, i) => {
            const monte = montee(f, fps, 108 + i * 6);
            const pose = { ...pose0, y: pose0.y + monte };
            const note = spring({ frame: f - (126 + i * 8), fps, config: { damping: 11 } });
            return (
              <React.Fragment key={i}>
                <TelephoneLibre pose={pose}>
                  <EcranSeance statut="TERMINEE" copie={COPIES_TROIS[i]} note={NOTES_TROIS[i]} apparitionNote={note} halos={{ noteFinale: haloEntre(f, 148, 286) }} />
                </TelephoneLibre>
                <PastillePersonne x={pose.x + largeurTel(pose.e) / 2} y={pose.y - 46} taille={24}>
                  {PASTILLES[i]}
                </PastillePersonne>
              </React.Fragment>
            );
          })
        : null}
    </AbsoluteFill>
  );
};

export const D1Notes: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <AbsoluteFill>
      <D1Coeur />
      <LegendeEtude lignes={LEGENDES.d1Terminer} duree={DUREE_D1} fin={100} />
      <LegendeEtude lignes={LEGENDES.d1Notes} duree={DUREE_D1} debut={104} />
    </AbsoluteFill>
  </FournisseurEtude>
);

const D2Coeur: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = doux(f, [64, 78], [1, 1.14]);
  return (
    <AbsoluteFill>
      <SalonFlou />
      <Plateau zoom={zoom} foyer={{ x: 195, y: 330 }} decalageY={montee(f, fps)}>
        <EcranSeance
          statut="TERMINEE"
          copie={COPIES_TROIS[1]}
          note={NOTES_TROIS[1]}
          defilement={doux(f, [34, 58], [0, -200])}
          apresNote={<CarteActions halo={haloEntre(f, 60, DUREE_D2 - 2)} />}
          halos={{ noteFinale: haloEntre(f, 8, 34) }}
        />
      </Plateau>
      <Voile force={voilePour(zoom)} />
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.marie}
      </PastillePersonne>
    </AbsoluteFill>
  );
};

export const D2Semaine: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <AbsoluteFill>
      <D2Coeur />
      <LegendeEtude lignes={LEGENDES.d2Semaine} duree={DUREE_D2} fin={112} />
      <LegendeEtude lignes={LEGENDES.d2Tous} duree={DUREE_D2} debut={116} />
    </AbsoluteFill>
  </FournisseurEtude>
);

/** P16 d'« Étude » sur la plage 1 à 11 : résultats sur 11, copies papier de Paul et d'Hélène. */
export const P16: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <P16Resultats />
  </FournisseurEtude>
);

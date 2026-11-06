import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { doux } from '../../anim';
import { Plateau } from '../../ui/Plateau';
import { Fondu } from '../../evenements/plans/commun';
import { FournisseurEtude, useEtude } from '../../etude/langue';
import { DUREE_P13, DUREE_P14, P13Fermees, P14Echange } from '../../etude/plans/Corriger';
import { Appui, LegendeEtude, PastillePersonne, Y_PASTILLE, haloEntre, montee } from '../../etude/plans/commun';
import { TEXTES_GUIDE } from '../../guide/textes';
import { EcranSeanceDirigeant, positionsDirigeant } from '../ecrans/SeanceDirigeant';
import { FeuilleArret, ptArret } from '../ecrans/Arret';
import { ETUDE_PLAGE1 } from '../donnees';
import { CARTONS, LEGENDES } from '../textes';

/**
 * Partie « 3 · Corriger ». C1 : Samuel touche *Passer à la correction* ; la feuille « S'arrêter
 * après la question : » (D-ETU-40) — le temps manque, il choisit la question 11 : les questions
 * suivantes sont retirées de cette séance et les réponses déjà données seront reprises à la
 * prochaine séance de la leçon (D-ETU-41) ; la séance passe en *Correction*, « questions 1 à 11 ».
 * Puis P13 (les fermées se corrigent seules, Q11 2 / 4) et P14 (on échange les téléphones, *Juste* /
 * *À préciser* / *À revoir*, la question personnelle masquée) d'« Étude », repris tels quels sur la
 * plage 1 à 11 (jeu `ETUDE_PLAGE1`).
 */
export const DUREE_C1 = 360;
export { DUREE_P13, DUREE_P14 };

const G = TEXTES_GUIDE.fr.app;
const C = { passer: 56, q11: 120, confirmer: 246 } as const;

export const C1Arret: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { app: A, d } = useEtude();
  const tete = d.QUESTIONS.filter((q) => !q.parent);
  const i11 = tete.findIndex((q) => q.numero === '11');
  const choix = f >= C.q11 + 2 ? '11' : tete[tete.length - 1].numero;
  const pos = positionsDirigeant('REPONSES_OUVERTES');
  const feuille = doux(f, [C.passer + 4, C.passer + 14], [0, 1]) * (1 - doux(f, [C.confirmer + 4, C.confirmer + 12], [0, 1]));
  const bascule = doux(f, [C.confirmer + 6, C.confirmer + 16], [0, 1]);
  const avant = <EcranSeanceDirigeant statut="REPONSES_OUVERTES" plage={[A.lesson(1), G.range('1', '31')].join(' · ')} repondants={ETUDE_PLAGE1.d.REPONDANTS} halos={{ stat: haloEntre(f, 14, 54) }} />;
  const apres = (
    <FournisseurEtude valeur={ETUDE_PLAGE1}>
      <EcranSeanceDirigeant
        statut="CORRECTION"
        plage={[A.lesson(1), G.range('1', '11')].join(' · ')}
        repondants={ETUDE_PLAGE1.d.REPONDANTS}
        avisRestants={ETUDE_PLAGE1.d.AVIS_RESTANTS}
        halos={{ pastille: haloEntre(f, 262, 340), plage: haloEntre(f, 262, 340), stat: haloEntre(f, 276, 352) }}
      />
    </FournisseurEtude>
  );
  return (
    <AbsoluteFill>
      <Plateau
        decalageY={montee(f, fps)}
        dessus={
          <>
            <Appui {...pos.passerCorrection} a={C.passer} coupe={C.passer + 10} />
            <Appui {...ptArret(tete.length, false).ligne(i11)} a={C.q11} coupe={C.q11 + 14} />
            <Appui {...ptArret(tete.length, true).passer} a={C.confirmer} coupe={C.confirmer + 10} />
          </>
        }
      >
        <Fondu p={bascule} avant={avant} apres={apres} />
        <FeuilleArret
          choix={choix}
          p={feuille}
          haloLigne={haloEntre(f, 74, 104) + haloEntre(f, C.q11 + 4, 172)}
          haloPied={haloEntre(f, 132, 238)}
          appui={doux(f, [C.confirmer - 2, C.confirmer + 4], [0, 1])}
        />
      </Plateau>
      <PastillePersonne x={540} y={Y_PASTILLE}>
        {CARTONS.pastilles.samuel}
      </PastillePersonne>
      <LegendeEtude lignes={LEGENDES.c1Repondu} duree={DUREE_C1} fin={80} />
      <LegendeEtude lignes={LEGENDES.c1Arret} duree={DUREE_C1} debut={84} fin={170} />
      <LegendeEtude lignes={LEGENDES.c1Suite} duree={DUREE_C1} debut={174} fin={246} />
      <LegendeEtude lignes={LEGENDES.c1Verrou} duree={DUREE_C1} debut={250} />
    </AbsoluteFill>
  );
};

/** P13 et P14 d'« Étude » sur la plage 1 à 11 (copie de Marie, copie de Jean, mêmes gestes). */
export const P13: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <P13Fermees />
  </FournisseurEtude>
);
export const P14: React.FC = () => (
  <FournisseurEtude valeur={ETUDE_PLAGE1}>
    <P14Echange />
  </FournisseurEtude>
);

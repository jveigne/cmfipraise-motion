import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile } from 'remotion';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import { LangueEtude } from '../etude/langue';
import { PastillePartie } from '../etude/plans/commun';
import { DUREE_P6, P6Lecture } from '../etude/plans/Lire';
import { DUREE_P8, DUREE_P9, DUREE_P11, P11Papier, P8Arrivee, P9Marie } from '../etude/plans/Repondre';
import { DUREE_P19, P19Fin } from '../etude/plans/Cartons';
import { LangueGuide } from '../guide/langue';
import { DUREE_O2, MONTEE, ORCHESTRE, TRIM_BEFORE } from './calage';
import { CARTONS } from './textes';
import { CartonGratuit, DUREE_GRATUIT, DUREE_INTERTITRE, IntertitreBertoua, PartieBertoua } from './ui/Cartons';
import { DUREE_O1, O1Titre, O2Salon } from './plans/Ouverture';
import { A1Programme, A2Briefing, A3Depart, DUREE_A1, DUREE_A2, DUREE_A3 } from './plans/Commencer';
import { B1Types, DUREE_B1, DUREE_P10, P10 } from './plans/Repondre';
import { C1Arret, DUREE_C1, DUREE_P13, DUREE_P14, P13, P14 } from './plans/Corriger';
import { D1Notes, D2Semaine, DUREE_D1, DUREE_D2, DUREE_P16, P16 } from './plans/Terminer';
import { DUREE_E1, DUREE_E2, DUREE_E3, DUREE_E4, E1Partiel, E2Rattrapage, E3Suite, E4Reprises } from './plans/Suite';
import { DUREE_F1, DUREE_F2, F1Progression, F2Assemblee } from './plans/Avancement';

/**
 * Vidéo « Le Message de Bertoua en détail » (Shephr, V1 du plan
 * cmfipraise-backend/docs/shephr/27_10_2026/05_Plan_Offres_Caleb_Nehemie.md § 9) : 9:16,
 * 1080 × 1920, 30 i/s, en français, sans voix off, sans aucun prix. Storyboard :
 * docs/storyboard-bertoua.md. Une vraie réunion du dimanche, du salon à l'avancement, puis la
 * semaine et le dimanche suivant : la même assemblée que dans « Étude » et « Guide » (Paris Ouest,
 * chez Samuel ; Marie, Jean, Esther, Paul, Hélène, Rose).
 *
 * Réutilise sans les modifier les plans d'« Étude » (P6 lecture, P8 à P11 réponses, P13 et P14
 * correction, P16 résultats et copies papier, P19 fin), ses écrans et ceux de « Guide » ; les plans
 * propres à cette vidéo sont dans `plans/`. Les plans d'« Étude » repris sur la séance arrêtée après
 * la question 11 reçoivent le jeu `ETUDE_PLAGE1` (`donnees.ts`).
 *
 * Rythme lent et lisible (retours de JP sur les vidéos précédentes) : poses longues, une légende
 * d'explication par étape, intertitres de 2,5 s avant chacune des six parties, intertitre final
 * « Gratuit — pour toutes les assemblées. ».
 *
 * Musique : « Dieu fait toutes choses nouvelles », départ à 19,0 s du fichier (`calage.ts`) : la
 * nette montée de 24,0 s ouvre le salon (O2), l'orchestre (70,5 s) tombe sur P8 ; fondu de sortie
 * de 2,5 s sur le plan de fin.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const VOLUME_AUDIO = 0.9;
const FONDU_ENTREE = 12;
const FONDU_FINAL = 75;
/** Recouvrement des intertitres : l'aplat monte sur le plan précédent, puis découvre le suivant. */
const RECOUVREMENT = 10;

type Partie = PartieBertoua;

const O2: React.FC = () => <O2Salon duree={DUREE_O2} />;

type Element =
  | { type: 'plan'; Composant: React.FC; duree: number; partie: Partie | null }
  | { type: 'intertitre'; partie: Partie }
  | { type: 'gratuit' };

/** Enchaînement du storyboard (§ 3). */
const DECOUPAGE: Element[] = [
  { type: 'plan', Composant: O1Titre, duree: DUREE_O1, partie: null },
  { type: 'plan', Composant: O2, duree: DUREE_O2, partie: null },
  { type: 'intertitre', partie: 'commencer' },
  { type: 'plan', Composant: P6Lecture, duree: DUREE_P6, partie: 'commencer' },
  { type: 'plan', Composant: A1Programme, duree: DUREE_A1, partie: 'commencer' },
  { type: 'plan', Composant: A2Briefing, duree: DUREE_A2, partie: 'commencer' },
  { type: 'plan', Composant: A3Depart, duree: DUREE_A3, partie: 'commencer' },
  { type: 'intertitre', partie: 'repondre' },
  { type: 'plan', Composant: P8Arrivee, duree: DUREE_P8, partie: 'repondre' },
  { type: 'plan', Composant: P9Marie, duree: DUREE_P9, partie: 'repondre' },
  { type: 'plan', Composant: B1Types, duree: DUREE_B1, partie: 'repondre' },
  { type: 'plan', Composant: P10, duree: DUREE_P10, partie: 'repondre' },
  { type: 'plan', Composant: P11Papier, duree: DUREE_P11, partie: 'repondre' },
  { type: 'intertitre', partie: 'corriger' },
  { type: 'plan', Composant: C1Arret, duree: DUREE_C1, partie: 'corriger' },
  { type: 'plan', Composant: P13, duree: DUREE_P13, partie: 'corriger' },
  { type: 'plan', Composant: P14, duree: DUREE_P14, partie: 'corriger' },
  { type: 'intertitre', partie: 'terminer' },
  { type: 'plan', Composant: D1Notes, duree: DUREE_D1, partie: 'terminer' },
  { type: 'plan', Composant: D2Semaine, duree: DUREE_D2, partie: 'terminer' },
  { type: 'plan', Composant: P16, duree: DUREE_P16, partie: 'terminer' },
  { type: 'intertitre', partie: 'suite' },
  { type: 'plan', Composant: E1Partiel, duree: DUREE_E1, partie: 'suite' },
  { type: 'plan', Composant: E2Rattrapage, duree: DUREE_E2, partie: 'suite' },
  { type: 'plan', Composant: E3Suite, duree: DUREE_E3, partie: 'suite' },
  { type: 'plan', Composant: E4Reprises, duree: DUREE_E4, partie: 'suite' },
  { type: 'intertitre', partie: 'avancement' },
  { type: 'plan', Composant: F1Progression, duree: DUREE_F1, partie: 'avancement' },
  { type: 'plan', Composant: F2Assemblee, duree: DUREE_F2, partie: 'avancement' },
  { type: 'gratuit' },
  { type: 'plan', Composant: P19Fin, duree: DUREE_P19, partie: null },
];

const dureeDe = (e: Element) => (e.type === 'plan' ? e.duree : e.type === 'gratuit' ? DUREE_GRATUIT : DUREE_INTERTITRE);
const estCarton = (e: Element | undefined) => !!e && e.type !== 'plan';

const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dureeDe(DECOUPAGE[i - 1])], []);
export const DUREE_BERTOUA = DEBUTS[DEBUTS.length - 1] + dureeDe(DECOUPAGE[DECOUPAGE.length - 1]);

/** Nombre de plans (intertitres et carton « Gratuit » non compris). */
export const PLANS_BERTOUA = DECOUPAGE.filter((e) => e.type === 'plan').length;

const debutDe = (C: React.FC) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'plan' && e.Composant === C)];

if (debutDe(O2) + TRIM_BEFORE !== MONTEE) throw new Error('Calage musical : O2 ne tombe pas sur la montée.');
if (debutDe(P8Arrivee) + TRIM_BEFORE !== ORCHESTRE) throw new Error('Calage musical : P8 ne tombe pas sur l’orchestre.');
if (DUREE_BERTOUA < 5400 || DUREE_BERTOUA > 7200) throw new Error(`Durée hors de la cible de 3 à 4 min : ${DUREE_BERTOUA} images.`);

/** Couleurs des pastilles de partie et des intertitres. */
const COULEURS_PARTIES: Record<Partie, string> = {
  commencer: S.moss,
  repondre: S.sauge,
  corriger: S.earthDeep,
  terminer: S.clay,
  suite: S.mossSoft,
  avancement: S.mossDeep,
};

/** Étendue de chaque partie : de son premier plan à la fin de son dernier (intertitre exclu). */
const ETENDUES = (Object.keys(COULEURS_PARTIES) as Partie[]).map((partie) => {
  const indices = DECOUPAGE.map((e, i) => (e.type === 'plan' && e.partie === partie ? i : -1)).filter((i) => i >= 0);
  const debut = DEBUTS[indices[0]];
  const fin = DEBUTS[indices[indices.length - 1]] + dureeDe(DECOUPAGE[indices[indices.length - 1]]);
  return { partie, debut, fin };
});

/**
 * Un plan dans la frise (gabarit d'« Étude »). Autour d'un intertitre, le plan déborde de
 * `RECOUVREMENT` images : figé sur sa première image avant, sur sa dernière après, le temps que
 * l'aplat le recouvre ou le découvre.
 */
const Segment: React.FC<{ debut: number; duree: number; avant: number; apres: number; children: React.ReactNode }> = ({ debut, duree, avant, apres, children }) => (
  <Sequence from={debut - avant} durationInFrames={avant + duree + apres}>
    <Freeze frame={avant} active={(f) => f < avant}>
      <Freeze frame={avant + duree - 1} active={(f) => f >= avant + duree}>
        <Sequence from={avant} durationInFrames={duree}>
          {children}
        </Sequence>
      </Freeze>
    </Freeze>
  </Sequence>
);

export const VideoBertoua: React.FC = () => (
  <LangueEtude langue="fr">
    <LangueGuide langue="fr">
      <AbsoluteFill>
        <FondShephr />
        <Audio
          src={staticFile(PISTE_AUDIO)}
          trimBefore={TRIM_BEFORE}
          volume={(f) =>
            interpolate(f, [0, FONDU_ENTREE, DUREE_BERTOUA - FONDU_FINAL, DUREE_BERTOUA - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />

        {DECOUPAGE.map((e, i) => {
          if (e.type !== 'plan') return null;
          const avant = estCarton(DECOUPAGE[i - 1]) ? RECOUVREMENT : 0;
          const apres = estCarton(DECOUPAGE[i + 1]) ? RECOUVREMENT : 0;
          const { Composant } = e;
          return (
            <Segment key={i} debut={DEBUTS[i]} duree={e.duree} avant={avant} apres={apres}>
              <Composant />
            </Segment>
          );
        })}

        {ETENDUES.map((e) => (
          <Sequence key={e.partie} from={e.debut} durationInFrames={e.fin - e.debut} layout="none">
            <PastillePartie texte={CARTONS.parties[e.partie]} couleur={COULEURS_PARTIES[e.partie]} duree={e.fin - e.debut} />
          </Sequence>
        ))}

        {DECOUPAGE.map((e, i) =>
          e.type === 'intertitre' ? (
            <Sequence key={i} from={DEBUTS[i]} durationInFrames={DUREE_INTERTITRE}>
              <IntertitreBertoua partie={e.partie} couleur={COULEURS_PARTIES[e.partie]} />
            </Sequence>
          ) : e.type === 'gratuit' ? (
            <Sequence key={i} from={DEBUTS[i]} durationInFrames={DUREE_GRATUIT}>
              <CartonGratuit />
            </Sequence>
          ) : null,
        )}
      </AbsoluteFill>
    </LangueGuide>
  </LangueEtude>
);

export default VideoBertoua;

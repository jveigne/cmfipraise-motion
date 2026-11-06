import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile } from 'remotion';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import { DUREE_P6, ORCHESTRE, TRIM_BEFORE } from './calage';
import { CARTONS } from './textes';
import { DUREE_INTERTITRE, Intertitre, PartieGratuit } from './ui/Habillage';
import { DUREE_P1, DUREE_P10, P10Fin, P1Ouverture } from './plans/Cartons';
import { DUREE_P2, DUREE_P3, DUREE_P4, P2Bertoua, P3Vie, P4Brebis } from './plans/Assemblee';
import { DUREE_P5, P5Objectifs, P6Hierarchie } from './plans/Objectifs';
import { DUREE_P7, DUREE_P8, DUREE_P9, P7Evenements, P8Documents, P9Chants } from './plans/Aussi';
import { PastillePartie } from './plans/commun';

/**
 * Vidéo « Ce qui est et restera gratuit » (Shephr, V4 du plan 27/10 § 9) : 10 plans et 3
 * intertitres, 84 s (2 520 images), 9:16, en français, sans voix off, sans aucun prix.
 * Storyboard : docs/storyboard-gratuit.md. Une idée par plan :
 * 1. Son assemblée — le Message de Bertoua (P2), la vie de l'assemblée : CR, réunions, journal
 *    (P3), le suivi des brebis (P4) ; Samuel Fotso, dirigeant de Paris Ouest ;
 * 2. Ses objectifs — Goals & Reporting (P5, Samuel), l'arbre de la Hiérarchie et l'état de
 *    soumission des objectifs (P6, Daniel Mercier, dirigeant de la ville) ;
 * 3. Et aussi — créer et déclarer des évènements, les statistiques jusqu'à la ville (P7, Bernard
 *    Lemoine, dirigeant senior de l'Île-de-France : seul qui lit la région la montre), lire les
 *    documents (P8), CMFIPraise : chants et projection (P9).
 *
 * Rythme lent (retours de JP « trop rapide ») : plans de 8,3 s, deux légendes par plan (l'idée,
 * puis son explication), intertitres de 2,5 s, un tampon « Gratuit » sur le coin du téléphone.
 *
 * Musique : « Dieu fait toutes choses nouvelles », la même qu'« Étude », « Journal » et
 * « Documents ». Calage (`calage.ts`) : la montée de 24,0 s sur l'intertitre « 1 », l'orchestre
 * (70,5 s) sur l'intertitre « 3 » ; P6 est le plan tampon ; fondu de sortie de 2,5 s sur la fin.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const VOLUME_AUDIO = 0.9;
const FONDU_ENTREE = 12;
/** Fondu de sortie de 2,5 s, pris sur le plan de fin. */
const FONDU_FINAL = 75;
/** Recouvrement des intertitres : l'aplat monte sur le plan précédent, puis découvre le suivant. */
const RECOUVREMENT = 10;

type Partie = PartieGratuit;

/** P6 reçoit sa durée calculée (pas d'import de `calage.ts` dans les plans : pas de cycle). */
const P6: React.FC = () => <P6Hierarchie duree={DUREE_P6} />;

type Element =
  | { type: 'plan'; Composant: React.FC; duree: number; partie: Partie | null }
  | { type: 'intertitre'; partie: Partie };

/** Enchaînement du storyboard (§ 3). */
const DECOUPAGE: Element[] = [
  { type: 'plan', Composant: P1Ouverture, duree: DUREE_P1, partie: null },
  { type: 'intertitre', partie: 'assemblee' },
  { type: 'plan', Composant: P2Bertoua, duree: DUREE_P2, partie: 'assemblee' },
  { type: 'plan', Composant: P3Vie, duree: DUREE_P3, partie: 'assemblee' },
  { type: 'plan', Composant: P4Brebis, duree: DUREE_P4, partie: 'assemblee' },
  { type: 'intertitre', partie: 'objectifs' },
  { type: 'plan', Composant: P5Objectifs, duree: DUREE_P5, partie: 'objectifs' },
  { type: 'plan', Composant: P6, duree: DUREE_P6, partie: 'objectifs' },
  { type: 'intertitre', partie: 'aussi' },
  { type: 'plan', Composant: P7Evenements, duree: DUREE_P7, partie: 'aussi' },
  { type: 'plan', Composant: P8Documents, duree: DUREE_P8, partie: 'aussi' },
  { type: 'plan', Composant: P9Chants, duree: DUREE_P9, partie: 'aussi' },
  { type: 'plan', Composant: P10Fin, duree: DUREE_P10, partie: null },
];

const dureeDe = (e: Element) => (e.type === 'plan' ? e.duree : DUREE_INTERTITRE);

const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dureeDe(DECOUPAGE[i - 1])], []);
export const DUREE_GRATUIT = DEBUTS[DEBUTS.length - 1] + dureeDe(DECOUPAGE[DECOUPAGE.length - 1]);

const debutIntertitre = (p: Partie) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'intertitre' && e.partie === p)];

if (debutIntertitre('assemblee') + TRIM_BEFORE !== Math.round(24.0 * 30)) throw new Error('Calage musical : l’intertitre 1 ne tombe pas sur la montée.');
if (debutIntertitre('aussi') + TRIM_BEFORE !== ORCHESTRE) throw new Error('Calage musical : l’intertitre 3 ne tombe pas sur l’orchestre.');

/** Couleurs des pastilles de partie et des intertitres (palette de l'app, storyboard § 2). */
const COULEURS_PARTIES: Record<Partie, string> = {
  assemblee: S.moss,
  objectifs: S.clay,
  aussi: S.sauge,
};

/** Étendue de chaque partie : de son premier plan à la fin de son dernier (intertitre exclu). */
const ETENDUES = (Object.keys(COULEURS_PARTIES) as Partie[]).map((partie) => {
  const indices = DECOUPAGE.map((e, i) => (e.type === 'plan' && e.partie === partie ? i : -1)).filter((i) => i >= 0);
  const debut = DEBUTS[indices[0]];
  const fin = DEBUTS[indices[indices.length - 1]] + dureeDe(DECOUPAGE[indices[indices.length - 1]]);
  return { partie, debut, fin };
});

/**
 * Un plan dans la frise (gabarit d'« Évènements » et d'« Étude ») : autour d'un intertitre, le plan
 * déborde de `RECOUVREMENT` images, figé sur sa première image avant, sur sa dernière après.
 */
const Segment: React.FC<{ debut: number; duree: number; avant: number; apres: number; children: React.ReactNode }> = ({
  debut,
  duree,
  avant,
  apres,
  children,
}) => (
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

export const VideoGratuit: React.FC = () => (
  <AbsoluteFill>
    <FondShephr />
    <Audio
      src={staticFile(PISTE_AUDIO)}
      trimBefore={TRIM_BEFORE}
      volume={(f) =>
        interpolate(f, [0, FONDU_ENTREE, DUREE_GRATUIT - FONDU_FINAL, DUREE_GRATUIT - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />

    {DECOUPAGE.map((e, i) => {
      if (e.type !== 'plan') return null;
      const avant = DECOUPAGE[i - 1]?.type === 'intertitre' ? RECOUVREMENT : 0;
      const apres = DECOUPAGE[i + 1]?.type === 'intertitre' ? RECOUVREMENT : 0;
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
          <Intertitre partie={e.partie} couleur={COULEURS_PARTIES[e.partie]} />
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

export default VideoGratuit;

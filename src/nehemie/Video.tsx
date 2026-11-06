import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile } from 'remotion';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import { DUREE_P8, MONTEE, ORCHESTRE } from './calage';
import { CARTONS } from './textes';
import { DUREE_INTERTITRE, Intertitre, PartieIntertitre } from './ui/Decor';
import { DUREE_P1, DUREE_P2, P1Verset, P2Offre } from './plans/Ouverture';
import { DUREE_P3, DUREE_P4, P3PourQui, P4Menu } from './plans/PourQui';
import { DUREE_P5, DUREE_P6, P5Assemblees, P6Membres } from './plans/Bertoua';
import { DUREE_P7, P7Journal } from './plans/Journal';
import { P8Evenements } from './plans/Evenements';
import { DUREE_P9, DUREE_P10, P10Fin, P9Responsables } from './plans/Ville';
import { PastillePartie } from './plans/commun';

/**
 * Vidéo « Offre Néhémie » (Shephr) — plan 05 § 9 V2 : 10 plans et 3 intertitres, 85 s
 * (2 550 images), en français, sans voix off, AUCUN PRIX. Storyboard : docs/storyboard-nehemie.md.
 * Verset d'ouverture (Néhémie 2 : 18, Louis Segond 1910), le nom de l'offre, pour qui ; puis, sur
 * l'espace web, « Suivi de la ville » de Douala : le Message de Bertoua dans toutes les
 * assemblées (leçon par leçon, enseignés / non enseignés), le journal de la ville (des nombres,
 * aucun nom), les évènements à l'intérieur de la ville ; une ville, tous ses responsables ; fin
 * « Disponible sur l'espace web Shephr ».
 *
 * Rythme lent (retours de JP sur les vidéos précédentes : « trop rapide ») : légendes de 2,5 à
 * 4 s, intertitres de 2,5 s, poses longues entre les gestes.
 *
 * Musique : « Dieu fait toutes choses nouvelles » (comme « Étude »), départ au début du fichier ;
 * P5 sur la montée de 24,0 s, P9 sur l'orchestre de 70,5 s, P8 plan tampon (`calage.ts`) ; fondu
 * de sortie de 2,5 s sur la fin.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const VOLUME_AUDIO = 0.9;
const FONDU_ENTREE = 12;
const FONDU_FINAL = 75;
const RECOUVREMENT = 10;

type Partie = keyof typeof CARTONS.parties;

const P8: React.FC = () => <P8Evenements duree={DUREE_P8} />;

type Element =
  | { type: 'plan'; Composant: React.FC; duree: number; partie: Partie | null }
  | { type: 'intertitre'; partie: PartieIntertitre };

const DECOUPAGE: Element[] = [
  { type: 'plan', Composant: P1Verset, duree: DUREE_P1, partie: null },
  { type: 'plan', Composant: P2Offre, duree: DUREE_P2, partie: null },
  { type: 'plan', Composant: P3PourQui, duree: DUREE_P3, partie: 'pourQui' },
  { type: 'plan', Composant: P4Menu, duree: DUREE_P4, partie: 'pourQui' },
  { type: 'intertitre', partie: 'bertoua' },
  { type: 'plan', Composant: P5Assemblees, duree: DUREE_P5, partie: 'bertoua' },
  { type: 'plan', Composant: P6Membres, duree: DUREE_P6, partie: 'bertoua' },
  { type: 'intertitre', partie: 'journal' },
  { type: 'plan', Composant: P7Journal, duree: DUREE_P7, partie: 'journal' },
  { type: 'intertitre', partie: 'evenements' },
  { type: 'plan', Composant: P8, duree: DUREE_P8, partie: 'evenements' },
  { type: 'plan', Composant: P9Responsables, duree: DUREE_P9, partie: null },
  { type: 'plan', Composant: P10Fin, duree: DUREE_P10, partie: null },
];

const dureeDe = (e: Element) => (e.type === 'plan' ? e.duree : DUREE_INTERTITRE);
const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dureeDe(DECOUPAGE[i - 1])], []);

/** Durée totale : 2 550 images (85,0 s) avec le découpage actuel. */
export const DUREE_NEHEMIE = DEBUTS[DEBUTS.length - 1] + dureeDe(DECOUPAGE[DECOUPAGE.length - 1]);
/** Nombre de plans (hors intertitres). */
export const PLANS_NEHEMIE = DECOUPAGE.filter((e) => e.type === 'plan').length;

const debutDe = (C: React.FC) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'plan' && e.Composant === C)];
if (debutDe(P5Assemblees) !== MONTEE) throw new Error('Calage musical : P5 ne tombe pas sur la montée de 24,0 s.');
if (debutDe(P9Responsables) !== ORCHESTRE) throw new Error('Calage musical : P9 ne tombe pas sur l’orchestre.');

const COULEURS: Record<Partie, string> = {
  pourQui: S.sauge,
  bertoua: S.moss,
  journal: S.earthDeep,
  evenements: S.clay,
};

const ETENDUES = (Object.keys(COULEURS) as Partie[]).map((partie) => {
  const indices = DECOUPAGE.map((e, i) => (e.type === 'plan' && e.partie === partie ? i : -1)).filter((i) => i >= 0);
  const debut = DEBUTS[indices[0]];
  const fin = DEBUTS[indices[indices.length - 1]] + dureeDe(DECOUPAGE[indices[indices.length - 1]]);
  return { partie, debut, fin };
});

/** Un plan dans la frise ; autour d'un intertitre, il déborde de `RECOUVREMENT` images, figé (gabarit d'« Étude »). */
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

export const VideoNehemie: React.FC = () => (
  <AbsoluteFill>
    <FondShephr />
    <Audio
      src={staticFile(PISTE_AUDIO)}
      trimBefore={0}
      volume={(f) =>
        interpolate(f, [0, FONDU_ENTREE, DUREE_NEHEMIE - FONDU_FINAL, DUREE_NEHEMIE - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
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
        <PastillePartie texte={CARTONS.parties[e.partie]} couleur={COULEURS[e.partie]} duree={e.fin - e.debut} />
      </Sequence>
    ))}

    {DECOUPAGE.map((e, i) =>
      e.type === 'intertitre' ? (
        <Sequence key={i} from={DEBUTS[i]} durationInFrames={DUREE_INTERTITRE}>
          <Intertitre partie={e.partie} couleur={COULEURS[e.partie]} />
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

export default VideoNehemie;

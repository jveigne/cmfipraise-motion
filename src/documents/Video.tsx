import React from 'react';
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from 'remotion';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import { CARTONS } from './textes';
import { BASCULE_V2, MONTEE, ORCHESTRE } from './calage';
import { DUREE_P1, DUREE_P2, DUREE_P3, P1Perdu, P2Versions, P3Partout } from './plans/Probleme';
import { DUREE_P4, DUREE_P10, P10Fin, P4Bascule } from './plans/Cartons';
import { DUREE_P5, DUREE_P6, P5Ministere, P6Pays } from './plans/Monde';
import { DUREE_P7, P7Dossiers } from './plans/Retrouver';
import { DUREE_P8, P8Version } from './plans/AJour';
import { DUREE_P9, P9Partager } from './plans/Partager';
import { PastillePartie } from './plans/commun';

/**
 * Vidéo « Documents » (Shephr) : 10 plans, 96 s (2 880 images), en français. Storyboard :
 * docs/storyboard-documents.md (validé par JP le 20/10/2026).
 *
 * Musique : « Dieu fait toutes choses nouvelles », la même que « Évènements » et « Journal ».
 * Calage (`calage.ts`) : la bascule P4 tombe sur la montée de 24,0 s du fichier ; P4 commence à
 * l'image 585 (19,5 s), la vidéo part donc à 4,5 s du fichier (`trimBefore` 135). L'orchestre
 * (70,5 s du fichier) tombe sur le retournement v1 → v2 de P8.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const VOLUME_AUDIO = 0.9;
const FONDU_ENTREE = 12;
/** Fondu de sortie de 2,5 s, pris sur le plan de fin. */
const FONDU_FINAL = 75;

type Partie = keyof typeof CARTONS.parties | null;

/** Enchaînement du storyboard (§ 3) : P1 → P10. */
const DECOUPAGE: { Composant: React.FC; duree: number; partie: Partie }[] = [
  { Composant: P1Perdu, duree: DUREE_P1, partie: 'probleme' },
  { Composant: P2Versions, duree: DUREE_P2, partie: 'probleme' },
  { Composant: P3Partout, duree: DUREE_P3, partie: 'probleme' },
  { Composant: P4Bascule, duree: DUREE_P4, partie: null },
  { Composant: P5Ministere, duree: DUREE_P5, partie: 'monde' },
  { Composant: P6Pays, duree: DUREE_P6, partie: 'monde' },
  { Composant: P7Dossiers, duree: DUREE_P7, partie: 'retrouver' },
  { Composant: P8Version, duree: DUREE_P8, partie: 'ajour' },
  { Composant: P9Partager, duree: DUREE_P9, partie: 'partager' },
  { Composant: P10Fin, duree: DUREE_P10, partie: null },
];

const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + DECOUPAGE[i - 1].duree], []);
export const DUREE_DOCUMENTS = DEBUTS[DEBUTS.length - 1] + DECOUPAGE[DECOUPAGE.length - 1].duree;

const debutDe = (C: React.FC) => DEBUTS[DECOUPAGE.findIndex((p) => p.Composant === C)];

/** Point de départ dans le chant : la montée de 24,0 s sur le début de P4 (720 − 585 = 135). */
const TRIM_BEFORE = MONTEE - debutDe(P4Bascule);
if (TRIM_BEFORE < 0) throw new Error('Calage musical : la partie « Le problème » dépasse 24 s.');
if (debutDe(P8Version) + BASCULE_V2 + TRIM_BEFORE !== ORCHESTRE) throw new Error('Calage musical : la v2 de P8 ne tombe pas sur l’orchestre.');

/** Couleurs des pastilles de partie (storyboard § 2). */
const COULEURS_PARTIES: Record<Exclude<Partie, null>, string> = {
  probleme: S.ink2,
  monde: S.moss,
  retrouver: S.sauge,
  ajour: S.earthDeep,
  partager: S.clay,
};

const ETENDUES = (Object.keys(COULEURS_PARTIES) as Exclude<Partie, null>[]).map((partie) => {
  const indices = DECOUPAGE.map((p, i) => (p.partie === partie ? i : -1)).filter((i) => i >= 0);
  const debut = DEBUTS[indices[0]];
  const fin = DEBUTS[indices[indices.length - 1]] + DECOUPAGE[indices[indices.length - 1]].duree;
  return { partie, debut, fin };
});

export const VideoDocuments: React.FC = () => (
  <AbsoluteFill>
    <FondShephr />
    <Audio
      src={staticFile(PISTE_AUDIO)}
      trimBefore={TRIM_BEFORE}
      volume={(f) =>
        interpolate(f, [0, FONDU_ENTREE, DUREE_DOCUMENTS - FONDU_FINAL, DUREE_DOCUMENTS - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      }
    />

    {DECOUPAGE.map(({ Composant, duree }, i) => (
      <Sequence key={i} from={DEBUTS[i]} durationInFrames={duree}>
        <Composant />
      </Sequence>
    ))}

    {ETENDUES.map((e) => (
      <Sequence key={e.partie} from={e.debut} durationInFrames={e.fin - e.debut} layout="none">
        <PastillePartie texte={CARTONS.parties[e.partie]} couleur={COULEURS_PARTIES[e.partie]} duree={e.fin - e.debut} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

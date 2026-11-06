import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { doux } from '../anim';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import type { Langue } from '../textes';
import { LangueJournal, useJournal } from './langue';
import { MONTEE, ORCHESTRE } from './calage';
import { C1Cahier, C2Perdu, C3Passation, C4Pile, C5Recompter, DUREE_C1, DUREE_C2, DUREE_C3, DUREE_C4, DUREE_C5 } from './plans/Cahier';
import { BasculeTitre, DUREE_BASCULE, DUREE_FIN, Fin } from './plans/Cartons';
import { DUREE_S1, DUREE_S2, DUREE_S3, DUREE_S4, S1NouveauCr, S2Presents, S3Chapitres, S4Copier } from './plans/Saisir';
import { DUREE_K1, DUREE_K2, K1Annees, K2Avancement } from './plans/Conserver';
import { DUREE_I1, DUREE_I2, DUREE_I3, I1Periode, I2Pdf, I3Imprimer } from './plans/Imprimer';
import { DUREE_H1, DUREE_H2, H1Stats, H2Consolide } from './plans/Hierarchie';
import { PastillePartie } from './plans/commun';

/**
 * Vidéo « Journal de l'assemblée » (Shephr) : 18 plans, 90 s (2 700 images), en français
 * (JournalFR) ou en anglais (JournalEN, prop `langue`, JP 14/10/2026). Storyboard :
 * docs/storyboard-journal.md. Les deux versions ont le même découpage, la même musique et les
 * mêmes calages : seuls changent les textes et les données fictives (`langue.tsx`).
 *
 * Musique : « Dieu fait toutes choses nouvelles » (la même que « Évènements »). Calage détaillé
 * dans `calage.ts` : la bascule « problème → l'app » (P6) tombe sur la montée de 24,0 s du fichier,
 * le PDF qui jaillit (P14) sur l'entrée de l'orchestre à 70,5 s. Avec le découpage actuel, P6
 * commence à l'image 585 (19,5 s) : la vidéo part donc à 24,0 − 19,5 = 4,5 s du fichier
 * (`trimBefore` 135), et P14 commence à l'image 1 980 (66,0 s) = 70,5 s du fichier.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
/** Volume de croisière de la piste (celui d'« Évènements »). */
const VOLUME_AUDIO = 0.9;
/** Fondu d'entrée court (12 images) ; fondu de sortie de 2,5 s, pris sur le plan de fin. */
const FONDU_ENTREE = 12;
const FONDU_FINAL = 75;

type Partie = 'cahier' | 'saisir' | 'conserver' | 'imprimer' | 'hierarchie' | null;

/** Enchaînement du storyboard (§ 3) : P1 → P18. */
const DECOUPAGE: { Composant: React.FC; duree: number; partie: Partie }[] = [
  { Composant: C1Cahier, duree: DUREE_C1, partie: 'cahier' },
  { Composant: C2Perdu, duree: DUREE_C2, partie: 'cahier' },
  { Composant: C3Passation, duree: DUREE_C3, partie: 'cahier' },
  { Composant: C4Pile, duree: DUREE_C4, partie: 'cahier' },
  { Composant: C5Recompter, duree: DUREE_C5, partie: 'cahier' },
  { Composant: BasculeTitre, duree: DUREE_BASCULE, partie: null },
  { Composant: S1NouveauCr, duree: DUREE_S1, partie: 'saisir' },
  { Composant: S2Presents, duree: DUREE_S2, partie: 'saisir' },
  { Composant: S3Chapitres, duree: DUREE_S3, partie: 'saisir' },
  { Composant: S4Copier, duree: DUREE_S4, partie: 'saisir' },
  { Composant: K1Annees, duree: DUREE_K1, partie: 'conserver' },
  { Composant: K2Avancement, duree: DUREE_K2, partie: 'conserver' },
  { Composant: I1Periode, duree: DUREE_I1, partie: 'imprimer' },
  { Composant: I2Pdf, duree: DUREE_I2, partie: 'imprimer' },
  { Composant: I3Imprimer, duree: DUREE_I3, partie: 'imprimer' },
  { Composant: H1Stats, duree: DUREE_H1, partie: 'hierarchie' },
  { Composant: H2Consolide, duree: DUREE_H2, partie: 'hierarchie' },
  { Composant: Fin, duree: DUREE_FIN, partie: null },
];

/** Image de début de chaque plan. */
const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _p, i) => [...acc, i === 0 ? 0 : acc[i - 1] + DECOUPAGE[i - 1].duree], []);
export const DUREE_JOURNAL = DEBUTS[DEBUTS.length - 1] + DECOUPAGE[DECOUPAGE.length - 1].duree;

const debutDe = (C: React.FC) => DEBUTS[DECOUPAGE.findIndex((p) => p.Composant === C)];

/**
 * Point de départ dans le chant : la montée de 24,0 s doit tomber sur le début de P6.
 * `trimBefore` = 720 − 585 = 135 images (4,5 s). P1–P5 ne peuvent donc pas dépasser 24 s.
 */
const TRIM_BEFORE = MONTEE - debutDe(BasculeTitre);
if (TRIM_BEFORE < 0) throw new Error('Calage musical : la partie « Le cahier » dépasse 24 s.');
// Vérification du second rendez-vous (calage.ts calcule P13 pour qu'il tombe juste).
if (debutDe(I2Pdf) + TRIM_BEFORE !== ORCHESTRE) throw new Error('Calage musical : P14 ne tombe pas sur l’orchestre.');

/** Pastilles de partie : couleur (storyboard § 2) ; le texte vient de la langue (`cartons.parties`). */
const COULEURS_PARTIES: Record<Exclude<Partie, null>, string> = {
  cahier: S.ink2,
  saisir: S.moss,
  conserver: S.sauge,
  imprimer: S.earthDeep,
  hierarchie: S.clay,
};

/** Étendue de chaque partie (du premier au dernier de ses plans). */
const ETENDUES = (Object.keys(COULEURS_PARTIES) as Exclude<Partie, null>[]).map((partie) => {
  const indices = DECOUPAGE.map((p, i) => (p.partie === partie ? i : -1)).filter((i) => i >= 0);
  const debut = DEBUTS[indices[0]];
  const fin = DEBUTS[indices[indices.length - 1]] + DECOUPAGE[indices[indices.length - 1]].duree;
  return { partie, debut, fin };
});

/** Sortie du dessin de P5 sur la montée du chant (10 premières images de P6) : il descend et s'efface. */
const SortieDessin: React.FC = () => {
  const f = useCurrentFrame();
  const p = doux(f, [0, 10], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - p, transform: `translateY(${p * 140}px)` }}>
      <Freeze frame={DUREE_C5 - 1}>
        <C5Recompter />
      </Freeze>
    </AbsoluteFill>
  );
};

/** Pastilles de partie, dans la langue de la vidéo. */
const Pastilles: React.FC = () => {
  const { cartons } = useJournal();
  return (
    <>
      {ETENDUES.map((e) => (
        <Sequence key={e.partie} from={e.debut} durationInFrames={e.fin - e.debut} layout="none">
          <PastillePartie texte={cartons.parties[e.partie]} couleur={COULEURS_PARTIES[e.partie]} duree={e.fin - e.debut} />
        </Sequence>
      ))}
    </>
  );
};

export const VideoJournal: React.FC<{ langue: Langue }> = ({ langue }) => (
  <LangueJournal langue={langue}>
    <AbsoluteFill>
      <FondShephr />
      <Audio
        src={staticFile(PISTE_AUDIO)}
        trimBefore={TRIM_BEFORE}
        volume={(f) =>
          interpolate(f, [0, FONDU_ENTREE, DUREE_JOURNAL - FONDU_FINAL, DUREE_JOURNAL - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
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

      <Sequence from={debutDe(BasculeTitre)} durationInFrames={10}>
        <SortieDessin />
      </Sequence>

      <Pastilles />
    </AbsoluteFill>
  </LangueJournal>
);

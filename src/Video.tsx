import React from 'react';
import { AbsoluteFill, Audio, Series, interpolate, staticFile } from 'remotion';
import { Langue, TEXTES } from './textes';
import { Fond } from './ui/Fond';
import { Plan1Recherche } from './plans/Plan1Recherche';
import { DUREE_PLAN2, DUREE_PLAN3, ScenePlans2et3 } from './plans/ScenePlans2et3';
import { DUREE_PLAN4, Plan4Reconnaissance } from './plans/Plan4Reconnaissance';
import { DUREE_PLAN5, Plan5Combat } from './plans/Plan5Combat';
import { DUREE_PLAN6, Plan6HorsLigne } from './plans/Plan6HorsLigne';
import { DUREE_PLAN7, Plan7Langues } from './plans/Plan7Langues';
import { DUREE_PLAN8, Plan8Favoris } from './plans/Plan8Favoris';
import { DUREE_PLAN9, Plan9Fin } from './plans/Plan9Fin';

export const DUREE_PLAN1 = 120;

/**
 * Musique : « Offrons à notre Dieu » (fichier fourni par Jean Philippe le 13/10/2026).
 * Le chant marque un silence à 0:40,5 puis repart en plein à 0:41,2 : on démarre la piste
 * de sorte que cette reprise tombe sur l'apparition du logo (plan 9, image 1214 = 40,47 s).
 */
const MUSIQUE = staticFile('audio/offrons-a-notre-dieu.mp3');
const REPRISE_MUSIQUE = 41.2;
const APPARITION_LOGO = 1214;
export const DUREE_TOTALE =
  DUREE_PLAN1 + DUREE_PLAN2 + DUREE_PLAN3 + DUREE_PLAN4 + DUREE_PLAN5 + DUREE_PLAN6 + DUREE_PLAN7 + DUREE_PLAN8 + DUREE_PLAN9;

/** Vidéo « Catégories de chants » : les 9 plans du storyboard, bout à bout (45 s). */
export const Video: React.FC<{ langue: Langue }> = ({ langue }) => {
  const textes = TEXTES[langue];
  return (
    <AbsoluteFill>
      <Fond />
      <Audio
        src={MUSIQUE}
        trimBefore={Math.round(REPRISE_MUSIQUE * 30) - APPARITION_LOGO}
        volume={(f) =>
          interpolate(f, [0, 12, DUREE_TOTALE - 50, DUREE_TOTALE - 1], [0, 0.9, 0.9, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        }
      />
      <Series>
        <Series.Sequence durationInFrames={DUREE_PLAN1}>
          <Plan1Recherche lignes={textes.plan1} duree={DUREE_PLAN1} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN2 + DUREE_PLAN3}>
          <ScenePlans2et3 textes={textes} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN4}>
          <Plan4Reconnaissance textes={textes} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN5}>
          <Plan5Combat textes={textes} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN6}>
          <Plan6HorsLigne textes={textes} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN7}>
          <Plan7Langues textes={textes} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN8}>
          <Plan8Favoris textes={textes} />
        </Series.Sequence>
        <Series.Sequence durationInFrames={DUREE_PLAN9}>
          <Plan9Fin textes={textes} />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

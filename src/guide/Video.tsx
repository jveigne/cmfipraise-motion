import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import type { Langue } from '../textes';
import { LangueGuide } from './langue';
import { DUREE_GUIDE, FRISE } from './frise';
import { PLANS } from './plans/Plans';
import { Fond16 } from './ui/Mise';

/**
 * Vidéo « Guide » (Shephr, 16:9, 1920 × 1080, 30 i/s), demande de JP du 26/10/2026 : le journal de
 * l'assemblée et le Message de Bertoua, pas à pas, pour tout le monde (dirigeant et membre en
 * alternance), en français (GuideFR) et en anglais (GuideEN). Storyboard : docs/storyboard-guide.md ;
 * scripts de narration : docs/script-voix-guide-fr.md / -en.md (mêmes timecodes que `frise.ts`).
 *
 * Props :
 * - `langue` : 'fr' | 'en' ;
 * - `voix` (facultative) : chemin d'un fichier audio de `public/` (ex. 'audio/voix-guide-fr.mp3'),
 *   joué dès la première image ; la musique baisse alors nettement (`VOLUME_SOUS_VOIX`) ;
 * - `musique` (défaut true) : false coupe la musique.
 *
 * Chaque plan s'enchaîne au suivant par un fondu de 10 images : le plan suivant (fond opaque)
 * apparaît par-dessus le précédent, figé sur sa dernière image.
 */
export type PropsGuide = { langue: Langue; voix?: string; musique?: boolean };

const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
/** Volume de la musique seule (celui des autres vidéos) et sous la voix (≈ −14 dB). */
const VOLUME_AUDIO = 0.9;
const VOLUME_SOUS_VOIX = 0.18;
const FONDU_ENTREE = 12;
/** Fondu de sortie de 2,5 s, pris sur le plan de fin. */
const FONDU_FINAL = 75;
/** Fondu enchaîné entre deux plans. */
const FONDU_PLANS = 10;

const Plan: React.FC<{ index: number }> = ({ index }) => {
  const f = useCurrentFrame();
  const e = FRISE[index];
  const C = PLANS[e.id];
  const opacite = index === 0 ? 1 : interpolate(f, [0, FONDU_PLANS], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ opacity: opacite }}>
      <Freeze frame={e.duree - 1} active={(x) => x >= e.duree}>
        <C />
      </Freeze>
    </AbsoluteFill>
  );
};

export const VideoGuide: React.FC<PropsGuide> = ({ langue, voix, musique = true }) => {
  const volume = voix ? VOLUME_SOUS_VOIX : VOLUME_AUDIO;
  return (
    <LangueGuide langue={langue}>
      <AbsoluteFill>
        <Fond16 />
        {musique ? (
          <Audio
            src={staticFile(PISTE_AUDIO)}
            volume={(f) =>
              interpolate(f, [0, FONDU_ENTREE, DUREE_GUIDE - FONDU_FINAL, DUREE_GUIDE - 1], [0, volume, volume, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })
            }
          />
        ) : null}
        {voix ? <Audio src={staticFile(voix)} /> : null}
        {FRISE.map((e, i) => (
          <Sequence key={e.id} from={e.debut} durationInFrames={e.duree + (i < FRISE.length - 1 ? FONDU_PLANS : 0)} name={e.id}>
            <Plan index={i} />
          </Sequence>
        ))}
      </AbsoluteFill>
    </LangueGuide>
  );
};

export { DUREE_GUIDE };

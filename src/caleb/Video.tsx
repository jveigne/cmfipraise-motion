import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile } from 'remotion';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import { PastillePartie } from '../journal/plans/commun';
import { CARTONS } from './textes';
import { DUREE_P6, MONTEE, ORCHESTRE } from './calage';
import { DUREE_INTERTITRE, IntertitreCaleb, PartieIntertitre } from './ui/Intertitre';
import { DUREE_P1, DUREE_P10, DUREE_P2, P10Fin, P1Verset, P2Titre } from './plans/Cartons';
import { DUREE_P3, DUREE_P4, P3Carte, P4Arbre } from './plans/Chaine';
import { DUREE_P5, P5Stats, P6CompteRendu } from './plans/Assemblees';
import { DUREE_P7, DUREE_P8, P7Bertoua, P8Brebis } from './plans/Suivi';
import { DUREE_P9, P9Chacun } from './plans/Chacun';

/**
 * Vidéo « Offre Caleb » (Shephr) — V3 du plan 27/10 `05_Plan_Offres_Caleb_Nehemie.md` § 9 : 10 plans
 * et 3 intertitres, 89,0 s (2 670 images), en français, 9:16, sans voix off, sans aucun prix.
 * Storyboard : docs/storyboard-caleb.md. Fil conducteur : Daniel Mercier, dirigeant à Paris (le
 * même que « Journal » et « Étude »), suit SA chaîne de leadership — Sophie, Thomas, Samuel, Marc,
 * et Nadège sous Marc, à Évry, une autre ville : la chaîne, pas la carte.
 *
 * Rythme lent (retours de JP : « trop rapide ») : poses longues, intertitres de 2,5 s, légendes
 * d'explication (deux par plan au plus).
 *
 * Musique : « Dieu fait toutes choses nouvelles », la même que « Journal », « Documents » et
 * « Étude ». Calage (`calage.ts`) : la montée de 24,0 s du fichier tombe sur l'intertitre « 1 · La
 * chaîne », l'orchestre (70,5 s) sur P7 (« Le Message de Bertoua ») ; P6 est le plan tampon.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const VOLUME_AUDIO = 0.9;
const FONDU_ENTREE = 12;
/** Fondu de sortie de 2,5 s, pris sur le plan de fin. */
const FONDU_FINAL = 75;
/** Recouvrement des intertitres : l'aplat monte sur le plan précédent, puis découvre le suivant. */
const RECOUVREMENT = 10;

type Partie = 'chaine' | 'assemblees' | 'etude' | 'chacun';

/** P6 reçoit sa durée calculée (pas d'import de `calage.ts` dans les plans : pas de cycle). */
const P6: React.FC = () => <P6CompteRendu duree={DUREE_P6} />;

type Element =
  | { type: 'plan'; Composant: React.FC; duree: number; partie: Partie | null }
  | { type: 'intertitre'; partie: PartieIntertitre & Partie };

/** Enchaînement du storyboard (§ 3). */
const DECOUPAGE: Element[] = [
  { type: 'plan', Composant: P1Verset, duree: DUREE_P1, partie: null },
  { type: 'plan', Composant: P2Titre, duree: DUREE_P2, partie: null },
  { type: 'intertitre', partie: 'chaine' },
  { type: 'plan', Composant: P3Carte, duree: DUREE_P3, partie: 'chaine' },
  { type: 'plan', Composant: P4Arbre, duree: DUREE_P4, partie: 'chaine' },
  { type: 'intertitre', partie: 'assemblees' },
  { type: 'plan', Composant: P5Stats, duree: DUREE_P5, partie: 'assemblees' },
  { type: 'plan', Composant: P6, duree: DUREE_P6, partie: 'assemblees' },
  { type: 'intertitre', partie: 'etude' },
  { type: 'plan', Composant: P7Bertoua, duree: DUREE_P7, partie: 'etude' },
  { type: 'plan', Composant: P8Brebis, duree: DUREE_P8, partie: 'etude' },
  { type: 'plan', Composant: P9Chacun, duree: DUREE_P9, partie: 'chacun' },
  { type: 'plan', Composant: P10Fin, duree: DUREE_P10, partie: null },
];

const dureeDe = (e: Element) => (e.type === 'plan' ? e.duree : DUREE_INTERTITRE);

const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dureeDe(DECOUPAGE[i - 1])], []);

/** Durée totale (images) : 2 670 = 89,0 s avec le découpage actuel. */
export const DUREE_CALEB = DEBUTS[DEBUTS.length - 1] + dureeDe(DECOUPAGE[DECOUPAGE.length - 1]);
/** Nombre de plans (intertitres non compris). */
export const PLANS_CALEB = DECOUPAGE.filter((e) => e.type === 'plan').length;

const debutIntertitre = (p: Partie) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'intertitre' && e.partie === p)];
const debutPlan = (C: React.FC) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'plan' && e.Composant === C)];

/** Point de départ dans le chant : la montée de 24,0 s sur l'intertitre « 1 · La chaîne ». */
const TRIM_BEFORE = MONTEE - debutIntertitre('chaine');
if (TRIM_BEFORE < 0) throw new Error('Calage musical : l’ouverture dépasse 24 s.');
if (debutPlan(P7Bertoua) + TRIM_BEFORE !== ORCHESTRE) throw new Error('Calage musical : P7 ne tombe pas sur l’orchestre.');
if (DUREE_CALEB > 90 * 30 || DUREE_CALEB < 60 * 30) throw new Error(`Vidéo « Caleb » : ${DUREE_CALEB} images, hors des 60 à 90 s du plan.`);

/** Couleurs des pastilles de partie et des intertitres (storyboard § 2). */
const COULEURS_PARTIES: Record<Partie, string> = {
  chaine: S.sauge,
  assemblees: S.moss,
  etude: S.earthDeep,
  chacun: S.clay,
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

export const VideoCaleb: React.FC = () => (
  <AbsoluteFill>
    <FondShephr />
    <Audio
      src={staticFile(PISTE_AUDIO)}
      trimBefore={TRIM_BEFORE}
      volume={(f) =>
        interpolate(f, [0, FONDU_ENTREE, DUREE_CALEB - FONDU_FINAL, DUREE_CALEB - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
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
          <IntertitreCaleb partie={e.partie} couleur={COULEURS_PARTIES[e.partie]} />
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

export default VideoCaleb;

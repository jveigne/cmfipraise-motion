import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { doux } from '../anim';
import { S } from '../evenements/theme';
import { FondShephr } from '../evenements/ui/Habillage';
import type { Langue } from '../textes';
import { LangueEtude, useEtude } from './langue';
import { DUREE_P10, MONTEE, ORCHESTRE } from './calage';
import { DUREE_INTERTITRE, Intertitre, PartieIntertitre } from './ui/Intertitre';
import { DUREE_P1, DUREE_P2, DUREE_P3, DUREE_P4, P1Salon, P2Cahiers, P3Feuille, P4RienDeVisible } from './plans/Probleme';
import { DUREE_P5, DUREE_P19, P19Fin, P5Bascule } from './plans/Cartons';
import { DUREE_P6, DUREE_P7, P6Lecture, P7Commencer } from './plans/Lire';
import { DUREE_P8, DUREE_P9, DUREE_P11, P10HorsLigne, P11Papier, P8Arrivee, P9Marie } from './plans/Repondre';
import { DUREE_P12, DUREE_P13, DUREE_P14, P12Correction, P13Fermees, P14Echange } from './plans/Corriger';
import { DUREE_P15, DUREE_P16, P15Notes, P16Resultats } from './plans/Terminer';
import { DUREE_P17, DUREE_P18, P17Progression, P18Ville } from './plans/AuFil';
import { PastillePartie } from './plans/commun';

/**
 * Vidéo « L'Étude de l'assemblée » (Shephr) : 19 plans et 4 intertitres, 167 s (5 010 images), en
 * français et en anglais (prop `langue` : `EtudeFR` / `EtudeEN`, textes et données de `textes.ts` /
 * `donnees.ts`, même découpage). Storyboard : docs/storyboard-etude.md (anglais : § 10). Fil conducteur (plan 21/10 § 7.1) : l'assemblée de maison Paris Ouest,
 * un dimanche en journée dans le salon de Samuel ; on suit Samuel, Marie, Jean, Esther, Paul,
 * Hélène, puis Daniel, le dirigeant de la ville.
 *
 * Rythme revu le 21/10 (retour JP : « plus lent, pour bien expliquer », modèle d'« Évènements ») :
 * gestes à vitesse inchangée, poses allongées (`Ralenti`), légendes d'explication ajoutées,
 * intertitres de 2,5 s avant les parties 2 à 5.
 *
 * Musique : « Dieu fait toutes choses nouvelles », la même que « Journal » et « Documents ». Calage
 * (`calage.ts`) : la bascule P5 (image 720 = 24,0 s) tombe sur la montée de 24,0 s du fichier, la
 * vidéo part donc du début du fichier (`trimBefore` 0) ; l'orchestre (70,5 s) tombe sur P11 (image
 * 2 115), le salon où tout le monde répond ; P10 est le plan tampon.
 */
const PISTE_AUDIO = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const VOLUME_AUDIO = 0.9;
const FONDU_ENTREE = 12;
/** Fondu de sortie de 2,5 s, pris sur le plan de fin. */
const FONDU_FINAL = 75;
/** Recouvrement des intertitres : l'aplat monte sur le plan précédent, puis découvre le suivant. */
const RECOUVREMENT = 10;

type Partie = 'probleme' | 'lire' | 'repondre' | 'corriger' | 'terminer' | 'aufil';

/** P10 reçoit sa durée calculée (pas d'import de `calage.ts` dans les plans : pas de cycle). */
const P10: React.FC = () => <P10HorsLigne duree={DUREE_P10} />;

type Element =
  | { type: 'plan'; Composant: React.FC; duree: number; partie: Partie | null }
  | { type: 'intertitre'; partie: PartieIntertitre };

/** Enchaînement du storyboard (§ 3) : P1 → P19, intertitres avant les parties 2 à 5. */
const DECOUPAGE: Element[] = [
  { type: 'plan', Composant: P1Salon, duree: DUREE_P1, partie: 'probleme' },
  { type: 'plan', Composant: P2Cahiers, duree: DUREE_P2, partie: 'probleme' },
  { type: 'plan', Composant: P3Feuille, duree: DUREE_P3, partie: 'probleme' },
  { type: 'plan', Composant: P4RienDeVisible, duree: DUREE_P4, partie: 'probleme' },
  { type: 'plan', Composant: P5Bascule, duree: DUREE_P5, partie: null },
  { type: 'plan', Composant: P6Lecture, duree: DUREE_P6, partie: 'lire' },
  { type: 'plan', Composant: P7Commencer, duree: DUREE_P7, partie: 'lire' },
  { type: 'intertitre', partie: 'repondre' },
  { type: 'plan', Composant: P8Arrivee, duree: DUREE_P8, partie: 'repondre' },
  { type: 'plan', Composant: P9Marie, duree: DUREE_P9, partie: 'repondre' },
  { type: 'plan', Composant: P10, duree: DUREE_P10, partie: 'repondre' },
  { type: 'plan', Composant: P11Papier, duree: DUREE_P11, partie: 'repondre' },
  { type: 'intertitre', partie: 'corriger' },
  { type: 'plan', Composant: P12Correction, duree: DUREE_P12, partie: 'corriger' },
  { type: 'plan', Composant: P13Fermees, duree: DUREE_P13, partie: 'corriger' },
  { type: 'plan', Composant: P14Echange, duree: DUREE_P14, partie: 'corriger' },
  { type: 'intertitre', partie: 'terminer' },
  { type: 'plan', Composant: P15Notes, duree: DUREE_P15, partie: 'terminer' },
  { type: 'plan', Composant: P16Resultats, duree: DUREE_P16, partie: 'terminer' },
  { type: 'intertitre', partie: 'aufil' },
  { type: 'plan', Composant: P17Progression, duree: DUREE_P17, partie: 'aufil' },
  { type: 'plan', Composant: P18Ville, duree: DUREE_P18, partie: 'aufil' },
  { type: 'plan', Composant: P19Fin, duree: DUREE_P19, partie: null },
];

const dureeDe = (e: Element) => (e.type === 'plan' ? e.duree : DUREE_INTERTITRE);

const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dureeDe(DECOUPAGE[i - 1])], []);
export const DUREE_ETUDE = DEBUTS[DEBUTS.length - 1] + dureeDe(DECOUPAGE[DECOUPAGE.length - 1]);

const debutDe = (C: React.FC) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'plan' && e.Composant === C)];

/** Point de départ dans le chant : la montée de 24,0 s sur le début de P5 (720 − 720 = 0). */
const TRIM_BEFORE = MONTEE - debutDe(P5Bascule);
if (TRIM_BEFORE < 0) throw new Error('Calage musical : la partie « Le problème » dépasse 24 s.');
if (debutDe(P11Papier) + TRIM_BEFORE !== ORCHESTRE) throw new Error('Calage musical : P11 ne tombe pas sur l’orchestre.');

/** Couleurs des pastilles de partie et des intertitres (storyboard § 2). */
const COULEURS_PARTIES: Record<Partie, string> = {
  probleme: S.ink2,
  lire: S.moss,
  repondre: S.sauge,
  corriger: S.earthDeep,
  terminer: S.clay,
  aufil: S.mossSoft,
};

/** Étendue de chaque partie : de son premier plan à la fin de son dernier (intertitre exclu). */
const ETENDUES = (Object.keys(COULEURS_PARTIES) as Partie[]).map((partie) => {
  const indices = DECOUPAGE.map((e, i) => (e.type === 'plan' && e.partie === partie ? i : -1)).filter((i) => i >= 0);
  const debut = DEBUTS[indices[0]];
  const fin = DEBUTS[indices[indices.length - 1]] + dureeDe(DECOUPAGE[indices[indices.length - 1]]);
  return { partie, debut, fin };
});

/** Sortie du dessin de P4 sur la montée du chant (10 premières images de P5) : il descend et s'efface. */
const SortieDessin: React.FC = () => {
  const f = useCurrentFrame();
  const p = doux(f, [0, 10], [0, 1]);
  return (
    <AbsoluteFill style={{ opacity: 1 - p, transform: `translateY(${p * 140}px)` }}>
      <Freeze frame={DUREE_P4 - 1}>
        <P4RienDeVisible />
      </Freeze>
    </AbsoluteFill>
  );
};

/**
 * Un plan dans la frise (gabarit d'« Évènements »). Autour d'un intertitre, le plan déborde de
 * `RECOUVREMENT` images : figé sur sa première image avant (`avant`), sur sa dernière après
 * (`apres`), le temps que l'aplat le recouvre ou le découvre.
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

/** Pastilles de partie, dans la langue de la vidéo. */
const Pastilles: React.FC = () => {
  const { cartons } = useEtude();
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

export const VideoEtude: React.FC<{ langue: Langue }> = ({ langue }) => (
  <LangueEtude langue={langue}>
    <AbsoluteFill>
      <FondShephr />
      <Audio
        src={staticFile(PISTE_AUDIO)}
        trimBefore={TRIM_BEFORE}
        volume={(f) =>
          interpolate(f, [0, FONDU_ENTREE, DUREE_ETUDE - FONDU_FINAL, DUREE_ETUDE - 1], [0, VOLUME_AUDIO, VOLUME_AUDIO, 0], {
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

      <Sequence from={debutDe(P5Bascule)} durationInFrames={10}>
        <SortieDessin />
      </Sequence>

      <Pastilles />

      {DECOUPAGE.map((e, i) =>
        e.type === 'intertitre' ? (
          <Sequence key={i} from={DEBUTS[i]} durationInFrames={DUREE_INTERTITRE}>
            <Intertitre partie={e.partie} couleur={COULEURS_PARTIES[e.partie]} />
          </Sequence>
        ) : null,
      )}
    </AbsoluteFill>
  </LangueEtude>
);

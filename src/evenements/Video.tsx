import React from 'react';
import { AbsoluteFill, Audio, Freeze, Sequence, interpolate, staticFile } from 'remotion';
import { DUREE_INTERTITRE, FondShephr, Intertitre, PastilleChapitre } from './ui/Habillage';
import { DUREE_P0, DUREE_P18, P0Ouverture, P18Fin } from './plans/Ouverture';
import {
  DUREE_P1,
  DUREE_P2,
  DUREE_P3,
  DUREE_P4,
  DUREE_P5,
  DUREE_P6,
  DUREE_P7,
  P1Accueil,
  P2TypeDate,
  P3Compte,
  P4SansReseau,
  P5Programmer,
  P6Realisee,
  P7SonAssemblee,
} from './plans/Membre';
import { DUREE_P10, DUREE_P11, DUREE_P8, DUREE_P9, P10Cloture, P11AVerifier, P8Agenda, P9SonNiveau } from './plans/Dirigeant';
import { DUREE_P12, DUREE_P13, P12Perimetres, P13Secretariat } from './plans/Hierarchie';
import { DUREE_P14, DUREE_P15, DUREE_P16, DUREE_P17, P14Remontee, P15Descente, P16UneFois, P17TypeMois } from './plans/Geographie';

/**
 * Musique : « Dieu fait toutes choses nouvelles » (fichier fourni par Jean Philippe le 14/10/2026,
 * 7 min 32). Le chant part doucement, se renforce vers 0:24, puis l'orchestre entre en plein à
 * 70,5 s du fichier. Le calage est calculé depuis le découpage (`CALAGE_AUDIO`, plus bas).
 */
const PISTE_AUDIO: string | null = 'audio/dieu-fait-toutes-choses-nouvelles.mp3';
const IPS = 30;
/** Entrée de l'orchestre dans le fichier, en images. */
const ENTREE_ORCHESTRE = Math.round(70.5 * IPS);
/** Décalage maximal toléré pour faire partir le chant au début du fichier (2 s). */
const DECALAGE_MAX = 2 * IPS;
/** Volume de croisière de la piste (0 → 1). */
const VOLUME_AUDIO = 0.9;
/** Fondu de sortie de la musique : 2,5 s, toutes prises sur le plan de fin (P18). */
const FONDU_FINAL = 75;

/** Recouvrement des intertitres : l'aplat monte sur le plan précédent, puis découvre le suivant. */
const RECOUVREMENT = 10;

type Element =
  | { type: 'plan'; Composant: React.FC; duree: number }
  | { type: 'intertitre'; chapitre: number };

/** Enchaînement du storyboard (docs/storyboard-evenements.md § 3). */
const DECOUPAGE: Element[] = [
  { type: 'plan', Composant: P0Ouverture, duree: DUREE_P0 },
  { type: 'intertitre', chapitre: 1 },
  { type: 'plan', Composant: P1Accueil, duree: DUREE_P1 },
  { type: 'plan', Composant: P2TypeDate, duree: DUREE_P2 },
  { type: 'plan', Composant: P3Compte, duree: DUREE_P3 },
  { type: 'plan', Composant: P4SansReseau, duree: DUREE_P4 },
  { type: 'plan', Composant: P5Programmer, duree: DUREE_P5 },
  { type: 'plan', Composant: P6Realisee, duree: DUREE_P6 },
  { type: 'plan', Composant: P7SonAssemblee, duree: DUREE_P7 },
  { type: 'intertitre', chapitre: 2 },
  { type: 'plan', Composant: P8Agenda, duree: DUREE_P8 },
  { type: 'plan', Composant: P9SonNiveau, duree: DUREE_P9 },
  { type: 'plan', Composant: P10Cloture, duree: DUREE_P10 },
  { type: 'plan', Composant: P11AVerifier, duree: DUREE_P11 },
  { type: 'intertitre', chapitre: 3 },
  { type: 'plan', Composant: P12Perimetres, duree: DUREE_P12 },
  { type: 'plan', Composant: P13Secretariat, duree: DUREE_P13 },
  { type: 'intertitre', chapitre: 4 },
  { type: 'plan', Composant: P14Remontee, duree: DUREE_P14 },
  { type: 'plan', Composant: P15Descente, duree: DUREE_P15 },
  { type: 'plan', Composant: P16UneFois, duree: DUREE_P16 },
  { type: 'plan', Composant: P17TypeMois, duree: DUREE_P17 },
  { type: 'plan', Composant: P18Fin, duree: DUREE_P18 },
];

const dureeDe = (e: Element) => (e.type === 'plan' ? e.duree : DUREE_INTERTITRE);

/** Image de début de chaque élément. */
const DEBUTS = DECOUPAGE.reduce<number[]>((acc, _e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dureeDe(DECOUPAGE[i - 1])], []);

export const DUREE_EVENEMENTS = DEBUTS[DEBUTS.length - 1] + dureeDe(DECOUPAGE[DECOUPAGE.length - 1]);

/** Image de début de l'intertitre du chapitre `n`. */
const debutIntertitre = (n: number) => DEBUTS[DECOUPAGE.findIndex((e) => e.type === 'intertitre' && e.chapitre === n)];

/**
 * Calage de la musique (retour JP 14/10, film porté à ≈ 2 min). On vise l'entrée de l'orchestre
 * sur l'intertitre « La hiérarchie » (chapitre 3) :
 * - s'il tombe avant 70,5 s, la piste démarre en cours de chant (`trimBefore`) ;
 * - s'il tombe après, mais à 2 s au plus, le chant part du début du fichier, décalé d'autant dans
 *   la vidéo (`Sequence from`) : l'orchestre n'entre alors qu'un peu avant l'intertitre ;
 * - au-delà de 2 s, faire attendre la musique laisserait l'ouverture muette trop longtemps : on
 *   aligne plutôt l'orchestre sur l'intertitre « Le dirigeant » (chapitre 2).
 * Avec le découpage actuel (revue du 14/10), « La hiérarchie » est à l'image 2 315 (77,2 s), soit
 * 6,7 s après l'entrée : c'est le troisième cas — « Le dirigeant » est à l'image 1 406 (46,9 s),
 * la vidéo démarre à 23,6 s du fichier (`trimBefore` 709) et l'orchestre éclate sur le chapitre 2.
 */
const INTERTITRE_HIERARCHIE = debutIntertitre(3);
const CIBLE_ORCHESTRE =
  INTERTITRE_HIERARCHIE - ENTREE_ORCHESTRE <= DECALAGE_MAX ? INTERTITRE_HIERARCHIE : debutIntertitre(2);
const CALAGE_AUDIO =
  CIBLE_ORCHESTRE <= ENTREE_ORCHESTRE
    ? { depart: 0, trimBefore: ENTREE_ORCHESTRE - CIBLE_ORCHESTRE }
    : { depart: CIBLE_ORCHESTRE - ENTREE_ORCHESTRE, trimBefore: 0 };

/** Étendue de chaque chapitre (du premier plan jusqu'à l'intertitre suivant ou la fin). */
const CHAPITRES_ETENDUE = [1, 2, 3, 4].map((n) => {
  const i = DECOUPAGE.findIndex((e) => e.type === 'intertitre' && e.chapitre === n);
  const fin = DECOUPAGE.findIndex((e, j) => j > i && (e.type === 'intertitre' || e.Composant === P18Fin));
  return { chapitre: n, debut: DEBUTS[i + 1], fin: DEBUTS[fin] };
});

/**
 * Un plan dans la frise. Autour d'un intertitre, le plan déborde de `RECOUVREMENT` images :
 * figé sur sa première image avant (`avant`), sur sa dernière après (`apres`), le temps que
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

/** Vidéo « Évènements » (Shephr), version française : 4 chapitres, ≈ 125 s (3 745 images). */
export const VideoEvenements: React.FC = () => (
  <AbsoluteFill>
    <FondShephr />
    {PISTE_AUDIO ? (
      <Sequence from={CALAGE_AUDIO.depart} layout="none">
        <Audio
          src={staticFile(PISTE_AUDIO)}
          trimBefore={CALAGE_AUDIO.trimBefore}
          // `f` est local à la séquence : on raisonne en images de la vidéo.
          volume={(f) =>
            interpolate(
              f + CALAGE_AUDIO.depart,
              [CALAGE_AUDIO.depart, CALAGE_AUDIO.depart + 12, DUREE_EVENEMENTS - FONDU_FINAL, DUREE_EVENEMENTS - 1],
              [0, VOLUME_AUDIO, VOLUME_AUDIO, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            )
          }
        />
      </Sequence>
    ) : null}

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

    {CHAPITRES_ETENDUE.map((c) => (
      <Sequence key={c.chapitre} from={c.debut} durationInFrames={c.fin - c.debut} layout="none">
        <PastilleChapitre chapitre={c.chapitre} duree={c.fin - c.debut} />
      </Sequence>
    ))}

    {DECOUPAGE.map((e, i) =>
      e.type === 'intertitre' ? (
        <Sequence key={i} from={DEBUTS[i]} durationInFrames={DUREE_INTERTITRE}>
          <Intertitre chapitre={e.chapitre} />
        </Sequence>
      ) : null,
    )}
  </AbsoluteFill>
);

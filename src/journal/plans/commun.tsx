import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { Legende } from '../../ui/Legende';
import { P, S } from '../../evenements/theme';

/**
 * Outils communs aux plans de la vidéo « Journal de l'assemblée ». Les briques génériques
 * (`Appui`, `Voile`, `montee`, `lisse`, `Decale`, `Fondu`) viennent d'« Évènements », sans
 * modification : on les réexporte ici.
 */
export { Appui, Decale, Fondu, Voile, lisse, montee, voilePour } from '../../evenements/plans/commun';

/** Taille de la légende : 80 px, réduite pour qu'une ligne longue tienne sur 960 px. */
const tailleLegende = (lignes: readonly string[]) => {
  const longueur = Math.max(...lignes.map((l) => l.replace(/\*/g, '').length));
  return Math.min(80, Math.floor(1880 / longueur));
};

/**
 * Légende Shephr (Fraunces 600, encre, mot clé en argile), posée à l'image `debut` du plan ; son
 * fondu de sortie s'achève sur l'image `fin` (par défaut la dernière du plan `duree`).
 */
export const LegendeJournal: React.FC<{ lignes: readonly string[]; duree: number; debut?: number; fin?: number }> = ({
  lignes,
  duree,
  debut = 6,
  fin = duree - 1,
}) => {
  const f = useCurrentFrame();
  if (f < debut || f > fin) return null;
  return (
    <Legende
      lignes={[...lignes]}
      duree={fin - debut}
      debut={debut}
      taille={tailleLegende(lignes)}
      delais={[0, 10]}
      police={P.serif}
      couleur={S.ink}
      couleurAccent={S.clay}
    />
  );
};

/**
 * Pastille de partie en haut de l'image (gabarit de `PastilleChapitre` d'« Évènements » : y = 56,
 * JetBrains Mono 26 px, texte blanc cassé), visible toute la partie.
 */
export const PastillePartie: React.FC<{ texte: string; couleur: string; duree: number }> = ({ texte, couleur, duree }) => {
  const f = useCurrentFrame();
  const opacite = interpolate(f, [0, 10, duree - 8, duree], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', top: 56, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: opacite }}>
      <div
        style={{
          padding: '10px 26px',
          borderRadius: 99,
          background: couleur,
          color: S.white,
          fontFamily: P.mono,
          fontWeight: 500,
          fontSize: 26,
          letterSpacing: 2.5,
        }}
      >
        {texte}
      </div>
    </div>
  );
};

/** Ressort sans dépassement, borné à [0, 1] (apparitions). */
export const borne = (v: number) => Math.max(0, Math.min(1, v));

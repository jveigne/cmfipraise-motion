import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Legende } from '../../ui/Legende';
import { P, S } from '../../evenements/theme';

/**
 * Outils communs aux plans de la vidéo « Documents » : ceux d'« Évènements » (`Appui`, `Voile`,
 * `montee`, `lisse`, `Fondu`) et de « Journal » (légende à taille ajustée, pastille de partie,
 * `borne`), réexportés sans modification ; la légende reprend le gabarit de « Journal ».
 */
export { Appui, Fondu, Voile, lisse, montee, voilePour } from '../../evenements/plans/commun';
export { PastillePartie, borne } from '../../journal/plans/commun';

/**
 * Légende Shephr (gabarit de `LegendeJournal`) : 80 px, réduite pour qu'une ligne longue tienne
 * sur 960 px — un peu plus tôt que dans « Journal » (« Un document pour la France… » passait sur
 * deux lignes).
 */
const tailleLegende = (lignes: readonly string[]) => {
  const longueur = Math.max(...lignes.map((l) => l.replace(/\*/g, '').length));
  return Math.min(80, Math.floor(1720 / longueur));
};

export const LegendeDocuments: React.FC<{ lignes: readonly string[]; duree: number; debut?: number; fin?: number }> = ({
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

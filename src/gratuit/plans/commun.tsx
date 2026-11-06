import React from 'react';
import { doux } from '../../anim';
import { LegendeDocuments } from '../../documents/plans/commun';

/**
 * Outils communs aux plans de la vidéo « Gratuit » : ceux d'« Évènements » (`Appui`, `Voile`,
 * `montee`, `lisse`), de « Journal » (pastille de partie), d'« Étude » (pastille de personne, halo
 * entre deux images) et la légende à taille ajustée de « Documents », réexportés sans modification.
 */
export { Appui, Voile, lisse, montee, voilePour } from '../../evenements/plans/commun';
export { PastillePartie } from '../../journal/plans/commun';
export { PastillePersonne, Y_PASTILLE, haloEntre } from '../../etude/plans/commun';

/**
 * Durée d'un plan à téléphone : 250 images (8,3 s). Une seule idée par plan, une légende pour
 * l'idée (≈ 4 s), puis une légende d'explication (≈ 4 s) — rythme lent demandé par JP (« trop
 * rapide » sur les vidéos précédentes). P6 (la Hiérarchie) est le plan tampon du calage musical.
 */
export const DUREE_PLAN = 250;

/**
 * Les deux légendes d'un plan : l'idée de l'image 6 à `bascule`, puis son explication de
 * `bascule + 6` à la fin du plan.
 */
export const DeuxLegendes: React.FC<{ idee: readonly string[]; explication: readonly string[]; bascule: number; duree: number }> = ({
  idee,
  explication,
  bascule,
  duree,
}) => (
  <>
    <LegendeDocuments lignes={idee} duree={duree} fin={bascule} />
    <LegendeDocuments lignes={explication} duree={duree} debut={bascule + 6} />
  </>
);

/** Pastille de personne visible tout le plan : fondu d'entrée et de sortie de 10 images. */
export const opacitePersonne = (f: number, duree: number) => doux(f, [4, 14, duree - 10, duree], [0, 1, 1, 0]);

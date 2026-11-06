import React, { createContext, useContext } from 'react';
import type { Langue } from '../textes';
import { TEXTES_ETUDE, TextesEtude } from './textes';
import { DONNEES, DonneesEtude } from './donnees';

/**
 * Langue de la vidéo « L'Étude de l'assemblée » (mécanisme de `src/journal/langue.tsx`). La
 * composition reçoit `langue` en prop ; un contexte la met à disposition des plans et des écrans :
 * `useEtude()` rend les textes (`legendes`, `cartons`, `app`) et les données fictives (`d`) de la
 * langue. Hors fournisseur, c'est le français. Le français et l'anglais existent (`EtudeEN`,
 * 21/10) : une langue sans textes ni données lève une erreur plutôt que de montrer du français.
 */
export type Etude = TextesEtude & { langue: Langue; d: DonneesEtude };

const etudeDe = (langue: Langue): Etude => {
  const textes = TEXTES_ETUDE[langue];
  const d = DONNEES[langue];
  if (!textes || !d) throw new Error(`Vidéo « Étude » : pas de textes ni de données pour la langue « ${langue} ».`);
  return { ...textes, langue, d };
};

const FRANCAIS = etudeDe('fr');

const Contexte = createContext<Etude>(FRANCAIS);

export const LangueEtude: React.FC<{ langue: Langue; children: React.ReactNode }> = ({ langue, children }) => (
  <Contexte.Provider value={langue === 'fr' ? FRANCAIS : etudeDe(langue)}>{children}</Contexte.Provider>
);

export const useEtude = () => useContext(Contexte);

/** Jeu complet préparé ailleurs (vidéo « Guide », JP 26/10 : séance en plusieurs plages). Sans effet sur EtudeFR / EN. */
export const FournisseurEtude: React.FC<{ valeur: Etude; children: React.ReactNode }> = ({ valeur, children }) => (
  <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
);

import React, { createContext, useContext } from 'react';
import type { Langue } from '../textes';
import { FournisseurJournal, Journal } from '../journal/langue';
import { FournisseurEtude, Etude } from '../etude/langue';
import { TEXTES_GUIDE, TextesGuide } from './textes';
import { Variante, etudeGuide, journalGuide } from './donnees';

/**
 * Langue de la vidéo « Guide » (GuideFR / GuideEN) : `useGuide()` rend les textes de la vidéo ; les
 * écrans repris de « Journal » et d'« Étude » lisent, eux, leurs propres contextes, alimentés par
 * `AvecJournal` / `AvecEtude` avec l'assemblée de la vidéo (`donnees.ts`).
 */
export type Guide = TextesGuide & { langue: Langue };

const Contexte = createContext<Guide>({ ...TEXTES_GUIDE.fr, langue: 'fr' });

const JOURNAUX: Record<Langue, Journal> = { fr: journalGuide('fr'), en: journalGuide('en') };
const ETUDES: Record<Langue, Record<Variante, Etude>> = {
  fr: { lecon: etudeGuide('fr', 'lecon'), plage1: etudeGuide('fr', 'plage1'), plage2: etudeGuide('fr', 'plage2') },
  en: { lecon: etudeGuide('en', 'lecon'), plage1: etudeGuide('en', 'plage1'), plage2: etudeGuide('en', 'plage2') },
};

export const LangueGuide: React.FC<{ langue: Langue; children: React.ReactNode }> = ({ langue, children }) => (
  <Contexte.Provider value={{ ...TEXTES_GUIDE[langue], langue }}>{children}</Contexte.Provider>
);

export const useGuide = () => useContext(Contexte);

/** Écrans de « Journal » avec l'assemblée de la vidéo. */
export const AvecJournal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { langue } = useGuide();
  return <FournisseurJournal valeur={JOURNAUX[langue]}>{children}</FournisseurJournal>;
};

/** Écrans d'« Étude » : la leçon entière (réponses ouvertes) ou l'une des deux plages. */
export const AvecEtude: React.FC<{ variante?: Variante; children: React.ReactNode }> = ({ variante = 'lecon', children }) => {
  const { langue } = useGuide();
  return <FournisseurEtude valeur={ETUDES[langue][variante]}>{children}</FournisseurEtude>;
};

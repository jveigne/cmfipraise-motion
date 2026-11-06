import React, { createContext, useContext } from 'react';
import type { Langue } from '../textes';
import { TEXTES_JOURNAL, TextesJournal } from './textes';
import { DONNEES, DonneesJournal } from './donnees';

/**
 * Langue de la vidéo « Journal de l'assemblée » (JournalFR / JournalEN, JP 14/10/2026). La
 * composition reçoit `langue` en prop, comme CategoriesFR / CategoriesEN ; plutôt que de la faire
 * descendre dans les 18 plans, un contexte la met à disposition : `useJournal()` rend les textes
 * (`legendes`, `cartons`, `app`) et les données fictives (`d`) de la langue. Hors fournisseur,
 * c'est le français.
 */
export type Journal = TextesJournal & { langue: Langue; d: DonneesJournal };

const journalDe = (langue: Langue): Journal => ({ ...TEXTES_JOURNAL[langue], langue, d: DONNEES[langue] });

const JOURNAUX: Record<Langue, Journal> = { fr: journalDe('fr'), en: journalDe('en') };

const Contexte = createContext<Journal>(JOURNAUX.fr);

export const LangueJournal: React.FC<{ langue: Langue; children: React.ReactNode }> = ({ langue, children }) => (
  <Contexte.Provider value={JOURNAUX[langue]}>{children}</Contexte.Provider>
);

export const useJournal = () => useContext(Contexte);

/**
 * Fournisseur d'un jeu complet (textes + données) préparé ailleurs : la vidéo « Guide » (16:9, JP
 * 26/10) y passe l'assemblée Paris Ouest / Leeds West de « Étude ». Sans effet sur JournalFR / EN.
 */
export const FournisseurJournal: React.FC<{ valeur: Journal; children: React.ReactNode }> = ({ valeur, children }) => (
  <Contexte.Provider value={valeur}>{children}</Contexte.Provider>
);

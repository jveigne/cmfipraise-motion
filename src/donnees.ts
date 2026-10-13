/**
 * Contenu réel de l'app, extrait de l'API publique le 13/10/2026 (`data/contenu.json`) :
 * catégories françaises, chants des catégories, paroles.
 *
 * Les catégories anglaises n'existent pas dans l'app : leurs noms sont la traduction directe
 * des noms français (brief), et leurs chants ont été choisis dans le recueil anglais
 * « Christ The Victor ». L'écran anglais est donc une maquette.
 */
import contenu from '../data/contenu.json';
import type { Langue } from './textes';

export type Categorie = { nom: string; chants: number };
export type Chant = { titre: string; auteur: string | null; accords: boolean };
export type Partie = { type: 'couplet' | 'refrain'; lignes: string[] };
export type Paroles = { titre: string; auteur: string; parties: Partie[] };

type Contenu = {
  categories: Record<Langue, Categorie[]>;
  merci: Record<Langue, Chant[]>;
  combat: Record<Langue, Chant[]>;
  priere: Record<Langue, Chant[]>;
  favoris: Record<Langue, Chant[]>;
  paroles: Record<Langue, Paroles>;
};

export const CONTENU = contenu as Contenu;

/** Index des catégories utilisées par les plans. */
export const CAT_MERCI = 0;
export const CAT_COMBAT = 1;
export const CAT_PRIERE = 15;

/** Position du chant ouvert au plan 5 dans la liste « Actions et combats ». */
export const CHANT_OUVERT: Record<Langue, number> = { fr: 2, en: 4 };

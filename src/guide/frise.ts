/**
 * Découpage de la vidéo « Guide » (sans React) : l'ordre des plans, leur partie, leur durée et
 * leurs timecodes. La durée de chaque plan se calcule depuis ses textes, la plus longue des deux
 * langues (FR et EN ont donc le même découpage et la même durée) :
 * - lecture de l'écran : 1 s pour 12 caractères + 1,2 s d'entrée, 3,5 s au moins (consigne JP) ;
 * - voix : mots / 2,5 + 1 s de respiration (le script de narration doit tenir dans le plan) ;
 * - plancher propre au plan (`PLANCHERS`) quand l'animation demande plus.
 * Arrondi au quart de seconde supérieur. Lu par `Video.tsx` et par `scripts/script-voix-guide.ts`.
 */
import { ID_PLANS, IdPlan, TEXTES_GUIDE, motsVoix, texteLu } from './textes';

export const IPS = 30;

export type Partie = 'intro' | 'journal' | 'etude' | 'lien' | 'fin';

export const partieDe = (id: IdPlan): Partie => {
  if (id.startsWith('i')) return 'intro';
  if (id === 't1' || id.startsWith('j')) return 'journal';
  if (id === 't2' || id.startsWith('e')) return 'etude';
  if (id === 't3' || id.startsWith('l')) return 'lien';
  return 'fin';
};

export const estIntertitre = (id: IdPlan) => id.startsWith('t');

/** Planchers (secondes) des plans dont l'animation dure plus que leurs textes. */
const PLANCHERS: Partial<Record<IdPlan, number>> = {
  i1: 6,
  i3: 7,
  t1: 4,
  t2: 4,
  t3: 4,
  j3: 6,
  e8: 8,
  e12: 7,
  e14: 9,
  e19: 8,
  e24: 7,
  l1: 8,
  c3: 6,
};

const LECTURE_CAR_PAR_S = 12;
const MOTS_PAR_S = 2.5;

const secondesDe = (id: IdPlan) => {
  const candidats = (Object.keys(TEXTES_GUIDE) as (keyof typeof TEXTES_GUIDE)[]).flatMap((l) => {
    const p = TEXTES_GUIDE[l].plans[id];
    return [Math.max(3.5, texteLu(p).length / LECTURE_CAR_PAR_S + 1.2), motsVoix(p) / MOTS_PAR_S + 1];
  });
  const s = Math.max(PLANCHERS[id] ?? 0, ...candidats);
  return Math.ceil(s * 4) / 4;
};

export interface ElementFrise {
  id: IdPlan;
  partie: Partie;
  debut: number;
  duree: number;
}

export const FRISE: ElementFrise[] = (() => {
  let t = 0;
  return ID_PLANS.map((id) => {
    const duree = Math.round(secondesDe(id) * IPS);
    const e = { id, partie: partieDe(id), debut: t, duree };
    t += duree;
    return e;
  });
})();

export const DUREE_GUIDE = FRISE[FRISE.length - 1].debut + FRISE[FRISE.length - 1].duree;

export const elementDe = (id: IdPlan) => FRISE.find((e) => e.id === id)!;

/** Numéro d'étape d'un plan dans sa partie (intertitres exclus) et nombre d'étapes de la partie. */
export const etapeDe = (id: IdPlan) => {
  const partie = partieDe(id);
  const plans = FRISE.filter((e) => e.partie === partie && !estIntertitre(e.id));
  return { n: plans.findIndex((e) => e.id === id) + 1, total: plans.length };
};

/** « 1:23.5 » : timecode lisible (minutes, secondes, dixièmes). */
export const timecode = (images: number) => {
  const s = images / IPS;
  const m = Math.floor(s / 60);
  const r = s - m * 60;
  return `${m}:${r.toFixed(1).padStart(4, '0')}`;
};

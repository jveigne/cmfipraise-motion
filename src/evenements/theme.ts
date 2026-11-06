/**
 * Couleurs et polices de Shephr (reprises de shephr-app/mobile/theme/colors.ts et
 * typography.ts), pour la vidéo « Évènements ». Indépendant de `src/theme.ts` (CMFIPraise) :
 * la vidéo « Catégories » n'en dépend pas.
 */
import { chargerPolice } from '../polices';

export const S = {
  moss: '#1E3A2F',
  mossDeep: '#16291F',
  mossSoft: '#2E5142',
  mossTint: 'rgba(30,58,47,0.06)',
  mossTint2: 'rgba(30,58,47,0.12)',

  parchment: '#E8DCC4',
  parchmentDeep: '#D7C7A6',
  paper: '#F5ECD8',
  paper2: '#FBF5E6',

  earth: '#C9956B',
  earthDeep: '#A7754B',
  clay: '#B86A4A',

  ink: '#2A2620',
  ink2: '#5C544A',
  ink3: '#8B8275',

  hair: 'rgba(42,38,32,0.10)',
  hairStrong: 'rgba(42,38,32,0.18)',

  /** « white » de l'app : un blanc cassé, jamais #FFF. */
  white: '#F2E9D2',
  /** Teinte de la tuile « Hiérarchie » de l'accueil (home.tsx). */
  sauge: '#7A8B6F',
} as const;

/** Rayons de l'app (theme/colors.ts › radii). */
export const R = { sm: 10, md: 16, lg: 22, xl: 28 } as const;

// L'app charge Fraunces 400 / 500 / 600, Inter 400 → 700 et JetBrains Mono 400 / 500
// (mobile/app/_layout.tsx). L'italique de Fraunces sert au prénom de l'accueil.
export const P = {
  serif: chargerPolice('Fraunces', 'fraunces', { normal: ['400', '500', '600'], italic: ['300', '400'] }),
  sans: chargerPolice('Inter', 'inter', { normal: ['400', '500', '600', '700'] }),
  mono: chargerPolice('JetBrains Mono', 'jetbrains-mono', { normal: ['400', '500'] }),
} as const;

/** Couleur de chaque chapitre (pastille et intertitre), prise dans la palette de l'app. */
export const CHAPITRES = [
  { numero: 1, titre: 'Le membre', pastille: '1 · MEMBRE', couleur: S.moss },
  { numero: 2, titre: 'Le dirigeant', pastille: '2 · DIRIGEANT', couleur: S.clay },
  { numero: 3, titre: 'La hiérarchie', pastille: '3 · HIÉRARCHIE', couleur: S.sauge },
  { numero: 4, titre: 'La géographie', pastille: '4 · GÉOGRAPHIE', couleur: S.earthDeep },
] as const;

/** Onde du doigt (`Toucher`) aux couleurs de Shephr. */
export const ONDE = 'rgba(30,58,47,0.65)';

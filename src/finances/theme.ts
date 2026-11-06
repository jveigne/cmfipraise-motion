/**
 * Style de la série « Enseignements sur les finances » (Théodore Andoseh) : sobre, parchemin, encre
 * sombre et accents dorés. Sans marque d'application. Polices déjà présentes dans `public/fonts/`.
 */
import { chargerPolice } from '../polices';

export const F = {
  parchemin: '#F3EAD6',
  papier: '#FBF6E9',
  filet: '#D9CBAE',
  encre: '#2B2419',
  encre2: '#6B5F4D',
  or: '#C9992F',
  orClair: '#E9C76B',
  orFonce: '#7F5710',
  cuir: '#6B4A2F',
  cuirClair: '#8A6543',
  argile: '#A8452E',
} as const;

export const PoliceF = {
  serif: chargerPolice('Fraunces', 'fraunces', { normal: ['400', '500', '600'], italic: ['300', '400'] }),
  sans: chargerPolice('Inter', 'inter', { normal: ['400', '500', '600'] }),
} as const;

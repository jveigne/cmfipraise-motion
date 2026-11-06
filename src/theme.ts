/**
 * Couleurs et polices de l'app (reprises de cmfipraise-app/constants/theme.ts et des styles
 * des écrans), pour que le motion paraisse la suite naturelle de l'app.
 */
import { chargerPolice } from './polices';

export const Couleurs = {
  bleuCmfi: '#1668B8',
  /** Bleu des écrans Recueils (liste des chants, paroles) : `#0077be` dans l'app. */
  bleuListe: '#0077BE',
  encre: '#12171C',
  encreListe: '#1F2937',
  ardoise: '#5C6873',
  grisTexte: '#6B7280',
  page: '#F3F5F7',
  fondEcran: '#F9FAFB',
  filet: '#E4E9ED',
  filetListe: '#E5E7EB',
  surface: '#FFFFFF',
  bleuClair: '#E7F0F9',
  bleuPastille: '#EEF2FF',
  bleuToggle: '#EEF3FC',
  gris: '#9AA3AB',
  grisBouton: '#F3F4F6',
  rose: '#EC4899',
  /** Plein écran (mode présentation). */
  nuitPresentation: '#1F2937',
  boutonPresentation: '#374151',
} as const;

export const Polices = {
  serif: chargerPolice('Newsreader', 'newsreader', { normal: ['400', '600'], italic: ['400'] }),
  sans: chargerPolice('Instrument Sans', 'instrument-sans', { normal: ['400', '500', '600'] }),
} as const;

/** 30 images par seconde : le storyboard est découpé en secondes, 1 s = 30 images. */
export const FPS = 30;

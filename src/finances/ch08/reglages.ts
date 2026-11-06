import type { Partie } from '../moteur/frise';

/**
 * Réglages de mise en page du texte, par plan (ex. p3 : { taille: 42 } ou { pages: [2] } ou { mode: 'remplace' }).
 * Le texte lui-même vient du storyboard et ne se règle pas ici.
 */
export const REGLAGES: Record<string, Partial<Pick<Partie, 'mode' | 'pages' | 'taille'>>> = {
  // Le calcul automatique coupe mal : p5 déborderait presque, p7, p8 et p12 tiennent sur une seule page.
  p5: { pages: [2] },
  p7: { pages: [] },
  p8: { pages: [] },
  p12: { pages: [] },
};

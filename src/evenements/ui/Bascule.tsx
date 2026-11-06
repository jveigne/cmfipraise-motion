import React from 'react';

/**
 * Chiffre qui bascule verticalement de `de` à `a` (annotation vidéo : dans l'app, la valeur
 * s'affiche directement à jour). `p` de 0 à 1. Le conteneur garde la largeur du plus long.
 */
export const Bascule: React.FC<{ de: React.ReactNode; a: React.ReactNode; p: number; hauteur: number }> = ({
  de,
  a,
  p,
  hauteur,
}) => {
  if (p <= 0.001) return <>{de}</>;
  if (p >= 0.999) return <>{a}</>;
  return (
    <span style={{ position: 'relative', display: 'inline-block', height: hauteur, overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{ visibility: 'hidden' }}>{String(a).length >= String(de).length ? a : de}</span>
      <span style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', transform: `translateY(${-p * hauteur}px)`, opacity: 1 - p }}>
        {de}
      </span>
      <span style={{ position: 'absolute', left: 0, right: 0, top: 0, textAlign: 'center', transform: `translateY(${(1 - p) * hauteur}px)`, opacity: p }}>
        {a}
      </span>
    </span>
  );
};

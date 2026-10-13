import React from 'react';

export const DrapeauFR: React.FC<{ largeur: number }> = ({ largeur }) => (
  <svg width={largeur} height={(largeur * 2) / 3} viewBox="0 0 3 2" style={{ borderRadius: 2 }}>
    <rect width="1" height="2" x="0" fill="#0055A4" />
    <rect width="1" height="2" x="1" fill="#FFFFFF" />
    <rect width="1" height="2" x="2" fill="#EF4135" />
  </svg>
);

export const DrapeauUK: React.FC<{ largeur: number; id: string }> = ({ largeur, id }) => (
  <svg width={largeur} height={largeur / 2} viewBox="0 0 60 30" style={{ borderRadius: 2 }}>
    <clipPath id={`${id}-s`}>
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id={`${id}-t`}>
      <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
    </clipPath>
    <g clipPath={`url(#${id}-s)`}>
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

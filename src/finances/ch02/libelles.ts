/** Tous les mots écrits dans les illustrations de ce chapitre : ils doivent venir du texte du chapitre. */
export const LIBELLES = {
  chapitre: 'chapitre',
  pages: [
    { numero: '2', mot: 'spontanés' },
    { numero: '4', mot: 'sacrificiels' },
    { numero: '5', mot: 'contrefaits' },
    { numero: '6', mot: 'administration' },
  ],
  negation: 'négation',
  dimes: 'dîmes',
  offrandes: 'offrandes',
  indicateur: 'indicateur',
  coupes: [
    { mot: 'cinq', talents: 5 },
    { mot: 'deux', talents: 2 },
    { mot: 'un', talents: 1 },
  ],
  talents: 'talents',
  besoins: 'besoins',
  projets: 'projets',
  charge: 'la charge',
  fils: 'fils d’',
  encouragement: 'encouragement',
  sacerdotal: 'service sacerdotal',
  diaconal: 'service diaconal',
} as const;

/**
 * Jetons de l'espace web Shephr (« Espace ministère »), recopiés de
 * `shephr-app/web/src/theme/styles.css` (`:root`) : la vidéo « Offre Néhémie » redessine des
 * pages web, pas des écrans de l'app mobile. Mêmes polices que l'app (`P` de `evenements/theme`).
 */
export const W = {
  green900: '#14271F',
  green800: '#1E3A2F',
  green700: '#2A5142',
  green600: '#3E6B59',
  green50: '#EAF1EC',

  earth700: '#8E6B47',
  earth500: '#C9956B',
  earth50: '#F5E6D2',

  parchment: '#E8DCC4',
  ivory: '#F4EBD3',
  ivoryCard: '#FBF5E4',
  ivoryRaised: '#FFFAEC',

  ink900: '#2A2419',
  ink800: '#3A2E20',
  ink700: '#4E4131',
  ink500: '#7A6B55',
  ink400: '#9B8B73',
  ink300: '#B8AA90',

  line: '#D7C7A6',
  lineSoft: '#E3D5B5',
  lineStrong: '#BFAB85',

  ok: '#2F6B4C',
  okBg: '#DCE9DC',
  warn: '#B07A2A',
  warnBg: '#F2E2C2',
  err: '#A8463A',
  errBg: '#F0D8CF',

  /** Texte de la barre latérale (`.sidebar` : `#E8DCC4`) et de l'élément actif (`#FBF5E4`). */
  sidebarText: 'rgba(232,220,196,.78)',
  sidebarActive: '#FBF5E4',
  sidebarLabel: 'rgba(232,220,196,.42)',

  shadowSm: '0 1px 0 rgba(58,46,32,.04), 0 1px 2px rgba(58,46,32,.05)',
  shadowLg: '0 12px 40px rgba(20,39,31,.18), 0 2px 6px rgba(20,39,31,.08)',
} as const;

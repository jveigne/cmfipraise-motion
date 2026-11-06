import React from 'react';
import { S } from '../../evenements/theme';

/**
 * Planisphère simplifié en aplats (storyboard § 2, P3, P5, P6) : continents tracés à la main en
 * quelques dizaines de points (longitude, latitude), projection équirectangulaire. Aucune donnée
 * téléchargée, aucune dépendance. Cadrage : de 87° O à 48° E, de 72° N à 40° S — l'Atlantique au
 * centre, la France et le Cameroun bien visibles ; l'Asie et le Pacifique sortent du cadre.
 *
 * Toutes les positions sont en pixels vidéo (1080 × 1920) : `proj(lon, lat)`.
 */
export const CARTE = { k: 8, lon0: -87, lat0: 72, haut: 600, hauteur: 112 * 8 } as const;

export const proj = (lon: number, lat: number) => ({
  x: (lon - CARTE.lon0) * CARTE.k,
  y: CARTE.haut + (CARTE.lat0 - lat) * CARTE.k,
});

type Pt = readonly [number, number];

const AMERIQUE_NORD: Pt[] = [
  [-168, 66], [-156, 71.3], [-140, 69.6], [-128, 70], [-115, 68], [-95, 72], [-82, 73], [-80, 68], [-88, 64],
  [-94, 59], [-92, 57], [-82, 55], [-79, 52], [-77, 58], [-78, 62], [-72, 61], [-64, 60], [-61, 56], [-56, 52],
  [-60, 48], [-66, 45], [-70, 43], [-70, 41.5], [-74, 40.5], [-76, 37], [-75.5, 35], [-81, 31.5], [-80, 27],
  [-80.5, 25], [-82, 26.5], [-83, 29.5], [-89, 30], [-94, 29.5], [-97, 27], [-97.5, 22], [-95, 18.5],
  [-91, 18.5], [-90.5, 21], [-87, 21.5], [-88, 16], [-84, 15.5], [-83.5, 11], [-79.5, 9], [-77.5, 8],
  [-80, 7.5], [-83, 8.5], [-86, 11], [-88, 13.3], [-92, 14.5], [-96, 15.7], [-105, 19.5], [-106, 23],
  [-110, 24], [-112.5, 29], [-114.5, 31], [-117, 32.5], [-120.5, 34.5], [-124, 40], [-124.5, 46], [-123, 49],
  [-130, 54], [-137, 59], [-147, 60.5], [-154, 57.5], [-162, 55], [-158, 58.5], [-165, 62], [-168, 66],
];
const GROENLAND: Pt[] = [
  [-73, 78], [-60, 82], [-30, 83.5], [-20, 81], [-18, 77], [-22, 72], [-24, 69.5], [-35, 65.5], [-43, 60],
  [-48, 61], [-53, 66], [-55, 70], [-60, 75], [-73, 78],
];
const AMERIQUE_SUD: Pt[] = [
  [-77.5, 8], [-72, 12], [-63, 10.5], [-60, 8.5], [-52, 5], [-50, 0], [-44, -2.5], [-35, -5], [-35, -9],
  [-39, -13.5], [-39, -18], [-41, -22], [-48, -25.5], [-48.5, -28], [-53, -33.5], [-58, -34.5], [-57, -38],
  [-62, -39], [-65, -41], [-64.5, -43], [-67.5, -46], [-66, -48], [-69, -51], [-68.5, -52.5], [-71, -54],
  [-74.5, -52], [-74, -47], [-73.5, -43], [-73.5, -37], [-71.5, -30], [-70.3, -18], [-75.5, -15], [-81, -6],
  [-80.5, -2], [-80, 1], [-78, 2.5], [-77.5, 8],
];
const AFRIQUE: Pt[] = [
  [-17, 21], [-13, 27.5], [-9.5, 30], [-6, 35.8], [-2, 35.2], [3, 36.8], [10, 37.3], [11, 33.5], [20, 31],
  [25, 31.6], [32, 31.2], [34.5, 28], [37, 22], [39, 15.5], [43, 12.5], [51, 11.8], [51, 10.5], [48, 4.5],
  [40.5, -3], [39, -8], [40.5, -11], [40.5, -15.5], [35, -20], [35.5, -24], [32.5, -28.5], [28, -33],
  [22, -34.5], [18.5, -34], [17.5, -29], [15, -26.5], [11.8, -17], [13.5, -11], [12, -5], [9, -1], [9.5, 3.5],
  [6, 4.3], [1, 6], [-4, 5.2], [-7.5, 4.4], [-11, 6.8], [-13.5, 9.5], [-16.7, 12.5], [-17.5, 14.7], [-16, 19],
  [-17, 21],
];
const EURASIE: Pt[] = [
  [-9.5, 36.9], [-9, 43], [-1.8, 43.4], [-1.2, 46], [-4.7, 48.2], [-1.5, 48.7], [1.5, 50.1], [4, 51.4], [8, 53.5],
  [8.5, 57], [10.5, 57.5], [10.5, 54.5], [14, 54], [19, 54.5], [21, 57], [24, 57.5], [24.5, 59.4], [28, 60],
  [22.5, 60.3], [21, 61.5], [21.5, 63.5], [25, 65], [21.5, 65.6], [18, 63], [17.5, 61], [18.8, 59.5], [16.5, 57],
  [12.8, 55.5], [11, 58.8], [5.5, 58.5], [5, 61.5], [8, 63.5], [14, 67.5], [18, 69.8], [26, 71], [31, 70],
  [41, 67.5], [44, 68.5], [55, 68.5], [60, 69.5], [68, 69], [73, 72.5], [80, 72], [87, 75], [100, 76.5],
  [113, 73.5], [130, 71], [140, 72.5], [160, 70], [180, 68.5], [180, 65], [170, 60], [163, 59.5], [162, 56],
  [156, 51], [156, 57], [160, 61], [143, 59.3], [135, 54.5], [141, 52], [140, 48], [133, 43], [129, 41],
  [129.5, 35.2], [126.5, 34.5], [125, 39.5], [121.5, 39], [117.7, 39], [119, 37], [122.5, 36.8], [120.5, 33],
  [122, 30], [119.5, 25], [114, 22.3], [108, 21.5], [106, 19], [109, 15], [109, 11.5], [105, 8.6], [103, 10.5],
  [100.5, 13.5], [100, 10], [101.5, 6.5], [103.5, 1.5], [101, 2.5], [98.5, 8], [98.2, 13], [97.5, 17],
  [94.5, 16], [92, 21], [89, 21.7], [86.5, 20], [80.2, 15.5], [80, 10.3], [77.5, 8], [76, 10], [73, 17],
  [72.6, 21], [70, 22.7], [66.5, 25.4], [61.5, 25.2], [57, 25.8], [56.4, 27], [51.5, 27.9], [48.5, 30],
  [50, 26.5], [51.5, 24.5], [56, 26.3], [56.5, 24], [59.8, 22.5], [57.5, 19], [52, 16], [45, 12.8], [43, 14],
  [39, 21], [35, 28], [34.5, 29.5], [32.5, 30], [34, 31.5], [35.5, 33.9], [36, 36], [32, 36.2], [28, 36.7],
  [26.3, 38.5], [26.5, 40.2], [29, 41], [28, 41.6], [28.5, 43.3], [30.5, 46.5], [33.5, 44.5], [37.5, 47],
  [39.5, 47], [36.5, 45.2], [38, 44.5], [41.5, 41.5], [36, 41.5], [31, 41.2], [26, 40.6], [23.5, 40.2],
  [24, 38], [21, 37], [19.5, 40.5], [19.3, 42], [15.5, 44.5], [13.7, 45.6], [12.4, 44.8], [16, 41.5],
  [18.5, 40.2], [15.6, 38], [15.7, 40], [12, 41.7], [10, 44], [7.5, 43.8], [3.5, 43.3], [3.1, 42], [0.8, 41],
  [-0.3, 39.5], [0, 38.6], [-2.1, 36.7], [-5.3, 36], [-6.5, 36.8], [-9.5, 36.9],
];
const ILES: Pt[][] = [
  // Grande-Bretagne, Irlande, Islande
  [[-5.7, 50], [1.5, 51.1], [1.7, 52.7], [0, 53.5], [-1.6, 55.5], [-2, 57.6], [-4, 58.6], [-5, 58.6], [-6.2, 56.6], [-5, 55], [-3, 54.5], [-4.5, 53.3], [-5.3, 51.7], [-5.7, 50]],
  [[-6, 52], [-6, 54], [-8, 55.2], [-10, 54], [-10, 51.6], [-6, 52]],
  [[-24, 65.5], [-14, 66.2], [-13.5, 64.8], [-18, 63.4], [-22.5, 63.8], [-24, 65.5]],
  // Cuba, Hispaniola, Madagascar, Sicile, Sardaigne-Corse
  [[-85, 21.8], [-74.1, 20.2], [-77.5, 19.9], [-82, 22.5], [-85, 21.8]],
  [[-74.5, 19.8], [-68.5, 18.8], [-71, 17.8], [-74.5, 18.3], [-74.5, 19.8]],
  [[49.3, -12], [50.5, -15.5], [47, -25], [44, -25], [43.5, -21], [44.5, -16], [49.3, -12]],
  [[12.4, 38.1], [15.6, 38.2], [15, 36.7], [12.4, 38.1]],
  [[8.2, 41], [9.6, 42.9], [9.8, 39.2], [8.4, 39], [8.2, 41]],
];

/** France métropolitaine et Cameroun : tracés plus fins, mis en évidence. */
export const FRANCE: Pt[] = [
  [2.5, 51.1], [4.2, 49.9], [8.2, 49], [7.6, 47.6], [6.9, 46.4], [7, 45.3], [7.6, 43.8], [6, 43.1], [4.5, 43.5],
  [3.1, 42.5], [-1.8, 43.4], [-1.2, 46], [-2.5, 47.3], [-4.7, 48.2], [-3, 48.8], [-1.5, 48.7], [-1.3, 49.7],
  [1.5, 50.1], [2.5, 51.1],
];
export const CAMEROUN: Pt[] = [
  [8.5, 4.5], [9.7, 3.6], [9.8, 2.3], [11.3, 2.2], [16, 2.2], [16.2, 3.0], [14.6, 4.2], [14.5, 6.2], [15.5, 7.5],
  [14.6, 8.5], [14.3, 11.3], [14.6, 12.2], [14.1, 13.1], [13.2, 11.4], [12.4, 8.6], [11.7, 7], [11, 6.6],
  [10.5, 7], [9.5, 6.4], [8.5, 4.5],
];

const chemin = (pts: Pt[]) =>
  pts.map(([lon, lat], i) => {
    const p = proj(lon, lat);
    return `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }).join(' ') + ' Z';

const TERRES = [AMERIQUE_NORD, GROENLAND, AMERIQUE_SUD, AFRIQUE, EURASIE, ...ILES].map(chemin).join(' ');
const CHEMIN_FR = chemin(FRANCE);
const CHEMIN_CM = chemin(CAMEROUN);

/** Villes et pays repères (lon, lat). */
export const LIEUX = {
  paris: [2.35, 48.85],
  douala: [9.7, 4.05],
  france: [2.4, 46.6],
  cameroun: [12.5, 5.6],
  montreal: [-73.6, 45.5],
  abidjan: [-4.0, 5.3],
  kinshasa: [15.3, -4.3],
  saoPaulo: [-46.6, -23.5],
  newYork: [-74, 40.7],
  bruxelles: [4.35, 50.85],
  londres: [-0.1, 51.5],
  johannesburg: [28, -26.2],
  dakar: [-17.4, 14.7],
  nairobi: [36.8, -1.3],
  portAuPrince: [-72.3, 18.5],
  geneve: [6.1, 46.2],
  libreville: [9.45, 0.4],
  lome: [1.2, 6.1],
  moscou: [37.6, 55.7],
  bogota: [-74.1, 4.7],
} as const satisfies Record<string, Pt>;

export const pos = (l: keyof typeof LIEUX) => proj(LIEUX[l][0], LIEUX[l][1]);

const melange = (a: string, b: string, t: number) => {
  const ha = a.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  const hb = b.match(/\w\w/g)!.map((h) => parseInt(h, 16));
  return `rgb(${ha.map((v, i) => Math.round(v + (hb[i] - v) * t)).join(',')})`;
};

/** Teintes des pays allumés (P6) : la France en terre, le Cameroun en mousse claire. */
export const TEINTE_FR = S.earthDeep;
export const TEINTE_CM = S.mossSoft;
/** Teinte de la nappe « Tout le ministère » sur les terres. */
const TERRE = '#D7C7A6';
const TERRE_NAPPE = '#9DAA8F';

/**
 * Le planisphère. `nappe` (0 → 1) : la nappe « Tout le ministère » descend du haut et teinte toutes
 * les terres ; `fr`, `cm` (0 → 1) : la France, le Cameroun s'allument ; `attenue` (0 → 1) : les
 * autres terres pâlissent (P6, quand chacun ne voit que son pays).
 */
export const Planisphere: React.FC<{ nappe?: number; fr?: number; cm?: number; attenue?: number; opacite?: number }> = ({
  nappe = 0,
  fr = 0,
  cm = 0,
  attenue = 0,
  opacite = 1,
}) => {
  const coupe = CARTE.haut - 40 + (CARTE.hauteur + 80) * nappe;
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0, opacity: opacite }}>
      <defs>
        <clipPath id="doc-nappe">
          <rect x={0} y={0} width={1080} height={Math.max(0, coupe)} />
        </clipPath>
        {/* Bas de la carte estompé (l'Antarctique n'est pas dessiné) : masque, pas d'aplat, pour
            laisser voir les halos du fond. */}
        <linearGradient id="doc-fondu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
        <mask id="doc-masque" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
          <rect x={0} y={0} width={1080} height={CARTE.haut + CARTE.hauteur - 160} fill="#FFFFFF" />
          <rect x={0} y={CARTE.haut + CARTE.hauteur - 160} width={1080} height={160} fill="url(#doc-fondu)" />
        </mask>
      </defs>
      <g mask="url(#doc-masque)">
      <path d={TERRES} fill={TERRE} stroke={S.ink3} strokeOpacity={0.45} strokeWidth={1.5} strokeLinejoin="round" opacity={1 - 0.45 * attenue} />
      {nappe > 0 ? (
        <g clipPath="url(#doc-nappe)">
          <path d={TERRES} fill={TERRE_NAPPE} stroke={S.moss} strokeOpacity={0.5} strokeWidth={1.5} strokeLinejoin="round" opacity={1 - 0.45 * attenue} />
        </g>
      ) : null}
      <path
        d={CHEMIN_FR}
        fill={fr > 0 ? melange(nappe > 0.5 ? TERRE_NAPPE : TERRE, TEINTE_FR, fr) : 'none'}
        stroke={fr > 0 ? TEINTE_FR : 'none'}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <path
        d={CHEMIN_CM}
        fill={cm > 0 ? melange(nappe > 0.5 ? TERRE_NAPPE : TERRE, TEINTE_CM, cm) : 'none'}
        stroke={cm > 0 ? TEINTE_CM : 'none'}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      </g>
    </svg>
  );
};

/** Halo pulsant autour d'un pays allumé (pixels vidéo). */
export const Pulsation: React.FC<{ x: number; y: number; p: number; couleur: string; rayon?: number }> = ({ x, y, p, couleur, rayon = 70 }) =>
  p <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x - rayon,
        top: y - rayon,
        width: rayon * 2,
        height: rayon * 2,
        borderRadius: '50%',
        border: `4px solid ${couleur}`,
        opacity: (1 - p) * 0.9,
        transform: `scale(${0.4 + p})`,
      }}
    />
  );

/** Point de ville (pixels vidéo). */
export const Point: React.FC<{ x: number; y: number; couleur: string; echelle?: number; taille?: number }> = ({ x, y, couleur, echelle = 1, taille = 16 }) =>
  echelle <= 0.001 ? null : (
    <div
      style={{
        position: 'absolute',
        left: x - taille / 2,
        top: y - taille / 2,
        width: taille,
        height: taille,
        borderRadius: '50%',
        background: couleur,
        border: `3px solid ${S.paper2}`,
        boxShadow: '0 3px 8px rgba(42,38,32,0.25)',
        transform: `scale(${echelle})`,
      }}
    />
  );

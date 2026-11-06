import React from 'react';
import { Easing, interpolate, interpolateColors } from 'remotion';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

type Pt = [number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Chute : part doucement, arrive vite. */
const chute = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
const rad = (deg: number) => (deg * Math.PI) / 180;
const trace = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')} Z`;
const alea = (i: number) => {
  const v = Math.sin(i * 127.1 + 11.7) * 43758.5453;
  return v - Math.floor(v);
};

/** Rayons autour d'un centre, sur une ellipse. */
const Rayons: React.FC<{ x: number; y: number; rx: number; ry: number; long: number; n?: number; o: number; depart?: number; ecart?: number }> = ({ x, y, rx, ry, long, n = 16, o, depart = 0, ecart }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const a = rad(depart + i * (ecart ?? 360 / n));
      return (
        <line
          key={i}
          x1={x + Math.cos(a) * rx}
          y1={y + Math.sin(a) * ry}
          x2={x + Math.cos(a) * (rx + long)}
          y2={y + Math.sin(a) * (ry + long)}
          stroke={F.or}
          strokeWidth={6}
          strokeLinecap="round"
        />
      );
    })}
  </g>
);

const Halo: React.FC<{ id: string; x: number; y: number; rx: number; ry: number; o: number }> = ({ id, x, y, rx, ry, o }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0%" stopColor={F.orClair} stopOpacity={0.95} />
        <stop offset="60%" stopColor={F.orClair} stopOpacity={0.4} />
        <stop offset="100%" stopColor={F.orClair} stopOpacity={0} />
      </radialGradient>
    </defs>
    <ellipse cx={x} cy={y} rx={rx} ry={ry} fill={`url(#${id})`} />
  </g>
);

/* ------------------------------------------------------------------ */
/* La clé : un même contour qui passe du bloc brut à la clé.           */
/* ------------------------------------------------------------------ */

const ARC = Array.from({ length: 25 }, (_, i) => rad(15 + (i * 330) / 24));
const HAUT_TIGE = [-23, 0, 25, 50, 75, 95];
const BAS_TIGE: Pt[] = [
  [95, 36],
  [82, 36],
  [82, 24],
  [72, 24],
  [72, 36],
  [58, 36],
  [58, 10],
  [25, 10],
  [0, 10],
  [-23, 10],
];

const FORME_CLE: Pt[] = [
  ...HAUT_TIGE.map((x): Pt => [x, -10]),
  ...BAS_TIGE,
  ...ARC.map((a): Pt => [-60 + 38 * Math.cos(a), 38 * Math.sin(a)]),
];
const rond = (v: number, e: number) => Math.sign(v) * Math.abs(v) ** e;
/** Après le deuxième rouleau : tige amincie, tête et panneton encore en bloc. */
const FORME_EBAUCHE: Pt[] = [
  ...HAUT_TIGE.map((x): Pt => [x, -18]),
  ...BAS_TIGE.map(([x]): Pt => [x, x >= 58 ? 36 : 18]),
  ...ARC.map((a): Pt => [-60 + 37 * rond(Math.cos(a), 0.6), 38 * rond(Math.sin(a), 0.6)]),
];
const FORME_LINGOT: Pt[] = [
  ...HAUT_TIGE.map((x): Pt => [x, -42]),
  ...BAS_TIGE.map(([x]): Pt => [x, 42]),
  ...ARC.map((a): Pt => {
    const c = Math.cos(a);
    const s = Math.sin(a);
    return c > 0 ? [-60 + 36 * c, 42 * Math.sign(s)] : [-60 + 36 * rond(c, 0.4), 42 * rond(s, 0.4)];
  }),
];
const FORME_BRUTE: Pt[] = FORME_LINGOT.map(([x, y], i): Pt => [x + (alea(i) - 0.5) * 16, y * 1.35 + (alea(i + 50) - 0.5) * 22]);
const FORMES = [FORME_BRUTE, FORME_LINGOT, FORME_EBAUCHE, FORME_CLE];

const contourCle = (etape: number) => {
  const k = Math.min(2, Math.floor(etape));
  const t = etape - k;
  const pts = FORMES[k].map(([x, y], i): Pt => [lerp(x, FORMES[k + 1][i][0], t), lerp(y, FORMES[k + 1][i][1], t)]);
  const r = 15 * Math.max(0, etape - 2);
  const trou = r > 0.5 ? ` M${-60 - r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z` : '';
  return trace(pts) + trou;
};

/** `etape` : 0 bloc brut, 1 lingot, 2 ébauche, 3 clé. Dessinée à plat, panneton vers la droite. */
const Cle: React.FC<{ etape?: number }> = ({ etape = 3 }) => (
  <path
    d={contourCle(etape)}
    fillRule="evenodd"
    fill={interpolateColors(etape, [0, 1, 2, 3], [F.encre2, F.cuirClair, F.orFonce, F.or])}
    stroke={F.encre}
    strokeWidth={4}
    strokeLinejoin="round"
  />
);

/** Clé tenue par l'œil de son anneau : (x, y) est le trou, l'angle 90 pointe vers le bas. */
const ClePendue: React.FC<{ x: number; y: number; angle: number }> = ({ x, y, angle }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) translate(60 0)`}>
    <Cle />
  </g>
);

/* ------------------------------------------------------------------ */
/* Le coffre, celui du plan 5 et de la fin.                            */
/* ------------------------------------------------------------------ */

const Coffre: React.FC<{ x: number; y: number; s?: number; ouvert?: number }> = ({ x, y, s = 1, ouvert = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* Le couvercle relevé et ce que contient le coffre. */}
    <g opacity={ouvert}>
      <path d="M-128 -128 C-128 -232 128 -232 128 -128 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <path d="M-90 -128 C-90 -160 -80 -178 -70 -188 M90 -128 C90 -160 80 -178 70 -188" fill="none" stroke={F.orFonce} strokeWidth={9} />
      <rect x={-130} y={-136} width={260} height={30} fill={F.encre} />
      {[
        [-82, -128, 26],
        [-30, -136, 28],
        [30, -132, 28],
        [84, -128, 26],
        [-56, -146, 24],
        [4, -158, 26],
        [58, -150, 24],
      ].map(([px, py, r], i) => (
        <Piece key={i} x={px} y={py} r={r} />
      ))}
    </g>
    {/* Le couvercle fermé. */}
    <g opacity={1 - ouvert} transform={`translate(0 ${-34 * ouvert})`}>
      <path d="M-134 -110 C-134 -180 134 -180 134 -110 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d="M-92 -110 C-92 -130 -86 -144 -78 -152 M92 -110 C92 -130 86 -144 78 -152" fill="none" stroke={F.encre} strokeWidth={21} />
      <path d="M-92 -110 C-92 -130 -86 -144 -78 -152 M92 -110 C92 -130 86 -144 78 -152" fill="none" stroke={F.or} strokeWidth={16} />
    </g>
    {/* La caisse. */}
    <rect x={-130} y={-110} width={260} height={110} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    {[-74, -38].map((yl) => (
      <line key={yl} x1={-128} x2={128} y1={yl} y2={yl} stroke={F.encre} strokeWidth={2} opacity={0.45} />
    ))}
    {[-92, 92].map((xb) => (
      <rect key={xb} x={xb - 8} y={-110} width={16} height={110} fill={F.or} stroke={F.encre} strokeWidth={2.5} />
    ))}
    <rect x={-26} y={-122} width={52} height={58} rx={5} fill={F.or} stroke={F.encre} strokeWidth={3.5} />
    <circle cx={0} cy={-100} r={7} fill={F.encre} />
    <path d="M-4 -98 L-7 -80 H7 L4 -98 Z" fill={F.encre} />
  </g>
);

/* ------------------------------------------------------------------ */
/* Plan 1 — La fiole et la goutte.                                     */
/* ------------------------------------------------------------------ */

const CONTOUR_FIOLE = 'M-20 -130 L-20 -76 C-20 -60 -78 -44 -78 8 C-78 58 -42 80 0 80 C42 80 78 58 78 8 C78 -44 20 -60 20 -76 L20 -130 Z';
const GOUTTE = 'M0 -20 C6 -8 13 -2 13 8 A13 13 0 1 1 -13 8 C-13 -2 -6 -8 0 -20 Z';

const IlluFiole: React.FC<PropsIllustration> = ({ f }) => {
  const incline = p(f, 15, 70);
  const angle = 110 * incline;
  const fx = 267;
  const fy = 190;
  const bec: Pt = [fx + 142 * Math.sin(rad(angle)), fy - 142 * Math.cos(rad(angle))];
  const niveau = lerp(-16, 8, incline);
  const IMPACT = 628;
  const gouttes = [
    { naissance: 72, depart: 92, arrivee: 128 },
    { naissance: 148, depart: 166, arrivee: 200 },
  ];
  const lueur = p(f, 128, 178);
  const rayon = 300 * lueur;
  const pulse = 0.92 + 0.08 * Math.sin(f / 9);
  return (
    <Scene>
      <defs>
        <clipPath id="ch06-fiole"><path d={CONTOUR_FIOLE} /></clipPath>
        <clipPath id="ch06-mot"><circle cx={400} cy={IMPACT} r={rayon} /></clipPath>
      </defs>
      <Halo id="ch06-halo-mot" x={400} y={650} rx={380} ry={190} o={lueur * pulse} />
      <Rayons x={400} y={650} rx={300} ry={118} long={44} n={18} depart={10} o={p(f, 190, 225)} />
      <text x={400} y={690} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={124} fontWeight={600} fill={F.encre}>{LIBELLES.appel}</text>
      <g clipPath="url(#ch06-mot)">
        <text x={400} y={690} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={124} fontWeight={600} fill={F.orFonce}>{LIBELLES.appel}</text>
      </g>
      {gouttes.map((g) => {
        const tombe = chute(f, g.depart, g.arrivee);
        const nait = p(f, g.naissance, g.depart);
        const onde = p(f, g.arrivee, g.arrivee + 30);
        return (
          <g key={g.depart}>
            {nait > 0 && tombe < 1 ? (
              <path d={GOUTTE} transform={`translate(${bec[0]} ${lerp(bec[1] + 14, IMPACT - 20, tombe)}) scale(${nait * 1.15})`} fill={F.or} stroke={F.orFonce} strokeWidth={2} />
            ) : null}
            {onde > 0 && onde < 1 ? (
              <ellipse cx={400} cy={IMPACT} rx={20 + onde * 190} ry={6 + onde * 34} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - onde} />
            ) : null}
          </g>
        );
      })}
      <g transform={`translate(${fx} ${fy}) rotate(${angle})`}>
        <path d={CONTOUR_FIOLE} fill={F.papier} />
        <g clipPath="url(#ch06-fiole)">
          <g transform={`rotate(${-angle})`}>
            <rect x={-300} y={niveau} width={600} height={400} fill={F.or} />
            <line x1={-300} x2={300} y1={niveau} y2={niveau} stroke={F.orFonce} strokeWidth={3} />
          </g>
        </g>
        <path d={CONTOUR_FIOLE} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M-56 14 C-56 -8 -46 -22 -32 -34" fill="none" stroke={F.papier} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        <rect x={-29} y={-144} width={58} height={16} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 2 — Les trois rouleaux.                                        */
/* ------------------------------------------------------------------ */

const XR = [215, 420, 625];
const Y_LAMINOIR = 300;
const R_ROULEAU = 70;
const S_METAL = 0.9;
/** Longueur, en amont de l'axe, sur laquelle le rouleau écrase le métal. */
const MORSURE = 60;
/** Demi-épaisseur laissée par chaque rouleau, quand rien ne l'oblige à s'écarter. */
const SERRAGE = [42, 18, 10].map((e) => e * S_METAL);

const densifie = (pts: Pt[], n: number) =>
  pts.flatMap(([x, y], i) => {
    const [a, b] = pts[(i + 1) % pts.length];
    return Array.from({ length: n }, (_, k): Pt => [lerp(x, a, k / n), lerp(y, b, k / n)]);
  });
const FORMES_FINES = FORMES.map((forme) => densifie(forme, 3));

/** Étape atteinte par le métal à l'abscisse X : il change de forme là où un rouleau le serre, et seulement là. */
const etapeEn = (X: number) =>
  XR.reduce((e, xr) => {
    const t = Math.max(0, Math.min(1, (X - (xr - MORSURE)) / MORSURE));
    return e + t * t * (3 - 2 * t);
  }, 0);

/** Contour du métal quand son centre est en cx : ce qui a passé un rouleau a déjà sa nouvelle forme. */
const contourLamine = (cx: number) => {
  const pts = FORMES_FINES[3].map(([px], i): Pt => {
    const e = etapeEn(cx + S_METAL * px);
    const k = Math.min(2, Math.floor(e));
    const a = FORMES_FINES[k][i];
    const b = FORMES_FINES[k + 1][i];
    return [lerp(a[0], b[0], e - k), lerp(a[1], b[1], e - k)];
  });
  const r = 15 * Math.max(0, etapeEn(cx - 60 * S_METAL) - 2);
  const trou = r > 0.5 ? ` M${-60 - r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0 Z` : '';
  return trace(pts) + trou;
};

/** Écart entre l'axe du métal et un rouleau : il serre, et ne s'écarte que de ce qu'il faut pour rester au contact. */
const ecartRouleau = (i: number, cote: 1 | -1, cx: number) =>
  FORMES_FINES[i + 1].reduce((g, [px, py]) => {
    const dx = cx + S_METAL * px - XR[i];
    if (Math.abs(dx) >= R_ROULEAU) return g;
    return Math.max(g, cote * py * S_METAL - (R_ROULEAU - Math.sqrt(R_ROULEAU * R_ROULEAU - dx * dx)));
  }, SERRAGE[i]);

/** Un cylindre d'acier strié : les stries tournent avec lui. */
const Rouleau: React.FC<{ x: number; y: number; angle: number; actif: number }> = ({ x, y, angle, actif }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={R_ROULEAU} fill={interpolateColors(actif, [0, 1], [F.cuir, F.cuirClair])} stroke={F.encre} strokeWidth={4} />
    <g transform={`rotate(${angle})`}>
      {Array.from({ length: 20 }, (_, i) => (
        <line key={i} x1={Math.cos(rad(i * 18)) * 56} y1={Math.sin(rad(i * 18)) * 56} x2={Math.cos(rad(i * 18)) * 66} y2={Math.sin(rad(i * 18)) * 66} stroke={F.encre} strokeWidth={3} opacity={0.55} />
      ))}
    </g>
    <circle r={24} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
    <circle r={10} fill={F.or} stroke={F.encre} strokeWidth={3} />
  </g>
);

const IlluRouleaux: React.FC<PropsIllustration> = ({ f, d }) => {
  const Y = Y_LAMINOIR;
  const cx = interpolate(f, [d[0] + 10, d[0] + 235], [65, 720], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
  const tete = cx + S_METAL * 95;
  const queue = cx - S_METAL * 98;
  const etape = etapeEn(cx);
  const sortie = p(f, d[1], d[1] + 50);
  const posX = lerp(cx, 490, sortie);
  const posY = lerp(Y, 690, sortie) + Math.sin(sortie * Math.PI) * -30;
  const echelle = lerp(S_METAL, 1.7, sortie);
  const machine = 1 - 0.55 * sortie;
  const fini = p(f, d[1] + 60, d[1] + 110);
  const souvenir = p(f, d[1] + 110, d[1] + 150);
  const reflet = fini * (0.75 + 0.25 * Math.sin(f / 10));
  const metal = (
    <g transform={`translate(${posX} ${posY}) scale(${echelle})`}>
      <path
        d={contourLamine(cx)}
        fillRule="evenodd"
        fill={interpolateColors(etape, [0, 1, 2, 3], [F.encre2, F.cuirClair, F.orFonce, F.or])}
        stroke={F.encre}
        strokeWidth={4}
        strokeLinejoin="round"
      />
    </g>
  );
  return (
    <Scene>
      {/* Le bâti est derrière : rien ne barre le passage du métal. */}
      <g opacity={machine}>
        <rect x={20} y={96} width={755} height={408} rx={16} fill={F.parchemin} stroke={F.filet} strokeWidth={5} />
      </g>
      {sortie === 0 ? metal : null}
      <g opacity={machine}>
        {XR.map((xr, i) => {
          const actif = p(tete, xr - MORSURE - 20, xr - MORSURE + 10) * (1 - p(queue, xr - 25, xr + 5));
          const fait = p(cx, xr - 40, xr + 20);
          const angle = (cx / R_ROULEAU) * (180 / Math.PI);
          const haut = lerp(ecartRouleau(i, -1, cx), SERRAGE[i], sortie);
          const bas = lerp(ecartRouleau(i, 1, cx), SERRAGE[i], sortie);
          return (
            <g key={xr}>
              <Rouleau x={xr} y={Y - haut - R_ROULEAU} angle={-angle} actif={actif} />
              <Rouleau x={xr} y={Y + bas + R_ROULEAU} angle={angle} actif={actif} />
              <Libelle x={xr} y={68} taille={31} graisse={600} couleur={F.orFonce} opacite={fait}>{LIBELLES.rouleaux[i]}</Libelle>
            </g>
          );
        })}
      </g>
      <Rayons x={490} y={690} rx={204} ry={104} long={30} n={20} depart={9} o={reflet} />
      <g opacity={souvenir}>
        <g transform="translate(150 690)">
          <path d={contourCle(0)} fill="none" stroke={F.encre2} strokeWidth={3} strokeDasharray="9 8" strokeLinejoin="round" />
        </g>
      </g>
      {sortie > 0 ? metal : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 3 — Le chemin et ses trois bornes.                             */
/* ------------------------------------------------------------------ */

const ROUTE: [Pt, Pt, Pt, Pt][] = [
  [[30, 838], [250, 860], [540, 850], [680, 750]],
  [[680, 750], [770, 685], [720, 570], [560, 545]],
  [[560, 545], [320, 510], [130, 540], [95, 410]],
  [[95, 410], [65, 300], [190, 255], [340, 250]],
  [[340, 250], [480, 245], [620, 262], [770, 235]],
];
const TRACE_ROUTE = `M${ROUTE[0][0].join(' ')} ${ROUTE.map((s) => `C${s[1].join(' ')} ${s[2].join(' ')} ${s[3].join(' ')}`).join(' ')}`;

const TABLE: { x: number; y: number; s: number; seg: number }[] = (() => {
  const t: { x: number; y: number; s: number; seg: number }[] = [];
  let s = 0;
  let px = ROUTE[0][0][0];
  let py = ROUTE[0][0][1];
  ROUTE.forEach(([a, b, c, e], seg) => {
    for (let i = 0; i <= 200; i++) {
      const u = i / 200;
      const v = 1 - u;
      const x = v ** 3 * a[0] + 3 * v * v * u * b[0] + 3 * v * u * u * c[0] + u ** 3 * e[0];
      const y = v ** 3 * a[1] + 3 * v * v * u * b[1] + 3 * v * u * u * c[1] + u ** 3 * e[1];
      s += Math.hypot(x - px, y - py);
      px = x;
      py = y;
      t.push({ x, y, s, seg });
    }
  });
  return t;
})();
const LONGUEUR_ROUTE = TABLE[TABLE.length - 1].s;
const surRoute = (s: number) => TABLE.find((e) => e.s >= s) ?? TABLE[TABLE.length - 1];
const STATION = [
  TABLE.find((e) => e.seg === 0 && e.x >= 350)!,
  TABLE.find((e) => e.seg === 2 && 470 >= e.x)!,
  TABLE.find((e) => e.seg === 4 && e.x >= 570)!,
];

const Borne: React.FC<{ x: number; base: number; n: number; allumee: number }> = ({ x, base, n, allumee }) => (
  <g>
    <path d={`M${x - 34} ${base} V${base - 138} C${x - 34} ${base - 180} ${x + 34} ${base - 180} ${x + 34} ${base - 138} V${base} Z`} fill={interpolateColors(allumee, [0, 1], [F.filet, F.orClair])} stroke={F.encre} strokeWidth={4} />
    {Array.from({ length: n }, (_, i) => (
      <line key={i} x1={x + (i - (n - 1) / 2) * 15} x2={x + (i - (n - 1) / 2) * 15} y1={base - 128} y2={base - 92} stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
    ))}
    <line x1={x - 44} x2={x + 44} y1={base} y2={base} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const Corde: React.FC<{ d: string; l?: number; couleur?: string }> = ({ d, l = 7, couleur = F.cuirClair }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={F.encre} strokeWidth={l + 4} />
    <path d={d} stroke={couleur} strokeWidth={l} />
  </g>
);

/** L'ânesse, de profil, tournée vers la droite. L'origine est au sol, sous son ventre. */
const Anesse: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" strokeLinecap="round">
    <path d="M-92 -110 C-112 -100 -116 -72 -112 -50" fill="none" />
    <ellipse cx={-112} cy={-40} rx={7} ry={15} fill={F.encre} />
    <path d="M-42 -62 L-46 0 H-30 L-24 -62 Z M8 -62 L12 0 H28 L30 -62 Z" fill={F.encre} />
    <path d="M78 -166 C80 -196 88 -218 98 -226 C104 -206 100 -182 90 -160 Z" fill={F.encre2} />
    <path d="M-92 -112 C-60 -128 -10 -122 25 -124 C45 -135 60 -160 72 -172 C88 -170 112 -142 122 -122 C128 -110 120 -100 108 -102 C92 -106 78 -118 66 -124 C58 -108 52 -92 46 -74 L44 0 H28 L24 -60 C0 -52 -40 -54 -58 -60 L-56 0 H-72 L-78 -40 C-82 -52 -92 -62 -95 -80 C-100 -95 -98 -105 -92 -112 Z" fill={F.encre2} />
    <path d="M66 -168 C58 -198 58 -222 66 -234 C78 -222 82 -196 80 -166 Z" fill={F.encre2} />
    <path d="M70 -188 C66 -202 66 -212 68 -220" fill="none" stroke={F.encre} strokeWidth={2 / s} />
    <path d="M110 -134 C124 -122 128 -106 108 -102 C100 -104 96 -108 92 -114 C96 -124 102 -130 110 -134 Z" fill={F.parchemin} strokeWidth={2.5 / s} />
    <path d="M28 -126 C46 -136 58 -152 68 -168" fill="none" strokeWidth={7 / s} />
    <circle cx={90} cy={-146} r={4.5} fill={F.encre} stroke="none" />
    <circle cx={112} cy={-116} r={2.5} fill={F.encre} stroke="none" />
  </g>
);

type Boucle = { x: number; y: number; rx: number; ry: number; a: number };
const melange = (b0: Boucle, b1: Boucle, t: number, e: number): Boucle => ({
  x: lerp(b0.x, b1.x, t),
  y: lerp(b0.y, b1.y, t),
  rx: lerp(b0.rx, b1.rx, e),
  ry: lerp(b0.ry, b1.ry, e),
  a: lerp(b0.a, b1.a, e),
});
const COURONNE: [Boucle, Boucle] = [{ x: 69, y: -148, rx: 4, ry: 25, a: -5 }, { x: 46, y: -10, rx: 25, ry: 11, a: 0 }];
const MUSEROLLE: [Boucle, Boucle] = [{ x: 97, y: -120, rx: 4, ry: 18, a: 24 }, { x: 112, y: -10, rx: 22, ry: 11, a: 0 }];
const ANNEAU: [Pt, Pt] = [[90, -104], [141, -9]];

const BoucleLicol: React.FC<{ b: Boucle }> = ({ b }) => (
  <g transform={`translate(${b.x} ${b.y}) rotate(${b.a})`}>
    <Corde d={`M${-b.rx} 0 a${b.rx} ${b.ry} 0 1 0 ${2 * b.rx} 0 a${b.rx} ${b.ry} 0 1 0 ${-2 * b.rx} 0 Z`} l={5} couleur={F.orClair} />
  </g>
);

/**
 * Le licol, dans le repère de l'ânesse : la boucle derrière les oreilles, la muserolle, le montant qui les relie, l'anneau de longe.
 * Vu de profil sur la tête (t = 0), il finit à plat sur le sol (t = 1), ses deux boucles ouvertes : `e` règle cette ouverture.
 */
const Licol: React.FC<{ t: number; e: number }> = ({ t, e }) => {
  const c = melange(COURONNE[0], COURONNE[1], t, e);
  const m = melange(MUSEROLLE[0], MUSEROLLE[1], t, e);
  return (
    <g>
      <BoucleLicol b={c} />
      <BoucleLicol b={m} />
      <Corde d={`M${c.x + c.rx} ${c.y} L${m.x - m.rx} ${m.y}`} l={5} couleur={F.orClair} />
      <circle cx={lerp(ANNEAU[0][0], ANNEAU[1][0], t)} cy={lerp(ANNEAU[0][1], ANNEAU[1][1], t)} r={7} fill={F.or} stroke={F.encre} strokeWidth={3} />
    </g>
  );
};

const IlluChemin: React.FC<PropsIllustration> = ({ f, d }) => {
  const [A, B, C] = STATION;
  const s = A.s * p(f, d[0] - 10, d[0] + 110) + (B.s - A.s) * p(f, d[1], d[1] + 110) + (C.s - B.s) * p(f, d[2], d[2] + 70);
  const pos = surRoute(s);
  const base = (st: { y: number }) => st.y - 33;
  // Premier signe : l'ânesse attachée, le licol qui se dénoue et tombe, l'ânesse libre.
  const sol = base(A);
  const X_ANE = 185;
  const S_ANE = 0.85;
  const denoue = p(f, d[0] + 135, d[0] + 170);
  const tombe = chute(f, d[0] + 170, d[0] + 196);
  const libre = p(f, d[0] + 205, d[0] + 265);
  const aneX = X_ANE - 34 * libre;
  const aneY = sol - Math.abs(Math.sin(libre * Math.PI * 3)) * 7;
  // Le licol glisse de la tête et finit à plat sur le sol, ses boucles ouvertes.
  const etale = p(f, d[0] + 170, d[0] + 214);
  const anneauX = X_ANE + S_ANE * lerp(ANNEAU[0][0], ANNEAU[1][0], tombe);
  const anneauY = sol + S_ANE * lerp(ANNEAU[0][1], ANNEAU[1][1], tombe);
  const nx = A.x - 34;
  const ny = sol - 112;
  const bout: Pt = [lerp(nx - 4, nx - 2, denoue), lerp(ny + 6, sol - 3, chute(f, d[0] + 135, d[0] + 170))];
  const creux = Math.min(sol - 3, (anneauY + bout[1]) / 2 + 24);
  // Deuxième signe : le pain, posé sur sa pierre, n'arrive qu'avec sa phrase.
  const pain = p(f, d[1], d[1] + 30);
  const bx = 305;
  const by = 378;
  const S_PAIN = 0.8;
  const fissure = p(f, d[1] + 250, d[1] + 270);
  const partage = p(f, d[1] + 270, d[1] + 295);
  const donne = p(f, d[1] + 300, d[1] + 365);
  const recu = p(f, d[1] + 362, d[1] + 390);
  const partX = lerp(bx + S_PAIN * (22 + 30 * partage), B.x, donne);
  const partY = lerp(by, B.y - 8, donne);
  // Troisième signe : les rayons et l'autre homme.
  const rayons = p(f, d[2] + 75, d[2] + 130);
  const change = p(f, d[2] + 140, d[2] + 195);
  const bas = base(C);
  return (
    <Scene>
      <path d={TRACE_ROUTE} fill="none" stroke={F.filet} strokeWidth={50} strokeLinecap="round" />
      <path d={TRACE_ROUTE} fill="none" stroke={F.papier} strokeWidth={40} strokeLinecap="round" />
      <path d={TRACE_ROUTE} fill="none" stroke={F.encre2} strokeWidth={3} strokeDasharray="16 16" opacity={0.65} />
      <path d={TRACE_ROUTE} fill="none" stroke={F.orClair} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${s} ${LONGUEUR_ROUTE + 100}`} />

      {/* Première borne. */}
      <Borne x={A.x} base={base(A)} n={1} allumee={p(f, d[0] + 90, d[0] + 120)} />
      <line x1={62} x2={A.x - 44} y1={sol} y2={sol} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      <circle cx={nx} cy={ny} r={8} fill="none" stroke={F.encre} strokeWidth={4} />
      <Libelle x={A.x + 48} y={base(A) - 92} taille={26} ancre="start" graisse={600} opacite={p(f, d[0] + 90, d[0] + 115)}>{LIBELLES.signes[0]}</Libelle>
      <Anesse x={aneX} y={aneY} s={S_ANE} />
      <Corde d={`M${anneauX} ${anneauY} Q${(anneauX + bout[0]) / 2} ${creux} ${bout[0]} ${bout[1]}`} l={5} couleur={F.orClair} />
      <g transform={`translate(${X_ANE} ${sol}) scale(${S_ANE})`}>
        <Licol t={tombe} e={etale} />
      </g>
      {denoue < 1 ? (
        <g opacity={1 - denoue} transform={`translate(${nx} ${ny})`}>
          <Corde d="M-11 2 C-11 -12 11 -12 11 2 C11 12 -11 12 -11 2 Z" l={5} couleur={F.orClair} />
        </g>
      ) : null}

      {/* Deuxième borne. */}
      <Borne x={B.x} base={base(B)} n={2} allumee={p(f, d[1] + 85, d[1] + 115)} />
      <Libelle x={B.x + 48} y={base(B) - 92} taille={26} ancre="start" graisse={600} opacite={p(f, d[1] + 85, d[1] + 110)}>{LIBELLES.signes[1]}</Libelle>
      {pain > 0 ? (
        <g opacity={pain}>
          <path d="M206 442 L212 470 H244 L246 442 Z M372 442 L374 470 H408 L412 442 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <rect x={190} y={425} width={236} height={18} rx={6} fill={F.filet} stroke={F.encre} strokeWidth={4} />
          <line x1={196} x2={420} y1={470} y2={470} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
      {pain > 0 ? (
        <g opacity={pain} transform={`translate(${bx - S_PAIN * 26 * partage} ${by - (1 - pain) * 16}) scale(${S_PAIN})`}>
          {partage > 0 ? (
            <path d="M22 -62 C-50 -72 -108 -36 -108 8 C-108 44 -70 56 -20 56 H22 L8 34 L26 14 L6 -8 L26 -30 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4 / S_PAIN} strokeLinejoin="round" />
          ) : (
            <path d="M22 -62 C-50 -72 -108 -36 -108 8 C-108 44 -70 56 -20 56 H42 C80 56 114 44 114 8 C114 -30 82 -66 22 -62 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4 / S_PAIN} strokeLinejoin="round" />
          )}
          {[-74, -38, -2].map((dx) => (
            <path key={dx} d={`M${dx} -30 Q${dx + 10} -10 ${dx + 4} 14`} fill="none" stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" />
          ))}
          {partage === 0 ? <path d="M60 -30 Q70 -10 64 14" fill="none" stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" /> : null}
          {partage === 0 && fissure > 0 ? (
            <path d="M22 -62 L26 -30 L6 -8 L26 14 L8 34 L22 56" fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${fissure} 1`} />
          ) : null}
        </g>
      ) : null}
      {partage > 0 && recu < 1 ? (
        <g transform={`translate(${partX} ${partY}) scale(${S_PAIN * (1 - 0.62 * donne)})`} opacity={1 - recu}>
          <path d="M0 -62 C60 -66 92 -30 92 8 C92 44 58 56 20 56 H0 L-14 34 L4 14 L-16 -8 L4 -30 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M38 -30 Q48 -10 42 14" fill="none" stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
      {recu > 0 && recu < 1 ? <circle cx={B.x} cy={B.y} r={22 + recu * 44} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - recu} /> : null}

      {/* Troisième borne. */}
      <Borne x={430} base={TABLE.find((e) => e.seg === 4 && e.x >= 430)!.y - 33} n={3} allumee={p(f, d[2] + 25, d[2] + 55)} />
      <Libelle x={382} y={150} taille={26} ancre="end" graisse={600} opacite={p(f, d[2] + 25, d[2] + 50)}>{LIBELLES.signes[2]}</Libelle>
      <defs>
        <linearGradient id="ch06-rayon" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="120">
          <stop offset="0%" stopColor={F.or} stopOpacity={0} />
          <stop offset="100%" stopColor={F.or} stopOpacity={1} />
        </linearGradient>
        <linearGradient id="ch06-rayon-clair" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="120">
          <stop offset="0%" stopColor={F.orClair} stopOpacity={0} />
          <stop offset="100%" stopColor={F.orClair} stopOpacity={0.42} />
        </linearGradient>
      </defs>
      <g opacity={rayons}>
        <path d={`M${C.x - 34} 0 L${C.x + 34} 0 L${C.x + 82} ${bas + 4} L${C.x - 82} ${bas + 4} Z`} fill="url(#ch06-rayon-clair)" />
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <path key={k} d={`M${C.x + k * 10} 0 L${C.x + k * 25} ${(bas) * rayons}`} fill="none" stroke="url(#ch06-rayon)" strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
      <Rayons x={C.x} y={C.y} rx={38} ry={38} long={22} n={12} o={change} depart={15} />
      <circle cx={pos.x} cy={pos.y} r={lerp(19, 27, change)} fill={interpolateColors(change, [0, 1], [F.encre, F.or])} stroke={F.encre} strokeWidth={4} />
      <Libelle x={528} y={C.y + 96} taille={29} ancre="start" graisse={600} couleur={F.orFonce} opacite={p(f, d[2] + 185, d[2] + 215)}>{LIBELLES.autreHomme}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 4 — Le tour de potier.                                         */
/* ------------------------------------------------------------------ */

const largeurVase = (s: number) =>
  44 + 98 * Math.exp(-(((s - 0.36) / 0.24) ** 2)) + 26 * Math.exp(-(((s - 1) / 0.07) ** 2)) + 20 * Math.exp(-((s / 0.05) ** 2));
const largeurTerre = (s: number, t: number) => {
  const motte = 150 * Math.sqrt(Math.max(0, 1 - s * s));
  const colonne = 92 * Math.sqrt(Math.max(0, 1 - s ** 8));
  return t <= 1 ? lerp(motte, colonne, t) : lerp(colonne, largeurVase(s), t - 1);
};
const hauteurTerre = (t: number) => (t <= 1 ? lerp(112, 262, t) : lerp(262, 400, t - 1));

const SENTIERS: [Pt, Pt, Pt][] = [
  [[34, 130], [60, 480], [204, 620]],
  [[766, 130], [740, 480], [596, 620]],
  [[18, 400], [90, 600], [192, 640]],
  [[782, 400], [710, 600], [608, 640]],
  [[40, 800], [100, 705], [214, 664]],
  [[760, 800], [700, 705], [586, 664]],
];
const surSentier = ([a, b, c]: [Pt, Pt, Pt], t: number): Pt => [
  (1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0],
  (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1],
];

const IlluTour: React.FC<PropsIllustration> = ({ f, d }) => {
  const Y0 = 640;
  const CX = 400;
  const t = p(f, d[0] + 20, d[1] - 15) + p(f, d[1], d[1] + 170);
  const H = hauteurTerre(t);
  const tour = f * 0.17;
  const n = 60;
  const profil = Array.from({ length: n + 1 }, (_, i) => {
    const s = i / n;
    return [s, largeurTerre(s, t)] as Pt;
  });
  const droite: Pt[] = profil.map(([s, w]): Pt => [CX + w, Y0 - s * H]);
  const gauche: Pt[] = [...profil].reverse().map(([s, w]): Pt => [CX - w, Y0 - s * H]);
  const pied = largeurTerre(0, t);
  const contourTerre = `${trace([...droite, ...gauche]).replace(/ Z$/, '')} A${pied} ${pied * 0.17} 0 0 0 ${CX + pied} ${Y0} Z`;
  const levre = largeurTerre(1, t);
  const yLevre = Y0 - H;
  const bande = p(f, d[1] + 195, d[1] + 245);
  const halo = p(f, d[1] + 40, d[1] + 130);
  const decale = ((f * 0.35) % 34) / 34;
  return (
    <Scene>
      <defs>
        <linearGradient id="ch06-ombre-terre" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={F.encre} stopOpacity={0.42} />
          <stop offset="38%" stopColor={F.encre} stopOpacity={0} />
          <stop offset="70%" stopColor={F.encre} stopOpacity={0.05} />
          <stop offset="100%" stopColor={F.encre} stopOpacity={0.48} />
        </linearGradient>
      </defs>
      <Halo id="ch06-halo-tour" x={CX} y={430} rx={280} ry={290} o={halo} />
      <Libelle x={CX} y={62} taille={31} graisse={600} couleur={F.orFonce} opacite={p(f, d[0] + 10, d[0] + 40)}>{LIBELLES.pistes}</Libelle>

      {/* Les sentiers dorés qui convergent. */}
      {SENTIERS.map((c, i) => {
        const debut = d[0] + 5 + i * 34;
        const trace_ = p(f, debut, debut + 55);
        const chemin = `M${c[0].join(' ')} Q${c[1].join(' ')} ${c[2].join(' ')}`;
        return (
          <g key={i}>
            <path d={chemin} pathLength={1} fill="none" stroke={F.or} strokeWidth={4} strokeLinecap="round" strokeDasharray={`${trace_} 1`} />
            {[0, 1, 2].map((k) => {
              const periode = 96;
              const local = (f - debut - 55 + k * 32 + i * 11) / periode;
              if (f < debut + 55) return null;
              const u = local - Math.floor(local);
              const [x, y] = surSentier(c, u);
              return <Piece key={k} x={x} y={y} r={11} opacite={Math.min(1, u * 8, (1 - u) * 8)} />;
            })}
          </g>
        );
      })}

      {/* Le bâti. */}
      <line x1={70} x2={730} y1={868} y2={868} stroke={F.encre} strokeWidth={4} />
      <path d="M265 866 L340 800 M535 866 L460 800" stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
      <ellipse cx={CX} cy={812} rx={170} ry={30} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={CX} cy={800} rx={170} ry={30} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[0, 90, 180, 270].map((a) => (
        <line key={a} x1={CX} y1={800} x2={CX + Math.cos(tour + rad(a)) * 150} y2={800 + Math.sin(tour + rad(a)) * 25} stroke={F.encre} strokeWidth={4} opacity={0.65} />
      ))}
      <rect x={CX - 14} y={Y0 + 30} width={28} height={170 - 30} fill={F.encre2} stroke={F.encre} strokeWidth={3} />

      {/* Le plateau. */}
      <path d={`M${CX - 210} ${Y0} V${Y0 + 22} A210 38 0 0 0 ${CX + 210} ${Y0 + 22} V${Y0} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={CX} cy={Y0} rx={210} ry={38} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[0, 120, 240].map((a) => {
        const v = Math.sin(tour + rad(a));
        return <ellipse key={a} cx={CX + Math.cos(tour + rad(a)) * 185} cy={Y0 + v * 28} rx={13} ry={5} fill={F.encre} opacity={0.6} />;
      })}

      {/* La terre. */}
      <path d={contourTerre} fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={contourTerre} fill="url(#ch06-ombre-terre)" />
      {Array.from({ length: 11 }, (_, i) => {
        const s = (i + decale) / 11;
        const w = largeurTerre(s, t);
        const y = Y0 - s * H;
        return w > 8 ? <path key={i} d={`M${CX - w} ${y} A${w} ${w * 0.16} 0 0 0 ${CX + w} ${y}`} fill="none" stroke={F.encre} strokeWidth={2.5} opacity={0.28} /> : null;
      })}
      {[0, 1, 2, 3].map((k) => {
        const a = tour * 1.4 + (k * Math.PI) / 2;
        const s = 0.22 + k * 0.2;
        const w = largeurTerre(s, t);
        const y = Y0 - s * H;
        const devant = Math.sin(a);
        return devant > 0 ? <ellipse key={k} cx={CX + Math.cos(a) * w * 0.9} cy={y + devant * w * 0.14} rx={5 + 11 * devant} ry={5} fill={F.papier} opacity={0.5 * devant} /> : null;
      })}
      {/* L'ouverture du vase. */}
      {t > 1.25 ? (
        <>
          <ellipse cx={CX} cy={yLevre} rx={levre} ry={levre * 0.2} fill={F.encre} stroke={F.encre} strokeWidth={4} />
          <ellipse cx={CX} cy={yLevre} rx={Math.max(0, levre - 9)} ry={Math.max(0, levre * 0.2 - 4)} fill={F.cuir} />
        </>
      ) : null}
      {/* Le filet d'or quand le vase est façonné. */}
      {bande > 0
        ? [0.3, 0.38].map((s) => {
            const w = largeurTerre(s, t);
            const y = Y0 - s * H;
            return <path key={s} d={`M${CX - w} ${y} A${w} ${w * 0.16} 0 0 0 ${CX + w} ${y}`} pathLength={1} fill="none" stroke={F.orClair} strokeWidth={9} strokeDasharray={`${bande} 1`} />;
          })
        : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 5 — Cyrus : montagnes, portes, coffre.                         */
/* ------------------------------------------------------------------ */

const SOL = 520;
const MONTS: { pts: Pt[]; fond: string; a: number; crete: Pt[] }[] = [
  { pts: [[0, SOL], [58, 330], [112, 372], [190, 170], [262, 322], [302, 282], [400, SOL]], fond: F.cuirClair, a: 45, crete: [[190, 170], [172, 262], [204, 318], [186, 420]] },
  { pts: [[400, SOL], [480, 272], [540, 330], [630, 150], [700, 322], [742, 290], [800, SOL]], fond: F.cuirClair, a: 95, crete: [[630, 150], [612, 254], [644, 322], [622, 430]] },
  { pts: [[180, SOL], [240, 190], [300, 205], [400, 110], [480, 190], [560, 160], [650, SOL]], fond: F.encre2, a: 70, crete: [[400, 110], [382, 220], [418, 300], [392, 410]] },
];
const applatir = (pts: Pt[], s: number) => pts.map(([x, y]): Pt => [x, SOL - (SOL - y) * s]);

const Battant: React.FC<{ sens: 1 | -1; ouvert: number }> = ({ sens, ouvert }) => {
  const charniere = sens === -1 ? 275 : 525;
  const l = 125 * (1 - 0.82 * ouvert);
  return (
    <g transform={`translate(${charniere} 250) scale(${(-sens * l) / 125} 1)`}>
      <rect x={0} y={0} width={125} height={270} fill={F.orFonce} stroke={F.encre} strokeWidth={4} vectorEffect="non-scaling-stroke" />
      <rect x={16} y={18} width={93} height={100} fill={F.or} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" />
      <rect x={16} y={146} width={93} height={106} fill={F.or} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" />
      {[0, 1, 2].flatMap((c) =>
        [0, 1, 2, 3].map((r) => <circle key={`${c}${r}`} cx={32 + c * 30} cy={40 + r * 62} r={5} fill={F.orFonce} />),
      )}
    </g>
  );
};

const IlluCyrus: React.FC<PropsIllustration> = ({ f, d }) => {
  const passage = p(f, d[0] + 8, d[0] + 130);
  const lumiereX = lerp(66, 726, passage);
  const lumiereO = p(f, d[0], d[0] + 15) * (1 - p(f, d[0] + 128, d[0] + 150));
  const fente = p(f, d[0] + 140, d[0] + 178);
  const ouvert = p(f, d[0] + 178, d[0] + 225);
  const cave = p(f, d[0] + 215, d[0] + 300);
  const nom = p(f, d[0] + 290, d[0] + 325);
  const marche = p(f, d[1] + 10, d[1] + 110);
  const accueil = p(f, d[1] + 105, d[1] + 150);
  const dx = lerp(30, 400, marche);
  const pulse = accueil * (0.7 + 0.3 * Math.sin(f / 10));
  return (
    <Scene>
      {/* Le sol. */}
      <path d={`M2 ${SOL} H798 V868 Q798 880 786 880 H14 Q2 880 2 868 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {[
        `M3 590 C160 572 280 604 400 590 S660 570 797 592`,
        `M3 700 C60 690 130 712 190 704`,
        `M610 708 C660 696 720 722 797 700`,
        `M3 810 C60 800 120 806 170 812`,
        `M630 812 C680 802 740 818 797 814`,
      ].map((c) => (
        <path key={c} d={c} fill="none" stroke={F.cuirClair} strokeWidth={4} opacity={0.75} />
      ))}
      {[[70, 640, 26, 14], [170, 760, 18, 11], [640, 640, 22, 12], [720, 765, 28, 15], [110, 850, 20, 10], [690, 850, 18, 9]].map(([x, y, rx, ry]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={rx} ry={ry} fill={F.cuirClair} stroke={F.encre} strokeWidth={2.5} />
      ))}

      {/* La cachette et le coffre. */}
      <path d={`M${400 - 66 * ouvert} ${SOL} H${400 + 66 * ouvert} L${400 + 66 + 34 * cave} ${lerp(SOL, 650, cave)} H${400 - 66 - 34 * cave} Z`} fill={F.orClair} opacity={0.45 * ouvert * Math.min(1, cave * 2)} />
      <ellipse cx={400} cy={708} rx={205 * cave} ry={120 * cave} fill={F.encre} />
      <Halo id="ch06-halo-coffre" x={400} y={708} rx={200} ry={116} o={0.3 * cave + 0.6 * pulse} />
      <g opacity={cave}>
        <Coffre x={400} y={792} s={0.82} />
      </g>
      <Rayons x={400} y={708} rx={140} ry={88} long={20} n={11} depart={190} ecart={16} o={pulse} />
      <Libelle x={400} y={860} taille={31} graisse={600} couleur={F.orClair} opacite={nom}>{LIBELLES.tresors}</Libelle>

      {/* Les portes d'airain. */}
      <rect x={275} y={250} width={250} height={270} fill={F.orClair} />
      <rect x={275} y={250} width={250} height={270} fill={F.papier} opacity={0.5 * ouvert} />
      <Rayons x={400} y={340} rx={34} ry={34} long={36} n={12} depart={0} o={ouvert} />
      <Battant sens={-1} ouvert={ouvert} />
      <Battant sens={1} ouvert={ouvert} />
      {ouvert < 1 ? (
        <g opacity={fente * (1 - p(ouvert, 0, 0.3))}>
          <path d="M400 250 L392 296 L408 340 L394 388 L410 436 L396 480 L402 520" pathLength={1} fill="none" stroke={F.encre} strokeWidth={9} strokeDasharray={`${fente} 1`} />
          <path d="M400 250 L392 296 L408 340 L394 388 L410 436 L396 480 L402 520" pathLength={1} fill="none" stroke={F.orClair} strokeWidth={4} strokeDasharray={`${fente} 1`} />
          <path d="M408 340 L452 318 M394 388 L346 412 M410 436 L456 456" fill="none" stroke={F.encre} strokeWidth={4} pathLength={1} strokeDasharray={`${fente} 1`} />
        </g>
      ) : null}
      <rect x={250} y={250} width={25} height={270} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={525} y={250} width={25} height={270} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={236} y={224} width={328} height={28} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />

      {/* Les montagnes, aplanies l'une après l'autre sous la lumière qui passe. */}
      {MONTS.map((m, i) => {
        const a = d[0] + m.a;
        const s = lerp(1, 0.035, p(f, a, a + 42));
        return (
          <g key={i}>
            <path d={trace(applatir(m.pts, s))} fill={m.fond} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M${applatir(m.crete, s).map(([x, y]) => `${x} ${y}`).join(' L')}`} fill="none" stroke={F.filet} strokeWidth={3} opacity={0.6 * s} />
          </g>
        );
      })}
      <line x1={2} x2={798} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} />

      {/* La lumière qui va devant. */}
      <defs>
        <linearGradient id="ch06-lumiere" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="130">
          <stop offset="0%" stopColor={F.or} stopOpacity={0} />
          <stop offset="100%" stopColor={F.or} stopOpacity={1} />
        </linearGradient>
        <linearGradient id="ch06-lumiere-clair" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="130">
          <stop offset="0%" stopColor={F.orClair} stopOpacity={0} />
          <stop offset="100%" stopColor={F.orClair} stopOpacity={0.55} />
        </linearGradient>
      </defs>
      <g opacity={lumiereO}>
        <path d={`M${lumiereX - 22} 0 H${lumiereX + 22} L${lumiereX + 64} ${SOL - 4} H${lumiereX - 64} Z`} fill="url(#ch06-lumiere-clair)" />
        {[-2, -1, 0, 1, 2].map((k) => (
          <path key={k} d={`M${lumiereX + k * 8} 0 L${lumiereX + k * 26} ${SOL - 8}`} fill="none" stroke="url(#ch06-lumiere)" strokeWidth={4} strokeLinecap="round" />
        ))}
      </g>

      {/* Cyrus, le point qui arrive une fois le chemin ouvert. */}
      {marche > 0 ? (
        <g opacity={p(f, d[1], d[1] + 22)}>
          <circle cx={dx} cy={487} r={18} fill={F.encre} stroke={F.papier} strokeWidth={3} />
          <Libelle x={Math.max(55, dx)} y={448} taille={27} graisse={600}>{LIBELLES.cyrus}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 6 — Le trousseau et les portes de coffre.                      */
/* ------------------------------------------------------------------ */

const PorteCoffre: React.FC<{ x: number; decale?: number; lumiere?: number }> = ({ x, decale = 0, lumiere = 0 }) => {
  const Y = 462;
  const L = 190;
  const H = 300;
  return (
    <g>
      <rect x={x + decale} y={Y} width={L - decale} height={H} rx={8} fill={interpolateColors(lumiere, [0, 1], [F.cuir, F.cuirClair])} stroke={F.encre2} strokeWidth={4} />
      <rect x={x + decale + 16} y={Y + 16} width={L - decale - 32} height={H - 32} rx={5} fill="none" stroke={F.encre} strokeWidth={3} />
      {[Y + 58, Y + H - 58].map((y) => (
        <rect key={y} x={x + L - 10} y={y - 22} width={18} height={44} rx={4} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
      ))}
      <circle cx={x + L / 2} cy={Y + 150} r={40} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
      <circle cx={x + L / 2} cy={Y + 150} r={11} fill={F.encre} />
      <path d={`M${x + L / 2 - 6} ${Y + 152} L${x + L / 2 - 10} ${Y + 178} H${x + L / 2 + 10} L${x + L / 2 + 6} ${Y + 152} Z`} fill={F.encre} />
      <rect x={x} y={Y} width={L} height={H} rx={8} fill={F.encre} opacity={0.4 * (1 - lumiere)} />
    </g>
  );
};

const IlluTrousseau: React.FC<PropsIllustration> = ({ f, d }) => {
  const descend = p(f, d[0] - 25, d[0] + 40);
  const vers3 = p(f, d[1], d[1] + 45);
  const ringX = lerp(400, 665, vers3);
  const ringY = lerp(36, 168, descend);
  const trou: Pt = [ringX, ringY + 44];
  const anneauO = p(f, d[0] - 25, d[0] - 5);

  const part = p(f, d[0] + 55, d[0] + 110);
  const entre = p(f, d[0] + 110, d[0] + 135);
  const tourne = p(f, d[0] + 138, d[0] + 170);
  const filet = p(f, d[0] + 165, d[0] + 215);
  const TX = 400;
  const TY = 612;
  // La clé A : tenue à l'anneau, puis au-dessus de la serrure, puis engagée.
  const aY = lerp(lerp(trou[1], TY - 170, part), TY - 113, entre);
  const aX = lerp(ringX - 5, TX, part);
  const aAngle = lerp(106, 90, part);
  // La clé B reste suspendue et oscille à peine.
  const bAngle = lerp(66, 90, vers3) + Math.sin(f / 26) * 2.6 * vers3;
  const voile = p(f, d[1] + 70, d[1] + 115);
  return (
    <Scene>
      <defs>
        <clipPath id="ch06-serrure"><rect x={-700} y={-800} width={1400} height={800} /></clipPath>
        <linearGradient id="ch06-filet" x1="1" x2="0" y1="0" y2="0">
          <stop offset="0%" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="100%" stopColor={F.orClair} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={10} y={432} width={780} height={430} rx={18} fill={F.encre} />
      <PorteCoffre x={40} />
      <PorteCoffre x={570} />
      {/* L'ouverture : un filet de lumière derrière la porte du milieu. */}
      <rect x={305} y={462} width={16 * filet + 2} height={300} fill={F.orClair} opacity={filet} />
      <PorteCoffre x={305} decale={16 * filet} lumiere={filet} />
      <path d={`M${306 + 10 * filet} 470 L${306 - 165 * filet} 444 V770 L${306 + 10 * filet} 754 Z`} fill="url(#ch06-filet)" opacity={filet * 0.62} />
      {[0, 1, 2, 3].map((k) => (
        <line key={k} x1={304} x2={304 - (70 + (k % 2) * 44) * filet} y1={500 + k * 76} y2={490 + k * 86} stroke={F.orClair} strokeWidth={5} strokeLinecap="round" opacity={filet} />
      ))}
      <Libelle x={400} y={826} taille={28} couleur={F.filet}>{LIBELLES.secrets}</Libelle>

      {/* Le fil et l'anneau. */}
      <g opacity={anneauO}>
        <line x1={ringX} x2={ringX} y1={0} y2={ringY - 40} stroke={F.encre} strokeWidth={4} />
        <ClePendue x={ringX + 8} y={trou[1]} angle={bAngle} />
        {part < 1 ? <circle cx={ringX} cy={ringY} r={40} fill="none" stroke={F.encre} strokeWidth={13} /> : null}
        {part < 1 ? <circle cx={ringX} cy={ringY} r={40} fill="none" stroke={F.or} strokeWidth={7} /> : null}
      </g>

      {/* La clé qui descend, entre et tourne. */}
      <g opacity={anneauO} transform={`translate(${TX} ${TY}) rotate(${72 * tourne})`}>
        <g clipPath="url(#ch06-serrure)">
          <g transform={`translate(${aX - TX} ${aY - TY})`}>
            <ClePendue x={0} y={0} angle={aAngle} />
          </g>
        </g>
      </g>

      {/* Une fois la clé partie, l'anneau passe devant celle qui reste. */}
      {part >= 1 ? (
        <g>
          <circle cx={ringX} cy={ringY} r={40} fill="none" stroke={F.encre} strokeWidth={13} />
          <circle cx={ringX} cy={ringY} r={40} fill="none" stroke={F.or} strokeWidth={7} />
        </g>
      ) : null}

      {/* Le mot qui voile la seconde clé. */}
      <g opacity={voile}>
        <rect x={520} y={262} width={272} height={122} rx={14} fill={F.parchemin} opacity={0.93} />
        <text x={656} y={338} textAnchor="middle" fontFamily={PoliceF.serif} fontStyle="italic" fontSize={48} fontWeight={500} fill={F.argile}>{LIBELLES.incredulite}</text>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 7 — La feuille de plan, la case, le tampon.                    */
/* ------------------------------------------------------------------ */

const Tampon: React.FC<{ x: number; y: number; angle?: number }> = ({ x, y, angle = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <rect x={-66} y={-16} width={132} height={16} rx={3} fill={F.orFonce} stroke={F.encre} strokeWidth={3.5} />
    <path d="M-54 -16 L-40 -52 H40 L54 -16 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <rect x={-13} y={-110} width={26} height={60} fill={F.cuir} stroke={F.encre} strokeWidth={3.5} />
    <circle cy={-128} r={26} fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} />
  </g>
);

const Etiquette: React.FC<{ x: number; y: number; texte: string; o: number; or?: boolean; angle?: number }> = ({ x, y, texte, o, or = false, angle = 0 }) => (
  <g opacity={o} transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M-130 -38 H108 L130 -16 V38 H-130 Z" fill={or ? F.orClair : F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={-104} cy={0} r={9} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
    <text x={12} y={14} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={42} fontWeight={500} fill={F.encre}>{texte}</text>
  </g>
);

const MURS = [
  'M190 130 H610 V410 H190 Z',
  'M370 130 V260 M370 305 V410',
  'M370 260 H490 M540 260 H610',
  'M190 310 H290',
];
const PORTES = ['M370 305 A45 45 0 0 1 325 260', 'M490 260 A50 50 0 0 0 540 210', 'M290 310 A40 40 0 0 0 330 350'];

const IlluPlan: React.FC<PropsIllustration> = ({ f, d }) => {
  const deroule = p(f, 0, d[0] + 70);
  const yBas = lerp(90, 846, deroule);
  const dessine = p(f, d[0] + 60, d[1] - 25);
  const appelle = p(f, d[1], d[1] + 22);
  const apparait = p(f, d[1] + 18, d[1] + 42);
  const v = Math.max(0, f - d[1]);
  const vers = p(f, d[2] + 62, d[2] + 86);
  const hesiteX = 400 + Math.sin(v / 24) * 130;
  const frappe = chute(f, d[2] + 104, d[2] + 116) - p(f, d[2] + 124, d[2] + 148);
  const repos = 625 - 14 * Math.abs(Math.sin(v / 15)) * (1 - vers);
  const tamponX = lerp(hesiteX, 512, vers);
  const tamponY = lerp(repos, 754, frappe);
  const penche = Math.sin(v / 24 + 0.7) * 6 * (1 - vers);

  const idee = p(f, d[2] - 2, d[2] + 18) * (1 - p(f, d[2] + 40, d[2] + 62));
  const ideeX = lerp(200, 310, p(f, d[2] - 2, d[2] + 18));
  const ideeY = 712 + 34 * p(f, d[2] + 40, d[2] + 62);
  const dieu = p(f, d[2] + 62, d[2] + 84);
  const dieuX = lerp(200, 310, dieu);
  const marque = p(f, d[2] + 118, d[2] + 120);
  const lueur = p(f, d[2] + 120, d[2] + 155);
  return (
    <Scene>
      <defs>
        <clipPath id="ch06-feuille"><rect x={100} y={60} width={600} height={Math.max(0, yBas - 60)} /></clipPath>
      </defs>
      <g clipPath="url(#ch06-feuille)">
        <rect x={110} y={66} width={580} height={790} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        {/* Le plan. */}
        <g fill="none" stroke={F.encre2} strokeLinecap="round">
          {MURS.map((m, i) => (
            <path key={m} d={m} pathLength={1} strokeWidth={i === 0 ? 8 : 6} stroke={F.encre} strokeLinecap="butt" opacity={p(dessine, i * 0.14, 0.02 + i * 0.14)} strokeDasharray={`${p(dessine, i * 0.14, 0.2 + i * 0.14)} 1`} />
          ))}
          {PORTES.map((m) => (
            <path key={m} d={m} pathLength={1} strokeWidth={2.5} opacity={p(dessine, 0.55, 0.57)} strokeDasharray={`${p(dessine, 0.55, 0.75)} 1`} />
          ))}
          <g opacity={p(dessine, 0.72, 0.95)} strokeWidth={2.5}>
            <path d="M190 104 H610 M190 96 V112 M610 96 V112 M370 96 V112" />
            <path d="M160 130 V410 M152 130 H168 M152 410 H168 M152 310 H168" />
            {[0, 1, 2, 3, 4].map((k) => (
              <line key={k} x1={510 + k * 20} x2={510 + k * 20} y1={300} y2={395} />
            ))}
            <path d="M510 300 H590 M510 395 H590" />
          </g>
        </g>
        {/* La case vide. */}
        <rect x={170} y={650} width={460} height={124} rx={8} fill={lueur > 0 ? F.parchemin : F.papier} stroke={interpolateColors(Math.max(appelle, lueur), [0, 1], [F.encre2, F.or])} strokeWidth={lerp(3, 6, appelle)} strokeDasharray={lueur > 0.5 ? undefined : '14 10'} />
        <Libelle x={400} y={816} taille={31} graisse={600} couleur={F.encre}>{LIBELLES.projet}</Libelle>
        {/* Les deux étiquettes, tour à tour. */}
        <Etiquette x={ideeX} y={ideeY} texte={LIBELLES.tonIdee} o={idee} />
        {dieu > 0 ? <Etiquette x={dieuX} y={712} texte={LIBELLES.dieu} o={dieu} or /> : null}
        {/* La marque du tampon. */}
        <g opacity={marque} transform="translate(512 712) rotate(-12)">
          <circle r={38} fill="none" stroke={F.orFonce} strokeWidth={5} />
          <circle r={30} fill="none" stroke={F.orFonce} strokeWidth={2} />
          <path d="M-15 1 L-4 13 L17 -13" fill="none" stroke={F.orFonce} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
      <g opacity={apparait}>
        <Tampon x={tamponX} y={tamponY} angle={penche} />
      </g>
      {/* La tige du haut et le rouleau qui descend. */}
      <rect x={92} y={44} width={616} height={28} rx={14} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <g transform={`translate(0 ${yBas})`}>
        <rect x={96} y={-16} width={608} height={38} rx={19} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <line x1={118} x2={682} y1={4} y2={4} stroke={F.filet} strokeWidth={3} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 8 — La grille de poches.                                       */
/* ------------------------------------------------------------------ */

const XG = [115, 305, 495, 685];
const YG = [120, 335, 550, 765];
const CHOISIE = { c: 2, l: 3 };
const SAUTS: [number, number][] = [
  [0, 0], [2, 1], [1, 3], [3, 2], [0, 2], [3, 0], [1, 1],
];

const FlechePoche = 'M-75 -85 H75 V40 Q75 68 0 88 Q-75 68 -75 40 Z';
const FacePoche = 'M-75 -60 Q0 -28 75 -60 V40 Q75 68 0 88 Q-75 68 -75 40 Z';
const Couture = 'M-62 -40 Q0 -12 62 -40 V36 Q62 58 0 74 Q-62 58 -62 36 Z';
const Rabat = 'M-81 -88 H81 V-46 Q0 -8 -81 -46 Z';

const Poche: React.FC<{ x: number; y: number; opacite?: number }> = ({ x, y, opacite = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacite}>
    <path d={FlechePoche} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <path d={Couture} fill="none" stroke={F.orClair} strokeWidth={3} strokeDasharray="9 7" />
    <path d={Rabat} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <circle cy={-32} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} />
  </g>
);

const Enveloppe: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-75} y={-50} width={150} height={100} rx={5} fill={F.papier} stroke={F.encre} strokeWidth={4 / s} />
    <path d="M-75 50 L-14 2 M75 50 L14 2" fill="none" stroke={F.filet} strokeWidth={1.6} />
    <path d="M-75 -50 L0 12 L75 -50" fill={F.parchemin} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
    <circle cx={0} cy={10} r={13} fill={F.argile} stroke={F.encre} strokeWidth={3 / s} />
    <circle cx={0} cy={10} r={7} fill="none" stroke={F.orClair} strokeWidth={2} />
  </g>
);

/** Deux mains jointes, doigts vers le haut. L'origine est aux poignets. */
const MainsJointes: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => {
  const main = (
    <g strokeLinejoin="round" strokeLinecap="round">
      <path d="M8 4 L46 4 L82 92 L26 112 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <path d="M6 4 L48 4 L54 24 L10 28 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <path d="M0 -196 C12 -202 24 -176 32 -132 C36 -106 52 -84 54 -50 C56 -26 50 -10 46 4 L6 4 C4 -6 0 -10 0 -18 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d="M12 -170 L18 -116 M22 -146 L26 -110" fill="none" stroke={F.encre} strokeWidth={3} />
      <path d="M6 -96 C20 -102 34 -84 32 -56 C30 -44 22 -38 14 -42" fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform="scale(-1 1)">{main}</g>
      {main}
    </g>
  );
};

const IlluPoches: React.FC<PropsIllustration> = ({ f, d }) => {
  // Première phrase : « on prie ». Les mains jointes passent devant les poches, sans point d'interrogation.
  const mainsO = p(f, d[0] + 70, d[0] + 105) * (1 - p(f, d[1] - 10, d[1] + 8));
  // Deuxième phrase : la question va de poche en poche.
  const debutSauts = d[1] + 24;
  const finSauts = d[2] - 8;
  const pas = (finSauts - debutSauts) / (SAUTS.length - 1);
  const avance = Math.max(0, Math.min(SAUTS.length - 1, (f - debutSauts) / pas));
  const k = Math.min(SAUTS.length - 2, Math.floor(avance));
  const u = p(avance - k, 0.1, 0.75);
  const [c0, l0] = SAUTS[k];
  const [c1, l1] = SAUTS[k + 1];
  const qx = lerp(XG[c0], XG[c1], u);
  const qy = lerp(YG[l0], YG[l1], u) - Math.sin(u * Math.PI) * 44 + 6;
  const qO = p(f, d[1] + 6, debutSauts) * (1 - p(f, d[2] - 2, d[2] + 16));

  const estompe = p(f, d[2] + 6, d[2] + 42);
  const rabat = p(f, d[2] + 28, d[2] + 62);
  const sort = p(f, d[2] + 62, d[2] + 112);
  const vole = p(f, d[2] + 108, d[2] + 170);
  const brille = p(f, d[2] + 150, d[2] + 200);
  const xc = XG[CHOISIE.c];
  const yc = YG[CHOISIE.l];
  return (
    <Scene>
      {YG.flatMap((y, l) =>
        XG.map((x, c) => {
          if (c === CHOISIE.c && l === CHOISIE.l) return null;
          const a = (l + c) * 7;
          const entree = p(f, a, a + 22);
          return (
            <g key={`${c}${l}`} transform={`translate(0 ${(1 - entree) * 22})`}>
              <Poche x={x} y={y} opacite={entree * (1 - 0.72 * Math.max(estompe, mainsO) - 0.16 * brille)} />
            </g>
          );
        }),
      )}

      {/* La poche qui s'ouvre, sans raison visible. */}
      {rabat > 0 ? <path transform={`translate(${xc} ${yc})`} d={FlechePoche} fill={F.encre} stroke={F.encre} strokeWidth={4} /> : null}
      <Halo id="ch06-halo-enveloppe" x={400} y={320} rx={330} ry={250} o={brille} />
      <Rayons x={400} y={320} rx={245} ry={170} long={40} n={22} depart={8} o={brille} />
      {sort > 0 ? (
        <Enveloppe
          x={lerp(xc, 400, vole)}
          y={lerp(lerp(yc - 20, yc - 150, sort), 320, vole)}
          s={lerp(0.8, 2.7, vole)}
        />
      ) : null}
      <g transform={`translate(${xc} ${yc})`} opacity={p(f, (CHOISIE.c + CHOISIE.l) * 7, (CHOISIE.c + CHOISIE.l) * 7 + 22) * (1 - 0.72 * mainsO)}>
        <path d={FacePoche} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <path d={Couture} fill="none" stroke={F.orClair} strokeWidth={3} strokeDasharray="9 7" />
        <g transform={`translate(0 -86) scale(1 ${lerp(1, -0.48, rabat)}) translate(0 86)`}>
          <path d={Rabat} fill={interpolateColors(rabat, [0, 0.5, 1], [F.cuirClair, F.cuir, F.encre2])} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          {rabat < 0.5 ? <circle cy={-32} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} /> : null}
        </g>
      </g>

      {mainsO > 0 ? (
        <g opacity={mainsO}>
          <Halo id="ch06-halo-mains" x={400} y={380} rx={320} ry={340} o={1} />
          <Rayons x={400} y={380} rx={230} ry={290} long={36} n={22} depart={8} o={0.9} />
          <MainsJointes x={400} y={500} s={1.45} />
        </g>
      ) : null}

      {/* Le point d'interrogation qui va de l'une à l'autre. */}
      {qO > 0 ? (
        <g opacity={qO}>
          <circle cx={qx} cy={qy} r={40} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <text x={qx} y={qy + 22} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={62} fontWeight={600} fill={F.orFonce}>{LIBELLES.question}</text>
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 9 — Fin : le coffre ouvert, le thermomètre au niveau final.    */
/* ------------------------------------------------------------------ */

const IlluFinCoffre: React.FC<PropsIllustration> = ({ f }) => {
  const ouvert = p(f, 6, 42);
  const niveau = 0.68 + 0.32 * p(f, 30, 165);
  const A: Pt = [290, 570];
  const B: Pt = [600, -120];
  const C: Pt = [640, 100];
  return (
    <Scene>
      <Halo id="ch06-halo-fin" x={290} y={590} rx={290} ry={250} o={ouvert} />
      <Rayons x={290} y={590} rx={205} ry={150} long={46} n={13} depart={185} ecart={15} o={ouvert} />
      <line x1={40} x2={760} y1={812} y2={812} stroke={F.encre} strokeWidth={4} />
      <Coffre x={290} y={810} s={1.35} ouvert={ouvert} />
      <Thermometre x={640} y={120} h={560} l={68} niveau={niveau} graduations={false} />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={682} x2={i % 2 === 0 ? 716 : 704} y1={120 + i * 70} y2={120 + i * 70} stroke={F.encre2} strokeWidth={3} />
      ))}
      {Array.from({ length: 7 }, (_, i) => {
        const a = 28 + i * 20;
        const t = chute(f, a, a + 44);
        if (t <= 0 || t >= 1) return null;
        const [x, y] = surSentier([A, B, C], t);
        return <Piece key={i} x={x} y={y} r={22} opacite={Math.min(1, t * 6, (1 - t) * 9)} />;
      })}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluFiole,
  p2: IlluRouleaux,
  p3: IlluChemin,
  p4: IlluTour,
  p5: IlluCyrus,
  p6: IlluTrousseau,
  p7: IlluPlan,
  p8: IlluPoches,
  fin: IlluFinCoffre,
};

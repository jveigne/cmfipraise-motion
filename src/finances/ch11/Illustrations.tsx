import React from 'react';
import { interpolate, interpolateColors } from 'remotion';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

/* ------------------------------------------------------------------ */
/* Outils                                                              */
/* ------------------------------------------------------------------ */

const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (deg: number) => (deg * Math.PI) / 180;
/** Valeur pseudo-aléatoire fixe, entre 0 et 1. */
const alea = (i: number, k: number) => {
  const s = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return s - Math.floor(s);
};
type Pt = { x: number; y: number };
const bezier = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => {
  const u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * e.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * e.y,
  };
};

/* ------------------------------------------------------------------ */
/* Dessins communs du chapitre                                         */
/* ------------------------------------------------------------------ */

const TRACE_FLAMME = 'M0 -100 C8 -72 40 -54 40 -26 C40 -8 22 0 0 0 C-22 0 -40 -8 -40 -26 C-40 -42 -26 -50 -22 -66 C-14 -60 -10 -58 -7 -62 C-3 -72 -4 -88 0 -100 Z';

/** Flamme vivante, posée par sa base. `h` : hauteur ; `l` : largeur pour 100 de base (par défaut proportionnelle). */
const Flamme: React.FC<{ x: number; y: number; h: number; l?: number; f: number; phase?: number; penche?: number; opacite?: number }> = ({ x, y, h, l, f, phase = 0, penche = 0, opacite = 1 }) => {
  if (h <= 0.5) return null;
  const sx = ((l ?? h) / 100) * (1 + 0.05 * Math.sin(f / 4.3 + phase));
  const sy = (h / 100) * (1 + 0.06 * Math.sin(f / 6.1 + phase * 1.7));
  const biais = Math.sin(f / 9 + phase) * 3 + penche;
  return (
    <g transform={`translate(${x} ${y}) skewX(${biais}) scale(${sx} ${sy})`} opacity={opacite}>
      <path d={TRACE_FLAMME} fill={F.argile} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" />
      <path d={TRACE_FLAMME} transform="translate(0 -3) scale(0.66)" fill={F.or} />
      <path d={TRACE_FLAMME} transform="translate(0 -3) scale(0.36)" fill={F.orClair} />
    </g>
  );
};

/** Filet de fumée ou de vapeur qui ondule. */
const Filet: React.FC<{ x: number; y: number; h: number; a?: number; f: number; phase?: number; couleur?: string; largeur?: number; opacite?: number }> = ({ x, y, h, a = 12, f, phase = 0, couleur = F.filet, largeur = 5, opacite = 1 }) => {
  const d = Array.from({ length: 15 }, (_, i) => {
    const t = i / 14;
    return `${i ? 'L' : 'M'}${(x + Math.sin(t * 7 - f / 13 + phase) * a * (0.25 + t)).toFixed(1)} ${(y - h * t).toFixed(1)}`;
  }).join(' ');
  return <path d={d} fill="none" stroke={couleur} strokeWidth={largeur} strokeLinecap="round" strokeLinejoin="round" opacity={opacite} />;
};

/** Autel de pierre à cornes : `x` centre, `y` dessus de la table. */
const Autel: React.FC<{ x: number; y: number; l: number; h: number; fond?: string }> = ({ x, y, l, h, fond = F.filet }) => {
  const g = x - l / 2;
  const hc = (h - 26) / 3;
  return (
    <g>
      <rect x={g} y={y + 26} width={l} height={h - 26} fill={fond} stroke={F.encre} strokeWidth={4} />
      {[1, 2].map((i) => (
        <line key={i} x1={g} x2={g + l} y1={y + 26 + i * hc} y2={y + 26 + i * hc} stroke={F.encre2} strokeWidth={3} />
      ))}
      {[0, 1, 2].map((r) =>
        [1, 2, 3].map((c) => {
          const jx = g + ((c - (r % 2 === 0 ? 0 : 0.5)) * l) / 4 + 0;
          return <line key={`${r}-${c}`} x1={jx} x2={jx} y1={y + 26 + r * hc} y2={y + 26 + (r + 1) * hc} stroke={F.encre2} strokeWidth={3} />;
        }),
      )}
      <path d={`M${g - 14} ${y} L${g - 14} ${y - 24} L${g + 16} ${y} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${g + l + 14} ${y} L${g + l + 14} ${y - 24} L${g + l - 16} ${y} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={g - 14} y={y} width={l + 28} height={26} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    </g>
  );
};

/** Couronne : `x`, `y` milieu de sa base. */
const Couronne: React.FC<{ x: number; y: number; s?: number; opacite?: number }> = ({ x, y, s = 1, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
    <path d="M-80 -22 L-94 -102 L-44 -62 L0 -120 L44 -62 L94 -102 L80 -22 Z" fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-80} y={-22} width={160} height={22} rx={3} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
    {[-94, 94].map((cx) => (
      <circle key={cx} cx={cx} cy={-104} r={9} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
    ))}
    <circle cx={0} cy={-124} r={10} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
    <circle cx={0} cy={-11} r={6} fill={F.argile} stroke={F.encre} strokeWidth={2} />
    <circle cx={-46} cy={-11} r={5} fill={F.argile} stroke={F.encre} strokeWidth={2} />
    <circle cx={46} cy={-11} r={5} fill={F.argile} stroke={F.encre} strokeWidth={2} />
  </g>
);

/** Coffre de profil, posé par le milieu de sa base ; `ouvert` soulève le couvercle sur des pièces. */
const Coffre: React.FC<{ x: number; y: number; s?: number; ouvert?: number }> = ({ x, y, s = 1, ouvert = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {ouvert > 0 ? (
      <g>
        <Piece x={-38} y={-76 - 14 * ouvert} r={20} />
        <Piece x={38} y={-76 - 14 * ouvert} r={20} />
        <Piece x={0} y={-82 - 22 * ouvert} r={20} />
      </g>
    ) : null}
    <g transform={`rotate(${-42 * ouvert} -84 -78)`}>
      <path d="M-84 -78 Q0 -142 84 -78 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    </g>
    <rect x={-84} y={-78} width={168} height={78} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <rect x={-58} y={-78} width={14} height={78} fill={F.or} stroke={F.encre} strokeWidth={2} />
    <rect x={44} y={-78} width={14} height={78} fill={F.or} stroke={F.encre} strokeWidth={2} />
    <rect x={-13} y={-88} width={26} height={34} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
  </g>
);

/** Coffre ouvert vu de face : le fond, puis ce qu'il contient, puis le devant. */
const CoffreFond: React.FC<{ x: number; y: number; W: number; H: number; L: number }> = ({ x, y, W, H, L }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d={`M${-W} ${-H} L${-W * 0.92} ${-H - L} Q0 ${-H - L * 1.5} ${W * 0.92} ${-H - L} L${W} ${-H} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <ellipse cx={0} cy={-H} rx={W} ry={W * 0.2} fill={F.encre} stroke={F.encre} strokeWidth={4} />
  </g>
);
const CoffreDevant: React.FC<{ x: number; y: number; W: number; H: number }> = ({ x, y, W, H }) => {
  const bande = W * 0.11;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${-W} ${-H} A${W} ${W * 0.2} 0 0 0 ${W} ${-H} V0 H${-W} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={-W * 0.72} y={-H + W * 0.13} width={bande} height={H - W * 0.13} fill={F.or} stroke={F.encre} strokeWidth={2} />
      <rect x={W * 0.72 - bande} y={-H + W * 0.13} width={bande} height={H - W * 0.13} fill={F.or} stroke={F.encre} strokeWidth={2} />
      <rect x={-W * 0.15} y={-H + W * 0.2} width={W * 0.3} height={W * 0.3} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
    </g>
  );
};

/** Bourse à cordon : `x`, `y` son centre ; `vide` de 0 à 1 l'aplatit. */
const Bourse: React.FC<{ x: number; y: number; s?: number; angle?: number; vide?: number; opacite?: number }> = ({ x, y, s = 1, angle = 0, vide = 0, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s * (1 + 0.12 * vide)} ${s * (1 - 0.42 * vide)})`} opacity={opacite}>
    <path d="M-30 -52 C-72 -30 -92 20 -80 52 C-68 80 68 80 80 52 C92 20 72 -30 30 -52 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-30 -52 L-44 -88 Q0 -72 44 -88 L30 -52 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <line x1={-34} x2={34} y1={-54} y2={-54} stroke={F.or} strokeWidth={7} strokeLinecap="round" />
    <path d="M-44 8 C-46 30 -36 48 -18 54" fill="none" stroke={F.cuirClair} strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** Palais de cèdre, posé par le milieu de sa base. Ses lignes dorées sont dans LIGNES_PALAIS. */
const LIGNES_PALAIS = [
  [-170, -280, 0, -390],
  [0, -390, 170, -280],
  [-170, -265, 170, -265],
  [-34, -30, -34, -150],
  [34, -30, 34, -150],
  [-34, -150, 34, -150],
  [-180, -30, 180, -30],
];
const Palais: React.FC<{ x: number; y: number; s?: number; dore?: (i: number) => number }> = ({ x, y, s = 1, dore }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-150} y={-250} width={300} height={220} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    {[-110, -60, 60, 110].map((px) => (
      <line key={px} x1={px} x2={px} y1={-250} y2={-30} stroke={F.cuirClair} strokeWidth={3} />
    ))}
    <rect x={-34} y={-150} width={68} height={120} fill={F.encre} />
    {[-140, -85, 85, 140].map((cx) => (
      <g key={cx}>
        <rect x={cx - 14} y={-250} width={28} height={220} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        <rect x={cx - 20} y={-250} width={40} height={12} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      </g>
    ))}
    <rect x={-170} y={-280} width={340} height={30} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    <path d="M-170 -280 L0 -390 L170 -280 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-180} y={-30} width={360} height={15} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
    <rect x={-192} y={-15} width={384} height={15} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
    {dore
      ? LIGNES_PALAIS.map(([a, b, c, e], i) => <line key={i} x1={a} y1={b} x2={c} y2={e} stroke={F.orClair} strokeWidth={8} strokeLinecap="round" opacity={dore(i)} />)
      : null}
  </g>
);

/** Tente, posée par le milieu de sa base. Ses lignes dorées sont dans LIGNES_TENTE. */
const LIGNES_TENTE = [
  [-150, 0, 0, -350],
  [0, -350, 150, 0],
  [-46, 0, 0, -260],
  [0, -260, 46, 0],
  [-150, 0, -46, 0],
  [46, 0, 150, 0],
  [-32, -278, 32, -278],
];
const Tente: React.FC<{ x: number; y: number; s?: number; dore?: (i: number) => number; arche?: boolean }> = ({ x, y, s = 1, dore, arche = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <line x1={-100} y1={-233} x2={-172} y2={0} stroke={F.encre2} strokeWidth={3} />
    <line x1={100} y1={-233} x2={172} y2={0} stroke={F.encre2} strokeWidth={3} />
    <path d="M-180 -14 L-168 6 M180 -14 L168 6" stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
    <path d="M0 -350 L150 0 H-150 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    {[-104, -74, 74, 104].map((px) => (
      <line key={px} x1={0} y1={-350} x2={px} y2={0} stroke={F.filet} strokeWidth={4} />
    ))}
    <path d="M0 -260 L46 0 H-46 Z" fill={F.encre} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    {arche ? (
      <g>
        <rect x={-28} y={-40} width={56} height={32} rx={2} fill={F.or} stroke={F.orClair} strokeWidth={3} />
        <line x1={-38} x2={38} y1={-24} y2={-24} stroke={F.orClair} strokeWidth={4} strokeLinecap="round" />
      </g>
    ) : null}
    {dore
      ? LIGNES_TENTE.map(([a, b, c, e], i) => <line key={i} x1={a} y1={b} x2={c} y2={e} stroke={F.or} strokeWidth={8} strokeLinecap="round" opacity={dore(i)} />)
      : null}
  </g>
);

/** Bête de profil, tournée vers la gauche, sans visage. `boiteuse` : la patte avant manque. */
const Bete: React.FC<{ x: number; y: number; s?: number; boiteuse?: boolean; fond?: string; angle?: number; opacite?: number }> = ({ x, y, s = 1, boiteuse = false, fond = F.cuirClair, angle = 0, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={opacite}>
    <path d="M86 -104 C108 -96 112 -70 104 -54" fill="none" stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
    {[46, 74].map((px) => (
      <rect key={px} x={px - 9} y={-72} width={18} height={72} rx={5} fill={fond} stroke={F.encre} strokeWidth={4} />
    ))}
    {boiteuse ? null : <rect x={-74} y={-72} width={18} height={72} rx={5} fill={fond} stroke={F.encre} strokeWidth={4} />}
    <rect x={-44} y={-72} width={18} height={72} rx={5} fill={fond} stroke={F.encre} strokeWidth={4} />
    {boiteuse ? <rect x={-74} y={-72} width={18} height={24} rx={5} fill={fond} stroke={F.encre} strokeWidth={4} /> : null}
    <path d="M-88 -92 C-88 -122 -60 -128 -30 -126 L60 -126 C92 -126 98 -100 92 -84 C86 -66 66 -60 40 -60 L-50 -60 C-76 -60 -88 -70 -88 -92 Z" fill={fond} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-68 -112 L-104 -150 C-116 -156 -140 -152 -146 -136 C-150 -124 -136 -116 -122 -114 L-84 -84 Z" fill={fond} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-110 -152 C-104 -176 -84 -176 -78 -160" fill="none" stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
    <path d="M-96 -146 L-74 -142 L-90 -130 Z" fill={fond} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** Petite étoile à quatre branches. */
const Eclat: React.FC<{ x: number; y: number; r: number; couleur?: string; opacite?: number }> = ({ x, y, r, couleur = F.orClair, opacite = 1 }) => (
  <path d={`M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r} Z`} fill={couleur} opacity={opacite} />
);

/** Rayons en éventail autour d'un point. */
const Rayons: React.FC<{ x: number; y: number; r1: number; r2: number; de: number; a: number; n: number; couleur?: string; largeur?: number; opacite?: number }> = ({ x, y, r1, r2, de, a, n, couleur = F.or, largeur = 6, opacite = 1 }) => (
  <g opacity={opacite}>
    {Array.from({ length: n }, (_, i) => {
      const t = rad(mix(de, a, n === 1 ? 0.5 : i / (n - 1)));
      return <line key={i} x1={x + Math.cos(t) * r1} y1={y + Math.sin(t) * r1} x2={x + Math.cos(t) * r2} y2={y + Math.sin(t) * r2} stroke={couleur} strokeWidth={largeur} strokeLinecap="round" />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Plan 1 — Titre                                                      */
/* ------------------------------------------------------------------ */

/** Dessine progressivement du bas vers le haut. */
const Balayage: React.FC<{ id: string; t: number; x: number; y: number; l: number; h: number; children: React.ReactNode }> = ({ id, t, x, y, l, h, children }) => (
  <g>
    <clipPath id={id}>
      <rect x={x} y={y + h * (1 - t)} width={l} height={h * t} />
    </clipPath>
    <g clipPath={`url(#${id})`}>{children}</g>
  </g>
);

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const chute = p(f, 168, 205);
  const niveau = 0.06 + 0.16 * p(f, 200, 232);
  const yNiveau = 130 + 430 * (1 - niveau);
  return (
    <Scene>
      <Balayage id="c11-t1" t={p(f, 14, 54)} x={20} y={330} l={300} h={270}>
        <Autel x={165} y={380} l={220} h={200} />
      </Balayage>
      <Balayage id="c11-t2" t={p(f, 64, 106)} x={490} y={60} l={300} h={600}>
        <Palais x={640} y={320} s={0.62} />
        <Tente x={640} y={640} s={0.6} />
      </Balayage>
      <Balayage id="c11-t3" t={p(f, 116, 158)} x={240} y={700} l={330} h={190}>
        <Bete x={410} y={880} s={1} boiteuse />
      </Balayage>
      <Thermometre x={400} y={130} h={430} l={64} niveau={niveau} graduations={false} />
      {chute > 0 && chute < 1 ? <Piece x={400} y={mix(30, yNiveau, chute * chute)} r={23} opacite={lin(f, 168, 176)} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 2 — Mille holocaustes                                          */
/* ------------------------------------------------------------------ */

const IlluMille: React.FC<PropsIllustration> = ({ f, d }) => {
  const ciel = interpolateColors(f, [d[1] - 40, d[1] + 150], [F.papier, F.encre]);
  const mot = interpolateColors(f, [d[1] - 40, d[1] + 150], [F.encre, F.orClair]);
  const etoile = p(f, d[1] + 145, d[1] + 180);
  const tC = d[1] + 395;
  const tG = d[1] + 470;
  const pose = (t: number) => p(f, t, t + 50);
  const posC = pose(tC);
  const posG = pose(tG);
  const onde = (t: number) => lin(f, t + 46, t + 80);
  const ouvre = p(f, d[1] + 600, d[1] + 650);
  const scintille = (i: number) => 0.5 + 0.5 * Math.sin(f / 9 + i * 2.1);
  return (
    <Scene>
      <clipPath id="c11-p2">
        <rect x={30} y={30} width={740} height={800} rx={14} />
      </clipPath>
      <g clipPath="url(#c11-p2)">
        <rect x={30} y={30} width={740} height={800} fill={ciel} />
        <path d="M30 702 C170 672 280 692 400 690 C540 688 640 670 770 700 V830 H30 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      </g>
      <rect x={30} y={30} width={740} height={800} rx={14} fill="none" stroke={F.encre} strokeWidth={4} />
      {/* L'étoile s'allume dans la nuit. */}
      {etoile > 0 ? (
        <g>
          <circle cx={640} cy={200} r={70 * etoile} fill={F.orClair} opacity={0.16 + 0.04 * Math.sin(f / 12)} />
          <Eclat x={640} y={200} r={(52 + 4 * Math.sin(f / 10)) * etoile} />
        </g>
      ) : null}
      <Libelle x={400} y={120} taille={66} graisse={600} couleur={mot} opacite={p(f, 6, 30)}>{LIBELLES.mille}</Libelle>
      {/* L'autel, sa flamme, sa fumée. */}
      {[-30, 0, 30].map((dx, i) => (
        <Filet key={dx} x={400 + dx} y={430} h={250} a={18} f={f} phase={i * 2} couleur={F.encre2} largeur={8} opacite={p(f, 8, 40) * 0.65} />
      ))}
      {[-30, 0, 30].map((dx, i) => (
        <Filet key={dx} x={400 + dx} y={430} h={250} a={18} f={f} phase={i * 2} couleur={F.filet} largeur={4} opacite={p(f, 8, 40)} />
      ))}
      <Flamme x={400} y={522} h={100} l={95} f={f} />
      <Autel x={400} y={520} l={210} h={170} />
      {/* Le coffre et la couronne se posent, sans que personne les apporte. */}
      {posC > 0 ? (
        <g>
          <ellipse cx={165} cy={692} rx={40 + 90 * onde(tC)} ry={7 + 12 * onde(tC)} fill="none" stroke={F.orClair} strokeWidth={4} opacity={onde(tC) > 0 && onde(tC) < 1 ? 1 - onde(tC) : 0} />
          <Coffre x={165} y={mix(250, 692, posC)} ouvert={ouvre} s={0.92} />
          <Libelle x={165} y={756} taille={30} couleur={F.papier} graisse={600} opacite={onde(tC)}>{LIBELLES.richesses}</Libelle>
        </g>
      ) : null}
      {posG > 0 ? (
        <g>
          <ellipse cx={635} cy={692} rx={40 + 90 * onde(tG)} ry={7 + 12 * onde(tG)} fill="none" stroke={F.orClair} strokeWidth={4} opacity={onde(tG) > 0 && onde(tG) < 1 ? 1 - onde(tG) : 0} />
          <Couronne x={635} y={mix(250, 692, posG)} s={0.82} />
          <Libelle x={635} y={756} taille={30} couleur={F.papier} graisse={600} opacite={onde(tG)}>{LIBELLES.gloire}</Libelle>
          {onde(tG) >= 1
            ? [[560, 560], [712, 590], [635, 520]].map(([x, y], i) => <Eclat key={i} x={x} y={y} r={16 * scintille(i)} />)
            : null}
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 3 — Le sacrifice extravagant                                   */
/* ------------------------------------------------------------------ */

const IlluExtravagant: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 440;
  const TRAIT = 230;
  const flammes = [
    ...Array.from({ length: 6 }, (_, i) => ({ x: 28 + i * 34, h: 46, a: mix(d[0] + 50, d[1] + 95, i / 5) })),
    ...Array.from({ length: 16 }, (_, i) => {
      const x = 265 + i * 34;
      return { x, h: 50 + 150 * Math.pow((x - 265) / 510, 1.1), a: interpolate(x, [265, 410, 590, 775], [d[1] + 170, d[1] + 260, d[1] + 320, d[1] + 385]) };
    }),
  ];
  const cent = p(f, d[1] + 252, d[1] + 272);
  const quatre = p(f, d[1] + 312, d[1] + 332);
  const encore = p(f, d[1] + 372, d[1] + 392);
  const lumiere = p(f, d[3] + 250, d[3] + 340);
  const fleche = p(f, d[2] + 5, d[2] + 95);
  const coeurT = lin(f, d[2] + 5, d[3] + 320);
  const coeurX = mix(70, 590, Math.pow(coeurT, 0.8));
  const finFleche = mix(50, 340, fleche);
  const voile = 1 - 0.4 * p(f, d[3] + 60, d[3] + 130);
  return (
    <Scene>
      <line x1={TRAIT} x2={TRAIT} y1={235} y2={SOL + 40} stroke={F.argile} strokeWidth={6} opacity={p(f, d[0] + 10, d[0] + 40)} />
      <Libelle x={TRAIT} y={218} taille={30} graisse={600} couleur={F.argile} opacite={p(f, d[0] + 10, d[0] + 40)}>{LIBELLES.prescrits}</Libelle>
      {flammes.map((fl, i) => {
        const o = lin(f, fl.a, fl.a + 14);
        return <Flamme key={i} x={fl.x} y={SOL} h={fl.h * o} l={32} f={f} phase={i * 1.3} penche={-6 * lumiere} />;
      })}
      <rect x={0} y={SOL} width={800} height={40} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {Array.from({ length: 11 }, (_, i) => (
        <line key={i} x1={68 + i * 68} x2={68 + i * 68} y1={SOL} y2={SOL + 40} stroke={F.encre2} strokeWidth={3} />
      ))}
      <Libelle x={410} y={SOL - 104} taille={30} graisse={600} opacite={cent}>{LIBELLES.cent}</Libelle>
      <Libelle x={600} y={SOL - 168} taille={30} graisse={600} ancre="end" opacite={quatre}>{LIBELLES.quatreCents}</Libelle>
      <Libelle x={796} y={SOL - 236} taille={30} graisse={600} ancre="end" opacite={encore}>{LIBELLES.davantage}</Libelle>

      {/* L'ambition s'arrête ; le cœur d'adorateur va plus loin, vers la lumière. */}
      <g opacity={voile * lin(f, d[2], d[2] + 15)}>
        <Libelle x={40} y={590} taille={28} ancre="start" couleur={F.encre2}>{LIBELLES.ambition}</Libelle>
        <line x1={40} x2={Math.max(40, finFleche - 18)} y1={624} y2={624} stroke={F.encre2} strokeWidth={8} strokeLinecap="round" />
        <path d={`M${finFleche - 22} 606 L${finFleche + 8} 624 L${finFleche - 22} 642 Z`} fill={F.encre2} />
        <rect x={362} y={584} width={14} height={80} rx={3} fill={F.encre2} opacity={fleche} />
      </g>
      <g opacity={lin(f, d[2], d[2] + 15)}>
        <line x1={40} x2={640} y1={770} y2={770} stroke={F.encre2} strokeWidth={4} strokeDasharray="4 18" strokeLinecap="round" />
        <Coeur x={coeurX} y={768} s={0.95} />
        <Libelle x={coeurX} y={858} taille={28} graisse={600} couleur={F.orFonce}>{LIBELLES.adoration}</Libelle>
      </g>
      {lumiere > 0 ? (
        <g>
          <clipPath id="c11-p3">
            <rect x={0} y={0} width={800} height={900} />
          </clipPath>
          <g clipPath="url(#c11-p3)">
            <circle cx={800} cy={770} r={72 * lumiere} fill={F.orClair} />
            <Rayons x={800} y={770} r1={84} r2={84 + 40 * lumiere} de={100} a={260} n={9} opacite={lumiere} />
          </g>
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 4 — Pour toujours                                              */
/* ------------------------------------------------------------------ */

type Pierre = { x: number; y: number; l: number; h: number; retard: number; cx: number; cy: number; rot: number; fond: string };
const PIERRES: Pierre[] = (() => {
  const brut: Array<Omit<Pierre, 'retard' | 'cx' | 'cy' | 'rot'>> = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) brut.push({ x: 80 + c * 88, y: 230 + r * (170 / 3), l: 88, h: 170 / 3, fond: F.filet });
  for (const cx of [125, 225, 375, 475]) {
    for (let r = 0; r < 5; r++) {
      const l = r === 0 ? 66 : 46;
      brut.push({ x: cx - l / 2, y: 400 + r * 52, l, h: 52, fond: F.papier });
    }
  }
  for (let c = 0; c < 6; c++) brut.push({ x: 60 + c * 80, y: 660, l: 80, h: 40, fond: F.papier });
  const retards = brut.map((_, i) => alea(i, 1) * 62);
  const ordre = brut.map((_, i) => i).sort((a, b) => retards[a] - retards[b]);
  const rangees = [10, 9, 8, 7, 5, 2];
  const cibles: Pt[] = [];
  rangees.forEach((n, r) => {
    for (let c = 0; c < n; c++) cibles.push({ x: 300 + (c - (n - 1) / 2) * 52 + (alea(c, r + 7) - 0.5) * 8, y: 682 - r * 32 });
  });
  const res = brut.map((b, i) => ({ ...b, retard: retards[i], cx: 0, cy: 0, rot: (alea(i, 3) - 0.5) * 34 }));
  ordre.forEach((j, k) => {
    res[j].cx = cibles[k % cibles.length].x;
    res[j].cy = cibles[k % cibles.length].y;
  });
  return res;
})();

const IlluPourToujours: React.FC<PropsIllustration> = ({ f, d }) => {
  const SCEAU = { x: 300, y: 315 };
  const COMPAS = { x: 660, y: 608 };
  const descente = p(f, d[1] + 95, d[1] + 135);
  const onde = lin(f, d[1] + 133, d[1] + 170);
  const debutChute = d[2] + 45;
  const portes = 1 - p(f, debutChute, debutChute + 25);
  const fronton = p(f, debutChute - 8, debutChute + 42);
  const compas = p(f, d[2] + 110, d[2] + 140);
  const cible = (Math.atan2(SCEAU.y - COMPAS.y, SCEAU.x - COMPAS.x) * 180) / Math.PI;
  const tourne = p(f, d[2] + 150, d[2] + 215);
  const vibre = Math.exp(-Math.max(0, f - (d[2] + 215)) / 18) * Math.sin(Math.max(0, f - (d[2] + 215)) / 3) * 7 * lin(f, d[2] + 205, d[2] + 215);
  const angle = mix(38, cible, tourne) + vibre + (1 - tourne) * Math.sin(f / 6) * 7;
  const lien = p(f, d[2] + 215, d[2] + 250);
  const vx = SCEAU.x - COMPAS.x;
  const vy = SCEAU.y - COMPAS.y;
  const nv = Math.hypot(vx, vy);
  return (
    <Scene>
      <line x1={0} x2={800} y1={700} y2={700} stroke={F.encre} strokeWidth={4} />
      {/* Le fronton tombe et se brise. */}
      <g opacity={p(f, 2, 30) * (1 - lin(f, debutChute + 28, debutChute + 46))} transform={`translate(${-34 * fronton} ${360 * fronton * fronton}) rotate(${-24 * fronton} 300 180)`}>
        <path d="M66 230 L300 112 L534 230 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      </g>
      <g opacity={portes * p(f, 2, 30)}>
        <rect x={100} y={400} width={400} height={260} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        <rect x={258} y={450} width={84} height={210} fill={F.encre} />
      </g>
      {PIERRES.map((s, i) => {
        const montee = p(f, 4 + ((700 - s.y) / 500) * 70, 24 + ((700 - s.y) / 500) * 70);
        const t = lin(f, debutChute + s.retard, debutChute + s.retard + 38);
        const tt = t * t;
        const x = mix(s.x + s.l / 2, s.cx, tt);
        const y = mix(s.y + s.h / 2, s.cy, tt) + (1 - montee) * 40;
        const v = Math.min(1, t * 1.4);
        return (
          <g key={i} opacity={montee} transform={`translate(${x} ${y}) rotate(${s.rot * tt}) scale(${mix(1, 56 / s.l, v)} ${mix(1, 34 / s.h, v)})`}>
            <rect x={-s.l / 2} y={-s.h / 2} width={s.l} height={s.h} rx={2} fill={s.fond} stroke={F.encre} strokeWidth={3} vectorEffect="non-scaling-stroke" />
          </g>
        );
      })}
      {/* Le lien de la boussole vers le sceau. */}
      {lien > 0 ? (
        <line x1={COMPAS.x + (vx / nv) * 104} y1={COMPAS.y + (vy / nv) * 104} x2={mix(COMPAS.x + (vx / nv) * 104, SCEAU.x - (vx / nv) * 84, lien)} y2={mix(COMPAS.y + (vy / nv) * 104, SCEAU.y - (vy / nv) * 84, lien)} stroke={F.or} strokeWidth={7} strokeDasharray="3 19" strokeLinecap="round" />
      ) : null}
      {/* Le sceau, qui ne bouge plus jamais. */}
      {descente > 0 ? (
        <g>
          {onde > 0 && onde < 1 ? <circle cx={SCEAU.x} cy={SCEAU.y} r={72 + 80 * onde} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - onde} /> : null}
          <g transform={`translate(${SCEAU.x} ${mix(70, SCEAU.y, descente)}) scale(${mix(1.25, 1, descente)})`} opacity={lin(f, d[1] + 95, d[1] + 110)}>
            <circle r={72} fill={F.or} stroke={F.encre} strokeWidth={5} />
            <circle r={62} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
            <Libelle x={0} y={9} taille={26} graisse={600}>{LIBELLES.monNom}</Libelle>
          </g>
        </g>
      ) : null}
      {/* La boussole, au loin. */}
      {compas > 0 ? (
        <g opacity={compas}>
          <circle cx={COMPAS.x} cy={COMPAS.y - 104} r={13} fill="none" stroke={F.encre} strokeWidth={6} />
          <rect x={COMPAS.x - 11} y={COMPAS.y - 98} width={22} height={14} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
          <circle cx={COMPAS.x} cy={COMPAS.y} r={90} fill={F.or} stroke={F.encre} strokeWidth={4} />
          <circle cx={COMPAS.x} cy={COMPAS.y} r={75} fill={F.papier} stroke={F.encre} strokeWidth={3} />
          {[0, 45].map((a) => (
            <g key={a} transform={`translate(${COMPAS.x} ${COMPAS.y}) rotate(${a})`}>
              <path d="M0 -62 L10 -10 L62 0 L10 10 L0 62 L-10 10 L-62 0 L-10 -10 Z" fill={a === 0 ? F.filet : 'none'} stroke={F.filet} strokeWidth={2} strokeLinejoin="round" />
            </g>
          ))}
          <g transform={`translate(${COMPAS.x} ${COMPAS.y}) rotate(${angle})`}>
            <path d="M0 -11 L66 0 L0 11 Z" fill={F.argile} stroke={F.encre} strokeWidth={2.5} strokeLinejoin="round" />
            <path d="M0 -11 L-66 0 L0 11 Z" fill={F.encre} stroke={F.encre} strokeWidth={2.5} strokeLinejoin="round" />
            <circle r={7} fill={F.or} stroke={F.encre} strokeWidth={2} />
          </g>
          <Libelle x={COMPAS.x} y={752} taille={30} graisse={600}>{LIBELLES.daniel}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 5 — L'obéissance                                               */
/* ------------------------------------------------------------------ */

const IlluObeissance: React.FC<PropsIllustration> = ({ f, d }) => {
  const P0 = { x: 130, y: 800 };
  const P1 = { x: 560, y: 840 };
  const P2 = { x: 260, y: 300 };
  const P3 = { x: 600, y: 236 };
  const FORK = 0.5;
  const Q0 = bezier(P0, P1, P2, P3, FORK);
  const Q1 = { x: Q0.x + 70, y: Q0.y - 70 };
  const Q2 = { x: 690, y: 400 };
  const Q3 = { x: 730, y: 650 };
  const route = p(f, d[0] + 120, d[0] + 320);
  const couronne = p(f, d[0] + 300, d[0] + 345);
  const ouvre = p(f, d[1] - 10, d[1] + 40);
  const mot = p(f, d[1] + 70, d[1] + 95);
  const bon = 11;
  const mauvais = 14;
  const pasA = (i: number) => (i < bon ? mix(d[1] + 45, d[2], i / (bon - 1)) : mix(d[2] + 60, d[3] + 40, (i - bon) / (mauvais - 1)));
  const position = (i: number): { pt: Pt; cap: number } => {
    const avant = (u: number) => (i < bon ? bezier(P0, P1, P2, P3, FORK * u) : bezier(Q0, Q1, Q2, Q3, u));
    const u = i < bon ? (i + 0.6) / bon : (i - bon + 1) / mauvais;
    const a = avant(u);
    const b = avant(u + 0.01);
    return { pt: a, cap: Math.atan2(b.y - a.y, b.x - a.x) };
  };
  const cosO = Math.cos(rad(78 * ouvre));
  const larg = 136 * cosO;
  const lueur = 0.5 + 0.5 * Math.sin(f / 16);
  // Le don seul n'y arrive pas : une pièce monte le chemin et s'arrête avant la couronne.
  const piece = mix(0.02, 0.76, p(f, d[3] + 50, d[3] + 190)) - 0.07 * p(f, d[3] + 200, d[3] + 240);
  const posPiece = bezier(P0, P1, P2, P3, piece);
  return (
    <Scene>
      {/* Le chemin vers la couronne. */}
      <path d={`M${P0.x} ${P0.y} C${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`} fill="none" stroke={F.filet} strokeWidth={70} pathLength={1} strokeDasharray={`${route} 1`} />
      <path d={`M${P0.x} ${P0.y} C${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`} fill="none" stroke={F.papier} strokeWidth={58} pathLength={1} strokeDasharray={`${route} 1`} />
      {/* La couronne, intacte. */}
      <g opacity={couronne}>
        <Rayons x={640} y={158} r1={112} r2={142 + 8 * lueur} de={-170} a={-10} n={9} couleur={F.or} opacite={0.75} />
        <Couronne x={640} y={208} s={0.9} />
      </g>
      {/* Les pas. */}
      {Array.from({ length: bon + mauvais }, (_, i) => {
        const { pt, cap } = position(i);
        const o = lin(f, pasA(i), pasA(i) + 10);
        const c = cap * (180 / Math.PI);
        const cote = i % 2 === 0 ? 1 : -1;
        const nx = -Math.sin(cap) * 12 * cote;
        const ny = Math.cos(cap) * 12 * cote;
        return (
          <g key={i} opacity={o} transform={`translate(${pt.x + nx} ${pt.y + ny}) rotate(${c})`}>
            <ellipse rx={13} ry={7.5} fill={i < bon ? F.cuir : F.argile} />
          </g>
        );
      })}
      {f > d[3] + 40 ? <Piece x={posPiece.x} y={posPiece.y} r={23} opacite={lin(f, d[3] + 40, d[3] + 55)} /> : null}
      <Libelle x={500} y={392} taille={30} graisse={600} ancre="start" opacite={mot}>{LIBELLES.obeissance}</Libelle>
      {/* La porte. */}
      <rect x={50} y={500} width={160} height={270} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={5} />
      <rect x={62} y={512} width={136} height={258} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      <path d={`M62 512 L${62 + larg} ${512 + 18 * (1 - cosO)} V${770 - 10 * (1 - cosO)} L62 770 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {cosO > 0.45 ? <circle cx={62 + larg - 18 * cosO} cy={650} r={8} fill={F.or} stroke={F.encre} strokeWidth={2} /> : null}
      <Libelle x={130} y={480} taille={30} graisse={600} opacite={p(f, 4, 26)}>{LIBELLES.adoration}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 6 — Votre propre histoire                                      */
/* ------------------------------------------------------------------ */

const Livre: React.FC<{ x: number; y: number; L: number; H: number; LO: number; t: number; fond: string; titre?: string; children?: React.ReactNode; opacite?: number }> = ({ x, y, L, H, LO, t, fond, titre, children, opacite = 1 }) => {
  const couverture = Math.max(0, 1 - t * 2);
  const page = Math.max(0, t * 2 - 1);
  return (
    <g opacity={opacite}>
      {couverture > 0 ? (
        <g transform={`translate(${x} ${y}) scale(${couverture} 1)`}>
          <rect x={-L / 2} y={-H} width={L} height={H} rx={5} fill={fond} stroke={F.encre} strokeWidth={4} />
          <rect x={-L / 2 + 10} y={-H + 12} width={L - 20} height={H - 24} rx={3} fill="none" stroke={F.orClair} strokeWidth={2.5} />
          <rect x={-L / 2} y={-H} width={10} height={H} fill={F.encre} opacity={0.35} />
          {titre ? <Libelle x={3} y={-H / 2 + 8} taille={25} couleur={F.papier} graisse={600}>{titre}</Libelle> : null}
        </g>
      ) : null}
      {page > 0 ? (
        <g transform={`translate(${x} ${y}) scale(${page} 1)`}>
          <rect x={-LO / 2 - 6} y={-H - 4} width={LO + 12} height={H + 8} rx={5} fill={fond} stroke={F.encre} strokeWidth={4} />
          <path d={`M${-LO / 2} ${-H + 4} Q${-LO / 4} ${-H - 6} 0 ${-H + 8} V-2 Q${-LO / 4} -10 ${-LO / 2} -4 Z`} fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path d={`M${LO / 2} ${-H + 4} Q${LO / 4} ${-H - 6} 0 ${-H + 8} V-2 Q${LO / 4} -10 ${LO / 2} -4 Z`} fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          {children}
        </g>
      ) : null}
    </g>
  );
};

const IlluHistoire: React.FC<PropsIllustration> = ({ f, d }) => {
  const monte = p(f, d[1] - 30, d[1] + 15);
  const yEtagere = mix(590, 355, monte);
  const glisse = p(f, d[1] + 5, d[1] + 65);
  const ouvre5 = p(f, d[1] + 70, d[1] + 115);
  const XS = [121, 307, 493, 679];
  const OUV = [d[0] + 10, d[0] + 185, d[0] + 320, d[0] + 475];
  const FONDS = [F.argile, F.cuir, F.orFonce, F.cuirClair];
  const H = 230;
  const LO = 162;
  const Lignes: React.FC = () => (
    <g>
      {[-168, -142, -116, -90, -64, -38].map((dy) => (
        <line key={dy} x1={-LO / 2 + 14} x2={-12} y1={dy} y2={dy} stroke={F.filet} strokeWidth={4} />
      ))}
      {[-54, -34].map((dy) => (
        <line key={dy} x1={12} x2={LO / 2 - 14} y1={dy} y2={dy} stroke={F.filet} strokeWidth={4} />
      ))}
    </g>
  );
  return (
    <Scene>
      <rect x={15} y={yEtagere} width={770} height={22} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {[70, 730].map((x) => (
        <path key={x} d={`M${x - 12} ${yEtagere + 22} H${x + 12} L${x} ${yEtagere + 56} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      ))}
      {LIBELLES.livres.map((nom, i) => {
        const t = p(f, OUV[i], OUV[i] + 40);
        return (
          <Livre key={nom} x={XS[i]} y={yEtagere} L={150} H={H} LO={LO} t={t} fond={FONDS[i]} titre={nom}>
            <rect x={-LO / 2 + 5} y={-H + 12} width={LO - 10} height={40} fill={F.papier} />
            <Libelle x={0} y={-H + 42} taille={24} graisse={600}>{nom}</Libelle>
            {i === 0 ? <Flamme x={41} y={-74} h={84} l={68} f={f} /> : null}
            {i === 1 ? <Coeur x={41} y={-116} s={0.54 * (1 + 0.04 * Math.sin(f / 9))} /> : null}
            {i === 2 ? <Piece x={41} y={-116} r={28} /> : null}
            {i === 3 ? <Bete x={44} y={-78} s={0.27} /> : null}
            <Lignes />
          </Livre>
        );
      })}
      {/* Le cinquième livre, sans titre, sur les pages blanches duquel rien n'est encore écrit. */}
      <g opacity={lin(f, d[1] - 10, d[1] + 10)}>
        <rect x={150} y={508} width={500} height={324} rx={18} fill={F.orClair} opacity={ouvre5 * (0.34 + 0.1 * Math.sin(f / 14))} />
        <rect x={120} y={820} width={560} height={20} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <Livre x={mix(590, 400, glisse)} y={820} L={190} H={290} LO={420} t={ouvre5} fond={F.encre2} opacite={glisse > 0 ? 1 : 0}>
          {null}
        </Livre>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 7 — Ce qui ne coûte rien                                       */
/* ------------------------------------------------------------------ */

const IlluCout: React.FC<PropsIllustration> = ({ f, d }) => {
  const AX = 565;
  const AY = 560;
  const SOL = 760;
  const avance = p(f, d[0], d[0] + 300);
  const recule = p(f, d[1] + 70, d[1] + 140);
  const px = mix(mix(150, 210, avance), 110, recule);
  const oPlat = p(f, 2, 26) * (1 - recule);
  const etiq = p(f, d[0] + 170, d[0] + 200);
  const detache = lin(f, d[1] + 25, d[1] + 75);
  const arrivee = p(f, d[1] + 135, d[1] + 190);
  const leve = p(f, d[2] + 30, d[2] + 90);
  const vide = lin(f, d[2] + 100, d[2] + 400);
  const bx = mix(mix(70, 190, arrivee), 280, leve);
  const by = mix(650, 350, leve);
  const angle = 72 * leve;
  const s = 1.1;
  const bec = { x: bx + Math.sin(rad(angle)) * 88 * s, y: by - Math.cos(rad(angle)) * 88 * s };
  const hFlamme = mix(70, 440, Math.pow(vide, 0.85));
  return (
    <Scene>
      <line x1={0} x2={800} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <Flamme x={AX} y={AY + 2} h={hFlamme} l={Math.min(hFlamme, 340) * 0.86} f={f} />
      {/* Les pièces de la bourse vont à l'autel. */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = d[2] + 100 + (i * 300) / 16;
        const t = lin(f, a, a + 36);
        if (t <= 0 || t >= 1) return null;
        const x = mix(bec.x, AX + (alea(i, 2) - 0.5) * 60, t);
        const y = mix(bec.y, AY, t) - Math.sin(t * Math.PI) * 60;
        return <Piece key={i} x={x} y={y} r={20} />;
      })}
      <Autel x={AX} y={AY} l={300} h={SOL - AY} />
      {/* Le plateau pris aux dépens d'un autre. */}
      {oPlat > 0 ? (
        <g opacity={oPlat}>
          <rect x={px - 11} y={450} width={22} height={SOL - 462} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
          <path d={`M${px - 62} ${SOL} Q${px} ${SOL - 44} ${px + 62} ${SOL} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <Bete x={px + 4} y={428} s={0.72} />
          <ellipse cx={px} cy={438} rx={132} ry={20} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
          {detache === 0 ? <line x1={px} x2={px} y1={456} y2={540 - 30 * (1 - etiq)} stroke={F.encre} strokeWidth={3} opacity={etiq} /> : null}
        </g>
      ) : null}
      {etiq > 0 && detache < 1 ? (
        <g opacity={etiq * (1 - p(f, d[1] + 62, d[1] + 75))} transform={`translate(${px + (detache > 0 ? -18 * detache : 0)} ${540 + detache * detache * 150}) rotate(${-13 * detache})`}>
          <rect x={-150} y={0} width={300} height={62} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <circle cx={0} cy={0} r={6} fill={F.encre} />
          <Libelle x={0} y={40} taille={25} graisse={600}>{LIBELLES.depens}</Libelle>
        </g>
      ) : null}
      {/* La bourse personnelle. */}
      {arrivee > 0 ? <Bourse x={bx} y={by} s={s} angle={angle} vide={vide} opacite={lin(f, d[1] + 135, d[1] + 150)} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 8 — Le palais et la tente                                      */
/* ------------------------------------------------------------------ */

const IlluPalaisTente: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 730;
  const XP = 206;
  const XT = 612;
  const debut = d[1] + 60;
  const pas = (d[3] + 240 - debut) / LIGNES_PALAIS.length;
  const VOL = 85;
  const envol = (i: number) => debut + i * pas;
  const compte = LIGNES_PALAIS.reduce((n, _, i) => n + lin(f, envol(i), envol(i) + VOL), 0);
  const gloirePalais = 1 - compte / LIGNES_PALAIS.length;
  const gloireTente = compte / LIGNES_PALAIS.length;
  return (
    <Scene>
      <line x1={0} x2={800} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <Rayons x={XP} y={SOL - 390} r1={36} r2={36 + 70 * gloirePalais} de={-160} a={-20} n={7} opacite={gloirePalais} />
      <Rayons x={XT} y={SOL - 350} r1={36} r2={36 + 70 * gloireTente} de={-160} a={-20} n={7} opacite={gloireTente} />
      <Palais x={XP} y={SOL} dore={(i) => (f < envol(i) ? 1 : 0)} />
      <Tente x={XT} y={SOL} arche dore={(i) => (f >= envol(i) + VOL ? 1 : 0)} />
      {LIGNES_PALAIS.map(([a, b, c, e], i) => {
        const t = p(f, envol(i), envol(i) + VOL);
        if (t <= 0 || t >= 1) return null;
        const [ta, tb, tc, te] = LIGNES_TENTE[i];
        const haut = Math.sin(t * Math.PI) * 170;
        const x1 = mix(XP + a, XT + ta, t);
        const y1 = mix(SOL + b, SOL + tb, t) - haut;
        const x2 = mix(XP + c, XT + tc, t);
        const y2 = mix(SOL + e, SOL + te, t) - haut;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={F.orClair} strokeWidth={18} strokeLinecap="round" opacity={0.45} />
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={F.or} strokeWidth={8} strokeLinecap="round" />
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 9 — Glorifie-moi                                               */
/* ------------------------------------------------------------------ */

const IlluMiroir: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 860;
  const HT = 124;
  const LARGEURS = [320, 430, 540];
  const etapes = [p(f, d[1] + 40, d[1] + 95), p(f, d[1] + 200, d[1] + 255), p(f, d[2] + 40, d[2] + 95)];
  const niveau = etapes[0] + etapes[1] + etapes[2];
  const haut = SOL - HT * niveau;
  const yM = haut - 34;
  const RX = 170;
  const descend = p(f, d[0], d[0] + 45);
  const renvoi = p(f, d[0] + 45, d[0] + 90);
  const ouverture = 7 + 15 * niveau;
  const tan = Math.tan(rad(ouverture));
  const X = 400;
  const RAYONS = [-0.75, -0.45, -0.15, 0.15, 0.45, 0.75];
  return (
    <Scene>
      <clipPath id="c11-p9">
        <rect x={0} y={0} width={800} height={900} />
      </clipPath>
      <clipPath id="c11-p9b">
        <rect x={0} y={0} width={800} height={SOL} />
      </clipPath>
      <defs>
        <linearGradient id="c11-p9v" x1="0" x2="0" y1="0" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
        <linearGradient id="c11-p9h" x1="0" x2="800" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.14" stopColor="#fff" />
          <stop offset="0.86" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="c11-p9mv" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}>
          <rect x={0} y={0} width={800} height={900} fill="url(#c11-p9v)" />
        </mask>
        <mask id="c11-p9mh" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}>
          <rect x={0} y={0} width={800} height={900} fill="url(#c11-p9h)" />
        </mask>
      </defs>
      <g clipPath="url(#c11-p9)" mask="url(#c11-p9mv)"><g mask="url(#c11-p9mh)">
        {/* Ce que le miroir renvoie, de plus en plus large. */}
        <path d={`M${X - RX * 0.9} ${yM} L${X - RX * 0.9 - tan * yM} 0 H${X + RX * 0.9 + tan * yM} L${X + RX * 0.9} ${yM} Z`} fill={F.orClair} opacity={0.42 * renvoi} />
        {Array.from({ length: 9 }, (_, i) => {
          const k = (i - 4) / 4;
          const bx = X + k * RX * 0.9;
          const ex = bx + k * tan * yM;
          return <line key={i} x1={bx} y1={yM} x2={mix(bx, ex, renvoi)} y2={mix(yM, 0, renvoi)} stroke={F.orFonce} strokeWidth={4} strokeDasharray="18 16" strokeDashoffset={f * 1.1} strokeLinecap="round" opacity={renvoi * 0.75} />;
        })}
        {/* Ce qui descend d'en haut. */}
        {RAYONS.map((k) => (
          <line key={k} x1={X + k * RX} y1={0} x2={X + k * RX} y2={mix(0, yM, descend)} stroke={F.or} strokeWidth={6} strokeDasharray="30 14" strokeDashoffset={-f * 1.3} strokeLinecap="round" />
        ))}
      </g></g>
      <g clipPath="url(#c11-p9b)">
        {LIBELLES.miroir.map((mot, i) => {
          const y = haut + i * HT;
          const l = LARGEURS[i];
          return (
            <g key={mot} opacity={etapes[i] > 0 ? 1 : 0}>
              <rect x={X - l / 2} y={y} width={l} height={HT} fill={i % 2 === 0 ? F.papier : F.parchemin} stroke={F.encre} strokeWidth={4} />
              <Libelle x={X} y={y + HT / 2 + 11} taille={32} graisse={600}>{mot}</Libelle>
            </g>
          );
        })}
      </g>
      <line x1={40} x2={760} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} />
      {/* Le miroir. */}
      <rect x={X - 16} y={yM + 16} width={32} height={haut - yM - 16} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      <ellipse cx={X} cy={yM} rx={RX} ry={30} fill={F.or} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={X} cy={yM - 2} rx={RX - 16} ry={21} fill={F.papier} stroke={F.orFonce} strokeWidth={3} />
      <path d={`M${X - 90} ${yM + 6} Q${X - 40} ${yM - 18} ${X + 10} ${yM - 12}`} fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 10 — La maison de David                                        */
/* ------------------------------------------------------------------ */

const Maison: React.FC<{ x: number; y: number; s: number; t?: number }> = ({ x, y, s, t = 1 }) => (
  <g transform={`translate(${x} ${y + (1 - t) * 24 * s}) scale(${s})`} opacity={t}>
    <rect x={-72} y={-110} width={144} height={110} fill={F.papier} stroke={F.encre} strokeWidth={5} />
    <path d="M-88 -106 L0 -176 L88 -106 Z" fill={F.argile} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <rect x={-18} y={-64} width={36} height={64} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <rect x={-58} y={-84} width={28} height={28} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
    <rect x={30} y={-84} width={28} height={28} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
  </g>
);

const IlluMaisonDavid: React.FC<PropsIllustration> = ({ f, d }) => {
  const G0 = { x: 338, y: 640 };
  const VP = { x: 1088, y: 300 };
  const R = 0.82;
  /* La maison en pointillés : ses traits apparaissent un à un, et les derniers ne viennent jamais. */
  const X = 122;
  const Y = 640;
  const W = 92;
  const traits = [
    `M${X - W} ${Y} H${X + W}`,
    `M${X - W} ${Y} V${Y - 150}`,
    `M${X - W - 16} ${Y - 146} L${X} ${Y - 242}`,
    `M${X - 22} ${Y} V${Y - 86} H${X + 22} V${Y}`,
    `M${X + W} ${Y} V${Y - 72}`,
  ];
  const trait = (i: number) => p(f, d[0] + 25 + i * 42, d[0] + 60 + i * 42);
  const premiere = p(f, d[1] + 110, d[1] + 145);
  const voile = 1 - 0.5 * p(f, d[2] + 40, d[2] + 100);
  const mot = p(f, d[2] + 190, d[2] + 225);
  /* Le sol de la file se trace avec elle : sa pointe suit la maison qui arrive, et ne la précède jamais. */
  const avance = 8 * lin(f, d[2], d[2] + 7 * 28 + 26);
  const reste = Math.pow(R, avance);
  const sol = { x: VP.x + (G0.x - VP.x) * reste, y: VP.y + (G0.y - VP.y) * reste };
  return (
    <Scene>
      <defs>
        <linearGradient id="c11-p10g" x1="0" x2="800" y1="0" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0.9" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="c11-p10m" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}>
          <rect x={0} y={0} width={800} height={900} fill="url(#c11-p10g)" />
        </mask>
      </defs>
      <line x1={0} x2={236} y1={Y} y2={Y} stroke={F.filet} strokeWidth={4} />
      <g opacity={voile}>
        {traits.map((t, i) => (
          <path key={i} d={t} fill="none" stroke={F.encre2} strokeWidth={5} strokeDasharray="12 11" strokeLinecap="round" opacity={trait(i)} />
        ))}
      </g>
      <g mask="url(#c11-p10m)">
        {avance > 0 ? <line x1={G0.x} y1={G0.y} x2={sol.x} y2={sol.y} stroke={F.encre} strokeWidth={4} /> : null}
        {Array.from({ length: 9 }, (_, i) => {
          const k = 8 - i;
          const e = Math.pow(R, k);
          const x = VP.x + (G0.x - VP.x) * e;
          const y = VP.y + (G0.y - VP.y) * e;
          const t = k === 0 ? premiere : p(f, d[2] + (k - 1) * 28, d[2] + (k - 1) * 28 + 26);
          return t > 0 ? <Maison key={k} x={x} y={y} s={e * 0.85} t={t} /> : null;
        })}
      </g>
      <g opacity={mot}>
        <path d="M240 770 H740 L716 800 L740 830 H240 L264 800 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <Libelle x={490} y={813} taille={36} graisse={600}>{LIBELLES.dynastie}</Libelle>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 11 — Sur le chemin                                             */
/* ------------------------------------------------------------------ */

const IlluChemin: React.FC<PropsIllustration> = ({ f, d }) => {
  const a = d[0];
  const b = d[1];
  const CLES: Array<[number, number, number]> = [
    [a, 400, 880],
    [a + 110, 400, 815],
    [a + 170, 190, 760],
    [a + 235, 190, 640],
    [a + 285, 400, 605],
    [a + 360, 610, 540],
    [a + 420, 610, 420],
    [a + 470, 400, 385],
    [a + 545, 190, 330],
    [b + 40, 190, 175],
    [b + 110, 400, 150],
    [b + 240, 400, 146],
  ];
  const images = CLES.map((c) => c[0]);
  const x = interpolate(f, images, CLES.map((c) => c[1]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const y = interpolate(f, images, CLES.map((c) => c[2]), { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const PANNEAUX = [
    { yp: 655, t: a + 95 },
    { yp: 440, t: a + 285 },
    { yp: 220, t: a + 470 },
  ];
  const force = p(f, b + 90, b + 180);
  return (
    <Scene>
      <defs>
        <linearGradient id="c11-p11g" x1="0" x2="0" y1="0" y2="900" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.08" stopColor="#fff" />
          <stop offset="0.92" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id="c11-p11m" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}>
          <rect x={0} y={0} width={800} height={900} fill="url(#c11-p11g)" />
        </mask>
      </defs>
      <g mask="url(#c11-p11m)">
        <rect x={130} y={0} width={540} height={900} fill={F.filet} />
        <rect x={142} y={0} width={516} height={900} fill={F.papier} />
        <line x1={400} x2={400} y1={0} y2={900} stroke={F.encre2} strokeWidth={4} strokeDasharray="24 26" />
      </g>
      {PANNEAUX.map(({ yp, t }, i) => {
        const c = lin(f, t, t + 20);
        if (c <= 0) return null;
        const rebond = c >= 1 ? Math.exp(-(f - t - 20) / 8) * Math.sin((f - t - 20) / 2.2) * 8 : 0;
        const dy = -150 * (1 - c * c) - Math.abs(rebond);
        const fond = interpolateColors(f, [t + 120, t + 170], [F.argile, F.cuirClair]);
        return (
          <g key={i} opacity={lin(f, t, t + 8)} transform={`translate(0 ${dy}) rotate(${rebond * 0.3} 400 ${yp + 72})`}>
            <ellipse cx={400} cy={yp + 72} rx={50} ry={9} fill={F.encre2} opacity={0.3} />
            <rect x={392} y={yp + 22} width={16} height={50} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
            <rect x={270} y={yp - 34} width={260} height={68} rx={6} fill={fond} stroke={F.encre} strokeWidth={4} />
            <rect x={277} y={yp - 27} width={246} height={54} rx={3} fill="none" stroke={F.papier} strokeWidth={2} />
            <Libelle x={400} y={yp + 9} taille={25} graisse={600} couleur={F.papier}>{LIBELLES.panneaux[i]}</Libelle>
          </g>
        );
      })}
      {force > 0 ? <Rayons x={x} y={y - 50} r1={66} r2={66 + 26 * force} de={-170} a={-10} n={7} opacite={force} largeur={5} /> : null}
      <ellipse cx={x} cy={y + 2} rx={30} ry={7} fill={F.encre2} opacity={0.25} />
      <Flamme x={x} y={y} h={84 + 14 * force} f={f} phase={1} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 12 — L'eau versée                                              */
/* ------------------------------------------------------------------ */

const Cruche: React.FC<{ x: number; y: number; angle: number }> = ({ x, y, angle }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M-36 -70 C-92 -56 -96 12 -56 26" fill="none" stroke={F.encre} strokeWidth={13} strokeLinecap="round" />
    <path d="M-36 -70 C-92 -56 -96 12 -56 26" fill="none" stroke={F.argile} strokeWidth={7} strokeLinecap="round" />
    <path d="M-30 -92 C-36 -70 -72 -50 -72 0 C-72 52 -40 82 0 82 C40 82 72 52 72 0 C72 -50 36 -70 30 -92 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M30 -92 L66 -108 L34 -70 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-36} y={-100} width={70} height={14} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
    <path d="M-50 2 C-30 22 30 22 50 2" fill="none" stroke={F.orClair} strokeWidth={4} strokeLinecap="round" />
    <path d="M-44 28 C-26 44 26 44 44 28" fill="none" stroke={F.orClair} strokeWidth={4} strokeLinecap="round" />
  </g>
);

const IlluEau: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const penche = p(f, d[0] + 40, d[0] + 110);
  const coule = lin(f, d[0] + 100, d[0] + 118);
  const seche = 1 - lin(f, d[1] + 170, d[1] + 200);
  const vapeur = p(f, d[0] + 135, d[0] + 195);
  const glisse = p(f, d[1] - 34, d[1] + 8);
  const tx = 165 * (1 - glisse);
  const entonnoir = p(f, d[1] - 10, d[1] + 25);
  const AX = 225;
  const AY = 540;
  const J = { x: 148, y: 215 };
  const angle = 66 * penche;
  const bec = {
    x: J.x + Math.cos(rad(angle)) * 66 + Math.sin(rad(angle)) * 108,
    y: J.y + Math.sin(rad(angle)) * 66 - Math.cos(rad(angle)) * 108,
  };
  const eauFin = mix(bec.y, AY - 2, coule);
  const FX = 590;
  const debut = d[1] + 30;
  const periode = 34;
  const chute = 44;
  const nb = Math.ceil((duree - debut) / periode);
  const avale = Math.sin(((f - debut) / periode) * Math.PI * 2);
  const respire = 1 + 0.018 * avale * lin(f, debut, debut + 30);
  return (
    <Scene>
      <line x1={0} x2={800} y1={820} y2={820} stroke={F.encre} strokeWidth={4} />
      <g transform={`translate(${tx} 0)`}>
        {[AX - 90, AX - 42, AX + 122].map((x, i) => (
          <Filet key={x} x={x} y={AY - 8} h={[208, 170, 240][i]} a={15} f={f} phase={i * 2.2} couleur={F.encre2} largeur={5} opacite={vapeur * 0.8} />
        ))}
        <Autel x={AX} y={AY} l={270} h={280} />
        {coule > 0 && seche > 0 ? (
          <g opacity={seche}>
            <path d={`M${bec.x} ${bec.y} Q${bec.x + 10} ${mix(bec.y, eauFin, 0.4)} ${bec.x + 12} ${eauFin}`} fill="none" stroke={F.encre2} strokeWidth={15} strokeLinecap="round" />
            <path d={`M${bec.x} ${bec.y} Q${bec.x + 10} ${mix(bec.y, eauFin, 0.4)} ${bec.x + 12} ${eauFin}`} fill="none" stroke={F.papier} strokeWidth={9} strokeLinecap="round" />
            {coule >= 1
              ? [0, 1, 2, 3].map((i) => {
                  const t = ((f + i * 6) % 24) / 24;
                  return <circle key={i} cx={bec.x + 12 + (i - 1.5) * 12 * (0.4 + t)} cy={AY - 4 - Math.sin(t * Math.PI) * 18} r={4} fill={F.papier} stroke={F.encre2} strokeWidth={2} />;
                })
              : null}
          </g>
        ) : null}
        <Cruche x={J.x} y={J.y} angle={angle} />
      </g>
      {entonnoir > 0 ? (
        <g opacity={entonnoir} transform={`translate(0 ${(1 - entonnoir) * 26})`}>
          <ellipse cx={FX} cy={290} rx={132} ry={26} fill={F.encre} stroke={F.encre} strokeWidth={4} />
          {Array.from({ length: nb }, (_, k) => {
            const a = debut + k * periode;
            const t = lin(f, a, a + chute);
            if (t <= 0 || t >= 1) return null;
            const x = FX + (alea(k, 5) - 0.5) * 130;
            const y = mix(26, 330, t * t);
            const type = k % 3;
            return type === 0 ? <Piece key={k} x={x} y={y} r={22} /> : type === 1 ? <Coeur key={k} x={x} y={y} s={0.42} /> : <Coffre key={k} x={x} y={y + 22} s={0.34} />;
          })}
          <g transform={`translate(${FX} 290) scale(${respire} ${2 - respire}) translate(${-FX} -290)`}>
            <path d={`M${FX - 132} 290 A132 26 0 0 0 ${FX + 132} 290 L${FX + 20} 620 V700 H${FX - 20} V620 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M${FX - 96} 340 L${FX - 12} 610`} stroke={F.cuirClair} strokeWidth={5} strokeLinecap="round" />
            <Libelle x={FX} y={364} taille={24} graisse={600} couleur={F.papier}>{LIBELLES.consommateurs}</Libelle>
          </g>
          {/* Le plat sous l'entonnoir reste vide. */}
          <path d={`M${FX - 78} 790 Q${FX} 830 ${FX + 78} 790 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 13 — Le feu                                                    */
/* ------------------------------------------------------------------ */

const IlluFeu: React.FC<PropsIllustration> = ({ f, d }) => {
  const X = 400;
  const SOL = 560;
  const W = 170;
  const H = 150;
  const base = SOL - H;
  const XS = [70, 202, 334, 466, 598, 730];
  const ORDRE = [2, 3, 1, 4, 0, 5];
  const coupsA = Array.from({ length: 9 }, (_, i) => d[0] + 190 + i * 22);
  const coupsB = Array.from({ length: 7 }, (_, i) => d[1] + 40 + i * 26);
  const coups = [...coupsA, ...coupsB];
  const h = 90 + coups.reduce((n, a) => n + 11 * p(f, a + 30, a + 50), 0) + 44 * p(f, d[3] + 20, d[3] + 120);
  const halo = p(f, d[3] + 20, d[3] + 120);
  const allume = (i: number) => d[2] + 60 + i * 52;
  return (
    <Scene>
      <line x1={0} x2={800} y1={SOL} y2={SOL} stroke={F.filet} strokeWidth={4} />
      <line x1={0} x2={800} y1={840} y2={840} stroke={F.encre} strokeWidth={4} />
      {halo > 0 ? <Rayons x={X} y={base - h * 0.55} r1={h * 0.55 + 8} r2={h * 0.55 + 8 + 44 * halo} de={-158} a={-22} n={9} opacite={halo * 0.9} /> : null}
      <CoffreFond x={X} y={SOL} W={W} H={H} L={58} />
      <Flamme x={X} y={base + 16} h={h} l={Math.min(h, 240) * 0.85} f={f} />
      {coups.map((a, i) => {
        const t = lin(f, a, a + 42);
        if (t <= 0 || t >= 1) return null;
        const cote = i % 2 === 0 ? -1 : 1;
        const x = mix(X + cote * (150 + alea(i, 9) * 110), X + cote * 56, t);
        const y = mix(30, base + 6, t * t);
        return <Piece key={i} x={x} y={y} r={24} />;
      })}
      <CoffreDevant x={X} y={SOL} W={W} H={H} />
      {/* Les étincelles et les petits coffres. */}
      {ORDRE.map((k, i) => {
        const a = allume(i);
        const xc = XS[k];
        const yc = 840 - 56;
        return (
          <g key={k}>
            {[0, 1, 2].map((j) => {
              const t = lin(f, a - 34 + j * 6, a + j * 6);
              if (t <= 0 || t >= 1) return null;
              const depart = { x: X + (xc < X ? -70 : 70), y: base - 40 };
              const px = mix(depart.x, xc, t);
              const py = mix(depart.y, yc, t) - Math.sin(t * Math.PI) * 90;
              return <Eclat key={j} x={px} y={py} r={15 - j * 3} couleur={j === 0 ? F.argile : F.or} />;
            })}
          </g>
        );
      })}
      {ORDRE.map((k, i) => {
        const a = allume(i);
        const o = p(f, a - 2, a + 22);
        const encore = p(f, d[2] + 330 + i * 16, d[2] + 370 + i * 16);
        const xc = XS[k];
        return (
          <g key={`c${k}`}>
            <CoffreFond x={xc} y={840} W={52} H={56} L={26} />
            <Flamme x={xc} y={840 - 52} h={(44 + 34 * encore) * o} f={f} phase={k * 1.7} />
            <CoffreDevant x={xc} y={840} W={52} H={56} />
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 14 — La maison du trésor                                       */
/* ------------------------------------------------------------------ */

const IlluTresor: React.FC<PropsIllustration> = ({ f, d }) => {
  const C = { x: 400, y: 300 };
  const ANGLES = [-150, -30, 90];
  const entrees = [d[1] + 10, d[1] + 110, d[1] + 195];
  const relance = entrees.map((e) => p(f, e + 42, e + 82));
  const R = 138 + 22 * (relance[0] + relance[1] + relance[2]);
  const apparition = p(f, d[0] + 60, d[0] + 110);
  const tour = f * 1.1 + 40 * (relance[0] + relance[1] + relance[2]);
  const voile = 1 - 0.32 * p(f, d[2] + 130, d[2] + 180);
  const fleche = p(f, d[2] + 20, d[2] + 95);
  const pointe = mix(70, 428, fleche);
  const enfonce = p(f, d[2] + 88, d[2] + 108);
  const STOP = [120, 180, 240];
  return (
    <Scene>
      <g opacity={voile}>
        <circle cx={C.x} cy={C.y} r={R} fill="none" stroke={F.or} strokeWidth={7} strokeDasharray="22 15" strokeDashoffset={-tour * 1.6} opacity={apparition} />
        {[0, 120, 240].map((a) => {
          const ang = rad(tour + a);
          return (
            <g key={a} opacity={apparition} transform={`translate(${C.x + Math.cos(ang) * R} ${C.y + Math.sin(ang) * R}) rotate(${tour + a + 90})`}>
              <path d="M-16 13 L18 0 L-16 -13 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={2} strokeLinejoin="round" />
            </g>
          );
        })}
        <Tente x={C.x} y={C.y + 72} s={0.46} dore={(i) => (relance[0] + relance[1] + relance[2]) / 3 > i / 7 ? 1 : 0} />
        {LIBELLES.boucle.map((mot, i) => {
          const a = rad(ANGLES[i]);
          const e = entrees[i];
          const o = p(f, e - 14, e + 6);
          const lx = C.x + Math.cos(a) * (R + 32);
          const ly = C.y + Math.sin(a) * (R + 32) + (i === 2 ? 20 : 8);
          const t = p(f, e, e + 50);
          const px = mix(C.x + Math.cos(a) * R, C.x + Math.cos(a) * 44, t);
          const py = mix(C.y + Math.sin(a) * R, C.y + Math.sin(a) * 44, t);
          return (
            <g key={mot}>
              <Libelle x={lx} y={ly} taille={28} graisse={600} ancre={i === 0 ? 'end' : i === 1 ? 'start' : 'middle'} opacite={o}>{mot}</Libelle>
              {t > 0 && t < 1 ? <Piece x={px} y={py} r={18} opacite={1 - lin(f, e + 40, e + 50)} /> : null}
            </g>
          );
        })}
      </g>
      {/* À part : le coussin où tout s'arrête. */}
      <g opacity={p(f, d[2] - 15, d[2] + 15)}>
        <line x1={40} x2={760} y1={625} y2={625} stroke={F.filet} strokeWidth={4} />
        <line x1={60} x2={pointe - 16} y1={762} y2={762} stroke={F.encre2} strokeWidth={9} strokeLinecap="round" />
        <path d={`M${pointe - 26} 742 L${pointe + 10} 762 L${pointe - 26} 782 Z`} fill={F.encre2} />
        <g transform={`translate(590 762) scale(${1 - 0.05 * enfonce} ${1 + 0.05 * enfonce})`}>
          <path d="M-170 -62 Q0 -86 170 -62 Q186 0 170 62 Q0 86 -170 62 Q-186 0 -170 -62 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <path d="M-152 -48 Q0 -66 152 -48" fill="none" stroke={F.orClair} strokeWidth={3} />
          <path d="M-152 48 Q0 66 152 48" fill="none" stroke={F.orClair} strokeWidth={3} />
          {[[-170, -62], [170, -62], [-170, 62], [170, 62]].map(([x, y]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} />
          ))}
          <Libelle x={0} y={13} taille={36} graisse={600} couleur={F.papier}>{LIBELLES.confort}</Libelle>
        </g>
        {STOP.map((x, i) => {
          const t = p(f, d[2] + 100 + i * 12, d[2] + 150 + i * 12);
          return t > 0 ? <Piece key={x} x={mix(40, x, t)} y={712} r={20} opacite={lin(f, d[2] + 100 + i * 12, d[2] + 110 + i * 12)} /> : null;
        })}
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 15 — Le don mécanique                                          */
/* ------------------------------------------------------------------ */

const IlluMecanique: React.FC<PropsIllustration> = ({ f, d }) => {
  const HAUT = 590;
  const VITESSE = 2.4;
  const ECART = 156;
  const XS = [150, 400, 650];
  const fins = [d[2] + 70, d[2] + 112, d[2] + 155];
  const mot = p(f, d[1] + 120, d[1] + 150);
  return (
    <Scene>
      {/* Les trois mots, chacun sous sa bougie. */}
      {LIBELLES.eteints.map((m, i) => {
        const e = 1 - p(f, fins[i], fins[i] + 24);
        const c = interpolateColors(e, [0, 1], [F.encre2, F.orFonce]);
        const fumee = lin(f, fins[i] + 10, fins[i] + 30) * (1 - lin(f, fins[i] + 110, fins[i] + 170));
        return (
          <g key={m}>
            {e > 0 ? <circle cx={XS[i]} cy={108} r={70} fill={F.orClair} opacity={0.4 * e} /> : null}
            <Flamme x={XS[i]} y={144} h={70 * e} f={f} phase={i * 2} />
            {fumee > 0 ? <Filet x={XS[i]} y={136} h={96} a={10} f={f} phase={i} couleur={F.encre2} largeur={4} opacite={fumee} /> : null}
            <line x1={XS[i]} x2={XS[i]} y1={146} y2={134} stroke={F.encre} strokeWidth={3} />
            <rect x={XS[i] - 17} y={146} width={34} height={92} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            <path d={`M${XS[i] - 44} 238 H${XS[i] + 44} L${XS[i] + 30} 256 H${XS[i] - 30} Z`} fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <Libelle x={XS[i]} y={306} taille={32} graisse={600} couleur={c} opacite={mix(0.62, 1, e)}>{m}</Libelle>
          </g>
        );
      })}
      {/* Le tapis. */}
      {Array.from({ length: 7 }, (_, i) => {
        const x = ((f * VITESSE + i * ECART) % (ECART * 7)) - 110;
        if (x < -90 || x > 610) return null;
        const o = interpolate(x, [-90, -30], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        return (
          <g key={i} transform={`translate(${x + 70} ${HAUT - 74})`} opacity={o}>
            <rect x={0} y={0} width={84} height={74} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <rect x={36} y={0} width={12} height={74} fill={F.orClair} stroke={F.encre} strokeWidth={2} />
            <rect x={0} y={30} width={84} height={12} fill={F.orClair} stroke={F.encre} strokeWidth={2} />
          </g>
        );
      })}
      <rect x={20} y={HAUT} width={640} height={62} rx={31} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => {
        const x = 62 + i * 111;
        const a = (f * VITESSE * 180) / (Math.PI * 24);
        return (
          <g key={i} transform={`translate(${x} ${HAUT + 31}) rotate(${a})`}>
            <circle r={24} fill={F.filet} stroke={F.encre} strokeWidth={3} />
            <line x1={-20} x2={20} y1={0} y2={0} stroke={F.encre} strokeWidth={4} />
            <line x1={0} x2={0} y1={-20} y2={20} stroke={F.encre} strokeWidth={4} />
          </g>
        );
      })}
      {[110, 560].map((x) => (
        <rect key={x} x={x - 9} y={HAUT + 62} width={18} height={48} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      ))}
      {/* La fente. */}
      <rect x={648} y={HAUT - 170} width={132} height={280} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={648} y={HAUT - 94} width={24} height={94} fill={F.encre} />
      <circle cx={726} cy={HAUT - 120} r={22} fill={F.filet} stroke={F.encre} strokeWidth={3} />
      <line x1={726} y1={HAUT - 120} x2={726 + Math.cos(f / 8.2) * 16} y2={HAUT - 120 + Math.sin(f / 8.2) * 16} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      <line x1={0} x2={800} y1={HAUT + 110} y2={HAUT + 110} stroke={F.encre} strokeWidth={4} />
      <Libelle x={400} y={HAUT + 170} taille={32} graisse={600} opacite={mot}>{LIBELLES.mecanique}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 16 — La bête défectueuse                                       */
/* ------------------------------------------------------------------ */

const IlluBeteDefectueuse: React.FC<PropsIllustration> = ({ f, d }) => {
  const marche = p(f, d[2] + 60, d[2] + 215);
  const bouge = marche > 0 && marche < 1;
  const y = mix(350, 796, marche);
  const x = mix(545, 505, marche);
  const boite = bouge ? Math.sin(f / 4.5) : 0;
  const autel = p(f, d[1] - 10, d[1] + 25);
  const fumee = lin(f, d[2] + 225, d[2] + 240) * (1 - lin(f, d[2] + 240, d[3] - 10));
  const ferme = p(f, d[3] + 30, d[3] + 285);
  const choc = lin(f, d[3] + 285, d[3] + 300);
  const secousse = choc > 0 && choc < 1 ? Math.sin(choc * Math.PI * 4) * 2 * (1 - choc) : 0;
  const LP = 362;
  const Battant: React.FC<{ cote: number }> = ({ cote }) => (
    <g transform={`translate(${cote < 0 ? 38 : 762} 60) scale(${(0.05 + 0.95 * ferme) * -cote} 1)`}>
      <rect x={0} y={0} width={LP} height={802} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {[1, 2, 3, 4].map((i) => (
        <line key={i} x1={(i * LP) / 5} x2={(i * LP) / 5} y1={0} y2={802} stroke={F.encre} strokeWidth={3} opacity={0.6} />
      ))}
      {[120, 400, 680].map((by) => (
        <g key={by}>
          <rect x={0} y={by - 19} width={LP} height={38} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((k) => (
            <circle key={k} cx={k * LP} cy={by} r={7} fill={F.or} stroke={F.encre} strokeWidth={2} />
          ))}
        </g>
      ))}
    </g>
  );
  return (
    <Scene>
      <g transform={`translate(${secousse} 0)`}>
        {/* L'enclos. */}
        <g opacity={p(f, 2, 24)}>
          {[210, 270].map((ry) => (
            <line key={ry} x1={72} x2={728} y1={ry} y2={ry} stroke={F.cuir} strokeWidth={13} strokeLinecap="round" />
          ))}
          {[84, 395, 716].map((px) => (
            <rect key={px} x={px - 9} y={160} width={18} height={290} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
          ))}
          <path d="M72 430 H405 M655 430 H728" stroke={F.cuir} strokeWidth={13} strokeLinecap="round" />
          <line x1={72} x2={728} y1={350} y2={350} stroke={F.filet} strokeWidth={4} />
        </g>
        <Bete x={225} y={350} s={0.82} opacite={p(f, 6, 30)} />
        <Libelle x={225} y={398} taille={27} graisse={600} opacite={p(f, 16, 40)}>{LIBELLES.bonne}</Libelle>
        {/* L'autel, froid. */}
        <g opacity={autel}>
          <line x1={60} x2={740} y1={800} y2={800} stroke={F.encre} strokeWidth={4} />
          <Autel x={205} y={610} l={220} h={190} />
          {fumee > 0 ? <Filet x={205} y={602} h={90} a={7} f={f} couleur={F.encre2} largeur={4} opacite={fumee * 0.7} /> : null}
        </g>
        <Bete x={x} y={y + Math.abs(boite) * 5} s={0.82} boiteuse fond={F.encre2} angle={boite * 3.5} opacite={p(f, 6, 30)} />
        <Libelle x={x + 18} y={y + 42} taille={25} graisse={600} couleur={F.argile} opacite={p(f, 16, 40)}>{LIBELLES.defectueuse}</Libelle>
      </g>
      {/* Les portes. */}
      <Battant cote={-1} />
      <Battant cote={1} />
      <rect x={12} y={18} width={776} height={44} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={12} y={62} width={28} height={800} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={760} y={62} width={28} height={800} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={12} y={860} width={776} height={22} fill={F.filet} stroke={F.encre} strokeWidth={4} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 17 — Fin                                                       */
/* ------------------------------------------------------------------ */

const IlluFinAutel: React.FC<PropsIllustration> = ({ f }) => {
  const haut = p(f, 0, 70);
  return (
    <Scene>
      <Thermometre x={120} y={100} h={590} l={64} niveau={0.72 + 0.28 * p(f, 0, 60)} graduations={false} />
      <line x1={230} x2={800} y1={810} y2={810} stroke={F.encre} strokeWidth={4} />
      <Rayons x={440} y={290} r1={230} r2={250 + 28 * p(f, 30, 90)} de={-150} a={-30} n={9} opacite={p(f, 30, 90) * 0.85} />
      <Flamme x={430} y={562} h={mix(300, 470, haut)} l={mix(180, 225, haut)} f={f} />
      <Autel x={490} y={560} l={340} h={250} />
      <Bourse x={585} y={525} s={0.6} vide={1} angle={8} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluMille,
  p3: IlluExtravagant,
  p4: IlluPourToujours,
  p5: IlluObeissance,
  p6: IlluHistoire,
  p7: IlluCout,
  p8: IlluPalaisTente,
  p9: IlluMiroir,
  p10: IlluMaisonDavid,
  p11: IlluChemin,
  p12: IlluEau,
  p13: IlluFeu,
  p14: IlluTresor,
  p15: IlluMecanique,
  p16: IlluBeteDefectueuse,
  fin: IlluFinAutel,
};

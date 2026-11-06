import React from 'react';
import { Libelle, PropsIllustration, Scene, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const fract = (x: number) => x - Math.floor(x);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const RAD = Math.PI / 180;

/* ------------------------------------------------------------------ */
/* Les deux axes : même géométrie à l'ouverture, au plan 2 et à la fin. */
/* ------------------------------------------------------------------ */

const OX = 130;
const OY = 750;
const LONG_X = 610;
const LONG_Y = 640;
const DEMI = 9;
const TICKS_X = [0, 1, 2, 3, 4, 5].map((i) => OX + 90 + i * 92);
const TICKS_Y = [0, 1, 2, 3, 4, 5].map((i) => OY - 90 - i * 94);

const etoile = (x: number, y: number, r: number) =>
  `${Array.from({ length: 10 }, (_, i) => {
    const a = (-90 + i * 36) * RAD;
    const q = i % 2 === 0 ? r : r * 0.45;
    return `${i === 0 ? 'M' : 'L'}${(x + Math.cos(a) * q).toFixed(1)} ${(y + Math.sin(a) * q).toFixed(1)}`;
  }).join(' ')} Z`;

/** Une petite silhouette sans visage : tête ronde et épaules. */
const Silhouette: React.FC<{ x: number; y: number; apparition: number; plein: number }> = ({ x, y, apparition, plein }) => (
  <g transform={`translate(${x} ${y}) scale(${apparition})`} opacity={apparition}>
    {[F.papier, F.or].map((c, i) => (
      <g key={c} opacity={i === 0 ? 1 : plein}>
        <circle cx={0} cy={-15} r={11} fill={c} stroke={F.encre} strokeWidth={3} />
        <path d="M-20 22 Q-20 -2 0 -2 Q20 -2 20 22 Z" fill={c} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      </g>
    ))}
  </g>
);

const Etoile: React.FC<{ x: number; y: number; apparition: number; plein: number }> = ({ x, y, apparition, plein }) => (
  <g transform={`translate(${x} ${y}) scale(${apparition}) translate(${-x} ${-y})`} opacity={apparition}>
    <path d={etoile(x, y, 21)} fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <path d={etoile(x, y, 21)} fill={F.or} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" opacity={plein} />
  </g>
);

type PropsAxes = {
  traceX: number;
  traceY: number;
  remplirX?: number;
  remplirY?: number;
  etoiles?: number[];
  silhouettes?: number[];
  libelles?: number;
  accentX?: number;
  accentY?: number;
  quadrillage?: number;
};

const Axes: React.FC<PropsAxes> = ({ traceX, traceY, remplirX = 0, remplirY = 0, etoiles, silhouettes, libelles = 1, accentX = 0, accentY = 0, quadrillage = 1 }) => {
  const lx = LONG_X * traceX;
  const ly = LONG_Y * traceY;
  return (
    <g>
      <g opacity={quadrillage}>
        {TICKS_X.map((x) => <line key={x} x1={x} x2={x} y1={OY - DEMI} y2={OY - LONG_Y + 40} stroke={F.filet} strokeWidth={2} />)}
        {TICKS_Y.map((y) => <line key={y} y1={y} y2={y} x1={OX + DEMI} x2={OX + LONG_X - 40} stroke={F.filet} strokeWidth={2} />)}
      </g>
      {/* Axe horizontal. */}
      <rect x={OX} y={OY - DEMI} width={lx} height={DEMI * 2} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={OX + 2} y={OY - DEMI + 2} width={Math.max(0, (lx - 4) * remplirX)} height={DEMI * 2 - 4} fill={F.or} />
      {traceX > 0.98 ? <path d={`M${OX + LONG_X - 2} ${OY - 22} L${OX + LONG_X + 38} ${OY} L${OX + LONG_X - 2} ${OY + 22} Z`} fill={remplirX > 0.97 ? F.or : F.encre} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" /> : null}
      {/* Axe vertical. */}
      <rect x={OX - DEMI} y={OY - ly} width={DEMI * 2} height={ly} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={OX - DEMI + 2} y={OY - 2 - Math.max(0, (ly - 4) * remplirY)} width={DEMI * 2 - 4} height={Math.max(0, (ly - 4) * remplirY)} fill={F.or} />
      {traceY > 0.98 ? <path d={`M${OX - 22} ${OY - LONG_Y + 2} L${OX} ${OY - LONG_Y - 38} L${OX + 22} ${OY - LONG_Y + 2} Z`} fill={remplirY > 0.97 ? F.or : F.encre} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" /> : null}
      {/* L'angle droit. */}
      <rect x={OX - DEMI - 2} y={OY - DEMI - 2} width={DEMI * 2 + 4} height={DEMI * 2 + 4} fill={remplirX > 0 || remplirY > 0 ? F.or : F.encre} stroke={F.encre} strokeWidth={4} />
      {etoiles ? TICKS_X.map((x, i) => <Etoile key={x} x={x} y={OY + 42} apparition={etoiles[i]} plein={p(remplirX * LONG_X, x - OX - 30, x - OX + 4)} />) : null}
      {silhouettes ? TICKS_Y.map((y, i) => <Silhouette key={y} x={OX - 62} y={y} apparition={silhouettes[i]} plein={p(remplirY * LONG_Y, OY - y - 30, OY - y + 4)} />) : null}
      <Libelle x={OX + LONG_X / 2} y={OY + 112} taille={36} graisse={600} couleur={accentX > 0 ? F.orFonce : F.encre} opacite={libelles}>{LIBELLES.vision}</Libelle>
      <Libelle x={OX - 10} y={OY - LONG_Y - 56} taille={36} graisse={600} ancre="start" couleur={accentY > 0 ? F.orFonce : F.encre} opacite={libelles}>{LIBELLES.hommes}</Libelle>
    </g>
  );
};

/* Le point sur le repère. */
const X_DEPART = OX + 34;
const Y_BAS = OY - 34;
const X_COUDE = OX + 150;
const X_SOMMET = OX + LONG_X - 72;
const Y_SOMMET = OY - LONG_Y + 66;

const PointRepere: React.FC<{ x: number; y: number; halo: number; rayons: number; f: number }> = ({ x, y, halo, rayons, f }) => (
  <g>
    {rayons > 0
      ? Array.from({ length: 12 }, (_, i) => {
          // Aucun rayon sur la diagonale d'où arrive le point.
          const a = (i * 30 + 5.6) * RAD;
          const r1 = 44 + Math.sin(f / 9 + i) * 3;
          const r2 = r1 + 30 * rayons;
          return <line key={i} x1={x + Math.cos(a) * r1} y1={y + Math.sin(a) * r1} x2={x + Math.cos(a) * r2} y2={y + Math.sin(a) * r2} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={rayons} />;
        })
      : null}
    <circle cx={x} cy={y} r={30 + 6 * Math.sin(f / 10) * halo} fill={F.orClair} opacity={0.55 * halo} />
    <circle cx={x} cy={y} r={20} fill={F.argile} stroke={F.encre} strokeWidth={4} />
  </g>
);

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const tx = p(f, 8, 62);
  const ty = p(f, 50, 104);
  const lib = p(f, 96, 124);
  return (
    <Scene>
      <Axes traceX={tx} traceY={ty} libelles={lib} quadrillage={p(f, 110, 150)} />
    </Scene>
  );
};

const IlluAxes: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  // Phrase 1 : les deux axes s'allument chacun quand son nom arrive.
  const etoiles = TICKS_X.map((_, i) => p(f, d0 + 160 + i * 9, d0 + 176 + i * 9));
  const silhouettes = TICKS_Y.map((_, i) => p(f, d0 + 222 + i * 11, d0 + 240 + i * 11));
  const accentX = p(f, d0 + 160, d0 + 175) * (1 - p(f, d0 + 215, d0 + 232));
  const accentY = p(f, d0 + 222, d0 + 236) * (1 - p(f, d1 - 14, d1));
  // Phrase 2 : la vision seule, puis les hommes aussi.
  const seul = p(f, d1 + 8, d1 + 130);
  const ensemble = p(f, d1 + 235, d1 + 335);
  const sauts = f > d1 + 140 && f < d1 + 228 ? Math.abs(Math.sin(((f - d1 - 140) / 88) * Math.PI * 2)) * 30 : 0;
  const cx = lerp(X_DEPART, X_COUDE, seul);
  const x = lerp(cx, X_SOMMET, ensemble);
  const y = lerp(Y_BAS, Y_SOMMET, ensemble) - sauts * (1 - ensemble);
  const remplirX = lerp(0.04, 0.26, seul) + 0.74 * ensemble;
  const remplirY = ensemble;
  const rayons = p(f, d1 + 325, d1 + 355);
  const trainee = seul > 0 ? `M${X_DEPART} ${Y_BAS} L${cx} ${Y_BAS}${ensemble > 0 ? ` L${x} ${lerp(Y_BAS, Y_SOMMET, ensemble)}` : ''}` : '';
  return (
    <Scene>
      <Axes traceX={1} traceY={1} remplirX={f >= d1 ? remplirX : 0} remplirY={remplirY} etoiles={etoiles} silhouettes={silhouettes} accentX={accentX} accentY={accentY} />
      {trainee ? <path d={trainee} fill="none" stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" /> : null}
      {ensemble > 0 ? <line x1={x} x2={x} y1={lerp(Y_BAS, Y_SOMMET, ensemble) + 24} y2={OY - DEMI - 4} stroke={F.encre2} strokeWidth={3} strokeDasharray="4 10" strokeLinecap="round" opacity={ensemble * (1 - rayons)} /> : null}
      {ensemble > 0 ? <line x1={x - 24} x2={OX + DEMI + 4} y1={lerp(Y_BAS, Y_SOMMET, ensemble)} y2={lerp(Y_BAS, Y_SOMMET, ensemble)} stroke={F.encre2} strokeWidth={3} strokeDasharray="4 10" strokeLinecap="round" opacity={ensemble * (1 - rayons)} /> : null}
      <PointRepere x={x} y={y} halo={0.4 + 0.6 * rayons} rayons={rayons} f={f} />
    </Scene>
  );
};

const IlluFinale: React.FC<PropsIllustration> = ({ f }) => {
  const montee = p(f, 6, 62);
  const rayons = p(f, 56, 86);
  const x = lerp(X_COUDE, X_SOMMET, montee);
  const y = lerp(Y_BAS, Y_SOMMET, montee);
  return (
    <Scene>
      <Axes traceX={1} traceY={1} remplirX={0.26 + 0.74 * montee} remplirY={montee} etoiles={TICKS_X.map(() => 1)} silhouettes={TICKS_Y.map(() => 1)} />
      <path d={`M${X_DEPART} ${Y_BAS} L${X_COUDE} ${Y_BAS} L${x} ${y}`} fill="none" stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
      <PointRepere x={x} y={y} halo={0.4 + 0.6 * rayons} rayons={rayons * (1 + 0.12 * Math.sin(f / 12))} f={f} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 3 : la route, la mallette, la voiture, la gerbe.                */
/* ------------------------------------------------------------------ */

const CADRE = { x: 20, y: 70, w: 760, h: 760 };
const HORIZON = 390;
const ROUTE = 430;
const XC = 400;
const SOL = 610;
const VITESSE = 5;

const cyclique = (x: number, l: number) => ((x % l) + l) % l;

/** La mallette fermée, vue de face, posée sur sa base. */
const Mallette: React.FC<{ x: number; y: number; lueur: number }> = ({ x, y, lueur }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-52 -160 V-186 Q-52 -196 -42 -196 H42 Q52 -196 52 -186 V-160" fill="none" stroke={F.encre} strokeWidth={13} />
    <path d="M-52 -160 V-186 Q-52 -196 -42 -196 H42 Q52 -196 52 -186 V-160" fill="none" stroke={F.cuirClair} strokeWidth={6} />
    <rect x={-125} y={-160} width={250} height={160} rx={14} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
    <path d="M-125 -112 H125" stroke={F.encre} strokeWidth={4} />
    <path d="M-125 -112 H125" stroke={F.orClair} strokeWidth={5} opacity={lueur} />
    <path d="M-112 -148 H112" stroke={F.cuirClair} strokeWidth={3} strokeDasharray="12 9" />
    <path d="M-112 -14 H112" stroke={F.cuirClair} strokeWidth={3} strokeDasharray="12 9" />
    {[-72, 72].map((c) => (
      <g key={c}>
        <rect x={c - 17} y={-127} width={34} height={36} rx={5} fill={F.or} stroke={F.encre} strokeWidth={4} />
        <rect x={c - 6} y={-114} width={12} height={12} rx={2} fill={F.orFonce} />
      </g>
    ))}
    {[[-125, -160, 1, 1], [125, -160, -1, 1], [-125, 0, 1, -1], [125, 0, -1, -1]].map(([a, b, sx, sy]) => (
      <path key={`${a}${b}`} d={`M${a + sx! * 24} ${b} H${a! + sx! * 8} Q${a} ${b} ${a} ${b! + sy! * 8} V${b! + sy! * 24}`} fill="none" stroke={F.or} strokeWidth={5} strokeLinecap="round" />
    ))}
  </g>
);

/** La mallette vide : d'abord fermée, elle s'ouvre (o de 0 à 1) et montre qu'il n'y a rien dedans. */
const MalletteVide: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => {
  const hautFace = -160 + 92 * o;
  const fond = hautFace - 70 * o;
  const couvercle = fond - 158 * o;
  const c = 125 - 22 * o;
  return (
    <g transform={`translate(${x} ${y})`}>
      {o > 0.02 ? (
        <>
          <path d={`M${-c} ${couvercle + 10} Q${-c} ${couvercle} ${-c + 10} ${couvercle} H${c - 10} Q${c} ${couvercle} ${c} ${couvercle + 10} V${fond} H${-c} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
          <rect x={-c + 14} y={couvercle + 14} width={2 * c - 28} height={Math.max(0, fond - couvercle - 14)} fill={F.papier} stroke={F.encre} strokeWidth={2} />
          <path d={`M-125 ${hautFace} L${-c} ${fond} H${c} L125 ${hautFace} Z`} fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        </>
      ) : null}
      <path d={`M-125 ${hautFace + 12} Q-125 ${hautFace} -113 ${hautFace} H113 Q125 ${hautFace} 125 ${hautFace + 12} V-12 Q125 0 113 0 H-113 Q-125 0 -125 -12 Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      {o < 0.5 ? <path d={`M-125 ${hautFace + 48 * (1 - o)} H125`} stroke={F.encre} strokeWidth={4} opacity={1 - 2 * o} /> : null}
      {[-72, 72].map((a) => <rect key={a} x={a - 15} y={hautFace + 10} width={30} height={30} rx={5} fill={F.filet} stroke={F.encre} strokeWidth={4} />)}
    </g>
  );
};

/** L'éclat de colère : une étoile hachée. */
const Eclat: React.FC<{ x: number; y: number; r: number; tour: number; couleur?: string }> = ({ x, y, r, tour, couleur = F.argile }) => {
  const d = `${Array.from({ length: 22 }, (_, i) => {
    const a = (tour + (i * 360) / 22) * RAD;
    const q = i % 2 === 0 ? r * (0.86 + 0.14 * fract(i * 0.618)) : r * 0.56;
    return `${i === 0 ? 'M' : 'L'}${(x + Math.cos(a) * q).toFixed(1)} ${(y + Math.sin(a) * q).toFixed(1)}`;
  }).join(' ')} Z`;
  return <path d={d} fill={couleur} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />;
};

const Voiture: React.FC<{ x: number; y: number; roue: number }> = ({ x, y, roue }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-158 -36 V-72 Q-158 -92 -130 -98 L-80 -104 Q-40 -152 12 -152 H52 Q88 -152 116 -104 L146 -94 Q164 -86 164 -60 V-36 Z" fill={F.encre2} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
    <path d="M-58 -106 Q-30 -138 8 -138 V-106 Z M22 -138 H52 Q76 -138 96 -106 H22 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M15 -100 V-44" stroke={F.encre} strokeWidth={3} />
    <rect x={32} y={-88} width={26} height={7} rx={3} fill={F.encre} />
    <path d="M148 -76 H164 V-60 H152 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <rect x={-160} y={-70} width={12} height={16} rx={2} fill={F.argile} stroke={F.encre} strokeWidth={3} />
    {[-92, 96].map((c) => (
      <g key={c} transform={`translate(${c} -34) rotate(${roue})`}>
        <circle r={34} fill={F.encre} />
        <circle r={17} fill={F.filet} stroke={F.encre} strokeWidth={2} />
        <path d="M-15 0 H15 M0 -15 V15" stroke={F.encre} strokeWidth={4} />
      </g>
    ))}
  </g>
);

/** La gerbe : chaque goutte part de la flaque, passe derrière la mallette et retombe de part et d'autre. */
const hasard = (i: number, k: number) => fract(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453);
const GOUTTES = Array.from({ length: 84 }, (_, i) => {
  const u = hasard(i, 1);
  const v = hasard(i, 2);
  const w = hasard(i, 3);
  const pic = hasard(i, 4);
  const taille = hasard(i, 5);
  const cote = i % 2 === 0 ? -1 : 1;
  return {
    x0: XC + cote * (10 + 80 * u),
    y0: 770,
    x1: XC + cote * (160 + 200 * v),
    y1: SOL + 10 + 150 * w,
    pic: 170 + 230 * pic,
    depart: 1 + 16 * u,
    vol: 40 + 22 * hasard(i, 6),
    r: 4 + 9 * taille,
  };
});

const IlluRoute: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const depart = d1 - 15;
  const a = Math.max(0, f - depart);
  const s = VITESSE * (a < 30 ? (a * a) / 60 : a - 15);
  const marche = p(f, depart, depart + 30);
  // Phrase 1 : la mallette arrêtée, la colère, puis elle s'ouvre : vide.
  const ouvert = p(f, d0 + 190, d0 + 214);
  const dissipe = 1 - p(f, d1 - 26, d1 - 8);
  const colere = 1 - 0.55 * p(f, d0 + 230, d0 + 275);
  const secousse = Math.sin(f * 1.7) * 3.5 * (1 - ouvert);
  const vibre = 1 + 0.07 * Math.sin(f / 3.2);
  // Phrase 2 : la mallette fermée entre, la voiture passe, la gerbe retombe.
  const entree = p(f, d1 - 20, d1 + 60);
  const xM = lerp(-170, XC, entree);
  const bond = Math.abs(Math.sin(f / 9)) * 6 * marche;
  const incline = Math.sin(f / 18) * 0.7 * marche;
  const impact = d1 + 130;
  const xVoiture = XC - 96 + 14 * (f - impact);
  const voitureVisible = xVoiture > -190 && xVoiture < 980;
  const xFlaque = XC - VITESSE * (f - impact);
  const lueur = p(f, d1 + 245, d1 + 300);
  const pulsation = 1 + 0.03 * Math.sin(f / 10);
  return (
    <Scene>
      <defs>
        <clipPath id="ch23-cadre">
          <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} rx={22} />
        </clipPath>
      </defs>
      <g clipPath="url(#ch23-cadre)">
        <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} fill={F.papier} />
        {/* Nuages, très lents. */}
        {[0, 1, 2].map((i) => {
          const x = cyclique(410 + i * 370 - f * 0.25 - s * 0.08, 1110) - 150;
          const y = 140 + (i % 2) * 54;
          return (
            <g key={i}>
              <path d={`M${x - 70} ${y + 18} Q${x - 78} ${y - 8} ${x - 42} ${y - 6} Q${x - 30} ${y - 36} ${x + 4} ${y - 22} Q${x + 34} ${y - 38} ${x + 46} ${y - 6} Q${x + 80} ${y - 6} ${x + 70} ${y + 18} Z`} fill={F.parchemin} stroke={F.filet} strokeWidth={3} strokeLinejoin="round" />
            </g>
          );
        })}
        {/* Arbres lointains. */}
        {[0, 1, 2, 3].map((i) => {
          const x = cyclique(90 + i * 290 - s * 0.35, 1160) - 90;
          return (
            <g key={i}>
              <rect x={x - 5} y={HORIZON - 34} width={10} height={36} fill={F.encre2} />
              <circle cx={x} cy={HORIZON - 58} r={32} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
            </g>
          );
        })}
        <rect x={0} y={HORIZON} width={800} height={ROUTE - HORIZON} fill={F.parchemin} />
        <line x1={0} x2={800} y1={HORIZON} y2={HORIZON} stroke={F.encre2} strokeWidth={3} />
        {/* Bornes du bord de route : elles montrent la vitesse. */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = cyclique(100 + i * 240 - s, 1200) - 100;
          return <path key={i} d={`M${x - 11} ${ROUTE - 8} V${ROUTE - 40} Q${x - 11} ${ROUTE - 54} ${x} ${ROUTE - 54} Q${x + 11} ${ROUTE - 54} ${x + 11} ${ROUTE - 40} V${ROUTE - 8} Z`} fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />;
        })}
        {/* La route. */}
        <rect x={0} y={ROUTE} width={800} height={830 - ROUTE} fill={F.filet} />
        <line x1={0} x2={800} y1={ROUTE} y2={ROUTE} stroke={F.encre} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => {
          const x = cyclique(i * 170 - s, 1190) - 110;
          return <rect key={i} x={x} y={632} width={92} height={9} rx={2} fill={F.papier} />;
        })}
        {/* La flaque, qui vient à la rencontre de la voiture. */}
        {xFlaque > -200 && xFlaque < 1000 ? (
          <g>
            <ellipse cx={xFlaque} cy={778} rx={130} ry={21} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
            <ellipse cx={xFlaque - 30} cy={773} rx={52} ry={6} fill={F.filet} opacity={0.65} />
          </g>
        ) : null}
        {/* La gerbe passe derrière la mallette : elle ne l'atteint pas. */}
        {GOUTTES.map((g, i) => {
          const t0 = impact + g.depart;
          const t = (f - t0) / g.vol;
          if (t <= 0) return null;
          if (t >= 1) {
            const apres = f - t0 - g.vol;
            if (apres > 44) return null;
            return <ellipse key={i} cx={g.x1 - VITESSE * apres} cy={g.y1} rx={g.r * 1.6} ry={g.r * 0.5} fill={F.encre2} opacity={1 - apres / 44} />;
          }
          const c = 2 * g.pic - (g.y0 + g.y1) / 2;
          const x = lerp(g.x0, g.x1, t);
          const y = (1 - t) ** 2 * g.y0 + 2 * (1 - t) * t * c + t ** 2 * g.y1;
          const vy = 2 * (1 - t) * (c - g.y0) + 2 * t * (g.y1 - c);
          const angle = (Math.atan2(vy, (g.x1 - g.x0)) * 180) / Math.PI - 90;
          return <ellipse key={i} transform={`rotate(${angle} ${x} ${y})`} cx={x} cy={y} rx={g.r * 0.72} ry={g.r * 1.25} fill={F.encre2} stroke={F.encre} strokeWidth={1.5} />;
        })}
        {/* Phrase 1. */}
        {dissipe > 0 ? (
          <g opacity={dissipe}>
            <ellipse cx={XC} cy={SOL + 6} rx={140} ry={11} fill={F.encre2} opacity={0.3} />
            <MalletteVide x={XC + secousse} y={SOL} o={ouvert} />
            <g transform={`translate(${XC} 196) scale(${vibre * colere}) translate(${-XC} -196)`}>
              <Eclat x={XC} y={196} r={84} tour={f * 0.9} />
              <Eclat x={XC} y={196} r={40} tour={-f * 1.3} couleur={F.orClair} />
            </g>
            <Libelle x={XC} y={700} taille={38} graisse={600} opacite={p(f, d0 + 210, d0 + 228)}>{LIBELLES.enjeu}</Libelle>
          </g>
        ) : null}
        {/* Phrase 2 : la mallette, qui ne s'arrête pas. */}
        {f > d1 - 20 ? (
          <g>
            {lueur > 0 ? (
              <g>
                <circle cx={xM} cy={SOL - 90} r={186 * pulsation} fill={F.orClair} opacity={0.5 * lueur} />
                {Array.from({ length: 16 }, (_, i) => {
                  const ang = (i * 22.5 - 90) * RAD;
                  const r1 = 198;
                  const r2 = r1 + (i % 2 === 0 ? 38 : 22) * lueur * pulsation;
                  return <line key={i} x1={xM + Math.cos(ang) * r1} y1={SOL - 90 + Math.sin(ang) * r1} x2={xM + Math.cos(ang) * r2} y2={SOL - 90 + Math.sin(ang) * r2} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={lueur} />;
                })}
              </g>
            ) : null}
            <ellipse cx={xM} cy={SOL + 8} rx={130 - bond * 2} ry={10} fill={F.encre2} opacity={0.35} />
            <g transform={`rotate(${incline} ${xM} ${SOL})`}>
              <Mallette x={xM} y={SOL - bond} lueur={lueur} />
            </g>
            <Libelle x={XC} y={798} taille={40} graisse={600} couleur={F.orFonce} opacite={p(f, d1 + 270, d1 + 300)}>{LIBELLES.precieux}</Libelle>
          </g>
        ) : null}
        {/* La voiture, au premier plan. */}
        {voitureVisible ? <Voiture x={xVoiture} y={806} roue={f * 23} /> : null}
      </g>
      <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} rx={22} fill="none" stroke={F.encre} strokeWidth={5} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 4 : le roseau, la mèche, les deux mains, la lumière.            */
/* ------------------------------------------------------------------ */

/** Une main ouverte en contour simple, pouce vers le centre. L'origine est au poignet. */
const Main: React.FC<{ x: number; y: number; sens: 1 | -1; incline: number; eclat: number }> = ({ x, y, sens, incline, eclat }) => {
  const formes = (props: React.SVGProps<SVGRectElement> & React.SVGProps<SVGPathElement>) => (
    <>
      <rect x={-50} y={-60} width={100} height={240} {...props} />
      <path d="M-74 -30 Q-82 -120 -74 -180 H74 Q80 -120 72 -60 Q60 -10 50 0 H-50 Q-66 -10 -74 -30 Z" {...props} />
      {[
        { x: -72, l: 128, a: -9 },
        { x: -36, l: 166, a: -3 },
        { x: 1, l: 184, a: 2 },
        { x: 38, l: 160, a: 8 },
      ].map((d) => (
        <rect key={d.x} x={d.x} y={-170 - d.l} width={33} height={d.l + 30} rx={16.5} transform={`rotate(${d.a} ${d.x + 16} -170)`} {...props} />
      ))}
      <rect x={52} y={-138} width={38} height={124} rx={19} transform="rotate(32 62 -30)" {...props} />
    </>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${sens * 0.88} 0.88) rotate(${incline})`}>
      <g>{formes({ fill: F.or, stroke: F.or, strokeWidth: 4 + 20 * eclat, opacity: eclat * 0.6 })}</g>
      <g>{formes({ fill: F.encre, stroke: F.encre, strokeWidth: 9 })}</g>
      <g>{formes({ fill: F.papier })}</g>
      <path d="M-46 -116 Q0 -92 46 -128" fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" />
      <path d="M-38 -66 Q-4 -50 30 -76" fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

const NB = 16;
const SEG = 30;
const X_ROSEAU = 332;
const Y_ROSEAU = 752;
const POIDS: Record<number, number> = { 11: 0.2, 12: 0.34, 13: 0.3, 14: 0.16 };
const PLI = 170;

const Roseau: React.FC<{ redresse: number; vent: number; f: number }> = ({ redresse, vent, f }) => {
  const pts: { x: number; y: number; a: number }[] = [{ x: X_ROSEAU, y: Y_ROSEAU, a: -90 }];
  let a = -90;
  for (let i = 0; i < NB; i++) {
    a += -(POIDS[i] ?? 0) * PLI * (1 - redresse) + Math.sin(f / 13 + i * 0.35) * 0.32 * vent - (i < 10 ? 0.15 * (1 - redresse) : 0);
    const prec = pts[i];
    pts.push({ x: prec.x + Math.cos(a * RAD) * SEG, y: prec.y + Math.sin(a * RAD) * SEG, a });
  }
  let chemin = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i].x + pts[i + 1].x) / 2;
    const my = (pts[i].y + pts[i + 1].y) / 2;
    chemin += ` Q${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const fin = pts[pts.length - 1];
  const Feuille: React.FC<{ i: number; c: 1 | -1; l: number }> = ({ i, c, l }) => {
    const b = pts[i];
    const pointe = { x: b.x + c * l * 0.72, y: b.y - l * 0.72 - l * 0.18 * redresse };
    return <path d={`M${b.x} ${b.y} Q${b.x + c * l * 0.16} ${b.y - l * 0.72} ${pointe.x} ${pointe.y} Q${b.x + c * l * 0.46} ${b.y - l * 0.42} ${b.x} ${b.y}`} fill={F.or} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />;
  };
  return (
    <g>
      <Feuille i={1} c={-1} l={84} />
      <Feuille i={3} c={1} l={58} />
      <path d={chemin} fill="none" stroke={F.encre} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
      <path d={chemin} fill="none" stroke={F.orClair} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((q, i) =>
        i > 0 && i % 3 === 0 && i < NB ? (
          <line key={i} x1={q.x + Math.cos((q.a + 90) * RAD) * 7} y1={q.y + Math.sin((q.a + 90) * RAD) * 7} x2={q.x - Math.cos((q.a + 90) * RAD) * 7} y2={q.y - Math.sin((q.a + 90) * RAD) * 7} stroke={F.encre} strokeWidth={3} />
        ) : null,
      )}
      {/* L'épi au bout de la tige. */}
      <g transform={`translate(${fin.x} ${fin.y}) rotate(${fin.a + 90})`}>
        <path d="M0 -62 V-74" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
        <rect x={-11} y={-64} width={22} height={76} rx={11} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      </g>
    </g>
  );
};

const XM = 418;
const YM = 664;

const Lampe: React.FC<{ flamme: number; fumee: number; vent: number; f: number }> = ({ flamme, fumee, vent, f }) => (
  <g>
    {/* La fumée de la mèche, tant qu'elle n'a pas pris. */}
    {fumee > 0
      ? [0, 1].map((k) =>
          Array.from({ length: 12 }, (_, i) => {
            const h = (q: number) => q * 15;
            const pos = (q: number) => XM + Math.sin(h(q) / 24 - f / 9 + k * 2.2) * (3 + h(q) * 0.07) + vent * h(q) * 0.1;
            return <line key={`${k}-${i}`} x1={pos(i)} x2={pos(i + 1)} y1={YM - 8 - h(i)} y2={YM - 8 - h(i + 1)} stroke={F.encre2} strokeWidth={5 - k} strokeLinecap="round" opacity={fumee * (1 - i / 12) * 0.8} />;
          }),
        )
      : null}
    {/* La flamme. */}
    {flamme > 0 ? (
      <g>
        <circle cx={XM} cy={YM - 44} r={88 * flamme} fill={F.orClair} opacity={0.42} />
        <g transform={`translate(${XM} ${YM - 2}) scale(${flamme * (1 + 0.05 * Math.sin(f / 4))} ${flamme * (1 + 0.09 * Math.sin(f / 3))})`}>
          <path d="M0 0 C-30 -10 -30 -46 0 -96 C30 -46 30 -10 0 0 Z" fill={F.or} stroke={F.orFonce} strokeWidth={3} strokeLinejoin="round" />
          <path d="M0 -4 C-15 -12 -15 -32 0 -58 C15 -32 15 -12 0 -4 Z" fill={F.orClair} />
        </g>
      </g>
    ) : null}
    {/* Le lumignon de terre cuite. */}
    <path d="M556 700 C582 682 590 712 556 722" fill="none" stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
    <path d="M556 700 C582 682 590 712 556 722" fill="none" stroke={F.argile} strokeWidth={4} strokeLinecap="round" />
    <path d="M408 684 Q422 668 460 672 C486 660 530 660 552 678 Q566 696 552 716 Q532 744 486 744 Q448 744 430 712 Q420 700 408 684 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <ellipse cx={498} cy={676} rx={22} ry={6} fill={F.encre} />
    <path d="M412 684 L417 664" stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
    <path d="M462 744 H512 L518 758 H456 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

const IlluBonte: React.FC<PropsIllustration> = ({ f, d }) => {
  const [d0, d1] = d;
  const mains = p(f, d0 + 130, d0 + 215);
  const vent = 1 - p(f, d0 + 190, d0 + 260);
  const lumiere = p(f, d0 + 320, d0 + 405);
  const redresse = p(f, d1 + 8, d1 + 135);
  const flamme = p(f, d1 + 60, d1 + 118);
  const fumee = 1 - p(f, d1 + 58, d1 + 92);
  const eclat = p(f, d1 + 142, d1 + 195) * (0.8 + 0.2 * Math.sin(f / 12));
  const elargi = p(f, d1 + 150, d1 + 300);
  const CX = 375;
  const bas = 90 + 760 * lumiere;
  const lb = lerp(120, 225, elargi) * lumiere;
  return (
    <Scene>
      <defs>
        <linearGradient id="ch23-faisceau" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={F.orClair} stopOpacity={0.9} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="ch23-poignet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={F.parchemin} stopOpacity={0} />
          <stop offset="1" stopColor={F.parchemin} stopOpacity={1} />
        </linearGradient>
      </defs>
      {/* La lumière descend d'en haut. */}
      {lumiere > 0 ? (
        <g>
          <path d={`M${CX - 46} -90 L${CX + 46} -90 L${CX + lb} ${bas} L${CX - lb} ${bas} Z`} fill="url(#ch23-faisceau)" />
          {[-0.62, -0.2, 0.22, 0.64].map((k, i) => (
            <line key={k} x1={CX + k * 46} y1={-90} x2={CX + k * lerp(46, lb, 0.86)} y2={lerp(-90, bas, 0.86)} stroke={F.or} strokeWidth={5} strokeLinecap="round" strokeDasharray="26 34" strokeDashoffset={-f * 2.2 - i * 17} opacity={0.75 * lumiere} />
          ))}
        </g>
      ) : null}
      {/* La terre. */}
      <path d="M186 800 Q196 750 300 746 H500 Q604 750 614 800 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <Lampe flamme={flamme} fumee={fumee} vent={vent} f={f} />
      <Roseau redresse={redresse} vent={vent} f={f} />
      {/* Les deux mains. */}
      <g opacity={p(f, d0 + 130, d0 + 165)} transform={`translate(0 ${(1 - mains) * 170})`}>
        <Main x={84} y={768} sens={1} incline={5} eclat={eclat} />
        <Main x={716} y={768} sens={-1} incline={5} eclat={eclat} />
      </g>
      <rect x={0} y={826} width={800} height={74} fill="url(#ch23-poignet)" />
      <rect x={0} y={899} width={800} height={91} fill={F.parchemin} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluAxes,
  p3: IlluRoute,
  p4: IlluBonte,
  fin: IlluFinale,
};

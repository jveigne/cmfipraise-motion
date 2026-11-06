import React from 'react';
import { Easing, interpolate, interpolateColors } from 'remotion';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const mix = (t: number, a: string, b: string) => interpolateColors(t, [0, 1], [a, b]);
const rad = (a: number) => (a * Math.PI) / 180;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const plage = (n: number) => Array.from({ length: n }, (_, i) => i);
/** Valeur adoucie par étapes : images `t`, valeurs `v`. */
const etapes = (f: number, t: number[], v: number[]) =>
  interpolate(f, t, v, { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.sin) });
type Pt = [number, number];
const bezier = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => {
  const u = 1 - t;
  return [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * e[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * e[1],
  ];
};

/** La clé : le fil de ce chapitre. Origine au centre de l'anneau, tige vers la droite, dents vers le bas. */
const Cle: React.FC<{ x: number; y: number; s?: number; angle?: number; opacite?: number; couleur?: string }> = ({ x, y, s = 1, angle = 0, opacite = 1, couleur = F.or }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={opacite}>
    <path d="M18 -7 H116 V26 H102 V12 H92 V22 H78 V7 H18 Z" fill={couleur} stroke={F.encre} strokeWidth={3 / s} strokeLinejoin="round" />
    <circle r={26} fill={couleur} stroke={F.encre} strokeWidth={3 / s} />
    <circle r={11} fill={F.parchemin} stroke={F.encre} strokeWidth={3 / s} />
  </g>
);

const Ouverture: React.FC<PropsIllustration> = ({ f }) => {
  const niveau = 0.08 + 0.14 * p(f, 58, 110);
  const surface = 170 + 520 * (1 - niveau);
  const chute = p(f, 20, 62);
  const enfonce = p(f, 62, 100);
  const yCle = lerp(-130, 590, chute * chute) + enfonce * 140;
  return (
    <Scene>
      <Thermometre x={400} y={170} h={520} l={72} niveau={niveau} />
      <clipPath id="ch19-ouverture">
        <rect x={0} y={-300} width={800} height={surface + 300} />
      </clipPath>
      {f >= 20 && enfonce < 1 ? (
        <g clipPath="url(#ch19-ouverture)">
          <Cle x={400} y={yCle} s={0.72} angle={90} />
        </g>
      ) : null}
    </Scene>
  );
};

const Fin: React.FC<PropsIllustration> = ({ f }) => {
  const c = p(f, 55, 85);
  return (
    <Scene>
      <Thermometre x={400} y={150} h={480} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
      <line x1={170} x2={630} y1={832} y2={832} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      <Cle x={322} y={802 - (1 - c) * 50} s={1.08} opacite={c} />
    </Scene>
  );
};

const Mouton: React.FC<{ x: number; y: number; s?: number; couche?: number; phase?: number; f: number; sens?: number; opacite?: number }> = ({ x, y, s = 1, couche = 0, phase = 0, f, sens = 1, opacite = 1 }) => {
  const LAINE: [number, number, number][] = [[-30, 0, 20], [-13, -14, 22], [11, -15, 22], [30, -1, 20], [12, 11, 20], [-14, 11, 20]];
  const broute = Math.sin(f / 24 + phase) * (1 - couche);
  const pattes = 38 * (1 - couche);
  return (
    <g transform={`translate(${x} ${y}) scale(${s * sens} ${s})`} opacity={opacite}>
      {[-22, -8, 10, 24].map((px) => (
        <line key={px} x1={px} x2={px} y1={18} y2={18 + pattes} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      ))}
      <g transform={`translate(0 ${couche * 24}) scale(1 ${1 - 0.18 * couche})`}>
        <ellipse cx={50} cy={-6 + 5 * broute + couche * 16} rx={15} ry={11} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
        {LAINE.map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill={F.papier} stroke={F.encre} strokeWidth={4} />)}
        {LAINE.map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r - 1} fill={couche > 0 ? mix(couche, F.papier, F.filet) : F.papier} />)}
      </g>
    </g>
  );
};

/** Plan 2 : le troupeau, la bête ramenée à la maison, la fenêtre allumée. */
const P2: React.FC<PropsIllustration> = ({ f, d }) => {
  const TROUPEAU: [number, number, number][] = [[105, 505, 1], [255, 480, -1], [405, 515, 1], [115, 650, -1], [265, 625, 1], [415, 650, -1], [120, 775, 1], [275, 760, -1]];
  const couche = p(f, d[0] + 45, d[0] + 85);
  const trajet = p(f, d[0] + 100, d[1] - 25);
  const A: Pt = [500, 770];
  const B: Pt = [720, 790];
  const C: Pt = [730, 520];
  const E: Pt = [622, 432];
  const [mx, my] = bezier(A, B, C, E, trajet);
  const entree = p(f, d[1] - 30, d[1] - 5);
  const fenetre = p(f, d[1], d[1] + 30);
  const coeur = p(f, d[2], d[2] + 30);
  const cle = p(f, d[3] + 5, d[3] + 40);
  const or = p(f, d[3], d[3] + 50);
  const NB = 34;
  const battement = 1 + 0.06 * Math.sin(f / 9);
  return (
    <Scene>
      <path d="M20 420 Q220 370 420 400 T780 360 V850 H20 Z" fill={F.filet} opacity={0.55} />
      <path d="M20 420 Q220 370 420 400 T780 360" fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      {[[70, 455], [190, 440], [335, 445], [500, 465], [710, 450], [60, 590], [190, 575], [340, 575], [500, 580], [50, 720], [195, 710], [345, 710], [620, 700], [200, 835], [420, 830], [650, 820]].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x - 10} ${y} L${x - 14} ${y - 12} M${x} ${y} V${y - 16} M${x + 10} ${y} L${x + 14} ${y - 12}`} stroke={F.encre2} strokeWidth={3} strokeLinecap="round" />
      ))}
      {/* La maison. */}
      <rect x={672} y={150} width={36} height={82} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={510} y={240} width={224} height={182} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <path d="M484 240 L622 118 L760 240 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={592} y={330} width={60} height={92} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <circle cx={642} cy={380} r={4} fill={F.encre} />
      <circle cx={555} cy={303} r={30 + 16 * fenetre} fill={F.orClair} opacity={0.45 * fenetre} />
      <rect x={530} y={276} width={50} height={54} fill={mix(fenetre, F.encre2, F.orClair)} stroke={F.encre} strokeWidth={4} />
      <path d="M555 276 V330 M530 303 H580" stroke={F.encre} strokeWidth={3} />
      <Cle x={622} y={350} s={0.42} angle={90} opacite={cle} />
      <g transform={`translate(622 58) scale(${(0.15 + 0.85 * coeur) * battement})`} opacity={coeur}>
        <Coeur x={0} y={0} s={0.72} />
      </g>
      {/* Les bêtes du troupeau. */}
      {TROUPEAU.map(([x, y, sens], i) => <Mouton key={i} x={x} y={y} f={f} phase={i * 1.7} sens={sens} />)}
      {/* Le trait pointillé, point par point. */}
      {plage(NB).map((i) => {
        const t = (i + 0.5) / NB;
        const [x, y] = bezier(A, B, C, E, t);
        return <circle key={i} cx={x} cy={y} r={5} fill={mix(or, F.encre, F.or)} opacity={t <= trajet ? 1 : 0} />;
      })}
      <Mouton x={mx - 10 * trajet} y={my - 12 * trajet} f={f} couche={couche} s={1 - 0.45 * trajet} opacite={1 - entree} phase={3} />
    </Scene>
  );
};

const Gerbe: React.FC<{ x: number; y: number; s?: number; angle?: number; opacite?: number }> = ({ x, y, s = 1, angle = 0, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={opacite}>
    {[-3, -2, -1, 0, 1, 2, 3].map((i) => {
      const hx = i * 13;
      const hy = -172 - (3 - Math.abs(i)) * 7;
      return (
        <g key={i}>
          <path d={`M${i * 10} 0 L${i * 3} -72 L${hx} ${hy}`} fill="none" stroke={F.or} strokeWidth={5} strokeLinejoin="round" />
          <ellipse cx={hx} cy={hy - 8} rx={6.5} ry={14} transform={`rotate(${i * 6} ${hx} ${hy - 8})`} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} />
        </g>
      );
    })}
    <rect x={-25} y={-84} width={50} height={20} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
  </g>
);

/** Plan 3 : les gerbes s'inclinent, leurs brins deviennent une étoffe, l'étoffe va au creuset. */
const P3: React.FC<PropsIllustration> = ({ f, d }) => {
  const AUTOUR: [number, number, number][] = [[150, 400, 1], [650, 400, -1], [70, 590, 1], [730, 590, -1], [215, 760, 1], [585, 760, -1]];
  const dresse = p(f, d[0], d[0] + 70);
  const incline = p(f, d[1], d[1] + 70);
  const T = d[2] + 5;
  const quitte = p(f, T + 30, T + 110);
  const N = 11;
  const X0 = 200;
  const Y0 = 150;
  const PAS = 40;
  const chaine = (i: number) => p(f, T + i * 6, T + i * 6 + 75);
  const trame = (j: number) => p(f, T + 35 + j * 6, T + 35 + j * 6 + 75);
  const coeur = p(f, d[3] + 40, d[3] + 80);
  const descend = p(f, d[4] + 5, d[4] + 95);
  const creuset = p(f, d[4] - 35, d[4] + 15);
  const rouge = p(f, d[4] + 95, d[4] + 220);
  const Brin: React.FC<{ a: Pt; b: Pt; c: string }> = ({ a, b, c }) => (
    <g>
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={F.encre} strokeWidth={34} />
      <line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={c} strokeWidth={28} />
    </g>
  );
  const dessous = Y0 + (N - 1) * PAS + 20;
  const haut = Y0 - 20;
  const gauche = X0 - 20;
  const droite = X0 + (N - 1) * PAS + 20;
  const cy = (haut + dessous) / 2;
  const ty = descend * 138;
  const sc = 1 - descend * 0.36;
  return (
    <Scene>
      {quitte < 1 ? (
        <g opacity={1 - quitte}>
          <ellipse cx={400} cy={610} rx={370} ry={210} fill={F.filet} opacity={0.5} />
          {AUTOUR.map(([x, y, sens], i) => <Gerbe key={i} x={x} y={y} s={0.82} angle={sens * 30 * incline} opacite={p(f, d[0] + 25 + i * 8, d[0] + 60 + i * 8)} />)}
          <Gerbe x={400} y={640} s={0.6 + 0.85 * dresse} angle={-60 * (1 - dresse)} />
        </g>
      ) : null}
      {/* L'étoffe, tissée brin par brin. */}
      <g transform={`translate(400 ${cy + ty}) scale(${sc}) translate(-400 ${-cy})`}>
        {plage(N).map((i) => {
          const x = X0 + i * PAS;
          return chaine(i) > 0 ? <Brin key={i} a={[x, haut]} b={[x, lerp(haut, dessous, chaine(i))]} c={F.orClair} /> : null;
        })}
        {plage(N).map((j) => {
          const y = Y0 + j * PAS;
          if (trame(j) <= 0) return null;
          const depart = j % 2 === 0 ? gauche : droite;
          const arrivee = j % 2 === 0 ? droite : gauche;
          return <Brin key={j} a={[depart, y]} b={[lerp(depart, arrivee, trame(j)), y]} c={F.or} />;
        })}
        {/* Dessus-dessous : un carré sur deux, la chaîne repasse au-dessus. */}
        {plage(N).map((i) =>
          plage(N).map((j) => {
            if ((i + j) % 2 !== 0) return null;
            const x = X0 + i * PAS;
            const y = Y0 + j * PAS;
            const vue = chaine(i) >= (y + 18 - haut) / (dessous - haut) && Math.abs(lerp(j % 2 === 0 ? gauche : droite, j % 2 === 0 ? droite : gauche, trame(j)) - (j % 2 === 0 ? gauche : droite)) >= Math.abs(x - (j % 2 === 0 ? gauche : droite));
            return vue ? <Brin key={`${i}-${j}`} a={[x, y - 20]} b={[x, y + 20]} c={F.orClair} /> : null;
          }),
        )}
        <rect x={gauche - 2} y={haut - 2} width={droite - gauche + 4} height={dessous - haut + 4} fill={F.argile} opacity={0.82 * rouge} />
        {coeur > 0 ? <Coeur x={400} y={cy} s={1.5 * (0.4 + 0.6 * coeur) * (1 + 0.04 * Math.sin(f / 10))} opacite={coeur} rempli={mix(rouge, F.argile, F.orClair)} /> : null}
      </g>
      {/* Le creuset. */}
      {creuset > 0 ? (
        <g opacity={creuset} transform={`translate(0 ${(1 - creuset) * 60})`}>
          {plage(5).map((i) => {
            const x = 250 + i * 75;
            const h = 34 + 12 * Math.sin(f / 5 + i * 2) * (0.3 + rouge);
            return <path key={i} d={`M${x - 24} 880 Q${x - 14} ${880 - h * 0.6} ${x} ${880 - h} Q${x + 14} ${880 - h * 0.6} ${x + 24} 880 Z`} fill={i % 2 === 0 ? F.argile : F.or} stroke={F.encre} strokeWidth={3} />;
          })}
          <path d="M170 590 H630 L570 816 Q400 858 230 816 Z" fill={mix(rouge, F.cuir, F.argile)} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          <rect x={156} y={574} width={488} height={26} rx={10} fill={mix(rouge, F.cuirClair, F.or)} stroke={F.encre} strokeWidth={4} />
        </g>
      ) : null}
      {rouge > 0
        ? plage(9).map((i) => {
            const t = ((f + i * 23) % 90) / 90;
            return <circle key={i} cx={(i % 2 === 0 ? 150 + i * 8 : 590 + i * 8) + Math.sin(t * 7 + i) * 14} cy={566 - t * 200} r={8 - t * 4} fill={i % 2 === 0 ? F.or : F.argile} opacity={rouge * (1 - t)} />;
          })
        : null}
    </Scene>
  );
};

const Arbre: React.FC<{ x: number; y: number; s?: number; c?: number; clair?: boolean; fruits?: boolean }> = ({ x, y, s = 1, c = 1, clair = false, fruits = false }) => {
  const BOULES: [number, number, number][] = [[0, -190, 62], [-50, -150, 48], [50, -150, 48], [-26, -112, 38], [28, -112, 38]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s * c})`}>
      <path d="M-13 0 Q-8 -60 -10 -120 H10 Q8 -60 13 0 Z" fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      {BOULES.map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r} fill={F.or} stroke={F.encre} strokeWidth={4} />)}
      {BOULES.map(([a, b, r], i) => <circle key={i} cx={a} cy={b} r={r - 2} fill={clair ? F.orClair : F.or} />)}
      {fruits ? [[-36, -160], [0, -205], [38, -165], [-14, -130], [24, -122]].map(([a, b]) => <circle key={`${a}`} cx={a} cy={b} r={11} fill={F.argile} stroke={F.encre} strokeWidth={2.5} />) : null}
    </g>
  );
};

/** Plan 4 : tout s'allume, sauf une porte ; puis tout le jardin, sauf un arbre. */
const P4: React.FC<PropsIllustration> = ({ f, d }) => {
  const FENETRES: Pt[] = [
    [160, 310], [293, 310], [427, 310], [560, 310],
    [160, 440], [293, 440], [427, 440], [560, 440],
    [150, 600], [245, 600], [475, 600], [570, 600],
  ];
  const bascule = p(f, d[3] - 25, d[3] + 10);
  const barre = p(f, d[1] + 5, d[1] + 40);
  const cleVue = p(f, d[0] + 20, d[0] + 60);
  const aller = etapes(f, [d[2] + 15, d[2] + 85, d[2] + 120, d[2] + 190], [0, 1, 1, 0]);
  const yCle = lerp(190, 528, aller);
  const JARDIN: Pt[] = [[130, 250], [400, 240], [670, 250], [112, 545], [688, 545], [130, 850], [400, 862], [670, 850]];
  const cercle = p(f, d[3] + 75, d[3] + 125);
  const R = 172;
  const tour = 2 * Math.PI * R;
  const pulse = 1 + 0.015 * Math.sin(f / 12);
  return (
    <Scene>
      {bascule < 1 ? (
        <g opacity={1 - bascule}>
          <line x1={40} x2={760} y1={790} y2={790} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
          <rect x={120} y={270} width={560} height={520} fill={F.papier} stroke={F.encre} strokeWidth={5} />
          <path d="M84 270 L400 84 L716 270 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          {FENETRES.map(([x, y], i) => {
            const a = d[0] + 15 + (i * (d[1] - d[0] - 60)) / FENETRES.length;
            const o = p(f, a, a + 18);
            return (
              <g key={i}>
                <rect x={x - 8} y={y - 8} width={96} height={96} rx={6} fill={F.orClair} opacity={0.4 * o} />
                <rect x={x} y={y} width={80} height={80} fill={mix(o, F.encre2, F.orClair)} stroke={F.encre} strokeWidth={4} />
                <path d={`M${x + 40} ${y} V${y + 80} M${x} ${y + 40} H${x + 80}`} stroke={F.encre} strokeWidth={3} />
              </g>
            );
          })}
          <rect x={355} y={624} width={90} height={166} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          {[385, 415].map((x) => <line key={x} x1={x} x2={x} y1={628} y2={788} stroke={F.encre} strokeWidth={2.5} />)}
          <circle cx={432} cy={710} r={5} fill={F.encre} />
          <line x1={345} y1={640} x2={345 + 110 * barre} y2={640 + 136 * barre} stroke={F.argile} strokeWidth={14} strokeLinecap="round" opacity={barre > 0 ? 1 : 0} />
          <Cle x={400} y={yCle} s={0.68} angle={90} opacite={cleVue} />
        </g>
      ) : null}
      {bascule > 0 ? (
        <g opacity={bascule}>
          <rect x={22} y={40} width={756} height={840} rx={36} fill={F.filet} opacity={0.4} />
          {JARDIN.map(([x, y], i) => <Arbre key={i} x={x} y={y} s={0.76} c={p(f, d[3] - 10 + i * 8, d[3] + 25 + i * 8)} />)}
          <Arbre x={400} y={600} s={1} c={p(f, d[3] + 20, d[3] + 65) * pulse} clair fruits />
          <circle cx={400} cy={468} r={R} fill="none" stroke={F.argile} strokeWidth={10} strokeLinecap="round" strokeDasharray={`${tour * cercle} ${tour}`} transform="rotate(-90 400 468)" opacity={cercle > 0 ? 1 : 0} />
        </g>
      ) : null}
    </Scene>
  );
};

/** Plan 5 : d'abord le poids qui fait descendre ; puis la clé qui passe de porte en porte. */
const P5: React.FC<PropsIllustration> = ({ f, d }) => {
  const X = [60, 174, 304, 448, 608];
  const W = [92, 108, 122, 138, 156];
  const H = [170, 215, 265, 320, 380];
  const B = [810, 745, 680, 610, 530];
  const poignee = (i: number): Pt => [X[i] + W[i] * 0.85 - 74, B[i] - H[i] * 0.45];
  const ouvre = (i: number) => p(f, d[i + 1] + 12, d[i + 1] + 50);
  const rayons = p(f, d[5] + 35, d[5] + 90);
  // La pierre tombe sur la clé, tout dégringole de marche en marche.
  const tombe = p(f, d[0] + 90, d[0] + 135);
  const debutDesc = d[0] + 155;
  const finDesc = d[1] - 40;
  const pasDesc = (finDesc - debutDesc) / 4;
  const pos = (i: number): Pt => [X[i] + W[i] / 2, B[i]];
  let sx = pos(4)[0];
  let sy = pos(4)[1];
  for (let k = 0; k < 4; k++) {
    const t = p(f, debutDesc + k * pasDesc, debutDesc + (k + 0.8) * pasDesc);
    if (t > 0) {
      const a = pos(4 - k);
      const b = pos(3 - k);
      sx = lerp(a[0], b[0], t);
      sy = lerp(a[1], b[1], t) - Math.sin(t * Math.PI) * 46;
    }
  }
  const pierreO = (1 - p(f, d[1] - 25, d[1])) * p(f, d[0] + 88, d[0] + 100);
  const yPierre = lerp(44, sy - 62, tombe);
  const cleVue = p(f, d[0] + 10, d[0] + 40);
  // Position de la clé.
  let cx = sx - 30;
  let cy = sy - 18;
  if (f < d[0] + 90) {
    cx = sx - 30;
    cy = sy - 18;
  }
  if (f >= d[1] - 5) {
    let q = poignee(0);
    for (let i = 1; i < 5; i++) {
      const t = p(f, d[i + 1] - 28, d[i + 1] + 4);
      if (t > 0) {
        const a = poignee(i - 1);
        const b = poignee(i);
        q = [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
      }
    }
    const v = p(f, d[1] - 5, d[1] + 15);
    cx = lerp(sx - 30, q[0], v);
    cy = lerp(sy - 18, q[1], v);
  }
  const tour = plage(5).reduce((s, i) => s + (f >= d[i + 1] && f < d[i + 1] + 30 ? Math.sin(((f - d[i + 1]) / 30) * Math.PI) * -24 : 0), 0);
  return (
    <Scene>
      {/* L'escalier. */}
      {plage(5).map((i) => (
        <rect key={i} x={X[i] - 11} y={B[i]} width={W[i] + 22} height={868 - B[i]} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      ))}
      {/* Les rayons derrière la dernière porte. */}
      {rayons > 0
        ? [-165, -140, -115, -90, -65, -45].map((deg) => {
            const a = rad(deg);
            const cxp = X[4] + W[4] / 2;
            const cyp = B[4] - H[4] + 90;
            const r0 = 124;
            const rMax = Math.min(186, deg > -60 ? 148 : 186);
            const r1 = lerp(r0, rMax, rayons);
            return <line key={deg} x1={cxp + Math.cos(a) * r0} y1={cyp + Math.sin(a) * r0} x2={cxp + Math.cos(a) * r1} y2={cyp + Math.sin(a) * r1} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={rayons} />;
          })
        : null}
      {plage(5).map((i) => {
        const o = ouvre(i);
        const haut = B[i] - H[i];
        const fin = X[i] + W[i] * (1 - 0.8 * o);
        const lumiere = i === 4 ? F.papier : F.orClair;
        const gliss = 14 * o;
        return (
          <g key={i}>
            <rect x={X[i]} y={haut} width={W[i]} height={H[i]} fill={o > 0 ? mix(o, F.encre2, lumiere) : F.encre2} stroke={F.encre} strokeWidth={5} />
            {i === 4 && rayons > 0 ? <rect x={X[i] + 4} y={haut + 4} width={W[i] - 8} height={H[i] - 8} fill={F.orClair} opacity={0.75 * rayons} /> : null}
            <path d={`M${X[i]} ${haut} L${fin} ${haut + gliss} V${B[i] - gliss} L${X[i]} ${B[i]} Z`} fill={i === 4 ? F.cuirClair : F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <circle cx={lerp(X[i] + W[i] - 14, X[i] + W[i] * 0.2 - 4, o)} cy={B[i] - H[i] * 0.45} r={5} fill={F.orClair} stroke={F.encre} strokeWidth={2} />
            <Libelle x={X[i] + W[i]} y={i === 4 ? 50 : haut - 14} taille={23} ancre="end" graisse={600} opacite={p(f, d[i + 1], d[i + 1] + 18)}>
              {LIBELLES.portes[i]}
            </Libelle>
          </g>
        );
      })}
      <Cle x={cx} y={cy} s={0.58} angle={tour} opacite={cleVue} />
      {pierreO > 0 ? (
        <g opacity={pierreO}>
          <path d={`M${sx - 72} ${yPierre + 34} Q${sx - 80} ${yPierre - 30} ${sx - 40} ${yPierre - 36} H${sx + 46} Q${sx + 82} ${yPierre - 26} ${sx + 72} ${yPierre + 34} Z`} fill={F.encre2} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <Libelle x={sx} y={yPierre + 8} taille={25} couleur={F.papier} graisse={600}>{LIBELLES.orgueil}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/** Plan 6 : le coffre sur la poutre qui ploie ; sept pierres la redressent. */
const P6: React.FC<PropsIllustration> = ({ f, d }) => {
  const HP = 75;
  const SOL = 860;
  const fleche = 112 * p(f, 0, d[0] + 40) - 40 * p(f, d[5] - 12, d[5] + 12) - 72 * p(f, d[6] - 8, d[6] + 30);
  const fente = p(f, d[0] + 15, d[0] + 60) * (1 - p(f, d[6], d[6] + 30));
  const lumiere = p(f, d[6] + 30, d[6] + 70);
  const haut = 300;
  const y = haut + fleche;
  const cxBas = haut + 36 + 2 * fleche;
  const CHOCS = d.map((a) => Math.max(0, 1 - Math.abs(f - a - 14) / 8));
  const choc = Math.max(...CHOCS) * 4;
  return (
    <Scene>
      <line x1={30} x2={770} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      {[90, 670].map((x) => (
        <g key={x}>
          <rect x={x} y={336} width={40} height={SOL - 336} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          <line x1={x + 20} x2={x + 20} y1={350} y2={SOL - 12} stroke={F.cuir} strokeWidth={2.5} />
        </g>
      ))}
      {/* Les sept pierres. */}
      {LIBELLES.pierres.map((m, i) => {
        const a = d[i];
        const o = p(f, a, a + 14);
        const decal = [-10, 12, -6, 14, -14, 8, -4][i];
        const sy = SOL - HP * (i + 1);
        const cote = i === 6 ? (1 - o) * 70 : 0;
        const tomb = i === 6 ? 0 : (1 - o) * -36;
        const X = 400 + decal + cote;
        return (
          <g key={m} opacity={o} transform={`translate(0 ${tomb})`}>
            <path d={`M${X - 128} ${sy + 8} Q${X - 130} ${sy} ${X - 118} ${sy + 1} H${X + 118} Q${X + 130} ${sy} ${X + 128} ${sy + 8} V${sy + HP - 8} Q${X + 130} ${sy + HP} ${X + 118} ${sy + HP} H${X - 118} Q${X - 130} ${sy + HP} ${X - 128} ${sy + HP - 8} Z`} fill={f < a + 90 ? mix(p(f, a + 40, a + 90), F.orClair, F.papier) : F.papier} stroke={F.encre} strokeWidth={4} />
            <Libelle x={X} y={sy + HP / 2 + 9} taille={26} graisse={600}>{m}</Libelle>
          </g>
        );
      })}
      {/* La poutre. */}
      <path d={`M64 ${haut} Q400 ${haut + 2 * fleche} 736 ${haut} V${haut + 36} Q400 ${cxBas} 64 ${haut + 36} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" transform={`translate(0 ${-choc})`} />
      <path d={`M372 ${y + 37} L392 ${y + 22} L380 ${y + 12} L402 ${y + 3} L424 ${y + 14} L412 ${y + 24} L432 ${y + 37} Z`} fill={F.parchemin} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" opacity={fente} />
      {plage(5).map((i) => {
        const t = p(f, d[0] + 25 + i * 14, d[0] + 70 + i * 14);
        return t > 0 && t < 1 ? <rect key={i} x={382 + i * 10} y={y + 40 + t * 120} width={9} height={9} fill={F.cuir} transform={`rotate(${i * 40 + t * 120} ${386 + i * 10} ${y + 44 + t * 120})`} opacity={1 - t} /> : null;
      })}
      {/* Le coffre. */}
      <g transform={`translate(400 ${y + 1 - choc})`}>
        {lumiere > 0
          ? plage(9).map((i) => {
              const a = rad(-160 + i * 17.5);
              return <line key={i} x1={Math.cos(a) * 158} y1={-110 + Math.sin(a) * 94} x2={Math.cos(a) * (158 + 38 * lumiere)} y2={-110 + Math.sin(a) * (94 + 38 * lumiere)} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={lumiere} />;
            })
          : null}
        <rect x={-110} y={-96} width={220} height={96} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <path d="M-110 -96 Q0 -196 110 -96 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        {[-70, 70].map((x) => <line key={x} x1={x} x2={x} y1={-96} y2={0} stroke={F.orFonce} strokeWidth={8} />)}
        <rect x={-20} y={-112} width={40} height={46} rx={4} fill={F.or} stroke={F.encre} strokeWidth={4} />
        <circle cx={0} cy={-90} r={6} fill={F.encre} />
      </g>
    </Scene>
  );
};

/** Plan 7 : l'étiquette tombe sur le livre fermé, rebondit, remonte vers le rayon. */
const P7: React.FC<PropsIllustration> = ({ f, d }) => {
  const ray = p(f, d[0], d[0] + 60);
  const fort = p(f, d[3], d[3] + 70);
  const sangle = p(f, d[2] + 20, d[2] + 60);
  const PAS = (d[2] - d[1] - 90) / 5;
  const debut = (i: number) => d[1] + 12 + i * PAS;
  const impact = LIBELLES.connaissances.reduce((s, _, i) => s + Math.max(0, 1 - Math.abs(f - debut(i) - 42) / 7), 0);
  const creux = impact * 7;
  const h = 660 * ray;
  const demi = 74 + 48 * fort;
  return (
    <Scene>
      {/* Le rayon de lumière, sans source visible. */}
      <linearGradient id="ch19-rayon" x1={0} y1={0} x2={0} y2={1}>
        <stop offset="0%" stopColor={F.orClair} stopOpacity={0} />
        <stop offset="22%" stopColor={F.orClair} stopOpacity={1} />
        <stop offset="100%" stopColor={F.orClair} stopOpacity={1} />
      </linearGradient>
      <path d={`M${400 - 34 - 22 * fort} 0 H${400 + 34 + 22 * fort} L${400 + demi + 70} ${h} H${400 - demi - 70} Z`} fill="url(#ch19-rayon)" opacity={(0.42 + 0.4 * fort) * ray} />
      {/* Le livre fermé, posé à plat. */}
      <g transform={`translate(0 ${creux})`}>
        <path d="M112 790 L686 790 L686 826 L112 826 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} />
        {[800, 809, 818].map((y) => <line key={y} x1={124} x2={680} y1={y} y2={y} stroke={F.filet} strokeWidth={3} />)}
        <path d="M112 826 H690 V840 H100 Q88 808 112 790 L196 640 H600 L686 790 H112" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M196 640 H600 L686 790 H112 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M216 656 H584 L650 776 H148 Z" fill="none" stroke={F.orClair} strokeWidth={3} />
        {[[300, 500, 690], [330, 470, 722]].map(([a, b, y]) => <line key={y} x1={a} x2={b} y1={y} y2={y} stroke={F.orClair} strokeWidth={6} strokeLinecap="round" />)}
        {/* La sangle : le livre reste fermé. */}
        <g opacity={sangle} transform={`translate(0 ${(1 - sangle) * -30})`}>
          <path d="M372 640 H428 L442 790 V840 H358 V790 Z" fill={F.argile} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <rect x={366} y={690} width={68} height={50} rx={6} fill={F.or} stroke={F.encre} strokeWidth={4} />
          <rect x={382} y={704} width={36} height={22} rx={3} fill={F.argile} stroke={F.encre} strokeWidth={3} />
        </g>
      </g>
      {/* Les étiquettes. */}
      {LIBELLES.connaissances.map((m, i) => {
        const a = debut(i);
        const L = m.length * 12.6 + 62;
        const desc = interpolate(f, [a, a + 42], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        const montee = p(f, a + 44, a + 100);
        const yCible = 56 + i * 68;
        const xDepart = i === 0 ? 180 : i % 2 === 0 ? 112 : 690;
        const glisse = p(f, a + 28, a + 42);
        const yDesc = lerp(40, 610, desc);
        const y = montee > 0 ? lerp(610, yCible, montee) : yDesc;
        const x = montee > 0 ? 400 : lerp(xDepart, 400, glisse);
        const o = p(f, a - 6, a + 8);
        const sq = 1 - 0.12 * Math.max(0, 1 - Math.abs(f - a - 42) / 7);
        const marque = i === 2 ? p(f, d[2], d[2] + 25) : 0;
        const dore = fort;
        return (
          <g key={m} opacity={o} transform={`translate(${x} ${y}) scale(${1 / sq} ${sq})`}>
            <rect x={-L / 2} y={-27} width={L} height={54} rx={10} fill={mix(Math.max(marque, dore), F.papier, F.orClair)} stroke={marque > 0 ? F.argile : F.encre} strokeWidth={marque > 0 ? 4 : 3} />
            <circle cx={-L / 2 + 17} r={6} fill={F.parchemin} stroke={F.encre} strokeWidth={2.5} />
            <Libelle x={12} y={9} taille={25} graisse={600}>{m}</Libelle>
          </g>
        );
      })}
    </Scene>
  );
};

const Piment: React.FC<{ x: number; y: number; angle?: number; o?: number }> = ({ x, y, angle = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={o}>
    <path d="M-30 -2 Q-32 -14 -18 -14 C6 -14 26 -2 40 24 C20 10 2 8 -18 8 Q-30 8 -30 -2 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <path d="M-18 -6 C2 -6 16 0 26 10" fill="none" stroke={F.orClair} strokeWidth={3} strokeLinecap="round" opacity={0.75} />
    <path d="M-30 -8 Q-36 -6 -34 3 Q-29 8 -24 7 Q-26 -2 -22 -13 Q-28 -14 -30 -8 Z" fill={F.cuir} stroke={F.encre} strokeWidth={2.5} strokeLinejoin="round" />
    <path d="M-33 -3 Q-44 -6 -48 -18" fill="none" stroke={F.cuir} strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** Plan 8 : le cadran tourne, le tas monte, le dernier panier arrive trop tard. */
const P8: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const CX = 400;
  const CY = 212;
  const R = 172;
  const angle = etapes(f, [0, d[1] - 40, d[1] + 110, d[2], duree - 30], [-135, 62, 112, 112, 112 + 360]);
  const secteur = (a0: number, a1: number, r: number) => {
    const a = rad(a0 - 90);
    const b = rad(a1 - 90);
    return `M${CX} ${CY} L${CX + r * Math.cos(a)} ${CY + r * Math.sin(a)} A${r} ${r} 0 0 1 ${CX + r * Math.cos(b)} ${CY + r * Math.sin(b)} Z`;
  };
  const pulse = p(f, d[2], d[2] + 50);
  const LIGNES = [6, 5, 4, 3, 2, 1];
  const tas: { x: number; y: number; a: number }[] = [];
  LIGNES.forEach((n, l) => plage(n).forEach((i) => tas.push({ x: 344 + (i - (n - 1) / 2) * 62, y: 772 - l * 38, a: ((tas.length * 47) % 36) - 22 })));
  const panier = p(f, d[1] + 95, d[1] + 170);
  const dansZone = angle > -50 && angle < 50;
  const pasTas = (d[1] - 50 - d[0]) / tas.length;
  return (
    <Scene>
      {/* Le cadran. */}
      <circle cx={CX} cy={CY} r={R + 10} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <path d={secteur(-50, 50, R)} fill={F.orClair} stroke={F.or} strokeWidth={3} opacity={0.8 + 0.2 * (dansZone ? 1 : pulse)} />
      {plage(12).map((i) => {
        const a = rad(i * 30);
        return <line key={i} x1={CX + Math.cos(a) * (R - 16)} y1={CY + Math.sin(a) * (R - 16)} x2={CX + Math.cos(a) * R} y2={CY + Math.sin(a) * R} stroke={F.encre2} strokeWidth={i % 3 === 0 ? 6 : 3} />;
      })}
      <g transform={`rotate(${angle} ${CX} ${CY})`}>
        <path d={`M${CX - 9} ${CY} L${CX} ${CY - R + 22} L${CX + 9} ${CY} Z`} fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      </g>
      <circle cx={CX} cy={CY} r={15} fill={F.or} stroke={F.encre} strokeWidth={4} />
      {/* L'étal. */}
      <line x1={30} x2={770} y1={872} y2={872} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      {[150, 510].map((x) => <rect key={x} x={x} y={810} width={22} height={62} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />)}
      <rect x={118} y={796} width={444} height={22} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {tas.map((t, i) => {
        const a = d[0] + 10 + i * pasTas;
        const o = p(f, a, a + 14);
        return <Piment key={i} x={t.x} y={t.y - (1 - o) * 50} angle={t.a} o={o} />;
      })}
      {/* Le dernier panier, à côté du tas. */}
      <g opacity={panier} transform={`translate(${lerp(765, 672, panier)} 872)`}>
        {[[-30, -94, -20], [26, -94, 16], [-2, -112, -8]].map(([x, y, a], i) => <Piment key={i} x={x} y={y} angle={a} />)}
        <path d="M-74 -88 H74 L54 0 H-54 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {[-58, -38].map((y) => <line key={y} x1={-68 + (-88 - y) * -0.22} x2={68 - (-88 - y) * -0.22} y1={y} y2={y} stroke={F.cuir} strokeWidth={3} />)}
        {[-40, 0, 40].map((x) => <line key={x} x1={x} x2={x * 0.75} y1={-86} y2={-2} stroke={F.cuir} strokeWidth={3} />)}
      </g>
    </Scene>
  );
};

const Truelle: React.FC<{ x: number; y: number; angle?: number }> = ({ x, y, angle = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M12 -28 L52 -66" stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
    <rect x={44} y={-92} width={70} height={24} rx={11} transform="rotate(-20 44 -92)" fill={F.cuir} stroke={F.encre} strokeWidth={3} />
    <path d="M-72 0 L14 -34 L14 22 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** Plan 9 : la longue-vue trouve la fissure ; le mot s'y inscrit ; la truelle la comble. */
const P9: React.FC<PropsIllustration> = ({ f, d }) => {
  const HT = 50;
  const HR = 59;
  const NR = 10;
  const XS = [418, 388, 432, 398, 442, 404, 456, 420, 470, 440, 482];
  const CRX = 432;
  const CRY = 345;
  const trouve = d[0] + 265;
  const sx = etapes(f, [d[0], d[0] + 85, d[0] + 170, trouve], [160, 640, 220, CRX]);
  const sy = etapes(f, [d[0], d[0] + 85, d[0] + 170, trouve], [170, 500, 470, CRY]);
  const elargit = p(f, trouve + 45, trouve + 110);
  const rs = 95 + elargit * 520;
  const voile = 1 - elargit;
  const ecrit = p(f, d[1] - 125, d[1] - 60);
  const debutFill = d[1] + 20;
  const finFill = d[2] + 110;
  const pasFill = (finFill - debutFill) / NR;
  const rempli = (k: number) => p(f, debutFill + (NR - 1 - k) * pasFill, debutFill + (NR - k) * pasFill);
  const PX = 170;
  const PY = 772;
  const angle = Math.atan2(sy - PY, sx - PX);
  const bout: Pt = [PX + Math.cos(angle) * 120, PY + Math.sin(angle) * 120];
  const auge = p(f, d[1] - 20, d[1] + 10);
  const actif = f >= debutFill && f < finFill;
  const rang = Math.min(NR - 1, Math.max(0, NR - 1 - Math.floor((f - debutFill) / pasFill)));
  const tRang = (f - debutFill) / pasFill - Math.floor((f - debutFill) / pasFill);
  const xT = (XS[rang] + XS[rang + 1]) / 2 + Math.sin(tRang * Math.PI * 2) * 34 + 50;
  const yT = HT + (rang + 0.5) * HR;
  const repos: Pt = [670, 760];
  const v1 = p(f, d[1] - 5, debutFill);
  const v2 = p(f, finFill, finFill + 40);
  const tx = actif ? xT : f < debutFill ? lerp(repos[0], (XS[NR - 1] + XS[NR]) / 2 + 50, v1) : lerp((XS[0] + XS[1]) / 2 + 50, repos[0], v2);
  const ty = actif ? yT : f < debutFill ? lerp(repos[1], HT + (NR - 0.5) * HR, v1) : lerp(HT + 0.5 * HR, repos[1], v2);
  const w = 16;
  const Lab = LIBELLES.travail;
  return (
    <Scene>
      {/* Le mur. */}
      <mask id="ch19-p9">
        <rect x={0} y={0} width={800} height={900} fill="white" />
        <circle cx={sx} cy={sy} r={rs} fill="black" />
      </mask>
      <rect x={40} y={HT} width={720} height={NR * HR} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      {plage(NR).map((r) => (
        <g key={r}>
          {r > 0 ? <line x1={40} x2={760} y1={HT + r * HR} y2={HT + r * HR} stroke={F.filet} strokeWidth={4} /> : null}
          {plage(8).map((c) => {
            const x = 40 + (r % 2 === 0 ? 60 : 120) + c * 120;
            return x < 760 ? <line key={c} x1={x} x2={x} y1={HT + r * HR} y2={HT + (r + 1) * HR} stroke={F.filet} strokeWidth={4} /> : null;
          })}
        </g>
      ))}
      {plage(NR).map((k) => {
        const yA = HT + k * HR;
        const yB = yA + HR;
        const r = rempli(k);
        return <path key={k} d={`M${XS[k] - w / 2} ${yA} L${XS[k] + w / 2} ${yA} L${XS[k + 1] + w / 2} ${yB} L${XS[k + 1] - w / 2} ${yB} Z`} fill={mix(r, F.encre, F.orClair)} stroke={r > 0 ? mix(r, F.encre, F.orFonce) : F.encre} strokeWidth={2} />;
      })}
      {voile > 0 ? <rect x={40} y={HT} width={720} height={NR * HR} fill={F.encre} opacity={0.82 * voile} mask="url(#ch19-p9)" /> : null}
      {voile > 0 ? <circle cx={sx} cy={sy} r={rs} fill="none" stroke={F.or} strokeWidth={7} opacity={voile} /> : null}
      <g opacity={auge}>
        <Truelle x={tx} y={ty} angle={actif ? -8 : 0} />
      </g>
      {/* Le mot sur la fissure. */}
      {ecrit > 0 ? (
        <g>
          <clipPath id="ch19-p9-mot">
            <rect x={CRX - 138} y={CRY - 50} width={276 * ecrit} height={100} />
          </clipPath>
          <g clipPath="url(#ch19-p9-mot)">
            <rect x={CRX - 132} y={CRY - 40} width={264} height={80} rx={8} fill={F.parchemin} stroke={F.argile} strokeWidth={5} />
            <Libelle x={CRX} y={CRY + 15} taille={42} graisse={600} couleur={F.argile}>{Lab}</Libelle>
          </g>
        </g>
      ) : null}
      {/* La longue-vue. */}
      <path d={`M${PX} ${PY} L95 868 M${PX} ${PY} L${PX} 868 M${PX} ${PY} L245 868`} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
      <g transform={`translate(${PX} ${PY}) rotate(${(angle * 180) / Math.PI})`}>
        <rect x={-58} y={-17} width={84} height={34} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={26} y={-23} width={68} height={46} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={92} y={-29} width={28} height={58} rx={5} fill={F.or} stroke={F.encre} strokeWidth={4} />
      </g>
      <circle cx={PX} cy={PY} r={9} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      {voile > 0
        ? [-1, 1].map((s) => {
            const a = angle + (s * Math.PI) / 2;
            return <line key={s} x1={bout[0]} y1={bout[1]} x2={sx + Math.cos(a) * rs * 0.95} y2={sy + Math.sin(a) * rs * 0.95} stroke={F.or} strokeWidth={3} strokeDasharray="6 12" opacity={voile * 0.9} />;
          })
        : null}
      {/* L'auge et la truelle. */}
      <g opacity={auge}>
        <path d="M570 800 H770 L745 868 H595 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={670} cy={802} rx={96} ry={14} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      </g>
    </Scene>
  );
};

const Silo: React.FC<{ x: number; y: number; ouvert: number; plein: number; id: string }> = ({ x, y, ouvert, plein, id }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-48 0 V-72 Q-48 -130 0 -130 Q48 -130 48 -72 V0 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <clipPath id={id}>
      <path d="M-30 -8 V-74 Q-30 -106 0 -106 Q30 -106 30 -74 V-8 Z" />
    </clipPath>
    <path d="M-30 -8 V-74 Q-30 -106 0 -106 Q30 -106 30 -74 V-8 Z" fill={F.encre2} stroke={F.encre} strokeWidth={3} />
    <g clipPath={`url(#${id})`}>
      <path d={`M-32 -6 V${-8 - 92 * plein} Q0 ${-8 - 92 * plein - 16} 32 ${-8 - 92 * plein} V-6 Z`} fill={F.or} />
      {plein > 0 ? plage(8).map((i) => <circle key={i} cx={-22 + (i % 4) * 15} cy={-16 - Math.floor(i / 4) * 16} r={2.5} fill={F.orFonce} opacity={plein > 0.25 + i * 0.05 ? 1 : 0} />) : null}
    </g>
    <g transform={`translate(-30 0) scale(${Math.max(0.02, 1 - ouvert * 0.9)} 1) translate(30 0)`}>
      <path d="M-30 -8 V-74 Q-30 -106 0 -106 Q30 -106 30 -74 V-8 Z" fill={F.cuir} stroke={F.encre} strokeWidth={3} />
    </g>
  </g>
);

/** Plan 10 : le trait parcourt la carte ; à chaque étape, un grenier s'ouvre et se remplit. */
const P10: React.FC<PropsIllustration> = ({ f, d }) => {
  const SILOS: Pt[] = [[200, 806], [590, 746], [210, 566], [590, 496], [210, 316], [590, 246]];
  const SEG: [Pt, Pt, Pt, Pt][] = [
    [[92, 838], [125, 840], [160, 825], [200, 820]],
    [[200, 820], [340, 850], [460, 800], [590, 760]],
    [[590, 760], [480, 775], [400, 670], [210, 580]],
    [[210, 580], [330, 600], [470, 530], [590, 510]],
    [[590, 510], [500, 520], [340, 390], [210, 330]],
    [[210, 330], [330, 345], [470, 275], [590, 260]],
  ];
  const ARRIVEES = [d[0] + 60, d[1] + 95, d[2] + 15, d[2] + 150, d[3] + 75, d[3] + 200];
  const DEPARTS = [d[0], ARRIVEES[0] + 55, ARRIVEES[1] + 70, ARRIVEES[2] + 65, ARRIVEES[3] + 60, ARRIVEES[4] + 60];
  const seg = SEG.map((_, i) => p(f, DEPARTS[i], ARRIVEES[i]));
  const courant = seg.reduce((c, s, i) => (s > 0 ? i : c), 0);
  const pos = bezier(...SEG[courant], seg[courant]);
  const carte = p(f, 0, 26);
  return (
    <Scene>
      <g opacity={carte}>
        <rect x={40} y={36} width={720} height={836} rx={10} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        <path d="M280 36 V872 M520 36 V872" stroke={F.filet} strokeWidth={2} />
        <path d="M322 62 Q420 54 520 72 Q690 96 716 196 Q738 330 690 430 Q720 610 680 736 Q600 856 402 852 Q160 860 84 792 Q60 640 110 520 Q70 340 112 214 Q154 92 322 62 Z" fill={F.filet} opacity={0.7} stroke={F.encre2} strokeWidth={3} />
        <path d="M402 852 Q452 700 388 560 Q330 420 412 300 Q452 200 408 60" fill="none" stroke={F.papier} strokeWidth={16} strokeLinecap="round" />
      </g>
      {SILOS.map(([x, y], i) => {
        const a = ARRIVEES[i];
        return <Silo key={i} id={`ch19-silo-${i}`} x={x} y={y} ouvert={p(f, a - 2, a + 24)} plein={p(f, a + 18, a + 62)} />;
      })}
      {SEG.map((S, i) => {
        const n = Math.round(Math.hypot(S[3][0] - S[0][0], S[3][1] - S[0][1]) / 22) + 2;
        return plage(n).map((k) => {
          const t = (k + 0.5) / n;
          const q = bezier(S[0], S[1], S[2], S[3], t);
          return <circle key={`${i}-${k}`} cx={q[0]} cy={q[1]} r={4.5} fill={F.argile} opacity={seg[i] >= t ? 1 : 0} />;
        });
      })}
      <circle cx={pos[0]} cy={pos[1]} r={13} fill={F.or} stroke={F.encre} strokeWidth={4} opacity={carte} />
    </Scene>
  );
};

/** Plan 11 : l'immeuble en coupe ; un jeton s'assied en haut, l'autre monte d'étage en étage. */
const P11: React.FC<PropsIllustration> = ({ f, d }) => {
  const XG = 130;
  const XD = 670;
  const H = 80;
  const YT = 110;
  const yEtage = (l: number) => YT + (8 - l) * H;
  const SOL = yEtage(0) + H;
  const XC = 636;
  const yJ = (l: number) => yEtage(l) + H - 28;
  const PAS = (d[4] - d[3] - 40) / 8;
  const etape = (l: number) => d[3] + 8 + l * PAS;
  // Le premier fils : il monte tout droit au dernier étage.
  const a1 = p(f, d[1] + 10, d[1] + 80);
  const a2 = p(f, d[1] + 80, d[1] + 135);
  const ax = a2 > 0 ? lerp(46, 315, a2) : 46;
  const ay = lerp(SOL - 28, yJ(8), a1);
  const bureau = p(f, d[1] + 110, d[1] + 150);
  const eteint = p(f, d[5] + 10, d[5] + 60);
  // Le second : tout en bas, puis étage par étage.
  const b1 = p(f, d[2] + 10, d[2] + 100);
  let bx = lerp(100, XC, b1);
  let by = SOL - 28;
  if (b1 >= 1) {
    bx = XC;
    let pos = 0;
    for (let l = 0; l < 7; l++) pos += p(f, etape(l + 1) - 26, etape(l + 1));
    by = lerp(yJ(0), yJ(7), pos / 7);
  }
  const haut = p(f, d[4] + 10, d[4] + 60);
  const fini = p(f, d[4] + 60, d[4] + 105);
  if (haut > 0) by = lerp(yJ(7), yJ(8), haut);
  const toit = p(f, d[4] + 95, d[4] + 135);
  if (fini > 0) {
    bx = lerp(XC, 400, fini);
    by = lerp(yJ(8), 76, fini);
  }
  const vagueBas = (l: number) => p(f, d[6] + 10 + l * 11, d[6] + 28 + l * 11) * (1 - p(f, d[6] + 60 + l * 11, d[6] + 90 + l * 11));
  const debutToit = 0.2 + 0.8 * toit;
  return (
    <Scene>
      <line x1={20} x2={780} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      {/* Les rayons du toit. */}
      {toit > 0
        ? [[176, 58, 140, 30], [224, 34, 196, 8], [576, 34, 604, 8], [624, 58, 660, 30]].map(([a, b, c, e], i) => (
            <line key={i} x1={a} y1={b} x2={lerp(a, c, toit)} y2={lerp(b, e, toit)} stroke={F.or} strokeWidth={6} strokeLinecap="round" />
          ))
        : null}
      <path d={`M${XG - 26} ${YT} L400 22 L${XD + 26} ${YT} Z`} fill={toit > 0 ? mix(toit, F.cuir, F.orClair) : F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {plage(9).map((l) => {
        const y = yEtage(l);
        const allume = l < 8 ? p(f, etape(l) - 4, etape(l) + 16) : 0;
        const fond = l === 8 ? mix(bureau * (1 - eteint * 0.7), F.papier, F.orClair) : F.papier;
        return (
          <g key={l}>
            <rect x={XG} y={y} width={XD - XG} height={H} fill={fond} stroke={F.encre} strokeWidth={4} />
            {l < 8 ? <rect x={XG + 3} y={y + 3} width={XD - XG - 6} height={H - 6} fill={F.orClair} opacity={0.7 * allume * (0.55 + 0.45 * vagueBas(l)) + 0.3 * vagueBas(l)} /> : null}
            {l < 8 ? (
              <g>
                {[390, 470].map((x) => <rect key={x} x={x} y={y + 18} width={46} height={44} fill={allume > 0 ? mix(allume, F.filet, F.or) : F.filet} stroke={F.encre} strokeWidth={3} />)}
                <Libelle x={XG + 34} y={y + 50} taille={29} ancre="start" graisse={600} opacite={allume}>{LIBELLES.etages[l]}</Libelle>
              </g>
            ) : null}
          </g>
        );
      })}
      {/* La cage d'escalier. */}
      <rect x={XC - 34} y={YT + 2} width={68} height={SOL - YT - 4} fill={F.parchemin} stroke={F.encre2} strokeWidth={3} />
      {plage(44).map((i) => <line key={i} x1={XC - 24} x2={XC + 24} y1={YT + 10 + i * 16} y2={YT + 10 + i * 16} stroke={F.filet} strokeWidth={3} />)}
      {/* Le grand bureau du dernier étage. */}
      <rect x={210} y={yEtage(8) + 52} width={210} height={14} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      {[226, 392].map((x) => <rect key={x} x={x} y={yEtage(8) + 66} width={12} height={12} fill={F.cuirClair} stroke={F.encre} strokeWidth={2} />)}
      {toit > 0 ? <circle cx={400} cy={76} r={40 * debutToit} fill={F.papier} opacity={0.5 * toit} /> : null}
      <circle cx={ax} cy={a2 > 0 ? ay - 18 * a2 : ay} r={25} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} opacity={p(f, d[0], d[0] + 20)} />
      <g opacity={p(f, d[0] + 10, d[0] + 30)}>
        <Piece x={bx} y={by} r={26} />
      </g>
    </Scene>
  );
};

const Sac: React.FC<{ x: number; y: number; s?: number; angle?: number; o?: number; dore?: number }> = ({ x, y, s = 1, angle = 0, o = 1, dore = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${s})`} opacity={o}>
    <path d="M-60 0 Q-78 -92 -36 -146 L-24 -160 Q0 -172 24 -160 L36 -146 Q78 -92 60 0 Q0 10 -60 0 Z" fill={dore > 0 ? mix(dore, F.filet, F.orClair) : F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-30 -146 Q0 -136 30 -146" fill="none" stroke={F.cuir} strokeWidth={7} strokeLinecap="round" />
    <path d="M-20 -164 L-30 -188 M0 -168 V-194 M20 -164 L30 -188" stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" />
    {[[-16, -70], [16, -70], [0, -96], [0, -44]].map(([a, b]) => <ellipse key={`${a}${b}`} cx={a} cy={b} rx={7.5} ry={14} fill={F.or} stroke={F.orFonce} strokeWidth={2} />)}
  </g>
);

/** Plan 12 : le cinquième sac glisse au grenier ; les quatre autres ne bougent pas. */
const P12: React.FC<PropsIllustration> = ({ f, d }) => {
  const XS = [98, 244, 390, 536, 682];
  const SOL = 360;
  const part = p(f, d[1] + 10, d[1] + 110);
  const coule = p(f, d[1] + 95, d[1] + 125);
  const niveau = p(f, d[1] + 120, d[1] + 220);
  const mot = p(f, d[1] + 135, d[1] + 170);
  const porte = p(f, d[1] + 70, d[1] + 95) * (1 - p(f, d[1] + 125, d[1] + 150));
  const halo = p(f, d[2] + 5, d[2] + 60);
  const marque = p(f, d[0] + 70, d[0] + 110);
  // Le sac avance jusqu'au bord, puis descend la rampe.
  const A: Pt = [682, SOL];
  const rampe = (t: number): Pt => [(1 - t) ** 2 * 776 + 2 * (1 - t) * t * 700 + t * t * 514, (1 - t) ** 2 * 398 + 2 * (1 - t) * t * 700 + t * t * 858];
  const t1 = Math.min(1, part / 0.22);
  const t2 = Math.max(0, (part - 0.22) / 0.78);
  const surRampe = rampe(t2 * 0.9 + 0.02);
  const sx = part < 0.22 ? lerp(A[0], 752, t1) : lerp(752, surRampe[0], Math.min(1, t2 * 6)) ;
  const sy = part < 0.22 ? A[1] + 18 * t1 * t1 : lerp(A[1] + 18, surRampe[1] - 8, Math.min(1, t2 * 6));
  return (
    <Scene>
      {/* Les sacs sur leur plancher. */}
      <rect x={24} y={SOL} width={752} height={20} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {/* La rampe. */}
      <path d="M776 398 Q700 700 514 858" fill="none" stroke={F.cuirClair} strokeWidth={22} strokeLinecap="round" />
      <path d="M776 398 Q700 700 514 858" fill="none" stroke={F.encre} strokeWidth={3} strokeDasharray="3 28" strokeLinecap="round" />
      {/* L'empreinte du sac parti. */}
      <path d="M622 360 Q604 268 646 214 L658 200 Q682 188 706 200 L718 214 Q760 268 742 360 Z" fill="none" stroke={F.encre2} strokeWidth={3} strokeDasharray="10 10" opacity={p(f, d[1] + 25, d[1] + 55)} />
      {/* Le grenier. */}
      <path d="M124 512 L340 406 L556 512 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={156} y={512} width={368} height={346} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <rect x={194} y={622} width={232} height={216} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
      <clipPath id="ch19-p12">
        <rect x={196} y={624} width={228} height={212} />
      </clipPath>
      <g clipPath="url(#ch19-p12)">
        <path d={`M190 ${836 - niveau * 158} Q310 ${836 - niveau * 196} 430 ${836 - niveau * 158} V840 H190 Z`} fill={F.or} />
      </g>
      <rect x={440} y={702} width={74} height={156} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
      <rect x={440} y={702} width={74 * (1 - 0.82 * porte)} height={156} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <Libelle x={340} y={584} taille={32} graisse={600} couleur={F.orFonce} opacite={mot}>{LIBELLES.vingt}</Libelle>
      {/* Les sacs. */}
      {[0, 1, 2, 3].map((i) => <Sac key={i} x={XS[i]} y={SOL} o={p(f, d[0] + i * 12, d[0] + 30 + i * 12)} />)}
      <Sac x={sx} y={sy} s={1 - 0.42 * part} angle={18 * Math.sin(part * Math.PI)} o={p(f, d[0] + 48, d[0] + 78) * (1 - coule)} dore={marque} />
      {/* Les quatre sacs restent pleins. */}
      {halo > 0
        ? [0, 1, 2, 3].map((i) => (
            <g key={i} opacity={halo}>
              {[-18, 0, 18].map((a) => {
                const r = rad(a - 90);
                return <line key={a} x1={XS[i] + Math.cos(r) * 116} y1={SOL - 94 + Math.sin(r) * 116} x2={XS[i] + Math.cos(r) * (116 + 34 * halo)} y2={SOL - 94 + Math.sin(r) * (116 + 34 * halo)} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
              })}
            </g>
          ))
        : null}
    </Scene>
  );
};

const Colonne: React.FC<{ x: number; bas: number; n: number; vu: number; atten?: number }> = ({ x, bas, n, vu, atten = 0 }) => (
  <g opacity={1 - atten * 0.5}>
    {plage(n).map((i) => {
      const o = p(f0(vu, i, n), 0, 1);
      return o > 0 ? (
        <g key={i} opacity={o}>
          <rect x={x - 66} y={bas - (i + 1) * 32} width={132} height={32} rx={13} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
          <rect x={x - 48} y={bas - (i + 1) * 32 + 9} width={96} height={14} rx={7} fill={F.orClair} />
        </g>
      ) : null;
    })}
  </g>
);
/** Part d'une colonne déjà apparue pour la pièce i. */
const f0 = (vu: number, i: number, n: number) => vu * (n + 2) - i;

const Fleche: React.FC<{ d: string; bout: Pt; angle: number; o: number; c: string }> = ({ d, bout, angle, o, c }) => (
  <g opacity={o}>
    <path d={d} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" />
    <path d="M-22 -14 L4 0 L-22 14 Z" transform={`translate(${bout[0]} ${bout[1]}) rotate(${angle})`} fill={c} stroke={c} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

/** Un épi : la tige, puis l'épi à plusieurs grains. Origine au pied. */
const Epi: React.FC<{ x: number; y: number; h: number; pench: number; c: string; g: string }> = ({ x, y, h, pench, c, g }) => {
  const tx = x + pench;
  const ty = y - h;
  return (
    <g>
      <path d={`M${x} ${y} Q${x} ${y - h * 0.55} ${tx} ${ty}`} fill="none" stroke={c} strokeWidth={5} strokeLinecap="round" />
      <g transform={`translate(${tx} ${ty}) rotate(${pench * 2.2})`}>
        {[[-8, -6, -22], [8, -6, 22], [-8, -22, -22], [8, -22, 22], [0, -34, 0]].map(([a, b, r], i) => (
          <ellipse key={i} cx={a} cy={b} rx={6} ry={12} transform={`rotate(${r} ${a} ${b})`} fill={g} stroke={F.encre} strokeWidth={2} />
        ))}
      </g>
    </g>
  );
};

/** Plan 13 : le réveil sur le champ qui jaunit ; puis les trois colonnes de pièces. */
const P13: React.FC<PropsIllustration> = ({ f, d }) => {
  const bascule = p(f, d[1] - 14, d[1] + 12);
  const jaunit = p(f, d[0] + 70, d[0] + 230);
  const sonne = p(f, d[0] + 130, d[0] + 150);
  const tremble = Math.sin(f * 1.5) * 6 * sonne;
  const milieu = p(f, d[1] + 5, d[1] + 40);
  const fG = p(f, d[1] + 45, d[1] + 75);
  const fD = p(f, d[1] + 120, d[1] + 150);
  const eclat = p(f, d[1] + 185, d[1] + 225);
  const BAS = 770;
  return (
    <Scene>
      {bascule < 1 ? (
        <g opacity={1 - bascule}>
          <path d="M26 870 Q14 640 60 560 Q400 495 740 560 Q786 640 774 870 Z" fill={mix(jaunit, F.filet, F.orClair)} opacity={0.75} />
          <path d="M60 560 Q400 495 740 560" fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
          {plage(3).map((r) =>
            plage(9 - (r === 1 ? 1 : 0)).map((i) => {
              const x = r === 1 ? 118 + i * 76 : 80 + i * 76;
              const y = 640 + r * 96;
              return <Epi key={`${r}-${i}`} x={x} y={y + 40} h={58} pench={jaunit * 20} c={mix(jaunit, F.orFonce, F.cuirClair)} g={mix(jaunit, F.orFonce, F.or)} />;
            }),
          )}
          <g transform={`rotate(${tremble} 400 260)`}>
            <path d="M322 372 L296 412 M478 372 L504 412" stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
            <path d="M270 148 A62 62 0 0 1 366 92 Z" fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" transform={`rotate(${tremble * 1.5} 318 120)`} />
            <path d="M530 148 A62 62 0 0 0 434 92 Z" fill={F.or} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" transform={`rotate(${-tremble * 1.5} 482 120)`} />
            <rect x={392} y={72} width={16} height={44} fill={F.encre} />
            <circle cx={400} cy={66} r={12} fill={F.or} stroke={F.encre} strokeWidth={3} />
            <circle cx={400} cy={260} r={148} fill={F.argile} stroke={F.encre} strokeWidth={5} />
            <circle cx={400} cy={260} r={118} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            {plage(12).map((i) => {
              const a = rad(i * 30);
              return <line key={i} x1={400 + Math.cos(a) * 98} y1={260 + Math.sin(a) * 98} x2={400 + Math.cos(a) * 110} y2={260 + Math.sin(a) * 110} stroke={F.encre} strokeWidth={i % 3 === 0 ? 5 : 3} />;
            })}
            <path d="M400 260 L400 180 M400 260 L456 296" stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
            <circle cx={400} cy={260} r={9} fill={F.encre} />
          </g>
          {/* Les ondes de la sonnerie. */}
          {[0, 1].map((k) => (
            <g key={k} opacity={sonne * (0.5 + 0.5 * Math.sin(f / 3 + k * 2))}>
              <path d={`M${206 - k * 30} ${176 - k * 16} Q${180 - k * 30} 250 ${206 - k * 30} ${324 + k * 16}`} fill="none" stroke={F.or} strokeWidth={7} strokeLinecap="round" />
              <path d={`M${594 + k * 30} ${176 - k * 16} Q${620 + k * 30} 250 ${594 + k * 30} ${324 + k * 16}`} fill="none" stroke={F.or} strokeWidth={7} strokeLinecap="round" />
            </g>
          ))}
        </g>
      ) : null}
      {bascule > 0 ? (
        <g opacity={bascule}>
          <line x1={30} x2={770} y1={BAS} y2={BAS} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
          {eclat > 0 ? (
            <g>
              <circle cx={130} cy={BAS - 90} r={100} fill={F.orClair} opacity={0.6 * eclat} />
              {plage(7).map((i) => {
                const a = rad(-170 + i * 26.7);
                return <line key={i} x1={130 + Math.cos(a) * 110} y1={BAS - 90 + Math.sin(a) * 110} x2={130 + Math.cos(a) * (110 + 30 * eclat)} y2={BAS - 90 + Math.sin(a) * (110 + 30 * eclat)} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={eclat} />;
              })}
            </g>
          ) : null}
          <Colonne x={130} bas={BAS} n={3} vu={fG} />
          <Colonne x={400} bas={BAS} n={7} vu={milieu} />
          <Colonne x={670} bas={BAS} n={14} vu={fD} atten={eclat} />
          <Fleche d="M330 500 Q262 462 212 512" bout={[206, 520]} angle={128} o={fG} c={mix(eclat, F.encre, F.or)} />
          <Fleche d="M470 500 Q530 380 588 360" bout={[596, 356]} angle={-20} o={fD} c={F.encre2} />
          <Libelle x={130} y={BAS + 54} taille={31} graisse={600} opacite={fG} couleur={eclat > 0 ? mix(eclat, F.encre, F.orFonce) : F.encre}>{LIBELLES.gratitude}</Libelle>
          <Libelle x={670} y={BAS + 54} taille={31} graisse={600} opacite={fD * (1 - 0.4 * eclat)}>{LIBELLES.insatisfaction}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/** Plan 14 : le grenier au centre, grains vers la droite, pièces par la gauche, tout s'assèche autour. */
const P14: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const vente = p(f, d[2], d[2] + 20);
  const sec = p(f, d[2] + 10, d[2] + 190);
  const niveau = 0.2 + 0.72 * p(f, d[0], d[1]) - 0.3 * p(f, d[2], duree);
  const banque = p(f, d[1] + 30, d[1] + 65);
  const coeur = p(f, d[3], d[3] + 30);
  const serre = 1 - 0.14 * coeur * (0.5 + 0.5 * Math.sin(f / 10));
  const soleil = p(f, d[2] + 10, d[2] + 100);
  const TIGES = [52, 98, 144, 656, 702, 748];
  return (
    <Scene>
      {/* Le soleil de la sécheresse. */}
      <g opacity={soleil}>
        <circle cx={104} cy={120} r={52} fill={F.or} stroke={F.orFonce} strokeWidth={4} />
        {plage(12).map((i) => {
          const a = rad(i * 30);
          return <line key={i} x1={104 + Math.cos(a) * 66} y1={120 + Math.sin(a) * 66} x2={104 + Math.cos(a) * 92} y2={120 + Math.sin(a) * 92} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      {/* Le sol. */}
      <path d="M22 650 H778 V850 Q400 878 22 850 Z" fill={mix(sec, F.filet, F.cuirClair)} opacity={0.55 + 0.25 * sec} />
      <line x1={22} x2={778} y1={650} y2={650} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      {[
        'M70 760 L110 790 L95 820 L140 845',
        'M250 765 L290 790 L275 830',
        'M420 775 L395 810 L430 845',
        'M560 760 L600 800 L585 835',
        'M690 755 L730 780 L715 825',
      ].map((c) => <path key={c} d={c} fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" opacity={sec} />)}
      {/* Les tiges autour. */}
      {TIGES.map((x, i) => {
        const pench = sec * (i < 3 ? -1 : 1) * 14;
        return <Epi key={x} x={x} y={650} h={170 - sec * 90 - (i % 3) * 16} pench={pench} c={mix(sec, F.orFonce, F.cuirClair)} g={mix(sec, F.or, F.filet)} />;
      })}
      {/* Le grand grenier. */}
      <path d="M240 650 V300 Q240 130 400 130 Q560 130 560 300 V650 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M240 340 H560 M262 208 H538" stroke={F.filet} strokeWidth={5} />
      <rect x={366} y={112} width={68} height={22} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <rect x={290} y={356} width={220} height={268} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
      <clipPath id="ch19-p14">
        <rect x={292} y={358} width={216} height={264} />
      </clipPath>
      <g clipPath="url(#ch19-p14)">
        <path d={`M290 ${624 - niveau * 262} Q400 ${624 - niveau * 262 - 26} 510 ${624 - niveau * 262} V630 H290 Z`} fill={F.or} />
      </g>
      <g opacity={banque} transform={`translate(0 ${(1 - banque) * 10})`}>
        <Piece x={400} y={250} r={46} />
      </g>
      {coeur > 0 ? (
        <g transform="translate(400 262)" opacity={coeur}>
          <circle r={66} fill={F.papier} />
          <g transform={`scale(${serre} 1)`}>
            <Coeur x={0} y={0} s={1.05} />
          </g>
          {[-1, 1].map((c) => (
            <path key={c} d={`M${c * (112 - 16 * (1 - serre) * 7)} -26 L${c * (86 - 16 * (1 - serre) * 7)} 0 L${c * (112 - 16 * (1 - serre) * 7)} 26`} fill="none" stroke={F.encre} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </g>
      ) : null}
      {/* Le comptoir. */}
      <rect x={170} y={650} width={460} height={66} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={154} y={636} width={492} height={18} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {/* Les pièces rentrent par la gauche, les grains sortent par la droite. */}
      {vente > 0
        ? plage(3).map((i) => {
            const t = ((f + i * 30) % 90) / 90;
            return <Piece key={i} x={lerp(22, 164, t)} y={688} r={21} opacite={vente * Math.min(1, t * 6) * Math.min(1, (1 - t) * 8)} />;
          })
        : null}
      {vente > 0
        ? plage(8).map((i) => {
            const t = ((f + i * 11.25) % 90) / 90;
            return <ellipse key={i} cx={lerp(640, 778, t)} cy={688 + (i % 3) * 16 - 16} rx={12} ry={6.5} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} opacity={vente * Math.min(1, t * 8) * Math.min(1, (1 - t) * 6)} />;
          })
        : null}
    </Scene>
  );
};

/** Plan 15 : un cube se retire, la tour tombe ; le bloc plein reste debout. */
const P15: React.FC<PropsIllustration> = ({ f, d }) => {
  const C = 110;
  const SOL = 850;
  const bloc = p(f, d[0], d[0] + 40);
  const halo = p(f, d[1] + 10, d[1] + 60);
  const CH = d[2];
  const retire = p(f, CH + 215, CH + 262);
  const tremble = p(f, CH + 262, CH + 285) * (1 - p(f, CH + 288, CH + 292));
  const chute = CH + 288;
  const gloire = p(f, d[4], d[4] + 50);
  const posC = (c: number, r: number): Pt => [50 + C * (c + 0.5), SOL - C * (r + 0.5)];
  const cubes: { c: number; r: number; client: boolean }[] = [];
  plage(5).forEach((r) => plage(3).forEach((c) => cubes.push({ c, r, client: c === 2 && r === 1 })));
  const RUINE: [number, number, number][] = [
    [66, 806, -6], [158, 808, 4], [250, 804, -3], [336, 808, 8],
    [90, 726, 9], [184, 728, -7], [276, 724, 5], [348, 730, -14],
    [132, 646, -11], [226, 648, 6], [318, 650, 14],
    [176, 568, 8], [268, 570, -9],
    [226, 492, -5],
  ];
  let k = -1;
  return (
    <Scene>
      <line x1={20} x2={780} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      {/* Le bloc plein. */}
      <g opacity={bloc} transform={`translate(0 ${(1 - bloc) * 30})`}>
        {halo > 0 ? plage(9).map((i) => {
          const a = rad(-160 + i * 17.5);
          return <line key={i} x1={663 + Math.cos(a) * 120} y1={520 + Math.sin(a) * 148} x2={663 + Math.cos(a) * (120 + 26 * halo)} y2={520 + Math.sin(a) * (148 + 36 * halo)} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={halo * (0.6 + 0.4 * gloire)} />;
        }) : null}
        <path d="M556 430 L596 392 H770 L730 430 Z" fill={F.orClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M730 430 L770 392 V812 L730 850 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <rect x={556} y={430} width={174} height={420} fill={F.or} stroke={F.encre} strokeWidth={5} />
      </g>
      {/* La tour. */}
      {cubes.map(({ c, r, client }, i) => {
        const [x, y] = posC(c, r);
        const a = d[1] + 22 + i * 11;
        const o = p(f, a, a + 12);
        if (client) {
          const tomb = p(f, chute + 20, chute + 60);
          const px = lerp(x, 455, retire);
          const py = lerp(y, SOL - C / 2, tomb);
          return (
            <g key={i} opacity={o} transform={`translate(${px} ${py + (1 - o) * -22})`}>
              <rect x={-C / 2 + 2} y={-C / 2 + 2} width={C - 4} height={C - 4} rx={4} fill={F.argile} stroke={F.encre} strokeWidth={4} />
              <Libelle x={0} y={8} taille={23} graisse={600} couleur={F.papier}>{LIBELLES.client}</Libelle>
            </g>
          );
        }
        k += 1;
        const [rx, ry, ra] = RUINE[k];
        const delai = (4 - r) * 5 + (c === 2 ? 0 : (2 - c) * 3);
        const t = interpolate(f, [chute + delai, chute + delai + 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.in(Easing.quad) });
        const sc = lerp(1, 0.8, t);
        const sec = Math.sin(f * 2.2 + i) * 3 * tremble;
        return (
          <g key={i} opacity={o} transform={`translate(${lerp(x, rx, t) + sec} ${lerp(y, ry, t) + (1 - o) * -22}) rotate(${ra * t + (r > 1 ? (c - 1) * 22 * Math.sin(t * Math.PI) : 0)}) scale(${sc})`}>
            <rect x={-C / 2 + 2} y={-C / 2 + 2} width={C - 4} height={C - 4} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            <path d={`M${-C / 2 + 16} ${-C / 2 + 16} H${C / 2 - 16} V${C / 2 - 16} H${-C / 2 + 16} Z`} fill="none" stroke={F.filet} strokeWidth={3} />
          </g>
        );
      })}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: Ouverture,
  p2: P2,
  p3: P3,
  p4: P4,
  p5: P5,
  p6: P6,
  p7: P7,
  p8: P8,
  p9: P9,
  p10: P10,
  p11: P11,
  p12: P12,
  p13: P13,
  p14: P14,
  p15: P15,
  fin: Fin,
};

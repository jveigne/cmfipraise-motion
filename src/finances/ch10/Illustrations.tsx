import React from 'react';
import { interpolateColors } from 'remotion';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

/* ------------------------------------------------------------------ Outils ------------------- */

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const hasard = (i: number, k = 0) => {
  const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  return v - Math.floor(v);
};
const COEUR_D = 'M0 42 C-64 2 -54 -48 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C54 -48 64 2 0 42 Z';
const tracePartiel = (t: number) => ({ pathLength: 1, strokeDasharray: `${t} 1.01` });

/* ----------------------------------------------------------------- Le vocabulaire du chapitre -- */

const Pierre: React.FC<{ x: number; y: number; l: number; h: number; ton?: string; opacite?: number }> = ({ x, y, l, h, ton = F.filet, opacite = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacite}>
    <path d={`M${-l / 2} 0 Q${-l / 2 - 5} ${-h * 0.6} ${-l / 2 + l * 0.09} ${-h * 0.93} Q${-l * 0.1} ${-h * 1.07} ${l * 0.2} ${-h * 0.98} Q${l / 2 + 2} ${-h * 0.92} ${l / 2} 0 Z`} fill={ton} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d={`M${-l * 0.28} ${-h * 0.3} q${l * 0.1} ${-h * 0.14} ${l * 0.2} ${-h * 0.02} M${l * 0.12} ${-h * 0.58} q${l * 0.08} ${-h * 0.1} ${l * 0.18} 0`} fill="none" stroke={F.encre2} strokeWidth={3} strokeLinecap="round" />
  </g>
);

/** (x, y) : le pied de la flamme. Hauteur totale : 124 × s. */
const Flamme: React.FC<{ x: number; y: number; s: number; f: number; graine?: number }> = ({ x, y, s, f, graine = 0 }) => {
  if (s <= 0.005) return null;
  const k = Math.sin(f / 4.3 + graine) * 5 + Math.sin(f / 2.7 + graine * 2) * 3;
  const h = 1 + Math.sin(f / 5 + graine) * 0.05;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * h})`}>
      <path d={`M0 0 C-44 -4 -50 -48 -22 -74 C-12 -84 ${-4 + k * 0.5} -100 ${k} -124 C${14 + k * 0.4} -96 34 -82 38 -56 C46 -28 34 -2 0 0 Z`} fill={F.or} stroke={F.orFonce} strokeWidth={3 / s} strokeLinejoin="round" />
      <path d={`M0 -5 C-22 -7 -26 -30 -12 -46 C-6 -54 ${k * 0.5} -62 ${k * 0.6} -76 C10 -60 24 -44 22 -28 C22 -14 14 -5 0 -5 Z`} fill={F.orClair} />
    </g>
  );
};

/** L'autel du début : deux pierres. (x, y) : le sol, sous le milieu ; la flamme se pose à y − 205. */
const AutelSimple: React.FC<{ x: number; y: number; a?: number; b?: number }> = ({ x, y, a = 1, b = 1 }) => (
  <g>
    <g opacity={a} transform={`translate(0 ${(1 - a) * -300})`}>
      <Pierre x={x} y={y} l={340} h={120} />
    </g>
    <g opacity={b} transform={`translate(0 ${(1 - b) * -300})`}>
      <Pierre x={x + 6} y={y - 116} l={260} h={92} ton={F.papier} />
    </g>
  </g>
);

const PIERRES_AUTEL = [
  { x: -122, y: 0, l: 124, h: 62 },
  { x: 122, y: 0, l: 124, h: 62 },
  { x: 0, y: 0, l: 128, h: 66 },
  { x: -66, y: -60, l: 136, h: 56 },
  { x: 68, y: -60, l: 132, h: 58 },
  { x: 2, y: -114, l: 250, h: 38 },
];

/** Le grand autel de Noé, pierre par pierre. Dessus de l'autel : y − 150 × s. */
const Autel: React.FC<{ x: number; y: number; s?: number; arrivee?: (i: number) => number }> = ({ x, y, s = 1, arrivee = () => 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {PIERRES_AUTEL.map((q, i) => {
      const a = arrivee(i);
      if (a <= 0) return null;
      return (
        <g key={i} opacity={Math.min(1, a * 3)} transform={`translate(0 ${(1 - a) * -240})`}>
          <Pierre x={q.x} y={q.y} l={q.l} h={q.h} ton={i === 5 ? F.papier : F.filet} />
        </g>
      );
    })}
  </g>
);

type FormeBete = 'plein' | 'pointille' | 'silhouette';
const TOISON = 'M-50 -44 a16 16 0 0 1 2 -28 a18 18 0 0 1 28 -12 a20 20 0 0 1 34 0 a18 18 0 0 1 30 12 a16 16 0 0 1 4 28 a16 16 0 0 1 -24 10 a20 20 0 0 1 -32 0 a20 20 0 0 1 -28 -2 a14 14 0 0 1 -14 -8 Z';

/** L'agneau, sans visage. (x, y) : le sol, sous le milieu. Environ 150 × 100 à l'échelle 1. */
const Agneau: React.FC<{ x: number; y: number; s?: number; sens?: 1 | -1; forme?: FormeBete; laine?: string; pas?: number; opacite?: number; cornes?: boolean }> = ({
  x, y, s = 1, sens = 1, forme = 'plein', laine = F.papier, pas = 0, opacite = 1, cornes = false,
}) => {
  const pointille = forme === 'pointille';
  const trait = pointille ? F.encre2 : forme === 'silhouette' ? F.encre : F.encre;
  const fond = pointille ? 'none' : forme === 'silhouette' ? F.encre : laine;
  const tete = pointille ? 'none' : forme === 'silhouette' ? F.encre : F.encre2;
  const dash = pointille ? '7 8' : undefined;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * sens} ${s})`} opacity={opacite}>
      {[-34, -18, 18, 34].map((px, i) => (
        <line key={px} x1={px} y1={-36} x2={px + Math.sin(pas + i * 1.7) * 9} y2={0} stroke={pointille ? F.encre2 : F.encre} strokeWidth={pointille ? 3.5 : 7} strokeLinecap="round" strokeDasharray={pointille ? '5 6' : undefined} />
      ))}
      <circle cx={-56} cy={-62} r={8} fill={fond} stroke={trait} strokeWidth={3} strokeDasharray={dash} />
      <path d={TOISON} fill={fond} stroke={trait} strokeWidth={pointille ? 3.5 : 4} strokeDasharray={dash} strokeLinejoin="round" />
      <ellipse cx={62} cy={-80} rx={19} ry={14} transform="rotate(28 62 -80)" fill={tete} stroke={trait} strokeWidth={3} strokeDasharray={dash} />
      <ellipse cx={46} cy={-92} rx={12} ry={6} transform="rotate(-30 46 -92)" fill={tete} stroke={trait} strokeWidth={3} strokeDasharray={dash} />
      {cornes ? <path d="M50 -92 C42 -118 74 -128 84 -108 C90 -94 72 -88 68 -100" fill="none" stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" /> : null}
    </g>
  );
};

/** Bœuf en silhouette, pour varier le passage des bêtes. */
const Boeuf: React.FC<{ x: number; y: number; s?: number; pas?: number; opacite?: number }> = ({ x, y, s = 1, pas = 0, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
    {[-40, -26, 26, 40].map((px, i) => (
      <line key={px} x1={px} y1={-40} x2={px + Math.sin(pas + i * 1.7) * 8} y2={0} stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
    ))}
    <path d="M-58 -36 Q-62 -82 -30 -84 H36 Q52 -86 62 -96 L86 -92 Q92 -72 76 -62 L58 -56 Q54 -34 40 -30 H-44 Q-56 -30 -58 -36 Z" fill={F.encre} />
    <path d="M66 -95 q2 -16 16 -18 M80 -92 q8 -12 20 -10" fill="none" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
    <path d="M-58 -70 q-14 12 -10 34" fill="none" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** Gerbe et fruits. (x, y) : le pied. Environ 130 × 190 à l'échelle 1. */
const Gerbe: React.FC<{ x: number; y: number; s?: number; opacite?: number }> = ({ x, y, s = 1, opacite = 1 }) => {
  const tiges = [-3, -2, -1, 0, 1, 2, 3];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
      {tiges.map((k) => {
        const hautX = k * 21;
        const hautY = -150 + Math.abs(k) * 7;
        return (
          <g key={k}>
            <path d={`M${-k * 6} -2 L${k * 3} -66 Q${k * 6} -105 ${hautX} ${hautY}`} fill="none" stroke={F.orFonce} strokeWidth={3.5} />
            {[0, 1, 2, 3].map((g) => (
              <ellipse key={g} cx={hautX + k * 1.7 * g} cy={hautY - g * 11} rx={7.5} ry={10} transform={`rotate(${k * 8} ${hautX + k * 1.7 * g} ${hautY - g * 11})`} fill={F.or} stroke={F.orFonce} strokeWidth={2} />
            ))}
          </g>
        );
      })}
      <rect x={-26} y={-74} width={52} height={15} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      {[
        { x: -36, y: -22, r: 22, c: F.argile },
        { x: 34, y: -21, r: 21, c: F.or },
        { x: 0, y: -19, r: 19, c: F.argile },
      ].map((q) => (
        <g key={q.x}>
          <circle cx={q.x} cy={q.y} r={q.r} fill={q.c} stroke={F.encre} strokeWidth={3} />
          <path d={`M${q.x} ${q.y - q.r} q3 -8 10 -9`} fill="none" stroke={F.encre} strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={q.x - q.r * 0.34} cy={q.y - q.r * 0.34} rx={q.r * 0.2} ry={q.r * 0.13} fill={F.papier} opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

/** Trait épais, contouré. */
const Baton: React.FC<{ d: string; l: number; c?: string }> = ({ d, l, c = F.cuirClair }) => (
  <g>
    <path d={d} fill="none" stroke={F.encre} strokeWidth={l + 7} strokeLinecap="round" strokeLinejoin="round" />
    <path d={d} fill="none" stroke={c} strokeWidth={l} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

/** Rayons de lumière, depuis le haut de l'image, vers le bas. */
const Rayons: React.FC<{ x: number; y?: number; ouvert: number; long?: number; n?: number; ecart?: number; opacite?: number }> = ({ x, y = 0, ouvert, long = 220, n = 9, ecart = 68, opacite = 1 }) => {
  if (ouvert <= 0.001) return null;
  const r = 66 * Math.min(1, ouvert * 1.6);
  return (
    <g opacity={opacite}>
      {Array.from({ length: n }, (_, i) => {
        const a = ((90 + (i - (n - 1) / 2) * ((2 * ecart) / (n - 1))) * Math.PI) / 180;
        const lg = (i % 2 === 0 ? long : long * 0.72) * ouvert;
        const t = 0.05;
        return (
          <path
            key={i}
            d={`M${x + Math.cos(a - t) * r} ${y + Math.sin(a - t) * r} L${x + Math.cos(a) * (r + lg)} ${y + Math.sin(a) * (r + lg)} L${x + Math.cos(a + t) * r} ${y + Math.sin(a + t) * r} Z`}
            fill={F.or}
          />
        );
      })}
      <path d={`M${x - r} ${y} A${r} ${r} 0 0 0 ${x + r} ${y} Z`} fill={F.orClair} stroke={F.or} strokeWidth={3} />
    </g>
  );
};

const Eclat: React.FC<{ x: number; y: number; r: number; opacite?: number; couleur?: string }> = ({ x, y, r, opacite = 1, couleur = F.or }) => (
  <path transform={`translate(${x} ${y})`} d={`M0 ${-r} Q0 0 ${r} 0 Q0 0 0 ${r} Q0 0 ${-r} 0 Q0 0 0 ${-r} Z`} fill={couleur} opacity={opacite} />
);

const Ballot: React.FC<{ x: number; y: number; texte?: string; rotation?: number; tailleTexte?: number }> = ({ x, y, texte, rotation = 0, tailleTexte = 28 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <path d="M-80 -10 Q-96 -72 -36 -98 Q-14 -106 -17 -114 Q-30 -134 -9 -131 Q0 -124 9 -131 Q30 -134 17 -114 Q14 -106 36 -98 Q96 -72 80 -10 Q78 0 62 0 H-62 Q-78 0 -80 -10 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-20 -108 Q0 -100 20 -108" fill="none" stroke={F.orClair} strokeWidth={6} strokeLinecap="round" />
    <path d="M-56 -66 q-12 22 -6 46 M58 -66 q10 18 6 40" fill="none" stroke={F.cuirClair} strokeWidth={4} strokeLinecap="round" />
    {texte ? <Libelle x={0} y={-36} taille={tailleTexte} couleur={F.papier} graisse={600}>{texte}</Libelle> : null}
  </g>
);

const Sol: React.FC<{ y: number; x1?: number; x2?: number; couleur?: string }> = ({ y, x1 = 30, x2 = 770, couleur = F.encre }) => (
  <line x1={x1} x2={x2} y1={y} y2={y} stroke={couleur} strokeWidth={4} strokeLinecap="round" />
);

/* ----------------------------------------------------------------------- Plan 1 : Titre ------- */

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const un = p(f, 8, 40);
  const deux = p(f, 48, 82);
  const feu = p(f, 100, 138);
  const lueur = p(f, 110, 190);
  return (
    <Scene>
      <circle cx={406} cy={420} r={70 + 110 * lueur} fill={F.orClair} opacity={0.32 * lueur} />
      <Sol y={740} x1={110} x2={690} />
      <AutelSimple x={400} y={740} a={un} b={deux} />
      <Flamme x={406} y={536} s={0.85 * feu} f={f} />
    </Scene>
  );
};

/* -------------------------------------------------------------- Plan 2 : Le premier réflexe ---- */

const Plume: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <path d="M0 0 C6 -60 40 -150 118 -210 C110 -130 70 -60 0 0 Z" fill={F.papier} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M0 0 L88 -158" fill="none" stroke={F.encre2} strokeWidth={3} strokeLinecap="round" />
    <path d="M38 -68 l28 -2 M52 -96 l28 -8 M28 -56 l-6 -22 M44 -84 l-6 -24" stroke={F.encre2} strokeWidth={2.5} strokeLinecap="round" />
  </g>
);

const IlluReflexe: React.FC<PropsIllustration> = ({ f, d }) => {
  const page = p(f, 0, 24);
  const plume = p(f, 14, 40) * (1 - p(f, d[0] + 95, d[0] + 125));
  const gerbe = p(f, d[0] + 110, d[0] + 165);
  const agneau = p(f, d[0] + 190, d[0] + 245);
  const montee = p(f, d[2] + 5, d[2] + 70);
  const CAIRNS = [120, 260, 400, 540, 680];
  return (
    <Scene>
      <rect x={252} y={142} width={316} height={456} rx={6} fill={F.filet} opacity={0.7 * page} />
      <g opacity={page} transform={`translate(0 ${(1 - page) * 20})`}>
        <path d="M242 130 H512 L558 176 V590 H242 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M512 130 V176 H558" fill={F.parchemin} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
      </g>
      <Plume x={400 + Math.sin(f / 18) * 26} y={370 + Math.cos(f / 13) * 8 - (1 - plume) * 40} o={plume} />
      <Sol y={690} />
      <Pierre x={122} y={690} l={186} h={66} />
      <Pierre x={678} y={690} l={186} h={66} />
      <Gerbe x={122} y={626 - (1 - gerbe) * 300} s={1.1} opacite={Math.min(1, gerbe * 2)} />
      <Agneau x={678} y={626 - (1 - agneau) * 300} s={1.3} sens={-1} opacite={Math.min(1, agneau * 2)} />
      {/* Même les païens savent : d'autres petites pierres, chacune sa flamme. */}
      <Sol y={840} couleur={F.encre2} x1={60} x2={740} />
      {CAIRNS.map((x, i) => {
        const a = d[1] + 20 + i * 42;
        const o = p(f, a, a + 22);
        return (
          <g key={x} opacity={o}>
            <Pierre x={x} y={840} l={92} h={40} />
            <Flamme x={x} y={802} s={0.42 * p(f, a + 16, a + 40)} f={f} graine={i * 1.3} />
          </g>
        );
      })}
      {/* Ce que nous possédons monte, de part et d'autre de la page vierge. */}
      {[
        'M122 410 Q150 62 396 62',
        'M678 400 Q650 62 404 62',
      ].map((c) => (
        <path key={c} d={c} fill="none" stroke={F.or} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 18" strokeDashoffset={-f * 0.8} opacity={montee} />
      ))}
      <Eclat x={400} y={62} r={36 * p(f, d[2] + 60, d[2] + 90)} />
    </Scene>
  );
};

/* -------------------------------------------------------------------- Plan 3 : Le regard ------- */

const Houlette: React.FC<{ x: number; y: number }> = ({ x, y }) => <Baton d={`M${x} ${y} V${y - 350} a42 42 0 0 1 84 0 q0 20 -18 24`} l={11} />;

const Houe: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g>
    <Baton d={`M${x} ${y - 28} L${x - 52} ${y - 380}`} l={11} />
    <path d={`M${x - 16} ${y - 44} L${x + 8} ${y - 50} L${x + 72} ${y - 8} L${x + 74} ${y} L${x + 18} ${y} Z`} fill={F.encre2} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

const IlluRegard: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 650;
  const descente = p(f, d[0] + 10, d[0] + 60);
  const glisse = p(f, d[0] + 175, d[0] + 245);
  const large = p(f, d[1] + 5, d[1] + 50);
  const ombre = p(f, d[0] + 30, d[0] + 90);
  const coeurs = p(f, d[1] + 15, d[1] + 50);
  const troupeau = p(f, d[2], d[2] + 40);
  const choix = p(f, d[2] + 60, d[2] + 110);
  const mots = p(f, d[3], d[3] + 28);
  const recolte = p(f, d[4] + 5, d[4] + 60);
  const cx = mix(mix(480, 640, glisse), 562, large);
  const demi = mix(82, 170, large);
  const bas = mix(0, SOL, descente);
  return (
    <Scene>
      <defs>
        <linearGradient id="c10-rayon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <rect x={22} y={150} width={360} height={508} rx={24} fill={F.encre} opacity={0.13 * ombre} />
      {bas > 0 ? <path d={`M${cx - 44} 0 H${cx + 44} L${cx + mix(44, demi, bas / SOL)} ${bas} H${cx - mix(44, demi, bas / SOL)} Z`} fill="url(#c10-rayon)" /> : null}
      <Sol y={SOL} />
      <g opacity={mix(1, 0.5, ombre)}>
        <Houe x={82} y={SOL} />
      </g>
      <Pierre x={268} y={SOL} l={190} h={56} opacite={mix(1, 0.55, ombre)} />
      <Gerbe x={268} y={SOL - 54} s={1.05} opacite={mix(mix(1, 0.5, ombre), 0.82, recolte)} />
      <Houlette x={480} y={SOL} />
      <Pierre x={642} y={SOL} l={196} h={56} />
      {[580, 650, 720].map((x) => (
        <Agneau key={x} x={x} y={416} s={0.42} forme="pointille" opacite={troupeau * (1 - 0.3 * choix)} sens={-1} />
      ))}
      <Agneau x={642} y={596} s={mix(1.2, 1.34, choix)} sens={-1} laine={interpolateColors(choix, [0, 1], [F.papier, F.orClair])} />
      {[{ x: 548, y: 500 }, { x: 742, y: 486 }, { x: 760, y: 560 }, { x: 530, y: 566 }].map((q, i) => (
        <Eclat key={i} x={q.x} y={q.y} r={15 + Math.sin(f / 9 + i * 1.6) * 4} opacite={choix} />
      ))}
      {/* Le cœur d'abord : celui d'Abel brûle, celui de Caïn reste creux. */}
      <Coeur x={480} y={430} s={0.62 * Math.max(coeurs, 0.001)} opacite={coeurs} />
      <g opacity={coeurs * 0.7}>
        <path transform={`translate(58 430) scale(${0.62})`} d={COEUR_D} fill={F.parchemin} stroke={F.encre2} strokeWidth={5} strokeDasharray="8 8" />
      </g>
      <g opacity={mots} transform={`translate(0 ${(1 - mots) * 14})`}>
        <Libelle x={210} y={750} taille={54} couleur={F.encre2} graisse={500}>{LIBELLES.devoir}</Libelle>
        <Libelle x={592} y={750} taille={54} couleur={F.orFonce} graisse={600}>{LIBELLES.culte}</Libelle>
        <line x1={140} x2={140 + 140 * mots} y1={772} y2={772} stroke={F.encre2} strokeWidth={4} strokeLinecap="round" />
        <line x1={528} x2={528 + 128 * mots} y1={772} y2={772} stroke={F.or} strokeWidth={6} strokeLinecap="round" />
      </g>
    </Scene>
  );
};

/* -------------------------------------------------------------- Plan 4 : Combien de Caïn ------- */

const IlluRecu: React.FC<PropsIllustration> = ({ f, d }) => {
  const X1 = 265;
  const X2 = 535;
  const HAUT = 282;
  const BAS = 690;
  const deroule = p(f, 4, d[1] - 6);
  const monte = p(f, d[1], d[1] + 56);
  const tombe = p(f, d[1] + 62, d[1] + 105);
  const froisse = p(f, d[2] + 25, d[2] + 85);
  const mot = p(f, d[2] + 80, d[2] + 108);
  const glisse = p(f, d[3] - 6, d[3] + 36);
  const lumiere = p(f, d[3] + 20, d[3] + 80);
  const pierre = p(f, d[3] + 70, d[3] + 115);
  const bas = mix(HAUT + 14, BAS, deroule);
  const LIGNES = [0, 1, 2, 3, 4, 5];
  // Contour : le reçu à plat, puis la boule.
  const centreX = 400;
  const centreY = 500;
  const plat: [number, number][] = [
    [X1, HAUT], [X1 + 135, HAUT], [X2, HAUT],
    ...[0.2, 0.4, 0.6, 0.8].map((t): [number, number] => [X2, HAUT + (bas - HAUT) * t]),
    ...Array.from({ length: 11 }, (_, i): [number, number] => [X2 - (i * (X2 - X1)) / 10, bas + (i % 2 === 0 ? 0 : -14)]),
    ...[0.8, 0.6, 0.4, 0.2].map((t): [number, number] => [X1, HAUT + (bas - HAUT) * t]),
  ];
  const points = plat.map(([x, y], i) => {
    const a = -2.356 + (i / plat.length) * Math.PI * 2;
    const r = 86 + hasard(i, 3) * 44;
    return [mix(x, centreX + Math.cos(a) * r, froisse), mix(y, centreY + Math.sin(a) * r, froisse)] as [number, number];
  });
  const dx = -130 * glisse;
  // Le fil tient au contour lui-même (angle haut droit du reçu, puis haut de la boule).
  const ancreX = points[2][0] + dx;
  const ancreY = points[2][1];
  // Une fois retombé, son bout libre pend à côté du reçu, sans rien toucher.
  const pendX = ancreX + mix(75, 190, froisse) + Math.sin(f / 16) * 5;
  const pendY = ancreY + mix(158, 100, froisse) + Math.cos(f / 16) * 3;
  const tipX = mix(ancreX, pendX, tombe);
  const tipY = mix(mix(ancreY, 46, monte), pendY, tombe);
  const c1x = ancreX;
  const c1y = mix(mix(ancreY, 150, monte), ancreY - 150, tombe);
  const c2x = mix(ancreX, pendX + 6, tombe);
  const c2y = mix(mix(ancreY, 90, monte), pendY - 170, tombe);
  const angleBout = (Math.atan2(tipY - c2y, tipX - c2x) * 180) / Math.PI;
  return (
    <Scene>
      {lumiere > 0 ? <path d={`M570 0 H700 L${mix(635, 735, lumiere)} ${mix(40, 770, lumiere)} H${mix(635, 535, lumiere)} Z`} fill={F.orClair} opacity={0.6 * lumiere} /> : null}
      {monte > 0 ? (
        <g>
          <path d={`M${ancreX} ${ancreY} C${c1x} ${c1y} ${c2x} ${c2y} ${tipX} ${tipY}`} fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
          {/* Le crochet prolonge le fil et reste ouvert : il n'accroche rien. */}
          <path d="M0 0 H14 a10 10 0 0 0 0 -20 h-8" fill="none" stroke={F.encre} strokeWidth={4.5} strokeLinecap="round" transform={`translate(${tipX} ${tipY}) rotate(${angleBout})`} />
        </g>
      ) : null}
      <g transform={`translate(${dx} 0)`}>
        <path d={`M${points.map((q) => q.join(' ')).join(' L')} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {/* Les plis de la boule. */}
        <g opacity={froisse}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const a = i * 0.9 + 0.3;
            return <path key={i} d={`M${centreX + Math.cos(a) * 14} ${centreY + Math.sin(a) * 14} L${centreX + Math.cos(a + 0.2) * 52} ${centreY + Math.sin(a + 0.2) * 52} L${centreX + Math.cos(a - 0.1) * 80} ${centreY + Math.sin(a - 0.1) * 80}`} fill="none" stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" />;
          })}
        </g>
        {/* Les lignes, chacune cochée. */}
        <g opacity={1 - p(f, d[2] + 25, d[2] + 50)}>
          {LIGNES.map((i) => {
            const y = HAUT + 44 + i * 58;
            const visible = bas > y + 14;
            const coche = p(f, 40 + i * 36, 56 + i * 36);
            return visible ? (
              <g key={i}>
                <line x1={X1 + 28} x2={X1 + 28 + 130 + hasard(i) * 50} y1={y} y2={y} stroke={F.encre2} strokeWidth={8} strokeLinecap="round" />
                <path d={`M${X2 - 56} ${y - 2} l11 13 l22 -26`} fill="none" stroke={F.orFonce} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" {...tracePartiel(coche)} />
              </g>
            ) : null;
          })}
        </g>
        <g opacity={1 - p(f, d[2] + 20, d[2] + 45)}>
          <rect x={X1 - 22} y={244} width={X2 - X1 + 44} height={44} rx={20} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <line x1={X1 - 8} x2={X2 + 8} y1={258} y2={258} stroke={F.filet} strokeWidth={4} />
        </g>
      </g>
      <g opacity={mot} transform={`translate(${dx} 0)`}>
        <Libelle x={400} y={700} taille={46} couleur={F.argile} graisse={600}>{LIBELLES.reclamations}</Libelle>
      </g>
      {/* La seconde chance : une pierre libre, une offrande encore à apporter. */}
      <g opacity={pierre}>
        <Sol y={800} x1={480} x2={770} couleur={F.encre2} />
        <Pierre x={635} y={800} l={190} h={56} />
        <Gerbe x={635} y={744} s={0.95} opacite={0.38} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------- Plan 5 : La petite liste ------- */

const IlluCarnet: React.FC<PropsIllustration> = ({ f, d }) => {
  const a = d[0];
  const replie = p(f, d[1], d[1] + 55);
  const trace = p(f, d[1] + 6, d[1] + 86);
  const ferme = p(f, d[1] + 76, d[1] + 110);
  const battement = 1 + Math.sin(f / 12) * 0.012 * ferme;
  const souligne = p(f, a + 150, a + 190);
  const cadre = p(f, a + 190, a + 240);
  const s = mix(1, 0.6, replie);
  const ty = mix(0, -6, replie);
  return (
    <Scene>
      <g transform={`translate(400 ${400 + ty}) scale(${s}) translate(-400 -400)`}>
        <path d="M46 180 Q240 140 400 180 Q560 140 754 180 V690 Q560 650 400 692 Q240 650 46 690 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M400 172 Q240 128 66 164 V666 Q240 628 400 672 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M400 172 Q560 128 734 164 V666 Q560 628 400 672 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {LIBELLES.donne.map((t, i) => (
          <Libelle key={i} x={232} y={226 + i * 46} taille={40} graisse={600}>{t}</Libelle>
        ))}
        {LIBELLES.depense.map((t, i) => (
          <Libelle key={i} x={568} y={222 + i * 44} taille={38} graisse={600}>{t}</Libelle>
        ))}
        {/* La liste courte, qu'on garde et qu'on encadre. */}
        {[0, 1, 2].map((i) => {
          const y = 370 + i * 54;
          const o = p(f, a + 20 + i * 26, a + 40 + i * 26);
          return (
            <g key={i}>
              <line x1={118} x2={mix(118, 346 - i * 44, o)} y1={y} y2={y} stroke={F.encre} strokeWidth={8} strokeLinecap="round" opacity={o} />
              <line x1={118} x2={mix(118, 346 - i * 44, souligne)} y1={y + 17} y2={y + 17} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={souligne} />
            </g>
          );
        })}
        <rect x={94} y={338} width={276} height={176} rx={8} fill="none" stroke={F.orFonce} strokeWidth={6} {...tracePartiel(cadre)} opacity={cadre > 0 ? 1 : 0} />
        {/* La page qu'on ne garde pas : elle se remplit, puis s'efface. */}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const y = 370 + i * 42;
          const o = p(f, a + 20 + i * 24, a + 38 + i * 24);
          const part = p(f, a + 230 + (5 - i) * 22, a + 262 + (5 - i) * 22);
          const fin = 700 - (i % 3) * 36;
          return <line key={i} x1={442} x2={mix(442, fin, o)} y1={y} y2={y} stroke={F.encre2} strokeWidth={8} strokeLinecap="round" opacity={o * (1 - part)} />;
        })}
      </g>
      <path transform={`translate(400 470) scale(${8 * battement})`} d={COEUR_D} fill={F.argile} opacity={0.1 * ferme} stroke="none" />
      <path transform={`translate(400 470) scale(${8 * battement})`} d={COEUR_D} fill="none" stroke={F.argile} strokeWidth={0.95} {...tracePartiel(trace)} opacity={trace > 0 ? 1 : 0} strokeLinecap="round" />
    </Scene>
  );
};

/* -------------------------------------------------------------- Plan 6 : La séparation -------- */

const IlluTube: React.FC<PropsIllustration> = ({ f, d }) => {
  const TUBE = 'M300 112 V640 a100 100 0 0 0 200 0 V112';
  const SURFACE = 262;
  const LIMITE = 490;
  const chute = p(f, d[0] - 4, d[0] + 30);
  const impact = p(f, d[0] + 28, d[0] + 75);
  const sep = p(f, d[0] + 40, d[2] - 30);
  const coeurs = p(f, d[1] + 120, d[1] + 170);
  const fin = p(f, d[2] + 10, d[2] + 70);
  const fissure = p(f, d[2] + 70, d[2] + 120);
  const w = mix(0.46, 0.012, sep);
  const clair = interpolateColors(sep, [0, 1], [F.cuirClair, F.orClair]);
  const sombre = interpolateColors(sep, [0, 1], [F.cuirClair, F.cuir]);
  const fond = interpolateColors(fin, [0, 1], [sombre, F.encre]);
  const coupe = (LIMITE - SURFACE) / (760 - SURFACE);
  return (
    <Scene>
      <defs>
        <clipPath id="c10-tube"><path d={`${TUBE} Z`} /></clipPath>
        <linearGradient id="c10-couches" x1="0" y1={SURFACE} x2="0" y2={760} gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor={clair} />
          <stop offset={Math.max(0, coupe - w)} stopColor={clair} />
          <stop offset={Math.min(1, coupe + w)} stopColor={fond} />
          <stop offset={1} stopColor={fond} />
        </linearGradient>
      </defs>
      {/* Le support. */}
      <path d="M210 842 H690 Q700 842 700 852 V864 H200 V852 Q200 842 210 842 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <rect x={630} y={190} width={22} height={654} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={490} y={178} width={162} height={22} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {/* L'intérieur. */}
      <g clipPath="url(#c10-tube)">
        <rect x={290} y={100} width={220} height={700} fill={F.papier} />
        <rect x={290} y={SURFACE} width={220} height={540} fill="url(#c10-couches)" />
        {Array.from({ length: 64 }, (_, i) => {
          const leger = i % 2 === 0;
          const x0 = 310 + hasard(i, 1) * 180;
          const y0 = SURFACE + 14 + hasard(i, 2) * 470;
          const vit = 18 + hasard(i, 4) * 26;
          const x = x0 + Math.sin(f / vit + i) * 18;
          const yr = y0 + Math.cos(f / (vit * 1.3) + i * 2) * 26;
          const cible = leger ? SURFACE + 20 + hasard(i, 5) * (LIMITE - SURFACE - 40) : LIMITE + 20 + hasard(i, 5) * 220;
          return <circle key={i} cx={x} cy={mix(yr, cible, sep)} r={3 + hasard(i, 6) * 5} fill={leger ? F.papier : F.encre} opacity={mix(0.65, 0.3, sep)} />;
        })}
        <rect x={290} y={LIMITE - 1} width={220} height={2} fill={F.encre} opacity={sep * 0.5} />
        {[0, 1].map((k) => (
          <ellipse key={k} cx={400} cy={SURFACE} rx={18 + (40 + k * 34) * impact} ry={4 + 6 * impact} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={impact > 0 ? 1 - impact : 0} />
        ))}
        <path d={`M300 ${SURFACE} H500`} stroke={F.encre} strokeWidth={3} />
        <g opacity={coeurs}>
          <Coeur x={400} y={380} s={1.05} rempli={F.or} contour={F.orFonce} />
          <Coeur x={400} y={610} s={1.05} rempli={F.encre2} contour={F.papier} />
          <path d="M400 568 l-13 16 l18 12 l-14 16 l14 12 l-5 20" fill="none" stroke={F.papier} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" {...tracePartiel(fissure)} opacity={fissure > 0 ? 1 : 0} />
        </g>
      </g>
      {/* Le verre. */}
      <path d={TUBE} fill="none" stroke={F.encre} strokeWidth={6} />
      <path d="M284 112 H516" stroke={F.encre} strokeWidth={10} strokeLinecap="round" />
      <path d="M322 140 V620" stroke={F.papier} strokeWidth={7} strokeLinecap="round" opacity={0.55} />
      <rect x={288} y={176} width={224} height={26} rx={8} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {/* La goutte d'or. */}
      {chute < 1 ? (
        <path transform={`translate(400 ${mix(10, SURFACE - 12, chute)})`} d="M0 -32 C10 -14 20 -2 20 10 A20 20 0 0 1 -20 10 C-20 -2 -10 -14 0 -32 Z" fill={F.or} stroke={F.orFonce} strokeWidth={3} opacity={Math.min(1, p(f, 0, 16))} />
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Plan 7 : Le grand Roi ------- */

const IlluRoi: React.FC<PropsIllustration> = ({ f, d }) => {
  const chute = p(f, d[0] + 20, d[0] + 58);
  const disparait = p(f, d[0] + 130, d[0] + 175);
  const point = p(f, d[0] + 200, d[1] + 10);
  const lumiere = p(f, d[1], d[2] - 5);
  const grandit = p(f, d[2] - 25, d[2] + 55);
  const mot = p(f, d[1] + 20, d[1] + 55);
  const rayons = p(f, d[2] + 40, d[2] + 90);
  const s = mix(3.2, 6.6, grandit);
  const CX = mix(460, 400, grandit);
  const CY = mix(560, 480, grandit);
  const r = mix(7 + Math.sin(f / 8) * 1.5, 22, point) + lumiere * 75;
  return (
    <Scene>
      <defs>
        <clipPath id="c10-roi"><path d={COEUR_D} /></clipPath>
      </defs>
      {/* La pièce et le bol, puis plus rien. */}
      <g opacity={1 - disparait} transform={`translate(0 ${disparait * 18})`}>
        {chute < 1 ? <Piece x={150} y={mix(60, 225, chute)} r={30} opacite={p(f, d[0], d[0] + 12)} /> : <Piece x={150} y={242} r={30} />}
        <path d="M66 240 H234 Q230 322 180 332 H120 Q70 322 66 240 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <ellipse cx={150} cy={240} rx={84} ry={11} fill={F.cuir} stroke={F.encre} strokeWidth={4} opacity={0} />
      </g>
      {/* Les rayons autour du cœur, à la fin. */}
      {Array.from({ length: 11 }, (_, i) => {
        const a = ((-170 + i * 16) * Math.PI) / 180;
        const r1 = 372 + 8 * Math.sin(f / 10 + i);
        return <line key={i} x1={400 + Math.cos(a) * r1} y1={400 + Math.sin(a) * r1 * 0.98} x2={400 + Math.cos(a) * (r1 + 42 * rayons)} y2={400 + Math.sin(a) * (r1 + 42 * rayons) * 0.98} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={rayons} />;
      })}
      <g transform={`translate(${CX} ${CY}) scale(${s})`}>
        <path d={COEUR_D} fill={F.papier} />
        <g clipPath="url(#c10-roi)">
          <circle cx={0} cy={-2} r={r + 6} fill={F.orClair} opacity={0.55} />
          <circle cx={0} cy={-2} r={r} fill={F.orClair} />
          <circle cx={0} cy={-2} r={Math.max(2, r * 0.45)} fill={F.or} opacity={1 - lumiere} />
        </g>
        <path d={COEUR_D} fill="none" stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
      </g>
      <g opacity={mot}>
        <Libelle x={CX} y={CY + 18 * (s / 6.6) - 6} taille={mix(40, 84, grandit)} graisse={600} couleur={F.encre}>{LIBELLES.grandRoi}</Libelle>
      </g>
    </Scene>
  );
};

/* --------------------------------------------------------------- Plan 8 : Les prémices -------- */

const IlluPremices: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 28);
  const SOL = 760;
  const marche = p(f, d[0] + 40, d[1] - 40);
  const monte = p(f, d[1] - 100, d[1] - 40);
  const x = mix(112, 610, marche);
  const y = SOL - 66 * monte;
  const pas = marche > 0 && marche < 1 ? f / 3 : 0;
  const bond = marche > 0 && marche < 1 ? Math.abs(Math.sin(f / 6)) * 5 : 0;
  const risque = p(f, d[1], d[1] + 45);
  const eclat = p(f, d[1] - 40, d[1] + 10);
  const RANGS = [
    { y: 300, xs: [110, 270, 430, 590], s: 0.95 },
    { y: 480, xs: [190, 350, 510, 670], s: 1.05 },
  ];
  return (
    <Scene>
      {RANGS.flatMap((r, ri) =>
        r.xs.map((px, i) => (
          <Agneau key={`${ri}-${i}`} x={px} y={r.y} s={r.s} forme="pointille" opacite={entree * mix(0.95, 0.42 + 0.14 * Math.sin(f / 14 + i * 1.3 + ri), risque)} />
        )),
      )}
      <Sol y={SOL} />
      <Pierre x={610} y={SOL} l={240} h={68} />
      <circle cx={610} cy={634} r={120 * eclat} fill={F.orClair} opacity={0.4 * eclat} />
      <Agneau x={x} y={y - bond} s={1.25} pas={pas} laine={F.papier} opacite={entree} />
      {[{ x: 480, y: 600 }, { x: 742, y: 580 }, { x: 610, y: 520 }].map((q, i) => (
        <Eclat key={i} x={q.x} y={q.y} r={15 + 4 * Math.sin(f / 9 + i * 2)} opacite={eclat} />
      ))}
    </Scene>
  );
};

/* ------------------------------------------------------------- Plan 9 : Il parle encore ------- */

const LigneEcrite: React.FC<{ x: number; y: number; l: number; graine: number; t: number; couleur?: string }> = ({ x, y, l, graine, t, couleur = F.encre }) => {
  const n = 22;
  const pts = Array.from({ length: n + 1 }, (_, k) => {
    const px = x + (k * l) / n;
    const py = y + Math.sin(k * 1.9 + graine * 2.3) * (4 + hasard(graine, k) * 6);
    return `${px.toFixed(1)} ${py.toFixed(1)}`;
  });
  return <path d={`M${pts.join(' L')}`} fill="none" stroke={couleur} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" {...tracePartiel(t)} opacity={t > 0 ? 1 : 0} />;
};

const IlluRouleau: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 840;
  const estompe = p(f, d[0] + 90, d[0] + 230);
  const ouvre = p(f, d[0] + 220, d[0] + 300);
  const relation = p(f, d[1] + 30, d[1] + 90);
  const HAUT = 96;
  const bas = mix(HAUT + 30, 680, ouvre);
  const debut = d[0] + 270;
  const PAS = 46;
  const H = 62;
  const cur = Math.max(0, (f - debut) / PAS);
  const VISIBLES = 7.4;
  const defile = Math.max(0, cur - VISIBLES) * H;
  const premier = Math.floor(defile / H);
  const dernier = Math.floor(cur);
  const lignes: number[] = [];
  for (let i = Math.max(0, premier - 1); i <= dernier; i++) lignes.push(i);
  return (
    <Scene>
      <defs>
        <clipPath id="c10-rouleau"><rect x={170} y={HAUT + 22} width={460} height={Math.max(0, bas - HAUT - 34)} /></clipPath>
      </defs>
      <Sol y={SOL} />
      <Pierre x={400} y={SOL} l={420} h={96} />
      <Agneau x={400} y={SOL - 94} s={1.9} opacite={p(f, 0, 20) * (1 - estompe)} />
      {ouvre > 0 ? (
        <g>
          <rect x={160} y={HAUT} width={480} height={bas - HAUT} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <g clipPath="url(#c10-rouleau)">
            {lignes.map((i) => (
              <LigneEcrite key={i} x={200} y={HAUT + 56 + i * H - defile} l={390 - hasard(i, 8) * 70} graine={i} t={Math.max(0, Math.min(1, cur - i))} />
            ))}
          </g>
          {[HAUT, bas].map((y, k) => (
            <g key={k}>
              <rect x={136} y={y - 20} width={528} height={40} rx={20} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
              <line x1={160} x2={640} y1={y - 7} y2={y - 7} stroke={F.papier} strokeWidth={3} opacity={0.5} />
              <circle cx={126} cy={y} r={13} fill={F.or} stroke={F.encre} strokeWidth={4} />
              <circle cx={674} cy={y} r={13} fill={F.or} stroke={F.encre} strokeWidth={4} />
            </g>
          ))}
        </g>
      ) : null}
      {/* Ce qui demeure : la relation, à la place de l'agneau. */}
      <g opacity={relation} transform={`translate(0 ${(1 - relation) * 10})`}>
        <Coeur x={400} y={796} s={0.68} rempli={F.argile} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------ Plan 10 : Le premier acte ------- */

const IlluNoe: React.FC<PropsIllustration> = ({ f, d }) => {
  const baisse = p(f, 0, d[0] + 80);
  const niveau = mix(470, 852, baisse);
  const a0 = d[0] + 30;
  const pierre = (i: number) => p(f, a0 + i * 24, a0 + i * 24 + 26);
  const feu = p(f, a0 + 150, a0 + 180);
  // Le passage finit avant le début de la multiplication.
  const passage = d[0] + 130;
  const multiplie = p(f, d[1] + 60, d[1] + 220);
  const ECHELLE = 0.72;
  const Y = 716;
  const VITESSE = 5;
  const X_ENTREE = 100;
  const X_SORTIE = 630;
  // Celles qui passent d'abord ; les trois dernières s'arrêtent, la plus lointaine en premier :
  // aucune bête n'en croise donc une autre, et 29 images d'écart les gardent séparées.
  const BETES = [
    { retard: 0, stop: null as number | null, boeuf: false },
    { retard: 29, stop: null, boeuf: true },
    { retard: 58, stop: null, boeuf: false },
    { retard: 87, stop: null, boeuf: true },
    { retard: 116, stop: 524, boeuf: false },
    { retard: 145, stop: 400, boeuf: false },
    { retard: 174, stop: 276, boeuf: false },
  ];
  // Les gradins où le troupeau se tient, dans la largeur de la pente.
  const GRADINS = [
    { y: 632, x1: 120, x2: 680 },
    { y: Y, x1: 52, x2: 748 },
    { y: 806, x1: 36, x2: 764 },
  ];
  // La multiplication : d'abord à côté des bêtes arrêtées, puis au-dessus et en dessous.
  const NOUVELLES = [
    { x: 152, y: Y }, { x: 648, y: Y },
    { x: 270, y: 632 }, { x: 400, y: 632 }, { x: 530, y: 632 },
    { x: 94, y: 806 }, { x: 212, y: 806 }, { x: 330, y: 806 }, { x: 448, y: 806 }, { x: 566, y: 806 }, { x: 684, y: 806 },
  ];
  const vagues = (dy: number, amp: number, phase: number) => {
    const n = 16;
    const pts = Array.from({ length: n + 1 }, (_, i) => `${20 + (i * 760) / n} ${niveau + dy + Math.sin(i * 1.5 + f / 12 + phase) * amp}`);
    return `M${pts.join(' L')}`;
  };
  return (
    <Scene>
      <path d="M20 880 L40 720 L70 640 L170 620 L240 430 H560 L630 620 L730 640 L760 720 L780 880 Z" fill={F.filet} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M232 520 q30 22 66 12 M500 500 q30 10 52 28" fill="none" stroke={F.encre2} strokeWidth={3} strokeLinecap="round" opacity={0.7} />
      {GRADINS.map((g) => <Sol key={g.y} y={g.y} x1={g.x1} x2={g.x2} couleur={F.encre2} />)}
      <Autel x={400} y={432} s={0.86} arrivee={pierre} />
      <Flamme x={402} y={306} s={0.9 * feu} f={f} />
      {/* L'eau. */}
      <path d={`${vagues(0, 7, 0)} L780 884 H20 Z`} fill={F.encre2} opacity={0.5} />
      <path d={vagues(0, 7, 0)} fill="none" stroke={F.encre} strokeWidth={4} />
      {niveau < 820 ? <path d={vagues(22, 5, 2)} fill="none" stroke={F.papier} strokeWidth={3} opacity={0.5} /> : null}
      {/* Les bêtes passent sur le gradin ; les dernières s'arrêtent et prennent la couleur de l'offrande. */}
      {BETES.map((b, i) => {
        const t = f - passage - b.retard;
        if (t <= 0) return null;
        const libre = X_ENTREE + t * VITESSE;
        if (b.stop === null && libre >= X_SORTIE) return null;
        const arret = b.stop !== null && libre >= b.stop;
        const x = arret ? b.stop! : libre;
        const bord = Math.max(0, Math.min(1, (x - X_ENTREE) / 50, b.stop !== null ? 1 : (X_SORTIE - x) / 50));
        const pas = arret ? 0 : f / 3;
        if (b.boeuf) return <Boeuf key={i} x={x} y={Y} s={ECHELLE} pas={pas} opacite={bord} />;
        const dore = b.stop === null ? 0 : p(f, passage + b.retard + (b.stop - X_ENTREE) / VITESSE, passage + b.retard + (b.stop - X_ENTREE) / VITESSE + 16);
        return (
          <g key={i}>
            <Agneau x={x} y={Y} s={ECHELLE} pas={pas} forme="silhouette" opacite={bord} />
            {dore > 0 ? <Agneau x={x} y={Y} s={ECHELLE} laine={F.orClair} opacite={dore} /> : null}
          </g>
        );
      })}
      {/* Le petit groupe se multiplie. */}
      {NOUVELLES.map((q, i) => {
        const o = Math.max(0, Math.min(1, (multiplie - (i / NOUVELLES.length) * 0.9) / 0.1));
        return o > 0 ? <Agneau key={i} x={q.x} y={q.y} s={ECHELLE * (0.5 + 0.5 * o)} laine={F.orClair} opacite={o} /> : null;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------- Plan 11 : Le parfum ------ */

const IlluParfum: React.FC<PropsIllustration> = ({ f, d }) => {
  const AX = 480;
  const SOL = 830;
  const HAUT_FEU = SOL - 150 - 112;
  const monte = p(f, d[0] - 10, d[1] + 10);
  const touche = p(f, d[1] - 8, d[1] + 40);
  const coeur = p(f, d[1] + 20, d[1] + 50);
  const spirale = (phase: number, ampli: number) => {
    const fin = mix(HAUT_FEU, 170, monte);
    const n = 60;
    const pts: string[] = [];
    for (let i = 0; i <= n; i++) {
      const y = mix(HAUT_FEU, fin, i / n);
      const h = HAUT_FEU - y;
      pts.push(`${(AX + Math.sin(h / 52 - f / 15 + phase) * (10 + h * ampli)).toFixed(1)} ${y.toFixed(1)}`);
    }
    return `M${pts.join(' L')}`;
  };
  return (
    <Scene>
      <Rayons x={AX} ouvert={p(f, 0, 30)} long={mix(90, 150, touche)} n={11} ecart={72} opacite={mix(0.45, 1, touche)} />
      {/* Le flacon reste fermé. */}
      <g>
        <path d="M78 830 Q44 830 44 790 V670 Q44 628 92 612 V562 H164 V612 Q212 628 212 670 V790 Q212 830 178 830 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M58 720 Q128 700 198 720 V788 Q198 816 172 816 H84 Q58 816 58 788 Z" fill={F.orClair} opacity={0.75} />
        <rect x={80} y={548} width={96} height={22} rx={7} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <path d="M100 548 V518 Q100 496 128 496 Q156 496 156 518 V548 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M70 660 q-6 26 0 52" fill="none" stroke={F.papier} strokeWidth={6} strokeLinecap="round" />
      </g>
      <Sol y={SOL} />
      <Autel x={AX} y={SOL} s={0.9} />
      <Flamme x={AX + 2} y={SOL - 134} s={0.9} f={f} />
      {[0, 2.1, 4.2].map((ph, k) => (
        <path key={k} d={spirale(ph, 0.14 - k * 0.018)} fill="none" stroke={k === 1 ? F.orClair : F.or} strokeWidth={9 - k * 1.5} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* L'arôme d'un cœur : des cœurs montent dans la fumée jusqu'aux rayons. */}
      {[0, 1, 2].map((k) => {
        const local = (f - d[1] - 20 + k * 70) % 210;
        const t = Math.max(0, local) / 210;
        const y = mix(HAUT_FEU - 20, 190, t);
        return <Coeur key={k} x={AX + Math.sin(t * 6 + k) * 18} y={y} s={0.62 - 0.14 * t} rempli={F.argile} opacite={coeur * Math.min(1, t * 6) * Math.min(1, (1 - t) * 5)} />;
      })}
    </Scene>
  );
};

/* ----------------------------------------------------------------- Plan 12 : La réponse ------- */

const ONDULEE = (() => {
  const pts: [number, number][] = [[176, 150], [240, 130], [330, 116]];
  const XA = 360;
  const XB = 712;
  const R = 52;
  for (let r = 0; r < 7; r++) {
    const y = 124 + r * 104;
    const droite = r % 2 === 0;
    for (let k = 0; k <= 36; k++) {
      const x = droite ? mix(XA, XB, k / 36) : mix(XB, XA, k / 36);
      pts.push([x, y + Math.sin(k * 0.85) * 15]);
    }
    if (r < 6) {
      for (let a = 1; a < 10; a++) {
        const t = (a / 10) * Math.PI;
        pts.push([droite ? XB + Math.sin(t) * R : XA - Math.sin(t) * R, y + R - Math.cos(t) * R]);
      }
    }
  }
  return pts;
})();
const longueurs = (() => {
  const l = [0];
  for (let i = 1; i < ONDULEE.length; i++) l.push(l[i - 1] + Math.hypot(ONDULEE[i][0] - ONDULEE[i - 1][0], ONDULEE[i][1] - ONDULEE[i - 1][1]));
  return l;
})();
const ONDULEE_D = `M${ONDULEE.map((q) => `${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' L')}`;

const IlluReponse: React.FC<PropsIllustration> = ({ f, d }) => {
  const AX = 176;
  const SOL = 850;
  const silence = p(f, d[1] - 10, d[1] + 25) * (1 - p(f, d[2] - 15, d[2] + 15));
  const feu = mix(0.85, 0.3, silence);
  const avance = mix(0, 0.07, p(f, d[0] + 40, d[1] - 10)) + 0.93 * p(f, d[2] + 5, d[2] + 280);
  const total = longueurs[longueurs.length - 1];
  const cible = avance * total;
  let k = 0;
  while (k < longueurs.length - 1 && longueurs[k] < cible) k++;
  const tete = ONDULEE[k];
  const NB = 5;
  return (
    <Scene>
      <Rayons x={AX} ouvert={p(f, 0, 28)} long={110} n={9} ecart={70} />
      <Sol y={SOL} x1={24} x2={330} />
      <Autel x={AX} y={SOL} s={0.76} />
      <Flamme x={AX + 2} y={SOL - 112} s={feu} f={f} />
      {/* Les ondes montent de l'autel, par petites vagues. */}
      {Array.from({ length: NB }, (_, i) => {
        const cycle = 150;
        const t = (((f - d[0]) / cycle + i / NB) % 1 + 1) % 1;
        const y = mix(620, 200, t);
        const l = mix(30, 66, t);
        const o = Math.min(1, t * 6) * Math.min(1, (1 - t) * 4) * (1 - silence * 0.92) * p(f, d[0] - 10, d[0] + 15);
        return <path key={i} d={`M${AX - l} ${y + 10} Q${AX} ${y - 22} ${AX + l} ${y + 10}`} fill="none" stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={o} />;
      })}
      {/* La réponse redescend, et s'étire. */}
      {avance > 0 ? (
        <g>
          <path d={ONDULEE_D} fill="none" stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${cible} ${total + 10}`} />
          <circle cx={tete[0]} cy={tete[1]} r={10 + Math.sin(f / 7) * 1.5} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
        </g>
      ) : null}
    </Scene>
  );
};

/* ---------------------------------------------------------------- Plan 13 : L'autorité -------- */

const IlluMarionnette: React.FC<PropsIllustration> = ({ f, d }) => {
  const piece = p(f, d[0] + 8, d[0] + 56);
  const feu = p(f, d[0] + 56, d[0] + 90);
  const BRULE = [d[0] + 112, d[1] + 20, d[1] + 110, d[1] + 195];
  const brules = BRULE.map((a) => p(f, a, a + 55));
  const libres = brules.reduce((s, b) => s + b, 0) / 4;
  const HX = 400;
  const HY = mix(462, 410, libres);
  const S = 2;
  const ang = (-24 + Math.sin(f / 13) * 6) * (1 - libres) + Math.sin(f / 30) * 1 * libres;
  const rad = (ang * Math.PI) / 180;
  const FILS = [
    { bx: 290, by: 118, ax: -48, ay: -98 },
    { bx: 130, by: 118, ax: -89, ay: -14 },
    { bx: 510, by: 118, ax: 48, ay: -98 },
    { bx: 670, by: 118, ax: 89, ay: -14 },
  ];
  const ORDRE = [1, 2, 0, 3];
  const battement = 1 + 0.03 * Math.sin(f / 10) * libres;
  const sourd = 1 - 0.45 * libres;
  return (
    <Scene>
      <g opacity={sourd}>
        <Libelle x={210} y={72} taille={32} graisse={600}>{LIBELLES.argent}</Libelle>
        <Libelle x={590} y={72} taille={32} graisse={600}>{LIBELLES.materialisme}</Libelle>
        <Baton d="M90 104 H330" l={13} />
        <Baton d="M470 104 H710" l={13} />
      </g>
      {FILS.map((q, i) => {
        const b = brules[ORDRE.indexOf(i)];
        const ax = HX + q.ax * Math.cos(rad) - q.ay * Math.sin(rad);
        const ay = HY + q.ax * Math.sin(rad) + q.ay * Math.cos(rad);
        const fx = mix(ax, q.bx, b);
        const fy = mix(ay, q.by, b);
        return (
          <g key={i}>
            {b < 1 ? <line x1={q.bx} y1={q.by} x2={fx} y2={fy} stroke={F.encre} strokeWidth={3.5} strokeLinecap="round" /> : null}
            {b > 0 && b < 1 ? <Flamme x={fx} y={fy + 10} s={0.2} f={f} graine={i} /> : null}
          </g>
        );
      })}
      <circle cx={HX} cy={HY - 6} r={150 * libres} fill={F.orClair} opacity={0.3 * libres} />
      <g transform={`rotate(${ang} ${HX} ${HY})`}>
        <Coeur x={HX} y={HY} s={S * battement} />
      </g>
      <Sol y={850} x1={150} x2={650} />
      <Autel x={400} y={850} s={0.82} />
      <Flamme x={402} y={850 - 122} s={0.7 * feu} f={f} />
      {/* Les étincelles montent de l'autel vers les fils. */}
      {feu > 0 && libres < 1
        ? Array.from({ length: 5 }, (_, i) => {
            const t = (((f + i * 24) / 120) % 1 + 1) % 1;
            return <circle key={i} cx={400 + Math.sin(t * 7 + i) * 60 * t} cy={mix(650, 560, t)} r={4.5} fill={F.or} opacity={(1 - t) * feu} />;
          })
        : null}
      {piece > 0 ? <Piece x={mix(720, 400, piece)} y={mix(520, 700, piece) - Math.sin(piece * Math.PI) * 90} r={25} opacite={Math.min(1, piece * 4) * (1 - feu * 0.9)} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------- Plan 14 : La dîme de tout ------ */

const IlluDime: React.FC<PropsIllustration> = ({ f, d }) => {
  const pain = p(f, d[0] + 18, d[0] + 62);
  const coupe = p(f, d[0] + 70, d[0] + 114);
  const benit = p(f, d[1] - 10, d[1] + 40);
  const urne = p(f, d[1] + 40, d[1] + 90);
  const remplit = p(f, d[2] - 40, d[3] + 20);
  const sort = p(f, d[3] + 15, d[3] + 110);
  const cTerme = p(f, d[3] + 50, d[3] + 95);
  const HAUT = 216;
  const BAS = 800;
  const niveau = mix(BAS, HAUT, remplit);
  const JARRE = 'M352 210 H468 L456 268 C506 288 566 350 566 470 C566 620 510 740 490 800 H330 C310 740 254 620 254 470 C254 350 314 288 364 268 Z';
  const vague = Array.from({ length: 13 }, (_, i) => `${240 + i * 28} ${niveau + Math.sin(i * 1.3 + f / 9) * 4}`).join(' L');
  const bord = Math.max(0, (sort - 0.05) * 1.1);
  return (
    <Scene>
      <defs>
        <clipPath id="c10-jarre"><path d={JARRE} /></clipPath>
        <linearGradient id="c10-sortie" x1="600" y1="0" x2="800" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset={0} stopColor="#fff" stopOpacity={1} />
          <stop offset={0.65} stopColor="#fff" stopOpacity={1} />
          <stop offset={1} stopColor="#fff" stopOpacity={0} />
        </linearGradient>
        <mask id="c10-masque" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}>
          <rect x={0} y={0} width={800} height={900} fill="url(#c10-sortie)" />
        </mask>
      </defs>
      <Rayons x={410} ouvert={benit} long={96} n={9} ecart={60} />
      <Sol y={800} x1={24} x2={585} />
      <Pierre x={124} y={800} l={196} h={72} />
      {/* Le pain et la coupe se posent. */}
      <g opacity={Math.min(1, pain * 2)} transform={`translate(0 ${(1 - pain) * -220})`}>
        <path d="M34 730 Q30 680 80 672 Q122 666 134 702 Q140 722 130 730 Z" fill={F.orClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M60 686 l14 16 M84 680 l14 18 M106 684 l12 16" stroke={F.orFonce} strokeWidth={4} strokeLinecap="round" />
      </g>
      <g opacity={Math.min(1, coupe * 2)} transform={`translate(0 ${(1 - coupe) * -220})`}>
        <path d="M152 618 H212 Q212 668 188 678 V716 H208 V730 H156 V716 H176 V678 Q152 668 152 618 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M156 632 H208 Q206 660 182 668 Q158 660 156 632 Z" fill={F.argile} />
      </g>
      {/* Le grand récipient : l'or clair monte jusqu'au bord. */}
      <g opacity={urne}>
        <path d={JARRE} fill={F.papier} />
        <g clipPath="url(#c10-jarre)">
          <path d={`M${vague} L580 ${BAS + 10} H240 Z`} fill={F.orClair} />
          <path d={`M${vague}`} fill="none" stroke={F.or} strokeWidth={5} />
        </g>
        <g opacity={cTerme}>
          <Coeur x={410} y={510} s={1.5} rempli={F.papier} contour={F.orFonce} />
        </g>
        <path d={JARRE} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <rect x={336} y={196} width={148} height={20} rx={8} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <path d="M284 430 q-6 70 14 150" fill="none" stroke={F.papier} strokeWidth={8} strokeLinecap="round" opacity={0.75} />
      </g>
      {/* Faute de place, les biens glissent et sortent. */}
      <path d="M588 802 L772 830" stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      <g mask="url(#c10-masque)">
        <g transform={`translate(${bord * 270} ${bord * 41})`}>
          <Ballot x={672} y={814} texte={LIBELLES.biens} rotation={8.5} tailleTexte={30} />
        </g>
      </g>
    </Scene>
  );
};

/* ----------------------------------------------------------------- Plan 15 : La clarté -------- */

const ROUTE = (() => {
  const n = 50;
  const c = (t: number) => {
    const y = 330 + 530 * (1 - t) * (1 - t);
    const x = 410 + Math.sin(t * 8.2 + 0.4) * 180 * Math.pow(1 - t, 1.1) + 60 * t;
    const l = mix(250, 4, Math.pow(t, 0.55));
    return { x, y, l };
  };
  const g: string[] = [];
  const dr: string[] = [];
  const tirets: { x1: number; y1: number; x2: number; y2: number; e: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const q = c(t);
    g.push(`${q.x - q.l / 2} ${q.y}`);
    dr.unshift(`${q.x + q.l / 2} ${q.y}`);
  }
  for (let i = 0; i < 18; i++) {
    const a = c(i / 18);
    const b = c((i + 0.5) / 18);
    tirets.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, e: Math.max(1.5, a.l * 0.035) });
  }
  return { d: `M${g.join(' L')} L${dr.join(' L')} Z`, tirets };
})();

const COLLINES = 'M24 334 Q130 262 250 312 Q340 262 460 322 Q560 270 660 308 Q730 280 776 334 V860 H24 Z';

const IlluClarte: React.FC<PropsIllustration> = ({ f, d }) => {
  const offrande = p(f, d[0] + 8, d[0] + 55);
  const leve = p(f, d[0] + 35, d[1] + 230);
  const BRUME = Array.from({ length: 40 }, (_, i) => ({
    x: 70 + hasard(i, 1) * 660,
    y: 860 - (i / 39) * 660,
    rx: 150 + hasard(i, 2) * 130,
    ry: 50 + hasard(i, 3) * 36,
    seuil: i / 39,
  }));
  return (
    <Scene>
      <defs>
        <filter id="c10-flou" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="14" /></filter>
        <filter id="c10-flou-horizon" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="18" /></filter>
        {/* La brume épouse le paysage et s'efface doucement au-dessus des collines. */}
        <mask id="c10-paysage" maskUnits="userSpaceOnUse" x={24} y={0} width={752} height={860}>
          <path d={COLLINES} fill="#fff" filter="url(#c10-flou-horizon)" />
          <path d={COLLINES} fill="#fff" />
        </mask>
      </defs>
      <circle cx={468} cy={325} r={46 + 60 * leve} fill={F.orClair} opacity={0.3 + 0.5 * leve} />
      <path d={COLLINES} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M24 334 Q240 322 468 330 Q640 322 776 334 V860 H24 Z" fill={F.filet} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <path d={ROUTE.d} fill={F.papier} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
      {ROUTE.tirets.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={F.orFonce} strokeWidth={t.e} strokeLinecap="round" />
      ))}
      <g mask="url(#c10-paysage)">
      <g filter="url(#c10-flou)">
        {BRUME.map((b, i) => {
          const local = Math.max(0, Math.min(1, (leve - b.seuil * 0.82) / 0.18));
          if (local >= 1) return null;
          return <ellipse key={i} cx={b.x + Math.sin(f / 40 + i) * 16} cy={b.y - local * 70} rx={b.rx} ry={b.ry} fill={i % 3 === 0 ? F.parchemin : F.papier} opacity={0.97 * (1 - local)} />;
        })}
        <rect x={40} y={190} width={720} height={670} rx={60} fill={F.papier} opacity={0.55 * (1 - p(f, d[0] + 35, d[0] + 170))} />
      </g>
      </g>
      {/* L'offrande au bord de la route. */}
      <g opacity={Math.min(1, offrande * 2)} transform={`translate(0 ${(1 - offrande) * -160})`}>
        <Pierre x={112} y={812} l={136} h={46} />
        <Gerbe x={112} y={768} s={0.68} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------- Plan 16 : Le prix -------- */

const Cintre: React.FC<{ x: number; y: number; l?: number }> = ({ x, y, l = 92 }) => (
  <g>
    <path d={`M${x} ${y + 46} V${y + 18} a14 14 0 1 0 -14 -14`} fill="none" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
    <path d={`M${x - l} ${y + 84} L${x} ${y + 46} L${x + l} ${y + 84}`} fill="none" stroke={F.encre} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
  </g>
);

const IlluPrix: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 24);
  const jauge1 = p(f, d[0] + 25, d[1] - 20);
  const jauge2 = p(f, d[2], d[2] + 110);
  const niveau = 0.05 + 0.5 * jauge1 + 0.45 * jauge2;
  const friperie = p(f, d[1] - 4, d[1] + 28);
  const terne = p(f, d[1] + 10, d[1] + 70);
  const lueur = niveau;
  const HJ = 560;
  const YJ = 190;
  const FILS = [
    'M216 310 Q250 480 196 716',
    'M250 310 Q262 500 236 734',
    'M286 310 Q280 500 290 742',
    'M322 310 Q310 500 344 734',
    'M356 310 Q320 480 384 716',
  ];
  return (
    <Scene>
      <Baton d="M36 112 H764" l={10} c={F.cuir} />
      {/* La jauge. */}
      <g opacity={entree}>
        <rect x={46} y={YJ} width={44} height={HJ} rx={22} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <clipPath id="c10-jauge"><rect x={50} y={YJ + 4} width={36} height={HJ - 8} rx={18} /></clipPath>
        <rect x={50} y={YJ + 4 + (HJ - 8) * (1 - niveau)} width={36} height={(HJ - 8) * niveau} fill={F.or} clipPath="url(#c10-jauge)" />
        {[0.2, 0.4, 0.6, 0.8].map((t) => (
          <line key={t} x1={46} x2={64} y1={YJ + HJ * t} y2={YJ + HJ * t} stroke={F.encre2} strokeWidth={3} />
        ))}
        <Libelle x={72} y={798} taille={30} graisse={600} couleur={F.orFonce}>{LIBELLES.prix}</Libelle>
      </g>
      {/* La robe filée d'or. */}
      <ellipse cx={288} cy={480} rx={120 + 60 * lueur} ry={290 + 40 * lueur} fill={F.orClair} opacity={0.65 * lueur} />
      <Cintre x={288} y={120} />
      <path d="M212 204 Q250 226 288 226 Q326 226 364 204 L376 306 Q350 324 342 332 Q394 520 440 744 Q288 790 136 744 Q182 520 234 332 Q226 324 200 306 Z" fill={F.argile} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M234 332 Q288 352 342 332" fill="none" stroke={F.orClair} strokeWidth={8} strokeLinecap="round" />
      <g>
        {FILS.map((c, i) => (
          <path key={i} d={c} fill="none" stroke={F.orClair} strokeWidth={4.5} strokeLinecap="round" {...tracePartiel(p(f, d[0] + 25 + i * 16, d[1] + i * 16))} opacity={niveau > 0.08 ? 1 : 0} />
        ))}
      </g>
      {[{ x: 150, y: 330 }, { x: 430, y: 410 }, { x: 118, y: 640 }, { x: 462, y: 620 }].map((q, i) => (
        <Eclat key={i} x={q.x} y={q.y} r={(10 + 12 * jauge2) + Math.sin(f / 9 + i * 2) * 3} opacite={jauge2} couleur={F.or} />
      ))}
      {/* Le vêtement de friperie. */}
      <Cintre x={622} y={120} />
      <g opacity={mix(1, 0.72, terne)}>
        <path d="M566 204 Q594 222 622 222 Q650 222 678 204 L744 268 L712 318 L686 298 L692 590 L676 578 L660 592 L644 578 L626 592 L610 578 L594 592 L576 578 L552 590 L558 298 L532 318 L500 268 Z" fill={interpolateColors(terne, [0, 1], [F.cuirClair, F.filet])} stroke={F.encre2} strokeWidth={4.5} strokeLinejoin="round" />
        <rect x={586} y={350} width={58} height={50} fill={F.parchemin} stroke={F.encre2} strokeWidth={3.5} strokeDasharray="7 5" transform="rotate(-6 615 375)" />
        <rect x={634} y={468} width={40} height={42} fill={F.parchemin} stroke={F.encre2} strokeWidth={3.5} strokeDasharray="7 5" transform="rotate(8 654 489)" />
      </g>
      <g opacity={friperie} transform={`translate(0 ${(1 - friperie) * 10})`}>
        <Libelle x={622} y={672} taille={38} graisse={600} couleur={F.encre2}>{LIBELLES.friperie}</Libelle>
      </g>
    </Scene>
  );
};

/* --------------------------------------------------------------- Plan 17 : La montagne -------- */

const IlluMontagne: React.FC<PropsIllustration> = ({ f, d }) => {
  const CHEMIN: [number, number][] = [[120, 836], [620, 760], [270, 672], [530, 592], [318, 500]];
  const monte = p(f, 6, d[1] - 12);
  const segs = CHEMIN.length - 1;
  const u = monte * segs;
  const iSeg = Math.min(segs - 1, Math.floor(u));
  const t = u - iSeg;
  const bx = mix(CHEMIN[iSeg][0], CHEMIN[iSeg + 1][0], t);
  const by = mix(CHEMIN[iSeg][1], CHEMIN[iSeg + 1][1], t);
  const rayons = p(f, d[1] - 6, d[1] + 50);
  const belier = p(f, d[1] + 30, d[2] + 20);
  const echange = p(f, d[3], d[3] + 40);
  const pose = p(f, d[1] + 170, d[1] + 200);
  return (
    <Scene>
      <Rayons x={490} ouvert={rayons} long={mix(190, 320, echange)} n={11} ecart={50} opacite={mix(0.8, 1, echange)} />
      <path d="M26 870 L232 500 H600 L774 870 Z" fill={F.filet} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
      <path d="M232 500 L196 566 L240 540 L268 590 L296 530 H360 L396 566 L446 516 L500 566 L540 526 L580 556 L600 500 Z" fill={F.papier} stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" />
      <path d={`M${CHEMIN.map((q) => q.join(' ')).join(' L')}`} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="4 13" strokeLinecap="round" transform="translate(0 8)" />
      <circle cx={bx} cy={by - 50} r={110 * echange} fill={F.orClair} opacity={0.4 * echange} />
      <Ballot x={bx} y={by} texte={LIBELLES.tonTout} />
      {belier > 0 ? <Agneau x={498} y={mix(110, 500, belier)} s={1.05} sens={-1} laine={F.orClair} cornes opacite={Math.min(1, belier * 5)} /> : null}
      {/* Un tout contre un tout : la lumière passe de l'un à l'autre. */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const c = (((f / 44 + i / 6) % 1) + 1) % 1;
        const x = mix(bx + 40, 450, c);
        const y = mix(by - 110, by - 110, c) - Math.sin(c * Math.PI) * 60;
        return <Eclat key={i} x={x} y={y} r={11} opacite={echange * pose * Math.sin(c * Math.PI)} />;
      })}
    </Scene>
  );
};

/* ---------------------------------------------------- Plan 18 : Supplier pour donner ---------- */

const Plat: React.FC<{ x: number; y: number; i: number; a: number }> = ({ x, y, i, a }) => (
  <g opacity={Math.min(1, a * 2)} transform={`translate(${x} ${y - (1 - a) * 22})`}>
    {i % 3 === 0 ? <path d="M-22 -10 Q-22 -34 0 -34 Q22 -34 22 -10 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} /> : null}
    {i % 3 === 1 ? <path d="M-14 -10 V-30 H14 V-10 Z" fill={F.papier} stroke={F.encre} strokeWidth={3} /> : null}
    {i % 3 === 2 ? <circle cx={0} cy={-22} r={13} fill={F.argile} stroke={F.encre} strokeWidth={3} /> : null}
    <path d="M-28 -10 H28 Q24 0 14 0 H-14 Q-24 0 -28 -10 Z" fill={F.papier} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
  </g>
);

const IlluTente: React.FC<PropsIllustration> = ({ f, d }) => {
  const CX = 400;
  const CY = 480;
  const RX = 282;
  const RY = 168;
  const chaleur = p(f, d[1], d[1] + 50);
  const T = d[2];
  const TF = d[3] + 200;
  const u = Math.max(0, Math.min(1, (f - T) / (TF - T)));
  const tours = 6.2 * u * u;
  const pos = (n: number) => {
    const a = Math.PI + n * Math.PI * 2;
    return { x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
  };
  const plats = [0, 1, 2, 3, 4, 5];
  const vitesse = (tours - 6.2 * Math.max(0, u - 0.02) ** 2) * 2.5;
  return (
    <Scene>
      {/* Le grand soleil. */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2 + f / 240;
        const r1 = 90 + 4 * Math.sin(f / 9 + i);
        const r2 = r1 + (i % 2 === 0 ? 40 : 24) + 8 * chaleur;
        return <line key={i} x1={400 + Math.cos(a) * r1} y1={150 + Math.sin(a) * r1} x2={400 + Math.cos(a) * r2} y2={150 + Math.sin(a) * r2} stroke={F.or} strokeWidth={8} strokeLinecap="round" />;
      })}
      <circle cx={400} cy={150} r={76 + 3 * chaleur * Math.sin(f / 10)} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} />
      {/* La chaleur qui tremble. */}
      {[{ x: 130, y: 110 }, { x: 650, y: 100 }, { x: 110, y: 200 }, { x: 680, y: 200 }].map((q, i) => (
        <path key={i} d={`M${q.x - 44} ${q.y + Math.sin(f / 8 + i) * 4} q11 -14 22 0 t22 0 t22 0 t22 0`} fill="none" stroke={F.or} strokeWidth={4.5} strokeLinecap="round" opacity={chaleur * 0.85} />
      ))}
      {/* Le chemin. */}
      <ellipse cx={CX} cy={CY} rx={RX} ry={RY} fill="none" stroke={F.encre2} strokeWidth={5} strokeDasharray="4 15" strokeLinecap="round" />
      {/* La traînée et le point d'or. */}
      {[5, 4, 3, 2, 1].map((k) => {
        const q = pos(Math.max(0, tours - k * Math.min(0.03, Math.max(0, vitesse) * 0.5 + 0.004)));
        return <circle key={k} cx={q.x} cy={q.y} r={15 - k * 1.8} fill={F.or} opacity={0.13 * (6 - k) * (u > 0 ? 1 : 0)} />;
      })}
      {u > 0 || f > d[1] ? <circle cx={pos(tours).x} cy={pos(tours).y} r={16} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} /> : null}
      {/* La tente. */}
      <g>
        <path d="M18 500 L132 306 L248 500 Z" fill={F.papier} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
        <path d="M132 306 L92 500 H172 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M58 448 L92 500 M206 448 L172 500" stroke={F.encre2} strokeWidth={3} />
        <path d="M132 306 V284" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
        <path d="M132 284 l26 9 l-26 9 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {/* Le troupeau. */}
      <Sol y={450} x1={418} x2={622} couleur={F.encre2} />
      <Sol y={540} x1={468} x2={572} couleur={F.encre2} />
      <Agneau x={460} y={450} s={0.62} />
      <Agneau x={570} y={450} s={0.62} />
      <Agneau x={515} y={540} s={0.62} />
      {/* La table. */}
      <rect x={186} y={694} width={428} height={18} rx={5} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d="M216 712 L204 840 M584 712 L596 840" stroke={F.encre} strokeWidth={12} strokeLinecap="round" />
      <path d="M216 712 L204 840 M584 712 L596 840" stroke={F.cuir} strokeWidth={6} strokeLinecap="round" />
      <Sol y={844} x1={140} x2={660} couleur={F.encre2} />
      {plats.map((i) => {
        const passage = 0.75 + i;
        const a = Math.max(0, Math.min(1, (tours - passage) / 0.12));
        return a > 0 ? <Plat key={i} x={240 + i * 64} y={694} i={i} a={a} /> : null;
      })}
    </Scene>
  );
};

/* ----------------------------------------------------------- Plan 19 : Le don débloque -------- */

const Cadenas: React.FC<{ x: number; y: number; ouvert: number; secoue: number }> = ({ x, y, ouvert, secoue }) => (
  <g transform={`translate(${x + secoue} ${y})`}>
    <g transform={`translate(0 ${-20 * ouvert}) rotate(${-32 * ouvert} 30 -30)`}>
      <path d="M-30 -30 V-58 A30 30 0 0 1 30 -58 V-30" fill="none" stroke={F.encre} strokeWidth={16} strokeLinecap="butt" />
      <path d="M-30 -30 V-58 A30 30 0 0 1 30 -58 V-30" fill="none" stroke={interpolateColors(ouvert, [0, 1], [F.encre2, F.orClair])} strokeWidth={8} />
    </g>
    <rect x={-50} y={-34} width={100} height={84} rx={12} fill={interpolateColors(ouvert, [0, 1], [F.encre2, F.or])} stroke={F.encre} strokeWidth={4} />
    <circle cx={0} cy={0} r={11} fill={F.encre} />
    <path d="M-6 2 L-10 28 H10 L6 2 Z" fill={F.encre} />
  </g>
);

const CleGalette: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r})`}>
    <path d="M0 22 V82 M0 62 H16 M0 76 H20" fill="none" stroke={F.encre} strokeWidth={13} strokeLinecap="round" />
    <path d="M0 22 V82 M0 62 H16 M0 76 H20" fill="none" stroke={F.orClair} strokeWidth={6} strokeLinecap="round" />
    <circle cx={0} cy={0} r={32} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
    <circle cx={0} cy={0} r={23} fill="none" stroke={F.orFonce} strokeWidth={2.5} strokeDasharray="3 6" />
    {[[-9, -8], [9, -10], [0, 3], [-11, 10], [11, 10]].map(([a, b], i) => (
      <circle key={i} cx={a} cy={b} r={3} fill={F.orFonce} />
    ))}
  </g>
);

const IlluCadenas: React.FC<PropsIllustration> = ({ f, d }) => {
  const XS = [100, 250, 400, 550, 700];
  const Y = 760;
  const apparait = (i: number) => p(f, 6 + i * 12, 26 + i * 12);
  const arrivee = p(f, d[1] - 10, d[1] + 25);
  const debut = d[1] + 40;
  const fin = d[3] - 15;
  const pas = (fin - debut) / XS.length;
  const ouvert = (i: number) => p(f, debut + i * pas + pas * 0.62, debut + i * pas + pas * 0.92);
  const u = Math.max(0, (f - debut) / pas);
  const i = Math.min(XS.length - 1, Math.floor(u));
  const base = debut + i * pas;
  // À chaque cadenas : le vol, la descente jusqu'à la serrure, le tour de clé, la remontée.
  const vol = p(f, base, base + pas * 0.32);
  const descend = p(f, base + pas * 0.32, base + pas * 0.5);
  const tour = p(f, base + pas * 0.5, base + pas * 0.62);
  const remonte = p(f, base + pas * 0.88, base + pas);
  const pres = descend * (1 - remonte);
  // On place le bout de la clé, puis la tête s'en déduit : penchée, elle dégage l'anse.
  const LONG_CLE = 82;
  const ANGLE_CLE = 54;
  const CROISIERE = Y - 200;
  const depuisX = i === 0 ? XS[0] - 40 : XS[i - 1];
  const boutX = mix(depuisX, XS[i], vol);
  const boutY = mix(CROISIERE + LONG_CLE, Y - 2, pres) - Math.sin(vol * Math.PI) * 26;
  const angleCle = ANGLE_CLE * pres - Math.sin(tour * Math.PI) * 14 * (1 - remonte);
  const radCle = (angleCle * Math.PI) / 180;
  const cx = boutX + LONG_CLE * Math.sin(radCle);
  const cy = boutY - LONG_CLE * Math.cos(radCle);
  const porte = p(f, d[3] + 5, d[3] + 90);
  const lumiere = p(f, d[3] + 35, d[3] + 220);
  const secousse = (k: number) => Math.sin(f / 2.2 + k * 2) * 4 * (1 - p(f, d[0] + 60, d[0] + 110)) * p(f, d[0], d[0] + 20);
  const PX = 290;
  const PW = 220;
  const PY = 72;
  const PH = 352;
  const larg = mix(PW, 46, porte);
  return (
    <Scene>
      {/* La lumière derrière la porte : elle gagne l'image. */}
      {Array.from({ length: 13 }, (_, k) => {
        const a = ((-170 + k * 13.33) * Math.PI) / 180;
        const cxl = PX + PW / 2;
        const cyl = PY + PH * 0.55;
        const r1 = 200;
        const r2 = 200 + 96 * lumiere * (k % 2 === 0 ? 1 : 0.7);
        const y2 = cyl + Math.sin(a) * r2;
        const y1 = cyl + Math.sin(a) * r1;
        return <line key={k} x1={cxl + Math.cos(a) * r1} y1={y1} x2={cxl + Math.cos(a) * r2} y2={Math.max(14, y2)} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={lumiere} />;
      })}
      <path d={`M${PX - 20} ${PY + PH + 12} V${PY + 90} A${PW / 2 + 20} ${PW / 2 + 20} 0 0 1 ${PX + PW + 20} ${PY + 90} V${PY + PH + 12} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M${PX} ${PY + PH} V${PY + 90} A${PW / 2} ${PW / 2} 0 0 1 ${PX + PW} ${PY + 90} V${PY + PH} Z`} fill={interpolateColors(porte, [0, 1], [F.encre2, F.orClair])} stroke={F.encre} strokeWidth={4} />
      <clipPath id="c10-porte"><path d={`M${PX} ${PY + PH} V${PY + 90} A${PW / 2} ${PW / 2} 0 0 1 ${PX + PW} ${PY + 90} V${PY + PH} Z`} /></clipPath>
      <g clipPath="url(#c10-porte)">
        <path d={`M${PX} ${PY - 40} L${PX + larg} ${PY - 40 + 24 * porte} V${PY + PH - 16 * porte} L${PX} ${PY + PH} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {[0.28, 0.5, 0.72].map((v) => (
          <line key={v} x1={PX + larg * v} x2={PX + larg * v} y1={PY - 30} y2={PY + PH} stroke={F.encre} strokeWidth={3} opacity={0.6} />
        ))}
        <circle cx={PX + larg - 16} cy={PY + PH * 0.6} r={8} fill={F.or} stroke={F.encre} strokeWidth={3} />
      </g>
      <rect x={PX - 50} y={PY + PH + 10} width={PW + 100} height={22} rx={6} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {/* Les cadenas. */}
      <Sol y={Y + 62} x1={30} x2={770} couleur={F.encre2} />
      {XS.map((x, k) => (
        <g key={x} opacity={apparait(k)}>
          <Cadenas x={x} y={Y} ouvert={ouvert(k)} secoue={secousse(k)} />
        </g>
      ))}
      {/* La petite clé en forme de galette. */}
      {arrivee > 0 ? (
        <g opacity={arrivee}>
          <CleGalette x={cx} y={cy} r={angleCle} />
        </g>
      ) : null}
    </Scene>
  );
};

/* ----------------------------------------------------------------------- Plan 20 : Fin ------- */

const IlluFinCh10: React.FC<PropsIllustration> = ({ f }) => {
  const monte = p(f, 0, 90);
  const lueur = p(f, 40, 150);
  return (
    <Scene>
      <Thermometre x={120} y={150} h={560} l={58} niveau={mix(0.72, 1, monte)} />
      <circle cx={500} cy={360} r={110 + 120 * lueur} fill={F.orClair} opacity={0.34 * lueur} />
      {Array.from({ length: 13 }, (_, i) => {
        const a = ((-168 + i * 13) * Math.PI) / 180;
        const r1 = 225 + 6 * Math.sin(f / 9 + i);
        const r2 = r1 + (i % 2 === 0 ? 44 : 28);
        return <line key={i} x1={500 + Math.cos(a) * r1} y1={380 + Math.sin(a) * r1} x2={500 + Math.cos(a) * r2} y2={380 + Math.sin(a) * r2} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={lueur} />;
      })}
      <Sol y={790} x1={270} x2={760} />
      <AutelSimple x={500} y={790} />
      <Flamme x={506} y={586} s={mix(0.85, 2.1, monte)} f={f} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluReflexe,
  p3: IlluRegard,
  p4: IlluRecu,
  p5: IlluCarnet,
  p6: IlluTube,
  p7: IlluRoi,
  p8: IlluPremices,
  p9: IlluRouleau,
  p10: IlluNoe,
  p11: IlluParfum,
  p12: IlluReponse,
  p13: IlluMarionnette,
  p14: IlluDime,
  p15: IlluClarte,
  p16: IlluPrix,
  p17: IlluMontagne,
  p18: IlluTente,
  p19: IlluCadenas,
  fin: IlluFinCh10,
};

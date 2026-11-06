import React from 'react';
import { Easing, interpolate } from 'remotion';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';
import { OUVERTURE } from './textes.gen';

const borne = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;
/** Progression linéaire, sans adoucissement. */
const lin = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], borne);
/** Chute : lente au départ, de plus en plus rapide. */
const chute = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { ...borne, easing: Easing.in(Easing.quad) });
/** Petit rebond amorti après l'image `a`. */
const rebond = (f: number, a: number, force = 16) => (f <= a ? 0 : -Math.abs(Math.sin((f - a) / 4.5)) * force * Math.exp(-(f - a) / 9));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (a: number) => (a * Math.PI) / 180;
const reste = (x: number) => x - Math.floor(x);

/** Rayons de lumière autour d'un point, sur un arc donné (en degrés). */
const Rayons: React.FC<{ x: number; y: number; r1: number; r2: number; de?: number; a?: number; n?: number; o?: number; epaisseur?: number }> = ({ x, y, r1, r2, de = 0, a = 360, n = 12, o = 1, epaisseur = 6 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const t = rad(de + (i * a) / (a === 360 ? n : n - 1));
      return <line key={i} x1={x + Math.cos(t) * r1} y1={y + Math.sin(t) * r1} x2={x + Math.cos(t) * r2} y2={y + Math.sin(t) * r2} stroke={F.or} strokeWidth={epaisseur} strokeLinecap="round" />;
    })}
  </g>
);

/** Le haut d'un liquide en petites vagues, jusqu'à `bas`. */
const nappe = (x1: number, x2: number, y: number, bas: number, f: number, amp = 4) => {
  const pas = 24;
  const n = Math.ceil((x2 - x1) / pas);
  const points = Array.from({ length: n + 1 }, (_, i) => {
    const x = x1 + ((x2 - x1) * i) / n;
    return `${x} ${y + Math.sin(x / 34 + f / 9) * amp}`;
  });
  return `M${points.join(' L')} L${x2} ${bas} L${x1} ${bas} Z`;
};

/* ---------- Le coffret : le fond (couvercle, intérieur) et la face, pour que des objets sortent entre les deux. ---------- */

const CoffretFond: React.FC<{ x: number; y: number; s: number; ouvre: number; lueur: number }> = ({ x, y, s, ouvre, lueur }) => {
  const dos = -170 - 44 * ouvre;
  const W = 176 - 28 * ouvre;
  const H = 82 + 52 * ouvre;
  const arche = `M${-W} ${dos} C${-W} ${dos - H * 1.28} ${W} ${dos - H * 1.28} ${W} ${dos} Z`;
  const interieur = p(ouvre, 0.35, 0.8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={arche} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      <path d={arche} fill={F.cuir} opacity={interieur} />
      <path d={`M${-W * 0.62} ${dos} Q${-W * 0.5} ${dos - H * 0.8} 0 ${dos - H * 0.96} Q${W * 0.5} ${dos - H * 0.8} ${W * 0.62} ${dos}`} fill="none" stroke={F.encre} strokeWidth={3} opacity={interieur} />
      {ouvre > 0 ? (
        <>
          <path d={`M-170 -170 L170 -170 L148 ${dos} L-148 ${dos} Z`} fill={F.encre} />
          <path d={`M-170 -170 L170 -170 L148 ${dos} L-148 ${dos} Z`} fill={F.orClair} opacity={lueur} />
        </>
      ) : null}
    </g>
  );
};

const CoffretFace: React.FC<{ x: number; y: number; s: number; ouvre: number; ruban?: number }> = ({ x, y, s, ouvre, ruban = 0 }) => {
  const noeud = p(ruban, 0.45, 1);
  const bandes = p(ruban, 0, 0.55);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-170} y={-170} width={340} height={170} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} vectorEffect="non-scaling-stroke" />
      {[-115, -60].map((l) => (
        <line key={l} x1={-168} x2={168} y1={l} y2={l} stroke={F.cuirClair} strokeWidth={4} />
      ))}
      {[-1, 1].map((c) => (
        <g key={c}>
          <path d={`M${c * 170} -170 h${-c * 42} v14 h${c * 28} v28 h${c * 14} Z`} fill={F.or} stroke={F.encre} strokeWidth={2.5} strokeLinejoin="round" />
          <path d={`M${c * 170} 0 h${-c * 42} v-14 h${c * 28} v-28 h${c * 14} Z`} fill={F.or} stroke={F.encre} strokeWidth={2.5} strokeLinejoin="round" />
        </g>
      ))}
      {ouvre < 0.06 || ruban === 0 ? <rect x={-22} y={-178} width={44} height={38} rx={5} fill={F.or} stroke={F.encre} strokeWidth={3} /> : null}
      {ruban === 0 ? <circle cx={0} cy={-158} r={6} fill={F.encre} /> : null}
      {bandes > 0 ? (
        <g>
          <rect x={-18} y={-105 - 145 * bandes} width={36} height={250 * bandes} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
          <rect x={-170 * bandes} y={-123} width={340 * bandes} height={36} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
        </g>
      ) : null}
      {noeud > 0 ? (
        <g transform={`translate(0 -105) scale(${noeud})`}>
          <path d="M-8 6 L-46 64 L-22 58 L-14 78 L8 8 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path d="M8 6 L46 64 L22 58 L14 78 L-8 8 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path d="M0 0 C-30 -44 -86 -38 -78 -4 C-74 22 -28 18 0 0 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <path d="M0 0 C30 -44 86 -38 78 -4 C74 22 28 18 0 0 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
          <rect x={-14} y={-14} width={28} height={28} rx={7} fill={F.or} stroke={F.encre} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
};

/* ---------- Plan 1 : le ruban se dénoue, une lueur sort du couvercle entrouvert. ---------- */

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const entree = p(f, 0, 22);
  const denoue = 1 - p(f, 40, 105);
  const ouvre = 0.28 * p(f, 105, 160);
  const lueur = p(f, 112, 175);
  const auteur = p(f, 70, 94);
  const X = 400;
  const SOL = 620;
  const S = 1.25;
  const libre = 1 - denoue;
  return (
    <Scene>
      <g opacity={entree}>
        <defs>
          <radialGradient id="ch13-lueur">
            <stop offset="0%" stopColor={F.orClair} stopOpacity={0.95} />
            <stop offset="100%" stopColor={F.orClair} stopOpacity={0} />
          </radialGradient>
        </defs>
        <ellipse cx={X} cy={SOL - 225} rx={330} ry={250} fill="url(#ch13-lueur)" opacity={lueur} />
        <Rayons x={X} y={SOL - 225} r1={150 + 12 * lueur} r2={150 + 110 * lueur} de={-158} a={136} n={9} o={lueur} epaisseur={7} />
        <line x1={120} x2={680} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
        <CoffretFond x={X} y={SOL} s={S} ouvre={ouvre} lueur={lueur} />
        <CoffretFace x={X} y={SOL} s={S} ouvre={ouvre} ruban={denoue} />
        {/* Le ruban défait, posé au sol. */}
        <path d={`M${X - 215} ${SOL + 16} q 42 -26 86 0 t 86 0 t 86 0 t 86 0 t 86 0`} fill="none" stroke={F.encre} strokeWidth={15} strokeLinecap="round" opacity={libre} />
        <path d={`M${X - 215} ${SOL + 16} q 42 -26 86 0 t 86 0 t 86 0 t 86 0 t 86 0`} fill="none" stroke={F.orClair} strokeWidth={9} strokeLinecap="round" opacity={libre} />
      </g>
      <Libelle x={X} y={735} taille={38} graisse={600} opacite={auteur}>{OUVERTURE.auteur}</Libelle>
    </Scene>
  );
};

/* ---------- Plan 2 : le coffret livre ses étiquettes ; une pousse grandit seule. ---------- */

const TIGE_X = 600;
const SOL_P2 = 780;
const tigePoint = (t: number, f: number) => ({
  x: TIGE_X + Math.sin(t * 2.7) * 20 + Math.sin(f / 26) * 5 * t * t,
  y: SOL_P2 - t * 515,
});

const Feuille: React.FC<{ x: number; y: number; s: number; sens: number }> = ({ x, y, s, sens }) => (
  <g transform={`translate(${x} ${y}) scale(${sens * s} ${s})`}>
    <path d="M0 0 C22 -44 76 -50 104 -30 C84 6 34 20 0 0 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M6 -2 C34 -14 62 -22 88 -28" fill="none" stroke={F.orFonce} strokeWidth={2.5} />
  </g>
);

const ETIQUETTES_P2 = [LIBELLES.pardon, LIBELLES.purification, LIBELLES.nature, LIBELLES.esperance, LIBELLES.presence];

const IlluDeuxSens: React.FC<PropsIllustration> = ({ f, d }) => {
  const X = 215;
  const S = 0.82;
  const ouvre = mix(0.28, 1, p(f, d[1] - 10, d[1] + 24));
  const lueur = 0.92 + 0.08 * Math.sin(f / 13);
  const sol = p(f, 0, 22);
  const graine = p(f, d[2] - 10, d[2] + 24);
  const hauteur = 0.26 * p(f, d[2] + 24, d[3] - 20) + 0.74 * p(f, d[3], d[3] + 305);
  const racines = p(f, d[2] + 10, d[3] + 200);
  const n = 26;
  const points = Array.from({ length: n + 1 }, (_, i) => tigePoint((i / n) * hauteur, f));
  const tete = tigePoint(hauteur, f);
  const fruit = p(f, d[3] + 290, d[3] + 335);
  return (
    <Scene>
      <rect x={0} y={SOL_P2} width={800} height={88} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={4} opacity={sol} />
      <g opacity={sol}>
        <CoffretFond x={X} y={SOL_P2} s={S} ouvre={ouvre} lueur={lueur} />
        {ETIQUETTES_P2.map((m, i) => {
          const a = d[1] + 22 + i * 38;
          const t = p(f, a, a + 30);
          if (t <= 0) return null;
          const y = mix(SOL_P2 - 180, 128 + i * 72, t);
          return (
            <g key={m} transform={`translate(${X} ${y}) scale(${mix(0.55, 1, Math.min(1, t * 2))})`} opacity={Math.min(1, t * 4)}>
              <path d="M-172 0 L-146 -28 H176 Q180 -28 180 -24 V24 Q180 28 176 28 H-146 Z" fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
              <circle cx={-146} cy={0} r={6} fill={F.orClair} stroke={F.encre} strokeWidth={2.5} />
              <Libelle x={20} y={8} taille={22}>{m}</Libelle>
            </g>
          );
        })}
        <CoffretFace x={X} y={SOL_P2} s={S} ouvre={ouvre} />
      </g>
      {/* La graine et les racines, dans la terre. */}
      <g opacity={graine}>
        {[
          `M${TIGE_X} 812 C${TIGE_X - 18} 830 ${TIGE_X - 44} 830 ${TIGE_X - 70} 852`,
          `M${TIGE_X} 812 C${TIGE_X + 18} 832 ${TIGE_X + 50} 826 ${TIGE_X + 78} 850`,
          `M${TIGE_X} 812 C${TIGE_X - 2} 830 ${TIGE_X + 4} 842 ${TIGE_X} 860`,
        ].map((c) => (
          <path key={c} d={c} fill="none" stroke={F.orClair} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray={`${racines} 1`} />
        ))}
        <line x1={TIGE_X} x2={TIGE_X} y1={SOL_P2} y2={808} stroke={F.orClair} strokeWidth={8} opacity={hauteur > 0 ? 1 : 0} />
        <ellipse cx={TIGE_X} cy={810} rx={22} ry={15} fill={F.or} stroke={F.encre} strokeWidth={3} />
      </g>
      {hauteur > 0 ? (
        <g>
          {[
            { t: 0.2, sens: -1 },
            { t: 0.34, sens: 1 },
            { t: 0.5, sens: -1 },
            { t: 0.66, sens: 1 },
            { t: 0.8, sens: -1 },
          ].map(({ t, sens }) => {
            const c = lin(hauteur, t, Math.min(1, t + 0.16));
            if (c <= 0) return null;
            const q = tigePoint(t, f);
            return <Feuille key={t} x={q.x} y={q.y} s={c * 0.92} sens={sens} />;
          })}
          <polyline points={points.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke={F.encre} strokeWidth={13} strokeLinecap="round" />
          <polyline points={points.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke={F.or} strokeWidth={7} strokeLinecap="round" />
        </g>
      ) : null}
      {fruit > 0 ? (
        <g transform={`translate(${tete.x} ${tete.y - 58}) scale(${fruit})`}>
          <Rayons x={0} y={0} r1={78} r2={104} n={12} o={p(f, d[3] + 320, d[3] + 350)} />
          <circle r={66} fill={F.or} stroke={F.encre} strokeWidth={4} />
          <circle r={54} fill={F.orClair} stroke={F.orFonce} strokeWidth={2.5} />
          <Libelle x={0} y={16} taille={46} graisse={600}>{LIBELLES.don}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/* ---------- Plan 3 : deux vases versent ; l'un se vide, l'autre continue de monter. ---------- */

const VASE_HAUT = 150;
const VASE_BAS = 620;
const vaseChemin = (cx: number) =>
  `M${cx - 62} ${VASE_HAUT} C${cx - 62} ${VASE_HAUT + 50} ${cx - 135} ${VASE_HAUT + 70} ${cx - 135} ${VASE_HAUT + 170} C${cx - 135} ${VASE_HAUT + 300} ${cx - 90} ${VASE_HAUT + 420} ${cx - 70} ${VASE_BAS} L${cx + 70} ${VASE_BAS} C${cx + 90} ${VASE_HAUT + 420} ${cx + 135} ${VASE_HAUT + 300} ${cx + 135} ${VASE_HAUT + 170} C${cx + 135} ${VASE_HAUT + 70} ${cx + 62} ${VASE_HAUT + 50} ${cx + 62} ${VASE_HAUT} Z`;

const VaseVerseur: React.FC<{ id: string; cx: number; f: number; niveau: number; debit: number; repere?: number; bol: number }> = ({ id, cx, f, niveau, debit, repere, bol }) => {
  const yNiveau = mix(VASE_BAS, VASE_HAUT + 22, niveau);
  const xFilet = cx + 150;
  const yBec = 615;
  const BOL_Y = 770;
  const yBol = mix(828, 776, bol);
  return (
    <g>
      <defs>
        <clipPath id={`${id}-v`}><path d={vaseChemin(cx)} /></clipPath>
        <clipPath id={`${id}-b`}><path d={`M${xFilet - 78} ${BOL_Y} H${xFilet + 78} C${xFilet + 74} 816 ${xFilet + 44} 838 ${xFilet + 30} 838 H${xFilet - 30} C${xFilet - 44} 838 ${xFilet - 74} 816 ${xFilet - 78} ${BOL_Y} Z`} /></clipPath>
      </defs>
      {/* Étagère. */}
      <rect x={cx - 112} y={640} width={212} height={18} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      {[cx - 96, cx + 54].map((x) => (
        <rect key={x} x={x} y={658} width={14} height={180} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      ))}
      {/* Filet. */}
      {debit > 0 ? (
        <g>
          <rect x={xFilet - debit * 8} y={yBec} width={debit * 16} height={yBol - yBec} fill={F.or} />
          <line x1={xFilet} x2={xFilet} y1={yBec} y2={yBol} stroke={F.orClair} strokeWidth={Math.max(1, debit * 4)} strokeDasharray="14 18" strokeDashoffset={-f * 3} />
        </g>
      ) : null}
      {/* Bol. */}
      <path d={`M${xFilet - 78} ${BOL_Y} H${xFilet + 78} C${xFilet + 74} 816 ${xFilet + 44} 838 ${xFilet + 30} 838 H${xFilet - 30} C${xFilet - 44} 838 ${xFilet - 74} 816 ${xFilet - 78} ${BOL_Y} Z`} fill={F.papier} />
      <g clipPath={`url(#${id}-b)`}>
        <path d={nappe(xFilet - 80, xFilet + 80, yBol, 842, f, 2)} fill={F.or} />
      </g>
      <path d={`M${xFilet - 78} ${BOL_Y} H${xFilet + 78} C${xFilet + 74} 816 ${xFilet + 44} 838 ${xFilet + 30} 838 H${xFilet - 30} C${xFilet - 44} 838 ${xFilet - 74} 816 ${xFilet - 78} ${BOL_Y} Z`} fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {/* Vase. */}
      <path d={vaseChemin(cx)} fill={F.papier} />
      <g clipPath={`url(#${id}-v)`}>
        {niveau > 0.001 ? <path d={nappe(cx - 140, cx + 140, yNiveau, VASE_BAS + 4, f, 3)} fill={F.or} /> : null}
      </g>
      {repere !== undefined ? (
        <line x1={cx - 124} x2={cx + 124} y1={mix(VASE_BAS, VASE_HAUT + 22, repere)} y2={mix(VASE_BAS, VASE_HAUT + 22, repere)} stroke={F.orFonce} strokeWidth={3} strokeDasharray="10 9" />
      ) : null}
      <path d={vaseChemin(cx)} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={cx - 78} y={VASE_HAUT - 15} width={156} height={17} rx={7} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={cx - 86} y={VASE_BAS} width={172} height={20} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {/* Bec. */}
      <path d={`M${cx + 92} 555 L${xFilet} 575 V${yBec}`} fill="none" stroke={F.encre} strokeWidth={26} strokeLinejoin="round" />
      <path d={`M${cx + 92} 555 L${xFilet} 575 V${yBec}`} fill="none" stroke={debit > 0 ? F.or : F.papier} strokeWidth={17} strokeLinejoin="round" />
      <rect x={xFilet - 17} y={yBec - 2} width={34} height={9} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
    </g>
  );
};

const IlluDeuxVases: React.FC<PropsIllustration> = ({ f, d }) => {
  const debut = d[0] + 70;
  const entree = p(f, 0, 25);
  // Gauche : se vide tout entier, et c'est fini à la fin de sa phrase.
  const gauche = 1 - 0.42 * lin(f, debut, d[1]) - 0.58 * lin(f, d[1], d[2] - 25);
  const debitG = p(f, debut, debut + 18) * (1 - p(f, d[2] - 34, d[2] - 22));
  // Droite : verse aussi, et pourtant son niveau monte.
  const droite = 0.46 + 0.1 * lin(f, debut, d[2]) + 0.42 * p(f, d[2], d[2] + 240);
  const debitD = p(f, debut, debut + 18) * (1 + 0.8 * p(f, d[2], d[2] + 200));
  const lumiere = p(f, d[2] + 60, d[2] + 200);
  const bolG = lin(f, debut, d[2] - 25);
  const bolD = lin(f, debut, d[2] + 230);
  return (
    <Scene>
      <g opacity={entree}>
        <Rayons x={560} y={340} r1={165} r2={165 + 40 * lumiere} de={-70} a={320} n={15} o={lumiere} />
        <VaseVerseur id="ch13-g" cx={170} f={f} niveau={gauche} debit={debitG} bol={bolG} />
        <VaseVerseur id="ch13-d" cx={560} f={f} niveau={droite} debit={debitD} repere={0.46} bol={bolD} />
        <line x1={20} x2={790} y1={838} y2={838} stroke={F.encre} strokeWidth={4} />
      </g>
      <Libelle x={170} y={100} taille={30} graisse={600} opacite={p(f, d[1], d[1] + 22)}>{LIBELLES.graceDon}</Libelle>
      <Libelle x={560} y={100} taille={30} graisse={600} opacite={p(f, d[2], d[2] + 22)}>{LIBELLES.ministereDon}</Libelle>
    </Scene>
  );
};

/* ---------- Plan 4 : le seau reverdit une parcelle ; les canaux les atteignent toutes. ---------- */

const PX = 89;
const PY = 370;
const PT = 130;
const PE = 34;
const FENTES = [
  'M18 34 L50 58 L38 96 M50 58 L92 48 L112 22',
  'M24 102 L58 74 L96 92 L118 70 M58 74 L52 28',
  'M16 62 L46 42 L90 70 L114 104 M90 70 L102 28',
  'M30 22 L46 66 L24 108 M46 66 L88 82 L108 54',
];

const Pousse: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round">
    <path d="M0 0 V-20" />
    <path d="M0 -14 C-4 -24 -14 -26 -18 -24 C-16 -14 -8 -10 0 -14" fill={F.orClair} strokeWidth={2} />
    <path d="M0 -14 C4 -24 14 -26 18 -24 C16 -14 8 -10 0 -14" fill={F.orClair} strokeWidth={2} />
  </g>
);

const Parcelle: React.FC<{ l: number; c: number; eau: number }> = ({ l, c, eau }) => {
  const x = PX + c * (PT + PE);
  const y = PY + l * (PT + PE);
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={PT} height={PT} rx={8} fill={F.filet} stroke={F.encre} strokeWidth={3.5} />
      <path d={FENTES[(l * 2 + c) % 4]} fill="none" stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" opacity={1 - eau} />
      <rect width={PT} height={PT} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={3.5} opacity={eau} />
      {eau > 0
        ? [[25, 58], [65, 58], [105, 58], [25, 112], [65, 112], [105, 112]].map(([a, b], i) => (
            <Pousse key={i} x={a} y={b} s={p(eau, 0.3 + (i % 3) * 0.05, 1) * 0.95} />
          ))
        : null}
    </g>
  );
};

const IlluChamp: React.FC<PropsIllustration> = ({ f, d }) => {
  const seau = p(f, 0, 25);
  const bascule = interpolate(f, [d[0] + 75, d[0] + 90], [0, 1], { ...borne, easing: Easing.in(Easing.cubic) });
  const angle = 118 * bascule;
  const teteEau = mix(225, 445, chute(f, d[0] + 86, d[0] + 102));
  const queueEau = mix(225, 445, chute(f, d[0] + 96, d[0] + 116));
  const ecrase = lin(f, d[0] + 102, d[0] + 128);
  const xEau = (y: number) => mix(298, 318, (y - 225) / 220);
  const lEau = (y: number) => mix(16, 46, (y - 225) / 220);
  const unePlace = p(f, d[0] + 100, d[0] + 138);
  const lit = p(f, d[1] + 4, d[1] + 60);
  const litBranches = p(f, d[1] + 40, d[1] + 90);
  const flot = p(f, d[1] + 55, d[1] + 115);
  const flotBranches = p(f, d[1] + 100, d[1] + 170);
  const vision = p(f, d[1] - 6, d[1] + 18);
  /* L'anse, libre sur ses pivots, balance un peu quand le seau s'arrête. */
  const finBascule = d[0] + 90;
  const balance = f > finBascule ? Math.sin((f - finBascule) / 3.2) * 18 * Math.exp(-(f - finBascule) / 14) : 0;
  const CANAL = 'M590 262 V353 H225';
  const BRANCHES = [236, 400, 564].map((x) => `M${x} 353 V${PY + 3 * PT + 2 * PE}`);
  return (
    <Scene>
      {/* Le lit des canaux, sous les parcelles. */}
      {vision > 0 ? (
        <g fill="none" strokeLinecap="butt">
          {[CANAL, ...BRANCHES].map((c, i) => (
            <path key={c} d={c} stroke={F.encre} strokeWidth={22} pathLength={1} strokeDasharray={`${i === 0 ? lit : litBranches} 1`} />
          ))}
          {[CANAL, ...BRANCHES].map((c, i) => (
            <path key={c} d={c} stroke={F.papier} strokeWidth={15} pathLength={1} strokeDasharray={`${i === 0 ? lit : litBranches} 1`} />
          ))}
          {[CANAL, ...BRANCHES].map((c, i) => (
            <path key={c} d={c} stroke={F.or} strokeWidth={15} pathLength={1} strokeDasharray={`${i === 0 ? flot : flotBranches} 1`} />
          ))}
          {flotBranches > 0.98
            ? [CANAL, ...BRANCHES].map((c) => <path key={c} d={c} stroke={F.orClair} strokeWidth={4} strokeDasharray="16 22" strokeDashoffset={-f * 1.6} />)
            : null}
        </g>
      ) : null}
      {Array.from({ length: 12 }, (_, i) => {
        const l = Math.floor(i / 4);
        const c = i % 4;
        const a = d[1] + 118 + l * 24 + (3 - c) * 13;
        const eau = l === 0 && c === 1 ? unePlace : p(f, a, a + 32);
        return <Parcelle key={i} l={l} c={c} eau={eau} />;
      })}
      {/* Le seau. */}
      <g opacity={seau}>
        <Libelle x={250} y={72} taille={32} graisse={600}>{LIBELLES.parAmour}</Libelle>
        {/* La potence plantée au bord du champ : le seau pivote sur son axe. */}
        <g fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round">
          <rect x={118} y={354} width={64} height={16} rx={3} fill={F.cuir} />
          <rect x={140} y={178} width={20} height={176} />
          <rect x={140} y={178} width={110} height={20} />
        </g>
        {/* L'eau tombe d'un bloc, puis s'écrase sur la parcelle. */}
        {teteEau > 225 && queueEau < 445 ? (
          <path
            d={`M${xEau(queueEau) - lEau(queueEau)} ${queueEau} L${xEau(teteEau) - lEau(teteEau)} ${teteEau} Q${xEau(teteEau)} ${teteEau + 26} ${xEau(teteEau) + lEau(teteEau)} ${teteEau} L${xEau(queueEau) + lEau(queueEau)} ${queueEau} Q${xEau(queueEau)} ${queueEau - 12} ${xEau(queueEau) - lEau(queueEau)} ${queueEau} Z`}
            fill={F.orClair}
            stroke={F.orFonce}
            strokeWidth={3}
            strokeLinejoin="round"
          />
        ) : null}
        {ecrase > 0 && ecrase < 1 ? <ellipse cx={318} cy={445} rx={22 + 34 * ecrase} ry={12 + 22 * ecrase} fill="none" stroke={F.orClair} strokeWidth={5} opacity={1 - ecrase} /> : null}
        <g transform={`translate(250 ${190}) rotate(${angle})`}>
          <path d="M-58 -46 L-42 56 Q0 68 42 56 L58 -46 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
          <ellipse cx={0} cy={-46} rx={58} ry={13} fill={bascule > 0.5 ? F.encre : F.orClair} stroke={F.encre} strokeWidth={4.5} />
          <path d="M-46 26 Q0 40 46 26" fill="none" stroke={F.encre} strokeWidth={3.5} />
          {/* L'anse reste du côté de l'ouverture : seau renversé, c'est de ce côté-là qu'elle pend. */}
          <path d={`M-58 -46 C-58 ${-112 + balance} 58 ${-112 + balance} 58 -46`} fill="none" stroke={F.encre} strokeWidth={6} />
        </g>
        <circle cx={250} cy={190} r={8} fill={F.or} stroke={F.encre} strokeWidth={3.5} />
      </g>
      {/* La citerne. */}
      <g opacity={vision}>
        <Libelle x={590} y={72} taille={32} graisse={600}>{LIBELLES.parVision}</Libelle>
        <rect x={490} y={108} width={200} height={154} rx={10} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
        <path d={nappe(494, 686, 142, 258, f, 3)} fill={F.or} />
        <rect x={490} y={108} width={200} height={154} rx={10} fill="none" stroke={F.encre} strokeWidth={4.5} />
      </g>
    </Scene>
  );
};

/* ---------- Plan 5 : deux rangées de lampes ; une flamme grandit dans chacune. ---------- */

const Flamme: React.FC<{ x: number; y: number; h: number; f: number; i: number; o?: number }> = ({ x, y, h, f, i, o = 1 }) => {
  const haut = h * (1 + 0.07 * Math.sin(f / 4.6 + i * 1.7));
  const w = 7 + 1.5 * Math.pow(h, 0.72);
  const pointe = Math.sin(f / 6.3 + i) * h * 0.05;
  const forme = (k: number) => `M0 0 C${-w * k} ${-haut * k * 0.2} ${-w * 0.55 * k} ${-haut * k * 0.62} ${pointe * k} ${-haut * k} C${w * 0.55 * k} ${-haut * k * 0.62} ${w * k} ${-haut * k * 0.2} 0 0 Z`;
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <ellipse cx={0} cy={-haut * 0.56} rx={w * 1.35} ry={haut * 0.58} fill={F.orClair} opacity={0.26} />
      <path d={forme(1)} fill={F.or} stroke={F.orFonce} strokeWidth={2.5} strokeLinejoin="round" />
      <path d={forme(0.62)} fill={F.orClair} />
    </g>
  );
};

const Lampe: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) scale(0.82)`}>
    <path d="M-58 -30 C-74 -44 -86 -24 -70 -14" fill="none" stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
    <path d="M-62 -30 C-58 -8 -40 0 -18 0 H12 C30 0 42 -10 62 -22 L66 -32 H34 C10 -38 -36 -38 -62 -30 Z" fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <ellipse cx={-12} cy={-33} rx={20} ry={5} fill={F.encre} />
    <path d="M-44 -14 Q-10 -6 26 -14" fill="none" stroke={F.orClair} strokeWidth={2.5} />
  </g>
);

const LAMPES_X = [100, 245, 390, 535, 680];

const Rangee: React.FC<{ y: number; f: number; apparition: number; grande: number; hauteur: number }> = ({ y, f, apparition, grande, hauteur }) => (
  <g>
    <line x1={20} x2={780} y1={y + 2} y2={y + 2} stroke={F.encre} strokeWidth={4} opacity={p(f, apparition - 15, apparition + 5)} />
    {LAMPES_X.map((x, i) => {
      const a = apparition + i * 11;
      return <Flamme key={x} x={x + 46} y={y - 26} h={i === grande ? hauteur : 36} f={f} i={i} o={p(f, a, a + 16)} />;
    })}
    {LAMPES_X.map((x, i) => {
      const a = apparition + i * 11;
      return (
        <g key={x} opacity={p(f, a, a + 16)}>
          <Lampe x={x} y={y} />
        </g>
      );
    })}
  </g>
);

const IlluLampes: React.FC<PropsIllustration> = ({ f, d }) => {
  const h1 = 36 + 92 * p(f, d[0] + 95, d[0] + 150);
  const h2 = 36 + 92 * p(f, d[1] + 215, d[1] + 270) + 180 * p(f, d[2] + 40, d[2] + 240);
  const rayons = p(f, d[2] + 190, d[2] + 250);
  return (
    <Scene>
      <Libelle x={36} y={246} taille={36} ancre="start" graisse={600} opacite={p(f, d[0] - 8, d[0] + 12)}>{LIBELLES.prier}</Libelle>
      <Rangee y={370} f={f} apparition={d[0] - 18} grande={2} hauteur={h1} />
      <Libelle x={36} y={686} taille={36} ancre="start" graisse={600} opacite={p(f, d[1] - 8, d[1] + 12)}>{LIBELLES.don}</Libelle>
      <Rayons x={436} y={650} r1={205} r2={240} de={-158} a={136} n={7} o={rayons} />
      <Rangee y={810} f={f} apparition={d[1] - 6} grande={2} hauteur={h2} />
    </Scene>
  );
};

/* ---------- Plan 6 : la terre craquelée, la source qui remplit le bas de l'image. ---------- */

const Nuage: React.FC<{ x: number; y: number; s: number; c: string }> = ({ x, y, s, c }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M-140 40 C-186 40 -192 -14 -146 -22 C-150 -68 -86 -84 -60 -50 C-40 -102 44 -102 58 -46 C92 -74 150 -48 138 -12 C182 -8 182 40 140 40 Z"
    fill={c}
    stroke={F.encre}
    strokeWidth={4 / s}
    strokeLinejoin="round"
  />
);

const FISSURES_P6 = [
  'M400 540 L322 588 L278 568 L196 620 L120 600 L28 646',
  'M400 540 L470 590 L538 568 L620 622 L700 600 L782 640',
  'M322 588 L340 650 L276 704 L296 774 L240 860',
  'M470 590 L452 660 L520 716 L504 780 L560 866',
  'M196 620 L176 690 L106 722 L90 800',
  'M620 622 L640 696 L716 724 L722 800',
  'M278 568 L250 500 L262 462',
  'M538 568 L566 498 L552 456',
  'M120 600 L92 530 L38 500',
  'M700 600 L676 530 L730 486 L786 470',
  'M566 498 L640 480 L690 530',
];

const IlluSource: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOURCE = p(f, d[0] + 145, d[0] + 195);
  const puissance = SOURCE * (1 + 0.25 * p(f, d[2], d[2] + 80));
  const yNiveau = 872 - 132 * p(f, d[0] + 195, d[0] + 340) - 58 * p(f, d[1], d[2]) - 66 * p(f, d[2], d[2] + 110);
  const pancarte = p(f, d[0] + 215, d[0] + 245);
  const joie = p(f, d[0] + 275, d[0] + 305);
  const ray = p(f, d[2], d[2] + 70);
  const derive = Math.sin(f / 40) * 9;
  const haut = 540 - 215 * puissance;
  const large = 32 * SOURCE;
  return (
    <Scene>
      {SOURCE > 0 ? <Rayons x={400} y={haut + 22} r1={84} r2={84 + 54 * ray} de={-165} a={150} n={11} o={ray} /> : null}
      <g>
        <Nuage x={222 + derive} y={150} s={1.1} c={F.encre2} />
        <Nuage x={585 - derive} y={140} s={1.1} c={F.encre2} />
        <Nuage x={395 + derive * 0.5} y={100} s={1.25} c={F.cuir} />
      </g>
      <path d="M0 450 Q200 428 400 442 T800 446 V872 H0 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {FISSURES_P6.map((c) => (
        <path key={c} d={c} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      ))}
      <path d="M352 544 L382 524 L400 538 L424 522 L452 546 L424 560 L400 552 L376 562 Z" fill={F.encre} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      {/* Le jet et ce qui retombe. */}
      {SOURCE > 0 ? (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const t = reste(f / 44 + i / 12);
            const sens = i % 2 === 0 ? -1 : 1;
            const portee = 44 + (i % 3) * 14;
            const x = 400 + sens * portee * t;
            const y = haut + 16 - 58 * Math.sin(t * Math.PI * 0.62) + t * t * (540 - haut + 26);
            return <circle key={i} cx={x} cy={y} r={7 + (i % 3)} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} opacity={SOURCE * (1 - t * 0.2)} />;
          })}
          {/* La gerbe et le flot : une seule forme, du sommet jusqu'à l'eau. */}
          <path
            d={`M${400 - large * 1.6} ${yNiveau + 8} C${400 - large * 1.1} 700 ${400 - large * 1.2 + Math.sin(f / 9) * 4} 620 ${400 - large} 546 C${400 - large * 0.7} ${mix(542, haut, 0.5)} ${400 - large * 0.62} ${haut + 40} ${400 - large * 0.2} ${haut + 8} Q${400 + Math.sin(f / 8) * 4} ${haut - 16} ${400 + large * 0.2} ${haut + 8} C${400 + large * 0.62} ${haut + 40} ${400 + large * 0.7} ${mix(542, haut, 0.5)} ${400 + large} 546 C${400 + large * 1.2 + Math.sin(f / 9) * 4} 620 ${400 + large * 1.1} 700 ${400 + large * 1.6} ${yNiveau + 8} Z`}
            fill={F.or}
            stroke={F.orFonce}
            strokeWidth={3}
            strokeLinejoin="round"
          />
          <line x1={400} x2={400} y1={Math.min(yNiveau, 860)} y2={haut + 26} stroke={F.orClair} strokeWidth={Math.max(1, large * 0.26)} strokeDasharray="22 18" strokeDashoffset={f * 3} strokeLinecap="round" />
        </g>
      ) : null}
      {yNiveau < 870 ? (
        <>
          <path d={nappe(0, 800, yNiveau, 872, f, 5)} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
          {yNiveau + 28 < 872 ? <path d={nappe(0, 800, yNiveau + 24, 872, f + 30, 4)} fill={F.orClair} opacity={0.5} /> : null}
        </>
      ) : null}
      <Libelle x={400} y={826} taille={38} graisse={600} opacite={joie}>{LIBELLES.joie}</Libelle>
      {/* La pancarte. */}
      <g opacity={pancarte}>
        <rect x={165} y={500} width={12} height={72} fill={F.cuir} stroke={F.encre} strokeWidth={2.5} />
        <rect x={22} y={460} width={300} height={54} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={3.5} />
        <Libelle x={172} y={497} taille={30} graisse={600}>{LIBELLES.pauvrete}</Libelle>
      </g>
    </Scene>
  );
};

/* ---------- Plan 7 : le rouleau, le panier ; la cloison arrête le geste. ---------- */

const PIECES_P7 = [
  ...[-112, -56, 0, 56, 112].map((x) => ({ x, y: 804 })),
  ...[-116, -58, 0, 58, 116].map((x) => ({ x: x + 6, y: 768 })),
  ...[-140, -84, -28, 28, 84, 140].map((x) => ({ x, y: 732 })),
  ...[-140, -84, -28, 28, 84, 140].map((x) => ({ x: x + 8, y: 696 })),
];

const IlluRouleau: React.FC<PropsIllustration> = ({ f, d }) => {
  const posee = d[2] + 320;
  const arrivee = d[2] + 200;
  const u = lin(f, d[0] - 10, posee);
  const bas = 112 + 298 * u;
  const lignes = Array.from({ length: 10 }, (_, i) => 120 + i * 30);
  const yCloison = interpolate(f, [arrivee, posee], [40, 480], { ...borne, easing: Easing.in(Easing.quad) }) + rebond(f, posee, 14);
  const cloisonO = lin(f, arrivee, arrivee + 16);
  const n = PIECES_P7.length;
  const pas = (d[2] + 245 - (d[0] + 30)) / (n - 1);
  const sceau = p(f, d[1], d[1] + 24);
  const CHUTE = 30;
  return (
    <Scene>
      {/* Le panier, côté intérieur. */}
      <path d="M210 650 H590 L552 842 H248 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {PIECES_P7.map((c, i) => {
        const a = d[0] + 30 + i * pas;
        const t = chute(f, a, a + CHUTE);
        if (t <= 0) return null;
        const y = mix(bas, c.y, t) + (f > a + CHUTE ? rebond(f, a + CHUTE, 8) : 0);
        const x = mix(400 + (i % 3 - 1) * 26, 400 + c.x, t);
        return <Piece key={i} x={x} y={y} r={26} />;
      })}
      {/* Le treillis du panier, devant les pièces. */}
      <g stroke={F.cuir} strokeWidth={5} fill="none" strokeLinecap="round">
        {[-3, -2, -1, 0, 1, 2, 3].map((k) => (
          <line key={k} x1={400 + k * 54} y1={652} x2={400 + k * 43} y2={840} />
        ))}
        {[694, 738, 782, 824].map((y) => {
          const m = 190 - (y - 650) * (38 / 192);
          return <line key={y} x1={400 - m} x2={400 + m} y1={y} y2={y} />;
        })}
      </g>
      <path d="M210 650 H590 L552 842 H248 Z" fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={196} y={638} width={408} height={22} rx={10} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[-1, 1].map((c) => (
        <path key={c} d={`M${400 + c * 204} 650 q${c * 34} 38 ${-c * 12} 72`} fill="none" stroke={F.cuir} strokeWidth={9} strokeLinecap="round" />
      ))}
      {/* La cloison descend dans un portique, derrière le rouleau pendant sa descente. */}
      {cloisonO > 0 ? (
        <g opacity={cloisonO}>
          {[8, 772].map((x) => (
            <g key={x}>
              <rect x={x - 6} y={828} width={32} height={14} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
              <rect x={x} y={20} width={20} height={808} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            </g>
          ))}
          <rect x={2} y={8} width={796} height={24} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          {[70, 730].map((x) => (
            <g key={x}>
              <line x1={x} x2={x} y1={32} y2={yCloison} stroke={F.encre2} strokeWidth={5} />
              <circle cx={x} cy={32} r={7} fill={F.or} stroke={F.encre} strokeWidth={3} />
            </g>
          ))}
          <rect x={30} y={yCloison} width={740} height={92} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
          <path d={`M30 ${yCloison + 16} H770 M30 ${yCloison + 76} H770`} stroke={F.cuirClair} strokeWidth={4} />
          <Libelle x={400} y={yCloison + 58} taille={38} graisse={600} couleur={F.papier}>{LIBELLES.classes}</Libelle>
        </g>
      ) : null}
      {/* Deux pièces qui ne passent plus. */}
      {[0, 1].map((i) => {
        const a = posee + 22 + i * 34;
        const t = chute(f, a, a + 12);
        if (t <= 0) return null;
        return <Piece key={i} x={376 + i * 52} y={mix(bas, 456, t) + rebond(f, a + 12, 6)} r={20} />;
      })}
      {/* Le rouleau. */}
      <rect x={200} y={72} width={400} height={bas - 72} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      {lignes.map((y, i) => (y < bas - 14 ? <line key={y} x1={232} x2={[552, 568, 530, 560, 540, 570, 520, 556, 566, 536][i]} y1={y} y2={y} stroke={F.encre2} strokeWidth={5} strokeLinecap="round" /> : null))}
      <g opacity={sceau}>
        <circle cx={400} cy={210} r={44} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} />
        <Coeur x={400} y={214} s={0.56} />
      </g>
      {[{ y: 66, r: 16 }, { y: bas, r: mix(22, 14, u) }].map(({ y, r }, i) => (
        <g key={i}>
          <rect x={186} y={y - r} width={428} height={r * 2} rx={r} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          {[172, 628].map((x) => (
            <circle key={x} cx={x} cy={y} r={r * 0.75} fill={F.or} stroke={F.encre} strokeWidth={3.5} />
          ))}
        </g>
      ))}
    </Scene>
  );
};

/* ---------- Plan 8 : l'éprouvette monte au trait, puis au-dessus. ---------- */

const IlluEprouvette: React.FC<PropsIllustration> = ({ f, d }) => {
  const TRAIT = 500;
  const niveau = 792 - (792 - TRAIT) * lin(f, d[0] + 10, d[0] + 165) - 82 * lin(f, d[0] + 195, d[1] - 16) - 186 * p(f, d[1] + 20, d[1] + 345);
  const TUBE = 'M300 170 V710 A100 100 0 0 0 500 710 V170 Z';
  const fin = d[1] + 345;
  const flux = 1 - lin(f, fin - 8, fin + 5);
  const fleche = p(f, d[0] + 205, d[0] + 245);
  return (
    <Scene>
      <defs>
        <clipPath id="ch13-tube"><path d={TUBE} /></clipPath>
      </defs>
      {/* Le support. */}
      <rect x={200} y={844} width={400} height={24} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {[230, 548].map((x) => (
        <rect key={x} x={x} y={640} width={22} height={204} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      ))}
      <rect x={210} y={628} width={380} height={22} rx={5} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d={TUBE} fill={F.papier} />
      <g clipPath="url(#ch13-tube)">
        <path d={nappe(290, 510, niveau, 830, f, 2.5)} fill={niveau < TRAIT ? F.orClair : F.or} />
        {/* Une fois le trait dépassé, ce qui reste en dessous garde l'or plein. */}
        {niveau < TRAIT ? <rect x={290} y={TRAIT} width={220} height={340} fill={F.or} /> : null}
        {/* Le reflet reste dans le liquide. */}
        {Math.max(niveau, TRAIT) + 40 < 680 ? <path d={`M322 ${Math.max(niveau, TRAIT) + 40} V680`} stroke={F.orClair} strokeWidth={8} strokeLinecap="round" opacity={0.7} /> : null}
      </g>
      <path d={TUBE} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={284} y={158} width={232} height={16} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
      {/* Les gouttes. */}
      {Array.from({ length: 4 }, (_, i) => {
        const t = reste(f / 56 + i / 4);
        const a = f - t * 56;
        if (a < d[0] - 5 || a > fin) return null;
        const y = 118 + t * t * (niveau - 20 - 118);
        return <path key={i} transform={`translate(400 ${y})`} d="M0 -16 C8 -4 12 2 12 8 A12 12 0 0 1 -12 8 C-12 2 -8 -4 0 -16 Z" fill={F.or} stroke={F.orFonce} strokeWidth={2.5} opacity={flux} />;
      })}
      {/* Le compte-gouttes. */}
      <rect x={388} y={52} width={24} height={66} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={393} y={64} width={14} height={50} fill={F.orClair} />
      <ellipse cx={400} cy={36} rx={26} ry={24} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {/* Le trait. */}
      <line x1={262} x2={544} y1={TRAIT} y2={TRAIT} stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
      <Libelle x={556} y={TRAIT + 11} taille={34} ancre="start" graisse={600}>{LIBELLES.moyens}</Libelle>
      {/* Ce qui dépasse. */}
      <g opacity={fleche}>
        <path d={`M240 ${TRAIT - 14} V${niveau + 16} M224 ${niveau + 34} L240 ${niveau + 12} L256 ${niveau + 34}`} fill="none" stroke={F.orFonce} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Scene>
  );
};

/* ---------- Plan 9 : recettes qui montent, besoins qui baissent, l'or entre les deux. ---------- */

const Fleche: React.FC<{ x: number; y: number; sens: number; o: number }> = ({ x, y, sens, o }) => (
  <path transform={`translate(${x} ${y}) scale(1 ${sens})`} d="M0 34 V-30 M-24 -6 L0 -32 L24 -6" fill="none" stroke={F.orFonce} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" opacity={o} />
);

const IlluDeuxBarres: React.FC<PropsIllustration> = ({ f, d }) => {
  const BAS = 810;
  const pose = p(f, 0, 28);
  const monte = p(f, d[0] + 150, d[0] + 240);
  const baisse1 = p(f, d[0] + 310, d[0] + 375);
  const baisse2 = p(f, d[1] + 125, d[1] + 215);
  const y1 = mix(BAS, 530, pose) - 320 * monte;
  const y2 = mix(BAS, 530, pose) + 110 * baisse1 + 60 * baisse2;
  const flecheR = p(f, d[0] + 140, d[0] + 160) * (1 - p(f, d[0] + 240, d[0] + 262));
  const flecheB = Math.max(p(f, d[0] + 300, d[0] + 318) * (1 - p(f, d[0] + 375, d[0] + 395)), p(f, d[1] + 115, d[1] + 135) * (1 - p(f, d[1] + 215, d[1] + 235)));
  const X1 = 300;
  const X2 = 500;
  const EP = 30;
  const hOr = y2 - y1;
  const piles = Math.max(0, Math.ceil(hOr / EP));
  return (
    <Scene>
      {/* Entre les barres : l'or repose sur ce que couvrent les besoins. */}
      <rect x={X1} y={y2} width={X2 - X1} height={BAS - y2} fill={F.papier} stroke={F.encre} strokeWidth={4} opacity={pose} />
      {hOr > 0.5 ? (
        <g>
          <defs>
            <clipPath id="ch13-or"><rect x={X1} y={y1} width={X2 - X1} height={hOr} /></clipPath>
          </defs>
          <g clipPath="url(#ch13-or)">
            {Array.from({ length: piles }, (_, i) => (
              <rect key={i} x={X1 + 4} y={y2 - (i + 1) * EP} width={X2 - X1 - 8} height={EP} rx={10} fill={i % 2 === 0 ? F.or : F.orClair} stroke={F.orFonce} strokeWidth={3} />
            ))}
          </g>
          <rect x={X1} y={y1} width={X2 - X1} height={hOr} fill="none" stroke={F.orFonce} strokeWidth={4} />
        </g>
      ) : null}
      <rect x={110} y={y1} width={190} height={BAS - y1} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      <rect x={500} y={y2} width={190} height={BAS - y2} fill={F.argile} stroke={F.encre} strokeWidth={5} />
      <line x1={40} x2={760} y1={BAS} y2={BAS} stroke={F.encre} strokeWidth={5} opacity={pose} />
      <Libelle x={205} y={BAS - 34} taille={34} graisse={600} couleur={F.papier} opacite={pose}>{LIBELLES.recettes}</Libelle>
      <Libelle x={595} y={BAS - 34} taille={34} graisse={600} couleur={F.papier} opacite={pose}>{LIBELLES.besoins}</Libelle>
      <Fleche x={205} y={y1 - 56} sens={1} o={flecheR} />
      <Fleche x={595} y={y2 - 56} sens={-1} o={flecheB} />
    </Scene>
  );
};

/* ---------- Le cœur enrubanné : plan 10, repris à la fin. ---------- */

const COEUR_D = 'M0 42 C-64 2 -54 -48 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C54 -48 64 2 0 42 Z';

const CoeurEnrubanne: React.FC<{ id: string; x: number; y: number; s: number; vertical?: number; horizontal?: number; noeud?: number }> = ({ id, x, y, s, vertical = 1, horizontal = 1, noeud = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <defs>
      <clipPath id={id}><path d={COEUR_D} /></clipPath>
    </defs>
    <path d={COEUR_D} fill={F.argile} stroke={F.encre} strokeWidth={3 / s} />
    <g clipPath={`url(#${id})`}>
      <rect x={-8} y={-52} width={16} height={96 * vertical} fill={F.orClair} stroke={F.orFonce} strokeWidth={1.8 / Math.sqrt(s)} />
      <rect x={-60} y={-16} width={120 * horizontal} height={16} fill={F.orClair} stroke={F.orFonce} strokeWidth={1.8 / Math.sqrt(s)} />
    </g>
    <path d={COEUR_D} fill="none" stroke={F.encre} strokeWidth={3 / s} />
    {noeud > 0 ? (
      <g transform={`translate(0 -34) scale(${noeud})`} stroke={F.encre} strokeWidth={2.6 / s} strokeLinejoin="round">
        <path d="M0 0 C-10 -20 -38 -24 -36 -8 C-34 6 -12 6 0 0 Z" fill={F.orClair} />
        <path d="M0 0 C10 -20 38 -24 36 -8 C34 6 12 6 0 0 Z" fill={F.orClair} />
        <rect x={-6} y={-6} width={12} height={12} rx={3} fill={F.or} />
      </g>
    ) : null}
  </g>
);

/* ---------- Plan 10 : le fil se rompt, l'étiquette tombe, le ruban entoure le cœur. ---------- */

const Etiquette: React.FC<{ x: number; y: number; angle: number }> = ({ x, y, angle }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`}>
    <path d="M0 -24 L54 18 V176 H-54 V18 Z" fill={F.papier} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M-40 28 V162 H40 V28" fill="none" stroke={F.filet} strokeWidth={3} strokeDasharray="9 8" />
    <circle r={10} fill={F.parchemin} stroke={F.encre} strokeWidth={3.5} />
  </g>
);

const IlluCoeur: React.FC<PropsIllustration> = ({ f, d }) => {
  const RUPTURE = d[1] + 38;
  const coupe = f >= RUPTURE;
  const CX = mix(370, 400, p(f, d[2], d[2] + 40));
  const CY = 420;
  const S = 4;
  const accroche = { x: CX + 189, y: CY - 73 };
  const tombe = chute(f, RUPTURE, RUPTURE + 26);
  const balance = Math.sin(f / 19) * 6 * (1 - p(f, RUPTURE - 12, RUPTURE));
  const xTrou = mix(668 + Math.sin(f / 19) * -10 * (1 - tombe), 738, tombe);
  const yTrou = mix(450, 738, tombe) + rebond(f, RUPTURE + 26, 16);
  const angle = mix(balance, 76, p(f, RUPTURE + 2, RUPTURE + 30));
  const vertical = p(f, d[2] + 20, d[2] + 75);
  const horizontal = p(f, d[2] + 70, d[2] + 125);
  const noeud = p(f, d[2] + 118, d[2] + 150);
  const lumiere = p(f, d[2] + 190, d[2] + 270);
  const moignon = 1 - p(f, RUPTURE, RUPTURE + 30);
  const milieu = { x: (accroche.x + xTrou) / 2, y: (accroche.y + yTrou) / 2 + 22 };
  return (
    <Scene>
      <Rayons x={CX} y={CY - 18} r1={275} r2={275 + 62 * lumiere} de={-168} a={156} n={11} o={lumiere} epaisseur={7} />
      <line x1={40} x2={780} y1={838} y2={838} stroke={F.encre} strokeWidth={4} opacity={p(f, 0, 25)} />
      <CoeurEnrubanne id="ch13-c10" x={CX} y={CY} s={S} vertical={vertical} horizontal={horizontal} noeud={noeud} />
      {!coupe ? (
        <path d={`M${accroche.x} ${accroche.y} Q${milieu.x} ${milieu.y} ${xTrou} ${yTrou}`} fill="none" stroke={F.encre} strokeWidth={4} />
      ) : (
        <g opacity={moignon} fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round">
          <path d={`M${accroche.x} ${accroche.y} q 16 ${10 + 22 * (1 - moignon)} ${30 - 12 * (1 - moignon)} ${22 + 30 * (1 - moignon)}`} />
        </g>
      )}
      <circle cx={accroche.x} cy={accroche.y} r={6} fill={F.encre} opacity={coupe ? moignon : 1} />
      <Etiquette x={xTrou} y={yTrou} angle={angle} />
      {coupe && f < RUPTURE + 34 ? <path d={`M${xTrou} ${yTrou} q -14 -18 -26 -30`} fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" /> : null}
    </Scene>
  );
};

/* ---------- Plan 11 : deux vases reliés ; le support bascule, le flux s'inverse. ---------- */

const JARRE = (cx: number) => `M${cx - 104} 300 Q${cx - 104} 280 ${cx - 84} 280 H${cx + 84} Q${cx + 104} 280 ${cx + 104} 300 V620 Q${cx + 104} 640 ${cx + 84} 640 H${cx - 84} Q${cx - 104} 640 ${cx - 104} 620 Z`;

const IlluFratrie: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const PIVOT = { x: 400, y: 690 };
  const ouvert = p(f, d[1] + 245, d[1] + 280);
  const flux1 = p(f, d[1] + 270, d[2] - 12);
  const bascule = p(f, d[2] - 25, d[2] + 95);
  const flux2 = p(f, d[2] + 40, duree - 4);
  const alpha = mix(6, -6, bascule);
  const a = rad(alpha);
  const gauche = 0.84 - 0.58 * flux1 + 0.22 * flux2;
  const droite = 0.12 + 0.58 * flux1 - 0.22 * flux2;
  const dxG = -210;
  const dxD = 210;
  const monde = (y: number, dx: number) => PIVOT.y + (y - PIVOT.y) * Math.cos(a) + dx * Math.sin(a);
  const yNiv = (n: number, dx: number) => monde(mix(636, 288, n), dx);
  const rot = `rotate(${alpha} ${PIVOT.x} ${PIVOT.y})`;
  const coule = (flux1 > 0 && flux1 < 1) || flux2 > 0;
  const sens = bascule > 0.5 ? 1 : -1;
  const permute = p(f, d[2] + 25, d[2] + 70);
  const appuiG = p(f, d[1] + 95, d[1] + 120) * (1 - p(f, d[1] + 150, d[1] + 175));
  const appuiD = p(f, d[1] + 170, d[1] + 195) * (1 - p(f, d[1] + 230, d[1] + 255));
  const xG = PIVOT.x + dxG * Math.cos(a);
  const xD = PIVOT.x + dxD * Math.cos(a);
  const yEt = (dx: number) => monde(240, dx);
  const entree = p(f, 0, 25);
  return (
    <Scene>
      <defs>
        <clipPath id="ch13-jg"><path d={JARRE(190)} transform={rot} /></clipPath>
        <clipPath id="ch13-jd"><path d={JARRE(610)} transform={rot} /></clipPath>
      </defs>
      <g opacity={entree}>
        <path d={`M${PIVOT.x} ${PIVOT.y} L${PIVOT.x - 120} 842 H${PIVOT.x + 120} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
        <line x1={120} x2={680} y1={842} y2={842} stroke={F.encre} strokeWidth={4} />
        <g transform={rot}>
          {/* Le tuyau. */}
          <rect x={294} y={596} width={212} height={28} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          {coule ? <line x1={296} x2={504} y1={610} y2={610} stroke={F.or} strokeWidth={18} /> : null}
          {coule ? <line x1={296} x2={504} y1={610} y2={610} stroke={F.orClair} strokeWidth={6} strokeDasharray="14 18" strokeDashoffset={sens * f * 3.2} /> : null}
          {/* Le robinet. */}
          <circle cx={400} cy={610} r={24} fill={F.or} stroke={F.encre} strokeWidth={4} />
          <rect x={394} y={586} width={12} height={48} rx={4} fill={F.encre} transform={`rotate(${90 * ouvert} 400 610)`} />
          <rect x={50} y={660} width={700} height={24} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4.5} />
          {[190, 610].map((x) => (
            <g key={x}>
              <rect x={x - 76} y={640} width={152} height={20} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
              <path d={JARRE(x)} fill={F.papier} />
            </g>
          ))}
        </g>
        <g clipPath="url(#ch13-jg)">
          <path d={nappe(40, 340, yNiv(gauche, dxG), 720, f, 3)} fill={F.or} />
        </g>
        <g clipPath="url(#ch13-jd)">
          <path d={nappe(460, 760, yNiv(droite, dxD), 720, f, 3)} fill={F.or} />
        </g>
        <g transform={rot}>
          {[190, 610].map((x) => (
            <g key={x}>
              <path d={JARRE(x)} fill="none" stroke={F.encre} strokeWidth={5} />
              <rect x={x - 112} y={270} width={224} height={18} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            </g>
          ))}
          <circle cx={PIVOT.x} cy={672} r={13} fill={F.or} stroke={F.encre} strokeWidth={4} />
        </g>
      </g>
      {/* Les mots suivent les vases et s'échangent à la bascule. */}
      <g opacity={entree}>
        <Rayons x={xG} y={yEt(dxG) - 12} r1={110} r2={126} de={-150} a={120} n={5} o={0.9 * appuiG} />
        <Rayons x={xD} y={yEt(dxD) - 12} r1={110} r2={126} de={-150} a={120} n={5} o={0.9 * appuiD} />
        <Libelle x={xG} y={yEt(dxG)} taille={36} graisse={600} opacite={1 - permute}>{LIBELLES.superflu}</Libelle>
        <Libelle x={xD} y={yEt(dxD)} taille={36} graisse={600} opacite={1 - permute}>{LIBELLES.besoins}</Libelle>
        <Libelle x={xG} y={yEt(dxG)} taille={36} graisse={600} opacite={permute}>{LIBELLES.besoins}</Libelle>
        <Libelle x={xD} y={yEt(dxD)} taille={36} graisse={600} opacite={permute}>{LIBELLES.superflu}</Libelle>
      </g>
    </Scene>
  );
};

/* ---------- Plan 12 : la roue des saisons et deux greniers en alternance. ---------- */

const QUARTIERS = [
  { mot: LIBELLES.semailles, fond: F.cuirClair, encre: F.papier },
  { mot: LIBELLES.moisson, fond: F.or, encre: F.encre },
  { mot: LIBELLES.froid, fond: F.papier, encre: F.encre },
  { mot: LIBELLES.chaleur, fond: F.argile, encre: F.papier },
];

const Grenier: React.FC<{ id: string; x: number; niveau: number; f: number }> = ({ id, x, niveau, f }) => {
  const H = 625;
  const B = 866;
  const W = 96;
  const y = mix(B - 4, H + 6, niveau);
  return (
    <g>
      <defs>
        <clipPath id={id}><rect x={x - W} y={H} width={W * 2} height={B - H} rx={6} /></clipPath>
      </defs>
      <rect x={x - W} y={H} width={W * 2} height={B - H} rx={6} fill={F.papier} />
      <g clipPath={`url(#${id})`}>
        <path d={nappe(x - W, x + W, y, B, f / 3, 2.5)} fill={F.orClair} />
        {Array.from({ length: 18 }, (_, i) => {
          const gx = x - W + 18 + (i % 6) * 32;
          const gy = B - 18 - Math.floor(i / 6) * 68 - (i % 2) * 18;
          return gy > y + 12 ? <ellipse key={i} cx={gx} cy={gy} rx={8} ry={5} fill={F.or} stroke={F.orFonce} strokeWidth={1.5} transform={`rotate(${(i * 47) % 90 - 45} ${gx} ${gy})`} /> : null;
        })}
      </g>
      <rect x={x - W} y={H} width={W * 2} height={B - H} rx={6} fill="none" stroke={F.encre} strokeWidth={4.5} />
      <path d={`M${x - W - 18} ${H} L${x} ${H - 58} L${x + W + 18} ${H} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
    </g>
  );
};

const IlluSaisons: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const C = { x: 400, y: 292 };
  const R = 250;
  const theta = (f / duree) * 450;
  const phi = rad(theta * 2);
  const ampleur = 0.38 * p(f, d[0] + 20, d[0] + 110);
  const a = 0.5 + ampleur * Math.sin(phi);
  const b = 0.5 - ampleur * Math.sin(phi);
  const relais = p(f, d[1], d[1] + 30);
  const apparition = [d[0] + 62, d[0] + 92, d[0] + 122, d[0] + 148];
  const secteur = (i: number) => {
    const a1 = rad(-90 + i * 90);
    const a2 = rad(i * 90);
    return `M0 0 L${Math.cos(a1) * R} ${Math.sin(a1) * R} A${R} ${R} 0 0 1 ${Math.cos(a2) * R} ${Math.sin(a2) * R} Z`;
  };
  return (
    <Scene>
      {/* Le socle. */}
      <path d={`M${C.x} ${C.y} L322 864 M${C.x} ${C.y} L478 864`} stroke={F.encre} strokeWidth={22} strokeLinecap="round" />
      <path d={`M${C.x} ${C.y} L322 864 M${C.x} ${C.y} L478 864`} stroke={F.cuirClair} strokeWidth={14} strokeLinecap="round" />
      <line x1={30} x2={770} y1={870} y2={870} stroke={F.encre} strokeWidth={4} />
      <g transform={`translate(${C.x} ${C.y}) rotate(${theta})`}>
        {QUARTIERS.map((q, i) => (
          <g key={q.mot}>
            <path d={secteur(i)} fill={F.papier} />
            <path d={secteur(i)} fill={q.fond} opacity={p(f, apparition[i] - 8, apparition[i] + 14)} />
          </g>
        ))}
        {[0, 90].map((x) => (
          <line key={x} x1={-R} x2={R} y1={0} y2={0} stroke={F.encre} strokeWidth={5} transform={`rotate(${x})`} />
        ))}
        <circle r={R} fill="none" stroke={F.encre} strokeWidth={24} />
        <circle r={R} fill="none" stroke={F.cuir} strokeWidth={16} />
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i} cx={Math.cos(rad(i * 30)) * R} cy={Math.sin(rad(i * 30)) * R} r={3.5} fill={F.orClair} />
        ))}
      </g>
      {QUARTIERS.map((q, i) => {
        const m = rad(theta - 45 + i * 90);
        return (
          <Libelle key={q.mot} x={C.x + Math.cos(m) * 138} y={C.y + Math.sin(m) * 138 + 9} taille={25} graisse={600} couleur={q.encre} opacite={p(f, apparition[i], apparition[i] + 16)}>
            {q.mot}
          </Libelle>
        );
      })}
      <circle cx={C.x} cy={C.y} r={32} fill={F.or} stroke={F.encre} strokeWidth={4.5} />
      <circle cx={C.x} cy={C.y} r={10} fill={F.encre} />
      {/* La goulotte : le grain suit le niveau. */}
      <rect x={265} y={700} width={270} height={30} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <g opacity={relais}>
        {Array.from({ length: 9 }, (_, i) => {
          const t = reste(i / 9 - 3 * a);
          return <circle key={i} cx={270 + t * 260} cy={715} r={8} fill={F.or} stroke={F.orFonce} strokeWidth={2} />;
        })}
      </g>
      <Grenier id="ch13-gr1" x={170} niveau={a} f={f} />
      <Grenier id="ch13-gr2" x={630} niveau={b} f={f} />
    </Scene>
  );
};

/* ---------- Plan 13 : le thermomètre plein et le cœur enrubanné, petit et immobile. ---------- */

const IlluFinCoeur: React.FC<PropsIllustration> = ({ f }) => (
  <Scene>
    <Thermometre x={400} y={240} h={470} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
    <g opacity={p(f, 55, 85)}>
      <CoeurEnrubanne id="ch13-cfin" x={400} y={110} s={1.25} />
    </g>
  </Scene>
);

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluDeuxSens,
  p3: IlluDeuxVases,
  p4: IlluChamp,
  p5: IlluLampes,
  p6: IlluSource,
  p7: IlluRouleau,
  p8: IlluEprouvette,
  p9: IlluDeuxBarres,
  p10: IlluCoeur,
  p11: IlluFratrie,
  p12: IlluSaisons,
  fin: IlluFinCoeur,
};

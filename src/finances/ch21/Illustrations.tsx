import React from 'react';
import { interpolate } from 'remotion';
import { IlluFin, IlluOuverture, Libelle, Piece, PropsIllustration, Scene, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';
import { PARTIES } from './textes.gen';

/**
 * Image où la lecture atteint `extrait` dans la phrase `i` : 2,5 images par caractère, la règle de
 * `frise.ts`. Le mouvement suit ainsi les mots, même quand le plan n'a qu'une seule longue phrase.
 */
const instant = (id: string, i: number, extrait: string, d: number[]) => {
  const texte = PARTIES.find((x) => x.id === id)!.temps[i].texte.replace(/\*\*/g, '');
  const position = texte.indexOf(extrait);
  if (position < 0) throw new Error(`Extrait introuvable dans ${id} : ${extrait}`);
  return d[i] + position * 2.5;
};

/** Oscillation qui s'amortit après l'instant `t`. */
const amorti = (f: number, t: number, amplitude: number, periode = 5.5, duree = 26) => (f < t ? 0 : amplitude * Math.exp(-(f - t) / duree) * Math.sin((f - t) / periode));

const lineaire = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

/* ------------------------------------------------------------------ Plan 2 : le manteau ------- */

const Y_FIL = 66;
const SOL = 800;

/** Le manteau sur son cintre, accroché à une poulie : l'origine est la poulie, sur le fil. */
const Manteau: React.FC<{ x: number; angle: number }> = ({ x, angle }) => (
  <g transform={`translate(${x} ${Y_FIL})`}>
    <g transform={`rotate(${angle}) scale(0.92)`}>
      <path d="M0 8 V30 Q0 42 -9 42" fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      <path d="M0 42 L-58 74 M0 42 L58 74" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
      {/* Les manches, derrière le corps. */}
      <path d="M-44 66 Q-78 72 -82 104 L-96 232 L-62 238 L-44 124 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M44 66 Q78 72 82 104 L96 232 L62 238 L44 124 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-96 232 L-62 238 L-64 222 L-94 216 Z M96 232 L62 238 L64 222 L94 216 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      {/* Le corps et sa doublure. */}
      <path d="M-30 56 L-62 72 L-74 320 H74 L62 72 L30 56 L0 122 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M-30 56 Q0 74 30 56 L0 122 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <path d="M-30 56 L-46 96 L-20 104 L0 122 Z M30 56 L46 96 L20 104 L0 122 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <path d="M0 122 V320" stroke={F.encre} strokeWidth={3} />
      <path d="M-74 320 H74 L73 302 H-73 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      {[160, 205, 250].map((y) => (
        <circle key={y} cx={14} cy={y} r={6} fill={F.or} stroke={F.encre} strokeWidth={2} />
      ))}
    </g>
    <circle r={10} fill={F.or} stroke={F.encre} strokeWidth={4} />
  </g>
);

/** Les pierres qui s'écroulent, dans l'ordre de leur chute, avec leur place au sol. */
const CHUTES = [
  { c: 5, r: 6, x: 288, y: 785, a: 3 },
  { c: 5, r: 5, x: 328, y: 785, a: -2 },
  { c: 3, r: 6, x: 368, y: 785, a: 3 },
  { c: 4, r: 6, x: 308, y: 755, a: -7 },
  { c: 1, r: 6, x: 349, y: 755, a: 6 },
  { c: 4, r: 5, x: 329, y: 725, a: 12 },
];
const L_PIERRE = 40;
const H_PIERRE = 30;

const Pierre: React.FC<{ x: number; y: number; a?: number }> = ({ x, y, a = 0 }) => (
  <rect x={-L_PIERRE / 2 + 1} y={-H_PIERRE / 2 + 1} width={L_PIERRE - 2} height={H_PIERRE - 2} rx={3} transform={`translate(${x} ${y}) rotate(${a})`} fill={F.filet} stroke={F.encre} strokeWidth={2.5} />
);

const Ruines: React.FC<{ f: number; debut: number }> = ({ f, debut }) => {
  const pierres = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 6; c++) {
      const x = 44 + c * L_PIERRE + (r % 2 === 1 ? 14 : 0);
      const y = SOL - H_PIERRE / 2 - r * H_PIERRE;
      const n = CHUTES.findIndex((s) => s.c === c && s.r === r);
      if (n === -1) {
        pierres.push(<Pierre key={`${r}-${c}`} x={x} y={y} />);
      } else {
        const s = CHUTES[n];
        const a = debut + n * 7;
        const t = lineaire(f, a, a + 22);
        const yy = y + (s.y - y) * t * t;
        const xx = x + (s.x - x) * t;
        pierres.push(<Pierre key={`${r}-${c}`} x={xx} y={yy} a={s.a * t + (n % 2 ? 180 : -180) * t * (1 - t) * 0.5} />);
      }
    }
  }
  return <g>{pierres}</g>;
};

/** Un battant d'armoire vu en perspective : il pivote sur sa charnière. */
const Battant: React.FC<{ charniere: number; sens: 1 | -1; angle: number; haut: number; bas: number; largeur: number }> = ({ charniere, sens, angle, haut, bas, largeur }) => {
  const rad = (angle * Math.PI) / 180;
  const libre = charniere + sens * largeur * Math.cos(rad);
  const dy = 12 * Math.sin(rad);
  const pt = (t: number, v: number) => {
    const x = charniere + (libre - charniere) * t;
    const m = (haut + bas) / 2;
    const y = m + (v - m) * (1 + (t * dy) / ((bas - haut) / 2));
    return `${x} ${y}`;
  };
  const dehors = angle > 90;
  return (
    <g>
      <path d={`M${pt(0, haut)} L${pt(1, haut)} L${pt(1, bas)} L${pt(0, bas)} Z`} fill={dehors ? F.cuir : F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {[
        [haut + 22, haut + (bas - haut) / 2 - 12],
        [haut + (bas - haut) / 2 + 12, bas - 22],
      ].map(([a, b]) => (
        <path key={a} d={`M${pt(0.16, a)} L${pt(0.84, a)} L${pt(0.84, b)} L${pt(0.16, b)} Z`} fill="none" stroke={F.encre} strokeWidth={2.5} opacity={dehors ? 0.5 : 0.75} />
      ))}
      {dehors ? null : <circle cx={charniere + (libre - charniere) * 0.92} cy={(haut + bas) / 2} r={6} fill={F.or} stroke={F.encre} strokeWidth={2} />}
    </g>
  );
};

/** Plan 2 : le manteau glisse vers la maison ; l'armoire s'ouvre, vide ; le manteau repart, sans preneur. */
const IlluManteau: React.FC<PropsIllustration> = ({ f, d }) => {
  const tManteau = instant('p2', 0, 'Tu as un manteau', d);
  const tChef = instant('p2', 0, 'sois notre chef', d);
  const tRuines = instant('p2', 0, 'Prends ces ruines', d);
  const tRepond = instant('p2', 0, 'Ce jour-là', d);
  const tMaison = instant('p2', 0, 'et dans ma maison', d);
  const tPain = instant('p2', 0, 'ni pain', d);
  const tVetement = instant('p2', 0, 'ni vêtement', d);
  const tRefus = instant('p2', 0, 'ne m', d);

  const DEPART = 112;
  const ARRIVEE = 276;
  const aller = p(f, tManteau - 110, tManteau);
  const retour = p(f, tRefus, tRefus + 55);
  const x = DEPART + (ARRIVEE - DEPART) * aller - (ARRIVEE - DEPART) * retour;
  const angle =
    -5 * Math.sin(Math.PI * aller) +
    5 * Math.sin(Math.PI * retour) +
    amorti(f, tManteau, 5) +
    amorti(f, tRefus + 55, -5) +
    1.1 * Math.sin(f / 26);

  const facade = 1 - p(f, tRepond, tRepond + 45);
  const ouvre = p(f, tMaison, tMaison + 38);
  const chef = p(f, tChef - 6, tChef + 14) * (1 - p(f, tRefus - 6, tRefus + 14));
  const ruines = p(f, tRuines + 12, tRuines + 40);
  const cintre = amorti(f, tMaison + 24, 7, 8, 40);

  return (
    <Scene>
      {/* Le sol, le poteau et le fil. */}
      <line x1={0} x2={800} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      <line x1={12} x2={12} y1={Y_FIL - 14} y2={SOL} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
      <line x1={590} x2={590} y1={Y_FIL - 14} y2={128} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
      <line x1={12} x2={590} y1={Y_FIL} y2={Y_FIL} stroke={F.encre} strokeWidth={4} />

      {/* La cheminée, sans fumée. */}
      <rect x={690} y={176} width={44} height={90} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={684} y={166} width={56} height={14} fill={F.cuir} stroke={F.encre} strokeWidth={3} />

      {/* La maison en coupe. */}
      <path d="M590 122 L800 352 H380 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M590 164 L752 340 H428 Z" fill={F.papier} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <path d="M590 164 V340 M510 252 L590 340 M670 252 L590 340" stroke={F.cuirClair} strokeWidth={6} />
      <rect x={396} y={352} width={388} height={448} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={410} y={366} width={360} height={420} fill={F.papier} stroke={F.encre} strokeWidth={3} />

      {/* L'armoire. */}
      <rect x={448} y={424} width={284} height={356} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <rect x={438} y={406} width={304} height={20} rx={3} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={458} y={434} width={264} height={336} fill={F.filet} stroke={F.encre} strokeWidth={3} />
      <line x1={458} x2={722} y1={452} y2={452} stroke={F.encre} strokeWidth={5} />
      <g transform={`rotate(${cintre} 590 452)`}>
        <path d="M590 452 V466 Q590 476 582 476 M590 476 L546 500 H634 Z" fill="none" stroke={F.encre} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {[586, 682].map((y) => (
        <g key={y}>
          <rect x={458} y={y} width={264} height={10} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        </g>
      ))}
      <Libelle x={590} y={663} taille={32} graisse={600} couleur={F.argile} opacite={p(f, tPain, tPain + 16)}>{LIBELLES.pain}</Libelle>
      <Libelle x={590} y={560} taille={32} graisse={600} couleur={F.argile} opacite={p(f, tVetement, tVetement + 16)}>{LIBELLES.vetement}</Libelle>
      <g>
        <Battant charniere={458} sens={1} angle={ouvre * 106} haut={434} bas={770} largeur={132} />
        <Battant charniere={722} sens={-1} angle={ouvre * 106} haut={434} bas={770} largeur={132} />
      </g>

      {/* La façade, qui s'efface quand il répond : on voit alors l'intérieur. */}
      {facade > 0 ? (
        <g opacity={facade}>
          <rect x={410} y={366} width={360} height={420} fill={F.papier} stroke={F.encre} strokeWidth={3} />
          <rect x={540} y={560} width={100} height={226} rx={50} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <circle cx={618} cy={680} r={6} fill={F.or} stroke={F.encre} strokeWidth={2} />
          {[448, 660].map((xf) => (
            <g key={xf}>
              <rect x={xf} y={420} width={72} height={100} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
              <path d={`M${xf + 36} 420 V520 M${xf} 470 H${xf + 72}`} stroke={F.encre} strokeWidth={3} />
            </g>
          ))}
        </g>
      ) : null}

      {/* Le mur qui s'écroule, sous le manteau. */}
      <Ruines f={f} debut={tRuines} />
      <Libelle x={190} y={850} taille={30} opacite={ruines} couleur={F.encre2}>{LIBELLES.ruines}</Libelle>

      <Libelle x={262} y={420} taille={30} graisse={600} couleur={F.orFonce} opacite={chef}>{LIBELLES.chef}</Libelle>
      <Manteau x={x} angle={angle} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 3 : la balance ------- */

const Poids: React.FC<{ x: number; y: number; opacite: number }> = ({ x, y, opacite }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacite}>
    <circle cy={-65} r={11} fill="none" stroke={F.encre} strokeWidth={6} />
    <path d="M-47 0 H47 L31 -56 H-31 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-26 -44 H26" stroke={F.cuirClair} strokeWidth={5} strokeLinecap="round" />
  </g>
);

const CHAINE = 268;

/** Un plateau suspendu à un étrier : ses chaînes droites laissent la place de poser les charges. */
const Plateau: React.FC<{ x: number; y: number; children: React.ReactNode }> = ({ x, y, children }) => (
  <g>
    <line x1={x} x2={x} y1={y} y2={y + 36} stroke={F.encre} strokeWidth={6} />
    <line x1={x - 112} x2={x + 112} y1={y + 36} y2={y + 36} stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
    {[-112, 112].map((dx) => (
      <line key={dx} x1={x + dx} x2={x + dx} y1={y + 36} y2={y + 36 + CHAINE} stroke={F.encre} strokeWidth={5} strokeDasharray="1 8" strokeLinecap="round" />
    ))}
    {children}
    <path d={`M${x - 122} ${y + 36 + CHAINE} H${x + 122} Q${x} ${y + 36 + CHAINE + 46} ${x - 122} ${y + 36 + CHAINE} Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

const PLACES_POIDS = [
  { dx: -50, dy: 0 },
  { dx: 50, dy: 0 },
  { dx: 0, dy: -78 },
];
const PLACES_PIECES = [
  { dx: -64, dy: -30 },
  { dx: 0, dy: -30 },
  { dx: 64, dy: -30 },
  { dx: -32, dy: -86 },
  { dx: 32, dy: -86 },
  { dx: 0, dy: -142 },
];

/** Plan 3 : les responsabilités font pencher la balance, les ressources la redressent. */
const IlluBalance: React.FC<PropsIllustration> = ({ f, d }) => {
  const tResp = instant('p3', 0, 'responsabilités', d);
  const tResp2 = instant('p3', 0, 'et les responsabilités', d);
  const tRess = instant('p3', 0, 'ressources', d);
  const tDonner = instant('p3', 0, 'le leadership, c', d);

  const CHUTE = 15;
  const ANGLE = 13;
  const posePoids = PLACES_POIDS.map((_, i) => tResp - 30 + i * 30);
  const posePieces = PLACES_PIECES.map((_, i) => tResp2 + 24 + (i * (tRess + 10 - (tResp2 + 24))) / 5);

  let bascule = 0;
  posePoids.forEach((t) => {
    bascule += (ANGLE / 3) * p(f, t + CHUTE, t + CHUTE + 16) + amorti(f, t + CHUTE, 1.1, 3.4, 14);
  });
  posePieces.forEach((t) => {
    bascule -= (ANGLE / 6) * p(f, t + CHUTE, t + CHUTE + 14) + amorti(f, t + CHUTE, 0.5, 3.4, 12);
  });

  const rad = (bascule * Math.PI) / 180;
  const cx = 400;
  const cy = 128;
  const L = 244;
  const gx = cx - L * Math.cos(rad);
  const gy = cy + L * Math.sin(rad);
  const dx = cx + L * Math.cos(rad);
  const dy = cy - L * Math.sin(rad);
  const fond = (y: number) => y + 36 + CHAINE;

  const donner = p(f, tDonner - 4, tDonner + 26);
  const rayons = p(f, tDonner, tDonner + 40);

  return (
    <Scene>
      {/* Le pied. */}
      <rect x={cx - 11} y={cy} width={22} height={590} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d={`M${cx - 136} 748 Q${cx} 668 ${cx + 136} 748 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />

      {/* La lumière de l'équilibre. */}
      {Array.from({ length: 9 }, (_, i) => {
        const a = ((-170 + i * 20) * Math.PI) / 180;
        return (
          <line key={i} x1={cx + Math.cos(a) * 42} y1={cy + Math.sin(a) * 42} x2={cx + Math.cos(a) * (42 + 44 * rayons)} y2={cy + Math.sin(a) * (42 + 44 * rayons)} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={rayons} />
        );
      })}

      <Plateau x={gx} y={gy}>
        {PLACES_POIDS.map((c, i) => {
          const t = lineaire(f, posePoids[i], posePoids[i] + CHUTE);
          return <Poids key={i} x={gx + c.dx} y={fond(gy) + c.dy - (1 - t * t) * 80} opacite={p(f, posePoids[i] - 4, posePoids[i] + 4)} />;
        })}
      </Plateau>
      <Plateau x={dx} y={dy}>
        {PLACES_PIECES.map((c, i) => {
          const t = lineaire(f, posePieces[i], posePieces[i] + CHUTE);
          return <Piece key={i} x={dx + c.dx} y={fond(dy) + c.dy - (1 - t * t) * 60} r={30} opacite={p(f, posePieces[i] - 4, posePieces[i] + 4)} />;
        })}
      </Plateau>

      {/* Le fléau. */}
      <line x1={gx} y1={gy} x2={dx} y2={dy} stroke={F.encre} strokeWidth={12} strokeLinecap="round" />
      <circle cx={gx} cy={gy} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <circle cx={dx} cy={dy} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} />
      <circle cx={cx} cy={cy} r={22} fill={F.or} stroke={F.encre} strokeWidth={4} />

      <Libelle x={gx} y={fond(gy) + 72} taille={27} graisse={600} opacite={p(f, tResp - 10, tResp + 10)}>{LIBELLES.responsabilites}</Libelle>
      <Libelle x={dx} y={fond(dy) + 72} taille={27} graisse={600} couleur={F.orFonce} opacite={p(f, tRess - 14, tRess + 6)}>{LIBELLES.ressources}</Libelle>

      <text x={cx} y={826} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={46} fontWeight={500} fill={F.orFonce} opacity={donner}>
        {LIBELLES.donner}
      </text>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 4 : les cartouches --- */

const L_CARTE = 178;
const H_CARTE = 205;
const ECART_X = 12;
const ECART_Y = 18;
const X_GRILLE = 26;
const Y_GRILLE = 24;
const Y_SEUIL = Y_GRILLE + 3 * H_CARTE + 2 * ECART_Y + 30;

const place = (s: number) => ({ x: X_GRILLE + (s % 4) * (L_CARTE + ECART_X), y: Y_GRILLE + Math.floor(s / 4) * (H_CARTE + ECART_Y) });
const centreSceau = (s: number) => {
  const c = place(s);
  return { x: c.x + L_CARTE / 2, y: c.y + H_CARTE - 66 };
};

/** Le sceau : le même partout, de la cire et une couronne. */
const Sceau: React.FC<{ x: number; y: number; echelle: number; opacite: number }> = ({ x, y, echelle, opacite }) => (
  <g transform={`translate(${x} ${y}) rotate(-8) scale(${echelle})`} opacity={opacite}>
    <path
      d={`M${Array.from({ length: 24 }, (_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const r = i % 2 === 0 ? 46 : 41;
        return `${(Math.cos(a) * r).toFixed(2)} ${(Math.sin(a) * r).toFixed(2)}`;
      }).join(' L')} Z`}
      fill={F.argile}
      stroke={F.encre}
      strokeWidth={3}
      strokeLinejoin="round"
    />
    <circle r={32} fill="none" stroke={F.orClair} strokeWidth={2.5} />
    <path d="M-19 13 L-23 -11 L-10 1 L0 -17 L10 1 L23 -11 L19 13 Z" fill={F.orClair} stroke={F.encre} strokeWidth={2} strokeLinejoin="round" />
  </g>
);

const Tampon: React.FC<{ x: number; y: number; opacite: number }> = ({ x, y, opacite }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacite}>
    <ellipse cy={-72} rx={28} ry={23} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
    <path d="M-13 -52 H13 L20 -20 H-20 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-46} y={-20} width={92} height={20} rx={4} fill={F.or} stroke={F.encre} strokeWidth={4} />
  </g>
);

/** Un cartouche aux coins rentrants : deux lignes vides, en attente d'un nom et d'un don. */
const Cartouche: React.FC<{ x: number; y: number; bord: string; epaisseur: number; nom: number }> = ({ x, y, bord, epaisseur, nom }) => {
  const c = 16;
  const trace = `M${x + 24} ${y + 40} q7 -13 14 0 ${Array.from({ length: 8 }, () => 't14 0').join(' ')}`;
  return (
    <g>
      <path
        d={`M${x + c} ${y} H${x + L_CARTE - c} Q${x + L_CARTE - c} ${y + c} ${x + L_CARTE} ${y + c} V${y + H_CARTE - c} Q${x + L_CARTE - c} ${y + H_CARTE - c} ${x + L_CARTE - c} ${y + H_CARTE} H${x + c} Q${x + c} ${y + H_CARTE - c} ${x} ${y + H_CARTE - c} V${y + c} Q${x + c} ${y + c} ${x + c} ${y} Z`}
        fill={F.papier}
        stroke={bord}
        strokeWidth={epaisseur}
        strokeLinejoin="round"
      />
      <line x1={x + 24} x2={x + L_CARTE - 24} y1={y + 42} y2={y + 42} stroke={F.filet} strokeWidth={4} />
      <line x1={x + 24} x2={x + L_CARTE - 24} y1={y + 70} y2={y + 70} stroke={F.filet} strokeWidth={4} />
      {nom > 0 ? <path d={trace} fill="none" stroke={F.encre} strokeWidth={3.5} strokeLinecap="round" pathLength={1} strokeDasharray={`${nom} 1`} /> : null}
    </g>
  );
};

/** Plan 4 : douze cartouches, le même sceau un à un, puis le seuil sous les douze. */
const IlluCartouches: React.FC<PropsIllustration> = ({ f, d }) => {
  const tPasEnsemble = instant('p4', 0, 'de ne pas prendre', d);
  const tOffrandes = instant('p4', 0, 'leurs offrandes', d);
  const tAnonymat = instant('p4', 1, 'il n', d);
  const tSauter = instant('p4', 1, 'sans en sauter', d);
  const tMeme = instant('p4', 2, 'le même don', d);
  const tSeuil = instant('p4', 2, 'un seuil minimal', d);
  const tExempte = instant('p4', 2, 'auquel aucun', d);

  const X_PILE = 400 - L_CARTE / 2;
  const Y_PILE = 190;
  const ECHELLE_PILE = 1.5;
  // « Leurs offrandes ensemble » : écrit sur « de ne pas prendre », barré quand les mots sont lus, tenu
  // plus d'une seconde. Alors seulement les cartouches se séparent, puis le tampon passe sur chacun.
  const finBarre = tOffrandes + 36;
  const debutDonne = finBarre + 34;
  const pasDonne = 6;
  const debutFrappe = debutDonne + 11 * pasDonne + 28;
  const pasFrappe = (d[2] - 34 - debutFrappe) / 12;
  const frappe = (s: number) => debutFrappe + s * pasFrappe + pasFrappe * 0.62;

  // Le tampon : il saute d'un cartouche au suivant, descend, imprime et remonte.
  const rang = Math.max(0, Math.min(11, Math.floor((f - debutFrappe) / pasFrappe)));
  const u = (f - (debutFrappe + rang * pasFrappe)) / pasFrappe;
  const ici = centreSceau(rang);
  const avant = rang === 0 ? { x: ici.x, y: ici.y } : centreSceau(rang - 1);
  const saut = p(u, 0, 0.42);
  const appui = p(u, 0.42, 0.62) * (1 - p(u, 0.68, 0.98));
  const xT = avant.x + (ici.x - avant.x) * saut;
  const yT = avant.y + (ici.y - avant.y) * saut - 66 * (1 - appui) + 12 * appui;
  const oT = p(f, debutFrappe - 16, debutFrappe) * (1 - p(f, d[2] - 26, d[2] - 8));

  const barre = p(f, tOffrandes, finBarre);
  const seuil = p(f, tSeuil, tSeuil + 52);
  const fini = p(f, tExempte, tExempte + 24);

  return (
    <Scene>
      {Array.from({ length: 12 }, (_, i) => {
        // La carte du dessus part la première vers le premier emplacement.
        const s = 11 - i;
        const c = place(s);
        const pose = d[0] + 8 + i * 17;
        const arrive = p(f, pose, pose + 18);
        const xPile = X_PILE + [0, 3, -3, 4, -4, 2, -2, 4, -3, 2, -1, 0][i];
        const yPile = Y_PILE - i * 5;
        const depart = debutDonne + s * pasDonne;
        const donne = p(f, depart, depart + 24);
        const x = xPile + (c.x - xPile) * donne;
        const y = yPile - (1 - arrive) * 70 + (c.y - yPile) * donne;
        const tourne = [-1, 0.8, -0.5, 1, -0.8, 0.5, -1, 0.8, 0.5, -0.8, 0.8, 0][i] * (1 - donne);
        const t = frappe(s);
        const posee = p(f, t, t + 6);
        const encours = f >= t - pasFrappe * 0.62 && f < t + pasFrappe * 0.38 && f < d[2];
        const vague = d[2] + 8 + s * 6;
        const bosse = p(f, vague, vague + 11) * (1 - p(f, vague + 11, vague + 24));
        const sc = centreSceau(s);
        const bord = encours || fini > 0.5 ? F.or : F.encre;
        const cxC = x + L_CARTE / 2;
        const cyC = y + H_CARTE / 2;
        const ech = ECHELLE_PILE + (1 - ECHELLE_PILE) * donne;
        return (
          <g key={i} opacity={p(f, pose, pose + 7)} transform={`translate(${cxC} ${cyC}) rotate(${tourne}) scale(${ech}) translate(${-cxC} ${-cyC})`}>
            <Cartouche x={x} y={y} bord={bord} epaisseur={encours || fini > 0.5 ? 5 : 3} nom={lineaire(f, t, t + 12)} />
            {posee > 0 ? <Sceau x={sc.x} y={sc.y} echelle={(1.18 - 0.18 * posee) * (1 + 0.2 * bosse)} opacite={posee} /> : null}
          </g>
        );
      })}

      {oT > 0 ? <Tampon x={xT} y={yT} opacite={oT} /> : null}

      {/* « Ensemble » : le mot barré quand Dieu dit de ne pas les prendre ainsi. */}
      <g opacity={p(f, tPasEnsemble - 6, tPasEnsemble + 14) * (1 - p(f, debutDonne, debutDonne + 14))}>
        <Libelle x={400} y={560} taille={32} graisse={600} couleur={F.encre}>{LIBELLES.ensemble}</Libelle>
        {barre > 0 ? <line x1={205} x2={205 + 390 * barre} y1={549} y2={549} stroke={F.argile} strokeWidth={5} strokeLinecap="round" /> : null}
      </g>

      {/* Le seuil. */}
      {seuil > 0 ? (
        <g>
          <line x1={X_GRILLE} x2={X_GRILLE + (800 - 2 * X_GRILLE) * seuil} y1={Y_SEUIL} y2={Y_SEUIL} stroke={F.orFonce} strokeWidth={8} strokeLinecap="round" />
          <line x1={X_GRILLE} x2={X_GRILLE} y1={Y_SEUIL - 14} y2={Y_SEUIL + 14} stroke={F.orFonce} strokeWidth={6} strokeLinecap="round" />
          <line x1={774} x2={774} y1={Y_SEUIL - 14} y2={Y_SEUIL + 14} stroke={F.orFonce} strokeWidth={6} strokeLinecap="round" opacity={p(f, tSeuil + 46, tSeuil + 54)} />
        </g>
      ) : null}

      <Libelle x={400} y={772} taille={32} graisse={600} opacite={p(f, tAnonymat, tAnonymat + 18) * (1 - p(f, tSauter - 12, tSauter))}>{LIBELLES.anonymat}</Libelle>
      <Libelle x={400} y={772} taille={32} graisse={600} opacite={p(f, tSauter, tSauter + 14) * (1 - p(f, d[2] - 6, d[2] + 8))}>{LIBELLES.sauter}</Libelle>
      <Libelle x={400} y={772} taille={32} graisse={600} opacite={p(f, tMeme, tMeme + 14) * (1 - p(f, tSeuil - 10, tSeuil + 2))}>{LIBELLES.meme}</Libelle>
      <Libelle x={400} y={772} taille={36} graisse={600} couleur={F.orFonce} opacite={p(f, tSeuil + 4, tSeuil + 22)}>{LIBELLES.seuil}</Libelle>
      <Libelle x={400} y={828} taille={29} couleur={F.encre2} opacite={fini}>{LIBELLES.exempte}</Libelle>
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuverture,
  p2: IlluManteau,
  p3: IlluBalance,
  p4: IlluCartouches,
  fin: IlluFin,
};

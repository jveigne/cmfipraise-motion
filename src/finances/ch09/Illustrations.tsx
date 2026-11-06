import React from 'react';
import { interpolateColors } from 'remotion';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const mix = (t: number, a: string, b: string) => interpolateColors(t, [0, 1], [a, b]);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const TOUR = Math.PI * 2;

/** Pièce qui roule : une seule encoche, au bord, tourne avec elle. */
const PieceRoulante: React.FC<{ x: number; y: number; r: number; angle: number; opacite?: number }> = ({ x, y, r, angle, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle})`} opacity={opacite}>
    <Piece x={0} y={0} r={r} />
    <line x1={r * 0.58} y1={0} x2={r} y2={0} stroke={F.orFonce} strokeWidth={Math.max(2, r * 0.14)} strokeLinecap="round" />
  </g>
);

/** Flamme vivante, posée sur son point d'origine (0, 0). */
const Flamme: React.FC<{ x: number; y: number; s: number; f: number; graine: number; dehors?: string; dedans?: string; opacite?: number }> = ({ x, y, s, f, graine, dehors = F.or, dedans = F.orClair, opacite = 1 }) => {
  const sx = 1 + Math.sin(f / 5 + graine) * 0.06;
  const sy = 1 + Math.sin(f / 7 + graine * 2) * 0.08;
  const FORME = 'M0 6 C-34 4 -42 -34 -20 -62 C-14 -48 -6 -46 -4 -56 C-4 -78 8 -96 14 -108 C18 -84 44 -58 36 -26 C32 -6 18 6 0 6 Z';
  return (
    <g transform={`translate(${x} ${y}) scale(${s * sx} ${s * sy})`} opacity={opacite}>
      <path d={FORME} fill={dehors} stroke={F.orFonce} strokeWidth={3 / s} strokeLinejoin="round" />
      <path d={FORME} fill={dedans} transform="translate(2 2) scale(0.52)" />
    </g>
  );
};

/** Le seuil du chapitre : une porte fermée, vue de face, un trait de lumière dessous. */
const Seuil: React.FC<{ lumiere: number; f: number; piece: { y: number; opacite: number }; gloire?: number }> = ({ lumiere, f, piece, gloire = 0 }) => {
  const OUVERTURE = 'M230 690 V270 A170 170 0 0 1 570 270 V690 Z';
  const vibre = 1 + Math.sin(f / 13) * 0.03;
  return (
    <g>
      <defs>
        <clipPath id="ch09-porte">
          <path d={OUVERTURE} />
        </clipPath>
        <linearGradient id="ch09-nappe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0.12} />
        </linearGradient>
      </defs>
      {/* Marches. */}
      <rect x={90} y={765} width={620} height={45} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={90} y={810} width={620} height={25} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={150} y={690} width={500} height={45} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={150} y={735} width={500} height={30} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {/* Encadrement de pierre. */}
      <path d="M175 690 V270 A225 225 0 0 1 625 270 V690 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {[-72, -54, -36, -18, 0, 18, 36, 54, 72].map((a) => {
        const r = (a * Math.PI) / 180;
        return <line key={a} x1={400 + Math.sin(r) * 170} y1={270 - Math.cos(r) * 170} x2={400 + Math.sin(r) * 225} y2={270 - Math.cos(r) * 225} stroke={F.encre2} strokeWidth={3} />;
      })}
      {[340, 410, 480, 550, 620].map((y) => (
        <g key={y}>
          <line x1={175} x2={230} y1={y} y2={y} stroke={F.encre2} strokeWidth={3} />
          <line x1={570} x2={625} y1={y} y2={y} stroke={F.encre2} strokeWidth={3} />
        </g>
      ))}
      {/* La porte. */}
      <path d={OUVERTURE} fill={F.cuir} />
      <g clipPath="url(#ch09-porte)">
        {[298, 366, 434, 502].map((x) => (
          <line key={x} x1={x} x2={x} y1={90} y2={690} stroke={F.encre} strokeWidth={3} />
        ))}
        {[300, 560].map((y) => (
          <g key={y}>
            <rect x={230} y={y} width={230} height={22} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
            <circle cx={440} cy={y + 11} r={15} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
          </g>
        ))}
      </g>
      <circle cx={520} cy={432} r={17} fill="none" stroke={F.or} strokeWidth={7} />
      <circle cx={520} cy={412} r={7} fill={F.or} stroke={F.encre} strokeWidth={2} />
      <path d={OUVERTURE} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {gloire > 0 ? <path d={OUVERTURE} fill="none" stroke={F.orClair} strokeWidth={9} opacity={gloire * 0.9} strokeLinejoin="round" /> : null}
      {/* Le trait de lumière et la nappe qu'il pose sur les marches. */}
      <path d="M236 692 H564 L700 806 H100 Z" fill="url(#ch09-nappe)" opacity={lumiere * vibre * 0.85} />
      <rect x={232} y={678} width={336} height={22} rx={8} fill={F.orClair} opacity={lumiere * 0.75 * vibre} />
      <rect x={232} y={684} width={336} height={8} fill={F.papier} opacity={0.35 + lumiere * 0.65} stroke={F.or} strokeWidth={1.5} />
      {gloire > 0
        ? Array.from({ length: 9 }, (_, i) => {
            const a = ((-40 + i * 10) * Math.PI) / 180;
            const x0 = 400 + Math.sin(a) * 260;
            return <line key={i} x1={x0} y1={706} x2={x0 + Math.sin(a) * 70 * gloire} y2={706 + Math.cos(a) * 34 * gloire} stroke={F.or} strokeWidth={5} strokeLinecap="round" opacity={gloire * 0.7} />;
          })
        : null}
      {piece.opacite > 0 ? <Piece x={400} y={piece.y} r={42} opacite={piece.opacite} /> : null}
    </g>
  );
};

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const pose = p(f, 28, 72);
  const lumiere = 0.3 + 0.7 * p(f, 76, 150);
  return (
    <Scene>
      <Seuil f={f} lumiere={lumiere} piece={{ y: lerp(470, 680, pose), opacite: p(f, 24, 42) }} gloire={0} />
    </Scene>
  );
};

const IlluConclusion: React.FC<PropsIllustration> = ({ f }) => {
  const eclaire = p(f, 8, 80);
  return (
    <Scene>
      <Thermometre x={104} y={120} h={590} l={62} niveau={1} graduations={false} />
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={143} x2={i % 2 === 0 ? 174 : 162} y1={120 + (590 / 8) * i} y2={120 + (590 / 8) * i} stroke={F.encre2} strokeWidth={3} />
      ))}
      <g transform="translate(150 118) scale(0.82)">
        <Seuil f={f} lumiere={0.85 + 0.15 * eclaire} piece={{ y: 680, opacite: 1 }} gloire={eclaire} />
      </g>
    </Scene>
  );
};

/** Plan 2 : quatre coupelles nourries par le fil de la relation ; le fil coupé, elles se vident. */
const Coupelle: React.FC<{ id: string; x: number; y: number; niveau: number; couleur: number }> = ({ id, x, y, niveau, couleur }) => {
  const corps = mix(couleur, F.papier, F.orClair);
  const trait = mix(couleur, F.encre2, F.encre);
  const fond = 104;
  const yNiveau = 8 + (fond - 8) * (1 - niveau);
  return (
    <g transform={`translate(${x} ${y})`}>
      {niveau > 0.02 || couleur > 0.02 ? <circle cx={0} cy={60} r={128} fill={F.orClair} opacity={0.2 * couleur} /> : null}
      <rect x={-13} y={100} width={26} height={44} fill={mix(couleur, F.filet, F.or)} stroke={trait} strokeWidth={4} />
      <path d="M-68 164 Q-60 140 0 140 Q60 140 68 164 Z" fill={mix(couleur, F.filet, F.or)} stroke={trait} strokeWidth={4} strokeLinejoin="round" />
      <clipPath id={id}>
        <path d="M-112 0 Q-104 92 -30 106 H30 Q104 92 112 0 Z" />
      </clipPath>
      <path d="M-112 0 Q-104 92 -30 106 H30 Q104 92 112 0 Z" fill={corps} />
      <g clipPath={`url(#${id})`}>
        <rect x={-114} y={yNiveau} width={228} height={110} fill={F.or} opacity={niveau > 0.01 ? 1 : 0} />
        <ellipse cx={0} cy={yNiveau} rx={112} ry={10} fill={F.orClair} opacity={niveau > 0.01 ? 1 : 0} />
      </g>
      <path d="M-112 0 Q-104 92 -30 106 H30 Q104 92 112 0" fill="none" stroke={trait} strokeWidth={4} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={112} ry={20} fill={mix(couleur, F.filet, F.orClair)} stroke={trait} strokeWidth={4} />
    </g>
  );
};

const IlluP2: React.FC<PropsIllustration> = ({ f, d }) => {
  const CENTRE = { x: 400, y: 425 };
  const COUPELLES = [
    { x: 150, y: 120, ax: 245, ay: 165 },
    { x: 650, y: 120, ax: 555, ay: 165 },
    { x: 150, y: 590, ax: 245, ay: 635 },
    { x: 650, y: 590, ax: 555, ay: 635 },
  ];
  const coupe = d[1] + 14;
  const retire = p(f, coupe, coupe + 34);
  const couvert = (d[1] - d[0] - 70) / 4;
  return (
    <Scene>
      {COUPELLES.map((c, i) => {
        const a = d[0] - 8 + i * couvert;
        const tire = p(f, a, a + 34);
        const remplit = p(f, a + 26, a + 66);
        const e = d[1] + 34 + i * 46;
        const vide = p(f, e, e + 58);
        const mi = { x: (CENTRE.x + c.ax) / 2, y: (CENTRE.y + c.ay) / 2 };
        const finFil = { x: lerp(CENTRE.x, c.ax, tire), y: lerp(CENTRE.y, c.ay, tire) };
        const couleurFil = mix(vide, F.or, F.filet);
        // Côté centre : le fil se rétracte. Côté coupelle : il retombe.
        const milieuCentre = { x: lerp(mi.x, CENTRE.x, retire), y: lerp(mi.y, CENTRE.y, retire) };
        const chute = { x: lerp(mi.x, c.ax + (c.ax < 400 ? 28 : -28), retire * 0.75), y: lerp(mi.y, c.ay + 115, retire) };
        const appui = { x: lerp((mi.x + c.ax) / 2, c.ax + (c.ax < 400 ? 52 : -52), retire), y: lerp((mi.y + c.ay) / 2, c.ay + 30, retire) };
        const eclat = f < coupe || f > coupe + 20 ? 0 : 1 - (f - coupe) / 20;
        return (
          <g key={i}>
            {f < coupe ? (
              <line x1={CENTRE.x} y1={CENTRE.y} x2={finFil.x} y2={finFil.y} stroke={F.or} strokeWidth={7} strokeLinecap="round" />
            ) : (
              <g>
                {retire < 1 ? <line x1={CENTRE.x} y1={CENTRE.y} x2={milieuCentre.x} y2={milieuCentre.y} stroke={F.or} strokeWidth={7} strokeLinecap="round" /> : null}
                <path d={`M${c.ax} ${c.ay} Q${appui.x} ${appui.y} ${chute.x} ${chute.y}`} fill="none" stroke={couleurFil} strokeWidth={7} strokeLinecap="round" />
              </g>
            )}
            {f < coupe && tire >= 1
              ? [0, 1, 2].map((k) => {
                  const t = ((f + k * 22 + i * 9) % 66) / 66;
                  return <circle key={k} cx={lerp(CENTRE.x, c.ax, t)} cy={lerp(CENTRE.y, c.ay, t)} r={8} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} opacity={1 - p(f, coupe - 8, coupe)} />;
                })
              : null}
            {eclat > 0
              ? [0, 72, 144, 216, 288].map((da) => {
                  const r = (da * Math.PI) / 180;
                  return <line key={da} x1={mi.x + Math.cos(r) * 8} y1={mi.y + Math.sin(r) * 8} x2={mi.x + Math.cos(r) * (8 + 26 * (1 - eclat))} y2={mi.y + Math.sin(r) * (8 + 26 * (1 - eclat))} stroke={F.argile} strokeWidth={5} strokeLinecap="round" opacity={eclat} />;
                })
              : null}
            <Coupelle id={`ch09-coupelle-${i}`} x={c.x} y={c.y} niveau={remplit * (1 - vide)} couleur={remplit * (1 - vide)} />
          </g>
        );
      })}
      {/* Le point central : il porte le mot, et disparaît quand on retire la relation. */}
      <circle cx={CENTRE.x} cy={CENTRE.y} r={94} fill="none" stroke={F.filet} strokeWidth={4} strokeDasharray="10 12" opacity={retire} />
      <g opacity={p(f, 0, 18) * (1 - retire)} transform={`translate(${CENTRE.x} ${CENTRE.y}) scale(${1 + Math.sin(f / 9) * 0.02 * (1 - retire) - retire * 0.25})`}>
        <circle r={112} fill={F.orClair} opacity={0.35} />
        <circle r={94} fill={F.or} stroke={F.orFonce} strokeWidth={5} />
        <circle r={80} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} />
        <Libelle x={0} y={9} taille={25} graisse={600}>{LIBELLES.relation}</Libelle>
      </g>
    </Scene>
  );
};

/** Une volute : monte en ondulant et s'enroule à la pointe. */
const volute = (x0: number, y0: number, ex: number, h: number, phase: number, sens: number, f: number, courbe = 1.3) => {
  const pts: [number, number][] = [];
  const N = 70;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const onde = Math.sin(t * TOUR * 1.25 + phase + f / 48) * 42 * Math.sin(Math.PI * Math.min(1, t * 1.05));
    pts.push([x0 + ex * t ** courbe + onde, y0 - h * t]);
  }
  const [xb, yb] = pts[N];
  const R = 38;
  const cx = xb + sens * R;
  const cy = yb;
  const a0 = sens > 0 ? Math.PI : 0;
  for (let i = 1; i <= 36; i++) {
    const t = i / 36;
    const a = a0 + sens * t * TOUR * 1.35;
    const r = R * (1 - t * 0.82);
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
};

const IlluP3: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const CORPS = 'M336 352 Q400 336 464 352 L446 378 Q430 394 434 424 C520 452 562 540 556 650 C550 735 490 790 448 804 L466 830 H334 L352 804 C310 790 250 735 244 650 C238 540 280 452 366 424 Q370 394 354 378 Z';
  const FISSURE = '405,343 392,400 412,455 385,520 418,590 388,660 410,730 394,790 402,830';
  const fissure = p(f, d[0] + 50, d[1] - 75);
  const ouvre = p(f, d[1] - 62, d[1] - 8);
  const parfum = d[1] - 26;
  const tresRempli = p(f, parfum, duree - 40);
  const VOLUTES = [
    { ex: -300, h: 590, c: 1.5, ph: 0.2, s: 1 },
    { ex: 300, h: 580, c: 1.5, ph: 2.3, s: -1 },
    { ex: -205, h: 625, c: 1.5, ph: 3.5, s: 1 },
    { ex: 205, h: 610, c: 1.5, ph: 5.1, s: -1 },
    { ex: -95, h: 555, c: 1.3, ph: 1.4, s: -1 },
    { ex: 95, h: 565, c: 1.3, ph: 4.2, s: 1 },
    { ex: -320, h: 440, c: 3, ph: 2.6, s: 1 },
    { ex: 320, h: 430, c: 3, ph: 0.9, s: -1 },
    { ex: 0, h: 625, c: 1.3, ph: 3, s: 1 },
  ];
  const Moitie: React.FC<{ sens: -1 | 1 }> = ({ sens }) => {
    const id = sens < 0 ? 'ch09-vase-g' : 'ch09-vase-d';
    const bord = sens < 0 ? '0,830 0,330' : '800,830 800,330';
    return (
      <g transform={`translate(${sens * 44 * ouvre} 0) rotate(${sens * 15 * ouvre} ${sens < 0 ? 334 : 466} 830)`}>
        <clipPath id={id}>
          <polygon points={`${FISSURE} ${bord}`} />
        </clipPath>
        <g clipPath={`url(#${id})`}>
          <path d={CORPS} fill={F.papier} />
          <path d="M290 520 C330 560 300 620 350 670" fill="none" stroke={F.filet} strokeWidth={5} strokeLinecap="round" />
          <path d="M500 480 C470 540 530 610 480 700" fill="none" stroke={F.filet} strokeWidth={5} strokeLinecap="round" />
          <path d="M255 640 C290 660 300 720 345 745" fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" />
          <path d="M545 590 C520 640 520 680 470 750" fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" />
          <path d={CORPS} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        </g>
        {ouvre > 0 ? <polyline points={FISSURE} fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" /> : null}
      </g>
    );
  };
  return (
    <Scene>
      <defs>
        <radialGradient id="ch09-parfum">
          <stop offset="0" stopColor={F.orClair} stopOpacity={0.75} />
          <stop offset="0.7" stopColor={F.orClair} stopOpacity={0.35} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={400} cy={lerp(620, 430, tresRempli)} r={lerp(60, 425, tresRempli)} fill="url(#ch09-parfum)" opacity={ouvre} />
      <rect x={170} y={830} width={460} height={30} rx={3} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={400} cy={690} rx={120} ry={150} fill="url(#ch09-parfum)" opacity={ouvre} />
      {VOLUTES.map((v, i) => {
        const debut = parfum + i * 22;
        const avance = p(f, debut, debut + 150);
        if (avance === 0) return null;
        const pts = volute(400 + (i - 4) * 1.5, 720, v.ex, v.h, v.ph, v.s, f, v.c);
        const n = Math.max(2, Math.round(pts.length * avance));
        const trace = pts.slice(0, n).map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
        return (
          <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d={`M${trace}`} stroke={F.orClair} strokeWidth={13} opacity={0.75} />
            <path d={`M${trace}`} stroke={F.or} strokeWidth={5} />
          </g>
        );
      })}
      <Moitie sens={-1} />
      <Moitie sens={1} />
      {ouvre === 0 ? <polyline points={FISSURE} fill="none" stroke={F.encre} strokeWidth={4} strokeLinejoin="round" pathLength={1} strokeDasharray={`${fissure} 1`} opacity={fissure > 0 ? 1 : 0} /> : null}
    </Scene>
  );
};

/** Plan 4 : les dons autour de l'autel, la barre, et la petite part barrée. */
const IlluP4: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 680;
  const CX = 295;
  const pas = (d[1] - d[0] - 50) / LIBELLES.dons.length;
  const X0 = 40;
  const L = 720;
  const remplit = p(f, d[1] + 8, d[1] + 170);
  const yBarre = 765;
  const marque = X0 + L * 0.6;
  const libelleBarre = p(f, d[1] + 130, d[1] + 170);
  const prend = p(f, d[2] + 40, d[2] + 95);
  const motQuitte = p(f, d[2] + 105, d[2] + 130);
  const barre = p(f, d[2] + 205, d[2] + 240);
  // La petite part quitte l'extrémité de la barre pour le plateau d'à côté.
  const P = { x0: marque - 16, y0: yBarre + 25, x1: 700, y1: 735, x2: 675, y2: 606 };
  const pieceX = (1 - prend) ** 2 * P.x0 + 2 * (1 - prend) * prend * P.x1 + prend ** 2 * P.x2;
  const pieceY = (1 - prend) ** 2 * P.y0 + 2 * (1 - prend) * prend * P.y1 + prend ** 2 * P.y2;
  return (
    <Scene>
      <line x1={40} x2={760} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
      {/* L'autel de pierre : socle, assises, table à cornes, bois et feu. */}
      <rect x={CX - 178} y={642} width={356} height={SOL - 642} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <rect x={CX - 145} y={472} width={290} height={170} fill={F.filet} stroke={F.encre} strokeWidth={5} />
      {[529, 586].map((y) => (
        <line key={y} x1={CX - 145} x2={CX + 145} y1={y} y2={y} stroke={F.encre2} strokeWidth={3} />
      ))}
      {[
        [CX - 62, 472, 529],
        [CX + 48, 472, 529],
        [CX - 96, 529, 586],
        [CX + 8, 529, 586],
        [CX + 96, 529, 586],
        [CX - 40, 586, 642],
        [CX + 70, 586, 642],
      ].map(([x, a, b]) => (
        <line key={`${x}-${a}`} x1={x} x2={x} y1={a} y2={b} stroke={F.encre2} strokeWidth={3} />
      ))}
      <path d={`M${CX - 172} 440 Q${CX - 176} 412 ${CX - 192} 402 Q${CX - 142} 408 ${CX - 132} 440 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${CX + 172} 440 Q${CX + 176} 412 ${CX + 192} 402 Q${CX + 142} 408 ${CX + 132} 440 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <rect x={CX - 172} y={438} width={344} height={36} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={5} />
      <Flamme x={CX} y={426} s={0.9 + 0.25 * p(f, d[0], d[1])} f={f} graine={1} dehors={F.argile} dedans={F.orClair} />
      {[-11, 11].map((a) => (
        <rect key={a} x={CX - 72} y={417} width={144} height={18} rx={9} fill={F.cuir} stroke={F.encre} strokeWidth={3.5} transform={`rotate(${a} ${CX} 426)`} />
      ))}
      {/* Les étiquettes viennent se ranger. */}
      {LIBELLES.dons.map((e, i) => {
        const a = d[0] + i * pas;
        const o = p(f, a, a + 36);
        return (
          <g key={e.mot} opacity={o} transform={`translate(${e.x + e.depuis * (1 - o)} ${e.y - 50 * (1 - o)}) rotate(${e.angle * o + e.angle * 3 * (1 - o)})`}>
            <path d={`M${-e.largeur / 2 + 20} -30 H${e.largeur / 2} V30 H${-e.largeur / 2 + 20} L${-e.largeur / 2 - 8} 0 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <circle cx={-e.largeur / 2 + 10} cy={0} r={6} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
            <Libelle x={12} y={9} taille={25} graisse={600}>{e.mot}</Libelle>
          </g>
        );
      })}
      {/* La barre. */}
      <rect x={X0} y={yBarre} width={L} height={50} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={X0 + 3} y={yBarre + 3} width={Math.max(0, (L * 0.6 - 3) * remplit)} height={44} rx={6} fill={F.or} />
      <line x1={marque} x2={marque} y1={yBarre - 12} y2={yBarre + 62} stroke={F.encre} strokeWidth={4} opacity={libelleBarre} />
      <Libelle x={marque} y={yBarre - 22} taille={30} graisse={600} couleur={F.orFonce} opacite={libelleBarre}>{LIBELLES.soixante}</Libelle>
      {/* La petite part, posée à côté. */}
      <g opacity={1 - barre * 0.45}>
        <g opacity={p(f, d[2] + 10, d[2] + 34)}>
          <path d="M600 636 H750 Q735 668 690 668 H660 Q615 668 600 636 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <rect x={658} y={667} width={34} height={13} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        </g>
        {prend > 0 ? <Piece x={pieceX} y={pieceY} r={30} /> : null}
        <g opacity={motQuitte}>
          <rect x={612} y={486} width={126} height={56} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <Libelle x={675} y={524} taille={28} graisse={600}>{LIBELLES.quitte}</Libelle>
          <line x1={675} x2={675} y1={542} y2={570} stroke={F.encre} strokeWidth={3} />
        </g>
      </g>
      {barre > 0 ? <line x1={596} y1={662} x2={lerp(596, 756, barre)} y2={lerp(662, 476, barre)} stroke={F.argile} strokeWidth={12} strokeLinecap="round" /> : null}
    </Scene>
  );
};

/** Plan 5 : l'enfilade de portes, la pièce franchit chaque seuil. */
const IlluP5: React.FC<PropsIllustration> = ({ f, d }) => {
  const S = [1, 0.72, 0.52, 0.38, 0.28];
  const ARRETS = [1.16, 0.85, 0.62, 0.45, 0.33, 0.235];
  const ALLURES = [
    [d[0] + 12, d[0] + 92],
    [d[0] + 118, d[0] + 198],
    [d[1] + 30, d[1] + 125],
    [d[1] + 205, d[1] + 300],
    [d[2] + 25, d[2] + 125],
  ];
  const sol = (s: number) => 430 + 380 * s;
  const demi = (s: number) => 250 * s;
  const arche = (s: number, e: number) => {
    const w = demi(s) + e * s;
    const naissance = 430 - 370 * s + demi(s);
    return `M${400 - w} ${sol(s)} V${naissance} A${w} ${w} 0 0 1 ${400 + w} ${naissance} V${sol(s)} Z`;
  };
  const avances = ALLURES.map(([a, b]) => p(f, a, b));
  const pos = avances.reduce((t, v) => t + v, 0);
  const i0 = Math.min(ARRETS.length - 2, Math.floor(pos));
  const sPiece = Math.exp(lerp(Math.log(ARRETS[i0]), Math.log(ARRETS[i0 + 1]), pos - i0));
  // Porte k : éclairée quand la pièce a franchi le seuil d'avant.
  const lum = S.map((_, k) => (k === 0 ? 0.32 + 0.68 * avances[0] : p(f, ALLURES[k - 1][1] - 28, ALLURES[k - 1][1] + 22)));
  const lumFond = [F.or, F.orClair, F.orClair, F.papier, F.papier];
  const clarte = lum[S.length - 1] * 0.35 + avances[4] * 0.65;
  const rPiece = 48 * sPiece;
  const piece = <PieceRoulante x={400} y={sol(sPiece) - rPiece} r={rPiece} angle={pos * 300} />;
  return (
    <Scene>
      <defs>
        <clipPath id="ch09-enfilade">
          <path d={arche(1, 0)} />
        </clipPath>
        <clipPath id="ch09-fond">
          <path d={arche(S[4], 0)} />
        </clipPath>
        <radialGradient id="ch09-eclat">
          <stop offset="0" stopColor={F.papier} stopOpacity={1} />
          <stop offset="0.45" stopColor={F.orClair} stopOpacity={0.85} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
      </defs>
      {[4, 3, 2, 1, 0].map((k) => {
        const s = S[k];
        const suivant = S[k + 1];
        const fond = mix(lum[k], k === 4 ? F.cuirClair : F.cuir, lumFond[k]);
        const dalle = mix(lum[k], F.cuirClair, k < 2 ? F.orClair : F.papier);
        return (
          <g key={k}>
            <path d={suivant ? `${arche(s, 0)} ${arche(suivant, 40)}` : arche(s, 0)} fill={fond} fillRule="evenodd" />
            {suivant ? <path d={`M${400 - demi(s)} ${sol(s)} H${400 + demi(s)} L${400 + demi(suivant)} ${sol(suivant)} H${400 - demi(suivant)} Z`} fill={dalle} /> : null}
            {k === 4 ? (
              <g clipPath="url(#ch09-fond)">
                <circle cx={400} cy={470} r={70 + 50 * clarte} fill="url(#ch09-eclat)" opacity={0.25 + 0.75 * clarte} />
              </g>
            ) : null}
            {k === 1 ? (
              <g clipPath="url(#ch09-enfilade)" opacity={clarte > 0 ? 1 : 0}>
                {Array.from({ length: 16 }, (_, i) => {
                  const a = ((i + 0.5) * TOUR) / 16 + 0.04;
                  const r0 = 60;
                  const r1 = 60 + 340 * clarte;
                  const da = 0.05;
                  return <path key={i} d={`M${400 + Math.cos(a) * r0} ${470 + Math.sin(a) * r0} L${400 + Math.cos(a - da) * r1} ${470 + Math.sin(a - da) * r1} L${400 + Math.cos(a + da) * r1} ${470 + Math.sin(a + da) * r1} Z`} fill={F.papier} opacity={0.55} />;
                })}
              </g>
            ) : null}
            {sPiece >= (suivant ?? 0) && sPiece < s ? piece : null}
            <path d={`${arche(s, 40)} ${arche(s, 0)}`} fill={mix(lum[k], F.filet, F.papier)} fillRule="evenodd" stroke={F.encre} strokeWidth={Math.max(2, 4 * s)} strokeLinejoin="round" />
            <rect x={400 - demi(s) - 52 * s} y={sol(s) - 2} width={2 * demi(s) + 104 * s} height={14 * s} fill={mix(lum[k], F.filet, F.orClair)} stroke={F.encre} strokeWidth={Math.max(1.5, 3 * s)} />
            {k === 0 && sPiece >= s ? piece : null}
          </g>
        );
      })}
      <Libelle x={400} y={880} taille={30} graisse={600} couleur={F.orFonce} opacite={p(f, d[2] + 120, d[2] + 160)}>{LIBELLES.seuils}</Libelle>
    </Scene>
  );
};

/** Une tunique pliée : encolure en V, plis et ourlet. */
const Tunique: React.FC<{ x: number; y: number; couleur: string; opacite?: number }> = ({ x, y, couleur, opacite = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacite}>
    <rect x={-96} y={-26} width={192} height={52} rx={11} fill={couleur} stroke={F.encre} strokeWidth={4} />
    <path d="M-26 -26 L0 -2 L26 -26" fill={F.parchemin} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
    <path d="M-92 -6 Q-70 -4 -56 -22 M92 -6 Q70 -4 56 -22" fill="none" stroke={F.encre} strokeWidth={2.5} opacity={0.6} strokeLinecap="round" />
    <path d="M-88 15 H88" stroke={F.encre} strokeWidth={2} strokeDasharray="7 6" opacity={0.6} />
  </g>
);

/** Plan 6 : la colonne de lumière porte l'aumône puis les tuniques ; les flammes de prière s'allument. */
const IlluP6: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const COULEURS = [F.papier, F.cuirClair, F.orClair, F.argile];
  const H_TUNIQUE = 52;
  const monte1 = p(f, d[1] + 8, d[1] + 120);
  const monte2 = p(f, d[3] - 5, d[3] + 90);
  const tete = lerp(lerp(806, 610, monte1), 410, monte2);
  const espace = (d[3] - d[2] - 40) / COULEURS.length;
  const entrees = COULEURS.map((_, i) => p(f, d[2] + 10 + i * espace, d[2] + 10 + i * espace + 34));
  const hauteurPile = entrees.reduce((t, e) => t + e, 0) * H_TUNIQUE;
  const pose = p(f, 2, d[0] + 28);
  const LAMPES = [
    { x: 225, y: 240 },
    { x: 575, y: 240 },
    { x: 115, y: 345 },
    { x: 685, y: 345 },
    { x: 225, y: 450 },
    { x: 575, y: 450 },
    { x: 115, y: 555 },
    { x: 685, y: 555 },
    { x: 225, y: 660 },
    { x: 575, y: 660 },
    { x: 115, y: 765 },
    { x: 685, y: 765 },
  ];
  const allumage = (i: number) => {
    if (i < 3) return d[1] + 110 + i * 55;
    if (i < 7) return d[2] + 40 + (i - 3) * ((d[3] - d[2] - 60) / 4);
    return d[3] + 2 + (i - 7) * ((duree - d[3] - 40) / 5);
  };
  const sommet = tete - hauteurPile;
  return (
    <Scene>
      <defs>
        <linearGradient id="ch09-colonne" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0.6} />
        </linearGradient>
      </defs>
      {/* Rayons d'en haut : la destination de ce qui monte. */}
      <g opacity={p(f, d[1] + 20, d[1] + 110)}>
        <path d={`M300 ${tete} L372 22 H428 L500 ${tete} Z`} fill={F.orClair} opacity={0.28} />
        {Array.from({ length: 7 }, (_, i) => {
          const a = ((-54 + i * 18) * Math.PI) / 180;
          return <line key={i} x1={400 + Math.sin(a) * 30} y1={10 + Math.cos(a) * 14} x2={400 + Math.sin(a) * 118} y2={10 + Math.cos(a) * 60} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
        })}
      </g>
      {/* La colonne, sa base, et sa tête où tout est posé. */}
      <path d={`M300 ${tete} H500 L520 838 H280 Z`} fill="url(#ch09-colonne)" opacity={0.25 + 0.75 * p(f, d[1] - 10, d[1] + 30)} />
      <rect x={250} y={830} width={300} height={34} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={400} cy={tete + 5} rx={118} ry={13} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
      {COULEURS.map((c, i) => {
        const e = entrees[i];
        if (e === 0) return null;
        const y = tete - i * H_TUNIQUE - 26;
        return <Tunique key={i} x={400 + (i % 2 === 0 ? -1 : 1) * 60 * (1 - e)} y={y} couleur={c} opacite={e} />;
      })}
      {/* L'aumône, posée sur le dessus. */}
      <g opacity={p(f, 2, 20)} transform={`translate(0 ${-(1 - pose) * 150})`}>
        <Piece x={366} y={sommet - 26} r={28} />
        <Piece x={434} y={sommet - 26} r={28} />
        <Piece x={400} y={sommet - 66} r={28} />
      </g>
      {/* Les lampes de prière. */}
      {LAMPES.map((l, i) => {
        const a = allumage(i);
        const o = p(f, a, a + 16);
        if (o === 0) return null;
        const pop = 1 + Math.sin(o * Math.PI) * 0.25;
        return (
          <g key={i} opacity={o}>
            <circle cx={l.x} cy={l.y - 32} r={36} fill={F.orClair} opacity={0.32} />
            <path d={`M${l.x - 28} ${l.y} H${l.x + 28} Q${l.x + 22} ${l.y + 22} ${l.x} ${l.y + 22} Q${l.x - 22} ${l.y + 22} ${l.x - 28} ${l.y} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
            <Flamme x={l.x} y={l.y - 2} s={0.5 * pop} f={f} graine={i * 1.7} />
          </g>
        );
      })}
    </Scene>
  );
};

/** Plan 7 : la bourse percée, et le ciel d'airain qui descend. */
const Grain: React.FC<{ x: number; y: number; angle: number; opacite?: number }> = ({ x, y, angle, opacite = 1 }) => (
  <ellipse cx={x} cy={y} rx={8} ry={12} transform={`rotate(${angle} ${x} ${y})`} fill={F.orClair} stroke={F.orFonce} strokeWidth={2.5} opacity={opacite} />
);

const IlluP7: React.FC<PropsIllustration> = ({ f, d }) => {
  const N = 12;
  const PERIODE = 60;
  const ferme = p(f, d[1] - 55, d[1] + 55);
  const yPlaque = lerp(4, 96, ferme);
  const choc = ferme >= 1 ? Math.max(0, 1 - (f - d[1] - 55) / 18) * Math.sin((f - d[1] - 55) * 1.6) * 4 : 0;
  const montrer = p(f, d[1] - 55, d[1] - 40);
  return (
    <Scene>
      {/* Le ciel ouvert : des rayons, jusqu'à ce que la plaque les coupe. */}
      <g opacity={1 - ferme}>
        {Array.from({ length: 11 }, (_, i) => {
          const a = ((-60 + i * 12) * Math.PI) / 180;
          return <line key={i} x1={400 + Math.sin(a) * 40} y1={30 + Math.cos(a) * 20} x2={400 + Math.sin(a) * 340} y2={30 + Math.cos(a) * 230} stroke={F.orClair} strokeWidth={10} strokeLinecap="round" />;
        })}
        <path d="M300 30 A100 60 0 0 0 500 30 Z" fill={F.orClair} stroke={F.or} strokeWidth={3} />
      </g>
      {/* Les grains qui entrent. */}
      <ellipse cx={400} cy={332} rx={82} ry={17} fill={F.encre} />
      {Array.from({ length: N }, (_, i) => {
        const t = ((f + (i * PERIODE) / N) % PERIODE) / PERIODE;
        const x = 400 + Math.sin(i * 2.4) * 34;
        return <Grain key={i} x={x} y={lerp(205, 372, t)} angle={i * 47 + t * 90} opacite={Math.min(1, t * 6)} />;
      })}
      {/* La bourse. */}
      <path d="M345 392 C215 450 175 650 285 695 Q400 735 515 695 C625 650 585 450 455 392 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M318 332 Q400 362 482 332 L458 390 H342 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M352 348 L358 386 M385 354 L387 388 M415 354 L413 388 M448 348 L442 386" stroke={F.encre} strokeWidth={2.5} opacity={0.6} />
      <rect x={334} y={382} width={132} height={16} rx={8} fill={F.or} stroke={F.encre} strokeWidth={3.5} />
      <path d="M452 398 Q476 440 462 482 M466 396 Q500 430 494 470" fill="none" stroke={F.or} strokeWidth={5} strokeLinecap="round" />
      <circle cx={462} cy={488} r={8} fill={F.or} stroke={F.encre} strokeWidth={2.5} />
      <circle cx={494} cy={476} r={8} fill={F.or} stroke={F.encre} strokeWidth={2.5} />
      <path d="M262 510 Q240 590 290 650" fill="none" stroke={F.cuirClair} strokeWidth={5} strokeLinecap="round" strokeDasharray="14 10" />
      {/* Le trou. */}
      <path d="M352 672 L368 650 L390 660 L412 646 L432 660 L450 652 L456 682 L438 704 L412 694 L388 708 L364 698 Z" fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {/* Les grains qui ressortent. */}
      {Array.from({ length: N }, (_, i) => {
        const t = ((f + (i * PERIODE) / N + 17) % PERIODE) / PERIODE;
        const x = 404 + Math.sin(i * 1.9) * 22 + t * Math.sin(i * 3.1) * 26;
        return <Grain key={i} x={x} y={lerp(676, 885, t)} angle={i * 61 + t * 120} opacite={Math.min(1, t * 8) * (1 - p(t * 100, 72, 100))} />;
      })}
      {/* La plaque d'airain. */}
      {montrer > 0 ? (
        <g opacity={montrer} transform={`translate(${choc} ${yPlaque + Math.abs(choc)})`}>
          <rect x={40} y={0} width={720} height={84} rx={8} fill={F.orFonce} stroke={F.encre} strokeWidth={5} />
          <rect x={52} y={10} width={696} height={12} rx={4} fill={F.or} opacity={0.75} />
          {[70, 170, 270, 530, 630, 730].map((x) => (
            <circle key={x} cx={x} cy={52} r={9} fill={F.or} stroke={F.encre} strokeWidth={3} />
          ))}
          <Libelle x={400} y={64} taille={36} graisse={600} couleur={F.orClair}>{LIBELLES.airain}</Libelle>
        </g>
      ) : null}
    </Scene>
  );
};

/** Plan 8 : la flèche quitte la pièce, se retourne vers le sentier, et la pièce roule vers la lumière. */
const IlluP8: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const cubique = (a: number[], b: number[], c: number[], e: number[], t: number) => {
    const u = 1 - t;
    return [0, 1].map((k) => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * e[k]);
  };
  const M = 90;
  const sentier = Array.from({ length: M + 1 }, (_, i) => {
    const t = i / M;
    const [x, y] = t < 0.55 ? cubique([356, 808], [540, 846], [740, 680], [560, 505], t / 0.55) : cubique([560, 505], [450, 390], [480, 290], [640, 192], (t - 0.55) / 0.45);
    return { x, y, l: lerp(66, 8, t) };
  });
  const normale = (i: number) => {
    const a = sentier[Math.max(0, i - 1)];
    const b = sentier[Math.min(M, i + 1)];
    const n = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { nx: -(b.y - a.y) / n, ny: (b.x - a.x) / n };
  };
  const DEPART = 3;
  const entre = p(f, d[0] - 26, d[0] + 26);
  const quitte = p(f, d[0] + 125, d[0] + 165);
  const tourne = p(f, d[0] + 140, d[0] + 215);
  const sentierVu = p(f, d[0] + 205, d[1] - 18);
  const roule = p(f, d[1] + 8, duree - 58);
  const lumiere = p(f, d[0] + 165, d[1]) * 0.5 + p(f, d[1] + 50, duree - 50) * 0.5;
  // Le sentier s'avance par une pointe arrondie : sa largeur s'affine sur les K derniers points tracés.
  const K = 16;
  const pointe = (M + K) * sentierVu;
  const n = Math.max(2, Math.min(M + 1, Math.floor(pointe) + 1));
  const largeur = (i: number) => {
    const u = Math.min(1, Math.max(0, pointe - i) / K);
    return sentier[i].l * Math.sqrt(1 - (1 - u) ** 2);
  };
  const bordG = sentier.slice(0, n).map((s, i) => {
    const { nx, ny } = normale(i);
    return `${s.x + nx * largeur(i)} ${s.y + ny * largeur(i)}`;
  });
  const bordD = sentier.slice(0, n).map((s, i) => {
    const { nx, ny } = normale(i);
    return `${s.x - nx * largeur(i)} ${s.y - ny * largeur(i)}`;
  });
  const cheminMilieu = sentier.slice(0, Math.max(0, Math.floor(pointe - K) + 1)).map((s) => `${s.x} ${s.y}`).join(' L');
  // La pièce : descend du plateau, puis suit le sentier en s'éloignant.
  const quitter = Math.min(1, roule / 0.1);
  const suite = Math.max(0, (roule - 0.1) / 0.9);
  const i = lerp(DEPART, M, suite);
  const a = sentier[Math.floor(i)];
  const b = sentier[Math.min(M, Math.floor(i) + 1)];
  const sx = lerp(a.x, b.x, i - Math.floor(i));
  const sy = lerp(a.y, b.y, i - Math.floor(i));
  const r = lerp(46, 13, suite ** 0.75);
  // Elle roule sur le plateau jusqu'au rebord, puis tombe sur le début du sentier.
  const REBORD = 296;
  const tBord = (REBORD - 170) / (sentier[DEPART].x - 170);
  const chute = Math.max(0, (quitter - tBord) / (1 - tBord));
  const px = quitter < 1 ? lerp(170, sentier[DEPART].x, quitter) : sx;
  const py = quitter < 1 ? lerp(642, sentier[DEPART].y - 46 * 0.7, chute * chute) : sy - r * 0.7;
  // La flèche : à gauche (180°) vers la pièce, puis vers le haut et la lumière (342°).
  const angle = lerp(180, 342, tourne);
  const cx = lerp(lerp(690, 472, entre) + 90 * quitte, 235, tourne);
  const cy = lerp(642 - 40 * quitte, 320, tourne);
  const A = 180;
  const labelAngle = lerp(0, -18, tourne);
  return (
    <Scene>
      <defs>
        <radialGradient id="ch09-lueur">
          <stop offset="0" stopColor={F.papier} stopOpacity={1} />
          <stop offset="0.25" stopColor={F.orClair} stopOpacity={0.8} />
          <stop offset="0.6" stopColor={F.orClair} stopOpacity={0.3} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
      </defs>
      {sentierVu > 0 ? (
        <g>
          {/* Les bords d'abord, le sol par-dessus : rien ne se croise dans la pointe. */}
          <circle cx={sentier[0].x} cy={sentier[0].y} r={largeur(0)} fill="none" stroke={F.filet} strokeWidth={8} />
          <path d={`M${bordG.join(' L')} L${[...bordD].reverse().join(' L')}`} fill="none" stroke={F.filet} strokeWidth={8} strokeLinejoin="round" />
          <circle cx={sentier[0].x} cy={sentier[0].y} r={largeur(0)} fill={F.papier} />
          <path d={`M${bordG.join(' L')} L${[...bordD].reverse().join(' L')} Z`} fill={F.papier} />
          <path d={cheminMilieu ? `M${cheminMilieu}` : ''} fill="none" stroke={F.encre2} strokeWidth={3} strokeDasharray="20 20" />
        </g>
      ) : null}
      {/* La lumière au bout du sentier. */}
      <circle cx={640} cy={172} r={lerp(130, 220, lumiere)} fill="url(#ch09-lueur)" opacity={p(lumiere, 0, 0.6)} />
      {/* Le plateau. */}
      <path d="M170 690 V770" stroke={F.encre} strokeWidth={22} />
      <path d="M170 690 V770" stroke={F.cuirClair} strokeWidth={14} />
      <path d="M90 802 Q100 760 170 760 Q240 760 250 802 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d="M50 688 H290 Q272 728 200 728 H140 Q68 728 50 688 Z" fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {/* La flèche. */}
      <g opacity={entre}>
        <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
          <path d={`M${-A} -36 H${A - 70} V-66 L${A} 0 L${A - 70} 66 V36 H${-A} Z`} fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        </g>
        <g transform={`translate(${cx} ${cy}) rotate(${labelAngle})`}>
          <Libelle x={tourne > 0.5 ? -24 : 28} y={11} taille={tourne > 0.5 ? 27 : 32} graisse={600} opacite={tourne > 0.5 ? p(tourne, 0.72, 1) : 1 - p(tourne, 0, 0.3)}>
            {tourne > 0.5 ? LIBELLES.marcher : LIBELLES.ministere}
          </Libelle>
        </g>
      </g>
      <PieceRoulante x={px} y={py} r={r} angle={roule * 1100} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluP2,
  p3: IlluP3,
  p4: IlluP4,
  p5: IlluP5,
  p6: IlluP6,
  p7: IlluP7,
  p8: IlluP8,
  fin: IlluConclusion,
};

import React from 'react';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES } from './libelles';

const borne = (x: number) => Math.min(1, Math.max(0, x));
const lin = (f: number, a: number, b: number) => borne((f - a) / (b - a));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (a: number) => (a * Math.PI) / 180;

/** Rayons de lumière en éventail autour d'un point. */
const Rayons: React.FC<{ x: number; y: number; r1: number; r2: number; de: number; a: number; n: number; o: number; e?: number }> = ({ x, y, r1, r2, de, a, n, o, e = 7 }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const t = rad(de + ((a - de) * i) / (n - 1));
      const fin = mix(r1, r2, i % 2 === 0 ? 1 : 0.72);
      return <line key={i} x1={x + Math.cos(t) * r1} y1={y + Math.sin(t) * r1} x2={x + Math.cos(t) * fin} y2={y + Math.sin(t) * fin} stroke={F.or} strokeWidth={e} strokeLinecap="round" />;
    })}
  </g>
);

/* ------------------------------------------------------------------ */
/* Plans 1 et 12 : trois maillons et le thermomètre.                   */
/* ------------------------------------------------------------------ */

const CENTRES = [-545, -375, -205];

const Maillon: React.FC<{ x: number; y?: number; lueur?: number }> = ({ x, y = 0, lueur = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-105} y={-56} width={210} height={112} rx={56} fill="none" stroke={F.encre} strokeWidth={28} />
    <rect x={-105} y={-56} width={210} height={112} rx={56} fill="none" stroke={F.or} strokeWidth={18} />
    <rect x={-105} y={-56} width={210} height={112} rx={56} fill="none" stroke={F.orClair} strokeWidth={5 + 8 * lueur} />
  </g>
);

/** La chaîne, accrochée à l'anneau du bulbe. Chaque maillon passe dessus puis dessous le suivant. */
const Chaine: React.FC<{ arrivees: number[]; lueurs?: number[]; x: number; y: number; anneau: number }> = ({ arrivees, lueurs = [0, 0, 0], x, y, anneau }) => {
  const decale = (i: number) => {
    const t = arrivees[i];
    return { dx: (1 - t) * -46, dy: (1 - t) * -250, o: borne(t * 3) };
  };
  const M = (i: number) => {
    const c = decale(i);
    return (
      <g opacity={c.o}>
        <Maillon x={CENTRES[i] + c.dx} y={c.dy} lueur={lueurs[i]} />
      </g>
    );
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(28)`}>
      <defs>
        <clipPath id="ch07-dessus-0">
          <rect x={-470} y={-90} width={80} height={90} />
        </clipPath>
        <clipPath id="ch07-dessus-1">
          <rect x={-300} y={-90} width={80} height={90} />
        </clipPath>
        <clipPath id="ch07-dessus-2">
          <rect x={-134} y={0} width={60} height={90} />
        </clipPath>
      </defs>
      {M(0)}
      {M(1)}
      <g clipPath="url(#ch07-dessus-0)">{M(0)}</g>
      {M(2)}
      <g clipPath="url(#ch07-dessus-1)">{M(1)}</g>
      <circle cx={-104} cy={0} r={28 + 10 * anneau} fill="none" stroke={F.or} strokeWidth={6} opacity={anneau} />
      <circle cx={-104} cy={0} r={28} fill="none" stroke={F.encre} strokeWidth={22} />
      <circle cx={-104} cy={0} r={28} fill="none" stroke={F.or} strokeWidth={13} />
      <g clipPath="url(#ch07-dessus-2)">{M(2)}</g>
    </g>
  );
};

const IlluOuverture07: React.FC<PropsIllustration> = ({ f }) => {
  const a = [p(f, 24, 60), p(f, 62, 98), p(f, 100, 136)];
  const clic = p(f, 134, 150) * (1 - p(f, 165, 200));
  const lueurs = [p(f, 56, 66) * (1 - p(f, 70, 90)), p(f, 94, 104) * (1 - p(f, 108, 128)), clic];
  return (
    <Scene>
      <Thermometre x={640} y={90} h={580} l={70} niveau={0.05 + 0.2 * p(f, 138, 205)} />
      <Chaine arrivees={a} lueurs={lueurs} x={640} y={723} anneau={clic} />
    </Scene>
  );
};

const IlluFin07: React.FC<PropsIllustration> = ({ f }) => {
  const niveau = 0.86 + 0.14 * p(f, 0, 70);
  const vague = (i: number) => {
    const c = 80 + i * 18;
    return p(f, c, c + 16) * (1 - p(f, c + 20, c + 46));
  };
  return (
    <Scene>
      <Rayons x={640} y={100} r1={62} r2={94} de={-165} a={-15} n={9} o={p(f, 68, 95)} />
      <Thermometre x={640} y={90} h={580} l={70} niveau={niveau} />
      <Chaine arrivees={[1, 1, 1]} lueurs={[vague(0), vague(1), vague(2)]} x={640} y={723} anneau={vague(3)} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 2 : le moule.                                                  */
/* ------------------------------------------------------------------ */

const PION =
  'M400 288 C436 288 462 316 462 350 C462 376 446 398 426 408 L452 416 Q460 428 448 436 L428 440 C432 530 460 620 492 690 L512 706 L512 770 L288 770 L288 706 L308 690 C340 620 368 530 372 440 L352 436 Q340 428 348 416 L374 408 C354 398 338 376 338 350 C338 316 364 288 400 288 Z';

const DemiMoule: React.FC<{ sens: -1 | 1; ecart: number; contour: number }> = ({ sens, ecart, contour }) => {
  const x = sens < 0 ? 190 : 400;
  return (
    <g transform={`translate(${sens * ecart} 0)`}>
      <defs>
        <clipPath id={`ch07-demi-${sens}`}>
          <rect x={x} y={236} width={210} height={578} />
        </clipPath>
      </defs>
      <rect x={sens < 0 ? x - 26 : x + 210 - 2} y={470} width={28} height={110} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <g clipPath={`url(#ch07-demi-${sens})`}>
        <rect x={190} y={240} width={420} height={570} rx={10} fill={F.cuir} stroke={F.encre} strokeWidth={6} />
        <rect x={382} y={236} width={36} height={60} fill={F.parchemin} />
        <path d="M382 240 V292 M418 240 V292" fill="none" stroke={F.encre} strokeWidth={4} />
        <path d={PION} fill={F.parchemin} stroke={F.encre} strokeWidth={5} />
        <path d={PION} fill="none" stroke={F.or} strokeWidth={7} opacity={contour} />
      </g>
      {[275, 775].map((y) => (
        <circle key={y} cx={sens < 0 ? 222 : 578} cy={y} r={11} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
      ))}
    </g>
  );
};

const IlluMoule: React.FC<PropsIllustration> = ({ f, d }) => {
  const arrive = p(f, 0, d[0] + 8);
  const penche = p(f, d[0] + 8, d[0] + 42);
  const retrait = p(f, d[1] + 62, d[1] + 100);
  const remplit = lin(f, d[0] + 52, d[1] + 62);
  const surface = mix(770, 240, remplit);
  const refroidi = p(f, d[2] - 25, d[2] + 70);
  const ouvre = p(f, d[3], d[3] + 45);
  const ecart = 160 * ouvre;
  const coule = d[0] + 36 < f && remplit < 1;
  const basFilet = mix(150, surface, p(f, d[0] + 36, d[0] + 52));
  const eclat = p(f, d[3] + 45, d[3] + 70);
  const pouls = eclat * (0.55 + 0.45 * Math.sin((f - d[3]) / 9));
  const interieur = p(f, d[2] + 10, d[2] + 40) * (1 - ouvre) * (0.5 + 0.5 * Math.sin((f - d[2]) / 11));
  return (
    <Scene>
      <defs>
        <clipPath id="ch07-pion-seul">
          <path d={PION} />
        </clipPath>
      </defs>
      {/* Le socle fixe sur lequel se dresse l'objet. */}
      <rect x={0} y={810} width={800} height={30} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      <rect x={288} y={770} width={224} height={40} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <DemiMoule sens={-1} ecart={ecart} contour={pouls} />
      <DemiMoule sens={1} ecart={ecart} contour={pouls} />
      {/* Le métal, seulement là où il a coulé. */}
      <rect x={382} y={Math.max(surface, 240)} width={36} height={Math.max(0, 296 - Math.max(surface, 240))} fill={F.or} opacity={1 - borne(ouvre * 4)} />
      <g clipPath="url(#ch07-pion-seul)">
        <rect x={270} y={surface} width={260} height={Math.max(0, 780 - surface)} fill={F.or} />
        <rect x={270} y={surface} width={260} height={Math.max(0, 780 - surface)} fill={F.orClair} opacity={1 - refroidi} />
        <path d={`M270 ${surface} q40 -8 65 0 t65 0 t65 0 t65 0`} fill="none" stroke={F.orClair} strokeWidth={6} opacity={remplit < 1 ? 1 : 0} />
      </g>
      {remplit > 0 ? <path d={PION} fill="none" stroke={F.encre} strokeWidth={5} opacity={remplit >= 1 ? 1 : 0} /> : null}
      <path d={PION} fill="none" stroke={F.orClair} strokeWidth={10} opacity={interieur} />
      <path d={PION} fill="none" stroke={F.or} strokeWidth={7} opacity={pouls} />
      {/* Le reflet qui donne le volume. */}
      <g clipPath="url(#ch07-pion-seul)" opacity={refroidi * (remplit >= 1 ? 1 : 0)}>
        <path d="M368 310 Q352 335 362 372" fill="none" stroke={F.orClair} strokeWidth={13} strokeLinecap="round" />
        <path d="M382 470 Q372 590 330 700" fill="none" stroke={F.orClair} strokeWidth={15} strokeLinecap="round" />
      </g>
      <Rayons x={400} y={350} r1={88} r2={136} de={-160} a={-20} n={9} o={eclat} />
      {/* Le filet de métal. */}
      {coule ? (
        <g>
          <rect x={392} y={150} width={16} height={Math.max(0, basFilet - 150)} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} />
          <line x1={400} x2={400} y1={150} y2={basFilet} stroke={F.or} strokeWidth={5} strokeDasharray="14 18" strokeDashoffset={-f * 7} />
        </g>
      ) : null}
      {/* Le creuset. */}
      <g opacity={1 - retrait} transform={`translate(${(1 - arrive) * -340 - retrait * 340} 0)`}>
        <line x1={40} y1={46} x2={250} y2={92} stroke={F.encre} strokeWidth={12} strokeLinecap="round" />
        <g transform={`rotate(${58 * penche} 312 112)`}>
          <path d="M240 50 H384 L362 170 Q312 192 262 170 Z" fill={F.encre2} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          <ellipse cx={312} cy={54} rx={68} ry={13} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
        </g>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 3 : les diapasons.                                             */
/* ------------------------------------------------------------------ */

const DIAP = (x: number, delta: number) =>
  `M${x - 42 - delta} 66 C${x - 42 - delta * 0.7} 150 ${x - 42} 230 ${x - 42} 290 A42 42 0 0 0 ${x + 42} 290 C${x + 42} 230 ${x + 42 + delta * 0.7} 150 ${x + 42 + delta} 66`;

const Diapason: React.FC<{ x: number; amp: number; f: number; lueur: number }> = ({ x, amp, f, lueur }) => {
  const delta = amp * Math.sin(f * 1.15);
  return (
    <g>
      {lueur > 0 ? <path d={DIAP(x, delta)} fill="none" stroke={F.orClair} strokeWidth={42} strokeLinecap="round" opacity={lueur * 0.55} /> : null}
      {amp > 1 ? (
        <>
          <path d={DIAP(x, amp)} fill="none" stroke={F.filet} strokeWidth={15} strokeLinecap="round" opacity={0.85} />
          <path d={DIAP(x, -amp)} fill="none" stroke={F.filet} strokeWidth={15} strokeLinecap="round" opacity={0.85} />
        </>
      ) : null}
      <line x1={x} x2={x} y1={332} y2={486} stroke={F.encre} strokeWidth={28} />
      <line x1={x} x2={x} y1={332} y2={486} stroke={F.or} strokeWidth={19} />
      <path d={DIAP(x, delta)} fill="none" stroke={F.encre} strokeWidth={26} strokeLinecap="round" />
      <path d={DIAP(x, delta)} fill="none" stroke={F.or} strokeWidth={17} strokeLinecap="round" />
      <rect x={x - 92} y={482} width={184} height={50} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
    </g>
  );
};

const courbe = (y0: number, ampl: number, k: number, phase: number, x1: number, x2: number) => {
  const pts: string[] = [];
  for (let x = x1; x <= x2; x += 8) pts.push(`${x.toFixed(0)} ${(y0 + ampl * Math.sin(k * (x - 60) + phase)).toFixed(1)}`);
  return `M${pts.join(' L')}`;
};

const IlluDiapasons: React.FC<PropsIllustration> = ({ f, d }) => {
  const XA = 210;
  const XB = 590;
  const frappe = d[0] + 34;
  const coup = p(f, frappe - 6, frappe);
  const repli = p(f, frappe + 2, frappe + 32);
  const angleMaillet = -22 * (1 - coup) - 22 * repli;
  const oMaillet = p(f, 0, d[0] - 6) * (1 - p(f, frappe + 30, frappe + 60));
  const ampA = f < frappe ? 0 : 15;
  const ampB = 15 * p(f, frappe + 75, d[1] + 10);
  // Les ondes partent du premier diapason et atteignent le second.
  const ondes = f < frappe ? [] : Array.from({ length: 5 }, (_, i) => (((f - frappe) / 62 + i / 5) % 1));
  const ondesVisibles = 1 - p(f, d[2], d[2] + 40);
  const monte = p(f, d[2] - 14, d[2] + 26);
  const naissance = p(f, d[2] + 18, d[2] + 72);
  const aligne = p(f, d[3], d[3] + 100);
  const flux = p(f, d[4], d[4] + 30);
  const yC = 690;
  const k = 0.024;
  const ph = f * 0.07;
  const x2 = mix(60, 740, naissance);
  const c1 = courbe(yC, 62, k, ph, 60, x2);
  const c2 = courbe(yC + 26 * (1 - aligne), mix(38, 62, aligne), k * mix(1.6, 1, aligne), ph + 2.4 * (1 - aligne), 60, x2);
  const fondue = lin(f, d[3] + 88, d[3] + 104);
  return (
    <Scene>
      <g transform={`translate(0 ${170 * (1 - monte)})`}>
      <line x1={40} x2={760} y1={532} y2={532} stroke={F.encre} strokeWidth={5} />
      {ondes.map((t, i) => {
        const r = 62 + t * 215;
        const a = rad(30);
        return (
          <path
            key={i}
            d={`M${XA + 42 + r * Math.cos(a)} ${190 - r * Math.sin(a)} A${r} ${r} 0 0 1 ${XA + 42 + r * Math.cos(a)} ${190 + r * Math.sin(a)}`}
            fill="none"
            stroke={F.or}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={(1 - t) * 0.9 * ondesVisibles}
          />
        );
      })}
      <Diapason x={XA} amp={ampA} f={f} lueur={flux} />
      <Diapason x={XB} amp={ampB} f={f} lueur={flux} />
      {/* Le petit maillet qui frappe. */}
      <g opacity={oMaillet} transform={`rotate(${angleMaillet} 28 420)`}>
        <line x1={28} y1={420} x2={124} y2={180} stroke={F.cuir} strokeWidth={11} strokeLinecap="round" />
        <circle cx={124} cy={174} r={25} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      </g>
      </g>
      {/* Les deux courbes qui n'en font plus qu'une. */}
      <g opacity={naissance}>
        <path d={c2} fill="none" stroke={F.argile} strokeWidth={8} strokeLinecap="round" opacity={1 - fondue} />
        <path d={c1} fill="none" stroke={F.orFonce} strokeWidth={mix(8, 14, fondue)} strokeLinecap="round" />
        {fondue > 0 ? <path d={c1} fill="none" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" opacity={fondue} /> : null}
        {flux > 0
          ? Array.from({ length: 6 }, (_, i) => {
              const t = ((f - d[4]) / 110 + i / 6) % 1;
              const x = 60 + t * 680;
              const y = yC + 62 * Math.sin(k * (x - 60) + ph);
              return <Piece key={i} x={x} y={y} r={15} opacite={flux} />;
            })
          : null}
      </g>
      <Libelle x={400} y={830} taille={32} graisse={600} couleur={F.orFonce} opacite={fondue}>{LIBELLES.communion}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 4 : le train.                                                  */
/* ------------------------------------------------------------------ */

const W_W = 176;

const Roue: React.FC<{ x: number; angle: number }> = ({ x, angle }) => (
  <g transform={`translate(${x} 566) rotate(${angle})`}>
    <circle r={28} fill={F.encre2} stroke={F.encre} strokeWidth={5} />
    <circle r={17} fill={F.filet} />
    <line x1={-17} x2={17} stroke={F.encre} strokeWidth={5} />
    <line y1={-17} y2={17} stroke={F.encre} strokeWidth={5} />
    <circle r={6} fill={F.encre} />
  </g>
);

const Wagon: React.FC<{ x: number; libelle: string; angle: number; lueur?: number; absent?: number; children?: React.ReactNode }> = ({ x, libelle, angle, lueur = 0, absent = 0, children }) => (
  <g>
    <g opacity={1 - 0.78 * absent}>{children}</g>
    <g opacity={1 - 0.62 * absent}>
      <rect x={x + 6} y={532} width={W_W - 12} height={12} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      <line x1={x - 10} x2={x + W_W + 10} y1={538} y2={538} stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
      <Roue x={x + 42} angle={angle} />
      <Roue x={x + W_W - 42} angle={angle} />
      <rect x={x} y={402} width={W_W} height={130} rx={6} fill={F.papier} stroke={lueur > 0 ? F.or : F.encre} strokeWidth={5 + 3 * lueur} strokeDasharray={absent > 0.5 ? '14 10' : undefined} />
      <rect x={x - 6} y={392} width={W_W + 12} height={16} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      <Libelle x={x + W_W / 2} y={476} taille={22.5} graisse={600}>{libelle}</Libelle>
    </g>
  </g>
);

const Outils: React.FC<{ x: number }> = ({ x }) => (
  <g>
    {/* Le marteau. */}
    <g transform={`rotate(-22 ${x + 8} 392)`}>
      <line x1={x + 8} x2={x + 8} y1={388} y2={236} stroke={F.cuirClair} strokeWidth={14} strokeLinecap="round" />
      <rect x={x - 28} y={214} width={72} height={38} rx={5} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
    </g>
    {/* La pelle. */}
    <g transform={`rotate(20 ${x} 392)`}>
      <line x1={x} x2={x} y1={388} y2={268} stroke={F.cuir} strokeWidth={12} strokeLinecap="round" />
      <path d={`M${x - 24} 268 H${x + 24} V226 Q${x} 192 ${x - 24} 226 Z`} fill={F.filet} stroke={F.encre} strokeWidth={4} />
    </g>
  </g>
);

const IlluTrain: React.FC<PropsIllustration> = ({ f, d }) => {
  const a1 = d[2] + 130;
  const a2 = d[2] + 250;
  const depart = d[2] + 300;
  const att1 = p(f, a1, a1 + 34);
  const att2 = p(f, a2, a2 + 34);
  const pinFlash1 = lin(f, a1 + 30, a1 + 60);
  const pinFlash2 = lin(f, a2 + 30, a2 + 60);
  const t = Math.max(0, f - depart);
  const distance = Math.min(0.038 * t * t, 3 * t);
  const derive = 100 * p(f, depart, depart + 110);
  const entree = (a: number) => p(f, a, a + 34);
  const e0 = entree(0);
  const e1 = entree(d[0] - 8);
  const e2 = entree(d[0] + 60);
  const xO = 130 - derive;
  const xT = mix(368, 326, att1) - derive + (1 - e1) * 80;
  const xP = mix(606, 522, att2) - derive + (1 - e2) * 60;
  const roule = (decal: number) => -(decal + distance) * 2;
  const absent = p(f, d[1] + 5, d[1] + 40) * (1 - p(f, d[2] - 10, d[2] + 25));
  const lueurO = p(f, d[2] + 25, d[2] + 45) * (1 - p(f, d[2] + 85, d[2] + 115));
  const lueurT = p(f, a1 - 15, a1 + 5) * (1 - p(f, a1 + 75, a1 + 100));
  const lueurP = p(f, a2 - 15, a2 + 5) * (1 - p(f, a2 + 75, a2 + 100));
  const traverses = Array.from({ length: 16 }, (_, i) => ((i * 60 + distance) % 960) - 80);
  return (
    <Scene>
      <defs>
        <clipPath id="ch07-voie">
          <rect x={0} y={590} width={800} height={70} />
        </clipPath>
      </defs>
      <g transform="translate(0 60)">
        <g clipPath="url(#ch07-voie)">
          {traverses.map((x, i) => (
            <rect key={i} x={x} y={606} width={26} height={24} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
          ))}
        </g>
        <rect x={0} y={594} width={800} height={12} fill={F.encre} />
        {/* La fumée, seulement une fois le train parti. */}
        {t > 0
          ? Array.from({ length: 6 }, (_, i) => {
              const u = ((t / 70 + i / 6) % 1);
              const naitre = t / 70 >= i / 6 ? 1 : 0;
              return <circle key={i} cx={xO + 22 + Math.sin(u * 5 + i) * 7} cy={318 - u * 230} r={11 + u * 20} fill={F.filet} stroke={F.encre2} strokeWidth={2} opacity={naitre * (1 - u) * 0.9} />;
            })
          : null}
        <g opacity={e0}>
          <Wagon x={xO} libelle={LIBELLES.ouvrier} angle={roule(0)} lueur={lueurO}>
            <rect x={xO + 10} y={336} width={26} height={58} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
            <rect x={xO + 3} y={324} width={40} height={14} rx={3} fill={F.encre} />
            <path transform={`translate(${xO + 106} 394) scale(0.42) translate(-400 -770)`} d={PION} fill={F.or} stroke={F.encre} strokeWidth={10} />
          </Wagon>
        </g>
        <g opacity={e1}>
          <Wagon x={xT} libelle={LIBELLES.travail} angle={roule(-att1 * 42 + (1 - e1) * 80)} lueur={lueurT}>
            <Outils x={xT + W_W / 2} />
          </Wagon>
        </g>
        <g opacity={e2}>
          <Wagon x={xP} libelle={LIBELLES.provision} angle={roule(-att2 * 84 + (1 - e2) * 60)} lueur={lueurP} absent={absent}>
            {[
              [-54, 362],
              [0, 362],
              [54, 362],
              [-27, 316],
              [27, 316],
              [0, 270],
            ].map(([dx, y], i) => (
              <Piece key={i} x={xP + W_W / 2 + dx} y={y} r={29} />
            ))}
          </Wagon>
        </g>
        {/* Les attelages. */}
        {[
          { x: xO + W_W + 10, a: att1, flash: pinFlash1 },
          { x: xT + W_W + 10, a: att2, flash: pinFlash2 },
        ].map((h, i) =>
          h.a >= 1 ? (
            <g key={i}>
              <circle cx={h.x} cy={538} r={8 + h.flash * 34} fill="none" stroke={F.or} strokeWidth={5} opacity={1 - h.flash} />
              <circle cx={h.x} cy={538} r={10} fill={F.or} stroke={F.encre} strokeWidth={3} />
            </g>
          ) : null,
        )}
        {/* Les traits de vitesse. */}
        {t > 12
          ? [440, 490, 540].map((y, i) => {
              const x = xP + W_W + 18 + (i % 2) * 18;
              return <line key={y} x1={x} x2={Math.min(790, x + 66)} y1={y} y2={y} stroke={F.encre2} strokeWidth={5} strokeLinecap="round" opacity={p(f, depart + 12, depart + 40)} />;
            })
          : null}
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 5 : la fiche et la loupe.                                      */
/* ------------------------------------------------------------------ */

const Y_B = 345;
const Y_V = 530;

const Mots: React.FC = () => (
  <g>
    <Libelle x={190} y={Y_B} taille={38} ancre="start" graisse={600}>{LIBELLES.besoin}</Libelle>
    <Libelle x={190} y={Y_V} taille={38} ancre="start" graisse={600}>{LIBELLES.vie}</Libelle>
  </g>
);

const Coche: React.FC<{ y: number; t: number }> = ({ y, t }) => (
  <g>
    <rect x={546} y={y - 44} width={64} height={64} rx={8} fill={F.parchemin} stroke={F.encre} strokeWidth={4} />
    <path d={`M560 ${y - 14} L574 ${y + 4} L598 ${y - 30}`} pathLength={1} fill="none" stroke={F.orFonce} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={1} strokeDashoffset={1 - t} opacity={t > 0 ? 1 : 0} />
  </g>
);

const IlluFiche: React.FC<PropsIllustration> = ({ f, d }) => {
  const arrivee = p(f, 0, d[0] + 16);
  const trait = (i: number) => p(f, d[0] + 30 + i * 70, d[0] + 90 + i * 70);
  const mots = p(f, d[1] - 10, d[1] + 18);
  // La loupe : le premier mot, puis le second.
  const t1a = d[1] + 150;
  const t1b = d[1] + 212;
  const t2a = d[1] + 232;
  const t2b = d[1] + 290;
  const repos = { x: 590, y: 730 };
  const ent = p(f, d[1] + 60, t1a);
  const bal1 = p(f, t1a, t1b);
  const saut = p(f, t1b + 4, t2a);
  const bal2 = p(f, t2a, t2b);
  const sort = p(f, t2b + 8, d[2] + 40);
  let lx = mix(repos.x, 226, ent);
  let ly = mix(repos.y, Y_B - 12, ent);
  lx = mix(lx, 340, bal1);
  lx = mix(lx, 226, saut);
  ly = mix(ly, Y_V - 12, saut);
  lx = mix(lx, 382, bal2);
  lx = mix(lx, repos.x, sort);
  ly = mix(ly, repos.y, sort);
  const oLoupe = p(f, d[1] + 30, d[1] + 70) * (1 - p(f, d[2] + 10, d[2] + 40));
  const coche1 = p(f, t1b - 6, t1b + 18);
  const coche2 = p(f, t2b - 6, t2b + 18);
  const R = 88;
  const sceau = p(f, d[2], d[2] + 24);
  const ondeSceau = lin(f, d[2] + 20, d[2] + 60);
  const redresse = p(f, d[3], d[3] + 70);
  const angle = -4.5 * (1 - redresse);
  const reperes = p(f, d[3] - 6, d[3] + 24);
  const fini = p(f, d[3] + 66, d[3] + 90);
  return (
    <Scene>
      <defs>
        <clipPath id="ch07-lentille">
          <circle cx={lx} cy={ly} r={R - 6} />
        </clipPath>
      </defs>
      {/* Les repères droits sur lesquels la fiche vient s'aligner. */}
      <g opacity={reperes}>
        {[90, 810].map((y) => (
          <line key={y} x1={20} x2={780} y1={y} y2={y} stroke={fini > 0.5 ? F.or : F.encre2} strokeWidth={4} strokeDasharray="20 14" />
        ))}
      </g>
      <g transform={`translate(0 ${(1 - arrivee) * 70}) rotate(${angle} 400 450)`} opacity={arrivee}>
        <rect x={140} y={90} width={520} height={720} rx={10} fill={F.papier} stroke={fini > 0.5 ? F.orFonce : F.encre} strokeWidth={5} />
        <Libelle x={400} y={170} taille={31} graisse={600}>{LIBELLES.liste}</Libelle>
        <line x1={185} x2={615} y1={198} y2={198} stroke={F.encre} strokeWidth={4} />
        <g opacity={mots}>
          <Mots />
        </g>
        {[Y_B, Y_V].map((y, i) => (
          <line key={y} x1={190} x2={mix(190, 510, trait(i))} y1={y + 34} y2={y + 34} stroke={F.filet} strokeWidth={6} strokeLinecap="round" />
        ))}
        {[Y_B, Y_V].map((y, i) => (
          <line key={y} x1={190} x2={mix(190, 420, trait(i + 0.5))} y1={y + 58} y2={y + 58} stroke={F.filet} strokeWidth={6} strokeLinecap="round" />
        ))}
        <g opacity={mots}>
          <Coche y={Y_B} t={coche1} />
          <Coche y={Y_V} t={coche2} />
        </g>
        {/* La provision n'arrive qu'après les deux coches. */}
        <circle cx={400} cy={700} r={62 + 54 * ondeSceau} fill="none" stroke={F.or} strokeWidth={5} opacity={ondeSceau > 0 ? 1 - ondeSceau : 0} />
        {sceau > 0 ? (
          <g transform={`translate(400 700) scale(${sceau})`}>
            <Piece x={0} y={0} r={62} />
          </g>
        ) : null}
        {/* La loupe grossit ce qu'elle regarde. */}
        <g opacity={oLoupe}>
          <line x1={lx + R * 0.72} y1={ly + R * 0.72} x2={lx + R * 0.72 + 86} y2={ly + R * 0.72 + 86} stroke={F.cuir} strokeWidth={24} strokeLinecap="round" />
          <circle cx={lx} cy={ly} r={R - 6} fill={F.papier} />
          <g clipPath="url(#ch07-lentille)">
            <g transform={`translate(${lx} ${ly}) scale(1.28) translate(${-lx} ${-ly})`}>
              <Mots />
            </g>
          </g>
          <circle cx={lx} cy={ly} r={R - 3} fill="none" stroke={F.orClair} strokeWidth={4} opacity={0.8} />
          <circle cx={lx} cy={ly} r={R} fill="none" stroke={F.encre} strokeWidth={9} />
        </g>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 6 : la porte et l'ombre.                                       */
/* ------------------------------------------------------------------ */

const Agneau: React.FC<{ x: number; y: number; pas: number }> = ({ x, y, pas }) => {
  const laine = [
    [-44, -66, 30],
    [-14, -78, 32],
    [20, -78, 32],
    [50, -66, 28],
    [-34, -44, 28],
    [8, -42, 32],
    [44, -44, 26],
  ];
  const jambes = [-38, -14, 24, 46];
  return (
    <g transform={`translate(${x} ${y}) scale(0.9)`}>
      {jambes.map((j, i) => (
        <line key={i} x1={j} y1={-34} x2={j + Math.sin(pas + i * 2) * 5} y2={0} stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
      ))}
      <ellipse cx={-84} cy={-92} rx={25} ry={18} transform="rotate(-18 -84 -92)" fill={F.encre2} stroke={F.encre} strokeWidth={4} />
      <ellipse cx={-66} cy={-112} rx={15} ry={7} transform="rotate(30 -66 -112)" fill={F.encre2} stroke={F.encre} strokeWidth={3} />
      {laine.map(([a, b, r], i) => (
        <circle key={i} cx={a} cy={b} r={r} fill={F.papier} stroke={F.encre} strokeWidth={8} />
      ))}
      {laine.map(([a, b, r], i) => (
        <circle key={i} cx={a} cy={b} r={r - 2} fill={F.papier} />
      ))}
    </g>
  );
};

const TraitRouge: React.FC<{ d: string; t: number }> = ({ d, t }) => (
  <path d={d} pathLength={1} fill="none" stroke={F.argile} strokeWidth={22} strokeLinecap="round" strokeDasharray={1} strokeDashoffset={1 - t} opacity={t > 0 ? 1 : 0} />
);

const CADRE = { x: 30, y: 30, w: 740, h: 840 };
const TROU = 'M250 90 H550 Q640 90 640 180 V740 Q640 800 580 800 H220 Q160 800 160 740 V180 Q160 90 250 90 Z';

const ombre = (X: number, f: number) => {
  const pts: string[] = [];
  const front = (y: number) => 46 * Math.sin(y / 74 + f / 13) + 26 * Math.sin(y / 31 - f / 9);
  const arriere: string[] = [];
  for (let k = 0; k <= 75; k++) {
    pts.push(`${(X + front(k * 12)).toFixed(1)} ${k * 12}`);
    arriere.push(`${(X - 1000 + front(1100 - k * 12)).toFixed(1)} ${900 - k * 12}`);
  }
  return `M${pts.join(' L')} L${arriere.join(' L')} Z`;
};

const IlluPorte: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const entree = p(f, 0, d[0] + 10);
  const nuit = p(f, d[0] + 40, d[1]);
  const marche = p(f, d[1] + 40, d[1] + 170);
  const pas = (f - d[1]) / 4;
  const ax = mix(850, 684, marche);
  const peint = (i: number) => p(f, d[2] + i * 26, d[2] + 24 + i * 26);
  const agneauO = marche * (1 - 0.72 * p(f, d[2] + 56, d[2] + 95)) * (1 - p(f, d[2] + 110, d[2] + 135));
  const passe = lin(f, d[2] + 110, d[3] + 110);
  const X = mix(0, 1900, passe);
  const dans = passe > 0 && passe < 1 ? 1 : 0;
  const ligne = (t: number) => Math.sin(t * Math.PI);
  const reste = p(f, d[3] + 70, duree - 20);
  const lueur = 0.45 + 0.55 * p(f, d[2], d[2] + 90);
  return (
    <Scene>
      <defs>
        <clipPath id="ch07-cadre">
          <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} rx={14} />
        </clipPath>
        <clipPath id="ch07-corps-ombre">
          <path d={ombre(X, f)} />
        </clipPath>
        <clipPath id="ch07-ombre" clipRule="evenodd">
          <path clipRule="evenodd" d={`M${CADRE.x} ${CADRE.y} H${CADRE.x + CADRE.w} V${CADRE.y + CADRE.h} H${CADRE.x} Z ${TROU}`} />
        </clipPath>
      </defs>
      <g opacity={entree}>
        <g clipPath="url(#ch07-cadre)">
          <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} fill={F.filet} />
          {/* Le mur de pierres. */}
          {Array.from({ length: 10 }, (_, l) => (
            <g key={l}>
              <line x1={30} x2={770} y1={40 + l * 76} y2={40 + l * 76} stroke={F.parchemin} strokeWidth={4} />
              {Array.from({ length: 7 }, (_, c) => (
                <line key={c} x1={30 + c * 124 + (l % 2) * 62} x2={30 + c * 124 + (l % 2) * 62} y1={40 + l * 76} y2={116 + l * 76} stroke={F.parchemin} strokeWidth={4} />
              ))}
            </g>
          ))}
          <rect x={30} y={780} width={740} height={90} fill={F.cuirClair} />
          <line x1={30} x2={770} y1={780} y2={780} stroke={F.encre} strokeWidth={4} />
          {/* Le crépuscule. */}
          <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} fill={F.encre} opacity={0.34 * nuit} />
          {/* La lumière de la maison. */}
          <path d={TROU} fill={F.orClair} opacity={lueur * nuit} />
          <path d={TROU} fill={F.papier} opacity={lueur * nuit * 0.25} />
        </g>
        {/* La porte. */}
        <rect x={285} y={200} width={230} height={580} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        {[342, 400, 458].map((x) => (
          <line key={x} x1={x} x2={x} y1={204} y2={776} stroke={F.encre} strokeWidth={3} />
        ))}
        {[300, 600].map((y) => (
          <rect key={y} x={296} y={y} width={208} height={18} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} />
        ))}
        <circle cx={488} cy={490} r={11} fill={F.or} stroke={F.encre} strokeWidth={3} />
        <rect x={236} y={198} width={50} height={584} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        <rect x={514} y={198} width={50} height={584} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        <rect x={208} y={146} width={384} height={56} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        {/* Les trois traits rouges. */}
        <TraitRouge d="M261 216 Q256 480 262 766" t={peint(0)} />
        <TraitRouge d="M539 216 Q544 480 538 766" t={peint(1)} />
        <TraitRouge d="M226 174 Q400 168 574 175" t={peint(2)} />
        {agneauO > 0 ? (
          <g opacity={agneauO} clipPath="url(#ch07-cadre)">
            <Agneau x={ax} y={776} pas={marche < 1 ? pas : 0} />
          </g>
        ) : null}
        {/* L'ombre : elle couvre tout le cadre, sauf autour de la porte. */}
        {dans ? (
          <g clipPath="url(#ch07-ombre)">
            <g clipPath="url(#ch07-cadre)">
              <path d={ombre(X, f)} fill={F.encre} opacity={0.86} />
            </g>
          </g>
        ) : null}
        {/* Les lignes du courant : l'ombre passe de part et d'autre. */}
        {dans ? (
          <g clipPath="url(#ch07-corps-ombre)" fill="none" stroke={F.filet} strokeWidth={4} strokeLinecap="round" strokeDasharray="34 26" strokeDashoffset={-f * 6} opacity={0.85}>
            <path d="M40 300 C110 300 120 70 250 62 H550 C680 70 690 300 760 300" />
            <path d="M40 180 C90 180 130 46 240 44 H560 C670 46 710 180 760 180" />
            <path d="M40 620 C110 620 110 826 250 830 H550 C690 826 690 620 760 620" />
            <path d="M40 730 C100 730 120 852 240 854 H560 C680 852 700 730 760 730" />
          </g>
        ) : null}
        {dans ? <path d={TROU} fill="none" stroke={F.orClair} strokeWidth={6} opacity={ligne(passe)} /> : null}
        <rect x={CADRE.x} y={CADRE.y} width={CADRE.w} height={CADRE.h} rx={14} fill="none" stroke={F.encre} strokeWidth={5} />
        {/* La lumière de la porte rayonne sur le mur, tout autour de sa zone. */}
        <g stroke={F.orClair} strokeWidth={8} strokeLinecap="round" opacity={reste}>
          {[240, 320, 400, 480, 560].map((x, i) => (
            <line key={x} x1={x} x2={x} y1={76} y2={i % 2 ? 60 : 48} />
          ))}
          {[230, 340, 450, 560, 670].map((y, i) => (
            <g key={y}>
              <line x1={146} x2={i % 2 ? 118 : 94} y1={y} y2={y} />
              <line x1={654} x2={i % 2 ? 682 : 706} y1={y} y2={y} />
            </g>
          ))}
        </g>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 7 : la presse.                                                 */
/* ------------------------------------------------------------------ */

const Tract: React.FC<{ x: number; y: number; angle: number; plie: number; hauteur?: number }> = ({ x, y, angle, plie, hauteur = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${plie} ${hauteur})`}>
    <rect x={-58} y={-76} width={116} height={152} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
    <rect x={-38} y={-58} width={76} height={12} fill={F.orFonce} />
    {[-28, -8, 12, 32, 52].map((dy, i) => (
      <line key={dy} x1={-40} x2={i % 2 ? 26 : 40} y1={dy} y2={dy} stroke={F.encre2} strokeWidth={5} strokeLinecap="round" />
    ))}
  </g>
);

const IlluPresse: React.FC<PropsIllustration> = ({ f, d }) => {
  const R = 34;
  // La rampe.
  const rx1 = 30;
  const ry1 = 470;
  const rx2 = 330;
  const ry2 = 620;
  const surRampe = (x: number) => mix(ry1, ry2, (x - rx1) / (rx2 - rx1)) - R - 3;
  const chute = p(f, d[0] + 90, d[0] + 125);
  const glisse = p(f, d[1] + 10, d[1] + 58);
  const cx = mix(84, 400, glisse);
  const cy = cx < rx2 ? surRampe(cx) : 586;
  const yPiece = glisse > 0 ? cy : mix(-40, surRampe(84), chute);
  const descend = p(f, d[1] + 58, d[1] + 86);
  const remonte = p(f, d[1] + 98, d[1] + 124);
  const course = descend * (1 - remonte);
  const yPlatine = mix(392, 572, course);
  const ecrase = p(f, d[1] + 72, d[1] + 86);
  const roue = 720 * (descend - remonte) + 34 * Math.sin(f / 16) * (1 - p(f, d[1] - 20, d[1] + 10));
  const sort = p(f, d[1] + 110, d[1] + 145);
  const redresse = mix(0.08, 1, p(f, d[1] + 145, d[1] + 165));
  const vol = p(f, d[1] + 158, d[1] + 222);
  const tx0 = 612;
  const ty0 = 620 - 76 * redresse;
  const u = vol;
  const tx = (1 - u) ** 2 * tx0 + 2 * (1 - u) * u * 800 + u ** 2 * 660;
  const ty = (1 - u) ** 2 * ty0 + 2 * (1 - u) * u * 440 + u ** 2 * 140;
  const flot = Math.sin((f - d[1]) / 7) * vol;
  const attente = ((f - d[0] - 125 + 600) % 60) / 60;
  const oAttente = chute >= 1 ? 1 - p(f, d[1], d[1] + 10) : 0;
  const siege = p(f, d[2] - 6, d[2] + 22);
  const efface = p(f, d[2] + 95, d[2] + 165);
  const sauve = p(f, d[1] + 205, d[1] + 235);
  return (
    <Scene>
      <rect x={0} y={760} width={800} height={7} fill={F.encre} />
      {/* La rampe. */}
      <line x1={rx1} y1={ry1} x2={rx2} y2={ry2} stroke={F.cuir} strokeWidth={16} strokeLinecap="round" />
      <line x1={70} y1={492} x2={70} y2={760} stroke={F.cuir} strokeWidth={12} />
      <line x1={190} y1={552} x2={190} y2={760} stroke={F.cuir} strokeWidth={12} />
      <Libelle x={128} y={378} taille={25} graisse={600} couleur={F.orFonce} opacite={p(f, d[1] - 12, d[1] + 10) * (1 - glisse)}>{LIBELLES.francs}</Libelle>
      {/* Le socle et la table. */}
      <rect x={306} y={620} width={188} height={32} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={350} y={652} width={100} height={68} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {/* La pièce devient un tract. */}
      {glisse < 1 || ecrase < 1 ? (
        chute > 0 ? (
          <g transform={`translate(${glisse > 0 ? cx : 84} ${yPiece + 34 * ecrase}) scale(${1 + ecrase * 0.4} ${1 - ecrase * 0.92}) rotate(${glisse * 500})`}>
            <Piece x={0} y={0} r={R} />
          </g>
        ) : null
      ) : null}
      {ecrase >= 1 && sort < 1 ? <rect x={mix(400, 612, sort) - 58} y={608} width={116} height={12} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={3} /> : null}
      <circle cx={84} cy={surRampe(84)} r={R + 8 + attente * 36} fill="none" stroke={F.or} strokeWidth={5} opacity={oAttente * (1 - attente)} />
      {/* La vis et la platine. */}
      <rect x={385} y={60} width={30} height={Math.max(0, yPlatine - 60)} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {Array.from({ length: 16 }, (_, i) => {
        const y = 92 + i * 24 + ((roue / 45) % 24);
        return y < yPlatine - 8 ? <line key={i} x1={387} x2={413} y1={y} y2={y - 8} stroke={F.encre2} strokeWidth={3} /> : null;
      })}
      <rect x={310} y={yPlatine} width={180} height={34} rx={4} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
      {/* Le cadre devant la pièce : elle passe dedans. */}
      <rect x={258} y={220} width={40} height={500} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={502} y={220} width={40} height={500} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      <rect x={224} y={176} width={352} height={56} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      <rect x={224} y={718} width={352} height={42} rx={4} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      {/* Le levier qui tourne au sommet. */}
      <g transform="translate(400 66)">
        {(() => {
          const c = 110 * Math.cos(rad(roue));
          return (
            <g>
              <line x1={-c} x2={c} y1={0} y2={0} stroke={F.encre} strokeWidth={12} strokeLinecap="round" />
              <circle cx={-c} r={15} fill={F.or} stroke={F.encre} strokeWidth={4} />
              <circle cx={c} r={15} fill={F.or} stroke={F.encre} strokeWidth={4} />
              <circle r={20} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
            </g>
          );
        })()}
      </g>
      {/* Le tract s'envole. */}
      {sort >= 1 ? (
        <g>
          <Rayons x={660} y={140} r1={102} r2={128} de={-185} a={5} n={11} o={sauve} e={6} />
          <Tract x={tx} y={ty} angle={mix(6, -6, u) * vol + flot * 7} plie={1 - vol * (0.16 - 0.16 * Math.abs(Math.cos((f - d[1]) / 9)))} hauteur={redresse} />
        </g>
      ) : null}
      <Libelle x={660} y={258} taille={25} graisse={600} opacite={sauve}>{LIBELLES.tract}</Libelle>
      {/* Le siège marqué, qui s'efface. */}
      {siege > 0 && efface < 1 ? (
        <g opacity={siege * (1 - efface)} transform={`translate(0 ${efface * 14})`}>
          <rect x={610} y={500} width={160} height={152} rx={14} fill={F.argile} stroke={F.encre} strokeWidth={5} />
          <rect x={622} y={544} width={136} height={54} rx={5} fill={F.papier} stroke={F.encre} strokeWidth={3} />
          <Libelle x={690} y={580} taille={25} graisse={600}>{LIBELLES.siege}</Libelle>
          <rect x={598} y={650} width={184} height={44} rx={12} fill={F.argile} stroke={F.encre} strokeWidth={5} />
          <line x1={624} x2={624} y1={694} y2={760} stroke={F.encre} strokeWidth={11} />
          <line x1={756} x2={756} y1={694} y2={760} stroke={F.encre} strokeWidth={11} />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 8 : les vases passent la frontière.                            */
/* ------------------------------------------------------------------ */

const Vase: React.FC<{ x: number; y: number; forme: number; or: boolean; fantome?: boolean; o?: number }> = ({ x, y, forme, or, fantome = false, o = 1 }) => {
  const remplir = fantome ? 'none' : or ? F.or : F.papier;
  const trait = fantome ? F.encre2 : F.encre;
  const dash = fantome ? '12 10' : undefined;
  const reflet = or ? F.orClair : F.filet;
  const corps = [
    'M-26 0 Q-22 -22 -40 -64 Q-58 -112 -30 -160 L-22 -196 H22 L30 -160 Q58 -112 40 -64 Q22 -22 26 0 Z',
    'M-34 0 V-16 Q-14 -24 -14 -46 V-92 Q-52 -116 -50 -196 H50 Q52 -116 14 -92 V-46 Q14 -24 34 -16 V0 Z',
    'M-30 0 Q-52 -30 -50 -84 Q-48 -128 -18 -146 V-178 L-26 -196 H26 L18 -178 V-146 Q48 -128 50 -84 Q52 -30 30 0 Z',
  ][forme];
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {forme === 0 ? (
        <g fill="none" stroke={trait} strokeWidth={fantome ? 3 : 7} strokeDasharray={dash}>
          <path d="M-28 -176 Q-60 -176 -48 -120" />
          <path d="M28 -176 Q60 -176 48 -120" />
        </g>
      ) : null}
      {forme === 2 ? <path d="M18 -160 Q62 -160 44 -92" fill="none" stroke={trait} strokeWidth={fantome ? 3 : 7} strokeDasharray={dash} /> : null}
      <path d={corps} fill={remplir} stroke={trait} strokeWidth={fantome ? 3 : 4.5} strokeDasharray={dash} strokeLinejoin="round" />
      {fantome ? null : (
        <g>
          {forme === 1 ? <path d="M-34 -176 Q-34 -128 -10 -108" fill="none" stroke={reflet} strokeWidth={7} strokeLinecap="round" /> : <path d="M-24 -130 Q-38 -90 -22 -44" fill="none" stroke={reflet} strokeWidth={7} strokeLinecap="round" />}
          <rect x={forme === 1 ? -50 : -24} y={-196} width={forme === 1 ? 100 : 48} height={9} fill={or ? F.orFonce : F.encre2} />
        </g>
      )}
    </g>
  );
};

const RANGEE = [
  { forme: 0, or: true },
  { forme: 2, or: false },
  { forme: 1, or: true },
];
const X_DEPART = [484, 600, 716];
const GLISSE = 400;

const IlluVases: React.FC<PropsIllustration> = ({ f, d }) => {
  const d2 = d[2];
  const leve = p(f, d2 + 8, d2 + 42);
  const a = d2 + 42;
  const b = d2 + 262;
  const g = p(f, a, b);
  // La dernière passe la frontière : le compteur s'arrête à cette image.
  let arret = b;
  for (let x = a; x <= b; x++) {
    if (X_DEPART[2] + 50 - GLISSE * p(x, a, b) < 400) {
      arret = x;
      break;
    }
  }
  const debutCompte = d[1];
  const progres = lin(f, debutCompte, arret);
  const angleAiguille = 1440 * progres;
  const arrete = f >= arret;
    const onde = lin(f, arret, arret + 34);
  const brille = p(f, b - 20, b + 10);
  const fantome = (i: number) => p(f, d[0] + 130 + i * 40, d[0] + 160 + i * 40);
  const oLabel = p(f, d[1] - 10, d[1] + 18);
  const lueurLocket = p(f, d2 - 6, d2 + 10) * (1 - p(f, d2 + 30, d2 + 50));
  return (
    <Scene>
      {/* Le compteur des années. */}
      <g>
        <circle cx={400} cy={160} r={108} fill={F.papier} stroke={arrete ? F.orFonce : F.encre} strokeWidth={6} />
        <path d={`M400 160 L400 52 A108 108 0 ${(progres * 4) % 1 > 0.5 ? 1 : 0} 1 ${400 + 108 * Math.sin(rad(angleAiguille))} ${160 - 108 * Math.cos(rad(angleAiguille))} Z`} fill={F.orClair} opacity={progres > 0 && progres < 1 ? 0.65 : 0} />
        {Array.from({ length: 40 }, (_, i) => {
          const t = rad(i * 9);
          const r = i % 5 === 0 ? 84 : 93;
          return <line key={i} x1={400 + Math.sin(t) * r} y1={160 - Math.cos(t) * r} x2={400 + Math.sin(t) * 102} y2={160 - Math.cos(t) * 102} stroke={F.encre2} strokeWidth={i % 5 === 0 ? 4 : 2} />;
        })}
        <circle cx={400} cy={160} r={108 + onde * 18} fill="none" stroke={F.or} strokeWidth={5} opacity={arrete ? 1 - onde : 0} />
        <line x1={400} y1={160} x2={400 + Math.sin(rad(angleAiguille)) * 78} y2={160 - Math.cos(rad(angleAiguille)) * 78} stroke={F.argile} strokeWidth={9} strokeLinecap="round" />
        <circle cx={400} cy={160} r={13} fill={F.encre} />
      </g>
      <Libelle x={400} y={312} taille={30} graisse={600} opacite={oLabel}>{LIBELLES.ans}</Libelle>
      {/* La frontière. */}
      <line x1={400} x2={400} y1={340} y2={680} stroke={F.encre2} strokeWidth={4} strokeDasharray="14 12" />
      <rect x={372} y={694} width={56} height={166} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      {[735, 777, 819].map((y) => (
        <line key={y} x1={372} x2={428} y1={y} y2={y} stroke={F.encre} strokeWidth={3} />
      ))}
      <line x1={20} x2={780} y1={860} y2={860} stroke={F.encre} strokeWidth={5} />
      <Libelle x={200} y={392} taille={30} graisse={600} couleur={F.orFonce}>{LIBELLES.israel}</Libelle>
      <Libelle x={600} y={392} taille={30} graisse={600} couleur={F.encre2}>{LIBELLES.egypte}</Libelle>
      {/* La planche, puis les places vides d'Israël. */}
      <rect x={18} y={680} width={764} height={16} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {RANGEE.map((v, i) => (
        <Vase key={i} x={X_DEPART[i] - GLISSE} y={680} forme={v.forme} or={v.or} fantome o={fantome(i) * (1 - p(f, b - 40, b))} />
      ))}
      {/* Les vases. */}
      {RANGEE.map((v, i) => (
        <Vase key={i} x={X_DEPART[i] - GLISSE * g} y={680} forme={v.forme} or={v.or} o={p(f, 0, d[0])} />
      ))}
      {/* La barrière : une seule parole l'ouvre. */}
      <g opacity={1 - leve} transform={`translate(0 ${-leve * 40})`}>
        <circle cx={400} cy={562} r={44} fill="none" stroke={F.or} strokeWidth={6} opacity={lueurLocket} />
        <rect x={395} y={444} width={10} height={236} fill={F.encre} />
        <path d={`M384 546 V${530 - leve * 12} A16 16 0 0 1 416 ${530 - leve * 12} V546`} fill="none" stroke={F.encre2} strokeWidth={7} />
        <rect x={378} y={544} width={44} height={42} rx={6} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
        <circle cx={400} cy={562} r={6} fill={F.or} />
      </g>
      {X_DEPART.map((x, i) => (
        <path key={x} transform={`translate(${x - GLISSE} 446) scale(${brille * (0.82 + 0.18 * Math.sin(f / 9 + i * 2))})`} d="M0 -22 Q3 -3 22 0 Q3 3 0 22 Q-3 3 -22 0 Q-3 -3 0 -22 Z" fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={brille} />
      ))}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 9 : le même or, deux formes.                                   */
/* ------------------------------------------------------------------ */

type Pt = [number, number];

/** Lisse un contour fermé (Catmull-Rom). */
const lisse = (pts: Pt[], parSegment = 10): Pt[] => {
  const n = pts.length;
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const [a, b, c, e] = [pts[(i - 1 + n) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]];
    for (let s = 0; s < parSegment; s++) {
      const t = s / parSegment;
      const h = (k: 0 | 1) => 0.5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - e[k]) * t * t + (3 * b[k] - a[k] - 3 * c[k] + e[k]) * t * t * t);
      out.push([h(0), h(1)]);
    }
  }
  return out;
};

/** Rééchantillonne un contour fermé en `n` points à espacement égal, pour pouvoir passer de l'un à l'autre. */
const reprend = (pts: Pt[], n: number): Pt[] => {
  const longs: number[] = [0];
  for (let i = 1; i <= pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i % pts.length];
    longs.push(longs[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
  }
  const total = longs[pts.length];
  const out: Pt[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const c = (i * total) / n;
    while (longs[j + 1] < c) j++;
    const t = (c - longs[j]) / (longs[j + 1] - longs[j] || 1);
    const a = pts[j];
    const b = pts[(j + 1) % pts.length];
    out.push([mix(a[0], b[0], t), mix(a[1], b[1], t)]);
  }
  return out;
};

const N_FORME = 260;

const VEAU = reprend(
  lisse([
    [208, 720], [206, 640], [202, 575], [188, 515], [174, 462], [160, 432], [120, 424], [88, 404], [80, 372], [98, 346], [134, 326],
    [146, 306], [134, 276], [140, 246], [156, 274], [176, 296], [196, 298], [224, 288], [256, 290], [240, 312], [224, 322], [238, 340],
    [290, 352], [400, 358], [520, 354], [610, 348], [660, 368], [684, 414], [700, 490], [716, 556], [696, 566], [672, 496], [656, 442],
    [662, 520], [650, 590], [644, 650], [648, 720], [600, 720], [596, 650], [590, 600], [566, 596], [554, 650], [552, 720], [504, 720],
    [502, 640], [488, 572], [420, 562], [344, 558], [334, 600], [332, 650], [334, 720], [286, 720], [284, 650], [282, 600], [264, 596], [256, 650], [256, 720],
  ]).map(([x, y]): Pt => [x, Math.min(y, 720)]),
  N_FORME,
);

const TENTE = reprend(
  [
    [90, 720],
    [270, 300],
    [530, 300],
    [710, 720],
  ],
  N_FORME,
);

const BLOC = reprend(
  [
    [230, 720],
    [230, 450],
    [570, 450],
    [570, 720],
  ],
  N_FORME,
);

const trace = (a: Pt[], b: Pt[], t: number) => `M${a.map((q, i) => `${mix(q[0], b[i][0], t).toFixed(1)} ${mix(q[1], b[i][1], t).toFixed(1)}`).join(' L')} Z`;

const TAS: Pt[] = [
  [260, 690], [330, 690], [400, 690], [470, 690], [540, 690],
  [295, 640], [365, 640], [435, 640], [505, 640],
  [330, 590], [400, 590], [470, 590],
  [365, 540], [435, 540],
  [400, 490],
];

const IlluVeau: React.FC<PropsIllustration> = ({ f, d }) => {
  const fond = p(f, d[0] + 44, d[1] - 6);
  const hesite = p(f, d[1], d[1] + 14) * (1 - p(f, d[1] + 46, d[1] + 60));
  const versVeau = p(f, d[1] + 52, d[1] + 100);
  const versTente = p(f, d[1] + 146, d[1] + 192);
  // La tente se défait d'abord (détails, lumière, nom) ; alors seulement la forme repart vers le veau.
  const defait = p(f, d[2], d[2] + 12);
  const retour = p(f, d[2] + 12, d[2] + 50);
  const oscille = Math.sin((f - d[1]) / 5.5) * 5 * hesite;
  let chemin: string;
  if (versVeau < 1) chemin = trace(BLOC, VEAU, versVeau);
  else if (versTente < 1) chemin = trace(VEAU, TENTE, versTente);
  else chemin = trace(TENTE, VEAU, retour);
  // Pendant les métamorphoses, une seule silhouette dorée. La toile et ses détails n'arrivent que sur la forme presque achevée.
  const tente = p(f, d[1] + 178, d[1] + 194) * (1 - defait);
  const dore = 1 - tente;
  const plein = 1 - versVeau;
  const lumiere = p(f, d[1] + 188, d[1] + 215) * (1 - defait);
  const sabots = p(f, d[1] + 92, d[1] + 100) * (1 - p(f, d[1] + 146, d[1] + 154)) + p(f, d[2] + 42, d[2] + 50);
  // Les deux noms ne se croisent jamais : l'un sort au début de la métamorphose, l'autre entre à sa fin.
  const nomVeau = p(f, d[1] + 86, d[1] + 100) * (1 - p(f, d[1] + 146, d[1] + 158)) + p(f, d[2] + 38, d[2] + 50);
  const nomTente = p(f, d[1] + 180, d[1] + 194) * (1 - defait);
  const hauteur = mix(0.02, 1, fond);
  const yEchelle = `translate(0 ${720 * (1 - hauteur)}) scale(1 ${hauteur})`;
  return (
    <Scene>
      <line x1={40} x2={760} y1={720} y2={720} stroke={F.encre} strokeWidth={5} />
      {/* La lumière qui sort de la tente. */}
      {lumiere > 0 ? <Rayons x={400} y={520} r1={250} r2={350} de={-158} a={-22} n={11} o={lumiere} e={8} /> : null}
      <g transform={`rotate(${oscille} 400 720)`}>
        {fond > 0 ? (
          <g transform={yEchelle} opacity={dore}>
            <path d={chemin} fill={F.or} fillOpacity={mix(1, 0.14, versVeau)} stroke={F.or} strokeWidth={mix(5, 11, versVeau)} strokeLinejoin="round" />
            {plein > 0 ? <path d={chemin} fill="none" stroke={F.encre} strokeWidth={5} opacity={plein} /> : null}
          </g>
        ) : null}
        {/* Le reflet du bloc, qui monte avec lui. */}
        <g opacity={fond * (1 - versVeau)} transform={yEchelle}>
          <path d="M262 480 H420" stroke={F.orClair} strokeWidth={11} strokeLinecap="round" />
          <path d="M262 510 V600" stroke={F.orClair} strokeWidth={11} strokeLinecap="round" />
        </g>
        {/* Les détails de la silhouette : la double ligne du contour et le bas des pattes. */}
        <path d={chemin} fill="none" stroke={F.orFonce} strokeWidth={3} opacity={versVeau * dore} />
        <path d="M208 700 H256 M286 700 H334 M504 700 H552 M600 700 H648" stroke={F.or} strokeWidth={7} opacity={sabots} />
      </g>
      {/* La tente : la toile, l'ouverture, les pans et les piquets. */}
      {tente > 0 ? (
        <g opacity={tente}>
          <path d={trace(TENTE, TENTE, 0)} fill={F.papier} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          <path d="M270 300 L52 720 M530 300 L748 720" stroke={F.cuir} strokeWidth={4} />
          <path d="M270 300 H530" stroke={F.or} strokeWidth={9} strokeLinecap="round" />
          {[210, 330, 470, 590].map((x, i) => (
            <line key={x} x1={x} y1={720} x2={i < 2 ? 270 + i * 90 : 530 - (3 - i) * 90} y2={300} stroke={F.filet} strokeWidth={5} />
          ))}
          <path d="M305 720 L400 410 L495 720 Z" fill={F.orClair} stroke={F.encre} strokeWidth={5} />
          <path d="M368 720 L400 520 L432 720 Z" fill={F.papier} opacity={lumiere} />
          <path d="M305 720 L400 410 L336 720 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
          <path d="M495 720 L400 410 L464 720 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        </g>
      ) : null}
      {/* Le tas de pièces. */}
      {TAS.map(([x, y], i) => {
        const tombe = p(f, i * 3, d[0] + 26 + i);
        const o = 1 - p(f, d[0] + 44 + (14 - i) * 3, d[0] + 72 + (14 - i) * 3);
        if (o <= 0 || tombe <= 0) return null;
        return <Piece key={i} x={x} y={mix(-40, y, tombe)} r={36 * mix(1, 0.75, 1 - o)} opacite={o} />;
      })}
      {nomVeau > 0 ? <Libelle x={400} y={790} taille={36} graisse={600} couleur={F.orFonce} opacite={nomVeau}>{LIBELLES.veau}</Libelle> : null}
      {nomTente > 0 ? <Libelle x={400} y={790} taille={36} graisse={600} opacite={nomTente}>{LIBELLES.tabernacle}</Libelle> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 10 : les trois voies et la main ouverte.                       */
/* ------------------------------------------------------------------ */

const Main: React.FC<{ x: number; y: number; o: number; plein: number }> = ({ x, y, o, plein }) => {
  const doigts = [
    { dx: -48, h: 86 },
    { dx: -16, h: 104 },
    { dx: 16, h: 98 },
    { dx: 48, h: 78 },
  ];
  const formes = (couleur: string, large: number, fond: string) => (
    <g stroke={couleur} strokeWidth={large} fill={fond}>
      {doigts.map((k) => (
        <rect key={k.dx} x={k.dx - 14} y={-50 - k.h} width={28} height={k.h + 20} rx={14} />
      ))}
      <rect x={60} y={-20} width={28} height={84} rx={14} transform="rotate(38 74 50)" />
      <rect x={-66} y={-46} width={132} height={116} rx={30} />
      <rect x={-40} y={50} width={80} height={80} rx={8} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      {formes(F.encre, 8, 'none')}
      {formes(plein > 0.5 ? F.papier : F.parchemin, 0, plein > 0.5 ? F.papier : F.parchemin)}
    </g>
  );
};

const IlluVoies: React.FC<PropsIllustration> = ({ f, d }) => {
  const C = { x: 190, y: 400 };
  const MAIN = { x: 170, y: 742 };
  const voies = [
    { c: `M${C.x + 50} ${C.y - 12} C340 330 400 150 530 130`, dx: 0.8, dy: -0.6 },
    { c: `M${C.x + 54} ${C.y} H512`, dx: 1, dy: 0 },
    { c: `M${C.x + 50} ${C.y + 12} C340 470 400 660 545 680`, dx: 0.8, dy: 0.6 },
  ];
  const trace0 = (i: number) => p(f, d[0] + 60 + i * 50, d[0] + 110 + i * 50);
  const oMain = p(f, d[0] + 190, d[0] + 230);
  const allume = (i: number) => {
    const a = d[2 + i] + 4;
    const fin = i < 2 ? d[3 + i] - 4 : d[4] + 130;
    return p(f, a, a + 22) * (1 - p(f, fin - 22, fin));
  };
  const vu = (i: number) => p(f, d[2 + i], d[2 + i] + 22);
  const avance = (i: number) => {
    const a = d[2 + i] + 4;
    const fin = i < 2 ? d[3 + i] - 4 : d[4] + 130;
    return p(f, a, a + 44) * (1 - p(f, fin - 34, fin));
  };
  const part = p(f, d[4] + 134, d[4] + 200);
  let cx = C.x;
  let cy = C.y;
  for (let i = 0; i < 3; i++) {
    cx += voies[i].dx * 44 * avance(i);
    cy += voies[i].dy * 44 * avance(i);
  }
  const arrivee = p(f, 0, d[0] + 24);
  cy = mix(-60, cy, arrivee);
  cx = mix(cx, MAIN.x, part);
  cy = mix(cy, MAIN.y - 6, part);
  const ecrase = Math.abs(Math.cos((f - d[1]) / 14));
  const tourne = f >= d[1] && part === 0 ? mix(1, 0.3 + 0.7 * ecrase, p(f, d[1], d[1] + 20) * (1 - vu(0))) : 1;
  const pouls = lin(f, d[0] + 24, d[0] + 64);
  const donne = p(f, d[4] + 190, d[4] + 214);
  const coffre = allume(0);
  const lid = coffre * 30;
  const plat = allume(1);
  const miroir = allume(2);
  const gris = (i: number) => mix(0.72, 1, allume(i));
  const lien = lin(f, d[4] + 110, d[4] + 150);
  return (
    <Scene>
      {/* Les voies. */}
      {voies.map((v, i) => (
        <g key={i}>
          <path d={v.c} pathLength={1} fill="none" stroke={F.filet} strokeWidth={26} strokeDasharray={1} strokeDashoffset={1 - trace0(i)} />
          <path d={v.c} pathLength={1} fill="none" stroke={F.or} strokeWidth={26} strokeDasharray={1} strokeDashoffset={1 - trace0(i)} opacity={allume(i)} />
          <path d={v.c} fill="none" stroke={F.papier} strokeWidth={3} strokeDasharray="14 14" strokeDashoffset={allume(i) > 0 ? -f * 2 : 0} opacity={trace0(i)} />
        </g>
      ))}
      {/* Le coffre. */}
      <g opacity={gris(0) * trace0(0)}>
        <g>
          {[0, 1, 2].map((i) => (
            <Piece key={i} x={610 + i * 40} y={102 - lid * 0.1 - 4} r={22} opacite={p(f, d[2] + 12 + i * 10, d[2] + 26 + i * 10)} />
          ))}
        </g>
        <rect x={555} y={100} width={190} height={92} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <rect x={634} y={132} width={32} height={34} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
        <g transform={`rotate(${-lid * 0.8} 555 100)`}>
          <path d="M555 100 Q650 34 745 100 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        </g>
        <Libelle x={650} y={236} taille={30} graisse={600} opacite={vu(0)} couleur={allume(0) > 0.5 ? F.orFonce : F.encre}>{LIBELLES.insense}</Libelle>
      </g>
      {/* L'assiette. */}
      <g opacity={gris(1) * trace0(1)}>
        <circle cx={650} cy={400} r={86} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        <circle cx={650} cy={400} r={62} fill="none" stroke={F.filet} strokeWidth={4} />
        {[
          [-22, 8],
          [22, 8],
          [0, -24],
        ].map(([dx, dy], i) => (
          <Piece key={i} x={650 + dx} y={400 + dy} r={Math.max(0.1, 20 * (1 - p(f, d[3] + 30 + i * 40, d[3] + 70 + i * 40)))} opacite={f < d[3] + 70 + i * 40 ? vu(1) : 0} />
        ))}
        <path d="M546 330 V368 M534 330 V358 Q534 372 546 372 Q558 372 558 358 V330 M546 372 V470" fill="none" stroke={F.encre} strokeWidth={6} strokeLinecap="round" />
        <path d="M754 330 Q774 372 772 398 H754 Z M763 398 V470" fill={F.encre2} stroke={F.encre} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <Libelle x={650} y={528} taille={30} graisse={600} opacite={vu(1)} couleur={allume(1) > 0.5 ? F.orFonce : F.encre}>{LIBELLES.idolatre}</Libelle>
      </g>
      {/* Le miroir. */}
      <g opacity={gris(2) * trace0(2)}>
        <rect x={638} y={758} width={24} height={36} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={590} y={792} width={120} height={14} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <ellipse cx={650} cy={664} rx={70} ry={98} fill={F.or} stroke={F.encre} strokeWidth={5} />
        <ellipse cx={650} cy={664} rx={55} ry={83} fill={F.papier} stroke={F.encre} strokeWidth={3} />
        <Piece x={650} y={664} r={10 + 30 * miroir} opacite={borne(miroir * 2)} />
        <path d="M618 616 L650 584 M616 650 L672 594" stroke={F.filet} strokeWidth={6} strokeLinecap="round" opacity={0.6 + 0.4 * miroir} />
        <Libelle x={650} y={848} taille={30} graisse={600} opacite={vu(2)} couleur={allume(2) > 0.5 ? F.orFonce : F.encre}>{LIBELLES.mondain}</Libelle>
      </g>
      {/* La main ouverte. */}
      <line x1={C.x} y1={C.y + 50} x2={MAIN.x} y2={MAIN.y - 170} stroke={F.or} strokeWidth={7} strokeDasharray="4 18" strokeLinecap="round" opacity={lien * (1 - donne)} />
      <Rayons x={MAIN.x} y={MAIN.y - 40} r1={132} r2={168} de={-145} a={-35} n={7} o={donne} />
      <Main x={MAIN.x} y={MAIN.y} o={mix(0.68, 1, lien) * oMain} plein={lien} />
      {/* La pièce. */}
      <circle cx={C.x} cy={C.y} r={46 + pouls * 44} fill="none" stroke={F.or} strokeWidth={5} opacity={pouls > 0 && pouls < 1 ? 1 - pouls : 0} />
      <g transform={`translate(${cx} ${cy}) scale(${tourne} 1)`}>
        <Piece x={0} y={0} r={44} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ */
/* Plan 11 : l'eau de lumière couvre la terre.                         */
/* ------------------------------------------------------------------ */

const TERRES = [
  'M180 340 Q220 270 300 280 Q360 286 350 340 Q340 372 300 372 Q286 420 310 470 Q330 510 290 540 Q250 500 240 440 Q190 420 180 340 Z',
  'M430 240 Q490 220 560 262 Q610 300 570 340 Q520 350 500 320 Q450 330 420 300 Q410 262 430 240 Z',
  'M440 410 Q500 378 560 416 Q610 470 570 540 Q530 610 480 640 Q440 610 450 540 Q420 470 440 410 Z',
  'M280 620 Q330 590 370 630 Q390 690 340 716 Q290 700 280 620 Z',
];

const CXT = 400;
const CYT = 470;
const RT = 300;

const IlluTerre: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const debut = d[0] + 10;
  const finRemplit = d[2] + (duree - d[2]) * 0.82;
  const n = lin(f, debut, finRemplit);
  const niveau = n * n * 0.25 + n * 0.75;
  const yEau = CYT + RT + 6 - niveau * (2 * RT + 30);
  const eclat = p(f, finRemplit - 10, finRemplit + 40);
  const gouttes: { x: number; y: number; t: number; k: number }[] = [];
  const dernier = Math.floor((Math.min(f, finRemplit) - debut) / 8);
  for (let k = Math.max(0, dernier - 12); k <= dernier + 0; k++) {
    const t0 = debut + k * 8;
    if (k % (t0 < d[1] ? 3 : t0 < d[2] ? 2 : 1) !== 0) continue;
    const t = (f - t0) / (40 + (k % 3) * 2);
    if (t < 0) continue;
    const dem = Math.sqrt(Math.max(0, RT * RT - (yEau - CYT) * (yEau - CYT)));
    const large = Math.max(20, Math.min(dem, RT * 0.9) * 0.82);
    const x = CXT + Math.sin(k * 2.399) * large;
    gouttes.push({ x, y: mix(14, yEau, Math.min(1, t * t)), t, k });
  }
  const ride = gouttes.filter((g) => g.t >= 1 && g.t < 1 + 18 / 40);
  const vagues: string[] = [];
  for (let x = CXT - RT - 10; x <= CXT + RT + 10; x += 12) vagues.push(`${x} ${(yEau + 7 * Math.sin(x / 42 + f / 11) + 4 * Math.sin(x / 19 - f / 7)).toFixed(1)}`);
  const eau = `M${vagues.join(' L')} L${CXT + RT + 10} ${CYT + RT + 10} L${CXT - RT - 10} ${CYT + RT + 10} Z`;
  return (
    <Scene>
      <defs>
        <clipPath id="ch07-terre">
          <circle cx={CXT} cy={CYT} r={RT} />
        </clipPath>
      </defs>
      <Rayons x={CXT} y={CYT} r1={RT + 18} r2={RT + 74} de={0} a={345} n={24} o={eclat} e={8} />
      <circle cx={CXT} cy={CYT} r={RT} fill={F.papier} />
      <g clipPath="url(#ch07-terre)">
        {TERRES.map((t) => (
          <path key={t} d={t} fill={F.cuirClair} stroke={F.encre} strokeWidth={3.5} />
        ))}
        {[-140, 0, 140].map((dx) => (
          <ellipse key={dx} cx={CXT} cy={CYT} rx={Math.abs(dx) + 1} ry={RT} fill="none" stroke={F.filet} strokeWidth={2.5} />
        ))}
        {[-150, 0, 150].map((dy) => (
          <line key={dy} x1={CXT - RT} x2={CXT + RT} y1={CYT + dy} y2={CYT + dy} stroke={F.filet} strokeWidth={2.5} />
        ))}
        <path d={eau} fill={F.orClair} opacity={0.8} />
        <path d={`M${vagues.join(' L')}`} fill="none" stroke={F.or} strokeWidth={7} />
        {ride.map((g) => {
          const u = (g.t - 1) / (18 / 40);
          return <ellipse key={g.k} cx={g.x} cy={yEau} rx={12 + u * 54} ry={4 + u * 13} fill="none" stroke={F.papier} strokeWidth={5} opacity={1 - u} />;
        })}
      </g>
      <circle cx={CXT} cy={CYT} r={RT} fill="none" stroke={F.encre} strokeWidth={6} />
      {gouttes
        .filter((g) => g.t < 1)
        .map((g) => (
          <path key={g.k} transform={`translate(${g.x} ${g.y})`} d="M0 -26 C10 -8 17 2 17 12 A17 17 0 0 1 -17 12 C-17 2 -10 -8 0 -26 Z" fill={F.or} stroke={F.orFonce} strokeWidth={3} />
        ))}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuverture07,
  p2: IlluMoule,
  p3: IlluDiapasons,
  p4: IlluTrain,
  p5: IlluFiche,
  p6: IlluPorte,
  p7: IlluPresse,
  p8: IlluVases,
  p9: IlluVeau,
  p10: IlluVoies,
  p11: IlluTerre,
  fin: IlluFin07,
};

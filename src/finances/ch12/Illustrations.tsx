import React from 'react';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

/* ------------------------------------------------------------------ Outils ------------------------------------------------------------------ */

type Pt = { x: number; y: number };

/** Progression linéaire 0 → 1 entre deux images. */
const lin = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const bez2 = (a: Pt, b: Pt, c: Pt, t: number): Pt => ({
  x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * b.x + t ** 2 * c.x,
  y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * b.y + t ** 2 * c.y,
});
const bez3 = (a: Pt, b: Pt, c: Pt, e: Pt, t: number): Pt => ({
  x: (1 - t) ** 3 * a.x + 3 * (1 - t) ** 2 * t * b.x + 3 * (1 - t) * t ** 2 * c.x + t ** 3 * e.x,
  y: (1 - t) ** 3 * a.y + 3 * (1 - t) ** 2 * t * b.y + 3 * (1 - t) * t ** 2 * c.y + t ** 3 * e.y,
});
const echant = (g: (t: number) => Pt, n = 40): Pt[] => Array.from({ length: n + 1 }, (_, i) => g(i / n));
/** Valeur pseudo-aléatoire stable, fonction de l'indice seul. */
const hasard = (i: number) => {
  const v = Math.sin(i * 12.9898 + 4.1414) * 43758.5453;
  return v - Math.floor(v);
};

/** Une ligne parcourue à la vitesse constante : on peut en tracer le début et connaître sa pointe. */
const parcours = (pts: Pt[]) => {
  const cumul = [0];
  for (let i = 1; i < pts.length; i++) cumul.push(cumul[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const total = cumul[cumul.length - 1];
  const point = (t: number): { x: number; y: number; angle: number } => {
    const cible = Math.max(0, Math.min(1, t)) * total;
    let i = 1;
    while (i < pts.length - 1 && cumul[i] < cible) i++;
    const a = pts[i - 1];
    const b = pts[i];
    const k = (cible - cumul[i - 1]) / Math.max(1e-6, cumul[i] - cumul[i - 1]);
    return { x: mix(a.x, b.x, k), y: mix(a.y, b.y, k), angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
  };
  const trace = (t: number, de = 0) => {
    const cible = Math.max(0, Math.min(1, t)) * total;
    const debut = de * total;
    const dedans = pts.filter((_, i) => cumul[i] >= debut && cumul[i] <= cible);
    const s = point(de);
    const e = point(t);
    return `M${[s, ...dedans, e].map((q) => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(' L')}`;
  };
  return { point, trace, total };
};

/** Tête de flèche pointant vers +x depuis (0, 0). */
const Pointe: React.FC<{ x: number; y: number; angle: number; t?: number; couleur?: string; opacite?: number }> = ({ x, y, angle, t = 24, couleur = F.or, opacite = 1 }) => (
  <path transform={`translate(${x} ${y}) rotate(${angle})`} d={`M${t} 0 L${-t * 0.75} ${-t * 0.85} L${-t * 0.3} 0 L${-t * 0.75} ${t * 0.85} Z`} fill={couleur} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" opacity={opacite} />
);

/** Rayons de lumière autour d'un point. */
const Rayons: React.FC<{ x: number; y: number; r: number; l: number; n?: number; de?: number; a?: number; o?: number; ep?: number; couleur?: string }> = ({ x, y, r, l, n = 12, de = 0, a = 360, o = 1, ep = 6, couleur = F.or }) => (
  <g opacity={o}>
    {Array.from({ length: n }, (_, i) => {
      const ang = ((de + (i * a) / (a === 360 ? n : Math.max(1, n - 1))) * Math.PI) / 180;
      return <line key={i} x1={x + Math.cos(ang) * r} y1={y + Math.sin(ang) * r} x2={x + Math.cos(ang) * (r + l)} y2={y + Math.sin(ang) * (r + l)} stroke={couleur} strokeWidth={ep} strokeLinecap="round" />;
    })}
  </g>
);

/** Un épi de blé, sa base en (x, y). `g` : croissance de 0 à 1, `e` : taille de l'épi, `feuille` : taille des feuilles. */
const Epi: React.FC<{ x: number; y: number; h?: number; e?: number; feuille?: number; g?: number; incl?: number; rempli?: string; opacite?: number }> = ({ x, y, h = 300, e: taille, feuille = 1, g = 1, incl = 0, rempli = F.or, opacite = 1 }) => {
  if (g <= 0) return null;
  const e = taille ?? h / 300;
  const pas = 18.3 * e;
  const haut = h - 132 * e;
  const fe = e * feuille;
  const grains = Math.max(0, Math.min(1, (g - 0.45) / 0.55));
  const a1 = Math.min(haut * 0.72, 92 * e);
  const a2 = Math.min(haut * 0.86, 62 * e + a1);
  return (
    <g transform={`translate(${x} ${y}) rotate(${incl}) scale(${0.55 + 0.45 * g} ${g})`} opacity={opacite}>
      <path d={`M0 0 Q${5 * e} ${-haut * 0.5} 0 ${-haut - 8 * e}`} fill="none" stroke={F.orFonce} strokeWidth={5 * e} strokeLinecap="round" />
      <path d={`M1 ${-a1} q${28 * fe} ${-44 * fe} ${50 * fe} ${-26 * fe} q${-26 * fe} ${0} ${-50 * fe} ${26 * fe} Z`} fill={rempli} stroke={F.orFonce} strokeWidth={2.5 * e} strokeLinejoin="round" />
      <path d={`M0 ${-a2} q${-28 * fe} ${-44 * fe} ${-48 * fe} ${-26 * fe} q${24 * fe} ${0} ${48 * fe} ${26 * fe} Z`} fill={rempli} stroke={F.orFonce} strokeWidth={2.5 * e} strokeLinejoin="round" />
      <g opacity={grains} transform={`translate(0 ${-haut}) scale(${grains})`}>
        {Array.from({ length: 6 }, (_, i) => (
          <g key={i} transform={`translate(0 ${-i * pas})`}>
            {[-1, 1].map((s) => (
              <g key={s} transform={`translate(${s * 9 * e} ${-6 * e}) rotate(${s * 24})`}>
                <line x1={0} y1={-14 * e} x2={0} y2={-34 * e} stroke={F.orFonce} strokeWidth={1.8 * e} strokeLinecap="round" />
                <ellipse rx={8.5 * e} ry={16 * e} fill={rempli} stroke={F.orFonce} strokeWidth={2.2 * e} />
              </g>
            ))}
          </g>
        ))}
        <ellipse cx={0} cy={-6 * pas - 6 * e} rx={7.5 * e} ry={15 * e} fill={rempli} stroke={F.orFonce} strokeWidth={2.2 * e} />
      </g>
    </g>
  );
};

const Feuille: React.FC<{ a: number; s: number; t: number; rempli?: string; contour?: string }> = ({ a, s, t, rempli = F.or, contour = F.orFonce }) => (
  <path d={`M0 ${-a} q${s * 14 * t} ${-26 * t} ${s * 40 * t} ${-22 * t} q${-s * 10 * t} ${20 * t} ${-s * 40 * t} ${22 * t} Z`} fill={rempli} stroke={contour} strokeWidth={2} strokeLinejoin="round" />
);

/** Une jeune pousse, sa base en (x, y). `e` : taille des feuilles. */
const Pousse: React.FC<{ x: number; y: number; h: number; g: number; e?: number; incl?: number; opacite?: number; rempli?: string; contour?: string }> = ({ x, y, h, g, e = 0.8, incl = 0, opacite = 1, rempli = F.or, contour = F.orFonce }) => {
  if (g <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) rotate(${incl}) scale(1 ${g})`} opacity={opacite}>
      <path d={`M0 0 Q4 ${-h * 0.5} 0 ${-h}`} fill="none" stroke={contour} strokeWidth={3.5} strokeLinecap="round" />
      <Feuille a={h * 0.42} s={1} t={e} rempli={rempli} contour={contour} />
      <Feuille a={h * 0.6} s={-1} t={e} rempli={rempli} contour={contour} />
      <Feuille a={h * 0.8} s={1} t={e * 0.85} rempli={rempli} contour={contour} />
      <Feuille a={h * 0.93} s={-1} t={e * 0.75} rempli={rempli} contour={contour} />
    </g>
  );
};

/* ------------------------------------------------------------------ Ouverture ------------------------------------------------------------------ */

/** Dix épis s'alignent, le dixième s'élève, une pièce tombe dans le thermomètre. */
const IlluEpis: React.FC<PropsIllustration> = ({ f }) => {
  const SOL = 800;
  const X = (i: number) => 42 + i * 59;
  const monte = p(f, 108, 140);
  const glisse = p(f, 122, 158);
  const halo = p(f, 146, 176);
  const chute = p(f, 158, 196);
  const niveau = 0.08 + 0.16 * p(f, 192, 228);
  const xD = mix(X(9), 300, glisse);
  const yD = mix(SOL, 420, monte);
  return (
    <Scene>
      <line x1={8} x2={612} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} strokeLinecap="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const a = 6 + i * 9;
        return <Epi key={i} x={X(i)} y={SOL} h={330} feuille={0.7} g={p(f, a, a + 18)} incl={Math.sin(f / 26 + i) * 0.8} />;
      })}
      <g opacity={halo}>
        <circle cx={300} cy={260} r={150} fill={F.orClair} opacity={0.34} />
        <Rayons x={300} y={260} r={162} l={36 * halo} n={16} de={11} o={0.9} />
      </g>
      <Epi x={xD} y={yD} h={330} feuille={0.7} g={p(f, 87, 105)} rempli={F.orClair} />
      <Thermometre x={700} y={170} h={500} l={62} niveau={niveau} />
      {chute < 1 ? <Piece x={700} y={-50 + chute * 205} r={38} opacite={chute > 0 ? 1 : 0} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 2 ------------------------------------------------------------------ */

const ROUTE_G = parcours(echant((t) => bez2({ x: 110, y: 140 }, { x: 140, y: 430 }, { x: 365, y: 510 }, t)));
const ROUTE_D = parcours(echant((t) => bez2({ x: 690, y: 140 }, { x: 660, y: 430 }, { x: 435, y: 510 }, t)));

const Route: React.FC<{ d: string }> = ({ d }) => (
  <g>
    <path d={d} fill="none" stroke={F.encre2} strokeWidth={60} strokeLinecap="butt" />
    <path d={d} fill="none" stroke={F.papier} strokeWidth={53} strokeLinecap="butt" />
    <path d={d} fill="none" stroke={F.filet} strokeWidth={4} strokeDasharray="20 18" />
  </g>
);

/** Les paquets s'ajoutent le long de « donner », du côté extérieur : la route reste libre. */
const PAQUETS: Pt[] = [{ x: 716, y: 430 }, { x: 668, y: 540 }, { x: 620, y: 650 }];

const Paquet: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g opacity={o} transform={`translate(${x} ${y})`}>
    <rect x={-65} y={-34} width={130} height={68} rx={6} fill={F.orClair} stroke={F.encre} strokeWidth={3.5} />
    <path d="M0 -34 C-26 -62 -46 -40 0 -34 C46 -40 26 -62 0 -34 Z" fill={F.argile} stroke={F.encre} strokeWidth={2.5} />
    <Libelle x={0} y={8} taille={23} graisse={600}>{LIBELLES.chemins.offrandes}</Libelle>
  </g>
);

/** Deux chemins se rejoignent en une seule flèche ; sur « donner », les offrandes s'ajoutent. */
const IlluChemins: React.FC<PropsIllustration> = ({ f, d }) => {
  const tracePayer = p(f, d[0] - 25, d[0] + 45);
  const fleche = p(f, d[1], d[1] + 55);
  const traceDonner = p(f, d[2], d[2] + 60);
  const coeur = p(f, d[3] + 200, d[3] + 225);
  const battement = 1 + Math.sin(f / 9) * 0.07;
  const flot = (route: typeof ROUTE_G, debut: number, fin: number) =>
    Array.from({ length: 5 }, (_, k) => {
      if (f < debut) return null;
      const t = (((f - debut) / 150 + k / 5) % 1);
      const q = route.point(t);
      const age = lin(f, debut, debut + 150);
      if (age < 1 && t > age) return null;
      return <Piece key={k} x={q.x} y={q.y} r={20} opacite={Math.min(1, t / 0.07, (1 - t) / 0.07) * fin} />;
    });
  return (
    <Scene>
      <clipPath id="ch12-p2-fleche">
        <rect x={0} y={470} width={800} height={400 * fleche} />
      </clipPath>
      <Route d={ROUTE_G.trace(tracePayer)} />
      {traceDonner > 0 ? <Route d={ROUTE_D.trace(traceDonner)} /> : null}
      {flot(ROUTE_G, d[0] + 10, 1)}
      {flot(ROUTE_D, d[2] + 40, 1)}
      <Libelle x={110} y={92} taille={38} graisse={600} opacite={p(f, d[0] - 25, d[0])}>{LIBELLES.chemins.payer}</Libelle>
      <Libelle x={690} y={92} taille={38} graisse={600} opacite={p(f, d[2], d[2] + 25)}>{LIBELLES.chemins.donner}</Libelle>
      {LIBELLES.principes.map((m, i) => {
        const a = d[1] + 30 + i * 80;
        return <Libelle key={m} x={400} y={120 + i * 50} taille={25} couleur={F.orFonce} opacite={p(f, a, a + 22)}>{m}</Libelle>;
      })}
      <g clipPath="url(#ch12-p2-fleche)">
        <path d="M305 480 H495 V716 H575 L400 860 L225 716 H305 Z" fill={F.or} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <Libelle x={400} y={612} taille={44} graisse={600}>{LIBELLES.chemins.dime}</Libelle>
        {[0, 1].map((k) => {
          const y = 690 + (((f / 40 + k / 2) % 1) * 90);
          return <path key={k} d={`M340 ${y} L400 ${y + 36} L460 ${y} `} fill="none" stroke={F.orClair} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={Math.min(1, (780 - y) / 30) * lin(f, d[2], d[2] + 60)} />;
        })}
      </g>
      {PAQUETS.map((s, i) => {
        const a = d[3] + 20 + i * 75;
        const q = p(f, a, a + 32);
        return <Paquet key={i} x={s.x + (1 - q) * 46} y={s.y + (1 - q) * 34} o={q} />;
      })}
      {coeur > 0 ? <Coeur x={742} y={628} s={0.62 * coeur * battement} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 3 ------------------------------------------------------------------ */

const TAILLE_MOT = 170;
/** Largeurs des lettres de Fraunces 500 à cette taille (mesurées sur les images de contrôle). */
const LARG = { m: 152, a: 92, s: 77, e: 90, r: 72, o: 98, h: 104 };
/** Position de la lettre (bord gauche) dans un mot centré sur 400. */
const placer = (mot: (keyof typeof LARG)[]) => {
  const total = mot.reduce((s, l) => s + LARG[l], 0);
  let x = 400 - total / 2;
  return mot.map((l) => {
    const r = x;
    x += LARG[l];
    return r;
  });
};
const LMAASER = placer(['m', 'a', 'a', 's', 'e', 'r']);
const LASER = placer(['a', 's', 'e', 'r']);
const LOSHER = placer(['o', 's', 'h', 'e', 'r']);

const Lettre: React.FC<{ x: number; o?: number; sx?: number; children: React.ReactNode }> = ({ x, o = 1, sx = 1, children }) => (
  <text transform={`translate(${x} 410) scale(${sx} 1)`} textAnchor="start" fontFamily={PoliceF.serif} fontSize={TAILLE_MOT} fontWeight={500} fill={F.encre} opacity={o}>
    {children}
  </text>
);

const EPIS_MOT = [
  { x: 42, h: 620, e: 1.05, r: 0.1 }, { x: 100, h: 500, e: 0.95, r: 0.0 }, { x: 700, h: 500, e: 0.95, r: 0.05 }, { x: 758, h: 620, e: 1.05, r: 0.15 },
  { x: 160, h: 290, e: 0.9, r: 0.3 }, { x: 640, h: 290, e: 0.9, r: 0.35 }, { x: 220, h: 270, e: 0.85, r: 0.45 }, { x: 580, h: 270, e: 0.85, r: 0.5 },
  { x: 280, h: 250, e: 0.8, r: 0.6 }, { x: 520, h: 250, e: 0.8, r: 0.65 }, { x: 340, h: 235, e: 0.75, r: 0.75 }, { x: 460, h: 235, e: 0.75, r: 0.8 }, { x: 400, h: 225, e: 0.75, r: 0.9 },
];

/** « maaser » perd son préfixe, devient « osher », et les épis poussent autour. */
const IlluMot: React.FC<PropsIllustration> = ({ f, d }) => {
  const sort = p(f, d[1] - 20, d[1] + 28);
  const vers = p(f, d[1] + 5, d[1] + 40); // aser se recentre
  const change = p(f, d[1] + 35, d[1] + 110); // aser → osher
  const dixieme = p(f, d[0], d[0] + 25) * (1 - p(f, d[1] - 20, d[1]));
  const richesse = p(f, d[1] + 80, d[1] + 110);
  const cadre = p(f, d[2], d[2] + 40);
  const fin = p(f, d[3], d[3] + 40);
  const pos = (i: number, ia: number, io: number) => mix(mix(LMAASER[i], LASER[ia], vers), LOSHER[io], change);
  return (
    <Scene>
      <clipPath id="ch12-p3-image"><rect x={0} y={0} width={800} height={900} /></clipPath>
      <line x1={0} x2={800} y1={866} y2={866} stroke={F.encre} strokeWidth={4} opacity={p(f, d[1], d[1] + 30)} />
      {EPIS_MOT.map((e, i) => {
        const a = d[1] + 30 + e.r * (d[3] - d[1]);
        return <Epi key={i} x={e.x} y={866} h={e.h} e={e.e} feuille={0.75} g={p(f, a, a + 110)} incl={Math.sin(f / 30 + i * 1.7) * 1.1} rempli={i % 2 ? F.or : F.orClair} />;
      })}
      <g opacity={cadre}>
        <rect x={134} y={190} width={532} height={330} rx={26} fill={F.papier} stroke={fin > 0 ? F.or : F.encre} strokeWidth={4 + 4 * fin} />
        <rect x={322} y={166} width={156} height={48} rx={8} fill={F.parchemin} stroke={fin > 0 ? F.or : F.encre} strokeWidth={3} />
        <Libelle x={400} y={200} taille={30} graisse={600}>{LIBELLES.mot.dime}</Libelle>
      </g>
      <g clipPath="url(#ch12-p3-image)">
        <Lettre x={LMAASER[0] - sort * 460} o={1 - lin(sort, 0.55, 0.98)}>{LIBELLES.mot.ma}</Lettre>
      </g>
      <Lettre x={pos(2, 0, 0)} o={1 - change}>{LIBELLES.mot.a}</Lettre>
      <Lettre x={pos(2, 0, 0)} o={change}>{LIBELLES.mot.o}</Lettre>
      <Lettre x={pos(3, 1, 1)}>{LIBELLES.mot.s}</Lettre>
      <Lettre x={LOSHER[2]} o={lin(change, 0.25, 0.9)} sx={0.3 + 0.7 * change}>{LIBELLES.mot.h}</Lettre>
      <Lettre x={pos(4, 2, 3)}>{LIBELLES.mot.e}</Lettre>
      <Lettre x={pos(5, 3, 4)}>{LIBELLES.mot.r}</Lettre>
      <Libelle x={400} y={480} taille={34} couleur={F.encre2} opacite={dixieme}>{LIBELLES.mot.dixieme}</Libelle>
      <Libelle x={400} y={480} taille={34} couleur={F.orFonce} graisse={600} opacite={richesse}>{LIBELLES.mot.richesse}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 4 ------------------------------------------------------------------ */

const RACINES = [
  'M400 535 C396 620 410 700 398 845',
  'M380 530 C340 590 260 590 175 660',
  'M420 530 C460 590 540 590 625 660',
  'M372 525 C300 545 200 540 90 590',
  'M428 525 C500 545 600 540 710 590',
  'M394 600 C360 670 320 700 270 770',
  'M406 610 C440 680 480 700 530 770',
  'M260 588 C240 620 225 660 215 720',
  'M540 588 C560 620 575 660 585 720',
];
type Branche = { a: Pt; b: Pt; c: Pt; e: Pt; l: number };
const BR = (a: number[], b: number[], c: number[], e: number[], l: number): Branche => ({ a: { x: a[0], y: a[1] }, b: { x: b[0], y: b[1] }, c: { x: c[0], y: c[1] }, e: { x: e[0], y: e[1] }, l });
const BRANCHES: Branche[] = [
  BR([386, 350], [350, 280], [270, 240], [150, 205], 22),
  BR([414, 350], [450, 280], [530, 240], [650, 205], 22),
  BR([400, 300], [396, 240], [404, 170], [398, 92], 20),
  BR([398, 250], [370, 200], [330, 160], [272, 118], 12),
  BR([402, 240], [430, 200], [470, 160], [528, 118], 12),
  BR([300, 264], [260, 252], [200, 264], [118, 300], 11),
  BR([500, 264], [540, 252], [600, 264], [682, 300], 11),
  BR([261, 245], [240, 200], [210, 164], [168, 134], 9),
  BR([539, 245], [560, 200], [590, 164], [632, 134], 9),
];
const dBranche = (b: Branche) => `M${b.a.x} ${b.a.y} C${b.b.x} ${b.b.y} ${b.c.x} ${b.c.y} ${b.e.x} ${b.e.y}`;
const TRONC = 'M338 532 C366 480 376 410 378 318 C380 286 392 268 400 262 C408 268 420 286 422 318 C424 410 434 480 462 532 Z';
/** Les feuilles sont réparties le long des branches, alternées de part et d'autre. */
const FEUILLES = BRANCHES.flatMap((b, i) =>
  [0.42, 0.56, 0.7, 0.84, 1].map((t, k) => {
    const q = bez3(b.a, b.b, b.c, b.e, t);
    const r = bez3(b.a, b.b, b.c, b.e, Math.max(0, t - 0.04));
    const ang = (Math.atan2(q.y - r.y, q.x - r.x) * 180) / Math.PI;
    return { x: q.x, y: q.y, ang: t === 1 ? ang : ang + (k % 2 ? 42 : -42), i: i * 5 + k };
  }),
);

/** `xRepos` : la pointe au sol ; `incl` : l'inclinaison couchée ; `xMot`, `yMot` : le mot une fois la flèche au repos. */
type DefFleche = { mot: string; L: number; sens: 1 | -1; yVol: number; xImpact: number; xRepos: number; incl: number; xMot: number; yMot: number; a: number };

/** Une flèche vient buter contre le tronc et retombe au sol. */
const FlecheButee: React.FC<{ f: number; c: DefFleche }> = ({ f, c }) => {
  const arrive = c.a + 28;
  const recul = arrive + 10;
  const pose = arrive + 42;
  const vol = lin(f, c.a, arrive);
  if (f < c.a) return null;
  const SOL = 518;
  let x: number;
  let y: number;
  let r = 0;
  let t = 0;
  if (f < arrive) {
    x = mix(c.xImpact - c.sens * 240, c.xImpact, vol * vol);
    y = c.yVol;
  } else {
    t = lin(f, arrive, pose);
    const k = lin(f, arrive, recul);
    x = t < 1 ? mix(c.xImpact - c.sens * 34 * k, c.xRepos, t) : c.xRepos;
    y = mix(c.yVol, SOL, t * t);
    r = c.sens * (-28 * Math.sin(t * Math.PI) + c.incl * t);
  }
  const eclat = lin(f, arrive, arrive + 16);
  return (
    <g>
      <g opacity={Math.min(1, vol * 4)} transform={`translate(${x} ${y}) rotate(${r}) scale(${c.sens} 1)`}>
        <line x1={-c.L} x2={-20} y1={0} y2={0} stroke={F.encre} strokeWidth={7} strokeLinecap="round" />
        <path d="M0 0 L-28 -14 L-22 0 L-28 14 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
        <path d={`M${-c.L} 0 l-12 -11 m12 11 l-12 11 M${-c.L + 12} 0 l-12 -11 m12 11 l-12 11`} stroke={F.encre} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>
      <g opacity={Math.min(1, vol * 4)} transform={`translate(${mix(x - (c.sens * (c.L + 14)) / 2, c.xMot, t)} ${mix(y - 22, c.yMot, t)}) rotate(${r * (1 - t)})`}>
        <Libelle x={0} y={0} taille={23} graisse={600} couleur={F.encre}>{c.mot}</Libelle>
      </g>
      {eclat > 0 && eclat < 1 ? <Rayons x={c.xImpact} y={c.yVol} r={8 + 16 * eclat} l={20} n={7} de={c.sens > 0 ? 110 : -70} a={140} o={1 - eclat} ep={5} /> : null}
    </g>
  );
};

/** L'arbre coupé par le sol : la lumière monte de la racine aux branches, les flèches retombent. */
const IlluArbre: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const L0 = d[1] - d[0];
  const SOL = 524;
  // La lumière monte d'abord dans la racine, puis du sol jusqu'aux branches.
  const yL = f < d[0] + L0 * 0.42 ? mix(860, SOL, p(f, d[0] + 10, d[0] + L0 * 0.42)) : mix(SOL, 60, p(f, d[0] + L0 * 0.5, d[1] - 10));
  const racine = p(f, d[0] + 10, d[0] + 40);
  const branches = p(f, d[1] - 40, d[1]);
  const part = p(f, d[1], d[1] + 30);
  const pulse = 0.5 + 0.5 * Math.sin((f - d[1]) / 14);
  const fDebut = d[3] + 20;
  const pasF = (duree - 40 - fDebut - 70) / 2;
  const FLECHES: DefFleche[] = [
    { mot: LIBELLES.arbre.diable, L: 120, sens: 1, yVol: 372, xImpact: 366, xRepos: 130, incl: 30, xMot: 80, yMot: 432, a: fDebut },
    { mot: LIBELLES.arbre.maladies, L: 140, sens: 1, yVol: 395, xImpact: 366, xRepos: 306, incl: 12, xMot: 235, yMot: 462, a: fDebut + pasF },
    { mot: LIBELLES.arbre.maledictions, L: 200, sens: -1, yVol: 410, xImpact: 434, xRepos: 500, incl: 14, xMot: 590, yMot: 456, a: fDebut + pasF * 2 },
  ];
  return (
    <Scene>
      <clipPath id="ch12-p4-lumiere"><rect x={0} y={yL} width={800} height={900} /></clipPath>
      <clipPath id="ch12-p4-sol"><path d="M0 0 H800 V524 Q600 534 400 524 T0 524 Z" /></clipPath>
      {/* L'arbre éteint : contours d'abord, puis la matière, pour que le tronc et les branches ne fassent qu'un. */}
      {BRANCHES.map((b, i) => <path key={i} d={dBranche(b)} fill="none" stroke={F.encre} strokeWidth={b.l + 7} strokeLinecap="round" />)}
      <path d={TRONC} fill={F.encre} stroke={F.encre} strokeWidth={7} strokeLinejoin="round" />
      {BRANCHES.map((b, i) => <path key={i} d={dBranche(b)} fill="none" stroke={F.cuirClair} strokeWidth={b.l} strokeLinecap="round" />)}
      <path d={TRONC} fill={F.cuirClair} />
      {/* La terre. */}
      <path d="M0 524 Q200 514 400 524 T800 524 V872 H0 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {[[70, 700], [170, 770], [700, 720], [590, 780], [330, 840], [480, 845]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={13 + (i % 3) * 5} ry={7 + (i % 2) * 3} fill={F.cuirClair} />
      ))}
      {RACINES.map((r, i) => <path key={i} d={r} fill="none" stroke={F.filet} strokeWidth={i < 5 ? 11 : 7} strokeLinecap="round" />)}
      {/* La même forme en or, révélée de bas en haut. */}
      <g clipPath="url(#ch12-p4-lumiere)" opacity={racine}>
        <g clipPath="url(#ch12-p4-sol)">
          {BRANCHES.map((b, i) => <path key={i} d={dBranche(b)} fill="none" stroke={F.or} strokeWidth={b.l} strokeLinecap="round" />)}
          <path d={TRONC} fill={F.or} />
          <path d="M400 512 C397 450 402 390 400 300" fill="none" stroke={F.orClair} strokeWidth={9} strokeLinecap="round" />
        </g>
        {RACINES.map((r, i) => <path key={i} d={r} fill="none" stroke={F.orClair} strokeWidth={i < 5 ? 11 : 7} strokeLinecap="round" />)}
      </g>
      {/* Les feuilles : le reste devient saint. */}
      {FEUILLES.map((q) => {
        const a = d[2] + 10 + hasard(q.i) * (d[3] - d[2] - 40);
        const g = p(f, a, a + 26);
        if (g <= 0) return null;
        return <path key={q.i} transform={`translate(${q.x} ${q.y}) rotate(${q.ang}) scale(${g})`} d="M0 0 C10 -13 26 -13 38 0 C26 13 10 13 0 0 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={2.5} strokeLinejoin="round" />;
      })}
      <Libelle x={120} y={838} taille={30} graisse={600} couleur={F.papier} opacite={racine}>{LIBELLES.arbre.racine}</Libelle>
      <Libelle x={668} y={838} taille={30} graisse={600} couleur={F.orClair} opacite={part * (0.8 + 0.2 * pulse)}>{LIBELLES.arbre.part}</Libelle>
      <Libelle x={668} y={62} taille={28} graisse={600} opacite={branches}>{LIBELLES.arbre.branches}</Libelle>
      {FLECHES.map((c) => <FlecheButee key={c.mot} f={f} c={c} />)}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 5 ------------------------------------------------------------------ */

const CHEMIN_COUPE = parcours([
  { x: 66, y: 270 },
  { x: 390, y: 270 },
  ...echant((t) => bez3({ x: 390, y: 270 }, { x: 530, y: 270 }, { x: 530, y: 480 }, { x: 390, y: 480 }, t), 26).slice(1),
  ...echant((t) => bez2({ x: 390, y: 480 }, { x: 330, y: 480 }, { x: 330, y: 590 }, t), 14).slice(1),
]);

const CX = 330;
const BOL = `M${CX - 112} 610 C${CX - 112} 700 ${CX - 60} 750 ${CX} 750 C${CX + 60} 750 ${CX + 112} 700 ${CX + 112} 610 Z`;

/** La flèche se détourne de l'église et revient remplir la coupe. */
const IlluCoupe: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const trace = mix(0, 0.46, p(f, d[0] - 10, d[0] + 75)) + 0.54 * p(f, d[0] + 90, d[1] + 75);
  const q = CHEMIN_COUPE.point(trace);
  const niveau = p(f, d[1] + 70, d[1] + 180);
  const brille = p(f, d[1] + 170, d[1] + 215);
  const deborde = p(f, d[1] + 175, duree - 40);
  const hauteur = 140 * niveau;
  const eglise = p(f, 0, 24);
  return (
    <Scene>
      <clipPath id="ch12-p5-bol"><path d={BOL} /></clipPath>
      {/* L'église */}
      <g opacity={eglise}>
        <path d="M665 34 V92 M644 56 H686" stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
        <path d="M665 92 L772 214 H558 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
        <rect x={576} y={214} width={178} height={236} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
        <path d="M635 450 V372 Q635 342 665 342 Q695 342 695 372 V450 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <path d="M605 306 V272 Q605 256 618 256 Q631 256 631 272 V306 Z M699 306 V272 Q699 256 712 256 Q725 256 725 272 V306 Z" fill={F.orClair} stroke={F.encre} strokeWidth={3} />
        <Libelle x={665} y={498} taille={32} graisse={600}>{LIBELLES.coupe.eglise}</Libelle>
      </g>
      {/* Lumière autour de la coupe */}
      <g opacity={brille}>
        <circle cx={CX} cy={680} r={150} fill={F.orClair} opacity={0.32} />
        <Rayons x={CX} y={680} r={166} l={26 + 7 * Math.sin(f / 12)} n={11} de={165} a={210} o={0.9} />
      </g>
      {/* La flaque */}
      <ellipse cx={CX} cy={850} rx={40 + 190 * deborde} ry={4 + 15 * deborde} fill={F.or} stroke={F.orFonce} strokeWidth={3} opacity={deborde > 0 ? 1 : 0} />
      {/* Le pied et la coupe */}
      <path d={`M${CX - 16} 748 C${CX - 12} 790 ${CX - 20} 815 ${CX - 66} 838 H${CX + 66} C${CX + 20} 815 ${CX + 12} 790 ${CX + 16} 748 Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <path d={BOL} fill={F.papier} />
      <g clipPath="url(#ch12-p5-bol)">
        <rect x={CX - 120} y={750 - hauteur} width={240} height={hauteur + 4} fill={F.or} />
        <path d={`M${CX - 120} ${752 - hauteur} q30 ${-9 * Math.sin(f / 7)} 60 0 t60 0 t60 0 t60 0`} stroke={F.orClair} strokeWidth={6} fill="none" opacity={niveau > 0 && niveau < 1 ? 1 : 0} />
      </g>
      <path d={BOL} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <ellipse cx={CX} cy={610} rx={112} ry={12} fill={niveau > 0.95 ? F.orClair : F.parchemin} stroke={F.encre} strokeWidth={4} />
      {/* Ce qui déborde */}
      {deborde > 0
        ? [-1, 1].map((s) =>
            Array.from({ length: 4 }, (_, k) => {
              const t = ((f / 44 + k / 4 + (s > 0 ? 0.12 : 0)) % 1);
              return <path key={`${s}${k}`} transform={`translate(${CX + s * 120} ${616 + t * 228}) scale(${0.8 + 0.3 * (k % 2)})`} d="M0 -16 C8 -4 11 2 11 7 A11 11 0 0 1 -11 7 C-11 2 -8 -4 0 -16 Z" fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={Math.min(1, deborde * 6) * Math.min(1, (1 - t) * 10)} />;
            }),
          )
        : null}
      <Libelle x={636} y={700} taille={44} graisse={600} opacite={p(f, d[1] + 20, d[1] + 50)}>{LIBELLES.coupe.peu}</Libelle>
      {/* La flèche dorée */}
      <Piece x={36} y={270} r={30} opacite={p(f, 0, 20)} />
      <path d={CHEMIN_COUPE.trace(trace)} fill="none" stroke={F.encre} strokeWidth={28} strokeLinejoin="round" />
      <path d={CHEMIN_COUPE.trace(trace)} fill="none" stroke={F.or} strokeWidth={21} strokeLinejoin="round" />
      <Pointe x={q.x} y={q.y} angle={q.angle} t={34} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 6 ------------------------------------------------------------------ */

const Graine: React.FC<{ x: number; y: number; s?: number; rempli?: string; incl?: number; o?: number }> = ({ x, y, s = 1, rempli = F.cuirClair, incl = 0, o = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${incl}) scale(${s})`} opacity={o}>
    <path d="M0 -30 C20 -18 24 12 0 30 C-24 12 -20 -18 0 -30 Z" fill={rempli} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
    <path d="M0 -20 C4 -6 4 8 0 20" fill="none" stroke={F.encre} strokeWidth={2} opacity={0.5} />
  </g>
);

/** Une graine quitte la rangée et s'enfonce ; le champ sort de terre à cet endroit, jusqu'aux bords. */
const IlluChamp: React.FC<PropsIllustration> = ({ f, d }) => {
  const L = d[1] - d[0];
  const SOL = 610;
  const A = { x: 100, y: 150 };
  const vol = p(f, d[0] + L * 0.5, d[0] + L * 0.82);
  const enfonce = p(f, d[0] + L * 0.82, d[1] - 5);
  // Elle tombe d'abord à la verticale, puis file sous la rangée sans la croiser.
  const q = bez3(A, { x: 100, y: 430 }, { x: 300, y: 420 }, { x: 400, y: SOL - 26 }, vol);
  const y = q.y + enfonce * 126;
  const rayons = p(f, d[1], d[1] + 40);
  const entree = p(f, 0, 26);
  const reste = p(f, d[0] + L * 0.5, d[0] + L * 0.75);
  const grandit = p(f, d[3], d[3] + 110);
  const fronts = Array.from({ length: 17 }, (_, i) => 32 + i * 46);
  const debutDe = (x: number) => d[1] + 25 + (Math.abs(x - 400) / 385) ** 0.85 * (d[3] - d[1] - 90);
  return (
    <Scene>
      <line x1={190} x2={740} y1={186} y2={186} stroke={F.filet} strokeWidth={4} strokeLinecap="round" opacity={entree} />
      {Array.from({ length: 6 }, (_, i) => <Graine key={i} x={220 + i * 96} y={152} s={1 + 0.1 * reste} o={entree} />)}
      <Libelle x={460} y={88} taille={30} graisse={600} opacite={reste}>{LIBELLES.graine.reste}</Libelle>
      {/* Rang du fond */}
      {fronts.map((x, i) => {
        const xx = x + 23;
        if (xx > 770) return null;
        const a = debutDe(xx) + 22;
        return <Pousse key={i} x={xx} y={SOL + 2} h={(115 + hasard(i + 40) * 55) * (1 + 0.28 * grandit)} e={0.72} g={p(f, a, a + 60)} incl={Math.sin(f / 28 + i) * 1.6} opacite={0.5} />;
      })}
      {/* La terre */}
      <path d={`M0 ${SOL} Q200 ${SOL - 10} 400 ${SOL} T800 ${SOL} V872 H0 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {[[80, 720], [170, 800], [690, 740], [630, 815], [250, 700], [560, 690]].map(([x, yy], i) => (
        <ellipse key={i} cx={x} cy={yy} rx={13 + (i % 3) * 4} ry={7 + (i % 2) * 2} fill={F.cuirClair} />
      ))}
      {/* Les racines qui courent de la graine à chaque pousse */}
      {fronts.map((x, i) => {
        const a = debutDe(x);
        return <path key={i} d={`M400 ${SOL + 96} Q${x} ${SOL + 90} ${x} ${SOL}`} fill="none" stroke={F.orClair} strokeWidth={3} pathLength={1} strokeDasharray={`${p(f, a - 20, a + 10)} 1`} opacity={0.85} />;
      })}
      {/* Rang de devant */}
      {fronts.map((x, i) => {
        const a = debutDe(x);
        return <Pousse key={i} x={x} y={SOL + 2} h={(150 + hasard(i) * 65) * (1 + 0.3 * grandit)} e={0.82} g={p(f, a, a + 55)} incl={Math.sin(f / 24 + i * 1.3) * 1.8} />;
      })}
      {/* La graine */}
      <g opacity={rayons}>
        <circle cx={400} cy={SOL + 100} r={46} fill={F.orClair} opacity={0.35} />
        <Rayons x={400} y={SOL + 100} r={50} l={18 + 6 * Math.sin(f / 10)} n={12} de={15} o={0.9} couleur={F.orClair} ep={5} />
      </g>
      <Graine x={q.x} y={y} rempli={F.orClair} s={1.08} incl={vol * 8} />
      <Libelle x={A.x} y={88} taille={30} graisse={600} opacite={entree * (1 - p(f, d[0] + L * 0.5, d[0] + L * 0.55))}>{LIBELLES.graine.premier}</Libelle>
      <Libelle x={400} y={SOL + 208} taille={30} graisse={600} couleur={F.papier} opacite={p(f, d[1] - 20, d[1] + 10)}>{LIBELLES.graine.premier}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 7 ------------------------------------------------------------------ */

const H_APEX = 112;
const H_AVANT = 424;
const H_BAS = 696;
const D_TOIT = 240;
const D_MUR = 190;
const PAS_RANG = 40;
const PORTE = { x: 348, y: 536, w: 104, h: H_BAS - 536 };
const C_P = LIBELLES.maison.paroles;
const C_B = LIBELLES.maison.benedictions;
const demiLargeur = (y: number) => (y < H_AVANT ? D_TOIT * ((y - H_APEX) / (H_AVANT - H_APEX)) : D_MUR);
const RANGS = (() => {
  const r: { yh: number; yb: number; mots: string[] }[] = [];
  for (let yb = H_BAS; yb > H_APEX + 1; yb -= PAS_RANG) {
    const yh = Math.max(H_APEX, yb - PAS_RANG);
    const dl = demiLargeur((yh + yb) / 2) * 2 - 22;
    const mots: string[] = yb > PORTE.y + 6 ? [C_P, C_P] : dl > 330 ? [C_P, C_B, C_P] : dl > 262 ? [C_B, C_P] : dl > 165 ? [C_B] : dl > 92 ? [C_P] : [];
    r.push({ yh, yb, mots });
  }
  return r;
})();
const LARGEUR_MOT = (m: string) => m.length * 12.6;

/** La maison de paroles sur le parchemin : une pièce tombe, et l'or la remplit trait par trait. */
const IlluMaison: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const chute = p(f, d[1] - 8, d[1] + 26);
  const debutOr = d[1] + 34;
  const finOr = duree - 110;
  const pasOr = (finOr - debutOr) / RANGS.length;
  const pleine = p(f, finOr - 10, finOr + 30);
  const rideau = p(f, 0, 30);
  const contour = `M${400 - D_MUR} ${H_BAS} V${H_AVANT} H${400 - D_TOIT} L400 ${H_APEX} L${400 + D_TOIT} ${H_AVANT} H${400 + D_MUR} V${H_BAS} Z`;
  return (
    <Scene>
      <clipPath id="ch12-p7-maison"><path d={contour} /></clipPath>
      {/* Le parchemin */}
      <g opacity={rideau}>
        <rect x={70} y={44} width={660} height={806} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <rect x={50} y={28} width={700} height={32} rx={16} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <rect x={50} y={836} width={700} height={32} rx={16} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      </g>
      <g opacity={pleine}>
        <Rayons x={400} y={H_APEX} r={14} l={22} n={7} de={-155} a={130} o={0.95} />
      </g>
      {/* Les mots */}
      {RANGS.map((r, i) => {
        const y = (r.yh + r.yb) / 2 + 8;
        const dl = demiLargeur((r.yh + r.yb) / 2);
        const a = d[0] + (RANGS.length - 1 - i) * 13;
        const o = p(f, a, a + 18);
        if (r.yb > PORTE.y + 6) {
          return (
            <g key={i} opacity={o}>
              <Libelle x={400 - (dl + 52) / 2} y={y} taille={24} couleur={F.encre2}>{r.mots[0]}</Libelle>
              <Libelle x={400 + (dl + 52) / 2} y={y} taille={24} couleur={F.encre2}>{r.mots[1]}</Libelle>
            </g>
          );
        }
        const total = r.mots.reduce((s, m) => s + LARGEUR_MOT(m), 0);
        const vide = r.mots.length ? (dl * 2 - 22 - total) / (r.mots.length + 1) : 0;
        let x = 400 - dl + 11 + vide;
        return (
          <g key={i} opacity={o}>
            {r.mots.map((m, k) => {
              const cx = x + LARGEUR_MOT(m) / 2;
              x += LARGEUR_MOT(m) + vide;
              return <Libelle key={k} x={cx} y={y} taille={24} couleur={F.encre2}>{m}</Libelle>;
            })}
          </g>
        );
      })}
      {/* L'or, trait par trait, du bas vers le haut */}
      <g clipPath="url(#ch12-p7-maison)">
        {RANGS.map((r, i) => {
          const a = debutOr + i * pasOr;
          const t = p(f, a, a + pasOr * 1.1);
          if (t <= 0) return null;
          const dl = D_TOIT;
          return <rect key={i} x={400 - dl} y={r.yh - 0.5} width={dl * 2 * t} height={r.yb - r.yh + 1} fill={i % 2 ? F.orClair : F.or} />;
        })}
      </g>
      <path d={contour} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="4 13" strokeLinecap="round" opacity={rideau * (1 - pleine)} />
      <path d={contour} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" opacity={pleine} />
      {/* La porte et les fenêtres */}
      <rect x={PORTE.x} y={PORTE.y} width={PORTE.w} height={PORTE.h} fill={F.papier} opacity={rideau * (1 - pleine)} />
      <rect x={PORTE.x} y={PORTE.y} width={PORTE.w} height={PORTE.h} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="4 13" strokeLinecap="round" opacity={rideau * (1 - pleine)} />
      <g opacity={pleine}>
        <rect x={PORTE.x} y={PORTE.y} width={PORTE.w} height={PORTE.h} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <circle cx={PORTE.x + PORTE.w - 18} cy={PORTE.y + PORTE.h / 2} r={6} fill={F.orClair} />
        {[255, 475].map((x) => (
          <g key={x}>
            <rect x={x} y={452} width={70} height={66} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            <path d={`M${x + 35} 452 V518 M${x} 485 H${x + 70}`} stroke={F.encre} strokeWidth={3} />
          </g>
        ))}
      </g>
      <line x1={120} x2={680} y1={H_BAS + 2} y2={H_BAS + 2} stroke={F.encre} strokeWidth={4} strokeLinecap="round" opacity={rideau} />
      {/* La pièce */}
      <circle cx={400} cy={736} r={36 + 60 * lin(f, d[1] + 22, d[1] + 50)} fill="none" stroke={F.or} strokeWidth={5} opacity={f > d[1] + 22 ? 1 - lin(f, d[1] + 22, d[1] + 50) : 0} />
      {chute > 0 ? <Piece x={400} y={mix(60, 736, chute * chute)} r={32} /> : null}
      <Libelle x={400} y={814} taille={34} graisse={600} couleur={F.orFonce} opacite={pleine}>{LIBELLES.maison.realite}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 8 ------------------------------------------------------------------ */

const ARC_H = parcours(echant((t) => bez3({ x: 240, y: 340 }, { x: 310, y: 170 }, { x: 490, y: 170 }, { x: 556, y: 335 }, t), 50));
const ARC_B = parcours(echant((t) => bez3({ x: 560, y: 560 }, { x: 490, y: 730 }, { x: 310, y: 730 }, { x: 244, y: 565 }, t), 50));

/** Deux mots face à face : la flèche du haut s'allume dans un sens, celle du bas dans l'autre. */
const IlluReversible: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const entree = p(f, d[0] - 25, d[0] + 15);
  const milieu = d[1] + (d[2] - d[1]) * 0.5;
  // Les passages de la lumière : [début, fin, sens]. Sens 1 : béni → dîme, par le haut. Sens -1 : dîme → béni, par le bas.
  const passages: [number, number, 1 | -1][] = [
    [d[0] + 22, d[0] + 65, 1],
    [d[0] + 65, d[1] - 2, -1],
    [d[1] + 5, milieu - 5, 1],
    [milieu, d[2] - 5, -1],
  ];
  const nb = 4;
  const fin3 = duree - 40;
  const pas3 = (fin3 - d[2]) / nb;
  for (let i = 0; i < nb; i++) passages.push([d[2] + i * pas3, d[2] + (i + 1) * pas3, i % 2 ? -1 : 1]);
  const actif = passages.find(([a, b]) => f >= a && f < b);
  const dernier = f >= fin3;
  const v = p(f, d[1] + 5, d[1] + 25) * (1 - p(f, d[2] - 15, d[2] + 5));
  const quatre = p(f, d[2], d[2] + 25);
  const anneau = (sens: 1 | -1) => {
    // Le mot qui vient de recevoir la lumière s'éclaire.
    let v2 = 0;
    for (const [, b, s] of passages) if (s === sens) v2 = Math.max(v2, 1 - Math.min(1, Math.abs(f - b) / 24));
    return v2;
  };
  const Arc: React.FC<{ a: typeof ARC_H; sens: 1 | -1 }> = ({ a, sens }) => {
    const on = actif && actif[2] === sens;
    const t = on ? lin(f, actif[0], actif[1]) : 0;
    const ext = a.point(1);
    const lumiere = dernier ? 1 : on ? Math.min(1, t * 5, (1 - t) * 10) : 0;
    const q = a.point(t);
    return (
      <g>
        <path d={a.trace(1)} fill="none" stroke={F.encre} strokeWidth={19} strokeLinecap="round" />
        <path d={a.trace(1)} fill="none" stroke={F.filet} strokeWidth={12} strokeLinecap="round" />
        <path d={a.trace(1)} fill="none" stroke={F.or} strokeWidth={12} strokeLinecap="round" opacity={lumiere} />
        <Pointe x={ext.x} y={ext.y} angle={ext.angle} t={30} couleur={on || dernier ? F.or : F.filet} />
        {on ? <Piece x={q.x} y={q.y} r={27} /> : null}
      </g>
    );
  };
  const Medaillon: React.FC<{ x: number; mot: string; eclat: number }> = ({ x, mot, eclat }) => (
    <g>
      <circle cx={x} cy={450} r={124 + eclat * 10} fill={F.orClair} opacity={eclat * 0.8} />
      <circle cx={x} cy={450} r={118} fill={F.papier} stroke={eclat > 0.02 ? F.or : F.encre} strokeWidth={5 + 3 * eclat} />
      <text x={x} y={472} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={68} fontWeight={500} fill={F.encre}>{mot}</text>
    </g>
  );
  return (
    <Scene>
      <g opacity={entree}>
        <Arc a={ARC_H} sens={1} />
        <Arc a={ARC_B} sens={-1} />
        <Medaillon x={158} mot={LIBELLES.reversible.beni} eclat={anneau(-1)} />
        <Medaillon x={642} mot={LIBELLES.reversible.dime} eclat={anneau(1)} />
      </g>
      <Libelle x={400} y={178} taille={30} graisse={600} opacite={v}>{LIBELLES.reversible.v1}</Libelle>
      <Libelle x={400} y={752} taille={30} graisse={600} opacite={v}>{LIBELLES.reversible.v6}</Libelle>
      <Libelle x={146} y={282} taille={30} graisse={600} opacite={quatre}>{LIBELLES.reversible.parle}</Libelle>
      <Libelle x={642} y={282} taille={30} graisse={600} opacite={quatre}>{LIBELLES.reversible.reponds}</Libelle>
      <Libelle x={124} y={640} taille={30} graisse={600} opacite={quatre}>{LIBELLES.reversible.repond}</Libelle>
      <Libelle x={642} y={622} taille={30} graisse={600} opacite={quatre}>{LIBELLES.reversible.donnes}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 9 ------------------------------------------------------------------ */

const PAIN = 'M-146 42 C-162 -18 -102 -74 0 -74 C102 -74 162 -18 146 42 C142 62 -142 62 -146 42 Z';
const CASSURE = 'L-10 -48 L12 -24 L-10 2 L10 26 L-6 60';

const MoitiePain: React.FC<{ s: 1 | -1; ecart: number; id: string }> = ({ s, ecart, id }) => (
  <g transform={`translate(${s * ecart * 70} ${ecart * 6}) rotate(${s * ecart * 11})`}>
    <clipPath id={id}>
      <path d={s < 0 ? `M-200 -100 L8 -100 L8 -74 ${CASSURE} L-6 100 L-200 100 Z` : `M200 -100 L8 -100 L8 -74 ${CASSURE} L-6 100 L200 100 Z`} />
    </clipPath>
    <g clipPath={`url(#${id})`}>
      <path d={PAIN} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[-90, -40, 40, 90].map((x) => (
        <path key={x} d={`M${x - 16} -40 Q${x} -12 ${x + 8} 10`} fill="none" stroke={F.orClair} strokeWidth={7} strokeLinecap="round" />
      ))}
    </g>
    <path d={`M8 -74 ${CASSURE}`} fill="none" stroke={F.orClair} strokeWidth={ecart > 0 ? 9 : 0} strokeLinejoin="round" />
    <path d={`M8 -74 ${CASSURE}`} fill="none" stroke={F.encre} strokeWidth={ecart > 0 ? 2.5 : 0} strokeLinejoin="round" transform={`translate(${s * 4} 0)`} />
  </g>
);

/** Le pain se rompt ; une pièce se pose devant la porte, qui s'entrouvre sur la lumière. */
const IlluPorte: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 26);
  const apparait = p(f, d[0], d[0] + 30);
  // « La dîme est un culte » : la pièce s'élève pendant toute la phrase, les rayons s'ouvrent en éventail.
  const leve = p(f, d[0], d[1] - 8);
  // « dire à Dieu combien il est grand » : autour de la pièce qui ne change pas, la lumière s'agrandit.
  const L1 = d[2] - d[1];
  const grandit = p(f, d[1], d[2] - 10);
  const grand = p(f, d[1] + L1 * 0.5, d[1] + L1 * 0.5 + 30) * (1 - p(f, d[2] - 12, d[2] + 10));
  const L3 = d[4] - d[3];
  const rupture = p(f, d[3] + 15, d[3] + 60);
  const motMort = p(f, d[3] + 50, d[3] + 75);
  const vers = p(f, d[2] + 40, d[3] + L3 * 0.5);
  const ouvre = p(f, d[3] + L3 * 0.55, d[4] + 10);
  const lumiere = p(f, d[3] + L3 * 0.62, d[4] + 40);
  const vivant = p(f, d[3] + L3 * 0.68, d[3] + L3 * 0.68 + 30);
  const C0 = { x: 215, y: mix(330, 185, leve) + Math.sin(f / 18) * 5 * leve };
  const C2 = { x: 610, y: 760 };
  const c = vers > 0 ? bez2(C0, { x: 520, y: 150 }, C2, vers) : C0;
  // La porte : dans un encadrement cintré, ouverte de gauche à droite, charnière côté droit.
  const X0 = 490;
  const X1 = 730;
  const HAUT = 250;
  const BAS = 720;
  const largeur = X1 - X0;
  const ech = 1 - 0.52 * ouvre;
  const cadre = `M${X0} ${BAS} V${HAUT + largeur / 2} A${largeur / 2} ${largeur / 2} 0 0 1 ${X1} ${HAUT + largeur / 2} V${BAS} Z`;
  const fente = X1 - largeur * ech;
  return (
    <Scene>
      <clipPath id="ch12-p9-cadre"><path d={cadre} /></clipPath>
      <line x1={30} x2={770} y1={BAS + 74} y2={BAS + 74} stroke={F.encre} strokeWidth={4} strokeLinecap="round" opacity={entree} />
      {/* Les rayons du haut, derrière l'encadrement */}
      <g opacity={lumiere}>
        <Rayons x={(X0 + X1) / 2} y={HAUT + largeur / 2} r={largeur / 2 + 22} l={26 * lumiere} n={7} de={-150} a={120} o={0.9} />
      </g>
      {/* La porte */}
      <g opacity={entree}>
        <path d={cadre} fill={F.encre} />
        <path d={cadre} fill={F.orClair} opacity={lumiere} />
        <g clipPath="url(#ch12-p9-cadre)">
          <g transform={`translate(${X1} 0) scale(${ech} 1) translate(${-X1} 0)`}>
            <path d={cadre} fill={F.cuir} />
            {[0.25, 0.5, 0.75].map((k) => <line key={k} x1={X0 + largeur * k} x2={X0 + largeur * k} y1={HAUT - 10} y2={BAS} stroke={F.encre} strokeWidth={4} />)}
            <path d={`M${X0} 440 H${X1} M${X0} 610 H${X1}`} stroke={F.orFonce} strokeWidth={12} />
            <circle cx={X0 + 32} cy={520} r={13} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
          </g>
        </g>
        <path d={cadre} fill="none" stroke={F.encre} strokeWidth={9} strokeLinejoin="round" />
        <path d={`M${X0 - 22} ${BAS + 34} H${X1 + 22} V${BAS + 74} H${X0 - 22} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <path d={`M${X0 - 10} ${BAS} H${X1 + 10} V${BAS + 34} H${X0 - 10} Z`} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      </g>
      {/* Les rayons qui sortent par l'ouverture */}
      {lumiere > 0 ? (
        <g opacity={lumiere}>
          {Array.from({ length: 8 }, (_, i) => {
            const y = HAUT + 110 + i * 48;
            const ang = ((180 + (i - 3.5) * 9) * Math.PI) / 180;
            const l = (fente - 8 - (X0 - 62)) * (0.86 + 0.14 * Math.sin(f / 13 + i)) * lumiere;
            return <line key={i} x1={fente - 10} y1={y} x2={fente - 10 + Math.cos(ang) * l} y2={y + Math.sin(ang) * l} stroke={F.or} strokeWidth={7} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
      {/* Le pain */}
      <g transform="translate(190 640) scale(0.85)" opacity={entree}>
        <ellipse cx={0} cy={60} rx={190} ry={18} fill={F.filet} stroke={F.encre} strokeWidth={3.5} />
        {rupture > 0 ? (
          <>
            <MoitiePain s={-1} ecart={rupture} id="ch12-p9-g" />
            <MoitiePain s={1} ecart={rupture} id="ch12-p9-d" />
          </>
        ) : (
          <g>
            <path d={PAIN} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            {[-90, -40, 40, 90].map((x) => (
              <path key={x} d={`M${x - 16} -40 Q${x} -12 ${x + 8} 10`} fill="none" stroke={F.orClair} strokeWidth={7} strokeLinecap="round" />
            ))}
          </g>
        )}
        {rupture > 0
          ? Array.from({ length: 6 }, (_, i) => {
              const t = lin(f, d[3] + 20 + i * 2, d[3] + 62 + i * 2);
              return <circle key={i} cx={(i - 2.5) * 12 * (0.4 + t)} cy={-20 + t * 70 + (i % 2) * 6} r={3 + (i % 3)} fill={F.cuirClair} stroke={F.encre} strokeWidth={1} opacity={t > 0 ? 1 : 0} />;
            })
          : null}
      </g>
      <Libelle x={190} y={766} taille={34} graisse={600} opacite={motMort}>{LIBELLES.culte.mort}</Libelle>
      <Libelle x={215} y={332} taille={27} graisse={600} couleur={F.orFonce} opacite={grand}>{LIBELLES.culte.grand}</Libelle>
      {/* La pièce */}
      <g opacity={leve * (1 - vers) * 0.9}>
        <circle cx={C0.x} cy={C0.y} r={mix(78, 128, grandit)} fill={F.orClair} opacity={0.35} />
        {/* Trois ondes montent de la pièce vers le haut, comme une parole adressée. */}
        {[0, 1, 2].map((k) => {
          const t = ((Math.max(0, f - d[1]) / 70 + k / 3) % 1);
          const r = 60 + t * mix(30, 66, grandit);
          return <path key={k} d={`M${C0.x - r} ${C0.y} A${r} ${r} 0 0 1 ${C0.x + r} ${C0.y}`} fill="none" stroke={F.or} strokeWidth={4} strokeLinecap="round" opacity={lin(f, d[1], d[1] + 20) * Math.min(1, t * 6, (1 - t) * 3)} />;
        })}
        <Rayons x={C0.x} y={C0.y} r={mix(84, 138, grandit)} l={mix(10, 26, leve) + 12 * grandit} n={10} de={-90 - 90 * leve} a={Math.max(1, 180 * leve)} />
      </g>
      <Piece x={c.x} y={c.y} r={mix(52, 34, vers)} opacite={entree * apparait} />
      <Libelle x={610} y={848} taille={34} graisse={600} couleur={F.orFonce} opacite={vivant}>{LIBELLES.culte.vivant}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 10 ------------------------------------------------------------------ */

const ANNEAUX = [
  { r: 270, cy: 310 },
  { r: 200, cy: 380 },
  { r: 132, cy: 448 },
  { r: 72, cy: 508 },
];

/** Quatre anneaux emboîtés : la lumière passe de l'un à l'autre, puis descend vers la postérité. */
const IlluAnneaux: React.FC<PropsIllustration> = ({ f, d }) => {
  const L1 = d[2] - d[1];
  const trait = p(f, d[2] + (d[3] - d[2]) * 0.45, d[3] - 10);
  const BAS = 870;
  const yT = 580 + (BAS - 580) * trait;
  const fin = p(f, d[3], d[3] + 40);
  return (
    <Scene>
      {/* Le trait, derrière les anneaux */}
      {trait > 0 ? (
        <g>
          <line x1={400} x2={400} y1={576} y2={yT - 26} stroke={F.encre} strokeWidth={28} strokeLinecap="butt" />
          <line x1={400} x2={400} y1={576} y2={yT - 26} stroke={F.or} strokeWidth={20} strokeLinecap="butt" />
          <Pointe x={400} y={yT - 26} angle={90} t={32} />
          {Array.from({ length: 3 }, (_, k) => {
            const t = (f / 60 + k / 3) % 1;
            return yT > 640 ? <circle key={k} cx={400} cy={590 + t * (yT - 640)} r={7} fill={F.papier} opacity={Math.min(1, t * 8, (1 - t) * 8) * trait} /> : null;
          })}
        </g>
      ) : null}
      {ANNEAUX.map((a, i) => {
        const e = d[0] - 25 + i * 20;
        const g = p(f, e, e + 28);
        const y0 = d[1] + L1 * (0.5 + i * 0.1);
        const allume = p(f, y0, y0 + L1 * 0.1);
        const onde = fin > 0 ? 0.5 + 0.5 * Math.sin((f - d[3]) / 16 - i * 1.1) : 0;
        return (
          <g key={i} opacity={g}>
            <circle cx={400} cy={a.cy} r={a.r} fill={F.papier} />
            <circle cx={400} cy={a.cy} r={a.r} fill={i % 2 ? F.orClair : F.or} opacity={allume * (0.55 + 0.25 * onde * fin)} />
            <circle cx={400} cy={a.cy} r={a.r} fill="none" stroke={F.encre} strokeWidth={5} />
          </g>
        );
      })}
      {ANNEAUX.map((a, i) => {
        const e = d[0] - 15 + i * 20;
        const suivant = ANNEAUX[i + 1];
        const yTexte = suivant ? (a.cy - a.r + (suivant.cy - suivant.r)) / 2 + 12 : a.cy + 12;
        return <Libelle key={i} x={400} y={yTexte} taille={i === 3 ? 34 : 36} graisse={600} opacite={p(f, e, e + 24)}>{LIBELLES.generations.noms[i]}</Libelle>;
      })}
      <Libelle x={440} y={760} taille={36} graisse={600} ancre="start" couleur={F.orFonce} opacite={p(f, d[2] + (d[3] - d[2]) * 0.65, d[2] + (d[3] - d[2]) * 0.8)}>{LIBELLES.generations.posterite}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 11 ------------------------------------------------------------------ */

const Cadenas: React.FC<{ x: number; y: number; ferme: number; rot?: number; or?: number; opacite?: number; dim?: number }> = ({ x, y, ferme, rot = 0, or = 0, opacite = 1, dim = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacite}>
    {/* Un fond opaque : le mur ne se voit pas à travers un cadenas estompé. */}
    <path d="M-24 0 V-26 A24 24 0 0 1 24 -26 V0" fill="none" stroke={F.papier} strokeWidth={15} />
    <rect x={-44} y={-6} width={88} height={68} rx={10} fill={F.papier} />
    <g opacity={dim}>
      {/* L'anse pivote autour de sa branche droite quand le cadenas s'ouvre. */}
      <g transform={`translate(0 ${-(1 - ferme) * 6}) rotate(${(1 - ferme) * 30} 24 0)`}>
        <path d="M-24 0 V-26 A24 24 0 0 1 24 -26 V0" fill="none" stroke={F.encre} strokeWidth={15} />
        <path d="M-24 0 V-26 A24 24 0 0 1 24 -26 V0" fill="none" stroke={or > 0 ? F.orClair : F.encre2} strokeWidth={8} />
      </g>
      <rect x={-44} y={-6} width={88} height={68} rx={10} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <rect x={-44} y={-6} width={88} height={68} rx={10} fill={F.or} opacity={or} stroke={F.encre} strokeWidth={4} />
      <circle cx={0} cy={20} r={9} fill={or > 0.5 ? F.encre : F.orClair} />
      <path d="M-4 22 L-7 44 H7 L4 22 Z" fill={or > 0.5 ? F.encre : F.orClair} />
    </g>
  </g>
);

/** Le mur de cadenas fermés : un seul, en bas, s'ouvre quand la pièce passe. */
const IlluMur: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const COLS = 5;
  const RANGEES = 5;
  const X = (i: number) => 120 + i * 140;
  const Y = (j: number) => 186 + j * 132;
  const titre = p(f, d[0] - 25, d[0] + 5);
  const seul = { i: 2, j: 4 };
  const L0 = d[1] - d[0];
  const L1 = d[2] - d[1];
  const roule = p(f, d[2] + 25, duree - 70);
  const xP = mix(42, X(seul.i), roule);
  const yP = 842;
  const ouvre = p(f, duree - 95, duree - 60);
  const estompe = 1 - 0.55 * p(f, d[2] + 10, d[2] + 50);
  return (
    <Scene>
      <Libelle x={400} y={62} taille={46} graisse={600} opacite={titre}>{LIBELLES.mur}</Libelle>
      {/* Le mur */}
      <g opacity={p(f, 0, 25)}>
        <rect x={32} y={92} width={736} height={700} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        {Array.from({ length: 10 }, (_, j) => (
          <g key={j}>
            <line x1={34} x2={766} y1={92 + (j + 1) * 66} y2={92 + (j + 1) * 66} stroke={F.filet} strokeWidth={3} />
            {Array.from({ length: 7 }, (_, k) => {
              const x = 34 + (j % 2 ? 52 : 0) + k * 104;
              return x > 36 && x < 764 ? <line key={k} x1={x} x2={x} y1={92 + j * 66} y2={92 + (j + 1) * 66} stroke={F.filet} strokeWidth={3} /> : null;
            })}
          </g>
        ))}
      </g>
      {/* Lumière du seul cadenas qui s'ouvre */}
      <g opacity={ouvre}>
        <circle cx={X(seul.i)} cy={Y(seul.j) + 16} r={62} fill={F.orClair} opacity={0.65} />
      </g>
      {Array.from({ length: RANGEES }, (_, j) =>
        Array.from({ length: COLS }, (_, i) => {
          const a = d[0] + (j * 5 + i) * ((L0 - 60) / 25);
          const ap = p(f, a, a + 12);
          const clic = p(f, a + 12, a + 22);
          // La secousse passe sur le mur pendant la deuxième phrase : tous restent fermés.
          const front = ((f - d[1] - 10) / (L1 - 40)) * 1.1;
          const dist = Math.abs(front - (j / (RANGEES - 1) + i / (COLS - 1)) / 2);
          const sec = Math.max(0, 1 - dist / 0.12);
          const rot = Math.sin(f / 1.6 + i) * 5 * sec;
          const lui = i === seul.i && j === seul.j;
          return (
            <Cadenas key={`${i}${j}`} x={X(i)} y={Y(j)} ferme={lui ? clic * (1 - ouvre) : clic} rot={rot} or={lui ? ouvre : 0} opacite={ap} dim={lui ? 1 : estompe} />
          );
        }),
      )}
      {/* Le sol et la pièce qui roule */}
      <line x1={32} x2={768} y1={880} y2={880} stroke={F.encre} strokeWidth={4} strokeLinecap="round" opacity={p(f, 0, 25)} />
      {f > d[2] + 25 ? (
        <g transform={`rotate(${(xP / 36) * 57.3} ${xP} ${yP})`} opacity={lin(f, d[2] + 25, d[2] + 45)}>
          <Piece x={xP} y={yP} r={36} />
          <line x1={xP} x2={xP} y1={yP - 18} y2={yP + 18} stroke={F.orFonce} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 12 ------------------------------------------------------------------ */

const Nuage: React.FC<{ x: number; y: number; s: number; dx: number }> = ({ x, y, s, dx }) => (
  <path transform={`translate(${x + dx} ${y}) scale(${s})`} d="M-96 56 A44 44 0 0 1 -104 -30 A56 56 0 0 1 -14 -60 A62 62 0 0 1 84 -32 A44 44 0 0 1 96 56 Z" fill={F.papier} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
);

const Manivelle: React.FC<{ x: number; y: number; a: number }> = ({ x, y, a }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`}>
    <circle r={26} fill={F.papier} stroke={F.encre} strokeWidth={5} />
    {[0, 60, 120].map((v) => <line key={v} x1={-24} x2={24} y1={0} y2={0} stroke={F.encre} strokeWidth={4} transform={`rotate(${v})`} />)}
    <circle r={6} fill={F.encre} />
  </g>
);

/** Le chemin de la terre, au premier plan : les pièces y roulent sans traverser le champ, jusqu'à la porte du trésor. */
const CHEMIN_TRESOR = parcours([
  { x: 830, y: 795 },
  { x: 330, y: 795 },
  ...echant((t) => bez3({ x: 330, y: 795 }, { x: 200, y: 795 }, { x: 122, y: 790 }, { x: 122, y: 716 }, t), 24).slice(1),
]);

const PieceRoulante: React.FC<{ t: number; r: number; o: number }> = ({ t, r, o }) => {
  const q = CHEMIN_TRESOR.point(t);
  const rayon = r * (1 - 0.3 * lin(t, 0.86, 1));
  return (
    <g transform={`rotate(${-((t * CHEMIN_TRESOR.total) / r) * 57.3} ${q.x} ${q.y})`} opacity={o}>
      <Piece x={q.x} y={q.y} r={rayon} />
      <line x1={q.x} x2={q.x} y1={q.y - rayon / 2} y2={q.y + rayon / 2} stroke={F.orFonce} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
};

/** La pièce entre dans la maison du trésor, les vannes s'ouvrent, l'eau descend, la terre sombre s'humecte et les pousses sortent. */
const IlluEcluses: React.FC<PropsIllustration> = ({ f, d }) => {
  const COEUR_Y = 165;
  const X0 = 250;
  const X1 = 690;
  const CENTRE = (X0 + X1) / 2;
  const DEMI = (X1 - X0) / 2;
  const SOL = 716;
  const L0 = d[1] - d[0];
  const roule = p(f, d[0] + 10, d[0] + L0 * 0.32);
  const dedans = p(f, d[0] + L0 * 0.29, d[0] + L0 * 0.33);
  const vitre = p(f, d[0] + L0 * 0.32, d[0] + L0 * 0.42);
  const ouvre = p(f, d[1] + 40, d[1] + 120);
  // « Mettez-moi à l'épreuve » : les manivelles commencent à tourner, une lueur passe entre les vannes.
  const attend = p(f, d[0] + L0 * 0.6, d[1] + 30);
  const tremble = Math.sin(f / 2.2) * 1.4 * attend * (1 - ouvre);
  const descend = p(f, d[1] + 62, d[1] + 150);
  const nappe = p(f, d[1] + 150, d[1] + 220);
  const encore = (k: number) => lin(f, d[2] + 10 + k * 34, d[2] + 72 + k * 34);
  const yEau = 215 + (SOL - 215) * descend;
  const largeEau = (DEMI - 8) * ouvre;
  const POUSSES = Array.from({ length: 15 }, (_, i) => 262 + i * 35);
  return (
    <Scene>
      {/* Les nuages */}
      <Nuage x={130} y={92} s={1.0} dx={Math.sin(f / 60) * 6} />
      <Nuage x={668} y={92} s={1.0} dx={-Math.sin(f / 70) * 6} />
      <Nuage x={400} y={84} s={1.08} dx={Math.sin(f / 50 + 1) * 5} />
      {/* L'eau */}
      {ouvre > 0 ? (
        <g>
          <path d={`M${CENTRE - largeEau} 215 H${CENTRE + largeEau} L${CENTRE + largeEau + 12 * descend} ${yEau} ${Array.from({ length: 8 }, () => `q${-(largeEau + 12 * descend) / 8} 16 ${-(largeEau + 12 * descend) / 4} 0`).join(' ')} Z`} fill={F.papier} stroke={F.encre2} strokeWidth={3} strokeLinejoin="round" />
          {Array.from({ length: 11 }, (_, i) => {
            const x = CENTRE - largeEau + ((i + 0.5) / 11) * largeEau * 2;
            const n = Math.max(1, Math.round((yEau - 215) / 24));
            const trace = `M${Array.from({ length: n + 1 }, (_, k) => {
              const y = 215 + ((yEau - 215) * k) / n;
              return `${(x + Math.sin(y / 34 + i * 1.7) * 6).toFixed(1)} ${y.toFixed(1)}`;
            }).join(' L')}`;
            return <path key={i} d={trace} fill="none" stroke={i % 3 === 1 ? F.encre2 : F.filet} strokeWidth={i % 3 === 1 ? 2.5 : 6} strokeDasharray={`${70 + hasard(i) * 90} ${30 + hasard(i + 20) * 50}`} strokeDashoffset={-f * (7 + (i % 3))} strokeLinecap="round" />;
          })}
        </g>
      ) : null}
      {/* La terre reste sombre : la bande humide s'étend depuis le pied de l'eau, le chemin passe devant. */}
      <path d={`M0 ${SOL} Q200 ${SOL - 8} 400 ${SOL} T800 ${SOL} V872 H0 Z`} fill={F.cuir} />
      <clipPath id="ch12-p12-terre"><path d={`M0 ${SOL} Q200 ${SOL - 8} 400 ${SOL} T800 ${SOL} V872 H0 Z`} /></clipPath>
      <clipPath id="ch12-p12-humide"><rect x={CENTRE - largeEau - 26 - 650 * nappe} y={SOL - 12} width={(largeEau + 26 + 650 * nappe) * 2} height={52} /></clipPath>
      <g clipPath="url(#ch12-p12-terre)">
        {nappe > 0 ? (
          <g clipPath="url(#ch12-p12-humide)">
            <rect x={0} y={SOL - 12} width={800} height={52} fill={F.encre} opacity={0.42} />
            {[SOL + 12, SOL + 26].map((y, i) => (
              <path key={y} d={`M-40 ${y} q30 -6 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0`} stroke={F.papier} strokeWidth={3} fill="none" transform={`translate(${((f * (1 + i * 0.3)) % 60) - 30} 0)`} opacity={0.75} />
            ))}
          </g>
        ) : null}
        <path d={CHEMIN_TRESOR.trace(1)} fill="none" stroke={F.encre} strokeWidth={66} strokeLinejoin="round" />
        <path d={CHEMIN_TRESOR.trace(1)} fill="none" stroke={F.cuirClair} strokeWidth={60} strokeLinejoin="round" />
      </g>
      <path d={`M0 ${SOL} Q200 ${SOL - 8} 400 ${SOL} T800 ${SOL} V872 H0 Z`} fill="none" stroke={F.encre} strokeWidth={4} />
      {/* Les gouttes qui rejaillissent au pied de l'eau */}
      {descend >= 1
        ? Array.from({ length: 10 }, (_, i) => {
            const t = (f / 26 + i * 0.37) % 1;
            return <circle key={i} cx={CENTRE - largeEau + ((i + 0.5) / 10) * largeEau * 2 + (i % 2 ? 1 : -1) * t * 16} cy={SOL - 4 - Math.sin(t * Math.PI) * 30} r={5} fill={F.papier} stroke={F.encre2} strokeWidth={2} />;
          })
        : null}
      {/* Les pousses qui se réveillent sous l'eau */}
      {POUSSES.map((x, i) => {
        const dist = Math.abs(x - CENTRE) / 470;
        const a = d[1] + 175 + dist * (d[2] - d[1] - 200);
        return <Pousse key={i} x={x} y={SOL + 2} h={96 + hasard(i + 7) * 44} e={0.66} g={p(f, a, a + 40)} incl={Math.sin(f / 22 + i) * 2} rempli={F.orFonce} contour={F.encre} />;
      })}
      {/* La maison du trésor */}
      <g>
        <path d="M122 512 L232 604 H12 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
        <rect x={32} y={604} width={180} height={114} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
        <rect x={88} y={640} width={68} height={78} fill={F.encre} />
        <rect x={46} y={626} width={32} height={32} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
        <rect x={166} y={626} width={32} height={32} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
        <rect x={46} y={626} width={32} height={32} fill={F.or} stroke={F.encre} strokeWidth={3} opacity={vitre} />
        <rect x={166} y={626} width={32} height={32} fill={F.or} stroke={F.encre} strokeWidth={3} opacity={vitre} />
        <Libelle x={122} y={494} taille={23} graisse={600}>{LIBELLES.ecluse.maison}</Libelle>
      </g>
      {/* La pièce qui roule */}
      {dedans < 1 ? <PieceRoulante t={roule} r={28} o={(1 - dedans) * lin(f, d[0] + 6, d[0] + 24)} /> : null}
      {[0, 1, 2].map((k) => {
        const t = encore(k);
        if (t <= 0 || t >= 1) return null;
        return <PieceRoulante key={k} t={t} r={26} o={Math.min(1, t * 8, (1 - t) * 10)} />;
      })}
      {/* L'écluse */}
      <rect x={X0 - 18} y={COEUR_Y} width={X1 - X0 + 36} height={50} fill={F.cuir} stroke={F.encre} strokeWidth={4.5} />
      <Libelle x={CENTRE} y={COEUR_Y + 34} taille={26} graisse={600} couleur={F.papier}>{LIBELLES.ecluse.ecluses}</Libelle>
      <rect x={X0 - 18} y={COEUR_Y + 50} width={24} height={215} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <rect x={X1 - 6} y={COEUR_Y + 50} width={24} height={215} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[-1, 1].map((s) => {
        const xCharn = s < 0 ? X0 + 6 : X1 - 6;
        const larg = (DEMI - 6) * (1 - 0.84 * ouvre);
        const xG = s < 0 ? xCharn : xCharn - larg;
        return (
          <g key={s} transform={`translate(${s * tremble} 0)`}>
            <rect x={xG} y={COEUR_Y + 50} width={larg} height={200} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
            {[0.33, 0.66].map((k) => <line key={k} x1={xG + larg * k} x2={xG + larg * k} y1={COEUR_Y + 50} y2={COEUR_Y + 250} stroke={F.encre} strokeWidth={3} />)}
            <path d={`M${xG} ${COEUR_Y + 110} H${xG + larg} M${xG} ${COEUR_Y + 190} H${xG + larg}`} stroke={F.orFonce} strokeWidth={8} />
          </g>
        );
      })}
      {ouvre === 0 && attend > 0 ? <line x1={CENTRE} x2={CENTRE} y1={COEUR_Y + 52} y2={COEUR_Y + 52 + 196 * attend} stroke={F.orClair} strokeWidth={6} strokeLinecap="round" /> : null}
      <Manivelle x={X0 - 56} y={330} a={attend * 180 + ouvre * 540} />
      <Manivelle x={X1 + 56} y={330} a={-attend * 180 - ouvre * 540} />
      <rect x={X0 - 30} y={322} width={24} height={16} fill={F.encre} />
      <rect x={X1 + 6} y={322} width={24} height={16} fill={F.encre} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Fin ------------------------------------------------------------------ */

/** Un mot d'écriture cursive tracé par une ondulation stable. */
const motCursif = (x0: number, y: number, larg: number, graine: number) => {
  const N = Math.max(30, Math.round(larg * 1.4));
  const W = 0.56;
  const pts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const phi = t * larg * W;
    const h = 4.6 + 1.8 * Math.sin(graine + phi * 0.31) + (Math.sin(graine * 2.3 + phi * 0.17) > 0.8 ? 6 : 0);
    const x = x0 + t * larg - 3 * Math.sin(phi);
    const yy = y - h * (1 - Math.cos(phi)) * Math.min(1, t * 8, (1 - t) * 8);
    pts.push(`${x.toFixed(1)} ${yy.toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
};

const LIGNES_LETTRE = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
  const mots: { x: number; l: number }[] = [];
  let x = i === 0 ? 150 : 118;
  const limite = i === 7 ? 350 : 540;
  let k = 0;
  while (x < limite - 30) {
    const l = Math.min(limite - x, 44 + hasard(i * 7 + k) * 76);
    mots.push({ x, l });
    x += l + 20;
    k++;
  }
  return { y: 248 + i * 62, mots };
});

/** La pièce se déplie en feuille, et des lignes dorées s'y écrivent d'elles-mêmes. */
const IlluLettre: React.FC<PropsIllustration> = ({ f, duree }) => {
  const niveau = 0.72 + 0.28 * p(f, 0, 60);
  // La pièce reste entière après le fondu (10 images), puis se change en paquet plié et s'ouvre en deux temps.
  const morph = p(f, 44, 66);
  const hauteur = p(f, 68, 90);
  const largeur = p(f, 90, 112);
  const CX2 = 330;
  const CY = 460;
  const W = 500;
  const H = 680;
  const yH = mix(CY - H / 4, CY - H / 2, hauteur);
  const xG = mix(CX2 - W / 4, CX2 - W / 2, largeur);
  const pliY = yH + H / 2;
  const pliX = xG + W / 2;
  const bordY = pliY - (H / 2) * Math.cos(hauteur * Math.PI);
  const bordX = pliX - (W / 2) * Math.cos(largeur * Math.PI);
  const debut = 116;
  const fin = duree - 34;
  const tous = LIGNES_LETTRE.reduce((s, l) => s + l.mots.reduce((a, m) => a + m.l + 20, 0), 0);
  let cumul = 0;
  return (
    <Scene>
      <Thermometre x={700} y={200} h={480} l={60} niveau={niveau} />
      {/* La feuille : le paquet plié en quatre s'ouvre autour de ses plis, le rabat passe par la tranche. */}
      {morph >= 1 ? (
        <g>
          <rect x={xG} y={yH} width={largeur >= 1 ? W : W / 2} height={hauteur >= 1 ? H : H / 2} fill={F.papier} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
          {hauteur > 0 && hauteur < 1 ? (
            <g>
              <rect x={xG} y={Math.min(pliY, bordY)} width={W / 2} height={Math.abs(bordY - pliY)} fill={F.papier} stroke={F.encre} strokeWidth={4} />
              <rect x={xG} y={Math.min(pliY, bordY)} width={W / 2} height={Math.abs(bordY - pliY)} fill={F.filet} opacity={Math.sin(hauteur * Math.PI)} />
            </g>
          ) : null}
          {largeur > 0 && largeur < 1 ? (
            <g>
              <rect x={Math.min(pliX, bordX)} y={yH} width={Math.abs(bordX - pliX)} height={H} fill={F.papier} stroke={F.encre} strokeWidth={4} />
              <rect x={Math.min(pliX, bordX)} y={yH} width={Math.abs(bordX - pliX)} height={H} fill={F.filet} opacity={Math.sin(largeur * Math.PI)} />
            </g>
          ) : null}
          {/* Les plis qui restent marqués */}
          <line x1={xG + 3} x2={Math.max(pliX, largeur > 0 ? bordX : pliX) - 3} y1={pliY} y2={pliY} stroke={F.filet} strokeWidth={3} opacity={hauteur} />
          <line x1={pliX} x2={pliX} y1={yH + 3} y2={yH + H - 3} stroke={F.filet} strokeWidth={3} opacity={largeur} />
        </g>
      ) : null}
      {/* Les lignes d'écriture */}
      {f >= debut
        ? LIGNES_LETTRE.map((l, i) => (
            <g key={i}>
              {l.mots.map((m, k) => {
                const a = mix(debut, fin, cumul / tous);
                cumul += m.l + 20;
                const b = mix(debut, fin, cumul / tous);
                const t = lin(f, a, b);
                return t > 0 ? <path key={k} d={motCursif(m.x, l.y, m.l, i * 3 + k)} pathLength={1} strokeDasharray={`${t} 1`} fill="none" stroke={F.or} strokeWidth={3.6} strokeLinecap="round" strokeLinejoin="round" /> : null;
              })}
            </g>
          ))
        : null}
      {/* La pièce, entière, puis qui se change en paquet : le cercle s'équarrit, l'or laisse voir le papier. */}
      {morph === 0 ? <Piece x={CX2} y={CY} r={130} /> : null}
      {morph > 0 && morph < 1 ? (
        <g>
          <rect x={CX2 - mix(130, W / 4, morph)} y={CY - mix(130, H / 4, morph)} width={mix(260, W / 2, morph)} height={mix(260, H / 2, morph)} rx={mix(130, 0, morph)} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
          <rect x={CX2 - mix(130, W / 4, morph)} y={CY - mix(130, H / 4, morph)} width={mix(260, W / 2, morph)} height={mix(260, H / 2, morph)} rx={mix(130, 0, morph)} fill={F.or} stroke={F.orFonce} strokeWidth={10} opacity={1 - morph} />
          <circle cx={CX2} cy={CY} r={94 * (1 - 0.4 * morph)} fill={F.orClair} stroke={F.orFonce} strokeWidth={5} opacity={1 - morph} />
        </g>
      ) : null}
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluEpis,
  p2: IlluChemins,
  p3: IlluMot,
  p4: IlluArbre,
  p5: IlluCoupe,
  p6: IlluChamp,
  p7: IlluMaison,
  p8: IlluReversible,
  p9: IlluPorte,
  p10: IlluAnneaux,
  p11: IlluMur,
  p12: IlluEcluses,
  fin: IlluLettre,
};

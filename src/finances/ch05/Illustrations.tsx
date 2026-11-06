import React from 'react';
import { Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F } from '../theme';
import { LIBELLES as L } from './libelles';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rad = (a: number) => (a * Math.PI) / 180;

/* ─────────────── Briques propres au chapitre ─────────────── */

/** Un grain de manne. */
const Grain: React.FC<{ x: number; y: number; r?: number; rot?: number; o?: number }> = ({ x, y, r = 9, rot = 0, o = 1 }) => (
  <ellipse cx={x} cy={y} rx={r} ry={r * 0.68} transform={`rotate(${rot} ${x} ${y})`} fill={F.papier} stroke={F.orFonce} strokeWidth={2} opacity={o} />
);

/** Le tas de grains qui se forme sur l'embouchure du vase, du bas vers le haut. */
const TAS: [number, number][] = [
  [-54, -2], [-36, 2], [-18, 4], [0, 5], [18, 4], [36, 2], [54, -2],
  [-44, -14], [-26, -11], [-8, -10], [10, -10], [28, -11], [45, -14],
  [-33, -25], [-15, -23], [3, -23], [20, -24], [36, -26],
  [-20, -36], [-3, -36], [14, -36],
  [-9, -47], [8, -47],
];

/** Le vase d'or : origine au milieu du pied, 292 de haut pour s = 1, embouchure en y = -292. */
const VaseOr: React.FC<{ x: number; y: number; s?: number; tas?: number; terne?: boolean; opacite?: number }> = ({ x, y, s = 1, tas = 0, terne = false, opacite = 1 }) => {
  const corps = terne ? F.cuirClair : F.or;
  const anse = terne ? F.cuir : F.orFonce;
  const trait = terne ? F.encre2 : F.encre;
  const n = Math.round(tas * TAS.length);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
      {[-1, 1].map((c) => (
        <g key={c}>
          <path d={`M${c * 56} -246 C${c * 132} -262 ${c * 150} -176 ${c * 108} -146`} fill="none" stroke={trait} strokeWidth={17} strokeLinecap="round" />
          <path d={`M${c * 56} -246 C${c * 132} -262 ${c * 150} -176 ${c * 108} -146`} fill="none" stroke={anse} strokeWidth={10} strokeLinecap="round" />
        </g>
      ))}
      <path
        d="M-64 -292 C-62 -266 -48 -256 -54 -234 C-110 -208 -126 -122 -98 -72 C-86 -48 -62 -34 -50 -18 L-76 -8 V0 H76 V-8 L50 -18 C62 -34 86 -48 98 -72 C126 -122 110 -208 54 -234 C48 -256 62 -266 64 -292 Z"
        fill={corps}
        stroke={trait}
        strokeWidth={5}
        strokeLinejoin="round"
      />
      <path d="M-54 -234 Q0 -214 54 -234" fill="none" stroke={terne ? F.cuir : F.orFonce} strokeWidth={4} />
      <path d="M-98 -72 Q0 -44 98 -72" fill="none" stroke={terne ? F.cuir : F.orFonce} strokeWidth={4} />
      {terne ? null : (
        <>
          <path d="M-84 -186 C-98 -150 -96 -116 -80 -90" fill="none" stroke={F.orClair} strokeWidth={15} strokeLinecap="round" />
          {[-60, -30, 0, 30, 60].map((dx) => (
            <path key={dx} d={`M${dx} -146 l12 -16 l12 16 l-12 16 Z`} transform="translate(-12 0)" fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
          ))}
        </>
      )}
      <ellipse cx={0} cy={-292} rx={72} ry={17} fill={terne ? F.cuir : F.orClair} stroke={trait} strokeWidth={5} />
      <ellipse cx={0} cy={-292} rx={55} ry={10} fill={F.encre} />
      {tas > 0 ? <ellipse cx={0} cy={-293} rx={55 * Math.min(1, tas * 2.5)} ry={10 * Math.min(1, tas * 2.5)} fill={F.orClair} /> : null}
      {TAS.slice(0, n).map(([gx, gy], i) => (
        <Grain key={i} x={gx} y={-296 + gy} r={11} rot={(i * 47) % 60 - 30} />
      ))}
    </g>
  );
};

/** Le bord avant de l'embouchure de VaseOr : à dessiner après ce qui est planté dans le vase. */
const LevreVase: React.FC<{ x: number; y: number; s?: number; terne?: boolean; opacite?: number }> = ({ x, y, s = 1, terne = false, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
    <path d="M-72 -292 A72 17 0 0 0 72 -292 L55 -292 A55 10 0 0 1 -55 -292 Z" fill={terne ? F.cuir : F.orClair} />
    <path d="M-72 -292 A72 17 0 0 0 72 -292" fill="none" stroke={terne ? F.encre2 : F.encre} strokeWidth={5} />
  </g>
);

/** Un soleil de lumière : un disque doré et des rayons. Jamais rien d'autre pour dire la présence. */
const Lumiere: React.FC<{ x: number; y: number; r: number; o: number; rayons?: number; long?: number; debut?: number; arc?: number }> = ({ x, y, r, o, rayons = 16, long = 60, debut = 0, arc = 360 }) => {
  if (o <= 0) return null;
  const pasA = arc / (arc === 360 ? rayons : rayons - 1);
  return (
    <g>
      <circle cx={x} cy={y} r={r * o} fill={F.orClair} opacity={0.75} />
      <circle cx={x} cy={y} r={r * 0.62 * o} fill={F.papier} opacity={0.85} />
      {Array.from({ length: rayons }, (_, i) => {
        const a = rad(debut + i * pasA);
        const r0 = r + 12;
        const r1 = r0 + long * o;
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * r1} y2={y + Math.sin(a) * r1} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={o} />;
      })}
    </g>
  );
};

/** Une aile de profil, sans corps, tendue d'un point à un autre. `o` la déploie. */
const Aile: React.FC<{ x0: number; y0: number; x1: number; y1: number; o: number }> = ({ x0, y0, x1, y1, o }) => {
  if (o <= 0) return null;
  const sens = x1 < x0 ? -1 : 1;
  const long = Math.hypot(x1 - x0, y1 - y0);
  const final = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const angle = lerp(-90, final, o);
  const e = (long / 100) * (0.25 + 0.75 * o);
  return (
    <g transform={`translate(${x0} ${y0}) rotate(${angle}) scale(${e} ${sens * (long / 100) * 0.78 * (0.45 + 0.55 * o)})`}>
      <path
        d="M0 6 C14 -16 58 -22 100 -3 Q90 7 80 4 Q78 15 62 12 Q58 25 44 20 Q38 31 25 24 Q17 28 10 20 Q2 16 0 6 Z"
        fill={F.orClair}
        stroke={F.orFonce}
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
      />
      <path d="M12 3 Q40 -8 80 4 M12 8 Q34 2 62 12 M10 12 Q26 10 44 20" fill="none" stroke={F.orFonce} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </g>
  );
};

/**
 * L'arche, de face : origine au milieu du sol, 360 de large et 232 de haut pour s = 1.
 * `or` recouvre le bois d'or depuis le bas ; `leve` soulève le couvercle ; `bascule` l'ouvre autour de son bout gauche.
 */
const Arche: React.FC<{ x: number; y: number; s?: number; or?: number; leve?: number; bascule?: number; sansCouvercle?: boolean }> = ({ x, y, s = 1, or = 1, leve = 0, bascule = 0, sansCouvercle = false }) => {
  const haut = 176 * or;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-150, 150].map((c) => (
        <rect key={c} x={c - 20} y={-26} width={40} height={26} fill={or > 0.5 ? F.orFonce : F.cuir} stroke={F.encre} strokeWidth={4} />
      ))}
      <rect x={-180} y={-200} width={360} height={176} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {[-160, -126, -92, -58].map((gy) => (
        <path key={gy} d={`M-170 ${gy} Q-60 ${gy - 8} 40 ${gy} T170 ${gy}`} fill="none" stroke={F.cuirClair} strokeWidth={3} />
      ))}
      <rect x={-180} y={-24 - haut} width={360} height={haut} fill={F.or} stroke={F.encre} strokeWidth={or > 0 ? 5 : 0} />
      <g opacity={or}>
        <rect x={-160} y={-182} width={320} height={140} fill="none" stroke={F.orFonce} strokeWidth={4} />
        <rect x={-180} y={-200} width={360} height={14} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      </g>
      <rect x={-224} y={-92} width={448} height={14} rx={7} fill={or > 0.5 ? F.orClair : F.cuirClair} stroke={F.encre} strokeWidth={4} />
      {[-112, 112].map((c) => (
        <rect key={c} x={c - 11} y={-100} width={22} height={30} rx={6} fill={F.orFonce} stroke={F.encre} strokeWidth={3} />
      ))}
      {sansCouvercle ? null : (
        <g transform={`translate(0 ${-leve / s}) rotate(${-bascule} -190 -200)`}>
          <rect x={-190} y={-232} width={380} height={32} rx={4} fill={or > 0.5 ? F.orClair : F.cuirClair} stroke={F.encre} strokeWidth={5} />
          <line x1={-180} x2={180} y1={-214} y2={-214} stroke={F.orFonce} strokeWidth={3} />
        </g>
      )}
    </g>
  );
};

type NoeudVerge = { t: number; c: number };
const NOEUDS: NoeudVerge[] = [
  { t: 0.42, c: -1 }, { t: 0.54, c: 1 }, { t: 0.65, c: -1 }, { t: 0.76, c: 1 }, { t: 0.87, c: -1 }, { t: 0.98, c: 0 },
];

/** Une verge : `b` bourgeons, `fl` fleurs, `fr` fruits ; tout à zéro, elle est sèche. Origine à sa base. */
const Verge: React.FC<{ x: number; y: number; h: number; courbe?: number; b?: number; fl?: number; fr?: number; couleur?: string; o?: number }> = ({ x, y, h, courbe = 0, b = 0, fl = 0, fr = 0, couleur = F.cuir, o = 1 }) => {
  const pt = (t: number) => {
    const cx = courbe * 2;
    return { px: x + 2 * (1 - t) * t * cx + t * t * courbe * 0.4, py: y - h * t };
  };
  const taille = h / 250;
  return (
    <g opacity={o}>
      <path d={`M${x} ${y} Q${x + courbe * 2} ${y - h / 2} ${x + courbe * 0.4} ${y - h}`} fill="none" stroke={F.encre} strokeWidth={11 * taille} strokeLinecap="round" />
      <path d={`M${x} ${y} Q${x + courbe * 2} ${y - h / 2} ${x + courbe * 0.4} ${y - h}`} fill="none" stroke={couleur} strokeWidth={6.5 * taille} strokeLinecap="round" />
      {NOEUDS.map((n, i) => {
        const { px, py } = pt(n.t);
        const bx = px + n.c * 15 * taille;
        const by = py - 10 * taille;
        return (
          <g key={i}>
            {n.c !== 0 ? <line x1={px} y1={py} x2={bx} y2={by} stroke={F.encre} strokeWidth={5 * taille} strokeLinecap="round" /> : null}
            {b > 0 && fl < 1 ? <ellipse cx={bx} cy={by} rx={6 * b * taille} ry={9 * b * taille} fill={F.argile} stroke={F.encre} strokeWidth={1.5} /> : null}
            {fl * (i % 2 === 0 ? 1 - fr : 1) > 0
              ? [0, 72, 144, 216, 288].map((a) => {
                  const e = fl * (i % 2 === 0 ? 1 - fr : 1) * taille;
                  return <circle key={a} cx={bx + Math.cos(rad(a - 90)) * 9 * e} cy={by + Math.sin(rad(a - 90)) * 9 * e} r={7 * e} fill={F.papier} stroke={F.orFonce} strokeWidth={1.5} />;
                })
              : null}
            {fl * (i % 2 === 0 ? 1 - fr : 1) > 0 ? <circle cx={bx} cy={by} r={4.5 * fl * (i % 2 === 0 ? 1 - fr : 1) * taille} fill={F.or} /> : null}
            {fr > 0 && i % 2 === 0 ? <ellipse cx={bx} cy={by + 8 * taille} rx={10 * taille * fr} ry={15 * taille * fr} fill={F.or} stroke={F.encre} strokeWidth={2.5} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** Les deux tables de pierre : origine au milieu de leur base. */
const Tables: React.FC = () => (
  <g>
    {[-1, 1].map((c) => (
      <g key={c} transform={`translate(${c * 50} 0) rotate(${c * 3})`}>
        <path d="M-46 0 V-186 A46 46 0 0 1 46 -186 V0 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        {[-186, -156, -126, -96, -66, -36].map((y) => (
          <line key={y} x1={-30} x2={30} y1={y} y2={y} stroke={F.encre2} strokeWidth={5} strokeLinecap="round" />
        ))}
      </g>
    ))}
  </g>
);

/* ─────────────── Ouverture ─────────────── */

const Ouverture: React.FC<PropsIllustration> = ({ f }) => {
  const N = 14;
  const vaseX = 500;
  const bouche = 800 - 292 * 1.05;
  return (
    <Scene>
      <Thermometre x={150} y={170} h={520} l={72} niveau={0.06 + 0.16 * p(f, 60, 190)} />
      <VaseOr x={vaseX} y={800} s={1.05} tas={0.55 * p(f, 60, 190)} opacite={p(f, 0, 24)} />
      {Array.from({ length: N }, (_, i) => {
        const debut = 32 + i * 9;
        const t = (f - debut) / 34;
        if (t <= 0 || t >= 1) return null;
        const dx = Math.sin(i * 2.4) * 34;
        return <Grain key={i} x={vaseX + dx * (1 - t * 0.7)} y={30 + t * t * (bouche - 30)} r={11} rot={i * 37 + f * 2} o={Math.min(1, t * 6)} />;
      })}
    </Scene>
  );
};

/* ─────────────── Plan 2 : le chemin qui se sépare ─────────────── */

type Pt = { x: number; y: number };

const pointsChemin = (sens: number): Pt[] => {
  const pts: Pt[] = [];
  for (let i = 0; i < 15; i++) pts.push({ x: 400, y: lerp(892, 575, i / 15) });
  const A = { x: 400, y: 575 };
  const B = { x: 400, y: 440 };
  const C = { x: 400 + sens * 170, y: 320 };
  const D = { x: 400 + sens * 248, y: 96 };
  for (let i = 0; i <= 34; i++) {
    const t = i / 34;
    const m = 1 - t;
    pts.push({
      x: m * m * m * A.x + 3 * m * m * t * B.x + 3 * m * t * t * C.x + t * t * t * D.x,
      y: m * m * m * A.y + 3 * m * m * t * B.y + 3 * m * t * t * C.y + t * t * t * D.y,
    });
  }
  return pts;
};
const CHEMIN_G = pointsChemin(-1);
const CHEMIN_D = pointsChemin(1);
const largeur = (t: number) => lerp(210, 30, Math.pow(t, 0.75));

/** Point du chemin à la position t (0 → 1), avec sa normale. */
const surChemin = (pts: Pt[], t: number) => {
  const q = Math.max(0, Math.min(pts.length - 1.001, t * (pts.length - 1)));
  const i = Math.floor(q);
  const a = pts[i];
  const b = pts[i + 1];
  const u = q - i;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const n = Math.hypot(dx, dy) || 1;
  return { x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), nx: -dy / n, ny: dx / n };
};

/** Ruban effilé qui suit le chemin de t0 à t1, sur une fraction de sa largeur. */
const ruban = (pts: Pt[], t0: number, t1: number, part = 1) => {
  const N = 40;
  const g: string[] = [];
  const dr: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = lerp(t0, t1, i / N);
    const c = surChemin(pts, t);
    const w = (largeur(t) / 2) * part;
    g.push(`${(c.x + c.nx * w).toFixed(1)} ${(c.y + c.ny * w).toFixed(1)}`);
    dr.push(`${(c.x - c.nx * w).toFixed(1)} ${(c.y - c.ny * w).toFixed(1)}`);
  }
  return `M${g.join(' L')} L${dr.reverse().join(' L')} Z`;
};

const PlanChemin: React.FC<PropsIllustration> = ({ f, d }) => {
  const PAS = [
    { a: d[0] + 15, t: 0.1 },
    { a: d[0] + 115, t: 0.2 },
    { a: d[0] + 215, t: 0.3 },
    { a: d[1] + 5, t: 0.46 },
    { a: d[1] + 45, t: 0.58 },
    { a: d[1] + 85, t: 0.68 },
    { a: d[2] + 25, t: 0.76 },
    { a: d[2] + 85, t: 0.82 },
  ];
  let t = 0.015;
  let prec = 0.015;
  let bouge = 0;
  for (const s of PAS) {
    const k = p(f, s.a, s.a + 34);
    t += (s.t - prec) * k;
    prec = s.t;
    if (k > 0 && k < 1) bouge = Math.sin(k * Math.PI);
  }
  const oG = 1 - 0.86 * p(f, d[0] + 170, d[1] + 80);
  const tTexte = p(f, d[0] + 285, d[0] + 315);
  const oAbandon = tTexte * (1 - 0.3 * p(f, d[1] + 20, d[1] + 80));
  const oTemps = p(f, d[1] + 30, d[1] + 60);
  const stop = p(f, d[2] + 150, d[2] + 180);
  const tete = surChemin(CHEMIN_D, t);
  const posee = PAS.filter((s) => f >= s.a + 34).map((s) => s.t);
  const panneau = surChemin(CHEMIN_D, 0.82);
  const entree = p(f, 0, 24);
  return (
    <Scene>
      <g opacity={entree}>
        <path d="M30 96 Q150 44 300 84 Q410 108 520 76 Q660 42 770 96" fill={F.filet} opacity={0.65} />
        <line x1={30} x2={770} y1={96} y2={96} stroke={F.encre2} strokeWidth={3} />
        <path d={ruban(CHEMIN_G, 0, 1)} fill="none" stroke={F.encre2} strokeWidth={8} strokeLinejoin="round" opacity={oG} />
        <path d={ruban(CHEMIN_D, 0, 1)} fill="none" stroke={F.encre2} strokeWidth={8} strokeLinejoin="round" />
        <path d={ruban(CHEMIN_G, 0, 1)} fill={F.papier} opacity={oG} />
        <path d={ruban(CHEMIN_D, 0, 1)} fill={F.papier} />
      </g>
      <path d={ruban(CHEMIN_D, 0, t, 0.44)} fill={F.orClair} stroke={F.or} strokeWidth={3} strokeLinejoin="round" />
      {posee.map((q) => {
        const c = surChemin(CHEMIN_D, q);
        const w = largeur(q) * 0.22;
        return <line key={q} x1={c.x + c.nx * w} y1={c.y + c.ny * w} x2={c.x - c.nx * w} y2={c.y - c.ny * w} stroke={F.orFonce} strokeWidth={3} opacity={q === prec && stop > 0 ? 0 : 1} />;
      })}
      <circle cx={tete.x} cy={tete.y} r={largeur(t) * 0.34 + 9 * bouge} fill={F.or} opacity={0.35 + 0.25 * bouge} />
      <circle cx={tete.x} cy={tete.y} r={largeur(t) * 0.17} fill={F.papier} stroke={F.or} strokeWidth={3} />
      <Libelle x={22} y={486} ancre="start" taille={27} opacite={oAbandon} couleur={F.encre2}>{L.abandonne}</Libelle>
      <Libelle x={640} y={520} taille={27} opacite={oTemps} couleur={F.orFonce} graisse={600}>{L.enSonTemps}</Libelle>
      {/* L'étiquette arrive en même temps que les mots : la lumière n'ira pas plus loin. */}
      <g opacity={stop} transform={`translate(${786} ${panneau.y + 14}) scale(${0.85 + 0.15 * stop})`}>
        <line x1={-86} x2={-86} y1={32} y2={104} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
        <rect x={-172} y={-30} width={172} height={62} rx={7} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <Libelle x={-86} y={10} taille={27} graisse={600}>{L.pasEncore}</Libelle>
      </g>
    </Scene>
  );
};

/* ─────────────── Plan 3 : vers le fond, l'arche ─────────────── */

const PlanArche: React.FC<PropsIllustration> = ({ f, d }) => {
  const a = d[0];
  const regard = p(f, a + 8, a + 135);
  const z = p(f, a + 165, a + 240);
  const planO = 1 - p(f, a + 218, a + 242);
  const piece = p(f, a + 208, a + 242);
  const apparait = p(f, a + 238, a + 275);
  const nomArche = p(f, a + 262, a + 290);
  const or = p(f, a + 345, a + 415);
  const aile1 = p(f, a + 450, a + 600);
  const aile2 = p(f, a + 465, a + 615);
  const lum = p(f, a + 555, a + 625);
  const ech = lerp(1, 4.3, z);
  const yRegard = lerp(884, 180, regard);
  const YSOL = 795;
  const YCOUV = YSOL - 232;
  const cible = lerp(0, 1, z);
  return (
    <Scene>
      <defs>
        <clipPath id="ch05-p3-cadre">
          <rect x={0} y={0} width={800} height={900} />
        </clipPath>
        <radialGradient id="ch05-p3-halo" gradientUnits="userSpaceOnUse" cx={400} cy={486} r={360}>
          <stop offset="0" stopColor={F.or} stopOpacity={0.75} />
          <stop offset="1" stopColor={F.or} stopOpacity={0} />
        </radialGradient>
      </defs>
      <g clipPath="url(#ch05-p3-cadre)">
        <g opacity={planO} transform={`translate(400 ${lerp(180, 450, cible)}) scale(${ech}) translate(-400 -180)`}>
          <path d="M370 860 H60 V30 H740 V860 H430" fill={F.papier} stroke={F.encre} strokeWidth={5} />
          <rect x={60} y={30} width={680} height={830} fill={F.papier} opacity={0} />
          <rect x={300} y={80} width={200} height={600} fill={F.parchemin} stroke={F.encre} strokeWidth={6} />
          <rect x={350} y={760} width={100} height={44} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
          {/* Les meubles du lieu saint, à peine indiqués. */}
          <circle cx={345} cy={480} r={13} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
          <rect x={440} y={465} width={30} height={40} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
          <rect x={385} y={340} width={30} height={30} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
          <rect x={300} y={80} width={200} height={200} fill={F.encre} stroke={F.encre} strokeWidth={6} />
          <rect x={302} y={274} width={196} height={12} fill={F.argile} opacity={1 - p(z, 0.2, 0.6)} />
          <rect x={366} y={160} width={68} height={40} fill={F.or} stroke={F.orClair} strokeWidth={3} opacity={p(f, a + 110, a + 135)} />
          <line x1={400} x2={400} y1={884} y2={yRegard + 26} stroke={F.or} strokeWidth={6} strokeDasharray="3 16" strokeLinecap="round" opacity={1 - z} />
          <circle cx={400} cy={yRegard} r={20} fill={F.orClair} stroke={F.orFonce} strokeWidth={3} opacity={regard > 0 ? 1 - p(f, a + 125, a + 140) : 0} />
          <g opacity={1 - p(z, 0, 0.18)}>
            <Libelle x={180} y={440} taille={26} couleur={F.encre2} opacite={p(f, 4, 26)}>{L.tabernacle}</Libelle>
            <Libelle x={622} y={190} taille={26} graisse={600} opacite={p(f, a + 95, a + 125)}>{L.lieuTresSaint}</Libelle>
          </g>
        </g>
        {/* À l'intérieur : quatre murs, pas une fenêtre. */}
        <g opacity={piece}>
          <rect x={20} y={30} width={760} height={840} rx={4} fill={F.encre} />
          <path d="M20 30 L70 90 V770 L20 870 Z M780 30 L730 90 V770 L780 870 Z" fill={F.cuir} opacity={0.55} />
          <path d="M20 30 L70 90 H730 L780 30 Z" fill={F.cuir} opacity={0.3} />
          <path d="M20 870 L70 770 H730 L780 870 Z" fill={F.cuir} />
          <path d="M70 90 V770 H730 V90 Z" fill="none" stroke={F.orFonce} strokeWidth={3} />
          <rect x={72} y={92} width={656} height={676} fill="url(#ch05-p3-halo)" opacity={lum} />
        </g>
        <Lumiere x={400} y={486} r={46} o={lum} rayons={13} long={250} debut={-156} arc={132} />
        <g opacity={apparait} transform={`translate(0 ${(1 - apparait) * 24})`}>
          <Arche x={400} y={YSOL} or={or} />
          <Aile x0={244} y0={YCOUV + 4} x1={72} y1={372} o={aile1} />
          <Aile x0={244} y0={YCOUV + 4} x1={396} y1={372} o={aile1} />
          <Aile x0={556} y0={YCOUV + 4} x1={728} y1={372} o={aile2} />
          <Aile x0={556} y0={YCOUV + 4} x1={404} y1={372} o={aile2} />
        </g>
        <Libelle x={400} y={851} taille={30} couleur={F.orClair} graisse={600} opacite={nomArche}>{L.arche}</Libelle>
      </g>
    </Scene>
  );
};

/* ─────────────── Plan 4 : l'homme, tabernacle ─────────────── */

const Trace: React.FC<{ x: number; y: number; w: number; h: number; o: number; couleur?: string; ep?: number }> = ({ x, y, w, h, o, couleur = F.encre, ep = 4 }) =>
  o > 0 ? <rect x={x} y={y} width={w} height={h} rx={3} fill="none" stroke={couleur} strokeWidth={ep} pathLength={1} strokeDasharray={`${o} 1`} /> : null;

const Lampe: React.FC<{ x: number; y: number; f: number; o: number }> = ({ x, y, f, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={p(o, 0, 0.3)}>
    <path d="M-40 0 H40 L24 -18 H-24 Z" fill={F.orFonce} stroke={F.encre} strokeWidth={3} />
    <line x1={0} x2={0} y1={-18} y2={-150} stroke={F.or} strokeWidth={9} />
    {[22, 44, 66].map((r) => (
      <g key={r}>
        <path d={`M${-r} -150 V${-150 + r * 0.25} A${r} ${r} 0 0 0 ${r} ${-150 + r * 0.25} V-150`} fill="none" stroke={F.or} strokeWidth={7} />
      </g>
    ))}
    {[-66, -44, -22, 0, 22, 44, 66].map((c, i) => {
      const allume = p(o, 0.25 + i * 0.09, 0.4 + i * 0.09);
      const v = 1 + 0.14 * Math.sin(f / 4 + i * 1.7);
      return (
        <g key={c} transform={`translate(${c} -156)`}>
          <rect x={-8} y={-2} width={16} height={7} rx={2} fill={F.orFonce} />
          {allume > 0 ? <path d="M0 -4 C-8 -11 -4 -20 0 -27 C4 -20 8 -11 0 -4 Z" transform={`scale(${allume} ${allume * v})`} fill={F.argile} stroke={F.orClair} strokeWidth={1.5} /> : null}
        </g>
      );
    })}
  </g>
);

const Autel: React.FC<{ x: number; y: number; f: number; o: number }> = ({ x, y, f, o }) => {
  const m = p(o, 0.35, 1);
  return (
    <g transform={`translate(${x} ${y})`} opacity={p(o, 0, 0.3)}>
      {[-20, 8].map((dx, k) => (
        <path
          key={k}
          d={`M${dx} -116 c-16 -16 16 -26 0 -42 c-16 -16 16 -26 0 -42`}
          fill="none"
          stroke={F.encre2}
          strokeWidth={5}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={`${0.45 * m} 0.2`}
          strokeDashoffset={-(f / 70 + k * 0.3) % 0.65}
          opacity={m * 0.85}
        />
      ))}
      <rect x={-44} y={-116} width={88} height={116} fill={F.or} stroke={F.encre} strokeWidth={4} />
      <rect x={-52} y={-126} width={104} height={14} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      {[-52, 52].map((c) => (
        <path key={c} d={`M${c - 8} -126 V-140 Q${c} -148 ${c + 8} -140 V-126 Z`} fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      ))}
      <rect x={-52} y={-10} width={104} height={10} fill={F.orFonce} stroke={F.encre} strokeWidth={3} />
      <rect x={-28} y={-92} width={56} height={62} fill="none" stroke={F.orFonce} strokeWidth={3} />
    </g>
  );
};

const TablePains: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g transform={`translate(${x} ${y})`} opacity={p(o, 0, 0.3)}>
    {[-68, 68].map((c) => (
      <rect key={c} x={c - 6} y={-92} width={12} height={92} fill={F.orFonce} stroke={F.encre} strokeWidth={3} />
    ))}
    <rect x={-84} y={-104} width={168} height={16} fill={F.or} stroke={F.encre} strokeWidth={4} />
    {[-38, 38].map((c, k) =>
      [0, 1, 2].map((i) => {
        const v = p(o, 0.3 + (k * 3 + i) * 0.1, 0.45 + (k * 3 + i) * 0.1);
        return v > 0 ? <ellipse key={`${c}-${i}`} cx={c} cy={-114 - i * 20} rx={32} ry={12} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} opacity={v} /> : null;
      }),
    )}
  </g>
);

const PlanHomme: React.FC<PropsIllustration> = ({ f, d }) => {
  const A = { x: 25, y: 25, w: 750, h: 850 };
  const B = { x: 85, y: 105, w: 630, h: 710 };
  const C = { x: 235, y: 175, w: 330, h: 318 };
  const tA = p(f, d[0], d[0] + 50);
  const tB = p(f, d[0] + 45, d[0] + 95);
  const tC = p(f, d[0] + 90, d[0] + 140);
  const corps = p(f, d[1], d[1] + 40);
  const ame = p(f, d[2], d[2] + 40);
  const esprit = p(f, d[3], d[3] + 40);
  const arche = p(f, d[3] + 25, d[3] + 75);
  const lum = p(f, d[3] + 120, d[3] + 180);
  const lampe = p(f, d[2] + 140, d[2] + 205);
  const autel = p(f, d[2] + 205, d[2] + 275);
  const table = p(f, d[2] + 285, d[2] + 370);
  const POTEAUX = 9;
  return (
    <Scene>
      <rect {...{ x: A.x, y: A.y, width: A.w, height: A.h }} rx={3} fill={F.papier} opacity={corps} />
      <Trace {...A} o={tA} />
      {/* Les poteaux du parvis. */}
      <g opacity={corps}>
        {Array.from({ length: POTEAUX }, (_, i) => {
          const px = A.x + 24 + ((A.w - 48) * i) / (POTEAUX - 1);
          return (
            <g key={i}>
              <circle cx={px} cy={A.y + 16} r={5} fill={F.encre2} />
              <circle cx={px} cy={A.y + A.h - 16} r={5} fill={F.encre2} />
            </g>
          );
        })}
      </g>
      <rect x={B.x} y={B.y} width={B.w} height={B.h} rx={3} fill={F.parchemin} opacity={tB} />
      <rect x={B.x} y={B.y} width={B.w} height={B.h} rx={3} fill={F.orClair} opacity={0.42 * ame} />
      <Trace {...B} o={tB} />
      <rect x={C.x} y={C.y} width={C.w} height={C.h} rx={3} fill={F.papier} opacity={tC * (1 - esprit)} />
      <rect x={C.x} y={C.y} width={C.w} height={C.h} rx={3} fill={F.orClair} opacity={esprit} />
      <Trace {...C} o={tC} />
      {/* La lumière de ce qui vient de s'allumer fait le tour du rectangle. */}
      <Trace {...A} o={corps} couleur={F.or} ep={7} />
      <Trace {...B} o={ame} couleur={F.or} ep={7} />
      <Trace {...C} o={esprit} couleur={F.or} ep={8} />

      <g opacity={corps}>
        <Libelle x={62} y={85} ancre="start" taille={30} graisse={600}>{L.corps}</Libelle>
        <Libelle x={738} y={85} ancre="end" taille={23} couleur={F.encre2}>{L.parvis}</Libelle>
      </g>
      <g opacity={ame}>
        <Libelle x={115} y={154} ancre="start" taille={30} graisse={600}>{L.ame}</Libelle>
        <Libelle x={685} y={154} ancre="end" taille={23} couleur={F.encre}>{L.lieuSaint}</Libelle>
      </g>
      <g opacity={esprit}>
        <Libelle x={255} y={217} ancre="start" taille={30} graisse={600}>{L.esprit}</Libelle>
        <Libelle x={545} y={217} ancre="end" taille={23} couleur={F.encre}>{L.tresSaint}</Libelle>
      </g>

      <Lumiere x={400} y={320} r={40} o={lum} rayons={11} long={30} debut={-170} arc={160} />
      <g opacity={arche} transform={`translate(0 ${(1 - arche) * 16})`}>
        <Arche x={400} y={478} s={0.56} />
        <Aile x0={315} y0={350} x1={248} y1={250} o={arche} />
        <Aile x0={315} y0={350} x1={396} y1={250} o={arche} />
        <Aile x0={485} y0={350} x1={552} y1={250} o={arche} />
        <Aile x0={485} y0={350} x1={404} y1={250} o={arche} />
      </g>

      <Lampe x={192} y={748} f={f} o={lampe} />
      <Libelle x={192} y={790} taille={25} opacite={p(lampe, 0, 0.3)}>{L.pensee}</Libelle>
      <Autel x={400} y={748} f={f} o={autel} />
      <Libelle x={400} y={790} taille={25} opacite={p(autel, 0, 0.3)}>{L.emotions}</Libelle>
      <TablePains x={608} y={748} o={table} />
      <Libelle x={608} y={790} taille={25} opacite={p(table, 0, 0.3)}>{L.volonte}</Libelle>
    </Scene>
  );
};

/* ─────────────── Plan 5 : trois objets ─────────────── */

const Poche: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <Piece x={-14} y={-112} r={22} />
    <Piece x={22} y={-104} r={22} />
    <path d="M-66 -104 H66 V-40 Q66 -4 0 12 Q-66 -4 -66 -40 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <path d="M-66 -86 H66" stroke={F.orClair} strokeWidth={3} strokeDasharray="9 7" />
  </g>
);

const Banque: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-72 -96 L0 -142 L72 -96 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <rect x={-66} y={-96} width={132} height={12} fill={F.filet} stroke={F.encre} strokeWidth={3} />
    {[-48, -16, 16, 48].map((c) => (
      <rect key={c} x={c - 8} y={-84} width={16} height={72} fill={F.papier} stroke={F.encre} strokeWidth={3} />
    ))}
    <rect x={-72} y={-12} width={144} height={12} fill={F.filet} stroke={F.encre} strokeWidth={3} />
    <rect x={-80} y={0} width={160} height={10} fill={F.filet} stroke={F.encre} strokeWidth={3} />
  </g>
);

const PlanObjets: React.FC<PropsIllustration> = ({ f, d }) => {
  const a = d[0];
  const couvercle = p(f, a + 90, a + 210);
  const objets = [
    { t: p(f, a + 225, a + 310), x: 150, y: 480, nom: L.parole, c: <Tables /> },
    { t: p(f, a + 358, a + 445), x: 400, y: 480, nom: L.autorite, c: <Verge x={0} y={0} h={305} courbe={8} b={1} fl={1} /> },
    { t: p(f, a + 495, a + 580), x: 650, y: 480, nom: L.provision, c: <VaseOr x={0} y={0} s={0.82} tas={0.85} /> },
  ];
  const monde = p(f, d[1] + 10, d[1] + 45);
  const efface = p(f, d[1] + 190, d[1] + 280);
  const lumiere = p(f, a + 100, a + 210);
  const dedans = p(f, d[1] + 200, d[1] + 290);
  const SOL = 800;
  const HAUT = SOL - 200 * 0.88;
  return (
    <Scene>
      {/* La lumière qui monte de l'intérieur, plus forte quand le regard y revient. */}
      <defs>
        <linearGradient id="ch05-p5-monte" gradientUnits="userSpaceOnUse" x1={0} y1={HAUT} x2={0} y2={110}>
          <stop offset="0" stopColor={F.orClair} stopOpacity={1} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={`M${400 - 150} ${HAUT} L60 110 H740 L${400 + 150} ${HAUT} Z`} fill="url(#ch05-p5-monte)" opacity={lumiere * lerp(0.5, 1, dedans)} />
      {objets.map((o, i) =>
        o.t > 0 ? (
          <g key={i} transform={`translate(${lerp(400, o.x, o.t)} ${lerp(SOL - 30, o.y, o.t)}) scale(${lerp(0.34, 1, o.t)})`}>
            {o.c}
          </g>
        ) : null,
      )}
      {objets.map((o, i) => (
        <Libelle key={i} x={o.x} y={520} taille={25} graisse={600} opacite={p(o.t, 0.94, 1)}>{o.nom}</Libelle>
      ))}
      <Arche x={400} y={SOL} s={0.88} leve={couvercle * 500} />
      <g opacity={monde * (1 - efface)}>
        <Poche x={115} y={760} />
        <Libelle x={115} y={812} taille={25} couleur={F.encre2}>{L.poches}</Libelle>
        <Banque x={688} y={760} />
        <Libelle x={688} y={812} taille={25} couleur={F.encre2}>{L.banque}</Libelle>
      </g>
    </Scene>
  );
};

/* ─────────────── Plan 6 : la verge fleurie ─────────────── */

const COURBES = [5, -7, 3, -4, 8, -3, 6, -6, 4, -8, 2, -5];

const PlanVerges: React.FC<PropsIllustration> = ({ f, d }) => {
  const ELUE = 7;
  const SOL = 322;
  const X = (i: number) => 62 + i * 61.5;
  const YARCHE = 860;
  const S = 0.8;
  const YBORD = YARCHE - 200 * S;

  // « douze verges » s'efface avant que la verge bouge : elle passe ensuite là où il était.
  const nomDouze = p(f, d[1], d[1] + 25) * (1 - p(f, d[1] + 125, d[1] + 148));
  const bourgeon = p(f, d[1] + 40, d[1] + 85);
  const fleur = p(f, d[1] + 85, d[1] + 145);
  const sort = p(f, d[1] + 150, d[1] + 210);
  const entre = p(f, d[1] + 205, d[1] + 250);
  const ouvre = p(f, d[1] + 145, d[1] + 195);
  const nomAaron = p(f, d[1] + 70, d[1] + 100);
  const position = p(f, d[2] + 40, d[2] + 80);
  // Le rang et son sol reculent dès que la verge s'avance devant eux.
  const baisse = 1 - 0.68 * p(f, d[1] + 150, d[1] + 205);
  const fruit = p(f, d[2] + 215, d[2] + 300);
  const presence = p(f, d[2] + 295, d[2] + 370);

  // La verge se lève du rang, s'avance en descendant dans son propre intervalle (sans croiser
  // ses voisines), glisse une fois passée sous le sol jusqu'au-dessus de l'arche, puis y entre.
  const YSOUS = 640;
  const vx = lerp(X(ELUE), 400, p(sort, 0.66, 1));
  const vy = lerp(lerp(SOL, SOL - 26, p(sort, 0, 0.22)), YSOUS, p(sort, 0.18, 0.72)) + lerp(0, YBORD + 62 - YSOUS, entre);
  const presente = p(f, d[0] + (ELUE * 240) / 12, d[0] + (ELUE * 240) / 12 + 26);
  const hauteur = lerp(lerp(250, 285, p(sort, 0.25, 0.66)), 325, entre) * presente;
  return (
    <Scene>
      <line x1={25} x2={775} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} opacity={baisse} />
      {COURBES.map((c, i) => {
        if (i === ELUE) return null;
        const a = d[0] + (i * 240) / 12;
        const o = p(f, a, a + 26);
        return (
          <g key={i} opacity={baisse}>
            <Verge x={X(i)} y={SOL} h={250 * o} courbe={c} o={o} />
          </g>
        );
      })}
      <Libelle x={400} y={372} taille={28} graisse={600} opacite={nomDouze}>{L.douze}</Libelle>
      <Libelle x={400} y={372} taille={26} couleur={F.encre2} opacite={position}>{L.position}</Libelle>
      <Lumiere x={400} y={YBORD + 6} r={0} o={presence} rayons={9} long={150} debut={-160} arc={140} />
      <Verge
        x={vx}
        y={vy}
        h={hauteur}
        courbe={COURBES[ELUE]}
        b={bourgeon}
        fl={fleur}
        fr={fruit}
        o={presente}
      />
      <g opacity={p(f, 0, 24)}>
        <Arche x={400} y={YARCHE} s={S} bascule={102 * ouvre} />
      </g>
      <Libelle x={X(ELUE)} y={36} taille={26} couleur={F.orFonce} graisse={600} opacite={nomAaron * (1 - p(f, d[1] + 132, d[1] + 152))}>{L.aaron}</Libelle>
      <Libelle x={468} y={492} ancre="start" taille={26} couleur={F.orFonce} graisse={600} opacite={p(entre, 0.35, 1) * (1 - p(f, d[2] + 195, d[2] + 215))}>{L.aaron}</Libelle>
      <Libelle x={468} y={492} ancre="start" taille={26} couleur={F.orFonce} graisse={600} opacite={p(f, d[2] + 225, d[2] + 255)}>{L.fruit}</Libelle>
    </Scene>
  );
};

/* ─────────────── Plan 7 : l'absence de provision ─────────────── */

/** Un pied-de-biche : origine au bout de son bec fendu ; le col se courbe, le manche descend à droite. */
const LEVIER_TRACE = 'M150 212 L64 92 C46 66 50 22 24 6 Q14 0 2 0';
const Levier: React.FC = () => (
  <g>
    <path d={LEVIER_TRACE} fill="none" stroke={F.encre} strokeWidth={17} strokeLinecap="round" strokeLinejoin="round" />
    <path d={LEVIER_TRACE} fill="none" stroke={F.encre2} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 -11 L-16 -6 L-5 0 L-16 6 L22 11 Z" fill={F.encre2} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <path d="M150 212 L108 153" fill="none" stroke={F.encre} strokeWidth={23} strokeLinecap="round" />
    <path d="M150 212 L108 153" fill="none" stroke={F.cuirClair} strokeWidth={14} strokeLinecap="round" />
    {[0.28, 0.56, 0.84].map((t) => {
      const x = lerp(150, 108, t);
      const y = lerp(212, 153, t);
      return <line key={t} x1={x - 6} y1={y + 4} x2={x + 6} y2={y - 4} stroke={F.encre} strokeWidth={3} />;
    })}
  </g>
);

const ARC_PORTE = 'M240 800 V270 A180 180 0 0 1 600 270 V800 Z';

const PlanPorte: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 40);
  const fuite = p(f, d[0] + 120, d[0] + 200);
  const respire = 0.55 + 0.45 * Math.sin(f / 22);
  const pluieDebut = d[1] - 4;
  const pluieFin = d[1] + 88;
  const plein = p(f, d[1] + 8, d[1] + 100);
  const vide = p(f, d[2] + 20, d[2] + 55);
  const ouvre = p(f, d[1] + 62, d[1] + 118);
  const ferme = p(f, d[2] + 18, d[2] + 62);
  const porte = ouvre * (1 - ferme);
  const levier = p(f, d[2] + 105, d[2] + 145);
  const force = p(f, d[2] + 155, d[2] + 195);
  const glisse = p(f, d[2] + 200, d[2] + 215);
  const retire = p(f, d[2] + 222, d[2] + 275);
  const nomOui = p(f, d[1] + 70, d[1] + 96) * (1 - p(f, d[2] + 10, d[2] + 35));
  const nomNon = p(f, d[2] + 235, d[2] + 265);
  const SERRURE = { x: 548, y: 470 };
  const NG = 20;
  return (
    <Scene>
      <defs>
        <clipPath id="ch05-p7-baie">
          <path d={ARC_PORTE} />
        </clipPath>
      </defs>
      <path d="M40 800 H760 L790 888 H10 Z" fill={F.filet} opacity={0.5 * entree} />
      <line x1={40} x2={760} y1={800} y2={800} stroke={F.encre} strokeWidth={5} opacity={entree} />
      <g opacity={entree}>
        <path d="M200 800 V270 A220 220 0 0 1 640 270 V800 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        {[-52, -26, 0, 26, 52].map((a) => (
          <line key={a} x1={420 + Math.sin(rad(a)) * 180} y1={270 - Math.cos(rad(a)) * 180} x2={420 + Math.sin(rad(a)) * 220} y2={270 - Math.cos(rad(a)) * 220} stroke={F.encre2} strokeWidth={3} transform="translate(0 0)" />
        ))}
        <g clipPath="url(#ch05-p7-baie)">
          <rect x={240} y={90} width={360} height={710} fill={F.orClair} />
          {Array.from({ length: 13 }, (_, i) => {
            const a = rad(-180 + i * 15);
            return <line key={i} x1={420} y1={560} x2={420 + Math.cos(a) * 620} y2={560 + Math.sin(a) * 620} stroke={F.or} strokeWidth={10} opacity={porte} />;
          })}
          <circle cx={420} cy={560} r={130 * porte} fill={F.papier} />
          {/* Le battant, charnière à gauche. */}
          <g transform={`translate(240 0) scale(${1 - 0.88 * porte} 1) translate(-240 0)`}>
            <rect x={240} y={80} width={360} height={720} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
            {[300, 360, 420, 480, 540].map((x) => (
              <line key={x} x1={x} x2={x} y1={80} y2={800} stroke={F.encre} strokeWidth={3} opacity={0.65} />
            ))}
            {[260, 600].map((y) => (
              <rect key={y} x={240} y={y} width={360} height={24} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
            ))}
            <rect x={SERRURE.x - 22} y={SERRURE.y - 42} width={44} height={84} rx={8} fill={F.or} stroke={F.encre} strokeWidth={4} />
            <circle cx={SERRURE.x} cy={SERRURE.y - 8} r={8} fill={F.encre} />
            <rect x={SERRURE.x - 3.5} y={SERRURE.y - 6} width={7} height={22} fill={F.encre} />
          </g>
        </g>
        <path d={ARC_PORTE} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      </g>
      {/* La présence : un mince filet de lumière sous la porte fermée, qui respire. */}
      <rect x={244} y={790} width={352} height={8} fill={F.orClair} opacity={(1 - porte) * fuite * (0.35 + 0.65 * respire)} />
      <VaseOr x={420} y={868} s={0.74} tas={plein * (1 - vide)} opacite={p(f, 24, 60)} />
      {Array.from({ length: NG }, (_, i) => {
        const debut = pluieDebut + (i * (pluieFin - pluieDebut)) / NG;
        const t = (f - debut) / 30;
        if (t <= 0 || t >= 1) return null;
        const dx = Math.sin(i * 1.9) * 44;
        return <Grain key={i} x={420 + dx * (1 - 0.6 * t)} y={40 + t * t * 620} r={10} rot={i * 41 + f * 2} o={Math.min(1, t * 6)} />;
      })}
      {/* Le levier : il monte d'en bas vers la serrure, force, glisse, et se retire vers le bas. */}
      {levier > 0 && retire < 1 ? (
        <g
          opacity={levier * (1 - retire)}
          transform={`translate(${SERRURE.x + 6 + (1 - levier) * 36 + retire * 30 + glisse * 14} ${SERRURE.y + 2 + (1 - levier) * 110 + retire * 80 + glisse * 74}) rotate(${-force * 7 + glisse * 16})`}
        >
          <Levier />
        </g>
      ) : null}
      {glisse > 0 && glisse < 1 ? (
        <g stroke={F.encre} strokeWidth={4} strokeLinecap="round" opacity={1 - glisse}>
          <line x1={SERRURE.x - 26} y1={SERRURE.y + 8} x2={SERRURE.x - 46} y2={SERRURE.y} />
          <line x1={SERRURE.x - 26} y1={SERRURE.y + 26} x2={SERRURE.x - 48} y2={SERRURE.y + 30} />
        </g>
      ) : null}
      <Libelle x={100} y={420} taille={27} graisse={600} couleur={F.orFonce} opacite={nomOui}>{L.pourvoit}</Libelle>
      <Libelle x={100} y={404} taille={26} graisse={600} opacite={nomNon}>{L.absence1}</Libelle>
      <Libelle x={100} y={438} taille={26} graisse={600} opacite={nomNon}>{L.absence2}</Libelle>
    </Scene>
  );
};

/* ─────────────── Plan 8 : la manne sans Dieu ─────────────── */

/** Point d'une courbe de Bézier quadratique. */
const q2 = (a: Pt, b: Pt, c: Pt, t: number): Pt => ({
  x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * b.x + t * t * c.x,
  y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * b.y + t * t * c.y,
});

const Fleche: React.FC<{ a: Pt; b: Pt; c: Pt; t: number; couleur: string; piece?: boolean }> = ({ a, b, c, t, couleur, piece = false }) => {
  const debut = Math.max(0, t - 0.28);
  const pts = Array.from({ length: 13 }, (_, i) => q2(a, b, c, lerp(debut, t, i / 12)));
  const tete = pts[12];
  const av = pts[11];
  const ang = (Math.atan2(tete.y - av.y, tete.x - av.x) * 180) / Math.PI;
  return (
    <g>
      <polyline points={pts.map((q) => `${q.x},${q.y}`).join(' ')} fill="none" stroke={couleur} strokeWidth={7} strokeLinecap="round" />
      <path d="M16 0 L-8 -13 L-8 13 Z" transform={`translate(${tete.x} ${tete.y}) rotate(${ang})`} fill={couleur} />
      {piece ? <Piece x={tete.x - 8} y={tete.y - 26} r={21} /> : null}
    </g>
  );
};

const PIECES_TAS: [number, number][] = [[-30, 0], [28, -2], [0, -6], [-14, -28], [16, -28], [1, -50]];
const FEUILLES = [
  { t: 0.4, c: -1, chute: 0 }, { t: 0.51, c: 1, chute: 1 }, { t: 0.62, c: -1, chute: 2 }, { t: 0.73, c: 1, chute: 3 }, { t: 0.84, c: -1, chute: 4 }, { t: 0.95, c: 1, chute: 5 },
];

const PlanManne: React.FC<PropsIllustration> = ({ f, d }) => {
  const YVASE = 830;
  const S = 0.92;
  const BOUCHE = YVASE - 292 * S;
  const allers = [0, 1, 2, 3, 4, 5];
  const PERIODE = 118;
  const debutK = (k: number) => d[0] + 8 + k * 56;
  const G = { x: 112, y: 300 };
  const Dr = { x: 688, y: 300 };
  const arcs = 1 - p(f, d[1], d[1] + 45);
  const posees = allers.filter((k) => f >= debutK(k) + PERIODE).length;
  const quitte = p(f, d[1] + 395, d[1] + 470);
  const croit = p(f, d[1], d[1] + 100);
  const feuilles = p(f, d[1] + 45, d[1] + 125);
  const seche = p(f, d[1] + 145, d[1] + 320);
  const HR = 340;
  const incline = seche * 13;
  const nomSans = p(f, d[0] + 285, d[0] + 318);
  const nomFruit = p(f, d[1] + 140, d[1] + 170);
  const rameau = (t: number) => ({ x: 400 + 18 * Math.sin(t * 2.4) , y: BOUCHE + 8 - HR * t * croit });
  const pts = Array.from({ length: 17 }, (_, i) => rameau(i / 16));
  const trace = pts.map((q) => `${q.x},${q.y}`).join(' ');
  return (
    <Scene>
      {/* Les deux pôles : ses relations à gauche, son leadership à droite. */}
      <g opacity={p(f, 0, 26) * lerp(0.5, 1, arcs)}>
        <g transform={`translate(${G.x} ${G.y})`}>
          <path d="M-34 22 L0 -28 L34 22 Z" fill="none" stroke={F.encre} strokeWidth={4} />
          {[[-34, 22], [0, -28], [34, 22]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r={16} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          ))}
        </g>
        <Libelle x={G.x} y={G.y - 62} taille={26} graisse={600}>{L.relations}</Libelle>
        <g transform={`translate(${Dr.x} ${Dr.y})`}>
          <path d="M-42 30 V-22 L-20 4 L0 -32 L20 4 L42 -22 V30 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <line x1={-42} x2={42} y1={16} y2={16} stroke={F.encre} strokeWidth={4} />
        </g>
        <Libelle x={Dr.x} y={Dr.y - 62} taille={26} graisse={600}>{L.leadership}</Libelle>
      </g>
      <g opacity={arcs * p(f, 6, 30)}>
        {[G, Dr].map((c, k) => {
          const s = k === 0 ? -1 : 1;
          return (
            <path
              key={k}
              d={`M${400 + s * 22} ${BOUCHE - 8} Q${400 + s * 110} 215 ${c.x - s * 40} ${c.y - 4} M${c.x} ${c.y + 42} Q${c.x + s * 40} ${BOUCHE + 40} ${400 + s * 44} ${BOUCHE - 8}`}
              fill="none"
              stroke={F.filet}
              strokeWidth={4}
              strokeDasharray="4 14"
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <VaseOr x={400} y={YVASE} s={S} terne opacite={p(f, 0, 26)} />
      {/* Le rameau, planté dans l'ouverture : il monte, se couvre de feuilles, ne porte rien, et sèche. */}
      {croit > 0 ? (
        <g transform={`rotate(${incline} 400 ${BOUCHE})`}>
          <polyline points={trace} fill="none" stroke={F.encre} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          <polyline points={trace} fill="none" stroke={lerpCouleur(seche)} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
          {FEUILLES.map((fe, i) => {
            const q = rameau(fe.t);
            const n = 24 * p(feuilles, i / 7, (i + 2) / 7);
            return <line key={i} x1={q.x} y1={q.y} x2={q.x + fe.c * n} y2={q.y - n * 0.7} stroke={lerpCouleur(seche)} strokeWidth={5} strokeLinecap="round" />;
          })}
          {FEUILLES.map((fe, i) => {
            const o = p(feuilles, i / 7, (i + 2) / 7);
            const q = rameau(fe.t);
            const chute = p(f, d[1] + 190 + fe.chute * 28, d[1] + 262 + fe.chute * 28);
            const tombe = chute * chute;
            const penche = seche * 62;
            return (
              <g
                key={i}
                opacity={o * (1 - p(chute, 0.7, 1))}
                transform={`translate(${q.x + fe.c * chute * 60} ${q.y + tombe * 150}) rotate(${fe.c * (penche - 18) + chute * 80})`}
              >
                <path d={`M0 0 Q${fe.c * 26} -20 ${fe.c * 58} 0 Q${fe.c * 26} 20 0 0 Z`} fill={seche > 0.5 ? F.filet : F.cuirClair} stroke={F.encre} strokeWidth={3} />
              </g>
            );
          })}
        </g>
      ) : null}
      <LevreVase x={400} y={YVASE} s={S} terne opacite={p(f, 0, 26)} />
      {PIECES_TAS.slice(0, posees).map(([x, y], i) => (
        <Piece key={i} x={400 + x} y={BOUCHE - 18 + y} r={22} opacite={1 - p(quitte, i / 7, (i + 2) / 7)} />
      ))}
      {allers.map((k) => {
        const t = f - debutK(k);
        if (t <= 0 || t >= PERIODE) return null;
        const s = k % 2 === 0 ? -1 : 1;
        const c = s < 0 ? G : Dr;
        const a = { x: 400 + s * 22, y: BOUCHE - 8 };
        const fin = { x: c.x - s * 40, y: c.y - 4 };
        const repart = { x: c.x, y: c.y + 42 };
        const arrive = { x: 400 + s * 44, y: BOUCHE - 8 };
        const moitie = PERIODE / 2;
        return t < moitie ? (
          <Fleche key={k} a={a} b={{ x: 400 + s * 110, y: 215 }} c={fin} t={lerp(0.02, 1, t / moitie)} couleur={F.encre2} />
        ) : (
          <Fleche key={k} a={repart} b={{ x: c.x + s * 40, y: BOUCHE + 40 }} c={arrive} t={lerp(0.02, 1, (t - moitie) / moitie)} couleur={F.orFonce} piece />
        );
      })}
      <Libelle x={400} y={872} taille={30} graisse={600} opacite={nomSans}>{L.sansDieu}</Libelle>
      <Libelle x={612} y={170} taille={26} couleur={F.encre2} graisse={600} opacite={nomFruit}>{L.sansFruit}</Libelle>
    </Scene>
  );
};

/** Du bois encore vif au bois mort : trois teintes de la palette, sans mélange. */
const lerpCouleur = (seche: number) => (seche < 0.4 ? F.cuirClair : seche < 0.75 ? F.cuir : F.encre2);

/* ─────────────── Fin ─────────────── */

const Fin: React.FC<PropsIllustration> = ({ f }) => {
  const eclat = p(f, 30, 90);
  const X = 490;
  const CY = 500;
  const b = 1 + 0.02 * Math.sin(f / 14) * eclat;
  return (
    <Scene>
      <Thermometre x={100} y={170} h={520} l={72} niveau={0.72 + 0.28 * p(f, 0, 60)} />
      <circle cx={X} cy={CY} r={236 * eclat} fill={F.orClair} opacity={0.5} />
      {Array.from({ length: 22 }, (_, i) => {
        const a = rad((i * 360) / 22 + f * 0.12);
        const r0 = 248;
        const r1 = r0 + (i % 2 === 0 ? 50 : 30) * eclat;
        return <line key={i} x1={X + Math.cos(a) * r0} y1={CY + Math.sin(a) * r0} x2={X + Math.cos(a) * r1} y2={CY + Math.sin(a) * r1} stroke={F.or} strokeWidth={7} strokeLinecap="round" opacity={eclat} />;
      })}
      <g transform={`translate(${X} 712) scale(${b}) translate(${-X} -712)`}>
        <VaseOr x={X} y={712} s={1.12} tas={1} />
      </g>
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: Ouverture,
  p2: PlanChemin,
  p3: PlanArche,
  p4: PlanHomme,
  p5: PlanObjets,
  p6: PlanVerges,
  p7: PlanPorte,
  p8: PlanManne,
  fin: Fin,
};

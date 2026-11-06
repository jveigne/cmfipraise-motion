import React from 'react';
import { interpolateColors } from 'remotion';
import { Coeur, IlluFin, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES as L } from './libelles';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cubique = (t: number, a: number, b: number, c: number, e: number) => (1 - t) ** 3 * a + 3 * (1 - t) ** 2 * t * b + 3 * (1 - t) * t ** 2 * c + t ** 3 * e;
const rad = (a: number) => (a * Math.PI) / 180;

/* ------------------------------------------------------------------ Briques du chapitre ------- */

const Graine: React.FC<{ x: number; y: number; s?: number; rot?: number; rempli?: string; opacite?: number }> = ({ x, y, s = 1, rot = 0, rempli = F.or, opacite = 1 }) => (
  <path
    transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}
    d="M0 -17 C9 -12 12 5 0 16 C-12 5 -9 -12 0 -17 Z"
    fill={rempli}
    stroke={F.orFonce}
    strokeWidth={2.5 / Math.max(s, 0.4)}
    opacity={opacite}
  />
);

/**
 * Un épi : la tige se courbe avec `sec`, et ses grains se vident (ils restent en place, creux).
 * `g` fait pousser, `charge` (0 à 1) fait apparaître les grains un à un, de bas en haut.
 */
const Epi: React.FC<{ x: number; y: number; h: number; g: number; rangs?: number; charge?: number; sec?: number; sens?: number; taille?: number; lf?: number }> = ({ x, y, h, g, rangs = 6, charge = 1, sec = 0, sens = 1, taille = 1, lf = 0.24 }) => {
  if (g <= 0) return null;
  const H = h * g;
  const bx = x + sens * sec * H * 0.3;
  const by = y - H * (1 - 0.3 * sec);
  const cx = x;
  const cy = y - H * 0.72;
  const point = (t: number) => ({
    x: (1 - t) ** 2 * x + 2 * (1 - t) * t * cx + t ** 2 * bx,
    y: (1 - t) ** 2 * y + 2 * (1 - t) * t * cy + t ** 2 * by,
  });
  const angle = (t: number) => {
    const dx = 2 * (1 - t) * (cx - x) + 2 * t * (bx - cx);
    const dy = 2 * (1 - t) * (cy - y) + 2 * t * (by - cy);
    return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  };
  const tige = interpolateColors(sec, [0, 1], [F.orFonce, F.encre2]);
  const grain = interpolateColors(sec, [0, 1], [F.or, F.parchemin]);
  const feuille = interpolateColors(sec, [0, 1], [F.or, F.filet]);
  const ech = taille * (1 - 0.3 * sec) * Math.min(1, 0.45 + g * 0.55);
  const visibles = charge * rangs;
  return (
    <g>
      <path d={`M${x} ${y} Q${cx} ${cy} ${bx} ${by}`} fill="none" stroke={tige} strokeWidth={5 * taille} strokeLinecap="round" />
      {[0.22, 0.38].map((t, i) => {
        const q = point(t);
        const c = i === 0 ? -1 : 1;
        const l = H * lf;
        return <path key={t} d={`M${q.x} ${q.y} Q${q.x + c * l * 0.8} ${q.y - l * (0.75 - sec * 0.6)} ${q.x + c * l * 1.25} ${q.y - l * (0.2 - sec * 1.1)} Q${q.x + c * l * 0.5} ${q.y - l * (0.2 - sec * 0.5)} ${q.x} ${q.y} Z`} fill={feuille} stroke={tige} strokeWidth={2.5} />;
      })}
      {Array.from({ length: rangs }, (_, k) => {
        const o = Math.max(0, Math.min(1, visibles - k));
        if (o <= 0) return null;
        const t = 0.56 + (0.42 * k) / Math.max(1, rangs - 1);
        const q = point(t);
        const a = angle(t);
        return (
          <g key={k} opacity={o}>
            <Graine x={q.x - Math.cos(rad(a)) * 9 * ech} y={q.y - Math.sin(rad(a)) * 9 * ech} s={ech * o} rot={a - 24} rempli={grain} />
            <Graine x={q.x + Math.cos(rad(a)) * 9 * ech} y={q.y + Math.sin(rad(a)) * 9 * ech} s={ech * o} rot={a + 24} rempli={grain} />
          </g>
        );
      })}
      {visibles >= rangs ? <Graine x={bx} y={by - 4} s={ech} rot={angle(1)} rempli={grain} /> : null}
    </g>
  );
};

/** Rayons de lumière, sur un arc. */
const Rayons: React.FC<{ x: number; y: number; r0: number; r1: number; n?: number; a0?: number; a1?: number; o?: number; ep?: number }> = ({ x, y, r0, r1, n = 13, a0 = -170, a1 = -10, o = 1, ep = 6 }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const a = rad(lerp(a0, a1, n === 1 ? 0.5 : i / (n - 1)));
        const fin = i % 2 === 0 ? r1 : lerp(r0, r1, 0.72);
        return <line key={i} x1={x + Math.cos(a) * r0} y1={y + Math.sin(a) * r0} x2={x + Math.cos(a) * fin} y2={y + Math.sin(a) * fin} stroke={F.or} strokeWidth={ep} strokeLinecap="round" />;
      })}
    </g>
  );

/** Un paquet noué, posé sur sa base (x au centre, y en bas). */
const Paquet: React.FC<{ x: number; y: number; l: number; h: number; lumiere?: number; opacite?: number }> = ({ x, y, l, h, lumiere = 0, opacite = 1 }) => {
  const corps = interpolateColors(lumiere, [0, 1], [F.cuirClair, F.orClair]);
  const lien = interpolateColors(lumiere, [0, 1], [F.papier, F.argile]);
  const e = Math.max(8, l * 0.11);
  return (
    <g opacity={opacite}>
      <rect x={x - l / 2} y={y - h} width={l} height={h} rx={5} fill={corps} stroke={F.encre} strokeWidth={4} />
      <rect x={x - e / 2} y={y - h} width={e} height={h} fill={lien} stroke={F.encre} strokeWidth={1.5} />
      <rect x={x - l / 2} y={y - h / 2 - e / 2} width={l} height={e} fill={lien} stroke={F.encre} strokeWidth={1.5} />
      <path d={`M${x} ${y - h} C${x - l * 0.32} ${y - h - l * 0.26} ${x - l * 0.36} ${y - h + l * 0.02} ${x} ${y - h} C${x + l * 0.32} ${y - h - l * 0.26} ${x + l * 0.36} ${y - h + l * 0.02} ${x} ${y - h} Z`} fill={lien} stroke={F.encre} strokeWidth={3} />
    </g>
  );
};

/** Un feuillage dont les touffes se fondent en une seule masse. */
const TOUFFES = [[0, 0, 1], [-0.62, 0.14, 0.72], [0.62, 0.14, 0.72], [-0.34, -0.48, 0.7], [0.36, -0.46, 0.7], [-0.3, 0.46, 0.62], [0.32, 0.46, 0.62]];
const Feuillage: React.FC<{ x: number; y: number; r: number; balance?: number }> = ({ x, y, r, balance = 0 }) => (
  <g>
    {TOUFFES.map(([a, b, c], i) => (
      <circle key={i} cx={x + a * r + balance * (i % 2 === 0 ? 1 : -1)} cy={y + b * r} r={c * r * 0.72} fill={F.or} stroke={F.orFonce} strokeWidth={8} />
    ))}
    {TOUFFES.map(([a, b, c], i) => (
      <circle key={i} cx={x + a * r + balance * (i % 2 === 0 ? 1 : -1)} cy={y + b * r} r={c * r * 0.72 - 3} fill={F.or} />
    ))}
    {TOUFFES.slice(1).map(([a, b, c], i) => (
      <circle key={i} cx={x + a * r - c * r * 0.2 + balance * 0.6} cy={y + b * r - c * r * 0.2} r={c * r * 0.26} fill={F.orClair} opacity={0.75} />
    ))}
  </g>
);

/** La terre, de y jusqu'au bas de la scène. */
const Terre: React.FC<{ y: number; h?: number; x?: number; l?: number }> = ({ y, h = 900 - y - 10, x = 0, l = 800 }) => (
  <g>
    <rect x={x} y={y} width={l} height={h} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    {Array.from({ length: Math.floor(l / 46) }, (_, i) => (
      <circle key={i} cx={x + 22 + i * 46 + (i % 3) * 7} cy={y + 18 + ((i * 37) % Math.max(10, h - 30))} r={3 + (i % 3)} fill={F.cuirClair} />
    ))}
  </g>
);

/* ------------------------------------------------------------------ Plan 1 : titre ------------ */

const IlluTitre: React.FC<PropsIllustration> = ({ f }) => {
  const chute = p(f, 96, 132);
  const mot = p(f, 4, 26);
  const H = 300;
  const Y = 340;
  const sillon = (i: number, d: number) => {
    // Bandes en perspective : elles convergent vers le haut.
    const haut = 145 + ((i + d) * 190) / 9;
    const bas = 20 + ((i + d) * 440) / 9;
    return { haut, bas };
  };
  return (
    <Scene>
      <Libelle x={240} y={270} taille={62} graisse={600} opacite={mot}>{L.neufLois}</Libelle>
      <path d={`M145 ${Y} H335 L460 ${Y + H + 40} H20 Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {Array.from({ length: 9 }, (_, i) => {
        const o = p(f, 22 + i * 7, 42 + i * 7);
        const a = sillon(i, 0.2);
        const b = sillon(i, 0.8);
        return <path key={i} d={`M${a.haut} ${Y + 2} H${b.haut} L${b.bas} ${Y + H + 38} H${a.bas} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={2} opacity={o} />;
      })}
      <Thermometre x={630} y={170} h={520} l={72} niveau={0.08 + 0.14 * p(f, 128, 175)} />
      {chute < 1 ? <Piece x={630} y={44 + chute * 190} r={32} opacite={p(f, 80, 96)} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 2 : la promesse ------ */

const IlluPromesse: React.FC<PropsIllustration> = ({ f, d }) => {
  const u = p(f, 6, d[0] + 40);
  const fente = p(f, 0, 22);
  const coffre = p(f, d[0] + 24, d[0] + 66);
  const secousse = p(f, d[2] + 20, d[2] + 40) * (1 - p(f, d[2] + 180, d[2] + 240));
  const angle = Math.sin((f - d[2]) / 4.2) * 2.4 * secousse;
  const honte = p(f, d[2] + 10, d[2] + 60);
  const bas = 70 + 262 * u;
  const lignes = [132, 164, 196, 228, 260, 292];
  return (
    <Scene>
      <rect x={150} y={70} width={500} height={bas - 70} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      {lignes.map((y, i) => (bas > y + 6 ? <line key={y} x1={195} x2={i === lignes.length - 1 ? 430 : 605 - (i % 2) * 30} y1={y} y2={y} stroke={F.filet} strokeWidth={6} strokeLinecap="round" /> : null))}
      <rect x={128} y={bas - 24} width={544} height={48} rx={24} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={128} y={46} width={544} height={48} rx={24} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      {/* Le sceau de cire se fend quand la lettre s'ouvre. */}
      {[-1, 1].map((s) => (
        <path
          key={s}
          transform={`translate(${400 + s * 13 * fente} 70) rotate(${s * 9 * fente})`}
          d={`M0 -36 A36 36 0 0 ${s > 0 ? 1 : 0} 0 36 L${s * 6} 12 L${s * -3} 0 L${s * 6} -14 Z`}
          fill={F.argile}
          stroke={F.encre}
          strokeWidth={3}
        />
      ))}
      {/* Les neuf graines descendent de la lettre et s'alignent. */}
      {Array.from({ length: 9 }, (_, i) => {
        const t = p(f, d[1] + 14 + i * 11, d[1] + 52 + i * 11);
        if (t <= 0) return null;
        return <Graine key={i} x={lerp(400, 160 + i * 60, t)} y={lerp(345, 392, t)} s={1.05} rot={(1 - t) * 90} opacite={Math.min(1, t * 4)} />;
      })}
      {/* Le coffret, ouvert et vide. */}
      <g opacity={coffre} transform={`translate(0 ${(1 - coffre) * 40}) rotate(${angle} 400 812)`}>
        <path d="M185 432 H615 L590 506 H210 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M250 432 V506 M550 432 V506" stroke={F.or} strokeWidth={9} />
        <path d="M210 506 H590 L632 572 H168 Z" fill={F.encre} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <path d="M232 516 H568 L590 552 H210 Z" fill={F.cuir} opacity={0.6} />
        <rect x={168} y={572} width={464} height={240} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <path d="M232 572 V812 M568 572 V812" stroke={F.or} strokeWidth={12} />
        <rect x={194} y={640} width={412} height={92} rx={8} fill={interpolateColors(honte, [0, 1], [F.papier, F.argile])} stroke={F.encre} strokeWidth={4} />
        <Libelle x={400} y={698} taille={38} graisse={600} couleur={interpolateColors(honte, [0, 1], [F.encre, F.papier])}>{L.grandDon}</Libelle>
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 3 : les trois lois ---- */

const IlluTroisLois: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 770;
  const estompe = 1 - 0.55 * p(f, d[3], d[3] + 40);
  // Quantités : deux graines, deux épis ; six graines, six épis.
  const PEU = [72, 192];
  const BEAUCOUP = [296, 332, 368, 404, 440, 476];
  const graineTombe = (a: number, i: number) => p(f, a + i * 7, a + 28 + i * 7);
  // Qualité : les mots versent sur la graine.
  const graineGrandit = p(f, d[1] + 40, d[2] - 40);
  const mots = p(f, d[1] + 10, d[1] + 40) * (1 - p(f, d[2] - 25, d[2]));
  const halo = graineGrandit * (1 - p(f, d[2], d[2] + 40));
  // Proportionnalité : une seule graine, un épi chargé.
  const enfouie = p(f, d[2], d[2] + 26);
  const pousse = p(f, d[2] + 20, d[2] + 120);
  const charge = p(f, d[2] + 70, d[3] - 20);
  // La flèche quitte sa cible, puis l'épi sèche.
  const cible = p(f, d[3], d[3] + 30);
  const quitte = p(f, d[3] + 130, d[3] + 190);
  const sec = p(f, d[3] + 190, d[3] + 370);
  const tipX = lerp(592, 360, quitte);
  const tipY = lerp(130, 44, quitte);
  const rotF = lerp(0, -20, quitte);
  return (
    <Scene>
      <Terre y={SOL} h={80} x={10} l={245} />
      <Terre y={SOL} h={80} x={278} l={245} />
      <Terre y={SOL} h={80} x={546} l={244} />
      <g opacity={estompe}>
        {PEU.map((x, i) => {
          const t = graineTombe(d[0] + 4, i);
          return (
            <g key={x}>
              {t < 1 ? <Graine x={x} y={lerp(330, SOL + 6, t)} opacite={Math.min(1, t * 5)} /> : null}
              <Epi x={x} y={SOL} h={250} g={p(f, d[0] + 44 + i * 10, d[0] + 110 + i * 10)} rangs={4} lf={0.2} />
            </g>
          );
        })}
        {BEAUCOUP.map((x, i) => {
          const t = graineTombe(d[0] + 96, i);
          return (
            <g key={x}>
              {t < 1 ? <Graine x={x} y={lerp(290, SOL + 6, t)} opacite={Math.min(1, t * 5)} /> : null}
              <Epi x={x} y={SOL} h={340 + (i % 2) * 34} g={p(f, d[0] + 128 + i * 7, d[0] + 196 + i * 7)} rangs={6} taille={0.86} lf={0.075} />
            </g>
          );
        })}
      </g>
      {/* La parcelle de droite. */}
      {L.qualite.map((m, i) => {
        const a = d[1] + 40 + i * 70;
        const o = p(f, a, a + 18);
        const y = 150 + i * 56;
        return (
          <g key={m} opacity={mots * o}>
            <Libelle x={668} y={y} taille={30}>{m}</Libelle>
            {Array.from({ length: 6 }, (_, k) => {
              const t = ((f - a) / 90 + k / 6) % 1;
              const yy = lerp(285, SOL - 34, Math.max(0, t));
              return f > a ? <circle key={k} cx={668 + Math.sin(t * 7 + i) * (1 - t) * 18} cy={yy} r={5} fill={F.or} opacity={(1 - t) * 0.9} /> : null;
            })}
          </g>
        );
      })}
      {halo > 0 ? <circle cx={668} cy={SOL - 16} r={24 + halo * 34} fill={F.orClair} opacity={0.55 * halo} /> : null}
      {enfouie < 1 ? <Graine x={668} y={lerp(SOL - 18, SOL + 14, enfouie)} s={1 + graineGrandit * 0.75} opacite={p(f, d[1] - 14, d[1] + 10) * (1 - enfouie * 0.4)} /> : null}
      <Epi x={668} y={SOL} h={500} g={pousse} rangs={14} charge={charge} sec={sec} sens={-1} taille={1.28} lf={0.13} />
      {/* La cible : la personne à qui l'on donne, par amour. */}
      <g opacity={cible * (1 - 0.45 * sec)}>
        <circle cx={668} cy={130} r={96} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <circle cx={668} cy={130} r={68} fill="none" stroke={F.filet} strokeWidth={8} />
        <Coeur x={668} y={134} s={0.72} />
      </g>
      <g opacity={cible} transform={`translate(${tipX} ${tipY}) rotate(${rotF})`}>
        <line x1={-250} y1={0} x2={-20} y2={0} stroke={F.encre} strokeWidth={8} strokeLinecap="round" />
        <path d="M0 0 L-34 -17 L-26 0 L-34 17 Z" fill={F.encre} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
        <path d="M-250 0 L-274 -14 M-250 0 L-274 14 M-226 0 L-250 -14 M-226 0 L-250 14" stroke={F.argile} strokeWidth={6} strokeLinecap="round" />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 4 : les arachides ---- */

const Arachide: React.FC<{ x: number; y: number; s?: number; rot?: number; opacite?: number }> = ({ x, y, s = 1, rot = 0, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacite}>
    <path d="M-44 0 C-44 -26 -14 -30 0 -14 C14 -30 44 -26 44 0 C44 26 14 30 0 14 C-14 30 -44 26 -44 0 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={3.5 / s} />
    <path d="M-32 -12 C-26 -2 -26 4 -32 12 M-16 -18 C-10 -6 -10 6 -16 18 M16 -18 C10 -6 10 6 16 18 M32 -12 C26 -2 26 4 32 12 M-38 0 H-6 M6 0 H38" fill="none" stroke={F.or} strokeWidth={2.5 / s} strokeLinecap="round" />
  </g>
);

const PlantArachide: React.FC<{ x: number; sol: number; g: number; h: number }> = ({ x, sol, g, h }) =>
  g <= 0 ? null : (
    <g>
      <path d={`M${x} ${sol + 8} V${sol - h * g}`} stroke={F.orFonce} strokeWidth={7} strokeLinecap="round" />
      {[-1, 1].map((c) =>
        [0.48, 0.85].map((t) => {
          const lx = x + c * 37 * g;
          const ly = sol - h * g * t;
          return <ellipse key={`${c}${t}`} cx={lx} cy={ly} rx={35 * g} ry={14 * g} fill={F.or} stroke={F.orFonce} strokeWidth={2.5} transform={`rotate(${c * -18} ${lx} ${ly})`} />;
        }),
      )}
    </g>
  );

const IlluArachides: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 500;
  const ROW = 110;
  const XS = [70, 180, 290, 400, 510, 620, 730];
  const belle = 2;
  const seconde = 4;
  const entree = (i: number) => p(f, i * 5, 24 + i * 5);
  const marque = p(f, d[0] + 40, d[0] + 90);
  // La plus belle descend dans le sillon (phrase 2) et se multiplie.
  const descend = p(f, d[1], d[1] + 50);
  const pousse = p(f, d[1] + 55, d[1] + 130);
  const SOUS = [[-168, 612], [-58, 600], [56, 600], [166, 612], [-112, 700], [0, 690], [112, 700], [-58, 790], [58, 790]];
  // L'assiette approche ; la graine s'écarte vers la terre (phrase 3).
  const quitte = p(f, d[2] + 10, d[2] + 60);
  const assiette = p(f, d[2] + 40, d[2] + 120);
  const ecart = p(f, d[2] + 108, d[2] + 170);
  const terre = p(f, d[2] + 170, d[2] + 220);
  const sx2 = lerp(lerp(XS[seconde], 490, quitte), 450, ecart);
  const sy2 = lerp(lerp(ROW, 305, quitte), 430, ecart);
  const X1 = 230;
  return (
    <Scene>
      <Terre y={SOL} h={385} />
      {/* Le sillon de la première, puis celui de la seconde. */}
      <path d={`M${X1 - 56} ${SOL + 2} Q${X1} ${SOL + 44 * Math.max(descend, 0.5)} ${X1 + 56} ${SOL + 2} Z`} fill={F.encre} />
      <path d={`M394 ${SOL + 2} Q450 ${SOL + 44 * ecart} 506 ${SOL + 2} Z`} fill={F.encre} opacity={ecart} />
      {/* La rangée. */}
      {XS.filter((_, i) => i !== belle && i !== seconde).map((x) => {
        const i = XS.indexOf(x);
        return <Arachide key={x} x={x} y={ROW + (1 - entree(i)) * -30} s={0.86} rot={(i * 37) % 13 - 6} opacite={entree(i)} />;
      })}
      {marque > 0 && descend < 1 ? <ellipse cx={XS[belle]} cy={ROW} rx={70} ry={56} fill="none" stroke={F.or} strokeWidth={6} opacity={marque * (1 - descend)} /> : null}
      {/* Tige et récolte sous la terre. */}
      <PlantArachide x={X1} sol={SOL} g={pousse} h={160} />
      {pousse > 0 ? <path d={`M${X1} ${SOL + 6} V${SOL + 6 + 50 * pousse}`} stroke={F.orClair} strokeWidth={4} /> : null}
      {SOUS.map(([dx, y], i) => {
        const a = d[1] + 100 + i * 20;
        const o = p(f, a, a + 22);
        if (o <= 0) return null;
        return (
          <g key={i}>
            <line x1={X1} y1={SOL + 56} x2={X1 + dx} y2={y} stroke={F.orClair} strokeWidth={2.5} opacity={o} />
            <Arachide x={X1 + dx * o} y={lerp(SOL + 56, y, o)} s={0.98 * o} rot={(i * 53) % 40 - 20} />
          </g>
        );
      })}
      <Arachide x={lerp(XS[belle], X1, descend)} y={lerp(ROW, SOL + 24, descend) + 0} s={lerp(1.3, 0.85, descend)} rot={descend * 90} opacite={1 - p(f, d[1] + 130, d[1] + 170)} />
      {/* L'assiette, qui reste vide. */}
      {assiette > 0 ? (
        <g opacity={assiette} transform={`translate(${lerp(800, 668, assiette) - (1 - assiette) * 40} 300)`}>
          <ellipse rx={118} ry={58} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <ellipse rx={80} ry={36} fill={F.parchemin} stroke={F.filet} strokeWidth={4} />
        </g>
      ) : null}
      <Arachide x={sx2} y={lerp(sy2, SOL + 26, terre)} s={lerp(1.15, 0.85, terre)} rot={(ecart * 40) + terre * 50} opacite={entree(seconde) * (1 - p(f, d[2] + 250, d[2] + 285))} />
      <PlantArachide x={450} sol={SOL} g={p(f, d[2] + 215, d[2] + 300)} h={110} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 5 : le maïs habillé --- */

const Ruban: React.FC<{ y: number; rot: number; t: number; sens: number; texte: string }> = ({ y, rot, t, sens, texte }) => {
  if (t <= 0) return null;
  const x = lerp(sens * 470, 0, t);
  return (
    <g opacity={Math.min(1, t * 2.5)} transform={`translate(${400 + x} ${y + Math.sin(t * Math.PI) * -46}) rotate(${rot + (1 - t) * sens * 16})`}>
      <path d="M-262 -8 L-310 -8 L-284 20 L-310 52 L-232 52 Z" fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M262 -8 L310 -8 L284 20 L310 52 L232 52 Z" fill={F.argile} stroke={F.encre} strokeWidth={3.5} strokeLinejoin="round" />
      <rect x={-246} y={-30} width={492} height={66} rx={5} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <Libelle x={0} y={13} taille={33} graisse={600}>{texte}</Libelle>
    </g>
  );
};

const IlluMais: React.FC<PropsIllustration> = ({ f, d }) => {
  const lumiere = p(f, d[1] + 10, d[1] + 90);
  const longueur = d[1] - d[0];
  const COL = 9;
  return (
    <Scene>
      <Rayons x={400} y={420} r0={342} r1={lerp(346, 412, lumiere)} n={11} a0={-136} a1={-44} o={lumiere} ep={7} />
      {/* L'épi lui-même ne change jamais. */}
      <path d="M400 800 C330 800 270 700 262 580 C310 660 360 700 400 720 C440 700 490 660 538 580 C530 700 470 800 400 800 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d="M400 96 C490 96 515 260 515 420 C515 580 470 720 400 720 C330 720 285 580 285 420 C285 260 310 96 400 96 Z" fill={F.orClair} stroke={F.encre} strokeWidth={5} />
      <clipPath id="ch17-mais"><path d="M400 96 C490 96 515 260 515 420 C515 580 470 720 400 720 C330 720 285 580 285 420 C285 260 310 96 400 96 Z" /></clipPath>
      <g clipPath="url(#ch17-mais)">
        {Array.from({ length: 19 }, (_, r) =>
          Array.from({ length: COL }, (_, c) => (
            <rect key={`${r}-${c}`} x={282 + c * 27 + (r % 2) * 13} y={96 + r * 33} width={24} height={30} rx={9} fill={F.or} stroke={F.orFonce} strokeWidth={2} />
          )),
        )}
      </g>
      <path d="M400 800 C350 780 300 690 292 610 C330 660 370 700 400 736 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
      <path d="M400 800 C450 780 500 690 508 610 C470 660 430 700 400 736 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <path d="M400 800 V850" stroke={F.encre} strokeWidth={12} strokeLinecap="round" />
      {L.rubans.map((m, i) => {
        const a = d[0] + longueur * (0.14 + i * 0.25);
        return <Ruban key={m} y={[220, 400, 580][i]} rot={[-3, 2.5, -2][i]} t={p(f, a, a + 46)} sens={i % 2 === 0 ? -1 : 1} texte={m} />;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 6 : l'autel ---------- */

const Anneau: React.FC<{ x: number; y: number; r: number }> = ({ x, y, r }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="none" stroke={F.encre} strokeWidth={24} />
    <circle cx={x} cy={y} r={r} fill="none" stroke={F.or} strokeWidth={16} />
  </g>
);

const IlluAutel: React.FC<PropsIllustration> = ({ f, d }) => {
  const L0 = d[1] - d[0];
  const rapproche = p(f, d[0] + L0 * 0.46, d[0] + L0 * 0.8);
  const lumiere = p(f, d[1] - 30, d[1] + 70);
  const r = 74;
  const cx = 610;
  const ecart = lerp(100, 52, rapproche);
  const A = cx - ecart;
  const B = cx + ecart;
  const y = 470;
  const dist = B - A;
  const alpha = dist < 2 * r ? Math.acos(dist / (2 * r)) : 0;
  const arc = (a0: number, a1: number) => `M${A + r * Math.cos(a0)} ${y + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${A + r * Math.cos(a1)} ${y + r * Math.sin(a1)}`;
  return (
    <Scene>
      {/* L'autel de pierre. */}
      {[0, 1, 2, 3].map((rang) =>
        Array.from({ length: rang % 2 === 0 ? 3 : 4 }, (_, c) => {
          const n = rang % 2 === 0 ? 3 : 4;
          const l = rang % 2 === 0 ? 112 : 84;
          return <rect key={`${rang}${c}`} x={72 + c * (336 / n) + (rang % 2 === 0 ? 0 : 0)} y={612 + rang * 56} width={l} height={56} fill={rang % 2 === 0 ? F.papier : F.filet} stroke={F.encre} strokeWidth={3.5} />;
        }),
      )}
      <rect x={44} y={578} width={392} height={36} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <rect x={44} y={834} width={392} height={26} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      {/* Les rayons ne viennent qu'après la réconciliation. */}
      {lumiere > 0 ? <circle cx={240} cy={490} r={70 + lumiere * 66} fill={F.orClair} opacity={0.5 * lumiere} /> : null}
      <Rayons x={240} y={490} r0={128} r1={lerp(130, 196, lumiere)} n={13} a0={-172} a1={-8} o={lumiere} />
      <Paquet x={240} y={578} l={190} h={148} lumiere={lumiere} />
      {/* Les deux anneaux. */}
      <Anneau x={A} y={y} r={r} />
      <Anneau x={B} y={y} r={r} />
      {alpha > 0 ? (
        <g>
          <path d={arc(-alpha - 0.3, -alpha + 0.3)} fill="none" stroke={F.encre} strokeWidth={24} />
          <path d={arc(-alpha - 0.34, -alpha + 0.34)} fill="none" stroke={F.or} strokeWidth={16} />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 7 : le temps --------- */

const Etiquette: React.FC<{ x: number; y: number; rot: number; opacite: number }> = ({ x, y, rot, opacite }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacite}>
    <line x1={0} y1={-34} x2={0} y2={0} stroke={F.encre} strokeWidth={3} />
    <path d="M0 -6 L34 22 V92 H-34 V22 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={0} cy={18} r={7} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
    <Piece x={0} y={58} r={22} />
  </g>
);

const DisqueSaisons: React.FC<{ x: number; y: number; r: number; angle: number }> = ({ x, y, r, angle }) => (
  <g>
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      {[0, 1, 2, 3].map((i) => {
        const a0 = rad(i * 90);
        const a1 = rad((i + 1) * 90);
        return <path key={i} d={`M0 0 L${Math.cos(a0) * r} ${Math.sin(a0) * r} A${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r} Z`} fill={[F.orClair, F.papier, F.cuirClair, F.filet][i]} stroke={F.encre} strokeWidth={4} />;
      })}
      {/* Soleil, goutte, feuille, graine : les quatre temps de l'année. */}
      <g transform={`translate(${r * 0.54} ${r * 0.54})`}>
        <circle r={13} fill={F.or} stroke={F.orFonce} strokeWidth={2.5} />
        {Array.from({ length: 8 }, (_, i) => <line key={i} x1={Math.cos(rad(i * 45)) * 17} y1={Math.sin(rad(i * 45)) * 17} x2={Math.cos(rad(i * 45)) * 23} y2={Math.sin(rad(i * 45)) * 23} stroke={F.orFonce} strokeWidth={3} strokeLinecap="round" />)}
      </g>
      <path transform={`translate(${-r * 0.54} ${r * 0.54})`} d="M0 -20 C14 -2 15 16 0 18 C-15 16 -14 -2 0 -20 Z" fill={F.filet} stroke={F.encre} strokeWidth={3} />
      <path transform={`translate(${-r * 0.54} ${-r * 0.54}) rotate(35)`} d="M0 -22 C18 -8 18 10 0 22 C-18 10 -18 -8 0 -22 Z M0 -22 V22" fill={F.orClair} stroke={F.encre} strokeWidth={3} />
      <Graine x={r * 0.54} y={-r * 0.54} s={1.15} rot={30} />
      <circle r={11} fill={F.encre} />
    </g>
    <path d={`M${x} ${y - r + 8} l-14 -26 h28 Z`} fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
  </g>
);

const IlluTemps: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 780;
  const M = 165;
  const A = 540;
  const pm = p(f, d[0] + 20, d[0] + 170);
  const motMois = p(f, d[0] + 130, d[0] + 165);
  const pa = 0.07 + 0.93 * p(f, d[0] + 130, d[1] - 26);
  const fruit = p(f, d[1] - 30, d[1] + 10);
  const motAns = p(f, d[1] - 60, d[1] - 24);
  const pose = p(f, d[1] + 10, d[1] + 40);
  const chute = p(f, d[1] + 110, d[1] + 150);
  const coeur = p(f, d[2] + 30, d[2] + 80);
  const balance = Math.sin(f / 13) * 11 * (1 - chute);
  const angle = (f / 2.1) % 360;
  const FRUITS = [[-115, 12], [-74, -112], [18, 92], [86, -62], [132, 34], [-122, -60]];
  const bat = 1 + Math.sin(f / 10) * 0.05;
  return (
    <Scene>
      <DisqueSaisons x={165} y={156} r={110} angle={angle} />
      <rect x={10} y={SOL} width={780} height={26} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {/* Le maïs porte vite. */}
      <g transform={`translate(${M} ${SOL}) scale(${lerp(0.16, 1, pm)})`}>
        <path d="M0 0 C-5 -110 5 -210 0 -320" fill="none" stroke={F.orFonce} strokeWidth={11} strokeLinecap="round" />
        {[[-1, -70], [1, -120], [-1, -180], [1, -230], [-1, -280]].map(([s, y]) => (
          <path key={y} d={`M0 ${y} Q${s * 60} ${y - 62} ${s * 112} ${y - 8} Q${s * 56} ${y - 26} 0 ${y + 18} Z`} fill={F.or} stroke={F.orFonce} strokeWidth={3} />
        ))}
        <g opacity={p(f, d[0] + 110, d[0] + 165)}>
          <path d="M16 -130 C60 -150 62 -220 30 -258 C12 -220 6 -170 16 -130 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={3.5} />
          {[-160, -182, -204, -226].map((y) => <path key={y} d={`M${22} ${y} H${48}`} stroke={F.or} strokeWidth={4} />)}
        </g>
      </g>
      <Libelle x={M} y={850} taille={30} graisse={600} opacite={motMois}>{L.quelquesMois}</Libelle>
      {/* Le moabi grandit lentement. */}
      <g transform={`translate(${A} ${SOL}) scale(${pa}) translate(${-A} ${-SOL})`}>
        <path d={`M${A - 32} ${SOL} C${A - 20} ${SOL - 120} ${A - 26} ${SOL - 200} ${A - 18} ${SOL - 300} H${A + 18} C${A + 26} ${SOL - 200} ${A + 20} ${SOL - 120} ${A + 32} ${SOL} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <Feuillage x={A} y={315} r={188} balance={Math.sin(f / 19) * 2} />
        {FRUITS.map(([dx, dy], i) => (
          <ellipse key={i} cx={A + dx} cy={315 + dy} rx={19 * fruit} ry={23 * fruit} fill={F.argile} stroke={F.encre} strokeWidth={3} />
        ))}
      </g>
      <Libelle x={A} y={850} taille={30} graisse={600} opacite={motAns}>{L.trenteAns}</Libelle>
      {coeur > 0 ? <Coeur x={A} y={300} s={1.05 * coeur * bat} /> : null}
      {/* L'étiquette de prix accrochée au moabi, puis tombée. */}
      {pose > 0 ? <Etiquette x={lerp(700, 716, chute)} y={lerp(462, 682, chute * chute)} rot={lerp(balance, 76, chute)} opacite={pose} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 8 : le départ -------- */

const IlluDepart: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const Y = 470;
  const X0 = 150;
  const X1 = 690;
  const vole = p(f, d[0] - 10, d[0] + 70);
  const mot = p(f, d[0] + 75, d[0] + 135);
  const trace = p(f, d[0] + 140, duree - 60);
  const px = lerp(X1, X0, vole);
  const py = Y - 58 - Math.sin(vole * Math.PI) * 170;
  return (
    <Scene>
      <path d={`M0 ${Y - 60} H800 V${Y + 60} H0 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} />
      <line x1={0} x2={800} y1={Y} y2={Y} stroke={F.filet} strokeWidth={6} strokeDasharray="28 22" />
      {/* Ce qui suit la graine : la route se dore à partir du départ. */}
      <rect x={X0} y={Y - 8} width={(X1 - X0) * trace} height={16} rx={8} fill={F.or} />
      {/* Ligne de départ. */}
      <rect x={X0 - 14} y={Y - 60} width={28} height={120} fill={F.encre} />
      {/* Ligne d'arrivée, en damier. */}
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} x={X1 - 14 + (i % 2) * 14} y={Y - 60 + Math.floor(i / 2) * 24} width={14} height={24} fill={F.encre} />
      ))}
      <rect x={X1 - 14} y={Y - 60} width={28} height={120} fill="none" stroke={F.encre} strokeWidth={3} />
      {/* À l'arrivée, ce qui reste à venir. */}
      <circle cx={X1} cy={Y - 136} r={46} fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="10 10" opacity={1 - p(f, duree - 80, duree - 50)} />
      <Piece x={X1} y={Y - 136} r={46} opacite={p(f, duree - 80, duree - 50)} />
      {/* La graine, posée au départ. */}
      {mot > 0 ? <circle cx={X0} cy={Y - 58} r={38 + mot * 18} fill={F.orClair} opacity={0.5 * mot} /> : null}
      <Graine x={px} y={py} s={2.3} rot={(1 - vole) * 200} />
      <clipPath id="ch17-mot"><rect x={40} y={Y + 80} width={560 * mot} height={90} /></clipPath>
      <g clipPath="url(#ch17-mot)">
        <text x={60} y={Y + 142} fontFamily={PoliceF.serif} fontSize={66} fontWeight={500} fill={F.orFonce}>{L.commencement}</text>
      </g>
      <line x1={X0} y1={Y + 62} x2={X0} y2={Y + 86} stroke={F.orFonce} strokeWidth={4} opacity={mot} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 9 : la source -------- */

type Seg = [number, number, number, number, number, number];
const FILETS: Seg[] = [
  [400, 96, 400, 190, 30, 90],
  [400, 190, 220, 370, 90, 200],
  [400, 190, 580, 370, 90, 200],
  [220, 370, 110, 590, 200, 330],
  [220, 370, 330, 860, 200, 420],
  [580, 370, 470, 860, 200, 420],
  [580, 370, 660, 590, 200, 330],
  [110, 590, 50, 860, 330, 470],
  [110, 590, 180, 860, 330, 470],
  [660, 590, 590, 860, 330, 470],
  [660, 590, 745, 860, 330, 470],
];
const NOEUDS = [[400, 190], [220, 370], [580, 370], [110, 590], [660, 590]];

const IlluSource: React.FC<PropsIllustration> = ({ f, d }) => {
  const ech = (d[1] - d[0]) / 538;
  return (
    <Scene>
      {/* Tout ce qui coule se rassemble en bas. */}
      <rect x={14} y={850} width={772} height={30} rx={15} fill={F.orClair} stroke={F.orFonce} strokeWidth={4} opacity={p(f, d[0] + 420 * ech, d[0] + 470 * ech)} />
      {FILETS.map(([x0, y0, x1, y1, a, b], i) => {
        const r = p(f, d[0] + (a - 30) * ech, d[0] + (b - 30) * ech);
        if (r <= 0) return null;
        const ym = (y0 + y1) / 2;
        const trace = `M${x0} ${y0} C${x0} ${ym} ${x1} ${ym} ${x1} ${y1}`;
        const ep = i === 0 ? 28 : i < 3 ? 20 : 14;
        return (
          <g key={i}>
            <path d={trace} fill="none" stroke={F.orFonce} strokeWidth={ep + 6} pathLength={1} strokeDasharray={`${r} 1`} strokeLinecap="butt" />
            <path d={trace} fill="none" stroke={F.orClair} strokeWidth={ep} pathLength={1} strokeDasharray={`${r} 1`} strokeLinecap="butt" />
            {Array.from({ length: 4 }, (_, k) => {
              const t = ((f / 44 + k / 4 + i * 0.13) % 1) * r;
              return <circle key={k} cx={cubique(t, x0, x0, x1, x1)} cy={cubique(t, y0, ym, ym, y1)} r={ep * 0.2} fill={F.papier} />;
            })}
          </g>
        );
      })}
      {/* La roche d'où jaillit la source. */}
      <path d="M236 132 L212 96 L246 54 L304 44 L340 12 L432 6 L496 30 L552 58 L586 100 L560 132 L470 118 L330 118 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d="M340 12 L356 62 L304 44 M432 6 L446 58 L552 58 M356 62 L446 58 M246 54 L290 100 M552 58 L520 100" fill="none" stroke={F.cuir} strokeWidth={4} strokeLinejoin="round" />
      <path d="M352 120 C356 88 444 88 448 120 Z" fill={F.encre} />
      {NOEUDS.map(([x, y], i) => {
        const a = d[1] + 12 + i * 42;
        const t = p(f, a, a + 20);
        const m = L.grace[i];
        const w = m.length * 15 + 40;
        const atteint = p(f, d[0] + (FILETS[[1, 3, 6, 7, 9][i]][4] - 34) * ech, d[0] + (FILETS[[1, 3, 6, 7, 9][i]][4] - 22) * ech);
        return (
          <g key={m}>
            <circle cx={x} cy={y} r={15} fill={F.or} stroke={F.orFonce} strokeWidth={3} opacity={atteint} />
            <g opacity={t} transform={`translate(${x} ${y}) scale(${0.7 + 0.3 * t})`}>
              <rect x={-w / 2} y={-27} width={w} height={54} rx={27} fill={F.papier} stroke={F.encre} strokeWidth={4} />
              <Libelle x={0} y={10} taille={29} graisse={600}>{m}</Libelle>
            </g>
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 10 : le tamis, l'écriteau */

const Bourse: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-34 -150 C-30 -120 -32 -116 -40 -108 C-120 -60 -112 0 -60 0 H60 C112 0 120 -60 40 -108 C32 -116 30 -120 34 -150 C14 -158 -14 -158 -34 -150 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
    <path d="M-42 -112 C-16 -102 16 -102 42 -112" fill="none" stroke={F.or} strokeWidth={9} strokeLinecap="round" />
    <path d="M-20 -106 L-34 -76 M20 -106 L34 -76" stroke={F.or} strokeWidth={6} strokeLinecap="round" />
  </g>
);

const IlluTamis: React.FC<PropsIllustration> = ({ f, d }) => {
  const scene1 = 1 - p(f, d[1] - 14, d[1] + 6);
  const scene2 = p(f, d[1] - 2, d[1] + 20);
  const fourche = p(f, 0, 30);
  const X = 400;
  const SY = 250;
  // Deux pièces l'une après l'autre : arrêtée sur le tamis, puis passée.
  const piece = (a: number) => {
    const chute = p(f, a, a + 36);
    const secoue = p(f, a + 36, a + 90);
    const passe = p(f, a + 90, a + 120);
    const route = p(f, a + 120, a + 190);
    const y0 = lerp(30, SY - 42, chute);
    const y1 = lerp(y0, 400, passe);
    const bx = cubique(route, 400, 400, 620, 640);
    const by = cubique(route, 400, 490, 540, 740);
    const jig = Math.sin(f / 3) * 7 * secoue * (1 - passe);
    return { x: route > 0 ? bx : X + jig, y: route > 0 ? by : y1, o: Math.min(1, chute * 5) * (1 - p(f, a + 190, a + 210)), actif: f >= a };
  };
  const pieces = [piece(d[0] + 34), piece(d[0] + 240)];
  const bout = p(f, d[0] + 34 + 170, d[0] + 34 + 200);
  const secousse = Math.sin(f / 3) * 5 * Math.max(p(f, d[0] + 70, d[0] + 90) * (1 - p(f, d[0] + 124, d[0] + 150)), p(f, d[0] + 276, d[0] + 296) * (1 - p(f, d[0] + 330, d[0] + 356)));
  const bFinal = p(f, d[1] + 214, d[1] + 262);
  const arrive = p(f, d[1] + 28, d[1] + 120);
  const bx = lerp(680, 290, arrive);
  return (
    <Scene>
      {scene1 > 0 ? (
        <g opacity={scene1}>
          {/* Les deux voies. */}
          <g opacity={fourche}>
            <path d="M400 400 C400 560 180 580 150 820" fill="none" stroke={F.filet} strokeWidth={70} />
            <path d="M400 400 C400 560 180 580 150 820" fill="none" stroke={F.parchemin} strokeWidth={58} />
            <path d="M400 400 C400 560 620 580 650 820" fill="none" stroke={F.encre2} strokeWidth={70} />
            <path d="M400 400 C400 560 620 580 650 820" fill="none" stroke={F.papier} strokeWidth={58} />
            <path d="M400 400 C400 560 620 580 650 820" fill="none" stroke={F.encre2} strokeWidth={4} strokeDasharray="18 18" />
            <path d="M400 340 V410" stroke={F.encre2} strokeWidth={70} />
            <path d="M400 336 V420" stroke={F.papier} strokeWidth={58} />
            {/* La voie barrée. */}
            <g transform="translate(232 590) rotate(38)">
              <rect x={-62} y={-13} width={124} height={26} rx={5} fill={F.argile} stroke={F.encre} strokeWidth={3.5} />
            </g>
          </g>
          <Rayons x={650} y={820} r0={46} r1={lerp(50, 96, bout)} n={11} o={bout} />
          {/* Le tamis, vu de haut : le fond tressé, puis les pièces, puis le bord avant. */}
          <g transform={`translate(${X + secousse} ${SY})`}>
            <clipPath id="ch17-tamis"><ellipse rx={170} ry={46} /></clipPath>
            <ellipse rx={170} ry={46} fill={F.parchemin} />
            <g clipPath="url(#ch17-tamis)">
              {Array.from({ length: 25 }, (_, i) => <line key={i} x1={-180 + i * 15} x2={-180 + i * 15} y1={-48} y2={48} stroke={F.encre2} strokeWidth={2} />)}
              {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-172} x2={172} y1={-44 + i * 13} y2={-44 + i * 13} stroke={F.encre2} strokeWidth={2} />)}
            </g>
            <ellipse rx={170} ry={46} fill="none" stroke={F.cuir} strokeWidth={10} />
          </g>
          {pieces.map((q, i) => (q.actif ? <Piece key={i} x={q.x} y={q.y} r={32} opacite={q.o} /> : null))}
          <g transform={`translate(${X + secousse} ${SY})`}>
            <path d="M-170 0 A170 46 0 0 0 170 0 V44 A170 46 0 0 1 -170 44 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d="M-170 16 A170 46 0 0 0 170 16" fill="none" stroke={F.cuir} strokeWidth={3} />
          </g>
        </g>
      ) : null}
      {scene2 > 0 ? (
        <g opacity={scene2}>
          <rect x={10} y={790} width={780} height={22} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <Bourse x={bx} y={790} s={1.1} />
          <g transform={`translate(0 ${bFinal * 40}) translate(290 790) scale(1 ${1 - bFinal * 0.88}) translate(-290 -790)`}>
            <g opacity={1 - p(f, d[1] + 214, d[1] + 240)}>
              <rect x={150} y={520} width={26} height={270} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
              <rect x={404} y={520} width={26} height={270} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            </g>
            <rect x={50} y={380} width={480} height={290} rx={10} fill={F.papier} stroke={F.encre} strokeWidth={6} />
            <rect x={66} y={396} width={448} height={258} rx={5} fill="none" stroke={F.filet} strokeWidth={4} />
            <Libelle x={290} y={510} taille={46} graisse={600} opacite={1 - p(f, d[1] + 214, d[1] + 236)}>{L.ecriteau[0]}</Libelle>
            <Libelle x={290} y={580} taille={46} graisse={600} opacite={1 - p(f, d[1] + 214, d[1] + 236)}>{L.ecriteau[1]}</Libelle>
          </g>
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 11 : la rivière ------ */

const IlluRiviere: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const SORT = p(f, d[0] + 170, d[0] + 280);
  const pluie = 1 - p(f, d[0] + 160, d[0] + 200);
  const puise = p(f, d[0] + 270, duree - 60);
  const nuages = [
    { x: 150, y: 110, s: 1 },
    { x: 470, y: 76, s: 0.82 },
  ];
  return (
    <Scene>
      {/* La rive. */}
      <rect x={0} y={590} width={800} height={70} fill={F.cuirClair} />
      {/* La rivière coule toujours. */}
      <clipPath id="ch17-riv"><path d="M0 640 C200 610 420 680 800 628 V880 H0 Z" /></clipPath>
      <path d="M0 640 C200 610 420 680 800 628 V880 H0 Z" fill={F.papier} />
      <g clipPath="url(#ch17-riv)">
        {Array.from({ length: 6 }, (_, r) => {
          const y = 680 + r * 36;
          const dec = ((f * (1.6 + (r % 2) * 0.5) + r * 57) % 120) - 120;
          return (
            <path
              key={r}
              d={`M${dec} ${y} ${Array.from({ length: 9 }, (_, i) => `q30 ${i % 2 === 0 ? -14 : 14} 60 0`).join(' ')} ${Array.from({ length: 9 }, (_, i) => `q30 ${i % 2 === 0 ? -14 : 14} 60 0`).join(' ')}`}
              fill="none"
              stroke={r % 2 === 0 ? F.encre2 : F.filet}
              strokeWidth={4}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <path d="M0 640 C200 610 420 680 800 628" fill="none" stroke={F.encre} strokeWidth={5} />
      <path d="M0 880 H800" stroke={F.encre} strokeWidth={5} />
      {/* L'arbre : ses racines plongent dans l'eau. */}
      <path d="M300 660 C290 700 262 720 240 742 M312 660 C316 706 322 730 330 756 M325 650 C352 694 382 712 412 726" fill="none" stroke={F.cuir} strokeWidth={11} strokeLinecap="round" />
      <path d="M266 656 C282 560 284 500 288 420 H336 C340 500 342 560 358 656 C330 672 294 672 266 656 Z" fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {/* L'eau monte par le tronc. */}
      {Array.from({ length: 5 }, (_, k) => {
        const t = (f / 70 + k / 5) % 1;
        return <circle key={k} cx={312} cy={lerp(720, 420, t)} r={6} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} opacity={puise * Math.sin(t * Math.PI)} />;
      })}
      <Feuillage x={312} y={354} r={172} balance={Math.sin(f / 21) * 2.5} />
      {/* La pluie, puis plus de pluie. */}
      {nuages.map((n, i) => {
        const x = n.x + (f / 30) * (i === 0 ? 7 : 9) + SORT * 300;
        const o = 1 - p(f, d[0] + 210, d[0] + 280);
        return (
          <g key={i} opacity={o}>
            {pluie > 0
              ? Array.from({ length: 12 }, (_, k) => {
                  const t = (f / 26 + k * 0.37) % 1;
                  const lx = x - 88 * n.s + k * 16 * n.s;
                  const ly = n.y + 40 + t * 420;
                  return <line key={k} x1={lx} x2={lx - 6} y1={ly} y2={ly + 30} stroke={F.encre2} strokeWidth={4} strokeLinecap="round" opacity={pluie * (1 - t * 0.4)} />;
                })
              : null}
            <g transform={`translate(${x} ${n.y}) scale(${n.s})`}>
              <path d="M-104 44 C-140 44 -142 -6 -96 -8 C-92 -50 -28 -62 -8 -26 C24 -60 84 -40 80 -4 C124 -8 130 44 92 44 Z" fill={F.papier} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 12 : le robinet ------ */

const IlluRobinet: React.FC<PropsIllustration> = ({ f, d }) => {
  const NX = 610;
  const NY = 402;
  const vole = p(f, d[0] + 70, d[0] + 110);
  const durcit = p(f, d[0] + 118, d[0] + 200);
  const arret = p(f, d[0] + 170, d[0] + 225);
  const saute = p(f, d[1] + 124, d[1] + 168);
  const reprise = p(f, d[1] + 136, d[1] + 164);
  const debit = (1 - arret) + arret * reprise;
  const gx = saute > 0 ? lerp(NX, 760, saute) : lerp(330, NX, vole);
  const gy = saute > 0 ? NY + 12 + saute * 340 - Math.sin(saute * Math.PI) * 120 : lerp(470, NY + 12, vole);
  const couleurGomme = interpolateColors(durcit, [0, 1], [F.argile, F.encre]);
  const SOL = 790;
  const niveauSeau = Math.min(1, p(f, 0, d[0] + 170) * 0.45 + p(f, d[1] + 150, d[2]) * 0.5);
  // « Un tiens » tombe, « deux tu l'auras » monte.
  const tombe = p(f, d[2] + 4, d[2] + 40);
  const pousse = p(f, d[2] + 40, d[2] + 120);
  const mot2 = p(f, d[2] + 74, d[2] + 104);
  const motTiens = p(f, d[2] - 4, d[2] + 14);
  const SX = 240;
  const sy = lerp(480, SOL + 22, tombe * tombe);
  return (
    <Scene>
      {/* La citerne, coupée : l'eau y reste pleine. */}
      <rect x={30} y={36} width={450} height={410} rx={14} fill={F.filet} stroke={F.encre} strokeWidth={6} />
      <clipPath id="ch17-citerne"><rect x={48} y={54} width={414} height={374} rx={8} /></clipPath>
      <rect x={48} y={54} width={414} height={374} rx={8} fill={F.parchemin} />
      <g clipPath="url(#ch17-citerne)">
        <rect x={48} y={92 + Math.sin(f / 14) * 2} width={414} height={340} fill={F.papier} />
        {Array.from({ length: 6 }, (_, r) => (
          <path key={r} d={`M${40 + ((f * 0.5 + r * 70) % 80) - 80} ${100 + Math.sin(f / 14) * 2 + r * 58} ${Array.from({ length: 12 }, (_, i) => `q24 ${i % 2 === 0 ? -9 : 9} 48 0`).join(' ')}`} fill="none" stroke={r === 0 ? F.encre2 : F.filet} strokeWidth={r === 0 ? 5 : 4} />
        ))}
      </g>
      <rect x={48} y={54} width={414} height={374} rx={8} fill="none" stroke={F.encre} strokeWidth={4} />
      {[[40, 46], [470, 46], [40, 436], [470, 436]].map(([x, y]) => <circle key={x * y} cx={x} cy={y} r={4} fill={F.encre2} />)}
      {/* Le robinet. */}
      <path d={`M478 322 H${NX + 24} Q${NX + 34} 322 ${NX + 34} 332 V${NY} H${NX - 34} V374 H478 Z`} fill={F.or} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={NX - 44} y={NY - 10} width={88} height={20} rx={5} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
      <rect x={530} y={286} width={18} height={38} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
      <rect x={494} y={272} width={90} height={18} rx={8} fill={F.orClair} stroke={F.encre} strokeWidth={4} />
      {/* Le filet d'eau, tant que le trou est libre. */}
      {debit > 0.02 ? (
        <g>
          <rect x={NX - 11 * debit - 3} y={NY + 10} width={22 * debit + 6} height={282 - 18} fill={F.encre2} />
          <rect x={NX - 11 * debit} y={NY + 10} width={22 * debit} height={282 - 18} fill={F.papier} />
          {Array.from({ length: 5 }, (_, k) => (
            <line key={k} x1={NX} x2={NX} y1={NY + 16 + ((f * 7 + k * 54) % 250)} y2={NY + 34 + ((f * 7 + k * 54) % 250)} stroke={F.encre2} strokeWidth={3} opacity={debit} />
          ))}
        </g>
      ) : null}
      {/* Le seau. */}
      <clipPath id="ch17-seau"><path d={`M${NX - 74} ${SOL - 110} H${NX + 74} L${NX + 60} ${SOL} H${NX - 60} Z`} /></clipPath>
      <path d={`M${NX - 74} ${SOL - 110} H${NX + 74} L${NX + 60} ${SOL} H${NX - 60} Z`} fill={F.parchemin} />
      <g clipPath="url(#ch17-seau)">
        <rect x={NX - 80} y={SOL - 106 * niveauSeau} width={160} height={110} fill={F.papier} />
        <line x1={NX - 80} x2={NX + 80} y1={SOL - 106 * niveauSeau} y2={SOL - 106 * niveauSeau} stroke={F.encre2} strokeWidth={4} />
      </g>
      <path d={`M${NX - 74} ${SOL - 110} H${NX + 74} L${NX + 60} ${SOL} H${NX - 60} Z`} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <Terre y={SOL} h={40} />
      {/* Le chewing-gum : mou, puis dur, puis il saute. */}
      {vole > 0 ? (
        <g transform={`translate(${gx} ${gy})`} opacity={p(f, d[0] + 60, d[0] + 76)}>
          <path
            d={`M-24 ${-4 - 4 * (1 - durcit)} C-14 ${-20 + 4 * durcit} 16 ${-22 + 6 * durcit} 26 -6 C32 ${10 + 4 * (1 - durcit)} 8 ${20 - 2 * durcit} -8 18 C-24 ${20 - 6 * durcit} -32 8 -24 ${-4 - 4 * (1 - durcit)} Z`}
            fill={couleurGomme}
            stroke={F.encre}
            strokeWidth={3}
          />
        </g>
      ) : null}
      {/* Le proverbe. */}
      {motTiens > 0 && tombe < 1 ? (
        <g>
          <Graine x={SX} y={sy} s={1.7} />
          <Libelle x={SX + 34} y={sy + 9} taille={30} graisse={600} ancre="start" opacite={motTiens * (1 - p(f, d[2] + 26, d[2] + 40))}>{L.unTiens}</Libelle>
        </g>
      ) : null}
      {pousse > 0
        ? [SX - 100, SX + 100].map((x, i) => (
            <g key={x}>
              <Epi x={x} y={SOL} h={230} g={pousse} rangs={5} charge={p(f, d[2] + 70 + i * 8, d[2] + 130)} />
            </g>
          ))
        : null}
      <Libelle x={SX} y={870} taille={32} graisse={600} opacite={mot2}>{L.deuxTu}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 13 : semence et pain --- */

const TAS = Array.from({ length: 36 }, (_, i) => {
  const a = i * 2.39996;
  const r = Math.sqrt((i + 0.5) / 36);
  return { x: Math.cos(a) * r * 92, y: -296 - Math.abs(Math.sin(a)) * r * 62 - (1 - r) * 8, rot: (i * 47) % 180 };
});

const Pain: React.FC<{ x: number; y: number; contour?: boolean; s?: number; opacite?: number }> = ({ x, y, contour = false, s = 1, opacite = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacite}>
    <path
      d="M-125 0 C-142 -92 -70 -150 0 -150 C70 -150 142 -92 125 0 Z"
      fill={contour ? 'none' : F.orClair}
      stroke={contour ? F.argile : F.encre}
      strokeWidth={contour ? 4 : 5}
      strokeDasharray={contour ? '14 12' : undefined}
      strokeLinejoin="round"
    />
    {contour ? null : (
      <g>
        <path d="M-125 0 C-122 -24 -96 -40 -60 -30 C-20 -22 30 -22 60 -30 C96 -40 122 -24 125 0 Z" fill={F.or} />
        <path d="M-60 -120 Q-40 -88 -52 -56 M0 -134 Q20 -96 8 -60 M60 -120 Q78 -88 66 -56" fill="none" stroke={F.orFonce} strokeWidth={8} strokeLinecap="round" />
        <path d="M-125 0 C-142 -92 -70 -150 0 -150 C70 -150 142 -92 125 0 Z" fill="none" stroke={F.encre} strokeWidth={5} />
      </g>
    )}
  </g>
);

const IlluSemencePain: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 770;
  const SX = 255;
  const BX = 638;
  const entree = p(f, 2, 26);
  const noms = p(f, d[1] + 10, d[1] + 50);
  const capital = p(f, d[1] + 170, d[1] + 210);
  // La semence double par paliers.
  const paliers = [d[0] + 10, d[0] + 170, d[0] + 340, d[1] + 60, d[1] + 280, d[2]];
  const comptes = [3, 6, 12, 20, 28, 36];
  const apparition = (i: number) => {
    let k = comptes.findIndex((c) => i < c);
    if (k < 0) k = comptes.length - 1;
    const prec = k === 0 ? 0 : comptes[k - 1];
    const a = paliers[k] + (i - prec) * 7;
    return p(f, a, a + 22);
  };
  const croissance = p(f, d[0] + 20, d[2] + 40);
  const s = lerp(0.86, 1.4, croissance);
  // « N'élargis pas tes besoins » : la tentation paraît autour du pain, et le pain ne bouge pas.
  const besoin = p(f, d[2] + 26, d[2] + 86) * (1 - p(f, d[2] + 120, d[2] + 170));
  return (
    <Scene>
      <rect x={10} y={SOL} width={780} height={20} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      <g opacity={entree} transform={`translate(${SX} ${SOL}) scale(${s})`}>
        {/* Un sac de toile : ventru, le col roulé. */}
        <path d="M-112 0 Q-156 -14 -150 -100 C-144 -176 -104 -214 -76 -244 C-36 -256 36 -256 76 -244 C104 -214 144 -176 150 -100 Q156 -14 112 0 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5 / s} strokeLinejoin="round" />
        <path d="M-58 -226 C-74 -180 -92 -150 -104 -110 M0 -232 C-6 -190 -8 -160 -6 -128 M58 -226 C76 -180 90 -150 104 -110" fill="none" stroke={F.cuir} strokeWidth={4 / s} strokeLinecap="round" />
        <path d="M-96 -244 C-50 -228 50 -228 96 -244 L108 -290 C50 -304 -50 -304 -108 -290 Z" fill={F.papier} stroke={F.encre} strokeWidth={5 / s} strokeLinejoin="round" />
        <ellipse cx={0} cy={-290} rx={106} ry={20} fill={F.encre} stroke={F.encre} strokeWidth={4 / s} />
        {TAS.map((g, i) => {
          const t = apparition(i);
          if (t <= 0) return null;
          return <Graine key={i} x={lerp(0, g.x, t)} y={lerp(-290, g.y, t) - Math.sin(t * Math.PI) * 44} s={0.82 * t} rot={g.rot} />;
        })}
      </g>
      <Pain x={BX} y={SOL} opacite={entree} />
      {besoin > 0 ? <Pain x={BX} y={SOL} contour s={1 + 0.24 * besoin} opacite={besoin} /> : null}
      <Libelle x={SX} y={830} taille={34} graisse={600} opacite={noms}>{L.semence}</Libelle>
      <Libelle x={SX} y={874} taille={27} couleur={F.encre2} opacite={capital}>{L.capital}</Libelle>
      <Libelle x={BX} y={830} taille={34} graisse={600} opacite={noms}>{L.pain}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 14 : manne et sillons -- */

const IlluManne: React.FC<PropsIllustration> = ({ f, d }) => {
  const Y0 = 540;
  const N = 46;
  const finManne = d[0] + 165;
  const front = p(f, d[0] + 190, d[0] + 290);
  const amp = (x: number) => Math.max(0, Math.min(1, (front * 1000 - x) / 180));
  const prof = (x: number) => Y0 + 32 * amp(x) * Math.cos((2 * Math.PI * (x - 80)) / 160);
  const pts = Array.from({ length: 81 }, (_, i) => i * 10);
  const dessus = pts.map((x) => `${x} ${prof(x).toFixed(1)}`).join(' L');
  const estompeManne = 1 - p(f, d[0] + 190, d[0] + 240);
  return (
    <Scene>
      {/* Le sol : plat, puis creusé. */}
      <path d={`M${dessus} V880 H0 Z`} fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      {[0, 1, 2].map((r) => {
        const y = 655 + r * 78;
        return (
          <path
            key={r}
            d={`M${pts.map((x) => `${x} ${(y + (32 - r * 5) * amp(x) * Math.cos((2 * Math.PI * (x - 80)) / 160)).toFixed(1)}`).join(' L')}`}
            fill="none"
            stroke={F.cuirClair}
            strokeWidth={6}
            opacity={front}
          />
        );
      })}
      {/* La manne : de petits grains clairs, qui cessent. */}
      {Array.from({ length: N }, (_, i) => {
        const a = d[0] - 20 + (i * (finManne - d[0] + 20)) / N;
        const chute = Math.max(0, Math.min(1, (f - a) / 62));
        if (chute <= 0) return null;
        const x = (30 + i * 137.5) % 760 + 20;
        const pose = chute * chute;
        const y = lerp(10, Y0 - 7 - (i % 3) * 4, pose);
        return <circle key={i} cx={x + Math.sin(i + chute * 3) * 6} cy={y} r={7} fill={F.papier} stroke={F.encre2} strokeWidth={2.5} opacity={estompeManne} />;
      })}
      {/* Les premiers épis. */}
      {[80, 240, 400, 560, 720].map((x, i) => {
        const a = d[0] + 265 + i * 26;
        return <Epi key={x} x={x} y={prof(x)} h={370 + (i % 2) * 34} g={p(f, a, d[1] + 40 + i * 18)} rangs={7} charge={p(f, d[1] + i * 12, d[1] + 110 + i * 12)} taille={1.15} lf={0.13} />;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 15 : le vase ---------- */

const VASE = 'M345 54 H455 L446 112 C446 150 596 156 596 286 C596 400 472 470 446 548 H354 C328 470 204 400 204 286 C204 156 354 150 354 112 Z';
const PILE = Array.from({ length: 24 }, (_, i) => {
  // Remplit le vase de bas en haut : chaque rangée est plus large que la précédente.
  const rangees = [[3, 500], [5, 462], [7, 424], [9, 386]];
  let reste = i;
  for (const [n, y] of rangees) {
    if (reste < n) return { x: 400 + (reste - (n - 1) / 2) * 44, y };
    reste -= n;
  }
  return { x: 400, y: 386 };
});
const COUPES = [130, 400, 670];

const IlluVase: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const entree = p(f, 0, 22);
  const debut = d[0];
  const debutSortie = d[0] + 210;
  const remplit = p(f, debut + 10, debutSortie - 10);
  const visibles = remplit * PILE.length;
  const conditionne = p(f, d[1], d[1] + 26) * (1 - 0.6 * p(f, d[1] + 110, d[1] + 170));
  const remplissage = (i: number) => p(f, debutSortie + 30 + i * 18, duree - 40);
  return (
    <Scene>
      {/* Les pièces qui tombent en haut. */}
      {Array.from({ length: 3 }, (_, k) => {
        const t = ((f - debut) / 45 + k / 3) % 1;
        return debut < f ? <Piece key={k} x={400} y={lerp(-6, 150, t)} r={20} opacite={Math.min(1, t * 6) * (1 - Math.max(0, t - 0.75) * 4)} /> : null;
      })}
      <clipPath id="ch17-vase"><path d={VASE} /></clipPath>
      <path d={VASE} fill={F.papier} stroke={F.encre} strokeWidth={6} strokeLinejoin="round" opacity={entree} />
      <g clipPath="url(#ch17-vase)">
        {PILE.map((c, i) => {
          const o = Math.max(0, Math.min(1, visibles - i));
          return o > 0 ? <Piece key={i} x={c.x + (i % 2) * 2} y={c.y + (1 - o) * -40} r={22} opacite={o} /> : null;
        })}
      </g>
      <path d={VASE} fill="none" stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
      <rect x={345} y={48} width={110} height={14} rx={5} fill={F.or} stroke={F.encre} strokeWidth={4} />
      {/* L'inscription. */}
      <rect x={242} y={186} width={316} height={100} rx={8} fill={interpolateColors(conditionne, [0, 1], [F.papier, F.orClair])} stroke={F.encre} strokeWidth={4} />
      <Libelle x={400} y={228} taille={29} graisse={600}>{L.liberalites[0]}</Libelle>
      <Libelle x={400} y={266} taille={29} graisse={600}>{L.liberalites[1]}</Libelle>
      {/* L'ouverture à la base, et les pièces qui en sortent. */}
      <rect x={348} y={544} width={104} height={18} rx={4} fill={F.encre} />
      {COUPES.map((cx, c) =>
        Array.from({ length: 3 }, (_, k) => {
          const t = ((f - debutSortie) / 72 + k / 3 + c * 0.11) % 1;
          if (f <= debutSortie) return null;
          return <Piece key={`${c}${k}`} x={lerp(400, cx, t)} y={566 + t * t * 148 - Math.sin(t * Math.PI) * 10} r={15} opacite={Math.min(1, t * 8) * (1 - Math.max(0, t - 0.88) * 8)} />;
        }),
      )}
      {/* Les coupes. */}
      {COUPES.map((cx, i) => {
        const n = remplissage(i);
        const id = `ch17-coupe${i}`;
        const coupe = `M${cx - 88} 728 H${cx + 88} C${cx + 84} 790 ${cx + 40} 808 ${cx} 808 C${cx - 40} 808 ${cx - 84} 790 ${cx - 88} 728 Z`;
        return (
          <g key={cx}>
            <path d={`M${cx - 54} 876 Q${cx} 846 ${cx + 54} 876 Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <rect x={cx - 9} y={806} width={18} height={54} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <path d={coupe} fill={F.papier} />
            <clipPath id={id}><path d={coupe} /></clipPath>
            <g clipPath={`url(#${id})`}>
              <rect x={cx - 90} y={808 - 76 * n} width={180} height={84} fill={F.or} />
              {n > 0 ? <line x1={cx - 90} x2={cx + 90} y1={808 - 76 * n} y2={808 - 76 * n} stroke={F.orFonce} strokeWidth={4} /> : null}
            </g>
            <path d={coupe} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 16 : l'immeuble ------- */

const IlluImmeuble: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const X = 130;
  const W = 450;
  const SOL = 840;
  const ETAGE1 = 720;
  const HAUT1 = 556;
  const N = 8;
  const H = (HAUT1 - 60) / N;
  const entree = p(f, 0, 24);
  const mot1 = p(f, d[0] + 60, d[0] + 90);
  const mot100 = p(f, d[0] + 150, d[0] + 186);
  // Le point : au sol, vers l'escalier, puis à l'étage.
  const a = p(f, d[0], d[0] + 34);
  const b = p(f, d[0] + 34, d[0] + 74);
  const c = p(f, d[0] + 74, d[0] + 104);
  const px = c > 0 ? lerp(172, 300, c) : lerp(410, 172, a);
  const py = (c > 0 ? ETAGE1 - 18 : lerp(SOL - 18, ETAGE1 - 18, b));
  const allume = p(f, d[0] + 74, d[0] + 110);
  const spirale = p(f, d[0] + 104, d[0] + 140);
  const peu = p(f, d[1] + 110, d[1] + 150);
  const accel = p(f, d[1], duree);
  const angle = (f - d[0]) * (5 + accel * 7);
  const barre = p(f, d[1] + 180, d[1] + 220);
  const rS = 42 + 10 * peu;
  const pointsSpirale = Array.from({ length: 60 }, (_, i) => {
    const t = i / 59;
    const r = rS * t * spirale;
    const th = t * Math.PI * 6;
    return `${(Math.cos(th) * r).toFixed(1)} ${(Math.sin(th) * r).toFixed(1)}`;
  }).join(' L');
  return (
    <Scene>
      <g opacity={entree}>
        {/* Les étages du haut : grisés, éteints, du début à la fin. */}
        {Array.from({ length: N }, (_, i) => {
          const y = HAUT1 - (i + 1) * H;
          return (
            <g key={i}>
              <rect x={X} y={y} width={W} height={H} fill={F.filet} stroke={F.encre2} strokeWidth={3} />
              {[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={X + 66 + k * 62} y={y + H * 0.28} width={36} height={H * 0.44} fill={F.encre2} opacity={0.35} />)}
              <rect x={X + 12} y={y + 6} width={34} height={H - 12} fill={F.encre2} opacity={0.25} />
            </g>
          );
        })}
        <path d={`M${X - 18} 60 H${X + W + 18}`} stroke={F.encre} strokeWidth={9} strokeLinecap="round" />
        {/* Le premier étage. */}
        <rect x={X} y={HAUT1} width={W} height={ETAGE1 - HAUT1} fill={interpolateColors(allume, [0, 1], [F.filet, F.orClair])} stroke={F.encre} strokeWidth={4} />
        <rect x={X} y={ETAGE1} width={W} height={SOL - ETAGE1} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        {/* L'escalier. */}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} x={X + 8 + i * 9} y={SOL - (i + 1) * 17} width={70 - i * 9} height={17} fill={F.cuirClair} stroke={F.encre} strokeWidth={2} />
        ))}
        <rect x={X - 18} y={SOL} width={W + 36} height={14} rx={4} fill={F.cuir} stroke={F.encre} strokeWidth={3} />
      </g>
      {/* Une barre ferme l'accès au-dessus. */}
      <rect x={X + 4} y={HAUT1 - 7} width={68 * barre} height={14} rx={4} fill={F.argile} stroke={F.encre} strokeWidth={3} />
      {/* Un peu d'argent, et la tête tourne plus fort. */}
      {peu > 0 ? <Piece x={480} y={ETAGE1 - 30} r={28 * peu} /> : null}
      <circle cx={px} cy={py} r={18} fill={F.argile} stroke={F.encre} strokeWidth={4} opacity={entree} />
      {spirale > 0 ? (
        <g transform={`translate(${px} ${ETAGE1 - 100}) rotate(${angle})`}>
          <path d={`M${pointsSpirale}`} fill="none" stroke={F.encre} strokeWidth={5} strokeLinecap="round" />
        </g>
      ) : null}
      <Libelle x={596} y={648} taille={25} graisse={600} ancre="start" opacite={mot1}>{L.premierEtage}</Libelle>
      <Libelle x={596} y={100} taille={25} couleur={F.encre2} ancre="start" opacite={mot100}>{L.centieme}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 17 : quitter les mains - */

const Cle: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M-40 -12 H118 V12 H94 V36 H72 V12 H52 V28 H34 V12 H-40 Z" fill={F.or} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
    <circle cx={-72} cy={0} r={46} fill={F.or} stroke={F.encre} strokeWidth={4.5} />
    <circle cx={-72} cy={0} r={22} fill={F.parchemin} stroke={F.encre} strokeWidth={4.5} />
  </g>
);

const Sceau: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={-82} rx={32} ry={34} fill={F.cuirClair} stroke={F.encre} strokeWidth={4.5} />
    <path d="M-15 -52 C-13 -30 -16 -16 -30 2 H30 C16 -16 13 -30 15 -52 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4.5} strokeLinejoin="round" />
    <rect x={-58} y={2} width={116} height={32} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={4.5} />
    <ellipse cx={0} cy={58} rx={52} ry={13} fill={F.argile} opacity={0.8} />
  </g>
);

const IlluMaison: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 24);
  const glisse = p(f, d[0] + 110, d[0] + 280);
  const rentre = p(f, d[0] + 260, d[0] + 300);
  const noms = p(f, 8, 36);
  const maison = p(f, d[1] + 20, d[1] + 110);
  const part = p(f, d[2] + 40, d[2] + 130);
  const apparait = p(f, d[2] + 10, d[2] + 40);
  const mots1 = p(f, d[2] + 90, d[2] + 125);
  const mots2 = p(f, d[2] + 210, d[2] + 245);
  const essai = p(f, d[2] + 310, d[2] + 350) * (1 - p(f, d[2] + 350, d[2] + 395));
  const dx = lerp(158, 215, part) - essai * 34;
  const X = 630;
  const BAS = 410;
  return (
    <Scene>
      <g opacity={entree}>
        {/* Le socle du donateur. */}
        <rect x={40} y={BAS} width={190} height={20} rx={5} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
        <line x1={232} x2={590} y1={BAS + 8} y2={BAS + 8} stroke={F.encre2} strokeWidth={4} strokeDasharray="14 14" />
        {/* La maison du trésor. */}
        <path d={`M${X - 150} ${BAS - 192} L${X} ${BAS - 300} L${X + 150} ${BAS - 192} Z`} fill={interpolateColors(maison, [0, 1], [F.papier, F.orClair])} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
        <rect x={X - 130} y={BAS - 192} width={260} height={192} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        {[-108, -68, 68, 108].map((c) => <rect key={c} x={X + c - 12} y={BAS - 188} width={24} height={188} fill={F.filet} stroke={F.encre} strokeWidth={3.5} />)}
        <rect x={X - 36} y={BAS - 120} width={72} height={120} fill={F.encre} />
        <rect x={X - 150} y={BAS} width={300} height={20} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />
        <Piece x={X} y={BAS - 222} r={24} opacite={maison} />
      </g>
      <Libelle x={135} y={BAS + 62} taille={28} graisse={600} opacite={noms}>{L.donateur}</Libelle>
      <Libelle x={X} y={BAS + 62} taille={28} graisse={600} opacite={noms}>{L.maisonTresor}</Libelle>
      <Paquet x={lerp(135, X, glisse)} y={BAS} l={lerp(104, 62, rentre)} h={lerp(80, 50, rentre)} opacite={entree * (1 - rentre)} />
      {/* La clé et le sceau s'écartent et ne se rejoignent pas. */}
      <line x1={400} x2={400} y1={520} y2={880} stroke={F.encre2} strokeWidth={4} strokeDasharray="12 14" opacity={part} />
      <g opacity={apparait}>
        <g transform={`translate(${400 - dx} 664) scale(1.22)`}><Cle x={0} y={0} /></g>
        <g transform={`translate(${400 + dx} 664) scale(1.22)`}><Sceau x={0} y={-6} /></g>
      </g>
      <Libelle x={185} y={800} taille={28} graisse={600} opacite={mots1}>{L.gardent[0]}</Libelle>
      <Libelle x={185} y={838} taille={28} opacite={mots1}>{L.gardent[1]}</Libelle>
      <Libelle x={615} y={800} taille={28} graisse={600} opacite={mots2}>{L.decident[0]}</Libelle>
      <Libelle x={615} y={838} taille={28} opacite={mots2}>{L.decident[1]}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 18 : l'étai ----------- */

const IlluEtai: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 800;
  const CX = 590;
  const BAS = 640;
  const lumiere = p(f, 2, 34);
  const ouvre = p(f, d[1] + 10, d[1] + 50);
  const etai = p(f, d[1] + 50, d[1] + 80);
  const piece = p(f, d[1] + 64, d[1] + 132);
  const glisse = p(f, d[1] + 150, d[1] + 215);
  const fente = p(f, d[2] + 8, d[2] + 26);
  const chute = p(f, d[2] + 24, d[2] + 74);
  const ex = lerp(430, CX, glisse);
  const H = SOL - BAS;
  const fissure = `L${ex - 3} ${BAS + H * 0.16} L${ex + 6} ${BAS + H * 0.34} L${ex - 5} ${BAS + H * 0.5} L${ex + 5} ${BAS + H * 0.68} L${ex - 4} ${BAS + H * 0.84}`;
  const angleCouv = 72 * ouvre;
  return (
    <Scene>
      <linearGradient id="ch17-col" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor={F.orClair} stopOpacity="0" />
        <stop offset="0.3" stopColor={F.orClair} stopOpacity="0.95" />
        <stop offset="0.7" stopColor={F.orClair} stopOpacity="0.95" />
        <stop offset="1" stopColor={F.orClair} stopOpacity="0" />
      </linearGradient>
      <linearGradient id="ch17-hautg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.16" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id="ch17-haut" maskUnits="userSpaceOnUse" x={0} y={0} width={800} height={900}><rect x={0} y={0} width={800} height={BAS} fill="url(#ch17-hautg)" /></mask>
      {/* La colonne de lumière ne bouge pas de tout le plan. */}
      <g opacity={lumiere}>
        <rect x={CX - 130} y={0} width={260} height={BAS} fill="url(#ch17-col)" mask="url(#ch17-haut)" />
        {[-52, -18, 18, 52].map((c) => <line key={c} x1={CX + c} x2={CX + c} y1={90} y2={BAS - 12} stroke={F.or} strokeWidth={4} strokeLinecap="round" opacity={0.55} />)}
        <line x1={CX - 62} x2={CX + 62} y1={BAS} y2={BAS} stroke={F.or} strokeWidth={8} strokeLinecap="round" />
      </g>
      <rect x={10} y={SOL} width={780} height={22} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {/* L'étai. */}
      {etai > 0 ? (
        <g opacity={etai}>
          <g transform={`rotate(${-chute * 76} ${ex - 30} ${SOL})`}>
            <path d={`M${ex - 30} ${BAS} H${ex} ${fissure} L${ex} ${SOL} H${ex - 30} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M${ex - 18} ${BAS + 20} V${SOL - 30}`} stroke={F.cuir} strokeWidth={3} />
          </g>
          <g transform={`rotate(${chute * 76} ${ex + 30} ${SOL})`}>
            <path d={`M${ex + 30} ${BAS} H${ex} ${fissure} L${ex} ${SOL} H${ex + 30} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d={`M${ex + 18} ${BAS + 30} V${SOL - 20}`} stroke={F.cuir} strokeWidth={3} />
          </g>
          {chute === 0 ? (
            <g>
              <rect x={ex - 30} y={BAS} width={60} height={H} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
              <path d={`M${ex - 16} ${BAS + 20} V${SOL - 30} M${ex + 14} ${BAS + 34} V${SOL - 18}`} stroke={F.cuir} strokeWidth={3} />
              {fente > 0 ? <path d={`M${ex} ${BAS} ${fissure} L${ex} ${SOL}`} fill="none" stroke={F.encre} strokeWidth={5 * fente} /> : null}
            </g>
          ) : null}
        </g>
      ) : null}
      {/* Le coffret d'autrui. */}
      <g transform="translate(30 0)">
        <rect x={50} y={606} width={290} height={194} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <path d="M50 606 H340" stroke={F.encre} strokeWidth={5} />
        <rect x={68} y={676} width={254} height={68} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <Libelle x={195} y={720} taille={30} graisse={600}>{L.argentAutrui}</Libelle>
        <g transform={`rotate(${-angleCouv} 50 606)`}>
          <path d="M50 606 V566 Q50 544 72 544 H318 Q340 544 340 566 V606 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
          <rect x={181} y={586} width={28} height={30} rx={4} fill={F.or} stroke={F.encre} strokeWidth={3.5} />
        </g>
      </g>
      {/* La pièce file vers l'étai. */}
      {piece > 0 && piece < 1 ? <Piece x={lerp(225, 430, piece)} y={lerp(600, 640, piece) - Math.sin(piece * Math.PI) * 190} r={30} opacite={Math.min(1, piece * 6) * (1 - Math.max(0, piece - 0.85) * 6.6)} /> : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 19 : la fontaine ------ */

type Vasque = { y: number; w: number; h: number };
const VASQUES: Vasque[] = [
  { y: 178, w: 280, h: 96 },
  { y: 408, w: 420, h: 104 },
  { y: 646, w: 600, h: 122 },
];
const CHEMIN_VASQUE = (v: Vasque) => `M${400 - v.w / 2} ${v.y} H${400 + v.w / 2} C${400 + v.w / 2 - 8} ${v.y + v.h * 0.8} ${400 + v.w * 0.26} ${v.y + v.h} ${400 + v.w * 0.14} ${v.y + v.h} H${400 - v.w * 0.14} C${400 - v.w * 0.26} ${v.y + v.h} ${400 - v.w / 2 + 8} ${v.y + v.h * 0.8} ${400 - v.w / 2} ${v.y} Z`;

const Coulee: React.FC<{ x0: number; y0: number; x1: number; y1: number; r: number; f: number }> = ({ x0, y0, x1, y1, r, f }) => {
  if (r <= 0) return null;
  const d = `M${x0} ${y0} C${x0 + (x1 - x0) * 0.9} ${y0} ${x1} ${y0 + (y1 - y0) * 0.2} ${x1} ${y1}`;
  return (
    <g>
      <path d={d} fill="none" stroke={F.orFonce} strokeWidth={13} pathLength={1} strokeDasharray={`${r} 1`} />
      <path d={d} fill="none" stroke={F.orClair} strokeWidth={8} pathLength={1} strokeDasharray={`${r} 1`} />
      {[0, 1, 2].map((k) => {
        const t = ((f / 26 + k / 3) % 1) * r;
        return <circle key={k} cx={cubique(t, x0, x0 + (x1 - x0) * 0.9, x1, x1)} cy={cubique(t, y0, y0, y0 + (y1 - y0) * 0.2, y1)} r={2.5} fill={F.papier} />;
      })}
    </g>
  );
};

const IlluFontaine: React.FC<PropsIllustration> = ({ f, d }) => {
  const jet = p(f, d[0] + 20, d[0] + 60);
  const debuts = [d[1] - 30, d[2] - 30, d[3] - 30];
  const fins = [d[1] + 110, d[2] + 130, d[3] + 170];
  const niveaux = debuts.map((a, i) => p(f, a, fins[i]));
  const debord = [p(f, d[1] + 100, d[1] + 150), p(f, d[2] + 120, d[2] + 170), 0];
  const mots = [p(f, d[1] + 6, d[1] + 36), p(f, d[2] + 6, d[2] + 36), p(f, d[3] + 6, d[3] + 36)];
  return (
    <Scene>
      {/* Le pied. */}
      <path d="M360 768 C356 810 320 830 270 846 H530 C480 830 444 810 440 768 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={210} y={846} width={380} height={24} rx={6} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
      <rect x={374} y={512} width={52} height={134} fill={F.filet} stroke={F.encre} strokeWidth={4.5} />
      <rect x={380} y={274} width={40} height={134} fill={F.filet} stroke={F.encre} strokeWidth={4.5} />
      {/* La colonnette du haut et son jet. */}
      <rect x={390} y={92} width={20} height={86} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <circle cx={400} cy={78} r={20} fill={F.papier} stroke={F.encre} strokeWidth={4.5} />
      {[-1, 1].map((s) => (
        <Coulee key={s} x0={400 + s * 16} y0={70} x1={400 + s * 88} y1={172} r={jet} f={f} />
      ))}
      {/* Les coulées d'une vasque à l'autre, sous les vasques. */}
      {[-1, 1].map((s) => (
        <g key={s}>
          <Coulee x0={400 + s * 136} y0={176} x1={400 + s * 172} y1={402} r={debord[0]} f={f} />
          <Coulee x0={400 + s * 206} y0={406} x1={400 + s * 252} y1={640} r={debord[1]} f={f} />
        </g>
      ))}
      {VASQUES.map((v, i) => {
        const id = `ch17-vasque${i}`;
        const n = niveaux[i];
        return (
          <g key={i}>
            <clipPath id={id}><path d={CHEMIN_VASQUE(v)} /></clipPath>
            <path d={CHEMIN_VASQUE(v)} fill={F.papier} />
            <g clipPath={`url(#${id})`}>
              <rect x={0} y={v.y + v.h - v.h * n} width={800} height={v.h * n + 2} fill={F.orClair} />
              {n > 0 ? <line x1={0} x2={800} y1={v.y + v.h - v.h * n} y2={v.y + v.h - v.h * n} stroke={F.or} strokeWidth={4} /> : null}
            </g>
            <path d={CHEMIN_VASQUE(v)} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
            <rect x={400 - v.w / 2 - 8} y={v.y - 7} width={v.w + 16} height={14} rx={7} fill={F.papier} stroke={F.encre} strokeWidth={4} />
            <Libelle x={400} y={v.y + v.h * 0.58 + 6} taille={i === 2 ? 34 : i === 1 ? 31 : 28} graisse={600} opacite={mots[i]}>{L.vasques[i]}</Libelle>
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 20 : les flammes ------ */

const IlluFlammes: React.FC<PropsIllustration> = ({ f, d }) => {
  const N = 7;
  const CX = 400;
  const CY = 696;
  const RX = 300;
  const RY = 100;
  const UNION = { x: 400, y: 318 };
  const places = Array.from({ length: N }, (_, i) => {
    const a = rad(90 + (i * 360) / N);
    return { i, x: CX + Math.cos(a) * RX, y: CY + Math.sin(a) * RY };
  }).sort((a, b) => a.y - b.y);
  const cercle = p(f, 0, 26);
  const uni = p(f, d[1] - 40, d[1] + 30);
  const lumiere = p(f, d[1] - 10, d[1] + 170);
  const lr = lerp(40, 240, lumiere);
  return (
    <Scene>
      <ellipse cx={CX} cy={CY + 26} rx={RX + 44} ry={RY + 40} fill="none" stroke={F.filet} strokeWidth={7} opacity={cercle} />
      {/* Les rayons qui s'élargissent. */}
      <circle cx={400} cy={190} r={lerp(30, 86, lumiere)} fill={F.orClair} opacity={lumiere * 0.85} />
      <Rayons x={400} y={190} r0={lerp(38, 96, lumiere)} r1={Math.min(186, lr)} n={19} a0={-215} a1={35} o={lumiere} ep={7} />
      {/* Les fils de fumée, d'abord chacun le sien, puis unis. */}
      {places.map(({ i, x, y }) => {
        const a = d[0] + 40 + i * 22;
        const r = p(f, a + 16, d[1] - 20);
        if (r <= 0) return null;
        const w = Math.sin(f / 26 + i) * 16;
        const trace = `M${x} ${y - 62} C${x + w} ${lerp(y - 62, UNION.y, 0.4)} ${UNION.x - w + (x - UNION.x) * 0.35} ${UNION.y + 130} ${UNION.x} ${UNION.y}`;
        return <path key={i} d={trace} fill="none" stroke={F.encre2} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${r} 1`} opacity={0.75} />;
      })}
      <path d={`M${UNION.x} ${UNION.y} C${UNION.x + Math.sin(f / 22) * 12} 290 ${UNION.x - Math.sin(f / 22) * 12} 270 400 ${lerp(318, 272, uni)}`} fill="none" stroke={F.encre2} strokeWidth={9} strokeLinecap="round" opacity={uni * 0.8} />
      {/* Les petites lampes. */}
      {places.map(({ i, x, y }) => {
        const a = d[0] + 40 + i * 22;
        const o = p(f, a, a + 20);
        const flic = 1 + Math.sin(f / 4 + i * 2) * 0.07;
        return (
          <g key={i} opacity={cercle}>
            <path d={`M${x - 42} ${y} H${x + 42} C${x + 38} ${y + 28} ${x - 38} ${y + 28} ${x - 42} ${y} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <g transform={`translate(${x} ${y}) scale(${o} ${o * flic})`}>
              <path d="M0 -60 C24 -30 30 -14 22 0 H-22 C-30 -14 -24 -30 0 -60 Z" fill={F.argile} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
              <path d="M0 -36 C12 -20 14 -8 10 0 H-10 C-14 -8 -12 -20 0 -36 Z" fill={F.orClair} />
            </g>
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 21 : la toise --------- */

const IlluToise: React.FC<PropsIllustration> = ({ f, d }) => {
  const BAS = 830;
  const RX = 450;
  const PAS = 38;
  const entree = p(f, 0, 22);
  const monte = p(f, d[0] + 16, d[0] + 90);
  const croit = p(f, d[0] + 86, d[0] + 110) * (1 - p(f, d[0] + 150, d[0] + 170));
  const allonge = p(f, d[0] + 142, d[1] + 40);
  const lum = p(f, d[0] + 150, d[1] + 100);
  const z = lerp(1, 0.44, allonge);
  const kHaut = lerp(10, 60, allonge);
  const yHaut = Math.max(-10, BAS - kHaut * PAS * z);
  const kBarre = lerp(2.3, 9.8, monte);
  const yBarre = BAS - kBarre * PAS * z;
  const graduations = Array.from({ length: 61 }, (_, k) => k).filter((k) => BAS - k * PAS * z > yHaut + 6);
  const PX = 170;
  const R0 = lerp(40, 250, lum);
  return (
    <Scene>
      <linearGradient id="ch17-fondu" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.2" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" stopOpacity="1" />
      </linearGradient>
      <mask id="ch17-toise" maskUnits="userSpaceOnUse" x={0} y={-20} width={800} height={920}>
        <rect x={0} y={0} width={800} height={200} fill="url(#ch17-fondu)" />
        <rect x={0} y={200} width={800} height={700} fill="#fff" />
      </mask>
      <radialGradient id="ch17-halo" gradientUnits="userSpaceOnUse" cx={RX} cy={0} r={R0 + 10}>
        <stop offset="0" stopColor={F.orClair} stopOpacity="0.95" />
        <stop offset="0.7" stopColor={F.orClair} stopOpacity="0.8" />
        <stop offset="1" stopColor={F.orClair} stopOpacity="0" />
      </radialGradient>
      {/* La lumière, en haut. */}
      <rect x={RX - R0 - 10} y={0} width={2 * R0 + 20} height={R0 + 10} fill="url(#ch17-halo)" opacity={lum} />
      <Rayons x={RX} y={0} r0={R0 + 14} r1={lerp(R0 + 24, 336, lum)} n={13} a0={12} a1={168} o={lum} ep={7} />
      <rect x={10} y={BAS} width={780} height={24} rx={6} fill={F.cuir} stroke={F.encre} strokeWidth={4} opacity={entree} />
      {/* La toise : elle s'allonge et se perd dans la lumière. */}
      <g opacity={entree} mask="url(#ch17-toise)">
        <path d={`M${RX - 48} ${BAS} V${yHaut + 8} Q${RX - 48} ${yHaut} ${RX - 40} ${yHaut} H${RX + 40} Q${RX + 48} ${yHaut} ${RX + 48} ${yHaut + 8} V${BAS} Z`} fill={F.papier} stroke={F.encre} strokeWidth={5} />
        {graduations.map((k) => {
          const y = BAS - k * PAS * z;
          return <line key={k} x1={RX + 48} x2={RX + 48 - (k % 5 === 0 ? 50 : 26)} y1={y} y2={y} stroke={F.encre} strokeWidth={k % 5 === 0 ? 4 : 2.5} opacity={k === 0 ? 0 : 1} />;
        })}
      </g>
      {/* Le petit paquet et sa barre. */}
      <g opacity={entree}>
        <line x1={PX} x2={PX} y1={yBarre} y2={BAS - 110 * z} stroke={F.encre2} strokeWidth={4} strokeDasharray="10 10" opacity={monte} />
        <Paquet x={PX} y={BAS} l={120 * z} h={80 * z} />
        {croit > 0 ? <circle cx={RX - 60} cy={yBarre} r={18 + croit * 30} fill={F.orClair} opacity={croit * 0.6} /> : null}
        <rect x={PX - 76 * z} y={yBarre - 8} width={RX + 48 - (PX - 76 * z)} height={16} rx={6} fill={F.argile} stroke={F.encre} strokeWidth={3.5} />
      </g>
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluTitre,
  p2: IlluPromesse,
  p3: IlluTroisLois,
  p4: IlluArachides,
  p5: IlluMais,
  p6: IlluAutel,
  p7: IlluTemps,
  p8: IlluDepart,
  p9: IlluSource,
  p10: IlluTamis,
  p11: IlluRiviere,
  p12: IlluRobinet,
  p13: IlluSemencePain,
  p14: IlluManne,
  p15: IlluVase,
  p16: IlluImmeuble,
  p17: IlluMaison,
  p18: IlluEtai,
  p19: IlluFontaine,
  p20: IlluFlammes,
  p21: IlluToise,
  fin: IlluFin,
};

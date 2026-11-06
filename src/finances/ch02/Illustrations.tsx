import React from 'react';
import { Coeur, Libelle, Piece, PropsIllustration, Scene, Thermometre, p } from '../moteur/primitives';
import { F, PoliceF } from '../theme';
import { LIBELLES } from './libelles';

/* ------------------------------------------------------------------ Outils ------------------------------------------------------------------ */

const COEUR = 'M0 42 C-64 2 -54 -48 -24 -50 C-10 -51 0 -40 0 -30 C0 -40 10 -51 24 -50 C54 -48 64 2 0 42 Z';
const lin = (f: number, a: number, b: number) => Math.max(0, Math.min(1, (f - a) / (b - a)));
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const rebond = (t: number) => {
  const n = 7.5625;
  const e = 2.75;
  if (t < 1 / e) return n * t * t;
  if (t < 2 / e) return n * (t - 1.5 / e) ** 2 + 0.75;
  if (t < 2.5 / e) return n * (t - 2.25 / e) ** 2 + 0.9375;
  return n * (t - 2.625 / e) ** 2 + 0.984375;
};

/** Halo doré aux bords fondus. */
const Lueur: React.FC<{ id: string; x: number; y: number; r: number; opacite: number }> = ({ id, x, y, r, opacite }) => (
  <g opacity={opacite}>
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor={F.orClair} stopOpacity={0.85} />
        <stop offset="0.6" stopColor={F.orClair} stopOpacity={0.35} />
        <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

/** Rayons de lumière qui descendent du haut de la scène : jamais de figure, seulement la lumière. */
const Rayons: React.FC<{ id: string; x: number; haut: number; bas: number; n: number; ecart: number; t: number; force?: number; f: number }> = ({ id, x, haut, bas, n, ecart, t, force = 1, f }) => (
  <g>
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={haut} y2={bas}>
        <stop offset="0" stopColor={F.orClair} stopOpacity={0} />
        <stop offset="0.16" stopColor={F.orClair} stopOpacity={0.95} />
        <stop offset="1" stopColor={F.orClair} stopOpacity={0.04} />
      </linearGradient>
    </defs>
    {Array.from({ length: n }, (_, i) => {
      const k = i - (n - 1) / 2;
      const local = lin(t, (Math.abs(k) / n) * 0.45, 0.55 + (Math.abs(k) / n) * 0.45);
      const y = haut + (bas - haut) * local;
      const xBas = x + k * ecart;
      const xVrai = mix(x + k * 22, xBas, local);
      const largeur = 12 + 22 * local;
      const vibre = 0.72 + 0.28 * Math.sin(f / 16 + i * 1.7);
      return <path key={i} d={`M${x + k * 22 - 7} ${haut} L${x + k * 22 + 7} ${haut} L${xVrai + largeur} ${y} L${xVrai - largeur} ${y} Z`} fill={`url(#${id})`} opacity={force * vibre} />;
    })}
  </g>
);

const Maison: React.FC<{ x: number; y: number; s?: number; rotation?: number; ouverture?: number; lumiere?: number; toit?: string }> = ({ x, y, s = 1, rotation = 0, ouverture = 0, lumiere = 0, toit = F.argile }) => {
  const trait = 4 / s;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${s})`}>
      <rect x={52} y={-196} width={24} height={52} fill={F.cuirClair} stroke={F.encre} strokeWidth={trait} />
      <rect x={-80} y={-124} width={160} height={124} fill={F.papier} stroke={F.encre} strokeWidth={trait} />
      <path d="M-102 -118 L0 -204 L102 -118 Z" fill={toit} stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" />
      {[-52, 52].map((c) => (
        <g key={c}>
          <rect x={c - 17} y={-98} width={34} height={36} fill={F.parchemin} stroke={F.encre} strokeWidth={trait * 0.8} />
          <rect x={c - 15} y={-96} width={30} height={32} fill={F.orClair} opacity={lumiere} />
          <path d={`M${c} -98 V-62 M${c - 17} -80 H${c + 17}`} stroke={F.encre} strokeWidth={trait * 0.55} />
        </g>
      ))}
      <rect x={-24} y={-74} width={48} height={74} fill={F.orClair} stroke={F.encre} strokeWidth={trait} />
      <rect x={-24} y={-74} width={48 * (1 - 0.82 * ouverture)} height={74} fill={F.cuir} stroke={F.encre} strokeWidth={trait} />
      <circle cx={-24 + 48 * (1 - 0.82 * ouverture) - 8} cy={-36} r={3.5} fill={F.orClair} opacity={1 - ouverture} />
    </g>
  );
};

const Voiture: React.FC<{ x: number; y: number; s?: number; rotation?: number }> = ({ x, y, s = 1, rotation = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation}) scale(${s})`}>
    <path d="M-94 12 Q-98 -20 -62 -24 L-38 -58 Q-32 -64 -22 -64 H28 Q38 -64 44 -56 L66 -24 Q96 -20 94 12 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={4 / s} strokeLinejoin="round" />
    <path d="M-44 -24 L-26 -52 H-4 V-24 Z" fill={F.papier} stroke={F.encre} strokeWidth={3 / s} />
    <path d="M8 -24 V-52 H28 L46 -24 Z" fill={F.papier} stroke={F.encre} strokeWidth={3 / s} />
    <path d="M-92 -4 H-76 M76 -4 H92" stroke={F.orClair} strokeWidth={6 / s} strokeLinecap="round" />
    {[-52, 52].map((c) => (
      <g key={c}>
        <circle cx={c} cy={14} r={20} fill={F.encre} />
        <circle cx={c} cy={14} r={8} fill={F.papier} />
      </g>
    ))}
  </g>
);

const SAC_CORPS = 'M-34 -200 C-120 -140 -128 -30 -76 0 H76 C128 -30 120 -140 34 -200 Z';

/** Sac noué, posé sur (x, y). */
const Sac: React.FC<{ x: number; y: number; s?: number; sy?: number; corps?: boolean }> = ({ x, y, s = 1, sy, corps = true }) => {
  const v = sy ?? s;
  const trait = 4 / Math.min(s, v);
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${v})`}>
      {corps ? <path d={SAC_CORPS} fill={F.cuir} stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" /> : null}
      <path d="M-34 -200 L-54 -240 Q0 -222 54 -240 L34 -200 Z" fill={F.cuirClair} stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" />
      <rect x={-40} y={-208} width={80} height={15} rx={6} fill={F.orClair} stroke={F.encre} strokeWidth={trait * 0.7} />
    </g>
  );
};

/** Coffre vu de côté : le couvercle pivote sur la charnière de gauche. (x, y) : milieu du bord supérieur de la caisse. */
const Coffre: React.FC<{ x: number; y: number; l: number; h: number; ouverture: number; children?: React.ReactNode; cerclage?: boolean }> = ({ x, y, l, h, ouverture, children, cerclage = true }) => {
  const arc = l * 0.3;
  const g = x - l / 2;
  return (
    <g>
      <rect x={g + 6} y={y - 8} width={l - 12} height={h * 0.4} fill={F.encre} />
      {children}
      <rect x={g} y={y} width={l} height={h} rx={5} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
      {cerclage ? [0.22, 0.78].map((c) => <rect key={c} x={g + l * c - l * 0.035} y={y} width={l * 0.07} height={h} fill={F.or} stroke={F.encre} strokeWidth={3} />) : null}
      <line x1={g} x2={g + l} y1={y + h * 0.5} y2={y + h * 0.5} stroke={F.cuirClair} strokeWidth={3} />
      <g transform={`rotate(${-112 * ouverture} ${g} ${y})`}>
        <path d={`M${g} ${y} Q${g} ${y - arc * 1.35} ${x} ${y - arc * 1.35} Q${g + l} ${y - arc * 1.35} ${g + l} ${y} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        {cerclage ? [0.22, 0.78].map((c) => <path key={c} d={`M${g + l * c} ${y} V${y - arc * 0.84}`} stroke={F.or} strokeWidth={l * 0.07} />) : null}
      </g>
    </g>
  );
};

const Cadenas: React.FC<{ x: number; y: number; ouvert: number; rotation?: number }> = ({ x, y, ouvert, rotation = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
    <path d={`M-20 -22 V${-44 - ouvert * 16} A20 20 0 0 1 20 ${-44 - ouvert * 16} V${-22 - ouvert * 16}`} fill="none" stroke={F.encre} strokeWidth={9} />
    <rect x={-34} y={-24} width={68} height={58} rx={8} fill={F.or} stroke={F.encre} strokeWidth={4} />
    <circle cx={0} cy={0} r={8} fill={F.encre} />
    <rect x={-3.5} y={2} width={7} height={18} fill={F.encre} />
  </g>
);

/** Registre fermé d'un trait : une couverture, une page, des lignes qui s'écrivent. */
const LignesRegistre: React.FC<{ x: number; y: number; l: number; t: number; n: number; pas: number }> = ({ x, y, l, t, n, pas }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const o = lin(t, i / (n + 1), (i + 1) / (n + 1));
      return (
        <g key={i}>
          <line x1={x} x2={x + l * (0.62 + 0.38 * ((i * 37) % 10) / 10) * o} y1={y + i * pas} y2={y + i * pas} stroke={F.encre2} strokeWidth={6} strokeLinecap="round" opacity={o > 0 ? 1 : 0} />
        </g>
      );
    })}
  </g>
);

/** Champ en légère perspective : `vide` de 0 à 1 enlève les épis. */
const Champ: React.FC<{ x: number; y: number; l: number; h: number; vide: number; f: number }> = ({ x, y, l, h, vide, f }) => {
  const rangs = 4;
  const epis = 6;
  const m = l * 0.13;
  const xa = (u: number, v: number) => mix(x + m, x, v) + u * mix(l - 2 * m, l, v);
  return (
    <g>
      <path d={`M${x + m} ${y} H${x + l - m} L${x + l} ${y + h} H${x} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      {Array.from({ length: 7 }, (_, i) => (
        <line key={i} x1={xa((i + 0.5) / 7, 0)} y1={y + 2} x2={xa((i + 0.5) / 7, 1)} y2={y + h - 2} stroke={F.cuir} strokeWidth={3} />
      ))}
      {Array.from({ length: rangs }, (_, r) => {
        const v = 0.16 + r * 0.26;
        const yr = y + v * h;
        const ech = (0.72 + 0.5 * v) * Math.min(1.25, h / 190);
        return (
          <g key={r}>
            {Array.from({ length: epis }, (_, e) => {
              const ex = xa((e + 0.5) / epis, v);
              const seuil = (epis - 1 - e + r * 0.6) / (epis + rangs * 0.6);
              const o = 1 - lin(vide, seuil, seuil + 0.22);
              const haut = 46 * ech;
              const penche = Math.sin(f / 21 + e * 0.8 + r) * 4;
              return o > 0 ? (
                <g key={e} opacity={o} transform={`translate(${(1 - o) * 30} ${(1 - o) * -22})`}>
                  <path d={`M${ex} ${yr} Q${ex} ${yr - haut * 0.6} ${ex + penche} ${yr - haut}`} fill="none" stroke={F.orFonce} strokeWidth={3} />
                  <ellipse cx={ex + penche} cy={yr - haut} rx={7 * ech} ry={13 * ech} fill={F.or} stroke={F.orFonce} strokeWidth={2} />
                </g>
              ) : null;
            })}
          </g>
        );
      })}
    </g>
  );
};

/* ------------------------------------------------------------------ Ouverture ------------------------------------------------------------------ */

const IlluOuvertureCh2: React.FC<PropsIllustration> = ({ f }) => {
  const rayons = p(f, 6, 80);
  const lueur = p(f, 50, 110);
  return (
    <Scene>
      <Rayons id="ch2-ouv-rayon" x={400} haut={0} bas={640} n={9} ecart={82} t={rayons} f={f} />
      <Lueur id="ch2-ouv-lueur" x={400} y={210} r={210 + 12 * Math.sin(f / 18)} opacite={0.7 * lueur} />
      <Thermometre x={400} y={210} h={500} l={72} niveau={0.06 + 0.2 * p(f, 60, 150)} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 2 : l'emprise ------------------------------------------------------------------ */

const IlluEmprise: React.FC<PropsIllustration> = ({ f, d }) => {
  const cx = 400;
  const cy = 430;
  const s = 3.2;
  const eclair = d[0] + 110;
  const flash = lin(f, eclair - 5, eclair + 1) * (1 - lin(f, eclair + 8, eclair + 30));
  const lib = p(f, eclair + 6, eclair + 80);
  const tire = (1 - lib) * Math.sin(f / 5) * 1.6;
  const flot = (n: number) => lib * Math.sin(f / 26 + n * 2.1) * 9;
  // À la dernière phrase, les objets reviennent vers le cœur et butent sur l'espace libre sans le toucher.
  const essai = Math.max(0, Math.sin((f - d[2]) / 42)) * p(f, d[2], d[2] + 30) * 26;
  const anneau = p(f, d[2] + 10, d[2] + 60);
  const secousse = flash * Math.sin(f * 2.3) * 8;
  const champ = 1 - p(f, eclair - 2, eclair + 26);
  return (
    <Scene>
      <defs>
        <clipPath id="ch2-p2-coeur">
          <path transform={`translate(${cx} ${cy}) scale(${s})`} d={COEUR} />
        </clipPath>
        <radialGradient id="ch2-p2-flash">
          <stop offset="0" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0} />
        </radialGradient>
      </defs>
      {/* Le champ de l'aimant : des contours qui se referment sur le cœur. */}
      {[1.16, 1.3, 1.44].map((k, i) => (
        <path
          key={k}
          transform={`translate(${cx} ${cy}) scale(${s * k})`}
          d={COEUR}
          fill="none"
          stroke={F.orFonce}
          strokeWidth={2.5 / (s * k)}
          strokeDasharray={`${9 / (s * k)} ${11 / (s * k)}`}
          strokeDashoffset={(f + i * 7) / (s * k)}
          opacity={champ * 0.7}
        />
      ))}
      <circle cx={cx} cy={cy - 20} r={212} fill="none" stroke={F.or} strokeWidth={4} strokeDasharray="4 16" strokeLinecap="round" opacity={anneau} />

      <g transform={`translate(${secousse} 0)`}>
        <path transform={`translate(${cx} ${cy}) scale(${s})`} d={COEUR} fill={F.argile} stroke={F.encre} strokeWidth={4 / s} />
        <g clipPath="url(#ch2-p2-coeur)">
          {/* Les pôles de l'aimant : le haut des deux lobes. Ils s'éteignent quand l'emprise est rompue. */}
          <rect x={cx - 200} y={cy - 170} width={400} height={56} fill={F.papier} opacity={1 - lib} />
          <line x1={cx - 200} x2={cx + 200} y1={cy - 114} y2={cy - 114} stroke={F.encre} strokeWidth={4} opacity={1 - lib} />
          <circle cx={cx} cy={cy + 10} r={190} fill="url(#ch2-p2-flash)" opacity={Math.max(flash, 0.55 * lib)} />
        </g>
        <path transform={`translate(${cx} ${cy}) scale(${s})`} d={COEUR} fill="none" stroke={F.encre} strokeWidth={4 / s} />
      </g>

      <Maison x={mix(226, 122, lib) + tire + essai * 0.35} y={mix(340, 335, lib) + flot(0)} s={0.74} rotation={mix(-80, -5, lib)} lumiere={lib} toit={F.cuir} />
      <Voiture x={mix(606, 690, lib) + tire - essai * 0.35} y={mix(340, 310, lib) + flot(1)} s={0.86} rotation={mix(82, 5, lib)} />
      <g transform={`translate(0 ${flot(2) + tire})`}>
        <Piece x={400} y={mix(612, 760, lib) - essai * 0.8} r={54} />
      </g>

      {flash > 0 ? (
        <g opacity={flash}>
          <circle cx={cx} cy={cy} r={420} fill="url(#ch2-p2-flash)" opacity={0.75} />
          <path d="M452 0 L356 228 L438 236 L330 470 L424 478 L336 720 L392 736 L304 900 L470 610 L396 600 L506 372 L420 362 L532 0 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 3 : le coffre ------------------------------------------------------------------ */

const Bulle: React.FC<{ x: number; y: number; s: number; sens: number; opacite: number }> = ({ x, y, s, sens, opacite }) => (
  <g transform={`translate(${x} ${y}) scale(${s * sens} ${s})`} opacity={opacite}>
    <path d="M-52 -42 H52 Q70 -42 70 -24 V16 Q70 34 52 34 H10 L34 62 L-16 34 H-52 Q-70 34 -70 16 V-24 Q-70 -42 -52 -42 Z" fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
  </g>
);

const IlluCoffre: React.FC<PropsIllustration> = ({ f, d }) => {
  const rim = 480;
  const CX = 430;
  // La croix se tient hors de la course du couvercle, qui balaie un quart de cercle depuis la charnière.
  const XC = 640;
  const SOL = 742;
  // Les paroles : chaque bulle arrive, frappe le couvercle et repart.
  const fenetre = d[1] - d[0];
  const N = 5;
  const duree = 74;
  const bulles = Array.from({ length: N }, (_, i) => ({ i, debut: d[0] - 12 + (i * (fenetre - duree + 10)) / (N - 1), sens: i % 2 === 0 ? 1 : -1 }));
  let choc = 0;
  for (const b of bulles) {
    const age = f - (b.debut + duree * 0.5);
    if (age >= 0) choc += Math.exp(-age / 9) * Math.sin(age / 1.5);
  }
  const croix = p(f, d[1] + 70, d[1] + 115);
  const esprit = p(f, d[1] + 170, d[1] + 240);
  const chute = lin(f, d[1] + 215, d[1] + 265);
  const ouvre = p(f, d[1] + 290, d[1] + 390);
  const don = d[1] + 440;
  // Le cadenas tombe et finit couché sur le sol : sa position suit ce que sa rotation lui fait occuper sous son centre.
  const bascule = chute * 90;
  const emprise = 34 * (Math.abs(Math.sin((bascule * Math.PI) / 180)) + Math.abs(Math.cos((bascule * Math.PI) / 180))) + 2;
  const yCad = mix(rim + 46, SOL - 2 - emprise, rebond(chute));
  const PILE = [
    [652, 714], [704, 714], [756, 714], [678, 668], [730, 668], [704, 622],
  ];
  return (
    <Scene>
      <line x1={30} x2={790} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />

      {/* La croix et sa lumière. */}
      <g opacity={croix}>
        <Lueur id="ch2-p3-lueur" x={XC} y={150} r={150} opacite={1} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          const r0 = 112;
          const r1 = 112 + 34 * esprit;
          return <line key={i} x1={XC + Math.cos(a) * r0} y1={150 + Math.sin(a) * r0} x2={XC + Math.cos(a) * r1} y2={150 + Math.sin(a) * r1} stroke={F.or} strokeWidth={6} strokeLinecap="round" opacity={esprit} />;
        })}
        <g transform={`translate(${XC} ${150 + (1 - croix) * 30})`}>
          <rect x={-15} y={-100} width={30} height={200} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <rect x={-62} y={-58} width={124} height={30} rx={3} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
          <rect x={-11} y={-56} width={22} height={26} fill={F.cuir} />
        </g>
      </g>

      {bulles.map((b) => {
        const t = lin(f, b.debut, b.debut + duree);
        if (t <= 0 || t >= 1) return null;
        const aller = Math.min(1, t * 2) ** 2;
        const retour = Math.max(0, t * 2 - 1);
        const retourDoux = 1 - (1 - retour) ** 2;
        const loin = b.sens > 0 ? 286 : 316;
        const xHaut = CX + b.sens * loin;
        const yHaut = 96 + (b.i % 3) * 56;
        const xChoc = CX + b.sens * 104;
        const yChoc = 276;
        const x = t < 0.5 ? mix(xHaut, xChoc, aller) : mix(xChoc, CX + b.sens * loin, retourDoux);
        const y = t < 0.5 ? mix(yHaut, yChoc, aller) : mix(yChoc, 320 - (b.i % 2) * 70, retourDoux);
        const ecrase = 1 - 0.14 * Math.exp(-Math.abs(t - 0.5) * 22);
        return <Bulle key={b.i} x={x} y={y} s={ecrase} sens={b.sens} opacite={Math.min(1, t * 8) * Math.min(1, (1 - t) * 4)} />;
      })}

      <g transform={`rotate(${choc * 1.1} ${CX} ${SOL})`}>
        <Coffre x={CX} y={rim} l={360} h={SOL - rim} ouverture={ouvre}>
          {/* Ce qui attendait dans le coffre. */}
          <g opacity={lin(ouvre, 0.15, 0.4)}>
            <path d="M262 482 Q430 382 598 482 Z" fill={F.orClair} stroke={F.orFonce} strokeWidth={3} />
            {[[332, 452], [388, 432], [450, 432], [504, 452], [420, 462]].map(([x, y]) => (
              <Piece key={x} x={x} y={y} r={25} />
            ))}
          </g>
        </Coffre>
        {/* Le moraillon, solidaire du couvercle. */}
        <g transform={`rotate(${-112 * ouvre} ${CX - 180} ${rim})`}>
          <rect x={CX - 14} y={rim - 26} width={28} height={40} rx={3} fill={F.or} stroke={F.encre} strokeWidth={3} />
        </g>
      </g>
      <Cadenas x={CX} y={yCad} ouvert={p(f, d[1] + 170, d[1] + 215)} rotation={bascule} />

      {/* Ils voudront tout donner : les pièces sortent. */}
      {PILE.map(([x, y], i) => {
        const a = don + i * 15;
        const t = lin(f, a, a + 34);
        if (t <= 0) return null;
        const x0 = 370 + (i % 4) * 44;
        const xc = mix(x0, x, t);
        const yc = mix(440, y, t) - Math.sin(t * Math.PI) * 190;
        return <Piece key={i} x={xc} y={yc} r={26} />;
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 4 : quatre chapitres ------------------------------------------------------------------ */

const Bourse: React.FC<{ t: number; f: number }> = ({ t, f }) => {
  const ouvre = p(t, 6, 40);
  return (
    <g>
      {/* Des pièces en sortent sans s'arrêter : dons spontanés et continuels. */}
      {Array.from({ length: 5 }, (_, i) => {
        const periode = 70;
        const age = ((f + i * 14) % periode) / periode;
        const sens = i % 2 === 0 ? -1 : 1;
        const portee = 34 + (i % 3) * 26;
        return <Piece key={i} x={sens * portee * age} y={-34 - Math.sin(age * Math.PI) * 112 + age * 34} r={15} opacite={ouvre * Math.min(1, age * 6) * Math.min(1, (1 - age) * 4)} />;
      })}
      <path d="M-68 -24 C-128 16 -122 108 -70 118 H70 C122 108 128 16 68 -24 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
      <ellipse cx={0} cy={-24} rx={68} ry={6 + 16 * ouvre} fill={F.encre} stroke={F.encre} strokeWidth={4} />
      <path d={`M-68 -24 Q0 ${-24 + 6 + 16 * ouvre + 2} 68 -24`} fill="none" stroke={F.orClair} strokeWidth={6} />
      <path d="M-66 -18 L-92 -46 M66 -18 L92 -46" stroke={F.orClair} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};

const PieceFendue: React.FC<{ t: number }> = ({ t }) => {
  const fente = lin(t, 20, 64);
  const ecart = p(t, 72, 118);
  const r = 104;
  const zig = 'M6 -112 L-16 -58 L14 -24 L-14 18 L10 58 L-8 112';
  return (
    <g>
      <defs>
        <clipPath id="ch2-p4-g"><path d={`${zig} H-130 V-112 Z`} /></clipPath>
        <clipPath id="ch2-p4-d"><path d={`${zig} H130 V-112 Z`} /></clipPath>
      </defs>
      <g transform={`translate(${-ecart * 22} ${ecart * 8}) rotate(${-ecart * 9})`} clipPath="url(#ch2-p4-g)">
        <Piece x={0} y={0} r={r} />
      </g>
      <g transform={`translate(${ecart * 22} ${ecart * 8}) rotate(${ecart * 9})`} clipPath="url(#ch2-p4-d)">
        <Piece x={0} y={0} r={r} />
      </g>
      {ecart === 0 ? <path d={zig} pathLength={1} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" strokeDasharray={`${fente} 1`} /> : null}
    </g>
  );
};

const RegistreSigne: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-112} y={-110} width={224} height={226} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
    <rect x={-96} y={-100} width={198} height={206} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
    <line x1={-58} x2={-58} y1={-100} y2={106} stroke={F.argile} strokeWidth={3} />
    <LignesRegistre x={-44} y={-72} l={132} t={lin(t, 10, 150)} n={6} pas={32} />
    {Array.from({ length: 6 }, (_, i) => (
      <circle key={i} cx={-78} cy={-72 + i * 32} r={7} fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={lin(t, 10 + (i * 140) / 7, 22 + (i * 140) / 7)} />
    ))}
  </g>
);

const IlluQuatrePages: React.FC<PropsIllustration> = ({ f, d }) => {
  const ax = 400;
  const haut = 120;
  const bas = 770;
  const PG = 72;
  const PD = 728;
  const lignes = (x0: number, x1: number, y0: number, n: number) =>
    Array.from({ length: n }, (_, i) => <line key={i} x1={x0} x2={x1} y1={y0 + i * 40} y2={y0 + i * 40} stroke={F.filet} strokeWidth={3} />);

  const gauche = (k: number) => (
    <g>
      <rect x={PG} y={haut + 14} width={ax - PG - 3} height={bas - haut - 28} fill={F.papier} />
      {k < 0 ? (
        lignes(PG + 36, ax - 36, haut + 70, 13)
      ) : (
        <>
          <Libelle x={(PG + ax) / 2} y={270} taille={36} couleur={F.encre2}>{LIBELLES.chapitre}</Libelle>
          <text x={(PG + ax) / 2} y={560} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={270} fontWeight={500} fill={F.orFonce}>{LIBELLES.pages[k].numero}</text>
        </>
      )}
    </g>
  );

  const signe = (k: number) => {
    const t = f - d[k] - 14;
    const c = { transform: `translate(${(ax + PD) / 2} ${k === 3 ? 395 : k === 1 ? 400 : 385})` };
    if (k === 0) return <g {...c}><Bourse t={t} f={f} /></g>;
    if (k === 1) {
      return <g {...c}><Champ x={-136} y={-100} l={272} h={220} vide={lin(t, 40, 330)} f={f} /></g>;
    }
    if (k === 2) return <g {...c}><PieceFendue t={t} /></g>;
    return <g {...c}><RegistreSigne t={t} /></g>;
  };

  const droite = (k: number) => (
    <g>
      <rect x={ax + 3} y={haut + 14} width={PD - ax - 3} height={bas - haut - 28} fill={F.papier} />
      {k < 0 ? (
        lignes(ax + 36, PD - 36, haut + 70, 13)
      ) : (
        <>
          {signe(k)}
          <Libelle x={(ax + PD) / 2} y={660} taille={38} graisse={600}>{LIBELLES.pages[k].mot}</Libelle>
        </>
      )}
    </g>
  );

  let tournees = -1;
  let enCours = -1;
  let t = 0;
  for (let i = 0; i < d.length; i++) {
    const a = d[i] - 16;
    const b = d[i] + 14;
    if (f >= b) tournees = i;
    else if (f >= a) {
      enCours = i;
      t = p(f, a, b);
    }
  }
  const dessous = enCours >= 0 ? enCours : tournees;
  return (
    <Scene>
      <rect x={PG - 22} y={haut - 8} width={PD - PG + 44} height={bas - haut + 16} rx={12} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {[0, 1, 2].map((i) => (
        <rect key={i} x={PG - 10 + i * 3} y={haut + 6 + i * 3} width={PD - PG + 20 - i * 6} height={bas - haut - 12 - i * 6} rx={4} fill={F.papier} stroke={F.filet} strokeWidth={2} />
      ))}
      {gauche(tournees)}
      {droite(dessous)}
      <rect x={PG} y={haut + 14} width={ax - PG - 3} height={bas - haut - 28} fill="none" stroke={F.filet} strokeWidth={2} />
      <rect x={ax + 3} y={haut + 14} width={PD - ax - 3} height={bas - haut - 28} fill="none" stroke={F.filet} strokeWidth={2} />
      <line x1={ax} x2={ax} y1={haut + 6} y2={bas - 6} stroke={F.encre} strokeWidth={5} />
      {enCours >= 0 ? (
        <g transform={`translate(${ax} 0) scale(${t < 0.5 ? 1 - 2 * t : 2 * t - 1} 1) translate(${-ax} 0)`}>
          {t < 0.5 ? droite(tournees) : gauche(enCours)}
          <rect x={t < 0.5 ? ax + 3 : PG} y={haut + 14} width={t < 0.5 ? PD - ax - 3 : ax - PG - 3} height={bas - haut - 28} fill="none" stroke={F.encre2} strokeWidth={3} />
        </g>
      ) : null}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 5 : le remplacement ------------------------------------------------------------------ */

const Vague = (niveau: number, f: number, x0: number, x1: number, bas: number, amp = 7) => {
  const n = 14;
  let c = `M${x0} ${bas} L${x0} ${niveau}`;
  for (let i = 0; i <= n; i++) {
    const x = mix(x0, x1, i / n);
    c += ` L${x.toFixed(1)} ${(niveau + Math.sin(x / 42 + f / 14) * amp).toFixed(1)}`;
  }
  return `${c} L${x1} ${bas} Z`;
};

const IlluRemplacement: React.FC<PropsIllustration> = ({ f, d }) => {
  const s = 6;
  const cx = 400;
  const cy = 510;
  const haut = cy - 50 * s;
  const fond = cy + 42 * s;
  const monte = lin(f, d[1] - 20, d[3] + 90);
  const L = mix(fond + 6, haut + 6, monte);
  const plein = p(f, d[3] + 80, d[3] + 120);
  const battement = 1 + 0.012 * plein * Math.sin((f - d[3]) / 8);
  // Deux étages : maison et voiture flottent en surface, le sac et la pièce plus bas (`tirant`), pour ne jamais se toucher.
  const objets: { x0: number; y0: number; tirant: number; delai: number; dessin: (x: number, y: number, r: number) => React.ReactNode }[] = [
    { x0: 215, y0: 400, tirant: 0, delai: 0, dessin: (x, y, r) => <Maison x={x} y={y + 54} s={0.62} rotation={r} toit={F.cuir} /> },
    { x0: 350, y0: 555, tirant: 125, delai: 34, dessin: (x, y, r) => <g transform={`rotate(${r} ${x} ${y})`}><Sac x={x} y={y + 62} s={0.5} /></g> },
    { x0: 490, y0: 590, tirant: 110, delai: 66, dessin: (x, y) => <Piece x={x} y={y} r={38} /> },
    { x0: 590, y0: 425, tirant: 0, delai: 18, dessin: (x, y, r) => <Voiture x={x} y={y} s={0.72} rotation={r} /> },
  ];
  const sortieDebut = d[3] + 10;
  return (
    <Scene>
      <defs>
        <clipPath id="ch2-p5-coeur">
          <path transform={`translate(${cx} ${cy}) scale(${s * battement})`} d={COEUR} />
        </clipPath>
      </defs>
      <path transform={`translate(${cx} ${cy}) scale(${s * battement})`} d={COEUR} fill={F.papier} opacity={0.55} />
      <g clipPath="url(#ch2-p5-coeur)">
        <path d={Vague(L, f, 0, 800, 900)} fill={F.or} opacity={0.85} />
        <path d={Vague(L + 7, f + 10, 0, 800, 900, 5)} fill={F.orClair} opacity={0.75} />
      </g>
      {objets.map((o, i) => {
        // L'objet repose au fond, puis le niveau le soulève ; une fois le cœur plein, il sort par le haut.
        const portee = L - 14 + o.tirant;
        const flotte = lin(o.y0 - portee, 0, 30);
        const dehors = lin(f, sortieDebut + o.delai, sortieDebut + o.delai + 120);
        const y = Math.min(o.y0, portee) - dehors * (150 + o.tirant);
        const penche = flotte * Math.sin(f / 22 + i * 1.8) * 6;
        const x = o.x0 + flotte * Math.sin(f / 30 + i) * 4;
        const op = 1 - lin(dehors, 0.72, 1);
        return (
          <g key={i} opacity={op}>
            {o.dessin(x, y, penche)}
          </g>
        );
      })}
      <path transform={`translate(${cx} ${cy}) scale(${s * battement})`} d={COEUR} fill="none" stroke={F.encre} strokeWidth={5 / s} />
      <path transform={`translate(${cx} ${cy}) scale(${s * battement})`} d={COEUR} fill="none" stroke={F.or} strokeWidth={14 / s} opacity={plein * 0.5} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 6 : pas une négation ------------------------------------------------------------------ */

const IlluPasNegation: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 26);
  const mot = p(f, d[1] + 6, d[1] + 34);
  const trait = lin(f, d[1] + 22, d[1] + 62);
  const efface = p(f, d[1] + 150, d[1] + 190);
  const porte = p(f, d[1] + 198, d[1] + 238);
  const fil = d[1] + 232;
  const PETITES = [
    { x: 130, c: `M240 556 C240 650 130 610 130 712` },
    { x: 400, c: `M240 556 C240 640 400 600 400 712` },
    { x: 660, c: `M240 556 C240 660 660 560 660 712` },
  ];
  return (
    <Scene>
      <g opacity={entree}>
        <Maison x={235} y={556} s={1.36} ouverture={porte} lumiere={porte} />
        <Champ x={436} y={356} l={340} h={200} vide={0} f={f} />
      </g>
      {PETITES.map((m, i) => {
        const a = fil + i * 20;
        const t = lin(f, a, a + 60);
        const allume = p(f, a + 54, a + 76);
        return (
          <g key={m.x}>
            <Lueur id={`ch2-p6-lueur-${i}`} x={m.x} y={770} r={118} opacite={allume * (0.6 + 0.15 * Math.sin(f / 14 + i))} />
            <path d={m.c} pathLength={1} fill="none" stroke={F.orClair} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${t} 1`} opacity={t > 0 ? 0.6 : 0} />
            <path d={m.c} pathLength={1} fill="none" stroke={F.or} strokeWidth={5} strokeLinecap="round" strokeDasharray={`${t} 1`} opacity={t > 0 ? 1 : 0} />
            <g opacity={p(f, fil - 40, fil)}>
              <Maison x={m.x} y={850} s={0.66} lumiere={allume} ouverture={allume} toit={F.cuir} />
            </g>
          </g>
        );
      })}
      <g opacity={1 - efface}>
        <text x={400} y={150} textAnchor="middle" fontFamily={PoliceF.serif} fontSize={80} fontWeight={600} fill={F.argile} opacity={mot} transform={`translate(0 ${(1 - mot) * -30})`}>
          {LIBELLES.negation}
        </text>
        <path d="M46 610 L760 216" pathLength={1} fill="none" stroke={F.argile} strokeWidth={30} strokeLinecap="round" strokeDasharray={`${trait} 1`} opacity={trait > 0 ? 1 : 0} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 7 : la citerne ------------------------------------------------------------------ */

const IlluCiterne: React.FC<PropsIllustration> = ({ f, d }) => {
  const cx = 320;
  const hw = 186;
  const top = 200;
  const bot = 760;
  const niveau = mix(bot - 30, top + 20, p(f, d[0] - 20, d[1] + 20));
  const tourne = p(f, d[3] + 70, d[3] + 112);
  const jet = lin(f, d[3] + 92, d[3] + 124);
  const relache = p(f, d[3] + 104, d[3] + 240);
  const gonfle = p(f, d[1] - 10, d[2] + 70) * (1 - relache);
  const tension = p(f, d[2], d[2] + 40) * (1 - relache);
  const tremble = tension * Math.sin(f * 1.7) * 2.6;
  const b = 72 * gonfle;
  const c = b * 1.33;
  const corps = `M${cx - hw} ${top} C${cx - hw - c} ${top + 170} ${cx - hw - c} ${bot - 170} ${cx - hw} ${bot} Q${cx} ${bot + 34} ${cx + hw} ${bot} C${cx + hw + c} ${bot - 170} ${cx + hw + c} ${top + 170} ${cx + hw} ${top} Q${cx} ${top - 30} ${cx - hw} ${top} Z`;
  const largeurA = (y: number) => {
    const t = (y - top) / (bot - top);
    return hw + b * (4 * t * (1 - t));
  };
  const JETS = [
    { x: 632, y: 880 }, { x: 668, y: 884 }, { x: 704, y: 886 }, { x: 740, y: 884 }, { x: 776, y: 880 },
  ];
  return (
    <Scene>
      <defs>
        <clipPath id="ch2-p7-corps"><path d={corps} /></clipPath>
      </defs>
      {/* La sortie, derrière la citerne. */}
      <rect x={cx + 120} y={636} width={290} height={40} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={684} y={636} width={46} height={92} rx={4} fill={F.filet} stroke={F.encre} strokeWidth={4} />
      <rect x={678} y={722} width={58} height={16} rx={3} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
      <rect x={622} y={600} width={16} height={38} fill={F.encre2} stroke={F.encre} strokeWidth={3} />
      <g transform={`rotate(${tourne * 300} 630 590)`}>
        <circle cx={630} cy={590} r={34} fill="none" stroke={F.argile} strokeWidth={9} />
        <path d="M596 590 H664 M630 556 V624" stroke={F.argile} strokeWidth={7} />
        <circle cx={630} cy={590} r={8} fill={F.encre} />
      </g>

      <ellipse cx={704} cy={880} rx={84} ry={11} fill={F.orClair} stroke={F.or} strokeWidth={3} opacity={jet} />
      {JETS.map((j, i) => {
        const chemin = `M${692 + i * 11} 738 Q${692 + i * 11 + (j.x - 700) * 0.5} 790 ${j.x} ${j.y - 4}`;
        return (
          <g key={i} opacity={jet}>
            <path d={chemin} fill="none" stroke={F.orClair} strokeWidth={11} strokeLinecap="round" />
            <path d={chemin} fill="none" stroke={F.or} strokeWidth={4} strokeLinecap="round" strokeDasharray="20 16" strokeDashoffset={-f * 5} />
          </g>
        );
      })}

      <g transform={`translate(${tremble} 0)`}>
        <path d={corps} fill={F.papier} />
        <g clipPath="url(#ch2-p7-corps)">
          <path d={Vague(niveau, f, 0, 800, 900, 6)} fill={F.orClair} />
          <path d={Vague(niveau + 18, f + 16, 0, 800, 900, 5)} fill={F.or} opacity={0.55} />
          {/* Le flot qui entre et frappe la surface. */}
          <rect x={232} y={top - 40} width={56} height={Math.max(0, niveau - top + 44)} fill={F.orClair} />
          {[244, 260, 276].map((x, i) => (
            <line key={x} x1={x} x2={x} y1={top - 40} y2={niveau + 4} stroke={F.or} strokeWidth={5} strokeDasharray="26 22" strokeDashoffset={-f * 7 - i * 13} />
          ))}
        </g>
        {[0.2, 0.5, 0.8].map((k) => {
          const y = top + (bot - top) * k;
          const w = largeurA(y);
          return <path key={k} d={`M${cx - w} ${y} Q${cx} ${y + 26} ${cx + w} ${y}`} fill="none" stroke={F.cuir} strokeWidth={6} />;
        })}
        <path d={corps} fill="none" stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
        {/* La paroi qui ne tient plus. */}
        <g opacity={tension}>
          <path d={`M${cx + largeurA(420) - 4} 400 l-26 22 l20 16 l-24 26 l16 18`} fill="none" stroke={F.argile} strokeWidth={5} strokeLinejoin="round" />
          <path d={`M${cx - largeurA(520) + 4} 500 l24 18 l-18 20 l26 24`} fill="none" stroke={F.argile} strokeWidth={5} strokeLinejoin="round" />
          {[300, 420, 540, 660].flatMap((y) => [-1, 1].map((sens) => {
            const w = largeurA(y);
            const x = cx + sens * (w + 14);
            return sens > 0 && y > 540 ? null : <line key={`${y}${sens}`} x1={x} x2={x + sens * (20 + 8 * Math.sin(f / 3 + y))} y1={y} y2={y} stroke={F.argile} strokeWidth={5} strokeLinecap="round" />;
          }))}
        </g>
      </g>

      {/* Le gros tuyau d'arrivée. */}
      <path d="M26 58 H250 Q300 58 300 110 V190 H220 V136 H26 Z" fill={F.filet} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <rect x={14} y={46} width={20} height={102} rx={4} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
      <rect x={210} y={178} width={100} height={18} rx={4} fill={F.encre2} stroke={F.encre} strokeWidth={4} />
      <path d="M50 97 H226 Q260 97 260 130 V176" fill="none" stroke={F.or} strokeWidth={10} strokeDasharray="22 18" strokeDashoffset={-f * 6} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 8 : le registre et la loupe ------------------------------------------------------------------ */

const IlluRegistreLoupe: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 26);
  const LIGNES = 6;
  const a0 = d[0] + 50;
  const a1 = d[2] - 10;
  const roule = p(f, d[2] + 10, d[2] + 100);
  const loupe = p(f, d[3] + 20, d[3] + 170);
  const apparait = p(f, d[3], d[3] + 22);
  const xc = 400;
  const yc = 690;
  const xPiece = mix(-90, xc, roule);
  const lx = mix(515, xc, loupe);
  const ly = mix(670, yc, loupe);
  const R = 132;
  const cos = Math.cos((26 * Math.PI) / 180);
  const sin = Math.sin((26 * Math.PI) / 180);
  return (
    <Scene>
      <defs>
        <clipPath id="ch2-p8-verre"><circle cx={lx} cy={ly} r={R - 7} /></clipPath>
      </defs>
      <g opacity={entree} transform={`translate(0 ${(1 - entree) * 24})`}>
        <rect x={48} y={24} width={704} height={500} rx={12} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
        <rect x={66} y={38} width={668} height={472} rx={4} fill={F.papier} stroke={F.encre} strokeWidth={3} />
        <line x1={400} x2={400} y1={38} y2={510} stroke={F.encre} strokeWidth={4} />
        <Libelle x={233} y={92} taille={38} graisse={600}>{LIBELLES.dimes}</Libelle>
        <Libelle x={567} y={92} taille={38} graisse={600}>{LIBELLES.offrandes}</Libelle>
        <line x1={84} x2={716} y1={114} y2={114} stroke={F.encre} strokeWidth={3} />
        {Array.from({ length: LIGNES }, (_, i) => {
          const a = a0 + (i * (a1 - a0)) / LIGNES;
          const y = 164 + i * 60;
          const t = p(f, a, a + (a1 - a0) / LIGNES);
          const l1 = 90 + i * 40;
          const l2 = 70 + i * 44;
          return (
            <g key={i}>
              <line x1={84} x2={382} y1={y + 24} y2={y + 24} stroke={F.filet} strokeWidth={2} />
              <line x1={418} x2={716} y1={y + 24} y2={y + 24} stroke={F.filet} strokeWidth={2} />
              <rect x={92} y={y - 8} width={l1 * t} height={18} rx={9} fill={F.or} />
              <rect x={426} y={y - 8} width={l2 * t} height={18} rx={9} fill={F.orFonce} />
            </g>
          );
        })}
      </g>

      <line x1={30} x2={770} y1={790} y2={790} stroke={F.encre} strokeWidth={4} />
      {/* La pièce arrive en roulant : même les pauvres trouvent quoi donner. */}
      <g transform={`rotate(${roule * 540} ${xPiece} ${yc})`} opacity={lin(f, d[2], d[2] + 12)}>
        <Piece x={xPiece} y={yc} r={98} />
        <path d={`M${xPiece} ${yc - 46} V${yc + 46} M${xPiece - 46} ${yc} H${xPiece + 46}`} stroke={F.orFonce} strokeWidth={8} strokeLinecap="round" />
      </g>

      {/* La loupe : à travers le verre, la pièce est un cœur. */}
      <g opacity={apparait}>
        <line x1={lx + cos * R} y1={ly + sin * R} x2={lx + cos * (R + 150)} y2={ly + sin * (R + 150)} stroke={F.encre} strokeWidth={34} strokeLinecap="round" />
        <line x1={lx + cos * (R + 2)} y1={ly + sin * (R + 2)} x2={lx + cos * (R + 148)} y2={ly + sin * (R + 148)} stroke={F.cuir} strokeWidth={24} strokeLinecap="round" />
        <circle cx={lx} cy={ly} r={R - 7} fill={F.papier} />
        <g clipPath="url(#ch2-p8-verre)">
          <line x1={30} x2={770} y1={790} y2={790} stroke={F.encre} strokeWidth={4} />
          <Coeur x={xc} y={yc + 6} s={2.1} />
        </g>
        <path d={`M${lx - 78} ${ly - 58} A98 98 0 0 1 ${lx - 18} ${ly - 96}`} fill="none" stroke={F.papier} strokeWidth={8} strokeLinecap="round" opacity={0.9} />
        <circle cx={lx} cy={ly} r={R} fill="none" stroke={F.encre} strokeWidth={13} />
        <circle cx={lx} cy={ly} r={R} fill="none" stroke={F.or} strokeWidth={6} />
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 9 : la caisse ------------------------------------------------------------------ */

const IlluCaisse: React.FC<PropsIllustration> = ({ f, d, duree }) => {
  const entree = p(f, 0, 26);
  const pas = (a: number, b: number, n: number) => Array.from({ length: n }, (_, i) => a + ((i + 0.5) * (b - a)) / n);
  // Les pièces ne tombent pas pendant la deuxième phrase : si rien ne change au-dedans, rien ne monte.
  const TEMPS = [...pas(d[0], d[1] - 20, 4), ...pas(d[2], d[3] - 10, 3), ...pas(d[3], duree - 50, 3)];
  const CHUTE = 30;
  const X = 410;
  let niveau = 0.06;
  let choc = 0;
  TEMPS.forEach((t) => {
    niveau += 0.088 * p(f, t + CHUTE, t + CHUTE + 16);
    const age = f - t - CHUTE;
    if (age >= 0) choc += Math.exp(-age / 7) * Math.cos(age / 1.4);
  });
  const fixe = d[2] + 225;
  const etiquette = p(f, fixe, fixe + 24);
  const coeur = p(f, d[3] + 250, d[3] + 290);
  const THX = 262;
  const THY = 470;
  const THH = 272;
  const yTrait = THY + (THH / 8) * 2;
  const halo = p(f, d[2] + 20, d[2] + 80);
  return (
    <Scene>
      <g opacity={entree}>
        <path d="M124 410 L176 362 H624 L676 410 Z" fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <path d="M172 410 L200 378 H600 L628 410 Z" fill={F.encre} />
      </g>
      {TEMPS.map((t, i) => {
        const u = lin(f, t, t + CHUTE);
        if (u <= 0 || u >= 1) return null;
        const y = mix(16, 450, u * u);
        return <Piece key={i} x={X + ((i * 53) % 90) - 45} y={y} r={38} />;
      })}
      <g opacity={entree} transform={`translate(0 ${choc * 3.5})`}>
        <rect x={124} y={408} width={552} height={432} rx={6} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        {[1, 2, 3].map((i) => (
          <line key={i} x1={124} x2={676} y1={408 + i * 108} y2={408 + i * 108} stroke={F.cuir} strokeWidth={5} />
        ))}
        {[300, 492].map((x) => (
          <line key={x} x1={x} x2={x} y1={520} y2={622} stroke={F.cuir} strokeWidth={3} opacity={0.7} />
        ))}
        {[124, 636].map((x) => (
          <rect key={x} x={x} y={408} width={40} height={432} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        ))}
        <rect x={124} y={408} width={552} height={26} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={124} y={814} width={552} height={26} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        {[[144, 421], [656, 421], [144, 827], [656, 827]].map(([x, y]) => (
          <circle key={`${x}${y}`} cx={x} cy={y} r={5} fill={F.orClair} stroke={F.encre} strokeWidth={2} />
        ))}
        {/* Le thermomètre, cloué sur le flanc. */}
        <rect x={THX - 62} y={THY - 34} width={196} height={THH + 118} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
        <rect x={THX - 60} y={THY - 32} width={192} height={THH + 114} rx={6} fill={F.orClair} opacity={halo * (0.3 + 0.1 * Math.sin(f / 12))} />
        <Thermometre x={THX} y={THY} h={THH} l={40} niveau={Math.min(0.97, niveau)} />
        {/* L'étiquette se fixe sur une graduation. */}
        <g opacity={etiquette} transform={`translate(${(1 - etiquette) * 90} ${(1 - etiquette) * -60})`}>
          <line x1={THX + 52} x2={THX + 136} y1={yTrait} y2={yTrait} stroke={F.encre} strokeWidth={4} />
          <rect x={THX + 136} y={yTrait - 34} width={226} height={68} rx={8} fill={F.papier} stroke={F.encre} strokeWidth={4} />
          <circle cx={THX + 136} cy={yTrait} r={8} fill={F.or} stroke={F.encre} strokeWidth={3} />
          <Libelle x={THX + 249} y={yTrait + 13} taille={36} graisse={600} couleur={F.orFonce}>{LIBELLES.indicateur}</Libelle>
        </g>
        {coeur > 0 ? <Coeur x={THX + 249} y={yTrait + 148} s={1.5 * coeur * (1 + 0.04 * Math.sin(f / 9))} /> : null}
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 10 : selon les capacités ------------------------------------------------------------------ */

const IlluCoupes: React.FC<PropsIllustration> = ({ f, d }) => {
  const BASE = 690;
  const COUPES = [
    { x: 182, l: 290, h: 500 },
    { x: 472, l: 176, h: 290 },
    { x: 672, l: 96, h: 150 },
  ];
  const entree = p(f, 0, 30);
  const noms = p(f, d[1], d[1] + 30);
  const coeurs = p(f, d[2] + 150, d[2] + 190);
  const debutRemplir = d[2] + 30;
  const finRemplir = d[4] + 40;
  const rempli = lin(f, debutRemplir, finRemplir);
  const flots = lin(f, debutRemplir - 16, debutRemplir + 6) * (1 - lin(f, finRemplir - 6, finRemplir + 8));
  const bord = p(f, finRemplir, finRemplir + 26);
  return (
    <Scene>
      <defs>
        <linearGradient id="ch2-p10-flot" gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={0} y2={560}>
          <stop offset="0" stopColor={F.or} stopOpacity={0} />
          <stop offset="0.28" stopColor={F.or} stopOpacity={0.9} />
          <stop offset="1" stopColor={F.or} stopOpacity={1} />
        </linearGradient>
      </defs>
      <line x1={24} x2={776} y1={BASE} y2={BASE} stroke={F.encre} strokeWidth={4} />
      {COUPES.map((c, i) => {
        const top = BASE - c.h;
        const prof = c.h * 0.54;
        const bol = `M${c.x - c.l / 2} ${top} C${c.x - c.l / 2} ${top + prof * 0.72} ${c.x - c.l * 0.2} ${top + prof} ${c.x} ${top + prof} C${c.x + c.l * 0.2} ${top + prof} ${c.x + c.l / 2} ${top + prof * 0.72} ${c.x + c.l / 2} ${top} Z`;
        const yLiq = mix(top + prof + 3, top, rempli);
        const lf = c.l * 0.42;
        const tige = Math.max(5, c.l * 0.05);
        const yt = top + prof;
        const yp = BASE - c.h * 0.05;
        const mot = LIBELLES.coupes[i];
        return (
          <g key={c.x} opacity={entree}>
            {flots > 0 ? <rect x={c.x - c.l * 0.03} y={0} width={c.l * 0.06} height={Math.max(0, yLiq + 2)} fill="url(#ch2-p10-flot)" opacity={flots} /> : null}
            <Lueur id={`ch2-p10-lueur-${i}`} x={c.x} y={top + c.h * 0.2} r={c.l * 0.86 * (1 + 0.04 * Math.sin(f / 11))} opacite={bord * 0.85} />
            <defs>
              <clipPath id={`ch2-p10-bol-${i}`}><path d={bol} /></clipPath>
            </defs>
            <path d={`M${c.x - lf} ${BASE} Q${c.x - lf * 0.3} ${yp - c.h * 0.03} ${c.x - tige} ${yp - c.h * 0.08} V${yt} H${c.x + tige} V${yp - c.h * 0.08} Q${c.x + lf * 0.3} ${yp - c.h * 0.03} ${c.x + lf} ${BASE} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
            <path d={bol} fill={F.papier} />
            <g clipPath={`url(#ch2-p10-bol-${i})`}>
              <path d={Vague(yLiq, f + i * 12, c.x - c.l, c.x + c.l, BASE, Math.min(4, c.l * 0.03) * (1 - bord))} fill={F.or} />
              <rect x={c.x - c.l} y={yLiq} width={c.l * 2} height={Math.min(10, c.l * 0.07)} fill={F.orClair} opacity={rempli > 0 ? 0.8 : 0} />
            </g>
            <path d={bol} fill="none" stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
            <ellipse cx={c.x} cy={top} rx={c.l / 2 + 4} ry={Math.max(4, c.l * 0.025)} fill={F.or} stroke={F.encre} strokeWidth={3} />
            {coeurs > 0 ? <Coeur x={c.x} y={top + prof * 0.46} s={Math.max(0.01, (c.l / 240) * coeurs)} /> : null}
            <Libelle x={c.x} y={BASE + 54} taille={36} graisse={600} opacite={noms}>{mot.mot}</Libelle>
            {Array.from({ length: mot.talents }, (_, k) => {
              const a = d[1] + i * 42 + k * 12;
              const t = p(f, a, a + 16);
              return <Piece key={k} x={c.x + (k - (mot.talents - 1) / 2) * 38} y={BASE + 92 - (1 - t) * 24} r={16} opacite={t} />;
            })}
          </g>
        );
      })}
      <Libelle x={400} y={BASE + 170} taille={32} couleur={F.encre2} opacite={noms}>{LIBELLES.talents}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 11 : donner Dieu ------------------------------------------------------------------ */

const FormeMaison: React.FC<{ k: number; x: number; y: number; l: number }> = ({ k, x, y, l }) => {
  const trait = 4;
  const vitre = (vx: number, vy: number, w: number, h: number, key: string) => (
    <g key={key}>
      <rect x={vx} y={vy} width={w} height={h} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
      <rect x={vx + 2} y={vy + 2} width={w - 4} height={h - 4} fill={F.orClair} opacity={l} />
    </g>
  );
  if (k === 0) {
    // Case ronde au toit de paille.
    return (
      <g>
        <rect x={x - 80} y={y - 104} width={160} height={104} fill={F.papier} stroke={F.encre} strokeWidth={trait} />
        <path d={`M${x - 112} ${y - 96} Q${x} ${y - 290} ${x + 112} ${y - 96} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" />
        {[-60, -28, 0, 28, 60].map((c) => <path key={c} d={`M${x + c * 0.2} ${y - 186} L${x + c} ${y - 104}`} stroke={F.cuir} strokeWidth={3} />)}
        <path d={`M${x - 24} ${y} V${y - 50} A24 24 0 0 1 ${x + 24} ${y - 50} V${y} Z`} fill={l > 0.4 ? F.orClair : F.cuir} stroke={F.encre} strokeWidth={trait} />
      </g>
    );
  }
  if (k === 1) {
    // Haute maison étroite à pignon.
    return (
      <g>
        <rect x={x - 62} y={y - 190} width={124} height={190} fill={F.papier} stroke={F.encre} strokeWidth={trait} />
        <path d={`M${x - 76} ${y - 186} L${x} ${y - 282} L${x + 76} ${y - 186} Z`} fill={F.argile} stroke={F.encre} strokeWidth={trait} strokeLinejoin="round" />
        {vitre(x - 44, y - 166, 34, 40, 'a')}
        {vitre(x + 10, y - 166, 34, 40, 'b')}
        {vitre(x - 44, y - 106, 34, 40, 'c')}
        {vitre(x + 10, y - 106, 34, 40, 'd')}
        <rect x={x - 20} y={y - 52} width={40} height={52} fill={l > 0.4 ? F.orClair : F.cuir} stroke={F.encre} strokeWidth={trait} />
      </g>
    );
  }
  // Maison basse à toit plat et arcades.
  return (
    <g>
      <rect x={x - 106} y={y - 150} width={212} height={150} fill={F.papier} stroke={F.encre} strokeWidth={trait} />
      <rect x={x - 116} y={y - 172} width={232} height={24} fill={F.cuir} stroke={F.encre} strokeWidth={trait} />
      {[-66, 0, 66].map((c) => (
        <path key={c} d={`M${x + c - 24} ${y} V${y - 74} A24 24 0 0 1 ${x + c + 24} ${y - 74} V${y} Z`} fill={l > 0.4 ? F.orClair : F.parchemin} stroke={F.encre} strokeWidth={trait} />
      ))}
    </g>
  );
};

/** Les pièces qui sortent de chaque coffre, à la dernière phrase : chacune a sa colonne, assez écartée des autres pour ne pas la toucher. */
const JETS = [
  { x: [-36, -2, 33], h: [64, 92, 76], derive: 6, periode: 110 },
  { x: [-30, 4, 36], h: [88, 62, 80], derive: -6, periode: 124 },
  { x: [-36, -4, 30], h: [74, 82, 96], derive: 5, periode: 138 },
];

const IlluDonnerDieu: React.FC<PropsIllustration> = ({ f, d }) => {
  const entree = p(f, 0, 24);
  const AFFICHES = [
    { x: 108, y: 54, r: -3 }, { x: 310, y: 46, r: 2 }, { x: 512, y: 56, r: -2 },
    { x: 120, y: 224, r: 2 }, { x: 318, y: 220, r: -2 }, { x: 510, y: 228, r: 3 },
  ];
  const decolle = d[0] + 210;
  const pan = 1 - p(f, d[1] - 34, d[1] - 2);
  const SOL = 700;
  const CENTRES = [146, 396, 650];
  // La cour : les coffres y sont posés, chacun au bout de l'allée qui part de sa maison.
  const COUR = 184;
  const RIM = 812;
  const H_COFFRE = 58;
  return (
    <Scene>
      {/* Le panneau : affiches inertes, qui finissent par se décoller. */}
      <g opacity={pan * entree}>
        <rect x={80} y={24} width={640} height={370} rx={8} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
        <rect x={94} y={38} width={612} height={342} fill={F.filet} stroke={F.encre} strokeWidth={3} />
      </g>
      {AFFICHES.map((a, i) => {
        const t = lin(f, decolle + i * 13, decolle + i * 13 + 48);
        const o = 1 - lin(t, 0.55, 1);
        return (
          <g key={i} opacity={o * entree} transform={`translate(${t * (i % 2 ? 14 : -14)} ${t * t * 170}) rotate(${a.r + t * (i % 2 ? 26 : -26)} ${a.x + 90} ${a.y + 12})`}>
            <rect x={a.x} y={a.y} width={180} height={144} rx={3} fill={F.papier} stroke={F.encre} strokeWidth={3} />
            <circle cx={a.x + 90} cy={a.y + 12} r={6} fill={F.argile} stroke={F.encre} strokeWidth={2} />
            <Libelle x={a.x + 90} y={a.y + 66} taille={32} graisse={600}>{i % 2 === 0 ? LIBELLES.besoins : LIBELLES.projets}</Libelle>
            <line x1={a.x + 26} x2={a.x + 154} y1={a.y + 94} y2={a.y + 94} stroke={F.filet} strokeWidth={5} />
            <line x1={a.x + 26} x2={a.x + 124} y1={a.y + 116} y2={a.y + 116} stroke={F.filet} strokeWidth={5} />
          </g>
        );
      })}
      <g opacity={entree}>
        <rect x={24} y={SOL} width={752} height={COUR} fill={F.filet} opacity={0.55} />
        <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={4} />
        <line x1={24} x2={776} y1={SOL + COUR} y2={SOL + COUR} stroke={F.encre} strokeWidth={4} />
      </g>
      {CENTRES.map((x, k) => {
        const a = d[1] + k * 86;
        const l = p(f, a, a + 30);
        const rayon = lin(f, a - 14, a + 30);
        const ouvre = p(f, a + 34, a + 66);
        return (
          <g key={x} opacity={entree}>
            <Rayons id={`ch2-p11-rayon-${k}`} x={x} haut={0} bas={SOL - 20} n={3} ecart={56} t={rayon} force={0.75} f={f} />
            <Lueur id={`ch2-p11-lueur-${k}`} x={x} y={SOL - 110} r={165} opacite={l * 0.7} />
            <FormeMaison k={k} x={x} y={SOL} l={l} />
            <path d={`M${x - 24} ${SOL + 2} H${x + 24} L${x + 46} ${RIM} H${x - 46} Z`} fill={F.parchemin} />
            <ellipse cx={x} cy={RIM + H_COFFRE} rx={64} ry={7} fill={F.encre} opacity={0.2} />
            {/* Les pièces sortent du coffre, à la dernière phrase : en actes. */}
            {JETS[k].x.map((cx, i) => {
              const jet = JETS[k];
              const age = f - (d[2] + k * 18) - (i * jet.periode) / 3;
              if (age < 0) return null;
              const a2 = (age % jet.periode) / jet.periode;
              return <Piece key={i} x={x + cx + jet.derive * (a2 - 0.5)} y={RIM + 14 - Math.sin(a2 * Math.PI) * jet.h[i]} r={13} />;
            })}
            <Coffre x={x} y={RIM} l={104} h={H_COFFRE} ouverture={ouvre} cerclage={false}>
              <g opacity={ouvre}>
                <path d={`M${x - 48} ${RIM + 2} Q${x} ${RIM - 30} ${x + 48} ${RIM + 2} Z`} fill={F.orClair} stroke={F.orFonce} strokeWidth={2} />
              </g>
            </Coffre>
          </g>
        );
      })}
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 12 : Barnabas ------------------------------------------------------------------ */

const IlluBarnabas: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOL = 700;
  const Y0 = 316;
  const EP = 84;
  const HAUT_SAC = 300;
  const depose = p(f, d[0] + 40, d[0] + 115);
  const redresse = p(f, d[0] + 130, d[0] + 245);
  const SAG = 76;
  const sag = (SAG + Math.sin(f / 19) * 4) * (1 - redresse);
  const creux = (x: number) => sag * (1 - ((x - 400) / 360) ** 2);
  const yB = (x: number) => Y0 + EP + creux(x);
  const COLONNES = [96, 196, 604, 704];
  const pli = sag / SAG;
  const etiq = d[0] + 345;
  const tag = p(f, etiq, etiq + 26);
  const balance = Math.exp(-Math.max(0, f - etiq - 20) / 26) * Math.sin(Math.max(0, f - etiq - 20) / 6) * 9 * tag;
  const lueur = p(f, d[1], d[1] + 50);
  const courant = p(f, d[2] + 10, d[2] + 70);
  const sy = (SOL - yB(400) - 3) / 240;
  // Le sac arrive par le côté, en glissant sur le sol, et s'arrête sous la poutre.
  const sacX = mix(730, 400, depose);
  const pas = Math.sin(depose * Math.PI * 3) * (1 - depose);
  const sacY = SOL - Math.abs(pas) * 16;
  return (
    <Scene>
      <defs>
        <clipPath id="ch2-p12-sol"><rect x={0} y={0} width={800} height={SOL} /></clipPath>
      </defs>
      {/* Le poids : des flèches qui appuient, et disparaissent quand la charge est soulagée. */}
      {[150, 400, 650].map((x, i) => {
        const y = 150 + ((f + i * 18) % 46) * 1.1 + creux(x);
        return <path key={x} d={`M${x - 42} ${y} L${x} ${y + 44} L${x + 42} ${y} M${x - 42} ${y - 44} L${x} ${y} L${x + 42} ${y - 44}`} fill="none" stroke={F.argile} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" opacity={0.85 * (1 - redresse)} />;
      })}
      <line x1={24} x2={776} y1={SOL} y2={SOL} stroke={F.encre} strokeWidth={5} />

      <g clipPath="url(#ch2-p12-sol)">
        <Lueur id="ch2-p12-lueur" x={400} y={SOL - 150} r={240 * (1 + 0.03 * Math.sin(f / 13))} opacite={lueur} />
      </g>

      {COLONNES.map((x, i) => {
        const sens = i < 2 ? -1 : 1;
        const b = pli * 46 * sens;
        const yh = yB(x) + 16;
        const chemin = `M${x} ${SOL - 14} Q${x + b} ${(SOL + yh) / 2} ${x} ${yh}`;
        return (
          <g key={x}>
            <path d={chemin} fill="none" stroke={F.encre} strokeWidth={46} />
            <path d={chemin} fill="none" stroke={F.papier} strokeWidth={38} />
            {/* Le soutien : le don remonte jusque dans chaque colonne. */}
            <path d={`M400 ${SOL + 34} H${x} V${yh + 2}`} fill="none" stroke={F.or} strokeWidth={8} strokeLinecap="round" strokeDasharray="3 22" strokeDashoffset={f * 2.4} opacity={courant} />
            <rect x={x - 36} y={SOL - 16} width={72} height={16} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            <rect x={x - 36} y={yB(x)} width={72} height={16} fill={F.cuirClair} stroke={F.encre} strokeWidth={4} />
            {pli > 0.2 ? <path d={`M${x + sens * 44} ${(SOL + yh) / 2 - 34} l${sens * 14} 16 l${-sens * 12} 16 l${sens * 14} 18`} fill="none" stroke={F.argile} strokeWidth={5} opacity={pli} strokeLinejoin="round" /> : null}
          </g>
        );
      })}
      {/* Le sac, qui se gonfle jusqu'à porter la poutre. */}
      <g opacity={lin(depose, 0, 0.2)}>
        <g transform={`rotate(${pas * 4} ${sacX} ${sacY})`}>
          <Sac x={sacX} y={sacY} s={1.24} sy={sy} />
        </g>
        <g transform={`rotate(${balance} 400 ${sacY - 234})`} opacity={tag}>
          <path d={`M400 ${sacY - 236} V${sacY - 156}`} stroke={F.encre} strokeWidth={3} />
          <path d={`M276 ${sacY - 156} H524 V${sacY - 56} H276 Z`} fill={F.papier} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={400} cy={sacY - 144} r={5} fill={F.parchemin} stroke={F.encre} strokeWidth={2.5} />
          <Libelle x={400} y={sacY - 104} taille={28} graisse={600} couleur={F.orFonce}>{LIBELLES.fils}</Libelle>
          <Libelle x={400} y={sacY - 72} taille={28} graisse={600} couleur={F.orFonce}>{LIBELLES.encouragement}</Libelle>
        </g>
      </g>
      {/* La poutre. */}
      <path d={`M40 ${Y0} Q400 ${Y0 + 2 * sag} 760 ${Y0} V${Y0 + EP} Q400 ${Y0 + EP + 2 * sag} 40 ${Y0 + EP} Z`} fill={F.cuir} stroke={F.encre} strokeWidth={5} strokeLinejoin="round" />
      <path d={`M60 ${Y0 + 20} Q400 ${Y0 + 20 + 2 * sag} 740 ${Y0 + 20}`} fill="none" stroke={F.cuirClair} strokeWidth={3} />
      <path d={`M60 ${Y0 + 66} Q400 ${Y0 + 66 + 2 * sag} 740 ${Y0 + 66}`} fill="none" stroke={F.cuirClair} strokeWidth={3} />
      <Libelle x={400} y={Y0 + EP / 2 + 13 + creux(400)} taille={36} graisse={600} couleur={F.papier}>{LIBELLES.charge}</Libelle>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 13 : imiter le cœur ------------------------------------------------------------------ */

const IlluDeuxSacs: React.FC<PropsIllustration> = ({ f, d }) => {
  const SOCLE = 660;
  const S = 1.62;
  const X = [216, 584];
  const pose = [p(f, 0, 26), p(f, d[0] + 40, d[0] + 72)];
  const balayage = lin(f, d[1] + 30, d[1] + 260);
  const faisceauX = mix(-60, 860, balayage);
  const visible = lin(f, d[1] + 10, d[1] + 40) * (1 - lin(f, d[1] + 250, d[1] + 280));
  const baisse = p(f, d[1] + 300, d[1] + 350);
  const coeurs = p(f, d[2] - 10, d[2] + 26);
  const soulignement = p(f, d[3] + 10, d[3] + 60);
  // Le vrai cœur bat, dès qu'il est montré.
  const battement = 1 + 0.07 * Math.sin((f - d[2]) / 9);
  // La dernière phrase : l'imitateur monte, marche après marche, pour obtenir la prééminence.
  const H_MARCHE = 44;
  const MARCHES = [
    { w: 340, t: p(f, d[3] + 80, d[3] + 150) },
    { w: 305, t: p(f, d[3] + 230, d[3] + 300) },
    { w: 270, t: p(f, d[3] + 380, d[3] + 450) },
  ];
  const eleve = MARCHES.reduce((somme, m) => somme + m.t * H_MARCHE, 0);
  const NIVEAUX = [1, 0.42];
  const HAUT_CONTENU = [-190, -106];
  const R_PIECE = 17;
  const largeurSac = (y: number) => {
    const T = [[-200, 34], [-160, 72], [-120, 95], [-80, 106], [-40, 104], [-20, 96], [0, 76]];
    for (let i = 1; i < T.length; i++) if (y <= T[i][0]) return mix(T[i - 1][1], T[i][1], (y - T[i - 1][0]) / (T[i][0] - T[i - 1][0]));
    return 76;
  };
  const pieces = (k: number) => {
    const rangs = 6;
    const out: React.ReactNode[] = [];
    for (let r = 0; r < rangs && r / rangs < NIVEAUX[k]; r++) {
      const y = -21 - r * 28;
      const marge = Math.min(largeurSac(y - R_PIECE), largeurSac(y + R_PIECE)) - 3;
      for (let c = -3; c <= 3; c++) {
        const x = (c + (r % 2 ? 0.5 : 0)) * 38;
        if (Math.abs(x) + R_PIECE <= marge) out.push(<Piece key={`${r}-${c}`} x={x} y={y} r={R_PIECE} />);
      }
    }
    return out;
  };
  // Après le rayon, ce qui a été retenu se compte, pièce après pièce, dans le vide du sac : la fin de la parole de Pierre.
  const retenues = () => {
    const places: { x: number; y: number }[] = [];
    // Les rangs commencent au-dessus de la ligne de ce qui reste : le vide seul se remplit de ces pièces absentes.
    for (let r = 3; r < 6; r++) {
      const y = -125 - (r - 3) * 28;
      const marge = Math.min(largeurSac(y - R_PIECE), largeurSac(y + R_PIECE)) - 3;
      for (let c = -3; c <= 3; c++) {
        const x = (c + (r % 2 ? 0.5 : 0)) * 38;
        if (Math.abs(x) + R_PIECE <= marge) places.push({ x, y });
      }
    }
    const debut = d[1] + 360;
    const pasRetenue = (d[2] - 40 - debut) / places.length;
    return places.map((c, i) => {
      const t = p(f, debut + i * pasRetenue, debut + i * pasRetenue + 24);
      return t > 0 ? <circle key={i} cx={c.x} cy={c.y} r={R_PIECE * (0.5 + 0.5 * t)} fill="none" stroke={F.argile} strokeWidth={2} strokeDasharray="5 4" opacity={t * (1 - coeurs)} /> : null;
    });
  };
  // Les mêmes gestes, l'un imitant l'autre : une pièce entre dans chaque sac.
  const GESTES = 4;
  const chutes = Array.from({ length: GESTES }, (_, i) => d[0] + 90 + (i * (d[1] - d[0] - 170)) / GESTES);
  return (
    <Scene>
      <defs>
        <linearGradient id="ch2-p13-rayon" gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={0} y2={SOCLE}>
          <stop offset="0" stopColor={F.orClair} stopOpacity={0} />
          <stop offset="0.2" stopColor={F.orClair} stopOpacity={0.95} />
          <stop offset="1" stopColor={F.orClair} stopOpacity={0.35} />
        </linearGradient>
        <clipPath id="ch2-p13-vu"><rect x={-100} y={0} width={faisceauX + 100} height={900} /></clipPath>
        <clipPath id="ch2-p13-cache"><rect x={faisceauX} y={0} width={1000} height={900} /></clipPath>
        <clipPath id="ch2-p13-corps"><path d={SAC_CORPS} /></clipPath>
      </defs>
      <Lueur id="ch2-p13-lueur" x={X[0]} y={SOCLE - 190} r={250 * (1 + 0.03 * Math.sin(f / 13))} opacite={0.8 * soulignement} />
      {chutes.flatMap((t, i) =>
        X.map((x, k) => {
          const u = lin(f, t + k * 34, t + k * 34 + 26);
          return u > 0 && u < 1 ? <Piece key={`${i}-${k}`} x={x} y={mix(20, 280, u * u)} r={26} /> : null;
        }),
      )}
      {/* Le socle commun. */}
      <rect x={40} y={SOCLE} width={720} height={54} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} />
      <rect x={14} y={SOCLE + 54} width={772} height={36} fill={F.cuir} stroke={F.encre} strokeWidth={5} />
      {/* L'escalier de l'imitateur. */}
      {MARCHES.map((m, i) => {
        const dessous = MARCHES.slice(0, i).reduce((somme, b) => somme + b.t * H_MARCHE, 0);
        return m.t > 0 ? <rect key={i} x={X[1] - m.w / 2} y={SOCLE - dessous - m.t * H_MARCHE} width={m.w} height={m.t * H_MARCHE} fill={F.cuirClair} stroke={F.encre} strokeWidth={5} /> : null;
      })}

      {X.map((x, k) => (
        <g key={x} opacity={pose[k]} transform={`translate(0 ${(1 - pose[k]) * -70 - (k === 1 ? eleve : 0)})`}>
          {/* Dehors, ils sont identiques. */}
          <g clipPath="url(#ch2-p13-cache)">
            <Sac x={x} y={SOCLE} s={S} />
          </g>
          {/* Dedans, sous le rayon. */}
          <g clipPath="url(#ch2-p13-vu)">
            <g transform={`translate(${x} ${SOCLE}) scale(${S})`}>
              <path d={SAC_CORPS} fill={F.papier} />
              <g clipPath="url(#ch2-p13-corps)">
                <rect x={-130} y={HAUT_CONTENU[k]} width={260} height={-HAUT_CONTENU[k]} fill={F.orClair} />
                {pieces(k)}
                {k === 1 ? retenues() : null}
              </g>
              {coeurs > 0 ? (
                k === 0 ? (
                  <Coeur x={0} y={-104} s={0.92 * coeurs * battement} />
                ) : (
                  <Coeur x={0} y={-146} s={0.66 * coeurs} rempli="none" contour={F.encre2} />
                )
              ) : null}
              <path d={SAC_CORPS} fill="none" stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
            </g>
            <Sac x={x} y={SOCLE} s={S} corps={false} />
          </g>
        </g>
      ))}
      {/* La ligne de ce qui a été retenu. */}
      <line x1={X[1] - 150} x2={X[1] + 150} y1={SOCLE - S * 106 - eleve} y2={SOCLE - S * 106 - eleve} stroke={F.argile} strokeWidth={5} strokeDasharray="14 10" opacity={baisse} />

      <path d={`M${faisceauX - 26} 0 H${faisceauX + 26} L${faisceauX + 66} ${SOCLE} H${faisceauX - 66} Z`} fill="url(#ch2-p13-rayon)" opacity={visible * 0.85} />
    </Scene>
  );
};

/* ------------------------------------------------------------------ Plan 14 : le premier département ------------------------------------------------------------------ */

const Lampe: React.FC<{ x: number; y: number; allume: number; f: number; i: number }> = ({ x, y, allume, f, i }) => {
  const danse = 1 + 0.1 * Math.sin(f / 5 + i * 1.3);
  return (
    <g>
      <circle cx={x} cy={y - 26} r={30 * allume} fill={F.orClair} opacity={0.4 * allume} />
      <path d={`M${x} ${y - 20} C${x - 13 * danse} ${y - 36} ${x - 4} ${y - 46} ${x} ${y - 60 * danse} C${x + 4} ${y - 46} ${x + 13 * danse} ${y - 36} ${x} ${y - 20} Z`} fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={allume} transform={`translate(${x} ${y - 20}) scale(${Math.max(0.01, allume)}) translate(${-x} ${-(y - 20)})`} />
      <path d={`M${x - 28} ${y - 14} H${x + 22} Q${x + 36} ${y - 14} ${x + 12} ${y + 14} H${x - 16} Q${x - 30} ${y + 8} ${x - 28} ${y - 14} Z`} fill={F.cuirClair} stroke={F.encre} strokeWidth={3} strokeLinejoin="round" />
      <rect x={x - 3} y={y - 22} width={6} height={9} fill={F.encre} />
      <rect x={x - 18} y={y + 14} width={32} height={7} rx={2} fill={F.cuir} stroke={F.encre} strokeWidth={2} />
    </g>
  );
};

const IlluDepartement: React.FC<PropsIllustration> = ({ f, d }) => {
  const trace = p(f, 0, 30);
  const fente = lin(f, d[0] + 170, d[0] + 210);
  const ecart = p(f, d[0] + 205, d[0] + 260);
  const noms = p(f, d[0] + 250, d[0] + 290);
  const ax = 400;
  const decal = 30 * ecart;
  const bancs = 1 - p(f, d[0] + 200, d[0] + 240);
  const moitie = (sens: number) => {
    const x = (dx: number) => ax + sens * dx;
    const contour = `M${x(0)} 26 Q${x(120)} 26 ${x(150)} 128 H${x(310)} V840 H${x(0)}`;
    return (
      <g transform={`translate(${sens * decal} 0)`}>
        <path d={`${contour} Z`} fill={F.papier} />
        <path d={contour} fill="none" stroke={F.encre} strokeWidth={6} strokeLinejoin="round" />
        <line x1={x(0)} x2={x(0)} y1={26} y2={26 + 814 * fente} stroke={F.encre} strokeWidth={6} opacity={fente > 0 ? 1 : 0} />
        <g opacity={bancs}>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={i} x1={x(64)} x2={x(274)} y1={272 + i * 58} y2={272 + i * 58} stroke={F.filet} strokeWidth={14} strokeLinecap="round" />
          ))}
          {[190, 480, 760].map((y) => (
            <circle key={y} cx={x(34)} cy={y} r={10} fill={F.filet} stroke={F.encre2} strokeWidth={2} />
          ))}
        </g>
      </g>
    );
  };
  const LAMPES = [
    [484, 290], [552, 290], [620, 290], [688, 290], [518, 396], [586, 396], [654, 396],
  ];
  const a0 = d[1] + 20;
  const pasLampe = (d[2] - 40 - a0) / 7;
  const ordre = p(f, d[3] - 10, d[3] + 130);
  const desordre = 1 - ordre;
  const secoue = lin(f, d[2], d[2] + 20) * desordre;
  const livre = p(f, d[0] + 270, d[0] + 320);
  const toutes = p(f, d[4], d[4] + 60);
  return (
    <Scene>
      <g opacity={trace}>
        {moitie(-1)}
        {moitie(1)}
      </g>
      {/* L'autel, au fond de l'abside, tant que le plan est entier. */}
      <path d="M400 62 V126 M376 86 H424" stroke={F.encre2} strokeWidth={8} strokeLinecap="round" opacity={bancs * trace} />
      <g opacity={noms}>
        <Libelle x={ax - 30 - 155} y={188} taille={27} graisse={600}>{LIBELLES.sacerdotal}</Libelle>
        <Libelle x={ax + 30 + 155} y={188} taille={27} graisse={600}>{LIBELLES.diaconal}</Libelle>
        <line x1={92} x2={338} y1={206} y2={206} stroke={F.or} strokeWidth={4} />
        <line x1={462} x2={708} y1={206} y2={206} stroke={F.or} strokeWidth={4} />
      </g>

      {/* Colonne de gauche : un livre ouvert, sous la lumière. */}
      <g opacity={livre}>
        {Array.from({ length: 9 }, (_, i) => {
          const a = ((-150 + i * 15) * Math.PI) / 180;
          const ra = 118 + 8 * Math.sin(f / 15 + i);
          return <line key={i} x1={215 + Math.cos(a) * 84} y1={540 + Math.sin(a) * 84} x2={215 + Math.cos(a) * ra} y2={540 + Math.sin(a) * ra} stroke={F.or} strokeWidth={6} strokeLinecap="round" />;
        })}
        <path d="M215 540 C180 514 130 514 96 528 V650 C130 636 180 636 215 662 C250 636 300 636 334 650 V528 C300 514 250 514 215 540 Z" fill={F.parchemin} stroke={F.encre} strokeWidth={4} strokeLinejoin="round" />
        <line x1={215} x2={215} y1={540} y2={662} stroke={F.encre} strokeWidth={4} />
        {[558, 582, 606].map((y) => (
          <g key={y}>
            <path d={`M118 ${y} Q160 ${y - 12} 196 ${y + 4}`} fill="none" stroke={F.encre2} strokeWidth={3.5} />
            <path d={`M234 ${y + 4} Q270 ${y - 12} 312 ${y}`} fill="none" stroke={F.encre2} strokeWidth={3.5} />
          </g>
        ))}
      </g>

      {/* Colonne de droite : sept lampes, un registre qui se met en ordre. */}
      <g opacity={p(f, d[1] - 40, d[1])}>
        <Lueur id="ch2-p14-lueur" x={585} y={350} r={150} opacite={toutes * (0.75 + 0.15 * Math.sin(f / 13))} />
        {LAMPES.map(([x, y], i) => {
          const a = a0 + i * pasLampe;
          return <Lampe key={x} x={x} y={y} allume={p(f, a, a + 18)} f={f} i={i} />;
        })}
        <rect x={468} y={456} width={234} height={344} rx={8} fill={F.cuir} stroke={F.encre} strokeWidth={4} />
        <rect x={482} y={466} width={208} height={324} fill={F.parchemin} stroke={F.encre} strokeWidth={3} />
        {Array.from({ length: 7 }, (_, i) => {
          const y = 500 + i * 42;
          const a = (((i * 37) % 7) - 3) * 4 * desordre + secoue * Math.sin(f / 7 + i) * 1.6;
          const dx = (((i * 53) % 5) - 2) * 9 * desordre;
          const l = mix(36 + ((i * 29) % 50), 90, ordre);
          const dy = (((i * 19) % 5) - 2) * 7 * desordre;
          const cx = 590 + dx;
          const coche = p(f, d[3] + 100 + i * 10, d[3] + 116 + i * 10);
          return (
            <g key={i}>
              <g transform={`rotate(${a} ${cx} ${y + dy})`}>
                <line x1={cx - l} x2={cx + l * 0.62} y1={y + dy} y2={y + dy} stroke={F.encre2} strokeWidth={7} strokeLinecap="round" />
              </g>
              <circle cx={665} cy={y} r={9} fill={F.or} stroke={F.orFonce} strokeWidth={2} opacity={coche} />
            </g>
          );
        })}
      </g>
    </Scene>
  );
};

/* ------------------------------------------------------------------ Fin ------------------------------------------------------------------ */

const IlluFinCh2: React.FC<PropsIllustration> = ({ f }) => {
  const niveau = 0.78 + 0.22 * p(f, 0, 70);
  const rayons = p(f, 30, 130);
  return (
    <Scene>
      <Rayons id="ch2-fin-rayon" x={400} haut={0} bas={880} n={13} ecart={58} t={rayons} f={f} force={1} />
      <Lueur id="ch2-fin-lueur" x={400} y={410} r={380 + 14 * Math.sin(f / 18)} opacite={0.55 * p(f, 40, 110)} />
      <Thermometre x={400} y={170} h={530} l={76} niveau={niveau} />
    </Scene>
  );
};

export const ILLUSTRATIONS: Record<string, React.FC<PropsIllustration>> = {
  ouverture: IlluOuvertureCh2,
  p2: IlluEmprise,
  p3: IlluCoffre,
  p4: IlluQuatrePages,
  p5: IlluRemplacement,
  p6: IlluPasNegation,
  p7: IlluCiterne,
  p8: IlluRegistreLoupe,
  p9: IlluCaisse,
  p10: IlluCoupes,
  p11: IlluDonnerDieu,
  p12: IlluBarnabas,
  p13: IlluDeuxSacs,
  p14: IlluDepartement,
  fin: IlluFinCh2,
};
